// ==UserScript==
// @name         Discord Safari Search Fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixes the bug where Discord's search doesn't work in Safari
// @author       TellowKrinkle
// @match        https://discordapp.com/channels/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33799/Discord%20Safari%20Search%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/33799/Discord%20Safari%20Search%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.styleSheets[0].addRule("div[contenteditable=\"true\"]", "-webkit-user-select: text;", 0);
})();