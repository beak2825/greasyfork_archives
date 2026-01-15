// ==UserScript==
// @name         Javdb 增强脚本
// @name:zh      Javdb 增强脚本
// @name:en      Javdb Enhanced Script
// @namespace    http://tampermonkey.net/
// @version      2.7.0
// @icon         https://javdb.com/favicon-32x32.png
// @description  增强 Javdb 浏览体验：热力图高亮、热度排序、隐藏低分、列表页管理“已看/想看”、点击抓取并预览大图。兼容自动翻页脚本。
// @description:zh 增强 Javdb 浏览体验：热力图高亮、热度排序、隐藏低分、列表页管理“已看/想看”、点击抓取并预览大图。兼容自动翻页脚本。
// @description:en Enhances Javdb: heatmap highlighting, sort by heat, hide low score, list-page status (Watched/Want), click-to-fetch preview image.
// @author       黄页大嫖客 (Modified by Gemini), Refined by Assistant
// @match        https://javdb.com/*
// @include      /^https?:\/\/javdb.*\.com\/.*$/
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      javdb.com
// @connect      javstore.net
// @connect      *
// @license      GPLv3
// @run-at       document-start
// @homeURL      https://sleazyfork.org/zh-CN/scripts/539525
// @supportURL   https://sleazyfork.org/zh-CN/scripts/539525/feedback
// @downloadURL https://update.greasyfork.org/scripts/539525/Javdb%20Enhanced%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/539525/Javdb%20Enhanced%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- I18N & Constants ---
    const getLang = () => {
        const pageLang = document.body?.dataset?.lang;
        if (pageLang === 'zh' || pageLang === 'en') return pageLang;
        return (navigator.language || navigator.userLanguage || 'zh').toLowerCase().startsWith('zh') ? 'zh' : 'en';
    };

    const lang = getLang();

    const I18N = {
        zh: {
            settings: '设置',
            highlightFeature: '启用高亮功能',
            sortFeature: '启用排序功能',
            hideFeature: '启用隐藏低分影片',
            hideFeatureDesc: '(隐藏排序分低于 C_MIN 的影片)',
            statusFeature: '启用状态标记功能',
            previewFeature: '启用预览图显示功能',
            previewPrivacyNote: '（将向第三方 javstore.net 发送番号以抓取预览图）',
            previewConsentTitle: '第三方请求提示',
            previewConsentBody: '启用“预览图”后，脚本会将影片番号发送至第三方网站（javstore.net）以抓取预览。是否同意？',
            previewConsentAgree: '同意并继续',
            previewConsentCancel: '取消',
            delegationFeature: '启用事件委托（性能模式）',
            hideOnMouseLeave: '移开鼠标隐藏状态图标',
            heatmapMin: '热力图最低分 (C)',
            heatmapMax: '热力图最高分 (C_MAX)',
            heatmapCurveFactor: '热力图曲线因子 (<1 拉伸低分, >1 拉伸高分)',
            ratedByThreshold: '基准人数 (m)',
            reset: '重置热力图',
            resetDone: '已重置为默认值',
            sort: '排序',
            unmarked: '暂未标记',
            want: '想看',
            watched: '已看',
            modify: '修改',
            delete: '删除',
            confirmDelete: '确认删除标记？',
            confirm: '确认',
            cancel: '取消',
            preview: '查看预览图',
            noPreview: '无可用预览图',
            loadingPreview: '正在获取预览图...',
            errorNeedLogin: '需要登录后才能标记状态',
            errorNetworkBusy: '网络繁忙，请稍后重试',
            errorCsrf: '无法获取安全令牌，请刷新页面后重试',
            previewConsentRequired: '需同意第三方请求后才能抓取预览',
            previewClickToFetch: '点击以抓取预览',
            errorPreview: '获取失败 (可重试)',
            tooltipHeatmapMin: '热力图的起始分 (0%)。\n低分和少评分的影片会趋向此值。\n也是隐藏低分的阈值。',
            tooltipHeatmapMax: '热力图的最高分 (100%)。\n达到此值的影片会显示为最热的红色。\n仅影响颜色，不影响排序。',
            tooltipRatedBy: '系统的“自信度”，代表“虚拟评分人数”。\n值越高，系统越“保守”，需要更多真实评分才能摆脱基准分。',
            tooltipHeatmapCurve: '调整颜色渐变曲线。\n<1: 拉开中低分(蓝/绿)的差异。\n>1: 拉开高分(黄/红)的差异。\n=1: 线性过渡。',
        },
        en: {
            settings: 'Settings',
            highlightFeature: 'Enable Highlight Feature',
            sortFeature: 'Enable Sort Feature',
            hideFeature: 'Enable Hide Low Score Videos',
            hideFeatureDesc: '(Hide items with sort score below C_MIN)',
            statusFeature: 'Enable Status Tag Feature',
            previewFeature: 'Enable Preview Image Feature',
            previewPrivacyNote: '(Sends the code to third-party javstore.net to fetch previews)',
            previewConsentTitle: 'Third-party Request Notice',
            previewConsentBody: 'When enabled, the script sends the video code to a third-party site (javstore.net) to fetch previews. Do you consent?',
            previewConsentAgree: 'Agree and continue',
            previewConsentCancel: 'Cancel',
            delegationFeature: 'Enable event delegation (Performance mode)',
            hideOnMouseLeave: 'Hide status icons on mouse leave',
            heatmapMin: 'Heatmap Min Score (C)',
            heatmapMax: 'Heatmap Max Score (C_MAX)',
            heatmapCurveFactor: 'Heatmap Curve (<1 stretches low, >1 stretches high)',
            ratedByThreshold: 'Rated-By Threshold (m)',
            reset: 'Reset Heatmap',
            resetDone: 'Reset to defaults',
            sort: 'Sort',
            unmarked: 'Unmarked',
            want: 'Want',
            watched: 'Watched',
            modify: 'Modify',
            delete: 'Delete',
            confirmDelete: 'Confirm Delete?',
            confirm: 'Confirm',
            cancel: 'Cancel',
            preview: 'View Preview Image',
            noPreview: 'No Preview Available',
            loadingPreview: 'Loading preview...',
            errorNeedLogin: 'Login required to set status',
            errorNetworkBusy: 'Network busy, please try again later',
            errorCsrf: 'Failed to get security token, please refresh the page',
            previewConsentRequired: 'Consent required before fetching preview',
            previewClickToFetch: 'Click to fetch preview',
            errorPreview: 'Fetch failed (Retryable)',
            tooltipHeatmapMin: "The starting score (0%) for the heatmap.\nLow-score and low-rated items are pulled towards this value.\nAlso the threshold for hiding items.",
            tooltipHeatmapMax: "The 'perfect score' (100%) for the heatmap.\nItems at this score appear bright red.\nOnly affects color, not sorting.",
            tooltipRatedBy: "System 'confidence', a 'virtual rating count'.\nHigher value = more 'conservative' (needs more real ratings to trust the score).",
            tooltipHeatmapCurve: "Adjusts the color curve.\n<1: Emphasizes differences in the low-mid range (blue/green).\n>1: Emphasizes differences in the high range (yellow/red).\n=1: Linear.",
        }
    };
    const T = (key) => I18N[lang]?.[key] ?? I18N.zh[key];

    const SETTINGS_KEY = 'JavdbEnhanced_Settings';
    const DEFAULT_NAVBAR_HEIGHT = 58;
    const PREVIEW_ICON_INACTIVE_OPACITY = 0.55;
    const MAX_CACHE_SIZE = 500;
    const ITEM_SELECTOR = '.movie-list .item, .is-user-page .column.is-one-quarter';
    const scoreRegexes = [
        /([\d.]+)\s*\/\s*5[^\d]*?(\d+)/,
        /([\d.]+)[^\d]+(\d+)/,
        /评分[:：]\s*([\d.]+)[^\d]+(\d+)/
    ];
    const DEFAULT_SETTINGS = {
        highlight: true,
        sort: true,
        hideLowScore: false,
        status: true,
        enablePreview: true,
        hideOnMouseLeave: true,
        heatmapMin: 3.75,
        heatmapMax: 4.75,
        heatmapCurveFactor: 0.5,
        ratedByThreshold: 200,
        fetchDelay: 300,
        useEventDelegation: false,
        previewThirdPartyConsent: false
    };
    let settings = { ...DEFAULT_SETTINGS };

    let authenticityToken = null;
    const statusCache = new Map();
    const previewCache = new Map();
    const STATUS_CONCURRENCY = 3;
    const PREVIEW_CONCURRENCY = 2;

    function createLimiter(max) {
        let active = 0;
        const queue = [];
        const runNext = () => {
            if (active >= max || queue.length === 0) return;
            active++;
            const job = queue.shift();
            Promise.resolve().then(job.fn).then(job.resolve).catch(job.reject).finally(() => {
                active--; runNext();
            });
        };
        return {
            run(fn) {
                return new Promise((resolve, reject) => {
                    queue.push({ fn, resolve, reject });
                    runNext();
                });
            }
        };
    }

    const statusLimiter = createLimiter(STATUS_CONCURRENCY);
    const previewLimiter = createLimiter(PREVIEW_CONCURRENCY);
    let delegationInitialized = false;
    const hoverTimers = new WeakMap();
    const ICONS = {
        plus: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
        eye: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 10c-2.48 0-4.5-2.02-4.5-4.5S9.52 5.5 12 5.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7C10.62 7.5 9.5 8.62 9.5 10s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5S13.38 7.5 12 7.5z"/></svg>`,
        heart: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
        preview: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`,
        brokenImage: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 5v6.59l-2.29-2.3c-.39-.39-1.03-.39-1.42 0L14 12.59L10.71 9.3a.996.996 0 0 0-1.41 0L6 12.59L3 9.58V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2m-3 6.42l3 3.01V19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-6.58l2.29 2.29c.39.39 1.02.39 1.41 0l3.3-3.3l3.29 3.29c.39.39 1.02.39 1.41 0z"/></svg>`,
        loading: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M18 15v4c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h3.02c.55 0 1-.45 1-1s-.45-1-1-1H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5c0-.55-.45-1-1-1s-1 .45-1 1m-2.5 3H6.52c-.42 0-.65-.48-.39-.81l1.74-2.23a.5.5 0 0 1 .78-.01l1.56 1.88l2.35-3.02c.2-.26.6-.26.79.01l2.55 3.39c.25.32.01.79-.4.79m3.8-9.11c.48-.77.75-1.67.69-2.66c-.13-2.15-1.84-3.97-3.97-4.2A4.5 4.5 0 0 0 11 6.5c0 2.49 2.01 4.5 4.49 4.5c.88 0 1.7-.26 2.39-.7l2.41 2.41c.39.39 1.03.39 1.42 0s.39-1.03 0-1.42zM15.5 9a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5"/></svg>`
    };
    const STATUS_BUTTONS_TEMPLATE = `
        <div class="cover-status-buttons">
            <div class="cover-ui-wrapper">
                <div class="csb-outer-container">
                    <div class="csb-status-container">
                        <div class="state state-unmarked">
                            <div class="status-main-icon" title="${T('unmarked')}">${ICONS.plus}</div>
                            <div class="action-buttons-wrapper">
                                <div class="action-buttons">
                                    <button class="button btn-set-wanted">${T('want')}</button>
                                    <button class="button btn-set-watched js-set-watched">${T('watched')}</button>
                                </div>
                            </div>
                        </div>
                        <div class="state state-watched">
                            <div class="status-main-icon" title="${T('watched')}">
                                ${ICONS.eye}
                                <div class="star-arc-container">${'<span>★</span>'.repeat(5)}</div>
                            </div>
                            <div class="action-buttons-wrapper">
                                <div class="action-buttons">
                                    <button class="button btn-modify">${T('modify')}</button>
                                    <button class="button btn-delete js-delete">${T('delete')}</button>
                                </div>
                            </div>
                        </div>
                        <div class="state state-wanted">
                            <div class="status-main-icon" title="${T('want')}">${ICONS.heart}</div>
                            <div class="action-buttons-wrapper">
                                <div class="action-buttons">
                                    <button class="button btn-set-watched js-set-watched">${T('watched')}</button>
                                    <button class="button btn-delete js-delete">${T('delete')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    const PREVIEW_ICON_TEMPLATE = `
        <button type="button" class="csb-preview-icon-container" title="${T('previewClickToFetch')}" aria-label="${T('preview')}">
            ${ICONS.preview}
        </button>
    `;
    GM_addStyle(`
        @keyframes jdbe-flip { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        @keyframes jdbe-shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-3px, 0, 0); } 40%, 60% { transform: translate3d(3px, 0, 0); } }
        :root {
            --color-unmarked: #f5f5f5; --color-unmarked-icon: #333;
            --color-watched: #3273dc; --color-watched-hover: #4a89e8;
            --color-wanted: #e83e8c; --color-wanted-hover: #f06fab;
            --color-delete: #ff3860; --color-delete-hover: #ff5c7c;
            --color-modify: #ffc107; --color-modify-hover: #ffce3a;
            --color-star: #ccc; --color-star-filled: #ffdd44;
            --color-preview-has: #48c78e; --color-preview-no: #f5f5f5; --color-preview-no-icon: #666;
            --color-preview-failed: #dbdbdb; --color-preview-failed-icon: #7a7a7a;
            --preview-icon-inactive-opacity: ${PREVIEW_ICON_INACTIVE_OPACITY};
        }
        .item .cover { position: relative; overflow: visible; }
        .item .cover img.cover-img-blurred { filter: blur(0.25rem) brightness(0.8); transition: filter 0.3s ease; }
        .cover-status-buttons { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 6; pointer-events: none; }
        .cover-ui-wrapper { position: relative; width: 100%; height: 100%; }
        .csb-outer-container { position: absolute; top: 0.5rem; left: 0.5rem; opacity: 0; visibility: hidden; transition: opacity 0.25s ease, visibility 0.25s ease; }
        .item:hover .csb-outer-container, .item.status-ui-persist .csb-outer-container { opacity: 1; visibility: visible; }
        .csb-status-container { position: relative; }
        .item.api-error .csb-status-container { animation: jdbe-shake 0.5s ease-in-out; }
        .item[data-api-busy="true"] .csb-status-container { pointer-events: none; opacity: 0.5; cursor: wait; }
        .status-main-icon { position: relative; width: 2.25rem; height: 2.25rem; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: all 0.3s ease-in-out; flex-shrink: 0; z-index: 10; }
        .status-main-icon svg { width: 1.25rem; height: 1.25rem; }
        .csb-status-container.show-unmarked .status-main-icon { background-color: var(--color-unmarked); color: var(--color-unmarked-icon); }
        .csb-status-container.show-watched .status-main-icon { background-color: var(--color-watched); color: white; }
        .csb-status-container.show-wanted .status-main-icon { background-color: var(--color-wanted); color: white; }
        .action-buttons-wrapper { position: absolute; left: 0.5rem; top: 50%; transform: translateY(-50%); display: flex; align-items: center; max-width: 0; opacity: 0; visibility: hidden; transition: max-width 0.4s ease, opacity 0.3s ease 0.1s; overflow: hidden; pointer-events: none; }
        .action-buttons { display: flex; align-items: center; background-color: rgba(30,30,30,0.8); backdrop-filter: blur(2px); padding: 0.4rem 0.6rem 0.4rem 2rem; border-radius: 2rem; white-space: nowrap; }
        .csb-status-container:hover .action-buttons-wrapper { opacity: 1; visibility: visible; max-width: 300px; pointer-events: auto; }
        .csb-status-container:hover .status-main-icon { box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
        .action-buttons .button { padding: 0.25rem 0.625rem; font-size: 0.8rem; border: none; border-radius: 0.25rem; color: white; cursor: pointer; margin: 0 0.25rem; transition: all 0.2s ease; }
        .action-buttons .button:hover { transform: translateY(-1px); }
        .action-buttons .button:active { transform: translateY(0); filter: brightness(0.9); }
        .btn-set-wanted { background-color: var(--color-wanted); }
        .btn-set-watched { background-color: var(--color-watched); }
        .btn-modify { background-color: var(--color-modify); }
        .btn-delete { background-color: var(--color-delete); }
        .btn-set-wanted:hover { background-color: var(--color-wanted-hover); }
        .btn-set-watched:hover { background-color: var(--color-watched-hover); }
        .btn-modify:hover { background-color: var(--color-modify-hover); }
        .btn-delete:hover { background-color: var(--color-delete-hover); }
        .star-arc-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 11; }
        .star-arc-container span { position: absolute; top: 50%; left: 50%; font-size: 0.7rem; color: var(--color-star); text-shadow: 0 0 2px black; transform-origin: center; }
        .star-arc-container span.is-filled { color: var(--color-star-filled); }
        .star-arc-container span:nth-child(1) { transform: translate(-50%, -50%) rotate(-60deg) translateY(-12px) rotate(60deg); }
        .star-arc-container span:nth-child(2) { transform: translate(-50%, -50%) rotate(-30deg) translateY(-12px) rotate(30deg); }
        .star-arc-container span:nth-child(3) { transform: translate(-50%, -50%) rotate(0deg) translateY(-12px) rotate(0deg); }
        .star-arc-container span:nth-child(4) { transform: translate(-50%, -50%) rotate(30deg) translateY(-12px) rotate(-30deg); }
        .star-arc-container span:nth-child(5) { transform: translate(-50%, -50%) rotate(60deg) translateY(-12px) rotate(-60deg); }
        .csb-preview-icon-container { position: absolute; top: 0.5rem; right: 0.5rem; z-index: 7; flex-shrink: 0; width: 2.25rem; height: 2.25rem; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: var(--color-preview-no-icon); background-color: var(--color-preview-no); box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: opacity 0.15s ease-in-out; opacity: var(--preview-icon-inactive-opacity); outline: none; cursor: pointer; border: none; padding: 0; margin: 0; font-family: inherit; font-size: inherit; }
        .csb-preview-icon-container svg { width: 1.25rem; height: 1.25rem; }
        .csb-preview-icon-container:hover, .csb-preview-icon-container:focus-visible, .csb-preview-icon-container:active { opacity: 1; }
        .csb-preview-icon-container.is-loading svg { animation: jdbe-flip 1.5s ease-in-out infinite; }
        .csb-preview-icon-container.has-preview { background-color: var(--color-preview-has); color: white; }
        .csb-preview-icon-container.fetch-failed { background-color: var(--color-preview-failed); color: var(--color-preview-failed-icon); cursor: not-allowed; }
        .csb-preview-icon-container.fetch-error { background-color: var(--color-delete); color: white; cursor: pointer; }
        .state { display: none; }
        .csb-status-container.show-unmarked .state-unmarked, .csb-status-container.show-watched .state-watched, .csb-status-container.show-wanted .state-wanted { display: contents; }
        .cover-modal-base { display: flex; justify-content: center; align-items: center; position: absolute; z-index: 10; top: 0; left: 0; width: 100%; height: 100%; background: transparent; flex-direction: column; gap: 0.625rem; }
        #preview-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.85); display: flex; justify-content: center; align-items: flex-start; z-index: 9999; cursor: default; overflow: auto; padding: 0; overscroll-behavior: contain; }
        #preview-modal-content { position: relative; margin: 2rem auto; outline: none; }
        #preview-modal-content img { display: block; max-width: none; width: auto; height: auto; box-shadow: 0 8px 30px rgba(0,0,0,0.5); border-radius: 4px; }
        #sort-by-heat-btn-container { position: fixed; bottom: 1.7rem; right: 0; z-index: 9998; }
        #sort-by-heat-btn-container .button { width: 2.45rem; height: 1.7rem; font-size: 0.8rem; background-color: #fa6699; color: white; border: none; padding: 0; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .jdbe-modal { position: fixed; z-index: 10000; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; }
        .jdbe-modal-content { background: #fff; padding: 1.25rem; border-radius: 0.5rem; box-shadow: 0 0.3125rem 1rem rgba(0,0,0,0.3); position: relative; max-width: 480px; }
        .jdbe-modal-close { position: absolute; top: 0.5rem; right: 0.5rem; font-size: 1.5rem; border: none; background: transparent; cursor: pointer; }
        .jdbe-modal-body .jdbe-setting-row { display: flex; align-items: center; margin: 8px 0; gap: 8px; }
        .jdbe-modal-body label { flex: 1; display: flex; align-items: center; user-select: none; }
        .jdbe-modal-body input[type="checkbox"] { margin-right: 8px; }
        .jdbe-modal-body input[type="number"] { width: 70px; padding: 4px; border: 1px solid #ccc; border-radius: 4px; }
        .jdbe-modal-body .jdbe-setting-row.is-indented { padding-left: 20px; }
        .jdbe-modal-body .jdbe-setting-desc { font-size: 11px; color: #666; margin-left: 26px; margin-top: -5px; }
        .jdbe-help-icon { display: inline-flex; justify-content: center; align-items: center; width: 14px; height: 14px; border-radius: 50%; background-color: #aaa; color: white; font-size: 10px; font-weight: bold; margin-left: 6px; cursor: help; user-select: none; font-style: normal; }
        .rating-modal-container { z-index: 15; }
        .rating-stars { display: flex; flex-direction: row-reverse; }
        .rating-stars input[type="radio"] { display: none; }
        .rating-stars label { font-size: 1.5rem; color: var(--color-star); cursor: pointer; text-shadow: 0 0 3px rgba(0,0,0,0.5); }
        .rating-stars label:hover, .rating-stars label:hover ~ label, .rating-stars input[type="radio"]:checked ~ label { color: var(--color-star-filled); }
        .rating-modal-container .btn-cancel-rating { background-color: #f5f5f5; padding: 0.25rem 0.5rem; font-size: 0.7rem; border-radius: 0.25rem; border: none; cursor: pointer; margin-top: 0.3125rem; }
        .confirm-delete-modal p { color: white; font-weight: bold; text-shadow: 0 0 3px rgba(0,0,0,0.5); }
        .confirm-delete-modal .buttons { display: flex; gap: 0.625rem; }
        .confirm-delete-modal .is-danger { background-color: #ff3860; color: white; }
        body.jdbe-highlight-disabled .item a.box, body.jdbe-highlight-disabled .item div.box { background-color: transparent !important; }
        body.jdbe-status-disabled .cover-status-buttons { display: none !important; }
        body.jdbe-preview-disabled .csb-preview-icon-container { display: none !important; }
        body.jdbe-hide-low-score-enabled .item[data-jdbe-hide="true"] { display: none !important; }
        .jdbe-toast { position: fixed; left: 50%; transform: translateX(-50%); bottom: 2rem; background: rgba(0,0,0,0.85); color: #fff; padding: 0.5rem 0.75rem; border-radius: 0.5rem; z-index: 10001; font-size: 0.85rem; box-shadow: 0 4px 12px rgba(0,0,0,0.35); }
        .jdbe-privacy-note { display:inline-block; margin-left: 8px; color:#999; font-size: 12px; }
    `);

    // --- Helpers ---
    function getSafeUrl(targetUrl) {
        if (!targetUrl) return '';
        try {
            if (targetUrl.startsWith(window.location.origin)) return targetUrl;
            if (targetUrl.startsWith('/')) return window.location.origin + targetUrl;
            const urlObj = new URL(targetUrl);
            return window.location.origin + urlObj.pathname + urlObj.search;
        } catch (e) {
            return targetUrl;
        }
    }

    function setPreviewCache(key, value) {
        previewCache.set(key, value);
        limitCacheSize(previewCache, MAX_CACHE_SIZE);
    }

    function limitCacheSize(cache, maxSize) {
        if (cache.size > maxSize) {
            const oldestKey = cache.keys().next().value;
            cache.delete(oldestKey);
        }
    }

    function toast(message, timeout = 2000) {
        const div = document.createElement('div');
        div.className = 'jdbe-toast';
        div.textContent = message;
        document.body.appendChild(div);
        setTimeout(() => { div.remove(); }, timeout);
    }

    function normalizeCode(raw) {
        if (!raw) return '';
        let code = raw.trim().toUpperCase();
        code = code.replace(/\s+/g, '-');
        code = code.replace(/^FC2[-\s]PPV[-\s_](\d+)$/i, (_, num) => `FC2-PPV-${num}`);
        return code;
    }

    function setModalLock(item, locked) {
        const coverImg = item.querySelector('.cover img');
        if (locked) {
            item.dataset.modalOpen = 'true';
            if (coverImg) coverImg.classList.add('cover-img-blurred');
        } else {
            delete item.dataset.modalOpen;
            if (coverImg) coverImg.classList.remove('cover-img-blurred');
        }
    }

    function showStatusUI(item) {
        if (item.dataset.modalOpen === 'true') return;
        const overlay = item.querySelector('.cover-status-buttons');
        if (overlay) overlay.style.pointerEvents = 'auto';
        if (!settings.hideOnMouseLeave) item.classList.add('status-ui-persist');
    }

    function hideStatusUI(item) {
        if (item.dataset.modalOpen === 'true') return;
        const overlay = item.querySelector('.cover-status-buttons');
        if (overlay) overlay.style.pointerEvents = 'none';
        item.classList.remove('status-ui-persist');
    }

    function createCoverModal(item, className, innerHTML) {
        const cover = item.querySelector('.cover');
        if (!cover || cover.querySelector(`.${className}`)) return null;
        setModalLock(item, true);
        const modal = document.createElement('div');
        modal.className = `${className} cover-modal-base`;
        modal.innerHTML = innerHTML;
        cover.appendChild(modal);
        const closeModal = () => {
            setModalLock(item, false);
            if (!item.matches(':hover') && settings.hideOnMouseLeave) {
                hideStatusUI(item);
            } else {
                showStatusUI(item);
            }
            if (cover.contains(modal)) cover.removeChild(modal);
        };
        return { modal, closeModal };
    }

    function presentPreviewConsentModal(triggerElement) {
        return new Promise((resolve) => {
            const m = document.createElement('div');
            m.className = 'jdbe-modal';
            m.setAttribute('aria-modal', 'true');
            m.innerHTML = `
                <div class="jdbe-modal-content">
                    <button class="jdbe-modal-close" aria-label="close">&times;</button>
                    <h3 style="margin-top:0;">${T('previewConsentTitle')}</h3>
                    <p>${T('previewConsentBody')}</p>
                    <p style="color:#666;font-size:12px;margin:8px 0 16px;">Domains: javstore.net</p>
                    <div style="display:flex;gap:8px;justify-content:flex-end;">
                        <button class="button btn-cancel">${T('previewConsentCancel')}</button>
                        <button class="button btn-agree" style="background:#3273dc;color:#fff;border:none;padding:6px 10px;border-radius:4px;">${T('previewConsentAgree')}</button>
                    </div>
                </div>
            `;
            document.body.appendChild(m);
            const agreeButton = m.querySelector('.btn-agree');
            agreeButton.focus();
            function close(val) {
                try { m.remove(); } catch (e) {}
                triggerElement?.focus();
                resolve(!!val);
            }

            m.addEventListener('click', (e) => { if (e.target === m) close(false); });
            m.querySelector('.jdbe-modal-close').addEventListener('click', () => close(false));
            m.querySelector('.btn-cancel').addEventListener('click', () => close(false));
            agreeButton.addEventListener('click', () => close(true));
        });
    }

    function appendUIOnce(parent, childSelector, template) {
        if (!parent || parent.querySelector(childSelector)) return parent ? parent.querySelector(childSelector) : null;
        const wrapper = document.createElement('div');
        wrapper.innerHTML = template;
        const element = wrapper.firstElementChild;
        if (element) parent.appendChild(element);
        return element;
    }

    // --- Core Logic ---
    function loadSettings() {
        const saved = GM_getValue(SETTINGS_KEY, {});
        settings = { ...DEFAULT_SETTINGS, ...saved };
    }

    function saveSettings() {
        GM_setValue(SETTINGS_KEY, settings);
    }

    function openSettingsModal() {
        const existing = document.getElementById('jdbe-settings-modal');
        if (existing) {
            existing.style.display = 'flex';
            existing.querySelector('.jdbe-modal-close').focus();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'jdbe-settings-modal';
        modal.className = 'jdbe-modal';
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = `
            <div class="jdbe-modal-content">
                <button class="jdbe-modal-close">&times;</button>
                <h2>${T('settings')}</h2>
                <div class="jdbe-modal-body"></div>
            </div>
        `;
        const body = modal.querySelector('.jdbe-modal-body');
        document.body.appendChild(modal);
        const closeButton = modal.querySelector('.jdbe-modal-close');
        closeButton.focus();

        const closeModal = () => { modal.style.display = 'none'; };
        closeButton.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        const controls = [
            { id: 'setting-highlight', key: 'highlight', label: T('highlightFeature'), type: 'checkbox' },
            { id: 'setting-sort', key: 'sort', label: T('sortFeature'), dependsOn: 'highlight', type: 'checkbox' },
            { id: 'setting-hide-low-score', key: 'hideLowScore', label: T('hideFeature'), dependsOn: 'highlight', type: 'checkbox', desc: T('hideFeatureDesc') },
            { id: 'setting-heatmap-min', key: 'heatmapMin', label: T('heatmapMin'), dependsOn: 'highlight', type: 'number', step: 0.05, indented: true, tooltipKey: 'tooltipHeatmapMin' },
            { id: 'setting-heatmap-max', key: 'heatmapMax', label: T('heatmapMax'), dependsOn: 'highlight', type: 'number', step: 0.05, indented: true, tooltipKey: 'tooltipHeatmapMax' },
            { id: 'setting-heatmap-curve', key: 'heatmapCurveFactor', label: T('heatmapCurveFactor'), dependsOn: 'highlight', type: 'number', step: 0.1, indented: true, tooltipKey: 'tooltipHeatmapCurve' },
            { id: 'setting-ratedby', key: 'ratedByThreshold', label: T('ratedByThreshold'), dependsOn: 'highlight', type: 'number', step: 10, indented: true, tooltipKey: 'tooltipRatedBy' },
            { id: 'setting-status', key: 'status', label: T('statusFeature'), type: 'checkbox' },
            { id: 'setting-hover-status', key: 'hideOnMouseLeave', label: T('hideOnMouseLeave'), dependsOn: 'status', type: 'checkbox', indented: true },
            { id: 'setting-preview', key: 'enablePreview', label: T('previewFeature'), type: 'checkbox' },
            { id: 'setting-delegation', key: 'useEventDelegation', label: T('delegationFeature'), type: 'checkbox' }
        ];
        controls.forEach(c => {
            const wrapper = document.createElement('div');
            wrapper.className = 'jdbe-setting-row';
            if (c.indented) wrapper.classList.add('is-indented');

            const label = document.createElement('label');
            label.htmlFor = c.id;

            const input = document.createElement('input');
            input.type = c.type;
            input.id = c.id;
            if (c.readonly) input.disabled = true;

            if (c.type === 'checkbox') {
                label.appendChild(input);
                label.appendChild(document.createTextNode(` ${c.label}`));
            } else if (c.type === 'number') {
                label.appendChild(document.createTextNode(`${c.label}`));
                input.step = c.step || 'any';
                input.className = 'jdbe-input-number';
            }

            if (c.tooltipKey) {
                const helpIcon = document.createElement('i');
                helpIcon.className = 'jdbe-help-icon';
                helpIcon.textContent = '?';
                helpIcon.title = T(c.tooltipKey);
                label.appendChild(helpIcon);
            }

            wrapper.appendChild(label);
            if (c.type === 'number') wrapper.appendChild(input);

            if (c.id === 'setting-preview') {
                const note = document.createElement('span');
                note.className = 'jdbe-privacy-note';
                note.textContent = T('previewPrivacyNote');
                wrapper.appendChild(note);
            }
            body.appendChild(wrapper);
            if (c.desc) {
                const desc = document.createElement('div');
                desc.className = 'jdbe-setting-desc';
                desc.textContent = c.desc;
                wrapper.appendChild(desc);
            }
        });

        const resetWrapper = document.createElement('div');
        resetWrapper.style.margin = '10px 0 5px 0';
        resetWrapper.style.paddingLeft = '188px';

        const resetButton = document.createElement('button');
        resetButton.id = 'jdbe-reset-heatmap';
        resetButton.type = 'button';
        resetButton.className = 'button is-small';
        resetButton.textContent = T('reset');

        resetWrapper.appendChild(resetButton);
        body.appendChild(resetWrapper);

        resetButton.addEventListener('click', () => {
            settings.heatmapMin = DEFAULT_SETTINGS.heatmapMin;
            settings.heatmapMax = DEFAULT_SETTINGS.heatmapMax;
            settings.heatmapCurveFactor = DEFAULT_SETTINGS.heatmapCurveFactor;
            settings.ratedByThreshold = DEFAULT_SETTINGS.ratedByThreshold;
            saveSettings();
            updateUI();
            document.querySelectorAll(ITEM_SELECTOR).forEach(item => {
                item.dataset.highlightProcessed = 'false';
                processItem(item);
            });
            toast(T('resetDone'), 1500);
        });
        const updateUI = () => {
            controls.forEach(c => {
                const input = document.getElementById(c.id);
                if (c.type === 'checkbox') {
                    input.checked = !!settings[c.key];
                } else if (c.type === 'number') {
                    input.value = settings[c.key];
                }
                const row = input.closest('.jdbe-setting-row');
                if (c.dependsOn) {
                    row.style.display = settings[c.dependsOn] ? 'flex' : 'none';
                    input.disabled = c.readonly ? true : !settings[c.dependsOn];
                }
            });
        };

        modal.addEventListener('change', async (e) => {
            const control = controls.find(x => x.id === e.target.id);
            if (!control) return;

            if (control.id === 'setting-preview' && e.target.checked && !settings.previewThirdPartyConsent) {
                const agreed = await presentPreviewConsentModal();
                if (agreed) {
                    settings.previewThirdPartyConsent = true;
                } else {
                    e.target.checked = false;
                    settings.enablePreview = false;
                    saveSettings();
                    updateUIVisibility();
                    updateUI();
                    return;
                }
            }

            if (control.type === 'checkbox') {
                settings[control.key] = e.target.checked;
            } else if (control.type === 'number') {
                settings[control.key] = parseFloat(e.target.value) || 0;
            }

            if (control.id === 'setting-highlight' && !settings.highlight) {
                settings.sort = false;
                settings.hideLowScore = false;
            }
            if (control.id === 'setting-delegation') {
                if (settings.useEventDelegation && !delegationInitialized) {
                    initDelegatedEvents();
                }
            }

            saveSettings();
            updateUIVisibility();
            updateUI();

            if (control.key.startsWith('heatmap') || control.key.startsWith('ratedBy') || control.key === 'hideLowScore') {
                document.querySelectorAll(ITEM_SELECTOR).forEach(item => {
                    item.dataset.highlightProcessed = 'false';
                    processItem(item);
                });
            }
        });

        updateUI();
    }

    function updateUIVisibility() {
        document.body.classList.toggle('jdbe-highlight-disabled', !settings.highlight);
        document.body.classList.toggle('jdbe-status-disabled', !settings.status);
        document.body.classList.toggle('jdbe-preview-disabled', !settings.enablePreview);
        document.body.classList.toggle('jdbe-hide-low-score-enabled', settings.hideLowScore);

        const sortButton = document.getElementById('sort-by-heat-btn-container');
        if (sortButton) {
            const shouldShow = settings.sort && settings.highlight && document.querySelector(ITEM_SELECTOR);
            sortButton.style.display = shouldShow ? 'block' : 'none';
        }
    }

    function getCsrfToken() {
        const meta = document.querySelector('meta[name="csrf-token"]');
        authenticityToken = meta ? meta.content : null;
    }

    function isLoggedIn() {
        return !!document.querySelector('a[href="/logout"]');
    }

    function gmRequest(options) {
        const isSameOrigin = options.url.startsWith('/') || options.url.includes(window.location.host);
        if (isSameOrigin) {
            return new Promise(async (resolve, reject) => {
                try {
                    const fetchOptions = {
                        method: options.method || 'GET',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            ...(options.headers || {})
                        }
                    };

                    if (fetchOptions.headers.Referer) delete fetchOptions.headers.Referer;

                    if (options.data && options.method && options.method.toUpperCase() !== 'GET') {
                        fetchOptions.body = options.data;
                    }

                    const response = await fetch(options.url, fetchOptions);
                    const text = await response.text();

                    resolve({
                        status: response.status,
                        statusText: response.statusText,
                        responseText: text,
                        finalUrl: response.url,
                        responseHeaders: [...response.headers].map(h => `${h[0]}: ${h[1]}`).join('\r\n')
                    });
                } catch (err) {
                    reject({ status: 0, statusText: err.message });
                }
            });
        } else {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    ...options,
                    onload: (res) => {
                        if (res.status >= 200 && res.status < 300) {
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    },
                    onerror: reject,
                    onabort: reject,
                    ontimeout: reject
                });
            });
        }
    }

    async function ensureCsrfToken(item) {
        if (authenticityToken) return authenticityToken;
        getCsrfToken();
        if (authenticityToken) return authenticityToken;
        try {
            const anchor = item.querySelector('a.box') || item.querySelector('.box a');
            if (!anchor) return null;
            const safeUrl = getSafeUrl(anchor.href);
            const res = await statusLimiter.run(() => gmRequest({ method: "GET", url: safeUrl }));
            if (res.status >= 200 && res.status < 300) {
                const doc = new DOMParser().parseFromString(res.responseText, "text/html");
                const meta = doc.querySelector('meta[name="csrf-token"]');
                authenticityToken = meta ? meta.content : null;
            }
        } catch (e) {}
        return authenticityToken;
    }

    async function updateReviewStatus(action, videoId, item, rating) {
        if (item.dataset.apiBusy === 'true') return;
        if (!isLoggedIn()) {
            toast(T('errorNeedLogin'));
            return;
        }
        const token = await ensureCsrfToken(item);
        if (!token) {
            item.classList.add('api-error');
            toast(T('errorCsrf'));
            setTimeout(() => item.classList.remove('api-error'), 500);
            return;
        }
        item.dataset.apiBusy = 'true';

        let urlPath = '';
        let body = '';
        const reviewId = item.dataset.reviewId;

        switch (action) {
            case 'watched': {
                if (rating == null) {
                    delete item.dataset.apiBusy;
                    return;
                }
                urlPath = reviewId ? `/v/${videoId}/reviews/${reviewId}` : `/v/${videoId}/reviews`;
                const baseBody = `authenticity_token=${encodeURIComponent(token)}&video_review[status]=watched&video_review[score]=${rating}&video_review[content]=`;
                body = reviewId ? `_method=patch&${baseBody}` : baseBody;
                break;
            }
            case 'wanted':
                urlPath = `/v/${videoId}/reviews/want_to_watch`;
                body = `authenticity_token=${encodeURIComponent(token)}`;
                break;
            case 'delete':
                if (!reviewId) {
                    delete item.dataset.apiBusy;
                    return;
                }
                urlPath = `/v/${videoId}/reviews/${reviewId}`;
                body = `_method=delete&authenticity_token=${encodeURIComponent(token)}`;
                break;
            default:
                delete item.dataset.apiBusy;
                return;
        }

        try {
            await statusLimiter.run(() => gmRequest({
                method: 'POST',
                url: window.location.origin + urlPath,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                data: body
            }));
            statusCache.delete(videoId);
            await fetchItemData(item, true);
            if (settings.status) showStatusUI(item);
        } catch (error) {
            console.error('JavDB Enhanced: Status update failed.', error);
            if (error.status === 422) {
                toast(T('errorCsrf'));
                authenticityToken = null;
            } else {
                toast(T('errorNetworkBusy'));
            }
            item.classList.add('api-error');
            setTimeout(() => item.classList.remove('api-error'), 500);
        } finally {
            delete item.dataset.apiBusy;
        }
    }

    // [v2.7.0] 仅保留 JavStore 逻辑，移除了 BlogJav 所有相关代码
    async function fetchPreviewImage(code) {
        const normalized = code.trim().toUpperCase().replace(/\s+/g, '-').replace(/^FC2[-\s]PPV[-\s_](\d+)$/i, (_, num) => `FC2-PPV-${num}`);
        // 缓存检查
        if (typeof previewMemoryCache !== 'undefined' && previewMemoryCache.has(normalized)) {
            return previewMemoryCache.get(normalized);
        }

        let javStoreFailed = false;
        let resDoc = null;
        let detailUrl = '';
        // --- 1. JavStore 搜索 ---
        try {
            // 修正搜索 URL: /search?q=CODE
            const searchUrl = `https://javstore.net/search?q=${encodeURIComponent(normalized)}`;
            const res = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: searchUrl,
                    onload: resolve,
                    onerror: reject
                });
            });
            if (res.status === 403 || res.status === 503 || res.responseText.includes('Just a moment')) {
                console.warn("[JavDB] JavStore blocked.");
                javStoreFailed = true;
            } else {
                resDoc = new DOMParser().parseFromString(res.responseText, "text/html");
            }
        } catch (e) {
            console.error("[JavDB] JavStore network error", e);
            javStoreFailed = true;
        }

        // --- 2. JavStore 结果解析 (适配 Grid 布局) ---
        if (!javStoreFailed && resDoc) {
            const searchResults = Array.from(resDoc.querySelectorAll("div.grid > a, a.group, article h2 a"));
            const regex = new RegExp(normalized.replace(/[-_ ]/g, '[-_ ]?'), 'i');

            const foundLinkElement = searchResults.find(a => {
                const titleEl = a.querySelector('h3');
                const imgEl = a.querySelector('img');
                const textContent = (titleEl?.textContent || imgEl?.alt || a.textContent || '').trim().toUpperCase();
                return regex.test(textContent);
            });

            if (foundLinkElement) {
                detailUrl = foundLinkElement.getAttribute('href');
                if (detailUrl && detailUrl.startsWith('/')) {
                    detailUrl = 'https://javstore.net' + detailUrl;
                }
            } else {
                javStoreFailed = true;
            }
        }

        // --- 3. JavStore 详情页抓取 ---
        let targetUrl = '';
        if (!javStoreFailed && detailUrl) {
            try {
                const res = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({ method: "GET", url: detailUrl, onload: resolve, onerror: reject });
                });
                const detailDoc = new DOMParser().parseFromString(res.responseText, "text/html");

                const isCover = (url) => url.includes('pl.jpg') || url.includes('ps.jpg') || (url.includes('dmm.co.jp') && !url.includes('jp-'));
                // 策略 A: _s.jpg
                const specificMatch = detailDoc.querySelector(".prose a[href*='_s.jpg'], .entry-content a[href*='_s.jpg']");
                if (specificMatch) targetUrl = specificMatch.href;

                // 策略 B: CLICK HERE
                if (!targetUrl) {
                    const textMatch = Array.from(detailDoc.querySelectorAll(".prose a, .entry-content a"))
                        .find(a => /CLICK HERE|Preview/i.test(a.innerText));
                    if (textMatch) targetUrl = textMatch.href;
                }

                // 策略 C: 最大的非封面 JPG
                if (!targetUrl) {
                    const valid = Array.from(detailDoc.querySelectorAll(".prose a[href*='.jpg'], .entry-content a[href*='.jpg']"))
                        .find(a => !isCover(a.href));
                    if (valid) targetUrl = valid.href;
                }
            } catch (e) {
                // Ignore
            }
        }

        // --- 4. 结果返回 ---
        if (targetUrl) {
            const result = { status: 'success', img: targetUrl };
            if (typeof previewMemoryCache !== 'undefined') previewMemoryCache.set(normalized, result);
            return result;
        }

        // --- 5. 无结果 (不再回退) ---
        console.log(`[JavDB] JavStore: No preview found for ${normalized}`);
        const noData = { status: 'no-data' };
        if (typeof previewMemoryCache !== 'undefined') previewMemoryCache.set(normalized, noData);
        return noData;
    }

    // [v2.7.1] 修改：移除缩放逻辑，改为原生滚动，并防止滚动穿透
    function showPreviewModal(imageUrl, triggerElement) {
        if (document.getElementById('preview-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'preview-modal';
        modal.setAttribute('aria-modal', 'true');

        const content = document.createElement('div');
        content.id = 'preview-modal-content';

        const img = document.createElement('img');
        img.src = imageUrl;
        content.appendChild(img);
        modal.appendChild(content);

        document.body.appendChild(modal);
        // 关键：直接锁定 Body 滚动
        document.body.style.overflow = 'hidden';

        // 移除所有复杂的 transform 逻辑
        // 只处理关闭逻辑
        const closeModal = (e) => {
            // 如果点击的是图片本身，不关闭；只有点击遮罩层才关闭
            if (e && e.target !== modal && e.target !== content) return;

            try { document.body.removeChild(modal); } catch (err) {}
            document.body.style.overflow = '';
            window.removeEventListener('keydown', closeOnEsc);
            // 移除滚轮事件监听 (如果有的话)
            modal.removeEventListener('wheel', preventBodyScroll);
            triggerElement?.focus();
        };

        const closeOnEsc = (e) => {
            if (e.key === 'Escape') closeModal({ target: modal });
        };

        // 阻止滚动穿透的核心逻辑
        const preventBodyScroll = (e) => {
            const el = modal;
            const scrollTop = el.scrollTop;
            const scrollHeight = el.scrollHeight;
            const height = el.clientHeight;
            const delta = e.deltaY;
            const isScrollingDown = delta > 0;
            const isScrollingUp = delta < 0;

            // 如果内容小于容器高度，直接禁止滚动
            if (scrollHeight <= height) {
                e.preventDefault();
                return;
            }

            // 滚动到底部，且继续向下滚动 -> 阻止
            if (isScrollingDown && (scrollHeight - height - scrollTop <= 1)) {
                e.preventDefault();
            }
            // 滚动到顶部，且继续向上滚动 -> 阻止
            else if (isScrollingUp && scrollTop <= 0) {
                e.preventDefault();
            }
            // 其他情况允许模态框内部滚动
        };

        // 绑定事件
        modal.addEventListener('click', closeModal);
        window.addEventListener('keydown', closeOnEsc);
        // 添加滚轮阻挡逻辑
        modal.addEventListener('wheel', preventBodyScroll, { passive: false });
    }

    function parseStatusFromDoc(doc) {
        let status = 'unmarked';
        let reviewId = '';
        let rating = 0;

        const watchedTag = doc.querySelector('.review-title .tag.is-success.is-light');
        const wantedTag = doc.querySelector('.review-title .tag.is-info.is-light');
        const deleteLink = doc.querySelector('a[data-method="delete"][href*="/reviews/"]');

        if (watchedTag) {
            status = 'watched';
            const checkedInput = doc.querySelector('.rating-star .control input:checked');
            if (checkedInput) rating = parseInt(checkedInput.value, 10) || 0;
        } else if (wantedTag) {
            status = 'wanted';
        }

        if (deleteLink) {
            const m = deleteLink.href.match(/\/reviews\/(\d+)/);
            if (m) reviewId = m[1];
        }

        return { status, reviewId, rating };
    }

    function applyStatusToItem(item, parsed) {
        const statusContainer = item.querySelector('.csb-status-container');
        if (!statusContainer || !parsed) return;

        const { status, reviewId, rating } = parsed;
        statusContainer.className = 'csb-status-container';
        item.dataset.reviewId = reviewId || '';

        const ratingDisplay = statusContainer.querySelector('.star-arc-container');
        if (ratingDisplay) {
            ratingDisplay.querySelectorAll('span').forEach((star, index) => {
                star.classList.toggle('is-filled', status === 'watched' && index < (rating || 0));
            });
        }
        statusContainer.classList.add(`show-${status || 'unmarked'}`);
    }

    async function fetchItemData(item, forceUpdate = false) {
        if ((item.dataset.statusChecked && !forceUpdate) || item.dataset.statusFetching) return;
        item.dataset.statusFetching = 'true';

        const anchor = item.querySelector('a.box') || item.querySelector('.box a');
        if (!anchor) {
            delete item.dataset.statusFetching;
            return;
        }

        let videoId = anchor.href.split('/').pop();
        if (settings.status && isLoggedIn()) {
            if (!statusCache.has(videoId) || forceUpdate) {
                try {
                    const safeUrl = getSafeUrl(anchor.href);
                    const res = await statusLimiter.run(() => gmRequest({ method: "GET", url: safeUrl }));
                    if (res.status >= 200 && res.status < 300) {
                        const doc = new DOMParser().parseFromString(res.responseText, "text/html");
                        const parsed = parseStatusFromDoc(doc);
                        statusCache.set(videoId, parsed);
                        limitCacheSize(statusCache, MAX_CACHE_SIZE);
                        applyStatusToItem(item, parsed);
                    }
                } catch (error) {
                    console.error('JavDB Enhanced: fetch item failed', error);
                    if (error.status === 403 || error.status === 422) {
                        authenticityToken = null;
                    }
                }
            } else {
                applyStatusToItem(item, statusCache.get(videoId));
            }
        }

        item.dataset.statusChecked = 'true';
        delete item.dataset.statusFetching;
    }

    function showRatingModal(item, videoId) {
        const html = `
            <div class="rating-stars">
                ${[5, 4, 3, 2, 1].map(i => `<input type="radio" id="star${i}-${videoId}" name="rating-${videoId}" value="${i}"><label for="star${i}-${videoId}">★</label>`).join('')}
            </div>
            <button class="btn-cancel-rating">${T('cancel')}</button>
        `;
        const result = createCoverModal(item, 'rating-modal-container', html);
        if (!result) return;
        const { modal, closeModal } = result;
        modal.addEventListener('click', (e) => { e.stopPropagation(); });
        modal.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                updateReviewStatus('watched', videoId, item, e.target.value);
                closeModal();
            });
        });
        modal.querySelector('.btn-cancel-rating').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }

    function showDeleteConfirmation(item, videoId) {
        const html = `
            <p>${T('confirmDelete')}</p>
            <div class="buttons">
                <button class="button is-danger btn-confirm-delete">${T('confirm')}</button>
                <button class="button is-light btn-cancel-delete">${T('cancel')}</button>
            </div>
        `;
        const result = createCoverModal(item, 'confirm-delete-modal', html);
        if (!result) return;
        const { modal, closeModal } = result;
        modal.querySelector('.btn-confirm-delete').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            updateReviewStatus('delete', videoId, item);
            closeModal();
        });
        modal.querySelector('.btn-cancel-delete').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }

    function initHoverBehavior(item) {
        if (item.dataset.hoverInit) return;
        item.dataset.hoverInit = 'true';
        let hoverTimer;
        const startFetch = async () => {
            if (hoverTimer) clearTimeout(hoverTimer);
            hoverTimer = setTimeout(async () => {
                showStatusUI(item);
                if (!item.dataset.statusChecked) {
                    await fetchItemData(item, false);
                }
            }, settings.fetchDelay);
        };

        item.addEventListener('mouseenter', startFetch);
        item.addEventListener('mouseleave', () => {
            if (hoverTimer) clearTimeout(hoverTimer);
            if (settings.hideOnMouseLeave) hideStatusUI(item);
        });
    }

    async function handlePreviewTrigger(item, previewIcon) {
        if (!settings.enablePreview || !previewIcon || previewIcon.classList.contains('fetch-failed')) return;
        previewIcon.classList.remove('fetch-error');

        if (item.dataset.previewUrl && previewIcon.classList.contains('has-preview')) {
            showPreviewModal(item.dataset.previewUrl, previewIcon);
            return;
        }

        if (!settings.previewThirdPartyConsent) {
            const agreed = await presentPreviewConsentModal(previewIcon);
            if (agreed) {
                settings.previewThirdPartyConsent = true;
                saveSettings();
            } else {
                return;
            }
        }

        const titleElement = item.querySelector('.video-title strong');
        if (!titleElement) return;

        previewIcon.classList.remove('has-preview');
        previewIcon.classList.add('is-loading');
        previewIcon.innerHTML = ICONS.loading;
        previewIcon.title = T('loadingPreview');

        const rawCode = titleElement.textContent.trim();
        const previewData = await fetchPreviewImage(rawCode);
        previewIcon.classList.remove('is-loading');

        if (previewData.status === 'success') {
            item.dataset.previewUrl = previewData.img;
            previewIcon.classList.add('has-preview');
            previewIcon.innerHTML = ICONS.preview;
            previewIcon.title = T('preview');
            showPreviewModal(previewData.img, previewIcon);
        } else if (previewData.status === 'no-data') {
            previewIcon.classList.add('fetch-failed');
            previewIcon.innerHTML = ICONS.brokenImage;
            previewIcon.title = T('noPreview');
        } else {
            previewIcon.classList.add('fetch-error');
            previewIcon.innerHTML = ICONS.brokenImage;
            previewIcon.title = T('errorPreview');
        }
    }

    function initDelegatedEvents() {
        if (delegationInitialized) return;
        delegationInitialized = true;

        const body = document.body;

        body.addEventListener('mouseover', e => {
            const item = e.target.closest?.(ITEM_SELECTOR);
            if (!item || (e.relatedTarget && item.contains(e.relatedTarget))) return;
            const t = setTimeout(async () => {
                showStatusUI(item);
                if (!item.dataset.statusChecked) {
                    await fetchItemData(item, false);
                }
            }, settings.fetchDelay);
            clearTimeout(hoverTimers.get(item));
            hoverTimers.set(item, t);
        });
        body.addEventListener('mouseout', e => {
            const item = e.target.closest?.(ITEM_SELECTOR);
            if (!item || (e.relatedTarget && item.contains(e.relatedTarget))) return;
            clearTimeout(hoverTimers.get(item));
            hoverTimers.delete(item);
            if (settings.hideOnMouseLeave) hideStatusUI(item);
        });
        body.addEventListener('click', e => {
            const target = e.target;
            const btnWanted = target.closest('.btn-set-wanted');
            const btnWatched = target.closest('.js-set-watched, .btn-modify');
            const btnDelete = target.closest('.js-delete');
            const previewIcon = target.closest('.csb-preview-icon-container');

            if (!btnWanted && !btnWatched && !btnDelete && !previewIcon) return;
            const item = target.closest(ITEM_SELECTOR);
            if (!item) return;

            e.preventDefault();
            e.stopPropagation();

            const videoId = (item.querySelector('a.box') || item.querySelector('.box a'))?.href.split('/').pop();

            if (previewIcon) {
                handlePreviewTrigger(item, previewIcon);
            } else if (videoId) {
                if (btnWanted) updateReviewStatus('wanted', videoId, item);
                else if (btnWatched) showRatingModal(item, videoId);
                else if (btnDelete) showDeleteConfirmation(item, videoId);
            }
        }, true);
        body.addEventListener('keydown', e => {
            const previewIcon = e.target.closest?.('.csb-preview-icon-container');
            if (!previewIcon || (e.key !== 'Enter' && e.key !== ' ')) return;
            e.preventDefault();
            e.stopPropagation();
            const item = previewIcon.closest(ITEM_SELECTOR);
            if (!item) return;
            handlePreviewTrigger(item, previewIcon);
        }, true);
    }

    function processItem(item) {
        const anchorElement = item.querySelector('a.box') || item.querySelector('.box a');
        const elementToColor = item.querySelector('a.box') || item.querySelector('div.box');
        const scoreElement = item.querySelector('.score .value');
        let weightedRating = 0;
        if (settings.highlight && item.dataset.highlightProcessed !== 'true' && scoreElement) {
            item.dataset.highlightProcessed = 'true';
            const C_MIN = settings.heatmapMin;
            const m = settings.ratedByThreshold;
            const C_MAX = settings.heatmapMax;
            const curveFactor = settings.heatmapCurveFactor || 1.0;

            delete item.dataset.heatColor;
            for (const re of scoreRegexes) {
                const m_text = (scoreElement.textContent || '').trim().match(re);
                if (m_text) {
                    const parsedScore = { score: parseFloat(m_text[1]), ratedBy: parseInt(m_text[2], 10) };
                    weightedRating = (parsedScore.ratedBy * parsedScore.score + m * C_MIN) / (parsedScore.ratedBy + m);
                    if (parsedScore.score >= C_MIN) {
                        const valueToColor = weightedRating;
                        let normalizedHeat = (valueToColor - C_MIN) / (C_MAX - C_MIN);
                        normalizedHeat = Math.max(0, Math.min(1, normalizedHeat));
                        if (curveFactor !== 1.0) {
                            normalizedHeat = Math.pow(normalizedHeat, curveFactor);
                        }
                        item.dataset.heatColor = getHeatmapColor(normalizedHeat);
                    }
                    break;
                }
            }
            item.dataset.heat = String(weightedRating);
            if (elementToColor) {
                elementToColor.style.backgroundColor = (settings.highlight && item.dataset.heatColor) ? item.dataset.heatColor : '';
            }
        } else if (elementToColor && !item.dataset.highlightProcessed) {
            item.dataset.heat = '0';
        }

        if (settings.highlight) {
            const score = parseFloat(item.dataset.heat || '0');
            const c_min = settings.heatmapMin;
            if (score > 0 && score < c_min) {
                item.dataset.jdbeHide = 'true';
            } else {
                item.dataset.jdbeHide = 'false';
            }
        }

        const coverElement = item.querySelector('.cover');
        if (coverElement && anchorElement && !item.dataset.statusProcessed) {
            item.dataset.statusProcessed = 'true';
            const overlayRoot = appendUIOnce(coverElement, '.cover-status-buttons', STATUS_BUTTONS_TEMPLATE);
            if (overlayRoot && !settings.useEventDelegation) {
                const videoId = anchorElement.href.split('/').pop();
                overlayRoot.querySelector('.btn-set-wanted')?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); updateReviewStatus('wanted', videoId, item); });
                overlayRoot.querySelectorAll('.js-set-watched, .btn-modify').forEach(btn => btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); showRatingModal(item, videoId); }));
                overlayRoot.querySelectorAll('.js-delete').forEach(btn => btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); showDeleteConfirmation(item, videoId); }));
            }

            const previewIcon = appendUIOnce(coverElement, '.csb-preview-icon-container', PREVIEW_ICON_TEMPLATE);
            if (previewIcon && !settings.useEventDelegation) {
                const trigger = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePreviewTrigger(item, previewIcon);
                };
                previewIcon.addEventListener('click', trigger);
                previewIcon.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') trigger(e); });
            }

            if (!settings.useEventDelegation) {
                 initHoverBehavior(item);
            }
        }
    }

    function getHeatmapColor(heat) {
        const h = Math.min(Math.max(heat, 0), 1);
        const r = h > 0.5 ? Math.round(255 * ((h - 0.5) * 2)) : 0;
        const g = h < 0.5 ? Math.round(255 * (h * 2)) : Math.round(255 * (1 - (h - 0.5) * 2));
        const b = h < 0.5 ? Math.round(255 * (1 - (h * 2))) : 0;
        return `rgba(${r},${g},${b},0.5)`;
    }

    function createIndependentSortButton() {
        if (document.getElementById('sort-by-heat-btn-container')) return;
        const hasItems = document.querySelector(ITEM_SELECTOR);
        if (!hasItems) return;
        const cont = document.createElement('div');
        cont.id = 'sort-by-heat-btn-container';
        cont.innerHTML = `<a class="button">${T('sort')}</a>`;
        cont.addEventListener('click', e => { e.preventDefault(); sortItemsByHeat(); });
        document.body.appendChild(cont);
        updateUIVisibility();
    }

    function sortItemsByHeat() {
        const containers = Array.from(document.querySelectorAll('.movie-list, .is-user-page .columns.is-multiline'));
        if (containers.length === 0) return;
        const allItems = Array.from(document.querySelectorAll(ITEM_SELECTOR));
        allItems.sort((a, b) => (parseFloat(b.dataset.heat || '0') - parseFloat(a.dataset.heat || '0')));
        const primaryContainer = containers[0];
        allItems.forEach(item => primaryContainer.appendChild(item));
        const navBar = document.querySelector('.navbar.is-fixed-top');
        const offset = navBar ? navBar.offsetHeight : DEFAULT_NAVBAR_HEIGHT;
        window.scrollTo({ top: primaryContainer.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }

    function main() {
        loadSettings();
        getCsrfToken();
        updateUIVisibility();
        const obs = new MutationObserver(muts => {
            const itemsToProcess = new Set();
            for (const mut of muts) {
                if (mut.addedNodes && mut.addedNodes.length) {
                    for (const node of mut.addedNodes) {
                        if (node.nodeType !== 1) continue;
                        if (node.matches?.(ITEM_SELECTOR)) itemsToProcess.add(node);
                        if (node.querySelectorAll) {
                            node.querySelectorAll(ITEM_SELECTOR).forEach(it => itemsToProcess.add(it));
                        }
                    }
                }
                if (mut.type === 'childList' && mut.target && mut.target.closest) {
                    const potentialItem = mut.target.closest(ITEM_SELECTOR);
                    if (potentialItem && !itemsToProcess.has(potentialItem)) {
                        itemsToProcess.add(potentialItem);
                    }
                }
            }

            if (itemsToProcess.size > 0) {
                itemsToProcess.forEach(item => {
                    if (item.querySelector('.score .value') || item.querySelector('.meta')) {
                        item.dataset.highlightProcessed = 'false';
                    }
                    processItem(item);
                });
                createIndependentSortButton();
            }
        });

        obs.observe(document.body, { childList: true, subtree: true });

        document.querySelectorAll(ITEM_SELECTOR).forEach(processItem);
        createIndependentSortButton();
        if (settings.useEventDelegation) {
            initDelegatedEvents();
        }
    }

    GM_registerMenuCommand(T('settings'), openSettingsModal);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();