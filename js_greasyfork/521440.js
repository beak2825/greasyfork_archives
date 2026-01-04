// ==UserScript==
// @name         chatgpt自动重复输入消息（可自定义输入内容）
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  一个增强ChatGPT体验的自动化工具，主要功能如下：
//               1. 在ChatGPT界面添加一个"继续"按钮
//               2. 支持自定义输入内容（默认为"继续"）
//               3. 可以自动重复发送消息
//               4. 带有美观的图形界面和动画效果
//               5. 支持明暗主题自适应
//
//               使用方法：
//               1. 鼠标悬停在"继续"按钮上会显示输入框
//               2. 在输入框中可以自定义要重复发送的消息
//               3. 点击"确定"保存自定义消息
//               4. 点击"继续"按钮开始自动发送（再次点击停止）
//               5. 当ChatGPT回复完成后会自动发送下一条
//
//               特色功能：
//               - 优雅的界面设计和交互动画
//               - 可拖动的参考图片
//               - 智能等待机制，确保确发送
//               - ���美融入ChatGPT原生界面
// @author       喜乐BB844785535@gmail.com  Claude 和chatgpt共同制作
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521440/chatgpt%E8%87%AA%E5%8A%A8%E9%87%8D%E5%A4%8D%E8%BE%93%E5%85%A5%E6%B6%88%E6%81%AF%EF%BC%88%E5%8F%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E8%BE%93%E5%85%A5%E5%86%85%E5%AE%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521440/chatgpt%E8%87%AA%E5%8A%A8%E9%87%8D%E5%A4%8D%E8%BE%93%E5%85%A5%E6%B6%88%E6%81%AF%EF%BC%88%E5%8F%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E8%BE%93%E5%85%A5%E5%86%85%E5%AE%B9%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoRunInterval = null;
    let customMessage = '继续'; // 默认消息
    let hideTimeout = null; // 用于延迟隐藏

    function createButton() {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';

        const button = document.createElement('button');
        button.innerHTML = '继续';
        button.className = 'flex h-8 min-w-8 items-center justify-center rounded-lg p-1 text-xs font-semibold hover:bg-black/10 focus-visible:outline-black dark:focus-visible:outline-white';
        button.style.margin = '0 4px';
        button.setAttribute('aria-label', '发送继续');
        button.setAttribute('data-auto-running', 'false');

        wrapper.appendChild(button);

        // 创建输入框容器
        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 12px;
            display: none;
            z-index: 10000;
            white-space: nowrap;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            background: rgba(244, 244, 244, 0.98);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
            backdrop-filter: blur(8px);
        `;

        // 创建flex容器
        const inputWrapper = document.createElement('div');
        inputWrapper.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px;
            background: transparent;
        `;

        // 创建输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.value = ''; // 移除默认值
        input.placeholder = '请在这里输入你要重复输入的消息'; // 添加占位符文字
        input.style.cssText = `
            width: 200px;
            padding: 10px 14px;
            border: none;
            border-radius: 12px;
            font-size: 11px;
            line-height: 1.5;
            outline: none;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
            ::placeholder {
                color: rgba(0, 0, 0, 0.4);
                transition: all 0.3s ease;
            }
            :focus::placeholder {
                opacity: 0.5;
            }
        `;

        // 创建确定按钮
        const confirmButton = document.createElement('button');
        confirmButton.innerHTML = '确定';
        confirmButton.style.cssText = `
            padding: 10px 18px;
            background: #000000;
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        `;

        // 添加按钮悬停效果
        confirmButton.addEventListener('mouseover', () => {
            confirmButton.style.transform = 'translateY(-1px)';
            confirmButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            confirmButton.style.background = 'linear-gradient(45deg, #000000, #333333)';
        });

        confirmButton.addEventListener('mouseout', () => {
            confirmButton.style.transform = 'translateY(0)';
            confirmButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)';
            confirmButton.style.background = '#000000';
        });

        // 添加输入框焦点效果
        input.addEventListener('focus', () => {
            clearTimeout(hideTimeout);
            input.style.background = '#ffffff';
            input.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.05), 0 0 0 3px rgba(0, 0, 0, 0.05)';
        });

        input.addEventListener('blur', () => {
            input.style.background = 'rgba(255, 255, 255, 0.9)';
            input.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.05)';
        });

        // 修改确定按钮点击事件
        confirmButton.addEventListener('click', () => {
            customMessage = input.value || '继续';
            inputContainer.style.opacity = '0';
            setTimeout(() => {
                inputContainer.style.display = 'none';
                // 如果当前没有在自动运行，则开启自动运行模式
                const button = document.querySelector('[aria-label="发送继续"]');
                if (button && button.getAttribute('data-auto-running') !== 'true') {
                    button.setAttribute('data-auto-running', 'true');
                    button.style.backgroundColor = '#4CAF50';
                    button.style.color = 'white';

                    executeContinue();

                    if (autoRunInterval) {
                        clearInterval(autoRunInterval);
                    }

                    autoRunInterval = setInterval(async () => {
                        try {
                            const stopButton = document.querySelector('[data-testid="stop-button"]');
                            if (!stopButton) {
                                await executeContinue();
                            }
                        } catch (error) {
                            console.error('自动运行出错:', error);
                            stopAutoRun();
                        }
                    }, 1000);
                }
            }, 200);
        });

        // 组装DOM
        inputWrapper.appendChild(input);
        inputWrapper.appendChild(confirmButton);
        inputContainer.appendChild(inputWrapper);
        wrapper.appendChild(inputContainer);

        // 创建可拖动的图片容器
        const imgContainer = document.createElement('div');
        imgContainer.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 10000;
            cursor: move;
            display: none;
            background: transparent;
            padding: 0;
        `;

        // 创建图片元素
        const img = document.createElement('img');
        img.src = 'https://pic.imgdb.cn/item/6767ecd3d0e0a243d4e80a94.png';
        img.style.cssText = `
            max-width: 200px;
            max-height: 300px;
            object-fit: contain;
            pointer-events: none;
            user-select: none;
            -webkit-user-drag: none;
            filter: drop-shadow(0 2px 8px rgba(0,0,0,0.1));
        `;

        imgContainer.appendChild(img);
        document.body.appendChild(imgContainer);

        // 添加拖动功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        imgContainer.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - imgContainer.offsetLeft;
            initialY = e.clientY - imgContainer.offsetTop;

            if (e.target === imgContainer) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                currentX = Math.min(Math.max(0, currentX), window.innerWidth - imgContainer.offsetWidth);
                currentY = Math.min(Math.max(0, currentY), window.innerHeight - imgContainer.offsetHeight);

                imgContainer.style.left = currentX + 'px';
                imgContainer.style.top = currentY + 'px';
            }
        }

        function dragEnd() {
            isDragging = false;
        }

        // 修改主题更新函数
        function updateThemeColors() {
            const isDarkMode = document.documentElement.classList.contains('dark');
            const backgroundColor = isDarkMode ? '#2D3748' : 'white';
            const borderColor = isDarkMode ? '#4A5568' : '#e5e7eb';
            const textColor = isDarkMode ? 'white' : 'black';

            inputContainer.style.setProperty('--background-color', backgroundColor);
            inputContainer.style.setProperty('--border-color', borderColor);
            input.style.setProperty('--text-color', textColor);
        }

        // 初始更新主题
        updateThemeColors();

        // 监听主题变化
        const observer = new MutationObserver(updateThemeColors);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        // 修改显示和隐藏逻辑
        function showInput() {
            clearTimeout(hideTimeout);
            inputContainer.style.display = 'block';
            imgContainer.style.display = 'block';
            button.style.transform = 'scale(1.1)';
            requestAnimationFrame(() => {
                inputContainer.style.opacity = '1';
                input.focus();
            });
        }

        function hideInput() {
            // 检查鼠标是否在任何相关元素上
            if (isMouseOverElements()) {
                return;
            }

            // 检查是否正在输入
            if (document.activeElement === input) {
                return;
            }

            hideTimeout = setTimeout(() => {
                // 再次检查鼠标位置和输入状态
                if (!isMouseOverElements() && document.activeElement !== input) {
                    inputContainer.style.opacity = '0';
                    imgContainer.style.display = 'none';
                    button.style.transform = '';
                    setTimeout(() => {
                        if (inputContainer.style.opacity === '0' &&
                            !isMouseOverElements() &&
                            document.activeElement !== input) {
                            inputContainer.style.display = 'none';
                        }
                    }, 300);
                }
            }, 800); // 增加更长的延迟时间
        }

        // 改进鼠标位置检查函数
        function isMouseOverElements() {
            const elements = [wrapper, inputContainer, input, confirmButton, imgContainer];
            return elements.some(el => el && el.matches(':hover'));
        }

        // 添加更多的事件监听
        wrapper.addEventListener('mouseenter', showInput);
        inputContainer.addEventListener('mouseenter', showInput);
        input.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
        confirmButton.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
        imgContainer.addEventListener('mouseenter', () => clearTimeout(hideTimeout));

        // 修改离开事件
        wrapper.addEventListener('mouseleave', (e) => {
            const relatedTarget = e.relatedTarget;
            if (!isPartOfComponent(relatedTarget)) {
                hideInput();
            }
        });

        inputContainer.addEventListener('mouseleave', (e) => {
            const relatedTarget = e.relatedTarget;
            if (!isPartOfComponent(relatedTarget)) {
                hideInput();
            }
        });

        // 添加组件检查函数
        function isPartOfComponent(element) {
            const components = [wrapper, inputContainer, input, confirmButton, imgContainer];
            return components.some(comp => comp && (comp === element || comp.contains(element)));
        }

        // 添加输入框焦点事件
        input.addEventListener('focus', () => {
            clearTimeout(hideTimeout);
        });

        input.addEventListener('blur', (e) => {
            // 检查是否点击到了组件内的其他元素
            if (!isPartOfComponent(e.relatedTarget)) {
                hideInput();
            }
        });

        // 添加点击外部关闭功能
        document.addEventListener('click', (e) => {
            if (!isPartOfComponent(e.target) && inputContainer.style.display === 'block') {
                hideInput();
            }
        });

        // 修改按钮点击事件处
        button.addEventListener('click', function() {
            const isAutoRunning = button.getAttribute('data-auto-running') === 'true';

            // 确保清理之前的定时器
            if (autoRunInterval) {
                clearInterval(autoRunInterval);
                autoRunInterval = null;
            }

            if (!isAutoRunning) {
                // 开始自动运行
                button.setAttribute('data-auto-running', 'true');
                button.style.backgroundColor = '#4CAF50';
                button.style.color = 'white';

                executeContinue();

                autoRunInterval = setInterval(async () => {
                    try {
                        const stopButton = document.querySelector('[data-testid="stop-button"]');
                        if (!stopButton) {
                            await executeContinue();
                        }
                    } catch (error) {
                        console.error('自动运行出错:', error);
                        // 出错时自动停止
                        stopAutoRun();
                    }
                }, 1000);
            } else {
                // 停止自动运行
                stopAutoRun();
            }
        });

        // 添加停止自动运行的函数
        function stopAutoRun() {
            const button = document.querySelector('[aria-label="发送继续"]');
            if (button) {
                button.setAttribute('data-auto-running', 'false');
                button.style.backgroundColor = '';
                button.style.color = '';
            }

            if (autoRunInterval) {
                clearInterval(autoRunInterval);
                autoRunInterval = null;
            }
        }

        // 为输入框和确定按钮添加额外的鼠标事件监听
        input.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
        });

        confirmButton.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
        });

        // 添加显示输入框的事件监听
        wrapper.addEventListener('mouseenter', showInput);
        inputContainer.addEventListener('mouseenter', showInput);

        return wrapper;
    }

    function waitForResponse() {
        return new Promise((resolve) => {
            function checkResponseStatus() {
                const stopButton = document.querySelector('[data-testid="stop-button"]');
                const sendButton = document.querySelector('[data-testid="send-button"]');
                const speechButton = document.querySelector('[data-testid="composer-speech-button"]');

                if (!stopButton && (sendButton || speechButton)) {
                    resolve();
                } else {
                    setTimeout(checkResponseStatus, 1000);
                }
            }
            checkResponseStatus();
        });
    }

    async function executeContinue() {
        const inputElement = document.querySelector('p.placeholder') ||
                           document.querySelector('[contenteditable="true"]') ||
                           document.querySelector('#composer-background p');

        if (!inputElement) {
            console.error('找不到输入元素');
            stopAutoRun(); // 找不到输入元素时停止自动运行
            return;
        }

        try {
            await waitForResponse();

            inputElement.innerHTML = '';
            inputElement.textContent = '';

            while (inputElement.firstChild) {
                inputElement.removeChild(inputElement.firstChild);
            }

            const textNode = document.createTextNode(customMessage);
            inputElement.appendChild(textNode);
            inputElement.focus();

            ['input', 'change', 'keyup'].forEach(eventType => {
                inputElement.dispatchEvent(new Event(eventType, { bubbles: true }));
            });

            setTimeout(function() {
                const sendButton = document.querySelector('[data-testid="send-button"]');
                if (sendButton) {
                    sendButton.click();
                } else {
                    console.error('找不到发送按钮');
                    stopAutoRun(); // 找不到发送按钮时停止自动运行
                }
            }, 100);
        } catch (e) {
            console.error('操作失败:', e);
            stopAutoRun(); // 操作失败时停止自动运行
        }
    }

    function tryInsertButton() {
        if (document.querySelector('[aria-label="发送继续"]')) {
            return true;
        }

        const toolbarDiv = document.querySelector('.flex.gap-x-1');
        if (!toolbarDiv) {
            return false;
        }

        const buttonWrapper = createButton();

        const buttons = Array.from(toolbarDiv.children);
        const globeButton = buttons.find(child => {
            const svg = child.querySelector('svg');
            return svg && svg.querySelector('path[d^="M2 12C2 6.47715"]');
        });

        if (globeButton) {
            if (globeButton.nextSibling) {
                toolbarDiv.insertBefore(buttonWrapper, globeButton.nextSibling);
            } else {
                toolbarDiv.appendChild(buttonWrapper);
            }
        } else {
            toolbarDiv.appendChild(buttonWrapper);
        }

        return true;
    }

    function initButton() {
        if (!tryInsertButton()) {
            const checkInterval = setInterval(() => {
                if (tryInsertButton()) {
                    clearInterval(checkInterval);
                }
            }, 1000);

            setTimeout(() => {
                clearInterval(checkInterval);
            }, 60000);
        }
    }

    if (document.readyState === 'complete') {
        initButton();
    } else {
        window.addEventListener('load', initButton);
    }

    const observer = new MutationObserver((mutations) => {
        if (!document.querySelector('[aria-label="发送继续"]')) {
            tryInsertButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 添加页面卸载时的清理
    window.addEventListener('unload', () => {
        if (autoRunInterval) {
            clearInterval(autoRunInterval);
            autoRunInterval = null;
        }
    });
})();