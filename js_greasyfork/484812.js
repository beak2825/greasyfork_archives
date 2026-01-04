// ==UserScript==
// @name Disable Auto-Refresh on Indian Express
// @namespace Violentmonkey Scripts
// @match https://indianexpress.com/*
// @grant none
// @locale
// @version 1.0
// @license MIT
// @description This script can be used to disable the auto-refresh feature of The Indian Express
// @downloadURL https://update.greasyfork.org/scripts/484812/Disable%20Auto-Refresh%20on%20Indian%20Express.user.js
// @updateURL https://update.greasyfork.org/scripts/484812/Disable%20Auto-Refresh%20on%20Indian%20Express.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        var meta = document.createElement('meta');
        meta.httpEquiv = "refresh";
        meta.content = "1800";
        document.getElementsByTagName('head')[0].appendChild(meta);
    }
})();