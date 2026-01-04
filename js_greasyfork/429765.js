// ==UserScript==
// @name            115自动登录
// @namespace       https://www.cnblogs.com/steinven/
// @author          秒年度
// @require         http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @description     115快捷登录，自动登录
// @match           *://115.com/*
// @version         0.0.1
// @downloadURL https://update.greasyfork.org/scripts/429765/115%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/429765/115%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
( function () {
    'use strict' ;
    $( function () {
        var checkBtn = $("#js-password-recorded-login");
        checkBtn.click();
    });
})();