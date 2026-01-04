// ==UserScript==
// @name         Media Player Enhancer
// @description  Enhances the HTML5 video player with keyboard shortcuts and other features, and provides feedback on key presses.
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/WhyWhatHow/powertoys4browser/master/icons/media_enhancer.ico
// @grant        none
// @run-at       window-load
// @namespace    https://whywhathow.github.io/
// @homepage     https://github.com/WhyWhatHow/powertoys4browser
// @supportURL   https://github.com/WhyWhatHow/powertoys4browser/issues
// @version      1.9
// @author       whywhathow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470325/Media%20Player%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/470325/Media%20Player%20Enhancer.meta.js
// ==/UserScript==
// 快捷键消息提示框 元素ID.
const MSG_BOX_ID = 'reference';

// 避免 body.offsetHeight = 0 的情况.
let body_size;

//  初始化
function init() {
    // 初始化消息提示框
    initShortCutsBox();
    // 初始化 body_size
    initBodySize();
}

// 初始化 body_size
function initBodySize() {
    body_size = {
        width: document.body.offsetWidth,
        height: document.body.offsetHeight

    };
    console.log("----------body_size----------")
    console.log(body_size)

}

var container_default_size; // 即videoPlayer的 width, height


// 初始化快捷键信息提示框
function initShortCutsBox() {
    const reference = document.createElement('div');
    reference.id = MSG_BOX_ID;
    reference.style.top = '35%';
    reference.style.left = '15%';
    reference.style.width = 'auto';
    reference.style.height = 'auto';
    reference.style.fontSize = 'large';
    reference.style.margin = '10px';
    reference.style.transform = 'translate(-50%, -50%)';
    reference.style.background = 'rgba(33,33,33,.9)'
    reference.style.color = '#fff';
    reference.style.padding = '10px';
    reference.style.zIndex = '9999';
    reference.style.position = 'fixed';
    reference.style.display = 'none';
    reference.innerHTML = `
        <h3>Video Player Shortcuts</h3>
        <ul style="list-style-type: none; padding-left: 0;">
            <li style="display: flex; align-items: center;"><code style="font-size: 1.2em; font-weight: bold;">←</code>&nbsp; &nbsp;<span style="color: #999; margin-left: 10px;">Rewind 5 seconds</span></li>
            <li style="display: flex; align-items: center;"><code style="font-size: 1.2em; font-weight: bold;">→</code>&nbsp; &nbsp;<span style="color: #999; margin-left: 10px;">Fast forward 5 seconds</span></li>
            <li style="display: flex; align-items: center;"><code style="font-size: 1.2em; font-weight: bold;">↑</code>&nbsp; &nbsp;&nbsp;<span style="color: #999; margin-left: 10px;">Increase volume</span></li>
            <li style="display: flex; align-items: center;"><code style="font-size: 1.2em; font-weight: bold;">↓</code>&nbsp; &nbsp;&nbsp;<span style="color: #999; margin-left: 10px;">Decrease volume</span></li>
            <li style="display: flex; align-items: center;"><code style="font-size: 1.2em; font-weight: bold;">F</code>&nbsp; &nbsp;&nbsp;<span style="color: #999; margin-left: 10px;">Toggle fullscreen</span></li>
            <li style="display: flex; align-items: center;"><code style="font-size: 1.2em; font-weight: bold;">M</code>&nbsp; &nbsp;&nbsp;<span style="color: #999; margin-left: 10px;">Toggle mute</span></li>
            <li style="display: flex; align-items: center;"><code style="font-size: 1.2em; font-weight: bold;">[</code>&nbsp; &nbsp;&nbsp;<span style="color: #999; margin-left: 10px;">Slow down playback</span></li>
            <li style="display: flex; align-items: center;"><code style="font-size: 1.2em; font-weight: bold;">]</code>&nbsp; &nbsp;&nbsp;<span style="color: #999; margin-left: 10px;">Speed up playback</span></li>
            <li style="display: flex; align-items: center;"><code style="font-size: 1.2em; font-weight: bold;">R</code>&nbsp; &nbsp;&nbsp;<span style="color: #999; margin-left: 10px;">Reset player settings</span></li>
            <li style="display: flex; align-items: center;"><code style="font-size: 1.2em; font-weight: bold;">Q</code>&nbsp; &nbsp;&nbsp;<span style="color: #999; margin-left: 10px;">Show shortcuts reference</span></li>
            <li style="display: flex; align-items: center;"><code style="font-size: 1.2em; font-weight: bold;">P</code>&nbsp;&nbsp;&nbsp;<span style="color: #999; margin-left: 10px;">Play or Pause Video </span></li>
            <li style="display: flex; align-items: center;"><code style="font-size: 1.2em; font-weight: bold;">Esc</code> <span style="color: #999; margin-left: 10px;">Exit fullscreen</span></li>
         
        </ul>
        <button style="position: absolute; top: 5px; right: 5px; background: none; border: none; font-size: 20px; color: #fff; cursor: pointer;" onclick="this.parentNode.style.display = 'none'">×</button>
    `;
    document.body.appendChild(reference);
}

// 显示快捷键提示框
function showReference() {
    let ele = document.getElementById(MSG_BOX_ID);
    if (ele.style.display === 'none') {
        ele.style.display = 'block';
    } else {
        ele.style.display = 'none';
    }
}

/**
 * 生成video标签的父标签
 * @param videoElement video player tag
 * @param feedbackElement some Information
 * @returns videoContainer
 */
function createVideoParentElement(videoElement, feedbackElement) {
    var videoContainer;
    ///////
    videoContainer = document.createElement('div');
    videoContainer.id = 'fun-video-container';
    // videoContainer 样式设置
    videoContainer.style.position = 'relative'; // 设置父节点 div 的定位方式
    // videoContainer.style.position ='inherit';
    videoContainer.style.width = videoElement.offsetWidth + 'px'; // 设置父节点 div 的宽度
    videoContainer.style.height = videoElement.offsetHeight + 'px'; // 设置父节点 div 的高度
    container_default_size = {
        width: videoElement.offsetWidth,
        height: videoElement.offsetHeight
    };
    // console.log("----------------------container_default_size--------------------")
    // console.log(container_default_size)
    // console.log(videoContainer)
    if (videoElement.parentElement === document.body) {
        document.body.appendChild(videoContainer);
    } else {
        // hint: 这个函数已经将videoContainer 加入到document 中, 不需要二次加入
        videoElement.parentNode.insertBefore(videoContainer, videoElement); // 将父节点 div 插入到 video 的前面
    }
    // console.log(videoContainer)
    videoContainer.appendChild(videoElement);
    videoContainer.appendChild(feedbackElement); //
    videoContainer.appendChild(document.getElementById(MSG_BOX_ID)); // 添加 快捷键消息提示框.
    // console.log(videoElement.parentElement)

    return videoContainer;
}

// 获取<video> 主元素
function initVideoPlayerDefault() {
    // 获取HTML5视频播放器元素
    let videoPlayer = document.querySelector('video');
    // 如果没有找到视频播放器则退出
    if (!videoPlayer) return;
    console.log('----------------videoPlayer--------------')
    console.log(videoPlayer)
    videoPlayer.setAttribute('controls', true);
    videoPlayer.constrolsList = 'nofullscreen';
    videoPlayer.style.cssText = 'width:100%;height:100%;display:inline-block';
    return videoPlayer;


}

//全屏观看
function enterFullScreen(videoContainer, videoPlayer, showFeedback) {
    console.log("---------------enterFullScreen----------------------")
    console.log(container_default_size)
    videoContainer.style.width = body_size.width + 'px';
    videoContainer.style.height = body_size.height + 'px';
    addVideo(videoContainer,videoPlayer);
    videoContainer.requestFullscreen();
    console.log(videoContainer)
    console.log("====================================================")
    videoPlayer.play();
    showFeedback('Fullscreen');
}

// 退出全屏
function exitFullScreen(videoContainer) {
    if (document.fullscreenElement === videoContainer) {
        console.log("----------------exit-fullScreen----------------------")
        console.log(container_default_size)
        videoContainer.style.width = container_default_size.width + 'px';
        videoContainer.style.height = container_default_size.height + 'px';
        console.log(videoContainer)
        console.log("------------------------------------------------------")
        document.exitFullscreen();
    }
}

/**
 * 将 video player 作为 videoContainer 的第一个子元素存在
 * @param videoContainer
 * @param videoPlayer
 */
function addVideo(videoContainer, videoPlayer) {
    if (videoContainer && videoPlayer) {
        videoContainer.insertBefore(videoPlayer, videoContainer.firstChild);
    } else {
        console.log(" video-container | video don't exist ")
    }
}

/**
 * 判断 videoPlayer.display === none , 如果是, 设置为inline-block
 * @param videoPlayer
 */
function checkVideoPlayerDisplay(videoPlayer) {
    if (videoPlayer.style.display === 'none') {
        videoPlayer.style.display = 'inline-block';
    }
    return videoPlayer;
}

/**
 * 静音切换
 * @param videoPlayer
 * @param showFeedback
 */
function toggleMute(videoPlayer, showFeedback) {
    if (videoPlayer.muted) {
        videoPlayer.muted = false;
        showFeedback('Mute Off')
    } else {
        videoPlayer.muted = true;
        showFeedback('Mute On')
    }
}

/**
 *  视频全屏, 不是 videoContainer 下的全屏 切换到 videoContainer,
 * @param videoContainer
 * @param videoPlayer
 * @param showFeedback
 */
function toggleFullScreen(videoContainer, videoPlayer, showFeedback) {

    addVideo(videoContainer, videoPlayer);
    videoPlayer = checkVideoPlayerDisplay(videoPlayer);
    if (document.fullscreenElement === videoContainer) {
        console.log("*********************----------------------exit------------------------")
        exitFullScreen(videoContainer)
    } else {
        console.log('--*************---------------F----not full screen --------------------')
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        enterFullScreen(videoContainer, videoPlayer, showFeedback);
    }
}

/// main function////
function main() {
    'use strict';
    // 初始化, 创建shortcutsBox & initBodySize
    console.log("-----------------video Enhancer---------")
    init()

    // 创建 video标签 deepCopy
    // var videoPlayer = initVideoPlayer(); //copy
    let videoPlayer = initVideoPlayerDefault();


    if (!videoPlayer) return;

    // 创建一个用于显示反馈提示的<div>元素
    let feedback = document.createElement('div');
    feedback.style.cssText = 'position:fixed !important; z-index:2147483647 !important; isolation:isolate !important;top:10%;right:5%;transform:translate(-50%,-50%);background:#333;color:#fff;padding:10px;border-radius:5px;z-index:2147483647;font-size:16px;visibility:hidden;'
    // document.body.appendChild(feedback);

    // 为视频播放器创建父元素
    let videoContainer = createVideoParentElement(videoPlayer, feedback);
    // 全屏 变化 操作
    document.addEventListener('fullscreenchange', function () {

        // toggleFullScreen(videoContainer, videoPlayer, feedback)
        addVideo(videoContainer, videoPlayer)
        var fullscreenElement = document.fullscreenElement;
        if (!fullscreenElement) { // 退出全屏
            videoContainer.style.width = container_default_size.width + 'px';
            videoContainer.style.height = container_default_size.height + 'px';
        } else if (videoContainer === fullscreenElement) {

            videoContainer.style.width = body_size.width + 'px';
            videoContainer.style.height = body_size.height + 'px';
            console.log("------------video-container  fullscreen ----------------")
        } else { // 进入全屏
            console.log("-------------other div-------------------------------------")
            videoContainer.style.position = 'static';
            // enterFullScreen(videoContainer,videoPlayer,feedback)
        }

    });
    handleShortCuts();

    /////////////////////////////////// end //////////////////////////
    function handleShortCuts() {
        // 设置视频播放器的快捷键
        document.addEventListener('keydown', function (event) {
            // Add keyboard event listeners to the video element
            const key = event.key;
            console.log("----------------key: " + key + "-----------------")
            switch (key) {
                case 'Space':
                    // // console.log("----------------space---------------")
                    if (videoPlayer.paused) { // 如果视频已经暂停，则播放视频
                        videoPlayer.play();
                    } else { // 如果视频正在播放，则暂停视频
                        videoPlayer.pause();
                    }
                    break;
                case 'ArrowLeft':
                    videoPlayer.currentTime -= 5;
                    showFeedback('← 5s');
                    break;
                case 'ArrowRight':
                    videoPlayer.currentTime += 5;
                    showFeedback('→ 5s');
                    break;
                case 'ArrowUp':
                    if (videoPlayer.volume < 1) {
                        videoPlayer.volume += 0.1;
                        showFeedback('↑ Volume');
                    }
                    break;
                case 'ArrowDown':
                    if (videoPlayer.volume > 0) {
                        videoPlayer.volume -= 0.1;
                        showFeedback('↓ Volume');
                    }
                    break;
                case 'f':
                    toggleFullScreen(videoContainer, videoPlayer, showFeedback);
                    break;
                case 'm':
                    toggleMute(videoPlayer, showFeedback);
                    break;
                case '[':
                    videoPlayer.playbackRate = Math.max(0.1, videoPlayer.playbackRate - 0.1);
                    showFeedback(`- ${videoPlayer.playbackRate.toFixed(1)}x`);
                    break;
                case ']':
                    videoPlayer.playbackRate += 0.1;
                    showFeedback(`+ ${videoPlayer.playbackRate.toFixed(1)}x`);
                    break;
                case 'r': // r 键，重置播放器设置
                    videoPlayer.volume = 1;
                    videoPlayer.playbackRate = 1;
                    showFeedback('Reset');
                    break;

                case 'q': // 显示快捷键信息
                    showReference();
                    break;
                case 'p':
                    if (videoPlayer.paused) { // 如果视频已经暂停，则播放视频
                        videoPlayer.play();
                    } else { // 如果视频正在播放，则暂停视频
                        videoPlayer.pause();
                    }
                    break;
                default:
                    break;
            }
        });
    }


// 显示按键反馈
    function showFeedback(text) {
        feedback.textContent = text;
        feedback.style.visibility = 'visible';

        setTimeout(function () {
            feedback.style.visibility = 'hidden';
        }, 1000);
    }
}

window.addEventListener('load', main);
