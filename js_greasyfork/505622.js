// ==UserScript==
// @name         视频加速器+音量设置
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  更强大地识别网页中的视频，在右下角显示倍速操作界面，可隐藏为一个淡色圆形图标并显示倍速数字，显示操作界面时圆形图标隐藏。同时自动将音量设置为 30%。
// @license     MIT
// @author      失辛向南
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505622/%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E5%99%A8%2B%E9%9F%B3%E9%87%8F%E8%AE%BE%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/505622/%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E5%99%A8%2B%E9%9F%B3%E9%87%8F%E8%AE%BE%E7%BD%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let speedControlContainer;
    let speedSelect;
    let isVisible = false;
    let iconContainer;

    function createSpeedControlUI() {
        // 创建倍速控制界面容器
        speedControlContainer = document.createElement('div');
        speedControlContainer.style.position = 'fixed';
        speedControlContainer.style.bottom = '20px';
        speedControlContainer.style.right = '20px';
        speedControlContainer.style.backgroundColor = 'rgba(30, 30, 30, 0.8)';
        speedControlContainer.style.padding = '15px';
        speedControlContainer.style.borderRadius = '10px';
        speedControlContainer.style.color = '#fff';
        speedControlContainer.style.zIndex = '9999';
        speedControlContainer.style.display = 'none';

        // 创建倍速标签
        const speedLabel = document.createElement('span');
        speedLabel.textContent = '播放速度：';
        speedControlContainer.appendChild(speedLabel);

        // 创建下拉选择框
        speedSelect = document.createElement('select');
        speedSelect.classList.add('custom-speed-select');
        speedSelect.style.backgroundColor = 'rgba(50, 50, 50, 0.8)';
        speedSelect.style.color = '#fff';
        speedSelect.style.border = 'none';
        speedSelect.style.outline = 'none';
        speedSelect.style.appearance = 'none';
        speedSelect.style.padding = '5px 10px';
        speedSelect.style.borderRadius = '5px';
        for (let i = 0.25; i <= 5; i += 0.25) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i + 'x';
            option.style.backgroundColor = 'rgba(50, 50, 50, 0.8)';
            option.style.color = '#fff';
            speedSelect.appendChild(option);
        }
        speedSelect.value = '1';
        speedControlContainer.appendChild(speedSelect);

        document.body.appendChild(speedControlContainer);

        speedSelect.addEventListener('change', updateVideoSpeeds);

        // 创建图标容器
        iconContainer = document.createElement('div');
        iconContainer.style.position = 'fixed';
        iconContainer.style.bottom = '20px';
        iconContainer.style.right = '20px';
        iconContainer.style.width = '40px';
        iconContainer.style.height = '40px';
        iconContainer.style.backgroundColor = 'rgba(220, 220, 220, 0.6)';
        iconContainer.style.borderRadius = '50%';
        iconContainer.style.textAlign = 'center';
        iconContainer.style.lineHeight = '40px';
        iconContainer.style.cursor = 'pointer';
        iconContainer.style.zIndex = '9999';
        document.body.appendChild(iconContainer);

        iconContainer.addEventListener('click', toggleVisibility);

        document.addEventListener('mousemove', handleMouseMove);

        const style = document.createElement('style');
        style.textContent = `
       .custom-speed-select option {
                color: #ffffff;
            }
         .custom-speed-select {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="white"><polygon points="0,0 10,0 5,5"/></svg>');
                background-repeat: no-repeat;
                background-position: right 5px center;
            }
        `;
        document.head.appendChild(style);
    }

    function updateVideoSpeeds() {
        const videos = findAllVideoElements();
        for (let video of videos) {
            video.playbackRate = parseFloat(speedSelect.value);
            video.volume = 0.3; // 设置音量为 30%
        }
        updateIconText();
    }

    function checkForVideos() {
        const videos = findAllVideoElements();
        if (videos.length > 0) {
            if (!speedControlContainer) {
                createSpeedControlUI();
            }
            updateVideoSpeeds();
        } else {
            if (speedControlContainer) {
                speedControlContainer.remove();
                speedControlContainer = null;
                speedSelect = null;
                iconContainer.remove();
                iconContainer = null;
            }
        }
    }

    function isVideoPage() {
        const videoElements = findAllVideoElements();
        return videoElements.length > 0;
    }

    function handleMouseMove(event) {
        if (!isVisible && isInsideIcon(event.clientX, event.clientY)) {
            showContainer();
        } else if (isVisible &&!isInsideContainer(event.clientX, event.clientY)) {
            hideContainer();
        }
    }

    function isInsideIcon(x, y) {
        const iconRect = iconContainer.getBoundingClientRect();
        return x >= iconRect.left && x <= iconRect.right && y >= iconRect.top && y <= iconRect.bottom;
    }

    function isInsideContainer(x, y) {
        const containerRect = speedControlContainer.getBoundingClientRect();
        return x >= containerRect.left && x <= containerRect.right && y >= containerRect.top && y <= containerRect.bottom;
    }

    function showContainer() {
        speedControlContainer.style.display = 'block';
        iconContainer.style.display = 'none';
        isVisible = true;
    }

    function hideContainer() {
        speedControlContainer.style.display = 'none';
        iconContainer.style.display = 'block';
        isVisible = false;
    }

    function toggleVisibility() {
        if (isVisible) {
            hideContainer();
        } else {
            showContainer();
        }
    }

    function updateIconText() {
        iconContainer.textContent = speedSelect.value + 'x';
    }

    function findAllVideoElements() {
        const videoTags = Array.from(document.getElementsByTagName('video'));
        const iframeVideos = Array.from(document.querySelectorAll('iframe[src*=".mp4"], iframe[src*=".webm"], iframe[src*=".ogg"]'))
          .map(element => {
                if (element.tagName === 'IFRAME') {
                    return element.contentDocument? element.contentDocument.getElementsByTagName('video')[0] : null;
                } else {
                    return null;
                }
            })
          .filter(video => video!== null);
        const customVideoElements = Array.from(document.querySelectorAll('[data-video]'))
          .map(element => {
                const videoSrc = element.getAttribute('data-video');
                if (videoSrc && (videoSrc.endsWith('.mp4') || videoSrc.endsWith('.webm') || videoSrc.endsWith('.ogg'))) {
                    const video = document.createElement('video');
                    video.src = videoSrc;
                    return video;
                } else {
                    return null;
                }
            })
          .filter(video => video!== null);
        const potentialVideoElements = Array.from(document.querySelectorAll('*'))
          .filter(element => {
                const backgroundImage = window.getComputedStyle(element).backgroundImage;
                return backgroundImage && (backgroundImage.includes('.mp4') || backgroundImage.includes('.webm') || backgroundImage.includes('.ogg'));
            })
          .map(element => {
                const video = document.createElement('video');
                const backgroundImage = window.getComputedStyle(element).backgroundImage;
                const videoSrc = backgroundImage.match(/url\((.*?)\)/)[1];
                video.src = videoSrc;
                return video;
            })
          .filter(video => video!== null);
        return videoTags.concat(iframeVideos).concat(customVideoElements).concat(potentialVideoElements);
    }

    window.addEventListener('load', () => {
        if (isVideoPage()) {
            checkForVideos();
        }
    });
    window.addEventListener('DOMContentLoaded', () => {
        if (isVideoPage()) {
            checkForVideos();
        }
    });
})();