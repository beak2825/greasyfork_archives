// ==UserScript==
// @name         ツイキャス: Ctrl+Enter でコメントしたい
// @namespace    me.nzws.twicas.ctrl-enter
// @version      1.0.1
// @description  キーバインドはしろ！！！！！！！！！！！！！！
// @author       nzws_me
// @match        https://twitcasting.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448183/%E3%83%84%E3%82%A4%E3%82%AD%E3%83%A3%E3%82%B9%3A%20Ctrl%2BEnter%20%E3%81%A7%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%97%E3%81%9F%E3%81%84.user.js
// @updateURL https://update.greasyfork.org/scripts/448183/%E3%83%84%E3%82%A4%E3%82%AD%E3%83%A3%E3%82%B9%3A%20Ctrl%2BEnter%20%E3%81%A7%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%97%E3%81%9F%E3%81%84.meta.js
// ==/UserScript==

const doBind = () => {
    const post = document.querySelector('.tw-comment-post textarea');
    const button = document.querySelector('.tw-comment-post .tw-comment-post-operations button.tw-button-primary');
    if (!post || !button) {
        return;
    }

    post.addEventListener("keydown", event => {
        const meta = event.metaKey || event.ctrlKey;
        if (meta && event.code === 'Enter') {
            button.click();
        }
    });
};

(function() {
    'use strict';

    doBind();
})();
