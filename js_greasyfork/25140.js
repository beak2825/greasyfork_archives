// ==UserScript==
// @name         去除hitomi.la的点击限制-remove_hitomi.la_flash
// @namespace    http://www.saber.xn--6qq986b3xl/?p=3154
// @version      0.1
// @description  hitomi.la会时不时在页面上覆盖一层flash导致我们无法点击链接，本脚本通过去除这个flash来使页面可以被点击
// @author       雪见仙尊
// @match        https://hitomi.la/*
// @grant        none
// @run-at		 document-end
// @downloadURL https://update.greasyfork.org/scripts/25140/%E5%8E%BB%E9%99%A4hitomila%E7%9A%84%E7%82%B9%E5%87%BB%E9%99%90%E5%88%B6-remove_hitomila_flash.user.js
// @updateURL https://update.greasyfork.org/scripts/25140/%E5%8E%BB%E9%99%A4hitomila%E7%9A%84%E7%82%B9%E5%87%BB%E9%99%90%E5%88%B6-remove_hitomila_flash.meta.js
// ==/UserScript==

!function () {
let clearT=window.setInterval(function(){
  if (!!document.querySelector("object")) {
    document.querySelector("object").remove();
  }
},500);
}()