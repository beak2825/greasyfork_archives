// ==UserScript==
// @name         去除 Ant Design、Element Plus、Naive UI 水印
// @namespace    https://github.com/SihenZhang
// @license      MIT
// @version      2.0.0
// @description  检测 Ant Design、Element Plus、Naive UI 等组件库的水印组件特征，利用组件设计漏洞去除水印
// @author       SihenZhang
// @match        *://**/*
// @icon         https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/494454/%E5%8E%BB%E9%99%A4%20Ant%20Design%E3%80%81Element%20Plus%E3%80%81Naive%20UI%20%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/494454/%E5%8E%BB%E9%99%A4%20Ant%20Design%E3%80%81Element%20Plus%E3%80%81Naive%20UI%20%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM.addStyle(`
        div[style*="z-index"][style*="position"][style*="left: 0"][style*="top: 0"][style*="width: 100%"][style*="height: 100%"][style*="pointer-events: none"][style*="background-repeat: repeat"][style*="background-position"][style*="background-image"],
        .n-watermark {
            display: none !important;
        }
    `)
})();
