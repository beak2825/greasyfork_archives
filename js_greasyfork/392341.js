// ==UserScript==
// @name         程序猿DD全文阅读
// @namespace    https://github.com/LazyBug1E0CF
// @version      0.1
// @description  直接全文阅读程序猿DD的文章
// @author       Lazybug
// @match        http://blog.didispace.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392341/%E7%A8%8B%E5%BA%8F%E7%8C%BFDD%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/392341/%E7%A8%8B%E5%BA%8F%E7%8C%BFDD%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 显示全文
    let articleEle = document.querySelector("article");
    articleEle.style.height = '';

    // 删除阅读全文按钮
    let rme = document.querySelector("#read-more-wrap");
    rme.parentElement.removeChild(rme);
})();