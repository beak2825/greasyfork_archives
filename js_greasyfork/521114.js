// ==UserScript==
// @name         抖音自动切换最高画质
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动切换抖音到最高可用画质（4K>2K>1080P>720P），支持自定义检测时间间隔
// @author       zpc5560
// @match        *://*.douyin.com/*
// @grant        none
// @icon         http://www.missyuan.net/uploads/allimg/190118/11341Q918-11.jpg
// @downloadURL https://update.greasyfork.org/scripts/521114/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/521114/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isQualitySwitched = false;
    let currentQuality = null;
    let lastAttemptTime = 0;
    let currentVideoSrc = null;
    let currentTransformValue = 'translate3d(0px, 0px, 0px)';
    const DEFAULT_CHECK_INTERVAL = 5 * 60 * 1000; // 默认5分钟
    const MAX_CHECK_INTERVAL = 60 * 60 * 1000; // 最大1小时
    let CHECK_INTERVAL = DEFAULT_CHECK_INTERVAL;
    let checkTimer = null;

    // 定义画质优先级
    const qualityPriority = [
        { name: '超清 4K', minHeight: 2160 },
        { name: '超清 2K', minHeight: 1440 },
        { name: '高清 1080P', minHeight: 1080 },
        { name: '高清 720P', minHeight: 720 }
    ];

    // 创建设置按钮
    function createSettingsButton() {
        const button = document.createElement('button');
        button.textContent = '设置检测间隔';
        button.style.cssText = `
            position: fixed;
            bottom: 90px;
            left: 20px;
            z-index: 999999;
            padding: 8px 12px;
            background-color: rgba(34, 34, 34, 0.9);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        `;
        button.addEventListener('click', showSettingsDialog);
        document.body.appendChild(button);
    }

    // 显示设置对话框
    function showSettingsDialog() {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            min-width: 300px;
        `;

        const currentInterval = CHECK_INTERVAL / 1000;
        const minutes = Math.floor(currentInterval / 60);
        const seconds = currentInterval % 60;

        dialog.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #333;">设置检测间隔</h3>
            <div style="margin-bottom: 15px;">
                <label style="display: inline-block; width: 50px; color: #666;">分钟：</label>
                <input type="number" id="minutes" value="${minutes}" min="0" max="60" style="width: 60px; padding: 4px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: inline-block; width: 50px; color: #666;">秒钟：</label>
                <input type="number" id="seconds" value="${seconds}" min="0" max="59" style="width: 60px; padding: 4px;">
            </div>
            <div style="color: #666; font-size: 12px; margin-bottom: 15px;">
                注意：总时间不能超过1小时
            </div>
            <div style="text-align: right;">
                <button id="cancelBtn" style="margin-right: 10px; padding: 6px 12px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">取消</button>
                <button id="saveBtn" style="padding: 6px 12px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
            </div>
        `;

        document.body.appendChild(dialog);

        const minutesInput = dialog.querySelector('#minutes');
        const secondsInput = dialog.querySelector('#seconds');
        const saveBtn = dialog.querySelector('#saveBtn');
        const cancelBtn = dialog.querySelector('#cancelBtn');

        // 保存设置
        saveBtn.addEventListener('click', () => {
            const minutes = parseInt(minutesInput.value) || 0;
            const seconds = parseInt(secondsInput.value) || 0;
            const totalSeconds = minutes * 60 + seconds;

            if (totalSeconds === 0) {
                alert('检测间隔不能为0');
                return;
            }

            if (totalSeconds > 3600) {
                alert('检测间隔不能超过1小时');
                return;
            }

            CHECK_INTERVAL = totalSeconds * 1000;
            localStorage.setItem('douyinQualityCheckInterval', CHECK_INTERVAL.toString());
            resetState();
            document.body.removeChild(dialog);
        });

        // 取消设置
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
    }

    // 获取当前选中的画质
    function getCurrentQuality() {
        const selectedItem = document.querySelector('.virtual .item.selected');
        return selectedItem ? selectedItem.textContent.trim() : null;
    }

    // 移除悬停效果
    function removeHoverEffect() {
        const mouseOutEvent = new MouseEvent('mouseout', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        const qualityButton = document.querySelector('.gear.isSmoothSwitchClarityLogin');
        if (qualityButton) {
            qualityButton.dispatchEvent(mouseOutEvent);
        }
    }

    // 检查画质是否需要切换
    function checkQualityNeedsSwitch() {
        const currentSelectedQuality = getCurrentQuality();
        const currentTime = Date.now();
        
        if (!currentQuality || 
            currentSelectedQuality !== currentQuality || 
            currentTime - lastAttemptTime >= CHECK_INTERVAL) {
            isQualitySwitched = false;
            switchToHighQuality();
        }
    }

    // 检查视频源是否更改
    function checkVideoSourceChanged() {
        const videoElement = document.querySelector('video');
        const transformElement = document.querySelector('.kkbhJDRa.MvotIm_G');
        if (videoElement && transformElement) {
            const newVideoSrc = videoElement.src;
            const newTransformValue = transformElement.style.transform;
            if (newVideoSrc !== currentVideoSrc || newTransformValue !== currentTransformValue) {
                currentVideoSrc = newVideoSrc;
                currentTransformValue = newTransformValue;
                isQualitySwitched = false;
                switchToHighQuality();
            }
        }
    }

    function switchToHighQuality() {
        if (isQualitySwitched) return;

        const qualityButton = document.querySelector('.gear.isSmoothSwitchClarityLogin');
        if (qualityButton) {
            const mouseOverEvent = new MouseEvent('mouseover', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            qualityButton.dispatchEvent(mouseOverEvent);

            setTimeout(() => {
                const qualityOptions = Array.from(document.querySelectorAll('.virtual .item'));
                
                let selectedOption = null;
                for (const quality of qualityPriority) {
                    const option = qualityOptions.find(opt => 
                        opt.textContent.includes(quality.name)
                    );
                    if (option) {
                        selectedOption = option;
                        break;
                    }
                }

                if (selectedOption) {
                    selectedOption.click();
                    currentQuality = selectedOption.textContent.trim();
                    lastAttemptTime = Date.now();
                    console.log(`已切换到${currentQuality}画质`);
                    isQualitySwitched = true;
                    startQualityCheck();
                } else {
                    const smartOption = qualityOptions.find(opt => 
                        opt.textContent.includes('智能')
                    );
                    if (smartOption) {
                        smartOption.click();
                        currentQuality = '智能';
                        lastAttemptTime = Date.now();
                        console.log('未找到720P或更高画质，暂时切换到智能画质');
                        isQualitySwitched = true;
                        startQualityCheck();
                    }
                }
                
                setTimeout(removeHoverEffect, 100);
            }, 500);
        } else {
            console.log('画质选择按钮未找到');
        }
    }

    // 启动定时检测
    function startQualityCheck() {
        if (checkTimer) {
            clearInterval(checkTimer);
        }
        
        checkTimer = setInterval(() => {
            console.log('定时检测视频源中...');
            checkVideoSourceChanged();
        }, CHECK_INTERVAL);
    }

    // 停止定时检测
    function stopQualityCheck() {
        if (checkTimer) {
            clearInterval(checkTimer);
            checkTimer = null;
        }
    }

    // 使用 MutationObserver 监听页面变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                const videoElement = document.querySelector('video');
                const transformElement = document.querySelector('.kkbhJDRa.MvotIm_G');
                if (videoElement && transformElement && !isQualitySwitched) {
                    checkVideoSourceChanged();
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // 在页面切换时重置状态
    function resetState() {
        isQualitySwitched = false;
        currentQuality = null;
        lastAttemptTime = 0;
        currentVideoSrc = null;
        currentTransformValue = 'translate3d(0px, 0px, 0px)';
        stopQualityCheck();
        startQualityCheck();
    }

    // 初始化检测间隔
    function initCheckInterval() {
        const savedInterval = localStorage.getItem('douyinQualityCheckInterval');
        if (savedInterval) {
            const interval = parseInt(savedInterval);
            if (!isNaN(interval) && interval > 0 && interval <= MAX_CHECK_INTERVAL) {
                CHECK_INTERVAL = interval;
            }
        }
    }

    window.addEventListener('urlchange', resetState);

    window.addEventListener('load', () => {
        initCheckInterval();
        createSettingsButton();
        resetState();
        switchToHighQuality();
    });

    window.addEventListener('unload', () => {
        stopQualityCheck();
    });

    // 初始启动
    setTimeout(() => {
        initCheckInterval();
        createSettingsButton();
        resetState();
    }, 1000);
})();