// ==UserScript==
// @name         防别人知道你在看知乎,删除知乎固定的标题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       gagayuan
// @match        https://www.zhihu.com/*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/386928/%E9%98%B2%E5%88%AB%E4%BA%BA%E7%9F%A5%E9%81%93%E4%BD%A0%E5%9C%A8%E7%9C%8B%E7%9F%A5%E4%B9%8E%2C%E5%88%A0%E9%99%A4%E7%9F%A5%E4%B9%8E%E5%9B%BA%E5%AE%9A%E7%9A%84%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/386928/%E9%98%B2%E5%88%AB%E4%BA%BA%E7%9F%A5%E9%81%93%E4%BD%A0%E5%9C%A8%E7%9C%8B%E7%9F%A5%E4%B9%8E%2C%E5%88%A0%E9%99%A4%E7%9F%A5%E4%B9%8E%E5%9B%BA%E5%AE%9A%E7%9A%84%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("div.PageHeader").remove();
    $("div.Sticky").remove();
    $("svg.ZhihuLogo").remove();
    $("button.Button--blue").css("background-color","#ebebeb").css("border-color","#ebebeb");
    $("button.VoteButton").css("color","#b8adad").css("background","#f6f6f6");
})();