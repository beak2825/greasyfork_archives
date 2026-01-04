// ==UserScript==
// @name         YouTube Comment Remover
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  YouTubeのコメント欄を非表示にする
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/530820/YouTube%20Comment%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/530820/YouTube%20Comment%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        const comments = document.getElementById('comments');
        if (comments) {
            comments.style.display = 'none';
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
