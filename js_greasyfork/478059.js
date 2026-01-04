// ==UserScript==
// @name         跳过计时（改写）
// @description  自动跳过讨厌的计时弹窗，解放双眼
// @namespace    http://cas.study.yanxiu.jsyxsq.com/
// @version      2023.10.22
// @author       zz
// @match        http://cas.study.yanxiu.jsyxsq.com/proj/studentwork/*
//
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478059/%E8%B7%B3%E8%BF%87%E8%AE%A1%E6%97%B6%EF%BC%88%E6%94%B9%E5%86%99%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/478059/%E8%B7%B3%E8%BF%87%E8%AE%A1%E6%97%B6%EF%BC%88%E6%94%B9%E5%86%99%EF%BC%89.meta.js
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