// ==UserScript==
// @name         Bypass_Debugger
// @namespace    https://github.com/0xsdeo/Bypass_Debugger
// @version      2024-12-31
// @description  Bypass无限debugger
// @author       0xsdeo
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528268/Bypass_Debugger.user.js
// @updateURL https://update.greasyfork.org/scripts/528268/Bypass_Debugger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let temp_eval = eval;
    let temp_toString = Function.prototype.toString;

    Function.prototype.toString = function () {
        if (this === eval) {
            return 'function eval() { [native code] }';
        } else if (this === Function) {
            return 'function Function() { [native code] }';
        } else if (this === Function.prototype.toString) {
            return 'function toString() { [native code] }';
        } else if (this === Function.prototype.constructor) {
            return 'function Function() { [native code] }';
        }
        return temp_toString.apply(this, arguments);
    }

    window.eval = function () {
        if (typeof arguments[0] == "string") {
            arguments[0] = arguments[0].replaceAll(/debugger/g, '');
        }
        return temp_eval(...arguments);
    }

    let Bypass_debugger = Function;

    Function = function () {
        for (let i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == "string") {
                arguments[i] = arguments[i].replaceAll(/debugger/g, '');
            }
        }
        return Bypass_debugger(...arguments);
    }

    Function.prototype = Bypass_debugger.prototype;

    Function.prototype.constructor = function () {
        for (let i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == "string") {
                arguments[i] = arguments[i].replaceAll(/debugger/g, '');
            }
        }
        return Bypass_debugger(...arguments);
    }

    Function.prototype.constructor.prototype = Function.prototype;
})();