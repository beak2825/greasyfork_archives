// ==UserScript==
// @name         东南大学直播课PPT自动截图
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  只有直播可用。把PPT拖至最大的窗口。
// @author       Vic and his AI
// @license      MIT
// @match        https://cvs.seu.edu.cn/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/530403/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E7%9B%B4%E6%92%AD%E8%AF%BEPPT%E8%87%AA%E5%8A%A8%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/530403/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E7%9B%B4%E6%92%AD%E8%AF%BEPPT%E8%87%AA%E5%8A%A8%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('脚本已加载 - 东大直播课PPT自动截图');

    // 配置参数
    let CONFIG = {
        targetSelector: '.player-view.player-view-1', // PPT容器选择器
        checkInterval: 20000,       // 检查间隔20秒
        pixelTolerance: 0.05       // 像素容忍度，这里设置为5%
    };

    // 状态管理
    let state = {
        isMonitoring: false,
        intervalId: null,
        screenshotHistory: []
    };

    // 初始化UI
    function initUI() {
        const ui = document.createElement('div');
        ui.id = 'ppt-monitor-ui';
        ui.style.cssText = `
            position: fixed;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            background: rgba(40,40,40,0.93);
            color: #fff;
            padding: 10px;
            border-radius: 0 8px 8px 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            z-index: 99999;
            font-family: Arial, sans-serif;
            width: 50px;
            min-width: 50px;
            overflow: hidden;
            transition: width 0.3s ease;
        `;

        // UI内容
        ui.innerHTML = `
            <div class="expanded-content" style="display:none;">
                <h3 style="margin:0 0 12px;font-weight:500;white-space:nowrap;">PPT监控器 v1.1</h3>
                <div style="margin-bottom:10px;white-space:nowrap;">
                    <button id="toggleMonitor" style="margin-right:8px;">启动监控</button>
                    <button id="manualCapture">手动截图</button>
                </div>
                <div style="margin-bottom:10px;white-space:nowrap;">
                    <label for="intervalInput">截图间隔 (s): </label>
                    <input type="number" id="intervalInput" value="${CONFIG.checkInterval / 1000}" min="1" style="width: 50px;">
                </div>
                <div style="margin-bottom:10px;white-space:nowrap;">
                    <label for="toleranceInput">差异比例 (%): </label>
                    <input type="number" id="toleranceInput" value="${CONFIG.pixelTolerance * 100}" min="1" max="100" style="width: 45px;">
                </div>
                <div class="expanded-status" style="font-size:13px;white-space:nowrap;">
                    <p style="color:#0cf;margin:0;">监控已停止</p>
                </div>
            </div>
            <div class="collapsed-status" style="
                position: absolute;
                top: 50%;
                left: 10px;
                transform: translateY(-50%);
                color: #0cf;
                font-size: 12px;
                white-space: nowrap;
            ">
                <p style="margin:0;">已停止</p>
            </div>
            <div class="collapse-indicator" style="
                position: absolute;
                top: 50%;
                right: 5px;
                transform: translateY(-50%);
                color: #fff;
                font-size: 16px;
            ">▶</div>
        `;

        document.body.appendChild(ui);

        // 鼠标交互
        ui.addEventListener('mouseenter', () => {
            ui.style.width = '160px';
            ui.querySelector('.expanded-content').style.display = 'block';
            ui.querySelector('.collapsed-status').style.display = 'none';
        });

        ui.addEventListener('mouseleave', () => {
            ui.style.width = '50px';
            ui.querySelector('.expanded-content').style.display = 'none';
            ui.querySelector('.collapsed-status').style.display = 'block';
        });

        // 按钮事件
        ui.querySelector('#toggleMonitor').addEventListener('click', toggleMonitoring);
        ui.querySelector('#manualCapture').addEventListener('click', () => captureScreenshot('manual'));
        ui.querySelector('#intervalInput').addEventListener('input', setIntervalTime);
        ui.querySelector('#toleranceInput').addEventListener('input', setTolerance);
    }

    // 核心截图功能
    async function captureScreenshot(source = 'auto') {
        try {
            const target = document.querySelector(CONFIG.targetSelector);
            if (!target) throw new Error('PPT容器未找到');

            // 等待元素渲染
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(target, {
                useCORS: true,
                scale: 2,
                logging: false,
                backgroundColor: '#FFFFFF',
                onclone: (doc) => {
                    // 处理特殊元素
                    doc.querySelectorAll('video, audio').forEach(media => media.pause());
                }
            });

            const timestamp = new Date().toISOString().replace(/[:T.]/g, '-').slice(0, 19);
            const filename = `SEU-PPT_${timestamp}_${source}.png`;
            const currentScreenshot = canvas.toDataURL('image/png');

            // 检查是否重复
            let isDuplicate = false;
            const lastScreenshot = state.screenshotHistory[state.screenshotHistory.length - 1];
            if (lastScreenshot && await compareImages(lastScreenshot, currentScreenshot)) {
                isDuplicate = true;
            }

            if (!isDuplicate) {
                const link = document.createElement('a');
                link.href = currentScreenshot;
                link.download = filename;
                link.click();
                state.screenshotHistory.push(currentScreenshot);
                console.log(`截图成功: ${filename}`);
            } else {
                console.log(`重复截图，跳过: ${filename}`);
            }

        } catch (error) {
            console.error('[PPT监控器] 错误:', error);
        }
    }

    // 简单的图片对比函数
    async function compareImages(image1, image2) {
        if (!image1 || !image2) return false;
        const canvas1 = document.createElement('canvas');
        const ctx1 = canvas1.getContext('2d');
        const img1 = new Image();
        img1.src = image1;
        await new Promise(resolve => img1.onload = resolve);
        canvas1.width = img1.width;
        canvas1.height = img1.height;
        ctx1.drawImage(img1, 0, 0);

        const canvas2 = document.createElement('canvas');
        const ctx2 = canvas2.getContext('2d');
        const img2 = new Image();
        img2.src = image2;
        await new Promise(resolve => img2.onload = resolve);
        canvas2.width = img2.width;
        canvas2.height = img2.height;
        ctx2.drawImage(img2, 0, 0);

        const data1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height).data;
        const data2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height).data;

        let differentPixelCount = 0;
        for (let i = 0; i < data1.length/10; i++) {
            if (data1[10 * i] !== data2[10 * i]) {
                differentPixelCount++;
            }
        }

        const totalPixelCount = data1.length / 10 / 4; // 每个像素由4个值（r, g, b, a）组成
        const toleranceCount = totalPixelCount * CONFIG.pixelTolerance;

        return differentPixelCount <= toleranceCount;
    }

    // 监控状态控制
    function startMonitoring() {
        const target = document.querySelector(CONFIG.targetSelector);
        if (!target) {
            updateStatus('error', 'PPT容器未找到');
            return;
        }

        // 立即执行首次截图
        captureScreenshot('auto');

        state.intervalId = setInterval(() => {
            if (state.isMonitoring) captureScreenshot('auto');
        }, CONFIG.checkInterval);

        state.isMonitoring = true;
        updateStatus('monitoring');
        document.querySelector('#toggleMonitor').textContent = '停止监控';
    }

    function stopMonitoring() {
        clearInterval(state.intervalId);
        state.isMonitoring = false;
        updateStatus('stopped');
        document.querySelector('#toggleMonitor').textContent = '启动监控';
    }

    function toggleMonitoring() {
        state.isMonitoring ? stopMonitoring() : startMonitoring();
    }

    // 设置截图间隔
    function setIntervalTime() {
        const input = document.querySelector('#intervalInput');
        const newInterval = parseInt(input.value) * 1000;
        if (!isNaN(newInterval) && newInterval > 0) {
            CONFIG.checkInterval = newInterval;
            if (state.isMonitoring) {
                stopMonitoring();
                startMonitoring();
            }
            console.log(`截图间隔已设置为 ${newInterval / 1000} 秒`);
        } else {
            console.error('输入的间隔时间无效，请输入一个大于0的整数。');
        }
    }

    // 设置像素容忍度
    function setTolerance() {
        const input = document.querySelector('#toleranceInput');
        const newTolerance = parseFloat(input.value) / 100;
        if (!isNaN(newTolerance) && newTolerance > 0 && newTolerance <= 1) {
            CONFIG.pixelTolerance = newTolerance;
            console.log(`像素容忍度已设置为 ${newTolerance * 100}%`);
        } else {
            console.error('输入的容忍度无效，请输入一个1到100之间的数字。');
        }
    }

    // 状态显示更新
    function updateStatus(type, message) {
        const elements = {
            expanded: document.querySelector('.expanded-status p'),
            collapsed: document.querySelector('.collapsed-status p')
        };

        const statusMap = {
            monitoring: {
                expanded: '监控中...',
                collapsed: '已开启',
                color: '#0cf'
            },
            stopped: {
                expanded: '监控已停止',
                collapsed: '已停止',
                color: '#0cf'
            },
            error: {
                expanded: '错误: ' + message,
                collapsed: '错误',
                color: '#f00'
            }
        };

        const status = statusMap[type] || {
            expanded: '未知状态',
            collapsed: '未知',
            color: '#0cf'
        };

        elements.expanded.textContent = status.expanded;
        elements.expanded.style.color = status.color;
        elements.collapsed.textContent = status.collapsed;
        elements.collapsed.style.color = status.color;
    }

    // 启动流程
    window.addEventListener('load', () => {
        initUI();
    });

    // 离开页面提醒
    window.addEventListener('beforeunload', () => {
        if (state.isMonitoring) {
            return '截图进程正在进行中，确定要离开吗？';
        }
    });
})();