// ==UserScript==
// @name         华医网自动下一节
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @author       54yun
// @license      AGPL License
// @match        https://cme1.91huayi.com/course_ware/course_ware_polyv.aspx*
// @description  自动播放下一节
// @downloadURL https://update.greasyfork.org/scripts/518197/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/518197/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82.meta.js
// ==/UserScript==
(function() {
    'use strict';
var video =document.querySelector("video")
var next = document.querySelector('#top_play').closest('li').nextElementSibling.firstElementChild || null;//下一节
var jrks = document.getElementById("jrks")
    video.defaultMuted = true;//静音
    video.addEventListener('pause', function() {video.play()});//播放视频
//弹窗
    setInterval(function() {//弹
    closeProcessbarTip()
    document.querySelector("#video > div > div.sign-in-menu > div > div > div > button").click()
    }, 1000)
//弹窗end
//进入考试
var clickjrks = setInterval(function() {
    if (jrks.attributes["href"].value !== '#') { // 如果href不等于#
        //window.open(jrks.attributes["href"].value , '_blank');//新窗口进入考试
        next.click();
        clearInterval(clickjrks);
    }}, 10000); //10s
//进入考试end
})();