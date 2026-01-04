// ==UserScript==
// @name         视频和歌曲播放速度控制
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  通过按钮调整网页上视频和歌曲的播放速度，默认速度为0.8，并显示当前速度
// @author       你的名字
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501022/%E8%A7%86%E9%A2%91%E5%92%8C%E6%AD%8C%E6%9B%B2%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/501022/%E8%A7%86%E9%A2%91%E5%92%8C%E6%AD%8C%E6%9B%B2%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认播放速度
    let defaultSpeed = 0.8;
    // 速度步长
    let speedStep = 0.1;

    // 创建控制按钮
    function createControlButton(text, onClick, top) {
        let button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.right = '10px';
        button.style.top = top + 'px';
        button.style.zIndex = '1000';
        button.style.fontSize = '20px';
        button.style.padding = '10px';
        button.onclick = onClick;
        return button;
    }

    // 当前速度
    let currentSpeed = defaultSpeed;

    // 显示当前速度按钮
    let speedDisplayButton = createControlButton(`速度: ${currentSpeed.toFixed(1)}`, function() {}, 150);
    document.body.appendChild(speedDisplayButton);

    // 设置播放速度
    function setPlaybackSpeed(speed) {
        currentSpeed = Math.max(0.1, speed); // 最低速度为0.1
        let mediaElements = document.querySelectorAll('video, audio');
        mediaElements.forEach(function(media) {
            media.playbackRate = currentSpeed;
        });
        speedDisplayButton.textContent = `速度: ${currentSpeed.toFixed(1)}`;
    }

    // 增加速度按钮
    let increaseButton = createControlButton('+', function() {
        setPlaybackSpeed(currentSpeed + speedStep);
    }, 50);
    document.body.appendChild(increaseButton);

    // 减少速度按钮
    let decreaseButton = createControlButton('-', function() {
        setPlaybackSpeed(currentSpeed - speedStep);
    }, 100);
    document.body.appendChild(decreaseButton);

    // 重置速度按钮
    let resetButton = createControlButton('重置', function() {
        setPlaybackSpeed(defaultSpeed);
    }, 200);
    document.body.appendChild(resetButton);

    // 初始化播放速度
    function initPlaybackSpeed() {
        setPlaybackSpeed(defaultSpeed);
    }

    // 等待页面加载完成后初始化
    window.addEventListener('load', initPlaybackSpeed);
})();
