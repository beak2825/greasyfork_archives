// ==UserScript==
// @name         Page Refresh
// @namespace    Page Refresh for Ash :)
// @version      1.1
// @description  Refreshes page on twitch.
// @author       Misery
// @match        *://*.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522943/Page%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/522943/Page%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const refreshInterval = 360000; // 6 Minutes

    setTimeout(() => {
        location.reload();
    }, refreshInterval);
})();