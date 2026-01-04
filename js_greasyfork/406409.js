// ==UserScript==
// @name         解决GameBanana JQ加载失败问题
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  加载官方的JQ链接，解决原JQ脚本错误问题，如果官方也加载失败，得考虑有什么国内的储存网站放个JQ了
// @author       Yellowfisher
// @match        https://gamebanana.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/406409/%E8%A7%A3%E5%86%B3GameBanana%20JQ%E5%8A%A0%E8%BD%BD%E5%A4%B1%E8%B4%A5%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/406409/%E8%A7%A3%E5%86%B3GameBanana%20JQ%E5%8A%A0%E8%BD%BD%E5%A4%B1%E8%B4%A5%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

function jqload(){
    if(typeof(jQuery)=="undefined"){}
    else {
console.log("Jquery has been loaded");
clearInterval(checkjq);
    };
}
var Head = document.getElementsByTagName('HEAD').item(0);
var Script= document.createElement("script");
Script.type = "text/javascript";
Script.src="https://yellowfisher.top/video/js/jquery-3.4.1.min.js";
Head.appendChild(Script);
console.log("Jquery Script inserted");
var checkjq = setInterval(jqload, 5000);