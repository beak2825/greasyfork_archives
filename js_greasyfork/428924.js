// ==UserScript==
// @name         拉勾隐私学习
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  避免同事或老板发现你正在看的拉勾标题，保护你的隐私！
// @author       lnwazg
// @match        https://kaiwu.lagou.com/course/courseInfo.htm?courseId=*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/428924/%E6%8B%89%E5%8B%BE%E9%9A%90%E7%A7%81%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/428924/%E6%8B%89%E5%8B%BE%E9%9A%90%E7%A7%81%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
        setTimeout(function(){
            console.log("begin to remove lagou title...");
            $("div.wrap-left").hide();
            console.log("End remove lagou title.");
        },600);
    });
})();