// ==UserScript==
// @name         通用音量增强器 - Universal Volume Booster
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在所有网站(包括YouTube和TikTok)上强制增强音量，支持Ctrl+Alt+↑/↓/W/S快捷键，最高可增强10倍
// @author       醉春风制作
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/537093/%E9%80%9A%E7%94%A8%E9%9F%B3%E9%87%8F%E5%A2%9E%E5%BC%BA%E5%99%A8%20-%20Universal%20Volume%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/537093/%E9%80%9A%E7%94%A8%E9%9F%B3%E9%87%8F%E5%A2%9E%E5%BC%BA%E5%99%A8%20-%20Universal%20Volume%20Booster.meta.js
// ==/UserScript==

/*
通用音量增强器 - Universal Volume Booster
版本: 1.5
作者: 醉春风制作

版权所有 (c) 2025 醉春风制作

保留所有权利。

本脚本为作者独立创作，未经作者明确授权，禁止任何形式的：
1. 复制、修改或二次开发本脚本
2. 重新发布、分发或出售本脚本
3. 移除或修改本脚本中的版权信息和作者信息

使用本脚本即表示您同意遵守上述条款。
*/

(function() {
    'use strict';
    
    // 保存用户设置的音量增强倍数
    let volumeMultiplier = GM_getValue('volumeMultiplier', 1.0);
    let isBoosterActive = GM_getValue('isBoosterActive', false);
    let isDragging = false;
    let controlsVisible = false;
    let hideTimeout;
    let lastKeyTime = 0; // 用于防止快捷键重复触发
    let mediaElements = []; // 跟踪页面中的所有媒体元素
    
    // 创建音量增强控制界面
    function createVolumeControls() {
        // 添加样式
        GM_addStyle(`
            #volume-booster-container {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 9999999;
                font-family: Arial, sans-serif;
                transition: opacity 0.3s ease;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                user-select: none;
                opacity: 0;
                pointer-events: none;
            }
            #volume-booster-container.visible {
                opacity: 1;
                pointer-events: auto;
            }
            #volume-booster-container.active {
                border: 2px solid #4CAF50;
            }
            #volume-booster-container.inactive {
                border: 2px solid #F44336;
            }
            #volume-slider-container {
                width: 200px;
                margin: 10px 0;
            }
            #volume-slider {
                width: 100%;
                height: 5px;
                -webkit-appearance: none;
                background: linear-gradient(to right, #4CAF50 0%, #4CAF50 ${(volumeMultiplier-1)*100/9}%, #ddd ${(volumeMultiplier-1)*100/9}%, #ddd 100%);
                outline: none;
                border-radius: 5px;
            }
            #volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            }
            #volume-slider::-moz-range-thumb {
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                border: none;
            }
            #volume-value {
                text-align: center;
                font-size: 14px;
                margin-top: 5px;
            }
            #volume-toggle {
                width: 100%;
                padding: 5px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 14px;
                margin-top: 5px;
            }
            #volume-toggle.inactive {
                background-color: #F44336;
            }
            .volume-booster-title {
                font-size: 14px;
                text-align: center;
                margin-bottom: 5px;
                font-weight: bold;
            }
            .volume-booster-shortcut {
                font-size: 12px;
                text-align: center;
                margin-top: 5px;
                color: #aaa;
            }
            #volume-status-indicator {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                font-size: 16px;
                z-index: 9999999;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                text-align: center;
            }
            #volume-status-indicator.visible {
                opacity: 1;
            }
        `);
        
        // 创建控制界面
        const container = document.createElement('div');
        container.id = 'volume-booster-container';
        container.className = isBoosterActive ? 'active' : 'inactive';
        
        container.innerHTML = `
            <div class="volume-booster-title">音量增强器 - 醉春风制作</div>
            <div id="volume-slider-container">
                <input type="range" id="volume-slider" min="1" max="10" step="0.1" value="${volumeMultiplier}">
                <div id="volume-value">增强倍数: ${volumeMultiplier.toFixed(1)}x</div>
            </div>
            <button id="volume-toggle" class="${isBoosterActive ? '' : 'inactive'}">${isBoosterActive ? '已启用' : '已禁用'}</button>
            <div class="volume-booster-shortcut">快捷键: Ctrl+Alt+↑/↓ Ctrl+Alt+W/S</div>
        `;
        
        document.body.appendChild(container);
        
        // 创建状态指示器
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'volume-status-indicator';
        document.body.appendChild(statusIndicator);
        
        // 添加事件监听
        const slider = document.getElementById('volume-slider');
        const toggle = document.getElementById('volume-toggle');
        
        slider.addEventListener('input', function() {
            volumeMultiplier = parseFloat(this.value);
            document.getElementById('volume-value').textContent = `增强倍数: ${volumeMultiplier.toFixed(1)}x`;
            this.style.background = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${(volumeMultiplier-1)*100/9}%, #ddd ${(volumeMultiplier-1)*100/9}%, #ddd 100%)`;
            
            // 保存设置
            GM_setValue('volumeMultiplier', volumeMultiplier);
            
            applyVolumeBoost();
        });
        
        toggle.addEventListener('click', function() {
            toggleBooster();
        });
        
        // 鼠标悬停显示控制界面
        container.addEventListener('mouseenter', function() {
            clearTimeout(hideTimeout);
        });
        
        container.addEventListener('mouseleave', function() {
            if (!isDragging) {
                hideTimeout = setTimeout(() => {
                    hideControls();
                }, 2000);
            }
        });
        
        return container;
    }
    
    // 显示状态消息
    function showStatusMessage(message) {
        const statusIndicator = document.getElementById('volume-status-indicator');
        if (!statusIndicator) return;
        
        statusIndicator.textContent = message;
        statusIndicator.classList.add('visible');
        
        setTimeout(() => {
            statusIndicator.classList.remove('visible');
        }, 1500);
    }
    
    // 显示控制界面
    function showControls() {
        clearTimeout(hideTimeout);
        if (!document.getElementById('volume-booster-container')) {
            createVolumeControls();
        }
        
        const container = document.getElementById('volume-booster-container');
        container.classList.add('visible');
        controlsVisible = true;
        
        hideTimeout = setTimeout(() => {
            hideControls();
        }, 3000);
    }
    
    // 隐藏控制界面
    function hideControls() {
        if (!isDragging) {
            const container = document.getElementById('volume-booster-container');
            if (container) {
                container.classList.remove('visible');
                controlsVisible = false;
            }
        }
    }
    
    // 应用音量增强
    function applyVolumeBoost() {
        // 获取所有媒体元素
        mediaElements = [...document.querySelectorAll('video, audio')];
        
        // 特殊处理YouTube和TikTok
        const isYouTube = window.location.hostname.includes('youtube.com');
        const isTikTok = window.location.hostname.includes('tiktok.com');
        
        mediaElements.forEach(media => {
            // 保存原始音量
            if (media.dataset.originalVolume === undefined) {
                media.dataset.originalVolume = media.volume;
            }
            
            // 应用或恢复音量
            if (isBoosterActive) {
                // 使用 AudioContext 增强音量
                setupAudioBooster(media, isYouTube, isTikTok);
            } else {
                // 恢复原始音量
                if (media.dataset.originalVolume !== undefined) {
                    media.volume = parseFloat(media.dataset.originalVolume);
                }
                
                // 断开音频处理节点
                if (media.boosterSource) {
                    try {
                        media.boosterSource.disconnect();
                        media.boosterGain.disconnect();
                        media.boosterSource = null;
                        media.boosterGain = null;
                        media.boosterContext = null;
                    } catch (e) {
                        console.log('断开音频节点失败:', e);
                    }
                }
            }
        });
    }
    
    // 使用 AudioContext 设置音量增强
    function setupAudioBooster(mediaElement, isYouTube, isTikTok) {
        if (!mediaElement.boosterContext) {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const context = new AudioContext();
                const source = context.createMediaElementSource(mediaElement);
                const gainNode = context.createGain();
                
                source.connect(gainNode);
                gainNode.connect(context.destination);
                
                mediaElement.boosterContext = context;
                mediaElement.boosterSource = source;
                mediaElement.boosterGain = gainNode;
            } catch (e) {
                console.log('创建音频处理节点失败:', e);
                // 备用方案：直接修改音量属性
                if (isYouTube || isTikTok) {
                    // 对于YouTube和TikTok，使用备用方案
                    try {
                        const originalVolume = parseFloat(mediaElement.dataset.originalVolume) || 0.5;
                        // 确保不超过1.0
                        mediaElement.volume = Math.min(1.0, originalVolume * volumeMultiplier);
                    } catch (err) {
                        console.log('备用音量调整失败:', err);
                    }
                }
                return;
            }
        }
        
        if (mediaElement.boosterGain) {
            mediaElement.boosterGain.gain.value = volumeMultiplier;
        }
    }
    
    // 增加音量
    function increaseVolume() {
        // 如果未启用，则启用
        if (!isBoosterActive) {
            enableBooster();
        }
        
        // 增加音量倍数
        volumeMultiplier = Math.min(10, volumeMultiplier + 0.1);
        GM_setValue('volumeMultiplier', volumeMultiplier);
        
        // 更新滑块
        if (document.getElementById('volume-slider')) {
            document.getElementById('volume-slider').value = volumeMultiplier;
            document.getElementById('volume-value').textContent = `增强倍数: ${volumeMultiplier.toFixed(1)}x`;
            document.getElementById('volume-slider').style.background = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${(volumeMultiplier-1)*100/9}%, #ddd ${(volumeMultiplier-1)*100/9}%, #ddd 100%)`;
        }
        
        applyVolumeBoost();
        showControls();
        
        // 显示状态提示
        showStatusMessage(`音量增强: ${volumeMultiplier.toFixed(1)}x`);
    }
    
    // 减少音量
    function decreaseVolume() {
        // 减少音量倍数
        volumeMultiplier = Math.max(1, volumeMultiplier - 0.1);
        GM_setValue('volumeMultiplier', volumeMultiplier);
        
        // 更新滑块
        if (document.getElementById('volume-slider')) {
            document.getElementById('volume-slider').value = volumeMultiplier;
            document.getElementById('volume-value').textContent = `增强倍数: ${volumeMultiplier.toFixed(1)}x`;
            document.getElementById('volume-slider').style.background = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${(volumeMultiplier-1)*100/9}%, #ddd ${(volumeMultiplier-1)*100/9}%, #ddd 100%)`;
        }
        
        applyVolumeBoost();
        showControls();
        
        // 显示状态提示
        showStatusMessage(`音量增强: ${volumeMultiplier.toFixed(1)}x`);
    }
    
    // 启用音量增强器
    function enableBooster() {
        isBoosterActive = true;
        GM_setValue('isBoosterActive', true);
        
        if (document.getElementById('volume-toggle')) {
            document.getElementById('volume-toggle').textContent = '已启用';
            document.getElementById('volume-toggle').className = '';
            document.getElementById('volume-booster-container').className = 'visible active';
        }
        
        applyVolumeBoost();
        showStatusMessage('音量增强已启用');
    }
    
    // 禁用音量增强器
    function disableBooster() {
        isBoosterActive = false;
        GM_setValue('isBoosterActive', false);
        
        if (document.getElementById('volume-toggle')) {
            document.getElementById('volume-toggle').textContent = '已禁用';
            document.getElementById('volume-toggle').className = 'inactive';
            document.getElementById('volume-booster-container').className = 'visible inactive';
        }
        
        applyVolumeBoost(); // 这会恢复原始音量
        showStatusMessage('音量增强已禁用');
    }
    
    // 切换音量增强器状态
    function toggleBooster() {
        if (isBoosterActive) {
            disableBooster();
        } else {
            enableBooster();
        }
    }
    
    // 切换控制面板显示状态
    function toggleControlPanel() {
        if (controlsVisible) {
            hideControls();
        } else {
            showControls();
        }
    }
    
    // 增强的快捷键检测函数
    function isUpArrowWithCtrlAlt(e) {
        // 多重检测方法确保兼容性
        return e.ctrlKey && e.altKey && (
            e.keyCode === 38 || 
            e.which === 38 || 
            e.code === 'ArrowUp' || 
            e.key === 'ArrowUp' || 
            e.key === 'Up' ||
            e.key === '↑'
        );
    }
    
    function isDownArrowWithCtrlAlt(e) {
        return e.ctrlKey && e.altKey && (
            e.keyCode === 40 || 
            e.which === 40 || 
            e.code === 'ArrowDown' || 
            e.key === 'ArrowDown' || 
            e.key === 'Down' ||
            e.key === '↓'
        );
    }
    
    function isWKeyWithCtrlAlt(e) {
        return e.ctrlKey && e.altKey && (
            e.keyCode === 87 ||
            e.which === 87 ||
            e.code === 'KeyW' ||
            e.key === 'w' ||
            e.key === 'W'
        );
    }
    
    function isSKeyWithCtrlAlt(e) {
        return e.ctrlKey && e.altKey && (
            e.keyCode === 83 ||
            e.which === 83 ||
            e.code === 'KeyS' ||
            e.key === 's' ||
            e.key === 'S'
        );
    }
    
    // 设置键盘监听
    function setupKeyboardListeners() {
        document.addEventListener('keydown', function(e) {
            const now = Date.now();
            if (now - lastKeyTime < 200) return;
            
            if (isUpArrowWithCtrlAlt(e)) {
                e.preventDefault();
                e.stopPropagation();
                lastKeyTime = now;
                increaseVolume();
                return false;
            }
            
            if (isDownArrowWithCtrlAlt(e)) {
                e.preventDefault();
                e.stopPropagation();
                lastKeyTime = now;
                decreaseVolume();
                return false;
            }
            
            if (isWKeyWithCtrlAlt(e)) {
                e.preventDefault();
                e.stopPropagation();
                lastKeyTime = now;
                enableBooster();
                return false;
            }
            
            if (isSKeyWithCtrlAlt(e)) {
                e.preventDefault();
                e.stopPropagation();
                lastKeyTime = now;
                disableBooster();
                return false;
            }
        }, true);
    }
    
    // 监听新添加的媒体元素
    function setupMediaObserver() {
        const observer = new MutationObserver(mutations => {
            let mediaAdded = false;
            
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO') {
                        mediaAdded = true;
                    } else if (node.nodeType === 1) {
                        const mediaElements = node.querySelectorAll('video, audio');
                        if (mediaElements.length > 0) {
                            mediaAdded = true;
                        }
                    }
                });
            });
            
            if (mediaAdded && isBoosterActive) {
                applyVolumeBoost();
            }
        });
        
        // 开始观察DOM变化
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        return observer;
    }
    
    // 初始化音量增强器
    function initializeVolumeBooster() {
        // 创建控制界面但不显示
        createVolumeControls();
        
        // 设置键盘监听
        setupKeyboardListeners();
        
        // 设置媒体观察器
        setupMediaObserver();
        
        // 应用音量增强
        if (isBoosterActive) {
            applyVolumeBoost();
        }
    }
    
    // 如果页面已经加载完成，立即初始化
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // 延迟一点以确保DOM已准备好
        setTimeout(function() {
            if (document.body) {
                initializeVolumeBooster();
            }
        }, 100);
    } else {
        // 否则等待DOMContentLoaded事件
        window.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                initializeVolumeBooster();
            }, 100);
        });
    }
    
    // 立即设置键盘监听，不等待页面加载
    setupKeyboardListeners();
})();
