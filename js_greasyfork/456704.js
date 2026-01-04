// ==UserScript==
// @name               Bilibili Evolved V2 Evolved
// @namespace          A user script about something
// @description        增强 Bilibili Evolved V2 样式，请在安装 Bilibili Evolved V2 后再下载使用本脚本
// @version            1.1.1
// @author             Tinhone
// @license            MIT
// @run-at             document-start
// @match              *://*.bilibili.com/*
// @grant              GM_addStyle
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_registerMenuCommand
// @compatible         firefox V50+
// @compatible         edge V50+
// @compatible         chrome V50+
// @icon               data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/456704/Bilibili%20Evolved%20V2%20Evolved.user.js
// @updateURL https://update.greasyfork.org/scripts/456704/Bilibili%20Evolved%20V2%20Evolved.meta.js
// ==/UserScript==

(function () {
    'use strict'

    GM_addStyle(`
        /********** Bilibili Evolved 顶栏更新 **********/

        /* 减小高度 */
        :root {
            --navbar-height: 36px !important;
        }

        /* 原版顶栏高度适配，#biliMainHeader 重复是为了 CSS 优先级 */
        body > #biliMainHeader#biliMainHeader,
        #app > #biliMainHeader#biliMainHeader {
            height: initial !important;
            max-height: initial !important;
            min-height: var(--navbar-height) !important;
        }

        /* 美化一级元素上的消息数量提示 */
        .custom-navbar-items > .custom-navbar-item > .notify-count {
            font-size: 7pt !important;
            line-height: 10px !important;
        }

        /* 美化一级元素字体大小 */
        .custom-navbar-items > .custom-navbar-item > .main-content {
            font-size: 9pt !important;
        }

        /* 美化当页面为对应一级元素时的字体大小 */
        .custom-navbar-items > .custom-navbar-item.active > .main-content {
            font-size: 9.5pt !important;
        }

        /* 美化搜索框 */
        .custom-navbar-items > .custom-navbar-item[data-name=search] .launch-bar {
            border-radius: 4px !important;
            height: 23px !important;
        }

        /* 美化搜索框右箭头图标 */
        .custom-navbar-items > .custom-navbar-item[data-name=search] .launch-bar .be-icon.be-iconfont-right-arrow {
            --size: 15px !important;
        }

        /* 缩小头像大小，调整头像动画 */
        .custom-navbar-items > .custom-navbar-item[data-name=userInfo] .user-face-container {
            height: calc(var(--navbar-height) - 12px);
            width: calc(var(--navbar-height) - 12px);
            transition: transform 230ms cubic-bezier(0, 0.3, 0.3, 0.95) 0.2s;
            z-index: 100;
        }

        /* 头像框偏移适配-头像 */
        .custom-navbar-items > .custom-navbar-item[data-name=userInfo] .user-face-container .user-face {
            transform: initial;
            z-index: initial;
            opacity: initial;
        }

        /* 头像框偏移适配-头像框 */
        .custom-navbar-items > .custom-navbar-item[data-name=userInfo] .user-face-container .user-pendant {
            transform: translate(-50%, -50%);
            left: 50%;
            top: 50%;
            z-index: initial;
            opacity: 0;
        }

        /* 头像框偏移适配-头像和头像框 */
        .custom-navbar-items > .custom-navbar-item[data-name=userInfo]:hover .user-face-container {
            transform: scale(2) translateY(10px);
        }

        /* 头像框偏移适配-头像 */
        .custom-navbar-items > .custom-navbar-item[data-name=userInfo]:hover .user-face-container .user-face {
            transform: initial;
            z-index: initial;
            opacity: initial;
        }

        /* 头像框偏移适配-头像框 */
        .custom-navbar-items > .custom-navbar-item[data-name=userInfo]:hover .user-face-container .user-pendant {
            transform: translate(-50%, -50%);
            z-index: initial;
            opacity: 1;
        }

        /* 缩小昵称和头像间隔 */
        .custom-navbar-items > .custom-navbar-item[data-name=userInfo] .user-info-panel > .logged-in > .name {
            margin: calc(var(--navbar-height) * 0.5 + 37px) 0 0 0 !important;
        }

        /* 美化“消息”二级菜单的消息数量提示 */
        .custom-navbar-items > .custom-navbar-item[data-name=messages] .messages-popup > .message-entry > a::after {
            padding: 3px 8px !important;
        }

        /* 美化“投稿”字体大小 */
        .custom-navbar-items > .custom-navbar-item[data-name=upload] .navbar-upload > .navbar-upload-name {
            font-size: 9.5pt !important;
        }

        /* 美化“投稿”图标大小 */
        .custom-navbar-items > .custom-navbar-item[data-name=upload] .navbar-upload > .be-icon.be-iconfont-upload {
            --size: 15px !important;
        }

        /* 告知浏览器变化 */
        .custom-navbar-items:hover > .custom-navbar-item {
            will-change: background-color !important;
        }

        /* 告知浏览器变化 */
        .custom-navbar-items:hover > .custom-navbar-item > .popup-container {
            will-change: top !important;
        }

        /* 告知浏览器变化 */
        .custom-navbar-items:hover > .custom-navbar-item > .popup-container > .popup.no-padding {
            will-change: opacity !important;
        }

        /* 告知浏览器变化 */
        .custom-navbar-items:hover > .custom-navbar-item .launch-bar {
            will-change: opacity !important;
        }

        /* 告知浏览器变化 */
        .custom-navbar-items:hover > .custom-navbar-item .launch-bar-suggest-list {
            will-change: opacity, transform !important;
        }


        /********** Bilibili Evolved 侧栏更新 **********/

        /* 组件详情面板 */
        .be-settings > .settings-panel-popup > .settings-panel .component-detail-panel {
            height: calc(100% + 1px) !important;
            border-radius: 0px 8px 8px 0px !important;
        }

        .be-settings > .settings-panel-popup > .settings-panel .component-detail > .component-detail-description {
            padding-bottom: 64px !important;
        }

        /* 功能栏按钮 */
        .be-settings > .widgets-panel-popup > .widgets-panel .widget-items .be-button:not(.be-check-box) {
            border-radius: 8px !important;
            padding: 8px 12px 8px 8px !important;
            box-shadow: none !important;
            border: 2px solid rgba(136, 136, 136, 0.2) !important;
            outline: 0px solid var(--theme-color-20) !important;
            transition: 0.2s all ease-out !important;
        }

        /* 功能栏按钮 */
        .be-settings > .widgets-panel-popup > .widgets-panel .widget-items .be-button:not(.be-check-box):active:focus-within {
            box-shadow: none !important;
            border: 2px solid var(--theme-color) !important;
            outline: 3px solid var(--theme-color-20) !important;
        }

        /* 功能栏按钮 */
        .be-settings > .widgets-panel-popup > .widgets-panel .widget-items .be-button:not(.be-check-box):hover {
            box-shadow: none !important;
            border: 2px solid var(--theme-color) !important;
        }

        .be-settings > .widgets-panel-popup > .widgets-panel .widget-items .bvid-convert.widget-item {
            border-radius: 8px !important;
            padding: 8px 8px 8px 11px !important;
            line-height: 20px !important;
            box-shadow: none !important;
            border: 2px solid rgba(136, 136, 136, 0.2) !important;
        }

        .be-settings > .widgets-panel-popup > .widgets-panel .widget-items .be-dev-client.widget-item {
            border-radius: 8px !important;
            padding: 8px 8px 8px 11px !important;
            line-height: 20px !important;
            box-shadow: none !important;
            border: 2px solid rgba(136, 136, 136, 0.2) !important;
        }

        .be-settings > .widgets-panel-popup > .widgets-panel .widget-items .multiple-widgets {
            gap: 10px !important;
        }

        .be-settings > .widgets-panel-popup > .widgets-panel .widget-items {
            gap: 10px !important;
        }


        /********** 旧版评论区更新 **********/

        /* 禁止评论区里的头像框动画 */
        .bb-comment .bili-avatar-pendent-dom > .bili-avatar-img {
            -webkit-animation: none !important;
            -moz-animation: none !important;
            -o-animation: none !important;
            animation: none !important;
        }

        /* 美化[回复]按钮 */
        .bb-comment .info > .reply.btn-hover {
            height: 16px !important;
            padding-top: 2px !important;
            padding-bottom: 2px !important;
        }

        /* 禁止顶部横幅 */
        .bb-comment .reply-notice {
            display: none !important;
        }

        /* 隐藏底部回复栏 */
        .bb-comment .comment-send-lite {
            display: none !important;
        }


        /********** 新版评论区更新 **********/

        /* 禁止顶部横幅 */
        .bili-comment .reply-notice {
            display: none !important;
        }

        /* 隐藏底部回复栏 */
        .bili-comment > .comment-container > .reply-warp > .fixed-reply-box {
            display: none !important;
        }


        /********** 旧版动态首页更新 **********/

        /* 隐藏在新版入口旁边闪烁的提示 */
        .bili-dyn-version-control > .bili-dyn-version-control__reminding {
            display: none !important;
        }


        /********** 旧版动态更新 **********/

        /* 增加动态卡片宽度 */
        #app > .content {
            width: 930px !important;
        }

        /* 增加动态卡片宽度 */
        #app > .content .bili-dyn-item__body > .bili-dyn-content {
            width: 830px !important;
        }

        /* 增加动态卡片中包含的转发动态宽度 */
        #app > .content .bili-dyn-item__body .bili-dyn-content__orig__major {
            width: 818px !important;
        }

        /* 增加动态卡片中包含的转发动态宽度 */
        #app > .content .bili-dyn-item__body .bili-dyn-content__orig__additional {
            width: 818px !important;
        }

        /* 改为适合的鼠标指针样式 */
        #app > .content .bili-dyn-content__orig > .bili-dyn-content__orig__desc {
            cursor: auto !important;
        }


        /********** 新版动态更新 **********/

        /* 增加动态卡片宽度 */
        #app > .opus-detail {
            width: 930px !important;
        }

        /* 增加右侧边栏 margin 距离 */
        #app > .opus-detail > .right-sidebar-wrap {
            margin-left: 942px !important;
        }


        /********** 消息中心更新 **********/

        /* 面板高度适配 */
        #message-navbar ~ .container {
            --animation-start: 300ms ease-out;
            --animation-end: 100ms ease-in;
            height: calc(100vh - var(--navbar-height)) !important;
            margin-top: var(--navbar-height) !important;
        }

        /* 面板高度适配 */
        #message-navbar ~ .container > #link-message-container > .container {
            height: 100% !important;
        }

        /* 面板右侧高度适配，height 随便填一个是 px 的值，剩下交给 flex-grow */
        #message-navbar ~ .container > #link-message-container .space-right-bottom.ps {
            height: 0px !important;
            flex-grow: 1 !important;
        }

        /* 面板右侧高度适配 */
        #message-navbar ~ .container > #link-message-container .space-right-bottom.ps > .router-view > .d {
            --space-right-top-height: 42px;
            --padding: 10px;
            height: calc(100vh - var(--navbar-height) - var(--space-right-top-height) - var(--padding) * 3) !important;
        }

        /* 面板左侧消息提醒优化 */
        #message-navbar ~ .container > #link-message-container .space-right-bottom.ps > .router-view > .d .list-item > .notify {
            background-color: var(--theme-color) !important;
        }

        /* 面板左侧消息提醒数字优化 */
        #message-navbar ~ .container > #link-message-container .space-right-bottom.ps > .router-view > .d .list-item > .notify-number {
            padding: 1px 7px !important;
            font-size: 8px !important;
            line-height: 10px !important;
            border-radius: 5px !important;
            width: initial !important;
            height: initial !important;
            right: 9px !important;
        }

        /* 面板左侧消息提醒圆点优化 */
        #message-navbar ~ .container > #link-message-container .space-right-bottom.ps > .router-view > .d .list-item > .notify-dot {
            width: 7px !important;
            height: 7px !important;
            top: 22px !important;
            right: 10px !important;
        }


        /* 面板左侧优化 */
        #message-navbar ~ .container > #link-message-container .side-bar > .list {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            padding-left: 0 !important;
        }

        /* 面板左侧优化 */
        #message-navbar ~ .container > #link-message-container .side-bar > .list > .item {
            width: 100% !important;
            justify-content: center !important;
            transition: color var(--animation-end) !important;
        }

        /* 面板左侧优化 */
        #message-navbar ~ .container > #link-message-container .side-bar > .list > .item::before {
            display: none !important;
        }

        /* 面板左侧优化 */
        #message-navbar ~ .container > #link-message-container .side-bar > .list > .item > a {
            display: flex !important;
            width: 100% !important;
            height: 100% !important;
            flex: initial !important;
            -webkit-box-flex: initial !important;
            -ms-flex: initial !important;
            flex-direction: row !important;
            gap: 5px !important;
            padding-left: 0 !important;
            line-height: 12px !important;
            align-items: center !important;
            justify-content: center !important;
            transition: inherit;
        }

        #message-navbar ~ .container > #link-message-container .side-bar > .list > .item:hover,
        #message-navbar ~ .container > #link-message-container .side-bar > .list > .item.active,
        #message-navbar ~ .container > #link-message-container .side-bar > .list > .item:hover > a,
        #message-navbar ~ .container > #link-message-container .side-bar > .list > .item.active > a {
            cursor: pointer;
            color: var(--theme-color) !important;
            transition: color var(--animation-start) !important;
        }

        /* 面板左侧消息提醒优化 */
        #message-navbar ~ .container > #link-message-container .side-bar > .list > .item > a > .notify {
            display: inline-block !important;
            position: static !important;
            margin-right: -4px !important;
            background-color: var(--theme-color) !important;
            margin-top: 1px !important;
            top: 0 !important;
            right: 0 !important;
        }

        /* 面板左侧消息提醒数字优化 */
        #message-navbar ~ .container > #link-message-container .side-bar > .list > .item > a > .notify-number {
            padding: 1px 8px !important;
            font-size: 10px !important;
            line-height: 12px !important;
            border-radius: 6px !important;
            width: initial !important;
            height: initial !important;
        }

        /* 面板左侧消息提醒圆点优化 */
        #message-navbar ~ .container > #link-message-container .side-bar > .list > .item > a > .notify-dot {
            width: 7px !important;
            height: 7px !important;
        }

        #message-navbar ~ .container > #link-message-container .side-bar > .divided-line {
            display: none !important;
        }

        /* 面板左侧“消息设置”优化 */
        #message-navbar ~ .container > #link-message-container .side-bar > .setting.item {
            flex-direction: column !important;
            margin-top: 18px !important;
            padding-left: 0 !important;
            transition: color var(--animation-end) !important;
        }

        #message-navbar ~ .container > #link-message-container .side-bar > .setting.item > a {
            width: 100% !important;
            text-align: center !important;
            transition: inherit !important;
        }

        #message-navbar ~ .container > #link-message-container .side-bar > .setting.item:hover,
        #message-navbar ~ .container > #link-message-container .side-bar > .setting.item.active,
        #message-navbar ~ .container > #link-message-container .side-bar > .setting.item:hover > a,
        #message-navbar ~ .container > #link-message-container .side-bar > .setting.item.active > a {
            cursor: pointer !important;
            color: var(--theme-color) !important;
            transition: color var(--animation-start) !important;
        }

        /* 面板左侧“消息中心”“消息设置”图标优化 */
        #message-navbar ~ .container > #link-message-container .side-bar > .title > .air-craft,
        #message-navbar ~ .container > #link-message-container .side-bar > .setting.item > a > .setting-icon {
            margin-right: 8px !important;
        }
    `)

    if (GM_getValue('isAdjustFreshHome') === undefined) {
        GM_setValue('isAdjustFreshHome', false)
    }

    if (GM_getValue('isAdjustFreshHome') && window.location.href === 'https://www.bilibili.com/') {
        const callback = (mutationList, observer) => {
            for (let i = mutationList.length - 1; i >= 0; --i) {
                const mutation = mutationList[i]
                if (mutation.target.nodeName !== 'BODY') {
                    continue
                }
                Object.defineProperty(mutation.target, 'scrollHeight', {
                    value: 100000,
                    writable: false,
                });
                observer.disconnect()
                break
            }
        }

        const target = document.childNodes[1]

        const options = {
            subtree: true,
            childList: true,
        }

        const theObserver = new MutationObserver(callback)
        theObserver.observe(target, options)
    }

    const deleteOld = () => {
        window.alert('请删除那个没有菜单选项的同名老脚本，原因是可能会导致功能冲突')
    }
    const openBilibiliEvolvedHomePage = () => {
        window.open('https://github.com/the1812/Bilibili-Evolved', '_blank')
    }

    GM_registerMenuCommand('请删除那个没有菜单选项的同名老脚本，原因是可能会导致功能冲突', deleteOld)
    GM_registerMenuCommand('访问 Bilibili Evolved 仓库主页', openBilibiliEvolvedHomePage)
})()