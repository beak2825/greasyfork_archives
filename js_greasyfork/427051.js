// ==UserScript==
// @name         微信公众号后台新消息提醒
// @namespace    https://www.52pojie.cn/home.php?mod=space&uid=1130153
// @version      0.1
// @description  微信后台新消息提示音
// @author       吾爱破解@黄hsir
// @icon         https://i.postimg.cc/xdyCDJ0y/image.png
// @grant        none
// @include      *://*.weixin.qq.com/*
// @downloadURL https://update.greasyfork.org/scripts/427051/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%90%8E%E5%8F%B0%E6%96%B0%E6%B6%88%E6%81%AF%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/427051/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%90%8E%E5%8F%B0%E6%96%B0%E6%B6%88%E6%81%AF%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

$(document).ready(function () {
    let count = 0
    let tip = $('.message-tips')
    let audio = document.createElement("audio");
    audio.src = 'https://downsc.chinaz.net/Files/DownLoad/sound1/202103/14039.mp3';
    setInterval(() => {
        if (!tip.prop('style').display) {
            if (tip.text().replace(/[^\d]/g,'') > count) {
                // console.log('有新消息')
                audio.play();
                count++
            }
        }
    }, 1000)
})