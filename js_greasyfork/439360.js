// ==UserScript==
// @name         GitHub Trending star 排序回归
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  调整 GitHub Trending 页, 数据排序逻辑
// @author       pozhu
// @include      https://github.com/trending*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439360/GitHub%20Trending%20star%20%E6%8E%92%E5%BA%8F%E5%9B%9E%E5%BD%92.user.js
// @updateURL https://update.greasyfork.org/scripts/439360/GitHub%20Trending%20star%20%E6%8E%92%E5%BA%8F%E5%9B%9E%E5%BD%92.meta.js
// ==/UserScript==

(function () {
    "use strict";
    [...document.getElementsByClassName("Box-row")]
        .map((item) => {
            const reg = /Built by\s+(.+) stars/g;
            const stars = reg.exec(item.innerText)[1].replace(",", "");
            return { stars, node: item };
        })
        .sort((a, b) => b.stars - a.stars)
        .forEach((item) => {
            item.node.parentNode.appendChild(item.node);
        });
})();
