// ==UserScript==
// @name         B站哔哩哔哩YouTube A-B复读/YouTube B站复读机
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  按z键设置开始时间，按x键设置结束时间，按v键退出A-B复读
// @author       MCOMEBACK
// @match        https://www.youtube.com/*
// @match        https://www.bilibili.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/489801/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9YouTube%20A-B%E5%A4%8D%E8%AF%BBYouTube%20B%E7%AB%99%E5%A4%8D%E8%AF%BB%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/489801/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9YouTube%20A-B%E5%A4%8D%E8%AF%BBYouTube%20B%E7%AB%99%E5%A4%8D%E8%AF%BB%E6%9C%BA.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let startTime = 0;
    let endTime = 0;
    let midTime = 0;
    let isRecording_start = false;
    let isRecording_end = false;
    let replayTimeout;
    let isPaused = false;
    let isTyping = false;
    let interval=0
    let index=0
    const player = document.querySelector('video');
    var isRunning = false;
    var intervalId;

    document.addEventListener('keydown', function(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            isTyping = true;
            return;
        }
        if (isTyping) {
           isTyping = false;
        }
        if (event.key === 'z' && !isRecording_start ) {
            startTime = player.currentTime;
            showMessage('起始时间: ' + startTime);
            isRecording_start = true;
            //showMessage('isRunning '+isPaused);
        }else if (event.key === 'x' && isRecording_start ) {

            if(isPaused){
                showMessage('播放视频后再设置结束时间点 ');
            }else{
                endTime = player.currentTime;
                const duration = endTime - startTime;
                if(duration>0.01){ //判断间隔，如果间隔太小则不起作用
                    isRecording_end= true;
                    showMessage('结束时间: ' + endTime);
                    player.pause();
                    player.currentTime = startTime;
                    //showMessage('正在复读');
                    player.play();
                    startFunction();
                }else{
                    showMessage('时间过短');
                }
            }

        } else if (event.key === 'v') {
            isPaused = false;
            const player = document.querySelector('video');
            player.play();
            isRecording_start = false;
            isRecording_end = false;
            showMessage('结束A-B复读');
            stopFunction();
        }
    });

    document.querySelector('video').addEventListener('pause', function() {
        isPaused = true;
        //showMessage('暂停 ');
    });
    document.querySelector('video').addEventListener('play', function() {
        isPaused = false;
        //showMessage('播放 ');
    });

    function startFunction() {
        if (!isRunning) {
                const duration = endTime - startTime;
                intervalId = setInterval(function() {
                    //player.pause();
                    //player.currentTime = startTime;
                    //player.play();
                    midTime= startTime;
                    if(isPaused){//实现复读暂停
                        //showMessage('isPaused ');
                        midTime = player.currentTime;
                        index=1
                    }else{
                        player.pause();
                        if(index){
                            player.currentTime = midTime;
                            index=0
                        }else{
                            player.currentTime = startTime;
                        }
                        player.play();
                        showMessage('正在复读');
                    }
                }, duration * 1000);
                isRunning = true;
                //console.log('函数已开始执行。');
        }
    }
    function stopFunction() {
        if (isRunning) {
            clearInterval(intervalId);
            isRunning = false;
            //console.log('函数已停止执行。');
        }
    }
    function showMessage(message) {
        const infoBox = document.createElement('div');
        infoBox.textContent = message;
        infoBox.style.position = 'fixed';
        infoBox.style.top = '10px';
        infoBox.style.left = '10px';
        infoBox.style.padding = '10px';
        infoBox.style.background = '#fff';
        infoBox.style.border = '1px solid #333';
        infoBox.style.zIndex = '9999';

        document.body.appendChild(infoBox);

        setTimeout(function() {
            infoBox.remove();
        }, 3000);
    }
})();