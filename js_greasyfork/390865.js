class myStorage {
    
    constructor(version = 1, prefix = "") {
        this.version = version;
        this.prefix = prefix;
    }
    // Greasemonkey storage API
    read(key, defaultValue) {
        const raw = GM_getValue(this._prefix(key), defaultValue);
        // let str = (this.compress) ? LZString.decompressFromUTF16(raw) : raw;
        return this._parse(raw);
    }
    write(key, value) {
        const raw = this._stringify(value);
        // let str = (this.compress) ? LZString.compressToUTF16(raw) : raw;
        return GM_setValue(this._prefix(key), raw);
    }
    delete(key) {
        return GM_deleteValue(this._prefix(key));
    }

    readKeys() {
        return GM_listValues();
    }
    // browser localstorage
    // read(key, defaultValue) {
    //     const raw = localStorage.getItem(this._prefix(key), defaultValue);
    //     const val = raw || defaultValue;
    //     // const str = (this.compress) ? LZString.decompressFromUTF16(val) : val;
    //     // return this._parse(str);
    //     return this._parse(val);
    // }
    // write(key, value) {
    //     const raw = this._stringify(value);
    //     // let str = (this.compress) ? LZString.compressToUTF16(raw) : raw;
    //     localStorage.setItem(this._prefix(key), raw);
    //     return;
    // }
    // delete(key) {
    //     return localStorage.removeItem(this._prefix(key));
    // }
    // readKeys() {
    //     let keys = [];
    //     for(let i=0, l=localStorage.length; i < l; i++){
    //        keys.push( localStorage.getItem(localStorage.key(i)) );
    //     }
    //     return keys;
    // }

    // “Set” means “add if absent, replace if present.”
    set(key, value) {
        let savedVal = this.read(key);

        if (typeof savedVal === 'undefined' || !savedVal) {
            // add if absent
            return this.add(key, value);
        } else {
            // replace if present
            this.write(key, value);
            return true;
        }
    }

    // “Add” means “add if absent, do nothing if present” (if a uniquing collection).
    add(key, value) {
        let savedVal = this.read(key, false);

        if (typeof savedVal === 'undefined' || !savedVal) {
            this.write(key, value);
            return true;
        } else {
            if (this._isArray(savedVal)) { // is array
                let index = savedVal.indexOf(value);

                if (index !== -1) {
                    // do nothing if present
                    return false;
                } else {
                    // add if absent
                    savedVal.push(value);
                    this.write(key, savedVal);
                    return true;
                }
            } else if (this._isObject(savedVal)) { // is object
                // merge obj value on obj
                let result, objToMerge = value;

                result = Object.assign(savedVal, objToMerge);
                this.write(key, result);
                return false;
            }
            return false;
        }
    }

    // “Replace” means “replace if present, do nothing if absent.”
    replace(key, itemFind, itemReplacement) {
        let savedVal = this.read(key, false);

        if (typeof savedVal === 'undefined' || !savedVal) {
            // do nothing if absent
            return false;
        } else {
            if (this._isArray(savedVal)) { // is Array
                let index = savedVal.indexOf(itemFind);

                if (index !== -1) {
                    // replace if present
                    savedVal[index] = itemReplacement;
                    this.write(key, savedVal);
                    return true;
                } else {
                    // do nothing if absent
                    return false;
                }
            } else if (this._isObject(savedVal)) {
                // is Object
                // replace property's value
                savedVal[itemFind] = itemReplacement;
                this.write(key, savedVal);
                return true;
            }
            return false;
        }
    }

    // “Remove” means “remove if present, do nothing if absent.”
    remove(key, value) {
        if (typeof value === 'undefined') { // remove key
            this.delete(key);
            return true;
        } else { // value present
            let savedVal = this.read(key);

            if (typeof savedVal === 'undefined' || !savedVal) {
                return true;
            } else {
                if (this._isArray(savedVal)) { // is Array
                    let index = savedVal.indexOf(value);

                    if (index !== -1) {
                        // remove if present
                        savedVal.splice(index, 1);
                        this.write(key, savedVal);
                        return true;
                    } else {
                        // do nothing if absent
                        return false;
                    }
                } else if (this._isObject(savedVal)) { // is Object
                    let property = value;

                    delete savedVal[property];
                    this.write(key, savedVal);
                    return true;
                }
                return false;
            }
        }
    }

    get(key, defaultValue) {
        return this.read(key, defaultValue);
    }

    getAll() {
        const keys = this._listKeys();
        let obj = {};

        for (let i = 0, len = keys.length; i < len; i++) {
            obj[keys[i]] = this.read(keys[i]);
        }
        return obj;
    }

    getKeys() {
        return this._listKeys();
    }

    getPrefix() {
        return this.prefix;
    }

    empty() {
        const keys = this._listKeys();

        for (let i = 0, len = keys.lenght; i < len; i++) {
            this.delete(keys[i]);
        }
    }

    has(key) {
        return this.get(key) !== null;
    }

    forEach(callbackFunc) {
        const allContent = this.getAll();

        for (let prop in allContent) {
            callbackFunc(prop, allContent[prop]);
        }
    }

    _parse(value) {
        if (this._isJson(value)) {
            return JSON.parse(value);
        }
        return value;
    }

    _stringify(value) {
        if (this._isJson(value)) {
            return value;
        }
        return JSON.stringify(value);
    }

    _listKeys(usePrefix = false) {
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
    }

    _prefix(key) {
        return this.prefix + key;
    }

    _unprefix(key) {
        return key.substring(this.prefix.length);
    }

    _isJson(item) {
        try {
            JSON.parse(item);
        } catch (e) {
            return false;
        }
        return true;
    }

    _isObject(a) {
        return (!!a) && (a.constructor === Object);
    }

    _isArray(a) {
        return (!!a) && (a.constructor === Array);
    }
}