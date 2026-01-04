// ==UserScript==
// @name         Ticket confirm
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  订单确认辅助工具!
// @author       Miracle Taylor
// @match        https://buy.damai.cn/*
// @require https://code.jquery.com/jquery-2.1.2.min.js

// @grant      unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/397828/Ticket%20confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/397828/Ticket%20confirm.meta.js
// ==/UserScript==

(function() {
    'use strict';
        $(document).ready(function(){
            var info = $("div[class='ticket-buyer-title']");

          if( info.length != 0){
              var needpeople = $("div[class='ticket-buyer-title']")[0].innerText.replace(/[^0-9]/ig,"");

              var peoplelist = $("div[class='ticket-buyer-select']").find("span[class='next-checkbox-inner']");
              if(peoplelist.length < needpeople){
                  alert("请添加 观演人 信息！")
                  return;
              }
              for(var i=0;i<needpeople;i++){
                  peoplelist[i].click();

              }
          }

          var submit = $("div[class='submit-wrapper']").find("button[class='next-btn next-btn-normal next-btn-medium']");

          submit.click()


        });
})();