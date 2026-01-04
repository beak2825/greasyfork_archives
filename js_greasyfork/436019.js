// ==UserScript==
// @name         Kick Warn
// @description  made with much love
// @version      0.0.1
// @author       Cazka#1820
// @match        *://diep.io/*
// @icon         https://www.google.com/s2/favicons?domain=diep.io
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/541070
// @downloadURL https://update.greasyfork.org/scripts/436019/Kick%20Warn.user.js
// @updateURL https://update.greasyfork.org/scripts/436019/Kick%20Warn.meta.js
// ==/UserScript==
'use strict';

window.m28.pow.solve = new Proxy(window.m28.pow.solve, {
    apply(target, thisArg, args) {
        const now = Date.now();

        args[2] = new Proxy(args[2], {
            apply(target, thisArg, args) {
                const time = Date.now() - now;
                if(time > 15000) {
                    window.alert(`Kick Warn! Last pow took ${time / 1000} seconds.`);
                }
                return Reflect.apply(target, thisArg, args);
            }
        });
        return Reflect.apply(target, thisArg, args);
    }
});