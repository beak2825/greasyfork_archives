// ==UserScript==
// @name         哔哩哔哩（B站）评论区显示楼层
// @description  原功能已失效，请停止使用以避免可能存在的追究措施。脚本功能已改动为：更好看的回复按钮
// @author       lchzh3473 , Modify by Tinhone
// @namespace    Original by lchzh3473 , Modify by Tinhone
// @license      GPL-3.0
// @version      1.9.2
// @icon         https://app.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @compatible   firefox V84+
// @compatible   edge V88+
// @compatible   chrome V88+
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/read/cv*
// @match        *://t.bilibili.com/*
// @match        *://space.bilibili.com/*
// @match        *://www.bilibili.com/bangumi/play/*
// @downloadURL https://update.greasyfork.org/scripts/443543/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88B%E7%AB%99%EF%BC%89%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%98%BE%E7%A4%BA%E6%A5%BC%E5%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/443543/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88B%E7%AB%99%EF%BC%89%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%98%BE%E7%A4%BA%E6%A5%BC%E5%B1%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("原功能已失效，请停止使用以避免可能存在的追究措施。脚本功能已改动为：更好看的回复按钮")
    GM_addStyle(`
        /*[回复]按钮*/
        div.info > span.reply.btn-hover{
            height: 16px !important;
            padding-top: 2px !important;
            padding-bottom: 2px !important;
        }
    `)
})();