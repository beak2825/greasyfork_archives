// ==UserScript==
// @name         Keys for chapter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Navigate between chapters using arrow keys
// @license MIT
// @author       Blue
// @match        https://mtlarchive.com/*
// @include      https://trxs.me/tongren/*/*.html
// @include      https://trxs.cc/tongren/*/*.html
// @include      https://www.tongrenquan.org/tongren/*/*.html
// @include      https://www.powanjuan.cc/tongren/*/index/*.html
// @include      https://www.qbtr.cc/tongren/*/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495041/Keys%20for%20chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/495041/Keys%20for%20chapter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Chapter navigation script initialized.');

    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 37 || event.keyCode === 39) {
            const offset = event.keyCode === 37 ? -1 : 1;
            navigateToChapter(offset);
        }
    });

    function navigateToChapter(offset) {
        if (window.location.href.startsWith("https://mtlarchive.com/")) {
            const chapterLinkText = offset === -1 ? "Previous Chapter" : "Next Chapter";
            const chapterLink = findChapterLink(chapterLinkText);
            if (chapterLink) chapterLink.click();
        } else {
            const currentURL = window.location.href;
            const nextChapterNumber = parseInt(currentURL.match(/(\d+)\.html$/)[1]) + offset;
            if (nextChapterNumber > 0) {
                const nextChapterURL = currentURL.replace(/\d+\.html$/, nextChapterNumber + '.html');
                window.location.href = nextChapterURL;
            } else {
                console.log('No previous chapter available');
            }
        }
    }

    function findChapterLink(text) {
        const links = document.querySelectorAll('.btn-container .btn-action span');
        for (let i = 0; i < links.length; i++) {
            if (links[i].textContent.includes(text)) {
                return links[i].closest('.btn-action');
            }
        }
        return null;
    }

})();
