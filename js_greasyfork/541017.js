// ==UserScript==
// @name         YouTube URL Tracker
// @namespace    https://yourname.dev
// @version      1.0
// @description  Tracks and stores visited YouTube video URLs and allows copying them
// @match        https://www.youtube.com/watch*
// @match        https://m.youtube.com/watch*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541017/YouTube%20URL%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/541017/YouTube%20URL%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'yt_visited_urls';

    // Helper to get and save URL list
    function getStoredUrls() {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }

    function saveUrl(url) {
        const urls = getStoredUrls();
        if (!urls.includes(url)) {
            urls.push(url);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
        }
    }

    function copyAllUrls() {
        const urls = getStoredUrls();
        const text = urls.join('\n');
        GM_setClipboard(text);
        alert(`Copied ${urls.length} URL(s) to clipboard.`);
    }

    function addCopyButton() {
        const existing = document.getElementById('yt-url-copy-btn');
        if (existing) return;

        const btn = document.createElement('button');
        btn.id = 'yt-url-copy-btn';
        btn.innerText = '📋 Copy Video URLs';
        Object.assign(btn.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 10000,
            background: '#ff0000',
            color: 'white',
            padding: '10px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
        });

        btn.addEventListener('click', copyAllUrls);
        document.body.appendChild(btn);
    }

    // Run logic on page load
    function onLoad() {
        const currentUrl = window.location.href;
        saveUrl(currentUrl);
        addCopyButton();
    }

    // Handle YouTube's dynamic page navigation (single-page app)
    let lastUrl = '';
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if (lastUrl.includes('/watch')) {
                setTimeout(onLoad, 1000); // delay to allow DOM to settle
            }
        }
    }).observe(document, { subtree: true, childList: true });

    // First load
    onLoad();
})();
