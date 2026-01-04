// ==UserScript==
// @name         [AO3] Bookmarks that Bookmark
// @namespace    https://greasyfork.org/en/users/1138163-dreambones
// @version      1.0
// @description  Bookmarks will automatically add the chapter you left on in the bookmark description.
// @author       DREAMBONES
// @match        http*://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482338/%5BAO3%5D%20Bookmarks%20that%20Bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/482338/%5BAO3%5D%20Bookmarks%20that%20Bookmark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var domainRe = /https?:\/\/archiveofourown\.org\/works\/\d+/i;
    if (domainRe.test(document.URL)) {
        const chapterLabel = document.querySelector("div.chapter.preface.group");
        if (chapterLabel) {
            const input = document.querySelector("div#bookmark-form textarea");
            const chapter = chapterLabel.querySelector("a");
            input.value = `<big>- Left on <a id="script-chapter-placement" href="${chapter.href}">${chapter.innerText}</a> -</big>\n\n${input.value}`; // Change this to whatever you want to display! ${chapter.innerText} is required for listing the actual chapter.
        }
    }
})();