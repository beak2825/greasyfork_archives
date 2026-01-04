// ==UserScript==
// @name         移动端网页调试eruda
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @include      *
// @description  可以在安卓上进行前端调试
// @author       zaxtseng
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390860/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%BD%91%E9%A1%B5%E8%B0%83%E8%AF%95eruda.user.js
// @updateURL https://update.greasyfork.org/scripts/390860/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%BD%91%E9%A1%B5%E8%B0%83%E8%AF%95eruda.meta.js
// ==/UserScript==
var script=document.createElement('script');
script.src="//cdn.jsdelivr.net/npm/eruda";
document.body.appendChild(script);
script.onload=function(){
    eruda.init()
}