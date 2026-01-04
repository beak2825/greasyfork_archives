// ==UserScript==
// @name         さくら動画 URL自動挿入
// @namespace    https://greasyfork.org/ja/users/1441620-crawler
// @version      1.6
// @description  「動画URL」欄に現在のページのURLを自動で入力
// @author       crawler
// @license      MIT
// @match        https://sakudo.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533242/%E3%81%95%E3%81%8F%E3%82%89%E5%8B%95%E7%94%BB%20URL%E8%87%AA%E5%8B%95%E6%8C%BF%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/533242/%E3%81%95%E3%81%8F%E3%82%89%E5%8B%95%E7%94%BB%20URL%E8%87%AA%E5%8B%95%E6%8C%BF%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function tryInsertURL(retry = 10) {
        const displayBox = document.querySelector('center input[type="text"][value^="https://sakudo.in/?id="]');
        const inputBox = document.querySelector('input[type="url"][name="file"]');
        if (displayBox && inputBox) {
            inputBox.value = displayBox.value;
        } else if (retry > 0) {
            setTimeout(() => tryInsertURL(retry - 1), 50);
        }
    }
    tryInsertURL();
})();