// ==UserScript==
// @name         重定向Zol产品到参数详情页
// @namespace    https://www.example.com/
// @version      1.0
// @description  将中关村在线的产品URL重定向到详细参数页。
// @author       Techwb.cn
// @match        https://detail.zol.com.cn/*
// @icon         https://detail.zol.com.cn/favicon.ico
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/460648/%E9%87%8D%E5%AE%9A%E5%90%91Zol%E4%BA%A7%E5%93%81%E5%88%B0%E5%8F%82%E6%95%B0%E8%AF%A6%E6%83%85%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/460648/%E9%87%8D%E5%AE%9A%E5%90%91Zol%E4%BA%A7%E5%93%81%E5%88%B0%E5%8F%82%E6%95%B0%E8%AF%A6%E6%83%85%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面 URL 中的产品编号。
    var originalUrl = window.location.href;
    var phoneId = originalUrl.match(/index(\d+)\.shtml/)[1];

    // 将产品编号拆分成分类部分和编号部分。
    var category = parseInt(phoneId.substr(0, 4)) + 1; // 分类部分是产品编号的前四个数字加 1。
    var id = phoneId.substr(4); // 编号部分是产品编号的剩余数字。

    // 构造新的 URL，并将当前页面重定向到新的 URL。
    var newUrl = "https://detail.zol.com.cn/" + category + "/" + phoneId + "/param.shtml";
    window.location.href = newUrl;
})();
