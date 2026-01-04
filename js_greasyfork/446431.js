// ==UserScript==
// @name         reload fixer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  keeps the game from reloading a bunch
// @author       shellshock hacker
// @match        *://shellshock.io/*
// @icon         https://www.google.com/s2/favicons?domain=shellshock.io
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/446431/reload%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/446431/reload%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    localStorage.removeItem('lastVersionPlayed');
})();