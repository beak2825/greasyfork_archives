// ==UserScript==
// @name         还我B站视频动态
// @namespace    http://www.mihoyo.tech/
// @version      1.04
// @description  更改B站导航栏中"动态"的跳转链接为旧版动态链接
// @author       yyuueexxiinngg
// @match        *://www.bilibili.com/*
// @match        *://message.bilibili.com/*
// @match        *://space.bilibili.com/*
// @match        *://member.bilibili.com/*
// @match        *://account.bilibili.com/*
// @match        *://big.bilibili.com/*
// @match        *://t.bilibili.com/*
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/35598/%E8%BF%98%E6%88%91B%E7%AB%99%E8%A7%86%E9%A2%91%E5%8A%A8%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/35598/%E8%BF%98%E6%88%91B%E7%AB%99%E8%A7%86%E9%A2%91%E5%8A%A8%E6%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.href == "https://www.bilibili.com/account/dynamic" || window.location.href == "http://www.bilibili.com/account/dynamic" ){
        $(function(){
            $("#i_menu_msg_btn a.i-link")[0].text = "新版动态";
            $("#i_menu_msg_btn a.i-link")[0].href = "https://t.bilibili.com/";
        });
    }else{
       $(function(){
            $(".nav-con.fr a").each(function(index){
                if($(this).attr("href")=="//t.bilibili.com"){
                    $(this).attr("href","//www.bilibili.com/account/dynamic");
           }
       });
    });
    }
})();