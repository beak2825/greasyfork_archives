// ==UserScript==
// @name         Background Playback of SPOC Video
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  try to take over aubb!
// @author       Raurant
// @match        https://spoc.buaa.edu.cn/spoc/moocxsxx/*
// @match        */spoc/moocxsxx/queryAllZjByKcdmIfram.do?kcdm=0565B78801C7A6AEE0630111FE0A4EB2&amp;bjdm=058569C82548432FE0630111FE0ADADB&amp;zjdm=05A00A7984B116E6E0630111FE0AC440
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buaa.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480833/Background%20Playback%20of%20SPOC%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/480833/Background%20Playback%20of%20SPOC%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';
var video = document.querySelector("video");
video.playbackRate = 3;
var button = document.querySelector("a[href='javascript:void(0)'][onclick='videoclick(this)']");
    button.click();


document.addEventListener('visibilitychange', function () {
    if (video) {
        //console.log("Let's play again!");
        video.play();
    }
});

    function disableSourceCodeBlocker() {
        window.onload = null; // 移除 window.onload 的事件处理器
        document.onkeydown = null; // 移除按键事件监听器
        document.oncontextmenu = null; // 移除右键菜单事件监听器
    }

    // 在页面加载后禁用源代码阻止功能
    window.addEventListener('load', function() {
        disableSourceCodeBlocker();
        clearInterval(2);
        video.currentTime = (video.duration - 1);
    });

    
    })();
