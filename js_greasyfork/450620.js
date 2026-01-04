// ==UserScript==
// @name        e-hentai comment blocker
// @namespace   https://greasyfork.org/scripts/450620
// @version     2.1
// @description Block comment score < 0.
// @author      fmnijk
// @match       https://e-hentai.org/*
// @icon        https://www.google.com/s2/favicons?domain=e-hentai.org
// @grant       GM_addStyle
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/450620/e-hentai%20comment%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/450620/e-hentai%20comment%20blocker.meta.js
// ==/UserScript==

/* main function */
(window.onload = function() {
    'use strict';

    if (window.location.href === 'https://e-hentai.org/'){
        return false;
    }

    // 获取所有带有 class="c1" 的元素
    var c1Elements = document.getElementsByClassName("c1");

    // 遍历所有 c1Elements 元素
    for (var i = 0; i < c1Elements.length; i++) {
        var c1Element = c1Elements[i];

        // 查找每个 c1 元素内部的 score 元素
        var scoreElement = c1Element.querySelector(".c5 span");

        if (scoreElement) {
            // 获取 score 的文本内容并转换为整数
            var score = parseInt(scoreElement.innerText.trim());

            if (score < 0) {
                // 隐藏 c1 元素
                c1Element.style.display = "none";
            }
        }
    }
})();
