/**
 *  Prototype d'une SettingsStore (Singleton)
 */
{
    /**
     *  Constructeur
     *
     *  @returns {SettingsStore} this Instance courante (permet l'utilisation de méthodes chaînées)
     *  @constructor
     *
     *  @author Exalea
     */
    var SettingsStore = function () {
        /**
         *  Liste des paramètres disponibles (de type SettingEntry)
         *
         *  @returns {SettingsStore} this Instance courante (permet l'utilisation de méthodes chaînées)
         *
         *  @author Exalea
         */
        this.entries = {};
        return this;
    };

    /**
     *  Ajout d'un paramètre de type SettingEntry au store
     *
     *  @param {string} name Nom attribué au paramètre
     *  @param {SettingEntry} entry Paramètre à ajouter
     *  @returns {SettingsStore} this Instance courante (permet l'utilisation de méthodes chaînées)
     *
     *  @author Exalea
     */
    SettingsStore.prototype.addEntry = function (name, entry) {
        this.entries[name] = entry;
        return this;
    };

    /**
     *
     *  Ajout d'un paramètre via un nom, une clef (identifiant unique) de persistence et une valeur par défaut
     *
     *  @param {string} name Nom attribué au paramètre
     *  @param {string} key Clef de persistence du paramètre
     *  @param {string} defaultValue Valeur par défaut du paramètre
     *  @returns {SettingsStore} this Instance courante (permet l'utilisation de méthodes chaînées)
     *
     *  @author Exalea
     */
    SettingsStore.prototype.add = function (name, key, defaultValue) {
        this.addEntry(name, new SettingEntry(key, defaultValue));
        return this;
    };

    /**
     *  Initialisation (à leur valeur persistée si existante, sinon à leur valeur par défaut) de chacun des paramètres ajoutés au SettingsStore
     *
     *  @returns {SettingsStore} this Instance courante (permet l'utilisation de méthodes chaînées)
     *
     *  @author Exalea
     */
    SettingsStore.prototype.init = function () {
        for (var index in this.entries) {
            var entry = this.entries[index];
            if (entry instanceof SettingEntry)
                entry.init();
        }
        return this;
    };

    /**
     *  Implémentation du pattern Singleton
     *
     *  @returns {SettingsStore}
     */
    SettingsStore.getInstance = function () {
        if (SettingsStore.instance == null)
            SettingsStore.instance = new SettingsStore();
        return SettingsStore.instance;
    };

    /**
     *  Sucre syntaxique : ajout d'un accès statique aux méthodes du Singleton
     */
    {
        SettingsStore.addEntry = function (name, entry) {
            return SettingsStore.getInstance().addEntry(name, entry);
        };

        SettingsStore.add = function (name, key, defaultValue) {
            return SettingsStore.getInstance().add(name, key, defaultValue);
        };

        SettingsStore.init = function () {
            return SettingsStore.getInstance().init();
        };
    }
}