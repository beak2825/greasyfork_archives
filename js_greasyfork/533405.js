// ==UserScript==
// @name         方草大侠学习平台视频监测器增强版
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  专门针对study.gdip.edu.cn的视频任务点自动切换脚本
// @author       You
// @license      MIT
// @match        https://study.gdip.edu.cn/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/533405/%E6%96%B9%E8%8D%89%E5%A4%A7%E4%BE%A0%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E8%A7%86%E9%A2%91%E7%9B%91%E6%B5%8B%E5%99%A8%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/533405/%E6%96%B9%E8%8D%89%E5%A4%A7%E4%BE%A0%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E8%A7%86%E9%A2%91%E7%9B%91%E6%B5%8B%E5%99%A8%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const config = {
        debug: true,
        checkInterval: 1000,
        statusCheckInterval: 500,
        disclaimerAccepted: false
    };
    
    function log(message, data = null) {
        if (config.debug) {
            if (data) {
                console.log(`[学习平台视频监测器] ${message}`, data);
            } else {
                console.log(`[学习平台视频监测器] ${message}`);
            }
        }
    }
    
    // 显示通知
    function showNotification(message, type = 'info') {
        const id = 'video-monitor-notification';
        let notification = document.getElementById(id);
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = id;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'error' ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)'};
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                z-index: 9999;
                font-family: Arial, sans-serif;
                font-size: 14px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            `;
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // 显示免责声明
    function showDisclaimer() {
        const disclaimerHtml = `
            <div id="video-monitor-disclaimer" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                max-width: 600px;
                font-family: Arial, sans-serif;
                line-height: 1.6;
            ">
                <h2 style="margin-top: 0; color: #333; text-align: center; font-size: 24px;">刷课脚本免责声明</h2>
                <p style="color: #666; text-align: right; font-size: 14px; margin: 5px 0;">最后更新：2025年4月20日</p>
                <div style="margin: 20px 0; color: #444;">
                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #2196F3; font-size: 18px;">脚本性质</h3>
                        <p>本工具为技术研究性质的开源项目，开发者不鼓励、不参与任何实际刷课行为。</p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #4CAF50; font-size: 18px;">用户承诺</h3>
                        <p>您必须确保使用行为符合以下要求：</p>
                        <ul style="list-style: none; padding-left: 20px;">
                            <li style="margin: 5px 0;">✅ 不违反目标平台《用户协议》（如慕课网、超星等）</li>
                            <li style="margin: 5px 0;">✅ 不违反所在学校/机构学术诚信规定</li>
                            <li style="margin: 5px 0;">✅ 不破坏目标平台服务器或窃取数据</li>
                        </ul>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #FF9800; font-size: 18px;">责任完全豁免</h3>
                        <p>开发者不承担因以下情况导致的任何后果：</p>
                        <ul style="list-style: none; padding-left: 20px;">
                            <li style="margin: 5px 0;">🔸 账号封禁、课程成绩失效等平台处罚</li>
                            <li style="margin: 5px 0;">🔸 设备损坏、数据泄露等间接损失</li>
                            <li style="margin: 5px 0;">🔸 用户因违规行为面临的行政或法律责任</li>
                        </ul>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #9C27B0; font-size: 18px;">知识产权声明</h3>
                        <p>脚本代码遵循MIT开源协议，但禁止用于：</p>
                        <ul style="list-style: none; padding-left: 20px;">
                            <li style="margin: 5px 0;">❌ 商业售卖（如淘宝/闲鱼等平台倒卖）</li>
                            <li style="margin: 5px 0;">❌ 制作衍生作弊工具</li>
                        </ul>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #F44336; font-size: 18px;">终止条款</h3>
                        <p>如您所在国家/地区判定本脚本违法，请立即删除脚本文件。继续使用视为您自愿承担全部风险。</p>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 25px;">
                    <button id="accept-disclaimer" style="
                        background: #4CAF50;
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 6px;
                        cursor: pointer;
                        margin-right: 15px;
                        font-size: 16px;
                        transition: background 0.3s;
                    ">同意并继续</button>
                    <button id="reject-disclaimer" style="
                        background: #f44336;
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                        transition: background 0.3s;
                    ">不同意</button>
                </div>
            </div>
            <div id="video-monitor-disclaimer-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                z-index: 9999;
            "></div>
        `;

        // 插入免责声明到页面
        const container = document.createElement('div');
        container.innerHTML = disclaimerHtml;
        document.body.appendChild(container);

        // 绑定按钮事件
        document.getElementById('accept-disclaimer').addEventListener('click', () => {
            config.disclaimerAccepted = true;
            localStorage.setItem('video-monitor-disclaimer-accepted', 'true');
            container.remove();
            initialize();
            showNotification('视频监测器已启动');
        });

        document.getElementById('reject-disclaimer').addEventListener('click', () => {
            container.remove();
            showNotification('您已拒绝使用视频监测器', 'error');
        });
    }

    // 查找所有任务点状态元素
    function getAllTaskStatusElements() {
        // 使用精确的选择器匹配状态元素
        const elements = document.querySelectorAll('span.chapter-status');
        log(`找到 ${elements.length} 个任务状态元素`);
        return Array.from(elements);
    }

    // 获取任务点状态
    function getTaskStatus(element) {
        if (!element) return null;
        const text = element.textContent.trim();
        log(`任务状态文本: ${text}`, element);
        return text;
    }

    // 查找当前任务点
    function findCurrentTaskPoint() {
        const statusElements = getAllTaskStatusElements();
        
        // 查找当前的"任务点"或"已完成"元素
        for (const element of statusElements) {
            const status = getTaskStatus(element);
            if (status === '任务点' || status === '已完成') {
                log(`找到当前任务点: ${status}`, element);
                return element;
            }
        }
        
        return null;
    }

    // 检查当前任务是否已完成
    function isCurrentTaskCompleted() {
        const currentTask = findCurrentTaskPoint();
        if (currentTask) {
            const status = getTaskStatus(currentTask);
            const isCompleted = status === '已完成';
            log(`当前任务状态: ${status}, 是否完成: ${isCompleted}`, currentTask);
            return isCompleted;
        }
        return false;
    }

    // 查找下一个任务点
    function findNextTaskPoint() {
        const statusElements = getAllTaskStatusElements();
        let foundCurrent = false;
        
        for (const element of statusElements) {
            const status = getTaskStatus(element);
            
            if (foundCurrent && status === '任务点') {
                log('找到下一个任务点', element);
                return element;
            }
            
            if (status === '已完成') {
                foundCurrent = true;
            }
        }
        
        return null;
    }

    // 点击元素
    function clickElement(element) {
        try {
            // 查找可点击的父元素
            const clickableParent = element.closest('a') || 
                                  element.closest('button') || 
                                  element.closest('[role="button"]') ||
                                  element.closest('[class*="item"]');
            
            if (clickableParent) {
                log('点击父元素', clickableParent);
                
                // 创建并触发点击事件
                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                clickableParent.dispatchEvent(clickEvent);
                
                // 如果是链接，也尝试直接访问
                if (clickableParent.tagName === 'A' && clickableParent.href) {
                    window.location.href = clickableParent.href;
                }
                
                return true;
            }
            
            // 如果没有找到可点击的父元素，尝试点击元素本身
            element.click();
            return true;
        } catch (e) {
            log('点击失败', e);
            return false;
        }
    }

    // 点击下一个任务点
    function clickNextTaskPoint() {
        const nextTask = findNextTaskPoint();
        if (nextTask) {
            log('准备点击下一个任务点', nextTask);
            if (clickElement(nextTask)) {
                showNotification('正在切换到下一个视频任务点...');
                return true;
            }
        }
        
        log('未找到可点击的下一个任务点');
        return false;
    }

    // 等待任务点完成并切换
    function waitForTaskCompletionAndSwitch() {
        let checkCount = 0;
        const maxChecks = 20; // 最多等待10秒
        
        const checkInterval = setInterval(() => {
            checkCount++;
            log(`第 ${checkCount} 次检查任务点状态`);
            
            if (isCurrentTaskCompleted()) {
                clearInterval(checkInterval);
                log('检测到任务点已完成，准备切换');
                setTimeout(() => {
                    clickNextTaskPoint();
                }, 1000);
            } else if (checkCount >= maxChecks) {
                clearInterval(checkInterval);
                log('等待任务点完成超时');
            }
        }, config.statusCheckInterval);
    }

    // 监控视频播放
    function monitorVideo(video) {
        if (!video || video._monitored) return;
        
        log('开始监控视频播放', video);
        video._monitored = true;
        
        // 监听视频播放进度
        video.addEventListener('timeupdate', () => {
            const timeLeft = video.duration - video.currentTime;
            if (video.duration > 0 && timeLeft < 1) {
                log(`视频即将结束，剩余${timeLeft.toFixed(2)}秒`);
                waitForTaskCompletionAndSwitch();
            }
        });
        
        // 监听视频结束
        video.addEventListener('ended', () => {
            log('视频已结束，等待任务点完成');
            waitForTaskCompletionAndSwitch();
        });
        
        // 监听错误事件
        video.addEventListener('error', (e) => {
            log('视频播放出错', e);
            showNotification('视频播放出错，等待任务点完成后切换', 'error');
            waitForTaskCompletionAndSwitch();
        });
        
        log(`视频监控已启动: 时长${video.duration}秒`);
    }

    // 查找视频元素
    function findVideoElement() {
        const selectors = [
            'video#video_html5_api',
            '.video-js video',
            'video.vjs-tech',
            '.ans-attach-online video',
            'video'
        ];
        
        for (const selector of selectors) {
            const video = document.querySelector(selector);
            if (video && video.tagName === 'VIDEO' && video.offsetParent !== null) {
                log('找到视频元素', video);
                return video;
            }
        }
        
        return null;
    }

    // 定期检查视频元素
    function checkForVideo() {
        const video = findVideoElement();
        if (video) {
            monitorVideo(video);
        }
    }
    
    // 初始化
    function initialize() {
        if (!config.disclaimerAccepted) {
            // 检查是否之前已经同意过
            const previouslyAccepted = localStorage.getItem('video-monitor-disclaimer-accepted');
            if (previouslyAccepted === 'true') {
                config.disclaimerAccepted = true;
            } else {
                showDisclaimer();
                return; // 等待用户操作
            }
        }

        log('初始化视频监测器...');
        
        // 立即检查一次
        checkForVideo();
        
        // 定期检查视频元素
        setInterval(checkForVideo, config.checkInterval);
        
        // 设置DOM变化观察器
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                    break;
                }
            }
            if (shouldCheck) {
                checkForVideo();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 在页面加载完成后初始化
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
    
    // 暴露给控制台使用的方法
    window.videoMonitor = {
        checkForVideo: checkForVideo,
        isCurrentTaskCompleted: isCurrentTaskCompleted,
        clickNextTaskPoint: clickNextTaskPoint,
        setDebug: (value) => { config.debug = value; },
        getAllTaskStatusElements: getAllTaskStatusElements,
        getTaskStatus: getTaskStatus,
        resetDisclaimer: () => {
            localStorage.removeItem('video-monitor-disclaimer-accepted');
            config.disclaimerAccepted = false;
            showDisclaimer();
        }
    };
})();