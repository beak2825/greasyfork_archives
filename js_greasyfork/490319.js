// ==UserScript==
// @name        【教学】www.baidu.com
// @namespace   Violentmonkey Scripts
// @match       https://www.baidu.com/
// @grant       none
// @version     1.1
// @author      cine
// @license     MIT
// @description 2023/5/29 下午2:12:47
// @downloadURL https://update.greasyfork.org/scripts/490319/%E3%80%90%E6%95%99%E5%AD%A6%E3%80%91wwwbaiducom.user.js
// @updateURL https://update.greasyfork.org/scripts/490319/%E3%80%90%E6%95%99%E5%AD%A6%E3%80%91wwwbaiducom.meta.js
// ==/UserScript==


//var theListenerElement;

window.onload=function(){
	alert("最新版本1.1");
  var carListener =new MutationObserver(function(){
      alert(document.querySelector("div.money-style_59F57").innerText);
  }).observe(document.querySelector("div.money-style_59F57"),{
    childList: true,
    subtree: true
  });
  
}