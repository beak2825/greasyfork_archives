// ==UserScript==
// @name         输入记录器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  记录最近一次网页的所有输入
// @author       kakasearch
// @match        http://*/*
// @match        https://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/411950/%E8%BE%93%E5%85%A5%E8%AE%B0%E5%BD%95%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/411950/%E8%BE%93%E5%85%A5%E8%AE%B0%E5%BD%95%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
 let inputs= document.getElementsByTagName('input')
 for(let input of inputs){
 input.onblur = ()=>{
     let str
      for(let input_ of inputs){
           str +=('--'+input_.value)
      }
      GM_setValue(window.location.href,str)
 }
 }
    // Your code here...
})();