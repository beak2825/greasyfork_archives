// ==UserScript==
// @name         Fandom (wikis)
// @namespace    lander_scripts
// @description  Widens body of Fandom (wikis) websites.
// @match        http://*.fandom.com/*
// @match        https://*.fandom.com/*
// @grant        none
// @version      0.1
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Fandom.svg/1280px-Fandom.svg.png
// @downloadURL https://update.greasyfork.org/scripts/377414/Fandom%20%28wikis%29.user.js
// @updateURL https://update.greasyfork.org/scripts/377414/Fandom%20%28wikis%29.meta.js
// ==/UserScript==

console.info('Gamepedia Script Loaded');

(function() {
    'use strict';
    document.getElementById('WikiaMainContent').style.width = "100%";
})();