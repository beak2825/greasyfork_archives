// ==UserScript==
// @name         Pinnacle Optimize
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  添加作者
// @author       Lycoiref & xgay231
// @match        *://app.pinnacle.run/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mjclouds.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468798/Pinnacle%20Optimize.user.js
// @updateURL https://update.greasyfork.org/scripts/468798/Pinnacle%20Optimize.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let optionsRows = [];
    let btns = [];
    let currentQuestionTextElement = null; // 存储当前问题文本元素
    let transformingContainer = null;
    let mainContentArea = null;

    // 封装更健壮的点击事件模拟函数，模拟完整的鼠标点击过程
    function simulateFullClick(element) {
        if (!element) {
            console.error('simulateFullClick called with null or undefined element.');
            return;
        }
        try {
            // 获取元素的位置和大小，计算中心点作为点击坐标
            const rect = element.getBoundingClientRect();
            const clientX = rect.left + rect.width / 2;
            const clientY = rect.top + rect.height / 2;

            const commonEventProps = {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: clientX,
                clientY: clientY
            };

            // 1. 模拟 mouseover 事件 (可选，但有时有用)
            element.dispatchEvent(new MouseEvent('mouseover', commonEventProps));

            // 2. 模拟 mousedown 事件
            element.dispatchEvent(new MouseEvent('mousedown', commonEventProps));
            console.log('Dispatched mousedown to:', element);

            // 3. 模拟 mouseup 事件
            element.dispatchEvent(new MouseEvent('mouseup', commonEventProps));
            console.log('Dispatched mouseup to:', element);

            // 4. 模拟 click 事件 (这是最终触发交互的事件)
            element.dispatchEvent(new MouseEvent('click', commonEventProps));
            console.log('Dispatched click to:', element);

            // 模拟 mouseout 事件 (可选，但有时有用)
            element.dispatchEvent(new MouseEvent('mouseout', commonEventProps));

        } catch (e) {
            console.error('Error dispatching full click event:', e);
        }
    }

    // 封装更新DOM元素引用的函数
    function updateElements() {
        // 尝试找到当前活跃的题目包装器（通过transform: none 或 translateX(0px)判断）
        const activeWrapper = document.querySelector(
            '.h-full.bg-default-555[style*="transform: none"], ' +
            '.h-full.bg-default-555[style*="transform: translateX(0px)"], ' +
            '.h-full.bg-default-555[style*="transform: translate3d(0px, 0px, 0px)"], ' +
            // 兜底方案：如果上述选择器都找不到，就找第一个可见的 .question-card 的父级
            '.h-full.bg-default-555:not([style*="opacity: 0"])'
        );

        let questionElement = null;
        let optionsList = [];

        if (activeWrapper) {
            questionElement = activeWrapper.querySelector('.whitespace-pre-line');
            optionsList = activeWrapper.querySelectorAll('.select-row');
        } else {
            // 如果没有找到活跃的包装器，直接查找页面上的第一个
            console.warn('Active question wrapper not found. Falling back to general queries.');
            questionElement = document.querySelector('.whitespace-pre-line');
            optionsList = document.querySelectorAll('.select-row');
        }

        currentQuestionTextElement = questionElement; // 更新全局问题元素引用
        optionsRows = optionsList; // 更新全局选项行引用
        btns = document.querySelectorAll('button'); // 总是获取所有按钮

        console.log('Elements updated:', {
            optionsRows,
            btns,
            question: currentQuestionTextElement ? currentQuestionTextElement.innerText : 'N/A',
            activeWrapper: activeWrapper // 调试用
        });
    }

    window.onload = async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));

        // 持续等待关键DOM元素出现
        while (!document.querySelector('.select-row') || !document.querySelector('button') || !document.querySelector('.whitespace-pre-line')) {
            console.log('Waiting for essential elements...');
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // 首次加载时更新所有元素引用
        updateElements();
        console.log('Initial elements fetched.');

        // 页面刷新机制（防卡死）
        setInterval(() => {
            let cards = document.querySelectorAll('p');
            cards.forEach((card) => {
                if (card.innerText.includes('题库市场')) {
                    console.log('Detected "题库市场" card, reloading page to prevent being stuck.');
                    window.location.reload();
                }
            });
        }, 500);

        window.addEventListener('keypress', (e) => {
            const keyLower = e.key.toLowerCase();
            const targetIndex = ['q', 'w', 'e', 'r'].indexOf(keyLower);

            if (targetIndex !== -1) {
                // 检查整个选项组是否被禁用
                const optionsGroupParent = optionsRows[targetIndex]?.closest('[data-sentry-component="OptionsGroup"]');
                if (optionsGroupParent && optionsGroupParent.classList.contains('disabled')) {
                    console.log('Options group is disabled. Cannot select a new option.');
                    return;
                }

                if (optionsRows[targetIndex]) {
                    const clickableTarget = optionsRows[targetIndex].querySelector('section.content') || optionsRows[targetIndex];
                    if (clickableTarget) {
                        console.log(`Attempting to click option ${targetIndex + 1} with key '${keyLower}':`, clickableTarget);
                        simulateFullClick(clickableTarget); // 使用 simulateFullClick
                    } else {
                        console.warn(`Clickable target (section.content) not found within option row ${targetIndex + 1}.`);
                    }
                } else {
                    console.warn(`Option row for key '${keyLower}' (index ${targetIndex}) not found. There might be fewer options.`);
                }
            }

            if (e.key === ' ') {
                e.preventDefault();
                console.log('Spacebar pressed. Current buttons:', btns);

                let nextButton = null;
                let submitButton = null;

                for (let i = 0; i < btns.length; i++) {
                    const btnText = btns[i].innerText;
                    if (btnText.includes('下一题')) {
                        nextButton = btns[i];
                    }
                    if (btnText.includes('提交')) {
                        submitButton = btns[i];
                    }
                }

                if (nextButton && !nextButton.disabled) {
                    simulateFullClick(nextButton); // 使用 simulateFullClick
                    console.log('Clicked "下一题" button.');
                } else if (submitButton && !submitButton.disabled) {
                    simulateFullClick(submitButton); // 使用 simulateFullClick
                    console.log('Clicked "提交" button.');
                } else {
                    console.log('No clickable "下一题" or "提交" button found, or they are disabled.');
                }
                document.activeElement.blur();
            }
        });

        // MutationObserver 的目标是整体内容区域或包含动画的容器
        transformingContainer = document.querySelector('.h-full.bg-default-555[draggable="false"]');
        mainContentArea = document.querySelector('.flex-grow.flex.flex-col.mx-auto.w-full.max-w-lg');
        const observerTarget = mainContentArea; // 观察最外层稳定区域

        if (observerTarget) {
            let observer = new MutationObserver((mutations) => {
                let shouldUpdate = false;
                for (const mutation of mutations) {
                    // 检查是否有子节点增删，或者文本内容变化 (在题目卡片内部)
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        // 检查变化是否发生在题目相关的元素内部
                        const targetElement = mutation.target;
                        if (targetElement.closest('.question-card') || targetElement.matches('.question-card') ||
                            targetElement.closest('.select-row') || targetElement.matches('.select-row') ||
                            (currentQuestionTextElement && (targetElement === currentQuestionTextElement || currentQuestionTextElement.contains(targetElement)))) {
                            shouldUpdate = true;
                            break;
                        }
                    }
                    // 检查 transform 样式变化，因为这是题目切换的关键信号
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style' && transformingContainer && mutation.target === transformingContainer) {
                        const newTransform = mutation.target.style.transform;
                        if (newTransform && newTransform !== mutation.oldValue) {
                            console.log('Transforming container style changed. Potential question switch.');
                            shouldUpdate = true;
                            break;
                        }
                    }
                }

                if (shouldUpdate) {
                    // 添加一个短延迟，确保动画完成和DOM稳定
                    clearTimeout(window.pinnacleUpdateTimer);
                    window.pinnacleUpdateTimer = setTimeout(() => {
                        console.log('Delayed updateElements triggered.');
                        updateElements();
                    }, 200); // 200毫秒延迟，可根据动画时间调整
                }
            });

            observer.observe(observerTarget, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class'], // 监听 style 和 class 属性
                characterData: true
            });
            console.log('MutationObserver started on:', observerTarget);
        } else {
            console.warn('Neither transforming container nor main content area found for MutationObserver.');
        }
    };
})();