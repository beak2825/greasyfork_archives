// ==UserScript==
// @name         allporncomic/novelcrow
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  章节详情页显示为画廊
// @author       ssnangua
// @match        https://allporncomic.com/porncomic/*
// @match        https://novelcrow.com/comic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=allporncomic.com
// @require      https://update.greasyfork.org/scripts/545309/1709103/GM_Gallery.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546583/allporncomicnovelcrow.user.js
// @updateURL https://update.greasyfork.org/scripts/546583/allporncomicnovelcrow.meta.js
// ==/UserScript==

(function() {
    if (document.querySelector('.reading-content')) {
        new window.GM_Gallery({
            getGallery() {
                const gallery = Array.from(document.querySelectorAll('.reading-content .wp-manga-chapter-img'))
                .map((img) => img.dataset.src || img.src);
                return gallery
            }
        });
    }
})();