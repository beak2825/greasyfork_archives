// ==UserScript==
// @name         🔥 持续更新 🔥 去除百度翻译页面中的多余广告和元素
// @version      0.3.1
// @description  去除百度翻译页面中的多余广告和元素。
// @author       WengX
// @namespace    https://github.com/iwengx
// @supportURL   https://gist.github.com/iwengx/be2d30e6a9cb3cfa9dda53a8910e3b4c
// @match        *://fanyi.baidu.com/*
// @icon         https://img1.imgtp.com/2023/02/25/YCeeiEQ1.png
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460701/%F0%9F%94%A5%20%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%20%F0%9F%94%A5%20%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%A4%9A%E4%BD%99%E5%B9%BF%E5%91%8A%E5%92%8C%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/460701/%F0%9F%94%A5%20%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%20%F0%9F%94%A5%20%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%A4%9A%E4%BD%99%E5%B9%BF%E5%91%8A%E5%92%8C%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==


(function() {
    'use strict';

    /** 旧版 百度翻译 */
    const purge_css = `
       #app-read,
       #transOtherRight,
       .footer,
       .extra-wrap,
       .op-trans-fb,
       .nav-dxy-logo,
       .nav-sort-btn,
       .new-icon-btn,
       .dictionary-tags,
       .note-expand-btn,
       .manual-trans-btn,
       .dictionary-bottom,
       .navigation-wrapper,
       .new-domain-wrapper:before,
       .file-icon,
       .ai-trans-btn
       {
           display: none !important;
       }
    `
    GM_addStyle(purge_css);

    /** 新版 百度翻译（貌似采用了 css in js 的方案，所以样式名称类似加密文本） */
    const purge_cssinjs = `
       .cfm52tbf,
       .jygLSCYa,
       .h5JHRvHF,
       .nhcoTCy6,
       .UMjeGiEI,
       .n_FWnYmI,
       .RAbZsoLs,
       .sF3Yx_p0,
       ._m6jE1Mj,
       .Hu5qsRSB,
       .ZqJhu4sT,
       .UzOvH9bK,
       .Q35HUe2H,
       .DzKgtddY
       {
           display: none !important;
       }
    `
    GM_addStyle(purge_cssinjs);

    /** 自定义样式 */
    const custom_css = `
        .trans-other-wrap-left-part { width: 100% !important; }
        #side-nav .nav-ol .nav-search-again,
        #side-nav .nav-item { font-weight: unset; }
        #side-nav .nav-item span { color: rgb(0 0 0 / 45%); }
    `
    GM_addStyle(custom_css);
})();