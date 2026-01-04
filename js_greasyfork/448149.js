// ==UserScript==
// @name         上海国家会计学院远程培训屏蔽问答
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  远程培训屏蔽问答
// @author       Amu
// @match        http://ce.esnai.net/c/public/showflashvideo.jsp*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448149/%E4%B8%8A%E6%B5%B7%E5%9B%BD%E5%AE%B6%E4%BC%9A%E8%AE%A1%E5%AD%A6%E9%99%A2%E8%BF%9C%E7%A8%8B%E5%9F%B9%E8%AE%AD%E5%B1%8F%E8%94%BD%E9%97%AE%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/448149/%E4%B8%8A%E6%B5%B7%E5%9B%BD%E5%AE%B6%E4%BC%9A%E8%AE%A1%E5%AD%A6%E9%99%A2%E8%BF%9C%E7%A8%8B%E5%9F%B9%E8%AE%AD%E5%B1%8F%E8%94%BD%E9%97%AE%E7%AD%94.meta.js
// ==/UserScript==


var myVar1 = setInterval(function(){ myrefresh() }, Math.ceil(Math.random()*900000));
function myrefresh(){
    console.log(window.runminutes);
    window.finishBreakSubject();
    console.log(window.j2s_getCurrentTime());
}