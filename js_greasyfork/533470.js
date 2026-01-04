// ==UserScript==
// @name        元梦之星农场辅助Q群121234447
// @namespace   https://your-namespace.com
// @match       *://gamer.qq.com/v2/game/*
// @grant       none
// @version     1.6
// @author      QQ1277745546
// @description 完美实现两套流程的最终版
// @license     允许使用代码，
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/533470/%E5%85%83%E6%A2%A6%E4%B9%8B%E6%98%9F%E5%86%9C%E5%9C%BA%E8%BE%85%E5%8A%A9Q%E7%BE%A4121234447.user.js
// @updateURL https://update.greasyfork.org/scripts/533470/%E5%85%83%E6%A2%A6%E4%B9%8B%E6%98%9F%E5%86%9C%E5%9C%BA%E8%BE%85%E5%8A%A9Q%E7%BE%A4121234447.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 配置 =====
    const config = {
        loopInterval: 30000,
        uiMinimized: false,
        buttonsToClick: [
            { selector: ".cancel-btn", desc: "取消按钮", customPos: true, x: 879, y: 650 },
            { selector: ".reset-btn", desc: "重置位置", customPos: true, x: 1839, y: 905 }
        ],
        keySequenceWASD: [ // WASD模式流程
            { key: " ", times: 10, interval: 800, delayAfter: 1500 },
            { key: "a", duration: 800, delayAfter: 0 },
            { key: "q" }
        ],
        keySequenceNormal: [ // 普通模式流程
            { key: "r", delayAfter: 1500 },
            { key: "Shift", times: 10, interval: 800, delayAfter: 1500 },
            { key: "a", duration: 800, delayAfter: 0 },
            { key: "q" }
        ],
        isCapturingPos: false,
        currentCaptureFor: null,
        shouldStop: false,
        qqGroupLink: "https://qm.qq.com/q/esXtDSP2WA",
        qqGroupNumber: "121234447",
        useWASD: false,
        adLink: "https://h5.lot-ml.com/ProductEn/Shop/a6f01a0fe5698a60"
    };

    // ===== 状态变量 =====
    let isRunning = false;
    let timer = null;
    let cycleCount = 0;
    let iframe = null;
    let adShown = false;

    // ===== 核心流程执行 =====
    async function executeSequence() {
        if (config.shouldStop) return;

        cycleCount++;
        log(`\n🔄 开始第 ${cycleCount} 次循环`);
        updateStatus();

        // 第一步：总是点击取消按钮
        const cancelBtn = config.buttonsToClick[0];
        if (cancelBtn.customPos) {
            if (!await clickAtPosition(cancelBtn.x, cancelBtn.y)) {
                log(`⚠️ 取消按钮点击失败: [${cancelBtn.x}, ${cancelBtn.y}]`);
            } else {
                log(`🖱️ 点击取消按钮坐标: [${cancelBtn.x}, ${cancelBtn.y}]`);
            }
        } else {
            const element = document.querySelector(cancelBtn.selector);
            if (element) {
                simulateRealClick(element);
                log(`🖱️ 点击取消按钮`);
            } else {
                log(`⚠️ 未找到取消按钮`);
            }
        }
        await delay(500);
        if (cancelBtn.customPos) {
            if (!await clickAtPosition(cancelBtn.x, cancelBtn.y)) {
                log(`⚠️ 取消按钮点击失败: [${cancelBtn.x}, ${cancelBtn.y}]`);
            } else {
                log(`🖱️ 点击取消按钮坐标: [${cancelBtn.x}, ${cancelBtn.y}]`);
            }
        } else {
            const element = document.querySelector(cancelBtn.selector);
            if (element) {
                simulateRealClick(element);
                log(`🖱️ 点击取消按钮`);
            } else {
                log(`⚠️ 未找到取消按钮`);
            }
        }
        await delay(500);
        // 第二步：根据模式执行不同流程
        const resetBtn = config.buttonsToClick[1];
        if (config.useWASD) {

            // WASD模式流程
if (resetBtn.customPos) {
    // 先移动鼠标到取消按钮位置
    await moveMouseToPosition(cancelBtn.x, cancelBtn.y);
    if (!await clickAtPosition(cancelBtn.x, cancelBtn.y)) {
        log(`⚠️ 取消按钮点击失败: [${cancelBtn.x}, ${cancelBtn.y}]`);
    } else {
        log(`🖱️ 点击取消按钮坐标: [${cancelBtn.x}, ${cancelBtn.y}]`);
    }
    await delay(500);

    // 再次点击取消按钮
    await moveMouseToPosition(cancelBtn.x, cancelBtn.y);
    if (!await clickAtPosition(cancelBtn.x, cancelBtn.y)) {
        log(`⚠️ 取消按钮点击失败: [${cancelBtn.x}, ${cancelBtn.y}]`);
    } else {
        log(`🖱️ 点击取消按钮坐标: [${cancelBtn.x}, ${cancelBtn.y}]`);
    }
    await delay(500);

    // 点击重置位置按钮
    await moveMouseToPosition(resetBtn.x, resetBtn.y);
    if (!await clickAtPosition(resetBtn.x, resetBtn.y)) {
        log(`⚠️ 重置位置点击失败: [${resetBtn.x}, ${resetBtn.y}]`);
    } else {
        log(`🖱️ 点击重置位置坐标: [${resetBtn.x}, ${resetBtn.y}]`);
    }
    await delay(1000);

    // 再次点击重置位置按钮
    await moveMouseToPosition(resetBtn.x, resetBtn.y);
    if (!await clickAtPosition(resetBtn.x, resetBtn.y)) {
        log(`⚠️ 重置位置点击失败: [${resetBtn.x}, ${resetBtn.y}]`);
    } else {
        log(`🖱️ 点击重置位置坐标: [${resetBtn.x}, ${resetBtn.y}]`);
    }
    await delay(1000);
} else {
                const element = document.querySelector(resetBtn.selector);
                if (element) {
                    simulateRealClick(element);
                    log(`🖱️ 点击重置位置`);
                } else {
                    log(`⚠️ 未找到重置位置按钮`);
                }
            }
            await delay(1000); // 等待1秒

            // 执行WASD模式按键序列
            for (const step of config.keySequenceWASD) {
                if (config.shouldStop) break;

                if (step.times) {
                    for (let i = 1; i <= step.times; i++) {
                        if (config.shouldStop) break;
                        await pressKey(step.key);
                        log(`⇧ ${step.key} 第 ${i} 次`);
                        if (i < step.times) await delay(step.interval);
                    }
                } else if (step.duration) {
                    await holdKey(step.key, step.duration);
                } else {
                    await pressKey(step.key);
                }

                if (step.delayAfter && !config.shouldStop) await delay(step.delayAfter);
            }
        } else {
            // 普通模式流程
            await pressKey("r");
            log(`⌨ 按下R键`);
            await delay(1500); // 等待1.5秒

            // 执行普通模式按键序列
            for (const step of config.keySequenceNormal.slice(1)) { // 跳过第一个R键
                if (config.shouldStop) break;

                if (step.times) {
                    for (let i = 1; i <= step.times; i++) {
                        if (config.shouldStop) break;
                        await pressKey(step.key);
                        log(`⇧ ${step.key} 第 ${i} 次`);
                        if (i < step.times) await delay(step.interval);
                    }
                } else if (step.duration) {
                    await holdKey(step.key, step.duration);
                } else {
                    await pressKey(step.key);
                }

                if (step.delayAfter && !config.shouldStop) await delay(step.delayAfter);
            }
        }

        if (!config.shouldStop) {
            log(`⏱ 下次执行在 ${config.loopInterval/1000} 秒后`);
            timer = setTimeout(executeSequence, config.loopInterval);
        }
    }

    // ===== 控制函数 =====
    function startAuto() {
        if (isRunning) return;

        config.shouldStop = false;
        isRunning = true;
        updateStatus();

        log("🚀 启动自动化任务");
        log(`当前模式: ${config.useWASD ? "无摇杆模式" : "有摇杆普通模式"}`);
        executeSequence();
    }
async function moveMouseToPosition(x, y) {
    return new Promise(resolve => {
        const mouseMove = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
            screenX: x + window.screenX,
            screenY: y + window.screenY
        });

        document.dispatchEvent(mouseMove);
        setTimeout(resolve, 50); // 小延迟确保鼠标移动到位
    });
}
    async function stopAuto() {
        if (!isRunning) return;

        config.shouldStop = true;
        isRunning = false;
        if (timer) clearTimeout(timer);
        updateStatus();

        log("🛑 正在停止任务...");

        // 停止后1秒按R键
        await delay(1000);
        if (!isRunning) {
            await pressKey("r");
            // WASD模式流程
        if (config.useWASD) {
            if (resetBtn.customPos) {
                // 移动鼠标到重置位置并点击
                await moveMouseToPosition(resetBtn.x, resetBtn.y);
                if (!await clickAtPosition(resetBtn.x, resetBtn.y)) {
                    log(`⚠️ 重置位置点击失败: [${resetBtn.x}, ${resetBtn.y}]`);
                } else {
                    log(`🖱️ 点击重置位置坐标: [${resetBtn.x}, ${resetBtn.y}]`);
                }
            } else {
                const element = document.querySelector(resetBtn.selector);
                if (element) {
                    simulateRealClick(element);
                    log(`🖱️ 点击重置位置`);
                } else {
                    log(`⚠️ 未找到重置位置按钮`);
                }
            }
        }
            log("⌨ 已发送停止信号(R键)");
        }
    }

    // ===== UI界面 =====
    function createUI() {


        if (document.getElementById("auto-ui-container")) return;
        // 创建iframe容器
        const iframeContainer = document.createElement('div');
        iframeContainer.id = 'auto-ui-container';
        iframeContainer.style.position = 'fixed';
        iframeContainer.style.top = '20px';
        iframeContainer.style.right = '20px';
        iframeContainer.style.width = '320px';
        iframeContainer.style.height = '800px';
        iframeContainer.style.zIndex = '2147483647';
        iframeContainer.style.pointerEvents = 'none';

        // 创建iframe
        iframe = document.createElement('iframe');
        iframe.id = 'auto-ui-iframe';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        iframe.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        iframe.style.pointerEvents = 'auto';
        iframe.sandbox = 'allow-scripts allow-same-origin';

        iframeContainer.appendChild(iframe);
        document.body.appendChild(iframeContainer);

        // 写入iframe内容
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    * {
                        box-sizing: border-box;
                        user-select: none;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        background: #2c3e50;
                        color: white;
                        font-family: Arial, sans-serif;
                        overflow: hidden;
                    }
                    #ui-container {
                        width: 100%;
                        height: 100%;
                        position: relative;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px;
                        background: #34495e;
                        cursor: move;
                        user-select: none;
                    }
                    .content {
                        padding: 15px;
                        height: calc(100% - 120px);
                        overflow-y: auto;
                    }
                    .control-group {
                        margin-bottom: 15px;
                        padding: 10px;
                        background: #34495e;
                        border-radius: 4px;
                    }
                    .btn {
                        padding: 8px;
                        border: none;
                        border-radius: 4px;
                        color: white;
                        cursor: pointer;
                        font-size: 14px;
                        transition: all 0.2s;
                    }
                    .btn:hover {
                        filter: brightness(1.1);
                    }
                    .btn:active {
                        transform: scale(0.98);
                    }
                    .start-btn {
                        background: #27ae60;
                    }
                    .stop-btn {
                        background: #e74c3c;
                    }
                    .capture-btn {
                        padding: 4px 8px;
                        background: #3498db;
                        border-radius: 3px;
                        color: white;
                        font-size: 12px;
                        border: none;
                        cursor: pointer;
                    }
                    .log-area {
                        width: 100%;
                        height: 120px;
                        padding: 8px;
                        background: #1a1a1a;
                        color: #00ff00;
                        border: 1px solid #333;
                        border-radius: 4px;
                        font-family: monospace;
                        font-size: 12px;
                        resize: none;
                    }
                    input[type="number"], input[type="checkbox"] {
                        cursor: pointer;
                    }
                    label {
                        cursor: pointer;
                    }
                    .ad-link {
                        display: block;
                        margin: 10px 0;
                        padding: 8px;
                        background: #9b59b6;
                        color: white;
                        text-align: center;
                        border-radius: 4px;
                        text-decoration: none;
                        font-weight: bold;
                        animation: pulse 2s infinite;
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                </style>
            </head>
            <body>
                <div id="ui-container">
                    <div class="header" id="header">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <h3 style="margin:0;font-size:14px;">按键控制面板QQ群121234447</h3>
                            <span id="status-indicator" style="font-size:12px;">🔴 已停止</span>
                        </div>
                        <button id="minimize-btn" style="background:none;border:none;color:white;font-size:16px;cursor:pointer;">−</button>
                    </div>

                    <div class="content" id="ui-content">
                        <div class="control-group">
                            <h4 style="margin-top:0; border-bottom:1px solid #445566; padding-bottom:5px;">坐标设置
 <span class="blink-red-blue">加入QQ群121234447获取更多模式脚本</span></h4>
<style>
    /* 红蓝闪烁动画 */
    .blink-red-blue {
        animation: blinkRedBlue 1s infinite;
        font-weight: bold;
    }

    @keyframes blinkRedBlue {
        0% { color: red; }
        50% { color: blue; }
        100% { color: red; }
    }
</style>
                            ${config.buttonsToClick.map((btn, index) => `
                                <div style="margin-bottom:10px;">
                                    <div style="font-weight:bold;margin-bottom:5px;">${btn.desc}</div>
                                    <div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;">
                                        <button class="capture-btn" data-index="${index}">捕捉坐标</button>
                                        <span style="font-size:12px;">X:</span>
                                        <input type="number" id="pos-x-${index}" value="${btn.x}" style="width:50px;padding:3px;">
                                        <span style="font-size:12px;">Y:</span>
                                        <input type="number" id="pos-y-${index}" value="${btn.y}" style="width:50px;padding:3px;">
                                        <label style="font-size:12px;display:flex;align-items:center;">
                                            <input type="checkbox" id="use-custom-${index}" ${btn.customPos ? "checked" : ""} style="margin-right:5px;">
                                            使用坐标
                                        </label>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <div class="control-group">
                            <div style="display:flex;gap:10px;margin-bottom:10px;">
                                <button id="start-btn" class="btn start-btn">▶ 启动</button>
                                <button id="stop-btn" class="btn stop-btn">⏹ 停止</button>
                            </div>

                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                                <label style="font-size:12px;">循环间隔(秒):</label>
                                <input type="number" id="loop-interval" value="${config.loopInterval/1000}" min="15" style="width:60px;padding:5px;border-radius:4px;border:1px solid #ddd;">
                            </div>

                            <label style="display:flex;align-items:center;gap:5px;font-size:12px;">
                                <input type="checkbox" id="use-wasd" ${config.useWASD ? "checked" : ""}>
                                没有WASD方向摇杆请打钩此处
                            </label>
                        </div>

                        <!-- 添加广告链接 -->
                        <a href="${config.adLink}" target="_blank" class="ad-link">🔥 大流量卡首月赠送话费 🔥</a>

                        <div style="margin-bottom:10px;font-size:12px;text-align:center;">
                            <a href="${config.qqGroupLink}" target="_blank" style="color:#3498db;">QQ交流群: ${config.qqGroupNumber}</a>
                        </div>

                        <textarea id="log-area" class="log-area" readonly></textarea>
                    </div>
                </div>

                <script>
                    // 通信桥梁
                    const sendMessage = (type, data = {}) => {
                        window.parent.postMessage({ type, ...data }, '*');
                    };

                    // 事件监听器
                    function addEnhancedListener(element, event, callback) {
                        element.addEventListener(event, function(e) {
                            e.stopPropagation();
                            callback.call(this, e);
                        });
                    }

                    // 日志显示
                    window.addEventListener('message', function(e) {
                        if (e.data.type === 'log') {
                            const logArea = document.getElementById('log-area');
                            logArea.value += e.data.message + '\\n';
                            logArea.scrollTop = logArea.scrollHeight;
                        } else if (e.data.type === 'updateStatus') {
                            document.getElementById('status-indicator').textContent = e.data.status;
                        }
                    });

                    // 拖拽功能
                    const header = document.getElementById('header');
                    let isDragging = false;
                    let offsetX = 0, offsetY = 0;

                    addEnhancedListener(header, 'mousedown', function(e) {
                        if (e.target.id === 'minimize-btn' || e.target.classList.contains('capture-btn')) return;

                        isDragging = true;
                        offsetX = e.clientX;
                        offsetY = e.clientY;
                        e.preventDefault();
                    });

                    addEnhancedListener(document, 'mousemove', function(e) {
                        if (!isDragging) return;
                        sendMessage('moveUI', {
                            x: e.clientX - offsetX,
                            y: e.clientY - offsetY
                        });
                    });

                    addEnhancedListener(document, 'mouseup', function() {
                        isDragging = false;
                    });

                    // 按钮事件
                    addEnhancedListener(document.getElementById('start-btn'), 'click', function() {
                        sendMessage('startAuto');
                    });

                    addEnhancedListener(document.getElementById('stop-btn'), 'click', function() {
                        sendMessage('stopAuto');
                    });

                    addEnhancedListener(document.getElementById('minimize-btn'), 'click', function() {
                        sendMessage('toggleMinimize');
                    });

                    // 其他控件事件
                    addEnhancedListener(document.getElementById('loop-interval'), 'change', function() {
                        sendMessage('setInterval', {
                            value: Math.max(15, parseInt(this.value) || 15)
                        });
                    });

                    addEnhancedListener(document.getElementById('use-wasd'), 'change', function() {
                        sendMessage('setWASD', {
                            value: this.checked
                        });
                    });

                    // 坐标设置事件
                    ${config.buttonsToClick.map((btn, index) => `
                        addEnhancedListener(document.getElementById('use-custom-${index}'), 'change', function() {
                            sendMessage('setCustomPos', {
                                index: ${index},
                                value: this.checked
                            });
                        });

                        addEnhancedListener(document.getElementById('pos-x-${index}'), 'change', function() {
                            sendMessage('setPosX', {
                                index: ${index},
                                value: parseInt(this.value) || 0
                            });
                        });

                        addEnhancedListener(document.getElementById('pos-y-${index}'), 'change', function() {
                            sendMessage('setPosY', {
                                index: ${index},
                                value: parseInt(this.value) || 0
                            });
                        });

                        addEnhancedListener(document.querySelector('[data-index="${index}"]'), 'click', function() {
                            sendMessage('startPositionCapture', {
                                index: ${index}
                            });
                        });
                    `).join('')}
                </script>
            </body>
            </html>
        `);
        iframeDoc.close();

        // 监听iframe消息
        window.addEventListener('message', function(e) {
            if (e.source !== iframe.contentWindow) return;

            const handlers = {
                startAuto: () => startAuto(),
                stopAuto: () => stopAuto(),
                toggleMinimize: () => toggleMinimize(),
                setInterval: () => {
                    config.loopInterval = (e.data.value < 15 ? 15 : e.data.value) * 1000;
                },
                setWASD: () => {
                    config.useWASD = e.data.value;
                    log(e.data.value ? "✅ 已切换到无摇杆模式" : "✅ 已切换到有摇杆模式");
                },
                setCustomPos: () => {
                    config.buttonsToClick[e.data.index].customPos = e.data.value;
                    log(`${config.buttonsToClick[e.data.index].desc} ${e.data.value ? "使用" : "不使用"}自定义坐标`);
                },
                setPosX: () => {
                    config.buttonsToClick[e.data.index].x = e.data.value;
                    if (e.data.value > 0 && config.buttonsToClick[e.data.index].y > 0) {
                        config.buttonsToClick[e.data.index].customPos = true;
                        iframe.contentDocument.getElementById(`use-custom-${e.data.index}`).checked = true;
                    }
                },
                setPosY: () => {
                    config.buttonsToClick[e.data.index].y = e.data.value;
                    if (e.data.value > 0 && config.buttonsToClick[e.data.index].x > 0) {
                        config.buttonsToClick[e.data.index].customPos = true;
                        iframe.contentDocument.getElementById(`use-custom-${e.data.index}`).checked = true;
                    }
                },
                startPositionCapture: () => startPositionCapture(e.data.index),
                moveUI: () => {
                    iframe.parentElement.style.left = (parseInt(iframe.parentElement.style.left) || 0) + e.data.x + 'px';
                    iframe.parentElement.style.top = (parseInt(iframe.parentElement.style.top) || 0) + e.data.y + 'px';
                }
            };

            if (handlers[e.data.type]) {
                handlers[e.data.type]();
            }
        });

        // 显示广告弹窗
        showAdPopup();
    }

    // 显示广告弹窗
    function showAdPopup() {
        if (adShown) return;

        setTimeout(() => {
            const popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.width = '600px';
            popup.style.height = '600px';
            popup.style.backgroundColor = 'white';
            popup.style.borderRadius = '10px';
            popup.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
            popup.style.zIndex = '2147483647';
            popup.style.padding = '20px';
            popup.style.display = 'flex';
            popup.style.flexDirection = 'column';
            popup.style.alignItems = 'center';
            popup.style.justifyContent = 'space-between';

            popup.innerHTML = `
                <h3 style="color: #333; margin: 0;">🔥 限时优惠 🔥</h3>
                <p style="color: #666; text-align: center;">大流量卡首月赠送话费，点击下方按钮立即领取</p>
                <a href="https://imgse.com/i/pViXfEt"><img src="https://s21.ax1x.com/2025/06/08/pViXfEt.jpg" alt="pViXfEt.jpg"border-radius: 5px/></a>
                <div style="display: flex; gap: 10px;">
                    <button id="ad-close-btn" style="padding: 8px 15px; background: #ccc; border: none; border-radius: 5px; cursor: pointer;">关闭</button>
                    <a href="${config.adLink}" target="_blank" style="padding: 8px 15px; background: #f44336; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">立即领取</a>
                </div>
            `;

            document.body.appendChild(popup);

            // 关闭按钮事件
            const closeBtn = popup.querySelector('#ad-close-btn');
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(popup);
                adShown = true;
            });

            // 5秒后自动关闭
            setTimeout(() => {
                if (document.body.contains(popup)) {
                    document.body.removeChild(popup);
                    adShown = true;
                }
            }, 50000);
        }, 3000); // 3秒后显示广告
    }

    // ===== 辅助函数 =====
    function updateStatus() {
        const statusText = isRunning ? "🟢 运行中" : "🔴 已停止";
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'updateStatus',
                status: statusText
            }, '*');
        }
    }

    function log(message) {
        const time = new Date().toLocaleTimeString();
        const logText = `[${time}] ${message}`;
        console.log(logText);

        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'log',
                message: logText
            }, '*');
        }
    }

    function toggleMinimize() {
        const container = iframe.parentElement;
        const content = iframe.contentDocument.getElementById('ui-content');
        const btn = iframe.contentDocument.getElementById('minimize-btn');

        config.uiMinimized = !config.uiMinimized;
        if (config.uiMinimized) {
            container.style.width = '150px';
            container.style.height = '80px';
            content.style.display = 'none';
            btn.textContent = '↗';
        } else {
            container.style.width = '420px';
            container.style.height = '500px';
            content.style.display = 'block';
            btn.textContent = '−';
        }
    }

    // ===== 工具函数 =====
    function simulateRealClick(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width/2;
        const y = rect.top + rect.height/2;

        const mouseOver = new MouseEvent('mouseover', { bubbles: true, clientX: x, clientY: y });
        const mouseDown = new MouseEvent('mousedown', { bubbles: true, clientX: x, clientY: y });
        const mouseUp = new MouseEvent('mouseup', { bubbles: true, clientX: x, clientY: y });
        const click = new MouseEvent('click', { bubbles: true, clientX: x, clientY: y });

        element.dispatchEvent(mouseOver);
        element.dispatchEvent(mouseDown);
        element.dispatchEvent(mouseUp);
        element.dispatchEvent(click);
    }

    async function clickAtPosition(x, y) {
    return new Promise(resolve => {
        // 先移动鼠标到指定位置
        const mouseMove = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
            screenX: x + window.screenX,
            screenY: y + window.screenY
        });

        document.dispatchEvent(mouseMove);

        // 等待一小段时间确保鼠标移动到位
        setTimeout(() => {
            const element = document.elementFromPoint(x, y);
            if (element) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: x,
                    clientY: y,
                    screenX: x + window.screenX,
                    screenY: y + window.screenY,
                    button: 0 // 左键
                });

                const mouseUp = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: x,
                    clientY: y,
                    screenX: x + window.screenX,
                    screenY: y + window.screenY,
                    button: 0 // 左键
                });

                const click = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: x,
                    clientY: y,
                    button: 0 // 左键
                });

                element.dispatchEvent(mouseDown);
                setTimeout(() => {
                    element.dispatchEvent(mouseUp);
                    element.dispatchEvent(click);
                    resolve(true);
                }, 50);
            } else {
                resolve(false);
            }
        }, 100); // 增加100ms延迟确保鼠标移动到位
    });
}

    function pressKey(key) {
        return new Promise(resolve => {
            if (config.shouldStop) return resolve();

            const code = key === "Shift" ? "ShiftLeft" : `Key${key.toUpperCase()}`;
            const keyCode = key === "Shift" ? 16 : key.toUpperCase().charCodeAt(0);

            const downEvent = new KeyboardEvent("keydown", {
                key, code, keyCode,
                bubbles: true,
                cancelable: true,
                composed: true
            });

            document.dispatchEvent(downEvent);

            setTimeout(() => {
                const upEvent = new KeyboardEvent("keyup", {
                    key, code, keyCode,
                    bubbles: true,
                    cancelable: true,
                    composed: true
                });
                document.dispatchEvent(upEvent);
                log(`⌨ 按键: ${key}`);
                resolve();
            }, 50);
        });
    }

    function holdKey(key, duration) {
        return new Promise(resolve => {
            if (config.shouldStop) return resolve();

            const code = key === "Shift" ? "ShiftLeft" : `Key${key.toUpperCase()}`;
            const keyCode = key === "Shift" ? 16 : key.toUpperCase().charCodeAt(0);

            const downEvent = new KeyboardEvent("keydown", {
                key, code, keyCode,
                bubbles: true,
                cancelable: true,
                composed: true
            });
            document.dispatchEvent(downEvent);
            log(`🔼 长按: ${key}`);

            setTimeout(() => {
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    key, code, keyCode,
                    bubbles: true,
                    cancelable: true,
                    composed: true
                }));
                log(`🔽 松开: ${key}`);
                resolve();
            }, duration);
        });
    }

    function delay(ms) {
        return new Promise(resolve => {
            if (config.shouldStop) return resolve();
            setTimeout(resolve, ms);
        });
    }

    function startPositionCapture(buttonIndex) {
        config.isCapturingPos = true;
        config.currentCaptureFor = buttonIndex;
        log(`🎯 开始捕捉坐标 (${config.buttonsToClick[buttonIndex].desc})`);
        log("👉 请点击目标位置...");
        document.body.style.cursor = "crosshair";
        iframe.style.pointerEvents = "none";
    }

    function handlePositionCapture(e) {
        if (!config.isCapturingPos) return;

        e.preventDefault();
        e.stopPropagation();

        const x = e.clientX;
        const y = e.clientY;
        const buttonIndex = config.currentCaptureFor;

        config.buttonsToClick[buttonIndex].x = x;
        config.buttonsToClick[buttonIndex].y = y;
        config.buttonsToClick[buttonIndex].customPos = true;

        if (iframe.contentDocument) {
            iframe.contentDocument.getElementById(`pos-x-${buttonIndex}`).value = x;
            iframe.contentDocument.getElementById(`pos-y-${buttonIndex}`).value = y;
            iframe.contentDocument.getElementById(`use-custom-${buttonIndex}`).checked = true;
        }

        log(`✔ 已记录坐标: [${x}, ${y}] (${config.buttonsToClick[buttonIndex].desc})`);
        endPositionCapture();
    }

    function endPositionCapture() {
        config.isCapturingPos = false;
        config.currentCaptureFor = null;
        document.body.style.cursor = "";
        iframe.style.pointerEvents = "auto";
    }

    // ===== 初始化 =====
    window.addEventListener('load', function() {
        // 创建水印和群链接
        const watermark = document.createElement('div');
        watermark.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 99998;
                opacity: 0.35;
                background-repeat: repeat;
                font-size: 50px;
                color: #ff0000;
                display: flex;
                align-items: center;
                justify-content: center;
                transform: rotate(-30deg);
            ">
                <div style="text-align:center;">
                    脚本辅助QQ群：${config.qqGroupNumber}
                    <br>${document.title}
                </div>
            </div>
        `;
        document.body.appendChild(watermark);

        const link = document.createElement('a');
        link.href = config.qqGroupLink;
        link.target = '_blank';
        link.textContent = '元梦之星农场交流群1';
        link.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background: #ff0000;
            color: white;
            font-weight: bold;
            border-radius: 5px;
            text-decoration: none;
            z-index: 99999;
            animation: blink 1s infinite alternate;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0% { background: #ff0000; }
                100% { background: #0000ff; }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(link);

        // 创建UI
        createUI();

        log("✅ 脚本已加载");
        log(`💬 交流群: ${config.qqGroupNumber}`);
        log("🔍 正在检测按钮...");

        config.buttonsToClick.forEach(btn => {
            if (!document.querySelector(btn.selector)) {
                log(`⚠️ 未找到: ${btn.desc} (${btn.selector})`);
            }
        });

        // 全局点击事件用于坐标捕捉
        document.addEventListener("click", function(e) {
            if (config.isCapturingPos) {
                handlePositionCapture(e);
            }
        });
    });
})();