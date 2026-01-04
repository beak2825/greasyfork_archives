// ==UserScript==
// @name         自动命名www.torrentsafe.com视频播放文件名网页标题
// @namespace    。
// @version      2
// @description  用于浏览器缓存流媒体时自动命名
// @run-at       document-start
// @match        https://www.torrentsafe.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453533/%E8%87%AA%E5%8A%A8%E5%91%BD%E5%90%8Dwwwtorrentsafecom%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E6%96%87%E4%BB%B6%E5%90%8D%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/453533/%E8%87%AA%E5%8A%A8%E5%91%BD%E5%90%8Dwwwtorrentsafecom%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E6%96%87%E4%BB%B6%E5%90%8D%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function () {

if (location.hostname.indexOf("www.torrentsafe.com") < 0) return;
(function(){
var g_times = 0;
function myfun() {
document.title = document.querySelector("IMG").textContent + document.querySelector("[style^='color: #F0F0F0;']").textContent;
 if(g_times >= 20) {
 window.clearInterval(timer);
 } 
 g_times ++;
}
let timer = setInterval(myfun,3000);
myfun();
})();
// 后续代码

})();