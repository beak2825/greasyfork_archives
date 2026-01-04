// ==UserScript==
// @name         Acg港湾网站点击状态
// @namespace    viemean
// @version      0.1
// @description  显示Acg港湾链接是否被点击过，点击前为绿色，点击后为灰色修改自https://sleazyfork.org/zh-CN/scripts/415726-eh%E9%98%85%E8%AF%BB%E7%8A%B6%E6%80%81
// @author       Viemean
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acggw.me
// @match        *://www.acggw.me/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/532338/Acg%E6%B8%AF%E6%B9%BE%E7%BD%91%E7%AB%99%E7%82%B9%E5%87%BB%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/532338/Acg%E6%B8%AF%E6%B9%BE%E7%BD%91%E7%AB%99%E7%82%B9%E5%87%BB%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

GM_addStyle(`
.list-body a::before,
.url-body a::before {
    content: "●";
    color: #1a9317;
    padding-right: 4px;
}

.list-body a:visited::before,
.url-body a:visited::before {
    color: #aaa;
}`);