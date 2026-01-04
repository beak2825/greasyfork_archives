// ==UserScript==
// @name         哔哩哔哩原生播放速度菜单无极调节
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在B站原生播放速度菜单中添加无极调节滑块以及调节输入框
// @author       Marx Engels
// @license      GPL-3.0
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/bangumi/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533373/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8E%9F%E7%94%9F%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E8%8F%9C%E5%8D%95%E6%97%A0%E6%9E%81%E8%B0%83%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/533373/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8E%9F%E7%94%9F%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E8%8F%9C%E5%8D%95%E6%97%A0%E6%9E%81%E8%B0%83%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 监听DOM变化以捕获速度菜单的出现
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // 元素节点
                        // 检测播放速度菜单的出现
                        const speedMenu = document.querySelector('.bpx-player-ctrl-playbackrate-menu') || 
                                         document.querySelector('.bilibili-player-video-btn-speed-menu');
                        
                        if (speedMenu && !speedMenu.querySelector('#bilibili-custom-speed-slider')) {
                            // 菜单出现且尚未添加自定义控件
                            enhanceSpeedMenu(speedMenu);
                        }
                    }
                }
            }
        });
    });
    
    // 观察整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    function enhanceSpeedMenu(speedMenu) {
        // 获取视频元素
        const videoElement = document.querySelector('video');
        if (!videoElement) return;
        
        // 增加菜单宽度以适应同行显示
        speedMenu.style.width = 'auto';
        speedMenu.style.minWidth = '150px';
        
        // 创建滑块容器
        const sliderContainer = document.createElement('div');
        sliderContainer.id = 'bilibili-custom-speed-slider';
        sliderContainer.style.padding = '8px 10px';
        sliderContainer.style.borderTop = '1px solid rgba(255, 255, 255, 0.12)';
        
        // 创建水平布局的控制容器
        const controlContainer = document.createElement('div');
        controlContainer.style.display = 'flex';
        controlContainer.style.alignItems = 'center';
        controlContainer.style.justifyContent = 'space-between';
        controlContainer.style.marginBottom = '8px';
        
        // 创建"精确速度"标签
        const speedLabel = document.createElement('span');
        speedLabel.style.fontSize = '13px';
        speedLabel.style.color = '#fff';
        speedLabel.style.marginRight = '8px';
        speedLabel.textContent = '精确速度';
        
        // 创建输入框和倍率标记的容器
        const inputWrapper = document.createElement('div');
        inputWrapper.style.display = 'flex';
        inputWrapper.style.alignItems = 'center';
        
        // 创建输入框
        const speedInput = document.createElement('input');
        speedInput.type = 'number';
        speedInput.id = 'bilibili-speed-input';
        speedInput.min = '0.1';
        speedInput.max = '5';
        speedInput.step = '0.01';
        speedInput.value = videoElement.playbackRate.toFixed(2);
        speedInput.style.width = '50px';
        speedInput.style.backgroundColor = '#2b2b2b';
        speedInput.style.color = '#00A1D6';
        speedInput.style.border = '1px solid #3b3b3b';
        speedInput.style.borderRadius = '4px';
        speedInput.style.padding = '2px 4px';
        speedInput.style.fontSize = '13px';
        speedInput.style.textAlign = 'center';
        
        // 创建"x"标记
        const xMark = document.createElement('span');
        xMark.style.fontSize = '13px';
        xMark.style.color = '#fff';
        xMark.style.marginLeft = '2px';
        xMark.textContent = 'x';
        
        // 创建滑块
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0.1';
        slider.max = '5';
        slider.step = '0.01';
        slider.value = videoElement.playbackRate;
        slider.style.width = '100%';
        slider.style.margin = '5px 0';
        slider.style.accentColor = '#00A1D6'; // B站蓝色
        
        // 监听滑块变化
        slider.addEventListener('input', () => {
            const newSpeed = parseFloat(slider.value);
            videoElement.playbackRate = newSpeed;
            document.getElementById('bilibili-speed-input').value = newSpeed.toFixed(2);
            
            // 更新菜单中的选项显示状态
            updateSpeedMenuItemsState(speedMenu, newSpeed);
        });
        
        // 监听输入框变化
        speedInput.addEventListener('change', () => {
            let newSpeed = parseFloat(speedInput.value);
            
            // 限制输入范围
            if (newSpeed < 0.1) newSpeed = 0.1;
            if (newSpeed > 5) newSpeed = 5;
            
            // 更新输入框显示值（保持两位小数）
            speedInput.value = newSpeed.toFixed(2);
            
            // 更新视频播放速度
            videoElement.playbackRate = newSpeed;
            
            // 更新滑块值
            slider.value = newSpeed;
            
            // 更新菜单中的选项显示状态
            updateSpeedMenuItemsState(speedMenu, newSpeed);
        });
        
        // 输入框按回车键确认
        speedInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                speedInput.blur(); // 触发change事件
            }
        });
        
        // 组装输入控件
        inputWrapper.appendChild(speedInput);
        inputWrapper.appendChild(xMark);
        
        // 组装控制容器
        controlContainer.appendChild(speedLabel);
        controlContainer.appendChild(inputWrapper);
        
        // 组装UI
        sliderContainer.appendChild(controlContainer);
        sliderContainer.appendChild(slider);
        
        // 将自定义控件添加到菜单底部
        speedMenu.appendChild(sliderContainer);
        
        // 设置菜单初始状态
        updateSpeedMenuItemsState(speedMenu, videoElement.playbackRate);
        
        // 监听菜单中原有选项的点击
        const menuItems = speedMenu.querySelectorAll('li, .bpx-player-ctrl-playbackrate-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                // 使用延时以确保点击生效后再更新滑块和输入框
                setTimeout(() => {
                    slider.value = videoElement.playbackRate;
                    document.getElementById('bilibili-speed-input').value = videoElement.playbackRate.toFixed(2);
                }, 10);
            });
        });
    }
    
    // 更新菜单中的选项状态（高亮显示最接近的标准速度）
    function updateSpeedMenuItemsState(speedMenu, currentSpeed) {
        // 获取所有速度选项
        const allSpeedItems = speedMenu.querySelectorAll('li, .bpx-player-ctrl-playbackrate-menu-item');
        
        // 清除所有高亮
        allSpeedItems.forEach(item => {
            // 老版UI处理
            if (item.classList.contains('bilibili-player-active')) {
                item.classList.remove('bilibili-player-active');
            }
            
            // 新版UI处理
            if (item.classList.contains('bpx-state-active')) {
                item.classList.remove('bpx-state-active');
            }
            
            // 移除蓝色文字
            const text = item.querySelector('span');
            if (text) {
                text.style.color = '';
            }
        });
        
        // 精确匹配时才高亮对应选项
        allSpeedItems.forEach(item => {
            // 尝试从UI中提取速度值
            let itemSpeed = null;
            
            // 尝试从文本内容获取速度
            if (item.textContent) {
                const match = item.textContent.match(/(\d+\.?\d*)x/);
                if (match && match[1]) {
                    itemSpeed = parseFloat(match[1]);
                }
            }
            
            // 精确匹配时高亮
            if (itemSpeed !== null && Math.abs(itemSpeed - currentSpeed) < 0.001) {
                // 老版UI处理
                item.classList.add('bilibili-player-active');
                
                // 新版UI处理
                item.classList.add('bpx-state-active');
                
                // 设置蓝色文字
                const text = item.querySelector('span');
                if (text) {
                    text.style.color = '#00A1D6';
                }
            }
        });
    }
})();