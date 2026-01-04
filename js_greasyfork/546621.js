// ==UserScript==
// @name         即梦下载无水印原图
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  为即梦添加按钮，可以直接下载无水印原图
// @author       psdoc烛光
// @match        https://jimeng.jianying.com/*
// @icon         https://favicon.im/jimeng.jianying.com?larger=true&t=1755764200795
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546621/%E5%8D%B3%E6%A2%A6%E4%B8%8B%E8%BD%BD%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/546621/%E5%8D%B3%E6%A2%A6%E4%B8%8B%E8%BD%BD%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量，存储观察者实例
    let globalObserver = null;
    let retryCount = 0;
    const MAX_RETRY = 5;
    const RETRY_DELAY = 100; // 重试间隔

    /**
     * 等待DOM加载完成后解析
     * @returns {Promise} - 返回一个Promise，表示DOM加载完成的状态
     */
    function waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                resolve();
            } else {
                document.addEventListener('DOMContentLoaded', resolve);
            }
        });
    }

    /**
     * 等待目标容器出现
     * @param {string} selector - 目标容器的CSS选择器
     * @param {number} timeout - 超时时间（毫秒）
     * @returns {Promise<Element>} - 返回找到的元素
     */
    function waitForElement(selector, timeout = 1000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations) => {
                const targetElement = document.querySelector(selector);
                if (targetElement) {
                    observer.disconnect();
                    resolve(targetElement);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 设置超时
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`等待元素 ${selector} 超时`));
            }, timeout);
        });
    }

    /**
     * 创建操作区域内的下载原图按钮
     * @returns {HTMLDivElement} - 返回创建好的下载按钮元素
     */
    function createOperationAreaDownloadButton() {
        const button = document.createElement('div');
        button.tabIndex = 0;
        button.className = 'operation-button-PU0Wce';
        button.innerHTML = `<svg width="1em" height="1em" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" fill="none" role="presentation" xmlns="http://www.w3.org/2000/svg" class="operation-icon-q9NsDV"><g><path data-follow-fill="currentColor" d="M12 2a1 1 0 0 1 1 1v10.312l4.023-4.021a1 1 0 0 1 1.414 1.414l-5.73 5.728a1 1 0 0 1-1.414 0l-5.73-5.728A1 1 0 1 1 6.977 9.29L11 13.312V3a1 1 0 0 1 1-1ZM3 20.002a1 1 0 0 1 1-1L20 19a1 1 0 0 1 0 2l-16 .002a1 1 0 0 1-1-1Z" clip-rule="evenodd" fill-rule="evenodd" fill="currentColor"></path></g></svg>
            <span>下载原图</span>`;

        // 添加点击事件
        button.addEventListener('click', function() {
            downloadOriginalImage();
        });

        return button;
    }

    /**
     * 创建原有的下载原图按钮
     * @returns {HTMLDivElement} - 返回创建好的下载按钮元素
     */
    function createDownloadButton() {
        const button = document.createElement('div');
        button.tabIndex = 0;
        button.className = 'operation-button-PU0Wce';
        button.innerHTML = `<svg width="1em" height="1em" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" fill="none" role="presentation" xmlns="http://www.w3.org/2000/svg" class="operation-icon-q9NsDV"><g><path data-follow-fill="currentColor" d="M12 2a1 1 0 0 1 1 1v10.312l4.023-4.021a1 1 0 0 1 1.414 1.414l-5.73 5.728a1 1 0 0 1-1.414 0l-5.73-5.728A1 1 0 1 1 6.977 9.29L11 13.312V3a1 1 0 0 1 1-1ZM3 20.002a1 1 0 0 1 1-1L20 19a1 1 0 0 1 0 2l-16 .002a1 1 0 0 1-1-1Z" clip-rule="evenodd" fill-rule="evenodd" fill="currentColor"></path></g></svg>
            <span>下载原图</span>`;

        // 添加点击事件
        button.addEventListener('click', function() {
            downloadOriginalImage();
        });

        return button;
    }

    /**
     * 获取当前选中的图片元素
     * @returns {HTMLImageElement|null} - 返回当前选中的图片元素，如果找不到则返回null
     */
    function getCurrentSelectedImage() {
        // 首先尝试查找当前激活的图片容器中的图片
        const activeImageContainer = document.querySelector('.image-container.active, .image-item.selected, [class*="active"], [class*="selected"]');
        if (activeImageContainer) {
            const imageInContainer = activeImageContainer.querySelector('img[crossorigin="anonymous"]');
            // 检查图片是否在avatar容器内，如果是则跳过
            if (imageInContainer && !imageInContainer.closest('.avatar-container-UQ4YgV')) {
                console.log('通过活动容器找到图片:', imageInContainer.src);
                return imageInContainer;
            }
        }

        // 备用方案：查找所有符合条件的图片，排除avatar容器内的图片
        const allImages = document.querySelectorAll('img[crossorigin="anonymous"]');
        const filteredImages = Array.from(allImages).filter(img => !img.closest('.avatar-container-UQ4YgV'));

        if (filteredImages.length > 0) {
            // 优先查找带有特定属性的图片
            const specificImage = filteredImages.find(img => img.hasAttribute('data-apm-action') && img.getAttribute('data-apm-action') === 'ai-generated-image-detail-card');
            if (specificImage) {
                console.log('找到特定属性图片:', specificImage.src);
                return specificImage;
            }

            // 如果没有特定属性的图片，返回第一个符合条件的图片
            console.log('使用第一个符合条件的图片:', filteredImages[0].src);
            return filteredImages[0];
        }

        console.log('未找到任何符合条件的图片');
        return null;
    }

    /**
     * 创建在新标签页打开原图的按钮
     * @returns {HTMLDivElement} - 返回创建好的按钮元素
     */
    function createEmptyButton() {
        const button = document.createElement('div');
        button.tabIndex = 0;
        button.className = 'operation-button-PU0Wce';
        button.innerHTML = `<svg width="1em" height="1em" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" fill="none" role="presentation" xmlns="http://www.w3.org/2000/svg" class="operation-icon-q9NsDV"><g><path data-follow-fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" fill="currentColor"></path></g></svg>
            <span>打开原图</span>`;

        // 添加点击事件，在新标签页打开原图
        button.addEventListener('click', function() {
            const targetImage = getCurrentSelectedImage();

            if (targetImage && targetImage.src) {
                console.log('找到目标图片，URL:', targetImage.src);
                // 在新标签页打开图片
                window.open(targetImage.src, '_blank');
            } else {
                alert('未找到可查看的图片');
            }
        });

        return button;
    }

    /**
     * 下载原图功能
     */
    function downloadOriginalImage() {
        const targetImage = getCurrentSelectedImage();

        if (targetImage && targetImage.src) {
            console.log('找到目标图片，准备下载，URL:', targetImage.src);
            const imageUrl = targetImage.src;
            const imageName = imageUrl.split('/').pop().split('?')[0] || 'downloaded_image';

            try {
                // 使用GM_download下载图片
                GM_download({
                    url: imageUrl,
                    name: imageName,
                    saveAs: true,
                    onerror: function(error) {
                        console.error('下载失败:', error);
                        alert('下载失败，请重试');
                    },
                    onprogress: function(progress) {
                        console.log('下载进度:', progress);
                    }
                });
            } catch (error) {
                console.error('GM_download调用失败:', error);
                alert('下载功能不可用，请检查Tampermonkey设置');
            }
        } else {
            alert('未找到可下载的图片');
        }
    }

    /**
     * 将按钮添加到目标容器
     * @param {HTMLDivElement} button - 要添加的按钮元素
     * @param {string} targetSelector - 目标容器的CSS选择器
     * @returns {boolean} - 添加成功返回true，否则返回false
     */
    function addButtonToTarget(button, targetSelector) {
        const targetContainer = document.querySelector(targetSelector);

        if (targetContainer) {
            // 检查是否已经存在相同的按钮
            const existingButtons = targetContainer.querySelectorAll('.operation-button-PU0Wce');
            for (let existingBtn of existingButtons) {
                if (existingBtn.textContent === button.textContent) {
                    console.log('按钮已存在，跳过添加');
                    return true;
                }
            }

            targetContainer.appendChild(button);
            console.log('成功添加按钮到容器');
            return true;
        } else {
            console.log(`未找到目标容器 ${targetSelector}`);
            return false;
        }
    }

    /**
     * 修改目标容器样式为两行布局
     * @param {string} targetSelector - 目标容器的CSS选择器
     */
    function modifyContainerLayout(targetSelector) {
        const targetContainer = document.querySelector(targetSelector);

        if (targetContainer) {
            // 添加内联样式使容器变成两行布局，宽度自适应
            targetContainer.style.display = 'flex';
            targetContainer.style.flexWrap = 'wrap';
            targetContainer.style.maxHeight = '80px'; // 根据需要调整高度
            targetContainer.style.width = 'fit-content'; // 宽度自适应
            targetContainer.style.alignItems = 'flex-start';

            console.log('成功修改容器布局为两行');
        } else {
            console.log(`未找到目标容器 ${targetSelector}`);
        }
    }

    /**
     * 在操作区域添加下载按钮
     * @param {string} operationAreaSelector - 操作区域的CSS选择器
     * @returns {boolean} - 添加成功返回true，否则返回false
     */
    async function addButtonToOperationArea(operationAreaSelector) {
        try {
            // 等待操作区域出现
            const operationArea = await waitForElement(operationAreaSelector);

            if (operationArea) {
                // 检查是否已经存在相同的按钮
                const existingButtons = operationArea.querySelectorAll('.operation-button-PU0Wce');
                for (let existingBtn of existingButtons) {
                    if (existingBtn.textContent.trim() === '下载原图') {
                        console.log('操作区域下载按钮已存在，跳过添加');
                        return true;
                    }
                }

                // 创建下载按钮
                const operationAreaButton = createOperationAreaDownloadButton();

                // 根据容器内元素的排列顺序找到合适的插入位置
                const publishButton = operationArea.querySelector('.publish-button-LkMPnt');
                const operationButtons = operationArea.querySelector('.operation-buttons-H5Rhlq');

                // 隐藏发布按钮
                if (publishButton) {
                    publishButton.style.display = 'none';
                    console.log('已隐藏发布按钮');
                }

                if (publishButton && operationButtons) {
                    // 如果发布按钮和操作按钮容器都存在，将下载按钮插入到它们之间
                    operationArea.insertBefore(operationAreaButton, operationButtons);
                    console.log('成功在发布按钮和操作按钮容器之间插入下载按钮');
                } else if (publishButton) {
                    // 如果只有发布按钮，将下载按钮插入到发布按钮之后
                    publishButton.parentNode.insertBefore(operationAreaButton, publishButton.nextSibling);
                    console.log('成功在发布按钮之后插入下载按钮');
                } else if (operationButtons) {
                    // 如果只有操作按钮容器，将下载按钮插入到操作按钮容器之前
                    operationArea.insertBefore(operationAreaButton, operationButtons);
                    console.log('成功在操作按钮容器之前插入下载按钮');
                } else {
                    // 如果都没有，直接添加到容器末尾
                    operationArea.appendChild(operationAreaButton);
                    console.log('成功在操作区域末尾添加下载按钮');
                }

                return true;
            }
        } catch (error) {
            console.error('在操作区域添加按钮失败:', error);
            return false;
        }
    }

    /**
     * 初始化按钮和布局
     * @param {string} targetSelector - 目标容器的CSS选择器
     * @param {string} operationAreaSelector - 操作区域的CSS选择器
     */
    async function initializeButtons(targetSelector, operationAreaSelector) {
        try {
            // 等待目标容器出现
            await waitForElement(targetSelector);
            console.log('目标容器已找到，开始初始化');

            // 修改容器布局
            modifyContainerLayout(targetSelector);

            // 创建并添加按钮
            const downloadButton = createDownloadButton();
            const emptyButton = createEmptyButton();

            const addedDownload = addButtonToTarget(downloadButton, targetSelector);
            const addedEmpty = addButtonToTarget(emptyButton, targetSelector);

            // 在操作区域添加下载按钮
            const addedOperationAreaButton = await addButtonToOperationArea(operationAreaSelector);

            if (addedDownload && addedEmpty && addedOperationAreaButton) {
                console.log('所有按钮初始化成功');
                retryCount = 0; // 重置重试计数
                return true;
            } else {
                console.log('部分按钮初始化失败');
                return false;
            }
        } catch (error) {
            console.error('初始化按钮失败:', error);
            return false;
        }
    }

    /**
     * 设置全局MutationObserver来监控DOM变化
     * 用于处理单页应用的页面切换
     * @param {string} targetSelector - 目标容器的CSS选择器
     * @param {string} operationAreaSelector - 操作区域的CSS选择器
     */
    function setupGlobalObserver(targetSelector, operationAreaSelector) {
        // 如果已经存在观察者，先断开
        if (globalObserver) {
            globalObserver.disconnect();
        }

        globalObserver = new MutationObserver((mutations) => {
            // 检查是否有目标容器的变化
            const targetContainer = document.querySelector(targetSelector);
            if (targetContainer) {
                // 检查容器中是否已经有我们的按钮
                const existingButtons = targetContainer.querySelectorAll('.operation-button-PU0Wce');
                if (existingButtons.length === 0) {
                    console.log('检测到容器变化但缺少按钮，重新初始化');
                    initializeButtons(targetSelector, operationAreaSelector);
                }
            }

            // 检查操作区域是否缺少按钮
            const operationArea = document.querySelector(operationAreaSelector);
            if (operationArea) {
                const operationAreaButtons = operationArea.querySelectorAll('.operation-button-PU0Wce');
                let hasDownloadButton = false;
                for (let btn of operationAreaButtons) {
                    if (btn.textContent.trim() === '下载原图') {
                        hasDownloadButton = true;
                        break;
                    }
                }
                if (!hasDownloadButton) {
                    console.log('检测到操作区域变化但缺少下载按钮，重新添加');
                    addButtonToOperationArea(operationAreaSelector);
                }
            }
        });

        // 开始观察DOM变化
        globalObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        console.log('全局DOM观察者已启动');
    }

    /**
     * 重试初始化机制
     * @param {string} targetSelector - 目标容器的CSS选择器
     * @param {string} operationAreaSelector - 操作区域的CSS选择器
     */
    async function retryInitialization(targetSelector, operationAreaSelector) {
        if (retryCount >= MAX_RETRY) {
            console.log('已达到最大重试次数，停止重试');
            return;
        }

        retryCount++;
        console.log(`第 ${retryCount} 次重试初始化`);

        setTimeout(async () => {
            const success = await initializeButtons(targetSelector, operationAreaSelector);
            if (!success) {
                retryInitialization(targetSelector, operationAreaSelector);
            }
        }, RETRY_DELAY);
    }

    // 主函数
    /**
     * 脚本主函数，协调整个功能的执行
     */
    async function main() {
        await waitForDOM();

        // 目标容器选择器
        const targetSelector = '.action-buttons-wrapper-v1aogC';
        // 操作区域选择器（红框位置）
        const operationAreaSelector = '.operation-area-Kuc_sT';

        console.log('脚本开始执行');

        // 首次初始化
        const success = await initializeButtons(targetSelector, operationAreaSelector);

        if (!success) {
            console.log('首次初始化失败，启动重试机制');
            retryInitialization(targetSelector, operationAreaSelector);
        }

        // 设置全局观察者
        setupGlobalObserver(targetSelector, operationAreaSelector);

        // 监听路由变化（针对单页应用）
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                console.log('检测到URL变化，重新初始化按钮');
                setTimeout(() => {
                    initializeButtons(targetSelector, operationAreaSelector);
                }, 1000); // 延迟1秒等待DOM更新
            }
        }).observe(document, { subtree: true, childList: true });

        console.log('脚本初始化完成');
    }

    // 执行主函数
    main();
})();