// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.dumpert.nl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377013/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/377013/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        // your code here
        var unsafeWindow = window.wrappedJSObject;
        var volume = 0.9;
        dump = unsafeWindow['dump'];
        console.log("blermblermblamer");
        console.log("volume is ingesteld op : " + volume);
        dump.players[0].player.volume = volume;


    }, false);
})();