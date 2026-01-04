// ==UserScript==
// @name         Modify Terabox Page on Internal Navigation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  特定の要素を変更・削除する
// @match        https://www.terabox.com/japanese/webmaster
// @run-at       document-end
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522684/Modify%20Terabox%20Page%20on%20Internal%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/522684/Modify%20Terabox%20Page%20on%20Internal%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const modifyPage = () => {
        // class "file-list"内のimgタグのclass "blur"を削除
        const imgElements = document.querySelectorAll('.file-list img.blur');
        imgElements.forEach(img => {
            img.classList.remove('blur');
        });

        // class "adult"のdivをすべて削除
        const adultDivs = document.querySelectorAll('div.adult');
        adultDivs.forEach(div => {
            div.remove();
        });
    };

    // 初回読み込み時に実行
    modifyPage();

    // DOMの変更を監視
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            modifyPage();
        });
    });

    // 監視対象を設定
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
