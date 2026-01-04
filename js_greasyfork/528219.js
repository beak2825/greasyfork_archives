// ==UserScript==
// @name         Base64 Decoder and Link Wrapper for Rentry Pages
// @namespace    http://tampermonkey.net/
// @version      2025-02-23
// @description  Decodes base64 encoded text and wraps it in an <a> tag on all Rentry pages
// @author       You
// @match        https://rentry.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rentry.co
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528219/Base64%20Decoder%20and%20Link%20Wrapper%20for%20Rentry%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/528219/Base64%20Decoder%20and%20Link%20Wrapper%20for%20Rentry%20Pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let items = document.querySelectorAll("code");
    items.forEach((item) => {
        try {
            let decoded = atob(item.textContent);
            let link = document.createElement('a');
            link.href = decoded;
            link.textContent = decoded;
            item.parentNode.replaceChild(link, item);
        } catch (e) {
            console.warn('Invalid base64 content:', item.textContent);
        }
    });

})();
