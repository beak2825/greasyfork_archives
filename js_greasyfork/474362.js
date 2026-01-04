// ==UserScript==
// @name         Poe优化
// @namespace    https://www.yffjglcms.com/
// @version      0.1
// @description  开启Poe宽屏模式
// @author       yffjglcms
// @match        https://poe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poe.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474362/Poe%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/474362/Poe%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // 创建新的<style>标签
    var styleTag = document.createElement("style");
    styleTag.type = "text/css";
    styleTag.id = "yffjglcms-css";

    // 添加要覆盖的样式规则
    var css = `
    div[class^="ChatPageMain_container"] {
        max-width: calc(2*var(--desktop-reading-column-max-width)) !important;
    }

    div[class^="MainColumn_column"] {
        width: 100% !important;
    }

    div[class^="Message_botMessageBubble"] {
        width: calc(2*var(--desktop-reading-column-max-width)) !important;
    }
    `;
    styleTag.appendChild(document.createTextNode(css));

    // 将<style>标签插入到文档头部
    document.head.appendChild(styleTag);

})();