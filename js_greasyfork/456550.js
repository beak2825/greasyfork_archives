// ==UserScript==
// @name         集游社云游戏计时器
// @version      0.3
// @author       ImAyx (Ayx Blog: https://imayx.top/)
// @license      GPLv3
// @namespace    http://diveintogreasemonkey.org/download/
// @description  为集游社（jiyoushe.cn）云游戏页面提供计时器（代替网页标题）
// @match        https://www.jiyoushe.cn/pcplay.html
// @match        https://www.jiyoushe.cn/webplay.html
// @match        https://www.jiyoushe.cn/cloudplayweb
// @downloadURL https://update.greasyfork.org/scripts/456550/%E9%9B%86%E6%B8%B8%E7%A4%BE%E4%BA%91%E6%B8%B8%E6%88%8F%E8%AE%A1%E6%97%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/456550/%E9%9B%86%E6%B8%B8%E7%A4%BE%E4%BA%91%E6%B8%B8%E6%88%8F%E8%AE%A1%E6%97%B6%E5%99%A8.meta.js
// ==/UserScript==
var time = 0;
var interval = 1000;
var timer = setInterval(function(){
    time += interval;
    var hr = Math.floor(time / 3600000);
    var min = Math.floor((time % 3600000) / 60000);
    var sec = Math.floor((time % 60000) / 1000);
    document.title = "已打开" + hr + "时" + min + "分" + sec + "秒";
}, interval);