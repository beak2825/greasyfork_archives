// ==UserScript==
// @name         下载豆包无水印图片
// @namespace    http://tampermonkey.net/
// @version      2024/11/12
// @description  用于下载AI图
// @author       You
// @match        https://www.doubao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doubao.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517003/%E4%B8%8B%E8%BD%BD%E8%B1%86%E5%8C%85%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/517003/%E4%B8%8B%E8%BD%BD%E8%B1%86%E5%8C%85%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%9B%BE%E7%89%87.meta.js
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
    // 定义点击事件的处理函数
    function copyTextToClipboard(text) {
        // 在这里编写复制文本到剪贴板的逻辑
        console.log('复制按钮被点击');
        // 示例：复制文本 "示例文本" 到剪贴板
        navigator.clipboard.writeText(text).then(() => {
            showToast('文本已复制到剪贴板');
        }).catch(err => {
            showToast('复制失败:', err);
        });
    }
    // 获取预览图
    function getImages() {
        // 获取目标图片的src
        const img = Array.from(document.querySelectorAll('.image-w1Jk1u')).pop();
        if (img) {
            const imgSrc = img.src;
            // 创建一个隐藏的<a>元素，用于下载图片
            const a = document.createElement('a');
            a.href = imgSrc;
            a.download = imgSrc.split('/').pop(); // 设置下载文件名
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            showToast('未找到目标图片');
        }
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