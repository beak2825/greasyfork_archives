// ==UserScript==
// @name         站长工具时间戳增强
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://tool.chinaz.com/Tools/unixtime.aspx
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373999/%E7%AB%99%E9%95%BF%E5%B7%A5%E5%85%B7%E6%97%B6%E9%97%B4%E6%88%B3%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/373999/%E7%AB%99%E9%95%BF%E5%B7%A5%E5%85%B7%E6%97%B6%E9%97%B4%E6%88%B3%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
     function getTime(){
         let myDate = new Date();
         let str = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()} ${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}:${myDate.getMilliseconds()}`
         return str
     }
    window.$(function() {
        // Handler for .ready() called.
        window.$('body').append(`<div id="timeS" style="position:fixed;left:0px;bottom:0px;font-size:28px;"></div>`)
        setInterval(() => {
            let str = getTime()
            window.$('#timeS').html(str)
        },1)
    });
})();