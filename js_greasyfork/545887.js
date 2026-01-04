// ==UserScript==
// @name         小红书摸鱼插件
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  隐藏小红书网页版左上角的logo，便于工作摸鱼
// @author       You
// @match        https://www.xiaohongshu.com/*
// @icon         https://www.google.com/s2/favicons?domain=xiaohongshu.com
// @license      MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545887/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%91%B8%E9%B1%BC%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/545887/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%91%B8%E9%B1%BC%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 立即注入CSS样式到HTML头部，在任何元素渲染前就隐藏logo
    const injectCSS = () => {
        const style = document.createElement('style');
        style.id = 'xiaohongshu-hide-logo-style';
        style.textContent = `
            /* 隐藏小红书logo的所有可能选择器 */
            img.header-logo,
            .header-logo,
            img[src^="data:image/png;base64"],
            .logo,
            .header .logo,
            .nav-logo,
            .site-logo,
            a[href="/"] img,
            .header-container img[alt*="小红书"],
            .header-container img[alt*="logo"],
            .header-wrapper img {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                width: 0 !important;
                height: 0 !important;
            }
            
            /* 强制修改所有按钮样式为文字按钮 - 防止闪烁 */
            .reds-button-new,
            .reds-button-new.follow-button,
            .note-detail-modal .reds-button-new,
            .note-detail .reds-button-new,
            .modal .reds-button-new,
            .note-scroller .reds-button-new,
            .feeds-page .reds-button-new,
            [class*="modal"] .reds-button-new,
            [class*="dialog"] .reds-button-new,
            [class*="popup"] .reds-button-new,
            button[class*="reds-button"],
            [class*="button"][class*="reds"],
            .reds-button {
                background-color: transparent !important;
                background: transparent !important;
                background-image: none !important;
                color: #315efb !important;
                border: none !important;
                box-shadow: none !important;
                transition: none !important;
            }
            
            /* 防止按钮闪烁的通用样式 */
            * {
                --reds-button-bg: transparent !important;
                --reds-button-color: #315efb !important;
            }
            
            /* 覆盖可能的内联样式 */
            .reds-button-new[style*="background"] {
                background-color: transparent !important;
                background: transparent !important;
            }
        `;
        
        // 确保样式被插入到最前面
        if (document.head) {
            document.head.insertBefore(style, document.head.firstChild);
        } else if (document.documentElement) {
            document.documentElement.appendChild(style);
        }
    };
    
    // 立即执行CSS注入
    injectCSS();
    
    // 如果DOM还没准备好，再次确保注入
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectCSS);
    }

    // 使用MutationObserver监听动态加载的logo元素
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    // 检查新添加的节点及其子元素
                    const logoSelectors = [
                        'img.header-logo', '.header-logo', 'img[src^="data:image/png;base64"]',
                        '.logo', '.header .logo', '.nav-logo', '.site-logo',
                        'a[href="/"] img', '.header-container img', '.header-wrapper img'
                    ];
                    
                    logoSelectors.forEach(selector => {
                        if (node.matches && node.matches(selector)) {
                            node.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; width: 0 !important; height: 0 !important;';
                        }
                        const childElements = node.querySelectorAll && node.querySelectorAll(selector);
                        if (childElements) {
                            childElements.forEach(el => {
                                el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; width: 0 !important; height: 0 !important;';
                            });
                        }
                    });
                }
            });
        });
    });

    // 当DOM准备好时开始观察
    const startObserver = () => {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    };
    
    if (document.body) {
        startObserver();
    } else {
        document.addEventListener('DOMContentLoaded', startObserver);
    }

    // 修改浏览器标签页图标(favicon)
    const changeFavicon = () => {
        // 移除现有的favicon
        const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
        existingFavicons.forEach(favicon => favicon.remove());
        
        // 创建新的favicon - 使用Group 3图标
        const newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.type = 'image/svg+xml';
        // 使用Group 3 SVG图标
        newFavicon.href = 'data:image/svg+xml;base64,' + btoa(`
            <svg width="249" height="249" viewBox="0 0 249 249" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="249" height="249" rx="40" fill="white"/>
                <path d="M61.0707 129.226C82.7849 124.564 79.8264 98.6137 79.1765 92.942C78.1131 84.1981 67.8286 68.9146 53.8629 70.1234C36.2888 71.7004 33.7211 97.0867 33.7211 97.0867C31.3443 108.821 39.411 133.894 61.0707 129.226ZM84.1301 174.364C83.4939 176.186 82.076 180.853 83.303 184.916C85.7253 194.033 93.6375 194.442 93.6375 194.442H105.008V166.647H92.8331C87.3614 168.278 84.7209 172.537 84.1301 174.364ZM101.372 85.7115C113.366 85.7115 123.059 71.9095 123.059 54.8444C123.059 37.7975 113.366 24 101.372 24C89.3974 24 79.681 37.7975 79.681 54.8444C79.681 71.9095 89.4019 85.7115 101.372 85.7115ZM153.027 87.752C169.056 89.8335 179.363 72.7275 181.412 59.7617C183.503 46.814 173.159 31.7759 161.811 29.19C150.441 26.5813 136.243 44.7962 134.948 56.6713C133.403 71.1869 137.025 85.6933 153.027 87.752ZM192.301 163.965C192.301 163.965 167.501 144.778 153.022 124.041C133.398 93.4646 105.522 105.908 96.1961 121.46C86.9115 137.007 72.4414 146.841 70.3872 149.445C68.3012 152.009 40.429 167.056 46.6188 194.537C52.804 222 74.5364 221.478 74.5364 221.478C74.5364 221.478 90.5517 223.055 109.13 218.896C127.718 214.774 143.719 219.923 143.719 219.923C143.719 219.923 187.134 234.462 199.014 206.476C210.88 178.481 192.301 163.965 192.301 163.965ZM118.019 205.617H89.7927C77.6041 203.186 72.7504 194.869 72.1369 193.451C71.537 192.01 68.074 185.325 69.9055 173.95C75.1727 156.908 90.1927 155.685 90.1927 155.685H105.217V137.216L118.015 137.411V205.617H118.019ZM170.587 205.422H138.107C125.518 202.177 124.932 193.233 124.932 193.233V157.317L138.107 157.103V189.384C138.911 192.828 143.188 193.451 143.188 193.451H156.572V157.317H170.587V205.422ZM216.565 109.525C216.565 103.322 211.412 84.6435 192.301 84.6435C173.159 84.6435 170.601 102.272 170.601 114.734C170.601 126.627 171.605 143.228 195.383 142.701C219.169 142.174 216.565 115.761 216.565 109.525Z" fill="#3245DF"/>
            </svg>
        `);
        
        document.head.appendChild(newFavicon);
        
        // 修改页面标题为百度相关内容
        if (document.title.includes('小红书') || document.title.includes('工作文档')) {
            document.title = '百度一下，你就知道';
        }
    };
    
    // 立即执行favicon修改
    changeFavicon();
    
    // 页面加载完成后的处理
    window.addEventListener('load', function() {
        // 修改按钮样式为文字按钮
        const modifyButtonStyles = () => {
            // 修改关注按钮
            const followButtons = document.querySelectorAll('.reds-button-new.follow-button');
            followButtons.forEach(btn => {
                btn.style.backgroundColor = 'transparent !important';
                btn.style.color = '#315efb !important';
                btn.style.border = 'none !important';
            });
            
            // 修改弹出内容中的按钮
            const modalButtons = document.querySelectorAll('.note-detail-modal .reds-button-new, .note-detail .reds-button-new, .modal .reds-button-new');
            modalButtons.forEach(btn => {
                btn.style.backgroundColor = 'transparent !important';
                btn.style.color = '#315efb !important';
                btn.style.border = 'none !important';
            });
            
            // 修改所有可能的按钮
            const allButtons = document.querySelectorAll('.reds-button-new');
            allButtons.forEach(btn => {
                if (btn.style.backgroundColor && btn.style.backgroundColor !== 'transparent') {
                    btn.style.backgroundColor = 'transparent !important';
                    btn.style.color = '#315efb !important';
                    btn.style.border = 'none !important';
                }
            });
        };
        
        modifyButtonStyles();
        
        // 监听弹出内容的按钮变化
        const buttonObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // 检查新添加的按钮元素
                        if (node.matches && node.matches('.reds-button-new')) {
                            node.style.backgroundColor = 'transparent !important';
                            node.style.color = '#315efb !important';
                            node.style.border = 'none !important';
                        }
                        const newButtons = node.querySelectorAll && node.querySelectorAll('.reds-button-new');
                        if (newButtons) {
                            newButtons.forEach(btn => {
                                btn.style.backgroundColor = 'transparent !important';
                                btn.style.color = '#315efb !important';
                                btn.style.border = 'none !important';
                            });
                        }
                    }
                });
            });
        });
        
        // 开始监听按钮变化
        if (document.body) {
            buttonObserver.observe(document.body, { childList: true, subtree: true });
        }
        
        // 最终确保所有可能的logo都被隐藏
        const logoSelectors = [
            'img.header-logo', '.header-logo', 'img[src^="data:image/png;base64"]',
            '.logo', '.header .logo', '.nav-logo', '.site-logo',
            'a[href="/"] img', '.header-container img', '.header-wrapper img'
        ];
        
        logoSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; width: 0 !important; height: 0 !important;';
            });
        });
        
        // 再次确保favicon和标题被修改
        changeFavicon();
    });
})();