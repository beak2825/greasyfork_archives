// ==UserScript==
// @name         Skribbl Dark Mode
// @version      1.0.0
// @description  Enables skribbl.io dark mode.
// @author       104xvision
// @match        https://skribbl.io/*
// @run-at       document-body
// @license      MIT
// @namespace https://greasyfork.org/users/1238418
// @downloadURL https://update.greasyfork.org/scripts/483019/Skribbl%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/483019/Skribbl%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector("html").setAttribute("data-theme", "dark");
})();