// ==UserScript==
// @name B站禁用空格下翻
// @namespace DisableSpaceBarScroll
// @version 1.01
// @description 禁用空格键、UP键、DN键影响滚动条
// @author noahyann
// @match https://www.youtube.com/*
// @match https://www.bilibili.com/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/431019/B%E7%AB%99%E7%A6%81%E7%94%A8%E7%A9%BA%E6%A0%BC%E4%B8%8B%E7%BF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/431019/B%E7%AB%99%E7%A6%81%E7%94%A8%E7%A9%BA%E6%A0%BC%E4%B8%8B%E7%BF%BB.meta.js
// ==/UserScript==

(function(){
 document.onkeydown = function() {
  if((event.keyCode==32)||(event.keyCode==38)||(event.keyCode==40))
  {/* 空格 || UP || DN  */
   //alert(document.activeElement.tagName);
   if(document.activeElement.tagName=='BODY'){
       event.keyCode=0;
       event.returnValue=false;
   }
  }
 }
})();
