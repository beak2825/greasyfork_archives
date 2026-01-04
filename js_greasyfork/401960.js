// ==UserScript==
// @name         sessionStorage and localStorage polyfill
// @namespace    https://rinsuki.net/
// @version      0.1
// @description  for cookie disabled users.
// @author       rinsuki
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/401960/sessionStorage%20and%20localStorage%20polyfill.user.js
// @updateURL https://update.greasyfork.org/scripts/401960/sessionStorage%20and%20localStorage%20polyfill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    class PolyfillStorage {
        setItem(key, value) {
            this[key] = value
        }
        getItem(key) {
            if (!(key in this)) this[key] = null
            return this[key]
        }
        removeItem(key) {
            delete this[key]
        }
    }
    var sessionStorageStore = {}

    Object.defineProperty(window, "sessionStorage", {value: new PolyfillStorage()})
    Object.defineProperty(window, "localStorage", {value: new PolyfillStorage()})
})();