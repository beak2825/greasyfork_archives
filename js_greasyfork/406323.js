// ==UserScript==
// @name               极简财新
// @name:en            Simple-Caixin
// @namespace          http://www.caixin.com/
// @version            0.8.20250312
// @description        清理页面无用元素（水印、分享按钮、导航栏、评论栏、网站地图等），调整板式，专注阅读
// @description:en     A script which removed some unuseful elements on caixin.com
// @author             EAK8T6Z
// @match              *://*.caixin.com/*
// @homepageURL        https://github.com/EAK8T6Z/Simple-Caixin
// @supportURL         https://github.com/EAK8T6Z/Simple-Caixin/issues
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              window.onurlchange
// @run-at             document-start
// @license            MPL 2.0
// @changelog          0.8.20250312 - 调整了文章题图和图注的样式
// @downloadURL https://update.greasyfork.org/scripts/406323/%E6%9E%81%E7%AE%80%E8%B4%A2%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/406323/%E6%9E%81%E7%AE%80%E8%B4%A2%E6%96%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取保存的设置
    const hideAiVoice = GM_getValue('hideAiVoice', true);
    const hideComment = GM_getValue('hideComment', false);

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
            max-width: 970px;
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
            max-width: 990px !important;
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
        .media, .media_pic {
            width: 100% !important;
            max-width: 480px !important;
            height: auto !important;
            position: relative;
        }
        /* 设置图片容器的布局和背景 */
        .media_pic {
            display: flex;
            flex-direction: column; /* 改为纵向排列 */
            justify-content: center;
            align-items: center;
            background-color: #f0f0f0;
            min-height: unset !important;
        }
        /* 设置图片容器中dt元素的样式 */
        .media_pic dt {
            width: 100% !important;
            height: auto !important;
            display: flex;
            justify-content: center;
            align-items: center;
            aspect-ratio: 3 / 2;
        }
        /* 设置图片本身的样式 */
        .media_pic img {
            max-width: 100%;
            max-height: 100%;
            width: auto !important;
            height: auto !important;
            object-fit: contain !important;
        }
        /* 设置说明文字的样式 */
        .media_pic dd {
            width: 100%;
            text-align: center; /* 文字居中 */
            margin: 0 0 0 0;    /* 上下左右 margin 设为0 */
        }
        /* 对不支持 aspect-ratio 的浏览器使用替代方案 */
        @supports not (aspect-ratio: 1 / 1) {
            .media_pic::before {
                content: "";
                display: block;
                padding-top: 66.6%; /* 3:2 的宽高比 */
            }
            .media_pic img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        }
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
        .sitenav, .vioce-box-cons, .icon_key, .subhead, .pip, .function01, .morelink,
        .greenBg, .redBg, .cx-wx-hb-tips, .conri, .f_ri, .fenghui_code, .comment,
        .hot_word_v2, .bottom_tong_ad, .copyright, .navBottom, .multimedia,
        .share_list, .renewals, .wifi-tips, .adsame-banner-box {
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
