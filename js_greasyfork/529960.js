// ==UserScript==
// @name         香香去广告美化版
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  去xxfz网站广告并美化界面
// @author       皮皮
// @match        https://boylove.cc/*
// @grant        none
// @license      pipi
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/529960/%E9%A6%99%E9%A6%99%E5%8E%BB%E5%B9%BF%E5%91%8A%E7%BE%8E%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/529960/%E9%A6%99%E9%A6%99%E5%8E%BB%E5%B9%BF%E5%91%8A%E7%BE%8E%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

   const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `

/* 广告屏蔽区域 */
/* ====================== */

/* 顶部广告区 */
.main-banner,
.index-marquee,
.reader-home-swiper,
.ads-color-text,
.reader-home-title-friend {
    display: none !important;
}

/* 弹窗广告区 */
.div_sticky2,
#floating_page,
.blocked_hint_msg {
    display: none !important;
}

/* 内容广告区 */
.sqcguljs,
.reader-zone-list-view:nth-of-type(7),
.ad_topText,
#footer-content-up,
.reader-cartoon-chapter div[data-type='1'],
.fakomgqg,
.gyuqkbvj,
a[data-route-tab-id='bookshelf']:nth-of-type(n+3),
.gdinxbsx,
.mgtwwdwc,
.hrhsmhrc,
div.container:nth-of-type(4),
div.reader-zone-list-view:nth-of-type(9),
div.oiiatg_k
div.container:nth-of-type(9) {
    display: none !important;
    visibility: hidden !important;
}
div[style*="width:300px;height:100px"],[style*="height: 156.25px;"],[style*="height: 769.583px"],[style*="height: 307.833px"],[style*="height: 163.75px;"]{
    display: none !important;
    visibility: hidden !important;
}

/* 底部广告区 */
.bottom_app_link,
.mo-quick-menu,
.milktea_m a,
.card-content li:nth-of-type(n+4) .item-inner,
.mhFootHint,
.reader-cartoon-image a {
    display: none !important;
}

/* 禁止所有 GIF 图片 */
img[src$=".gif"] {
    display: none !important;
    visibility: hidden !important;
}



/* ====================== */
/* 全局主题美化 */
/* ====================== */

/* 主色调定义 */
:root {
    --primary-color: #ff85a2;  /* 主粉色 */
    --primary-light: #ffd6e7;  /* 浅粉色 */
    --primary-dark: #ff478f;   /* 深粉色 */
    --text-color: #5a5a5a;     /* 正文文字 */
    --text-light: #888;        /* 浅色文字 */
    --bg-color: #fff9fb;       /* 背景色 */
    --card-bg: #fff;           /* 卡片背景 */
    --border-color: #ffe0e8;   /* 边框色 */
}

/* 基础页面样式 */
body {
    background-color: var(--bg-color) !important;
    color: var(--text-color) !important;
    font-family: "PingFang SC", "Microsoft YaHei", sans-serif !important;
}

/* ====================== */
/* 导航栏美化 */
/* ====================== */

/* 顶部导航栏 */
.md .color-theme-orange.navbar,
.md .color-theme-orange .navbar {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)) !important;
    box-shadow: 0 2px 10px rgba(255, 133, 162, 0.2) !important;
}

/* 导航栏文字和图标 */
.navbar a,
.navbar .title,
.navbar i {
    color: white !important;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
}

/* ====================== */
/* 内容区域美化 */
/* ====================== */

/* 卡片式内容区块 */
.card {
    background: var(--card-bg) !important;
    border-radius: 12px !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
    margin-bottom: 15px !important;
    border: 1px solid var(--border-color) !important;
}

/* 标题样式 */
.reader-home-title-fixed .reader-home-title:first-child {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)) !important;
    color: white !important;
    border-radius: 8px 8px 0 0 !important;
    font-weight: 600 !important;
}

.reader-home-title {
    background-color: var(--primary-light) !important;
    color: var(--primary-dark) !important;
    border-radius: 8px !important;
    font-weight: 500 !important;
}

/* ====================== */
/* 按钮和交互元素 */
/* ====================== */

/* 主要按钮 */
.button.button-fill,
.button.button-active {
    background: var(--primary-color) !important;
    color: white !important;
    border-radius: 20px !important;
    box-shadow: 0 2px 5px rgba(255, 133, 162, 0.3) !important;
    transition: all 0.3s ease !important;
}

.button.button-fill:hover,
.button.button-active:hover {
    background: var(--primary-dark) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 8px rgba(255, 133, 162, 0.4) !important;
}

/* 图标按钮 */
#chapter.btn i,
.fa-arrow-left,
.fa-info-circle {
    color: var(--primary-color) !important;
    transition: all 0.2s ease !important;
}

#chapter.btn i:hover,
.fa-arrow-left:hover,
.fa-info-circle:hover {
    color: var(--primary-dark) !important;
    transform: scale(1.1) !important;
}

/* ====================== */
/* 列表和表格美化 */
/* ====================== */

/* 书籍列表 */
.list .item-link {
    color: var(--text-color) !important;
    border-bottom: 1px solid var(--border-color) !important;
}

.list .item-link:hover {
    background-color: var(--primary-light) !important;
}

/* 已读标记 */
.seen {
    background-color: var(--primary-light) !important;
    color: var(--primary-dark) !important;
}

/* ====================== */
/* 页脚和其他元素 */
/* ====================== */

/* 返回顶部按钮 */
.app_totop {
    background: var(--primary-color) !important;
    color: white !important;
    border-radius: 50% !important;
    box-shadow: 0 2px 10px rgba(255, 133, 162, 0.3) !important;
    width: 40px !important;
    height: 40px !important;
    line-height: 40px !important;
}

/* 分页控件 */
.pagination-bar {
    background: linear-gradient(135deg, var(--primary-light), white)) !important;
    color: var(--primary-dark) !important;
    border-radius: 20px !important;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05) !important;
}

/* ====================== */
/* 响应式调整 */
/* ====================== */

@media (max-width: 768px) {
    .card {
        border-radius: 0 !important;
        margin-bottom: 10px !important;
    }

    .reader-home-title {
        font-size: 0.9rem !important;
    }
}
    `;


    // 更可靠的样式注入方式
    function injectStyle() {
        if (document.head && !document.getElementById('xxfz-beauty-style')) {
            style.id = 'xxfz-beauty-style';
            document.head.appendChild(style);
        }
    }


    if (document.head) {
        injectStyle();
    } else {
        document.addEventListener('DOMContentLoaded', injectStyle);
        const observer = new MutationObserver(function(mutations) {
            injectStyle();
        });
        observer.observe(document.documentElement, {childList: true, subtree: true});
    }
})();