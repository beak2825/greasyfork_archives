// ==UserScript==
// @name           真白萌导航纯黑背景
// @namespace      sqliuchang
// @version        0.7
// @author         sqliuchang
// @description    将真白萌导航背景改为纯黑 (#000000)，保留条纹，兼容 PJAX 并移除动态注入的冲突样式，由Gemini 2.5 Pro Preview 03-25生成。暂时测试桌面和移动端正常，如有问题请回退上个版本。
// @license        MIT
// @match          *://masiro.me/*
// @match          *://*.masiro.me/*
// @grant          GM_addStyle
// @grant          GM.addStyle
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/469665/%E7%9C%9F%E7%99%BD%E8%90%8C%E5%AF%BC%E8%88%AA%E7%BA%AF%E9%BB%91%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/469665/%E7%9C%9F%E7%99%BD%E8%90%8C%E5%AF%BC%E8%88%AA%E7%BA%AF%E9%BB%91%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 定义并注入基础样式 (带条纹) ---
    const desiredCss = `
        :root {
            --discord-background-primary: #000000 !important;
            --discord-background-mobile-primary: #000000 !important;
        }
        .main-header,
        .main-sidebar,
        .fix-nav {
            background-color: #000000 !important;
            box-shadow: none !important;
            background-image: none !important; /* 移除容器自身的背景图 */
        }
        .main-header .logo,
        .main-header .navbar,
        .main-sidebar {
             background-color: #000000 !important;
             background-image: -webkit-linear-gradient( 45deg , rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent ) !important;
             background-image: linear-gradient( 45deg , rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent ) !important;
             box-shadow: none !important;
             color: #ffffff !important;
        }
        .sidebar-toggle {
            background-color: transparent !important;
            color: #ffffff !important;
        }
        .sidebar-toggle:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .skin-blue-light .sidebar-menu > li > a {
            color: #cccccc !important;
        }
         .skin-blue-light .sidebar-menu > li:hover > a,
         .skin-blue-light .sidebar-menu > li.active > a {
            color: #ffffff !important;
            background: rgba(255, 255, 255, 0.1) !important;
        }
         .skin-blue-light .sidebar-menu > li > .treeview-menu {
             background-color: rgba(20, 20, 20, 0.8) !important;
             background-image: inherit !important;
             padding-left: 5px;
         }
         .skin-blue-light .sidebar-menu > li > .treeview-menu > li > a {
             color: #cccccc !important;
         }
         .skin-blue-light .sidebar-menu > li > .treeview-menu > li:hover > a,
         .skin-blue-light .sidebar-menu > li > .treeview-menu > li.active > a {
              color: #ffffff !important;
              background: rgba(255, 255, 255, 0.15) !important;
         }
         .skin-blue-light .sidebar-menu > li.header {
             color: #aaaaaa !important;
             background: #111111 !important;
             background-image: none !important;
         }
          .skin-blue-light .main-header .navbar .nav > li > a {
             color: #ffffff !important;
         }
          .skin-blue-light .main-header .navbar .nav > li > a:hover,
          .skin-blue-light .main-header .navbar .nav .open > a,
          .skin-blue-light .main-header .navbar .nav .open > a:hover,
          .skin-blue-light .main-header .navbar .nav .open > a:focus,
          .skin-blue-light .main-header .navbar .nav > .active > a {
             background: rgba(255, 255, 255, 0.1) !important;
             color: #ffffff !important;
         }
         /* 强制重置 wrapper 背景，防止干扰 */
         .wrapper {
             background: initial !important;
             background-color: initial !important; /* 明确重置 background-color */
         }
    `;

    let injectedStyleElement = null; // 存储我们注入的 style 元素引用

    // 注入样式
    if (typeof GM_addStyle !== "undefined") {
        injectedStyleElement = GM_addStyle(desiredCss);
        console.log("真白萌导航纯黑背景(v0.7): 使用 GM_addStyle 注入样式。");
    } else if (typeof GM !== "undefined" && typeof GM.addStyle !== "undefined") {
         GM.addStyle(desiredCss).then(element => {
             injectedStyleElement = element;
             console.log("真白萌导航纯黑背景(v0.7): 使用 GM.addStyle 注入样式。");
         });
    } else {
        injectedStyleElement = document.createElement('style');
        injectedStyleElement.id = 'userscript-masiro-black-nav-style'; // 给注入的 style 加个 ID，方便识别
        injectedStyleElement.textContent = desiredCss;
        const head = document.head || document.documentElement;
        head.appendChild(injectedStyleElement);
        console.warn("真白萌导航纯黑背景(v0.7): GM_addStyle/GM.addStyle 未找到, 使用手动注入。");
    }


    // --- 2. 设置 MutationObserver 监控动态样式注入 ---

    // 检查并移除冲突 <style> 节点的函数
    function checkAndRemoveConflict(node) {
        // 确保是 <style> 元素，并且不是我们自己注入的那个
        if (node && node.nodeName === 'STYLE' && node !== injectedStyleElement && (!node.id || node.id !== 'userscript-masiro-black-nav-style')) {
            const styleContent = node.textContent || "";
            // 使用更精确的冲突规则检查，特别是针对 .main-sidebar 的 background-color
            if (styleContent.includes('.main-sidebar') && styleContent.includes('background-color')) {
                 // 检查是否包含透明或非黑色的 background-color 规则
                 if (styleContent.includes('transparent') || styleContent.includes('rgb') || styleContent.includes('#fff') || styleContent.includes('#FFF')) {
                     console.log("真白萌导航纯黑背景(v0.7): 检测到冲突的 .main-sidebar 样式，正在移除:", node);
                     node.remove();
                     return true; // 表示已移除
                 }
            }
            // 也可以保留对 .wrapper 的检查，以防它设置了非预期的背景
            if (styleContent.includes('.wrapper {') && styleContent.includes('background-color: #d2d6de')) {
                 console.log("真白萌导航纯黑背景(v0.7): 检测到冲突的 .wrapper 样式，正在移除:", node);
                 node.remove();
                 return true; // 表示已移除
            }
             // 可选：如果其他冲突仍然存在，可以放宽检查条件
             /*
             if (styleContent.includes('.main-sidebar') || styleContent.includes('.main-header') || styleContent.includes('.wrapper {')) {
                 console.log("真白萌导航纯黑背景(v0.7): 检测到可能的冲突样式，正在移除:", node);
                 node.remove();
                 return true;
             }
             */
        }
        return false; // 未移除
    }

    // MutationObserver 的回调函数
    const mutationCallback = function(mutationsList, observer) {
        let conflictRemoved = false;
        for(const mutation of mutationsList) {
            // 主要关注新添加的节点
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    // 直接检查添加的节点是否是冲突的 <style>
                    if (checkAndRemoveConflict(node)) {
                        conflictRemoved = true;
                    }
                    // 如果添加的是一个容器，检查其内部是否有冲突的 <style> (深层检查)
                    else if (node.nodeType === Node.ELEMENT_NODE) { // 检查是否是元素节点
                        const innerStyles = node.querySelectorAll('style');
                        innerStyles.forEach(styleNode => {
                            if (checkAndRemoveConflict(styleNode)) {
                                conflictRemoved = true;
                            }
                        });
                    }
                });
            }
        }
        // (可选) 如果移除了冲突样式，可能需要强制浏览器重新计算样式
        // 但通常移除后浏览器会自动处理
        // if (conflictRemoved) {
        //    document.body.offsetHeight; // 强制 reflow
        // }
    };

    // 创建并配置 observer
    const observer = new MutationObserver(mutationCallback);

    // 启动 observer 的函数
    function startObserver() {
        // 观察整个文档树的变化，以捕获任何地方添加的 <style>
        const targetNode = document.documentElement; // 观察 html 元素更全面
        if (targetNode) {
            const config = { childList: true, subtree: true };
            observer.observe(targetNode, config);
            console.log("真白萌导航纯黑背景(v0.7): MutationObserver 已启动，监视 documentElement 子节点变化。");

            // 初始加载时，检查 <head> 和 <body> 中已存在的 <style> 标签
             console.log("真白萌导航纯黑背景(v0.7): 执行初始冲突样式检查。");
             document.querySelectorAll('head > style, body style').forEach(existingStyle => {
                 checkAndRemoveConflict(existingStyle);
             });

        } else {
            // 理论上 documentElement 总是存在
            console.error("真白萌导航纯黑背景(v0.7): document.documentElement 未找到，无法启动 Observer！");
            // 可以尝试延迟，但可能性不大
            // setTimeout(startObserver, 100);
        }
    }

    // 文档加载完成后启动 observer
    // 使用 'interactive' 状态确保 body 存在，同时尽早开始观察
    if (document.readyState === 'loading') {
         document.addEventListener('readystatechange', () => {
             if (document.readyState === 'interactive') {
                 startObserver();
             }
         });
    } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
        startObserver();
    }

})();