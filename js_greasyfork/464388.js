// ==UserScript==
// @name         Patreon Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes patreons theme into darkmode
// @author       You
// @match        https://*.patreon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464388/Patreon%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/464388/Patreon%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Function that changes various css elements in the site to different colors (Background, Text)
    function doThing(){
// Main blocks (containing text) and Side bar
document.documentElement.style.setProperty('--global-bg-base-default', '#000000');
// Main text
document.documentElement.style.setProperty('--global-content-regular-default', 'rgb(207 207 207');
// Main background
document.documentElement.style.setProperty('--global-bg-page-default', '#292a2c');
// Secondary text
document.documentElement.style.setProperty('--global-content-muted-default', 'rgb(212 171 223)');
// Format for adding more elements
// document.documentElement.style.setProperty('css element you want to change', 'color (can be rgb or hex');
}

// Calling the function
doThing();

})();