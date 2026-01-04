// ==UserScript==
// @name         Playlist.M3U8 Detector for jbox.co.kr (Continuous Monitoring)
// @version      1.2
// @description  Continuously monitor network requests for playlist.m3u8 files and open them in a new window
// @match        https://www.jbox.co.kr/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/506618/PlaylistM3U8%20Detector%20for%20jboxcokr%20%28Continuous%20Monitoring%29.user.js
// @updateURL https://update.greasyfork.org/scripts/506618/PlaylistM3U8%20Detector%20for%20jboxcokr%20%28Continuous%20Monitoring%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const openedUrls = new Set();

    function promptAndOpenUrl(url) {
        if (!openedUrls.has(url)) {
            const userConfirmed = confirm("발견된 파일의 주소를 새 창에서 여시겠습니까?");
            if (userConfirmed) {
                window.open(url, '_blank');
                openedUrls.add(url);
            } else {
                // Mark the URL to prevent further prompts
                openedUrls.add(url);
            }
        }
    }

    function checkForFile(url) {
        if (url && (url.includes('.m3u8') || url.includes('.mp4'))) {
            console.log('File detected:', url);
            promptAndOpenUrl(url);
        }
    }

    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        if (typeof input === 'string') {
            checkForFile(input);
        } else if (input instanceof Request) {
            checkForFile(input.url);
        }
        return originalFetch.apply(this, arguments);
    };

    // Intercept XMLHttpRequest
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        checkForFile(url);
        return originalXhrOpen.apply(this, arguments);
    };

    function scanForFiles() {
        const elements = document.querySelectorAll('a, source, iframe, video');
        elements.forEach(element => {
            const url = element.src || element.href;
            checkForFile(url);
        });

        // Scan inline scripts for potential .m3u8 and .mp4 URLs
        const scripts = document.getElementsByTagName('script');
        [...scripts].forEach(script => {
            const fileUrls = script.textContent.match(/https?:\/\/[^"']+\.(m3u8|mp4)/g);
            if (fileUrls) {
                fileUrls.forEach(checkForFile);
            }
        });
    }

    // Initial scan
    scanForFiles();

    // Set up a periodic scan
    setInterval(scanForFiles, 5000);  // Scan every 5 seconds

    // Set up a MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                scanForFiles();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'href']
    });

    console.log('Universal file detector is now running.');
})();
