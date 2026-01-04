// ==UserScript==
// @name         北航研究生抢课助手
// @namespace    https://www.wanghaiyang.site
// @version      1.1.0
// @description  北航研究生抢课助手 - 支持自动捕获课程信息
// @author       王海洋
// @match        https://yjsxk.buaa.edu.cn/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527663/%E5%8C%97%E8%88%AA%E7%A0%94%E7%A9%B6%E7%94%9F%E6%8A%A2%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/527663/%E5%8C%97%E8%88%AA%E7%A0%94%E7%A9%B6%E7%94%9F%E6%8A%A2%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建操作框样式
    const style = `
        .control-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            z-index: 10000;
            cursor: move;
            user-select: none;
            min-width: 300px;
        }
        .control-panel * {
            cursor: auto;
        }
        .control-panel input {
            margin: 5px 0;
            padding: 5px;
            width: 200px;
        }
        .control-panel button {
            margin: 10px 0;
            padding: 5px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .control-panel button:disabled {
            background: #cccccc;
        }
        .result-area {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            max-height: 150px;
            overflow-y: auto;
        }
        .capture-area {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            background: #f5f5f5;
        }
        .capture-area table {
            width: 100%;
            border-collapse: collapse;
        }
        .capture-area td {
            padding: 4px;
            border-bottom: 1px solid #eee;
        }
        .capture-area td:last-child {
            color: #1890ff;
            cursor: pointer;
            text-align: right;
            user-select: all;
        }
        .auto-fill-btn {
            background: #1890ff !important;
            margin-top: 5px !important;
            width: 100%;
        }
    `;



    // 创建样式元素
    const styleElement = document.createElement('style');
    styleElement.textContent = style;
    document.head.appendChild(styleElement);

    // 保存配置函数
    function saveConfig(kcdm, kclx, interval, refreshInterval, skfsdm, autoStart = false) {
        const config = {
            kcdm,
            kclx,
            interval,
            refreshInterval,
            skfsdm,
            autoStart,
            timestamp: Date.now()
        };
        localStorage.setItem('buaaCourseSniperConfig', JSON.stringify(config));
    }

    // 获取配置函数
    function getConfig() {
        const configStr = localStorage.getItem('buaaCourseSniperConfig');
        return configStr ? JSON.parse(configStr) : null;
    }

    // 添加拖拽功能
    function makeDraggable(panel) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        panel.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
                return;
            }
            
            isDragging = true;
            const style = window.getComputedStyle(panel);
            const matrix = new WebKitCSSMatrix(style.transform);
            
            initialX = e.clientX - (matrix.m41 || 0);
            initialY = e.clientY - (matrix.m42 || 0);
            
            panel.style.transition = 'none';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            e.preventDefault();

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            const panelRect = panel.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            if (currentX < 0) {
                currentX = 0;
            } else if (currentX + panelRect.width > viewportWidth) {
                currentX = viewportWidth - panelRect.width;
            }

            if (currentY < 0) {
                currentY = 0;
            } else if (currentY + panelRect.height > viewportHeight) {
                currentY = viewportHeight - panelRect.height;
            }

            panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
        });

        document.addEventListener('mouseup', function() {
            if (!isDragging) return;
            
            isDragging = false;
            panel.style.transition = 'transform 0.2s';
            
            localStorage.setItem('panelPosition', JSON.stringify({x: currentX, y: currentY}));
        });
    }
    // 添加请求拦截器
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalSend = xhr.send;

        xhr.send = function(body) {
            try {
                if (body) {
                    const params = new URLSearchParams(body);
                    const bjdm = params.get('bjdm');
                    const lx = params.get('lx');
                    const skfsdm = params.get('skfsdm');
                    if (bjdm && lx && skfsdm) {
                        const time = new Date().toLocaleTimeString();
                        document.getElementById('timeValue').textContent = time;
                        document.getElementById('bjdmValue').textContent = bjdm;
                        document.getElementById('lxValue').textContent = lx;
                        document.getElementById('skfsdmValue').textContent = skfsdm;
                        console.log("fetch 解析成功");
                        
                    }
                }
            } catch (error) {
                console.error('解析请求参数时出错:', error);
            }
            
            return originalSend.apply(this, arguments);
        };

        return xhr;
    };

    // 添加fetch拦截器
    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
        if (options && options.body) {
            try {
                const params = new URLSearchParams(options.body);
                const bjdm = params.get('bjdm');
                const lx = params.get('lx');
                const skfsdm = params.get('skfsdm');
                if (bjdm && lx && skfsdm) {
                    const time = new Date().toLocaleTimeString();
                    document.getElementById('timeValue').textContent = time;
                    document.getElementById('bjdmValue').textContent = bjdm;
                    document.getElementById('lxValue').textContent = lx;
                    document.getElementById('skfsdmValue').textContent = skfsdm;
                    console.log("fetch 解析成功");
                }
            } catch (error) {
                console.error('解析fetch请求参数时出错:', error);
            }
        }
        
        return originalFetch.apply(this, arguments);
    };
    // 发送请求函数
    function sendRequest(kcdm, kclx, skfsdm) {
        try {
            const csrfToken = document.querySelector('#csrfToken');
            if (!csrfToken) {
                console.error('未找到csrfToken');
                return;
            }

            const data = {
                bjdm: kcdm,
                lx: kclx,
                csrfToken: csrfToken.value,
                skfsdm: skfsdm
            };
            
            const urlEncodedData = new URLSearchParams(data).toString();
            const url = 'https://yjsxk.buaa.edu.cn/yjsxkapp/sys/xsxkappbuaa/xsxkCourse/choiceCourse.do?_=' + String(Date.now());

            originalFetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: urlEncodedData,
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                const resultArea = document.getElementById('resultArea');
                const time = new Date().toLocaleTimeString();
                if (data.code == 1) {
                    resultArea.innerHTML = `${time}: 抢课成功<br>` + resultArea.innerHTML;
                    // 抢课成功后，停止抢课
                    stopSniper();
                } else {
                    resultArea.innerHTML = `${time}: ${JSON.stringify(data)}<br>` + resultArea.innerHTML;
                }
            })
            .catch(error => {
                console.error('请求失败:', error);
                const resultArea = document.getElementById('resultArea');
                const time = new Date().toLocaleTimeString();
                resultArea.innerHTML = `${time}: 错误: ${error}<br>` + resultArea.innerHTML;
            });
        } catch (error) {
            console.error('请求发送失败:', error);
        }
    }

    // 声明全局变量
    let intervalId = null;
    let refreshTimeout = null;

    // 开始抢课函数
    function startSniper(kcdm, kclx, interval, refreshInterval, skfsdm) {
        try {
            const csrfToken = document.querySelector('#csrfToken');
            if (!csrfToken) {
                console.error('未找到csrfToken，等待1秒后重试');
                setTimeout(() => startSniper(kcdm, kclx, interval, refreshInterval, skfsdm), 1000);
                return;
            }

            saveConfig(kcdm, kclx, interval, refreshInterval, skfsdm, true);

            const startBtn = document.getElementById('startBtn');
            const stopBtn = document.getElementById('stopBtn');
            if (startBtn && stopBtn) {
                startBtn.disabled = true;
                stopBtn.disabled = false;
            }

            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            if (refreshTimeout) {
                clearTimeout(refreshTimeout);
                refreshTimeout = null;
            }

            intervalId = setInterval(() => sendRequest(kcdm, kclx, skfsdm), interval);

            refreshTimeout = setTimeout(() => {
                saveConfig(kcdm, kclx, interval, refreshInterval, skfsdm, true);
                window.location.reload();
            }, refreshInterval * 1000);

        } catch (error) {
            console.error('启动失败:', error);
            setTimeout(() => startSniper(kcdm, kclx, interval, refreshInterval, skfsdm), 1000);
        }
    }

    // 停止抢课函数
    function stopSniper() {
        try {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }

            if (refreshTimeout) {
                clearTimeout(refreshTimeout);
                refreshTimeout = null;
            }

            const config = getConfig();
            if (config) {
                saveConfig(config.kcdm, config.kclx, config.interval, config.refreshInterval, config.skfsdm, false);
            }

            const startBtn = document.getElementById('startBtn');
            const stopBtn = document.getElementById('stopBtn');
            if (startBtn && stopBtn) {
                startBtn.disabled = false;
                stopBtn.disabled = true;
            }

            const resultArea = document.getElementById('resultArea');
            const time = new Date().toLocaleTimeString();
            resultArea.innerHTML = `${time}: 已停止抢课<br>` + resultArea.innerHTML;
        } catch (error) {
            console.error('停止失败:', error);
        }
    }

    // 初始化面板函数
    function initializePanel() {
        const config = getConfig();
        if (config) {
            const kcdmInput = document.getElementById('kcdm');
            const kclxInput = document.getElementById('kclx');
            const skfsdmInput = document.getElementById('skfsdm');
            const intervalInput = document.getElementById('interval');
            const refreshIntervalInput = document.getElementById('refreshInterval');

            if (kcdmInput && kclxInput && skfsdmInput && intervalInput && refreshIntervalInput) {
                kcdmInput.value = config.kcdm;
                kclxInput.value = config.kclx;
                skfsdmInput.value = config.skfsdm;
                intervalInput.value = config.interval;
                refreshIntervalInput.value = config.refreshInterval || 60;

                if (config.autoStart) {
                    setTimeout(() => {
                        startSniper(config.kcdm, config.kclx, config.interval, config.refreshInterval);
                    }, 1000);
                }
            }
        }
    }

    // 创建面板函数
    function createAndInitPanel() {
        if (document.querySelector('.control-panel')) {
            return;
        }

        const panel = document.createElement('div');
        panel.className = 'control-panel';
        panel.innerHTML = `
            <h3>捡漏抢课助手(抢别人退掉的课)</h3>
            <p>
                记得感谢<a href="https://www.wanghaiyang.site">王海洋学长</a>。
            </p>
            <div class="capture-area">
                <div>最近捕获的课程信息(手动选课即可捕获信息)：</div>
                <table>
                    <tr>
                        <td>捕获时间：</td>
                        <td id="timeValue">-</td>
                    </tr>
                    <tr>
                        <td>课程名称：</td>
                        <td id="NameValue">-</td>
                    </tr>
                    <tr>
                        <td>课程代码：</td>
                        <td id="bjdmValue">-</td>
                    </tr>
                    <tr>
                        <td>类型：</td>
                        <td id="lxValue">-</td>
                    </tr>
                    <tr>
                        <td>授课方式：</td>
                        <td id="skfsdmValue">-</td>
                    </tr>
                </table>
                <button class="auto-fill-btn" id="autoFillBtn">使用捕获的信息</button>
            </div>
            <div>
                <label>课程名称：</label><br>
                <input type="text" id="kcmc" placeholder="请输入课程名称" style="width: 300px"><br>
                <label>课程代码：</label><br>
                <input type="text" id="kcdm" placeholder="请输入课程代码" style="width: 300px"><br>
                <label>类型：</label><br>
                <input type="text" id="kclx" placeholder="请输入类型" style="width: 300px"><br>
                <label>授课方式：</label><br>
                <input type="text" id="skfsdm" placeholder="01:线上;02:线下" style="width: 300px"><br>
                <label>请求间隔(ms)：</label><br>
                <input type="number" id="interval" value="500" min="100" style="width: 300px"><br>
                <label>页面刷新间隔(秒)：</label><br>
                <input type="number" id="refreshInterval" value="60" min="10"><br>
                <button id="startBtn">开始抢课</button>
                <button id="stopBtn" disabled>停止抢课</button>
            </div>
            <div class="result-area" id="resultArea">
                等待开始...
            </div>
        `;
        document.body.appendChild(panel);

        // 添加自动填充按钮事件
        document.getElementById('autoFillBtn').addEventListener('click', () => {
            const bjdm = document.getElementById('bjdmValue').textContent;
            const lx = document.getElementById('lxValue').textContent;
            const skfsdm = document.getElementById('skfsdmValue').textContent;
            const name = document.getElementById('NameValue').textContent;
            if (bjdm !== '-' && lx !== '-' && skfsdm !== '-' && name !== '-') {
                document.getElementById('kcdm').value = bjdm;
                document.getElementById('kclx').value = lx;
                document.getElementById('kcmc').value = name;
                document.getElementById('skfsdm').value = skfsdm;
            }
            else {
                alert('请先捕获完整课程信息！点击选课，并且确认，即可捕获完整的课程信息。');
            }
        });

        // 绑定开始和停止按钮事件
        document.getElementById('startBtn').addEventListener('click', () => {
            const kcdm = document.getElementById('kcdm').value;
            const kclx = document.getElementById('kclx').value;
            const skfsdm = document.getElementById('skfsdm').value;
            const interval = parseInt(document.getElementById('interval').value);
            const refreshInterval = parseInt(document.getElementById('refreshInterval').value);

            if (!kcdm || !kclx || !skfsdm) {
                alert('请填写完整信息！');
                return;
            }

            if (refreshInterval < 10) {
                alert('刷新间隔不能小于10秒！');
                return;
            }

            startSniper(kcdm, kclx, interval, refreshInterval , skfsdm);
        });

        document.getElementById('stopBtn').addEventListener('click', stopSniper);

        // 应用拖拽功能
        makeDraggable(panel);

        // 恢复上次保存的位置
        const savedPosition = localStorage.getItem('panelPosition');
        if (savedPosition) {
            const position = JSON.parse(savedPosition);
            panel.style.transform = `translate(${position.x}px, ${position.y}px)`;
        }

        // 初始化面板配置
        initializePanel();
    }


    // 添加点击事件监听器，获取课程名称
    document.addEventListener('click', function(event) {
        // 检查点击的元素是否是<a>标签
        let clickedElement = event.target.closest('a');
        
        if (clickedElement) {
            // 获取<a>标签的所有信息
            // "<a role="xk" href="javascript:void(0);" class="zeromodal-btn zeromodal-btn-primary xkbtn" role-dxzwid="" role-kzwid="" role-kcms="D061041011-机器学习（01）" role-val="20242-010600-D061041011-1735543436340">选课</a>"
            // 获取其 role-kcms 与 role-val
            const roleKcms = clickedElement.getAttribute('role-kcms') || '无课程信息';
            const roleVal = clickedElement.getAttribute('role-val') || '无选课值';
            const rolelx = clickedElement.getAttribute('role') || null;

            if (rolelx) {
                console.log('课程信息:', roleKcms);
                console.log('选课值:', roleVal);
                document.getElementById('NameValue').textContent = roleKcms;
                document.getElementById('bjdmValue').textContent = roleVal;
            }
        }
    });

    // 在页面关闭或刷新前停止抢课
    window.addEventListener('beforeunload', function() {
        // 注释掉以允许自动重启
        // if (intervalId || refreshTimeout) {
        //     stopSniper();
        // }
    });

    // 确保在DOM加载完成后创建面板
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createAndInitPanel);
    } else {
        createAndInitPanel();
    }
})(); 