// ==UserScript==
// @name         人性化自動點擊器（具GUI界面）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  提供人性化界面，自動點擊選定元素(關閉需要直接關閉插件、重新刷新)
// @author       Weiren
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/522551/%E4%BA%BA%E6%80%A7%E5%8C%96%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E5%99%A8%EF%BC%88%E5%85%B7GUI%E7%95%8C%E9%9D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/522551/%E4%BA%BA%E6%80%A7%E5%8C%96%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E5%99%A8%EF%BC%88%E5%85%B7GUI%E7%95%8C%E9%9D%A2%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 創建一個GUI界面
    const gui = document.createElement('div');
    gui.style.position = 'fixed';
    gui.style.top = '10px';
    gui.style.left = '10px';
    gui.style.padding = '20px';
    gui.style.backgroundColor = '#f4f4f4';
    gui.style.border = '1px solid #ddd';
    gui.style.zIndex = '99999';
    gui.style.fontFamily = 'Arial, sans-serif';
    gui.style.display = 'none'; // 默認隱藏，當用戶點擊界面開啟時顯示

    // 創建標題
    const title = document.createElement('h3');
    title.textContent = '自動點擊器設置';
    gui.appendChild(title);

    // 創建選擇點擊間隔的標籤和輸入框
    const intervalLabel = document.createElement('label');
    intervalLabel.textContent = '點擊間隔（毫秒）：';
    gui.appendChild(intervalLabel);
    const intervalInput = document.createElement('input');
    intervalInput.type = 'number';
    intervalInput.value = 1000; // 默認為1秒
    intervalInput.style.marginLeft = '10px';
    gui.appendChild(intervalInput);
    gui.appendChild(document.createElement('br'));

    // 創建啟動自動點擊的按鈕
    const startButton = document.createElement('button');
    startButton.textContent = '啟動自動點擊';
    startButton.style.marginTop = '10px';
    gui.appendChild(startButton);

    // 創建重置選擇元素的按鈕
    const resetButton = document.createElement('button');
    resetButton.textContent = '重新選擇點擊元素';
    resetButton.style.marginTop = '10px';
    gui.appendChild(resetButton);

    // 創建元素選擇狀態顯示
    const selectedElementStatus = document.createElement('p');
    selectedElementStatus.textContent = '未選擇元素';
    gui.appendChild(selectedElementStatus);

    // 將GUI添加到頁面
    document.body.appendChild(gui);

    // 當用戶點擊 GUI 啟動自動點擊器
    let interval;
    let selectedElement = null;

    // 顯示GUI界面
    setTimeout(() => {
        gui.style.display = 'block';
    }, 2000);

    // 開啟點擊選擇模式
    resetButton.addEventListener('click', () => {
        selectedElementStatus.textContent = '點擊頁面上的任意元素來選擇它。';
        selectedElement = null;

        // 在頁面上設置監聽器來選擇元素
        document.body.addEventListener('click', function(event) {
            event.preventDefault();
            if (event.target) {
                selectedElement = event.target;
                selectedElementStatus.textContent = `選擇了元素: ${selectedElement.tagName} (ID: ${selectedElement.id || '無 ID'}, 類名: ${selectedElement.className || '無類名'})`;
            }
        }, { once: true });
    });

    // 啟動自動點擊功能
    startButton.addEventListener('click', () => {
        if (!selectedElement) {
            alert('請先選擇一個元素來自動點擊！');
            return;
        }

        const intervalTime = parseInt(intervalInput.value, 10);

        if (isNaN(intervalTime) || intervalTime <= 0) {
            alert('請輸入有效的間隔時間！');
            return;
        }

        // 開始自動點擊
        interval = setInterval(() => {
            selectedElement.click();
            console.log(`自動點擊了元素: ${selectedElement.tagName} (ID: ${selectedElement.id || '無 ID'}, 類名: ${selectedElement.className || '無類名'})`);
        }, intervalTime);

        alert(`已啟動自動點擊！每 ${intervalTime} 毫秒點擊一次。`);
    });

    // 停止自動點擊功能
    function stopAutoClick() {
        clearInterval(interval);
        alert('自動點擊已停止。');
    }

    // 停止自動點擊的功能
    const stopButton = document.createElement('button');
    stopButton.textContent = '停止自動點擊';
    stopButton.style.marginTop = '10px';
    gui.appendChild(stopButton);

    stopButton.addEventListener('click', stopAutoClick);
})();