// ==UserScript==
// @name         西南输液继续教育
// @namespace    **************
// @version      0.1
// @description  自动播放同一课程目录，仅供内部学习使用，请勿随意传播
// @author       luter
// @match        *://*.chinahrt.com/*
// @require https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447216/%E8%A5%BF%E5%8D%97%E8%BE%93%E6%B6%B2%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/447216/%E8%A5%BF%E5%8D%97%E8%BE%93%E6%B6%B2%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
    $(window).resize(function(){
        document.getElementById('iframe').contentWindow.postMessage('playValid','*');
        document.getElementById('iframe').contentWindow.postMessage('play','*');
    });
setInterval(function(){
        document.getElementById('iframe').contentWindow.postMessage('playValid','*');
        document.getElementById('iframe').contentWindow.postMessage('play','*');
    console.log("脚本提示")
}, 10000);