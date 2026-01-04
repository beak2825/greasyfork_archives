// ==UserScript==
// @name         小说阅读自动滚动
// @description 一个阅读APP网页端自动滚动功能
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @resource css https://cdnjs.cloudflare.com/ajax/libs/antd/4.17.0/antd.min.css
// @downloadURL https://update.greasyfork.org/scripts/472561/%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/472561/%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isScrolling = false;
    var intervalId;
    var scrollSpeed = 25; // Default scroll speed (milliseconds per scroll)
    var scrollPixels = 1; // Default scroll amount (pixels per scroll)
    var isConfigPanelOpen = false;

    function startScrolling() {
        if (!isScrolling) {
            isScrolling = true;
            intervalId = setInterval(function() {
                window.scrollBy(0, scrollPixels);
                if (isAtBottom()) {
                    window.scrollBy(0, 1); // Scroll one more pixel to prevent getting stuck at the bottom
                }
            }, scrollSpeed);
        }
    }

    function stopScrolling() {
        if (isScrolling) {
            isScrolling = false;
            clearInterval(intervalId);
        }
    }

    function toggleScrolling() {
        if (isScrolling) {
            stopScrolling();
        } else {
            startScrolling();
        }
        updateButtonState();
    }

    function updateButtonState() {
        var scrollButton = document.getElementById('scrollButton');
        if (isScrolling) {
            scrollButton.innerText = '停止滚动';
            scrollButton.style.backgroundColor = '#FF0000';
        } else {
            scrollButton.innerText = '开始滚动';
            scrollButton.style.backgroundColor = '#007BFF';
        }
        document.getElementById('scrollStatus').innerText = isScrolling ? '状态：正在滚动' : '状态：停止滚动';
    }

    function updateScrollConfig() {
        var speedInput = document.getElementById('scrollSpeedInput');
        var pixelsInput = document.getElementById('scrollPixelsInput');

        scrollSpeed = parseInt(speedInput.value) || scrollSpeed;
        scrollPixels = parseInt(pixelsInput.value) || scrollPixels;
    }

    function isAtBottom() {
        // Check if we are at the bottom of the page
        return window.innerHeight + window.scrollY >= document.body.scrollHeight;
    }

    function toggleConfigPanel() {
        var configPanel = document.getElementById('configPanel');
        var configButton = document.getElementById('configButton');
        isConfigPanelOpen = !isConfigPanelOpen;
        configPanel.style.display = isConfigPanelOpen ? 'block' : 'none';
        configButton.innerText = isConfigPanelOpen ? '收起' : '配置';

        // Adjust the position of the buttons based on the config panel state
        var scrollButton = document.getElementById('scrollButton');
        scrollButton.style.right = isConfigPanelOpen ? '310px' : '10px';

        var statusDiv = document.getElementById('statusDiv');
        statusDiv.style.right = isConfigPanelOpen ? '310px' : '10px';
    }

    function addButton() {
        var configDiv = document.createElement('div');
        configDiv.style.position = 'fixed';
        configDiv.style.bottom = '50%';
        configDiv.style.right = isConfigPanelOpen ? '300px' : '0';
        configDiv.style.transform = 'translateY(50%)';
        configDiv.style.zIndex = '9999';
        configDiv.style.padding = '20px';
        configDiv.style.background = '#ffffff';
        configDiv.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        configDiv.style.borderRadius = isConfigPanelOpen ? '5px 0 0 5px' : '5px';
        configDiv.className = 'ant-card';
        configDiv.id = 'configPanel';
        configDiv.style.display = 'none';

        var configButton = document.createElement('button');
        configButton.textContent = '收起';
        configButton.style.position = 'absolute';
        configButton.style.top = '10px';
        configButton.style.right = '10px';
        configButton.style.backgroundColor = '#007BFF';
        configButton.style.color = '#fff';
        configButton.style.border = 'none';
        configButton.style.borderRadius = '5px';
        configButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        configButton.addEventListener('click', toggleConfigPanel);
        configDiv.appendChild(configButton);

        var scrollButton = document.createElement('button');
        scrollButton.textContent = '开始滚动';
        scrollButton.style.marginTop = '30px';
        scrollButton.style.padding = '10px 20px';
        scrollButton.style.backgroundColor = '#007BFF';
        scrollButton.style.color = '#fff';
        scrollButton.style.border = 'none';
        scrollButton.style.borderRadius = '5px';
        scrollButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        scrollButton.id = 'scrollButton';
        scrollButton.addEventListener('click', toggleScrolling);
        configDiv.appendChild(scrollButton);

        var scrollStatus = document.createElement('div');
        scrollStatus.textContent = '状态：停止滚动';
        scrollStatus.id = 'scrollStatus';
        scrollStatus.style.marginTop = '10px';
        configDiv.appendChild(scrollStatus);

        var speedLabel = document.createElement('label');
        speedLabel.textContent = '滚动速度 (毫秒/次): ';
        var speedInput = document.createElement('input');
        speedInput.type = 'number';
        speedInput.min = '1';
        speedInput.value = scrollSpeed.toString();
        speedInput.id = 'scrollSpeedInput';
        speedInput.className = 'ant-input';
        speedInput.addEventListener('change', updateScrollConfig);

        var pixelsLabel = document.createElement('label');
        pixelsLabel.textContent = '滚动像素 (像素/次): ';
        var pixelsInput = document.createElement('input');
        pixelsInput.type = 'number';
        pixelsInput.min = '1';
        pixelsInput.value = scrollPixels.toString();
        pixelsInput.id = 'scrollPixelsInput';
        pixelsInput.className = 'ant-input';
        pixelsInput.addEventListener('change', updateScrollConfig);

        configDiv.appendChild(speedLabel);
        configDiv.appendChild(speedInput);
        configDiv.appendChild(document.createElement('br'));
        configDiv.appendChild(pixelsLabel);
        configDiv.appendChild(pixelsInput);

        document.body.appendChild(configDiv);
    }

    function addConfigButton() {
        var configButton = document.createElement('button');
        configButton.textContent = '配置';
        configButton.style.position = 'fixed';
        configButton.style.bottom = '50%';
        configButton.style.right = '0';
        configButton.style.transform = 'translateY(50%)';
        configButton.style.zIndex = '9999';
        configButton.style.padding = '10px 15px';
        configButton.style.backgroundColor = '#007BFF';
        configButton.style.color = '#fff';
        configButton.style.border = 'none';
        configButton.style.borderRadius = '5px';
        configButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        configButton.id = 'configButton';
        configButton.addEventListener('click', toggleConfigPanel);
        document.body.appendChild(configButton);
    }

    addConfigButton();
    addButton();
})();


