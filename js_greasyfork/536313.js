// ==UserScript==
// @name Remove Notification Count from Title
// @namespace http://tampermonkey.net/
// @author Kurzeilig007
// @version 1.0
// @description ...
// @match https://www.gutefrage.net/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/536313/Remove%20Notification%20Count%20from%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/536313/Remove%20Notification%20Count%20from%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const originalTitle = document.title;
    function resetTitle() {
        document.title = originalTitle;
    }
    const observer = new MutationObserver(() => {
        if (/\(\d+\)/.test(document.title)) {
            resetTitle();
        }
    });
    const titleElement = document.querySelector('title');
    if (titleElement) {
        observer.observe(titleElement, { childList: true });
    }

    setInterval(resetTitle, 3000);
})();