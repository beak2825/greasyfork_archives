// ==UserScript==
// @name         YouTube Shorts Remover
// @namespace    https://greasyfork.org/users/1264428-davidh123
// @version      1.0
// @description  Hides the Shorts section from YouTube's homepage and sidebar.
// @author       davidh123
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @noframes
// @homepage     https://greasyfork.org/en/scripts/XXXXX
// @supportURL   https://greasyfork.org/en/users/1264428-davidh123
// @note         Original idea and code inspiration from various open community solutions; adapted by davidh123
// @downloadURL https://update.greasyfork.org/scripts/538521/YouTube%20Shorts%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/538521/YouTube%20Shorts%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hideShorts() {
        const findAncestorElemWithTagName = (elem) => {
            if (!elem || elem.tagName.toLowerCase() === "body") {
                console.warn("Couldn't find Youtube Shorts Section");
                return undefined;
            }
            if (
                elem.tagName.toLowerCase() === "ytd-rich-section-renderer" ||
                elem.tagName.toLowerCase() === "ytd-guide-entry-renderer"
            ) {
                return elem;
            }
            return findAncestorElemWithTagName(elem.parentElement);
        };

        const potentialShortsSectionHeadlineElems = document.querySelectorAll(
            "span#title.style-scope.ytd-rich-shelf-renderer"
        );
        for (const elem of potentialShortsSectionHeadlineElems) {
            if (elem.textContent.trim() === "Shorts") {
                const parentElem = findAncestorElemWithTagName(elem.parentElement);
                if (parentElem) {
                    parentElem.style.display = "none";
                }
            }
        }

        const potentialShortsGuideEntryHeadlineElems = document.querySelectorAll(
            "yt-formatted-string.title.style-scope.ytd-guide-entry-renderer"
        );
        for (const elem of potentialShortsGuideEntryHeadlineElems) {
            if (elem.textContent.trim() === "Shorts") {
                const parentElem = findAncestorElemWithTagName(elem.parentElement);
                if (parentElem) {
                    parentElem.style.display = "none";
                }
            }
        }
    }

    // Initial run
    const observer = new MutationObserver(hideShorts);
    observer.observe(document.body, { childList: true, subtree: true });

    // Delay execution until YouTube loads if needed
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", hideShorts);
    } else {
        hideShorts();
    }
})();
