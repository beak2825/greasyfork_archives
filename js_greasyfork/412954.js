// ==UserScript==
// @name         csdn去除登录弹窗
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去掉烦人的csdn登录弹窗
// @author       SaigyoujiKonpaku
// @include      *://*.csdn.net/*
// @downloadURL https://update.greasyfork.org/scripts/412954/csdn%E5%8E%BB%E9%99%A4%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/412954/csdn%E5%8E%BB%E9%99%A4%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function remove(){
       let a = document.querySelector('#passportbox')
       let b = document.querySelector('.login-mark')
  if(a||b){
    document.body.removeChild(a);
    document.body.removeChild(b);
    window.removeEventListener(remove)
  }
    }
     remove();
     window.addEventListener('scroll',remove)
    // Your code here...
})();