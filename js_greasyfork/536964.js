// ==UserScript==
// @name         Hook_eval
// @namespace    http://tampermonkey.net/
// @version      2024-12-05
// @description  Bypass eval --> debugger
// @author       0xsdeo
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536964/Hook_eval.user.js
// @updateURL https://update.greasyfork.org/scripts/536964/Hook_eval.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var temp_eval = eval;
    var temp_toString = Function.prototype.toString;

    Function.prototype.toString = function () {
        if (this === eval) {
            return 'function eval() { [native code] }';
        }
        else if (this === Function.prototype.toString) {
            return 'function toString() { [native code] }';
        }
        return temp_toString.apply(this, arguments);
    }

    window.eval = function () {
        if (typeof arguments[0] == "string") {
            var temp_length = arguments[0].match(/debugger/g);
            if (temp_length != null) {
                temp_length = temp_length.length;
                var reg = /debugger/;
                while (temp_length) {
                    arguments[0] = arguments[0].replace(reg, "");
                    temp_length--;
                }
            }
        }
        return temp_eval(...arguments);
    }
})();