// ==UserScript==
// @name         视频self学习|2024暑假教师研修|国家中小学智慧教育平台
// @namespace    http://tampermonkey.net/
// @version      2024-08-25
// @description  自动刷视频
// @author       yunend
// @match        https://basic.smartedu.cn/*
// @match        https://www.basic.smartedu.cn/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartedu.cn
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504768/%E8%A7%86%E9%A2%91self%E5%AD%A6%E4%B9%A0%7C2024%E6%9A%91%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/504768/%E8%A7%86%E9%A2%91self%E5%AD%A6%E4%B9%A0%7C2024%E6%9A%91%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function () {
	'use strict';

  var num,links,i;
  links = document.getElementsByClassName('resource-item');//学习列表
  i=0;
  num=0;
  function main(){
    function fun() {
    if(num>3600){clearInterval(id);}
    else{
      num++;
      if (document.getElementsByClassName('course-video-reload').length != 0) {
        document.getElementsByClassName('course-video-reload')[0].remove();
        i++;
        links[i].click();
      }
      if (document.getElementsByClassName('vjs-big-play-button').length != 0) {
        document.getElementsByClassName('vjs-big-play-button')[0].click();
      }
      if (document.getElementsByClassName('fish-btn').length != 0) {
        document.getElementsByClassName('fish-btn')[0].click();
      }
    }
 $(".resource-item").mousedown(function(){
    i=Array.prototype.indexOf.call(links,this);
         })
    }
    var id=setInterval(fun, 2000);
  }
  window.onload = main();
})();