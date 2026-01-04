// ==UserScript==
// @name         Block 1337x's Annoying popups!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license       GNU GPLv3
// @description  Blocks all popups from 1337x.to and redirects suspicious links to the homepage.
// @author       TheApkDownloader
// @match        https://1337x.to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521277/Block%201337x%27s%20Annoying%20popups%21.user.js
// @updateURL https://update.greasyfork.org/scripts/521277/Block%201337x%27s%20Annoying%20popups%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalOpen = window.open;
    window.open = function(url, target, features) {
        console.warn(`Blocked popup attempt to open URL: ${url}`);
        if (url) {
            window.location.href = "https://1337x.to";
        }
        return null;
    };

    document.addEventListener('click', function(e) {
        const target = e.target.closest('a[target="_blank"]');
        if (target) {
            e.preventDefault();
            console.warn(`Blocked target="_blank" link to: ${target.href}`);
            window.location.href = "https://1337x.to";
        }
    });

    console.info("1337x.to popup blocker is active.");
})();
