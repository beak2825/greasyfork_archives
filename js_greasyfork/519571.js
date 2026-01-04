// ==UserScript==
// @name               财新网页版阅读增强
// @name:en            caixin-pro
// @namespace          http://www.caixin.com/
// @version            1.1
// @description        清理页面无用元素，调整板式，专注阅读，允许复制粘贴。本代码基于Simple-Caixin二次开发，其原作者EAK8T6Z，原项目地址https://github.com/EAK8T6Z/Simple-Caixin
// @description:en     A script which removed some unuseful elements on caixin.com
// @author             HaiBooLang
// @match              *://*.caixin.com/*
// @homepageURL        https://github.com/HaiBooLang/caixin-pro
// @supportURL         https://github.com/HaiBooLang/caixin-pro/issues
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              window.onurlchange
// @run-at             document-start
// @license            MPL 2.0
// @downloadURL https://update.greasyfork.org/scripts/519571/%E8%B4%A2%E6%96%B0%E7%BD%91%E9%A1%B5%E7%89%88%E9%98%85%E8%AF%BB%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/519571/%E8%B4%A2%E6%96%B0%E7%BD%91%E9%A1%B5%E7%89%88%E9%98%85%E8%AF%BB%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.onload = function() {
        // 覆盖 oncopy 事件
        document.oncopy = function(event) {
            return true; // 允许复制
        };

        // 覆盖 onselectstart 事件
        document.onselectstart = function(event) {
            return true; // 允许选择文本
        };

        document.oncontextmenu = function() {
            return true; // 允许上下文菜单
        }
    };

        /**
     * 监听所有的 addEventListener, removeEventListener 事件
     */


    // 获取保存的设置
    const hideAiVoice = GM_getValue('hideAiVoice', true);
    const hideComment = GM_getValue('hideComment', true);

    // 创建设置按钮
    function createToggleButton() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            opacity: 0.3;
            transition: all 0.3s;
        `;

        const icon = document.createElement('div');
        icon.innerHTML = '⚙️';
        icon.style.cssText = `
            font-size: 16px;
            cursor: pointer;
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: none;
            flex-direction: column;
            gap: 5px;
        `;

        // 语音按钮
        const aiButton = document.createElement('button');
        aiButton.innerHTML = `语音: ${hideAiVoice ? '已隐藏' : '已显示'}`;
        aiButton.style.cssText = `
            padding: 5px 10px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
            white-space: nowrap;
        `;

        // 评论按钮
        const commentButton = document.createElement('button');
        commentButton.innerHTML = `评论: ${hideComment ? '已隐藏' : '已显示'}`;
        commentButton.style.cssText = aiButton.style.cssText;

        buttonContainer.appendChild(aiButton);
        buttonContainer.appendChild(commentButton);
        container.appendChild(icon);
        container.appendChild(buttonContainer);

        // 语音按钮点击事件
        aiButton.addEventListener('click', () => {
            const newValue = !GM_getValue('hideAiVoice', true);
            GM_setValue('hideAiVoice', newValue);
            aiButton.innerHTML = `语音: ${newValue ? '已隐藏' : '已显示'}`;
            updateStyles();
        });

        // 评论按钮点击事件
        commentButton.addEventListener('click', () => {
            const newValue = !GM_getValue('hideComment', false);
            GM_setValue('hideComment', newValue);
            commentButton.innerHTML = `评论: ${newValue ? '已隐藏' : '已显示'}`;
            updateStyles();
        });

        // 滚动监听
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (scrollTop <= 10) {
                    container.style.transform = 'translateY(0)';
                    container.style.opacity = '0.3';
                } else {
                    container.style.transform = 'translateY(-100px)';
                    container.style.opacity = '0';
                }
            }, 100);
        });

        // 鼠标悬停效果
        container.addEventListener('mouseenter', () => {
            buttonContainer.style.display = 'flex';
            container.style.opacity = '1';
        });

        container.addEventListener('mouseleave', () => {
            buttonContainer.style.display = 'none';
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            container.style.opacity = scrollTop <= 10 ? '0.3' : '0';
        });

        document.body.appendChild(container);
    }

    // 更新样式
    function updateStyles() {
        const hideAiVoice = GM_getValue('hideAiVoice', true);
        const hideComment = GM_getValue('hideComment', false);

        GM_addStyle(`
            .pc-aivoice, .pc-aivoice.trial {
                display: ${hideAiVoice ? 'none' : 'block'} !important;
            }
            .pc-comment {
                display: ${hideComment ? 'none' : 'block'} !important;
            }
        `);
    }

    // 应用初始样式
    GM_addStyle(`
        /* 格式调整 */
        /* 调整导航栏宽度 */
        .littlenav, .littlenavwarp, .littlenavmore, .Nav {
            width: 100% !important;
        }
        /* 设置导航栏布局 */
        .littlenavwarp {
            display: flex;
            justify-content: center;
            gap: 2rem;
            box-sizing: border-box;
            max-width: 1200px !important;
        }
        /* 左侧导航项目布局 */
        .littlenavwarp > .left {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
        }
        /* 导航菜单布局 */
        .Nav > ul {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }
        /* 调整主要内容区域宽度和边距 */
        .comMain {
            max-width: 1200px !important;
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
        }
        /* 设置内容区域为全宽 */
        .conlf {
            width: 100% !important;
        }
        /* 调整图片边距 */
        .media.pip_none {
            padding: 20px;
        }

        /* 响应式图片处理 */
        /* 设置图片容器的基本样式 */
        .media dd {
            width: min(100%, 480px);
            box-sizing: border-box;
        }

        /* 中等屏幕设备调整 */
        @media screen and (max-width: 998px) {
            .logimage {
                display: none; /* 隐藏财新 logo */
            }
            .Nav .navtabs {
                margin: 0;
            }
            .littlenavwarp > .searchbox {
                display: none; /* 隐藏搜索框 */
            }
        }

        /* 隐藏不需要的元素 */
        .sitenav, .vioce-box-cons, .icon_key, .share_list, .function01, .morelink,
        .greenBg, .redBg, .cx-wx-hb-tips, .conri, .f_ri, .fenghui_code, .comment,
        .hot_word_v2, .bottom_tong_ad, .copyright, .navBottom, .multimedia,
        .share_list, .renewals {
            display: none !important;
        }

        /* 移除背景水印 */
        #Main_Content_Val {
            background: none !important;
        }
    `);

    // 应用语音相关样式
    updateStyles();

    // 等待 DOM 加载完成后添加按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }
})();
