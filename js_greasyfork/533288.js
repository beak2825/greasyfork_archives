// ==UserScript==
// @name         osu! Source to Bangumi Search
// @namespace    https://osu.ppy.sh/users/15416101
// @version      1.1
// @description  Add a Bangumi search link next to osu! beatmap source link
// @author       trytodupe, ChatGPT
// @match        https://osu.ppy.sh/beatmapsets/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533288/osu%21%20Source%20to%20Bangumi%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/533288/osu%21%20Source%20to%20Bangumi%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addBangumiLink() {
        const sourceLinks = document.querySelectorAll('a[href*="https://osu.ppy.sh/beatmapsets?q=source"]');

        sourceLinks.forEach(link => {
            if (link.dataset.bgmAdded) return;

            const sourceText = link.textContent.trim();
            const bangumiUrl = `https://bangumi.tv/subject_search/${encodeURIComponent(sourceText)}`;

            const bgmLink = document.createElement('a');
            bgmLink.href = bangumiUrl;
            bgmLink.textContent = '[search on bgm]';
            bgmLink.target = '_blank';
            bgmLink.className = link.className;

            const separator = document.createTextNode(' ');
            link.parentElement.appendChild(separator);
            link.parentElement.appendChild(bgmLink);

            link.dataset.bgmAdded = 'true';
        });
    }

    const observer = new MutationObserver(() => {
        addBangumiLink();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    let currentUrl = location.href;
    setInterval(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            setTimeout(() => addBangumiLink(), 500);
        }
    }, 500);

    addBangumiLink();
})();
