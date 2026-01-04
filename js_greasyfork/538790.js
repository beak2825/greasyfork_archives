// ==UserScript==
// @name         Soutong Forum Read Marker
// @namespace    https://felixchristian.dev/userscripts/soutong-read-marker
// @version      1.0.5
// @description  给搜同网站的帖子标题添加已读标识
// @author       FelixChristian
// @license      MIT
// @match        https://soutong.men/forum.php?mod=forumdisplay&fid=*
// @match        https://soutong.men/forum.php?mod=viewthread&tid=*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/538790/Soutong%20Forum%20Read%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/538790/Soutong%20Forum%20Read%20Marker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'visitedTids';
    let visitedTids = GM_getValue(STORAGE_KEY, {});

    const url = new URL(location.href);
    const mod = url.searchParams.get('mod');

    if (mod === 'viewthread') {
        const tid = url.searchParams.get('tid');
        if (tid) {
            visitedTids[tid] = Date.now();
            GM_setValue(STORAGE_KEY, visitedTids);
        }
        return;
    }

    if (mod === 'forumdisplay') {
        const tryMark = () => {
            const threadLinks = document.querySelectorAll('a.xst');

            if (threadLinks.length === 0) {
                setTimeout(tryMark, 500);
                return;
            }

            threadLinks.forEach(link => {
                const href = link.getAttribute('href');
                let tid;

                try {
                    const fullUrl = new URL(href, location.origin);
                    tid = fullUrl.searchParams.get('tid');
                } catch (e) {
                    return;
                }

                if (tid && visitedTids[tid] && !link.dataset.markedVisited) {
                    const tag = document.createElement('span');
                    tag.textContent = '[已读] ';
                    tag.style.color = 'red';
                    tag.style.fontWeight = 'bold';
                    tag.style.marginRight = '4px';
                    link.insertBefore(tag, link.firstChild); // ✅ 标记放左边
                    link.dataset.markedVisited = 'true';
                }
            });
        };

        window.addEventListener('load', tryMark);
        const observer = new MutationObserver(tryMark);
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
