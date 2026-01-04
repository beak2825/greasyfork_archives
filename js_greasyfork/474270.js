// ==UserScript==
// @name  扇贝阅读内容去除图片
// @namespace    http://tampermonkey.net/
// @description 使用后可在扇贝阅读页面隐藏内容图片，使页面更加简洁。点击页面左侧‘点击切换’按钮可切换图片状态
// @version      0.2
// @match        *://web.shanbay.com/reading/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474270/%E6%89%87%E8%B4%9D%E9%98%85%E8%AF%BB%E5%86%85%E5%AE%B9%E5%8E%BB%E9%99%A4%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/474270/%E6%89%87%E8%B4%9D%E9%98%85%E8%AF%BB%E5%86%85%E5%AE%B9%E5%8E%BB%E9%99%A4%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
(function() {
  'use strict';
 
  var parentElement = document.body;  
  
  var div = document.createElement("div");  
  
  div.style.cssText = "color: red;position:fixed;left:10px;top:200px;cursor:pointer;width:18px;";  
  div.innerText = "点击切换";  
    
  div.addEventListener("click", function() {
    var imgs = document.querySelectorAll(".article-content img");
    if (imgs && imgs.length) {
      imgs.forEach(function(img) {
        if (img.style.display === "none") {  
          img.style.display = "block";  
        } else {  
          img.style.display = "none";  
        } 
      });
    }
  });   
  parentElement.appendChild(div);
})();