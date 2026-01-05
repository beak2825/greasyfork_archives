// ==UserScript==
// @name         跳过计时弹窗
// @description  自动跳过讨厌的计时弹窗，解放双眼
// @namespace    http://study.yanxiu.jsyxsq.com/
// @version      2017.3.16
// @author       zhd 
// @match        http://study.yanxiu.jsyxsq.com/proj/studentwork/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28157/%E8%B7%B3%E8%BF%87%E8%AE%A1%E6%97%B6%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/28157/%E8%B7%B3%E8%BF%87%E8%AE%A1%E6%97%B6%E5%BC%B9%E7%AA%97.meta.js
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