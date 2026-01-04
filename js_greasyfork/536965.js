// ==UserScript==
// @name         Hook_Function
// @namespace    http://tampermonkey.net/
// @version      2024-12-04
// @description  Bypass new Function --> debugger && constructor --> debugger
// @author       0xsdeo
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536965/Hook_Function.user.js
// @updateURL https://update.greasyfork.org/scripts/536965/Hook_Function.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var Bypass_debugger = Function;
    var temp_toString = Function.prototype.toString;

    Function.prototype.toString = function () {
        if (this === Function) {
            return 'function Function() { [native code] }';
        }
        else if (this === Function.prototype.toString) {
            return 'function toString() { [native code] }';
        }
        return temp_toString.apply(this, arguments);
    }

    Function = function () {
        var reg = /debugger/;
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == "string") {
                var temp_length = arguments[i].match(/debugger/g);
                if (temp_length != null) {
                    temp_length = temp_length.length;
                    while (temp_length) {
                        arguments[i] = arguments[i].replace(reg, "");
                        temp_length--;
                    }
                }
            }
        }
        return Bypass_debugger(...arguments);
    }

    Function.prototype = Bypass_debugger.prototype;

    Function.prototype.constructor = function () {
        var reg = /debugger/;
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == "string") {
                var temp_length = arguments[i].match(/debugger/g);
                if (temp_length != null) {
                    temp_length = temp_length.length;
                    while (temp_length) {
                        arguments[i] = arguments[i].replace(reg, "");
                        temp_length--;
                    }
                }
            }
        }
        return Bypass_debugger(...arguments);
    }

    Function.prototype.constructor.prototype = Function.prototype;
})();