/**
 *  Prototype d'un routeur (Singleton)
 */
{
    /**
     *  Constructeur
     *
     *  @returns {Router} this Instance courante (permet l'utilisation de méthodes chaînées)
     *  @constructor
     *
     *  @author Exalea
     */
    var Router = function () {
        /**
         *  Liste des routes disponibles (de type Route)
         *
         *  @type {Route[]}
         *
         *  @author Exalea
         */
        this.routes = [];
        return this;
    };

    /**
     *  Ajout d'une route de type Route au routeur
     *
     *  @param {Route} route Route à ajouter
     *
     *  @author Exalea
     */
    Router.prototype.addRoute = function (route) {
        if (route instanceof Route) {
            this.routes.push(route);
        }
    };

    /**
     *  Ajout d'une route via une expression régulière et une méthode de callback
     *
     *  @param {string} regex Expression régulière de la future route créée
     *  @param {function} callback Méthode callback de la future route créée
     *
     *  @author Exalea
     */
    Router.prototype.add = function (regex, callback) {
        this.addRoute(new Route(regex, callback));
    };

    /**
     *  Application de l'ensemble des routes du routeur à une URL selon le principe 'first match, first applied'
     *
     *  @param {string} url L'URL à tester
     *
     *  @author Exalea
     */
    Router.prototype.apply = function (url) {
        loop: for (var key in this.routes) {
            var route = this.routes[key];
            if (route instanceof Route)
                if (route.apply(url)) break loop;
        }
    };

    /**
     *  Implémentation du pattern Singleton
     *
     *  @returns {Router}
     */
    Router.getInstance = function () {
        if (Router.instance == null)
            Router.instance = new Router();
        return Router.instance;
    };

    /**
     *  Sucre syntaxique : ajout d'un accès statique aux méthodes du Singleton
     */
    {
        Router.addRoute = function (route) {
            return Router.getInstance().addRoute(route);
        };

        Router.add = function (regex, callback) {
            return Router.getInstance().add(regex, callback);
        };

        Router.apply = function (url) {
            return Router.getInstance().apply(url);
        };
    }
}