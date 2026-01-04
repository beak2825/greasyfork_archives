// ==UserScript==
// @name         Fabric Wiki Dark Mode
// @namespace    http://tampermonkey.net/
// @version      2025-03-25
// @description  Adds Dark mode to the Fabric Wiki
// @author       NicholasC
// @match        https://wiki.fabricmc.net/*
// @icon         https://www.google.com/s2/favicons?sz=256&domain=fabricmc.net
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530799/Fabric%20Wiki%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/530799/Fabric%20Wiki%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle ( `
    body * {
        background-color: #222 !important;
        color: #ddd !important;
    }`);
})();