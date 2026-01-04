// ==UserScript==
// @description 自动填写举报模板
// @icon https://www.douyu.com/favicon.ico
// @name 斗鱼巡管模板
// @version 1.0
// @match https://www.douyu.com/member/report/*
// @match http://www.douyu.com/member/report/*
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @namespace https://greasyfork.org/users/8899
// @downloadURL https://update.greasyfork.org/scripts/380547/%E6%96%97%E9%B1%BC%E5%B7%A1%E7%AE%A1%E6%A8%A1%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/380547/%E6%96%97%E9%B1%BC%E5%B7%A1%E7%AE%A1%E6%A8%A1%E6%9D%BF.meta.js
// ==/UserScript==

var workNumber = 745;

$(function() {
    $('textarea[name="reason"]').val('编号：' + workNumber + '\n违规原因：');
});
