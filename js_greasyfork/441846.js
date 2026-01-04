// ==UserScript==
// @name         新页面打开
// @namespace    digicol.taozhiyu.gitee.io
// @version      0.1
// @description  数字博物馆新页面打开内容
// @author       涛之雨
// @match        https://digicol.dpm.org.cn/*
// @icon         https://digicol.dpm.org.cn/images/favicon.ico
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441846/%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/441846/%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

/* global $*/
(function() {
    'use strict';
    unsafeWindow.todetail=function(id, page) {
        var sourceFrom = $("#sourceFrom").val();
        var tid = $("#topicId").val()||0;
        var wid=window.open();
        wid.location.href=("/cultural/detail?id=" + id + "&source=" + sourceFrom + "&page=" + page + ("3" === sourceFrom?"&tid=" + tid:""));
    };
})();