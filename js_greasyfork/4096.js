/**
 *  Prototype d'une route générique
 *
 *  @author Exalea
 */
{
    /**
     *  Constructeur
     *
     *  @param {string} regex Expression régulière permettant de déterminer si le callback doit s'appliquer à la page/URL courante
     *  @param {function} callback Méthode de callback contenant les modifications à effectuer
     *  @returns {Route} this Instance courante (permet l'utilisation de méthodes chaînées)
     *  @constructor
     *
     *  @author Exalea
     */
    var Route = function(regex, callback) {
        this.regex = regex;
        this.callback = callback;
        return this;
    };

    /**
     *  Méthode d'application/test d'une route à une URL donnée
     *
     *  @param {string} url URL à tester
     *  @returns {boolean} true si l'URL passée en paramètre correspond à cette route, false sinon
     *
     *  @author Exalea
     */
    Route.prototype.apply = function(url) {
        if(new RegExp(this.regex).test(url)) {
            this.callback();
            return true;
        }
        return false;
    };
}