// ==UserScript==
// @name         Nummon's Calc Loader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto-loads Nummon's Calculator script for Kittens Game
// @author       Milonti - milonti1@gmail.com
// @match        *://*bloodrizer.ru/games/kittens*
// @match        *://kittensgame.com/*
// @exclude      *://*bloodrizer.ru/games/kittens/wiki*
// @exclude      *://kittensgame.com/*/wiki*
// @grant        none
// @notes        I do not own Nummon's Calculator. This is only a loader script
// @downloadURL https://update.greasyfork.org/scripts/386649/Nummon%27s%20Calc%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/386649/Nummon%27s%20Calc%20Loader.meta.js
// ==/UserScript==

function init_nummon() {
    if (typeof gamePage == "object") {
        var mod = document.createElement('script');
        mod.src = 'https://cdn.jsdelivr.net/gh/Bioniclegenius/NummonCalc/NummonCalc.js';
        mod.id = 'modscript_TriggerNotify';
        document.head.appendChild(mod);
    } else if(typeof gamePage == "undefined") {
        setTimeout(function(){
            init_nummon();
        }, 100);
    }
}

init_nummon();