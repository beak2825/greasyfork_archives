// ==UserScript==
// @name         自动滚动页面
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动滚动页面并具有速度调整功能的油猴插件
// @author       Leeyw
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464795/%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/464795/%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let scrolling = false;
    let scrollSpeed = 1;
    let deleted = false;

    // 自动清除本地存储中的插件配置信息
    localStorage.removeItem('autoScrollEnabled');

    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed';
    controlPanel.style.right = '10px';
    controlPanel.style.bottom = '10px';
    controlPanel.style.zIndex = '1000';
    controlPanel.style.padding = '10px';
    controlPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    controlPanel.style.borderRadius = '5px';
    controlPanel.style.color = 'white';

    const speedInput = document.createElement('input');
    speedInput.type = 'number';
    speedInput.value = scrollSpeed;
    speedInput.style.width = '50px';

    const startStopButton = document.createElement('button');
    startStopButton.textContent = '开始';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '删除';

    controlPanel.appendChild(document.createTextNode('滚动速度: '));
    controlPanel.appendChild(speedInput);
    controlPanel.appendChild(document.createTextNode(' px/s'));
    controlPanel.appendChild(document.createElement('br'));
    controlPanel.appendChild(startStopButton);
    controlPanel.appendChild(deleteButton);

    document.body.appendChild(controlPanel);

    startStopButton.addEventListener('click', () => {
        scrolling = !scrolling;
        startStopButton.textContent = scrolling ? '停止' : '开始';
        if (scrolling) {
            window.requestAnimationFrame(autoScroll);
        }
        // 保存配置信息到本地存储
        saveConfig();
    });

    deleteButton.addEventListener('click', () => {
        // 从本地存储中删除配置信息
        localStorage.removeItem('autoScrollEnabled');
        // 标记插件已被删除
        deleted = true;
        // 从页面中删除插件 UI
        controlPanel.remove();
    });

    speedInput.addEventListener('change', () => {
        scrollSpeed = parseInt(speedInput.value, 10);
        // 保存配置信息到本地存储
        saveConfig();
    });

    let frame = 0

    function autoScroll() {
        if (frame >= 3) {
          const scrollAmount = scrollSpeed;
          window.scrollBy(0, scrollAmount);
          frame = 0;
        }
        frame++

        if (scrolling) {
            window.requestAnimationFrame(autoScroll);
        } else {
            frame = null;
        }
    }

    // 保存配置信息到本地存储
    const saveConfig = () => {
        localStorage.setItem('autoScrollEnabled', JSON.stringify(scrolling));
    };

    // 如果插件已经被删除，则直接返回，不再执行插件代码
    if (deleted) {
        return;
    }

    // 从本地存储中加载配置信息
    const loadConfig = () => {
        const enabled = JSON.parse(localStorage.getItem('autoScrollEnabled'));
        if (enabled !== null) {
            scrolling = enabled;
        startStopButton.textContent = scrolling ? '停止' : '开始';
        if (scrolling) {
            window.requestAnimationFrame(autoScroll);
        }
    }
};
loadConfig();
})();

