// ==UserScript==
// @name         「网页复制限制解除」
// @namespace    http://tampermonkey.net/
// @version      1.5.4
// @author       Heavrnl
// @description  更新内容:增强复制解除功能,修复BUG
// @license      MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515032/%E3%80%8C%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%E3%80%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/515032/%E3%80%8C%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%E3%80%8D.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 检查是否在 iframe 中
    const isInIframe = window !== window.top;

    // 添加设置界面的样式
    GM_addStyle(`
        .watermark-settings {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 10000;
            width: 500px;
            font-family: Arial, sans-serif;
        }
        .watermark-settings h2 {
            margin: 0 0 15px 0;
            color: #333;
        }
        .watermark-settings .buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        .watermark-settings button {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .watermark-settings .save {
            background: #28a745;
            color: white;
        }
        .watermark-settings .cancel {
            background: #dc3545;
            color: white;
        }
        .watermark-settings .overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        }
    `);

    // 初始化设置 - 只在主页面中执行
    if (!isInIframe) {
        console.log('初始化设置 - copySites:', GM_getValue('copySites', {}));
        console.log('初始化设置 - watermarkSites:', GM_getValue('watermarkSites', {}));
        if (GM_getValue('watermarkSites') === undefined) {
            GM_setValue('watermarkSites', {});
        }
        if (GM_getValue('copySites') === undefined) {
            GM_setValue('copySites', {});
        }

        // 在页面加载完成时检查并应用功能
        document.addEventListener('DOMContentLoaded', () => {
            console.log('页面加��完成，检查是否需要解除复制限制和去除水印');
            const currentHost = window.location.hostname;
            const copySites = GM_getValue('copySites', {});
            const watermarkSites = GM_getValue('watermarkSites', {});

            if (copySites[currentHost]) {
                console.log('当前网站需要解除复制限制，正在应用...');
                enableCopyAndRemoveOverlay();
            }

            if (watermarkSites[currentHost]) {
                console.log('当前网站需要去除水印，正在应用...');
                removeWatermark();
            }
        });

        // 创建并添加按钮
        const button = document.createElement("button");
        // 使用 SVG 图标替代文字
        const svgIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>`;

        button.innerHTML = svgIcon;

        // 根据存储的状态设置按钮样式
        const currentHost = window.location.hostname;
        const copySites = GM_getValue('copySites', {});
        const isEnabled = copySites[currentHost] || false;
        const getButtonStyle = (enabled) => `
            position: fixed;
            right: 10px;
            bottom: 15%;
            z-index: 9999;
            width: 32px;
            height: 32px;
            padding: 6px;
            background-color: ${enabled ? 'rgba(220, 53, 69, 0.3)' : 'rgba(40, 167, 69, 0.3)'};
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.3;
        `;

        button.style.cssText = getButtonStyle(isEnabled);

        // 悬停效果
        button.onmouseenter = () => {
            button.style.opacity = "1";
            const currentHost = window.location.hostname;
            const copySites = GM_getValue('copySites', {});
            const isEnabled = copySites[currentHost] || false;
            button.style.backgroundColor = isEnabled ?
                'rgba(220, 53, 69, 0.9)' :
                'rgba(40, 167, 69, 0.9)';
        };

        button.onmouseleave = () => {
            button.style.opacity = "0.3";
            const currentHost = window.location.hostname;
            const copySites = GM_getValue('copySites', {});
            const isEnabled = copySites[currentHost] || false;
            button.style.backgroundColor = isEnabled ?
                'rgba(220, 53, 69, 0.3)' :
                'rgba(40, 167, 69, 0.3)';
        };

        document.body.appendChild(button);

        // 修改点击按钮时切换状态的代码
        const handleButtonClick = () => {
            const currentHost = window.location.hostname;
            const copySites = GM_getValue('copySites', {});
            const currentState = copySites[currentHost] || false;
            console.log('按钮点 - 当前状态:', currentState);

            if (!currentState) {
                console.log('启用复制解除...');
                copySites[currentHost] = true;
                GM_setValue('copySites', copySites);
                enableCopyAndRemoveOverlay();
                button.style.backgroundColor = 'rgba(220, 53, 69, 0.3)';
                console.log('复制解除已启用');
            } else {
                console.log('禁用复制解除...');
                copySites[currentHost] = false;
                GM_setValue('copySites', copySites);
                location.reload(); // 刷新页面以恢复原始状态
            }
        };

        // 绑定点击事件
        button.addEventListener("click", handleButtonClick);

        // 创建并添加去水印按钮
        const watermarkButton = document.createElement("button");
        const watermarkSvgIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M21 21H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"></path>
            </svg>`;

        watermarkButton.innerHTML = watermarkSvgIcon;

        // 获取去水印功能的状态
        const isWatermarkEnabled = () => {
            const currentHost = window.location.hostname;
            const watermarkSites = GM_getValue('watermarkSites', {});
            return watermarkSites[currentHost] || false;
        };

        // 设置去水印按钮样式
        const getWatermarkButtonStyle = (enabled) => `
            position: fixed;
            right: 10px;
            bottom: 10%;
            z-index: 9999;
            width: 32px;
            height: 32px;
            padding: 6px;
            background-color: ${enabled ? 'rgba(220, 53, 69, 0.3)' : 'rgba(40, 167, 69, 0.3)'};
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.3;
        `;

        watermarkButton.style.cssText = getWatermarkButtonStyle(isWatermarkEnabled());

        // 去水印按钮的悬停效果
        watermarkButton.onmouseenter = () => {
            watermarkButton.style.opacity = "1";
            const currentHost = window.location.hostname;
            const watermarkSites = GM_getValue('watermarkSites', {});
            const isEnabled = watermarkSites[currentHost] || false;
            watermarkButton.style.backgroundColor = isEnabled ?
                'rgba(220, 53, 69, 0.9)' :
                'rgba(40, 167, 69, 0.9)';
        };

        watermarkButton.onmouseleave = () => {
            watermarkButton.style.opacity = "0.3";
            const currentHost = window.location.hostname;
            const watermarkSites = GM_getValue('watermarkSites', {});
            const isEnabled = watermarkSites[currentHost] || false;
            watermarkButton.style.backgroundColor = isEnabled ?
                'rgba(220, 53, 69, 0.3)' :
                'rgba(40, 167, 69, 0.3)';
        };

        // 去水印按钮点击事件
        watermarkButton.addEventListener("click", () => {
            const currentHost = window.location.hostname;
            const watermarkSites = GM_getValue('watermarkSites', {});
            const currentState = watermarkSites[currentHost] || false;

            watermarkSites[currentHost] = !currentState;
            GM_setValue('watermarkSites', watermarkSites);

            // 如果启用去水印，立即执行一次
            if (!currentState) {
                removeWatermark();
            } else {
                location.reload(); // 如果是关闭状态，需要刷新页面
            }

            // 更新按钮样式
            watermarkButton.style.cssText = getWatermarkButtonStyle(!currentState);
        });

        document.body.appendChild(watermarkButton);
    }

    // 移除复制限制及遮挡层的功能
    const enableCopyAndRemoveOverlay = () => {
        const currentHost = window.location.hostname;
        const copySites = GM_getValue('copySites', {});
        console.log('执行复制解除功能:', currentHost, copySites[currentHost]);

        if (!copySites[currentHost]) {
            console.log('当前网站未启用复制解除，退出函数');
            return;
        }

        // 处理CSDN特定的复制限制
        document.querySelectorAll('*').forEach(element => {
            // 移除CSDN特定的user-select限制
            if (element.classList.contains('htmledit_views') ||
                element.classList.contains('markdown_views') ||
                element.classList.contains('article_content')) {
                element.style.cssText = `
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    -ms-user-select: text !important;
                    user-select: text !important;
                `;
            }

            // 移除CSDN的事件监听器
            element.oncontextmenu = null;
            element.onselectstart = null;
            element.onselect = null;
            element.oncopy = null;
            element.onbeforecopy = null;
            element.oncut = null;
            element.onpaste = null;
            element.ondrag = null;
            element.ondragstart = null;
        });

        // 覆盖CSDN的复制事件处理
        document.addEventListener('copy', function(e) {
            e.stopPropagation();
            const selection = window.getSelection();
            e.clipboardData.setData('text/plain', selection.toString());
        }, true);

        // 移除CSDN的遮罩层和弹窗
        const removeOverlays = () => {
            const overlays = document.querySelectorAll('.login-mark, .login-box');
            overlays.forEach(overlay => overlay.remove());
        };

        // 定期检查并移除遮罩
        setInterval(removeOverlays, 100);

        // 移除所有元素的复制限制
        document.querySelectorAll('*').forEach(element => {
            // 允许选择文本
            element.style.userSelect = "text";
            element.style.webkitUserSelect = "text";
            element.style.msUserSelect = "text";
            element.style.MozUserSelect = "text";

            // 移除事件监听器
            element.onselectstart = null;
            element.oncontextmenu = null;
            element.onmousedown = null;
            element.onkeydown = null;
            element.oncopy = null;
            element.oncut = null;
            element.ondrag = null;
            element.ondragstart = null;

            // 移除 unselectable 属性
            element.removeAttribute('unselectable');
            element.removeAttribute('oncontextmenu');
            element.removeAttribute('oncopy');
            element.removeAttribute('oncut');
            element.removeAttribute('onselectstart');
        });

        // 移除遮层
        document.querySelectorAll('*').forEach(element => {
            const style = window.getComputedStyle(element);
            if ((style.position === 'absolute' || style.position === 'fixed') &&
                (style.opacity === '0' || parseFloat(style.opacity) < 0.1) &&
                style.zIndex > 0) {
                element.remove();
            }
        });

        // 覆盖常见的禁用右键和复制的方法
        document.oncontextmenu = null;
        document.onselectstart = null;
        document.oncopy = null;
        document.oncut = null;
        document.onpaste = null;
        document.onkeydown = null;
        document.onmousedown = null;

        // 覆盖 window 对象上的限制方法
        window.oncontextmenu = null;
        window.onselectstart = null;
        window.oncopy = null;
        window.oncut = null;
        window.onpaste = null;
        window.onkeydown = null;
        window.onmousedown = null;

        // 阻止页面使用 addEventListener 添加新的限制
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (type === 'contextmenu' || type === 'selectstart' ||
                type === 'copy' || type === 'cut' || type === 'paste' ||
                type === 'keydown' || type === 'mousedown') {
                return;
            }
            originalAddEventListener.call(this, type, listener, options);
        };

        // 移除 CSS 限制
        const styleElement1 = document.createElement('style');
        styleElement1.innerHTML = `
            * {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
                -webkit-touch-callout: default !important;
            }
            ::selection {
                background-color: #338FFF !important;
                color: #fff !important;
            }
        `;
        document.head.appendChild(styleElement1);

           // 移除keydown事件监听器
        document.removeEventListener('keydown', function(e) {
            if (e.ctrlKey && (e.keyCode == 65 || e.keyCode == 67 || e.keyCode == 83 || e.keyCode == 85)) {
                return false;
            }
        });
        // 获取歌词容器
        const lyricBody = document.querySelector('.lyricBody');
        if(lyricBody){
                // 移除禁止右键和选择的属性
            lyricBody.removeAttribute('oncontextmenu');
            lyricBody.removeAttribute('onselectstart');

            // 移除可能存在的事件监听器
            lyricBody.style.userSelect = 'text';
            lyricBody.style.webkitUserSelect = 'text';
            lyricBody.style.MozUserSelect = 'text';

            // 允许复制
            lyricBody.oncopy = null;
            lyricBody.oncut = null;
            lyricBody.onpaste = null;

            // 移除所有子元素的复制限制
            const elements = lyricBody.getElementsByTagName('*');
            for(let el of elements) {
                el.style.userSelect = 'text';
                el.style.webkitUserSelect = 'text';
                el.style.MozUserSelect = 'text';
                el.oncopy = null;
                el.oncut = null;
                el.onpaste = null;
            }
        }

        // 主要功能
        function enableFeatures() {
            // 重写原生方法
            HTMLElement.prototype.addEventListener = (function(original) {
                return function(type, listener, useCapture) {
                    if(type === 'selectstart' || type === 'contextmenu' || type === 'copy') {
                        return;
                    }
                    return original.apply(this, arguments);
                };
            })(HTMLElement.prototype.addEventListener);

            // 添加事件处理
            document.addEventListener('selectstart', allowSelection, true);
            document.addEventListener('contextmenu', allowSelection, true);
            document.addEventListener('copy', allowSelection, true);
            document.addEventListener('mousedown', allowSelection, true);
            document.addEventListener('mouseup', allowSelection, true);

            // 移除所有可能的事件监听器
            document.oncontextmenu = null;
            document.onselectstart = null;
            document.oncopy = null;
            document.onmousedown = null;
            document.onmouseup = null;

            // 添加样式
            if (!document.getElementById('enable-select-style')) {
                const style = document.createElement('style');
                style.id = 'enable-select-style';
                style.textContent = `
                    * {
                        -webkit-user-select: text !important;
                        -moz-user-select: text !important;
                        -ms-user-select: text !important;
                        user-select: text !important;
                    }
                    .ne-content,
                    .article-content,
                    .portrait-page-box,
                    .J_Article,
                    .J_PortraitMoveBox,
                    .portrait-page-box,
                    p,
                    h1,
                    span,
                    div {
                        -webkit-user-select: text !important;
                        -moz-user-select: text !important;
                        -ms-user-select: text !important;
                        user-select: text !important;
                        cursor: text !important;
                    }
                    ::selection {
                        background: #338fff !important;
                        color: #fff !important;
                    }
                `;
                document.head.appendChild(style);
            }
            // 立即执行
            enableFeatures();

            // 处理所有文本容器
            const elements = document.querySelectorAll('p, h1, div, span, .ne-content, .article-content, .portrait-page-box, .J_Article, .J_PortraitMoveBox');
            elements.forEach(el => {
                if(el) {
                    // 移除所有可能的事件监听器
                    el.oncontextmenu = null;
                    el.onselectstart = null;
                    el.oncopy = null;
                    el.onmousedown = null;
                    el.onmouseup = null;

                    // 设置样式
                    el.style.setProperty('-webkit-user-select', 'text', 'important');
                    el.style.setProperty('-moz-user-select', 'text', 'important');
                    el.style.setProperty('-ms-user-select', 'text', 'important');
                    el.style.setProperty('user-select', 'text', 'important');

                    // 移除其他可能的限制
                    el.removeAttribute('unselectable');
                }
            });
        }


        // 移除文章阅读限制
        const removeReadLimit = () => {
            const contentBox = document.querySelector('.blog-content-box');
            if (contentBox) {
                const article = contentBox.querySelector('article');
                if (article) {
                    article.style.height = 'auto';
                    article.style.overflow = 'visible';
                }
                // 移除登录提示框
                const loginBox = document.querySelector('.hide-article-box');
                if (loginBox) {
                    loginBox.remove();
                }
            }
        };

        // 定期检查并移除限制
        setInterval(removeReadLimit, 100);

        // 在添加样式表之前添加日志
        console.log('正在添加复制解除样式...');
        const styleElement2 = document.createElement('style');
        styleElement2.innerHTML = `
            * {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
                -webkit-touch-callout: default !important;
            }
            ::selection {
                background-color: #338FFF !important;
                color: #fff !important;
            }
        `;
        document.head.appendChild(styleElement2);
        console.log('复制解除样式添加完成');

        // 在 enableCopyAndRemoveOverlay 函数中添加
        const removeSoilElements = () => {
            document.querySelectorAll('.soil').forEach(el => {
                el.remove();
            });
        };

        // 定期执行清理
        setInterval(removeSoilElements, 100);

        if (window.location.hostname.includes('music.163.com')) {
            // 移除歌曲标题的复制限制
            document.querySelectorAll('.ttc b').forEach(el => {
                el.style.userSelect = 'text';
                el.style.webkitUserSelect = 'text';
            });

            // 允许复制歌曲标题的原始文本
            document.addEventListener('copy', (e) => {
                const selection = window.getSelection();
                if(selection.toString().includes('soil')) {
                    e.preventDefault();
                    const cleanText = selection.toString().replace(/soil.*?soil/g, '');
                    e.clipboardData.setData('text/plain', cleanText);
                }
            }, true);
        }
    };

    // 修改 MutationObserver 部分
    const observer = new MutationObserver(() => {
        const currentHost = window.location.hostname;
        const copySites = GM_getValue('copySites', {});

        // 只监听复制限制功能
        if (copySites[currentHost]) {
            enableCopyAndRemoveOverlay();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 修改页面加载完成时的检查逻辑
    window.addEventListener('load', () => {
        const currentHost = window.location.hostname;
        const copySites = GM_getValue('copySites', {});
        const watermarkSites = GM_getValue('watermarkSites', {});

        // 检查并执行复制解除功能
        if (copySites[currentHost]) {
            enableCopyAndRemoveOverlay();
        }

        // 检查并执行去水印功能
        if (watermarkSites[currentHost]) {
            removeWatermark();
        }
    });

    // 同时保留 DOMContentLoaded 的检查，以确保更早的响应
    document.addEventListener('DOMContentLoaded', () => {
        const currentHost = window.location.hostname;
        const copySites = GM_getValue('copySites', {});
        const watermarkSites = GM_getValue('watermarkSites', {});

        if (copySites[currentHost]) {
            enableCopyAndRemoveOverlay();
        }

        if (watermarkSites[currentHost]) {
            removeWatermark();
        }
    });

    // 将功能实现代码移出条件判断，这样在 iframe 中也能执行
    function removeWatermark() {
        const currentHost = window.location.hostname;
        const watermarkSites = GM_getValue('watermarkSites', {});
        console.log('执行去水印功能:', currentHost, watermarkSites[currentHost]);

        if (!watermarkSites[currentHost]) {
            console.log('当前网站未启用去水印，退出函数');
            return;
        }

        // 添加去水印的具体实现
        document.addEventListener('copy', function(e) {
            e.stopPropagation();
            const selection = window.getSelection();
            e.clipboardData.setData('text/plain', selection.toString());
            e.preventDefault();
        }, true);

        // 添加额外的水印移除代码
        const style = document.createElement('style');
        style.innerHTML = `
            [class*="water"], [class*="Water"], [class*="WATER"],
            [class*="copy"], [class*="Copy"], [class*="COPY"],
            [id*="water"], [id*="Water"], [id*="WATER"],
            [id*="copy"], [id*="Copy"], [id*="COPY"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(style);

        // 定期检查并移除水印元素
        const removeWatermarkElements = () => {
            const elements = document.querySelectorAll('[class*="water"], [class*="Water"], [class*="WATER"], [id*="water"], [id*="Water"], [id*="WATER"]');
            elements.forEach(element => {
                element.remove();
            });
        };

        setInterval(removeWatermarkElements, 1000);
        console.log('水印移除功能已启用');
    }
})();