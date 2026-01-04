// ==UserScript==
// @name         手动控制课程播放脚本
// @namespace    https://greasyfork.org/zh-CN/users/1063320-%E7%AC%94%E7%A0%9A
// @version      2.1
// @description  添加便捷按钮，一键播放视频并快速完成课程，支持视频加载检测、异常处理和状态提示（修复URL匹配问题）
// @author       笔墨纸砚
// @match        *://www.sxjkaqjypx.com:88/*
// @include      *://www.sxjkaqjypx.com:88/#/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480869/%E6%89%8B%E5%8A%A8%E6%8E%A7%E5%88%B6%E8%AF%BE%E7%A8%8B%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/480869/%E6%89%8B%E5%8A%A8%E6%8E%A7%E5%88%B6%E8%AF%BE%E7%A8%8B%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置参数
    const CONFIG = {
        BUTTON_STYLE: {
            position: 'fixed',
            top: '50%',
            right: '20px',
            transform: 'translateY(-50%)',
            zIndex: '9999',
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
            outline: 'none'
        },
        LOADING_STYLE: {
            backgroundColor: '#FF9800',
            cursor: 'wait'
        },
        SUCCESS_STYLE: {
            backgroundColor: '#4CAF50'
        },
        ERROR_STYLE: {
            backgroundColor: '#F44336'
        },
        DELAY_BEFORE_COMPLETE: 1500, // 播放后延迟多久完成课程（毫秒）
        MAX_WAIT_VIDEO_LOAD: 8000,    // 最大等待视频加载时间（毫秒）
        CHECK_INTERVAL: 300           // 检测视频元素的间隔（毫秒）
    };

    // 日志打印函数（带时间戳）
    function log(message) {
        const time = new Date().toLocaleTimeString();
        console.log(`[手动控制脚本 ${time}] ${message}`);
    }

    // 显示页面提示
    function showNotification(message, type = 'info') {
        // 移除已存在的提示
        const oldNotify = document.querySelector('.script-notification');
        if (oldNotify) oldNotify.remove();

        const notify = document.createElement('div');
        notify.className = 'script-notification';
        notify.textContent = message;
        
        // 样式
        Object.assign(notify.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            borderRadius: '4px',
            color: '#fff',
            zIndex: '9999',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            opacity: '0',
            pointerEvents: 'none'
        });

        // 类型样式
        switch (type) {
            case 'success':
                notify.style.backgroundColor = '#4CAF50';
                break;
            case 'error':
                notify.style.backgroundColor = '#F44336';
                break;
            case 'warning':
                notify.style.backgroundColor = '#FF9800';
                break;
            default:
                notify.style.backgroundColor = '#2196F3';
        }

        document.body.appendChild(notify);
        
        // 显示动画
        setTimeout(() => {
            notify.style.opacity = '1';
        }, 10);
        
        // 3秒后隐藏
        setTimeout(() => {
            notify.style.opacity = '0';
            setTimeout(() => {
                notify.remove();
            }, 300);
        }, 3000);
    }

    // 模拟点击事件（增强版）
    function simulateClick(element) {
        if (!element || !element.dispatchEvent) return false;
        
        try {
            // 先尝试触发点击事件
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0
            });
            
            // 触发原生点击
            const result = element.dispatchEvent(clickEvent);
            
            // 如果是按钮，同时尝试调用click方法（兼容部分特殊元素）
            if (typeof element.click === 'function') {
                element.click();
            }
            
            log(`成功模拟点击元素: ${element.className || element.tagName}`);
            return result;
        } catch (error) {
            log(`模拟点击失败: ${error.message}`);
            return false;
        }
    }

    // 等待元素加载
    function waitForElement(selector, timeout = CONFIG.MAX_WAIT_VIDEO_LOAD) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            // 立即检查一次
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            
            // 定时检查
            const interval = setInterval(() => {
                const currentTime = Date.now();
                const element = document.querySelector(selector);
                
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else if (currentTime - startTime >= timeout) {
                    clearInterval(interval);
                    reject(new Error(`超时未找到元素: ${selector}`));
                }
            }, CONFIG.CHECK_INTERVAL);
        });
    }

    // 播放视频（增强版）
    async function playVideo() {
        try {
            log('开始尝试播放视频...');
            showNotification('正在准备播放视频...', 'info');
            
            // 等待视频元素加载
            const video = await waitForElement('video.video-react-video');
            log('找到视频元素');
            
            // 处理视频播放
            video.muted = true; // 强制静音
            video.volume = 0;   // 双重保险
            
            // 尝试播放
            if (video.paused) {
                try {
                    // 现代浏览器播放API
                    await video.play();
                    log('视频通过API播放成功');
                    showNotification('视频播放成功', 'success');
                    return true;
                } catch (error) {
                    log(`API播放失败，尝试点击播放按钮: ${error.message}`);
                    
                    // 尝试点击大播放按钮
                    const bigPlayBtn = document.querySelector('.video-react-big-play-button');
                    if (bigPlayBtn) {
                        simulateClick(bigPlayBtn);
                        // 等待播放状态改变
                        await new Promise(resolve => setTimeout(resolve, 500));
                        if (!video.paused) {
                            log('通过大播放按钮播放成功');
                            showNotification('视频播放成功', 'success');
                            return true;
                        }
                    }
                    
                    // 尝试点击控制栏播放按钮
                    const controlPlayBtn = document.querySelector('.video-react-play-control');
                    if (controlPlayBtn) {
                        simulateClick(controlPlayBtn);
                        await new Promise(resolve => setTimeout(resolve, 500));
                        if (!video.paused) {
                            log('通过控制栏播放按钮播放成功');
                            showNotification('视频播放成功', 'success');
                            return true;
                        }
                    }
                    
                    throw new Error('所有播放方式都失败');
                }
            } else {
                log('视频已在播放中');
                showNotification('视频已在播放', 'info');
                return true;
            }
        } catch (error) {
            log(`播放视频失败: ${error.message}`);
            showNotification(`播放失败: ${error.message}`, 'error');
            return false;
        }
    }

    // 完成课程（增强版）
    async function completeCourse() {
        try {
            log('开始尝试完成课程...');
            showNotification('正在快速完成课程...', 'warning');
            
            // 等待视频元素加载
            const video = await waitForElement('video.video-react-video');
            
            // 验证视频时长
            if (isNaN(video.duration) || !isFinite(video.duration)) {
                throw new Error('视频时长无效');
            }
            
            // 跳到视频末尾（留一点缓冲，避免某些平台检测）
            const endTime = Math.max(1, video.duration - 1); // 保留最后1秒
            video.currentTime = endTime;
            log(`已跳转到视频末尾: ${endTime.toFixed(2)}秒`);
            
            // 触发进度更新事件（关键）
            const progressEvents = ['timeupdate', 'progress', 'seeking', 'seeked'];
            progressEvents.forEach(eventName => {
                video.dispatchEvent(new Event(eventName));
            });
            
            // 延迟后触发结束事件
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // 触发视频结束事件
            video.dispatchEvent(new Event('ended'));
            log('已触发视频结束事件');
            
            // 额外保险：触发进度条点击（模拟用户观看完成）
            const progressBar = document.querySelector('.video-react-progress-holder');
            if (progressBar) {
                simulateClick(progressBar);
            }
            
            log('课程完成操作已执行');
            showNotification('课程完成！', 'success');
            return true;
        } catch (error) {
            log(`完成课程失败: ${error.message}`);
            showNotification(`完成失败: ${error.message}`, 'error');
            return false;
        }
    }

    // 更新按钮状态
    function updateButtonState(button, state = 'default') {
        switch (state) {
            case 'loading':
                button.textContent = '处理中...';
                Object.assign(button.style, CONFIG.LOADING_STYLE);
                button.disabled = true;
                break;
            case 'success':
                button.textContent = '已完成';
                Object.assign(button.style, CONFIG.SUCCESS_STYLE);
                button.disabled = true;
                // 3秒后恢复默认状态
                setTimeout(() => {
                    resetButton(button);
                }, 3000);
                break;
            case 'error':
                button.textContent = '操作失败';
                Object.assign(button.style, CONFIG.ERROR_STYLE);
                button.disabled = false;
                break;
            default:
                resetButton(button);
        }
    }

    // 重置按钮状态
    function resetButton(button) {
        button.textContent = '播放并完成课程';
        Object.assign(button.style, CONFIG.BUTTON_STYLE);
        button.disabled = false;
    }

    // 创建控制按钮（增强版）
    function createControlButton() {
        // 避免重复创建
        if (document.querySelector('.course-control-button')) {
            log('控制按钮已存在，无需重复创建');
            return;
        }

        const button = document.createElement('button');
        button.className = 'course-control-button';
        button.textContent = '播放并完成课程';
        
        // 应用样式
        Object.assign(button.style, CONFIG.BUTTON_STYLE);
        
        // 按钮hover效果
        button.addEventListener('mouseover', () => {
            if (!button.disabled) {
                button.style.transform = 'translateY(-50%) scale(1.05)';
                button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
            }
        });
        
        button.addEventListener('mouseout', () => {
            if (!button.disabled) {
                button.style.transform = 'translateY(-50%) scale(1)';
                button.style.boxShadow = CONFIG.BUTTON_STYLE.boxShadow;
            }
        });
        
        // 点击事件
        button.addEventListener('click', async () => {
            log('用户点击了控制按钮');
            updateButtonState(button, 'loading');
            
            try {
                // 第一步：播放视频
                const playSuccess = await playVideo();
                if (!playSuccess) {
                    updateButtonState(button, 'error');
                    return;
                }
                
                // 第二步：延迟后完成课程（确保视频播放状态被记录）
                await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_BEFORE_COMPLETE));
                const completeSuccess = await completeCourse();
                
                if (completeSuccess) {
                    updateButtonState(button, 'success');
                } else {
                    updateButtonState(button, 'error');
                }
            } catch (error) {
                log(`按钮点击处理异常: ${error.message}`);
                showNotification(`操作异常: ${error.message}`, 'error');
                updateButtonState(button, 'error');
            }
        });

        document.body.appendChild(button);
        log('控制按钮已创建并添加到页面');
        showNotification('脚本已就绪，点击按钮完成课程', 'info');
    }

    // 页面加载完成后初始化（兼容动态加载页面和哈希路由）
    function initScript() {
        log('页面开始加载，准备初始化脚本...');
        
        // 监听DOMContentLoaded（DOM加载完成）
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(createControlButton, 2000); // 延长延迟，确保路由和视频组件加载完成
            });
        } else {
            // 页面已加载完成，直接初始化
            setTimeout(createControlButton, 2000);
        }
        
        // 监听页面动态变化（兼容单页应用）
        const observer = new MutationObserver((mutations) => {
            const videoContainer = document.querySelector('.video-react-controls-enabled');
            const controlButton = document.querySelector('.course-control-button');
            
            // 如果检测到视频容器但没有按钮，创建按钮
            if (videoContainer && !controlButton) {
                log('检测到视频容器，创建控制按钮');
                createControlButton();
                observer.disconnect(); // 只创建一次
            }
        });
        
        // 观察body的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 监听哈希路由变化（关键修复：适配#/开头的路由）
        window.addEventListener('hashchange', () => {
            log(`路由变化: ${window.location.hash}`);
            // 只在课程详情页触发（匹配courseInfoDetail路由）
            if (window.location.hash.includes('courseInfoDetail')) {
                setTimeout(() => {
                    const videoContainer = document.querySelector('.video-react-controls-enabled');
                    const controlButton = document.querySelector('.course-control-button');
                    if (videoContainer && !controlButton) {
                        log('路由切换到课程页面，创建控制按钮');
                        createControlButton();
                    }
                }, 1500);
            }
        });
        
        // 超时自动断开观察
        setTimeout(() => {
            observer.disconnect();
        }, 15000);
    }

    // 启动脚本
    initScript();
})();