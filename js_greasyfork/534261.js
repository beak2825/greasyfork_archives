// ==UserScript==
// @name         TikTok to StickTock Redirect
// @namespace    0b9
// @author       0b9
// @version      1.0
// @description  Redirect TikTok links to StickTock
// @icon         https://www.google.com/s2/favicons?domain=tiktok.com
// @match        *://*.tiktok.com/*/video/*
// @match        *://*.tiktok.com/*/photo/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534261/TikTok%20to%20StickTock%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/534261/TikTok%20to%20StickTock%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const sticktock = location.href.replace(location.hostname, "www.sticktock.com");
    window.location.replace(sticktock);
})();
