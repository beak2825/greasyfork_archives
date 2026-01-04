// ==UserScript==
// @name         幻影坦克吧-鼠标移上图片显示里图
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  emm...方便电脑上浏览幻影坦克吧...
// @author       You
// @match        https://tieba.baidu.com/p/*
// @icon         https://tb3.bdstatic.com/public/icon/favicon-v2.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481583/%E5%B9%BB%E5%BD%B1%E5%9D%A6%E5%85%8B%E5%90%A7-%E9%BC%A0%E6%A0%87%E7%A7%BB%E4%B8%8A%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA%E9%87%8C%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/481583/%E5%B9%BB%E5%BD%B1%E5%9D%A6%E5%85%8B%E5%90%A7-%E9%BC%A0%E6%A0%87%E7%A7%BB%E4%B8%8A%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA%E9%87%8C%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const title = document.querySelector('.card_title_fname');
    if (title && title.innerText.trim().endsWith('幻影坦克吧')) {
        GM_addStyle(`img.BDE_Image:hover { background: #000; }`);
    }
})();