// ==UserScript==
// @name         极速滚动页面神器
// @namespace    https://www.suyin66.com/
// @version      0.6
// @description  自动滚动页面，并可自定义滚动速度，优化界面和交互体验，支持拖动控制面板。
// @author       Suyin
// @match        *://*/*
// @icon         https://cdn.suyin66.com/wp-content/uploads/2023/06/1685971902-20230605133142562756.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467978/%E6%9E%81%E9%80%9F%E6%BB%9A%E5%8A%A8%E9%A1%B5%E9%9D%A2%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/467978/%E6%9E%81%E9%80%9F%E6%BB%9A%E5%8A%A8%E9%A1%B5%E9%9D%A2%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let scrollInterval;
    let scrollSpeed = 50;
    let isDragging = false;
    let offsetX, offsetY;

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '50px';
        panel.style.left = '10px';
        panel.style.padding = '10px';
        panel.style.background = 'rgba(0,0,0,0.8)';
        panel.style.color = '#fff';
        panel.style.borderRadius = '5px';
        panel.style.zIndex = '9999';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.gap = '5px';
        panel.style.cursor = 'move';
        panel.setAttribute('id', 'scrollControlPanel');

        const label = document.createElement('label');
        label.textContent = '滚动速度 (px/s):';
        panel.appendChild(label);

        const speedInput = document.createElement('input');
        speedInput.type = 'number';
        speedInput.value = scrollSpeed;
        speedInput.style.width = '100px';
        speedInput.style.padding = '5px';
        speedInput.style.borderRadius = '3px';
        speedInput.style.border = '1px solid #ccc';
        speedInput.style.textAlign = 'center';
        speedInput.style.color = '#000';
        speedInput.style.background = '#fff';
        speedInput.addEventListener('change', () => {
            scrollSpeed = parseInt(speedInput.value) || 50;
        });
        panel.appendChild(speedInput);

        const startButton = document.createElement('button');
        startButton.textContent = '开始滚动';
        startButton.style.padding = '5px';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '3px';
        startButton.style.cursor = 'pointer';
        startButton.style.background = '#4CAF50';
        startButton.style.color = '#fff';
        startButton.addEventListener('click', startScrolling);
        panel.appendChild(startButton);

        const stopButton = document.createElement('button');
        stopButton.textContent = '停止滚动';
        stopButton.style.padding = '5px';
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '3px';
        stopButton.style.cursor = 'pointer';
        stopButton.style.background = '#f44336';
        stopButton.style.color = '#fff';
        stopButton.style.display = 'none';
        stopButton.addEventListener('click', stopScrolling);
        panel.appendChild(stopButton);

        document.body.appendChild(panel);
        addDragFunctionality(panel);
    }

    function startScrolling() {
        if (scrollInterval) return;
        const scrollBar = document.documentElement;
        const scrollStep = scrollSpeed / 60;
        scrollInterval = setInterval(() => {
            if (scrollBar.scrollTop + window.innerHeight < scrollBar.scrollHeight) {
                scrollBar.scrollTop += scrollStep;
            } else {
                stopScrolling();
            }
        }, 1000 / 60);
        document.querySelector('#scrollControlPanel button:nth-child(3)').style.display = 'none';
        document.querySelector('#scrollControlPanel button:nth-child(4)').style.display = 'block';
    }

    function stopScrolling() {
        clearInterval(scrollInterval);
        scrollInterval = null;
        document.querySelector('#scrollControlPanel button:nth-child(3)').style.display = 'block';
        document.querySelector('#scrollControlPanel button:nth-child(4)').style.display = 'none';
    }

    function addDragFunctionality(panel) {
        panel.addEventListener('mousedown', function (event) {
            isDragging = true;
            offsetX = event.clientX - panel.offsetLeft;
            offsetY = event.clientY - panel.offsetTop;
        });
        document.addEventListener('mousemove', function (event) {
            if (isDragging) {
                panel.style.left = event.clientX - offsetX + 'px';
                panel.style.top = event.clientY - offsetY + 'px';
            }
        });
        document.addEventListener('mouseup', function () {
            isDragging = false;
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.altKey && event.key === 'z') {
            startScrolling();
        } else if (event.altKey && event.key === 'x') {
            stopScrolling();
        }
    });

    window.addEventListener('load', createControlPanel);
})();
