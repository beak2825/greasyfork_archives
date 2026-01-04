// ==UserScript==
// @name         下载jimeng数据图
// @namespace    http://tampermonkey.net/
// @version      2024-11-13
// @description  下载AI图集
// @author       You
// @match        https://jimeng.jianying.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jianying.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517467/%E4%B8%8B%E8%BD%BDjimeng%E6%95%B0%E6%8D%AE%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/517467/%E4%B8%8B%E8%BD%BDjimeng%E6%95%B0%E6%8D%AE%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 16px;
            border-radius: 5px;
            opacity: 0;
            transition: opacity 0.5s ease;
            z-index:10001;
        }
        .topBar {
            position: fixed;
            right: 20px;
            z-index: 10001;
            top: 30px;
            cursor:pointer;
        }
        body {position: relative;}
    `;
    document.head.appendChild(style);

    // 提取链接
    function extractUrlFromCss(cssString) {
        // 使用正则表达式匹配 URL
        const urlMatch = cssString.match(/url\("([^"]+)"\)/);
        // 如果匹配到，返回 URL，否则返回 null
        return urlMatch ? urlMatch[1] : null;
    }
    // 弹窗
    function showToast(message) {
        // 创建 toast 元素
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        // 将 toast 添加到文档
        document.body.appendChild(toast);

        // 显示 toast
        requestAnimationFrame(() => {
            toast.style.opacity = '1'; // 显示
        });

        // 隐藏 toast
        setTimeout(() => {
            toast.style.opacity = '0'; // 隐藏
            // 移除 toast 元素
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500); // 等待过渡结束后再移除
        }, 3000); // 3秒后隐藏
    }

    // 将 blob 下载为文件
    function downloadBlob(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    // 下载图片的函数
    async function downloadImage(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        const blob = await response.blob();
        const filename = url.split('/').pop();
        downloadBlob(blob, filename);
        showToast("下载成功")
    }

    // 将图像绘制到 canvas 并导出为 blob
    function imageToPngBlob(img) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Canvas toBlob failed'));
                }
            }, 'image/png');
        });
    }

    // 下载并转换图片的函数
    async function downloadAndConvertImage(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        const blob = await response.blob();
        const img = document.createElement('img');
        img.src = URL.createObjectURL(blob);

        return new Promise((resolve, reject) => {
            img.onload = async () => {
                try {
                    const pngBlob = await imageToPngBlob(img);
                    const filename = url.split('/').pop().replace(/\.[^/.]+$/, "") + '.png';
                    downloadBlob(pngBlob, filename);
                    URL.revokeObjectURL(img.src);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            img.onerror = reject;
        });
    }



    // 获取预览图
    function getImages() {
        // 设置一个数组用来存储数据
        let images = []
        // 获取右侧图片菜单栏
        const imgs = document.querySelector('div[class^="images-"]');
        // 获取弹窗
        const imgClick = document.querySelector('img[data-apm-action="record-detail-image-detail-image-container"]')
        // 弹出图片预览窗，为了看到最大图片
        imgClick.click()

        setTimeout(() => {

            // 获取 zoomImageContainer
            const zoomImageContainer = document.querySelector('div[class^="zoomImageContainer-"]');
            if (!zoomImageContainer) {
                console.error("未找到 zoomImageContainer 元素");
                return;
            }
            const previousSibling = zoomImageContainer.previousElementSibling; // 获取前一个兄弟元素

            // 暂时实现不了点击事件的函数，批量下载功能延后 imgs !=null
            if (false) {
                // 大于1张图片
                // 遍历 imgs 数组
                Array.from(imgs.querySelectorAll('img')).forEach((img, index) => {

                    // 等待点击事件的副作用（如图片加载等）完成后，获取图片地址
                    setTimeout(() => {
                        // 获取当前元素的前一个兄弟元素并点击
                        if (previousSibling && previousSibling instanceof HTMLElement) {
                            previousSibling.click(); // 触发点击事件
                        } else {
                            console.warn(`第 ${index + 1} 个元素没有前一个兄弟元素`);
                        }
                        // 获取 zoomImageContainer 中的 img 元素
                        const img = zoomImageContainer.querySelector("img");
                        if (img) {
                            images.push(img.src); // 将图片地址添加到 images 数组
                            console.log(`第 ${index + 1} 张图片已添加：`, img.src);
                        } else {
                            console.warn(`第 ${index + 1} 次点击后未找到图片`);
                        }

                        // 如果是最后一个元素，打印最终结果
                        if (index === imgs.length - 1) {
                            console.log("所有图片地址已收集完成：", images);
                        }
                    }, 200); // 假设点击后需要等待 1 秒钟来确保图片加载完成
                });
            } else {
                // 获取第一张图片
                let img = zoomImageContainer.querySelector("img")
                images.push(img.src)
            }
            images.forEach((img) => {
                downloadAndConvertImage(img);
                console.log(`正在下载1张图片...`);
            })
        }, 600)

    }


    function copyData() {
        // let data = [
            // 获取图片
          //  getImages(),
        // ].join("\t")
        // copyTextToClipboard(data)
        getImages()
    }

    // 初始化按钮
    function initFixedButton() {
        // 创建菜单容器
        const menuContainer = document.createElement('div');
        menuContainer.setAttribute('id', 'my-buttons');
        menuContainer.style.position = 'fixed';
        menuContainer.style.bottom = '18px';
        menuContainer.style.right = '2px';
        menuContainer.style.display = 'flex';
        menuContainer.style.flexDirection = 'column';
        menuContainer.style.alignItems = 'flex-end';
        menuContainer.style.transition = 'opacity 0.3s';
        menuContainer.style.opacity = '0'; // 初始隐藏
        menuContainer.style.pointerEvents = 'none'; // 初始不可点击
        menuContainer.style.zIndex = '10001';

        // 创建菜单项
        let items = ["图"]
        // if (window.location.href == 'https://seller.kuajingmaihuo.com/goods/product/list')
        //    items = ['商品'];

        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.style.zIndex = '10001';
            menuItem.innerText = item;
            menuItem.style.padding = '10px';
            menuItem.style.backgroundColor = '#007BFF';
            menuItem.style.color = 'white';
            menuItem.style.borderRadius = '50%';
            menuItem.style.margin = '5px 0';
            menuItem.style.width = '50px';
            menuItem.style.height = '50px';
            menuItem.style.display = 'flex';
            menuItem.style.alignItems = 'center';
            menuItem.style.justifyContent = 'center';
            menuItem.style.transition = 'transform 0.3s';
            menuItem.style.transform = 'scale(0)'; // 初始隐藏
            menuItem.style.cursor = 'pointer';

            menuItem.addEventListener('click', () => {
                switch(item) {
                    case "图": copyData();break;
                }
            })

            menuContainer.appendChild(menuItem);
        });

        // 创建切换按钮
        const toggleButton = document.createElement('button');
        toggleButton.style.width = '0';
        toggleButton.style.height = '0';
        toggleButton.style.borderRadius = '50%';
        toggleButton.style.border = '10px solid #FB7701';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.position = 'fixed';
        toggleButton.style.zIndex = '10001';
        toggleButton.style.bottom = '0px';
        toggleButton.style.right = '0px';

        // 切换菜单显示效果
        toggleButton.addEventListener('click', () => {
            const isVisible = menuContainer.style.opacity === '1';
            menuContainer.style.opacity = isVisible ? '0' : '1';
            menuContainer.style.pointerEvents = isVisible ? 'none' : 'auto';

            // 显示/隐藏菜单项
            const menuItems = menuContainer.children;
            for (let i = 0; i < menuItems.length; i++) {
                menuItems[i].style.transform = isVisible ? 'scale(0)' : 'scale(1)';
            }
        });
        toggleButton.click()
        // 添加元素到文档
        document.body.appendChild(menuContainer);
        document.body.appendChild(toggleButton);

        // 逐个显示菜单项
        setTimeout(() => {
            const menuItems = menuContainer.children;
            for (let i = 0; i < menuItems.length; i++) {
                menuItems[i].style.transitionDelay = `${i * 100}ms`;
            }
        }, 0);
    }
    // function getMeathods
    initFixedButton()

    window.addEventListener('popstate', (event) => {
        console.log('URL changed:', window.location.href);
        initFixedButton();
    });

})();