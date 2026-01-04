// ==UserScript==
// @name         Polyfill Lite for old browser
// @namespace    github.com/hmjz100
// @version      1.0.0
// @description  add Array.at and Object.hasOwn.
// @author       hmjz100
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525961/Polyfill%20Lite%20for%20old%20browser.user.js
// @updateURL https://update.greasyfork.org/scripts/525961/Polyfill%20Lite%20for%20old%20browser.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!window.Array.prototype.at) {
        window.Array.prototype.at = function(index) {
            const len = this.length;
            index = index >= 0 ? index : len + index;
            if (index < 0 || index >= len) {
                return undefined;
            }
            return this[index];
        };
    }
    if (!window.Object.hasOwn) {
        window.Object.defineProperty(Object, 'hasOwn', {
            value: function(object, key) {
                return Object.prototype.hasOwnProperty.call(object, key);
            },
            configurable: true,
            enumerable: false,
            writable: true
        });
    }
})();