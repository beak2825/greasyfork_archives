// ==UserScript==
// @name         SCBOY 论坛上班摸鱼模式
// @namespace    http://tampermonkey.net/
// @version      2.7.1
// @description  将 scboy.cc 论坛页面重排为低调的文章样式，隐藏所有干扰元素，方便上班摸鱼。
// @author       olo1999
// @match        https://www.scboy.cc/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541498/SCBOY%20%E8%AE%BA%E5%9D%9B%E4%B8%8A%E7%8F%AD%E6%91%B8%E9%B1%BC%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/541498/SCBOY%20%E8%AE%BA%E5%9D%9B%E4%B8%8A%E7%8F%AD%E6%91%B8%E9%B1%BC%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 'true' 代表开启上班模式 (文章视图), 'false' 代表关闭 (论坛视图)
    let isBossMode = GM_getValue('bossModeStateV2', false);
 
    // 注入CSS样式
    // 使用 .boss-is-coming 类来控制所有需要隐藏和重排的元素
    GM_addStyle(`
        /* ========== 上班模式总开关 ========== */
        body.boss-is-coming {
            background-image: none !important;
            background-color: #F0F2F5 !important; /* 一个朴素、常见的浅灰色背景 */
        }
 
        /* ========== 1. 隐藏所有视觉和干扰元素 ========== */
        .boss-is-coming img,                       /* 所有图片 */
        .boss-is-coming .bg,                       /* 论坛背景层 */
        .boss-is-coming #logo,                     /* 论坛Logo */
        .boss-is-coming .thread-list-item-image,   /* 列表中的主题图片 */
        .boss-is-coming [class*="emote"],          /* 所有表情符号 */
        .boss-is-coming [class*="emoji"],
        .boss-is-coming .share-component.social-share, /* 社交分享按钮 */
        .boss-is-coming .post-signature,           /* 帖子底部的签名档 */
        .boss-is-coming .post-meta .actions,       /* 帖子底部的操作按钮（引用/回复） */
        .boss-is-coming .actGotop,                 /* V2.4: 隐藏返回顶部按钮 */
        .boss-is-coming .text-muted.small,         /* V2.5 新增: 隐藏主题列表的统计数据 */
        .boss-is-coming .thread-list-item .media-body > div:last-child /* V2.5 新增: 隐藏主题列表的最后回复信息 */
        {
            display: none !important;
            visibility: hidden !important;
        }
 
 
        /* ========== 2. 重排布局为文章样式 ========== */
 
        /* 将主内容区域宽度调整为更像文档 */
        .boss-is-coming .thread-page .main,
        .boss-is-coming .forum-page .main {
            max-width: 800px !important; /* 限制最大宽度，类似文档 */
            margin: 0 auto !important;   /* 居中 */
        }
 
        /* 隐藏每个帖子的左侧用户信息栏 */
        .boss-is-coming .thread-post .user-info {
            display: none !important;
        }
 
        /* 让帖子内容区域占据整行 */
        .boss-is-coming .thread-post .post-content-wrapper {
            width: 100% !important;
            margin-left: 0 !important;
        }
 
        /* 移除帖子本身的背景和边框，让它们“融合”在一起 */
        .boss-is-coming .thread-post {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 15px 0 !important; /* 调整上下间距 */
        }
 
        /* 用一条低调的分割线来区分楼层，而不是用卡片 */
        .boss-is-coming .thread-post:not(:first-child) {
            border-top: 1px solid #ddd !important;
        }
 
        /* 低调地显示用户名和楼层 */
        .boss-is-coming .post-meta .username,
        .boss-is-coming .post-meta .post-num {
            font-size: 14px !important;
            font-weight: bold;
            color: #555 !important;
        }
        .boss-is-coming .post-meta .date {
             color: #999 !important;
        }
 
        /* 让帖子内容文字更易读 */
        .boss-is-coming .post-content .message {
            font-size: 16px !important;
            line-height: 1.8 !important;
            color: #333 !important;
        }
 
        /* ========== 3. 隐藏右侧边栏，并将主内容区扩展到100% ========== */
 
        /* 隐藏右侧边栏本身 */
        .boss-is-coming .col-lg-3.aside {
            display: none !important;
        }
 
        /* 让左侧主内容区填满宽度 */
        .boss-is-coming .col-lg-9 {
            width: 100% !important;
            max-width: 100% !important; /* 覆盖 bootstrap 的 max-width */
            flex: 0 0 100% !important;   /* 覆盖 bootstrap 的 flex-basis */
        }
 
        /* ========== 4. 移除道具（土豆雷等）的内联背景图 ========== */
        /* 使用属性选择器[style*="background"]来匹配所有带内联背景样式的div，并强行覆盖 */
        .boss-is-coming .message div[style*="background"] {
            background-image: none !important;
            background: transparent !important; /* 彻底移除背景 */
            min-height: 0 !important; /* 移除为了显示背景而设置的最小高度 */
        }
    `);
 
    // 创建切换按钮 (代码无变化)
    const toggleButton = document.createElement('button');
    document.body.appendChild(toggleButton);
 
    // 更新按钮文字和页面样式的函数 (代码无变化)
    const updateMode = () => {
        if (isBossMode) {
            document.body.classList.add('boss-is-coming');
            toggleButton.textContent = '摸鱼模式';
            Object.assign(toggleButton.style, {
                backgroundColor: '#28a745', // 绿色，表示安全
                color: 'white',
            });
        } else {
            document.body.classList.remove('boss-is-coming');
            toggleButton.textContent = '上班模式';
            Object.assign(toggleButton.style, {
                backgroundColor: '#dc3545', // 红色，表示“危险”
                color: 'white',
            });
        }
    };
 
    // 设置按钮的固定样式 (代码无变化)
    Object.assign(toggleButton.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '9999',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        transition: 'background-color 0.3s',
    });
 
 
    // 按钮点击事件 (代码无变化)
    toggleButton.addEventListener('click', () => {
        isBossMode = !isBossMode;
        GM_setValue('bossModeStateV2', isBossMode);
        updateMode();
    });
 
    // 页面加载时立即应用保存的模式 (代码无变化)
    updateMode();
})();