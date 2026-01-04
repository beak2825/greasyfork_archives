// ==UserScript==
// @name         青年大学习-视频拖动
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  青年大学习快速搞完
// @author       orange add
// @match        https://h5.cyol.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cyol.com
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442224/%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0-%E8%A7%86%E9%A2%91%E6%8B%96%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/442224/%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0-%E8%A7%86%E9%A2%91%E6%8B%96%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
   setInterval(function(){
           var iframe =  document.getElementsByTagName("iframe")[0];
           var videos = iframe.contentWindow.document.getElementsByTagName("video");
           for(let i = 0;i<videos.length;i++){
               videos[0].setAttribute("controls","true")
           }
       },1000
   )


})();