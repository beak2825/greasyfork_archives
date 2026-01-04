// ==UserScript==
// @name         QQ Open Link Directly 自动跳转 当前网页非官方页面/已停止访问该网页
// @namespace    https://github.com/willbchang/userscript-qq-open-link-directly/
// @version      1.1.1
// @description  点击 QQ 客户端中的链接后，自动跳转中转提示页 "当前网页非官方页面" 或 "已停止访问该网页" 至原网址
// @author       Will B Chang
// @match        *://c.pc.qq.com/*
// @grant        none
// @license      AGPL-V3
// @downloadURL https://update.greasyfork.org/scripts/466632/QQ%20Open%20Link%20Directly%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%20%E5%BD%93%E5%89%8D%E7%BD%91%E9%A1%B5%E9%9D%9E%E5%AE%98%E6%96%B9%E9%A1%B5%E9%9D%A2%E5%B7%B2%E5%81%9C%E6%AD%A2%E8%AE%BF%E9%97%AE%E8%AF%A5%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/466632/QQ%20Open%20Link%20Directly%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%20%E5%BD%93%E5%89%8D%E7%BD%91%E9%A1%B5%E9%9D%9E%E5%AE%98%E6%96%B9%E9%A1%B5%E9%9D%A2%E5%B7%B2%E5%81%9C%E6%AD%A2%E8%AE%BF%E9%97%AE%E8%AF%A5%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const url = new URL(window.location.href)
    // pfurl 对应 当前网页非官方页面
    // url 对应 已停止访问该网页
    let target = url.searchParams.get('pfurl') || url.searchParams.get('url')
    if (target.endsWith('//')) target = target.slice(0, -1)
    window.location.href = target;
})();