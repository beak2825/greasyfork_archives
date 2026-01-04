// ==UserScript==
// @name        greasetools
// @description Functions and other tools for GreaseMonkey UserScript development.
// @version     0.5.0
// @author      Adam Thompson-Sharpe
// @license     MIT OR Apache-2.0
// @homepageURL https://gitlab.com/MysteryBlokHed/greasetools#greasetools
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/banner.js":
/*!***********************!*\
  !*** ./lib/banner.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.genBanner = void 0;
/**
 * Generate a UserScript metadata comment from an object.
 * Falsey values will be excluded from the banner, so checking if a value is undefined
 * before passing is not necessary.
 *
 * @param metaValues Properties to add to metadata
 * @param spacing The amount of spaces between the `@` and the value, including the prop name.
 * Should be at least 1 greater than the longest prop name
 * @param start What to put at the start of the banner. Defaults to `'// ==UserScript=='`
 * @param end What to put at the end of the banner. Defaults to `'// ==/UserScript=='`
 * @returns A block of comments to be put at the top of a UserScript
 * including all of the properties passed
 */
function genBanner(metaValues, spacing = 12, start = '// ==UserScript==', end = '// ==/UserScript==') {
    let final = `${start}\n`;
    const format = (prop, value) => `// @${prop}${' '.repeat(spacing - prop.length)}${value}\n`;
    for (const [key, value] of Object.entries(metaValues)) {
        if (!value)
            continue;
        if (typeof value === 'string') {
            final += format(key, value);
        }
        else {
            for (const val of value) {
                if (!val)
                    continue;
                final += format(key, val);
            }
        }
    }
    final += `${end}\n`;
    return final;
}
exports.genBanner = genBanner;


/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkGrants = void 0;
__exportStar(__webpack_require__(/*! ./banner */ "./lib/banner.js"), exports);
__exportStar(__webpack_require__(/*! ./xhr */ "./lib/xhr.js"), exports);
__exportStar(__webpack_require__(/*! ./values */ "./lib/values.js"), exports);
/** Used by functions to check if grants are present */
function checkGrants(...grants) {
    if (!GM)
        return false;
    if (grants.some(grant => !(grant in GM)))
        return false;
    return true;
}
exports.checkGrants = checkGrants;


/***/ }),

/***/ "./lib/values.js":
/*!***********************!*\
  !*** ./lib/values.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteValue = exports.valuesGetProxy = exports.valuesProxy = exports.getAllValues = exports.getValues = void 0;
const _1 = __webpack_require__(/*! . */ "./lib/index.js");
/** Ensure that the values passed are all strings for use with `localStorage` */
function ensureString(values) {
    for (const value of Object.values(values)) {
        if (typeof value !== 'string')
            throw TypeError('Only strings are supported for values when localStorage is being used');
    }
}
const prefixKey = (key, prefix) => prefix ? `${prefix}.${key}` : key;
/**
 * Requires the `GM.getValue` grant or falls back to using localStorage.
 * Retrieves values from GreaseMonkey based on the generic type provided
 *
 * @param defaults The default values if they are undefined.
 * Each option will be set to a key from this if it does not exist
 * @param id An optional unique identifier for the config. Prefixes all keys with the ID
 * (eg. `foo` -> `myconfig.foo` for id `myconfig`). This **won't** change the names of the keys
 * on the returned object
 * @param setDefaults Whether or not to store the default value from the defaults argument
 * with `GM.setValue` if it doesn't exist. Requires the `GM.setValue` grant
 * @returns A Promise that resolves to an object with all of the values
 *
 * @example
 * ```typescript
 * const values = await getValues({
 *     somethingEnabled: false,
 *     someNumber: 42,
 * })
 *
 * console.log(values.somethingEnabled)
 * console.log(values.someNumber)
 *
 * values.someNumber++ // Does NOT modify GM stored value.
 *                     // Pass the return of this function to valuesProxy for that functionality
 * ```
 */
function getValues(defaults, id, setDefaults = false) {
    return new Promise((resolve, reject) => {
        const values = defaults;
        const grants = setDefaults
            ? (0, _1.checkGrants)('getValue')
            : (0, _1.checkGrants)('getValue', 'setValue');
        if (!grants)
            ensureString(Object.values(values));
        if (grants) {
            /**
             * Returns a promise with the value returned from GM.getValue.
             * If no value exists, sets the value to the provided default
             * and returns that
             *
             * @returns A Promise with the original key and the retrieved value
             */
            const getWithDefault = (key, defaultValue, id) => {
                return new Promise(async (resolve) => {
                    const prefix = prefixKey(key, id);
                    const value = await GM.getValue(prefix);
                    // Resolve with the value if found
                    if (value)
                        return resolve([key, value]);
                    // Set the value if setDefaults argument is passed
                    if (setDefaults)
                        await GM.setValue(key, defaultValue);
                    // Resolve with the default value
                    return resolve([key, defaultValue]);
                });
            };
            const promises = [];
            for (const [key, value] of Object.entries(defaults)) {
                promises.push(getWithDefault(key, value, id));
            }
            Promise.all(promises)
                .then(retrievedValues => {
                const returnedValues = {};
                for (const [key, value] of retrievedValues) {
                    returnedValues[key] = value;
                }
                resolve(returnedValues);
            })
                .catch(reason => reject(reason));
        }
        else {
            const returnedValues = {};
            for (const [key, defaultValue] of Object.entries(defaults)) {
                const value = localStorage.getItem(key);
                if (value === null && setDefaults)
                    localStorage.setItem(key, defaultValue);
                returnedValues[key] = value !== null && value !== void 0 ? value : defaultValue;
            }
            resolve(returnedValues);
        }
    });
}
exports.getValues = getValues;
/**
 * Requires the `GM.getValue` and `GM.listValues` grants or falls back to using localStorage.
 * Returns a values object containing every saved value for the UserScript
 *
 * @returns A Promise that resolves to the defined values or rejects with nothing.
 * @example
 * ```typescript
 * // Logs all key/value pairs from GreaseMonkey
 * const allValues = await getAllValues()
 * for (const [key, value] of Object.entries(allValues)) {
 *   console.log(key, value)
 * }
 * ```
 */
async function getAllValues() {
    const valueNames = await (async () => {
        // Using localStorage
        if (!(0, _1.checkGrants)('getValue', 'listValues'))
            return Object.keys(localStorage);
        // Using GreaseMonkey
        return GM.listValues();
    })();
    const defaults = (() => {
        const emptyDefault = {};
        for (const value of valueNames)
            emptyDefault[value] = '';
        return emptyDefault;
    })();
    return getValues(defaults);
}
exports.getAllValues = getAllValues;
/**
 * Requires the `GM.setValue` grant or falls back to using localStorage.
 * Get a Proxy that automatically updates values.
 * There should generally only be one Proxy per option (eg. one proxy that controls `option1` and `option2`
 * and a different one that controls `option3` and `option4`).
 * This is because the returned Proxy doesn't update the value on get, only on set.
 * If multiple Proxies on the same values are being used to set, then a get Proxy
 * (`valuesGetProxy`) to get values might be a good idea
 *
 * @param values A values object, such as the one from `getValues`
 * @param id An optional unique identifier for the config. Prefixes all keys with the ID
 * (eg. `foo` -> `myconfig.foo` for id `myconfig`). This **won't** change the names of the keys
 * on the returned object
 * @param callback Called with the Promise returned by `GM.setValue`
 * @returns A Proxy from `values` that updates the GM value on set
 * @example
 * ```typescript
 * const values = valuesProxy(
 *   await getValues({
 *     message: 'Hello, World!',
 *   })
 * )
 *
 * values.message = 'Hello!' // Runs GM.setValue('message', 'Hello!')
 * console.log(values.message) // Logs 'Hello!'. Does NOT run GM.getValue
 * ```
 */
function valuesProxy(values, id, callback) {
    const grants = (0, _1.checkGrants)('setValue');
    /** Handle sets to the values object */
    const handler = {
        set(target, prop, value) {
            const prefix = prefixKey(prop, id);
            if (prop in target) {
                // Using GreaseMonkey
                if (grants) {
                    const gmSetPromise = GM.setValue(prefix, value);
                    if (callback)
                        callback(gmSetPromise);
                    // Using localStorage
                }
                else {
                    ensureString([value]);
                    localStorage.setItem(prefix, value);
                }
                return Reflect.set(target, prop, value);
            }
            return false;
        },
    };
    return new Proxy(values, handler);
}
exports.valuesProxy = valuesProxy;
/**
 * Requires the `GM.getValue` grant or falls back to using localStorage.
 * Get a Proxy that wraps `GM.getValue` for better typing.
 * Useful when a value may be modified by multiple different sources,
 * meaning the value will need to be retrieved from GM every time.
 * This should not be used if values are only being modified by one source
 *
 * @param id An optional unique identifier for the config. Prefixes all keys with the ID
 * (eg. `foo` -> `myconfig.foo` for id `myconfig`). This **won't** change the names of the keys
 * on the returned object
 * @param values A values object, such as the one returned from `getValues`
 * @returns A Proxy using the keys of `values` that wraps `GM.getValue`
 * @example
 * ```typescript
 * const values = valuesProxy(
 *   await getValues({
 *     message: 'Hello, World!',
 *   })
 * )
 *
 * const valuesGet = valuesGetProxy(values)
 *
 * console.log(await valuesGet.message) // Logs the result of GM.getValue('message')
 * ```
 */
function valuesGetProxy(values, id) {
    const grants = (0, _1.checkGrants)('getValue');
    /** Handle gets to the values object */
    const handler = {
        get(target, prop) {
            return new Promise((resolve, reject) => {
                const prefix = prefixKey(prop, id);
                // Check if the property is a part of the passed values
                if (prop in target) {
                    // Using GreaseMonkey
                    if (grants) {
                        GM.getValue(prefix).then(value => {
                            // Resolve with the value if it's defined
                            if (value !== undefined)
                                resolve(value);
                            else
                                reject();
                        });
                        // Using localStorage
                    }
                    else {
                        const value = localStorage.getItem(prefix);
                        if (value !== null)
                            resolve(value);
                        else
                            reject();
                    }
                }
                else {
                    reject();
                }
            });
        },
        /** Proxy isn't meant for setting, so do nothing */
        set() {
            return false;
        },
    };
    return new Proxy(values, handler);
}
exports.valuesGetProxy = valuesGetProxy;
/**
 * Requires the `GM.deleteValue` grant or falls back to localStorage.
 * Deletes a value from a values object.
 * This is only useful if you're using TypeScript or your editor has typing support.
 * If that doesn't describe your use case, then use `GM.deleteValue` instead
 *
 * @param values A values object, such as the one returned from `getValues`
 * @param toDelete The value to delete
 * @param id An optional unique identifier for the config. Prefixes all keys with the ID
 * (eg. `foo` -> `myconfig.foo` for id `myconfig`). This **won't** change the names of the keys
 * on the returned object
 * @returns A Promise that resolves with a new object without the deleted type,
 * or rejects with nothing if the deletion failed
 */
function deleteValue(values, toDelete, id) {
    return new Promise(async (resolve, reject) => {
        const prefix = prefixKey(toDelete, id);
        if (toDelete in values) {
            // Using GreaseMonkey
            if ((0, _1.checkGrants)('deleteValue'))
                await GM.deleteValue(prefix);
            // Using localStorage
            else
                localStorage.removeItem(prefix);
            delete values[toDelete];
            resolve(values);
        }
        reject();
    });
}
exports.deleteValue = deleteValue;


/***/ }),

/***/ "./lib/xhr.js":
/*!********************!*\
  !*** ./lib/xhr.js ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.xhrPromise = void 0;
const _1 = __webpack_require__(/*! . */ "./lib/index.js");
/**
 * Make a request with GM.xmlHttpRequest using Promises.
 * Requires the GM.xmlHttpRequest grant
 *
 * @param xhrInfo The XHR info
 * @returns A Promise that resolves with the Greasemonkey Response object
 * @see {@link https://wiki.greasespot.net/GM.xmlHttpRequest}
 *
 * @example
 * ```typescript
 * // Make a GET request to https://example.com
 * const example = await xhrPromise({
 *   method: 'GET',
 *   url: 'https://example.com',
 * })
 * ```
 */
function xhrPromise(xhrInfo) {
    return new Promise((resolve, reject) => {
        let lastState = XMLHttpRequest.UNSENT;
        if ((0, _1.checkGrants)('xmlHttpRequest')) {
            GM.xmlHttpRequest(Object.assign(Object.assign({}, xhrInfo), { onreadystatechange: response => {
                    if (response.readyState === XMLHttpRequest.DONE) {
                        if (lastState < 3)
                            reject(new Error('XHR failed'));
                        else
                            resolve(response);
                    }
                    lastState = response.readyState;
                } }));
        }
        else
            reject(new Error('Missing grant GM.xmlHttpRequest'));
    });
}
exports.xhrPromise = xhrPromise;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./lib/index.js");
/******/ 	window.GreaseTools = __webpack_exports__;
/******/ 	
/******/ })()
;
