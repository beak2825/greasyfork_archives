// ==UserScript==
// @name        NoGray，逝去灰色，彩色地带
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.1
// @author      private= =
// @license MIT
// @description 2022/12/1 15:14:17
// @downloadURL https://update.greasyfork.org/scripts/455763/NoGray%EF%BC%8C%E9%80%9D%E5%8E%BB%E7%81%B0%E8%89%B2%EF%BC%8C%E5%BD%A9%E8%89%B2%E5%9C%B0%E5%B8%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/455763/NoGray%EF%BC%8C%E9%80%9D%E5%8E%BB%E7%81%B0%E8%89%B2%EF%BC%8C%E5%BD%A9%E8%89%B2%E5%9C%B0%E5%B8%A6.meta.js
// ==/UserScript==

function noGray(e){
  computedStyle = document.defaultView.getComputedStyle(e, null);
  if (computedStyle.filter.includes("grayscale")){
    e.style.filter='None';
  }
}

noGray(document.getElementsByTagName('HTML')[0]);
noGray(document.getElementsByTagName('BODY')[0]);