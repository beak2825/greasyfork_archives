// ==UserScript==
// @name        南宁师范大学教务系统一键评教 
// @namespace   Violentmonkey Scripts
// @match       http://jw.nnnu.edu.cn/jsxsd/xspj/*
// @grant       none
// @version     1.4
// @author      -
// @description 2021/7/2下午11:58:16
// @downloadURL https://update.greasyfork.org/scripts/420068/%E5%8D%97%E5%AE%81%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/420068/%E5%8D%97%E5%AE%81%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

  var url = window.location.href.slice(0,45);
  
  if (url == "http://jw.nnnu.edu.cn/jsxsd/xspj/xspj_list.do") {
    var table = document.querySelector("#dataList > tbody");
    var oprate = $(table).find("a");
    for(var i=0; i<oprate.length; i++) {
      if(oprate[i].textContent.replace(/\s*/g,"") == '评价') {     //如果可以评价才可执行
        oprate[i].click();
      }
    }
  }
  
  if (url == "http://jw.nnnu.edu.cn/jsxsd/xspj/xspj_edit.do") {

    window.confirm = function () {     //去除确认框
      return true;
    };
    
    var questions = $("[name='zbtd']");
    for(var i=0; i<questions.length; i++){
      $(questions[i]).find(".icon-radio")[0].click();    //执行点击操作
    }
    document.querySelector("#tj").click();               //提交
  }
  
})();