// ==UserScript==
// @name         B站简化
// @namespace    https://huanfei.top/
// @version      1.2.3
// @description  简化B站，去除页面无用元素
// @author       huanfei
// @match         *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT License
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/444746/B%E7%AB%99%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/444746/B%E7%AB%99%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 自定义样式去除
    const style = [
        '.bili-avatar-pendent-dom', // 头像挂件
        '.user .medal', // 荣誉
        '.fan-badge', // 粉丝勋章
        '.sailing',
        '.bb-comment .nameplate, .comment-bilibili-fold .nameplate, .nameplate-holder', // 成就徽章
        '.reply-notice', // 评论通知
        '.left-loc-entry', // 顶部栏杂项
        'ul.right-entry > .vip-wrap, .item:has(#van-popover-6213)', // 顶部栏大会员按钮
        '.vip-entry-containter', // 充值大会员
        '.up-info-container .bili-avatar{width:48px !important;height:48px !important;transform:translate(0px, 0px) !important}', // 头像样式修复
        // 首页
        '.recommended-swipe.grid-anchor',
        '.feed-card:has(.bili-video-card__info--ad)',
        '.container.is-version8 > .floor-single-card',
        '.bili-video-card.is-rcmd:has(.bili-video-card__info--ad)',
        '.feed-roll-btn',
        '.bili-live-card.is-rcmd',
        '.bili-video-card.is-rcmd:empty', // 与广告屏蔽插件同时启用时出现的空白格
        '.feed-card:has(.bili-video-card.is-rcmd:empty)', // 与广告屏蔽插件同时启用时出现的空白格
        '.feed-card{margin-top:40px !important;display:block !important}',
        '.bili-video-card:has(.loading_animation), .load-more-anchor{margin-top:40px !important;}',
        '.load-more-anchor .floor-skeleton{border:none !important;box-shadow:none !important;}',
        '.load-more-anchor .layer',
        '.bili-video-card .bili-video-card__skeleton--light',
        // 播放页
        '#bannerAd',
        '.reply-decorate',
        'a#right-bottom-banner',
        '#slide_ad',
        'a.ad-report.video-card-ad-small',
        '.video-page-special-card-small',
        'span.add-follow-btn',
        'div#activity_vote',
        'span.argue.item', // 安全提醒
        '.pop-live-small-mode', // 大家围观的直播
        '.bpx-player-cmd-dm-wrap', // 弹幕弹窗
        '.bili-cmd-shrink', // 弹幕弹窗
        '.toolbar-right-ai', // AI 总结
        '.reply-item:has(i.top-icon ~ a.jump-link.normal)', // 置顶的广告评论
        'span.copyright.item', // 版权栏
        '.video-sections-content-list{max-height:400px !important;height:auto !important;}', // 播放列表加长
        // 动态页
        '.bili-dyn-item__interaction', // 热门评论
        '.bili-dyn-item__ornament', // 右上角标志
        '.bili-dyn-list__item:has(.bili-rich-text-module.lottery)', // 抽奖动态
        '.bili-dyn-list__item:has(.bili-dyn-card-goods)', //抽奖带货
        'aside.right .sticky', // 右侧推荐
        '.bili-dyn-content__dispute', // 安全提醒
        '.b-avatar__canvas > div.b-avatar__layers:not(:nth-child(1))', // 头像挂件
        '.b-avatar__layers > div:not(:nth-child(1))', // 头像挂件
        '.reply-tag-list', // 热评标签
        '.container.is-version8>.bili-video-card.is-rcmd{margin-top:40px !important}',
        '.b-avatar__layer.center{width:48px !important;height:48px !important}', // 认证标志
        '.bili-dyn-live-users{position:inherit !important;top:0px !important}', //动态左侧直播不随屏幕滚动
        // 搜索页
        '.video-list > div:has(.bili-video-card__info--ad)',
        '#biliMainFooter',
        GM_getValue('history_show', true) ? '' : '.search-panel .history, .search-pannel .history', // 搜索历史
        // 直播
        // 直播-右侧弹幕栏
        'div#chat-items > div:not(.chat-item.danmaku-item)', // 弹幕位置的所有非用户弹幕元素
        '.danmaku-item-left > *:not(.common-nickname-wrapper)', // 弹幕用户名称左侧的杂类元素
        '#chat-items .danmaku-item-right.emoticon.bulge span.open-menu{display:block !important}', // 图片表情
        '#chat-items .danmaku-item-right.emoticon.bulge img.open-menu', // 图片表情
        '#aside-area-vm > *:not(.chat-history-panel, #chat-control-panel-vm)', // 非弹幕元素
        '#aside-area-vm > .chat-history-panel > *:not(.chat-history-list, .danmaku-menu)', // 非弹幕元素
        '#aside-area-vm .chat-history-list{height: 100% !important;padding:5px !important;}', // 非弹幕元素
        '#control-panel-ctnr-box > *:not(.control-panel-icon-row, .chat-input-ctnr, .bottom-actions, .dialog-ctnr)', // 非弹幕元素
        '#chat-items .chat-item.danmaku-item{background-color: transparent !important;border-image-source: none !important;}', // 弹幕颜色统一
        '.chat-item.danmaku-item > div:not(.danmaku-item-left, .danmaku-item-right)',
        '.chat-history-panel .chat-history-list .chat-item.superChat-card-detail', // SC
        '#control-panel-ctnr-box .icon-right-part > div:is(.super-chat, .like-btn)', // SC 跟点赞按钮
        '.chat-input-ctnr .medal-section', // 佩戴粉丝勋章
        // 直播-其他栏
        '.blive-avatar-pendant', // 头像边框
        '#sections-vm, #link-footer-vm', // 底栏
        '.blive-avatar-icons', // 头像右下角认证
        '#head-info-vm .lower-row .right-ctnr{visibility: hidden !important;}', // 人气排行榜
        'span.user-name{color:var(--text3) !important;}', // 用户名颜色统一
        '.chat-history-panel{height:calc(100% - 145px) !important;background-color: var(--bg1) !important;}', // 弹幕背景颜色统一
        'div#aside-area-vm{overflow: hidden !important;}', // 圆角统一
        '.announcement-wrapper', // 窗口弹幕横幅
        '#gift-control-vm > .gift-control-panel',
        '#gift-control-vm{height:45px !important;}',
        '#chat-items > .chat-item.danmaku-item{margin: 0px !important;}',
    ];

    GM_addStyle(style.map(e => (/.*{.*}$/.test(e) ? e : `${e}{display:none !important;}`)).join(''));

    // 去除复制小尾巴
    window.addEventListener('copy', e => e.stopPropagation(), true);

    // 视频页停留25秒自动点赞视频
    if (GM_getValue('auto_like', false) && /\/video\//.test(location.pathname)) {
        setInterval(() => {
            document.querySelector('.video-like.video-toolbar-left-item:not(.on)').click();
            console.log('已点赞视频');
        }, 25000);
    }

    // 自定义菜单
    GM_registerMenuCommand((GM_getValue('auto_like', false) ? '✅' : '❌') + '自动点赞', () => {
        GM_setValue('auto_like', !GM_getValue('auto_like', false));
        location.reload();
    });
    GM_registerMenuCommand((GM_getValue('history_show', true) ? '✅' : '❌') + '搜索历史显示', () => {
        GM_setValue('history_show', !GM_getValue('history_show', true));
        location.reload();
    });
})();
