// ==UserScript==
// @name        關閉垃圾網站
// @namespace   sdfsdf
// @include     http://p.g4d7.com/*
// @include     http://p.99mssj.com/*
// @version     1
// @grant       none
// @description:en 關閉垃圾網站2
// @description 關閉垃圾網站2
// @downloadURL https://update.greasyfork.org/scripts/22957/%E9%97%9C%E9%96%89%E5%9E%83%E5%9C%BE%E7%B6%B2%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/22957/%E9%97%9C%E9%96%89%E5%9E%83%E5%9C%BE%E7%B6%B2%E7%AB%99.meta.js
// ==/UserScript==


window.onload = function(){
  
  
  location.href="https://www.google.com.tw";
  document.body.innerHTML ="";
  document.head.innerHTML ="";
  
  window.open('', '_self', ''); 
  window.close();
  

};

