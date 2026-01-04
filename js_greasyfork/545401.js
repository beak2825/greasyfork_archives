// ==UserScript==
// @name         YouTube → SkipCut Link Rewriter
// @name:en      YouTube → SkipCut Link Rewriter
// @name:nl      YouTube → SkipCut Link Herschrijver
// @name:es      Reescritor de Enlaces de YouTube a SkipCut
// @name:fr      Réécriture des Liens YouTube vers SkipCut
// @name:de      YouTube → SkipCut Link-Umschreiber
// @name:zh-CN   YouTube → SkipCut 链接重写器
// @name:ja      YouTube → SkipCut リンク書き換え
// @name:ru      Переписчик ссылок YouTube на SkipCut
// @name:pt      Reescritor de Links do YouTube para SkipCut
// @name:it      Riscrittore di Link da YouTube a SkipCut
// @namespace    https://greasyfork.org/nl/users/1197317-opus-x
// @version      1.07
// @description  Rewrite YouTube links to SkipCut links before they are opened
// @description:en Rewrite YouTube links to SkipCut links before they are opened
// @description:nl Herschrijf YouTube-links naar SkipCut-links voordat ze worden geopend
// @description:es Reescribe los enlaces de YouTube a enlaces de SkipCut antes de que se abran
// @description:fr Réécrit les liens YouTube en liens SkipCut avant leur ouverture
// @description:de Schreibe YouTube-Links in SkipCut-Links um, bevor sie geöffnet werden
// @description:zh-CN 在打开之前将 YouTube 链接重写为 SkipCut 链接
// @description:ja YouTubeリンクをSkipCutリンクに書き換えてから開く
// @description:ru Переписывает ссылки YouTube на ссылки SkipCut перед их открытием
// @description:pt Reescreve links do YouTube para links SkipCut antes de serem abertos
// @description:it Riscrive i link di YouTube in link SkipCut prima che vengano aperti
// @author       Opus-X
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAn1BMVEVHcEz/KTr/KTr/KTr/KTr/KTr/KTr/KTr/KTr/KTr/KTr/KTr5KDn7KDnWKDX/KTr////+KTr+IjTxJjf5KDjtpKnrFCn98/T+Gi/pJjX+9/fbIjHiQ0/iIDDCEiLPHi22CBzFSlP8UV3z29y4Mjz9O0r0Fiv8p639i5L5ZW/85efswMPJGCjfn6P+z9L+a3XHY2nNgofWanHTKjevBBkSa/ywAAAAD3RSTlMA1eJM8G8ZywLEjK/Ky+Vq/rygAAABGklEQVQokcWSV3PDMAiAlcRJ7YwzGq1XvGPH8cho+/9/W0Ee59zlpQ+98iA4PoEQwNi/iLna7qy3J7F225VJbLOwX8pig3FLbYrBJcRElyZb99aN994scye6ZhYpt4JrgV5eOFBN1GIGqfIMUF9cW2Q+wHlMbTCOJy/fAcCvXHF00LgWPeU9/CCIMaWGft0/zJk9g9BoCODcNH2GkPuDcRG/g006pP0MFcF5Qd33ScM8jQjOq/UfSaQjm1MUSE7QGGF9T+LgiG92SRtIpZtgadhBjtc9iV95JHFIcdQ+ajyXX3dKpVSYpknsKT40nkbGZdDidWUrL26DkeHI9LCV9DxdgkI9MBr2sCb7g96Pw14b05ogfblZf7e0P1C8J9ljbAzmAAAAAElFTkSuQmCC
// @match        *://*/*
// @exclude      *://skipcut.com/*
// @exclude      *://www.skipcut.com/*
// @exclude      *://youtube.com/*
// @exclude      *://www.youtube.com/*
// @exclude      *://youtube-nocookie.com/*
// @exclude      *://www.youtube-nocookie.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545401/YouTube%20%E2%86%92%20SkipCut%20Link%20Rewriter.user.js
// @updateURL https://update.greasyfork.org/scripts/545401/YouTube%20%E2%86%92%20SkipCut%20Link%20Rewriter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_TAB_NAME = 'SkipCutTab';

    // Convert a YouTube URL to the corresponding SkipCut URL
    function convertYouTubeToSkipCut(url) {
        // Quick check to avoid parsing non-YouTube links
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) return null;

        try {
            const u = new URL(url);
            const { hostname, pathname, searchParams } = u;

            // Handle normal YouTube domain
            if (hostname.match(/(^|\.)youtube\.com$/)) {
                // Regular video links: /watch?v=...
                if (pathname === '/watch' && searchParams.has('v')) {
                    return `https://www.skipcut.com/watch?v=${searchParams.get('v')}`;
                }

                // Live streams: /live/<id>
                if (pathname.startsWith('/live/')) {
                    const liveId = pathname.split('/')[2];
                    if (liveId) return `https://www.skipcut.com/live/${liveId}`;
                }

                // Playlists: /playlist?list=...
                if (pathname === '/playlist' && searchParams.has('list')) {
                    return `https://www.skipcut.com/playlist?list=${searchParams.get('list')}`;
                }
            }

            // Handle youtu.be short links: https://youtu.be/<id>
            if (hostname === 'youtu.be') {
                const videoId = pathname.slice(1); // remove leading "/"
                if (videoId) return `https://www.skipcut.com/watch?v=${videoId}`;
            }
        } catch (e) {
            // Ignore invalid URLs
        }

        return null; // Not a YouTube link we can convert
    }

    // Rewrite YouTube links to SkipCut links with target attribute
    function rewriteLinks() {
        const links = document.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]');
        links.forEach(link => {
            const newUrl = convertYouTubeToSkipCut(link.href);
            if (newUrl) {
                link.href = newUrl;
                link.setAttribute('target', TARGET_TAB_NAME);
            }
        });
    }

    // Run rewrite on page load
    document.addEventListener('DOMContentLoaded', rewriteLinks);

    // Observe DOM changes to rewrite dynamically added links
    const observer = new MutationObserver(rewriteLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    // Intercept clicks to ensure direct opening in TARGET_TAB_NAME
    document.addEventListener('click', e => {
        // Only handle left-clicks without modifier keys
        if (e.button !== 0 || e.ctrlKey || e.shiftKey || e.metaKey) return;

        const a = e.target.closest('a[href]'); // Find closest link
        if (!a) return;

        const newUrl = convertYouTubeToSkipCut(a.href);
        if (!newUrl) return;

        // Prevent normal navigation
        e.preventDefault();
        e.stopImmediatePropagation(); // Stop site scripts like YouTube router

        // Open directly in the named tab
        window.open(newUrl, TARGET_TAB_NAME);
    }, true); // Capture phase to run before site handlers
})();