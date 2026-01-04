// ==UserScript==
// @name         新盟网页助手
// @name:en      XinMeng Web Assistant
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  新盟网页助手 - 视频播放速度控制、视频下载、解除复制限制等功能
// @description:en  XinMeng Web Assistant - Video speed control, video download, and copy restriction removal
// @author       fengliunian
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_download
// @connect      *
// @homepage     https://github.com/fengliunian/xinmeng-Web-Assistant
// @supportURL   https://github.com/fengliunian/xinmeng-Web-Assistant/issues
// @downloadURL https://update.greasyfork.org/scripts/521364/%E6%96%B0%E7%9B%9F%E7%BD%91%E9%A1%B5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/521364/%E6%96%B0%E7%9B%9F%E7%BD%91%E9%A1%B5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义默认快捷键
    const DEFAULT_HOTKEYS = {
        inputText: { key: 'm', ctrl: true, shift: false, alt: true },
    };

    // 清除之前的设置并使用新的默认值
    localStorage.removeItem('videoSpeedHotkeys');
    let hotkeys = DEFAULT_HOTKEYS;

    // 创建一个全局变量来存储按钮引用
    let inputTextButton = null;

    // 添加全局快捷键监听
    document.addEventListener('keydown', function(e) {
        // 如果焦点在设置窗口的输入框，不触发快捷键
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const currentHotkey = hotkeys.inputText;
        if (e.ctrlKey === currentHotkey.ctrl &&
            e.shiftKey === currentHotkey.shift &&
            e.altKey === currentHotkey.alt &&
            e.key.toLowerCase() === currentHotkey.key) {
            e.preventDefault();
            // 使用全局变量引用按钮
            if (inputTextButton) {
                inputTextButton.click();
                console.log('Triggered input text button');
            } else {
                console.log('Button not found');
            }
        }
    });

    // 在创建输入文字按钮的地修改代码
    const disablePasteButton = document.createElement('button');
    disablePasteButton.id = 'input-text-button';
    disablePasteButton.textContent = '输入文字';
    disablePasteButton.style.cssText = `
        flex: 1;
        padding: 6px;
        border: none;
        border-radius: 4px;
        background: #9C27B0;
        color: white;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s;
    `;

    // 保存按钮引用到全局变量
    inputTextButton = disablePasteButton;

    // 创建速度显示器
    const speedDisplay = document.createElement('div');
    speedDisplay.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 9999;
        display: none;
        font-family: Arial, sans-serif;
    `;
    document.body.appendChild(speedDisplay);

    // 显示速度的函数
    function showSpeed(speed) {
        speedDisplay.textContent = `速度: ${speed.toFixed(2)}x`;
        speedDisplay.style.display = 'block';
        setTimeout(() => {
            speedDisplay.style.display = 'none';
        }, 1000);
    }

    // 更改视频速度的函数
    function changeVideoSpeed(delta) {
        const videos = document.getElementsByTagName('video');
        for (const video of videos) {
            let newSpeed = video.playbackRate + delta;
            // 限制速度范围在0.1到16之间
            newSpeed = Math.max(0.1, Math.min(16, newSpeed));
            video.playbackRate = newSpeed;
            showSpeed(newSpeed);
        }
    }

    // 监听键盘事
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.key) {
            case '[': // 减速
                changeVideoSpeed(-0.25);
                break;
            case ']': // 加速
                changeVideoSpeed(0.25);
                break;
            case '\\': // 重置速度
                const videos = document.getElementsByTagName('video');
                for (const video of videos) {
                    video.playbackRate = 1.0;
                    showSpeed(1.0);
                }
                break;
        }
    });

    // 监听新加载的视频
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeName === 'VIDEO') {
                    // 新视频添加速度控制功能
                    node.addEventListener('ratechange', function() {
                        showSpeed(this.playbackRate);
                    });
                }
            });
        });
    });

    // 启动观察器
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 修改面板创建和检查的逻辑
    const PANEL_ID = 'video-speed-controller-panel';

    // 将面板创建逻辑包装在一个函数中
    function createControlPanel() {
        // 移除所有已存在的控制面板（确保只有一个）
        function removeExistingPanels() {
            const existingPanels = document.querySelectorAll(`#${PANEL_ID}`);
            existingPanels.forEach(panel => panel.remove());
        }

        // 在创建新面板前先移除已存在的面板
        removeExistingPanels();

        // 修改控制面板的初始状态和样式
        const controlPanel = document.createElement('div');
        controlPanel.id = PANEL_ID;
        controlPanel.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 10px;
            border-radius: 8px;
            z-index: 2147483647;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            gap: 6px;
            transform: translateY(-50%);
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            min-width: 120px;
            user-select: none;
            -webkit-user-select: none;
            transition: all 0.3s ease;
        `;

        // 创建一个迷你版的控制按钮
        const miniButton = document.createElement('button');
        miniButton.textContent = '⚙️';
        miniButton.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 2147483647;
            transform: translateY(-50%);
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;

        // 默认隐藏控制面板，显示迷你按钮
        controlPanel.style.display = 'none';
        document.body.appendChild(miniButton);

        // 添加迷你按钮的悬停效果
        miniButton.addEventListener('mouseover', () => {
            miniButton.style.background = 'rgba(0, 0, 0, 0.9)';
            miniButton.style.transform = 'translateY(-50%) scale(1.1)';
        });

        miniButton.addEventListener('mouseout', () => {
            miniButton.style.background = 'rgba(0, 0, 0, 0.8)';
            miniButton.style.transform = 'translateY(-50%) scale(1)';
        });

        // 点击迷你按钮显示/隐藏控制面板
        let isPanelVisible = false;
        miniButton.addEventListener('click', () => {
            isPanelVisible = !isPanelVisible;
            controlPanel.style.display = isPanelVisible ? 'flex' : 'none';
            miniButton.style.display = isPanelVisible ? 'none' : 'flex';
        });

        // 修改按钮样式，使其更紧凑
        const buttonStyle = `
            padding: 4px 8px;
            font-size: 12px;
        `;

        // 修改所有按钮的尺寸
        controlPanel.querySelectorAll('button').forEach(button => {
            button.style.cssText += buttonStyle;
        });

        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: transparent;
            border: none;
            color: rgba(255,255,255,0.6);
            cursor: pointer;
            font-size: 14px;
            padding: 2px 6px;
            border-radius: 4px;
        `;

        closeButton.addEventListener('click', () => {
            controlPanel.style.display = 'none';
            miniButton.style.display = 'flex';
            isPanelVisible = false;
        });

        controlPanel.appendChild(closeButton);

        // 将面板添加到页面
        document.body.appendChild(controlPanel);

        // 创建速度控制组件
        const speedControl = document.createElement('div');
        speedControl.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        `;

        // 减速按钮
        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.style.cssText = `
            width: 30px;
            height: 30px;
            border: none;
            border-radius: 4px;
            background: #4CAF50;
            color: white;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        `;

        // 速度显示
        const speedDisplay = document.createElement('div');
        speedDisplay.style.cssText = `
            font-size: 16px;
            font-weight: bold;
            min-width: 60px;
            text-align: center;
        `;
        speedDisplay.textContent = '1.0x';

        // 加速按钮
        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.style.cssText = decreaseButton.style.cssText;

        // 添加事件监听
        let currentSpeed = 1.0;
        const speedStep = 0.25;
        const minSpeed = 0.25;
        const maxSpeed = 16;

        decreaseButton.addEventListener('click', () => {
            currentSpeed = Math.max(minSpeed, currentSpeed - speedStep);
            updateSpeed(currentSpeed);
        });

        increaseButton.addEventListener('click', () => {
            currentSpeed = Math.min(maxSpeed, currentSpeed + speedStep);
            updateSpeed(currentSpeed);
        });

        // 重置按钮
        const resetButton = document.createElement('button');
        resetButton.textContent = '重置';
        resetButton.style.cssText = `
            width: 100%;
            padding: 6px;
            border: none;
            border-radius: 4px;
            background: #2196F3;
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        `;

        resetButton.addEventListener('click', () => {
            currentSpeed = 1.0;
            updateSpeed(currentSpeed);
        });

        // 更新速度的函数
        function updateSpeed(speed) {
            speedDisplay.textContent = `${speed.toFixed(1)}x`;
            const videos = document.getElementsByTagName('video');
            for (const video of videos) {
                video.playbackRate = speed;
            }
        }

        //
        speedControl.appendChild(decreaseButton);
        speedControl.appendChild(speedDisplay);
        speedControl.appendChild(increaseButton);

        controlPanel.appendChild(speedControl);
        controlPanel.appendChild(resetButton);

        // 加分隔线
        const separator = document.createElement('div');
        separator.style.cssText = `
            height: 1px;
            background: rgba(255,255,255,0.2);
            margin: 4px 0;
        `;
        controlPanel.appendChild(separator);

        // 下载按钮
        const downloadButton = document.createElement('button');
        downloadButton.textContent = '下载视频';
        downloadButton.style.cssText = `
            width: 100%;
            padding: 6px;
            border: none;
            border-radius: 4px;
            background: #FF5722;
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        `;
        controlPanel.appendChild(downloadButton);

        // 在创建下载按钮后添加点击事件
        downloadButton.addEventListener('click', () => {
            const videos = document.getElementsByTagName('video');
            if (videos.length === 0) {
                alert('未找到可下载的视频！');
                return;
            }

            // 创建选择菜单
            const selectMenu = document.createElement('div');
            selectMenu.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
                z-index: 999999;
                color: black;
            `;

            const title = document.createElement('h3');
            title.textContent = '请选择下载方式：';
            title.style.marginBottom = '15px';
            selectMenu.appendChild(title);

            // 创建按容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.justifyContent = 'center';

            // 直接下载按钮
            const directDownloadBtn = document.createElement('button');
            directDownloadBtn.textContent = '直接下载';
            directDownloadBtn.style.cssText = `
                padding: 8px 15px;
                border: none;
                border-radius: 4px;
                background: #4CAF50;
                color: white;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.3s;
            `;
            directDownloadBtn.addEventListener('mouseover', () => directDownloadBtn.style.background = '#45a049');
            directDownloadBtn.addEventListener('mouseout', () => directDownloadBtn.style.background = '#4CAF50');
            directDownloadBtn.addEventListener('click', () => {
                document.body.removeChild(selectMenu);
                if (videos.length > 1) {
                    showVideoSelection(videos);
                } else {
                    downloadVideo(videos[0]);
                }
            });

            // 录制下载按钮
            const recordDownloadBtn = document.createElement('button');
            recordDownloadBtn.textContent = '录制下载';
            recordDownloadBtn.style.cssText = `
                padding: 8px 15px;
                border: none;
                border-radius: 4px;
                background: #FF5722;
                color: white;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.3s;
            `;
            recordDownloadBtn.addEventListener('mouseover', () => recordDownloadBtn.style.background = '#F4511E');
            recordDownloadBtn.addEventListener('mouseout', () => recordDownloadBtn.style.background = '#FF5722');
            recordDownloadBtn.addEventListener('click', () => {
                document.body.removeChild(selectMenu);
                if (videos.length > 1) {
                    showVideoSelectionForRecording(videos);
                } else {
                    startRecording(videos[0]);
                }
            });

            buttonContainer.appendChild(directDownloadBtn);
            buttonContainer.appendChild(recordDownloadBtn);
            selectMenu.appendChild(buttonContainer);
            document.body.appendChild(selectMenu);

            // 添加拖动功能
            makeElementDraggable(selectMenu);
        });

        // 修改下载视频的函数
        function downloadVideo(video) {
            // 创建下载提示
            const downloadTip = createDownloadTip();
            downloadTip.textContent = '正在准备下载...';

            try {
                // 获取视频源的多种方式
                let videoUrl = '';

                // 方法1: 直接获取src
                videoUrl = video.currentSrc || video.src;

                // 方法2: 尝试获取source标签
                if (!videoUrl) {
                    const sources = video.getElementsByTagName('source');
                    if (sources.length > 0) {
                        videoUrl = sources[0].src;
                    }
                }

                // 方法3: 尝试从video标签的dataset中获取
                if (!videoUrl && video.dataset.src) {
                    videoUrl = video.dataset.src;
                }

                // 如果找不到视频源或是blob URL，提示使用录制方式
                if (!videoUrl || videoUrl.startsWith('blob:')) {
                    downloadTip.textContent = '无法直接下载视频，请使用录制方式！';
                    downloadTip.style.background = 'rgba(255, 0, 0, 0.8)';
                    setTimeout(() => document.body.removeChild(downloadTip), 3000);
                    return;
                }

                // 使用 GM_download 进行下载
                GM_download({
                    url: videoUrl,
                    name: `video_${new Date().getTime()}.mp4`,
                    headers: {
                        'Referer': window.location.href,
                        'Origin': window.location.origin,
                        'User-Agent': navigator.userAgent
                    },
                    onload: function() {
                        downloadTip.textContent = '下载已开始！';
                        setTimeout(() => document.body.removeChild(downloadTip), 2000);
                    },
                    onerror: function(error) {
                        console.error('Download failed:', error);
                        // 如果GM_download失败，尝试使用fetch方法
                        fallbackDownload(videoUrl, downloadTip);
                    }
                });

            } catch (error) {
                console.error('Download error:', error);
                // 如果主下载方法失败，尝试备用下载方法
                fallbackDownload(videoUrl, downloadTip);
            }
        }

        // 添加备用下载方法
        function fallbackDownload(videoUrl, downloadTip) {
            fetch(videoUrl, {
                method: 'GET',
                headers: {
                    'Referer': window.location.href,
                    'Origin': window.location.origin,
                    'Range': 'bytes=0-'
                },
                mode: 'cors',
                credentials: 'include'
            })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `video_${new Date().getTime()}.mp4`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                downloadTip.textContent = '下载已开始！';
                setTimeout(() => document.body.removeChild(downloadTip), 2000);
            })
            .catch(error => {
                console.error('Fallback download failed:', error);
                downloadTip.textContent = '下载失败，请尝试使用录制方式';
                downloadTip.style.background = 'rgba(255, 0, 0, 0.8)';
                setTimeout(() => document.body.removeChild(downloadTip), 3000);
            });
        }

        // 创建下载提示的辅助函数
        function createDownloadTip() {
            const downloadTip = document.createElement('div');
            downloadTip.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 999999;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(downloadTip);
            return downloadTip;
        }

        // 添加拖动功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        controlPanel.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target === controlPanel) {
                isDragging = true;
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, controlPanel);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate(${xPos}px, ${yPos}px)`;
        }

        function dragEnd() {
            isDragging = false;
        }

        // 添加一个拖动提示
        controlPanel.title = '按住空白处拖动位置';

        // 在添加下载按钮后，添加另一个分隔线解除粘贴限制按钮
        const separator2 = document.createElement('div');
        separator2.style.cssText = `
            height: 1px;
            background: rgba(255,255,255,0.2);
            margin: 4px 0;
        `;
        controlPanel.appendChild(separator2);

        // 创建一个容器来放置两个按钮
        const pasteControlContainer = document.createElement('div');
        pasteControlContainer.style.cssText = `
            display: flex;
            gap: 5px;
            width: 100%;
        `;

        // 创建解除限制按钮
        const pasteButton = document.createElement('button');
        pasteButton.textContent = '限制已解除';
        pasteButton.style.cssText = `
            width: 100%;
            padding: 6px;
            border: none;
            border-radius: 4px;
            background: #4CAF50;
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        `;

        // 添加点击事件
        pasteButton.addEventListener('click', () => {
            removeCopyLimits();
            showMessage('已解除输入限制！', 'success');
        });

        // 解除复制粘贴限制的核心函数
        function removeCopyLimits() {
            try {
                // 移除基本限
                document.body.removeAttribute("onselectstart");
                document.documentElement.style.userSelect = "unset";

                // 移除编辑器限制
                if (window.UE && window.UE.instants && typeof window.UE.instants === "object") {
                    for (const [key, instance] of Object.entries(window.UE.instants)) {
                        try {
                            if (instance.options) {
                                instance.options.disablePasteImage = false;
                            }
                            if (instance.removeListener) {
                                instance.removeListener("beforepaste", window.editorPaste);
                            }
                        } catch (error) {
                            console.error("[Input Helper] Failed to remove copy limits from editor instance", key, error);
                        }
                    }
                }

                // 移除调试器限制
                const constructorHook = Function.prototype.constructor;
                Function.prototype.constructor = (s) => {
                    if (s === "debugger") {
                        return () => {};
                    }
                    return constructorHook(s);
                };

                // 添加全样式
                const style = document.createElement('style');
                style.textContent = `
                    * {
                        user-select: text !important;
                        -webkit-user-select: text !important;
                        -moz-user-select: text !important;
                        -ms-user-select: text !important;
                    }
                `;
                document.head.appendChild(style);

                console.info("[Input Helper] Successfully removed copy limits.");
            } catch (error) {
                console.error("[Input Helper] Failed to remove copy limits:", error);
            }
        }

        // 在页面加载完成后自动执行一次
        setTimeout(removeCopyLimits, 1000);

        // 将按钮添加到控制面板
        pasteControlContainer.appendChild(pasteButton);

        // 将容器添加到控制面板
        controlPanel.appendChild(pasteControlContainer);

        // 添加分隔线
        const separator3 = document.createElement('div');
        separator3.style.cssText = `
            height: 1px;
            background: rgba(255,255,255,0.2);
            margin: 4px 0;
        `;
        controlPanel.appendChild(separator3);

        // 换原来的快捷键设置钮为更新检查按钮
        const updateButton = document.createElement('button');
        updateButton.textContent = '检查更新';
        updateButton.style.cssText = `
            width: 100%;
            padding: 6px;
            border: none;
            border-radius: 4px;
            background: #2196F3;
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        `;

        // 添加更新图标
        const updateIcon = document.createElement('span');
        updateIcon.innerHTML = '↻';
        updateIcon.style.cssText = `
            display: inline-block;
            transition: transform 0.3s ease;
        `;
        updateButton.prepend(updateIcon);

        // 添加悬停效果
        updateButton.addEventListener('mouseover', () => {
            updateButton.style.background = '#1976D2';
            updateIcon.style.transform = 'rotate(180deg)';
        });
        updateButton.addEventListener('mouseout', () => {
            updateButton.style.background = '#2196F3';
            updateIcon.style.transform = 'rotate(0)';
        });

        // 添加点击事件
        updateButton.addEventListener('click', () => {
            // 添加旋转动画
            updateIcon.style.animation = 'checking 1s linear infinite';

            // 跳转到更新页面
            window.open('http://113.44.209.113:9002/', '_blank');

            // 移除动画
            setTimeout(() => {
                updateIcon.style.animation = 'none';
            }, 1000);
        });

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes checking {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // 将更新按钮添加到控制面板
        controlPanel.appendChild(updateButton);

        // 更新按钮提示文本
        disablePasteButton.title = `快捷键：${formatHotkey(hotkeys.inputText)}`;

        // 添加辅助函数到作用域
        function formatHotkey(hotkey) {
            const parts = [];
            if (hotkey.ctrl) parts.push('Ctrl');
            if (hotkey.shift) parts.push('Shift');
            if (hotkey.alt) parts.push('Alt');
            parts.push(hotkey.key.toUpperCase());
            return parts.join(' + ');
        }

        function showTip(message) {
            const tip = document.createElement('div');
            tip.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 999999;
            `;
            tip.textContent = message;
            document.body.appendChild(tip);
            setTimeout(() => {
                document.body.removeChild(tip);
            }, 2000);
        }

        function createSettingsWindow() {
            const settingsWindow = document.createElement('div');
            settingsWindow.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
                z-index: 999999;
                min-width: 300px;
                color: black;
            `;

            const title = document.createElement('h3');
            title.textContent = '快捷键设置';
            title.style.marginBottom = '15px';
            settingsWindow.appendChild(title);

            // 创建快捷键输入区域
            const hotkeyInput = document.createElement('input');
            hotkeyInput.type = 'text';
            hotkeyInput.readOnly = true;
            hotkeyInput.value = formatHotkey(hotkeys.inputText);
            hotkeyInput.style.cssText = `
                width: 100%;
                padding: 8px;
                margin: 10px 0;
                border: 1px solid #ccc;
                border-radius: 4px;
            `;

            const label = document.createElement('div');
            label.textContent = '输入文字快捷键:';
            label.style.color = '#333';
            settingsWindow.appendChild(label);
            settingsWindow.appendChild(hotkeyInput);

            // 添加提示文本
            const tip = document.createElement('div');
            tip.textContent = '点击输入框并按下新的快捷键组合';
            tip.style.cssText = `
                font-size: 12px;
                color: #666;
                margin: 5px 0 15px 0;
            `;
            settingsWindow.appendChild(tip);

            // 添加按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                gap: 10px;
                margin-top: 20px;
            `;

            // 保存按钮
            const saveButton = document.createElement('button');
            saveButton.textContent = '保存';
            saveButton.style.cssText = `
                flex: 1;
                padding: 8px;
                border: none;
                border-radius: 4px;
                background: #4CAF50;
                color: white;
                cursor: pointer;
            `;

            // 取消按钮
            const cancelButton = document.createElement('button');
            cancelButton.textContent = '取消';
            cancelButton.style.cssText = `
                flex: 1;
                padding: 8px;
                border: none;
                border-radius: 4px;
                background: #f44336;
                color: white;
                cursor: pointer;
            `;

            // 添加快捷键监听
            hotkeyInput.addEventListener('keydown', (e) => {
                e.preventDefault();
                const newHotkey = {
                    key: e.key.toLowerCase(),
                    ctrl: e.ctrlKey,
                    shift: e.shiftKey,
                    alt: e.altKey
                };
                hotkeys.inputText = newHotkey;
                hotkeyInput.value = formatHotkey(newHotkey);
            });

            // 添加按钮事件
            saveButton.addEventListener('click', () => {
                localStorage.setItem('videoSpeedHotkeys', JSON.stringify(hotkeys));
                disablePasteButton.title = `快捷键：${formatHotkey(hotkeys.inputText)}`;
                document.body.removeChild(settingsWindow);
                showTip('快捷键设置已保存！');
            });

            cancelButton.addEventListener('click', () => {
                document.body.removeChild(settingsWindow);
            });

            buttonContainer.appendChild(saveButton);
            buttonContainer.appendChild(cancelButton);
            settingsWindow.appendChild(buttonContainer);

            // 添加拖动功能
            makeElementDraggable(settingsWindow);

            document.body.appendChild(settingsWindow);
        }

        // 在添加更新按钮后，添加版本显示
        const versionInfo = document.createElement('div');
        versionInfo.style.cssText = `
            text-align: center;
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
            margin-top: 8px;
            padding: 4px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.1);
        `;
        versionInfo.textContent = 'v1.0.0';  // 使用脚本的当前版本

        // 将版本信息添加到控制面板
        controlPanel.appendChild(versionInfo);

        // 为版本信息添加悬停效果
        versionInfo.addEventListener('mouseover', () => {
            versionInfo.style.background = 'rgba(255, 255, 255, 0.15)';
        });
        versionInfo.addEventListener('mouseout', () => {
            versionInfo.style.background = 'rgba(255, 255, 255, 0.1)';
        });

        function startRecording(video) {
            try {
                const stream = video.captureStream();
                const mediaRecorder = new MediaRecorder(stream, {
                    mimeType: 'video/webm;codecs=h264,opus', // 使用H264编码
                    videoBitsPerSecond: 2500000, // 2.5Mbps视频比特率
                    audioBitsPerSecond: 128000   // 128kbps音频比特率
                });
                const chunks = [];

                // 创建录制控制界面
                const recordControl = document.createElement('div');
                recordControl.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.3);
                    z-index: 999999;
                    color: black;
                    text-align: center;
                `;

                // 添加进度条
                const progress = document.createElement('div');
                progress.style.cssText = `
                    width: 300px;
                    height: 20px;
                    background: #f0f0f0;
                    border-radius: 10px;
                    margin: 10px 0;
                    overflow: hidden;
                `;

                const progressBar = document.createElement('div');
                progressBar.style.cssText = `
                    width: 0%;
                    height: 100%;
                    background: #4CAF50;
                    transition: width 1s linear;
                `;
                progress.appendChild(progressBar);

                // 添加时显示
                const timeDisplay = document.createElement('div');
                timeDisplay.style.marginBottom = '10px';

                // 添加控制按钮
                const controlButtons = document.createElement('div');
                controlButtons.style.marginTop = '10px';

                const stopButton = document.createElement('button');
                stopButton.textContent = '停止录制';
                stopButton.style.cssText = `
                    padding: 5px 15px;
                    margin: 0 5px;
                    border: none;
                    border-radius: 3px;
                    background: #f44336;
                    color: white;
                    cursor: pointer;
                `;

                recordControl.appendChild(timeDisplay);
                recordControl.appendChild(progress);
                recordControl.appendChild(controlButtons);
                controlButtons.appendChild(stopButton);

                document.body.appendChild(recordControl);

                // 开始录制
                let startTime = Date.now();
                let duration = 0;
                mediaRecorder.start(1000); // 每秒保存一次数据

                // 更新进度的函数
                const updateProgress = () => {
                    if (mediaRecorder.state === 'recording') {
                        duration = Math.floor((Date.now() - startTime) / 1000);
                        timeDisplay.textContent = `录制 ${duration} 秒`;
                        progressBar.style.width = `${Math.min((duration / 300) * 100, 100)}%`;

                        if (duration >= 300) {
                            mediaRecorder.stop();
                            return;
                        }

                        requestAnimationFrame(updateProgress);
                    }
                };

                updateProgress();

                // 修改处理录制数据的部分
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data && e.data.size > 0) {
                        chunks.push(e.data);
                    }
                };

                // 修改停止制的处理
                mediaRecorder.onstop = () => {
                    if (chunks.length > 0) {
                        const blob = new Blob(chunks, {
                            type: 'video/webm;codecs=h264,opus'
                        });
                        // 添加metadata以支持进度条
                        const metadata = {
                            duration: duration,
                            lastModified: new Date().getTime()
                        };
                        const finalBlob = new Blob([blob], {
                            type: 'video/webm;codecs=h264,opus',
                            ...metadata
                        });
                        const url = window.URL.createObjectURL(finalBlob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `recorded_video_${new Date().getTime()}.webm`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);

                        // 显示下载提示
                        const downloadTip = document.createElement('div');
                        downloadTip.style.cssText = `
                            position: fixed;
                            top: 20px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: rgba(0, 0, 0, 0.8);
                            color: white;
                            padding: 10px 20px;
                            border-radius: 5px;
                            z-index: 999999;
                        `;
                        downloadTip.textContent = '录制完成，开始下载！';
                        document.body.appendChild(downloadTip);
                        setTimeout(() => {
                            document.body.removeChild(downloadTip);
                        }, 2000);
                    }
                    // 移除录制控制界面
                    document.body.removeChild(recordControl);
                };

                // 停止按钮��件
                stopButton.addEventListener('click', () => {
                    if (mediaRecorder.state === 'recording') {
                        mediaRecorder.stop();
                    }
                });

                // 添加拖动功能
                makeElementDraggable(recordControl);
                recordControl.title = '按住可拖动';

                return mediaRecorder;
            } catch (err) {
                // 如果H264编码不支持，回退到VP8
                try {
                    const mediaRecorder = new MediaRecorder(stream, {
                        mimeType: 'video/webm;codecs=vp8,opus',
                        videoBitsPerSecond: 2500000,
                        audioBitsPerSecond: 128000
                    });
                    // ... 继续录制流程 ...
                } catch (fallbackErr) {
                    console.error('录制失败:', fallbackErr);
                    alert('录制失败，该视频可能无法录制');
                    return null;
                }
            }
        }

        // 添加视频选择函数
        function showVideoSelection(videos) {
            const selectMenu = document.createElement('div');
            selectMenu.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
                z-index: 999999;
                color: black;
            `;

            const title = document.createElement('h3');
            title.textContent = '选择要下载的视频：';
            title.style.marginBottom = '10px';
            selectMenu.appendChild(title);

            Array.from(videos).forEach((video, index) => {
                const button = document.createElement('button');
                button.textContent = `视频 ${index + 1}`;
                button.style.cssText = buttonStyle;
                button.style.margin = '5px';
                button.style.background = '#4CAF50';
                button.addEventListener('click', () => {
                    downloadVideo(video);
                    document.body.removeChild(selectMenu);
                });
                selectMenu.appendChild(button);
            });

            document.body.appendChild(selectMenu);
        }

        // 添加录制视频选择函数
        function showVideoSelectionForRecording(videos) {
            const selectMenu = document.createElement('div');
            selectMenu.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
                z-index: 999999;
                color: black;
            `;

            const title = document.createElement('h3');
            title.textContent = '选择录制的视频：';
            title.style.marginBottom = '10px';
            selectMenu.appendChild(title);

            Array.from(videos).forEach((video, index) => {
                const button = document.createElement('button');
                button.textContent = `视频 ${index + 1}`;
                button.style.cssText = buttonStyle;
                button.style.margin = '5px';
                button.style.background = '#FF5722';
                button.addEventListener('click', () => {
                    startRecording(video);
                    document.body.removeChild(selectMenu);
                });
                selectMenu.appendChild(button);
            });

            document.body.appendChild(selectMenu);
        }

        // 修改录制控制面板，添加拖动功能
        function makeElementDraggable(element) {
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            element.style.cursor = 'move';

            element.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);

            function dragStart(e) {
                if (e.target === element || e.target.parentNode === element) {
                    initialX = e.clientX - xOffset;
                    initialY = e.clientY - yOffset;
                    isDragging = true;
                }
            }

            function drag(e) {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    xOffset = currentX;
                    yOffset = currentY;

                    setTranslate(currentX, currentY, element);
                }
            }

            function setTranslate(xPos, yPos, el) {
                el.style.transform = `translate(${xPos}px, ${yPos}px)`;
            }

            function dragEnd() {
                isDragging = false;
            }
        }

        // 添��一个变量来存储最后聚焦的输入框
        let lastFocusedElement = null;

        // 添加全局焦点监听
        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'INPUT' ||
                e.target.tagName === 'TEXTAREA' ||
                e.target.getAttribute('contenteditable') === 'true') {
                lastFocusedElement = e.target;
            }
        });
    }

    // 在页面加载完成后建面板
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createControlPanel);
    } else {
        createControlPanel();
    }

    // 添加一个定时检查，确保面板存在
    setInterval(() => {
        if (!document.getElementById(PANEL_ID)) {
            createControlPanel();
        }
    }, 1000);
})();