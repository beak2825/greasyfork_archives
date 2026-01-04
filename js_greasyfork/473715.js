// ==UserScript==
// @name         巨量百应
// @license      GPL License
// @namespace    https://bytedance.com
// @version      0.3
// @description  让飞书文档不受权限限制，可以复制任意内容，可以打开右键菜单(复制下载图片)
// @author       NOABC
// @match        *://*.jinritemai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/473715/%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/473715/%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94.meta.js
// ==/UserScript==
(function () {
    var url0 = window.location.href;
    var reg = new RegExp('(^|&)' + 'uid' + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    var uid=unescape(r[2]);
    window.location.href='https://buyin.jinritemai.com/dashboard/servicehall/daren-profile?uid=%27+uid';
})();