// ==UserScript==
// @name         腾讯课堂-滚动字幕清除
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  实现了对滚动用户名的清除和上方滚动字幕的清除
// @author       CodeFat/PWND0U
// @match        https://ke.qq.com/webcourse/*
// @icon         https://9.idqqimg.com/edu/edu_modules/edu-ui/img/nohash/logo_pc_rich.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455332/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82-%E6%BB%9A%E5%8A%A8%E5%AD%97%E5%B9%95%E6%B8%85%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/455332/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82-%E6%BB%9A%E5%8A%A8%E5%AD%97%E5%B9%95%E6%B8%85%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (typeof jQuery == 'undefined') {
        let MyHead = document.querySelector("head")
        let scriptJq = document.createElement("script")
        scriptJq.src = "//mat1.gtimg.com/www/asset/lib/jquery/jquery/jquery-1.11.1.min.js"
        scriptJq.type = "text/javascript"
        MyHead.appendChild(scriptJq)
    } else {
        console.log("目标网页已引入JQUERY");
    }
    // Your code here...
    setInterval(() => {
        if($("#member-container").next().text()!=" "){
            $("#member-container").next().text(" ")
        }
        if($(".marquee-close-btn").length>0){
            $(".marquee-close-btn").click()
        }
    }, 50);
})();