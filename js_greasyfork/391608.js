// ==UserScript==
// @name         PrivateProperty
// @namespace    hoehleg.userscripts.private
// @version      0.2
// @description  Weakly references a value to a specified object. May be used to create private fields.
// @author       Gerrit Höhle
// @grant        none
// ==/UserScript==

/* jshint esversion: 6 */
const PrivateProperty = (() => {
    let prototypeFunctions;

    class PrivateProperty {

        constructor(initialValue) {
            this._weakReferences = new WeakMap();
            this._initialValue = initialValue;
        }

        init(object, initialValueSpecific = this._initialValue) {
            const value = (typeof initialValueSpecific === "function") ? initialValueSpecific() : initialValueSpecific;
            this._weakReferences.delete(object);
            this._weakReferences.set(object, {
                initialValue: initialValueSpecific,
                value: value
            });
            return this;
        }

        has(object) {
            return this._weakReferences.has(object);
        }

        get(object) {
            const data = this._weakReferences.get(object);
            if (data) {
                return data.value;
            }
        }

        set(object, value) {
            const data = this._weakReferences.get(object) || {
                initialValue: this._initialValue
            };
            data.value = value;
            this._weakReferences.set(object, data);
        }

        getInitialValue(object) {
            const data = this._weakReferences.get(object);
            return data ? data.initialValue : this._initialValue;
        }

        getOrCompute(object, fnc) {
            let data = this._weakReferences.get(object);
            if (!data) {
                data = {
                    initialValue: this._initialValue,
                    value: fnc()
                };
                this._weakReferences.set(object, data);
            }
            return data.value;
        }

        for(object) {
            const bound = prototypeFunctions.map(([propName, fnc]) => ({ [propName]: fnc.bind(this, object) }));
            return Object.assign({}, ...bound);
        }
    }

    prototypeFunctions = Object.getOwnPropertyNames(PrivateProperty.prototype)
        .filter(propName => typeof PrivateProperty.prototype[propName] === "function")
        .filter(propName => propName !== "constructor")
        .filter(propName => propName !== "for")
        .map(propName => ([ [propName], PrivateProperty.prototype[propName] ]));

    return PrivateProperty;
})();