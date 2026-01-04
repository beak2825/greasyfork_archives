// ==UserScript==
// @name        Everything No Gray
// @namespace   leizingyiu.net
// @grant       none
// @version     2022/12/2
// @author      leizingyiu
// @description 移除灰色滤镜，可自行修改targetSelector，强制所有元素不灰
// @license     GPL-3.0-or-later
// @match       *://*/*
// @run-at      document-body
// @downloadURL https://update.greasyfork.org/scripts/455734/Everything%20No%20Gray.user.js
// @updateURL https://update.greasyfork.org/scripts/455734/Everything%20No%20Gray.meta.js
// ==/UserScript==

const targetSelector="html,body,div,p";//targetSelector="*";

function getStyle (obj, attr) {  if (obj.currentStyle) {     return obj.currentStyle[attr];  } else {    return window.getComputedStyle(obj, null)[attr];  }; };
const s=document.createElement('style');  s.innerText=`.everythingNoGray,.everythingNoGray *{filter:grayscale(0)!important;};`;  document.body.appendChild(s);

[...document.querySelectorAll(targetSelector)]
    .filter(o=>getStyle(o,'filter').indexOf('grayscale')!=-1)
    .map(o=>{
    o.classList.add('everythingNoGray');
});