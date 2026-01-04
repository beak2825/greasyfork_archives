// ==UserScript==
// @name        时间领主
// @namespace   http://tampermonkey.net/
// @version     1.2.1
// @description 在所有网页右下角加一个倍速操作界面
// @license     MIT
// @author      失辛向南
// @match       *://*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/505623/%E6%97%B6%E9%97%B4%E9%A2%86%E4%B8%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/505623/%E6%97%B6%E9%97%B4%E9%A2%86%E4%B8%BB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let speedControlContainer;
    let speedSelect;
    let isVisible = false;
    let iconContainer;

    function createSpeedControlUI() {
        speedControlContainer = document.createElement('div');
        speedControlContainer.style.position = 'fixed';
        speedControlContainer.style.bottom = '20px';
        speedControlContainer.style.right = '20px';
        speedControlContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        speedControlContainer.style.padding = '10px';
        speedControlContainer.style.borderRadius = '5px';
        speedControlContainer.style.color = 'white';
        speedControlContainer.style.zIndex = '9999';
        speedControlContainer.style.display = 'none';

        const speedLabel = document.createElement('span');
        speedLabel.textContent = 'Speed: ';
        speedControlContainer.appendChild(speedLabel);

        speedSelect = document.createElement('select');
        for (let i = 1; i <= 20; i += 1) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i + 'x';
            speedSelect.appendChild(option);
        }
        speedControlContainer.appendChild(speedSelect);

        document.body.appendChild(speedControlContainer);

        // 创建图标容器
        iconContainer = document.createElement('div');
        iconContainer.style.position = 'fixed';
        iconContainer.style.bottom = '20px';
        iconContainer.style.right = '20px';
        iconContainer.style.width = '30px';
        iconContainer.style.height = '30px';
        iconContainer.style.backgroundColor = 'rgba(200, 200, 200, 0.5)';
        iconContainer.style.borderRadius = '50%';
        iconContainer.style.textAlign = 'center';
        iconContainer.style.lineHeight = '30px';
        iconContainer.style.cursor = 'pointer';
        iconContainer.style.zIndex = '9999';
        document.body.appendChild(iconContainer);

        iconContainer.addEventListener('mouseenter', toggleVisibility);
        speedControlContainer.addEventListener('mouseleave', toggleVisibility);

        speedSelect.addEventListener('change', updateVideoSpeeds);
    }

    function updateVideoSpeeds() {
        const selectedSpeed = parseFloat(speedSelect.value);
        const videos = document.getElementsByTagName('video');
        for (let video of videos) {
            let adjustedSpeed = selectedSpeed;
            if (adjustedSpeed > 16) {
                adjustedSpeed = 16;
            }
            video.playbackRate = adjustedSpeed;
        }
        updateIconText();
    }

    function updateIconText() {
        iconContainer.textContent = speedSelect.value + 'x';
    }

    function toggleVisibility() {
        if (isVisible) {
            hideContainer();
        } else {
            showContainer();
        }
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

    createSpeedControlUI();
    updateIconText();
})();