// ==UserScript==
// @name         号内搜原页面不跳转
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  解决“号内搜”PC端网页打开检索出的微信链接（新标签页打开）会导致原页面也跟着跳转的问题。
// @author       Brayden
// @license      AGPL-3.0-or-later
// @icon         data:image/png;base64, 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
// @match        https://data.newrank.cn/m/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485561/%E5%8F%B7%E5%86%85%E6%90%9C%E5%8E%9F%E9%A1%B5%E9%9D%A2%E4%B8%8D%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/485561/%E5%8F%B7%E5%86%85%E6%90%9C%E5%8E%9F%E9%A1%B5%E9%9D%A2%E4%B8%8D%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 函数：将所有元素的data-url设置为"#"
    function setDataUrlToHash() {
        const elements = document.querySelectorAll('[data-url]');
        elements.forEach(element => {
            element.setAttribute('data-url', 'javascript:void(0);');
        });
    }

    // 首次执行函数来更新当前元素
    setDataUrlToHash();

    // 使用MutationObserver来观察后续的DOM变更
    const observer = new MutationObserver(mutations => {
        // 对每次DOM变更都执行setDataUrlToHash
        setDataUrlToHash();
    });

    // 开始观察body元素及其子元素的变更
    observer.observe(document.body, { childList: true, subtree: true });
})();

