"use strict";
// ==UserScript==
// @name         屏蔽复制版权信息
// @namespace    https://raw.githubusercontent.com/Fog3211/tampermonkey/gh-pages/remove-clipboard-copyright.js
// @version      0.0.6
// @license      MIT
// @description  在力扣、知乎网站屏蔽复制版权信息
// @author       Fog3211
// @match        https://leetcode-cn.com/*
// @match        https://leetcode.cn/*
// @match        https://*.zhihu.com/*
// @match        https://*.jianshu.com/*
// @match        https://*.juejin.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460061/%E5%B1%8F%E8%94%BD%E5%A4%8D%E5%88%B6%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/460061/%E5%B1%8F%E8%94%BD%E5%A4%8D%E5%88%B6%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==
(function () {
    "use strict";
    const handleCopy = (e) => {
        e.preventDefault(); //阻止默认事件
        e.stopImmediatePropagation(); // 在执行完当前事件处理程序之后，停止当前节点以及所有后续节点的事件处理程序的运行
        const selected = window.getSelection();
        if (selected) {
            const clipboard = e.clipboardData;
            if (clipboard) {
                clipboard.setData("Text", selected.toString());
            }
        }
    };
    document.addEventListener('copy', handleCopy);
})();
