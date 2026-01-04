// ==UserScript==
// @name         Poki fullscreener
// @namespace    https://poki.com/
// @version      1.0
// @author       NextDev65
// @description  opens game frame on Poki games
// @match        https://poki.com/en/g/*
// @grant        window.close
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/429082/Poki%20fullscreener.user.js
// @updateURL https://update.greasyfork.org/scripts/429082/Poki%20fullscreener.meta.js
// ==/UserScript==

(function(){
    'use strict';

    window.location.replace(document.getElementById("game-element").src);
})();