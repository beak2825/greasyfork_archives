// ==UserScript==
// @name         Open Link in LiveContainer
// @namespace    LiveContainerTambyK
// @version      1.0
// @description  Opens any link automatically in the iOS-App "LiveContainer".
// @author       Kilian

// @match        https://www.youtube.com/*
// @match        https://youtube.com/*

// @match        https://www.m.youtube.com/*
// @match        https://m.youtube.com/*

// @match        https://discord.com/invite/*

// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545169/Open%20Link%20in%20LiveContainer.user.js
// @updateURL https://update.greasyfork.org/scripts/545169/Open%20Link%20in%20LiveContainer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function toBase64(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    const currentUrl = window.location.href;
    const base64Url = toBase64(currentUrl);

    const liveContainerUrl = `livecontainer://open-web-page?url=${base64Url}`;

    window.location.href = liveContainerUrl;
})();
