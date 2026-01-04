// ==UserScript==
// @name         跳过计时弹窗
// @description  重写alert函数
// @namespace    http://study.teacheredu.cn/
// @version      2019.09.28
// @author       aimiku
// @match        http://study.teacheredu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390569/%E8%B7%B3%E8%BF%87%E8%AE%A1%E6%97%B6%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/390569/%E8%B7%B3%E8%BF%87%E8%AE%A1%E6%97%B6%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

setTimeout(function(){
  function confirm(){
    return true;
  }
  
  window.confirm = confirm;
  
  function alert(){
  }
  
  window.alert = alert;
}, 5 * 1000)