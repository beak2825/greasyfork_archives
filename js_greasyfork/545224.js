// ==UserScript==
// @name         Simple Krunker ESP
// @description  ESP in 8 lines of code
// @author       chomler
// @match        *://krunker.io/*
// @version      1.0
// @grant        none
// @namespace https://greasyfork.org/users/674173
// @downloadURL https://update.greasyfork.org/scripts/545224/Simple%20Krunker%20ESP.user.js
// @updateURL https://update.greasyfork.org/scripts/545224/Simple%20Krunker%20ESP.meta.js
// ==/UserScript==

// -----------------------------------------------------------
//   https://dogeware.cheems.art/ for working krunker cheats
// -----------------------------------------------------------


Function.prototype.toString = new Proxy(Function.prototype.toString, {
    apply(target, thisArg, argArray) {
        let ret = target.apply(thisArg, argArray);
        if (ret.length > 3500000 && ret.includes("function anonymous"))
            Object.defineProperty(Object.prototype, /if\(!\w+\['(\w+)']\)continue/.exec(ret)[1], {value: true, enumerable: false});
        return ret
    }
})