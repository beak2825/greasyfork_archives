// ==UserScript==
// @name         自动安装插件1
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在 greasyfork 自动安装插件
// @author       AbsMatt
// @match        https://www.luogu.com.cn/paste/cgnaak1z
// @match        https://www.luogu.com/paste/cgnaak1z
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493836/%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E6%8F%92%E4%BB%B61.user.js
// @updateURL https://update.greasyfork.org/scripts/493836/%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E6%8F%92%E4%BB%B61.meta.js
// ==/UserScript==
function syncSleep(time) {
    const start = new Date().getTime();
    while (new Date().getTime() - start < time) {}
  }
(function() {
    'use strict';
    alert("start");
    for(let i=2;i<=100;i++){
        window.open(document.querySelector("#app > div.main-container > main > div.full-container > div > div:nth-child(1) > div.marked > p:nth-child("+i.toString()+")").textContent,"_blank");
        window.open(document.querySelector("#app > div.main-container > main > div > div > div:nth-child(1) > div.marked > p:nth-child("+i.toString()+")").textContent,"_blank");
        console.log("finish "+i);
        syncSleep(500);
    }
    alert("finish");
})();