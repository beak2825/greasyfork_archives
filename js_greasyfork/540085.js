// ==UserScript==
// @name         YouTube: Remove play button from Tab Title
// @namespace    https://greasyfork.org/en/users/924062-teg219
// @version      1.2
// @description  Removes the black play icon YouTube adds to the tab title when a video is playing, for a more classic feel.
// @author       teg219
// @license      MIT
// @match        *://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540085/YouTube%3A%20Remove%20play%20button%20from%20Tab%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/540085/YouTube%3A%20Remove%20play%20button%20from%20Tab%20Title.meta.js
// ==/UserScript==

(function () {
    const cleanTitle = () => {
        if (document.title.startsWith("\u25B6")) {
            document.title = document.title.replace(/^\u25B6\s*/, "");
        }
    };

    new MutationObserver(cleanTitle)
        .observe(document.querySelector('title') ?? document.head, { childList: true, subtree: true });

    document.addEventListener("DOMContentLoaded", cleanTitle);
})();
