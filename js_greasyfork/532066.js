// ==UserScript==
// @name         抖音沉浸模式
// @namespace    https://douyin.com/
// @version      1.2.5
// @description  抖音沉浸模式，提供全屏、清屏、最高清晰度等功能，提升观看体验。
// @author       Loki2077
// @match        *://www.douyin.com/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/Loki2077/tampermonkey
// @downloadURL https://update.greasyfork.org/scripts/532066/%E6%8A%96%E9%9F%B3%E6%B2%89%E6%B5%B8%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/532066/%E6%8A%96%E9%9F%B3%E6%B2%89%E6%B5%B8%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 定义沉浸模式的状态变量，false表示未开启，true表示开启
    let immersiveMode = false;
    // 定义一个变量来存储当前的清屏状态
    let clearScreen = false;
    // 需要隐藏的元素选择器
    const hideElements = [
        '.immersive-player-switch-on-hide-interaction-area',
        '.video-info-detail',
        '.KlXLcATm.isDark',
        '.ixmqWVyr',
        '.AXQAavwp',
        'WLUaedLn'
    ];


    /**
     * 持续运行的主函数
     * 1. 当按下j键时，切换沉浸模式
     * 2. 当按下 'w' 's' '方向上' '方向下' '跟轮上' '跟轮下'键 且 开启沉浸模式 时, 清屏
     */
    const main = () => {
        
        // 监听键盘按下事件
        document.addEventListener('keydown', (event) => {
            // 打印按下的键
            console.log('-----------:' + event.key);

            // 当按下p键时，切换沉浸模式（不区分大小写）
            if (event.key.toLowerCase() === 'p') {
                immersiveMode = !immersiveMode; // 切换沉浸模式状态
                clearScreen = !clearScreen; // 切换清屏状态
                switchImmersiveMode(immersiveMode); // 调用切换沉浸模式的函数
            }
            if (event.key.toLowerCase() === 'j') {
                clearScreen = !clearScreen; // 切换清屏状态
                if (clearScreen) {
                    // 清屏
                    toggleElementsVisibility(hideElements, 'none');
                }else{
                    // 显示元素
                    toggleElementsVisibility(hideElements, '');
                }
            }
            // 当按下 'w' 's' '方向上' '方向下' 键 且 开启沉浸模式 时, 清屏
            if (clearScreen && ['w', 's', 'W', 'S', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
                // 清屏
                toggleElementsVisibility(hideElements, 'none');
                // 设置清晰度
                switchMaxResolution();
            }
        });

        // 监听鼠标滚轮事件
        document.addEventListener('wheel', (event) => {
            // 判断是否开启清屏模式
            if (clearScreen) {
                // 判断滚轮方向
                if (event.deltaY < 0) {
                    // 滚轮向上
                    console.log('Mouse wheel up');
                    toggleElementsVisibility(hideElements, 'none');
                    // 设置清晰度
                    switchMaxResolution();
                } else if (event.deltaY > 0) {
                    // 滚轮向下
                    console.log('Mouse wheel down');
                    toggleElementsVisibility(hideElements, 'none');
                    // 设置清晰度
                    switchMaxResolution();
                }
            }
        });
        // 跳过直播 


    }
    /**
     * 跳过直播 
     */
    const skipLive = () => {
        // 待实现....
    }
    

    /**
     * 切换最高清晰度
     */
    const switchMaxResolution = () => {
        // 获取所有分辨率选项元素（不区分大小写）
        const resolutionOptions = Array.from(document.querySelectorAll('div.virtual > div.item'))
            .filter(el => el.textContent && /[4K|2K|1080P|720P|540P|智能]/i.test(el.textContent.trim()));

        if (resolutionOptions.length > 0) {
            // 按照优先级排序，选择最高分辨率（假设顺序为：4k > 2k > 1080P > 720P > 540P > 智能），不区分大小写
            const priorityOrder = ['4K', '2K', '1080P', '720P', '540P', '智能'];
            resolutionOptions.sort((a, b) => {
                const aPriority = priorityOrder.indexOf(a.textContent.trim().toLowerCase());
                const bPriority = priorityOrder.indexOf(b.textContent.trim().toLowerCase());
                return aPriority - bPriority;
            });

            // 获取优先级最高的选项
            const highestResolutionOption = resolutionOptions[0];

            // 如果该选项未被选中，则点击它
            if (!highestResolutionOption.classList.contains('selected')) {
                highestResolutionOption.click();
            } else {
                console.log('当前已是最高清晰度');
            }
        } else {
            console.error('未找到任何分辨率选项');
        }
    }

    /**
     * 模拟按下指定的键
     * @param {string} key - 要模拟按下的键
     */
    const simulateKeyPress = (key) => {
        const keyCode = key.toUpperCase().charCodeAt(0);
        const event = new KeyboardEvent('keydown', { 
            key: key, 
            code: `Key${key.toUpperCase()}`, 
            keyCode: keyCode, 
            charCode: keyCode, 
            bubbles: true, 
            cancelable: true 
        });
        document.dispatchEvent(event);
    };

    /**
     * 切换指定元素的显示状态
     * @param {string[]} selectors - 元素选择器数组
     * @param {string} displayState - 目标显示状态 ('none' 或 '')
     */
    const toggleElementsVisibility = (selectors, displayState) => {
        const elements = document.querySelectorAll(selectors.join(', '));
        elements.forEach(el => {
            el.style.display = displayState;
        });
    };

    /**
     * 切换沉浸模式
     * @param {*} immersiveMode 
     */
    const switchImmersiveMode = (immersiveMode) => {
        if (immersiveMode) {
            // 模拟按下键盘 'Y' 和 'j'
            simulateKeyPress('Y');

            // 使用全屏API进入全屏模式
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
                document.documentElement.msRequestFullscreen();
            }
            // 切换最高清晰度
            switchMaxResolution();

            // 调用新方法隐藏指定元素
            toggleElementsVisibility(hideElements, 'none');
            
            // createToast('已进入沉浸模式');
        } else {
            // 模拟按下键盘 'Y' 和 'j'
            simulateKeyPress('Y');

            // 退出全屏模式
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
            // 切换最高清晰度
            switchMaxResolution();

            // 调用新方法恢复显示指定元素
            toggleElementsVisibility(hideElements, 'none');
            
            // createToast('已退出沉浸模式');
        }
    }

    /**
     * 创建一个提示框显示消息
     * @param {string} message - 要显示的提示信息
     */
    const createToast = (message) => {
        const toasts = document.querySelectorAll('div[style*="position: fixed; top"]');
        const verticalOffset = 20 + toasts.length * 50; // 每个弹窗间隔50px

        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: ${verticalOffset}px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            z-index: 999999;
            font-size: 14px;
            transition: all 0.3s ease;
        `;
        // 设置提示框文本内容
        toast.textContent = message;
        
        // 将提示框添加到页面中
        document.body.appendChild(toast);
        
        // 设置1秒后自动移除提示框
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 1000);
    };

    
    // 执行主函数，开始监听键盘事件
    main();
})();
