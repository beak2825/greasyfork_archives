/**
 *  Prototype d'un paramètre générique
 *
 *  @author Exalea
 */
{
    /**
     *  Constructeur
     *
     *  @param {string} key Clef du cookie associé
     *  @param {string} defaultValue Valeur par défaut en cas d'absence de valeur enregistrée
     *  @returns {SettingEntry} this Instance courante (permet l'utilisation de méthodes chaînées)
     *  @constructor
     *
     *  @author Exalea
     */
    var SettingEntry = function(key, defaultValue) {
        this.key = key;
        this.defaultValue = defaultValue;
        return this;
    };

    /**
     *  Assignation et persistance (durée de 100 ans par défaut) de la valeur du paramètre
     *
     *  @param {string} value Valeur assignée et persistée
     *  @returns {SettingEntry} this Instance courante (permet l'utilisation de méthodes chaînées)
     *
     *  @author Exalea
     */
    SettingEntry.prototype.setValue = function (value) {
        $.cookie(this.key, value, { expires : (100 * 365) });
        return this;
    };

    /**
     *  Obtention de la valeur du paramètre
     *
     *  @returns {string} Valeur du paramètre (chaîne de caractères)
     *
     *  @author Exalea
     */
    SettingEntry.prototype.getValue = function() {
        return $.cookie(this.key);
    }

    /**
     *  Initialisation (assignation d'une valeur par défaut si nécessaire)
     *
     *  @returns {SettingEntry} this Instance courante (permet l'utilisation de méthodes chaînées)
     *
     *  @author Exalea
     */
    SettingEntry.prototype.init = function() {
        if(this.getValue() == null)
            this.setValue(this.defaultValue);
        return this;
    }
}
