// ==UserScript==
// @name         去除doonsec关注遮盖
// @namespace    https://wechat.doonsec.com/
// @version      0.1
// @description  去除doonsec关注遮盖，不用扫码
// @author       LANVNAL
// @match        https://wechat.doonsec.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535080/%E5%8E%BB%E9%99%A4doonsec%E5%85%B3%E6%B3%A8%E9%81%AE%E7%9B%96.user.js
// @updateURL https://update.greasyfork.org/scripts/535080/%E5%8E%BB%E9%99%A4doonsec%E5%85%B3%E6%B3%A8%E9%81%AE%E7%9B%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 移除元素
    const adElement = document.getElementById('layui-layer1');
    if (adElement) {
        adElement.remove();
    }
    const ad2Element = document.getElementById('layui-layer-shade1');
    if (ad2Element) {
        ad2Element.remove();
    }

    // 移除html标签的style属性
    const htmlElement = document.documentElement;
    if (htmlElement.hasAttribute('style')) {
        htmlElement.removeAttribute('style');
    }
})();