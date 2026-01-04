// ==UserScript==
// @name        豆包下载无水印
// @namespace    https://github.com/xiaowang96-github/doubaoNowatermark
// @version      1.32
// @description  尝试从豆包下载不带水印的大图
// @author       xiaowang
// @match        *://www.doubao.com/*
// @grant        none
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/530777/%E8%B1%86%E5%8C%85%E4%B8%8B%E8%BD%BD%E6%97%A0%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/530777/%E8%B1%86%E5%8C%85%E4%B8%8B%E8%BD%BD%E6%97%A0%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待页面完全加载
    window.addEventListener('load', function () {
        console.log('页面已加载');

        // 移除下载无水印图按钮的函数
        function removeDownloadNoWatermarkButton(container) {
            if (!container) {
                return;
            }
            const targetDiv = container.querySelector('.right-HSiTKj');
            if (targetDiv) {
                const button = targetDiv.querySelector('#download_no_watermark_button');
                if (button) {
                    targetDiv.removeChild(button);
                    console.log('下载无水印图按钮已移除');
                }
            }
        }

        const observerCanvasWrapper = new MutationObserver((mutations) => {
            for (const mut of mutations) {
                if (mut.type === 'childList' || (mut.type === 'attributes' && mut.attributeName === 'data-visible')) {
                    const canvasWrappers =  document.querySelectorAll('div[data-testid="canvas_panel_container"]');
                    console.log('开始处理canvas_panel_container 元素');
                    console.log('找到的 canvas_panel_container 元素数量:', canvasWrappers.length);

                    canvasWrappers.forEach(canvasWrapper => {
                        console.log('当前 canvasWrapper 的 data-visible 值:', canvasWrapper.dataset.visible);
                        console.log('当前 canvasWrapper 的 data-processed 值:', canvasWrapper.dataset.processed);

                        if (canvasWrapper.dataset.visible === 'true' && !canvasWrapper.dataset.processed) {
                            canvasWrapper.dataset.processed = 'true'; // 标记该元素已处理
                            addDownloadNoWatermarkButton(canvasWrapper);
                        } else if (canvasWrapper.dataset.visible !== 'true' && canvasWrapper.dataset.processed) {
                            // 当元素不可见时，移除按钮并清除标记
                            removeDownloadNoWatermarkButton(canvasWrapper);
                            delete canvasWrapper.dataset.processed;
                        }
                    });
                }
            }
        });

        observerCanvasWrapper.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-visible']
        });


        const observerCloseButton = new MutationObserver((mutations) => {
            for (const mut of mutations) {
                if (mut.type === 'childList') {
                    const closeButton = document.querySelector('[data-testid="edit_image_close_button"]');
                    if (closeButton) {
                        closeButton.addEventListener('click', () => {

                            const canvasWrappers =  document.querySelectorAll('div[data-testid="canvas_panel_container"]');
                            canvasWrappers.forEach(canvasWrapper => {
                                delete canvasWrapper.dataset.processed;
                            });
                        });
                    }
                }
            }
        });

        observerCloseButton.observe(document.body, { childList: true, subtree: true });


        document.addEventListener('click', function (event) {
            if (event.target && event.target.closest('#download_no_watermark_button')) {
                const imageContainer = document.querySelector('div[data-testid="canvas_panel_container"][data-visible="true"]');
                if (!imageContainer) {
                    return;
                }

                const imgElementin = imageContainer.querySelector('img[data-testid="in_painting_picture"]');
                let imageUrl = imgElementin.src;
                async function downloadFile(url, filename) {
                    try {
                        const response = await fetch(url);
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        const blob = await response.blob();
                        const objectUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = objectUrl;
                        a.download = filename;
                        a.click();
                        URL.revokeObjectURL(objectUrl);
                    } catch (error) {
                        console.error('下载失败:', error);
                    }
                }

                downloadFile(imageUrl, "imageorgin.png");

                console.log('正在下载大图:', imageUrl);

                // 阻止默认行为
                event.preventDefault();
            }
        });
    });

    function addDownloadNoWatermarkButton(container) {
        try {
            // 检查 container 是否存在
            if (!container) {
                console.error('传入的 container 不存在');
                return;
            }

            const MAX_RETRIES = 5; // 最大重试次数
            const RETRY_INTERVAL = 500; // 重试间隔，单位：毫秒
            let retries = 0;

            function tryFindTargetDiv() {
                // 找到 .right-dVuO4Z 元素
                const targetDiv = container.querySelector('.right-HSiTKj');
                if (targetDiv) {
                    // 检查目标父元素是否还在文档中
                    if (!document.body.contains(targetDiv)) {
                        console.error('目标父元素已不在文档中');
                        return;
                    }

                    // 创建新的下载无水印图按钮
                    const newButton = document.createElement('div');
                    newButton.className = 'right-label-btn-wrapper-ryo3eC hover-BfK9He';
                    newButton.id = 'download_no_watermark_button';

                    // 创建 SVG 图标
                    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    svgIcon.setAttribute("width", "1em");
                    svgIcon.setAttribute("height", "1em");
                    svgIcon.setAttribute("fill", "none");
                    svgIcon.setAttribute("viewBox", "0 0 24 24");

                    // 创建 SVG 路径
                    const pathIcon = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    pathIcon.setAttribute("fill", "currentColor");
                    pathIcon.setAttribute("d", "M20.207 12.707a1 1 0 0 0-1.414-1.414L13 17.086V2.5a1 1 0 1 0-2 0v14.586l-5.793-5.793a1 1 0 0 0-1.414 1.414l7.5 7.5c.195.195.45.293.706.293H4a1 1 0 1 0 0 2h16a1 1 0 1 0 0-2h-7.999a1 1 0 0 0 .706-.293z");

                    // 将路径添加到 SVG 中
                    svgIcon.appendChild(pathIcon);

                    // 将 SVG 添加到按钮中
                    newButton.appendChild(svgIcon);

                    // 创建按钮文本标签
                    const spanLabel = document.createElement('span');
                    spanLabel.className = 'btn-label-mw0QhY';
                    spanLabel.textContent = '下载无水印图';
                    // 将文本标签添加到按钮中
                    newButton.appendChild(spanLabel);

                    // 将新按钮添加到文档中
                    targetDiv.appendChild(newButton);

                    console.log('下载无水印图按钮已添加');
                } else if (retries < MAX_RETRIES) {
                    retries++;
                    setTimeout(tryFindTargetDiv, RETRY_INTERVAL);
                } else {
                    console.error('经过多次尝试，仍未找到具有 right-dVuO4Z 类名的元素');
                }
            }

            tryFindTargetDiv();
        } catch (error) {
            console.error('addDownloadNoWatermarkButton 函数出错:', error);
        }
    }
})();


