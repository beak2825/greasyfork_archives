// ==UserScript==
// @name Moomoo.io Force conect bird .op clien (@FaZeGG456) for mod :) in youtube %%
// @author Sophia :3 and alicia
// @description Allows to connect to the full server
// @icon https://moomoo.io/img/favicon.png?v=1
// @version 0.2
// @match *://moomoo.io/*
// @match *://*.moomoo.io/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/481561/Moomooio%20Force%20conect%20bird%20op%20clien%20%28%40FaZeGG456%29%20for%20mod%20%3A%29%20in%20youtube%20%25%25.user.js
// @updateURL https://update.greasyfork.org/scripts/481561/Moomooio%20Force%20conect%20bird%20op%20clien%20%28%40FaZeGG456%29%20for%20mod%20%3A%29%20in%20youtube%20%25%25.meta.js
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Github: https://github.com/Murka007
    Discord: https://discord.gg/sG9cyfGPj5
    Greasyfork: https://greasyfork.org/en/users/919633
    MooMooForge: https://github.com/MooMooForge
*/

(function() {
    "use strict";

    const log = console.log;
    function createHook(target, prop, callback) {
        const symbol = Symbol(prop);
        Object.defineProperty(target, prop, {
            get() {
                return this[symbol];
            },
            set(value) {
                callback(this, symbol, value);
            },
            configurable: true
        })
    }

    createHook(Object.prototype, "maxPlayers", function(that, symbol, value) {
        delete Object.prototype.maxPlayers;
        that.maxPlayers = value + 10;
    })

})();