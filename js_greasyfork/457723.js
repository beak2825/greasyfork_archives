// ==UserScript==
// @name         CSDN取消"关注博主才可阅读全文"限制
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  绕过CSDN"关注博主即可阅读全文"
// @author       smartfish
// @match         *://*.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457723/CSDN%E5%8F%96%E6%B6%88%22%E5%85%B3%E6%B3%A8%E5%8D%9A%E4%B8%BB%E6%89%8D%E5%8F%AF%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%22%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/457723/CSDN%E5%8F%96%E6%B6%88%22%E5%85%B3%E6%B3%A8%E5%8D%9A%E4%B8%BB%E6%89%8D%E5%8F%AF%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%22%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
     let t = setInterval(function () {
    //设定循环定时器，1000毫秒=1秒，1秒钟检查一次目标对象是否出现
    let articleContent = document.querySelector('#article_content'); //声明要查询的对象
    let hideAarticleBox = document.getElementsByClassName('hide-article-box')[0]
    console.log("will check the articleContent----",articleContent)
    console.log("will check the hideAarticleBox----",hideAarticleBox)
    if (articleContent && hideAarticleBox) {
       console.log("will change the style----")
      //判断对象是否存在，存在则开始设置值
       articleContent.style.height = 'auto'
       articleContent.style.overflow = 'hidden'
       hideAarticleBox.style.display = 'none'
       clearInterval(t); //清除循环定时器
    }

  }, 1000);
    // Your code here...


})();