// ==UserScript==
// @name         欲神的任务网页布局调整
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  调整页面布局，包括调整文本框左边距，文字大小粗细默认值，立绘大小默认值，立绘右移距离
// @author       Aleiluo
// @include      /^https:\/\/taskofdeity\..+\..+\/.*$/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539964/%E6%AC%B2%E7%A5%9E%E7%9A%84%E4%BB%BB%E5%8A%A1%E7%BD%91%E9%A1%B5%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/539964/%E6%AC%B2%E7%A5%9E%E7%9A%84%E4%BB%BB%E5%8A%A1%E7%BD%91%E9%A1%B5%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置变量 - 方便修改
    const CONFIG = {
        // 故事容器配置
        STORY_LEFT_MARGIN_PERCENT: 30,     // 故事容器左边距（页面宽度百分比）
        STORY_WIDTH_PERCENT: 60,           // 故事容器宽度（页面宽度百分比）

        // 滑条默认值配置
        CHAR_SIZE_DEFAULT: 500,            // 立绘大小默认值
        FONT_SIZE_DEFAULT: 120,            // 文字大小默认值
        FONT_WEIGHT_DEFAULT: 350,          // 文字粗细默认值

        // 元素右移配置
        BTN_CHAR_WIN_RIGHT_OFFSET: 110,    // btn_char_win元素向右移动的距离（像素）
        STAT_MAIN_RIGHT_OFFSET: 200,       // stat_main元素向右移动的距离（像素）
    };

    // 等待元素出现的辅助函数
    function waitForElement(selector, callback, timeout = 10000) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            return;
        }

        const startTime = Date.now();
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                obs.disconnect();
                console.log(`Timeout waiting for element: ${selector}`);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 1. 调整故事容器位置和宽度
    function adjustStoryContainer() {
        waitForElement('#story.container', (storyDiv) => {
            // 只设置必要的样式
            storyDiv.style.marginLeft = `${CONFIG.STORY_LEFT_MARGIN_PERCENT}%`;
            storyDiv.style.width = `${CONFIG.STORY_WIDTH_PERCENT}%`;

            console.log('Story container adjusted');
        });
    }

    // 2. 关闭所有dropdown（排除btn_char、stat_menu_details和insert_map内的dropdown）
    function closeDropdowns() {
        const excludeIds = ['btn_char', 'stat_menu_details'];

        // 查找所有打开的dropdown并关闭（除了排除列表中的）
        const allOpenDropdowns = document.querySelectorAll('details.dropdown[open]');
        allOpenDropdowns.forEach(element => {
            // 检查是否在排除的id列表中
            if (excludeIds.includes(element.id)) {
                return;
            }

            // 检查是否是insert_map内的dropdown
            if (element.closest('#insert_map')) {
                return;
            }

            element.removeAttribute('open');
            console.log(`Closed dropdown: ${element.id || element.className}`);
        });
    }

    // 3. 设置滑条默认值
    function setSliderDefaults() {
        // 设置立绘大小
        waitForElement('#slider-charSize', (slider) => {
            slider.value = CONFIG.CHAR_SIZE_DEFAULT;
            // 触发change事件以应用设置
            slider.dispatchEvent(new Event('input', { bubbles: true }));
            slider.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`Character size set to: ${CONFIG.CHAR_SIZE_DEFAULT}`);

            // 更新显示值
            const valueDisplay = document.querySelector('#slider-charSize-value');
            if (valueDisplay) {
                valueDisplay.textContent = CONFIG.CHAR_SIZE_DEFAULT;
            }
        });

        // 设置文字大小
        waitForElement('#slider-fontsize', (slider) => {
            slider.value = CONFIG.FONT_SIZE_DEFAULT;
            // 触发change事件以应用设置
            slider.dispatchEvent(new Event('input', { bubbles: true }));
            slider.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`Font size set to: ${CONFIG.FONT_SIZE_DEFAULT}`);

            // 更新显示值
            const valueDisplay = document.querySelector('#slider-fontsize-value');
            if (valueDisplay) {
                valueDisplay.textContent = CONFIG.FONT_SIZE_DEFAULT;
            }
        });

        // 设置文字粗细
        waitForElement('#slider-fontweight', (slider) => {
            slider.value = CONFIG.FONT_WEIGHT_DEFAULT;
            // 触发change事件以应用设置
            slider.dispatchEvent(new Event('input', { bubbles: true }));
            slider.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`Font weight set to: ${CONFIG.FONT_WEIGHT_DEFAULT}`);

            // 更新显示值
            const valueDisplay = document.querySelector('#slider-fontweight-value');
            if (valueDisplay) {
                valueDisplay.textContent = CONFIG.FONT_WEIGHT_DEFAULT;
            }
        });
    }

    // 4. 调整指定元素的位置（向右平移）
    function adjustElementsPosition() {
        // 调整btn_char_win元素
        waitForElement('#btn_char_win', (element) => {
            // 获取当前的right值
            const computedStyle = getComputedStyle(element);
            let currentRight = computedStyle.right;

            // 如果right值是百分比或其他单位，需要转换
            if (currentRight.includes('%')) {
                // 保持原有的百分比设置，但添加额外的像素偏移
                element.style.right = `calc(${currentRight} + ${CONFIG.BTN_CHAR_WIN_RIGHT_OFFSET}px)`;
            } else {
                // 如果是像素值，直接减去偏移量
                const currentRightPx = parseInt(currentRight) || 0;
                element.style.right = `${currentRightPx - CONFIG.BTN_CHAR_WIN_RIGHT_OFFSET}px`;
            }

            console.log(`btn_char_win position adjusted by ${CONFIG.BTN_CHAR_WIN_RIGHT_OFFSET}px to the right`);
        });

        // 调整stat_main元素
        waitForElement('#stat_main', (element) => {
            // 获取当前的right值
            const computedStyle = getComputedStyle(element);
            let currentRight = computedStyle.right;

            // 如果right值是CSS变量或其他复杂值
            if (currentRight.includes('var(') || currentRight.includes('calc(')) {
                // 包装在calc中添加偏移
                element.style.right = `calc(${currentRight} + ${CONFIG.STAT_MAIN_RIGHT_OFFSET}px)`;
            } else if (currentRight.includes('%')) {
                // 百分比值处理
                element.style.right = `calc(${currentRight} + ${CONFIG.STAT_MAIN_RIGHT_OFFSET}px)`;
            } else {
                // 像素值处理
                const currentRightPx = parseInt(currentRight) || 0;
                element.style.right = `${currentRightPx - CONFIG.STAT_MAIN_RIGHT_OFFSET}px`;
            }

            console.log(`stat_main position adjusted by ${CONFIG.STAT_MAIN_RIGHT_OFFSET}px to the right`);
        });
    }

    // 5. 监听读档操作
    function setupLoadGameListener() {
        // 使用事件委托监听读档按钮点击
        document.addEventListener('click', function(event) {
            // 检查点击的元素是否是读档按钮
            if (event.target && event.target.classList.contains('loadSlot')) {
                console.log('检测到读档操作，准备关闭dropdown');

                // 延迟执行关闭操作，给读档操作一些时间完成
                setTimeout(() => {
                    closeDropdowns();
                    console.log('读档后已关闭dropdown');
                }, 1000);
            }
        });

        // 额外的监听方式：监听读档容器的变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // 如果读档容器从显示变为隐藏，说明可能进行了读档操作
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'style' &&
                    mutation.target.id === 'loadContainer') {

                    const loadContainer = mutation.target;
                    // 检查是否从显示状态变为隐藏状态
                    if (loadContainer.style.display === 'none' ||
                        !loadContainer.style.display &&
                        getComputedStyle(loadContainer).display === 'none') {

                        console.log('读档界面关闭，可能进行了读档操作');
                        setTimeout(() => {
                            closeDropdowns();
                            console.log('读档界面关闭后已关闭dropdown');
                        }, 500);
                    }
                }
            });
        });

        // 等待读档容器出现后开始监听
        waitForElement('#loadContainer', (loadContainer) => {
            observer.observe(loadContainer, {
                attributes: true,
                attributeFilter: ['style']
            });
            console.log('读档监听器已设置');
        });
    }

    // 主初始化函数
    function init() {
        console.log('欲神的任务网页布局调整脚本开始运行');

        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(() => {
                    adjustStoryContainer();
                    closeDropdowns();
                    setSliderDefaults();      // 设置滑条默认值
                    adjustElementsPosition(); // 调整元素位置
                    setupLoadGameListener();
                }, 500);
            });
        } else {
            setTimeout(() => {
                adjustStoryContainer();
                closeDropdowns();
                setSliderDefaults();      // 设置滑条默认值
                adjustElementsPosition(); // 调整元素位置
                setupLoadGameListener();
            }, 500);
        }

        // 监听页面变化，确保在动态加载内容后也能正常工作
        const observer = new MutationObserver((mutations) => {
            let shouldReapplySliders = false;
            let shouldReapplyPosition = false;

            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            // 检查是否需要重新设置滑条
                            if (node.id && ['slider-charSize', 'slider-fontsize', 'slider-fontweight'].includes(node.id) ||
                                node.querySelector && ['#slider-charSize', '#slider-fontsize', '#slider-fontweight'].some(sel => node.querySelector(sel))) {
                                shouldReapplySliders = true;
                            }

                            // 检查是否需要重新调整位置
                            if (node.id === 'btn_char_win' || node.id === 'stat_main' ||
                                node.querySelector && (node.querySelector('#btn_char_win') || node.querySelector('#stat_main'))) {
                                shouldReapplyPosition = true;
                            }
                        }
                    });
                }
            });

            if (shouldReapplySliders) {
                setTimeout(() => {
                    setSliderDefaults();
                }, 100);
            }

            if (shouldReapplyPosition) {
                setTimeout(() => {
                    adjustElementsPosition();
                }, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 启动脚本
    init();
})();
