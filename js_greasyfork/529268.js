// ==UserScript==
// @name         YouTube 快捷按钮
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  在YouTube首页添加回到顶部和刷新页面按钮，动态处理SPA跳转
// @author       MarsCode AI
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529268/YouTube%20%E5%BF%AB%E6%8D%B7%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/529268/YouTube%20%E5%BF%AB%E6%8D%B7%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let buttonContainer = null;

    // 判断当前页面是否为首页
    const isHomePage = () => {
        return window.location.pathname === '/';
    };



    // 创建按钮
    const createButtons = () => {
        // 如果按钮容器已存在，先移除
        if (buttonContainer) {
            buttonContainer.remove();
        }

        // 创建按钮容器
        buttonContainer = document.createElement('div');
        buttonContainer.id = 'custom-buttons-container';
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.bottom = '20px';
        buttonContainer.style.right = '20px';
        buttonContainer.style.zIndex = '9999';
        buttonContainer.style.display = 'none'; // 初始状态为隐藏
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '10px';


        // 创建回到顶部按钮
        const topButton = document.createElement('button');
        topButton.innerText = 'Top';
        topButton.style.padding = '10px 20px';
        topButton.style.backgroundColor = '#ff0000';
        topButton.style.color = '#ffffff';
        topButton.style.border = 'none';
        topButton.style.borderRadius = '8px';
        topButton.style.cursor = 'pointer';
        topButton.style.display = 'none';
        topButton.style.transition = 'all 0.3s ease';
        topButton.style.fontWeight = '500';
        topButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        // 创建刷新页面按钮
        const refreshButton = document.createElement('button');
        refreshButton.innerText = 'Refresh';
        refreshButton.style.padding = '10px 20px';
        refreshButton.style.backgroundColor = '#ff0000';
        refreshButton.style.color = '#ffffff';
        refreshButton.style.border = 'none';
        refreshButton.style.borderRadius = '8px';
        refreshButton.style.cursor = 'pointer';
        refreshButton.style.transition = 'all 0.3s ease';
        refreshButton.style.fontWeight = '500';
        refreshButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        // 添加hover效果
        const addHoverEffect = (button) => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.05)';
                button.style.backgroundColor = '#cc0000';
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
                button.style.backgroundColor = '#ff0000';
            });
        };

        addHoverEffect(topButton);
        addHoverEffect(refreshButton);


        // 添加点击事件
        topButton.addEventListener('click', () => {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });

        refreshButton.addEventListener('click', () => {
            window.location.reload();
        });

        // 滚动事件监听
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight) {
                topButton.style.display = 'block';
            } else {
                topButton.style.display = 'none';
            }
        });

        // 将按钮添加到容器
        buttonContainer.appendChild(topButton);
        buttonContainer.appendChild(refreshButton);

        // 将容器添加到页面
        document.body.appendChild(buttonContainer);
    };

    // 添加鼠标移动事件监听
    const handleMouseMove = (e) => {
        // 如果不是首页，直接返回
        if (!isHomePage()) {
            return;
        }

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const showAreaWidth = 200; // 右侧显示区域宽度
        const showAreaHeight = 200; // 底部显示区域高度

        // 判断鼠标是否在右下角区域
        if (e.clientX > windowWidth - showAreaWidth &&
            e.clientY > windowHeight - showAreaHeight) {
            buttonContainer.style.display = 'flex';
        } else {
            buttonContainer.style.display = 'none';
        }
    };

    // 处理按钮显示/隐藏
    const handleButtonsVisibility = () => {
        if (isHomePage()) {
            if (!buttonContainer) {
                createButtons();
            }
            // 只在首页添加鼠标移动事件监听
            document.addEventListener('mousemove', handleMouseMove);
        } else {
            if (buttonContainer) {
                // 在其他页面移除按钮容器
                buttonContainer.remove();
                buttonContainer = null;
                // 移除鼠标移动事件监听
                document.removeEventListener('mousemove', handleMouseMove);
            }else {
                // 如果按钮容器不存在，也确保移除事件监听
                document.removeEventListener('mousemove', handleMouseMove);
            }
        }
    };

    // 监听路由变化
    const observeRouteChanges = () => {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                handleButtonsVisibility();
            }
        }).observe(document, {subtree: true, childList: true});
    };

    // 主执行函数
    const main = () => {
        handleButtonsVisibility();
        observeRouteChanges();
    };

    // 启动脚本
    main();
})();