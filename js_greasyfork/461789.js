// ==UserScript==
// @name         錫蘭訂閱校正
// @namespace    https://em-tec.github.io/post/Ceylan-sub-fix
// @license MIT
// @version      0.3
// @description  讓錫蘭的訂閱數正確顯示
// @author       毛哥EM
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461789/%E9%8C%AB%E8%98%AD%E8%A8%82%E9%96%B1%E6%A0%A1%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/461789/%E9%8C%AB%E8%98%AD%E8%A8%82%E9%96%B1%E6%A0%A1%E6%AD%A3.meta.js
// ==/UserScript==

!function(){function e(){var e=document.getElementById("subscriber-count"),t=document.getElementById("channel-handle"),r=document.getElementById("text"),i=document.getElementById("owner-sub-count");if(e&&t){if(n.disconnect(),"@xilanceylan"==t.innerText){var c=e.innerText;if(c.indexOf("K")>-1)var a=parseInt(c.replace("K",""))/10+"T";else var a=c.replace("萬","兆").replace("万","兆");e.innerText=a}}else if(i&&r&&(n.disconnect(),"錫蘭Ceylan"==r.innerText)){var c=i.innerText,a=c.replace("萬","兆").replace("万","兆");i.innerText=a}}e(),window.addEventListener("popstate",e);var n=new MutationObserver(function(n){n.forEach(function(n){e()})});n.observe(document.body,{childList:!0,subtree:!0})}();