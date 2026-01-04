// ==UserScript==
// @name         自动登录interviewtop
// @icon         xffjs.com
// @version      1.0
// @license      
// @namespace    小飞博客：https://xffjs.com
// @description  自动登录interviewtop网站
// @author       xf
// @include      *//interviewtop.top/*
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/440109/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95interviewtop.user.js
// @updateURL https://update.greasyfork.org/scripts/440109/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95interviewtop.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // console.log("xf");
    var url = window.location.href;
    // var match = url.match(/interviewtop\.top\/t\/([0-9a-z]+)/i);
    if (url.indexOf("interviewtop")) {
        console.log("匹配成功");
        document.cookie='LoginName=Guest';
        window.location.href = "http://interviewtop.top/#/list";
    }

})();