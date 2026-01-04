// ==UserScript==
// @name         plurk R18 遮蔽
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在自家主頁上新增一個 R18 打碼的按扭來遮蔽成人內容 （防止同事、同學、老闆經過
// @author       S.Dot, ThanatosDi
// @match        https://www.plurk.com/*
// @homepage     https://github.com/SentenceDot
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382770/plurk%20R18%20%E9%81%AE%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/382770/plurk%20R18%20%E9%81%AE%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var filter_switch = false;

    // Your code here...
    $("#updater").append('<div id="filter" class="item" style=""><a><i class="pif-message-new"></i><span id="noti_np_text">R18 遮蔽</span><span id="filter_message" class="unread_generic">OFF</span></a></div>');
    $("#filter").click(()=>{
        filter_switch = !filter_switch;

        console.log('click')
        console.log(filter_switch)
        if(filter_switch){
            $("#filter_message").text("ON");
           $("._lc_ .plurk.porn .plurk_cnt .td_cnt ").css({"filter":" blur(4px)"});
           $("._lc_ .plurk.porn .plurk_cnt .td_cnt").hover(function () {
               $(this).css({"filter":"none"});
           }, function(){
               $(this).css({"filter":" blur(4px)"});
           })
        }
        else{
            $("#filter_message").text("OFF");
            $("._lc_ .plurk.porn .plurk_cnt .td_cnt ").css({"filter":""});
           $("._lc_ .plurk.porn .plurk_cnt .td_cnt").hover(function () {
               $(this).css({"filter":""});
           }, function(){
               $(this).css({"filter":""});
           })
        }
    })
})();