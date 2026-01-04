// ==UserScript==
// @name        国医通2- tcmce.cn
// @namespace   Violentmonkey Scripts
// @match       http://www.tcmce.cn/member/study.*
// @grant       none
// @version     1.0
// @author      liang
// @description 2022/3/10 下午4:05:44
// @downloadURL https://update.greasyfork.org/scripts/478795/%E5%9B%BD%E5%8C%BB%E9%80%9A2-%20tcmcecn.user.js
// @updateURL https://update.greasyfork.org/scripts/478795/%E5%9B%BD%E5%8C%BB%E9%80%9A2-%20tcmcecn.meta.js
// ==/UserScript==
window.onload=(function () {
         setTimeout(function () {
  unsafeWindow.havetoTime="0";
        // document.querySelector("#content > div > form > div.hy-list > div.kc-detail1-1 > div.kc-detail1-2 > div > a").click()
         },3000)

        setTimeout(function () {
  // unsafeWindow.havetoTime="0";
        document.querySelector("#content > div > form > div.hy-list > div.kc-detail1-1 > div.kc-detail1-2 > div > a").click()
         },5000)
        }

)();