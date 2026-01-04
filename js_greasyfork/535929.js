// ==UserScript==
// @name         样式修改插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改指定类名的样式
// @author       你的名字
// @match        https://echotik.shop/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535929/%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/535929/%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建 <style> 标签
    const style = document.createElement('style');

    // 设置 type 属性（虽然现代浏览器默认支持，但为了兼容性可以显式声明）
    style.type = 'text/css';

    // 定义你想要添加的CSS规则
    const cssRules = `
        .arco-carousel-indicator-item {
            background-color: #ffffff !important;
            transform:scale(1.5) !important;
        }
        .arco-carousel-indicator-item-active {
            background-color: #070eff !important;
        }
    `;

    // 将CSS规则添加到 <style> 标签中
    if (style.styleSheet) {
        style.styleSheet.cssText = cssRules;
    } else {
        style.appendChild(document.createTextNode(cssRules));
    }

    // 将 <style> 标签添加到页面的 <head> 中
    document.head.appendChild(style);
})();