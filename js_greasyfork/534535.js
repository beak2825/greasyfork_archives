// ==UserScript==
// @name         Nexus Mod Download Enabler
// @namespace    https://nexusmods.com/
// @version      1.0
// @description  Forces visibility of download links (tab=files) on Nexus Mods
// @author       You
// @match        https://www.nexusmods.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/534535/Nexus%20Mod%20Download%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/534535/Nexus%20Mod%20Download%20Enabler.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Select all <a> elements with "tab=files" in the href and force them visible
    [...document.querySelectorAll('a')]
        .filter(e => e.href.includes('tab=files'))
        .forEach(e => e.style = "display:block!important;");
})();
