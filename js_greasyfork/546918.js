// ==UserScript==
// @name         YouTube Sidebar Auto Expand
// @namespace    http://tampermonkey.net/
// @version      1.4
// @author       Luo
// @description  Enable the left sidebar
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/fe2icons/yt_favicon_144.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546918/YouTube%20Sidebar%20Auto%20Expand.user.js
// @updateURL https://update.greasyfork.org/scripts/546918/YouTube%20Sidebar%20Auto%20Expand.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isHomepage() {
        return location.pathname === '/';
    }

    function clickSidebarButton() {
        const btn = document.querySelector(
            "ytd-mini-guide-entry-renderer #endpoint, #guide-button, yt-icon-button#guide-button, ytd-app #guide-icon"
        );
        const app = document.querySelector("ytd-app");
        if (btn && app && !app.hasAttribute("guide-persistent-and-visible")) {
            btn.click();
            return true;
        }
        return false;
    }

    function waitForHomepageAndButton() {
        if (!isHomepage()) return;

        const interval = setInterval(() => {
            const clicked = clickSidebarButton();
            if (clicked) {
                clearInterval(interval);
            }
        }, 500);
    }

    let lastPath = location.pathname;
    new MutationObserver(() => {
        if (location.pathname !== lastPath) {
            lastPath = location.pathname;
            waitForHomepageAndButton();
        }
    }).observe(document.body, { childList: true, subtree: true });

    waitForHomepageAndButton();
})();
