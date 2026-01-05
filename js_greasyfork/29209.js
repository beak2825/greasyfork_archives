// ==UserScript==
// @name         Erya nopause (For Zhongyuan Univ. of Techonogy)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove erya pause limitation
// @author       Mariotaku Lee
// @match        http://mooc1.zut.edu.cn/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/29209/Erya%20nopause%20%28For%20Zhongyuan%20Univ%20of%20Techonogy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/29209/Erya%20nopause%20%28For%20Zhongyuan%20Univ%20of%20Techonogy%29.meta.js
// ==/UserScript==

/*
 * object.watch polyfill
 *
 * 2012-04-03
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

// object.watch
if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, "watch", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function(prop, handler) {
            var oldval = this[prop],
                newval = oldval,
                getter = function() {
                    return newval;
                },
                setter = function(val) {
                    oldval = newval;
                    return newval = handler.call(this, prop, oldval, val);
                };

            if (delete this[prop]) { // can't watch constants
                Object.defineProperty(this, prop, {
                    get: getter,
                    set: setter,
                    enumerable: true,
                    configurable: true
                });
            }
        }
    });
}

// object.unwatch
if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, "unwatch", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function(prop) {
            var val = this[prop];
            delete this[prop]; // remove accessors
            this[prop] = val;
        }
    });
}

(function() {
    'use strict';

    // Your code here...
    window.watch('onblur', function() {
        // Remove onblur function
        window.onblur = null;
        document.hasFocus = function() {
            return true;
        };
    });
})();