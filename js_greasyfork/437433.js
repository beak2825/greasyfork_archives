// ==UserScript==
// @name         鄂尔多斯干部培训网络学院
// @namespace    http://tampermonkey.net/
// @version      0.1.4.1
// @description  最小化窗口时自动点击播放，避免被暂停
// @author       AN drew
// @match        *://edybd.youmoo.cn/eel2/*
// @match        *://47.105.90.58:8080/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437433/%E9%84%82%E5%B0%94%E5%A4%9A%E6%96%AF%E5%B9%B2%E9%83%A8%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/437433/%E9%84%82%E5%B0%94%E5%A4%9A%E6%96%AF%E5%B9%B2%E9%83%A8%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(window).blur(function(){ h5player.play();});
    setInterval(function(){
        if(h5player.currentTime==h5player.duration)
        {
            window.close();
        }
        clearInterval(aotuStopinterval);
    },60000)
    $('a.deticalTrue').each(function(){
        if($(this).attr('target')!='_blank')
        {
            $(this).attr('target','_blank');
        }
    })
})();