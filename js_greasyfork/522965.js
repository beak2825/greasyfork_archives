// ==UserScript==
// @name         KGProgressBars Loader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Load KGProgressBars script
// @author       Your Name
// @match        *://*bloodrizer.ru/games/kittens*
// @match        *://kittensgame.com/*
// @exclude      *://*bloodrizer.ru/games/kittens/wiki*
// @exclude      *://kittensgame.com/*/wiki*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522965/KGProgressBars%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/522965/KGProgressBars%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init_kgpb() {
        if (typeof gamePage == "object") {
            var kgp = document.createElement('script');
            kgp.src = 'https://cdn.jsdelivr.net/gh/vl20100/KGProgressBars@0.0.1.d/dist/KGP.js';
            kgp.id = 'kpgscript_TriggerNotify';
            document.head.appendChild(kgp);
        } else if (typeof gamePage == "undefined") {
            setTimeout(function() {
                init_kgpb();
            }, 100);
        }
    }

    init_kgpb();
})();
