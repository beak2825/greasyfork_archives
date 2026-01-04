// ==UserScript==
// @name         潇湘城建半自动刷课脚本
// @namespace    xiaobaibubai/skipClasses/XXCJ
// @version      1.0.0
// @description  半自动刷课
// @author       xiaobaibubai123
// @license     BSD
// @match        https://www.jwstudy.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482735/%E6%BD%87%E6%B9%98%E5%9F%8E%E5%BB%BA%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/482735/%E6%BD%87%E6%B9%98%E5%9F%8E%E5%BB%BA%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

$(function(){
    console.log('开始');
  var md = document.getElementsByTagName('video')[0];
  setInterval(function(){
    md.addEventListener('ended', function() {
      document.getElementById("learnNextSection").click();
    });
  md.currentTime= parseInt(md.duration) - 1;
  },6000);
    console.log('结束')
});