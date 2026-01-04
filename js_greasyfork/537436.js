// ==UserScript==
// @name         B站声道均衡
// @namespace    chutung
// @version      0.4
// @description  将音频合并为单声道并均衡输出到左右声道
// @author       chutung
// @match        https://www.bilibili.com/*
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/medialist/play/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @license      GPL-3.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537436/B%E7%AB%99%E5%A3%B0%E9%81%93%E5%9D%87%E8%A1%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/537436/B%E7%AB%99%E5%A3%B0%E9%81%93%E5%9D%87%E8%A1%A1.meta.js
// ==/UserScript==
 
(function() {
    "use strict";
 
    let video = null;
    let audioContext = null;
    let mediaSource = null;
    let splitter = null;
    let merger = null;
    let gainNode = null;
 
    function setupMonoAudio() {
        // 先断开之前的连接
        if (mediaSource) {
            mediaSource.disconnect();
        }
 
        // 创建新的音频上下文
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // 创建媒体源
        mediaSource = audioContext.createMediaElementSource(video);
        
        // 断开视频原有的音频输出
        mediaSource.disconnect();
        
        // 创建声道分离器（将立体声分离为左右声道）
        splitter = audioContext.createChannelSplitter(2);
        
        // 创建声道合并器（将单声道合并为立体声）
        merger = audioContext.createChannelMerger(2);
        
        // 创建增益节点用于控制音量
        gainNode = audioContext.createGain();
        gainNode.gain.value = 1.0; // 保持原音量
        
        // 连接节点：
        // 1. 媒体源 -> 声道分离器
        // 2. 左右声道都连接到合并器的左右输入
        // 3. 合并器 -> 增益节点 -> 目的地
        
        mediaSource.connect(splitter);
        
        // 将左声道连接到合并器的左右输入
        splitter.connect(merger, 0, 0);
        splitter.connect(merger, 0, 1);
        
        // 将右声道也混合到合并器的左右输入
        splitter.connect(merger, 1, 0);
        splitter.connect(merger, 1, 1);
        
        merger.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        console.log("[哔哩哔哩音频单声道化]", "已均衡合并左右声道");
    }
 
    function checkVideo() {
        const nowVideo = document.querySelector(".bilibili-player-video video, .bpx-player-video-wrap video, #live-player video, .container-video video");
        
        if (nowVideo && video !== nowVideo) {
            video = nowVideo;
            
            // 处理音频上下文可能被浏览器暂停的状态
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            // 监听视频播放事件，确保音频上下文能正常工作
            video.addEventListener('play', function() {
                if (audioContext && audioContext.state !== 'running') {
                    audioContext.resume().then(() => {
                        setupMonoAudio();
                    });
                }
            });
            
            setupMonoAudio();
        }
    }
 
    // 初始检查
    setTimeout(checkVideo, 1000);
    
    // 定期检查视频元素变化
    const observer = new MutationObserver(checkVideo);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();