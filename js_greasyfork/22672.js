// ==UserScript==
// @name         Sb Mod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  smd
// @author       Doge
// @match        https://www.nulled.to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22672/Sb%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/22672/Sb%20Mod.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){ chatView.isMod = true; }, 500);
    setTimeout(function(){ chat.isMod = true; }, 500);
})();