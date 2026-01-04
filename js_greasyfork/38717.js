/*jshint esversion: 6 */
// ==UserScript==
// @name           GM storage wrapper
// @version        1.0
// @description    simple wrapper for GM_storage with added functions
// ==/UserScript==

    var gmStorageWrapper = {
        options : {
            prefix : ''
        },
        // “Set” means “add if absent, replace if present.”
        set : function(key, value) {
            let storageVals = this.read(key);

            if (typeof storageVals === 'undefined' || !storageVals) {
                // add if absent
                return this.add(key, value);
            } else {
                // replace if present
                this.write(key, value);
                return true;
            }
        },
        // “Add” means “add if absent, do nothing if present” (if a uniquing collection).
        add : function(key, value) {
            let storageVals = this.read(key, false);

            if (typeof storageVals === 'undefined' || !storageVals) {
                this.write(key, value);
                return true;
            } else {
                if (this._isArray(storageVals)) { // is array
                    let index = storageVals.indexOf(value);

                    if (index !== -1) {
                        // do nothing if present
                        return false;
                    } else {
                        // add if absent
                        storageVals.push(value);
                        this.write(key, storageVals);
                        return true;
                    }
                } else if (this._isObject(storageVals)) { // is object
                    // merge obj value on obj
                    let result,
                        objToMerge = value;

                    result = Object.assign(storageVals, objToMerge);
                    this.write(key, result);
                    return false;
                }
                return false;
            }
        },
        // “Replace” means “replace if present, do nothing if absent.”
        replace : function(key, itemFind, itemReplacement) {
            let storageVals = this.read(key, false);

            if (typeof storageVals === 'undefined' || !storageVals) {
                // do nothing if absent
                return false;
            } else {
                if (this._isArray(storageVals)) { // is Array
                    let index = storageVals.indexOf(itemFind);

                    if (index !== -1) {
                        // replace if present
                        storageVals[index] = itemReplacement;
                        this.write(key, storageVals);
                        return true;
                    } else {
                        // do nothing if absent
                        return false;
                    }
                } else if (this._isObject(storageVals)) {
                    // is Object
                    // replace property's value
                    storageVals[itemFind] = itemReplacement;
                    this.write(key, storageVals);
                    return true;
                }
                return false;
            }
        },
        // “Remove” means “remove if present, do nothing if absent.”
        remove : function(key, value) {
            if (typeof value === 'undefined') { // remove key
                this.delete(key);
                return true;
            } else { // value present
                let storageVals = this.read(key);

                if (typeof storageVals === 'undefined' || !storageVals) {
                    return true;
                } else {
                    if (this._isArray(storageVals)) { // is Array
                        let index = storageVals.indexOf(value);

                        if (index !== -1) {
                            // remove if present
                            storageVals.splice(index, 1);
                            this.write(key, storageVals);
                            return true;
                        } else {
                            // do nothing if absent
                            return false;
                        }
                    } else if (this._isObject(storageVals)) { // is Object
                        let property = value;

                        delete storageVals[property];
                        this.write(key, storageVals);
                        return true;
                    }
                    return false;
                }
            }
        },
        get : function(key, defaultValue) {
            return this.read(key, defaultValue);
        },

        // GM storage API
        read : function(key, defaultValue) {
            return this.unserialize(GM_getValue(this._prefix(key), defaultValue));
        },
        write : function(key, value) {
            return GM_setValue(this._prefix(key), this.serialize(value));
        },
        delete : function(key) {
            return GM_deleteValue(this._prefix(key));
        },
        readKeys : function() {
            return GM_listValues();
        },
        // /GM Storage API

        getAll : function() {
            const keys = this._listKeys();
            let obj    = {};

            for (let i = 0, len = keys.length; i < len; i++) {
                obj[keys[i]] = this.read(keys[i]);
            }
            return obj;
        },
        getKeys : function() {
            return this._listKeys();
        },
        getPrefix : function() {
            return this.options.prefix;
        },

        empty : function() {
            const keys = this._listKeys();

            for (let i = 0, len = keys.lenght; i < len; i++) {
                this.delete(keys[i]);
            }
        },
        has : function(key) {
            return this.get(key) !== null;
        },
        forEach : function(callbackFunc) {
            const allContent = this.getAll();

            for (let prop in allContent) {
                callbackFunc(prop, allContent[prop]);
            }
        },
        unserialize : function(value) {
            if (this._isJson(value)) {
                return JSON.parse(value);
            }
            return value;
        },
        serialize : function(value) {
            if (this._isJson(value)) {
                return JSON.stringify(value);
            }
            return value;
        },
        _listKeys : function(usePrefix = false) {
            const prefixed = this.readKeys();
            let unprefixed = [];

            if (usePrefix) {
                return prefixed;
            } else {
                for (let i = 0, len = prefixed.length; i < len; i++) {
                    unprefixed[i] = this._unprefix(prefixed[i]);
                }
                return unprefixed;
            }
        },
        _prefix : function(key) {
            return this.options.prefix + key;
        },
        _unprefix : function(key) {
            return key.substring(this.options.prefix.length);
        },
        _isJson : function(item) {
            try {
                JSON.parse(item);
            } catch (e) {
                return false;
            }
            return true;
        },
        _isObject : function(a) {
            return (!!a) && (a.constructor === Object);
        },
        _isArray : function(a) {
            return (!!a) && (a.constructor === Array);
        }
    };