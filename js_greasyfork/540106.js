// ==UserScript==
// @name         YouTube Enhancer: Skip Ads, Expand Description, Disable Shorts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skips video ads, auto-expands description, and redirects YouTube Shorts to normal player
// @author       Yousef Shamsaldeen
// @match        *://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/6e2e38ae/img/favicon_144x144.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540106/YouTube%20Enhancer%3A%20Skip%20Ads%2C%20Expand%20Description%2C%20Disable%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/540106/YouTube%20Enhancer%3A%20Skip%20Ads%2C%20Expand%20Description%2C%20Disable%20Shorts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const skipAds = () => {
        const skipBtn = document.querySelector('.ytp-ad-skip-button');
        if (skipBtn) {
            skipBtn.click();
            console.log("✅ Ad skipped");
        }

        // Skip video ads (muted and skipped)
        const video = document.querySelector('video');
        if (video && video.duration > 1 && video.currentSrc.includes("googlevideo.com")) {
            video.muted = true;
            video.currentTime = video.duration;
            console.log("✅ Skipping video ad");
        }
    };

    const expandDescription = () => {
        const moreBtn = document.querySelector('tp-yt-paper-button#more');
        if (moreBtn && moreBtn.innerText.toLowerCase().includes("more")) {
            moreBtn.click();
            console.log("✅ Expanded description");
        }
    };

    const redirectShorts = () => {
        const url = new URL(window.location.href);
        if (url.pathname.startsWith("/shorts/")) {
            const videoId = url.pathname.split("/")[2];
            if (videoId) {
                const newUrl = `https://www.youtube.com/watch?v=${videoId}`;
                window.location.replace(newUrl);
                console.log("✅ Redirected from Shorts");
            }
        }
    };

    const observer = new MutationObserver(() => {
        skipAds();
        expandDescription();
    });

    redirectShorts();

    // Observe DOM for dynamic changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
