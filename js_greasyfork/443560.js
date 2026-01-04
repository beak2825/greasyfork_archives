// ==UserScript==
// @name         B站一键跳过番剧片头
// @description  bilibili B站一键跳过番剧片头按一下=+键快进一分半，可在配置文件修改，目前不支持火狐浏览器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       MintLatte
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MintLatte
// @downloadURL https://update.greasyfork.org/scripts/443560/B%E7%AB%99%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BF%87%E7%95%AA%E5%89%A7%E7%89%87%E5%A4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/443560/B%E7%AB%99%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BF%87%E7%95%AA%E5%89%A7%E7%89%87%E5%A4%B4.meta.js
// ==/UserScript==
document.addEventListener('keyup',function(e){
    if(e.keyCode===187){//187代表“=+”的keycode值，keycode值可在https://www.cnblogs.com/lxwphp/p/9548823.html查询
        var video = document.querySelector('video');
        //快进代码
        video.currentTime= video.currentTime+90//此处设置快进时间，单位秒
    }
})
