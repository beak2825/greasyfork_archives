// ==UserScript==
// @name         Gamepedia
// @namespace    lander_scripts
// @description  Widens body of Gamepedia websites.
// @match        http://*.gamepedia.com/*
// @match        https://*.gamepedia.com/*
// @grant        none
// @version      0.4
// @icon         https://media-mercury.cursecdn.com/attachments/3/653/gamepedia_light_transparent.png
// @downloadURL https://update.greasyfork.org/scripts/377411/Gamepedia.user.js
// @updateURL https://update.greasyfork.org/scripts/377411/Gamepedia.meta.js
// ==/UserScript==

console.info('Gamepedia Script Loaded');

(function() {
    'use strict';
    document.getElementById('bodyContent').style.width = "100%";
})();
