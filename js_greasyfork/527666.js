// ==UserScript==
// @name         Remove Reddit Blurs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove spoiler tagging
// @author       pfn0
// @match        https://*.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527666/Remove%20Reddit%20Blurs.user.js
// @updateURL https://update.greasyfork.org/scripts/527666/Remove%20Reddit%20Blurs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handleFiltering() {
        removeSpoilerTags();
    }

    function removeSpoilerTags() {
        Array.prototype.forEach.call(document.getElementsByTagName("shreddit-blurred-container"), x => { x.blurred = false });
        Array.prototype.forEach.call(document.getElementsByTagName("shreddit-spoiler"), x => { x.revealed = true });

    }

    handleFiltering();
    const config = { attributes: true, childList: true, subtree: true };
    const observer = new MutationObserver((x,y) => handleFiltering());
    observer.observe(document, config);
})();