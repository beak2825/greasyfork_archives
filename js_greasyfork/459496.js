// ==UserScript==
// @name        Mega.nz Automatic Dark Mode
// @match       *://*.mega.nz/*
// @match       *://*.mega.io/*
// @grant       none
// @version     1.1.0
// @author      NoUser
// @description Make mega.nz and mega.io use dark mode by default.
// @namespace   https://greasyfork.org/en/scripts/459496-mega-nz-automatic-dark-mode
// @homepage    https://greasyfork.org/en/scripts/459496-mega-nz-automatic-dark-mode
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/459496/Meganz%20Automatic%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/459496/Meganz%20Automatic%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var body = document.getElementsByTagName("body")[0];
    if (!body.classList.contains("theme-dark")) {
        body.classList.add("theme-dark");
    }

    var style = document.createElement('style');
    style.innerHTML = '.mobile { background-color: black !important; color: white !important; } .viewer-bars { background-color: black !important; color: white !important; } .file-name { color: white !important; }';
    document.head.appendChild(style);
})();