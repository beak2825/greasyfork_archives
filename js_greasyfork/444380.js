// ==UserScript==
// @name         taoguba-proxy
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  wap展示
// @author       galan99
// @match        https://www.taoguba.com.cn/new/dav/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/444380/taoguba-proxy.user.js
// @updateURL https://update.greasyfork.org/scripts/444380/taoguba-proxy.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

    var isMobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile)/i)

    var css = `
        .giftText,
        .container_title,
        .container_time,
        .Purchased_content,
        .post_text2,
        .lookDav,
        .container2_titles,
        .authLiuyan .leaveMsg_Item,
        .reply_Item, 
        .post_content,
        .DVhasBuy_top,
        .timeItem_top,
        .reply_Item_line,
        .lazy,
        .leaveMsg_content,
        .leaveMsg_content1,
        .container{
          width: 100%!important;
          margin-left: 0!important;
          margin-right: 0!important;
          overflow-x: hidden;
        }
        
        .NewH,
        .DVhasBuy,
        .NO_duty,
        .text_line,
        .post_guanzhuBtn,
        #footer_container1,
        #footer_container2,
        #footer,
        .giftText,
        .dashangBtn,
        .dashangBtn2,
        .writeLyBtn,
        .leaveMsgInfo_img1,
        .leaveMsg_zan,
        .leaveMsgInfo,
        .reply_Item_BG{
          display: none!important;
        }
        .Purchased_text {
          background: none!important;
          line-height: 18px!important;
          font-size: 15px;
          padding: 10px;
        }
        .container2_title{
          width: 45%!important;
        }
        .reply_Item_text {
          width: 90%!important;
          margin: 10px 0 15px 5px!important;
        }
        .timeItem_top {
          height: 60px!important;
        }
        .leaveMsg_Item {
          width: calc(100vw - 20px)!important;
        }
        .leaveMsgInfo_name {
          width: 30%!important;
        }
        .leaveMsg_time {
          margin: 10px!important;
        }
        
        .leaveMsg_title{
          margin: 5px!important;
          width: calc(100% - 15px)!important;
        }
        
        .leaveMsg_reply, .leaveMsg_content{
          width: calc(100vw - 30px)!important;
        }
        
        .post_contentxxxxx{
          padding-bottom: 0!important;
        }
        .leaveMsg_time2 {
          margin-right: 20px!important;
        }
        .container {
          margin: 0!important;
        }
    `;

    if (!isMobile) {
      css = ""
    }
    GM_addStyle(css)

    if (isMobile) {
      document.querySelectorAll('meta')[1].setAttribute("content", "width=device-width, initial-scale=1");
      $(".NewH").parent("div").hide();
    }
})();