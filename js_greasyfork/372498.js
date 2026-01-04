// ==UserScript==
// @name         慕课网自动播放下一节视频
// @namespace    https://greasyfork.org/
// @version      1.0
// @date         2018-09-23
// @author       Theliang
// @blog         http://selier.cnblogs.com/
// @description  慕课网 自动播放 下一节 视频
// @license      MIT; https://opensource.org/licenses/MIT
// @match        *://*.imooc.com/*
// @icon         https://www.imooc.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372498/%E6%85%95%E8%AF%BE%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/372498/%E6%85%95%E8%AF%BE%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

var nextMask = document.querySelector('div.next-box.J_next-box');

var loop = setInterval(function () {
    if (!nextMask.classList.contains('hide')) {
        //console.log("Click imooc next media");
        //alert("123");
        document.querySelector('div.J-next-btn.next-auto.btn.btn-green').click();
    }
}, 1000);