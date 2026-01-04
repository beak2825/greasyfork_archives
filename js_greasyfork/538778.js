// ==UserScript==
// @name         Better Tencent YuanBao
// @namespace    http://tampermonkey.net/
// @version      2025-06-06
// @description  Enhanced UI for Tencent YuanBao chat
// @author       AAur
// @match        https://yuanbao.tencent.com/chat/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuanbao.tencent.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538778/Better%20Tencent%20YuanBao.user.js
// @updateURL https://update.greasyfork.org/scripts/538778/Better%20Tencent%20YuanBao.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 通用工具函数 ==========
    const waitForElement = (selector) => {
        return new Promise(resolve => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);

            const container = document.querySelector('.agent-chat__container') || document.body;
            const observer = new MutationObserver((_, obs) => {
                const target = document.querySelector(selector);
                if (target) {
                    obs.disconnect();
                    resolve(target);
                }
            });

            observer.observe(container, {
                childList: true,
                subtree: true
            });
        });
    };

    const debounce = (fn, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    };

    const createStyle = (css) => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        return style;
    };

    // ========== 功能1: 底栏收起按钮 ==========
    const initToggleButton = async () => {
        const inputBox = await waitForElement('.agent-dialogue__content--common__input.agent-chat__input-box');

        // 添加相关样式
        createStyle(`
            #inputToggleBtn {
                position: fixed;
                left: 50%;
                transform: translateX(-50%);
                z-index: 9999;
                padding: 2px 15px;
                background: #3db057;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                opacity: 0.7;
                transition: opacity 0.2s, top 0.2s;
            }
            #inputToggleBtn:hover {
                opacity: 1;
            }
            .hidden-input {
                display: none !important;
            }
        `);

        // 创建按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'inputToggleBtn';
        toggleBtn.textContent = 'Hide';

        inputBox.parentNode.insertBefore(toggleBtn, inputBox);

        // 更新按钮位置函数
        const updateButtonPosition = () => {
            const rect = inputBox.getBoundingClientRect();
            const btnWidth = toggleBtn.offsetWidth;
            const leftPosition = rect.left + (rect.width - btnWidth) / 2;

            toggleBtn.style.left = `${leftPosition}px`;
            toggleBtn.style.top = `${rect.top + window.scrollY - 25}px`;
        };

        // 监听输入框大小变化
        const observeInputBoxChanges = () => {
            const resizeObserver = new ResizeObserver(debounce(() => {
                if (!inputBox.classList.contains('hidden-input')) {
                    updateButtonPosition();
                }
            }, 100));
            resizeObserver.observe(inputBox);
            return resizeObserver;
        };

        let boxObserver = observeInputBoxChanges();
        updateButtonPosition();

        // 按钮点击事件
        toggleBtn.addEventListener('click', () => {
            if (inputBox.classList.contains('hidden-input')) {
                inputBox.classList.remove('hidden-input');
                toggleBtn.textContent = 'Hide';
                boxObserver = observeInputBoxChanges();
                updateButtonPosition();
            } else {
                inputBox.classList.add('hidden-input');
                toggleBtn.textContent = 'Show';
                boxObserver.disconnect();
                toggleBtn.style.top = `${document.documentElement.scrollHeight - 40}px`;
            }
        });

        // 窗口大小调整时更新按钮位置
        window.addEventListener('resize', debounce(() => {
            if (inputBox.classList.contains('hidden-input')) {
                toggleBtn.style.top = `${document.documentElement.scrollHeight - 30}px`;
            } else {
                updateButtonPosition();
            }
        }, 100));
    };

    // ========== 功能2: 整理有序列表 ==========
    const initOlProcessor = () => {
        // 创建按钮样式
        createStyle(`
            #processOlBtn {
                position: fixed;
                bottom: 5px;
                right: 20px;
                z-index: 9999;
                padding: 5px 10px;
                background: #3db057;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            #processOlBtn:hover {
                opacity: 1;
            }
            .numbered-item {
                display: block;
                margin-bottom: 8px;
                line-height: 1.5;
                position: relative;
                padding-left: 1.5em;
            }
        `);

        // 创建并添加整理按钮
        const processOlBtn = document.createElement('button');
        processOlBtn.id = 'processOlBtn';
        processOlBtn.textContent = '整理OL';
        document.body.appendChild(processOlBtn);

        // 计算节点内字符数
        const countTextContent = (element) => {
            let count = 0;
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            while (walker.nextNode()) {
                count += walker.currentNode.textContent.trim().length;
            }
            return count;
        };

        // 转换单个OL元素
        const processOlElement = (ol) => {
            // Mark as processed to avoid duplicate processing
            ol.classList.add('processed-ol');

            // Get direct child LI elements only
            const lis = Array.from(ol.querySelectorAll(':scope > li'));
            const fragment = document.createDocumentFragment();

            lis.forEach((li, index) => {
                // Create a new div to replace the li
                const numberedDiv = document.createElement('div');
                numberedDiv.className = 'numbered-item';

                // Find the first text node inside the li (ignoring whitespace)
                function findFirstTextNode(element) {
                    // 遍历所有子节点
                    for (const child of element.childNodes) {
                        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
                            return child; // 找到目标文本节点
                        } else if (child.nodeType === Node.ELEMENT_NODE) {
                            const found = findFirstTextNode(child); // 递归搜索子元素
                            if (found) return found;
                        }
                    }
                    return null; // 未找到
                }

                const firstTextNode = findFirstTextNode(li);

                if (firstTextNode) {
                    // 在文本节点前插入序号（保留原文本）
                    firstTextNode.textContent = `${index + 1}. ${firstTextNode.textContent.trim()}`;
                } else {
                    // 如果没有文本节点，则在 <li> 开头插入序号
                    const textNode = document.createTextNode(`${index + 1}. `);
                    li.prepend(textNode);
                }

                // Move all of li's children to the new div
                while (li.firstChild) {
                    numberedDiv.appendChild(li.firstChild);
                }

                fragment.appendChild(numberedDiv);
            });

            // Replace the OL with our new structure
            ol.replaceWith(fragment);
        };

        // 处理所有OL元素
        const processAllOls = () => {
            const ols = document.querySelectorAll('ol:not(.processed-ol)');
            let processedCount = 0;

            ols.forEach(ol => {
                if (countTextContent(ol) > 200) {
                    processOlElement(ol);
                    processedCount++;
                }
            });

            // 显示处理结果
            if (processedCount > 0) {
                processOlBtn.textContent = `已整理${processedCount}个OL`;
                setTimeout(() => {
                    processOlBtn.textContent = '整理OL';
                }, 2000);
            } else {
                processOlBtn.textContent = '未发现需整理的OL';
                setTimeout(() => {
                    processOlBtn.textContent = '整理OL';
                }, 2000);
            }
        };

        // 观察内容变化并延迟处理
        const observeContentChanges = () => {
            const contentElement = document.querySelector('.agent-dialogue__content--common__content');
            if (!contentElement) return;

            let changeTimer;
            const observer = new MutationObserver((mutations) => {
                // 检查是否有实际内容变化
                const hasRelevantChange = mutations.some(mutation =>
                    mutation.type === 'childList' ||
                    (mutation.type === 'characterData' && mutation.target.textContent.trim())
                );

                if (hasRelevantChange) {
                    clearTimeout(changeTimer);
                    changeTimer = setTimeout(() => {
                        processAllOls();
                    }, 500);
                }
            });

            observer.observe(contentElement, {
                childList: true,
                subtree: true,
                characterData: true
            });

            return () => observer.disconnect();
        };

        // 初始化内容观察
        let cleanupObserver;
        const initObserver = () => {
            if (cleanupObserver) cleanupObserver();
            cleanupObserver = observeContentChanges();
        };

        // 延迟初始化观察器，确保元素已加载
        setTimeout(initObserver, 1000);

        // 按钮点击事件
        processOlBtn.addEventListener('click', processAllOls);

        // 返回initObserver以便外部调用
        return initObserver;
    };

    // ========== 主初始化函数 ==========
    const main = () => {
        const initOlObserver = initOlProcessor(); // 获取返回的initObserver函数
        Promise.all([
            initToggleButton(),
            initOlObserver(),
            initOlObserver && initOlObserver() // 如果initOlProcessor返回了initObserver就调用
        ]).catch(error => {
            console.error('Better Tencent YuanBao initialization error:', error);
        });
    };

    // ========== 启动脚本 ==========
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(main);
    } else {
        setTimeout(main, 500);
    }
})();