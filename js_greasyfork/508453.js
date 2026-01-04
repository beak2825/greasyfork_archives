// ==UserScript==
// @name         OP.GG Auto Recorder
// @name:zh-TW   OP.GG 自動點擊錄製
// @name:zh-CN   OP.GG 自动点击录制
// @namespace    https://www.youtube.com/c/ScottDoha
// @version      1.6
// @description  Automatically clicks "Record" buttons on OP.GG website
// @description:zh-TW 自動點擊 OP.GG 網站上的「錄製」按鈕
// @description:zh-CN 自动点击 OP.GG 网站上的「录制」按钮
// @author       Scott
// @match        *://*.op.gg/summoners/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508453/OPGG%20Auto%20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/508453/OPGG%20Auto%20Recorder.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 獲取腳本啟用狀態，默認為啟用狀態
    const isEnabled = JSON.parse(localStorage.getItem('autoRecorderEnabled') || 'true');

    // 頁面加載完成後插入開關按鈕
    window.addEventListener('load', function() {
        const serviceMenu = document.querySelector('.ServiceMenu-module_service-menu__cUv5k');
        if (serviceMenu) {
            const toggleButton = document.createElement('a');
            toggleButton.textContent = isEnabled ? 'Disable Auto Recorder' : 'Enable Auto Recorder';
            toggleButton.style.cursor = 'pointer';
            toggleButton.style.marginLeft = '10px';
            toggleButton.style.color = '#fff';
            toggleButton.style.backgroundColor = '#007bff';
            toggleButton.style.padding = '5px 10px';
            toggleButton.style.borderRadius = '5px';
            serviceMenu.appendChild(toggleButton);

            // 點擊開關按鈕時切換狀態
            toggleButton.addEventListener('click', function() {
                const currentState = JSON.parse(localStorage.getItem('autoRecorderEnabled') || 'true');
                const newState = !currentState;
                localStorage.setItem('autoRecorderEnabled', JSON.stringify(newState));
                toggleButton.textContent = newState ? 'Disable Auto Recorder' : 'Enable Auto Recorder';
                location.reload(); // 切換後刷新頁面
            });
        }

        // 如果腳本啟用，開始執行錄制按鈕檢測
        if (isEnabled) {
            startAutoRecorder();
        }
    });

    // 自動錄制功能
    function startAutoRecorder() {
        // 每60秒刷新頁面
        setInterval(function() {
            location.reload();
        }, 60000); // 60000ms = 60s

        // 頁面加載完成後檢查按鈕
        window.addEventListener('load', function() {
            clickRecordButton(); // 頁面加載時檢查按鈕
        });

        // 定期檢查錄制按鈕
        setInterval(clickRecordButton, 2000); // 每2秒檢查一次

        // 檢查是否存在錄制按鈕，並點擊
        function clickRecordButton() {
            // 查找具有 "錄製" 文本的按鈕
            const buttons = document.querySelectorAll('button span');
            buttons.forEach(button => {
                if (button.textContent.trim() === '錄製') {
                    console.log("點擊錄製按鈕");
                    button.closest('button').click();
                }
            });
        }
    }
})();