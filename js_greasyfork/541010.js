// ==UserScript==
// @name         Bilibili 动态页宽屏优化
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  优化B站动态页和动态详情页在宽屏显示器上的布局，增加内容区域宽度并支持自适应，统一两类页面的主内容宽度。
// @author       vnry
// @match        https://t.bilibili.com/*
// @match        https://www.bilibili.com/opus/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541010/Bilibili%20%E5%8A%A8%E6%80%81%E9%A1%B5%E5%AE%BD%E5%B1%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/541010/Bilibili%20%E5%8A%A8%E6%80%81%E9%A1%B5%E5%AE%BD%E5%B1%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
:root {
    --page-max-content-width: 1600px;
    --dyn-page-outer-width: calc(var(--page-max-content-width) + 280px + 360px + 40px);
}

.bili-header__bar {
    max-width: var(--dyn-page-outer-width) !important;
    margin-left: auto !important;
    margin-right: auto !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
}

#app {
    max-width: unset !important;
    min-width: 1200px !important;
}
#app .bgc,
#app .bg {
    width: 100% !important;
    left: 0 !important;
    transform: none !important;
}

@media screen and (min-width: 1380px) {
    #app .bili-dyn-home--member {
        width: min(var(--dyn-page-outer-width), 100% - 40px) !important;
        margin-left: auto !important;
        margin-right: auto !important;
    }
    #app .bili-dyn-home--member > main {
        flex: 1 !important;
        width: min(var(--page-max-content-width), 100%) !important;
        margin-right: 20px !important;
    }
    #app .bili-dyn-home--member aside.left {
        flex-shrink: 0 !important;
        width: 280px !important;
        margin-right: 20px !important;
    }
    #app .bili-dyn-home--member aside.right {
        flex-shrink: 0 !important;
        width: 360px !important;
    }

    .bili-dyn-publishing,
    .bili-dyn-up-list,
    .bili-dyn-list {
        width: 100% !important;
        box-sizing: border-box;
    }
    .bili-dyn-item {
        min-width: unset !important;
        width: 100% !important;
        box-sizing: border-box;
    }
    .bili-dyn-item__main {
        padding-left: 88px !important;
        padding-right: 20px !important;
    }
    .bili-dyn-content__orig.reference {
        padding: 20px !important;
        box-sizing: border-box;
    }

    .bili-dyn-card-video {
        width: 100% !important;
        height: 180px !important;
        box-sizing: border-box;
    }
    .bili-dyn-card-video__header {
        width: 320px !important;
        flex-shrink: 0;
    }
    .bili-dyn-card-video__body {
        flex: 1 !important;
        padding: 16px 20px 14px !important;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .bili-dyn-card-video__title {
        font-size: 16px !important;
        line-height: 24px !important;
        -webkit-line-clamp: 2 !important;
        height: auto !important;
    }
    .bili-dyn-card-video__desc {
        font-size: 14px !important;
        line-height: 20px !important;
        -webkit-line-clamp: 3 !important;
        height: auto !important;
        margin-top: 8px !important;
    }
    .bili-dyn-card-video__stat {
        position: relative !important;
        bottom: unset !important;
        left: unset !important;
        margin-top: auto !important;
    }

    .dyn-card-opus__pics {
        margin-top: 16px !important;
    }
    .bili-album__preview.grid3 {
        width: 100% !important;
        grid-template-columns: repeat(3, 1fr) !important;
        grid-gap: 8px !important;
    }
    .bili-album__preview.grid2 {
        width: 100% !important;
        grid-template-columns: repeat(2, 1fr) !important;
        grid-gap: 8px !important;
    }
    .bili-album__preview.single .bili-album__preview__picture {
        width: 50% !important;
        height: auto !important;
        max-height: 500px;
    }
    .bili-album__preview__picture__img {
        height: 100% !important;
    }

    .bili-dyn-my-info,
    .bili-dyn-live-users,
    .bili-dyn-search-trendings {
        padding: 20px !important;
    }
    .bili-dyn-search-trendings .trending-list .trending {
        padding: 0 16px !important;
        height: 48px !important;
    }
    .bili-dyn-search-trendings .trending-list .trending .text {
        font-size: 16px !important;
    }
    .bili-dyn-search-trendings .trending-list .trending .prefix {
        font-size: 18px !important;
    }
    .bili-dyn-sidebar {
        right: calc(50vw - (min(var(--dyn-page-outer-width), 100% - 40px) / 2) + 360px + 20px) !important;
        transform: translateX(0) !important;
    }
    @media screen and (max-width: 1800px) {
        #app .bili-dyn-home--member aside.right {
            display: none !important;
        }
        #app .bili-dyn-home--member {
            width: min(calc(var(--page-max-content-width) + 280px + 20px), 100% - 40px) !important;
        }
        .bili-dyn-sidebar {
            right: calc(50vw - (min(calc(var(--page-max-content-width) + 280px + 20px), 100% - 40px) / 2) + 20px) !important;
        }
    }
    @media screen and (max-width: 1500px) {
        #app .bili-dyn-home--member aside.left {
            display: none !important;
        }
        #app .bili-dyn-home--member {
            width: min(var(--page-max-content-width), 100% - 40px) !important;
        }
        .bili-dyn-sidebar {
            right: calc(50vw - (min(var(--page-max-content-width), 100% - 40px) / 2) + 20px) !important;
        }
    }
}

@media screen and (min-width: 1380px) {
    .opus-detail {
        width: min(var(--page-max-content-width), 100% - 40px) !important;
        margin-left: auto !important;
        margin-right: auto !important;
        box-shadow: inset 0 -1px 0 var(--line_regular);
        min-height: calc(100vh - 84px);
        background-color: var(--bg1);
        border-radius: 6px;
        z-index: 2;
    }

    .opus-module-author {
        padding: 12px 30px !important;
    }
    .opus-module-author:first-child {
        padding-top: 40px !important;
    }

    .opus-module-content {
        padding: 0 30px 36px !important;
        font-size: 16px !important;
        line-height: 28px !important;
    }
    .opus-module-content p[data-v-c0b8fcf4] {
        font-size: 16px !important;
        line-height: 28px !important;
    }

    .bili-comment-container.comment-version-1 {
        padding: 0 30px !important;
    }

    bili-comments-header-renderer {
        padding: 0 30px !important;
    }
    bili-comments-header-renderer #commentbox #comment-area {
        width: calc(100% - 60px) !important;
    }
     bili-comments-header-renderer #commentbox #user-avatar {
        width: 60px !important;
    }
    bili-comments-header-renderer #limit-mask-tip {
        margin-left: 60px !important;
        width: calc(100% - 60px) !important;
    }

    .right-sidebar-wrap {
        position: fixed !important;
        left: calc(50vw + (min(var(--page-max-content-width), 100% - 40px) / 2) + 20px) !important;
        top: 180px !important;
        z-index: 10 !important;
        transform: translateX(0) !important;
        margin-left: 0 !important;
    }
    @media screen and (max-width: 1700px) {
        .right-sidebar-wrap {
            display: none !important;
        }
    }
}
    `;
    document.head.appendChild(style);
})();
