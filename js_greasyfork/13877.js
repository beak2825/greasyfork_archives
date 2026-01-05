// ==UserScript==
// @name         贴吧去登录提示
// @namespace    none
// @version      0.1
// @description  免登录贴吧查看楼中楼.翻页
// @match        http://tieba.baidu.com/*
// @include      http://tieba.baidu.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13877/%E8%B4%B4%E5%90%A7%E5%8E%BB%E7%99%BB%E5%BD%95%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/13877/%E8%B4%B4%E5%90%A7%E5%8E%BB%E7%99%BB%E5%BD%95%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==
     
var hack = document.createElement('script');
hack.innerHTML = "Object.freeze = function(obj){};";
document.documentElement.appendChild(hack);
     
document.addEventListener("DOMContentLoaded", function(){
   var islogin = document.createElement('script');
   islogin.innerHTML = "PageData.user.is_login = true;";
   document.head.appendChild(islogin);
}, false);