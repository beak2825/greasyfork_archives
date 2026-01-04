// ==UserScript==
// @name         Uncap FPS for Suroi
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Uncaps the FPS limit (turns off V-sync)
// @author       Blubbled
// @match        https://suroi.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493862/Uncap%20FPS%20for%20Suroi.user.js
// @updateURL https://update.greasyfork.org/scripts/493862/Uncap%20FPS%20for%20Suroi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function uncapFPS() {
        window.requestAnimationFrame = function(callback) {
            return setTimeout(callback, 1);
        };
    }

    uncapFPS();
})();