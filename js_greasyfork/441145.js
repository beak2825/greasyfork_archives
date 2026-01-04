// ==UserScript==
// @name        e-hentai auto hyperlink
// @namespace   https://greasyfork.org/scripts/441145
// @version     2.4
// @description e-hentai auto convert urls in gallery comments into hyperlinks
// @author      fmnijk
// @match       https://e-hentai.org/*
// @icon        https://www.google.com/s2/favicons?domain=e-hentai.org
// @grant       none
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/441145/e-hentai%20auto%20hyperlink.user.js
// @updateURL https://update.greasyfork.org/scripts/441145/e-hentai%20auto%20hyperlink.meta.js
// ==/UserScript==

/* main function */
(function() {
    'use strict';
    if (window.location.href === 'https://e-hentai.org/'){
        return false;
    }
    const comments = document.querySelectorAll(".c6");
    comments.forEach(function(comment) {
        let before = comment.innerHTML;
        // 暫時替換 <img> 標籤 因為img標籤裡有url 會被影響
        let imgPlaceholders = [];
        before = before.replace(/<img\b[^>]*>/gi, function(match) {
            imgPlaceholders.push(match);
            return `<!--img-placeholder-${imgPlaceholders.length - 1}-->`;
        });
        before = before.replace(/&amp;/g, '&');

        // 更新的URL正则表达式，支持Unicode字符
        const urlRegex = /(<a\b[^>]*>.*<\/a>)|((https?:\/\/)(?:www\.)?(?:[\w\u00a1-\uffff][\w\u00a1-\uffff-]{0,62})?[\w\u00a1-\uffff]\.(?:[a-z\u00a1-\uffff]{2,6}\.?)+(?:\/(?:[^\s<>"{}|\\^`\[\]])*)?)/gi;

        // 處理 URL
        const after = before.replace(urlRegex, function(match, p1, p2) {
            // Check if the match is already an anchor tag, if so, return it unchanged.
            if (p1) {
                return p1;
            } else {
                // Otherwise, create a new anchor tag.
                return '<a href="' + p2 + '">' + p2 + '</a>';
            }
        });

        // 還原 <img> 標籤
        let finalHTML = after.replace(/<!--img-placeholder-(\d+)-->/g, function(match, index) {
            return imgPlaceholders[parseInt(index)];
        });
        comment.innerHTML = finalHTML;
    });
})();