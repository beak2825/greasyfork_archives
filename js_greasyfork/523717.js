// ==UserScript==
// @name         安徽继续教育在线自动刷课
// @namespace    自动刷课
// @version      0.2
// @description  点进视频即可刷课 现只支持视频
// @author       hanxi
// @match        *://main.ahjxjy.cn/study/html/content/studying/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL 3
// @downloadURL https://update.greasyfork.org/scripts/523717/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/523717/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

var Video;
var NextClassButton;
var Interval;

// 查找视频播放器
function findVideo() {
    var obj = document.getElementsByClassName("jw-video jw-reset");
    if (obj.length == 0) {
        console.log("未找到视频播放器");
    } else {
        Video = obj[0];
        clearInterval(Interval); // 停止定时器
        console.log("视频播放器已找到");
        listenNextVideo(); // 开始监听视频播放结束
    }
}

// 查找并点击“下一节”按钮
function findNextClassButton() {
    var obj = document.getElementsByClassName("btn btn-green");
    if (obj.length == 0) {
        console.log("未找到下一节按钮");
    } else {
        NextClassButton = obj[0];
        console.log("下一节按钮已找到");
        NextClassButton.click(); // 点击下一节按钮
        relaod(); // 重载视频和按钮对象
    }
}

// 监听视频播放结束，跳转到下一节
function listenNextVideo() {
    try {
        Video.addEventListener("ended", function () {
            console.log("视频播放完毕，跳转到下一节");
            findNextClassButton(); // 视频结束后点击“下一节”按钮
        });
    } catch (e) {
        console.log("监听视频结束时发生错误: ", e);
    }
}

// 重载视频和按钮对象
function relaod() {
    Video = null;
    NextClassButton = null;
    Interval = null;
    main(); // 重新执行main()
}

// 定时器检查视频是否加载
function main() {
    Interval = setInterval(function () {
        findVideo();
    }, 100);
}

// 启动脚本
main();
