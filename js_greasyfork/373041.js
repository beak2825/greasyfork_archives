// ==UserScript==
// @name         Fix Roblox Icon
// @namespace    http://thelmgn.com/
// @version      0.1
// @description  Use a red favicon on Roblox.com
// @author       theLMGN
// @match        https://www.roblox.com/*
// @grant        none
// @licence      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/373041/Fix%20Roblox%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/373041/Fix%20Roblox%20Icon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector("head > link[rel=icon]").href = "https://roblox.com/favicon.ico"
})();