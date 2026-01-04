// ==UserScript==
// @name         BOC中国银行借记卡取消时间限制
// @namespace    https://nyaruko.love/?boc
// @version      0.1
// @license      GPLv3
// @description  去除BOC营业时间限制
// @author       https://github.com/qcminecraft
// @match        https://cloud.bankofchina.com/*
// @grant        none
// @icon         https://avatars3.githubusercontent.com/u/25388328
// @require      https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/401809/BOC%E4%B8%AD%E5%9B%BD%E9%93%B6%E8%A1%8C%E5%80%9F%E8%AE%B0%E5%8D%A1%E5%8F%96%E6%B6%88%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/401809/BOC%E4%B8%AD%E5%9B%BD%E9%93%B6%E8%A1%8C%E5%80%9F%E8%AE%B0%E5%8D%A1%E5%8F%96%E6%B6%88%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#keepOut").remove();
    $("h2.swal2-title").text("当前不在服务时间内，不过我们已经帮您绕过了");
})();