// ==UserScript==
// @name         老王论坛图片预览
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  在每个帖子下面显示预览图，最多5个排列在一行中
// @author       You
// @match        https://laowang.vip/forum.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538917/%E8%80%81%E7%8E%8B%E8%AE%BA%E5%9D%9B%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/538917/%E8%80%81%E7%8E%8B%E8%AE%BA%E5%9D%9B%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .image-preview-container {
            margin: 10px 0;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 5px;
            border: 1px solid #ddd;
        }

        .image-preview-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: flex-start;
        }

        .image-preview-item {
            width: calc(20% - 8px);
            min-width: 120px;
            max-width: 200px;
            position: relative;
            cursor: pointer;
            border-radius: 5px;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: transform 0.2s ease;
        }

        .image-preview-item:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .image-preview-item img {
            width: 100%;
            height: 120px;
            object-fit: cover;
            display: block;
        }

        .image-preview-loading {
            width: 100%;
            height: 120px;
            background-color: #e0e0e0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 12px;
        }

        .image-preview-error {
            width: 100%;
            height: 120px;
            background-color: #ffebee;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #c62828;
            font-size: 12px;
        }

        .image-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.8);
            cursor: pointer;
        }

        .image-modal img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }

        .image-modal-close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: white;
            font-size: 30px;
            font-weight: bold;
            cursor: pointer;
        }

        @media (max-width: 768px) {
            .image-preview-item {
                width: calc(50% - 5px);
            }
        }

        @media (max-width: 480px) {
            .image-preview-item {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);

    // 创建图片模态框
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = '<span class="image-modal-close">&times;</span>';
    document.body.appendChild(modal);

    // 模态框事件
    modal.addEventListener('click', function() {
        modal.style.display = 'none';
        const img = modal.querySelector('img');
        if (img) img.remove();
    });

    // 获取帖子内容的函数
    async function fetchThreadImages(threadUrl) {
        try {
            const response = await fetch(threadUrl);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 查找帖子内容中的图片
            const images = [];

            // 1. 查找附件图片 (主要的图片内容)
            const attachmentImages = doc.querySelectorAll('img[id^="aimg_"]');
            attachmentImages.forEach(img => {
                // 优先使用 zoomfile，然后是 file，最后是 src
                let src = img.getAttribute('zoomfile') || img.getAttribute('file') || img.src;
                if (src) {
                    // 确保URL是完整的
                    if (src.startsWith('/')) {
                        src = 'https://laowang.vip' + src;
                    } else if (src.startsWith('./')) {
                        src = threadUrl.substring(0, threadUrl.lastIndexOf('/')) + '/' + src.substring(2);
                    } else if (!src.startsWith('http')) {
                        src = 'https://laowang.vip/' + src;
                    }

                    // 避免重复添加
                    if (!images.includes(src)) {
                        images.push(src);
                    }
                }
            });

            // 2. 查找帖子正文中的其他图片 (如果附件图片不够)
            if (images.length < 5) {
                const postContent = doc.querySelectorAll('.t_f[id^="postmessage_"]');
                postContent.forEach(post => {
                    const postImages = post.querySelectorAll('img');
                    postImages.forEach(img => {
                        let src = img.src || img.getAttribute('file') || img.getAttribute('data-src');
                        if (src && !src.includes('image_s.gif') && !src.includes('common') &&
                            !src.includes('icon') && !src.includes('avatar') && !src.includes('smilies') &&
                            !src.includes('rleft.gif') && !src.includes('rright.gif')) {

                            // 确保URL是完整的
                            if (src.startsWith('/')) {
                                src = 'https://laowang.vip' + src;
                            } else if (src.startsWith('./')) {
                                src = threadUrl.substring(0, threadUrl.lastIndexOf('/')) + '/' + src.substring(2);
                            } else if (!src.startsWith('http')) {
                                src = 'https://laowang.vip/' + src;
                            }

                            // 避免重复添加
                            if (!images.includes(src)) {
                                images.push(src);
                            }
                        }
                    });
                });
            }

            return images.slice(0, 5); // 最多返回5张图片
        } catch (error) {
            console.error('获取帖子图片失败:', error);
            return [];
        }
    }

    // 创建图片预览容器
    function createImagePreview(images) {
        if (images.length === 0) return null;

        const container = document.createElement('div');
        container.className = 'image-preview-container';

        const row = document.createElement('div');
        row.className = 'image-preview-row';

        images.forEach((imageSrc) => {
            const item = document.createElement('div');
            item.className = 'image-preview-item';

            const loading = document.createElement('div');
            loading.className = 'image-preview-loading';
            loading.textContent = '加载中...';
            item.appendChild(loading);

            const img = new Image();
            img.onload = function() {
                loading.remove();
                item.appendChild(img);
            };
            img.onerror = function() {
                loading.remove();
                const error = document.createElement('div');
                error.className = 'image-preview-error';
                error.textContent = '加载失败';
                item.appendChild(error);
            };
            img.src = imageSrc;

            // 点击图片显示大图
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (img.complete && img.naturalWidth > 0) {
                    const modalImg = document.createElement('img');
                    modalImg.src = imageSrc;
                    modal.appendChild(modalImg);
                    modal.style.display = 'block';
                }
            });

            row.appendChild(item);
        });

        container.appendChild(row);
        return container;
    }

    // 添加加载指示器
    function addLoadingIndicator(thread) {
        const threadRow = thread.querySelector('tr');
        if (!threadRow) return null;

        const previewRow = document.createElement('tr');
        const previewCell = document.createElement('td');
        previewCell.colSpan = 5;
        previewCell.style.textAlign = 'center';
        previewCell.style.padding = '10px';
        previewCell.innerHTML = '<div style="color: #666; font-size: 12px;">正在加载图片预览...</div>';
        previewRow.appendChild(previewCell);
        threadRow.parentNode.insertBefore(previewRow, threadRow.nextSibling);

        return previewRow;
    }

    // 并发控制函数 - 限制同时处理的数量
    async function processWithConcurrency(tasks, concurrency = 3) {
        const results = [];
        const executing = [];

        for (const task of tasks) {
            const promise = task().then(result => {
                executing.splice(executing.indexOf(promise), 1);
                return result;
            });

            results.push(promise);
            executing.push(promise);

            if (executing.length >= concurrency) {
                await Promise.race(executing);
            }
        }

        return Promise.all(results);
    }

    // 处理单个帖子的函数
    async function processThread(thread) {
        // 检查是否有图片标识
        const hasImageIcon = thread.querySelector('img[alt="图片附件"]');
        if (!hasImageIcon) return { success: false, reason: 'no_image_icon' };

        // 获取帖子链接
        const threadLink = thread.querySelector('a.xst');
        if (!threadLink) return { success: false, reason: 'no_link' };

        const threadUrl = threadLink.href;

        // 检查是否已经添加过预览
        if (thread.querySelector('.image-preview-container')) {
            return { success: false, reason: 'already_processed' };
        }

        // 添加加载指示器
        const loadingRow = addLoadingIndicator(thread);

        try {
            // 获取图片并创建预览
            const images = await fetchThreadImages(threadUrl);
            const preview = createImagePreview(images);

            // 移除加载指示器
            if (loadingRow) {
                loadingRow.remove();
            }

            if (preview) {
                // 将预览插入到帖子行后面
                const threadRow = thread.querySelector('tr');
                if (threadRow) {
                    const previewRow = document.createElement('tr');
                    const previewCell = document.createElement('td');
                    previewCell.colSpan = 5;
                    previewCell.appendChild(preview);
                    previewRow.appendChild(previewCell);
                    threadRow.parentNode.insertBefore(previewRow, threadRow.nextSibling);
                }
                return { success: true, imageCount: images.length };
            } else {
                return { success: false, reason: 'no_images' };
            }
        } catch (error) {
            console.error('处理帖子失败:', error);
            // 移除加载指示器
            if (loadingRow) {
                loadingRow.remove();
            }
            return { success: false, reason: 'error', error };
        }
    }

    // 处理所有帖子 - 并发版本
    async function processThreads() {
        const threads = Array.from(document.querySelectorAll('tbody[id^="normalthread_"]'));
        console.log(`开始处理 ${threads.length} 个帖子，使用并发处理...`);

        // 创建任务数组
        const tasks = threads.map(thread => () => processThread(thread));

        // 并发处理，限制同时处理3个帖子
        const results = await processWithConcurrency(tasks, 3);

        // 统计结果
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        const totalImages = results.filter(r => r.success).reduce((sum, r) => sum + (r.imageCount || 0), 0);

        console.log(`图片预览处理完成！`);
        console.log(`- 成功处理: ${successful} 个帖子`);
        console.log(`- 跳过/失败: ${failed} 个帖子`);
        console.log(`- 总共加载: ${totalImages} 张图片`);

        // 显示处理结果的详细信息
        const failureReasons = {};
        results.filter(r => !r.success).forEach(r => {
            failureReasons[r.reason] = (failureReasons[r.reason] || 0) + 1;
        });

        if (Object.keys(failureReasons).length > 0) {
            console.log('跳过原因统计:', failureReasons);
        }
    }

    // 添加控制按钮
    function addControlButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;

        const button = document.createElement('button');
        button.textContent = '刷新图片预览';
        button.style.cssText = `
            padding: 8px 12px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            min-width: 120px;
        `;

        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = `
            background-color: rgba(0,0,0,0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            text-align: center;
            display: none;
            min-width: 120px;
        `;

        button.addEventListener('click', function() {
            // 移除所有现有的预览
            document.querySelectorAll('.image-preview-container').forEach(el => {
                el.closest('tr').remove();
            });

            // 显示状态
            button.textContent = '并发处理中...';
            button.disabled = true;
            statusDiv.style.display = 'block';
            statusDiv.textContent = '正在启动...';

            const startTime = Date.now();

            processThreads().then(() => {
                const endTime = Date.now();
                const duration = ((endTime - startTime) / 1000).toFixed(1);

                button.textContent = '刷新图片预览';
                button.disabled = false;
                statusDiv.textContent = `完成! 用时 ${duration}s`;

                // 3秒后隐藏状态
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, 3000);
            }).catch(error => {
                console.error('处理失败:', error);
                button.textContent = '刷新图片预览';
                button.disabled = false;
                statusDiv.textContent = '处理失败';
                statusDiv.style.backgroundColor = 'rgba(220,53,69,0.8)';

                setTimeout(() => {
                    statusDiv.style.display = 'none';
                    statusDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
                }, 3000);
            });
        });

        button.addEventListener('mouseenter', function() {
            if (!button.disabled) {
                button.style.backgroundColor = '#0056b3';
            }
        });

        button.addEventListener('mouseleave', function() {
            if (!button.disabled) {
                button.style.backgroundColor = '#007bff';
            }
        });

        buttonContainer.appendChild(button);
        buttonContainer.appendChild(statusDiv);
        document.body.appendChild(buttonContainer);
    }

    // 初始化函数
    function init() {
        console.log('老王论坛图片预览脚本已启动 (并发版本)');
        addControlButton();
        processThreads();
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
