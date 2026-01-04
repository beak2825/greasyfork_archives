// ==UserScript==
// @name         pass_Debugger
// @version      2025-02-23
// @description  Bypass new Function --> debugger && constructor --> debugger && eval --> debugger
// @author       ztjun
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @namespace https://greasyfork.org/users/409103
// @downloadURL https://update.greasyfork.org/scripts/536968/pass_Debugger.user.js
// @updateURL https://update.greasyfork.org/scripts/536968/pass_Debugger.meta.js
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