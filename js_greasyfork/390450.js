// ==UserScript==
// @name         奥鹏教育南开大学刷课-静音-自动下一课（隐藏16倍速播放）
// @namespace    微信：chengxiaoqiqiqi
// @version      0.1
// @description  奥鹏教育南开大学
// @author       一位不愿透露姓名的程小七
// @match        *://learn.open.com.cn/StudentCenter/CourseWare/*
// @match        *://learn.open.com.cn/*
// @match        *://*.open.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390450/%E5%A5%A5%E9%B9%8F%E6%95%99%E8%82%B2%E5%8D%97%E5%BC%80%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE-%E9%9D%99%E9%9F%B3-%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%AF%BE%EF%BC%88%E9%9A%90%E8%97%8F16%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/390450/%E5%A5%A5%E9%B9%8F%E6%95%99%E8%82%B2%E5%8D%97%E5%BC%80%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE-%E9%9D%99%E9%9F%B3-%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%AF%BE%EF%BC%88%E9%9A%90%E8%97%8F16%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

setInterval(function () {
        for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
            var current_video = document.getElementsByTagName('video')[i]
            //静音
            current_video.volume = 0
            //16倍速,不被系统认可，因此注释掉。需要开启请删除//
            //current_video.playbackRate = 16.0
            //视频播放结束后，模拟点击“下一课”
            if(document.getElementsByClassName("qrcodebox")[0].style.display == "block"){
                  document.getElementsByClassName("nextlink")[0].click()
            }
        }
    }, 2000)
})();