// ==UserScript==
// @name         TikTok Profile Auto-Fix + Dark PWA Titlebar
// @namespace    https://codymkw.nekoweb.org/
// @version      1.5
// @description  Auto-add raw space to TikTok profiles to bypass "Something went wrong" and set dark PWA title bar theme color
// @author       CodyMKW
// @match        https://www.tiktok.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546016/TikTok%20Profile%20Auto-Fix%20%2B%20Dark%20PWA%20Titlebar.user.js
// @updateURL https://update.greasyfork.org/scripts/546016/TikTok%20Profile%20Auto-Fix%20%2B%20Dark%20PWA%20Titlebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = location.href;

    function setDarkTitleBar() {
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = "theme-color";
            document.head.appendChild(meta);
        }
        if (meta.content !== "#000000") {
            meta.content = "#000000"; // dark theme
            console.log("TikTok Auto-Fix: Dark title bar applied");
        }
    }

    function tryFixUrl() {
        const profileKey = "tiktok_fix_" + location.pathname;

        // Fix profile URL only if:
        // - We're on a profile
        // - Not on a video
        // - No space at end
        // - Not already fixed in this session
        if (location.pathname.startsWith("/@") &&
            !location.pathname.includes("/video/") &&
            !location.href.endsWith(" ") &&
            !sessionStorage.getItem(profileKey)) {

            console.log("TikTok Auto-Fix: Adding raw space to URL for", location.pathname);
            sessionStorage.setItem(profileKey, "1"); // mark as fixed for this profile
            history.replaceState(null, "", location.href + " ");
            location.reload();
        }
    }

    // Initial run
    setDarkTitleBar();
    tryFixUrl();

    // Watch for SPA changes
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setDarkTitleBar();
            tryFixUrl();
        }
    }, 500);
})();