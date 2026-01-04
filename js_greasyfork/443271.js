// ==UserScript==
// @name         OWOP Maps
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Map system for OWOP, with included maps
// @author       Mizu
// @match        https://ourworldofpixels.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourworldofpixels.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/443271/OWOP%20Maps.user.js
// @updateURL https://update.greasyfork.org/scripts/443271/OWOP%20Maps.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // create script element
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://raw.githubusercontent.com/Rexxt/OWOP-mods/main/maps.js';
    // append script to document
    document.querySelector('head').appendChild(script);
})();