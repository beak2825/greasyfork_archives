// ==UserScript==
// @name         知乎直链
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  知乎内直接跳转链接，不用被拦截，5秒刷新一次
// @author       Movelocity
// @license      MIT License
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @exclude      https://www.zhihu.com/signin*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465773/%E7%9F%A5%E4%B9%8E%E7%9B%B4%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/465773/%E7%9F%A5%E4%B9%8E%E7%9B%B4%E9%93%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 默认站外直链，来自: https://greasyfork.org/zh-CN/scripts/419081-%E7%9F%A5%E4%B9%8E%E5%A2%9E%E5%BC%BA/code
    function directLink () {
        document.querySelectorAll('a.external[href*="link.zhihu.com/?target="], a.LinkCard[href*="link.zhihu.com/?target="]:not(.MCNLinkCard):not(.ZVideoLinkCard):not(.ADLinkCardContainer)')
            .forEach((_this) => {
            _this.href = decodeURIComponent(
                _this.href.substring(
                    _this.href.indexOf('link.zhihu.com/?target=') + 23)
            );
        });
        // 对href进行子字符串替换,截取掉"link.zhihu.com/?target="字符串之前的部分，以获得真正的目标链接
    }
    directLink(); // 加载时先执行一次
    setInterval(directLink, 5000);  // 5秒检查一次
})();