// ==UserScript==
// @name         21tb课程通杀
// @namespace    bot4u
// @version      0.1
// @description  bot4u
// @author       perdow
// @match        *.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do?courseId=*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456510/21tb%E8%AF%BE%E7%A8%8B%E9%80%9A%E6%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/456510/21tb%E8%AF%BE%E7%A8%8B%E9%80%9A%E6%9D%80.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 

window.onload=function lll(){document.getElementsByClassName('title')[0].innerText="BOT FOR YOU"}
    function sudu() {
document.querySelector('iframe').contentWindow.document.querySelectorAll('video')[0].playbackRate = 7;
    }
   setInterval(sudu, 100);//
 function enterCourse() {
      document.querySelector('iframe').contentWindow.document.querySelectorAll('li.section-item')[document.querySelector('iframe').contentWindow.document.querySelectorAll('li.section-item.finish').length].click();
  //window.location.reload()
 }
var myTimer = setInterval(enterCourse, 50000);
 
  })();