// ==UserScript==
// @name         晨知985免激活跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  晨知
// @author       qzqxlXXL
// @match        http://www.chenzhi985.com/
// @grant        none
// @license MIT
//烂活，网站本身也不行，图一乐。
// @downloadURL https://update.greasyfork.org/scripts/449430/%E6%99%A8%E7%9F%A5985%E5%85%8D%E6%BF%80%E6%B4%BB%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/449430/%E6%99%A8%E7%9F%A5985%E5%85%8D%E6%BF%80%E6%B4%BB%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
(function() {
    if (window.location.href=="http://www.chenzhi985.com/#/"){
    var a=prompt("请输入要跳转的序号（默认13，因为作者本人是新高一）:","13");
    window.open("http://www.chenzhi985.com/#/videoHome?grade="+ a + "&course=0");}
}());