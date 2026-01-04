// ==UserScript==
// @name         制杖树 (已失效)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      unlicense
// @description  [已失效] 自动关闭弹窗（需要事先答题）并继续播放
// @author       PRO
// @match        https://studyh5.zhihuishu.com/videoStudy.html*
// @icon         http://www.zhihuishu.com/favicon.ico
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/433311/%E5%88%B6%E6%9D%96%E6%A0%91%20%28%E5%B7%B2%E5%A4%B1%E6%95%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/433311/%E5%88%B6%E6%9D%96%E6%A0%91%20%28%E5%B7%B2%E5%A4%B1%E6%95%88%29.meta.js
// ==/UserScript==

var interval;
(function() {
    'use strict';
    function del() {
        var a = document.querySelector("#app > div > div.el-dialog__wrapper.dialog-test > div > div.el-dialog__footer > span > div");
        if (a) {
            a.click();
        };
        var b = document.getElementsByClassName('playButton')[0];
        if (b) {
            document.getElementsByClassName('videoArea')[0].click();
        };
    }
    var interval;
    function script_on() {interval = setInterval(del, 5000); console.log(interval);}
    function script_off() {clearInterval(interval);}
    GM_registerMenuCommand("打开脚本", script_on);
    GM_registerMenuCommand("关闭脚本", script_off);
})();