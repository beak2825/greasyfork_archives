// ==UserScript==
// @name         HOET Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blockiert Höllerer sei Anti-Cheat
// @author       Me
// @match        https://mc.level1.at/*
// @icon         https://www.google.com/s2/favicons?domain=level1.at
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437374/HOET%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/437374/HOET%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof(cheat) != "undefined")
    {
        setInterval(() => {console.log(cheat); cheat = 0;}, 500);
    }
})();