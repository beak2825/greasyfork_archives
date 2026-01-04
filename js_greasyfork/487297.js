// ==UserScript==
// @name         自动滚动配置
// @description  一个阅读APP网页端自动滚动功能
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @match        *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @resource css https://cdnjs.cloudflare.com/ajax/libs/antd/4.17.0/antd.min.css
// @downloadURL https://update.greasyfork.org/scripts/487297/%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E9%85%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/487297/%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E9%85%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isScrolling = false;
    var intervalId;
    var scrollSpeed = 25; // 默认的每次滚动间隔
    var scrollPixels = 1; // 默认的每次滚动像素
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
        document.getElementById('scrollStatus').innerText = isScrolling ? '当前状态:滚动' : '当前状态:停止';
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
        scrollButton.style.right = isConfigPanelOpen ? '290px' : '10px';

        var statusDiv = document.getElementById('statusDiv');
        statusDiv.style.right = isConfigPanelOpen ? '310px' : '10px';
    }

    function addButton() {
        var configDiv = document.createElement('div');
        configDiv.style.position = 'fixed';
        configDiv.style.bottom = '50%';
        configDiv.style.right = isConfigPanelOpen ? '100px' : '0';
        configDiv.style.transform = 'translateY(50%)';
        configDiv.style.zIndex = '9999';
        configDiv.style.padding = '20px';
        configDiv.style.background = '#fff';
        configDiv.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        configDiv.style.width = '150px';
        configDiv.style.borderRadius = isConfigPanelOpen ? '5px 0 0 5px' : '5px';
        configDiv.className = 'ant-card';
        configDiv.id = 'configPanel';
        configDiv.style.display = 'none';

        var configButton = document.createElement('button');
        configButton.textContent = '收起';
        configButton.style.position = 'absolute';
        configButton.style.padding = '2px 5px';
        configButton.style.fontSize = '12px';
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
        scrollButton.style.margin = '30px auto 0';
        scrollButton.style.padding = '10px 20px';
        scrollButton.style.display = 'block';
        scrollButton.style.backgroundColor = '#007BFF';
        scrollButton.style.fontSize = '14px';
        scrollButton.style.color = '#fff';
        scrollButton.style.border = 'none';
        scrollButton.style.borderRadius = '5px';
        scrollButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        scrollButton.id = 'scrollButton';
        scrollButton.addEventListener('click', toggleScrolling);
        configDiv.appendChild(scrollButton);

        var scrollStatus = document.createElement('div');
        scrollStatus.textContent = '当前状态:停止';
        scrollStatus.id = 'scrollStatus';
        scrollStatus.style.margin = '0 auto';
        scrollStatus.style.textAlign = 'center';
        scrollStatus.style.color = '#000';
        scrollStatus.style.fontSize = '12px';
        configDiv.appendChild(scrollStatus);

        var speedLabel = document.createElement('label');
        speedLabel.textContent = '每次滚动间隔(ms):';
        speedLabel.style.float='left';
        speedLabel.style.margin='6px 0 2px';
        speedLabel.style.padding='0px';
        speedLabel.style.fontSize = '14px';
        speedLabel.style.color = '#000';
        var speedInput = document.createElement('input');
        speedInput.type = 'number';
        speedInput.min = '1';
        speedInput.value = scrollSpeed.toString();
        speedInput.id = 'scrollSpeedInput';
        speedInput.style.backgroundColor = 'rgba(202,203,204,.3)';
        speedInput.style.border='0px';
        speedInput.style.outline='0px';
        speedInput.style.padding='5px 0 5px 8px';
        speedLabel.style.margin='0px';
        speedInput.style.borderRadius='5px';
        speedInput.style.color='#000';
        speedInput.className = 'ant-input';
        speedInput.addEventListener('change', updateScrollConfig);

        var pixelsLabel = document.createElement('label');
        pixelsLabel.textContent = '每次滚动像素(px):';
        pixelsLabel.style.float='left';
        pixelsLabel.style.margin='6px 0 2px';
        pixelsLabel.style.padding='0px';
        pixelsLabel.style.fontSize = '14px';
        pixelsLabel.style.color = '#000';
        var pixelsInput = document.createElement('input');
        pixelsInput.type = 'number';
        pixelsInput.min = '1';
        pixelsInput.value = scrollPixels.toString();
        pixelsInput.id = 'scrollPixelsInput';
        pixelsInput.style.backgroundColor = 'rgba(202,203,204,.3)';
        pixelsInput.style.border='0px';
        pixelsInput.style.outline='0px';
        pixelsInput.style.padding='5px 0 5px 8px';
        pixelsInput.style.margin='0px';
        pixelsInput.style.borderRadius='5px';
        pixelsInput.style.color='#000';
        pixelsInput.className = 'ant-input';
        pixelsInput.addEventListener('change', updateScrollConfig);

        configDiv.appendChild(speedLabel);

        configDiv.appendChild(speedInput);
 
        configDiv.appendChild(pixelsLabel);

        configDiv.appendChild(pixelsInput);

        document.body.appendChild(configDiv);
    }

    function addConfigButton() {
        var configButton = document.createElement('button');
        configButton.textContent = '配置';
        configButton.style.position = 'fixed';
        configButton.style.bottom = '50%';
        configButton.style.right = '-3px';
        configButton.style.transform = 'translateY(50%)';
        configButton.style.opacity = '.6';
        configButton.style.zIndex = '9999';
        configButton.style.padding = '8px .5em';
        configButton.style.fontSize = '12px';
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


