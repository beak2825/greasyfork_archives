// ==UserScript==
// @name         2022_福建药师协会_执业药师继续教育学习平台-学习助手    切换屏幕,视频不暂停
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  切换屏幕,视频不暂停
// @author       You
// @match        http://fjlpa.mtnet.com.cn/video/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/439756/2022_%E7%A6%8F%E5%BB%BA%E8%8D%AF%E5%B8%88%E5%8D%8F%E4%BC%9A_%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20%20%20%20%E5%88%87%E6%8D%A2%E5%B1%8F%E5%B9%95%2C%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/439756/2022_%E7%A6%8F%E5%BB%BA%E8%8D%AF%E5%B8%88%E5%8D%8F%E4%BC%9A_%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20%20%20%20%E5%88%87%E6%8D%A2%E5%B1%8F%E5%B9%95%2C%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C.meta.js
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
      if (hre == "http://fjlpa.mtnet.com.cn/index") {
        document.querySelector(".indexTextBtn").click();
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

