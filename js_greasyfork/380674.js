// ==UserScript==
// @name RK_utils
// @namespace Violentmonkey Scripts
// @description My First Scirpt
// @version 1.0.0
// @match <all_urls>
// @run-at document-end
// @grant none
// @icon              https://avatars1.githubusercontent.com/u/30018079?s=460&v=4
// @downloadURL https://update.greasyfork.org/scripts/380674/RK_utils.user.js
// @updateURL https://update.greasyfork.org/scripts/380674/RK_utils.meta.js
// ==/UserScript==
if(!window.log){
  window.log = (...m) => console.log(...m)
}
if(!window.dir){
  window.dir = (...m) => console.dir(...m)
}
if(!window.$){
  window.$ = el => {
   let els = document.querySelectorAll(el)
   if(els.length === 0){
     //console.warn('没有该名字的选择器(seletor), 烦请在检查一下拼写吧')
     return
   }else if (els.length === 1){
     els = document.querySelector(el)       
   }
    return els
  }
}

log('RK utils work well, Have a Happy Day~')
