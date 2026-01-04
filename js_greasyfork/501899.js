// ==UserScript==
// @name         高亮特定文字
// @namespace    http://tampermonkey.net/
// @version      0.20
// @description  突出显示网页上的特定单词
// @author       niweizhuan
// @match        *://*/*
// @icon         data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnIGlkPSJMYXllcl8xIj4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHJlY3Qgc3Ryb2tlLXdpZHRoPSIwIiByeD0iMzQiIGlkPSJzdmdfMSIgaGVpZ2h0PSIyNTYiIHdpZHRoPSIyNTYiIHk9IjAiIHg9IjAiIHN0cm9rZT0iIzBmMGYwMCIgZmlsbD0iI2ZmZmYwMCIvPgogIDxsaW5lIHN0cm9rZS1saW5lY2FwPSJ1bmRlZmluZWQiIHN0cm9rZS1saW5lam9pbj0idW5kZWZpbmVkIiBpZD0ic3ZnXzIiIHkyPSIxMTkiIHgyPSItMTEiIHkxPSIxMTgiIHgxPSItNiIgc3Ryb2tlPSIjMGYwZjAwIiBmaWxsPSJub25lIi8+CiAgPHRleHQgZm9udC13ZWlnaHQ9Im5vcm1hbCIgZm9udC1zdHlsZT0ibm9ybWFsIiB0cmFuc2Zvcm09Im1hdHJpeCg2LjMyOTM4IDAgMCA1LjQzNjA1IC02MDkuOTQxIC00MjMuMTg1KSIgc3Ryb2tlPSIjMGYwZjAwIiB4bWw6c3BhY2U9InByZXNlcnZlIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIGZvbnQtZmFtaWx5PSInQW5kYWRhIFBybyciIGZvbnQtc2l6ZT0iMjUiIHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z181IiB5PSIxMDciIHg9IjEwMSIgZmlsbD0iIzAwMDAwMCI+QWE8L3RleHQ+CiAgPGxpbmUgc3Ryb2tlPSIjMGYwZjAwIiBzdHJva2Utd2lkdGg9IjUiIGlkPSJzdmdfNyIgeTI9IjE5NiIgeDI9IjIyNi42IiB5MT0iMTk2IiB4MT0iMjUuNiIgZmlsbD0ibm9uZSIvPgogIDxlbGxpcHNlIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlPSIjMGYwZjAwIiByeT0iNS4zMDYxMiIgcng9IjUuMzA2MTIiIGlkPSJzdmdfOCIgY3k9IjE4My44MzY3MyIgY3g9IjIwOSIgZmlsbD0iI2ZmZmY1NiIvPgogIDxwYXRoIHN0cm9rZT0iIzBmMGYwMCIgaWQ9InN2Z185IiBkPSJtMjIzLDE5Ni4wNDNsMCwwYzAsLTEuMzY1ODYgMS4yMDM1NCwtMi40NzMxMiAyLjY4ODE3LC0yLjQ3MzEybDAsMGMwLjcxMjk1LDAgMS4zOTY3LDAuMjYwNTYgMS45MDA4MywwLjcyNDM2YzAuNTA0MTMsMC40NjM4IDAuNzg3MzUsMS4wOTI4NSAwLjc4NzM1LDEuNzQ4NzZsMCwwYzAsMS4zNjU4NiAtMS4yMDM1NCwyLjQ3MzEyIC0yLjY4ODE3LDIuNDczMTJsMCwwYy0xLjQ4NDY0LDAgLTIuNjg4MTcsLTEuMTA3MjUgLTIuNjg4MTcsLTIuNDczMTJsLTAuMDAwMDEsMHptMi42ODgxNywtMi40NzMxMmwwLDQuOTQ2MjNtLTIuNjg4MTcsLTIuNDczMTJsNS4zNzYzNSwwIiBzdHJva2Utd2lkdGg9IjAiIGZpbGw9IiMwMDAwMDAiLz4KICA8cGF0aCBzdHJva2U9IiMwZjBmMDAiIHN0cm9rZS13aWR0aD0iMiIgaWQ9InN2Z18xMiIgZD0ibTI0LjQ2OTQ0LDE5Ni4wMTE1MWwwLDBjMCwtMC43ODc3NiAwLjc2MTEyLC0xLjQyNjM3IDEuNywtMS40MjYzN2wwLDBjMC40NTA4NywwIDAuODgzMjcsMC4xNTAyOCAxLjIwMjA4LDAuNDE3NzdjMC4zMTg4MSwwLjI2NzUgMC40OTc5MiwwLjYzMDMgMC40OTc5MiwxLjAwODU5bDAsMGMwLDAuNzg3NzYgLTAuNzYxMTIsMS40MjYzNyAtMS43LDEuNDI2MzdsMCwwYy0wLjkzODg4LDAgLTEuNywtMC42Mzg2MSAtMS43LC0xLjQyNjM3bDAsMC4wMDAwMXptMS43LC0xLjQyNjM3bDAsMi44NTI3M20tMS43LC0xLjQyNjM3bDMuNCwwIiBmaWxsPSIjZmZmZjU2Ii8+CiA8L2c+Cgo8L3N2Zz4=
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501899/%E9%AB%98%E4%BA%AE%E7%89%B9%E5%AE%9A%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/501899/%E9%AB%98%E4%BA%AE%E7%89%B9%E5%AE%9A%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //配置------------------------------------------------
    // 默认配置
    const defaultConfig = {
        searchWords: ['example1', 'example2', 'example3'],
        highlightColor: '#ffff00'
    };
    // 获取配置
    function getConfig() {
        const config = localStorage.getItem('highlightConfig');
        return config ? JSON.parse(config) : defaultConfig;
    }
    // 保存配置
    function saveConfig(config) {
        localStorage.setItem('highlightConfig', JSON.stringify(config));
    }
    //设置窗口--------------------------------------------
    // 设置窗口是否打开
    var isSettingsOpen = false;
    // 打开设置界面
    function openSettings() {
        if (isSettingsOpen) return;
        isSettingsOpen = true;

        const config = getConfig();
        const overlay = document.createElement('div');
        overlay.id = 'highlightOverlay';
        overlay.style = `position: fixed;left: 0;top: 0;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.5);z-index: 1000;`;

        const settingsDiv = document.createElement('div');
        settingsDiv.id = 'highlightSettings';
        settingsDiv.style = `
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 2vw;
        background-color: white;
        border: 0.1vw solid #ccc;
        border-radius: 0.5vw;
        z-index: 1001;
        box-shadow: 0vw 0vh 1vw rgba(0, 0, 0, 0.5);
        max-width: 80%;max-height: 80%;
        overflow-y: auto;
        transition: opacity 0.3s;
        font-size: 1vw;
`;
        // 响应式样式
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
    /* 适配手机和小屏设备 */
    @media (max-width: 600px) {
        #highlightSettings {width: 70vw; /* 更宽的区域适配窄屏手机 */height: auto;max-height: 90vh;padding: 5vw;}
        h2 {font-size: 5vw; /* 增大标题字体适配手机屏幕 */}
        label {font-size: 3vw; /* 高亮颜色标签的字体适配手机 */}
        .wordBlock {padding: 1.5vw;margin: 1vw;font-size: 2vw; /* 更大的字体适配触摸操作 */}
        #highlightColor {width: 5;height: 3vh;}
        button {font-size: 2.5vw;padding: 1vw 1vw; /* 增加按钮的尺寸 */}
        }
    /* 适配平板和大屏设备 */
    @media (min-width: 601px) and (max-width: 1024px) {
    #highlightSettings {width: 50vw;max-height: 80vh;}
        h2 {font-size: 3vw; /* 中等屏幕设备上的字体大小 */}
        label {font-size: 2vw; /* 高亮颜色标签的字体适配手机 */}
        .wordBlock {padding: 0.75vw;margin: 0.75vw;font-size: 2vw;}
        #highlightColor {width: 10vw;height: 3vh;}
        button {font-size: 1.5vw;padding: 0.5vw 1vw;}
        }
    /* 适配大屏设备（如桌面电脑） */
    @media (min-width: 1025px) {
    #highlightSettings {width: 25vw; /* 较窄的区域适配宽屏设备 */max-height: 40vh;}
        h2 {font-size: 1.5vw; /* 适合电脑的标题字体大小 */}
        .wordBlock {padding: 0.2vw;margin: 0.2vw;font-size: 1.5vw; /* 较小的字体和按钮适配鼠标操作 */}
        #highlightColor {width: 5vw;height: 4vh;}
        button {font-size: 1vw;padding: 0.4vw 0.4;}
    }
`;
        document.head.appendChild(styleElement);
        settingsDiv.innerHTML = `
    <h2 style="user-select: none;color: black">高亮设置</h2>
    <div id="wordBlocks" style="display: flex; flex-wrap: wrap; max-height: 15vh; overflow-y: auto; margin-bottom: 1vw; border: 0.1vw solid #ccc;">
        ${config.searchWords.map(word => `<div class="wordBlock" style="cursor: pointer;user-select: none;border: 0.1vw solid #ccc;color: black">${word}</div>`).join('')}
    </div>
    <div style="margin-bottom: 2vw;">
        <label for="highlightColor" style="user-select: none;color: black">高亮颜色: </label>
        <input type="color" id="highlightColor" value="${config.highlightColor}" style="font-size: 3vw;border: none;appearance: none;padding: 0; margin: 0;">
    </div>
    <button id="newWord" style="user-select: none;color: black;border: 0.1vw solid ＃FF0000">新建</button>
    <button id="editWord" style="user-select: none;color: black;border: 0.1vw solid ＃FF0000">编辑</button>
    <button id="deleteWord" style="user-select: none;color: black;border: 0.1vw solid ＃FF0000">删除</button>
    <button id="saveSettings" style="user-select: none;color: black;border: 0.1vw solid ＃FF0000">保存</button>
`;
        document.body.appendChild(settingsDiv);
        document.body.appendChild(settingsDiv);
        document.body.appendChild(settingsDiv);
        document.body.appendChild(settingsDiv);
        document.body.appendChild(settingsDiv);
        overlay.appendChild(settingsDiv);
        document.body.appendChild(overlay);
        let selectedWordBlock = null;
        const wordBlocks = document.getElementsByClassName('wordBlock');
        Array.from(wordBlocks).forEach(block => {
            block.onclick = function() {
                if (selectedWordBlock) {
                    selectedWordBlock.style.backgroundColor = '';
                }
                selectedWordBlock = this;
                selectedWordBlock.style.backgroundColor = '#d3d3d3';
            };
            block.ontouchstart = function() {
                if (selectedWordBlock) {
                    selectedWordBlock.style.backgroundColor = '';
                }
                selectedWordBlock = this;
                selectedWordBlock.style.backgroundColor = '#d3d3d3';
            };
        });
        const newWordButton = document.getElementById('newWord');
        const editWordButton = document.getElementById('editWord');
        const deleteWordButton = document.getElementById('deleteWord');
        const saveSettingsButton = document.getElementById('saveSettings');
        // 新建单词块处理
        function handleNewWord() {
            const newWord = prompt('请输入新的高亮文本:');
            if (newWord) {
                config.searchWords.push(newWord.trim());
                saveConfig(config);
                document.body.removeChild(overlay);
                isSettingsOpen = false;
                openSettings();
            }
        }
        // 编辑单词块处理
        function handleEditWord() {
            if (selectedWordBlock) {
                const editedWord = prompt('编辑高亮文本：', selectedWordBlock.textContent);
                if (editedWord) {
                    const index = config.searchWords.indexOf(selectedWordBlock.textContent);
                    if (index !== -1) {
                        config.searchWords[index] = editedWord.trim();
                        saveConfig(config);
                        document.body.removeChild(overlay);
                        isSettingsOpen = false;
                        openSettings();
                    }
                }
            } else {
                alert('请先选择一个单词块进行编辑');
            }
        }
        // 删除单词块处理
        function handleDeleteWord() {
            if (selectedWordBlock) {
                const index = config.searchWords.indexOf(selectedWordBlock.textContent);
                if (index !== -1) {
                    config.searchWords.splice(index, 1);
                    saveConfig(config);
                    document.body.removeChild(overlay);
                    isSettingsOpen = false;
                    openSettings(); // 重新打开设置界面以反映删除后的状态
                }
            } else {
                alert('请先选择一个单词块进行删除');
            }
        }
        // 保存设置处理
        function handleSaveSettings() {
            config.highlightColor = document.getElementById('highlightColor').value;
            saveConfig(config);
            document.body.removeChild(overlay);
            isSettingsOpen = false;

            // Reapply highlights across all frames
            highlightOnAllFrames();

            const oldButtonContainer = document.getElementById('floatButtonContainer');
            if (oldButtonContainer) {
                oldButtonContainer.remove();
            }

            createFloatButton();
        }
        // 绑定按钮事件
        newWordButton.onclick = handleNewWord;
        newWordButton.ontouchstart = handleNewWord;

        editWordButton.onclick = handleEditWord;
        editWordButton.ontouchstart = handleEditWord;

        deleteWordButton.onclick = handleDeleteWord;
        deleteWordButton.ontouchstart = handleDeleteWord;

        saveSettingsButton.onclick = handleSaveSettings;
        saveSettingsButton.ontouchstart = handleSaveSettings;

        overlay.onclick = (event) => {
            if (event.target === overlay) {
                document.body.removeChild(overlay);
                isSettingsOpen = false;
            }
        };
    }
    // 判断颜色是否过暗
    function isColorTooDark(color) {
        const c = color.substring(1); // 去掉 '#'
        const rgb = parseInt(c, 16); // 转换为整数
        const r = (rgb >> 16) & 0xff; // 提取红色部分
        const g = (rgb >> 8) & 0xff; // 提取绿色部分
        const b = (rgb >> 0) & 0xff; // 提取蓝色部分
        const luma = 0.299 * r + 0.587 * g + 0.114 * b; // 计算亮度
        return luma < 50; // 亮度阈值，可以根据需要调整
    }
    //悬浮球----------------------------------------------
    // 创建悬浮按钮
    function createFloatButton() {
        if (window.self !== window.top) return;
        let isDragging = false;
        let startY, initialTop;
        let moved = false;
        let hideTimeout;
        const hideDelay = 1000; // 1秒未操作则隐藏
        const visibleLeft = '1vw'; // 弹出时的位置
        let isHidden = false; // 标记按钮是否处于隐藏状态
        let isAnimating = false; // 标记按钮是否正在动画中
        const config = getConfig();

        // 创建悬浮球按钮容器
        const floatButtonContainer = document.createElement('div');
        floatButtonContainer.style.position = 'fixed';
        floatButtonContainer.style.left = '0';
        floatButtonContainer.style.top = '1vw';
        floatButtonContainer.style.zIndex = '9999';
        floatButtonContainer.style.width = 'auto';
        floatButtonContainer.style.height = 'auto';

        // 创建Shadow DOM
        const shadow = floatButtonContainer.attachShadow({ mode: 'open' });
        floatButtonContainer.id = 'floatButtonContainer';

        // 创建悬浮球按钮
        const floatButton = document.createElement('div');
        floatButton.style.cssText = `
            min-width: 8vw;  /* 确保悬浮球的最小宽度 */
            min-height: 2vw; /* 确保悬浮球的最小高度 */
            background-color: ${config.highlightColor};
            background-size: cover;
            background-position: center;
            cursor: pointer;
            border-radius: 0.5vw;
            box-shadow: 0px 0px 1vw rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 0;
            transition: top 0.3s ease, left 0.3s ease;
            white-space: nowrap;  /* 防止文本换行 */
            text-overflow: ellipsis;  /* 添加省略号以防文本过长 */
        `;

        // 根据颜色亮度调整文字颜色
        if (isColorTooDark(config.highlightColor)) {
            floatButton.innerHTML = `
                <div style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    user-select: none;  /* 禁止文字被选中 */
                ">
                    <div class="container" style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%;">
                        <div class="left" style="padding-right: 5px; font-size: 12px; color: white;">设置高亮文本</div>
                        <div class="line" style="width: 1px; height: 20px; background-color: white;"></div>
                        <div class="right" style="padding-left: 5px; font-size: 12px; color: white;">
                            <div class="rotate-text" style="transform: rotate(90deg);">Aa</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            floatButton.innerHTML = `
                <div style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    user-select: none;  /* 禁止文字被选中 */
                ">
                    <div class="container" style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%;">
                        <div class="left" style="padding-right: 5px; font-size: 12px; color: black;">设置高亮文本</div>
                        <div class="line" style="width: 1px; height: 20px; background-color: black;"></div>
                        <div class="right" style="padding-left: 5px; font-size: 12px; color: black;">
                            <div class="rotate-text" style="transform: rotate(90deg);">Aa</div>
                        </div>
                    </div>
                </div>
            `;
        }

        shadow.appendChild(floatButton);
        document.body.appendChild(floatButtonContainer);

        // 显示设置界面
        function showSettings() {
            openSettings();
        }

        // 点击处理
        function handleClick() {
            if (!isDragging && !moved && !isHidden && !isAnimating) {
                showSettings();
            }
        }

        // 计算隐藏后的left值
        function calculateHiddenLeft() {
            const buttonWidth = floatButtonContainer.offsetWidth;
            return `-${(buttonWidth * 0.78)}px`; // 隐藏78%宽度
        }

        // 鼠标事件处理
        floatButton.addEventListener('mousedown', (e) => {
            if (isHidden || isAnimating) return; // 隐藏或动画状态下不允许拖动
            clearTimeout(hideTimeout); // 停止隐藏计时器
            isDragging = true;
            moved = false;
            startY = e.clientY;
            initialTop = floatButtonContainer.offsetTop;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaY = e.clientY - startY;
                let newTop = Math.max(0, Math.min(initialTop + deltaY, window.innerHeight - floatButtonContainer.offsetHeight));
                floatButtonContainer.style.top = `${newTop}px`;

                if (Math.abs(deltaY) > 5) {
                    moved = true;
                }
                e.preventDefault();
            }
            resetHideTimer(); // 任何鼠标移动都重置隐藏计时器
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                if (!moved) {
                    handleClick();
                }
                resetHideTimer(); // 拖动结束后重置隐藏计时器
            }
        });

        // 触摸事件处理
        floatButton.addEventListener('touchstart', (e) => {
            if (isHidden || isAnimating) {
                if (isHidden) {
                    beginAnimation(); // 开始恢复动画
                    floatButtonContainer.style.left = visibleLeft;
                    isHidden = false;
                    clearTimeout(hideTimeout); // 停止隐藏计时器
                }
                e.preventDefault();
                return;
            }
            clearTimeout(hideTimeout); // 停止隐藏计时器
            isDragging = true;
            moved = false;
            const touch = e.touches[0];
            startY = touch.clientY;
            initialTop = floatButtonContainer.offsetTop;
            e.preventDefault();
        });

        document.addEventListener('touchmove', (e) => {
            if (isDragging && !isHidden && !isAnimating) {
                const touch = e.touches[0];
                const deltaY = touch.clientY - startY;
                let newTop = Math.max(0, Math.min(initialTop + deltaY, window.innerHeight - floatButtonContainer.offsetHeight));
                floatButtonContainer.style.top = `${newTop}px`;

                if (Math.abs(deltaY) > 5) {
                    moved = true;
                }
                e.preventDefault();
            }
            resetHideTimer(); // 任何触摸移动都重置隐藏计时器
        });

        document.addEventListener('touchend', (e) => {
            if (isDragging && !isHidden && !isAnimating) {
                isDragging = false;
                if (!moved) {
                    handleClick();
                }
                if (moved) {
                    e.preventDefault();
                }
                resetHideTimer(); // 触摸结束后重置隐藏计时器
            }
        });

        floatButton.addEventListener('mouseenter', () => {
            if (isHidden && !isAnimating) {
                beginAnimation(); // 开始恢复动画
                floatButtonContainer.style.left = visibleLeft; // 鼠标悬停时弹出按钮
                isHidden = false;
            }
            clearTimeout(hideTimeout); // 停止隐藏计时器
        });

        floatButton.addEventListener('mouseleave', () => {
            resetHideTimer();
        });

        floatButton.addEventListener('click', (e) => {
            handleClick();
            e.preventDefault();
        });

        // 重置隐藏计时器
        function resetHideTimer() {
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                beginAnimation(); // 开始隐藏动画
                floatButtonContainer.style.left = calculateHiddenLeft(); // 隐藏按钮
                isHidden = true;
            }, hideDelay);
        }

        // 开始动画
        function beginAnimation() {
            isAnimating = true;
            floatButton.style.pointerEvents = 'none'; // 禁用按钮点击事件
            floatButtonContainer.style.transition = 'left 0.3s ease, transform 0.3s ease'; // 确保应用了左转换和变换转换
            setTimeout(endAnimation, 300); // 300ms后恢复交互
        }

        // 结束动画
        function endAnimation() {
            isAnimating = false;
            floatButton.style.pointerEvents = 'auto'; // 恢复按钮点击事件
        }

        resetHideTimer();
    }
    //高亮逻辑--------------------------------------------
    // 正则表达式缓存
    let regexCache = {};
    // 使用缓存获取正则表达式
    function getCombinedRegex(searchWords) {
        const key = searchWords.join('|'); // 用关键词数组生成缓存key
        if (!regexCache[key]) {
            regexCache[key] = new RegExp(`(${searchWords.map(escapeRegExp).join('|')})`, 'gi');
        }
        return regexCache[key];
    }
    // 批量高亮文本
    function highlightTextInBatches(textNodes, searchWords, highlightColor, batchSize = 100) {
        const combinedRegex = getCombinedRegex(searchWords);
        let index = 0;

        function processBatch() {
            const batch = textNodes.slice(index, index + batchSize);

            batch.forEach(node => {
                let nodeText = node.nodeValue;
                let newHtml = nodeText.replace(combinedRegex, `<mark style="background-color: ${highlightColor};">$1</mark>`);

                if (newHtml !== nodeText && node.parentNode) { // 仅在内容变更时操作 DOM
                    const newNode = document.createElement('span');
                    newNode.innerHTML = newHtml;
                    node.parentNode.replaceChild(newNode, node);
                }
            });

            index += batchSize;

            if (index < textNodes.length) {
                setTimeout(processBatch, 0); // 使用 setTimeout 分批次处理，防止卡顿
            }
        }

        processBatch(); // 启动批量处理
    }
    // 清除高亮
    function clearAllHighlights(container = document.body) {
        const highlightedElements = Array.from(container.querySelectorAll('mark'));
        let index = 0;
        const batchSize = 50;

        function processBatch(deadline) {
            while (index < highlightedElements.length && deadline.timeRemaining() > 0) {
                const fragment = document.createDocumentFragment();
                const batch = highlightedElements.slice(index, index + batchSize);

                batch.forEach(element => {
                    const textNode = document.createTextNode(element.textContent);
                    fragment.appendChild(textNode);
                    element.parentNode.replaceChild(fragment, element);
                });

                index += batchSize;
            }

            if (index < highlightedElements.length) {
                requestIdleCallback(processBatch); // 继续处理剩余的批次
            }
        }

        requestIdleCallback(processBatch); // 启动批量处理
    }
    // 递归清除嵌套页面中的高亮
    function clearAllHighlightsInFrames(doc = document) {
        return new Promise((resolve) => {
            const highlightedElements = Array.from(doc.querySelectorAll('mark'));
            let index = 0;
            const batchSize = 50;

            function processBatch(deadline) {
                while (index < highlightedElements.length && deadline.timeRemaining() > 0) {
                    const fragment = document.createDocumentFragment();
                    const batch = highlightedElements.slice(index, index + batchSize);

                    batch.forEach(element => {
                        const textNode = document.createTextNode(element.textContent);
                        fragment.appendChild(textNode);
                        element.parentNode.replaceChild(fragment, element);
                    });

                    index += batchSize;
                }

                if (index < highlightedElements.length) {
                    requestIdleCallback(processBatch);// 继续处理
                } else {
                    resolve();// 完成后，去除promise
                }
            }

            requestIdleCallback(processBatch);// 开始批量处理
        });
    }
    // 转义正则表达式中的特殊字符
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 转义正则表达式特殊字符
    }
    // 递归高亮嵌套的 iframe 内容
    function highlightOnAllFrames(doc = document) {
        highlightOnPage(doc); // 对当前页面进行高亮处理

        // 获取当前文档中的所有iframe
        const iframes = doc.getElementsByTagName('iframe');
        for (let i = 0; i < iframes.length; i++) {
            try {
                const iframeDocument = iframes[i].contentDocument || iframes[i].contentWindow.document;
                if (iframeDocument) {
                    // 递归调用每个iframe的函数进行高亮
                    highlightOnAllFrames(iframeDocument);
                }
            } catch (error) {
                console.error("访问iframe内容时出错: ", error);
            }
        }
    }
    // 获取文本节点
    function getTextNodes(node) {
        const textNodes = [];
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
        let currentNode;
        while ((currentNode = walker.nextNode())) {
            textNodes.push(currentNode);
        }
        return textNodes;
    }
    // 页面上高亮
    function highlightOnPage(doc = document) {
        clearAllHighlightsInFrames(doc).then(() => {
            const body = doc.body;
            const config = getConfig();// 获取配置设置
            const textNodes = getTextNodes(body);
            highlightTextInBatches(textNodes, config.searchWords, config.highlightColor);
        });
    }


    //启动------------------------------------------------
    createFloatButton();
    highlightOnPage();

})();
