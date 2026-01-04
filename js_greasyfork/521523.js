// ==UserScript==
// @name         B站多P分P视频合集随机播放（开关式）
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @author       Lalo
// @license      MIT
// @description  B站视频多P分P合集随机播放，自用
// @match        https://www.bilibili.com/video/*

// @downloadURL https://update.greasyfork.org/scripts/521523/B%E7%AB%99%E5%A4%9AP%E5%88%86P%E8%A7%86%E9%A2%91%E5%90%88%E9%9B%86%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE%EF%BC%88%E5%BC%80%E5%85%B3%E5%BC%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521523/B%E7%AB%99%E5%A4%9AP%E5%88%86P%E8%A7%86%E9%A2%91%E5%90%88%E9%9B%86%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE%EF%BC%88%E5%BC%80%E5%85%B3%E5%BC%8F%EF%BC%89.meta.js
// ==/UserScript==

// 创建开关按钮
const toggleButton = document.createElement('button');
toggleButton.innerText = '随机播放开关（关闭）'; // 默认关闭
toggleButton.style.position = 'fixed';
toggleButton.style.bottom = '20px';
toggleButton.style.right = '20px';
toggleButton.style.zIndex = '1000';
toggleButton.style.padding = '10px 20px';
toggleButton.style.backgroundColor = '#00a1d6';
toggleButton.style.color = '#fff';
toggleButton.style.border = 'none';
toggleButton.style.borderRadius = '5px';
toggleButton.style.cursor = 'pointer';

document.body.appendChild(toggleButton);

// 获取开关状态，从 localStorage 中读取
let isRandomPlayEnabled = localStorage.getItem('isRandomPlayEnabled') === 'true';
toggleButton.innerText = isRandomPlayEnabled ? '随机播放开关（开启）' : '随机播放开关（关闭）';

// 获取视频列表
function getVideoList() {
    let videoCards = document.querySelectorAll('.normal'); // 假设视频卡片类名为 .normal
    if(videoCards.length <= 0){
        videoCards = document.querySelectorAll('.sub');
    }
    console.log("videoCards",videoCards);
    return Array.from(videoCards); // 转换为数组
}

// 随机播放视频
function playRandomVideo() {
    const videoList = getVideoList();
    if (videoList.length > 0) {
        const randomIndex = Math.floor(Math.random() * videoList.length);
        const randomVideoCard = videoList[randomIndex];
        // 创建一个点击事件
        const event = new MouseEvent('click');
        // 分派事件
        randomVideoCard.dispatchEvent(event);
    } else {
        alert('没有找到视频列表');
    }
}

// 监听播放结束事件
function listenForVideoEnd() {
    const videoPlayer = document.querySelector('video');
    if (videoPlayer) {
        videoPlayer.addEventListener('ended', () => {
            if (isRandomPlayEnabled) {
                playRandomVideo();
            }
        });
    }
}

// 覆盖“上一个”和“下一个”按钮的点击事件
function overrideNavigationButtons() {
    document.addEventListener('click', (event) => {
        const isPrevButton = event.target.closest('.bpx-player-ctrl-prev');
        const isNextButton = event.target.closest('.bpx-player-ctrl-next');

        if (isRandomPlayEnabled && (isPrevButton || isNextButton)) {
            event.preventDefault();
            event.stopPropagation();
            playRandomVideo();
        }
    }, true); // 使用捕获阶段拦截事件
}

// 初始化监听
function initListeners() {
    listenForVideoEnd();
    overrideNavigationButtons();
}

// 开关按钮点击事件
toggleButton.addEventListener('click', () => {
    isRandomPlayEnabled = !isRandomPlayEnabled;
    toggleButton.innerText = isRandomPlayEnabled ? '随机播放开关（开启）' : '随机播放开关（关闭）';
    localStorage.setItem('isRandomPlayEnabled', isRandomPlayEnabled);
    if (isRandomPlayEnabled) {
        initListeners();
    }
});

// 页面加载完成后初始化
window.addEventListener('load', () => {
    if (isRandomPlayEnabled) {
        initListeners();
    }
});