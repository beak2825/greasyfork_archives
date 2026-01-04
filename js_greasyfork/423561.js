// ==UserScript==
// @name         就创业直播平台刷课助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  静音、自动切换下一小节。可以多开！
// @author       蓬勃向上666
// @match        https://*.wnssedu.com/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423561/%E5%B0%B1%E5%88%9B%E4%B8%9A%E7%9B%B4%E6%92%AD%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/423561/%E5%B0%B1%E5%88%9B%E4%B8%9A%E7%9B%B4%E6%92%AD%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {

    var skip = 1;      //   是否开启自动跳到下一小节 1开启 0关闭
                       //   关闭后，需手动点击下一小节。不过此时脚本已经停止运行，刷新即可重新激活。
    var video = document.getElementsByClassName("pv-video");
    var videoList;
    var i = 1;
    setTimeout(function () {
        $('.pv-volumebtn.pv-iconfont.pv-icon-volumeon').click();
        videoList= $(".chapter_subtit_third");
        videoList.css("color", "green");
        console.log("已选取" + videoList.length + "个小节,并已用绿色标明,请检查是否有遗漏,如有遗漏,概不负责");
        console.log("已静音和切换到流畅画质");
    }, 2000);
    var xunhuan = setInterval(function () {
        $('.pv-ask-skip').click();
        if(video[0].currentTime==video[0].duration)
            if(skip && i<videoList.length){
                videoList[i].click();
                i++;
                console.log("跳转播放第" + i + "节");
                setTimeout(function () {
                    $('.pv-volumebtn.pv-iconfont.pv-icon-volumeon').click();
                    console.log("已静音和切换到流畅画质");
                }, 2000);
            }
            else{
                console.log("本章节已播放完毕");
                clearInterval(xunhuan);
            }
    }, 3000);
})();