import { Request, Response, Router } from "express";
import { pino } from "pino";
import { SessionData } from "express-session";

export class AppController {
  public router: Router = Router();
  private log: pino.Logger = pino();

  constructor() {
    this.initializeRouter();
  }

  private initializeRouter() {
    this.router.get("/login", function (req, res) {
      res.render("login");
    });

    // Handle login form submissions
    this.router.post("/processLogin", (req: any, res) => {
      // Process the form
      // save the username as the "user" in the session scope
      req.session.user = req.body.username;

      // Send to the homepage
      res.redirect("/");
    });

    // Enforce security
    this.router.use((req: any, res, next) => {
      // If the user is set in the session,
      // pass them on
      if (req.session.user) {
        next();

        // Otherwise, send them to the login page
      } else {
        res.render("login", {
          error: "You need to log in first",
        });
      }
    });

    // Serve the home page
    this.router.get("/", (req: any, res: Response) => {
      try {
        res.render("home", {
          user: req.session.user,
        });
      } catch (err) {
        this.log.error(err);
      }
    });
  }
}
