// ==UserScript==
// @name         自动命名蛋蛋赞视频集数
// @namespace    。
// @version      0.1
// @description  用于浏览器下载视频
// @run-at       document-end
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450779/%E8%87%AA%E5%8A%A8%E5%91%BD%E5%90%8D%E8%9B%8B%E8%9B%8B%E8%B5%9E%E8%A7%86%E9%A2%91%E9%9B%86%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/450779/%E8%87%AA%E5%8A%A8%E5%91%BD%E5%90%8D%E8%9B%8B%E8%9B%8B%E8%B5%9E%E8%A7%86%E9%A2%91%E9%9B%86%E6%95%B0.meta.js
// ==/UserScript==

(function () {

if (location.hostname.indexOf("www.dandanzan") < 0) return;
(function(){
var g_times = 0;
function myfun() {
document.title = document.querySelector("h1.product-title").textContent + document.querySelector("li.on  > [href='javascript:;'][onclick^='play']").textContent;
 if(g_times >= 100) {
 window.clearInterval(timer);
 } 
 g_times ++;
}
let timer = setInterval(myfun,3000);
myfun();
})();
// 后续代码

})();