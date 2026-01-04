// ==UserScript==
// @name         cnblogs首页美化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @icon         https://www.cnblogs.com/images/logo.svg?v=2SMrXdIvlZwVoB1akyXm38WIKuTHVqvGD0CweV-B6cY
// @description  美化 Cnblogs 首页，包括顶部导航，左侧边栏和右侧边栏，分页选择按钮，文章列表
// @author       xiaoye
// @match        https://www.cnblogs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503671/cnblogs%E9%A6%96%E9%A1%B5%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/503671/cnblogs%E9%A6%96%E9%A1%B5%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 包裹 "周边" 链接在 li 元素中
    const surroundWithLi = () => {
        const navLeft = document.getElementById('nav_left');
        if (navLeft) {
            navLeft.querySelectorAll('a').forEach(link => {
                if (link.textContent.includes('周边') && link.parentElement.tagName !== 'LI') {
                    const li = document.createElement('li');
                    navLeft.insertBefore(li, link);
                    li.appendChild(link);
                }
            });
        }
    };

    // 美化文章列表项
    const stylePostItems = () => {
        document.querySelectorAll('.post-item').forEach(article => {
            // 设置样式
            Object.assign(article.style, {
                backgroundColor: "#ffffff",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
                transition: "transform 0.3s, box-shadow 0.3s, border 0.3s",
                cursor: "pointer",
                border: "1px solid #ddd"
            });

            // 鼠标移入和移出效果
            article.addEventListener('mouseenter', () => {
                article.style.boxShadow = "0px 0px 15px rgba(0, 0, 0, 0.2)";
                article.style.transform = "scale(1.02)";
                article.style.border = "1px solid #007acc";
            });

            article.addEventListener('mouseleave', () => {
                article.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
                article.style.transform = "scale(1)";
                article.style.border = "1px solid #ddd";
            });

            // 添加点击事件
            const titleLink = article.querySelector('a.post-item-title');
            if (titleLink) {
                const href = titleLink.getAttribute('href');
                article.addEventListener('click', (event) => {
                    if (!event.target.closest('a')) {
                        window.open(href, '_blank');
                    }
                });
            }

            // 防止其他链接的点击事件冒泡
            article.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (event) => {
                    event.stopPropagation();
                });
            });
        });
    };

    // 美化侧边栏
    const styleSidenavItems = () => {
        document.querySelectorAll('.sidenav-item a').forEach(item => {
            Object.assign(item.style, {
                borderRadius: '8px',
                padding: '10px',
                transition: 'background-color 0.3s, transform 0.3s, border 0.3s',
                border: "1px solid #ddd"
            });

            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = '#007acc';
                item.style.color = '#ffffff';
                item.style.transform = 'scale(1.05)';
                item.style.border = "1px solid #007acc";
            });

            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = '';
                item.style.color = '';
                item.style.transform = 'scale(1)';
                item.style.border = "1px solid #ddd";
            });
        });
    };


    // 美化侧边栏
    const beautifySidebar = () => {
        const sidebarItems = document.querySelectorAll('.sidebar .card, .sidebar .sidebar-bh');
        sidebarItems.forEach(function(item) {
            item.style.backgroundColor = '#ffffff';
            item.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
            item.style.borderRadius = '8px';
            item.style.padding = '15px';
            item.style.marginBottom = '20px';
            item.style.marginLeft = '15px';
            item.style.transition = 'transform 0.3s, box-shadow 0.3s';
        });

        // 侧边栏标题样式
        const cardTitles = document.querySelectorAll('.card-title a');
        cardTitles.forEach(function(title) {
            title.style.color = '#007acc';
            title.style.textDecoration = 'none';
            title.style.fontSize = '16px';
            title.style.fontWeight = 'bold';
            title.style.transition = 'color 0.3s';
        });

        cardTitles.forEach(function(title) {
            title.addEventListener('mouseenter', function() {
                title.style.color = '#005f99';
            });

            title.addEventListener('mouseleave', function() {
                title.style.color = '#007acc';
            });
        });

        // 侧边栏项目列表样式
        const itemList = document.querySelectorAll('.item-list li');
        itemList.forEach(function(item) {
            item.style.borderBottom = '1px solid #ddd';
            item.style.padding = ' 0';
        });

        // 侧边栏图片样式
        const sidebarImages = document.querySelectorAll('.sidebar-image img');
        sidebarImages.forEach(function(image) {
            image.style.borderRadius = '8px';
            image.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
            image.style.maxWidth = '100%';
            image.style.height = 'auto';
        });
    };



    // 修改下拉菜单的a标签宽度
    const styleDropdownLinks = () => {
        document.querySelectorAll('.dropdown-menu a').forEach(link => {
            Object.assign(link.style, {
                width: '80px',
                display: 'inline-block',
                textAlign: 'center'
            });
        });
    };


    // 创建样式元素并插入到页面头部
    const applyGlobalStyles = () => {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .pager a, .pager span {
                display: inline-block;
                padding: 8px 12px;
                margin: 0 4px;
                border-radius: 5px;
                text-decoration: none;
                color: #007acc;
                border: 1px solid #ddd;
                background-color: #fff;
                transition: all 0.3s ease;
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
            }
            .pager a.current, .pager span.current {
                background-color: #007acc;
                color: #fff;
                border-color: #007acc;
            }
            .pager a:hover {
                background-color: #005f99;
                color: #fff;
                border-color: #005f99;
                box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
                transform: scale(1.05);
            }
            .headline ul {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                padding: 0;
                list-style: none;
            }
            .headline li {
                width: 48%;
                margin-bottom: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .headline a {
                display: inline-block;
                width: calc(100% - 40px);
                padding: 10px;
                border-radius: 8px;
                text-decoration: none;
                color: #333;
                border: 1px solid #ddd;
                background-color: #f9f9f9;
                transition: all 0.3s ease;
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
            }
            .headline a:hover {
                background-color: #f9f9f9;
                color: #333;
                border-color: #007acc;
                box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
                transform: scale(1.05);
            }
            .headline .headline-label {
                font-weight: bold;
                color: #007acc;
                margin-right: 5px;
            }
            .headline .right_more {
                width: 30px;
                margin-left: 10px;
                padding: 5px 10px;
                font-size: 0.9em;
                background-color: #f9f9f9;
                color: #333;
                border: 1px solid #ddd;
                border-radius: 5px;
                text-decoration: none;
                transition: all 0.3s ease;
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
            }
            .headline .right_more:hover {
                border-color: #007acc;
                box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
                transform: scale(1.05);
            }
            #nav_left li a {
                color: #333;
                text-decoration: none;
                padding: 10px 15px;
                display: block;
                position: relative;
                transition: color 0.3s ease;
            }
            #nav_left li a::after {
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 2px;
                background-color: #007acc;
                transform: scaleX(0);
                transform-origin: bottom right;
                transition: transform 0.3s ease;
            }
            #nav_left li a:hover {
                color: #007acc;
            }
            #nav_left li a:hover::after {
                transform: scaleX(1);
                transform-origin: bottom left;
            }
        `;
        document.head.appendChild(styleElement);
    };

    // 初始化所有样式和功能
    const init = () => {
        surroundWithLi();
        stylePostItems();
        styleSidenavItems();
        styleDropdownLinks();
        applyGlobalStyles();
        beautifySidebar();
    };

    // 页面初始加载时应用所有样式和功能
    init();

    // 监听DOM变化，确保动态内容的样式保持
    const observer = new MutationObserver(init);
    observer.observe(document.body, { childList: true, subtree: true });
})();


