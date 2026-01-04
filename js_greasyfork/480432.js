// ==UserScript==
// @name         网页调试控制台
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  网页调试控制台手机版
// @author       wll
// @require      https://cdn.bootcdn.net/ajax/libs/eruda/2.4.1/eruda.js
// @icon         https://img-blog.csdnimg.cn/20181221195058594.gif
// @match        *://*/*
// @run-at       document-start
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/480432/%E7%BD%91%E9%A1%B5%E8%B0%83%E8%AF%95%E6%8E%A7%E5%88%B6%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/480432/%E7%BD%91%E9%A1%B5%E8%B0%83%E8%AF%95%E6%8E%A7%E5%88%B6%E5%8F%B0.meta.js
// ==/UserScript==

try{
let s=document.createElement('script');
s.setAttribute("src","/moe_csp/https://cdn.bootcdn.net/ajax/libs/eruda/2.4.1/eruda.js");

s.addEventListener("load",function(){eruda.init();});
s.onerror=function(e){};
document.head.appendChild(s);
}catch(e){};