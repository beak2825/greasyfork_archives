// ==UserScript==
// @name         预览Elsevier中的图片
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  提取ScienceDirect页面上以 .jpg 结尾的图片，左侧显示所有缩略图，点击缩略图才在中间显示主图并更新序号，按下 Esc 键关闭主图，等待页面完全加载后再执行
// @author       Pencilheart
// @match        https://www.sciencedirect.com/science/article/pii/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSJyZWQiIGQ9Ik0xMiAyMS4zNWwtMS40NS0xLjMyQzUuNCAxNS4zNiAyIDEyLjI4IDIgOC41IDIgNS40MiA0LjQyIDMgNy41IDNjMS43NCAwIDMuNDEuODEgNC41IDIuMDlDMTMuMDkgMy44MSAxNC43NiAzIDE2LjUgMyAxOS41OCAzIDIyIDUuNDIgMjIgOC41YzAgMy43OC0zLjQgNi44Ni04LjU1IDExLjU0TDEyIDIxLjM1eiIvPjwvc3ZnPg==
// @grant        GM_addStyle
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/528744/%E9%A2%84%E8%A7%88Elsevier%E4%B8%AD%E7%9A%84%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/528744/%E9%A2%84%E8%A7%88Elsevier%E4%B8%AD%E7%9A%84%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载
    function waitForPageLoad() {
        if (document.readyState === 'complete') {
            init();
        } else {
            setTimeout(waitForPageLoad, 1000); // 如果页面尚未加载完成，继续等待
        }
    }

    // 页面加载完成后初始化脚本
    function init() {
        setTimeout(() => {
            // 获取页面中的所有 <figure> 元素，并从中提取所有 <img> 标签的 src
            const images = Array.from(document.querySelectorAll('figure img'))
                .map(img => img.src) // 获取所有 <img> 的 src
                .filter(src => src); // 确保 src 不为空

            // 防止重复或无效图片
            const uniqueImages = [...new Set(images)];

            // 获取页面中的所有 Fig. X 标签
            const figLabels = Array.from(document.querySelectorAll('.label'))
                .map(el => el.innerText.trim())
                .filter(text => text.startsWith('Fig.'));

            // 如果图片数量与 Fig. 数量不一致，移除第一张图片
            if (uniqueImages.length == figLabels.length +1) {
                uniqueImages.shift();  // 移除第一张图片
            }

            let currentImageIndex = null;  // 初始时不显示任何主图

            // 查找或创建图片显示容器
            let imageContainer = document.getElementById('image-container');
            let thumbnailContainer = document.getElementById('thumbnail-container');
            if (!imageContainer) {
                // 如果容器不存在，创建一个新的容器
                imageContainer = document.createElement('div');
                imageContainer.id = 'image-container';  // 设置唯一 ID
                imageContainer.style.position = 'fixed';
                imageContainer.style.top = '50%';
                imageContainer.style.left = '50%';
                imageContainer.style.transform = 'translate(-50%, -50%)';
                imageContainer.style.zIndex = '10000';
                imageContainer.style.backgroundColor = 'white';
                imageContainer.style.padding = '20px';
                imageContainer.style.borderRadius = '8px';
                imageContainer.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)';
                imageContainer.style.textAlign = 'center';
                imageContainer.style.display = 'none'; // 初始时不显示主图
                imageContainer.style.maxWidth = '80vw'; // 最大宽度
                document.body.appendChild(imageContainer);

                // 创建缩略图容器
                thumbnailContainer = document.createElement('div');
                thumbnailContainer.id = 'thumbnail-container';
                thumbnailContainer.style.position = 'fixed';
                thumbnailContainer.style.top = '50%';
                thumbnailContainer.style.left = '10px';
                thumbnailContainer.style.transform = 'translateY(-50%)';
                thumbnailContainer.style.zIndex = '10000';
                thumbnailContainer.style.maxHeight = '80vh';
                thumbnailContainer.style.overflowY = 'auto';
                thumbnailContainer.style.textAlign = 'center';
                thumbnailContainer.style.display = 'grid';
                thumbnailContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
                thumbnailContainer.style.gap = '10px';
                document.body.appendChild(thumbnailContainer);
            }

            // 添加样式
            GM_addStyle(`
                .image-index {
                    font-size: 14px;
                    color: #333;
                    margin-top: 10px;
                }
                .thumbnail {
                    width: auto;
                    height: auto;
                    max-width: 100px;
                    max-height: 100px;
                    cursor: pointer;
                    object-fit: contain;
                    border: 2px solid transparent;
                    transition: border-color 0.3s;
                }
                .thumbnail:hover {
                    border-color: #007bff;
                }
            `);

            // 创建并显示图片和控制按钮
            function updateContainer(index) {
                currentImageIndex = index;

                // 显示图片容器
                imageContainer.style.display = 'block';

                // 清空容器内容
                imageContainer.innerHTML = '';

                // 添加主图
                const imgElement = document.createElement('img');
                imgElement.src = uniqueImages[currentImageIndex];
                imgElement.style.maxWidth = '100%';  // 让图片宽度最大为容器宽度
                imgElement.style.maxHeight = '80vh'; // 最大高度
                imgElement.style.margin = '0 auto';  // 水平居中
                imgElement.style.display = 'block';  // 确保是块级元素，便于居中
                imageContainer.appendChild(imgElement);

                // 获取图片序号对应的 Fig. X（X 为序号）并查找相应的 .label 元素的父级
                let labelText = '';
                let figNumber = currentImageIndex + 1;  // 图片序号，从1开始（index从0开始，所以 +1）

                // 查找所有 class="label" 的元素，找到对应的 Fig. X 标签
                let labelElements = document.querySelectorAll('.label');
                labelElements.forEach(el => {
                    if (el.innerText.trim() === `Fig. ${figNumber}`) {
                        // 获取该 .label 元素的父元素
                        let parentElement = el.parentElement;
                        if (parentElement) {
                            labelText = parentElement.innerText.trim();  // 获取父元素的文本
                        }
                    }
                });

                // 如果没有找到对应的 label 元素
                if (!labelText) {
                    console.log(`未找到对应的 label 父级元素: Fig. ${figNumber}`);
                }

                // 添加 .label 的父级文字信息
                if (labelText) {
                    const labelInfo = document.createElement('div');
                    labelInfo.className = 'image-index';
                    labelInfo.style.color = 'gray';
                    labelInfo.innerText = labelText;
                    imageContainer.appendChild(labelInfo);
                }

                // 添加图片序号（序号显示在 .label 的下面）
                const indexText = document.createElement('div');
                indexText.className = 'image-index';
                indexText.innerText = `${currentImageIndex + 1} / ${uniqueImages.length}`;
                imageContainer.appendChild(indexText);
            }

            // 创建缩略图
            function createThumbnails() {
                // 清空缩略图容器
                thumbnailContainer.innerHTML = '';

                uniqueImages.forEach((imageSrc, index) => {
                    const thumbnail = document.createElement('img');
                    thumbnail.src = imageSrc;
                    thumbnail.className = 'thumbnail';
                    thumbnail.alt = `Image ${index + 1}`;
                    thumbnail.addEventListener('click', () => {
                        updateContainer(index);  // 点击缩略图切换主图
                    });
                    thumbnailContainer.appendChild(thumbnail);
                });
            }

            // 初始化并创建缩略图
            createThumbnails();

            // 自动显示第一个图片
            updateContainer(0);

            // 键盘事件 - 左右键切换图片
            window.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
                    updateContainer(currentImageIndex - 1);
                } else if (e.key === 'ArrowRight' && currentImageIndex < uniqueImages.length - 1) {
                    updateContainer(currentImageIndex + 1);
                }

                // 按下 ESC 键关闭主图
                if (e.key === 'Escape') {
                    imageContainer.style.display = 'none'; // 隐藏主图容器
                }
            });
        }, 1000); // 延迟1秒提取图片，确保页面完全加载
    }

    // 等待页面完全加载后初始化
    waitForPageLoad();
})();
