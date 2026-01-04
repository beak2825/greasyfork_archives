// ==UserScript==
// @name     海角天涯显示大图
// @description 放大显示海角里的图片，这么小怎么看！
// @include  https://*haijiao.com/*
// @grant    GM_addStyle
// @run-at   document-start
// @version  1.0.5
// @license MIT
// @namespace https://greasyfork.org/users/439775
// @downloadURL https://update.greasyfork.org/scripts/522556/%E6%B5%B7%E8%A7%92%E5%A4%A9%E6%B6%AF%E6%98%BE%E7%A4%BA%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/522556/%E6%B5%B7%E8%A7%92%E5%A4%A9%E6%B6%AF%E6%98%BE%E7%A4%BA%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==

GM_addStyle ( `
    .article img[title="点击查看大图"],
    .mobile .details-body p img {
        max-width: 100% !important;
        max-height:calc(100vh - 4em)!important;
    }

    .html-box.ishide {
        position: static !important;
        overflow: auto !important;
        max-height: none !important;
    }
    .html-box.ishide::before {
        display: none !important;
    }
    .html-bottom-box {
        display: none !important;
    }
` );