// ==UserScript==
// @name         Bilibili直播声音模式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  仅播放B站直播声音，隐藏视频画面为黑屏显示"SOUND ONLY"
// @author       Claude
// @match        https://live.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529361/Bilibili%E7%9B%B4%E6%92%AD%E5%A3%B0%E9%9F%B3%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/529361/Bilibili%E7%9B%B4%E6%92%AD%E5%A3%B0%E9%9F%B3%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 检查当前是否在直播页面
    if (!window.location.href.match(/live\.bilibili\.com\/\d+/)) {
        return; // 如果不是直播间页面，不执行脚本
    }
    
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .sound-only-mode {
            position: relative;
        }
        
        .sound-only-mode .live-player-mounter {
            position: relative;
        }
        
        .sound-only-mode .live-player-mounter::after {
            content: "SOUND ONLY";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #000;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            font-weight: bold;
            z-index: 9999;
        }
        
        #sound-only-toggle {
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            background-color: #fb7299;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            cursor: pointer;
            font-weight: bold;
        }
        
        #sound-only-toggle:hover {
            background-color: #fc8bab;
        }
    `;
    document.head.appendChild(style);
    
    // 创建开关按钮
    const toggleButton = document.createElement('button');
    toggleButton.id = 'sound-only-toggle';
    toggleButton.textContent = '声音模式: 关闭 🔊';
    document.body.appendChild(toggleButton);
    
    // 从localStorage获取状态
    let soundOnlyEnabled = localStorage.getItem('bilibili-sound-only') === 'true';
    
    // 初始状态设置
    updateUI();
    
    // 按钮点击事件
    toggleButton.addEventListener('click', function() {
        soundOnlyEnabled = !soundOnlyEnabled;
        localStorage.setItem('bilibili-sound-only', soundOnlyEnabled);
        
        // 刷新页面
        window.location.reload();
    });
    
    // 更新UI状态
    function updateUI() {
        toggleButton.textContent = soundOnlyEnabled ? '声音模式: 开启 🔇' : '声音模式: 关闭 🔊';
        
        if (soundOnlyEnabled) {
            document.body.classList.add('sound-only-mode');
        } else {
            document.body.classList.remove('sound-only-mode');
        }
    }
    
    // 等待播放器加载
    function waitForPlayer() {
        const checkInterval = setInterval(() => {
            const playerContainer = document.querySelector('.live-player-mounter');
            if (playerContainer) {
                clearInterval(checkInterval);
                updateUI();
            }
        }, 500);
        
        // 60秒后停止检查，避免无限循环
        setTimeout(() => {
            clearInterval(checkInterval);
        }, 60000);
    }
    
    // 等待播放器加载
    waitForPlayer();
})();
