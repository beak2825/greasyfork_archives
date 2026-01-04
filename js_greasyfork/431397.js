// ==UserScript==
// @name         干部网络学院播放小助手
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  干部网络学院播放页面，自动点击播放按钮，实现连播。
// @author       bobo
// @match        https://www.qhce.gov.cn/course/video/*
// @icon         https://www.google.com/s2/favicons?domain=qhce.gov.cn
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431397/%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E6%92%AD%E6%94%BE%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/431397/%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E6%92%AD%E6%94%BE%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    function playVideo() {
        let video = document.getElementById('video')
        video.muted = true
        video.play()
    }
    
    setTimeout(() => {
        let isPauseBtn = $('.xt_video_player_play_btn.fl.xt_video_player_play_btn_pause').length;
        let isMuted = $('.xt_video_player_volume_muted').length
    
        if (!isPauseBtn) {
            console.log('bobo：播放视频')
            setTimeout(playVideo, 3000)
        } else {
            console.log('bobo:视频正在播放')
        }
    
        if (!isMuted) $('.xt_video_player_volume_icon.fl').click()
    }, 30000)
    
})

