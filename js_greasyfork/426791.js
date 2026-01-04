// ==UserScript==
// @name         list
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  网易客服自动填写，每日问候网易雷火全家
// @author       You
// @match        *gm.163.com/myquestions.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426791/list.user.js
// @updateURL https://update.greasyfork.org/scripts/426791/list.meta.js
// ==/UserScript==

(function() {
  'use strict';


  $(".service-con_6__list tr:gt(0) .id a").each((i, v) => {
    if($(v).css("font-weight") == 700){
      location.href = $(v).attr("href");
    }
  });
  // Your code here...
  setTimeout(function(){
    location.href = "https://gm.163.com/user_help.html?index=5&stypeid=2478";
  }, 5000);
})();