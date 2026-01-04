// ==UserScript==
// @name         Twicas Keyboard Shortcut
// @namespace    me.nzws.us.twicas_keyboard_shortcut
// @version      1.0.1
// @description  ツイキャスにキーボードショートカットを追加します
// @author       nzws
// @match        https://twitcasting.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386478/Twicas%20Keyboard%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/386478/Twicas%20Keyboard%20Shortcut.meta.js
// ==/UserScript==

const $ = q => document.querySelector(q);

(function() {
    // 配信ページ: Ctrl (または command) + Enterでコメントを投稿
    const commentTextArea = $('.tw-comment-post .tw-textarea');
    if (commentTextArea) {
        commentTextArea.onkeyup = e => {
            if (e.keyCode === 13 && (e.metaKey || e.ctrlKey)) {
                $('.tw-comment-post-operations .tw-button-primary').click();
            }
        };
    }
})();