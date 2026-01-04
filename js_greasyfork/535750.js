// ==UserScript==
// @name                YouTube – Prevent Scrolling to Top When Clicking Timestamps
// @name:zh-TW          YouTube - 點擊留言時間戳記時防止捲動到最上方
// @namespace           https://github.com/micr0dust
// @version             1.0.0
// @description         Prevents YouTube from scrolling to the top when clicking timestamps in comments. This makes it easier to use picture-in-picture mode while reading comments, without being pulled back to the top of the page.
// @description:zh-tw   點留言時間戳記時不讓頁面自動捲動到最上方，這樣就能開子母畫面看留言，又不用擔心點時間戳記會被拉到最上面。
// @match               https://www.youtube.com/*
// @grant               none
// @icon                https://www.google.com/s2/favicons?domain=youtube.com
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/535750/YouTube%20%E2%80%93%20Prevent%20Scrolling%20to%20Top%20When%20Clicking%20Timestamps.user.js
// @updateURL https://update.greasyfork.org/scripts/535750/YouTube%20%E2%80%93%20Prevent%20Scrolling%20to%20Top%20When%20Clicking%20Timestamps.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (history.scrollRestoration) {
        try {
            history.scrollRestoration = 'manual';
        } catch (ex) {
            // ignore error
        }
    }

    const observer = new MutationObserver(() => {
        const commentSection = document.querySelector('ytd-comments');
        if (commentSection) {
            observer.disconnect();
            attachListeners();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function attachListeners() {
        document.body.addEventListener('click', function (e) {
            const link = e.target.closest('a');
            if (!link || !link.href || !link.href.includes('t=') || !link.href.includes('/watch?v=')) {
                return;
            }

            const commentsContainer = document.querySelector('ytd-comments');
            if (commentsContainer && commentsContainer.contains(link)) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation(); // key point：prevent other handlers from listening

                const url = new URL(link.href);
                const timeStr = url.searchParams.get('t');
                if (!timeStr) return;

                const seconds = parseTime(timeStr);
                if (isNaN(seconds)) return;

                const video = document.querySelector('video.html5-main-video');
                if (video) {
                    video.currentTime = seconds;
                    video.play().catch(() => {});
                }
            }
        }, true);
    }

    function parseTime(t) {
        if (!t) return 0;
        if (/^\d+$/.test(t)) {
            return parseInt(t, 10);
        }
        const regex = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/;
        const match = t.match(regex);
        if (!match) return 0;
        const h = parseInt(match[1] || '0', 10);
        const m = parseInt(match[2] || '0', 10);
        const s = parseInt(match[3] || '0', 10);
        return h * 3600 + m * 60 + s;
    }
})();