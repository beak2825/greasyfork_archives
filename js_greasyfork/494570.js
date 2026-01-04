// ==UserScript==
// @name         学海在线刷课助手
// @version      v0.5.1
// @namespace    https://copm.yunxuetang.cn/kng
// @description  刷课助手
// @author       zackyj
// @match        https://copm.yunxuetang.cn/kng/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494570/%E5%AD%A6%E6%B5%B7%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/494570/%E5%AD%A6%E6%B5%B7%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
const NUMBER_OF_VIDEO_PLAYBACK_PAUSES = 'numberOfVideoPlaybackPauses';
window.onload = function() {
    initVideoPauseTimes();
    player.bdPlayer.setPlaybackRate(2);
    console.log('自动设置两倍速');
    setTimeout(function() {
        player.bdPlayer.setMute(true);
        console.log('自动设置静音播放');
    }, 4000);
};
window.setInterval(function () {
    const date = new Date();
    detectionOnline();
    console.info(date.toLocaleString() + '检测一次弹窗')
}, 10000);
window.setInterval(function () {
    const date = new Date();
    detectPlaybackStatus();
    console.info(date.toLocaleString() + ' 检测播放状态')
}, 15000);


function detectionOnline() {
        var dom = document.getElementById("dvWarningView");
        if (dom) {
            document.getElementById("reStartStudy").onmousedown();
            document.getElementById("reStartStudy").click()
            console.log('自动点击继续学习');
        }
}
function detectPlaybackStatus() {
        let numberOfVideoPlaybackPauses = getVideoPauseTimes();
        console.info('视频暂停次数：' + numberOfVideoPlaybackPauses)
        const date = new Date();
        if (myPlayer.getState() == 'buffering') {
            layer.msg("检测到视频缓冲");
            window.setTimeout(function () {
                if(myPlayer.getState() == 'buffering'){
                    console.info('缓冲超过5秒，刷新页面');
                    initVideoPauseTimes();
                    window.location.reload();   
                }
            }, 5000);
        } else if (myPlayer.getState() == 'paused') {
            videoPauseTimesInc();
            if (numberOfVideoPlaybackPauses > 3) {
                console.log("检测暂停超过三次，自动刷新页面");
                initVideoPauseTimes();
                window.location.reload();
            }
            myPlayer.play();
            console.log("检测到暂停，自动开始播放");
        }
}
// 初始化视频暂停次数
function initVideoPauseTimes() {
    localStorage.setItem(NUMBER_OF_VIDEO_PLAYBACK_PAUSES, 0)
}
// 获取视频暂停次数
function getVideoPauseTimes() {
    return Number(localStorage.getItem(NUMBER_OF_VIDEO_PLAYBACK_PAUSES) || 0);
}
// 视频暂停次数自增
function videoPauseTimesInc() {
    localStorage.setItem(NUMBER_OF_VIDEO_PLAYBACK_PAUSES, Number(getVideoPauseTimes()) + 1);
}
})();