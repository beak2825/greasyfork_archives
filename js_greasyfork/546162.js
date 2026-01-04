// ==UserScript==
// @name         ChatGPT朗读速度控制器
// @description  通过油猴菜单控制ChatGPT朗读速度，支持0.01-100x速度调节
// @author       schweigen
// @version      1.0
// @namespace    ChatGPT.SpeedController.Simple
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @match        https://chatgpt.com
// @match        https://chatgpt.com/?model=*
// @match        https://chatgpt.com/?temporary-chat=*
// @match        https://chatgpt.com/c/*
// @match        https://chatgpt.com/g/*
// @match        https://chatgpt.com/share/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.registerMenuCommand
// @grant        GM.unregisterMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546162/ChatGPT%E6%9C%97%E8%AF%BB%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/546162/ChatGPT%E6%9C%97%E8%AF%BB%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 配置常量
    const MIN_SPEED = 0.01;
    const MAX_SPEED = 100;
    
    // 全局变量
    let currentSpeed = 1;
    let playingAudio = new Set();
    let menuCommands = [];
    
    // 加载保存的速度设置
    async function loadSettings() {
        const saved = await GM.getValue('playbackSpeed', 1);
        currentSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, saved));
        console.log(`ChatGPT速度控制器：当前速度 ${currentSpeed}x`);
    }
    
    // 保存速度设置
    async function saveSettings() {
        await GM.setValue('playbackSpeed', currentSpeed);
        console.log(`ChatGPT速度控制器：速度已保存为 ${currentSpeed}x`);
    }
    
    // 设置音频播放速度
    function setAudioSpeed(speed) {
        // 设置所有当前播放的音频速度
        playingAudio.forEach(audio => {
            if (audio && !audio.paused) {
                audio.playbackRate = speed;
                audio.preservesPitch = true;
                audio.mozPreservesPitch = true;
                audio.webkitPreservesPitch = true;
            }
        });
    }
    
    // 监听新的音频元素
    function setupAudioListener() {
        // 监听播放事件
        document.addEventListener('play', (e) => {
            const audio = e.target;
            if (audio instanceof HTMLAudioElement) {
                audio.playbackRate = currentSpeed;
                audio.preservesPitch = true;
                audio.mozPreservesPitch = true;
                audio.webkitPreservesPitch = true;
                playingAudio.add(audio);
                
                // 音频结束时从集合中移除
                const cleanup = () => playingAudio.delete(audio);
                audio.addEventListener('pause', cleanup, {once: true});
                audio.addEventListener('ended', cleanup, {once: true});
            }
        }, true);
        
        // 监听速度变化事件，防止被重置
        document.addEventListener('ratechange', (e) => {
            const audio = e.target;
            if (audio instanceof HTMLAudioElement && Math.abs(audio.playbackRate - currentSpeed) > 0.01) {
                audio.playbackRate = currentSpeed;
            }
        }, true);
    }
    
    // 更改速度
    async function changeSpeed(newSpeed) {
        currentSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, newSpeed));
        setAudioSpeed(currentSpeed);
        await saveSettings();
        updateMenus();
        
        // 显示通知
        showNotification(`朗读速度已设置为 ${currentSpeed}x`);
    }
    
    // 显示通知 (移除旧的通知函数，只在changeSpeed中使用右上角显示)
    function showNotification(message) {
        // 创建右上角通知
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 18px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2px solid #45a049;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 3秒后自动消失
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    // 注册菜单命令
    function registerMenus() {
        // 清除旧菜单
        menuCommands.forEach(id => GM.unregisterMenuCommand(id));
        menuCommands = [];
        
        // 设置面板
        menuCommands.push(GM.registerMenuCommand('⚙️ 打开速度设置', () => {
            showSettingsPanel();
        }));
        
        // 查看当前速度
        menuCommands.push(GM.registerMenuCommand('🎵 查看当前速度', () => {
            showSpeedDisplay();
        }));
    }
    
    // 显示右上角速度提示框
    function showSpeedDisplay() {
        const speedBox = document.createElement('div');
        speedBox.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 12px 18px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2px solid #666;
        `;
        speedBox.textContent = `当前速度: ${currentSpeed}x`;
        
        document.body.appendChild(speedBox);
        
        // 3秒后自动消失
        setTimeout(() => {
            if (speedBox.parentNode) {
                speedBox.parentNode.removeChild(speedBox);
            }
        }, 3000);
    }
    
    // 显示设置面板
    function showSettingsPanel() {
        // 如果已经存在设置面板，先移除
        const existingPanel = document.getElementById('speed-settings-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // 创建背景遮罩
        const overlay = document.createElement('div');
        overlay.id = 'speed-settings-panel';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.2s ease-out;
        `;
        
        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: scale(0.9) translateY(-20px); opacity: 0; }
                to { transform: scale(1) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // 创建设置面板
        const panel = document.createElement('div');
        panel.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
            max-width: 320px;
            width: 90%;
            animation: slideIn 0.3s ease-out;
            position: relative;
            overflow: hidden;
        `;
        
        // 添加装饰性背景
        const bgDecor = document.createElement('div');
        bgDecor.style.cssText = `
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            pointer-events: none;
        `;
        panel.appendChild(bgDecor);
        
        const content = document.createElement('div');
        content.style.cssText = `
            position: relative;
            z-index: 1;
        `;
        
        content.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="
                    display: inline-block;
                    width: 48px;
                    height: 48px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 8px;
                    backdrop-filter: blur(10px);
                ">
                    <span style="font-size: 24px;">🎵</span>
                </div>
                <h3 style="margin: 0; color: white; font-size: 18px; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">朗读速度设置</h3>
            </div>
            
            <div style="margin-bottom: 18px;">
                <label style="display: block; margin-bottom: 8px; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500;">
                    当前速度: <span style="color: #fff; font-weight: 600;">${currentSpeed}x</span>
                </label>
                <div style="position: relative;">
                    <input type="range" id="speedSlider" min="0.25" max="5" step="0.25" value="${Math.min(currentSpeed, 5)}" 
                           style="
                               width: 100%;
                               margin: 8px 0;
                               -webkit-appearance: none;
                               appearance: none;
                               height: 6px;
                               background: rgba(255,255,255,0.3);
                               border-radius: 3px;
                               outline: none;
                           ">
                    <style>
                        #speedSlider::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            width: 18px;
                            height: 18px;
                            background: white;
                            border-radius: 50%;
                            cursor: pointer;
                            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                        }
                        #speedSlider::-moz-range-thumb {
                            width: 18px;
                            height: 18px;
                            background: white;
                            border-radius: 50%;
                            cursor: pointer;
                            border: none;
                            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                        }
                    </style>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,0.7); margin-top: 4px;">
                    <span>0.25x</span>
                    <span>5x</span>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500;">
                    精确值 (${MIN_SPEED} - ${MAX_SPEED})
                </label>
                <input type="number" id="speedInput" min="${MIN_SPEED}" max="${MAX_SPEED}" step="0.01" value="${currentSpeed}"
                       style="
                           width: 100%;
                           padding: 10px 12px;
                           border: none;
                           border-radius: 8px;
                           font-size: 14px;
                           background: rgba(255,255,255,0.95);
                           color: #333;
                           backdrop-filter: blur(10px);
                           box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
                           transition: all 0.2s ease;
                       "
                       onfocus="this.style.background='rgba(255,255,255,1)'; this.style.transform='translateY(-1px)'"
                       onblur="this.style.background='rgba(255,255,255,0.95)'; this.style.transform='translateY(0)'">
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button id="applyBtn" style="
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    color: white;
                    cursor: pointer;
                    flex: 1;
                    font-size: 14px;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
                    transition: all 0.2s ease;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                "
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(79, 172, 254, 0.5)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(79, 172, 254, 0.4)'"
                >✓ 应用</button>
                <button id="cancelBtn" style="
                    padding: 12px 20px;
                    border: 1px solid rgba(255,255,255,0.3);
                    border-radius: 8px;
                    background: rgba(255,255,255,0.1);
                    color: white;
                    cursor: pointer;
                    flex: 1;
                    font-size: 14px;
                    font-weight: 500;
                    backdrop-filter: blur(10px);
                    transition: all 0.2s ease;
                "
                onmouseover="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='translateY(-1px)'"
                onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='translateY(0)'"
                >✕ 取消</button>
            </div>
        `;
        
        panel.appendChild(content);
        
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        
        // 获取元素
        const speedSlider = panel.querySelector('#speedSlider');
        const speedInput = panel.querySelector('#speedInput');
        const applyBtn = panel.querySelector('#applyBtn');
        const cancelBtn = panel.querySelector('#cancelBtn');
        
        // 滑块和输入框同步
        speedSlider.addEventListener('input', () => {
            speedInput.value = speedSlider.value;
        });
        
        speedInput.addEventListener('input', () => {
            const value = parseFloat(speedInput.value);
            if (value >= 0.25 && value <= 5) {
                speedSlider.value = value;
            }
        });
        
        // 应用按钮
        applyBtn.addEventListener('click', () => {
            const newSpeed = parseFloat(speedInput.value);
            if (newSpeed >= MIN_SPEED && newSpeed <= MAX_SPEED) {
                changeSpeed(newSpeed);
                overlay.remove();
            } else {
                alert(`请输入有效的速度值 (${MIN_SPEED}-${MAX_SPEED})`);
            }
        });
        
        // 取消按钮和背景点击
        cancelBtn.addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
        
        // ESC键关闭
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }
    
    // 更新菜单显示 (简化版不需要动态更新)
    function updateMenus() {
        // 菜单项是静态的，不需要更新
    }
    
    // 初始化
    async function init() {
        await loadSettings();
        setupAudioListener();
        registerMenus();
        
        // 监听页面变化，确保音频监听器始终有效
        const observer = new MutationObserver((mutations) => {
            const hasAudio = mutations.some(mutation => 
                Array.from(mutation.addedNodes).some(node => 
                    node.nodeName === 'AUDIO' || 
                    (node.querySelector && node.querySelector('audio'))
                )
            );
            
            if (hasAudio) {
                setAudioSpeed(currentSpeed);
            }
        });
        
        if (document.body) {
            observer.observe(document.body, {childList: true, subtree: true});
        }
        
        console.log('ChatGPT朗读速度控制器已启动');
    }
    
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, {once: true});
    } else {
        init();
    }
})();
