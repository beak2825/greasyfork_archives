// ==UserScript==
// @name         在洛谷，享受 Copy 的欢乐！
// @namespace    https://www.luogu.com.cn/user/545986
// @version      1.0
// @description  将洛谷底部文本修改为"享受 Copy 的欢乐"
// @author       Jerrycyx & OpenAI-ChatGPT
// @match        https://www.luogu.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465920/%E5%9C%A8%E6%B4%9B%E8%B0%B7%EF%BC%8C%E4%BA%AB%E5%8F%97%20Copy%20%E7%9A%84%E6%AC%A2%E4%B9%90%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/465920/%E5%9C%A8%E6%B4%9B%E8%B0%B7%EF%BC%8C%E4%BA%AB%E5%8F%97%20Copy%20%E7%9A%84%E6%AC%A2%E4%B9%90%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const target = document.evaluate('/html/body/div[1]/div[2]/div[2]/div[2]/div[1]/text()[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (target) {
        target.textContent = "享受 Copy 的欢乐";
    }
})();
