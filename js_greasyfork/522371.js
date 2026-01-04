// ==UserScript==
// @name         博看 图片查看器
// @namespace    http://tampermonkey.net/
// @version      2024-12-31
// @description  对博看 图片 阅读体验进行优化
// @author       sssw
// @match        https://zq.bookan.com.cn/*
// @match        http://zq.bookan.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bookan.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522371/%E5%8D%9A%E7%9C%8B%20%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/522371/%E5%8D%9A%E7%9C%8B%20%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let isMainExecuted = false;
    // 获取当前网页的 URL
    const currentUrl = window.location.href;

    // 提取最后一个 # 后的数字
    const hashValue = currentUrl.split('#').pop(); // 获取 # 后的部分
    // 当前图片索引
    let currentIndex = parseInt(hashValue, 10); // 转换为数字

    // 预加载图片
    function preloadImages(images) {
        return images.map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });
    }

    // 提取所有 .mg 图片链接
    function extractMgImages() {
        const images = [];
        const imgElements = document.querySelectorAll('img.slide-img');
        imgElements.forEach(img => {
            const dataSrc = img.getAttribute('data-src');
            if (dataSrc && dataSrc.endsWith('.mg')) {
                images.push(dataSrc);
            }
        });
        return images;
    }

    // 创建图片浏览器
    function createImageBrowser(images) {
        if (images.length === 0) {
            // alert('未找到任何 .mg 图片！');
            return;
        }

        // 创建容器
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.backgroundColor = '#000';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.overflow = 'hidden';

        // 创建图片显示区域
        const imgDisplay = document.createElement('img');
        imgDisplay.style.maxWidth = '100%'; // 图片最大宽度为页面宽度
        imgDisplay.style.maxHeight = '100%'; // 图片最大高度为页面高度
        imgDisplay.style.objectFit = 'contain'; // 保持图片比例
        imgDisplay.src = images[currentIndex];
        container.appendChild(imgDisplay);

        // 创建导航按钮容器
        const navContainer = document.createElement('div');
        navContainer.style.position = 'absolute';
        navContainer.style.bottom = '20px';
        navContainer.style.width = '100%';
        navContainer.style.display = 'flex';
        navContainer.style.justifyContent = 'space-between';
        navContainer.style.padding = '0 20px';
        navContainer.style.boxSizing = 'border-box';

        // 上一张按钮
        const prevButton = document.createElement('button');
        prevButton.textContent = '上一张';
        prevButton.style.padding = '10px 20px';
        prevButton.style.fontSize = '16px';
        prevButton.style.cursor = 'pointer';
        prevButton.style.backgroundColor = '#e7392e';
        prevButton.style.color = '#fff';
        prevButton.style.border = 'none';
        prevButton.style.borderRadius = '5px';

        // 下一张按钮
        const nextButton = document.createElement('button');
        nextButton.textContent = '下一张';
        nextButton.style.padding = '10px 20px';
        nextButton.style.fontSize = '16px';
        nextButton.style.cursor = 'pointer';
        nextButton.style.backgroundColor = '#e7392e';
        nextButton.style.color = '#fff';
        nextButton.style.border = 'none';
        nextButton.style.borderRadius = '5px';

        navContainer.appendChild(prevButton);
        navContainer.appendChild(nextButton);
        container.appendChild(navContainer);

        // 关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '20px';
        closeButton.style.right = '20px';
        closeButton.style.padding = '10px 20px';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.backgroundColor = '#e7392e';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        container.appendChild(closeButton);

        // 添加到页面
        document.body.appendChild(container);

        function preloadAdjacentImages(currentIndex) {
            // 预加载前后各2张图片
            const preloadRange = 2;
            for (let i = -preloadRange; i <= preloadRange; i++) {
                const index = currentIndex + i;
                if (index >= 0 && index < images.length) {
                    const img = new Image();
                    img.src = images[index];
                }
            }
        }

        // 更新图片显示，先预加载图片，加载完成后再更新 src
        function updateImage() {
            const newSrc = images[currentIndex];
            const tempImage = new Image();
            tempImage.src = newSrc;

            // 预加载相邻的图片
            preloadAdjacentImages(currentIndex);

            tempImage.onload = () => {
                imgDisplay.src = tempImage.src; // 使用已加载的图片
            };
        }

        // 按钮点击事件
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateImage();
        });

        closeButton.addEventListener('click', () => {
            container.remove();
        });

        // 键盘事件
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
                // 上一张
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateImage();
            } else if (event.key === 'ArrowRight' || event.key === 'PageDown') {
                // 下一张
                currentIndex = (currentIndex + 1) % images.length;
                updateImage();
            } else if (event.key === 'Escape') {
                // 关闭
                container.remove();
            }
        });

        // 鼠标滚轮事件
        container.addEventListener('wheel', (event) => {
            event.preventDefault(); // 阻止页面滚动

            // alert('container wheel');
            console.log('container wheel event');
            if (event.deltaY > 0) {
                // 向下滚动，下一张
                currentIndex = (currentIndex + 1) % images.length;
            } else if (event.deltaY < 0) {
                // 向上滚动，上一张
                currentIndex = (currentIndex - 1 + images.length) % images.length;
            }
            updateImage();
        }, { passive: false });
    }

    // 主函数
    function main() {
        const images = extractMgImages();
        // alert('main');
        console.log('main');
        createImageBrowser(images);
        document.body.style.backgroundColor = "white";

        isMainExecuted = true; // 标记 main 已经执行
    }

    // 鼠标滚轮事件
    document.addEventListener('wheel', (event) => {
        console.log('document wheel event');

        // 如果 main 还没有执行，则执行 main 并返回
        if (!isMainExecuted) {
            main();
            return;
        }
    }); //

    // 添加一个按钮到页面，点击后启动图片浏览器
    const button = document.createElement('button');
    button.textContent = '启动 MG 图片浏览器';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.zIndex = '9999';
    button.style.cursor = 'pointer';
    button.style.backgroundColor = '#e7392e';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';

    button.addEventListener('click', main);
    document.body.appendChild(button);

})();