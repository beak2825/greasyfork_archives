// ==UserScript==
// @name         达内视频去除姓名水印
// @namespace    http://tampermonkey.net/
// @version      0.2.6
// @description  hide my name in tmooc.cn
// @author       ljtd
// @match        *://tts.tmooc.cn/video/showVideo*
// @icon         https://www.google.com/s2/favicons?domain=tmooc.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427334/%E8%BE%BE%E5%86%85%E8%A7%86%E9%A2%91%E5%8E%BB%E9%99%A4%E5%A7%93%E5%90%8D%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/427334/%E8%BE%BE%E5%86%85%E8%A7%86%E9%A2%91%E5%8E%BB%E9%99%A4%E5%A7%93%E5%90%8D%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

function getFileName(){
    let lessonTime = document.querySelector("p.active").textContent.trim()
    let lessonName = document.querySelector(".video-stage").textContent.trim()
    let courseName = window.location.toString().split("version=")[1].trim()
    return lessonTime + "_" + lessonName + "_" +courseName;
}

(function() {
    'use strict';

    window.setInterval(function(){
        var uid = document.querySelector('div[speed]');
        var qidian_wpa_img = document.getElementsByClassName("qidian_wpa_img")[0]
        if(uid) uid.remove()
        if(qidian_wpa_img) qidian_wpa_img.remove()
        document.title = getFileName()
    }, 1000);

    // Your code here...
})();