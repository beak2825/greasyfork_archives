// ==UserScript==
// @name         虎扑移动端图片缩小
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  把楼中回复图片变成30px
// @author       tao
// @match        https://m.hupu.com/*
// @grant    GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444608/%E8%99%8E%E6%89%91%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%9B%BE%E7%89%87%E7%BC%A9%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/444608/%E8%99%8E%E6%89%91%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%9B%BE%E7%89%87%E7%BC%A9%E5%B0%8F.meta.js
// ==/UserScript==

GM_addStyle ( `
    .show-section {
       width: 30px!important;
    }
    .sign-3 {
       display: none!important;
    }
    .operation-alpha {
       display: none!important;
    }
    .bottom-reply-wrap {
       display: none!important;
    }
` );

document.execCommand = null
