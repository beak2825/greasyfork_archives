// ==UserScript==
// @name         YouTube Embed Button Under Video
// @namespace    https://greasyfork.org/en/scripts/537364-youtube-embed-button-under-video
// @homepageURL    https://github.com/almahmudbd
// @version      2.2
// @description  Adds a button under YouTube videos to open the embed page for the current video.
// @license GPL-3
// @author       unknown
// @match        https://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537364/YouTube%20Embed%20Button%20Under%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/537364/YouTube%20Embed%20Button%20Under%20Video.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Helper to get video ID from current URL
    function getVideoId() {
        const urlObj = new URL(window.location.href);
        return urlObj.searchParams.get('v');
    }

    // Create and insert the embed button under the video
    function insertEmbedButton() {
        // Avoid duplicate buttons
        if (document.getElementById('yt-embed-link-btn')) return;

        const videoId = getVideoId();
        if (!videoId) return;

        // Find the container below the video (where buttons like Share/Like appear)
        // This selector is relatively stable, but may need updating if YouTube changes its layout
        const actionsRow = document.querySelector('#top-level-buttons-computed, ytd-menu-renderer #top-level-buttons');

        if (actionsRow) {
            // Create the button
            const btn = document.createElement('button');
            btn.id = 'yt-embed-link-btn';
            btn.textContent = '▶ Open Embed Page';
            btn.style.marginLeft = "8px";
            btn.style.padding = "6px 12px";
            btn.style.background = "#222";
            btn.style.color = "#fff";
            btn.style.border = "none";
            btn.style.borderRadius = "3px";
            btn.style.cursor = "pointer";
            btn.title = "Open this video in YouTube embed view";

            btn.onclick = () => {
                const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                window.open(embedUrl, '_blank');
            };

            // Insert the button at the end of the action row
            actionsRow.appendChild(btn);
        }
    }

    // Observe for SPA navigation and DOM updates
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            // Remove button if navigating away (prevents stale button)
            const oldBtn = document.getElementById('yt-embed-link-btn');
            if (oldBtn) oldBtn.remove();
            setTimeout(insertEmbedButton, 700); // Wait a bit for the new page to render
        }
        // Try to insert the button if not present (handles dynamic loading)
        if (!document.getElementById('yt-embed-link-btn')) {
            setTimeout(insertEmbedButton, 700);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial insert
    setTimeout(insertEmbedButton, 1000);
})();