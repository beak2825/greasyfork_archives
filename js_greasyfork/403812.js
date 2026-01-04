// ==UserScript==
// @name         Bonk.io Fullscreen Mode
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Puts Bonk.io flash player into fullscreen. That's it!
// @author       Balint Sotanyi
// @match        http://bonk.io/*
// @match        http://*.bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403812/Bonkio%20Fullscreen%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/403812/Bonkio%20Fullscreen%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.onload = function() {
        var f = document.getElementById('templatemo_middle').children[2].firstElementChild;
        if (f !== undefined) {
            f.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;';
            document.body.style.overflow = 'hidden';
        } else {
            console.log('Couldn\'t reach Flash player. Try restarting the page.');
        }
    }
})();