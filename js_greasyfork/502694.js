// ==UserScript==
// @name         咪咕直播跳过广告（使用方法见注释）
// @namespace    http://tampermonkey.net/
// @version      2024-08-05
// @description  跳过广告
// @author       AcZhe
// @match        https://www.miguvideo.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=miguvideo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502694/%E5%92%AA%E5%92%95%E7%9B%B4%E6%92%AD%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A%EF%BC%88%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95%E8%A7%81%E6%B3%A8%E9%87%8A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/502694/%E5%92%AA%E5%92%95%E7%9B%B4%E6%92%AD%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A%EF%BC%88%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95%E8%A7%81%E6%B3%A8%E9%87%8A%EF%BC%89.meta.js
// ==/UserScript==

//食用方法：
//将18行_Adress内的值改为本地视频地址（其他视频地址没测试过，理论可行）
//这个是利用了这个平台的一个bug，强制替换广告源实现跳过广告
//_later 执行延迟/越高关闭越快(单位ms) ；_times 执行次数/越高成功率越高

(function() {
    let Adress = 'D:\video\能代夏装YOASOBI-IDOL.mp4';
    var later = 200;
    var times = 100;
    var i=0;
    var timer = setInterval(() => {
        i+=1;
        if(i >= later)
        {
            clearInterval(timer);
        }
        var ad = document.querySelector("#videoDom > video");
        ad.src = Adress;
    }, times)
})();
