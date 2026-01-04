// ==UserScript==
// @name         Hide Otobanana comments
// @namespace    https://x.com/rin_jugatla
// @version      2024-09-12
// @description  otobananaのコメントを非表示にします
// @author       rin_jugatla
// @match        https://otobanana.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=otobanana.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507932/Hide%20Otobanana%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/507932/Hide%20Otobanana%20comments.meta.js
// ==/UserScript==

/**
 * タイトルタグを監視
 * 
 * タイトルに変更があったときのみコメントの非表示を試みる
 */
const watchTitle = () => {
    const observer = new MutationObserver(() => { hideComments(); });
    const titleElement = document.querySelector('title');
    if (!titleElement) { return; }

    observer.observe(titleElement, { childList: true });
}

/**
 * コメント欄を非表示に変更
 */
const hideComments = () => {
    const commentElements = document.getElementsByClassName("comment-container");
    if (!commentElements) { return; }

    const element = commentElements[0];
    if (!element) { return; }

    element.style.display = 'none';
}

(function () {
    'use strict';

    watchTitle();
})();
