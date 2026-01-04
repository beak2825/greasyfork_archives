// ==UserScript==
// @name         SimpleCache
// @namespace    hoehleg.userscripts.private
// @version      0.1
// @description  A Map extended as a Cache. Optional KeyExtractor - Function, optional ValueTransformer - Functions, as well as an optional validityPeriod after which an entry is automatically going to be removed.
// @author       Gerrit Höhle
//
// @grant        none
//
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==

/* jshint esnext: true */
/* globals $, jQuery */
const SimpleCache = (() => {
    const cloneObject = (obj) => {
        if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) {
            return obj;
        }
        return jQuery.extend(true, {}, obj);
    };

    return class SimpleCache extends Map {
        constructor({ keyExtractor = k => k, setValueTransformer = v => cloneObject(v), getValueTransformer = v => cloneObject(v) } = {}) {
            super();
            Object.assign(this, { keyExtractor, setValueTransformer, getValueTransformer });
        }

        get(key) {
            const finalKey = this.keyExtractor(key);
            return this.getValueTransformer(super.get(finalKey));
        }

        set(key, value, validityPeriodMs = 0) {
            const finalKey = this.keyExtractor(key);
            super.set(finalKey, this.setValueTransformer(value));

            if (validityPeriodMs > 0) {
                setTimeout(() => this.delete(finalKey), validityPeriodMs);
            }
            return this;
        }

        has(key) {
            return super.has(this.keyExtractor(key));
        }

        delete(key) {
            return super.delete(this.keyExtractor(key));
        }
    };
})();
