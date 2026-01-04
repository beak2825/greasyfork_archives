// ==UserScript==
// @name         重庆公需科目自动下一节
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  学选修可以挂机了!
// @author       你猜
// @match        https://cqrl.21tb.com/courseSetting/coursePlay/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411586/%E9%87%8D%E5%BA%86%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/411586/%E9%87%8D%E5%BA%86%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
          var next=document.getElementsByClassName("next-button");
          if(next.length>0){
              var e = document.createEvent("MouseEvents");
              e.initEvent("click", true, true);
              document.getElementsByClassName("next-button")[0].dispatchEvent(e);
          }
       },2000);
})();