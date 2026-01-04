// ==UserScript==
// @name         安徽公需科目学习静音
// @namespace    http://tampermonkey.net/
// @version      2024-06-11-4
// @description  安徽公需科目学习静音​视频学习静音插件
// @author       小楼
// @match        https://ahzj.59iedu.com/*
// @match        https://ah.peixun.city/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497574/%E5%AE%89%E5%BE%BD%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%AD%A6%E4%B9%A0%E9%9D%99%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/497574/%E5%AE%89%E5%BE%BD%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%AD%A6%E4%B9%A0%E9%9D%99%E9%9F%B3.meta.js
// ==/UserScript==
window.onload = setInterval(function(){
    var video = document.getElementsByTagName("video");
    var v = video[0];
    v.autoplay = true; //自动播放
    v.play();
    setInterval(function () {

        if (v.muted == false || v.volume != 0) {
            v.autoplay = true;
            v.muted = true; //视频静音
            v.volume = 0;
            v.play();
        }
    }, 500);

    document.addEventListener('DOMContentLoaded', function () {
        var video = document.getElementsByTagName("video");
        var v = video[0];
        v.play();
        v.autoplay = true; //自动播放
        setInterval(function () {

            if (v.muted == false || v.volume != 0) {

                v.muted = true; //视频静音
                v.volume = 0;
                v.autoplay = true;
                v.play();
            }
        }, 500);
    })
},500);