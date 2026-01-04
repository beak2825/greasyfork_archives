// ==UserScript==
// @name         国开学生空间站点使用体验优化工具
// @namespace    https://github.com/beckshe
// @version      1.0
// @description  国家开放大学学生空间新版，用于一些站点使用体验的优化（此脚本不搞刷课，主要是个人使用）
// @author       BeckShe
// @match        https://moodle.syxy.ouchn.cn/*
// @include           *://moodle.syxy.ouchn.cn/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538566/%E5%9B%BD%E5%BC%80%E5%AD%A6%E7%94%9F%E7%A9%BA%E9%97%B4%E7%AB%99%E7%82%B9%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/538566/%E5%9B%BD%E5%BC%80%E5%AD%A6%E7%94%9F%E7%A9%BA%E9%97%B4%E7%AB%99%E7%82%B9%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 修改全局字体大小（18px为例）
    document.body.style.fontSize = "18px";

    // 修改背景色（浅黄色为例）
    //document.body.style.backgroundColor = "rgb(255,242,226)";

    // 可选：修改文字颜色（深灰色为例）
    //document.body.style.color = "red";


    // 方法1：直接设置CSS样式（推荐）
    $(".generalbox")?.css("background-color", "rgb(255,242,226)");
    // 修改.generalbox的所有子元素（*）
    $(".generalbox")?.find("*")?.css("background-color", "rgb(255,242,226)");
    $(".generalbox")?.find("img")?.css("background-color", "transparent");
    $(".generalbox")?.find(".bgKuang")?.css("background-color", "transparent");
    // 先触发原生点击事件（更可靠）
//     $(".navbutton").trigger('click');
//     $(".navbutton").attr('aria-expanded','false');

    // 核心代码：找到侧边栏按钮并设置aria-expanded为false
//document.querySelector(".navbutton")?.setAttribute('aria-expanded', 'false');
// 核心代码：找到按钮并自动触发点击（模拟用户操作）
// 后续仍建议触发点击事件
window.addEventListener('load', () => {
     // 延迟500ms执行（可根据需要调整）
    setTimeout(() => {
        document.querySelector('button.navbutton[data-action="toggle-drawer"]')?.click();
    },500);

});

//     const btn = document.querySelector('button.navbutton[data-action="toggle-drawer"]');
//     if (!btn) return;

//     // 方法A：触发原生点击事件
//     btn.click();
//     $('button.navbutton[data-action="toggle-drawer"]').trigger('click');



//     // 添加自定义样式
//     GM_addStyle(`
//         .sidebar-global-control {
//             position: fixed;
//             bottom: 20px;
//             right: 20px;
//             z-index: 9999;
//             width: 50px;
//             height: 50px;
//             border-radius: 50%;
//             background: linear-gradient(135deg, #6e8efb, #a777e3);
//             color: white;
//             border: none;
//             box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
//             cursor: pointer;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 20px;
//             transition: all 0.3s ease;
//         }

//         .sidebar-global-control:hover {
//             transform: translateY(-3px);
//             box-shadow: 0 7px 20px rgba(0, 0, 0, 0.3);
//         }

//         .sidebar-global-control:active {
//             transform: translateY(1px);
//         }

//         .sidebar-global-control::after {
//             content: "";
//             position: absolute;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             border-radius: 50%;
//             background: rgba(255, 255, 255, 0.1);
//             opacity: 0;
//             transition: opacity 0.3s;
//         }

//         .sidebar-global-control:hover::after {
//             opacity: 1;
//         }

//         .sidebar-global-control.toggled {
//             background: linear-gradient(135deg, #ff758c, #ff7eb3);
//         }
//     `);







//     // 创建控制按钮
//     const controlBtn = document.createElement('button');
//     controlBtn.className = 'sidebar-global-control';
//     controlBtn.innerHTML = '☰';
//     controlBtn.title = '切换侧边栏';
//     document.body.appendChild(controlBtn);

//     // 检查初始状态
//     let isOpen = $('.btn.navbutton').attr('aria-expanded') === 'true';
//     if (isOpen) {
//         controlBtn.classList.add('toggled');
//     }

//     // 按钮点击事件
//     controlBtn.addEventListener('click', function() {
//         // 切换状态
//         isOpen = !isOpen;

//         // 更新按钮样式
//         this.classList.toggle('toggled');

//         // 触发原按钮的点击事件
//         const navButton = $('.btn.navbutton');
//         if (navButton.length) {
//             navButton.trigger('click');
//         }

//         // 添加点击动画
//         this.style.transform = 'scale(0.9)';
//         setTimeout(() => {
//             this.style.transform = '';
//         }, 200);
//     });

//     // 监听原按钮状态变化
//     const observer = new MutationObserver(function(mutations) {
//         mutations.forEach(function(mutation) {
//             if (mutation.attributeName === 'aria-expanded') {
//                 const isNowOpen = $(mutation.target).attr('aria-expanded') === 'true';
//                 if (isNowOpen !== isOpen) {
//                     isOpen = isNowOpen;
//                     controlBtn.classList.toggle('toggled', isOpen);
//                 }
//             }
//         });
//     });

//     // 开始观察原按钮
//     const navButton = document.querySelector('.btn.navbutton');
//     if (navButton) {
//         observer.observe(navButton, { attributes: true });
//     }

//     // 添加键盘快捷键 (Alt+S)
//     document.addEventListener('keydown', function(e) {
//         if (e.altKey && e.key.toLowerCase() === 's') {
//             e.preventDefault();
//             controlBtn.click();
//         }
//     });


















     // 添加与网站风格协调的样式
    GM_addStyle(`

        /* 控制按钮样式 */
        .ouc-sidebar-toggle {
            position: fixed;
            top: 15px;
            right: 20px;
            z-index: 9999;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            border: none;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: all 0.3s ease;
        }

        .ouc-sidebar-toggle:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .ouc-sidebar-toggle.collapsed {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        /* 强制隐藏侧边栏 */
        .drawer.drawer-left {
            transform: translateX(-100%) !important;
        }

        /* 调整主内容区域 */
        #page {
            margin-left: 0 !important;
            transition: margin-left 0.3s ease !important;
        }

        /* 确保按钮不被顶部栏遮挡 */
        #page-header {
            z-index: 9998 !important;
        }
    `);

    // 创建控制按钮
    function createToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'ouc-sidebar-toggle collapsed';
        toggleBtn.innerHTML = '☰';
        toggleBtn.title = '显示/隐藏课程目录';
        document.body.appendChild(toggleBtn);
        return toggleBtn;
    }

    // 初始化侧边栏状态
    function initSidebar() {
        // 创建控制按钮
        const toggleBtn = createToggleButton();

        // 找到原生侧边栏切换按钮
        const navButton = $('.btn.navbutton[data-action="toggle-drawer"]');

        if (navButton.length) {
            // 强制隐藏侧边栏
            $('.drawer.drawer-left').css('transform', 'translateX(-100%)');
            $('body').removeClass('drawer-open-left');
            $('#page').css('margin-left', '0');

            // 设置按钮初始状态
            toggleBtn.classList.add('collapsed');

            // 按钮点击事件
            toggleBtn.addEventListener('click', function() {
                navButton.trigger('click');
                this.classList.toggle('collapsed');
            });

            // 监听侧边栏状态变化
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'aria-expanded') {
                        const isCollapsed = !$(mutation.target).attr('aria-expanded') === 'true';
                        toggleBtn.classList.toggle('collapsed', isCollapsed);
                    }
                });
            });

            observer.observe(navButton[0], { attributes: true });
        }
    }

    // 确保页面完全加载后执行
    function waitForPageLoad() {
        if ($('.btn.navbutton').length) {
            initSidebar();
        } else {
            setTimeout(waitForPageLoad, 500);
        }
    }

    // 启动脚本
    $(document).ready(function() {
        waitForPageLoad();
    });












})();