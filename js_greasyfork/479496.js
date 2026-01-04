// ==UserScript==
// @name         2023_福建药师协会_执业药师继续教育学习平台-学习助手(新版)
// @version     1.3.6
// @description  切换屏幕,视频不暂停
// @author       You
// @match        http://fjlpa.mtnet.com.cn/video/*
// @grant        none
// @license     MIT
// @namespace www.31ho.com
// @downloadURL https://update.greasyfork.org/scripts/479496/2023_%E7%A6%8F%E5%BB%BA%E8%8D%AF%E5%B8%88%E5%8D%8F%E4%BC%9A_%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%28%E6%96%B0%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/479496/2023_%E7%A6%8F%E5%BB%BA%E8%8D%AF%E5%B8%88%E5%8D%8F%E4%BC%9A_%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%28%E6%96%B0%E7%89%88%29.meta.js
// ==/UserScript==
(function() {
'use strict';
window.onload = function(){
 
                         var h = document.documentElement.scrollHeight || document.body.scrollHeight;
 
                          window.scrollTo(h,h);
 
                            } 
window.onload = function () {
  setInterval(() => {
    try {
      let hre = location.href;
      if (hre == "http://fjlpa.mtnet.com.cn/index") 
        if (document.querySelector(".gkjd") == "0%") {
        document.querySelector(".indexTextBtn").click();
       }

	   
      if (hre.includes("http://fjlpa.mtnet.com.cn/video")) {
        window.onblur = function () {};
	  if (document.querySelector("chapterPro floatR currProgress") == "0%") {
          document.querySelector(".floatR toPlay").click();
       }
	  }
	  
      if (hre.includes("http://fjlpa.mtnet.com.cn/video")) {
        window.onblur = function () {};
        if (document.querySelector("video").paused) {
          document.querySelector("video").play();
        }
      }
    } catch (error) {}
  }, 5000);
  
setInterval(function(){
       window.location.reload();
                     },20*60*1000); 
   
 //隐藏继续看视频弹窗  
 $('.el-dialog__footer').hide();  
    
}; 
  
})();