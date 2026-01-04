// ==UserScript==
// @name         proxy-storage
// @description  Proxy wrapper around GM storage API, with support for nested object by proxy.
// @version      0.0.1
// @namespace    owowed.moe
// @author       owowed <island@owowed.moe>
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license      LGPL-3.0
// ==/UserScript==

function createGmProxyStorage({
    get = GM_getValue,
    set = GM_setValue,
    deleteValue = GM_deleteValue,
    list = GM_listValues
} = {}) {
    const storage = { get, set, deleteValue, list };
    return new Proxy({}, {
        get(target, prop, receiver) {
            const value = storage.get(prop);
            if (isObjectOrArray(value)) {
                return makeNestedTargetProxy(value, prop, storage.set);
            }
            else {
                return value;
            }
        },
        set(target, prop, newValue, receiver) {
            storage.set(prop, newValue);
            return true;
        },
        deleteProperty(target, prop) {
            storage.deleteValue(prop);
            return true;
        },
        ownKeys(target) {
            return storage.list();
        },
        has(target, prop) {
            return this.ownKeys(target).includes(prop);
        },
        getOwnPropertyDescriptor(target, prop) {
            if (this.has(target, prop)) {
                return {
                    enumerable: true,
                    configurable: true,
                    writable: false,
                    value: this.get(target, prop)
                };
            }
        },
    });
}

function isObjectOrArray(value) {
    return Array.isArray(value) || (typeof value == "object" && value != null);
}

function makeNestedTargetProxy(rootTarget, rootTargetProp, setter) {
    const set = (target, prop, value) => {
        target[prop] = value;

        setter(rootTargetProp, rootTarget); /* `rootTarget` reference will always get updated */

        return value;
    };

    const get = (target, prop) => {
        const value = target[prop];

        if (isObjectOrArray(value)) {
            return new Proxy(value, { get, set });
        }

        return value;
    };

    return new Proxy(rootTarget, { get, set });
}