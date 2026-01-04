// ==UserScript==
// @name         贴吧图片、评论自动展开
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @description  点击方法实现贴吧图片、回复自动展开
// @author       NoWorld
// @match        *://tieba.baidu.com/p/*
// @grant        none
// @icon         https://tb3.bdstatic.com/public/icon/favicon-v2.ico
// @downloadURL https://update.greasyfork.org/scripts/504265/%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E3%80%81%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/504265/%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E3%80%81%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 点击实现
    function clickElements(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            if (element) {
                element.click();
            }
        });
    }
    // 点击按钮
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                clickElements('div.replace_tip');
                clickElements('a.j_lzl_m');
            }
        });
    });

    // 加载内容
    observer.observe(document.body, { childList: true, subtree: true });
})();
