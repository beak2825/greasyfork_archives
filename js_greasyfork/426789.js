// ==UserScript==
// @name         star
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  网易客服自动评价，每日问候网易雷火全家。
// @author       hzx8964
// @match        *gm.163.com/question_detail.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426789/star.user.js
// @updateURL https://update.greasyfork.org/scripts/426789/star.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

  $("#ae_tips").click();
  $(".eval-stars li:eq(0)").click();
  $(".eval-detail li").click();
  $(".suggestion").html("愿您赠与所有的好运换成网易全体员工的癌症！！！赶紧回去看看你吗还活着吗，不要太伤心，见货，曰妮吗的臭碧。");
  // $("#submitEvaluation").click();

  window.alert = function() {
    return false;
  }
  setTimeout(function(){
     try{      $("#submitEvaluation").click(); } catch(e){  location.href = "https://gm.163.com/myquestions.html"; }
  }, 5000)
  setTimeout(function(){
     location.href = "https://gm.163.com/myquestions.html";
  }, 10000)

})();