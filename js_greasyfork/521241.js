// ==UserScript==
// @name         YouTube Chapter Title to Page Title
// @namespace    https://greasyfork.org/en/users/1413127-tumoxep
// @version      1.0
// @description  Displays the current chapter title of a YouTube video in the page title, scrolling if necessary.
// @match        https://www.youtube.com/watch*
// @license      WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521241/YouTube%20Chapter%20Title%20to%20Page%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/521241/YouTube%20Chapter%20Title%20to%20Page%20Title.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let scrollIndex = 0;
    let currentChapterTitle = '';
    const isScrollingEnabled = true;

    function updateTitle() {
        let chapterElement = document.querySelector('.ytp-chapter-title-content');
        if (!chapterElement?.textContent) {
            chapterElement = document.querySelector("#title yt-formatted-string");
        }
        if (chapterElement) {
            const newTitle = chapterElement.textContent.trim();
            if (newTitle !== currentChapterTitle) {
                currentChapterTitle = newTitle;
                scrollIndex = 0;
            }

            const maxLength = 20; // Adjust based on your preference
            if (currentChapterTitle.length > maxLength && isScrollingEnabled) {
                const displayedTitle = currentChapterTitle.substring(scrollIndex, scrollIndex + maxLength);
                document.title = displayedTitle;

                scrollIndex++;
                if (scrollIndex > currentChapterTitle.length - maxLength) {
                    scrollIndex = 0;
                }
                setTimeout(updateTitle, 600); // this one too
                return;
            } else {
                document.title = currentChapterTitle;
            }
        }
        setTimeout(updateTitle, 2000); // and this one
    }

    updateTitle();
})();
