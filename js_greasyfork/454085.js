// ==UserScript==
// @name         命名阿里云盘视频标题
// @namespace    。
// @version      0.1
// @description  try to take over the world
// @author       You
// @run-at       document-start
// @match        https://www.aliyundrive.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454085/%E5%91%BD%E5%90%8D%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E8%A7%86%E9%A2%91%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/454085/%E5%91%BD%E5%90%8D%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E8%A7%86%E9%A2%91%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function () {

if (location.hostname.indexOf("www.aliyundrive.com") < 0) return;
(function(){
var g_times = 0;
function myfun() {
document.title = document.querySelector("IMG").textContent + document.querySelector("SPAN[class^='text--'][data-spm-anchor-id^='0.0.0']").textContent;
 if(g_times >= 200) {
 window.clearInterval(timer);
 } 
 g_times ++;
}
let timer = setInterval(myfun,3000);
myfun();
})();
// 后续代码

})();