// ==UserScript==
// @name         TriggerNotify Loader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Load TriggerNotify script
// @author       Your Name
// @match        *://*bloodrizer.ru/games/kittens*
// @match        *://kittensgame.com/*
// @exclude      *://*bloodrizer.ru/games/kittens/wiki*
// @exclude      *://kittensgame.com/*/wiki*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522967/TriggerNotify%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/522967/TriggerNotify%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init_trigNotify() {
        var checkReady = setInterval(function () {
            clearInterval(checkReady);
            var mod = document.createElement('script');
            mod.src = 'https://trigger-segfault.github.io/mods/trigger-notify/TriggerNotify.js';
            mod.id = 'modscript_TriggerNotify';
            document.head.appendChild(mod);
        }, 400);
    }

    init_trigNotify();
})();
