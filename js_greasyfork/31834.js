// ==UserScript==
// @name         Weibo Cancle Following
// @namespace    http://will66.me/
// @version      0.1
// @description  批量取消新浪微博关注
// @author       willhunger
// @match        http://weibo.com/p/*
// @require      http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.7.2.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31834/Weibo%20Cancle%20Following.user.js
// @updateURL https://update.greasyfork.org/scripts/31834/Weibo%20Cancle%20Following.meta.js
// ==/UserScript==




window.setInterval(function(){
    $(".btn_link.S_txt1")[0].click();
    var arrs = $('div.markup_choose');
    for(var i=0;i<arrs.length;i++){
        arrs[i].click();
    }
    $(".W_btn_a")[1].click();
    $(".W_btn_a.btn_34px")[0].click();
},5000);