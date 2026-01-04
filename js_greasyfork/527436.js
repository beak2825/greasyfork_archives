// ==UserScript==
// @name         UID
// @namespace    http://tampermonkey.net/
// @version      2025-02-20
// @description  获取TikTok的User Id
// @author       czj
// @match        https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527436/UID.user.js
// @updateURL https://update.greasyfork.org/scripts/527436/UID.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 创建样式
    const style = document.createElement('style');
    function toStyle () {
        style.textContent = `
        .toast {
            position: fixed;
            top: 120px;
            right: 10px;
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

    }
    toStyle()
    document.head.appendChild(style);

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
        const items = ["UID", "PCT"]
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
                fetchData(item)
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

    // 定义点击事件的处理函数
    function copyTextToClipboard(text) {
        // 在这里编写复制文本到剪贴板的逻辑
        console.log('复制按钮被点击');
        // 示例：复制文本 "示例文本" 到剪贴板
        navigator.clipboard.writeText(text).then(() => {
            //showToast('文本已复制到剪贴板');
        }).catch(err => {
            showToast('复制失败:', err);
        });
    }

    window.addEventListener('popstate', (event) => {
        console.log('URL changed:', window.location.href);
    })

    function isTikTokVideoLink(url) {
        // 正则表达式匹配 TikTok 视频链接
        const regex = /https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+/;
        return regex.test(url);
    }

    // 获取数据
    function fetchData(key) {
        const script = document.querySelector('script[id="__UNIVERSAL_DATA_FOR_REHYDRATION__"]');
        if (script) {
            const data = JSON.parse(script.textContent);
            console.log('获取到的数据：', data);
            // 安全地获取数据
            const userData = data['__DEFAULT_SCOPE__']?.['webapp.user-detail'];
            const videoDatadata = data['__DEFAULT_SCOPE__']?.['webapp.video-detail'];
            let user = {};
            let stats = {};
            let count = 0;
            if (!isTikTokVideoLink(window.location.href)) {

                if (userData) {
                    let { userInfo } = userData;

                    user = userInfo.user || {};
                    stats = userInfo.stats || {};

                    count = stats.videoCount

                } else {
                    console.error('No data found for __DEFAULT_SCOPE__.webapp.user-detail');
                }
            } else {

                if (videoDatadata) {
                    let { itemInfo } = videoDatadata;

                    user = itemInfo.itemStruct?.author || {};
                    stats = itemInfo.itemStruct?.stats || {};

                    count = stats.playCount
                } else {
                    console.error('No data found for __DEFAULT_SCOPE__.webapp.video-detail');
                }
            }
            //['userInfo']
            if (key == 'UID') {
                copyTextToClipboard(`${user.nickname}\t${user.id}`)
                showToast('文本已复制到剪贴板');
            } else {
                copyTextToClipboard(`${user.nickname}\t${count}`)
                showToast((!isTikTokVideoLink(window.location.href) ? '视频数'+count: '播放数：'+count)+ '已复制到剪贴板');
            }

        } else {
            showToast('未找到目标script标签');
        }
    }


    // 初始化
    function init() {
        initFixedButton();
    }

    // 等待页面完全加载
    window.addEventListener('load', () => {
        console.log('页面已完全加载');
        init();
    })
})();