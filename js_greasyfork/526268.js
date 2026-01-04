// ==UserScript==
// @name         Download Media with Cobalt API
// @namespace    https://github.com/tizee/tempermonkey-download-with-cobalt
// @version      1.1
// @description  Adds a context menu item to download media from supported video sites using a direct URL.
// @author       tizee
// @match        *://*.bilibili.com/video/*
// @match        *://*.instagram.com/p/*
// @match        *://*.instagram.com/reels/*
// @match        *://*.instagram.com/reel/*
// @match        *://*.twitter.com/*/status/*
// @match        *://*.twitter.com/*/status/*/video/*
// @match        *://*.twitter.com/i/spaces/*
// @match        *://*.x.com/*/status/*
// @match        *://*.x.com/*/status/*/video/*
// @match        *://*.x.com/i/spaces/*
// @match        *://*.reddit.com/r/*/comments/*/*
// @match        *://*.soundcloud.com/*
// @match        *://*.soundcloud.app.goo.gl/*
// @match        *://*.tumblr.com/post/*
// @match        *://*.tumblr.com/*/*
// @match        *://*.tumblr.com/*/*/*
// @match        *://*.tumblr.com/blog/view/*/*
// @match        *://*.tiktok.com/*
// @match        *://*.vimeo.com/*
// @match        *://*.youtube.com/watch?*
// @match        *://*.youtu.be/*
// @match        *://*.youtube.com/shorts/*
// @match        *://*.vk.com/video*
// @match        *://*.vk.com/*?w=wall*
// @match        *://*.vk.com/clip*
// @match        *://*.vine.co/*
// @match        *://*.streamable.com/*
// @match        *://*.pinterest.com/pin/*
// @match        *://*.xiaohongshu.com/explore/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526268/Download%20Media%20with%20Cobalt%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/526268/Download%20Media%20with%20Cobalt%20API.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultApiUrl = 'cobalt.tools'; // Removed https:// prefix
    let apiUrl = GM_getValue('apiurl', defaultApiUrl); // Load from storage

    // Function to set/update the API URL
    function setApiUrl() {
        let newApiUrl = prompt("Enter Cobalt API URL (e.g., cobalt.tools):", apiUrl); // Adjusted prompt
        if (newApiUrl !== null) {
            apiUrl = newApiUrl;
            GM_setValue('apiurl', apiUrl);
            alert(`API URL set to: ${apiUrl}`);
        }
    }

    // Add menu command to configure the API URL
    GM_registerMenuCommand("Set Cobalt API URL", setApiUrl);


    function downloadItem(targetUrl) {
        let au = apiUrl;
        if (!au.startsWith("https://") && !au.startsWith("http://")) au = `https://` + au; // Add protocol if missing
        if (!au.endsWith("/")) au = au + '/'; // Add trailing slash if missing
        au = au + `?u=${encodeURIComponent(targetUrl)}`; // Properly encode the target URL

        GM_openInTab(au, { active: true });
    }


    GM_registerMenuCommand("Download Media (Cobalt API)", () => {
        downloadItem(window.location.href);
    });

})();
