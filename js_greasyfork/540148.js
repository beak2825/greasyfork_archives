// ==UserScript==
// @name         解除微信、腾讯客服页面文本选择限制
// @namespace    http://tampermonkey.net/
// @version      2025-06-20
// @description  解除kf.qq.com、mp.weixin.qq.com页面的文本选择限制，允许自由选择和复制文本。内容来自deepseek。
// @author       Guoiaong
// @match        *://kf.qq.com/*
// @match        *://mp.weixin.qq.com/*
// @icon         https://mp.weixin.qq.com/favicon.ico
// @license      MIT
// @grant        none
// @note         微信通知跳转的页面不允许选择文本，让 deepseek 编写了这样的一个脚本。顺便添加微信公众号页面。
// @note         测试页面 1 ： [公众号被系统冻结问题汇总 - 腾讯客服](https://kf.qq.com/touch/socialappfaq/1803076rua63180307yumQvU.html)
// @note         测试页面 2 ： [以旧换新“国补”将持续！中央资金将分批下达](https://mp.weixin.qq.com/s/xQRuVxeE-SdXeZm7nm7cjw)
// @downloadURL https://update.greasyfork.org/scripts/540148/%E8%A7%A3%E9%99%A4%E5%BE%AE%E4%BF%A1%E3%80%81%E8%85%BE%E8%AE%AF%E5%AE%A2%E6%9C%8D%E9%A1%B5%E9%9D%A2%E6%96%87%E6%9C%AC%E9%80%89%E6%8B%A9%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/540148/%E8%A7%A3%E9%99%A4%E5%BE%AE%E4%BF%A1%E3%80%81%E8%85%BE%E8%AE%AF%E5%AE%A2%E6%9C%8D%E9%A1%B5%E9%9D%A2%E6%96%87%E6%9C%AC%E9%80%89%E6%8B%A9%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 移除阻止文本选择的事件监听器
    document.addEventListener('selectstart', function(e) {
        e.stopPropagation();
    }, true);

    // 移除阻止复制的事件监听器
    document.addEventListener('copy', function(e) {
        e.stopPropagation();
    }, true);

    // 修改CSS样式以允许选择
    const css = `
        * {
            user-select: auto !important;
            -webkit-user-select: auto !important;
            -moz-user-select: auto !important;
            -ms-user-select: auto !important;
        }
    `;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // 移除可能存在的禁用选择的属性
    document.body.removeAttribute('onselectstart');
    document.body.removeAttribute('oncopy');
})();