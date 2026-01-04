// ==UserScript==
// @name         隐藏gitee智能助手
// @namespace
// @include      *://e.gitee.com
// @include      *://e.gitee.com/*
// @version      0.0.2
// @description  隐藏gitee智能助手/码建仓
// @author       ymzhao
// @namespace 
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535313/%E9%9A%90%E8%97%8Fgitee%E6%99%BA%E8%83%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/535313/%E9%9A%90%E8%97%8Fgitee%E6%99%BA%E8%83%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
GM_addStyle(`
    #topbarBot, /* 顶部菜单 */
    #ge-ai-container, /* 右下角浮窗 */
    .ge-app-ai-ask /* 划词弹框 */
    {
        display: none !important;
    }
`);