// ==UserScript==
// @name         bilibili 专栏高清图片
// @namespace    https://github.com/xfl03
// @version      0.3
// @license      GPL-v3.0
// @description  在 bilibili 专栏中显示高清图片
// @author       xfl03
// @match        https://www.bilibili.com/read/cv*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/457403/bilibili%20%E4%B8%93%E6%A0%8F%E9%AB%98%E6%B8%85%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/457403/bilibili%20%E4%B8%93%E6%A0%8F%E9%AB%98%E6%B8%85%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(".normal-img:hover{cursor: zoom-in;}");

    const imageRegex = /\/\/i0.hdslb.com\/bfs\/article\/(\w+)\.(png|jpg|gif)@(\w+)\.webp/;
    const imageFunction = function (image) {
        const src = image.getAttribute('src');
        if (!src) return;
        const m = src.match(imageRegex);
        if (m) {
            const newSrc = `//i0.hdslb.com/bfs/article/${m[1]}.${m[2]}`;
            image.setAttribute('src', newSrc);
            image.setAttribute('onclick', `window.open('${newSrc}')`);
        }
    }

    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === "attributes") {
                const image = mutation.target;
                imageFunction(image);
            }
        }
    };

    //https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/observe
    const option = { subtree: true, childList: false, attributes: true, attributeFilter: ["src"] };
    const targetNode = document.getElementById('article-content');
    //监听src属性变化
    new MutationObserver(callback).observe(targetNode, option);
})();