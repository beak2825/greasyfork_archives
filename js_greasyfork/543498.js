// ==UserScript==
// @name         GitCode Blog 文章遮罩自動移除
// @version      1.0
// @namespace    ani20168
// @description  自動解除 blog.gitcode.com 文章閱讀限制
// @match        https://blog.gitcode.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543498/GitCode%20Blog%20%E6%96%87%E7%AB%A0%E9%81%AE%E7%BD%A9%E8%87%AA%E5%8B%95%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/543498/GitCode%20Blog%20%E6%96%87%E7%AB%A0%E9%81%AE%E7%BD%A9%E8%87%AA%E5%8B%95%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 處理文章內容高度與遮罩
     */
    function unlockArticle() {
        // 調整內容高度
        var readme = document.getElementById('readme');
        if (readme && readme.style.maxHeight === "600px") {
            readme.style.maxHeight = "60000px";
        }
        // 隱藏遮罩
        var mask = document.querySelector('.blog-content-detail-mask');
        if (mask) {
            mask.style.display = "none";
        }
    }
    unlockArticle();
})();

