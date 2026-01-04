// ==UserScript==
// @name         删除 文心一言/讯飞星火 的臭水印
// @namespace    https://ikrong.com/
// @version      0.3
// @description  文心一言/讯飞星火界面的 ID水印 也太恶心了吧，如果失效，请留言告知，我会尽快来修复。
// @author       ikrong
// @match        https://yiyan.baidu.com/*
// @match        https://xinghuo.xfyun.cn/desk
// @icon         data:image/png;base64,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
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471101/%E5%88%A0%E9%99%A4%20%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80%E8%AE%AF%E9%A3%9E%E6%98%9F%E7%81%AB%20%E7%9A%84%E8%87%AD%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/471101/%E5%88%A0%E9%99%A4%20%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80%E8%AE%AF%E9%A3%9E%E6%98%9F%E7%81%AB%20%E7%9A%84%E8%87%AD%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.host === 'yiyan.baidu.com') {
        const style = document.createElement("style");
        style.innerHTML = `body>div[style*="important"]{
            transform: rotate(0);
            overflow: hidden;
        }`;
        document.body.appendChild(style);
    } else if (location.host === 'xinghuo.xfyun.cn') {
        const style = document.createElement("style");
        style.innerHTML = `div#watermark-wrapper[class*="chat-window_watermark_wrapper"]{
            display: none !important;
        }`;
        document.body.appendChild(style);
    }
})();