// ==UserScript==
// @name         B站 UP主 弹幕管理
// @namespace    https://space.bilibili.com/15516023
// @version      1.0
// @description  跳转到指定时间轴位置
// @author       You
// @match        https://member.bilibili.com/platform/inter-active/danmu
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436088/B%E7%AB%99%20UP%E4%B8%BB%20%E5%BC%B9%E5%B9%95%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/436088/B%E7%AB%99%20UP%E4%B8%BB%20%E5%BC%B9%E5%B9%95%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        let links = document.querySelectorAll('a.danmu-content')
        let times = document.querySelectorAll('td:nth-child(3) .colum-content')
        links.forEach((link, index) => {
            let [s=0, m=0, h=0] = times[index].textContent.split(':').reverse()
            link.href = link.href + `?t=${h}h${m}m${s}s`
        })
    }, 2000)
    // Your code here...
})();