// ==UserScript==
// @name        Medium Bypass
// @description Bypass Medium Account required
// @namespace   medium-mduga
// @match       https://medium.com/*
// @grant       none
// @version     1.0
// @author      mduga
// @license     MIT
// @description 28/05/2024 19:00:56
// @downloadURL https://update.greasyfork.org/scripts/496374/Medium%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/496374/Medium%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.location.href = window.location.href.replace("medium.com", "scribe.rip");
})();
