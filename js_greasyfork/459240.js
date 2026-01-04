// ==UserScript==
// @name         知乎去掉知乎图标
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  去掉左上角知乎图标
// @author       Le
// @match        https://www.zhihu.com/*
// @icon         https://www.zhihu.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459240/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E6%8E%89%E7%9F%A5%E4%B9%8E%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/459240/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E6%8E%89%E7%9F%A5%E4%B9%8E%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==

(function() {
    console.log('去掉图标开始');
    for(var a of document.querySelectorAll("[aria-label^='知乎']")){
        a.remove();
    }
    console.log('去掉图标结束');
})();