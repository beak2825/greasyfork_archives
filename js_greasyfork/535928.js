// ==UserScript==
// @name         xrares.com Video Finder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Scan for video URL on xrares.com video pages using the evideo_vkey variable and check for multiple resolutions, IE retrieves the video link of private videos.
// @author       ErickCHIN
// @match        http*://*.xrares.com/video/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535928/xrarescom%20Video%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/535928/xrarescom%20Video%20Finder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Wait for the document to be ready
    $(document).ready(function () {

        const videoElement = document.getElementById('vjsplayer_html5_api');
        if (videoElement) {
            return;
        }
        // Extract the video ID from the URL
        const videoId = window.location.pathname.split('/')[2]; // e.g. "36708"

        // Find the evideo_vkey variable
        const evideoVkeyMatch = /var evideo_vkey = "([^"]+)"/.exec(document.body.innerHTML);
        if (!evideoVkeyMatch) {
            alert("Could not find evideo_vkey in page.");
            return;
        }
        const evideoVkey = evideoVkeyMatch[1];

        // Define the base URL and resolutions to check
        const domain = "https://www.xrares.com";
        const basePath = "/vsrc/h264/";
        const resolutions = ["HD", "SD", "1440p", "1080p", "720p", "640p", "480p", "360p", "240p", "144p"];

        let found = false;

        // Try each resolution
        for (let resolution of resolutions) {
            const url = `${domain}${basePath}${evideoVkey}/${resolution}`;
            console.log(url)

            GM_xmlhttpRequest({
                method: 'HEAD',
                url: url,
                timeout: 5000,
                onload: function (response) {
                    if (response.status === 200 && !found) {
                        found = true;
                        alert("✅ Video found:\n" + url);
                    }
                },
                onerror: function () {}
            });
        }

        // After all requests, check if not found
        setTimeout(() => {
            if (!found) {
                alert("❌ Video not found.");
            }
        }, 10000); // Wait 10 seconds for all HEAD requests
    });
})();