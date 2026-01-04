// ==UserScript==
// @name         安徽继续教育快速刷课
// @namespace    http://wyq.icu/
// @version      0.1.0
// @description  科技服务于人民
// @author       WangYuQi
// @match        https://main.ahjxjy.cn/study/html/content/studying/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ahjxjy.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489447/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%BF%AB%E9%80%9F%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/489447/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%BF%AB%E9%80%9F%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
var beisuEnable = true // 开启倍速功能

var confirm = function () {
    return true;
};
window.confirm = function () {
    return true;
};
let speed = 4.0;
setInterval(function () {
    let progress = document.querySelector("#video_container_ .jw-progress");
    let title = document.querySelector("body > div.wrapper > div > div > div > ul > li:nth-child(3) > a");
    title.textContent = "当前进度："+progress.style.width+"%"+",当前倍速："+speed+"倍";
    //console.log("当前进度："+progress.style.width+",当前倍速："+speed+"倍");
    for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
        var current_video = document.getElementsByTagName('video')[i]
        if (beisuEnable) {
            // 设置视频倍速
            current_video.playbackRate = speed; // 最高16
        }
        if (current_video.ended) {
            if (document.querySelector('a.btn.btn-green')) {
                document.querySelector('a.btn.btn-green').click()
            }
        }
    }
    //判断当前是作业
    if (document.getElementsByClassName('e-save-b btn_save').length > 0) {
        var currentLi
        if (document.getElementsByClassName('e-save-b btn_save')[0].innerText == '提交作业') {
            for (let i = 0; i < document.getElementsByTagName('li').length; i) {
                if (document.getElementsByTagName('li')[i].className == 'current') {
                    currentLi = i
                }
            }
            document.getElementsByClassName('sectionlist btn_dropdown')[0].click();

            setTimeout(function () {
                document.getElementsByTagName('li')[currentLi].getElementsByTagName('a')[0].click();
            }, 1000)

        }
    }
}, 5*1000)