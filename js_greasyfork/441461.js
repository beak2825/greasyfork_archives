// ==UserScript==
// @name         B站一键跳过番剧片头（按一下一分半，可在配置文件修改）
// @name:zh-CN   B站一键跳过番剧片头
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  按=+号键跳过一分半，
// @author       You
// @match        https://www.bilibili.com/bangumi/play/*
// @grant        none
// @run-at       document-end
// @license LFT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/441461/B%E7%AB%99%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BF%87%E7%95%AA%E5%89%A7%E7%89%87%E5%A4%B4%EF%BC%88%E6%8C%89%E4%B8%80%E4%B8%8B%E4%B8%80%E5%88%86%E5%8D%8A%EF%BC%8C%E5%8F%AF%E5%9C%A8%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E4%BF%AE%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/441461/B%E7%AB%99%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BF%87%E7%95%AA%E5%89%A7%E7%89%87%E5%A4%B4%EF%BC%88%E6%8C%89%E4%B8%80%E4%B8%8B%E4%B8%80%E5%88%86%E5%8D%8A%EF%BC%8C%E5%8F%AF%E5%9C%A8%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E4%BF%AE%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==
document.onkeydown=function(event){
    var e = event || window.event;
    if(e.keyCode===187){//187代表“=+”的keycode值，keycode值可在https://www.cnblogs.com/lxwphp/p/9548823.html查询
        var video = document.querySelector('video');
        //快进代码
        var now_time = video.currentTime;
        //计算快进后的播放时间点
        var new_time = now_time + 90;//更改快进进度时间在此修改，90代表90秒
        //新值赋值回去
        video.currentTime = new_time;
    }
}
