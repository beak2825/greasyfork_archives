// ==UserScript==
// @name         公众号替换高清图
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  公众号图片替换
// @author       mumumi
// @match        *://mp.weixin.qq.com/s*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/474737/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%9B%BF%E6%8D%A2%E9%AB%98%E6%B8%85%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/474737/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%9B%BF%E6%8D%A2%E9%AB%98%E6%B8%85%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('img[data-src^="https://mmbiz.qpic.cn/"]').forEach(i => i.src = i.dataset.src.replace(/^([^?]+\/)\d+$/, '$1').replace(/\/\d+\?/, '/?'));
    console.log('已替换高清图@mumumi');
})();