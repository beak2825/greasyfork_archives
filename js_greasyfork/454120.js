// ==UserScript==
// @name         南加北加论坛强化脚本(凛+)
// @version      94
// @description  加强东南北+功能: 太多了请看功能简介
// @author       遠坂凛
// @namespace    tousakarin
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhEAAQAKIAAKIbG8dXV/339+atrfHMzOGXl9d3d7QxMSH5BAAAAAAALAAAAAAQABAAAANSKBPX0Ma8MBR7GBA5y81AdIihgxWW+I0PsURVAQoXNQwtB0EolYOTza0HPI0EtCKug5RlAsjZwtQSPJGEqIljGGa3IN+EJT55XDnUdHwgOCiCBAA7
// @grant        unsafeWindow
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM.notification
// @grant        GM.openInTab
// @grant        GM.registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @match        *://*.east-plus.net/*
// @match        *://east-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://south-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://south-plus.org/*
// @match        *://*.white-plus.net/*
// @match        *://white-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://north-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://level-plus.net/*
// @match        *://*.soul-plus.net/*
// @match        *://soul-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://snow-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://spring-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://summer-plus.net/*
// @match        *://*.blue-plus.net/*
// @match        *://blue-plus.net/*
// @match        *://*.imoutolove.me/*
// @match        *://imoutolove.me/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/454120/%E5%8D%97%E5%8A%A0%E5%8C%97%E5%8A%A0%E8%AE%BA%E5%9D%9B%E5%BC%BA%E5%8C%96%E8%84%9A%E6%9C%AC%28%E5%87%9B%2B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/454120/%E5%8D%97%E5%8A%A0%E5%8C%97%E5%8A%A0%E8%AE%BA%E5%9D%9B%E5%BC%BA%E5%8C%96%E8%84%9A%E6%9C%AC%28%E5%87%9B%2B%29.meta.js
// ==/UserScript==

/* jshint undef: true, unused: true */
/* jshint -W107, -W098, -W069 */
/* globals unsafeWindow, window, document, navigator, atob, btoa, location, localStorage, fetch, console, alert, confirm, prompt, setInterval, setTimeout, clearTimeout, FileReader, FormData, Blob, URL, URLSearchParams, TextEncoder, CompressionStream, DecompressionStream, Response, MutationObserver, DOMParser, GM, GM_getValue, GM_setValue, GM_deleteValue, GM_listValues, GM_notification, GM_openInTab, GM_registerMenuCommand */

const VERSION_MAJOR = 94;
const VERSION_FULL = 9400;
const VERSION_TEXT = '94.0';

function initGM() {
    let gmExists = false;
    try {
        if (typeof GM.getValue == 'function') {
            gmExists = true;
        }
    } catch (ignore) {}

    if (gmExists) {
        return {
            getValue: GM.getValue,
            setValue: GM.setValue,
            async deleteValue(key) {
                return await GM.deleteValue(key);
            },
            listValues: GM.listValues,
            notification: GM.notification,
            openInTab: GM.openInTab,
            registerMenuCommand: GM.registerMenuCommand
        };
    } else {
        return {
            getValue: GM_getValue,
            setValue: GM_setValue,
            async deleteValue(key) {
                return GM_deleteValue(key);
            },
            listValues: GM_listValues,
            notification: GM_notification,
            openInTab: GM_openInTab,
            registerMenuCommand: GM_registerMenuCommand
        };
    }
    
}
(function() {
"use strict";

const GM = initGM();

const INTRO_POST = document.location.origin + '/read.php?tid-2086932.html';

GM.registerMenuCommand('打开功能简介帖 (茶館)', () => GM.openInTab(INTRO_POST, false));
GM.registerMenuCommand('打开设置 (个人首页)', () => GM.openInTab(document.location.origin + '/u.php', false));

const MY_NAME_DISPLAY = 'Me';

const MAIN_CONFIG_KEY = 'my_config';
const DEFAULT_MAIN_CONFIG = {
    myUserHashId: null,
    myNickName: null,
    autoCheckReplyOption: true,
    enhanceSellFrame: true,
    buyRefreshFree: true,
    replyRefreshFree: true,
    enhancePageTitle: true,
    highlightMyself: true,
    heightReductionMode: false,
    heightReductionMode$LV2: false,
    showFloatingMessageIndicator: true,
    showFloatingStoreThreadButton: true,
    showFloatingWatchIndicator: true,
    hideWatchButtonIfEmpty: false,
    subCategoryInheritImageWallMode: true,
    dontFilterRequestReplyByUser: true,
    showInputLimit: true,
    hideDefaultUserpic: false,
    hideOtherUserpic: false,
    selfBypassHideUserpic: true,
    customUserBypassHideUserpic: true,
    stickyUserInfo: true,
    showExtendedUserInfo: true,
    showExtendedUserInfo$HP: false,
    hideIgnoreContentPost: false,
    disablePostCollapse$Self: true,
    treatAllEmojiTheSameWay: true,
    ignoreContentUseTextOnly: true,
    customUserBypassIgnoreList: true,
    customUserpicBypassIgnoreList: false,
    watchSkipIgnoreContent: true,
    customUserBypassWatchSkip: true,
    hideFilteredThread: false,
    requestThreadHighlightEnded: true,
    requestThreadShowExtraBounty: true,
    requestThreadUseHistoryData: true,
    siteAnnouncementSectionDefaultFolded: false,
    siteNoticeSectionDefaultFolded: false,
    showBackToTopButton: true,
    useCustomUserInfoPopup: true,
    hideInactivePinnedUsers: true,
    floatingShortcut: 'tr',
    textSize: 0,
    siteThemeDarkerSubjectLine: false,
    hideRedundantReSubjectLine: true,
    addQuickJumpReSubjectLine: true,
    threadListDefaultOpenNewPage: false,
    infiniteScrollReplaceURL: false,
    infiniteScrollScrollToNewPage: false,
    infiniteScroll$usertopics: false,
    infiniteScroll$userposts: false,
    infiniteScroll$threads: false,
    infiniteScroll$thread_posts: false,
    infiniteScroll$search: false,
    infiniteScroll$msg_inbox: false,
    showResourceSpotsFloating: true,
    showResourceSpots$sells: true,
    showResourceSpots$attachments: true,
    showResourceSpots$shares: true,
    showResourceSpots$images: true,
    showResourceSpots$links: false,
    showResourceSpots$likes: false,
    showFavThreadFloatingList: true,
    showFavThreadFloatingList$withTitle: true,
    showActiveRepliers: false,
    showActiveRepliers$min: 2,
    showShareTypeFilter: true,
    hideSettlementPost: true,
    hideSettlementPost$GreyoutOnly: true,
    hideSettlementPost$UseDefaultKeywords: true,
    hideSettlementPost$HighlightMyself: true,
    customUserBypassThreadFilter: true,
    showRequestThreadFilters: true,
    customUserHashIdMappings: {
        '#4': [4, '1eb7ddbc', '可可萝'],
        '@1eb7ddbc': [4, '1eb7ddbc', '可可萝']
    },
    customUserOrderBy: 'uid',
    userReplyListFolded: false,
    replyShownAsByOp: false,
    hideZeroReply: false,
    keepVisitPostHistory: true,
    showInitialRememberedTitle: false,
    hideFrontPageRecentList: false,
    v15migrationApplied: false,
    v42migrationApplied: false,
    openIntroAfterUpdate: true,
    autoSpTasks: true,
    showDefaultingPicWallOption: true,
    hideMobileVerSwitch: true,
    showSearchBar: false,
    showSearchBar$align: null,
    hasSeenAdminRole: false,
    adminNoScoreNotifByDefault: false,
    adminHideMarkUnscoreButton: false,
    adminHideMarkBadFormatButton: false
};

const MIN_OVER_HEIGHT_STICKY_MODE_TRIGGER = 75;
const THREAD_FILTER_EXEMPTED_USERS = new Set([4, 168153]); // 可可萝(站长), 平安魂加(总版主)

const MIN_REQUEST_INTERVAL = 1100;

const SYSTEM_MESSAGE_TITLES = new Set([
    '您的文章被评分',
    '您的文章被取消评分',
    '您的文章标题被加亮显示',
    '您的文章被置顶.',
    '您的回复被设为最佳答案!',
    '您的回复获得热心助人奖 ..'
]);

const DEFAULT_SCORING_PRESETS = {
    'fid=201': { // COS区: 自购30天 / 优秀30天
        headtopDaysBought: 30,
        headtopDaysCompilation: 30,
        extraScoreAdjustments: [
            { label: '+200', amount: 200, reason: '第一类盘奖励' }
        ]
    },
    'fid=*': { // 各区默认: 自购7天 / 优秀30天
        headtopDaysBought: 7,
        headtopDaysCompilation: 30,
        extraScoreAdjustments: []
    }
};

const SCORE_DIFF_ALLOWANCE = {
    'fid=201': [220, 220],  // COS区
    'fid=*': [10, 100]     // 各区默认
};

const SEARCH_CONFIG_KEY = 'my_search_pref';
const DEFAULT_SEARCH_CONFIG = {
    defaultSearchAll: false,
    defaultTimeRange: '31536000',
    pinnedTopics: {}
};

const THREAD_CUSTOM_CATEGORY_CONFIG_KEY = 'my_thread_categories';
const DEFAULT_THREAD_CUSTOM_CATEGORY_CONFIG = {
    keywords: []
};

const THREAD_FILTER_CONFIG_KEY = 'my_thread_filter';
const DEFAULT_THREAD_FILTER_CONFIG = {
    dislikes: [],
    likes: [],
    settlementKeywords: []
};

const CONTENT_IGNORE_LIST_CONFIG_KEY = 'my_ignore_list';
const DEFAULT_CONTENT_IGNORE_LIST_CONFIG = {
    terms: [],
    exceptions: []
};

const USER_FILTER_CONFIG_KEY = 'my_user_filter';
const DEFAULT_USER_FILTER_CONFIG = {
    users: {}
};

const PINNED_USERS_CONFIG_KEY = 'my_pinned_users';
const DEFAULT_PINNED_USERS_CONFIG = {
    users: {}
};

const SHARETYPE_FILTER_CONFIG_KEY = 'my_sharetype_filter';
const DEFAULT_SHARETYPE_FILTER_CONFIG = {
    hides: []
};

const FAVOR_THREADS_CACHE_CONFIG_KEY = 'my_favor_threads';
const DEFAULT_FAVOR_THREADS_CACHE_CONFIG = {
    time: 0,
    tids: []
};

const QUESTION_AND_REQUEST_AREA_ID = 48;
const DEFAULT_IGNORABLE_MARKER_TAG = '<IGNORABLE>';

const DEFAULT_SETTLEMENT_STOPWORD_PATTERN = /[谢謝][谢謝]|多[谢謝]|大佬|老哥|兄弟|[請请][进進]?|[给給]|收|用户/g;
const DEFAULT_SETTLEMENT_KEYWORD_PATTERN = /^[奖獎][励勵][贴帖]|感[谢謝]|[结結][账賬]|[转轉][账賬]|[约約]定[贴帖]?|[請请][进進]|[结結][贴帖]|[结結]算[贴帖]?|^另?[结結]|[补補][悬懸][赏賞]|[补補]SP|[热熱]心助人|[热熱]心/g;
const DEFAULT_SETTLEMENT_BLACKLIST_PATTERN = /^求(?!物)|资源|出处|视频|合集|完整版/;
const DEFAULT_SETTLEMENT_TITLE_MAX_OTHER_TEXT_AMOUNT = 10;

const ADMIN_TEMPLATE_CONFIG_KEY = 'my_admin_template';
const DEFAULT_ADMIN_TEMPLATEUSER_FILTER_CONFIG = {
    pingReasons: [
        '请注意标题格式',
        '标题请注明大小',
        '标题禁用【】《》符号 敬请注意',
        '转帖不评分',
        '评分前已失效',
        '-----',
        '禁止盗链转存',
        '禁止净放BT',
        '-----',
        '广告帖',
        '政治贴',
        '恶意灌水',
        '无意义话题',
        '与版规不符',
        '重复话题',
        '重复发帖',
        '询问求物',
        '分类违规',
        '-----',
        '优秀文章',
        '原创内容',
    ]
};

const PUNISH_TYPE_BAN = '禁言';
const PUNISH_TYPE_HP = '扣血';
const PUNISH_TYPE_DELETE_THREAD = '删帖';
const PUNISH_TYPE_DELETE_REPLY = '删除回复';
const PUNISH_TYPE_SP = '扣分';
const PUNISH_TYPE_SHIELD = '屏蔽';
const PUNISH_TYPE_UNSHIELD = '取消屏蔽';
const PUNISH_TYPE_CUSTOM = '备注';
const PUNISH_TYPES = [
    PUNISH_TYPE_BAN,
    PUNISH_TYPE_HP,
    PUNISH_TYPE_DELETE_THREAD,
    PUNISH_TYPE_DELETE_REPLY,
    PUNISH_TYPE_SP,
    PUNISH_TYPE_SHIELD,
    PUNISH_TYPE_UNSHIELD,
    PUNISH_TYPE_CUSTOM
];

const REQUEST_ZONE_NAME = '询问&求物';
const NEVER_SCORE_USER_PREFIX = '[不评分]';
const TRUSTED_SCORE_USER_PREFIX = '[OK]';
const SYSTEM_SENDER_DISPLAY_NAME = 'SYSTEM';

const customCss = `
:root {
    --rinsp-active-toggler-bg-color: #EEEE;
    --rinsp-active-toggler-fg-color: #333;
    --rinsp-visited-link-color: #AAA;
    --rinsp-visited-link-hover-color: #333;
    --rinsp-visited-update-color: #7628A2;
    --rinsp-visited-update-border-color: #CAB2D7;
    --rinsp-blocked-row-bg: #F9F9F9;
    --rinsp-blocked-row-label-color: #AAA;
    --rinsp-avatar-replace-default-text-color: #AAA;
    --rinsp-avatar-replace-default-border-color: #EEE;
    --rinsp-avatar-replace-default-bg: #F8F8F8;
    --rinsp-cell-background-grey-out: #EEE;
    --rinsp-cell-background-hgt-new: #FFFFC5;
    --rinsp-cell-background-hgt-err: #FFC5C5;
    --rinsp-cell-background-active: #e4f2f7;
    --rinsp-lightest-bg-color: #FCFCFC;
    --rinsp-darkest-text-color: #000;
    --rinsp-text-color-orange: ##ffa500;
    --rinsp-text-color-green: #06a426;
    --rinsp-text-color-red: #ea2a2a;
    --rinsp-text-color-blue: #161884;
    --rinsp-text-color-violet: #8c19ac;
    --rinsp-text-color-grey: #999;
    --rinsp-infscroll-height: 55px;
    --rinsp-infscroll-divider-text-color: #3a6776;
    --rinsp-infscroll-divider-border-color: #a3b7b8;
    --rinsp-infscroll-divider-background: #ebf6f7;
    --rinsp-infscroll-loader-border-color: #CCC;
    --rinsp-infscroll-loader-background: #F5F5F5;
    --rinsp-infscroll-loader-progress: #EEE;
    --rinsp-image-masking-filter: contrast(0%) brightness(200%) drop-shadow(0px 0px 1px #000);
    --rinsp-pin-icon: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAARJJREFUeNpi/P//PwMlgImQgn/ffrT/+/a3HacCkAsw8J/X7b96Zv3/ztWLwJ7L/v+886sdXS0WA761/+qaAtW45v+fi7/+///37///3x///6le/v/Xx/8ohmB64dtVnX8NP6EcLgYGARYGBkZGoGeB+N0zhn87X1cgK2fBMODjNyTOdYbfQV8Z/iqxAg3+wPBvP9Asu78EAlFS8QqjJ7IZjxj+bb0L1PwWyGFlYFQT7SAQC7KVrD1GHYzS6OJALzQ4MLAZMVcSjgUg/vf+YfuvyUv+f4ma9f9L0cb/v259bMemDqcBYAw05PqtO/+v33n+H5caJgYKwcAbwIJflp2BixNoBxMHTiWMNM+NhABAgAEAghbydDDaUO8AAAAASUVORK5CYII=);
}
#mainNav #user-login {
    white-space: nowrap;
}
#mainNav #user-login a[href="u.php"] {
    max-width: 8em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    white-space: nowrap;
    vertical-align: middle;
}
#guide.guide {
    padding: 0;
}

.rinsp-intro-link {
    margin-left: 7px;
    color: #288407;
    font-weight: bold;
}
.rinsp-dev-toggle {
    opacity: 0;
    border: none;
    outline: none !important;
}
.rinsp-dev-toggle:focus {
    opacity: 0.1;
}

/* === message box add alternating background === */
form[action="message.php"] .set-table2 > tbody > tr:NOT(.gray3):nth-child(odd) {
    background-color: #b4d8e524;
}
form[action="message.php"]:not([onsubmit="return checkCnt();"]) .set-table2 > tbody > tr:NOT(.gray3):hover {
    background-color: #ead67924;
}

/* ====== truncate long post title in crumbs ====== */
.crumbs-item.current {
    max-width: 55%;
}
.crumbs-item.current strong a {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    white-space: nowrap;
    vertical-align: top;
}

/* ====== watcher function ====== */
#rinsp-watcher-menu {
    margin-left: 40px;
}
.rinsp-common-popup-menu > .bor {
    max-height: calc(90vh - 100px);
    overflow: auto;
    overflow-x: hidden;
}
.rinsp-notification-item.rinsp-notification-item-type-watch > .rinsp-notification-item-count {
    color: #ee9e05;
}
.rinsp-excontrol-item-watch {
    color: #999;
    --rinsp-excontrol-base-hover-color: #f06629;
    --rinsp-excontrol-active-color: #aa0920;
    --rinsp-excontrol-active-hover-color: #000;
}

.new-msg-tips,
.new-msg-tips + span {
    transform: translateX(-55px);
}
.readbot li.rinsp-watch {
    width: 7em;
}
.readbot li.rinsp-watch::after {
    content: "未开启";
    color: #BBB;
}
.readbot li.rinsp-watch:hover::after {
    color: var(--rinsp-darkest-text-color);
}
.readbot li.rinsp-running {
    pointer-events: none;
    cursor: wait;
}
.readbot li.rinsp-running::after {
    content: "工作中";
    color: var(--rinsp-text-color-orange);
    font-weight: bold;
}

.readbot li.rinsp-watch.rinsp-active::after {
    content: "已开启";
    color: var(--rinsp-text-color-green);
    font-weight: bold;
}
tr.rinsp-expired > td {
    background: var(--rinsp-cell-background-grey-out);
}
tr.rinsp-expired:hover > td {
    opacity: 0.5;
}
tr.rinsp-expired > .rinsp-bounty-cell {
    color: var(--rinsp-text-color-red);
    font-weight: bold;
}
tr.rinsp-new > td {
    background: var(--rinsp-cell-background-hgt-new);
}
tr.rinsp-error > td {
    background: var(--rinsp-cell-background-hgt-err);
}
tr.rinsp-new > td.rinsp-status-cell {
    font-weight: bold;
    font-size: 110%;
    color: var(--rinsp-text-color-green);
}
tr.rinsp-ignorable > td.rinsp-status-cell {
    color: var(--rinsp-text-color-blue);
}
tr:not(.rinsp-new):not(.rinsp-error):not(.rinsp-ignorable) > td.rinsp-status-cell {
    font-size: 90%;
    color: #666;
}

td.rinsp-action-bar {
    text-align: left;
}
.rinsp-check-now {
    cursor: pointer;
    padding: 1px 5px;
    display: inline-block;
}
.rinsp-check-now:hover {
    background: #DDD;
}
html.rinsp-dark-mode .rinsp-check-now:hover {
    background: var(--rinsp-dm-color-darkbg-hover);
}
.rinsp-limit-warning {
    color: red;
    font-weight: bold;
    font-size: 1.1em;
    background: #fffa6a;
    padding: 1px 5px;
    display: inline-block;
    float: right;
}
.rinsp-notification-container {
    position: fixed;
    left: calc(50vw - 515px);
    top: 100px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    z-index: 2;
}
.rinsp-tpcontrol-container,
.rinsp-bmcontrol-container,
.rinsp-excontrol-container {
    position: fixed;
    left: calc(50vw + 475px);
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
}
.rinsp-excontrol-container {
    top: 50vh;
    transform: translateY(-50%);
}
.rinsp-tpcontrol-container {
    top: 100px;
}
.rinsp-tpcontrol-container .rinsp-excontrol-item {
    width: 1.3em;
    text-align: center;
    padding: 1px 2px;
}
.rinsp-bmcontrol-container {
    bottom: 12px;
}
@media only screen and (max-width: 1024px) {
    .rinsp-notification-container {
        left: 9px;
    }
    .rinsp-tpcontrol-container,
    .rinsp-bmcontrol-container,
    .rinsp-excontrol-container {
        left: unset;
        right: 9px;
    }
}
.rinsp-excontrol-item {
    color: #999;
    padding: 1px 4px;
    background: #333C;
    box-shadow: 2px 2px 1px 0 #0009;
    white-space: pre;
    text-align: center;
    font-size: 14px;
    line-height: 18px;
    flex: 0;
    margin: 8px 0;
    cursor: pointer;
}

.rinsp-excontrol-item:hover {
    text-decoration: none;
}
.rinsp-excontrol-item-hidden {
    display: none;
}
.rinsp-excontrol-item:not(:hover) {
    opacity: 0.75;
}
.rinsp-excontrol-item.rinsp-excontrol-item-ticker:not(hover) {
    opacity: 0.9;
}
.rinsp-excontrol-item.rinsp-excontrol-item-ticker:hover {
    outline: 3px solid var(--rinsp-excontrol-base-hover-color);
}
.rinsp-excontrol-item.rinsp-excontrol-item-ticker:not(.rinsp-active) {
    margin-bottom: 24px;
}
.rinsp-excontrol-item.rinsp-excontrol-item-ticker.rinsp-active {
    outline: 3px solid var(--rinsp-excontrol-active-color);
    color: var(--rinsp-active-toggler-fg-color);
    font-weight: bold;
    background: var(--rinsp-active-toggler-bg-color);
}
.rinsp-excontrol-item.rinsp-excontrol-item-ticker.rinsp-active:hover {
    outline: 3px solid var(--rinsp-excontrol-active-hover-color);
}
.rinsp-excontrol-item.rinsp-excontrol-item-ticker.rinsp-active:after {
    content: '✔';
    display: block;
    height: 16px;
    overflow: hidden;
    font-size: 12px;
    color: var(--rinsp-excontrol-active-color);
}
.rinsp-excontrol-item.rinsp-running {
    pointer-events: none;
    opacity: 0.3;
}

.rinsp-notification-item > .rinsp-notification-item-count {
    font-family: monospace;
    font-weight: bold;
    font-size: 17px;
}
.rinsp-excontrol-item > .rinsp-excontrol-item-count {
    font-family: monospace;
    font-weight: bold;
    font-size: 15px;
    margin: 0 -0.5em;
}
.rinsp-excontrol-item > .rinsp-excontrol-item-count-3d {
    font-size: 13px;
    transform: scaleX(0.85);
    display: inline-block;
}
.rinsp-excontrol-item:after {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    color: #999;
}

/* == scoring filter toggler == */
.rinsp-highlight-unscored-thread-toggler:hover,
.rinsp-highlight-unscored-thread-mode .rinsp-highlight-unscored-thread-toggler:hover {
    outline: 5px solid #ce0940;
}
.rinsp-highlight-unscored-thread-toggler:after {
    content: '\\a评\\a分\\a模\\a式';
}
.rinsp-highlight-unscored-thread-mode .rinsp-highlight-unscored-thread-toggler {
    background: var(--rinsp-active-toggler-bg-color);
    outline: 3px solid #ce0940;
    opacity: 1.0;
}

.rinsp-highlight-unscored-thread-mode .rinsp-highlight-unscored-thread-toggler:after {
    content: '\\a评\\a分\\a模\\a式';
    color: var(--rinsp-active-toggler-fg-color);
}
.rinsp-highlight-unscored-thread-toggler > .rinsp-excontrol-item-count {
    color: #ce0940;
}
.rinsp-highlight-unscored-thread-mode .rinsp-thread-filter-scored {
    display: none;
}
.rinsp-highlight-unscored-thread-mode .rinsp-thread-filter-scored + .tr3:not(.t_one) {
    /* this is a management action button row */
    display: none;
}
.rinsp-highlight-unscored-thread-mode .rinsp-thread-filter-miscored h3 + .gray.tpage {
    color: #ce2323;
    font-weight: bold;
}

.rinsp-highlight-unscored-thread-mode .rinsp-thread-filter-unscored > td:first-child {
    border-left: 4px solid #d90927;
}
.rinsp-highlight-unscored-thread-mode .rinsp-post-gf.rinsp-post-unscored {
    border-left: 4px solid #ce0940 !important;
}

.rinsp-excontrol-totop:hover {
    outline: 3px solid #CCC;
}

/* favor button */
.rinsp-excontrol-item-favor {
    color: #999;
    --rinsp-excontrol-base-hover-color: #f9c342;
    --rinsp-excontrol-active-color: #ce972d;
    --rinsp-excontrol-active-hover-color: #000;
}

/* == settlement ignore toggler == */
.rinsp-request-settlement-greyout-mode .rinsp-settlement-ignore-toggler {
    display: none;
}
.rinsp-settlement-ignore-toggler:hover,
.rinsp-settlement-peek-mode .rinsp-settlement-ignore-toggler:hover {
    outline: 5px solid #2d9126;
}

.rinsp-settlement-ignore-toggler > .rinsp-excontrol-item-count {
    color: #09b93d;
}
.rinsp-settlement-ignore-toggler:after {
    content: '\\a隐\\a藏\\a结\\a算';
}
.rinsp-settlement-peek-mode .rinsp-settlement-ignore-toggler {
    background: var(--rinsp-active-toggler-bg-color);
    outline: 3px solid #2d9126;
    opacity: 1.0;
}

.rinsp-settlement-peek-mode .rinsp-settlement-ignore-toggler:after {
    content: '\\a显\\a示\\a结\\a算';
    color: var(--rinsp-active-toggler-fg-color);
}

/* == content ignore toggler == */
.rinsp-content-ignore-toggler:hover,
.rinsp-filter-peek-mode .rinsp-content-ignore-toggler:hover {
    outline: 5px solid #8873ec;
}
.rinsp-content-ignore-toggler > .rinsp-excontrol-item-count {
    color: #8873ec;
}
.rinsp-content-ignore-toggler:after {
    content: '\\a屏\\a蔽\\a内\\a容';
}
.rinsp-filter-peek-mode .rinsp-content-ignore-toggler {
    background: var(--rinsp-active-toggler-bg-color);
    outline: 3px solid #8873ec;
    opacity: 1.0;
}

.rinsp-filter-peek-mode .rinsp-content-ignore-toggler:after {
    content: '\\a显\\a示\\a屏\\a蔽';
    color: var(--rinsp-active-toggler-fg-color);
}

/* == paywall ignore toggler == */
.rinsp-paywall-ignore-toggler:hover,
.rinsp-paywall-peek-mode .rinsp-paywall-ignore-toggler:hover {
    outline: 5px solid #FF40AC;
}
.rinsp-paywall-ignore-toggler > .rinsp-excontrol-item-count {
    color: #FF40AC;
}
.rinsp-paywall-ignore-toggler:after {
    content: '\\a网\\a赚\\a区';
}
.rinsp-paywall-peek-mode .rinsp-paywall-ignore-toggler {
    background: var(--rinsp-active-toggler-bg-color);
    outline: 3px solid #FF40AC;
    opacity: 1.0;
}

.rinsp-paywall-peek-mode .rinsp-paywall-ignore-toggler:after {
    color: var(--rinsp-active-toggler-fg-color);
}

/* == visited thread toggler == */
.rinsp-visited-thread-toggler:hover,
.rinsp-visited-thread-mask-mode .rinsp-visited-thread-toggler:hover {
    outline: 5px solid #AE54AE;
}
.rinsp-visited-thread-toggler > .rinsp-excontrol-item-count {
    color: #AE54AE;
}
.rinsp-visited-thread-toggler:after {
    content: '\\a已\\a读';
}
.rinsp-visited-thread-mask-mode .rinsp-visited-thread-toggler {
    background: var(--rinsp-active-toggler-bg-color);
    outline: 3px solid #AE54AE;
    opacity: 0.7;
}

.rinsp-visited-thread-mask-mode .rinsp-visited-thread-toggler:after {
    color: var(--rinsp-active-toggler-fg-color);
}

/* == closed thread toggler == */
.rinsp-closed-thread-toggler:hover,
.rinsp-closed-thread-view-mode .rinsp-closed-thread-toggler:hover {
    outline: 5px solid #AAA;
}
.rinsp-closed-thread-toggler > .rinsp-excontrol-item-count {
    color: #AAA;
}
.rinsp-closed-thread-toggler:after {
    content: '\\a已\\a关\\a闭';
}
.rinsp-closed-thread-view-mode .rinsp-closed-thread-toggler {
    background: var(--rinsp-active-toggler-bg-color);
    outline: 3px solid #999;
    color: #999;
    opacity: 0.8;
}

.rinsp-closed-thread-view-mode .rinsp-closed-thread-toggler:after {
    color: var(--rinsp-active-toggler-fg-color);
}

/* == floating notitication == */

.rinsp-notification-item {
    background: #FFFE;
    padding: 1px 3px;
    box-shadow: 2px 2px 1px 0 #9d9d9d;
    white-space: pre;
    text-align: center;
    font-weight: bold;
    animation-name: rinsp-watch-new-anim;
    animation-duration: 1s;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    font-size: 14px;
    line-height: 20px;
    flex: 0;
    margin: 0.5em 0;
    cursor: pointer;
    display: none;
}
.rinsp-notification-item.rinsp-notification-item-type-pm {
    background-color: #e1feff;
    color: #354e6f;
    outline-color: #06c3cc !important;
}
.rinsp-notification-item:hover {
    animation: none;
    outline: 5px solid #f9c23c;
    text-decoration: none;
}
.rinsp-notification-item.rinsp-status-new,
.rinsp-notification-item.rinsp-status-error {
    display: block;
}
.rinsp-notification-item.rinsp-status-error {
    color: #b91a1a;
    outline-color: #b91a1a !important;
}
#user-login .rinsp-watch-menuitem {
    color: white;
    padding: 1px 3px;
    display: inline-block;
}
.rinsp-watchemnu-autohide .rinsp-watch-menuitem:not(.rinsp-status-enabled) {
    display: none !important;
}
.rinsp-watch-menuitem.rinsp-status-new {
    color: black;
    font-weight: bold;
    animation-name: rinsp-watch-new-anim;
    animation-duration: 1s;
    animation-direction: alternate;
    animation-iteration-count: infinite;
}
.rinsp-watch-menuitem.rinsp-status-new:not(.rinsp-checking)::before {
    content: attr(data-new-count) " ";
    color: #000;
    display: inline-block;
    font-family: monospace;
    font-size: 12px;
    font-weight: bold;
    border-radius: 16px;
    background: #f9c23c;
    padding: 0 0.3em;
    text-align: center;
    min-width: 8px;
    margin-right: 0.2em;
    text-shadow: 0px 0px 1px white, 0px 0px 2px white, 0px 0px 3px white, 0px 0px 4px white;
}
.rinsp-watch-menuitem.rinsp-checking {
    font-weight: normal;
}
.rinsp-watch-menuitem.rinsp-checking.rinsp-status-new {
    outline: 3px solid #f9c23c;
}

#rinsp-watcher-menu .rinsp-checking .rinsp-status-cell::before,
.rinsp-watch-menuitem.rinsp-checking::before {
    content: "⌛";
    color: white;
    display: inline-block;
    animation-name: rinsp-watch-checking-rotate-anim;
    animation-duration: 2s;
    animation-iteration-count: infinite;
}
.rinsp-reply-self > .rinsp-lastreply-floor {
    color: var(--rinsp-text-color-violet);
}
.readbot li.rinsp-running::after {
    content: "工作中";
    color: var(--rinsp-text-color-orange);
    font-weight: bold;
}

.rinsp-watch-menuitem.rinsp-status-error::after {
    content: "⚠️";
}
.rinsp-bounty-ended {
    color: var(--rinsp-text-color-red) !important;
    font-weight: bold;
}
.rinsp-bounty-answered {
    color: var(--rinsp-text-color-green) !important;
    font-weight: bold;
}
@keyframes rinsp-watch-new-anim {
    50% {
        outline: none;
    }
    51% {
        outline: 3px solid #f9c23c;
    }
    100% {
        outline: 3px solid #f9c23c;
    }
}
@keyframes rinsp-watch-checking-rotate-anim {
    0% {
        transform: rotate(0deg);
    }
    5% {
        transform: rotate(0deg);
    }
    45% {
        transform: rotate(180deg);
    }
    55% {
        transform: rotate(180deg);
    }
    95% {
        transform: rotate(360deg);
    }
    100% {
        transform: rotate(360deg);
    }
}


/* ====== sell-frame ====== */
h6.jumbotron .btn-danger {
    margin-left: 0.5em;
}
.jumbotron.rinsp-sell-free .s3 {
    color: #999;
}
.jumbotron .btn-danger {
    line-height: 16px !important;
}

.jumbotron.rinsp-sell-free .btn-danger {
    background: #516ba0;
}

.jumbotron.rinsp-sell-5 .btn-danger {
    background: #937210;
}
.jumbotron.rinsp-sell-100 .s3 {
    color: #DD0000;
}
.jumbotron.rinsp-sell-high .s3 {
    color: #DD0000;
    font-size: 1.2em;
    background: #fff9c7;
    outline: 2px solid #fff9c7;
}
.jumbotron.rinsp-sell-high .btn-danger {
    background: #DD0000;
}
.jumbotron.rinsp-sell-99999 .btn-danger {
    opacity: 0.2;
    pointer-events: none;
    background: #999;
}
.rinsp-sell-relay-button + .spp-buy-refresh-free,
.rinsp-sell-enhanced {
    max-width: 0;
    max-height: 0;
    padding: 0 !important;
    overflow: hidden;
    z-index: -1;
    visibility: hidden;
    position: absolute;
    pointer-events: none;
}
.rinsp-sell-buying {
    opacity: 0.5;
    pointer-events: none;
    cursor: wait;
}

.rinsp-att-enhanced.rinsp-att-sell > a:before {
    content: "「售价 " attr(data-price) "SP」";
    color: #000;
    font-weight: bold;
    font-size: 13px;
}
.rinsp-att-enhanced.rinsp-att-sell-high > a:before {
    content: "「售价 " attr(data-price) "SP - 高额出售 欢迎举报」";
    color: #DD0000;
    font-weight: bold;
    font-size: 14px;
}
.rinsp-att-enhanced.rinsp-att-sell > a {
    cursor: default;
}

.rinsp-buy-failed {
    background-color: #fffdcf;
    border-color: black;
    color: red;
    font-weight: bold;
}

/* ====== user display ====== */
th.r_two > .user-pic > table {
    position: relative;
    z-index: 2;
}
.rinsp-userframe-userinfo {
    margin-top: -50px;
    padding: 50px 9px 3px 9px;
    background: linear-gradient(to bottom, transparent 0%, #F7F7F7 100%);
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
    margin-left: -5px;
    max-width: 185px;
    box-sizing: border-box;
}
.rinsp-userframe-userinfo > dl {
    display: inline-flex;
    align-items: center;
    margin: 0;
}
.rinsp-userframe-userinfo > .rinsp-userframe-udata-spacer {
    margin: 0;
    flex-basis: 100%;
}
.rinsp-userframe-userinfo > dl > dt {
    color: var(--rinsp-text-color-blue);
    word-break: keep-all;
    margin: 0;
}
.rinsp-userframe-userinfo > dl > dd {
    padding-left: 0.5em;
    flex: 1;
    margin: 0;
}
.rinsp-userframe-udata-sp {
    flex-grow: 1;
}
.rinsp-userframe-udata-login {
    flex-grow: 1;
    text-align: right;
    font-size: 0.9em;
    color: #888;
}

.rinsp-userframe-udata-login-today {
    color: var(--rinsp-text-color-green);
}
.rinsp-userframe-udata-login-yesterday {
    color: var(--rinsp-text-color-violet);
}
.rinsp-userframe-udata-hp {
    color: #DD0000;
    font-weight: bold;
    margin-left: 6px;
    display: inline-block;
}
.rinsp-userframe-udata-online > dt {
    display: none;
}
.rinsp-userframe-udata-online > dd {
    color: #666;
}
.r_two.rinsp-userframe-unnamed > .rinsp-userframe-userinfo + div > a {
    color: #555;
}

/* ===== user popup action items ===== */
.rinsp-user-popup-action-mailto > a > div {
    width: 16px;
    height: 16px;
    background: url(/images/colorImagination/mail-icon.gif);
    background-repeat: no-repeat;
    background-position: 1px 3px;
}
.rinsp-user-popup-action-topics > a > div {
    width: 16px;
    height: 16px;
    background: url(data:image/gif;base64,R0lGODlhEAAQAOZCAP///1iHuOfu9VqIueny/p241f3+/ouszvP3+rTJ387c6tfo/XCYwuvx94mqzZOx0dvq/WyVwKnB2uDt/uLu/vf5/Pv8/d7s/tDj/dDk/Xugx+Hu/tzm8H2iyNPm/dXm/V+Mu1yKul2Lutzr/drk72+Xwtnp/dzq/ebx/ujx/t3s/tHk/eXw/tHk/PD2/nWcxO/z+L7Q47XK4NTm/ePv/unv9pm21Nbn/aO92G6XwYWny+Tv/trp/d/s/t3r/q3E3Obw/vn7/P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEIALAAAAAAQABAAAAeAgEKCg4SFhoeIiYUIDyEBj5ABOgKEBxIWAJmaAAkMFoIVAwYuBCg7GxcQJwAaHIINEQApQDQTKhALHwAOCq+xLBQTPjwLMyu7vUKhBgQ9IyY3HhktAB0kg5YGmhQYBJwMQYOMA48FmTAFL5SIJQIFIj+KODYgMopCNTkx9/z9hIEAOw==);
}
.rinsp-user-action-pinuser-icon,
.rinsp-user-popup-action-pinuser > a > div {
    width: 16px;
    height: 16px;
    background: var(--rinsp-pin-icon);
}
.rinsp-user-action-pinuser-icon {
    display: inline-block;
}
.rinsp-user-popup-action-list > li:hover > a > div {
    outline: 1px solid #DDD;
    outline-offset: 1px;
    box-shadow: 2px 1px 3px #DDD;
}


/* ===== user names ===== */
span.rinsp-nickname-byother {
    color: #4a4a4a;
    font-weight: bold;
}
span.rinsp-nickname-byowner {
    color: #160;
    font-weight: bold;
}
span.rinsp-nickname-byme {
    color: #c60e87;
    font-weight: bold;
}
.rinsp-nickname-bypinned {
    color: var(--rinsp-darkest-text-color);
    font-weight: bold;
}
.rinsp-nickname-bypinned:before {
    content: "";
    display: inline-block;
    width: 16px;
    height: 16px;
    background: var(--rinsp-pin-icon);
}
a.rinsp-owner-isme {
    color: #c60e87;
    font-weight: bold;
}
a.rinsp-owner-isknown {
    font-weight: bold;
}
.rinsp-byop-noreply-hide-mode td:not(:hover) > .rinsp-nickname-byop-only {
    visibility: hidden;
}

/* ====== config ====== */
.rinsp-config-panel.rinsp-config-saving {
    cursor: wait;
}
.rinsp-config-panel.rinsp-config-saving .rinsp-config-list {
    opacity: 0.5;
    pointer-events: none;
}
.rinsp-config-list {
    margin: 0 5px;
}
.rinsp-config-list > dt {
    margin-top: 5px;
}
.rinsp-config-list > dt > a {
    margin-left: 3px;
    color: #0060df;
    cursor: pointer;
}
.rinsp-config-list > dt > a:hover {
    text-decoration: underline;
}
.rinsp-config-item-sep {
    margin-top: 0.5em;
    padding-top: 0.5em;
    border-top: 1px dotted #AAA;
}
.rinsp-config-item-tip {
    color: #105884;
    padding-left: 4px;
}
.rinsp-config-item-lv1 > span {
    margin-left: 3px;
}
.rinsp-config-item-lv2 {
    margin-left: 20px;
}
.rinsp-config-item-lv3 {
    margin-left: 40px;
}
.rinsp-config-item-lv1:not(.rinsp-config-item-checked) + .rinsp-config-item-lv2:not(.rinsp-config-item-tip),
.rinsp-config-item-lv1:not(.rinsp-config-item-checked) + .rinsp-config-item-lv2 + .rinsp-config-item-lv2:not(.rinsp-config-item-tip),
.rinsp-config-item-lv1:not(.rinsp-config-item-checked) + .rinsp-config-item-lv2 + .rinsp-config-item-lv2 + .rinsp-config-item-lv2:not(.rinsp-config-item-tip) {
    opacity: 0.2;
    pointer-events: none;
}
.rinsp-config-item-lv2:not(.rinsp-config-item-checked) + .rinsp-config-item-lv3:not(.rinsp-config-item-tip),
.rinsp-config-item-lv2:not(.rinsp-config-item-checked) + .rinsp-config-item-lv3 + .rinsp-config-item-lv3:not(.rinsp-config-item-tip),
.rinsp-config-item-lv2:not(.rinsp-config-item-checked) + .rinsp-config-item-lv3 + .rinsp-config-item-lv3 + .rinsp-config-item-lv3:not(.rinsp-config-item-tip) {
    opacity: 0.2;
    pointer-events: none;
}
.rinsp-user-map-icon {
    margin-left: 5px;
    cursor: pointer;
}
.rinsp-user-map-icon.rinsp-config-saving {
    opacity: 0.5;
    pointer-events: none;
}

.rinsp-user-map-icon::after {
    content: "➕收藏";
    font-weight: normal;
    font-size: 12px;
}
.rinsp-user-map-icon.rinsp-user-mapped::after {
    content: "🔖 " attr(rinsp-nickname);
    font-weight: normal;
    font-size: 12px;
    color: #c30a0a;
}
.rinsp-user-tag {
    margin-right: 6px;
    white-space: nowrap;
    min-width: 9em;
    display: inline-block;
    max-width: 9em;
    overflow: hidden;
    text-overflow: ellipsis;
}
.rinsp-user-tag-icon::before {
    content: "🔖 ";
    font-size: 14px;
    display: inline-block;
    cursor: pointer;
}
.rinsp-user-blacklist .rinsp-user-tag-icon::before {
    content: "🚫 ";
}

/* ====== search ====== */
.rinsp-fav-search-area-all {
    font-weight: bold;
    color: blue;
    background: aliceblue;
}
.rinsp-fav-search-area-group {
    color: darkred;
}
.rinsp-temp-disabled {
    pointer-events: none;
}
.rinsp-fav-search-area-pin {
    cursor: pointer;
}
.rinsp-fav-search-setdefault-range {
    cursor: pointer;
}
.rinsp-search-keyword-input {
    width: 100%;
}
.rinsp-fav-search-setdefault-mode {
    cursor: pointer;
    color: #635994;
    float: right;
}


/* ====== fix broken image display ====== */
th.r_two > .user-pic > table > tbody > tr > td {
    max-width: 175px;
    overflow: hidden;
    text-overflow: ellipsis;
}
th.r_two > .user-pic img {
    font-size: 9px;
    line-height: 16px;
    white-space: nowrap;
}


/* ====== compact mode ====== */
.rinsp-compact-mode th.r_two > .user-pic {
    margin-top: -6px;
}
.rinsp-compact-mode th.r_two > .user-pic img {
    max-width: 150px;
    max-height: 150px;
    object-fit: cover;
    object-position: top;
}
.rinsp-compact-mode th.r_two > .user-pic > table:hover img {
    transition: max-height 0.3s ease-out;
    transition-delay: 0.7s;
    max-height: 270px;
}
th.r_two > .user-pic {
    position: relative;
}
.rinsp-compact-mode .rinsp-post-userpic-tall .rinsp-userframe-pulldown:after {
    content: "";
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAANCAYAAACtpZ5jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMi1jMDAwIDc5LjU2NmViYzViNCwgMjAyMi8wNS8wOS0wODoyNTo1NSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjZEQTE2QTZENzJDOTExRURCMUZDQTc0M0NBRkM3OUY0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjZEQTE2QTZFNzJDOTExRURCMUZDQTc0M0NBRkM3OUY0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NkRBMTZBNkI3MkM5MTFFREIxRkNBNzQzQ0FGQzc5RjQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NkRBMTZBNkM3MkM5MTFFREIxRkNBNzQzQ0FGQzc5RjQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6KmXcOAAABXElEQVR42rTUzSsEcRzHcTutcvIHKHHmJO2FJCkPB5GaiMJFcfEQUeIiSdRykAOxDuugkZI2iaKUQnKQkvJQ5ODCwUkx3r98pjZNQ7S/erX1nf195vt72A25rpuWihF2HMficwY5aMPzP/Ia0WnbdqmlwhkiuEDLHwIzsYKo15gJ/kAMWVjFBHaR+8vQZlyiDK2o84KTRy9q9JJD9AUEZmMbU1jTnB3voSXLuNV2nCIPswo221TwLbQHRwo3HXapblZ77wWbazGPK2xgWl8aRxFekcAgCnGCAcypgWPVz3U+C8nBZtmVmtCAR1ThDiUYQTc28abamBqIqv6kRkb99jiuLvaxpJPOwKIm9aMY16jAg67YEMrVyNc99jmUFzShWoE3WklcE9P1UhN0gA6/ux8OOPUtHY5Z6iRqsYdhPW/X3vsO64c7+q69rUe+Qtf1K00ETQyl6r/iU4ABAH2/U1xZevwpAAAAAElFTkSuQmCC);
    height: 13px;
    background-repeat: no-repeat;
    background-position: center center;
    display: block;
    width: 100%;
    opacity: 0.5;
    max-height: 13px;
    overflow: hidden;
}
.rinsp-compact-mode .rinsp-post-userpic-tall .user-pic > table:hover + .rinsp-userframe-pulldown:after {
    transition: all 0.2s ease-out;
    transition-delay: 0.7s;
    opacity: 0;
    max-height: 0;
}
.rinsp-compact-mode.rinsp-compact-mode-smaller th.r_two > .user-pic img {
    max-width: 120px;
    max-height: 120px;
}
.rinsp-compact-mode.rinsp-compact-mode-smaller th.r_two > .user-pic > table:hover img {
    transition: max-height 0.3s ease-out;
    transition-delay: 0.7s;
    max-width: 150px;
    max-height: 270px;
}
.rinsp-compact-mode th[id^="td_"] > .tiptop {
    margin-bottom: 1em;
}
.rinsp-compact-mode th[id] > .tpc_content {
    padding-bottom: 0.5em;
}
.rinsp-compact-mode .tr1.r_one > th > .tpc_content {
    padding-bottom: 0;
}
.rinsp-compact-mode .tr1.r_one > th > .tipad {
    margin-top: 1em;
}
.rinsp-filter-default-ignorable .user-pic ~ div[align="center"],
.rinsp-compact-mode th.r_two > .user-pic ~ div[align="center"] {
    position: relative;
    max-height: 3em;
    margin-top: -1em;
}
.rinsp-compact-mode .rinsp-userframe-userinfo {
    padding-top: 0.2em;
    margin-top: 0.1em;
    background: #FFFD;
    padding-bottom: 0em;
}

/* ====== ignore marks ====== */
.rinsp-textlist-description {
    margin: 9px 9px 0 9px;
    text-align: left;
    white-space: pre-wrap;
}
.rinsp-textlist-editor {
    width: calc(100% - 28px);
    margin: 9px;
    height: 50vh;
    max-height: 80vh;
}
.rinsp-textlist-popup-table.rinsp-config-saving {
    cursor: wait;
    opacity: 0.5;
    pointer-events: none;
}
.rinsp-post:not(:hover) .tiptop .rinsp-ignore-switch {
    visibility: hidden;
}
.tiptop .rinsp-ignore-switch:after {
    content: " | ";
}
.readbot li.rinsp-ignore-switch {
    width: 6em;
}
.rinsp-filter-ignored-bykeyword .rinsp-ignore-switch > a {
    opacity: 1;
    color: red;
}
.rinsp-filter-ignored .rinsp-ignore-switch > a:before {
    content: "🚫";
    opacity: 1;
}

.rinsp-ignore-switch.rinsp-config-saving {
    opacity: 0.5;
    pointer-events: none;AAAA
}

.rinsp-filter-ignored th.r_two,
.rinsp-filter-ignored .tpc_content {
    opacity: 0.3;
}
.rinsp-filter-ignored:not(.rinsp-filter-bypass) .tiptop > .fr,
.rinsp-filter-ignored:not(.rinsp-filter-bypass) .tr1.r_one {
    visibility: hidden;
}
.rinsp-filter-ignored:hover th.r_two,
.rinsp-filter-ignored:hover .tpc_content {
    opacity: 0.9;
}
.rinsp-filter-ignored:not(.rinsp-filter-bypass):hover .tiptop > .fr,
.rinsp-filter-ignored:not(.rinsp-filter-bypass):hover .tr1.r_one {
    visibility: visible;
}
.rinsp-filter-ignored .tipad .c + .fr.gray {
    visibility: visible;
}

body:not(.rinsp-filter-peek-mode) .rinsp-filter-ignored:not(.rinsp-filter-bypass) .r_one > .tiptop {
    height: 20px;
    line-height: 20px;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    border-bottom: none !important;
}
.rinsp-filter-ignored-range-end-summary {
    display: none;
}
body:not(.rinsp-filter-peek-mode) .rinsp-filter-ignored:not(.rinsp-filter-bypass) .r_one > .tiptop .rinsp-filter-ignored-range-end-summary {
    display: inline;
}
body:not(.rinsp-filter-peek-mode) .rinsp-filter-ignored:not(.rinsp-filter-bypass) .r_two:after {
    content: "屏蔽内容";
    display: block;
    font-size: 0.9em;
    text-align: center;
    padding-top: 3px;
}
body:not(.rinsp-filter-peek-mode) .rinsp-filter-ignored:not(.rinsp-filter-bypass) .r_two[rinsp-filter-group-size]:after {
    content: "屏蔽内容 ✕ " attr(rinsp-filter-group-size);
    color: var(--rinsp-darkest-text-color);
    font-size: 1.1em;
}

body:not(.rinsp-filter-peek-mode) .t2.t5[rinsp-filter-ignored-cont="1"],
body:not(.rinsp-filter-peek-mode).rinsp-filter-hide-mode .rinsp-filter-ignored:not(.rinsp-filter-bypass) {
    display: none;
}

body:not(.rinsp-filter-peek-mode) .rinsp-filter-ignored:not(.rinsp-filter-bypass) .r_two > .user-pic,
body:not(.rinsp-filter-peek-mode) .rinsp-filter-ignored:not(.rinsp-filter-bypass) .r_two > .user-pic ~ *,
body:not(.rinsp-filter-peek-mode) .rinsp-filter-ignored:not(.rinsp-filter-bypass) .r_one > .tiptop ~ *,
body:not(.rinsp-filter-peek-mode) .rinsp-filter-ignored:not(.rinsp-filter-bypass) .r_one > .tiptop > .fr,
body:not(.rinsp-filter-peek-mode) .rinsp-filter-ignored:not(.rinsp-filter-bypass) .r_one > .tiptop > .fl.bianji,
body:not(.rinsp-filter-peek-mode) .rinsp-filter-ignored:not(.rinsp-filter-bypass) tr.tr1.r_one {
    display: none !important;
}

.rinsp-dialog-modal-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #FFF8;
    z-index: 100;
}

input.rinsp-input-max-exceeded,
textarea.rinsp-input-max-exceeded {
    outline: 2px solid red !important;
}
.rinsp-input-max-hint {
    font-size: 10px;
    margin-left: 0.5em;
    background: #f5fafc;
    color: #255d99;
    padding: 1px 3px;
    display: inline-block;
}
textarea + .rinsp-input-max-hint {
    transform: translateY(-100%);
    margin-bottom: -20px;
    position: relative;
    top: -5px;
}
input[name="atc_title"] + .rinsp-input-max-hint {
    position: absolute;
}
.rinsp-input-max-hint.rinsp-input-max-exceeded {
    font-size: 11px;
    background: #fff;
    color: #c41212;
    font-weight: bold;
}

/* ====== thread list ====== */

.rinsp-thread-paywall {
    background: #f4f4f4;
}
.rinsp-thread-paywall > td > a[href^="thread.php?fid-"]:after {
    content: " (网赚)";
    color: #ff219e;
}
body:not(.rinsp-paywall-peek-mode) .rinsp-thread-paywall {
    display: none;
}
.rinsp-thread-filter-like-words,
.rinsp-thread-filter-dislike-words {
    display: inline-block;
    white-space: nowrap;
    cursor: pointer;
}
#subject_tpc .rinsp-thread-filter-like-words,
#subject_tpc .rinsp-thread-filter-dislike-words,
#subject_tpc .rinsp-thread-filter-menu-button {
    font-size: 12px;
    font-weight: normal;
}

.rinsp-thread-filter-like-words {
    color: var(--rinsp-text-color-green);
}
.rinsp-thread-filter-like-bytid .rinsp-thread-filter-like-words {
    font-weight: bold;
    font-size: 13px;
}
.rinsp-thread-filter-dislike-words {
    color: red;
}
.rinsp-thread-filter-like-words:hover,
.rinsp-thread-filter-dislike-words:hover {
    color: #666;
    text-decoration: underline;
}
.rinsp-dislike-thread-ignore-toggler:hover,
.rinsp-dislike-thread-peek-mode .rinsp-dislike-thread-ignore-toggler:hover {
    outline: 5px solid #ff9e36;
}
.rinsp-dislike-thread-ignore-toggler > .rinsp-excontrol-item-count {
    color: #ff9e36;
}
.rinsp-dislike-thread-ignore-toggler:after {
    content: '\\a屏\\a蔽\\a帖\\a子';
}
.rinsp-dislike-thread-peek-mode .rinsp-dislike-thread-ignore-toggler {
    background: var(--rinsp-active-toggler-bg-color);
    outline: 3px solid #ff9e36;
    opacity: 1.0;
}

.rinsp-dislike-thread-peek-mode .rinsp-dislike-thread-ignore-toggler:after {
    content: '\\a屏\\a蔽\\a帖\\a子';
    color: var(--rinsp-active-toggler-fg-color);
}
body.rinsp-dislike-thread-peek-mode .rinsp-thread-filter-masked-bysharetype,
body.rinsp-dislike-thread-peek-mode .rinsp-thread-filter-dislike {
    opacity: 0.3;
    background: #eee;
    transition: none;
}
body.rinsp-threadfilter-hide-mode:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-dislike {
    display: none;
}
body.rinsp-dislike-thread-peek-mode .rinsp-thread-filter-masked-bysharetype:hover,
.rinsp-thread-filter-dislike.rinsp-thread-filter-bypass:hover,
body.rinsp-dislike-thread-peek-mode .rinsp-thread-filter-dislike:hover {
    opacity: 1.0;
    transition: 0.1s opacity ease-in;
}
.rinsp-thread-filter-menu-button {
    opacity: 0.5;
    display: inline-block;
    margin-left: 0.5em;
    white-space: nowrap;
    transition-delay: 0s;
    transition: none;
    cursor: default;
}
.rinsp-thread-filter-unhideop-button {
    margin-left: 0.25em;
    display: inline-block;
    cursor: default;
}
#wall .section-intro .rinsp-thread-filter-hideop-button {
    position: absolute;
    left: 0;
    background: white;
    padding: 10px 7px 0 7px;
    height: 100%;
    top: 0;
    box-sizing: border-box;
}
.rinsp-thread-filter-dislike-byuid .rinsp-uid-inspected {
    color: red;
}
.rinsp-thread-filter-dislike-byuid .rinsp-thread-filter-hideop-button {
    display: none;
}
.rinsp-alert-menu-button,
.rinsp-thread-filter-hideop-button,
.rinsp-thread-filter-dislike-button {
    color: var(--rinsp-text-color-red) !important;
}
.rinsp-thread-filter-like-button {
    color: var(--rinsp-text-color-green) !important;
}
.rinsp-thread-filter-liketid-button {
    color: var(--rinsp-text-color-blue) !important;
}
.rinsp-alert-menu-message {
    background: #FFD164;
    font-size: 16px;
    font-weight: bold;
}
.rinsp-thread-filter-menu-button {
    transform: translateY(1px);
    float: right;
}
h1#subject_tpc {
    margin-right: 12px;
}
#subject_tpc > .rinsp-thread-filter-menu-button {
    transform: translateY(4px);
}
.rinsp-thread-filter-menu-button:hover {
    opacity: 1;
}
.rinsp-thread-filter-menu-button:after {
    content: "";
    display: inline-block;
    width: 14px;
    height: 14px;
    background-repeat: no-repeat;
    /* svg is used to avoid the button text to be copied as part of the content */
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 14 14' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3Etext %7B font: 14px sans-serif; fill: %23666;%0A%7D%3C/style%3E%3Ctext x='3' y='11'%3E≡%3C/text%3E%3C/svg%3E");
}
.rinsp-thread-filter-menu-button:hover:after {
    outline: 1px solid #4e7597;
}
.rinsp-thread-selected > td[id] {
    outline: 3px solid #4e7597;
}
.rinsp-thread-filter-like .rinsp-thread-filter-like-button {
    display: none;
}

/* dislike wins over like, so hide like button if filtered out by dislike */

.rinsp-thread-filter-like:not(.rinsp-thread-filter-dislike) {
    background: linear-gradient(to right, var(--rinsp-text-color-green) 2px, #faffe9 3px, transparent 100%);
}
.rinsp-thread-filter-like:not(.rinsp-thread-filter-dislike):hover {
    background: linear-gradient(to right, var(--rinsp-text-color-green) 2px, #f2ffd6 3px, transparent 100%);
}

body:not(.rinsp-dislike-thread-peek-mode) .rinsp-thread-filter-masked-bysharetype,
body:not(.rinsp-dislike-thread-peek-mode) .rinsp-thread-filter-dislike {
    opacity: 0.5;
}
.t5.t2 > .rinsp-thread-filter-masked-bysharetype:hover,
.t5.t2 > .rinsp-thread-filter-dislike:hover {
    opacity: 1.0;
}

body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-masked-bysharetype > th,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-masked-bysharetype > td,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-dislike:not(.rinsp-thread-filter-bypass) > th,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-dislike:not(.rinsp-thread-filter-bypass) > td {
    padding: 0;
    height: 7px;
    background: var(--rinsp-blocked-row-bg);
    line-height: 1px !important;
    overflow: hidden;
    color: transparent;
}
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-masked-bysharetype > th,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-masked-bysharetype > td,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-dislike:not(.rinsp-thread-filter-bypass) > th,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-dislike:not(.rinsp-thread-filter-bypass) > td {
    font-size: 0;
}
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-masked-bysharetype-collapse,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-masked-bysharetype > th > *,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-masked-bysharetype > td > *,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-dislike:not(.rinsp-thread-filter-bypass) > th > *,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-dislike:not(.rinsp-thread-filter-bypass) > td > * {
    display: none;
}
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .tr3.tac.rinsp-thread-filter-dislike:not(.rinsp-thread-filter-bypass) > th.y-style:after,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-dislike:not(.rinsp-thread-filter-bypass) > td[id^="td_"]:after {
    font-size: 11px;
    color: var(--rinsp-blocked-row-label-color);
    display: inline-block;
    line-height: normal;
    padding: 1px 0 1px 7px;
}
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .tr3.tac.rinsp-thread-filter-dislike-bytitle:not(.rinsp-thread-filter-bypass) > th.y-style:after,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-dislike-bytitle:not(.rinsp-thread-filter-bypass) > td[id^="td_"]:after {
    content: "主题已屏蔽";
}

body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .tr3.tac.rinsp-thread-filter-dislike-byuid:not(.rinsp-thread-filter-bypass) > th.y-style:after,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-dislike-byuid:not(.rinsp-thread-filter-bypass) > td[id^="td_"]:after {
    content: "楼主已屏蔽";
}
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .tr3.tac.rinsp-thread-filter-masked-bysharetype:not(.rinsp-dummy) > th.y-style:after,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-masked-bysharetype:not(.rinsp-dummy) > td[id^="td_"]:after {
    content: "不合适网盘";
    font-size: 11px;
    color: var(--rinsp-blocked-row-label-color);
    display: inline-block;
    line-height: normal;
    padding: 1px 0 1px 7px;
}
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .tr3.tac.rinsp-thread-filter-masked-bysharetype:not(.rinsp-dummy) > th.y-style[rinsp-sharetype-chain]:after,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) .rinsp-thread-filter-masked-bysharetype:not(.rinsp-dummy) > td[id^="td_"][rinsp-sharetype-chain]:after {
    content: "不合适网盘 ✕ " attr(rinsp-sharetype-chain);
}

/* image wall mode */
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) #wall .rinsp-thread-filter-masked-bysharetype,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) #wall .rinsp-thread-filter-dislike:not(.rinsp-thread-filter-bypass) {
    box-shadow: none;
}
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) #wall .rinsp-thread-filter-masked-bysharetype > .inner,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) #wall .rinsp-thread-filter-dislike:not(.rinsp-thread-filter-bypass) > .inner {
    display: none;
}
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) #wall .rinsp-thread-filter-masked-bysharetype:before,
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) #wall .rinsp-thread-filter-dislike:not(.rinsp-thread-filter-bypass):before {
    font-size: 11px;
    color: var(--rinsp-blocked-row-label-color);
    display: block;
    text-align: center;
    line-height: normal;
    width: 1em;
}
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) #wall .rinsp-thread-filter-dislike-bytitle:not(.rinsp-thread-filter-bypass):before {
    content: "主题已屏蔽";
}
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) #wall .rinsp-thread-filter-dislike-byuid:not(.rinsp-thread-filter-bypass):before {
    content: "楼主已屏蔽";
}
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) #wall .rinsp-thread-filter-masked-bysharetype:not(.rinsp-dummy):before {
    content: "不合适网盘";
}
body:not(.rinsp-dislike-thread-peek-mode):not(.rinsp-highlight-unscored-thread-mode) #wall .rinsp-thread-filter-masked-bysharetype:not(.rinsp-dummy)[rinsp-sharetype-chain]:before {
    content: "不合适网盘 ✕ " attr(rinsp-sharetype-chain);
}

#wall .rinsp-thread-filter-like:not(.rinsp-thread-filter-dislike) {
    background: none;
    box-shadow: 0 0 2px 1px #5bbd37;
}
#wall .rinsp-thread-filter-like:not(.rinsp-thread-filter-dislike) .section-intro {
    background-color: #1d8232 !important;
}



.rinsp-nickname-list:empty:after,
.rinsp-user-blacklist:empty:after {
    content: "列表为空";
    color: #999;
    margin-left: 1em;
}

.dropdown-content.menu .rinsp-filter-block-menu-sep {
    border-top: 1px dotted #CCC;
    display: block;
}
.dropdown-content.menu a.rinsp-filter-block-menu-item {
    white-space: nowrap;
}
.dropdown > a.rinsp-filter-block-menu-item-active {
    color: var(--rinsp-text-color-red);
}
.dropdown-content.menu a.rinsp-filter-block-menu-item-active {
    padding-left: 0;
    color: var(--rinsp-text-color-red);
}
.dropdown-content.menu > .apeacemaker[data-active="true"] {
    color: var(--rinsp-text-color-red);
}

.rinsp-userpic-replace .user-pic:not(:hover) > table a > img {
    display: none;
}

.rinsp-userpic-replace .user-pic:not(:hover) a[href^="u.php?action-show-uid-"]::before {
    color: var(--rinsp-avatar-replace-default-text-color);
    text-align: center;
    display: block;
    white-space: nowrap;
    padding-right: 0.9em;
    box-sizing: border-box;
    line-height: 150px;
    width: 158px;
    height: 158px;
    border: 5px solid var(--rinsp-avatar-replace-default-border-color);
    background: var(--rinsp-avatar-replace-default-bg);
}

.rinsp-compact-mode.rinsp-compact-mode-smaller  .rinsp-userpic-replace .user-pic:not(:hover) a[href^="u.php?action-show-uid-"]::before {
    line-height: 120px;
    width: 128px;
    height: 128px;
    font-size: 0.9em;
}
.rinsp-userpic-replace-default .user-pic:not(:hover) td > a[href^="u.php?action-show-uid-"]::before {
    content: "👤\\FE0E默认头像";
}
.rinsp-userpic-replace-custom .user-pic:not(:hover) td > a[href^="u.php?action-show-uid-"]::before {
    content: "🎭\\FE0E屏蔽头像";
}

.rinsp-filter-default-ignorable .tiptop {
    margin: 0.25em 1em !important;
}

.rinsp-filter-default-ignorable:not(.rinsp-filter-ignored).rinsp-userpic-replace th.r_two {
    padding-top: 0.3em !important;
}

.rinsp-userframe-username {
    margin-top: -0.75em;
    margin-bottom: 1em;
}
.rinsp-userbookmark-takeover > a,
.rinsp-userframe-username > a > strong {
    display: inline-block;
    max-width: calc(100% - 48px);
}
.rinsp-userframe-userknown .rinsp-userbookmark > a {
    font-weight: bold;
}
.rinsp-userframe-userknown.rinsp-userframe-userrenamed .rinsp-userbookmark > a {
    color: #e81210;
}
.rinsp-userframe-userknown .rinsp-userbookmark-takeover + a {
    display: block;
}
.rinsp-userframe-userknown .rinsp-userframe-unnamed .rinsp-userbookmark + a {
    display: none;
}
.rinsp-userframe-username-sticky .rinsp-userbookmark > span:first-child:before,
.rinsp-userframe-username .rinsp-userbookmark > span:first-child:before {
    content: "➕";
    font-weight: normal;
    margin-left: -15px;
    margin-right: 2px;
    opactity: 0.8;
    visibility: hidden;
}
.rinsp-userframe-username-sticky .rinsp-userbookmark > span:first-child:hover:before,
.rinsp-userframe-username .rinsp-userbookmark > span:first-child:hover:before {
    opactity: 1;
}
.user-pic:hover + .rinsp-userframe-username .rinsp-userbookmark > span:first-child:before,
.rinsp-userpic-sticky:hover > .rinsp-userframe-username-sticky .rinsp-userbookmark > span:first-child:before,
.rinsp-userframe-username-sticky:hover .rinsp-userbookmark > span:first-child:before,
.rinsp-userframe-username:hover .rinsp-userbookmark > span:first-child:before {
    visibility: visible;
}
.rinsp-userframe-userknown .rinsp-userframe-username-sticky .rinsp-userbookmark > span:first-child:before,
.rinsp-userframe-userknown .rinsp-userframe-username .rinsp-userbookmark > span:first-child:before {
    content: "🔖";
    opactity: 1;
    visibility: visible;
}

/* ==== sticky user pic ==== */
th.r_two > .user-pic.rinsp-userpic-sticky {
    position: fixed;
    top: 0;
    width: 180px;
    z-index: 2;
    background-color: #EEEEEE;
}
th.r_two > .user-pic.rinsp-userpic-sticky .rinsp-userframe-username-sticky {
    display: block;
}

.rinsp-userframe-username-sticky {
    text-align: center;
    margin-left: -5px;
    padding-top: 2px;
    display: none;
}
.rinsp-user-pic-dummy {
    display: none;
}
.rinsp-userpic-sticky + .rinsp-user-pic-dummy {
    display: block;
}
.rinsp-userpic-sticky ~ .rinsp-userframe-username {
    opacity: 0;
}

/* ==== message selection ==== */
.rinsp-message-selection-panel {
    text-align: right;
    background: #F8F8F8;
    padding: 0.2em 1.4em;
    margin-top: -0.5em;
}
.rinsp-selection-sep,
.rinsp-selection-button {
    display: inline-block;
    margin-left: 1em;
    white-space: nowrap;
    cursor: default;
}
.rinsp-selection-button:hover {
    text-decoration: underline;
}

/* ==== announcement folding ==== */
.rinsp-top-announcement-row.rinsp-announcement-folded {
    background: linear-gradient(to bottom, white 0, #ddd 100%)
}
.rinsp-top-announcement-row.rinsp-announcement-folded h3 {
    display: none;
}
.rinsp-announcement-toggler {
    cursor: pointer;
    position: relative;
    top: 4px;
    margin-left: 2px;
}
.rinsp-announcement-row-folded {
    display: none;
}

/* ==== mentioning ==== */
.rinsp-thread-mention-me:not(.rinsp-request-thread-ended) {
    background: #ffeaf8 !important;
}
.rinsp-thread-mention-me:not(.rinsp-request-thread-ended) > td[id^="td_"] > h3 > a[id^="a_ajax_"] {
    color: #C60E87;
}
.rinsp-thread-mention-me:not(.rinsp-request-thread-ended) > td[id^="td_"] > h3 > a[id^="a_ajax_"]:before {
    content: "❤️";
    font-size: 12px;
    font-weight: bold;
    color: #C60E87;
    margin-right: 0.25em;
}

/* ==== request visibility toggler ==== */
.rinsp-answered-request-ignore-toggler:hover,
.rinsp-answered-request-hide-mode .rinsp-answered-request-ignore-toggler:hover {
    outline: 5px solid #3f9b15;
}
.rinsp-answered-request-ignore-toggler {
    background: #d2ddcdee;
    outline: 3px solid #407727;
    opacity: 1.0;
}
.rinsp-answered-request-ignore-toggler > .rinsp-excontrol-item-count {
    color: #3f9b15;
}
.rinsp-answered-request-ignore-toggler:after {
    content: '\\a有\\a答\\a案';
    color: var(--rinsp-active-toggler-fg-color);
}
.rinsp-answered-request-hide-mode .rinsp-answered-request-ignore-toggler {
    background: #333C;
    opacity: 0.75;
    outline: none;
    box-shadow: 2px 2px 1px 0 #0009;
}
.rinsp-answered-request-hide-mode .rinsp-answered-request-ignore-toggler:after {
    color: #999;
}
.rinsp-answered-request-hide-mode .rinsp-request-thread.rinsp-request-thread-ended:not(.rinsp-thread-byme):not(.rinsp-thread-mention-me) {
    display: none;
}


.rinsp-unanswered-request-ignore-toggler:hover,
.rinsp-unanswered-request-hide-mode .rinsp-unanswered-request-ignore-toggler:hover {
    outline: 5px solid #ce324f;
}
.rinsp-unanswered-request-ignore-toggler {
    background: #f0e8ebde;
    outline: 3px solid #ae3a50;
    opacity: 1.0;
}
.rinsp-unanswered-request-ignore-toggler > .rinsp-excontrol-item-count {
    color: #bd1d3b;
}
.rinsp-unanswered-request-ignore-toggler:after {
    content: '\\a悬\\a赏\\a中';
    color: var(--rinsp-active-toggler-fg-color);
}
.rinsp-unanswered-request-hide-mode .rinsp-unanswered-request-ignore-toggler {
    background: #333C;
    opacity: 0.75;
    outline: none;
    box-shadow: 2px 2px 1px 0 #0009;
}
.rinsp-unanswered-request-hide-mode .rinsp-unanswered-request-ignore-toggler:after {
    color: #999;
}
.rinsp-unanswered-request-hide-mode .rinsp-request-thread.rinsp-request-thread-ongoing:not(.rinsp-thread-byme):not(.rinsp-thread-mention-me) {
    display: none;
}


.rinsp-expired-request-ignore-toggler:hover,
.rinsp-expired-request-hide-mode .rinsp-expired-request-ignore-toggler:hover {
    outline: 5px solid #eee;
}
.rinsp-expired-request-ignore-toggler {
    background: #ccccccee;
    outline: 3px solid #828282;
    opacity: 1.0;
}
.rinsp-expired-request-ignore-toggler > .rinsp-excontrol-item-count {
    color: #5c5c5c;
}
.rinsp-expired-request-ignore-toggler:after {
    content: '\\a已\\a超\\a时';
    color: var(--rinsp-active-toggler-fg-color);
}
.rinsp-expired-request-hide-mode .rinsp-expired-request-ignore-toggler > .rinsp-excontrol-item-count {
    color: #aaa;
}
.rinsp-expired-request-hide-mode .rinsp-expired-request-ignore-toggler {
    background: #333C;
    opacity: 0.75;
    outline: none;
    box-shadow: 2px 2px 1px 0 #0009;
}
.rinsp-expired-request-hide-mode .rinsp-expired-request-ignore-toggler:after {
    color: #999;
}
.rinsp-expired-request-hide-mode .rinsp-request-thread.rinsp-request-thread-expired:not(.rinsp-thread-byme):not(.rinsp-thread-mention-me) {
    display: none;
}

/* ==== to top button ==== */
.rinsp-excontrol-totop {
    opacity: 100;
    transition: opacity 0.5s ease-in;
}
.rinsp-excontrol-totop::after {
    content: '▲\\a顶\\a部';
    font-size: 16px;
    line-height: 1.2em;
}
.rinsp-opacity-0 {
    opacity: 0 !important;
    transition: opacity 0.1s ease-in;
}

/* ==== closed threads ==== */
.rinsp-thread-filter-closed {
    background-color: #FEE;
}
.tr3.rinsp-thread-filter-closed:hover {
    background-color: #FEE;
}
.rinsp-thread-filter-closed > td[id^="td_"] {
    text-decoration: line-through;
    color: red;
}
.rinsp-closed-thread-mask-mode .rinsp-thread-filter-closed {
    display: none;
}

/* ==== visited threads ==== */
.rinsp-visited-thread-view-mode .rinsp-thread-visited:not(:hover) {
    opacity: 0.9;
}
.rinsp-visited-thread-view-mode.rinsp-uphp-post #u-contentmain .rinsp-thread-visited:not(:hover) th .gray,
.rinsp-visited-thread-view-mode.rinsp-uphp-topic #u-contentmain .rinsp-thread-visited:not(:hover) th .gray {
    opacity: 0.5;
}

.rinsp-visited-thread-view-mode .rinsp-thread-visited td[id^="td_"] h3 > a:not(:hover),
.rinsp-visited-thread-view-mode .rinsp-thread-visited th a[href^="read.php?tid-"]:not(:hover),
.rinsp-visited-thread-view-mode .rinsp-thread-visited th a[href^="job.php?action-topost-tid-"]:not(:hover),
.rinsp-visited-thread-view-mode .rinsp-thread-visited .inner > .section-title > a[href^="./read.php?tid-"]:not(:hover) {
    color: var(--rinsp-visited-link-color);
}
.rinsp-visited-thread-view-mode .rinsp-thread-visited td[id^="td_"] h3 > a:hover,
.rinsp-visited-thread-view-mode .rinsp-thread-visited th a[href^="read.php?tid-"]:hover,
.rinsp-visited-thread-view-mode .rinsp-thread-visited th a[href^="job.php?action-topost-tid-"]:hover,
.rinsp-visited-thread-view-mode .rinsp-thread-visited .inner > .section-title > a[href^="./read.php?tid-"]:hover {
    color: var(--rinsp-visited-link-hover-color);
}
.rinsp-visited-thread-view-mode .rinsp-thread-visited td[id^="td_"] h3 > a:not(:hover) > font,
.rinsp-visited-thread-view-mode .rinsp-thread-visited td[id^="td_"] h3 > a:not(:hover) > b > font,
.rinsp-visited-thread-view-mode .rinsp-thread-visited th a[href^="read.php?tid-"]:not(:hover) > font,
.rinsp-visited-thread-view-mode .rinsp-thread-visited th a[href^="read.php?tid-"]:not(:hover) > b > font,
.rinsp-visited-thread-view-mode .rinsp-thread-visited .inner > .section-title > a[href^="./read.php?tid-"]:not(:hover) > b > font,
.rinsp-visited-thread-view-mode .rinsp-thread-visited .inner > .section-title > a[href^="./read.php?tid-"]:not(:hover) > b > font {
    filter: saturate(0.7);
    opacity: 0.3;
}

/* on search results */
.rinsp-thread-visited-update td.smalltxt.y-style + .y-style {
    position: relative;
    color: var(--rinsp-visited-update-color);
}
.rinsp-thread-visited-update td.smalltxt.y-style + .y-style:before {
    content: "";
    display: inline-block;
    width: 3em;
    position: absolute;
    border: 1px solid var(--rinsp-visited-update-border-color);
    border-radius: 12px;
    left: 50%;
    margin-left: -1.5em;
    height: 1.2em;
    margin-top: -0.1em;
}

/* on thread listing */
.rinsp-thread-visited-update td.f10 > .s8 {
    border: 1px solid var(--rinsp-visited-update-border-color);
    color: var(--rinsp-visited-update-color);
    padding: 1px 3px;
    border-radius: 12px;
    margin-left: -4px;
}
/* thread wall mode */
.rinsp-thread-visited-update .inner > .section-text > span + span {
    color: var(--rinsp-visited-update-color) !important;
    font-weight: bold;
}

/* ==== request threads ==== */
.rinsp-request-highlight-ended-mode .rinsp-request-thread-ended:not(.rinsp-request-settlement-thread) > td[id^="td_"] > h3:before {
    content: "— 已有答案 —";
    font-weight: bold;
    color: #407727;
}
.rinsp-request-highlight-ended-mode .rinsp-request-thread-won:not(.rinsp-request-settlement-thread) > td[id^="td_"] > h3:before {
    content: "— ✓ 最佳 —";
    font-weight: bold;
    color: #407727;
}
.rinsp-request-highlight-ended-mode .rinsp-request-thread-won.rinsp-request-settlement-thread > td[id^="td_"] > h3:before {
    content: "— ✓ 已领取 —";
    font-weight: bold;
    color: #999;
}

.rinsp-request-bounty {
    color: #c60e87;
}
.rinsp-request-bounty + .s1 {
    display: none;
}
.rinsp-request-bounty .rinsp-extra-bounty {
    display: none;
}
.rinsp-request-show-extra-bounty .rinsp-request-bounty .rinsp-extra-bounty {
    display: inline;
}
.rinsp-request-thread-expired .rinsp-request-bounty {
    color: #999;
}
.rinsp-request-settlement-thread:not(:hover) {
    background: #EEE;
    opacity: 0.7;
}
.rinsp-request-settlement-thread .rinsp-request-bounty {
    color: #666;
    font-weight: normal;
}


body.rinsp-request-settlement-hide-mode:not(.rinsp-settlement-peek-mode) .rinsp-request-settlement-thread:not(.rinsp-request-settlement-bypass) > th,
body.rinsp-request-settlement-hide-mode:not(.rinsp-settlement-peek-mode) .rinsp-request-settlement-thread:not(.rinsp-request-settlement-bypass) > td {
    padding: 0;
    height: 7px;
    background: var(--rinsp-blocked-row-bg);
    line-height: 1px;
    overflow: hidden;
    color: transparent;
}
body.rinsp-request-settlement-hide-mode:not(.rinsp-settlement-peek-mode) .rinsp-request-settlement-thread:not(.rinsp-request-settlement-bypass) > th > *,
body.rinsp-request-settlement-hide-mode:not(.rinsp-settlement-peek-mode) .rinsp-request-settlement-thread:not(.rinsp-request-settlement-bypass) > td > * {
    display: none;
}
body.rinsp-request-settlement-hide-mode:not(.rinsp-settlement-peek-mode) .tr3.tac.rinsp-request-settlement-thread:not(.rinsp-request-settlement-bypass) > th.y-style:after,
body.rinsp-request-settlement-hide-mode:not(.rinsp-settlement-peek-mode) .rinsp-request-settlement-thread:not(.rinsp-request-settlement-bypass) > td[id^="td_"]:after {
    content: "结算帖";
    font-size: 12px;
    color: #AAA;
    display: inline-block;
    line-height: normal;
    padding: 1px 0 1px 7px;
}

/* ==== bookmarked user indications on message list ==== */
.rinsp-message-user-mapped > a::before {
    content: "🔖";
    position: absolute;
    transform: translateX(-100%);
    margin-left: -1px;
    font-weight: normal;
    font-size: 12px;
    color: #c30a0a;
}
.rinsp-message-user-pinned > a {
    font-weight: bold;
    
}
.rinsp-message-user-pinned > a:before {
    content: "";
    width: 16px;
    height: 16px;
    background: var(--rinsp-pin-icon);
    padding-right: 1px;
    position: absolute;
    transform: translateX(-100%);
}

/* ==== improve column width ratio in message list ==== */

form[name="del"][action="message.php"] .set-table2 > tbody > tr > td:nth-child(1) {
    width: 8%;
}
form[name="del"][action="message.php"] .set-table2 > tbody > tr > td:nth-child(2) {
    width: 15%;
}
form[name="del"][action="message.php"] .set-table2 > tbody > tr > td:nth-child(4) {
    width: 22%;
}

/* ==== topic and reply list filter shortcuts ==== */
.rinsp-uphp-topic #u-contentmain > table > tbody > tr + tr:hover,
.rinsp-uphp-post #u-contentmain > table > tbody > tr + tr:hover {
    outline: 1px solid #DDD;
}

.rinsp-uphp-trade #u-contentmain .rinsp-gf-link,
.rinsp-uphp-topic #u-contentmain .rinsp-gf-link,
.rinsp-uphp-post #u-contentmain .rinsp-gf-link {
    float: right;
    color: #BBB;
    white-space: nowrap;
}
.rinsp-uphp-trade #u-contentmain .rinsp-gf-link,
.rinsp-uphp-post #u-contentmain .rinsp-gf-link {
    margin-right: 5px;
    margin-left: 5px;
}
.rinsp-uphp-trade #u-contentmain .rinsp-gf-link:hover,
.rinsp-uphp-topic #u-contentmain .rinsp-gf-link:hover,
.rinsp-uphp-post #u-contentmain .rinsp-gf-link:hover {
    color: #000;
}

/* ==== reply list ==== */
.rinsp-reply-list-controls {
    color: #333;
    font-size: 11px;
    display: block;
    text-align: right;
    margin-right: -18%;
}

.rinsp-reply-fold-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}
.rinsp-reply-fold-table > tbody > tr > td + td {
    width: 20%;
}
/* need to keep the old table for soul++ infinite scroll */
.rinsp-reply-fold-table + .u-table {
    display: none;
}

.rinsp-reply-fold-item {
    display: flex;
    align-items: flex-start;
}
.rinsp-reply-fold-item > a {
    flex-shrink: 1;
}
.rinsp-reply-fold-pages {
    max-width: 14em;
    min-width: 3em;
    display: flex;
    align-items: flex-start;
    padding-right: 7px;
    white-space: nowrap;
    font-size: 13px;
    overflow: hidden;
}
.rinsp-reply-fold-count {
    display: inline-block;
    color: #FFF;
    font-family: monospace;
    font-weight: bold;
    background-color: #AAA;
    padding: 0px 4px;
    margin-left: 0.5em;
    border-radius: 20px;
    line-height: normal;
    cursor: default;
    white-space: nowrap;
    position: relative;
    top: 1px;
}
.rinsp-reply-fold-remains {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: monospace;
}
.rinsp-reply-fold-remains-start {
    flex-shrink: 1;
}
.rinsp-reply-fold-remains-end {
    flex-grow: 0;
    flex-shrink: 0;
}
.rinsp-reply-fold-remains > a {
    margin-left: 4px;
    color: #999;
    white-space: nowrap;
}
.rinsp-reply-fold-remains > a:hover {
    color: #333;
}

/* ==== thread history list ==== */
.rinsp-quick-filter-box {
    display: flex;
    align-items: center;
}
.rinsp-quick-filter-box > :first-child {
    min-width: 3.5em;
}
.rinsp-quick-filter-box + .rinsp-quick-filter-box {
    margin-top: 2px;
}
.rinsp-quick-filter-box > .rinsp-quick-filter-checkbox {
    margin-right: 0.5em;
    padding: 0px 6px 0px 4px;
    border-radius: 16px;
    color: #333;
}
.rinsp-quick-filter-box > .rinsp-quick-filter-bought-checkbox {
    background: #FBEFD9;
}
.rinsp-quick-filter-box > .rinsp-quick-filter-replied-checkbox {
    background: #CFE8FF;
}
.rinsp-quick-filter-box > .rinsp-quick-filter-notmine-checkbox {
    background: #FBEAF5;
}
html.rinsp-dark-mode .rinsp-quick-filter-box > .rinsp-quick-filter-bought-checkbox {
    background: #523706;
    color: var(--rinsp-text-color-orange);
}
html.rinsp-dark-mode .rinsp-quick-filter-box > .rinsp-quick-filter-replied-checkbox {
    background: #092947;
    color: var(--rinsp-text-color-blue);
}
html.rinsp-dark-mode .rinsp-quick-filter-box > .rinsp-quick-filter-notmine-checkbox {
    background: #3c1332;
    color: var(--rinsp-text-color-violet);
}

.rinsp-quick-filter-box > input {
    flex: 1;
}
.rinsp-thread-history-table {
    width: 100%;
}
.rinsp-quick-filter-box > input:focus,
.rinsp-table-filtered .rinsp-quick-filter-box > input {
    outline: 3px solid #c6ae30;
    outline-offset: -1px;
}
.rinsp-thread-status-icons {
    float: right;
    margin-left: 1em;
}
.rinsp-thread-replied-icon {
    color: #0779AA;
    cursor: default;
}
.rinsp-thread-bought-icon {
    color: #9D674C;
    cursor: default;
}
.rinsp-thread-byme > th > a[href^="read.php?tid"] {
    color: #C60E87;
}
.rinsp-thread-deleted > th > a[href^="read.php?tid"] {
    color: #C22;
    text-decoration: line-through;
}
.rinsp-thread-initial-title::before {
    content: "原始标题: ";
    color: #739;
}
.rinsp-thread-initial-title {
    color: var(--rinsp-text-color-grey);
    padding: 1px 0px 1px 5px;
    margin-left: -5px;
    background: var(--rinsp-lightest-bg-color);
}
.rinsp-thread-title-replaced + br {
    display: block;
    height: 0;
}

.rinsp-thread-history-table > tbody > tr:hover {
    outline: 1px solid #DDD;
}
.rinsp-thread-record-uid > a::before {
    content: "by ";
    font-size: 0.9em;
}
.rinsp-thread-record-uid {
    float: right;
}

.rinsp-thread-populate-button {
    color: #BB4411;
    margin-left: 0.5em;
}

/* ==== friends ==== */
.rinsp-uphp-friend #u-content .u-table td:nth-child(2) > a[href^="u.php?action-show-uid-"] {
    color: #AAA;
}
.rinsp-uphp-friend #u-content .u-table .rinsp-user-state-online > td:nth-child(2) > b {
    color: #11AA44;
}

/* ==== user bookmark listing action menu ==== */
#rinsp-userbookmark-action-menu .bor td {
    padding-left: 12px;
}
.rinsp-mailto-user-bookmark-button::before {
    content: "";
    width: 14px;
    height: 12px;
    display: inline-block;
    background: url(/images/colorImagination/mail-icon.gif);
    position: absolute;
    margin-left: -18px;
    margin-top: 4px;
}

/* ==== user profile page actions ==== */
#u-portrait ~ .bdbA > table > tbody > tr > td {
    padding-bottom: 0.5em;
}

/* ==== paywell area rename ==== */
.rinsp-area-scoped-item-171 a[href="thread.php?fid-171.html"]::after,
.rinsp-area-scoped-item-172 a[href="thread.php?fid-172.html"]::after,
.rinsp-area-scoped-item-173 a[href="thread.php?fid-173.html"]::after,
.rinsp-area-scoped-item-174 a[href="thread.php?fid-174.html"]::after {
    content: " (网赚)";
}

/* ==== area filter ==== */
.rinsp-area-scoped-item-hidden {
    display: none;
}

/* ==== share type filter ==== */
#ajaxtable .hthread {
    height: auto;
    display: flex;
}
#ajaxtable .hthread > .threadlist {
    position: relative;
    float: none;
    padding-right: 1em;
}
#ajaxtable .threadlist li.current a, .threadlist li.current a:hover {
    height: 18px;
}

.rinsp-sharetype-filter {
    flex: 1;
    padding-top: 0.2em;
    text-align: right;
}
.rinsp-sharetype-item {
    display: inline-block;
    font-size: 11px;
    font-weight: normal;
    line-height: 16px;
    border: 1px solid #CAB2D7;
    border-radius: 9px;
    padding: 1px 5px;
    background: #FFFE;
    margin-right: 0.5em;
    cursor: pointer;
    margin-bottom: 1px;
}
.rinsp-sharetype-item[disabled="1"] {
    opacity: 0.5;
    border-color: #CCC;
    color: #999;
}
.rinsp-sharetype-item[disabled="1"]::after {
    color: #999;
}
.rinsp-sharetype-item[count="0"] {
    display: none;
}
.rinsp-sharetype-item::after {
    content: " " attr(count);
    color: #7628A2;
    font-size: 10px;
}
.rinsp-sharetype-filter-clear {
    cursor: pointer;
}
.rinsp-sharetype-filter-clear[disabled="1"] {
    cursor: default;
    opacity: 0.1;
    pointer-events: none;
}

/* ==== category filter ==== */

.rinsp-category-filter {
    padding-top: 0.2em;
}
.rinsp-category-toggle-item {
    display: inline-block;
    line-height: 16px;
    color: #666;
    border: 1px solid #CCC;
    border-radius: 9px;
    padding: 1px 5px;
    background: #FFFE;
    margin-right: 0.5em;
    margin-bottom: 0.5em;
    cursor: pointer;
}
.rinsp-category-toggle-item.rinsp-category-active {
    border: 1px solid #613578;
    background: #CAB2D7;
    color: #000;
}
.rinsp-category-toggle-item::after {
    content: " " attr(count);
    color: #7628A2;
    font-size: 10px;
}
.rinsp-category-hide {
    display: none;
}

/* ==== history-based bounty status ==== */
.rinsp-thread-bounty-status {
    font-size: 0.9em;
    margin-right: 0.5em;
    white-space: nowrap;
}
.rinsp-thread-bounty-status-won > span,
.rinsp-thread-bounty-status-ended > span {
    display: none;
}
.rinsp-thread-bounty-status > span::after {
    content: "SP";
}
.rinsp-thread-bounty-status-expired.rinsp-thread-bounty-status-own {
    color: #b10b0b;
}
.rinsp-thread-bounty-status-ongoing {
    color: #c11986;
}
.rinsp-thread-bounty-status-ongoing.rinsp-thread-bounty-status-own::before {
    content: "悬赏中 ";
    font-weight: bold;
    font-size: 1.2em;
}
.rinsp-thread-bounty-status-expired.rinsp-thread-bounty-status-own::before {
    content: "⚠️已超时 ";
    font-size: 1.2em;
    font-weight: bold;
}
.rinsp-thread-bounty-status-ended::before,
.rinsp-thread-bounty-status-won::before {
    content: "✓";
    font-size: 1.2em;
    font-weight: bold;
}
.rinsp-thread-bounty-status-won,
.rinsp-thread-bounty-status-ended.rinsp-thread-bounty-status-own {
    color: #2d8e0d;
}
.rinsp-thread-bounty-status-ended {
    color: #136cbb;
}
.rinsp-thread-bounty-status-won::after {
    content: " 最佳";
}
.rinsp-thread-bounty-status-ended::after {
    content: " 有答案";
}
.rinsp-thread-bounty-status-ended.rinsp-thread-bounty-status-own::after {
    content: "";
}
.rinsp-thread-bounty-status-expired::after {
    content: " 已结束";
    color: #ae700a;
}
.rinsp-thread-bounty-status-expired.rinsp-thread-bounty-status-own::after {
    content: "";
}
.rinsp-thread-bounty-status-unknown {
    display: none;
}

/* ==== other ==== */
.rinsp-filter-multiip-focus-mode .t5.t2:has(> .rinsp-post:not(.rinsp-post-multi-uid-selected)) {
    display: none;
}
.rinsp-hide {
    display: none;
}
.tiptop > .fr.js-hidepuremark {
    position: relative;
    z-index: 1;
}
.js-puremark-content + .bianji > a:not(:hover) {
    color: #aaa;
}
/* override and take over forum default blocking mode */
form > .t5.t2[hidden] {
    display: block;
}
.rinsp-fid-search-button {
    margin-right: 3px;
}
.rinsp-fid-search-button:not(:hover) {
    opacity: 0.8;
}
.rinsp-fid-search-button:before {
    content: "";
    display: inline-block;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAoVJREFUeNq8l0loFEEUhtthBEH05goKcQvGxBE0YtBRMEExggsyiIiag7kEEYQQchAhiAeTkweJh6iIuKCgEcRDoogbKGowbigqejCI4IpCgsTlf/A3PIrpnqpqOw8+uupNV9c/XVXvvR5VKBQCCxsLykkWvASvwNcgoWUt7qkC23idwzEy+TPQDa6nJWAxOADqivw2HdSC3eAxaAa9PgIyEf4T4F7E5KbNBz3gxv96Ax1gu+EbADdBHxgGOZAHM9U9y8ElsD6JgOOgQfVfgF3gWsT4heAQWMr+OnCL4pyXYLYx+V0wN2ZysYdgGbiifNJf4SPgmGo/AjUOb3ItuKr6Z1wFzKDy0DZ67Kctqj0F1NsKkH2wU/megHceAj5x2ULbYSugEixSvosJ4so51c7ZCpCjNM04cr7Wp9rjXZZgtPL9SSDgl+tzRMBb8F75JiQQUKnaw7YCnjOeByqY+NomYzNbCfhpxIAlYJxnWF+t+udd4oAEntfKf9JDQKdqfwanXCOhDsOSUM46TH7YiCV7wG9XAXfAbdXfzHNdHjN+KjgCmgx/K6jwyYZ5xvRa9gtEMtxlnnP5Z/PAmphwW8GKqRo8cK0H6rgncoawvMe+uA9WxVVLURXRArAVfLGY5Dv4FvN7T1xyy8QMPM2s1sglkGD1g8f2AxNPC++ZVSKBXYiqlEpVxRJau4jYGF6HjPsGmdLfgLKIZ3XzpBy1fQPFbKjI5KH95eZ7GjO+i2/NW4CNwCqjLjDtIGhLS0BoNSU+WPaBvWBiNkjPVnLdo8r0/ZJzMkG6toGnKcompy0gYDzpLOKXI92bDUbGmjhheAI+MnX3j5QAsXaWaZP43dkvzn8CDAADRnsHJ4sZkAAAAABJRU5ErkJggg==) no-repeat;
    background-size: 12px 12px;
    width: 12px;
    height: 12px;
    vertical-align: middle;
}
.rinsp-fid-search-button:hover:before {
    color: #007788;
}

/* ==== menu quick search ==== */
#guide.rinsp-quicksearch-added {
    display: flex;
}
#guide.rinsp-quicksearch-added > li {
    float: none;
    flex: 0 0 auto;
}
#guide.rinsp-quicksearch-align-center {
    width: 100%;
}
#guide.rinsp-quicksearch-align-center .rinsp-spacer {
    flex: 1 1;
}
.rinsp-quicksearch {
    display: flex;
    align-items: center;
    padding: 2px 4px 2px 2px;
    position: relative;
}
.rinsp-quicksearch-field {
    flex: 1;
    font-size: 12px;
    padding: 1px 22px 1px 5px;
    margin: 0px;
    border-width: 1px;
    border-radius: 0.5em;
    border-color: transparent;
    overflow: hidden;
    width: 14em;
    position: relative;
}
.rinsp-quicksearch-button {
    flex: 0;
    padding: 0 4px 0 6px;
    position: absolute;
    right: 0;
}
.rinsp-quicksearch-button:after {
    content: "";
    display: inline-block;
    cursor: pointer;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAoVJREFUeNq8l0loFEEUhtthBEH05goKcQvGxBE0YtBRMEExggsyiIiag7kEEYQQchAhiAeTkweJh6iIuKCgEcRDoogbKGowbigqejCI4IpCgsTlf/A3PIrpnqpqOw8+uupNV9c/XVXvvR5VKBQCCxsLykkWvASvwNcgoWUt7qkC23idwzEy+TPQDa6nJWAxOADqivw2HdSC3eAxaAa9PgIyEf4T4F7E5KbNBz3gxv96Ax1gu+EbADdBHxgGOZAHM9U9y8ElsD6JgOOgQfVfgF3gWsT4heAQWMr+OnCL4pyXYLYx+V0wN2ZysYdgGbiifNJf4SPgmGo/AjUOb3ItuKr6Z1wFzKDy0DZ67Kctqj0F1NsKkH2wU/megHceAj5x2ULbYSugEixSvosJ4so51c7ZCpCjNM04cr7Wp9rjXZZgtPL9SSDgl+tzRMBb8F75JiQQUKnaw7YCnjOeByqY+NomYzNbCfhpxIAlYJxnWF+t+udd4oAEntfKf9JDQKdqfwanXCOhDsOSUM46TH7YiCV7wG9XAXfAbdXfzHNdHjN+KjgCmgx/K6jwyYZ5xvRa9gtEMtxlnnP5Z/PAmphwW8GKqRo8cK0H6rgncoawvMe+uA9WxVVLURXRArAVfLGY5Dv4FvN7T1xyy8QMPM2s1sglkGD1g8f2AxNPC++ZVSKBXYiqlEpVxRJau4jYGF6HjPsGmdLfgLKIZ3XzpBy1fQPFbKjI5KH95eZ7GjO+i2/NW4CNwCqjLjDtIGhLS0BoNSU+WPaBvWBiNkjPVnLdo8r0/ZJzMkG6toGnKcompy0gYDzpLOKXI92bDUbGmjhheAI+MnX3j5QAsXaWaZP43dkvzn8CDAADRnsHJ4sZkAAAAABJRU5ErkJggg==) no-repeat;
    background-size: 14px 14px;
    width: 18px;
    height: 14px;
}
.rinsp-quicksearch-field:invalid {
    opacity: 0.9;
}
.rinsp-quicksearch:has(.rinsp-quicksearch-field:invalid):after {
    content: "搜索";
    font-size: 11px;
    position: absolute;
    right: 24px;
}

#guide.rinsp-quicksearch-added a[href="plugin.php?H_name-tasks.html"] {
    font-size: 0;
}
#guide.rinsp-quicksearch-added a[href="plugin.php?H_name-tasks.html"]:after {
    content: "任务";
    font-size: 12px;
}

/* ==== pin users ==== */
.rinsp-pinned-user-list {
    display: flex;
    flex-wrap: wrap;
    width: 530px;
}

.rinsp-pinuser-main {
    position: fixed;
    left: calc(50vw + 510px);
    transform: translateY(-50%);
    top: 50vh;
    max-height: 90vh;
    overflow: auto;
}

.rinsp-pinuser-list > div {
    padding-right: 20px;
}
.rinsp-pinuser-list > b {
    display: inline-block;
    color: #FFF8;
    border-bottom: 3px solid #FFF8;
    box-sizing: border-box;
    font-size: 1.3em;
    font-weight: normal;
    min-width: 106px;
}

.rinsp-pinuser-item {
    margin: 5px 0;
    display: flex;
    
}
.rinsp-pinuser-item img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    object-position: top;
    border: 3px solid #FFF;
}
.rinsp-pinuser-item.rinsp-pinuser-item-absent img {
    width: 50px;
    height: 50px;
}
.rinsp-pinuser-item.rinsp-pinuser-item-absent .rinsp-pinuser-item-face {
    display: flex;
}
.rinsp-pinuser-item.rinsp-pinuser-item-absent .rinsp-pinuser-item-face > div {
    min-width: 85px;
    max-width: 85px;
    flex-direction: column-reverse;
    background-color: transparent;
    background-image: linear-gradient(to right, #FFF8 0%, #FFF1 100%);
}
.rinsp-pinuser-item.rinsp-pinuser-item-absent:hover .rinsp-pinuser-item-face > div {
    background: #FFF8;
}
.rinsp-pinuser-item.rinsp-pinuser-item-absent .rinsp-pinuser-unpin-icon {
    text-align: right;
}
.rinsp-pinuser-item.rinsp-pinuser-item-absent .rinsp-pinuser-item-face > div > a {
    max-height: 50px;
    overflow: hidden;
}
.rinsp-pinuser-item-locs:empty {
    display: none;
}
.rinsp-pinuser-item-locs {
    margin: 0 0 0 5px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    font-size: 0.8em;
    max-height: 130px;
    width: 5.5em;
}
.rinsp-pinuser-item-locs > dt {
    margin-right: 6px;
}
.rinsp-pinuser-item-locs > dt > a {
    color: #FFF8;
    font-weight: bold;
    margin-bottom: 1px;
    white-space: nowrap;
}

.rinsp-pinuser-item-locs > dt.rinsp-pinuser-loc-ignoredmark > a {
    color: #FF09;
}
.rinsp-pinuser-item-locs > dt.rinsp-pinuser-loc-gf > a {
    color: #0F09;
}
.rinsp-pinuser-item-locs > dt.rinsp-pinuser-loc-banned > a {
    color: #F44E;
}
.rinsp-pinuser-item-face > div {
    max-width: 106px;
    padding: 2px 4px;
    margin-right: -20px;
    display: flex;
    background: #FFF8;
    box-sizing: border-box;
}
.rinsp-pinuser-item:hover > .rinsp-pinuser-item-face > div {
    background: #FFFC;
}
.rinsp-pinuser-item-face > div > a {
    flex: 1;
    word-break: break-all;
}
.rinsp-pinuser-unpin-icon {
    cursor: pointer;
    height: 0;
}
.rinsp-pinuser-unpin-icon::before {
    content: "❌";
    font-size: 10px;
}
a:not([name="tpc"]) + .rinsp-thread-filter-active-reply {
    outline: 2px solid #36C;
    outline-offset: -1px;
}
.rinsp-thread-filter-pinned {
    outline: 3px solid #F08;
    outline-offset: -1px;
}
.rinsp-thread-filter-pinned .tr1 .r_two,
.rinsp-thread-filter-pinned th.r_two > .rinsp-userpic-sticky {
    background-color: #F2CFE0;
}
.rinsp-pinuser-item-absent {
    opacity: 0.3;
}

.rinsp-thread-user-pinned {
    outline: 2px solid #F08;
    outline-offset: -3px;
}
.rinsp-thread-user-pinned .rinsp-uid-inspected {
    font-weight: bold;
    color: #F08;
}
.rinsp-user-action-pinuser-button {
    display: inline-block;
    margin-left: 0.5em;
    vertical-align: top;
}
.rinsp-user-action-pinuser-button:not([data-pinned]):not(:hover) {
    filter: grayscale(1);
    opacity: 0.5;
}

.rinsp-quick-action-overlay {
    z-index: 4;
}
.rinsp-quick-action-overlay:focus > label::after {
    content: "凛+ (版本" attr(version) ")";
    font-size: 13px;
    color: #BBB;
}
.rinsp-quick-action-overlay:focus > label {
    border-bottom: 1px solid #999;
}

.rinsp-quick-action-overlay {
    position: fixed;
    font-size: 14px;
}
.rinsp-quick-action-overlay-pos-tr {
    right: 15px;
    top: 16px;
    padding-bottom: 32px;
    padding-left: 32px;
    text-align: right;
}
.rinsp-quick-action-overlay-pos-tr:focus {
    padding: 5px;
    margin-top: -5px;
    margin-right: -5px;
    border-radius: 5px;
    background: #FFF7;
}
.rinsp-quick-action-overlay-pos-tl {
    left: 25px;
    top: 16px;
    padding-bottom: 32px;
    padding-right: 32px;
    text-align: left;
}
.rinsp-quick-action-overlay-pos-tl:focus {
    padding: 5px;
    margin-top: -5px;
    margin-left: -5px;
    border-radius: 5px;
    background: #FFF7;
}

.rinsp-quick-action-overlay:focus {
    border-radius: 5px;
    background: #FFFA;
}
.rinsp-quick-action-overlay > label {
    font-size: 16px;
    filter: grayscale(1);
    opacity: 0.2;
    margin-bottom: 5px;
    display: block;
}
.rinsp-quick-action-overlay:focus > label {
    filter: grayscale(0.5) invert(1);
    opacity: 1;
}
.rinsp-quick-action-overlay:not(:focus) > label ~ * {
    display: none;
}
.rinsp-quick-action-overlay > label ~ * {
    margin-bottom: 0.2em;
}

.rinsp-quick-action-divider {
    border-top: 1px solid #999;
    margin-top: 0.3em;
    margin-bottom: 0.3em;
}
.rinsp-quick-action {
    margin-left: 1px;
}
.rinsp-quick-action::before {
    cursor: pointer;
}
.rinsp-quick-action::before {
    content: attr(label);
    color: var(--rinsp-darkest-text-color);
    display: inline-block;
}
.rinsp-quick-action:not(:hover)::before {
    opacity: 0.7;
}


.new-msg-tips,
.new-msg-tips + span {
    z-index: 5;
}
@media (max-width: 1278px) {
    .rinsp-pinuser-main {
        position: absolute;
    }
    .rinsp-pinuser-main:not(:empty) {
        top: 0;
        left: 0;
        padding: 5px 0 5px 0;
        width: 100%;
        box-sizing: border-box;
        transform: none;
        background-image: url(data:image/gif;base64,R0lGODlhEAAFAIAAAE1NTWZmZiH5BAAAAAAALAAAAAAQAAUAAAIOjAOHmtf2lmN0WljxRQUAOw==);
        background-repeat: repeat;
        z-index: 2;
    }
    .rinsp-pinuser-list {
        text-align: center;
        white-space: nowrap;
    }
    .rinsp-pinuser-list > b {
        writing-mode: vertical-rl;
        min-width: auto;
        border-bottom: none;
        border-right: 3px solid #FFF8;
        min-height: 76px;
    }
    .rinsp-pinuser-list > div {
        display: inline-block;
        text-align: left;
        padding: 0;
        white-space: nowrap;
        max-width: 80vw;
        overflow-x: auto;
        overflow-y: hidden;
    }
    .rinsp-pinuser-item {
        margin: 0 5px;
    }
    .rinsp-pinuser-item-face {
        display: inline-flex;
        flex-direction: column;
        background: #FFF3;
        vertical-align: top;
    }
    .rinsp-pinuser-item.rinsp-pinuser-item-absent .rinsp-pinuser-item-face {
        display: inline-flex;
    }
    .rinsp-pinuser-item-face > div,
    .rinsp-pinuser-item.rinsp-pinuser-item-absent .rinsp-pinuser-item-face > div {
        max-width: 106px;
        min-width: 106px;
        margin: 0;
        flex-direction: row;
    }
    .rinsp-pinuser-item.rinsp-pinuser-item-absent .rinsp-pinuser-item-face > div {
        max-width: 78px;
        min-width: 78px;
    }
    .rinsp-pinuser-item .rinsp-pinuser-item-face > div > a,
    .rinsp-pinuser-item.rinsp-pinuser-item-absent .rinsp-pinuser-item-face > div > a {
        max-height: 1.4em;
        overflow: hidden;
    }
    .rinsp-pinuser-list .rinsp-pinuser-item {
        margin-right: 5px;
        display: inline-block;
    }
    .rinsp-pinuser-item-locs {
        width: auto;
        vertical-align: top;
        display: inline-flex;
        margin-left: -36px;
        max-height: 66px;
        overflow: auto;
        flex-wrap: nowrap;
    }
    .rinsp-pinuser-item img {
        width: 60px;
        height: 60px;
    }
}

/* ==== subject line functions ==== */
.rinsp-theme-darksubject h1#subject_tpc {
    color: #333;
}
.rinsp-theme-darksubject h1[id^="subject_"] {
    color: #999;
}
.rinsp-theme-darksubject h1#subject_tpc .rinsp-subject-class {
    color: #BBB;
    margin-right: 0.2em;
    font-size: 15px;
}
.rinsp-subject-redundant {
    display: none;
}
.rinsp-subject-floor-link {
    color: #3399CC;
}
.blockquote3 .rinsp-subject-floor-link {
    font-weight: bold;
    color: #3399CC;
    margin: 0 0.2em;
}

/* ==== resource spots ==== */
.rinsp-spots-main {
    position: fixed;
    left: calc(50vw - 490px);
    transform: translateX(-100%);
    top: calc(49vh - 30px);
}
.rinsp-highlight-spots > dl {
    max-height: calc(50vh - 40px);
    overflow: auto;
}
.rinsp-highlight-spots > b {
    display: inline-block;
    color: #FFF8;
    box-sizing: border-box;
    font-size: 1.3em;
    font-weight: normal;
}
.rinsp-highlight-spots > dl {
    background: #FFF1;
    border-top: 3px solid #FFF8;
    font-size: 1.1em;
    margin-top: 0;
    padding: 0.2em 0.5em;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
}

.rinsp-highlight-spots > dl > dt > a {
    display: flex;
    color: #CCC;
}
.rinsp-spot-label {
    flex: 1;
    max-width: 10em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.rinsp-highlight-spots > dl > dt > a .rinsp-spot-floor {
    color: #EEE;
    font-weight: bold;
    font-family: monospace;
    margin-right: 0.3em;
    min-width: 2.5em;
    display: inline-block;
}

.rinsp-thread-header {
    display: flex;
}
.rinsp-spots-bar {
    display: flex;
    flex: 1;
    white-space: nowrap;
    order: 2;
    overflow: hidden;
    text-overflow: ellipsis;
}
.rinsp-spots-bar .rinsp-spot-floor {
    font-weight: bold;
    font-size: 0.8em;
}
.rinsp-spots-bar > a {
    margin-left: 5px;
}
.rinsp-spots-bar > a + a {
    border-left: 1px solid #AAA;
    padding-left: 5px;
}
.rinsp-thread-header > .fl {
    flex: 0;
    order: 1;
}
.rinsp-thread-header > .fl:not(:empty) {
    padding-right: 1em;
}
.rinsp-thread-header > .fr {
    flex: 0;
    order: 3;
    padding-left: 1.5em;
}


@media (max-width: 1278px) {
    .rinsp-spots-main .rinsp-spot-label {
        display: none;
    }
}
@media (max-width: 1150px) {
    .rinsp-highlight-spots {
        font-size: 0.8em;
    }
}

/* ==== infinite scroll ==== */

.rinsp-infscroll-armed .rinsp-infscroll-page-endtrigger {
    --rinsp-infscroll-height: 70px; /* add 15px */
}
.rinsp-infscroll-switch.rinsp-active {
    background: var(--rinsp-cell-background-active);
}
div.rinsp-infscroll-divider,
tbody.rinsp-infscroll-divider > tr > td {
    color: var(--rinsp-infscroll-divider-text-color);
    border-top: 1px solid var(--rinsp-infscroll-divider-border-color);
    background: var(--rinsp-infscroll-divider-background);
    padding: 0.2em 0 0.2em 1em;
    text-align: center;
    clear: both;
}
div.rinsp-infscroll-divider {
    border-bottom: 1px dotted var(--rinsp-infscroll-divider-border-color);
    margin-bottom: 8px;
}
.rinsp-infscroll-enabled .rinsp-infscroll-page-endtrigger {
    width: 1px;
    height: var(--rinsp-infscroll-height);
}
.rinsp-infscroll-enabled .rinsp-infscroll-page-endtrigger:after {
    content: "";
    position: absolute;
    top: 100vh;
    width: 1px;
    height: var(--rinsp-infscroll-height);
    z-index: 10000;
}
.rinsp-infscroll-armed .rinsp-infscroll-loader-bar {
    position: fixed;
    left: 50%;
    transform: translatex(-50%);
    bottom: 0;
    width: 940px;
    border-top: 1px dotted var(--rinsp-infscroll-loader-border-color);
    height: 15px;
    background: var(--rinsp-infscroll-loader-background);
    overflow: hidden;
}
.rinsp-infscroll-firing .rinsp-infscroll-loader-bar:before {
    content: "";
    display: block;
    position: relative;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(to right, var(--rinsp-infscroll-loader-progress) 90%, transparent 100%);
    animation: count-down 2s;
}
.rinsp-infscroll-armed:not(.rinsp-infscroll-firing) .rinsp-infscroll-loader-bar:after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAANCAYAAACtpZ5jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMi1jMDAwIDc5LjU2NmViYzViNCwgMjAyMi8wNS8wOS0wODoyNTo1NSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjZEQTE2QTZENzJDOTExRURCMUZDQTc0M0NBRkM3OUY0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjZEQTE2QTZFNzJDOTExRURCMUZDQTc0M0NBRkM3OUY0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NkRBMTZBNkI3MkM5MTFFREIxRkNBNzQzQ0FGQzc5RjQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NkRBMTZBNkM3MkM5MTFFREIxRkNBNzQzQ0FGQzc5RjQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6KmXcOAAABXElEQVR42rTUzSsEcRzHcTutcvIHKHHmJO2FJCkPB5GaiMJFcfEQUeIiSdRykAOxDuugkZI2iaKUQnKQkvJQ5ODCwUkx3r98pjZNQ7S/erX1nf195vt72A25rpuWihF2HMficwY5aMPzP/Ia0WnbdqmlwhkiuEDLHwIzsYKo15gJ/kAMWVjFBHaR+8vQZlyiDK2o84KTRy9q9JJD9AUEZmMbU1jTnB3voSXLuNV2nCIPswo221TwLbQHRwo3HXapblZ77wWbazGPK2xgWl8aRxFekcAgCnGCAcypgWPVz3U+C8nBZtmVmtCAR1ThDiUYQTc28abamBqIqv6kRkb99jiuLvaxpJPOwKIm9aMY16jAg67YEMrVyNc99jmUFzShWoE3WklcE9P1UhN0gA6/ux8OOPUtHY5Z6iRqsYdhPW/X3vsO64c7+q69rUe+Qtf1K00ETQyl6r/iU4ABAH2/U1xZevwpAAAAAElFTkSuQmCC) top center no-repeat;
}

@keyframes count-down {
    0% {
        width: 0%;
    }
    100% {
        width: 120%;
    }
}

/* ==== lazy image loading ==== */
img[src][data-rinsp-defer-src] {
    width: auto;
    animation: fade-in 2s alternate infinite;
}

@keyframes fade-in {
    0% {
        opacity: 0.2;
    }
    100% {
        opacity: 1;
    }
}

/* ==== reply refresh free anim ==== */
.rinsp-reply-refresh-free {
    position: relative;
    display: block;
}
.rinsp-reply-refresh-free.rinsp-refresh-free-submitting::after {
    content: "提交中 ...";
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    height: 100%;
    left: 0;
    width: 100%;
    z-index: 1;
    background: rgba(255,255,255,0.7);

}
.rinsp-reply-refresh-free.rinsp-refresh-free-submitting::before {
    content: "⌛";
    font-size: 16px;
    display: inline-block;
    animation-name: rinsp-watch-checking-rotate-anim;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    z-index: 2;
    position: absolute;
    top: calc(50% - 0.8em);
    left: calc(50% - 3em);
}

/* ==== get sp animation ==== */
#guide a[href="plugin.php?H_name-tasks.html"][rinsp-sp-get]::before {
    content: "+ " attr(rinsp-sp-get) "SP";
    position: absolute;
    transform: translate(0, 20%);
    opacity: 0;
    color: #000;
    background: linear-gradient(to bottom, #fff7a0 0%, #ffc033 100%);
    padding: 2px 5px;
    border: 1px solid #ee9905;
    border-radius: 16px;
    box-shadow: inset 0 0 2px #fff, inset 0 0 2px #fff, inset 0 0 2px #fff, inset 0 0 2px #fff;
    line-height: normal;
    z-index: 1;
    font-weight: normal;
    animation-name: sp-get;
    animation-duration: 5s;
    animation-iteration-count: 1;
    animation-timing-function: ease-out;
}


@keyframes sp-get {
    0% {
        transform: translate(0, 20%);
        opacity: 1;
    }
    20% {
        transform: translate(0, -140%);
        opacity: 1;
    }
    80% {
        transform: translate(0, -140%);
        opacity: 1;
    }
    100% {
        transform: translate(0, -140%);
        opacity: 0;
    }
}


/* ==== batch ping/sel functions ==== */
.rinsp-batchsel-form {
    max-height: calc(90vh - 150px);
    overflow-x: hidden;
    overflow-y: auto;
}
.rinsp-batchsel-form-op-cell {
    text-align: left;
    padding-left: 20px;
}
.rinsp-batchsel-form-op-cell.rinsp-batchsel-form-op-known::before {
    content: "🔖 ";
    margin-left: -20px;
}
.rinsp-batchsel-form-item-unchecked {
    opacity: 0.8;
    background: #EEE;
}
.rinsp-batchsel-form-item-unavailable {
    opacity: 0.3;
}
.rinsp-batchsel-form-item-unavailable > td:first-child > * {
    display: none;
}
.rinsp-batchsel-form-item-checked {
    background: linear-gradient(to right, #EFE 0%, transparent 50%);
}
.rinsp-batchping-form-item-unscore {
    background: linear-gradient(to right, #FEE 0%, transparent 50%);
}
.rinsp-batchping-form-item-unscore .rinsp-batchping-form-ping-cell::before,
.rinsp-batchping-form-item-unchecked .rinsp-batchping-form-ping-cell::before {
    content: "---";
    color: #CCC;
    display: block;
    text-align: center;
}
.rinsp-batchping-form-item-unchecked .rinsp-batchping-form-ping-cell > *,
.rinsp-batchping-form-item-unchecked .rinsp-batchping-form-ping-cell + td > * {
    display: none;
}
.rinsp-batchping-form-item-unscore .rinsp-batchping-form-sp-input,
.rinsp-batchping-form-item-unscore .rinsp-batchping-form-sp-input + span {
    display: none;
}
.rinsp-batchping-progress-list {
    padding: 0 1em 1em 1em !important;
}
.rinsp-batchping-progress-list > li {
    padding: 0.3em 0 !important;
}
.rinsp-batchping-progress-list > li:first-child {
    font-weight: bold;
}

/* ==== ping functions ==== */
.rinsp-quickping-form {
    width: 500px;
    padding: 0.2em;
    display: flex;
    flex-wrap: wrap;
}
.rinsp-quickping-form > dt {
    padding: 0.5em 0.5em 0.5em 2em;
    flex-basis: 4em;
    flex-shrink: 0;
    flex-grow: 0;
    text-align: right;
}
.rinsp-quickping-form > dd {
    padding: 0.5em 0.5em;
    flex-grow: 1;
}
.rinsp-quickping-form > div {
    flex-grow: 1;
    flex-basis: 100%;
    border-top: 1px dotted #CCC;
}
.rinsp-quickping-attr-ownbought {
    color: #0000FF;
}
.rinsp-quickping-attr-owntranslate {
    color: #FF0000;
}
.rinsp-quickping-attr-compilation {
    color: #FF00FF;
}
.rinsp-quickping-attr-ownbought, .rinsp-quickping-attr-owntranslate, .rinsp-quickping-attr-compilation, .rinsp-quickping-attr-extra {
    font-weight: bold;
    display: flex;
    align-items: center;
}
.rinsp-quickping-status-error {
    color: #990000;
}

.h2 a.rinsp-quickping-button {
    font-weight: bold;
    color: #ce0940;
}
.h2 a.rinsp-instantping-button {
    font-weight: bold;
    color: #0928ce;
}
.h2 a.rinsp-quickping-button.rinsp-quickping-grey,
.h2 a.rinsp-instantping-button.rinsp-instantping-grey {
    color: #808080;
    font-weight: normal;
}
.h2 a.rinsp-noping-button,
.h2 a.rinsp-badping-button {
    font-weight: bold;
    color: #cc0000;
}
.h2 a.rinsp-quickping-status {
    font-weight: bold;
    color: #112591;
}

.rinsp-quickping-form > .rinsp-quickping-preview-section {
    padding-top: 0.3em;
    border-top: none;
    text-align: center;
    font-size: 18px;
}
.rinsp-quickping-subject {
    padding: 0.5em 1em;
    word-break: break-all;
    font-size: 14px;
    max-width: 40em;
    background: #EEE;
}
.rinsp-quickping-reason-cell {
    display: flex;
}
.rinsp-quickping-reason-cell > textarea {
    flex: 1;
}

.rinsp-post-illegal-sell .tpc_content h6.quote.jumbotron > .s3.f12.fn {
    color: red;
    font-weight: bold;
}
.readbot .rinsp-markcorrect-switch,
.readbot .rinsp-punishrequest-switch,
.readbot .rinsp-punishclassify-switch {
    width: 5em;
}
.rinsp-ping-preset-switch::before {
    content: "🔘";
}
.rinsp-ping-preset-switch {
    margin-left: 0.5em;
    color: #333;
}

form[action="job.php?action=endreward"] table > tbody > tr > th:first-child {
    text-align: right;
    padding: .3em .6em;
    line-height: 25px;
}

/* ==== admin show user name ==== */
.rinsp-user-name-reveal {
    font-family: monospace;
    padding: 0px 2px;
    display: inline-block;
    outline: 1px solid #CCC;
    margin-left: 0.5em;
}

/* ==== admin punish status ==== */
.rinsp-profile-punish-tag-cell {
    padding-right: 16px;
    text-align: right;
}
.rinsp-profile-punish-tag-cell .rinsp-profile-punish-tags {
    font-size: 13px;
}
.rinsp-profile-punish-tag {
    font-weight: bold;
    font-family: monospace;
    margin-left: 0.4em;
    border: 1px solid #CCC;
    padding: 1px 5px;
}

.rinsp-profile-punish-tags .rinsp-profile-punish-tag::before {
    font-weight: normal;
    margin-right: 1px;
    font-size: 0.9em;
}

.rinsp-profile-punish-tags .rinsp-profile-punish-tag-blood {
    border-color: #C00;
    color: #FFF;
    background-color: #C00;
}
.rinsp-profile-punish-tags .rinsp-profile-punish-tag-blood::before {
    content: "血";
}
.rinsp-profile-punish-tags .rinsp-profile-punish-tag-ban {
    border-color: #C00;
    color: #C00;
}
.rinsp-profile-punish-tags .rinsp-profile-punish-tag-ban::before {
    content: "禁";
}

.rinsp-profile-punish-tags .rinsp-profile-punish-tag-del {
    border-color: #D80;
    color: #D80;
}
.rinsp-profile-punish-tags .rinsp-profile-punish-tag-del::before {
    content: "删";
}

.rinsp-profile-punish-tags .rinsp-profile-punish-tag-misc {
    border-color: #059;
    color: #059;
}
.rinsp-profile-punish-tags .rinsp-profile-punish-tag-misc::before {
    content: "他";
}

.rinsp-userframe-udata-punish-tags .rinsp-profile-punish-tags {
    font-size: 11px;
}
.rinsp-userframe-udata-punish-tags .rinsp-profile-punish-tags::before {
    content: "🚩";
}
.rinsp-userframe-udata-punish-tags .rinsp-profile-punish-tag {
    border-width: 0;
    margin-left: 0;
    padding: 0;
}
.rinsp-userframe-udata-punish-tags .rinsp-profile-punish-tag:first-child::before {
    content: "";
}
.rinsp-userframe-udata-punish-tags .rinsp-profile-punish-tag::before {
    content: "/";
    color: #CCC;
}
.rinsp-userframe-udata-punish-tags .rinsp-profile-punish-tag-blood {
    background: none;
    color: #000;
}
.rinsp-punish-history-table .rinsp-profile-punish-tag-blood > th {
    color: #C00;
    border-left: 3px solid #C00;
}
.rinsp-punish-history-table .rinsp-profile-punish-tag-ban > th {
    border-left: 3px solid #C00;
}
.rinsp-punish-history-table .rinsp-profile-punish-tag-del > th {
    border-left: 3px solid #D80;
}
.rinsp-punish-history-table .rinsp-profile-punish-tag-misc > th {
    border-left: 3px solid #059;
}

.rinsp-punish-history-table .rinsp-profile-punish-tag-none > th {
    border-left: 3px solid #CCC;
}


/* ==== admin punish log ==== */
input[name="ifdel"][value="0"]:checked + .rinsp-record-delatc-msg {
    display: none;
}
input[name="step"][value="2"]:checked + .rinsp-record-showping-option {
    display: none;
}
.rinsp-punish-history-table {
    width: 100%;
}
.rinsp-punish-history-table > tbody > tr > th {
    width: 6em;
}
.rinsp-punish-history-table > tbody > tr > th > div {
    font-weight: bold;
}
.rinsp-punish-history-table .rinsp-punish-history-summary-cell {
    color: var(--rinsp-darkest-text-color);
    cursor: default;
}
.rinsp-punish-history-table .rinsp-punish-history-summary-cell summary::marker {
    color: #999;
}
.rinsp-punish-history-table .rinsp-punish-history-summary-cell summary > div {
    margin-left: 10px;
    white-space: pre-line;
    color: #AAA;
}
.rinsp-punish-history-data {
    margin-left: 2px;
    border-left: 1px solid #ccc;
    padding-left: 9px;
}
.rinsp-punish-history-data label {
    color: #4e83a8;
    margin-right: 0.5em;
}
.rinsp-punish-history-data label + span {
    color: #666;
}

.rinsp-punish-history-table > tbody > tr:hover {
    outline: 1px solid #DDD;
}
.rinsp-punish-history-table .rinsp-punish-history-del-cell {
    width: 5em;
    text-align: right;
}
.rinsp-punish-history-del-cell > a {
    cursor: pointer;
}

/* ==== safe mode ==== */
.rinsp-safe-mode #cate_thread #tab_1 img:not([data-rinsp-defer-src]):not(:hover),
.rinsp-safe-mode .tpc_content img:not([data-rinsp-defer-src]):not([src^="images/post/smile/"]):not(:hover) {
    filter: var(--rinsp-image-masking-filter);
    transform: scale(0.99);
}
.rinsp-safe-mode .rinsp-pinuser-item-face img:not([data-rinsp-defer-src]):not(:hover),
.rinsp-safe-mode:not(.rinsp-safe-mode-allow-myself) #user_info a[href="u.php"] img:not([data-rinsp-defer-src]):not(:hover),
.rinsp-safe-mode.rinsp-safe-mode-allow-myself #u-portrait img.pic:not(.rinsp-myavatar):not(:hover),
.rinsp-safe-mode:not(.rinsp-safe-mode-allow-myself) #u-portrait img.pic:not(:hover),
.rinsp-safe-mode .js-post:not(.rinsp-my-post) a[href^="u.php?action-show-uid-"]:not(:hover) > img:not([data-rinsp-defer-src]),
.rinsp-safe-mode:not(.rinsp-safe-mode-allow-myself) .js-post.rinsp-my-post a[href^="u.php?action-show-uid-"]:not(:hover) > img:not([data-rinsp-defer-src]) {
    content: url(/images/face/none.gif);
}
.rinsp-safe-mode .rinsp-quick-action.rinsp-safe-mode-toggle {
    display: block;
}

/* ==== dark mode toggle ==== */

.rinsp-quick-action.rinsp-dark-mode-toggle::before {
    content: "🌒开启暗黑模式";
}
.rinsp-dark-mode-set .rinsp-quick-action.rinsp-dark-mode-toggle::before {
    content: "☀️关闭暗黑模式";
}

/* ==== safe mode toggle ==== */

.rinsp-quick-action.rinsp-safe-mode-toggle::before {
    content: "😇开启贤者模式";
}
.rinsp-safe-mode .rinsp-quick-action.rinsp-safe-mode-toggle::before {
    content: "😈关闭贤者模式";
}

/* ==== patch forum default styles ==== */

/* prevent category column to become too narrow due to user name being too long */
#u-contentmain > form[action="u.php?action=favor&"] > table > tbody > tr > td:nth-child(3) {
    min-width: 2em;
}
.rinsp-user-link {
    max-width: 7em;
    display: inline-block;
    font-size: 12px
}
.rinsp-uphp-post #u-contentmain > table > tbody > tr > th + td {
    font-size: 10px;
}
.rinsp-uphp-post #u-contentmain > table > tbody > tr > th + td > .rinsp-user-link {
    display: block;
}

.rinsp-hide-mobileswitch #main > center.gray3 > div > a[href^="/simple/"] {
    display: none;
}

/* text size overrides */
html.rinsp-textsize-step-1 {
    font-size: 62.5%;
}
html.rinsp-textsize-step-1 .set-table2 td {
    padding: 0.5em 0.5em;
}
html.rinsp-textsize-step-1 #set-menu,
html.rinsp-textsize-step-1 #info_base td > a[href^="message.php?"],
html.rinsp-textsize-step-1 th.y-style > a {
    font-size: 1.4rem;
}
html.rinsp-textsize-step-1 .t_one > td > h3 {
    font-size: 13px;
}

html.rinsp-textsize-step-1 #u-fav-cate form[action="u.php?action=favor&"] {
    font-size: 1.3rem;
}

html.rinsp-textsize-step-2 #main,
html.rinsp-textsize-step-2 #rinsp-watcher-menu {
    font-size: 1.4rem;
}

html.rinsp-textsize-step-2 h1 {
    font-size: 1.8rem;
}
html.rinsp-textsize-step-2 .small {
    font-size: 1.4rem;
}
html.rinsp-textsize-step-2 .f14,
html.rinsp-textsize-step-2 .middle {
    font-size: 1.7rem;
}
html.rinsp-textsize-step-2 .big {
    font-size: 2rem;
}

html.rinsp-textsize-step-3 #main,
html.rinsp-textsize-step-3 #rinsp-watcher-menu {
    font-size: 1.5rem;
}

html.rinsp-textsize-step-3 .tiptop {
    font-size: 1.3rem;
}
html.rinsp-textsize-step-3 h1 {
    font-size: 2rem;
}
html.rinsp-textsize-step-3 .small {
    font-size: 1.4rem;
}
html.rinsp-textsize-step-3 .f14,
html.rinsp-textsize-step-3 .middle {
    font-size: 1.8rem;
}
html.rinsp-textsize-step-3 .big {
    font-size: 2.1rem;
}
html.rinsp-textsize-step-3 .t_one > td > h3 {
    font-size: 14px;
}


/* fix textarea too wide in firefox */
form[action="message.php"] textarea#atc_content {
    width: calc(100% - 0.5em);
}
form[action="mawhole.php?"] textarea[name="atc_content"] {
    width: calc(100% - 300px);
}
#info_base .td1 {
    min-width: 4em;
}

/* 短消息设置 width bug */
textarea[name="banidinfo"] {
    width: 100%;
}

/* handy highlights */
.rinsp-last-clicked {
    outline: 2px solid #dbbc60;
    outline-offset;
}
`;

const darkThemeCss = `
:root {
    --rinsp-dm-invert-filter: invert(1) hue-rotate(180deg);
    --rinsp-dm-invert-filter-blk: invert(1) hue-rotate(180deg) saturate(1.2) contrast(0.81);
    --rinsp-dm-invert-filter-darkbg1: invert(1) hue-rotate(180deg) saturate(1.2) contrast(0.76) brightness(1.1);
    --rinsp-dm-hgt-text-filter: contrast(0.8) brightness(1.2);
    --rinsp-dm-color-black: #0d0d0d;
    --rinsp-dm-color-darkbg1: #141414;
    --rinsp-dm-color-darkbg2: #2d2d2d;
    --rinsp-dm-color-darkbg-hgt: #2f2f2f;
    --rinsp-dm-color-darkbg-hover: #36311f;
    --rinsp-dm-color-border: #666;
    --rinsp-dm-color-light-border: #AAA;
    --rinsp-dm-color-text: #CCC;
    --rinsp-dm-color-link: #BBB;
    --rinsp-dm-color-content-link: #6388A8;
    --rinsp-dm-color-content-link-hover: #8FB6D7;
    --rinsp-dm-color-heading: #eaeaea;
    --rinsp-dm-color-label: #eaeaea;
    --rinsp-dm-color-ctrl: #eaeaea;
    --rinsp-dm-color-grey: #AAA;
    --rinsp-dm-button-bg: #4b0707;
}

@media (prefers-color-scheme: light) {
    html.rinsp-dark-mode input[type="checkbox"],
    html.rinsp-dark-mode input[type="radio"] {
        filter: invert(1) hue-rotate(180deg) brightness(0.8);
    }
}

html.rinsp-dark-mode {
    opacity: 1;
    transition: opacity 0.08s ease-in;
    --rinsp-active-toggler-bg-color: #2b2b2b;
    --rinsp-active-toggler-fg-color: #CCC;
    --rinsp-visited-link-color: #AAA;
    --rinsp-visited-link-hover-color: #CCC;
    --rinsp-visited-update-color: #dba4f9;
    --rinsp-visited-update-border-color: #843cab;
    --rinsp-blocked-row-bg: #222;
    --rinsp-blocked-row-label-color: #999;
    --rinsp-avatar-replace-default-text-color: #999;
    --rinsp-avatar-replace-default-border-color: #202224;
    --rinsp-avatar-replace-default-bg: #303234;
    --rinsp-cell-background-grey-out: #444;
    --rinsp-cell-background-hgt-new: #44430e;
    --rinsp-cell-background-hgt-err: #491616;
    --rinsp-cell-background-active: #283d44;
    --rinsp-lightest-bg-color: #111;
    --rinsp-darkest-text-color: #CCC;
    --rinsp-text-color-orange: #bf9342;
    --rinsp-text-color-violet: #aa4ec4;
    --rinsp-text-color-green: #2fa847;
    --rinsp-text-color-red: #a63232;
    --rinsp-text-color-blue: #4ca0d3;
    --rinsp-text-color-grey: #999;
    --rinsp-infscroll-divider-text-color: #556a71;
    --rinsp-infscroll-divider-border-color: #535c5c;
    --rinsp-infscroll-divider-background: #1e2d30;
    --rinsp-infscroll-loader-border-color: #555;
    --rinsp-infscroll-loader-background: #272727;
    --rinsp-infscroll-loader-progress: #444;
}

html.rinsp-dark-mode.rinsp-dark-theme-darkbeige {
    --rinsp-dm-color-black: #181818;
    --rinsp-dm-color-darkbg1: #1c1c19;
    --rinsp-dm-color-darkbg2: #26292b;
    --rinsp-dm-color-darkbg-hgt: #242d31;
    --rinsp-dm-color-darkbg-hover: #413d2c;
    --rinsp-dm-color-border: #666;
    --rinsp-dm-color-light-border: #AAA;
    --rinsp-dm-color-text: #BBB;
    --rinsp-dm-color-link: #BBB;
    --rinsp-dm-color-content-link: #6388A8;
    --rinsp-dm-color-content-link-hover: #8FB6D7;
    --rinsp-dm-color-heading: #a08c6c;
    --rinsp-dm-color-label: #BBB;
    --rinsp-dm-color-ctrl: #958568;
    --rinsp-dm-color-grey: #AAA;
    --rinsp-dm-button-bg: #4b0707;
}

html.rinsp-dark-mode.rinsp-dark-theme-darkblue {
    --rinsp-dm-color-black: #161b1f;
    --rinsp-dm-color-darkbg1: #0d0e14;
    --rinsp-dm-color-darkbg2: #0e1622;
    --rinsp-dm-color-darkbg-hgt: #151f25;
    --rinsp-dm-color-darkbg-hover: #363019;
    --rinsp-dm-color-border: #383d3e;
    --rinsp-dm-color-light-border: #666;
    --rinsp-dm-color-text: #BBB;
    --rinsp-dm-color-link: #CCC;
    --rinsp-dm-color-heading: #668184;
    --rinsp-dm-color-label: #999;
    --rinsp-dm-color-ctrl: #8faab1;
    --rinsp-dm-color-grey: #9a9a9a;
    --rinsp-dm-button-bg: #4b0707;
}

html.rinsp-dark-mode.rinsp-dark-theme-hcdarkbeige {
    --rinsp-dm-invert-filter-blk: invert(1) hue-rotate(180deg) saturate(1.2) contrast(0.91);
    --rinsp-dm-invert-filter-darkbg1: invert(1) hue-rotate(180deg) saturate(1.2) contrast(0.88) brightness(1.1);
    --rinsp-dm-hgt-text-filter: none;
    --rinsp-darkest-text-color: #EEE;
    --rinsp-dm-color-black: #000;
    --rinsp-dm-color-darkbg1: #111;
    --rinsp-dm-color-darkbg2: #161616;
    --rinsp-dm-color-darkbg-hgt: #242d31;
    --rinsp-dm-color-darkbg-hover: #413d2c;
    --rinsp-dm-color-border: #666;
    --rinsp-dm-color-light-border: #AAA;
    --rinsp-dm-color-text: #EEE;
    --rinsp-dm-color-link: #DDD;
    --rinsp-dm-color-heading: #e6b466;
    --rinsp-dm-color-label: #CCC;
    --rinsp-dm-color-ctrl: #d7aa5b;
    --rinsp-dm-color-grey: #AAA;
    --rinsp-dm-button-bg: #4b0707;
    --rinsp-dm-color-content-link: #64b7ff;
    --rinsp-dm-color-content-link-hover: #8FB6D7;
}

html.rinsp-dark-mode.rinsp-dark-theme-hcdarkblue {
    --rinsp-dm-invert-filter-blk: invert(1) hue-rotate(180deg) saturate(1.2) contrast(0.91);
    --rinsp-dm-invert-filter-darkbg1: invert(1) hue-rotate(180deg) saturate(1.2) contrast(0.88) brightness(1.1);
    --rinsp-dm-hgt-text-filter: none;
    --rinsp-dm-color-black: #000;
    --rinsp-dm-color-darkbg1: #111;
    --rinsp-dm-color-darkbg2: #161616;
    --rinsp-dm-color-darkbg-hgt: #242d31;
    --rinsp-dm-color-darkbg-hover: #363019;
    --rinsp-dm-color-border: #666;
    --rinsp-dm-color-light-border: #666;
    --rinsp-dm-color-text: #EEE;
    --rinsp-dm-color-link: #DDD;
    --rinsp-dm-color-heading: #9bd8e6;
    --rinsp-dm-color-label: #CCC;
    --rinsp-dm-color-ctrl: #88b5d7;
    --rinsp-dm-color-grey: #AAA;
    --rinsp-dm-button-bg: #4b0707;
    --rinsp-dm-color-content-link: #64b7ff;
    --rinsp-dm-color-content-link-hover: #8FB6D7;
}


html.rinsp-dark-mode.rinsp-dark-theme-darkgrey {
    --rinsp-dm-invert-filter-blk: invert(1) hue-rotate(180deg) saturate(1.2) contrast(0.91);
    --rinsp-dm-invert-filter-darkbg1: invert(1) hue-rotate(180deg) saturate(1.2) contrast(0.88) brightness(1.1);
    --rinsp-dm-color-black: #000;
    --rinsp-dm-color-darkbg1: #111;
    --rinsp-dm-color-darkbg2: #222;
    --rinsp-dm-color-darkbg-hgt: #333;
    --rinsp-dm-color-darkbg-hover: #444;
    --rinsp-dm-color-border: #444;
    --rinsp-dm-color-light-border: #666;
    --rinsp-dm-color-text: #BBB;
    --rinsp-dm-color-link: #999;
    --rinsp-dm-color-heading: #CCC;
    --rinsp-dm-color-label: #AAA;
    --rinsp-dm-color-ctrl: #999;
    --rinsp-dm-color-grey: #999;
    --rinsp-dm-button-bg: #440303;
}


html.rinsp-dark-mode.rinsp-dark-theme-hcdarkbeige body,
html.rinsp-dark-mode.rinsp-dark-theme-hcdarkblue body,
html.rinsp-dark-mode.rinsp-dark-theme-darkgrey body {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAD6AAAAAFCAMAAABmOOOEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRFGxsbLi4uMTExHR0dKysrREREICAgOjo6JiYmIyMjNzc3NTU1WlpaLCwsDAwMGRkZMVEcwAAAAK5JREFUeNrs28ERwyAMBEAZjLEdJ+m/26gNor3HFqAHww0o3t8MAODv2SKOa+5tjo+ILJFntv28j97DGQYANQgzAIAaRPTjPrOgP2qPyBoZWdDnlQV9c4YBQJH7mhkAQBEiXlcW9McLusg6BX2cWdA39zUAKEKYAQAUIdqRBX344i6yTkEfexb0Fu5rAFDlPcUMAKDKEnrPgj7soIusU9CflgX91XtYQgeAGvwEGADVjGYq2FVMyAAAAABJRU5ErkJggg==);
}

html.rinsp-dark-mode .menu .bor {
    border-color: var(--rinsp-dm-color-border);
}
html.rinsp-dark-mode .rinsp-thread-filter-menu-button:after {
    filter: brightness(2);
}

html.rinsp-dark-mode .rinsp-config-item-tip {
    color: #668ca2;
}

@media (max-width: 1278px) {
    html.rinsp-dark-mode .rinsp-pinuser-main:not(:empty) {
        background-image: url(data:image/gif;base64,R0lGODlhEAAFAIAAADMzMyMjIyH5BAAAAAAALAAAAAAQAAUAAAIOjAOHmtf2lmN0WljxRQUAOw==);
    }
}

html.rinsp-dark-mode body {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAD6AAAAAFCAMAAABmOOOEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRFJSUlNTU1ODg4JiYmR0dHKCgoLS0tKysrMjIyPj4+VlZWYWFhQkJCMzMzGBgYIyMjHMR+EwAAAK1JREFUeNrs28kRxCAMBEAZ8IG9R/7ZrtJg1fPoAPSgmALF+5sBAPw9W8R+vq42x0dElsgz23XMvfdwhgFADcIMAKAGEX2fRxb0R+0RWSMjC/rrzIK+OcMAoMh9zQwAoAgR7cyCfntBF1mnoI8jC/rmvgYARQgzAIAiRNuzoA9f3EXWKejjyoLewn0NAKq8p5gBAFRZQu9Z0IcddJF1CvrdsqC33sMSOgDU4CfAAHHlZhZqfHuaAAAAAElFTkSuQmCC);
}

html.rinsp-dark-mode {
    --rinsp-image-masking-filter: contrast(0%) brightness(30%) drop-shadow(0px 0px 1px #FFF);
}
html.rinsp-dark-mode #fav-fid li {
    filter: grayscale();
}
html.rinsp-dark-mode .guide li.current a {
    background: #822d2d8f;
}
html.rinsp-dark-mode .rinsp-quick-action-overlay:focus {
    background: #111A;
}

html.rinsp-dark-mode h1,
html.rinsp-dark-mode h2,
html.rinsp-dark-mode h3,
html.rinsp-dark-mode h4,
html.rinsp-dark-mode h5,
html.rinsp-dark-mode h6 {
    color: var(--rinsp-dm-color-heading);
}
html.rinsp-dark-mode body,
html.rinsp-dark-mode .gray2,
html.rinsp-dark-mode .gray3,
html.rinsp-dark-mode #honor {
    color: var(--rinsp-dm-color-ctrl);
}

html.rinsp-dark-mode td,
html.rinsp-dark-mode th,
html.rinsp-dark-mode #set-menu li a {
    color: var(--rinsp-dm-color-text);
}

html.rinsp-dark-mode #u-top-nav li a {
    background: transparent;
    color: var(--rinsp-dm-color-text);
}
html.rinsp-dark-mode #u-top-nav li:not(.current) {
    box-shadow: 0 1px 0 var(--rinsp-dm-color-border);
}

html.rinsp-dark-mode .gray,
html.rinsp-dark-mode .threadlist li a {
    color: var(--rinsp-dm-color-grey);
}

/* code block */
html.rinsp-dark-mode .blockquote2 ol li {
    background-color: unset;
}

/* thread list typical color headings */
html.rinsp-dark-mode .stream li .section-title a font[color="#0000FF"],
html.rinsp-dark-mode .t_one h3 > a > b > font[color="#0000FF"] {
    color: #0af;
}
html.rinsp-dark-mode .stream li .section-title a font[color="#FF0000"],
html.rinsp-dark-mode .t_one h3 > a > b > font[color="#FF0000"] {
    color: #f33;
}
html.rinsp-dark-mode .stream li .section-title a font[color="#FF00FF"],
html.rinsp-dark-mode .t_one h3 > a > b > font[color="#FF00FF"] {
    color: #e5f;
}


html.rinsp-dark-mode .tpc_content span[style="color:#000000 "] {
    color: unset !important;
}
html.rinsp-dark-mode .tpc_content span[style="background-color:#ffffff "] {
    background-color: unset !important;
}

html.rinsp-dark-mode .tpc_content span[style="color:#333333 "] {
    color: color: var(--rinsp-dm-color-grey) !important;
}

/* mobile version switcher / redirect landing page */
html.rinsp-dark-mode div[style^="padding:15px 60px;border:1px solid #eeeeee;background:#ffffff"],
html.rinsp-dark-mode #main > center.gray3 > div > a[href^="/simple/"] > div[style] {
    background-color: var(--rinsp-dm-color-black) !important;
    border-color: var(--rinsp-dm-color-black) !important;
    color: var(--rinsp-dm-color-border) !important;
}

html.rinsp-dark-mode #header .banner,
html.rinsp-dark-mode .rinsp-input-max-hint {
    filter: var(--rinsp-dm-invert-filter-blk);
}
html.rinsp-dark-mode #footer {
    background-color: var(--rinsp-dm-color-black);
    border-color: var(--rinsp-dm-color-border);
}
html.rinsp-dark-mode .gonggao {
    background-color: var(--rinsp-dm-color-black);
    border-color: var(--rinsp-dm-color-border);
}
html.rinsp-dark-mode .gongul {
    border-color: transparent;
}
html.rinsp-dark-mode .gonggao .gongul li {
    background: var(--rinsp-dm-color-darkbg1);
}
html.rinsp-dark-mode .gonggao .gongul .lin {
    border-color: var(--rinsp-dm-color-border);
}

html.rinsp-dark-mode body,
html.rinsp-dark-mode button,
html.rinsp-dark-mode input,
html.rinsp-dark-mode select,
html.rinsp-dark-mode textarea,
html.rinsp-dark-mode .tips,
html.rinsp-dark-mode .btn,
html.rinsp-dark-mode .abtn,
html.rinsp-dark-mode .set-h2 {
    color: var(--rinsp-dm-color-grey);
    background-color: var(--rinsp-dm-color-darkbg1);
}
html.rinsp-dark-mode th[bgcolor="#ffffff"],
html.rinsp-dark-mode .t_one,
html.rinsp-dark-mode .f_one,
html.rinsp-dark-mode .r_one {
    background: var(--rinsp-dm-color-darkbg1);
}
html.rinsp-dark-mode .card,
html.rinsp-dark-mode .f_two {
    background: var(--rinsp-dm-color-darkbg2);
}
html.rinsp-dark-mode .stream li .section-text > span {
    filter: invert(0.6);
}
html.rinsp-dark-mode .stream li .section-intro {
    filter: brightness(0.7);
}

html.rinsp-dark-mode .stream li {
    background: var(--rinsp-dm-color-darkbg1);
}
html.rinsp-dark-mode .stream li .section-title a {
    color: var(--rinsp-dm-color-link);
}

html.rinsp-dark-mode .t table {
    border-color: var(--rinsp-dm-color-darkbg1);
}
html.rinsp-dark-mode .tipad .fr a {
    color: var(--rinsp-dm-color-ctrl);
}

html.rinsp-dark-mode #breadcrumbs,
html.rinsp-dark-mode #set-side-wrap,
html.rinsp-dark-mode #u-wrap,
html.rinsp-dark-mode #u-wrap2,
html.rinsp-dark-mode #u-portrait,
html.rinsp-dark-mode .bgA {
    color: var(--rinsp-dm-color-label);
    background: var(--rinsp-dm-color-darkbg1);
    border-color: var(--rinsp-dm-color-border);
}
html.rinsp-dark-mode .tr2,
html.rinsp-dark-mode .h2,
html.rinsp-dark-mode .menu,
html.rinsp-dark-mode .user-infoWrap {
    color: var(--rinsp-dm-color-label);
    background: var(--rinsp-dm-color-darkbg2);
    border-color: var(--rinsp-dm-color-border);
}
html.rinsp-dark-mode .user-infoWrap {
    color: var(--rinsp-dm-color-text);
}
html.rinsp-dark-mode .user-info .co {
    filter: invert(0.5);
}

html.rinsp-dark-mode .h,
html.rinsp-dark-mode .t {
    color: var(--rinsp-dm-color-heading);
    background: var(--rinsp-dm-color-darkbg1);
    border-color: var(--rinsp-dm-color-border);
}
html.rinsp-dark-mode .u-h5 .r,
html.rinsp-dark-mode .u-h5 span {
    background: var(--rinsp-dm-color-darkbg1);
}

html.rinsp-dark-mode .r_two {
    background-color: var(--rinsp-dm-color-darkbg1);
    border-right: 1px dotted var(--rinsp-dm-color-border);
}
html.rinsp-dark-mode th.r_two > .user-pic.rinsp-userpic-sticky {
    background-color: var(--rinsp-dm-color-darkbg1);
}
html.rinsp-dark-mode .tr4 {
    background-color: var(--rinsp-dm-color-darkbg2);
}
html.rinsp-dark-mode .user-infoWraptwo {
    background-color: var(--rinsp-dm-color-darkbg2) !important;
}
html.rinsp-dark-mode .blockquote {
    background-color: var(--rinsp-dm-color-darkbg2);
}
html.rinsp-dark-mode .blockquote2,
html.rinsp-dark-mode .blockquote3 {
    background-color: var(--rinsp-dm-color-darkbg1);
    border-color: var(--rinsp-dm-color-border);
    color: var(--rinsp-dm-color-text);
}
html.rinsp-dark-mode input,
html.rinsp-dark-mode select,
html.rinsp-dark-mode textarea,
html.rinsp-dark-mode #editor-tool span {
    border-color: var(--rinsp-dm-color-border)
}

html.rinsp-dark-mode h1#subject_tpc {
    color: var(--rinsp-dm-color-heading) !important;
}
html.rinsp-dark-mode .rinsp-userframe-userinfo {
    background-color: var(--rinsp-dm-color-darkbg1);
}

html.rinsp-dark-mode img[src="images/colorImagination/post.png"]:not(:hover),
html.rinsp-dark-mode img[src="images/colorImagination/reply.png"]:not(:hover) {
    filter: brightness(0.7);
}
html.rinsp-dark-mode .pages,
html.rinsp-dark-mode .pages ul li,
html.rinsp-dark-mode .set-h2 {
    border-color: var(--rinsp-dm-color-border) !important;
}
html.rinsp-dark-mode .pages ul li b {
    background: var(--rinsp-dm-color-darkbg-hgt);
    color: var(--rinsp-dm-color-text);
}
html.rinsp-dark-mode .pages ul li a:hover {
    background-color: var(--rinsp-dm-color-darkbg2);
}

html.rinsp-dark-mode .rinsp-message-selection-panel,
html.rinsp-dark-mode #set-content {
    background: var(--rinsp-dm-color-darkbg);
    border-color: var(--rinsp-dm-color-darkbg1);
}
html.rinsp-dark-mode .menu #showface {
    background: var(--rinsp-dm-color-darkbg1) !important;
}
html.rinsp-dark-mode .menu #buttons.face {
    filter: var(--rinsp-dm-invert-filter);
}
html.rinsp-dark-mode #smiliebox {
    background: var(--rinsp-dm-color-darkbg1) !important;
    border-color: var(--rinsp-dm-color-darkbg1) !important;
}
html.rinsp-dark-mode #infobox {
    background: var(--rinsp-dm-color-black);
    border-color: var(--rinsp-dm-color-darkbg1);
}
html.rinsp-dark-mode .btn {
    background: var(--rinsp-dm-button-bg);
}
html.rinsp-dark-mode .t5,
html.rinsp-dark-mode .tips,
html.rinsp-dark-mode th,
html.rinsp-dark-mode td,
html.rinsp-dark-mode .btn,
html.rinsp-dark-mode .abtn,
html.rinsp-dark-mode #set-content-wrap {
    border-color: var(--rinsp-dm-color-border);
}
html.rinsp-dark-mode .blockquote {
    color: var(--rinsp-dm-color-text);
    border-color: var(--rinsp-dm-color-light-border);
    background: var(--rinsp-dm-color-darkbg1);
}
html.rinsp-dark-mode #editor-tab span,
html.rinsp-dark-mode #editor-button {
    color: #000;
    filter: var(--rinsp-dm-invert-filter-blk);
}
html.rinsp-dark-mode a {
    color: var(--rinsp-dm-color-link);
}
html.rinsp-dark-mode .tpc_content a {
    color: var(--rinsp-dm-color-content-link);
}
html.rinsp-dark-mode .tpc_content a:hover {
    color: var(--rinsp-dm-color-content-link-hover);
}

html.rinsp-dark-mode img[src="images/post/c_editor/del.gif"],
html.rinsp-dark-mode img[src="images/colorImagination/old.gif"],
html.rinsp-dark-mode img[src="images/colorImagination/new.gif"],
html.rinsp-dark-mode img[src="images/colorImagination/lock.gif"],
html.rinsp-dark-mode img[src^="images/post/editor/"],
html.rinsp-dark-mode img[src^="/images/post/smile/"],
html.rinsp-dark-mode img[src^="images/post/smile/"] {
    filter: var(--rinsp-dm-invert-filter-darkbg1);
}

html.rinsp-dark-mode .set-tab-table {
    background: transparent;
    border-bottom: 1px solid var(--rinsp-dm-color-border);
}
html.rinsp-dark-mode .set-tab-table td.current {
    background-color: var(--rinsp-dm-color-darkbg1);
    border-color: var(--rinsp-dm-color-light-border);
    color: var(--rinsp-dm-color-text);
    font-weight: normal;
    border-bottom: 1px solid var(--rinsp-dm-color-darkbg1);
    position: relative;
    top: 1px;
}
html.rinsp-dark-mode .set-tab-table td:not(.current) {
    border-color: transparent;
    position: relative;
    top: 1px;
}
html.rinsp-dark-mode .set-tab-table td.current a {
    color: var(--rinsp-dm-color-text);
}
html.rinsp-dark-mode .set-tab-box {
    border-color: transparent;
    background-color: var(--rinsp-dm-color-darkbg1);
}
html.rinsp-dark-mode .tt2 {
    border-color: var(--rinsp-dm-color-border);
}
html.rinsp-dark-mode .tt2 table {
    background: var(--rinsp-dm-color-darkbg1);
}
html.rinsp-dark-mode form[action="message.php"] .set-table2 > tbody > tr:not(.gray3):nth-child(odd) {
    background-color: var(--rinsp-dm-color-darkbg-hgt);
}
html.rinsp-dark-mode form[action="message.php"]:not([onsubmit="return checkCnt();"]) .set-table2 > tbody > tr:NOT(.gray3):hover {
    background-color: var(--rinsp-dm-color-darkbg-hover);
}
html.rinsp-dark-mode .set-table2 td {
    padding: .5em 1em;
    border-bottom: 1px dotted var(--rinsp-dm-color-light-border);
}
html.rinsp-dark-mode form[action="message.php"] a[href^="message.php?"]:not(.b) {
    color: var(--rinsp-dm-color-ctrl);
}

html.rinsp-dark-mode .z .tr3:hover,
html.rinsp-dark-mode .threadlist li a:hover {
    background-color: var(--rinsp-dm-color-black);
}
html.rinsp-dark-mode .menu .ul2 li a:hover,
html.rinsp-dark-mode .threadlist li.current a,
html.rinsp-dark-mode .threadlist li.current a:hover {
    background-color: var(--rinsp-dm-color-darkbg1);
    color: var(--rinsp-dm-color-text);
}

html.rinsp-dark-mode .rinsp-notification-item {
    background-color: var(--rinsp-dm-color-darkbg);
}
html.rinsp-dark-mode .rinsp-notification-item {
    color: var(--rinsp-dm-color-grey);
}
html.rinsp-dark-mode #peacemakerconfig .blackListPlan {
    filter: var(--rinsp-dm-invert-filter);
    border-color: transparent;
}

html.rinsp-dark-mode .rinsp-pinuser-item-face > div {
    background-color: var(--rinsp-dm-color-darkbg1);
}
html.rinsp-dark-mode .rinsp-pinuser-item:hover .rinsp-pinuser-item-face > div {
    background-color: var(--rinsp-dm-color-darkbg-hover);
}
html.rinsp-dark-mode .rinsp-thread-filter-like:not(.rinsp-thread-filter-dislike) {
    background: linear-gradient(to right, var(--rinsp-text-color-green) 2px, transparent 3px);
}
html.rinsp-dark-mode .rinsp-thread-filter-like:not(.rinsp-thread-filter-dislike):hover {
    background: linear-gradient(to right, var(--rinsp-text-color-green) 2px, #142707 3px, transparent 50%);
}

html.rinsp-dark-mode .rinsp-sharetype-filter {
    filter: var(--rinsp-dm-invert-filter-blk);
}
html.rinsp-dark-mode .rinsp-sharetype-filter > .rinsp-sharetype-item {
    color: #333;
}

html.rinsp-dark-mode .rinsp-visited-thread-view-mode .rinsp-thread-visited:not(:hover) {
    opacity: 0.7;
}
html.rinsp-dark-mode img[src="/images/noimageavailble_icon.png"] {
    filter: var(--rinsp-dm-invert-filter-blk);
    opacity: 0.5;
}
html.rinsp-dark-mode .u-table .fav.forum {
    background-image: url(data:image/gif;base64,R0lGODlhDgAMALMPAPPz87e3t7S0tPx6G8PDw+Tk5PDw8MrKyl285lKdzVaDrn9/f/r6+vxhAP///wAAACH5BAEAAA8ALAAAAAAOAAwAAARO8KlJ6bsS6b0VVkkojqGyMGiqossCHDBcAMZROMJiEDwxD4MCsLAoGI2MQaMxcCSLgWjAsaxSi4KsgFqt6gxgA4NbvbTOC4JDOcC43+4IADs=);
}
html.rinsp-dark-mode .u-table .fav.current {
    background-image: url(data:image/gif;base64,R0lGODlhDgAMAKIHAL29DcvGGKSrBZ6jA5CWANTLMlWAAAAAACH5BAEAAAcALAAAAAAOAAwAAAM0eGds+tCUWRxUkmjd2gpDKI4DEwhd2gQS5U5mts0EUxVCruu2BPxAYK8QKBqNw5fLoVIdEgA7);
}

html.rinsp-dark-mode .u-table .fav {
    background-image: url(data:image/gif;base64,R0lGODlhDgAMAKIGAMjIyLi4uK2traSkpNPT02pqagAAAAAAACH5BAEAAAYALAAAAAAOAAwAAAMvaFZc+rCQSRxUcmjd2iJCKI4CQwRd2lRUS5nZJg/wGdz4XQN839euFjA4cahUhgQAOw==);
}

html.rinsp-dark-mode .rinsp-reply-refresh-free.rinsp-refresh-free-submitting::after {
    background: #00000099;
}
html.rinsp-dark-mode .rinsp-thread-filter-pinned .tr1 .r_two,
html.rinsp-dark-mode .rinsp-thread-filter-pinned th.r_two > .rinsp-userpic-sticky {
    background-color: var(--rinsp-dm-color-darkbg1);
}

html.rinsp-dark-mode .rinsp-highlight-spots > dl {
    opacity: 0.8;
}
html.rinsp-dark-mode .t_one h3 > a > b > font[color] {
    filter: var(--rinsp-dm-hgt-text-filter) !important;
    opacity: 1 !important;
}

html.rinsp-dark-mode .rinsp-userframe-userinfo,
html.rinsp-dark-mode .rinsp-filter-ignored .r_one {
    background: transparent;
}
html.rinsp-dark-mode .rinsp-dialog-modal-mask {
    background: #0008;
}

html.rinsp-dark-mode .t_one td > a[title="打开新窗口"] {
    filter: var(--rinsp-dm-invert-filter-darkbg1);
}

html.rinsp-dark-mode .rinsp-answered-request-ignore-toggler,
html.rinsp-dark-mode .rinsp-unanswered-request-ignore-toggler,
html.rinsp-dark-mode .rinsp-expired-request-ignore-toggler {
    background: var(--rinsp-active-toggler-bg-color);
}

html.rinsp-dark-mode .jumbotron.rinsp-sell-free .btn-danger {
    background: #0f1e2d;
}
html.rinsp-dark-mode .jumbotron.rinsp-sell-5 .btn-danger {
    background: #312705;
}
html.rinsp-dark-mode .jumbotron.rinsp-sell-100 .btn-danger {
    background: #490909;
}
html.rinsp-dark-mode .jumbotron.rinsp-sell-high .s3 {
    background: transparent;
    outline-color: transparent;
}
html.rinsp-dark-mode .jumbotron.rinsp-sell-high .btn-danger {
    background: #950000;
}
html.rinsp-dark-mode .jumbotron.rinsp-sell-99999 .btn-danger {
    background: transparent;
    color: #fff;
    font-weight: normal;
}

html.rinsp-dark-mode .rinsp-pinuser-item-face img {
    filter: brightness(0.8) contrast(1.1);
}
html.rinsp-dark-mode .user-pic img {
    filter: brightness(0.8) contrast(1.1);
    border-color: var(--rinsp-dm-color-darkbg1);
    background: var(--rinsp-dm-color-darkbg1);
}

html.rinsp-dark-mode .rinsp-quickping-subject {
    background: var(--rinsp-dm-color-darkbg1);
    color: var(--rinsp-dm-color-text);
}
html.rinsp-dark-mode .rinsp-quickping-preview-section,
html.rinsp-dark-mode .rinsp-quickping-form dd {
    color: var(--rinsp-dm-color-text);
}
html.rinsp-dark-mode .h2 a.rinsp-quickping-status {
    filter: var(--rinsp-dm-invert-filter);
}
html.rinsp-dark-mode .h2 a.rinsp-instantping-button {
    color: #0ac679;
}
`;

const devCss = `
body .rinsp-dev-toggle {
    opacity: 1;
    cursor: default;
}
*:focus-visible {
    outline: none;
}
#header a[href][onclick^="ga("] {
    display: none;
}
`;

const RESOURCE_AREA_IDS = new Set([14,128,4,73,5,6,201,135,142]);
const PAYWALL_AREA_IDS = new Set([171,172,173,174]);

const DEV_MODE = checkDevMode();
const DEBUG_MODE = localStorage.getItem('rinsp-debug-mode') === '1';
const TEMP_INCREMENT = 10000;
const MIN_REQUEST_DELAY = 5000;
const MAX_ACC_REQUEST_RATE_COUNT = 20;
const MAX_ACC_REQUEST_RATE_BASE = 60000 * 5;
const MIN_CHECK_INTERVAL = 'MTA';
const MAX_CHECK_INTERVAL = 'ODAw';
const MIN_CHECK_INTERVAL_OLDEST_ITEM = 'NQ';
const MAX_CHECK_INTERVAL_OLDEST_ITEM = 'NjAw';
const MAX_WATCH_ITEM_COUNT = DEV_MODE&&'NTA'||'MjA';
const OLD_ITEM_THRESHOLD_DAYS = 14;
const OLD_ITEM_SCALING = 1.3;
const MAX_IGNORE_CONTENT_HTML_LENGTH = 2048;
const MAX_IGNORE_CONTENT_TEXT_LENGTH = 512;

const MAX_RECENT_ACCESS_LOG = DEV_MODE ? 5000 : 2000;

const WATCHER_POPUP_MENU_ID = 'rinsp-watcher-menu';
const IGNORE_LIST_POPUP_MENU_ID = 'rinsp-ignorelist-menu';
const THREAD_FILTER_POPUP_MENU_ID = 'rinsp-threadfilter-menu';
const THREAD_LIKE_POPUP_MENU_ID = 'rinsp-threadlike-menu';
const THREAD_FILTER_ACTION_POPUP_MENU_ID = 'rinsp-threadfilter-action-menu';
const USER_BOOKMARK_ACTION_POPUP_MENU_ID = 'rinsp-userbookmark-action-menu';
const SCORING_DIALOG_POPUP_MENU_ID = 'rinsp-scoring-dialog';
const LOADING_DIALOG_POPUP_MENU_ID = 'rinsp-loading-dialog';
const SCORING_REASON_TEMPLATE_POPUP_MENU_ID = 'rinsp-scoring-reasonlist-menu';

const darkModeEnabledProperty = createLocalStorageProperty('rinsp-dark-mode');
const darkModeThemeProperty = createLocalStorageProperty('rinsp-dark-theme', 'darkbeige');
const darkModeFollowsSystemProperty = createLocalStorageProperty('rinsp-dark-mode-auto');

const textEncoder = (function() {
    try {
        return new TextEncoder();
    } catch (e) {
        return null;
    }
})();

async function getNumMapValue(key) {
    const strValue = await GM.getValue(key);
    if (strValue) {
        try {
            const items = strValue.split(' ')
                .map(item => {
                    const pair = item.split(':');
                    return [ pair[0] * 1, (pair[1] * 1)||0 ];
                })
                .filter(pair => !Number.isNaN(pair[0]));
            return new Map(items);
        } catch (ex) {}
    }
    return new Map();
}

async function setNumMapValue(key, mapEntries) {
    const strValue = Array.from(mapEntries).map(entry => entry[1] > 0 ? `${entry[0]}:${entry[1]}` : `${entry[0]}`).join(' ');
    if (strValue) {
        await GM.setValue(key, strValue);
    } else {
        await GM.deleteValue(key).catch(ex => null);
    }
}

function createIdStore(namespace, bucketSize) {

    const indexKey = `${namespace}:index`;

    function getBucketKey(bucketId) {
        return `${namespace}:#${bucketId}`;
    }

    async function adjustCount(bucketId, adjustment) {
        const bucketSizeMap = await getNumMapValue(indexKey);
        const current = bucketSizeMap.get(bucketId) || 0;
        const newCount = current + adjustment;
        if (newCount > 0) {
            bucketSizeMap.set(bucketId, newCount);
        } else {
            bucketSizeMap.delete(bucketId);
        }
        await setNumMapValue(indexKey, bucketSizeMap.entries());
    }

    return {
        async set(id, numValue) {
            const bucketId = Math.floor(id / bucketSize);
            const localId = id % bucketSize;
            const localMap = await getNumMapValue(getBucketKey(bucketId));
            const current = localMap.get(localId);
            const newValue = numValue||0;
            if (current == null || current !== newValue) {
                localMap.set(localId, newValue);
                await setNumMapValue(getBucketKey(bucketId), localMap.entries());
            }
            if (current == null) {
                await adjustCount(bucketId, 1);
            }
        },
        async remove(id) {
            const bucketId = Math.floor(id / bucketSize);
            const localId = id % bucketSize;
            const localMap = await getNumMapValue(getBucketKey(bucketId));
            if (localMap.get(localId) != null) {
                localMap.delete(localId);
                await setNumMapValue(getBucketKey(bucketId), localMap.entries());
                await adjustCount(bucketId, -1);
            }
        },
        async get(id) {
            const bucketId = Math.floor(id / bucketSize);
            const localId = id % bucketSize;
            const localMap = await getNumMapValue(getBucketKey(bucketId));
            return localMap.get(localId);
        },
        async getBatch(ids) {
            if (ids.length === 0)
                return [];
            if (ids.length === 1)
                return [this.get(ids[0])];
            const buckets = new Map();
            const answer = ids.map(id => null);
            ids.forEach((id, i) => {
                const bucketId = Math.floor(id / bucketSize);
                const localId = id % bucketSize;
                const entry = [localId, i];
                let localEntries = buckets.get(bucketId);
                if (localEntries == null) {
                    localEntries = [entry];
                    buckets.set(bucketId, localEntries);
                } else {
                    localEntries.push(entry);
                }
            });
            async function loadBucket(bucketId, localEntries) {
                const localMap = await getNumMapValue(getBucketKey(bucketId));
                localEntries.forEach(localEntry => {
                    const value = localMap.get(localEntry[0]);
                    answer[localEntry[1]] = value >= 0 ? value : null;
                });
            }
            // console.info('buckets', buckets);
            const promises = [];
            Array.from(buckets.entries()).forEach(entry => {
                promises.push(loadBucket(entry[0], entry[1]));
            });
            await Promise.allSettled(promises);
            return answer;
        },
        async size() {
            const bucketSizeMap = await getNumMapValue(indexKey);
            let sum = 0;
            for (let count of bucketSizeMap.values()) {
                sum += count;
            }
            return sum;
        },
        async clear() {
            const keys = await GM.listValues();
            const results = [];
            keys.filter(key => key.startsWith(namespace + ':')).forEach(key => {
                results.push(GM.deleteValue(key));
            });
            await Promise.allSettled(results).catch(ex => null);
        }
    };
}

function createRecordStore(namespace, maxSize) {

    const indexKey = maxSize >= 0 ? `${namespace}:recent` : null;

    function getItemKey(id) {
        return `${namespace}:#${id}`;
    }

    return {
        async put(id, data) {
            if (indexKey) {
                const now = Date.now();
                const recordMap = await getNumMapValue(indexKey);
                const baseValueOffset = recordMap.get(0)||0; // special value
                recordMap.delete(0);
                const records = [];
                records.push([id, now]);
                recordMap.forEach((value, key) => {
                    if (key !== id) {
                        records.push([key, value + baseValueOffset]);
                    }
                });
                records.sort(comparator(1, true)); // bigger number first
                const removedRecords = [];
                while (records.length > maxSize) {
                    removedRecords.push(records.pop());
                }
                let minValue = records[records.length - 1][1];
                records.forEach(record => {
                    record[1] = record[1] - minValue;
                });
                records.push([0, minValue]);
                await setNumMapValue(indexKey, records);
                for (let removedRecord of removedRecords) {
                    await GM.deleteValue(getItemKey(removedRecord[0])).catch(ex => null);
                }
            }
            await GM.setValue(getItemKey(id), JSON.stringify(data));
        },
        async get(id) {
            const value = await GM.getValue(getItemKey(id));
            return value == null ? null : JSON.parse(value);
        },
        async remove(id) {
            await GM.deleteValue(getItemKey(id)).catch(ex => null);
            if (indexKey) {
                const recordMap = await getNumMapValue(indexKey);
                recordMap.remove(id);
                await setNumMapValue(indexKey, recordMap.entries());
            }
        },
        async list() {
            const keys = await GM.listValues();
            const queue = [];
            keys.filter(key => key.startsWith(namespace + ':#')).forEach(key => {
                queue.push(GM.getValue(key));
            });
            const values = await Promise.all(queue);
            return values.map(value => JSON.parse(value));
        },
        async clear() {
            const keys = await GM.listValues();
            const results = [];
            keys.filter(key => key.startsWith(namespace + ':')).forEach(key => {
                results.push(GM.deleteValue(key));
            });
            await Promise.allSettled(results).catch(ex => null);
        }
    };
}

function createUserHashLookupStore() {
    // uhashStore <uhash-base10: uid>
    return createIdStore('uhash_uid_mapping', 1000); // bucket size = 1000, DO NOT CHANGE
}

function createThreadHistoryStore(myUserId, userConfig) {
    if (!userConfig.keepVisitPostHistory) {
        return null;
    }

    // historyStore <tid: maxFloor>
    const historyStore = createIdStore(`tid_visit_history#${myUserId}`, 1000); // bucket size = 1000, DO NOT CHANGE
    const recentAccessStore = createRecordStore(`tid_recent#${myUserId}`, MAX_RECENT_ACCESS_LOG);
    return {
        historyStore, recentAccessStore
    };
}

function findMyUserId() {
    const userWrap = document.querySelector('#user_info #showface .user-infoWraptwo');
    if (userWrap != null) {
        const userMatch = userWrap.textContent.match(/\sUID: +(\d+)\s/);
        if (userMatch != null) {
            return userMatch[1] * 1;
        }
    }
    const selfInfo = document.querySelector('#menu_profile .ul2 a[href^="u.php?action-show-uid-"]');
    if (selfInfo != null && selfInfo.textContent === '查看个人资料') {
        return Number.parseInt(selfInfo.getAttribute('href').substring(22))||null;
    }
    return null;
}

function hasMentionedMe(title, myUserId, userConfig) {
    if (title.indexOf('@' + userConfig.myUserHashId) !== -1) // e.g. @a89f389e
        return true;
    if (new RegExp('(^|[^A-Za-z0-9])' + escapeRegExp(userConfig.myUserHashId) + '([^A-Za-z0-9]|$)').exec(title) != null) // e.g. a89f389e
        return true;
    
    if (new RegExp('(^|[^0-9])' + myUserId + '([^0-9]|$)').exec(title) != null) {
        if (title.indexOf('#' + myUserId) !== -1) // e.g. #1234567
            return true;
        if (title.match(/(^|[^a-z])u?id([^a-z]|$)/i) != null) // e.g. uid 1234567
            return true;
    }

    const nickNameNorm = (userConfig.myNickName||'').trim().replace(/\s+/, ' ');
    if (nickNameNorm) {
        const titleNorm = title.replace(/\s+/, ' ');
        if (new RegExp('@' + escapeRegExp(nickNameNorm)).exec(titleNorm) != null)
            return true;
        if (new RegExp('(^|请|给|用户|结算|\s|，|。|,|:)' + escapeRegExp(nickNameNorm) + '(\s|大佬|老哥|兄弟|用户|结算|请|，|。|,|$)').exec(titleNorm) != null)
            return true;
    }
}

function getDefaultRating(postTitle) {
    const ownBought = postTitle.match(/自购|自購/) != null;
    const ownTranslate = postTitle.match(/[个個]人(汉化|漢化|翻译|翻譯)/) != null;
    const sizeMatches = Array.from(postTitle.toUpperCase().replace(/\b(R18G)\b/g, '').matchAll(/(?<![0-9.])((?:\d\d?,?)?\d{1,3}(?:\.\d{1,3})?) *([GMKT](?:I?B)?)(?![A-Z])/g));

    // 10M = 1SP
    let baseTotalScore = 0;
    let resourceSizeTotalMB = null;
    let resourceSizeMBs = [];
    let resourceSizeTexts = [];
    if (sizeMatches.length > 0) {
        resourceSizeTotalMB = 0;
        sizeMatches.forEach(sizeMatch => {
            let matchSizeMB = sizeMatch[1].replace(/,/g, '') * 1;
            if (sizeMatch[2] === 'K' && (sizeMatch[1] === '2' || sizeMatch[1] === '4')) {
                // ignore 2K , 4K
                return;
            }
            switch (sizeMatch[2][0]) {
                case 'K':
                    matchSizeMB /= 1000;
                    break;
                case 'G':
                    matchSizeMB *= 1000;
                    break;
                case 'T':
                    matchSizeMB *= 1000000;
                    break;
                case 'M':
                default:
                    break;
            }
            resourceSizeTexts.push(sizeMatch[0]);
            resourceSizeMBs.push(matchSizeMB);
            resourceSizeTotalMB += matchSizeMB;
        });
        if (resourceSizeMBs.length === 1) {
            baseTotalScore = computeBaseScoreText(resourceSizeTotalMB) * 1;
        } else {
            baseTotalScore = 0;
        }
    }
    return {
        resourceSizeTexts,
        resourceSizeMBs,
        resourceSizeTotalMB,
        baseTotalScore,
        ownBought,
        ownTranslate
    };
}

function computeBaseScoreText(resourceSizeMB) {
    return Math.max(1, resourceSizeMB / 10).toFixed(1).replace(/\.0+$/, '');
}

const PAGE_TITLE_RULES = {
    u_php(queryParams, keyword, myUserId, userConfig, adminRole) {
        const myself = queryParams.uid == null || queryParams.uid * 1 === myUserId;
        let suffix = '';
        if (!myself && queryParams.uid) {
            const userId = queryParams.uid * 1;
            const knownUser = userConfig.customUserHashIdMappings['#' + userId];
            if (knownUser) {
                suffix += '| ' + knownUser[2];
            } else {
                suffix += '| #' + queryParams.uid;
            }
        }
        if (queryParams.action == null) {
            return queryParams.uid == null || myself ? '我的个人首页' : '个人首页' + suffix;
        } else if (queryParams.action === 'feed') {
            return myself ? '我的好友近况' : '好友近况' + suffix;
        } else if (queryParams.action === 'show') {
            return myself ? '我的资料' : '用户资料' + suffix;
        } else if (queryParams.action === 'topic') {
            return myself ? '我的主题' : '主题列表' + suffix;
        } else if (queryParams.action === 'post') {
            return myself ? '我的回复' : '回复列表' + suffix;
        } else if (queryParams.action === 'favor') {
            return myself ? '我的收藏' : '收藏列表' + suffix;
        } else if (queryParams.action === 'friend') {
            return myself ? '我的好友' : '好友列表' + suffix;
        } else if (queryParams.action === 'trade') {
            if (myself) {
                if (adminRole && queryParams.view === 'admin') {
                    return '我的管理记录';
                } else {
                    return '我的浏览记录';
                }
            } else if (adminRole) {
                return '不良记录' + suffix;
            } else {
                return '商品列表' + suffix;
            }
        }
    },
    profile_php(queryParams, keyword, myUserId, userConfig) {
        return '用户中心';
    },
    message_php(queryParams, keyword, myUserId, userConfig) {
        function withSubject(title) {
            const subjectCell = document.querySelector('#info_base .set-table2 > tbody > tr:nth-child(2) > td:nth-child(2)');
            if (subjectCell) {
                return title + '| ' + subjectCell.textContent;
            } else {
                return title;
            }
        }
        if (queryParams.action == null || queryParams.action === 'receivebox') {
            return '📩收件箱';
        } else if (queryParams.action == 'sendbox') {
            return '✉️发件箱';
        } else if (queryParams.action == 'readsnd') {
            return withSubject('✉️发件箱');
        } else if (queryParams.action == 'write') {
            if (queryParams.remid) {
                return '✉️' + keyword;
            } else {
                return '✳️发短信';
            }
        } else if (queryParams.action == 'read') {
            return withSubject('📩读短信');
        } else if (queryParams.action == 'scout') {
            return '✉️消息跟踪';
        } else if (queryParams.action == 'readscout') {
            return withSubject('✉️消息跟踪');
        } else if (queryParams.action == 'chatlog') {
            return withSubject('✉️通信记录');
        }
    },
    post_php(queryParams, keyword, myUserId, userConfig) {
        if (queryParams.action == null) {
            const currentArea = document.querySelector('#breadcrumbs > .crumbs-item.current > strong > a');
            return '✏️发新帖' + (currentArea ? '| ' + currentArea.textContent : '');
        } else if (queryParams.action == 'modify') {
            return '✏️编辑| ' + keyword;
        } else if (queryParams.action == 'reply') {
            return '↩️回帖| ' + keyword;
        }
    },
    search_php(queryParams, keyword, myUserId, userConfig) {
        const message = document.querySelector('#main .t .f_one td center');
        const prefix = keyword ? keyword + '| ' : '';
        if (message && message.textContent.trim() === '没有查找匹配的内容') {
            return prefix + '🚫没搜索结果';
        }
        const totalElem = document.querySelector('#main .bdbA + .t3 ~ .fr');
        if (totalElem) {
            const total = (totalElem.textContent.match(/共搜索到了(\d+)条信息/)||[])[1] * 1;
            if (total > 0) {
                return prefix + `🔍搜索到${total}条`;
            }
        }
        return prefix + '🔍搜索';
    },
    mawhole_php(queryParams, keyword, myUserId, userConfig) {
        switch (queryParams.action||'') {
            case 'headtopic': return '置顶| 帖子管理';
            case 'digest': return '精华| 帖子管理';
            case 'lock': return '锁定| 帖子管理';
            case 'pushtopic': return '提前| 帖子管理';
            case 'downtopic': return '压贴| 帖子管理';
            case 'edit': return '加亮| 帖子管理';
            case 'move': return '移动| 帖子管理';
            case 'copy': return '复制| 帖子管理';
            case 'unite': return '合并| 帖子管理';
            case 'del': return '删除| 帖子管理';
            default: return '帖子管理';
        }
    },
    masingle_php(queryParams, keyword, myUserId, userConfig) {
        switch (queryParams.action||'') {
            case 'banuser': return '禁言| 管理';
            case 'shield': return '屏蔽| 管理';
            case 'remind': return '提醒| 管理';
            case 'delatc': return '删除回复| 管理';
            default: return '管理';
        }
    },
    operate_php(queryParams, keyword, myUserId, userConfig) {
        switch (queryParams.action||new URLSearchParams(document.location.search).get('action')||'') {
            case 'showping': return '评分| 管理';
            default: return '管理';
        }
    },
    job_php(queryParams, keyword, myUserId, userConfig) {
        switch (queryParams.action||new URLSearchParams(document.location.search).get('action')||'') {
            case 'endreward': return '悬赏帖结案 | 管理';
            default: return '管理';
        }
    },
    sendemail_php(queryParams, keyword, myUserId, userConfig) {
        return '发送邮件';
    },
    member_php(queryParams, keyword, myUserId, userConfig) {
        return '会员列表';
    },
    sort_php(queryParams, keyword, myUserId, userConfig) {
        switch (queryParams.action||'') {
            case '': return '基本统计| 统计排行';
            case 'ipstate': return '到访IP统计| 统计排行';
            case 'team': return '管理团队| 统计排行';
            case 'admin': return '管理统计| 统计排行';
            case 'online': return '在线统计| 统计排行';
            case 'member': return '会员排行| 统计排行';
            case 'forum': return '版块排行| 统计排行';
            case 'article': return '帖子排行| 统计排行';
            default: return '统计排行';
        }
    },
    show_php(queryParams, keyword, myUserId, userConfig) {
        return '展区'; // dead area
    },
    push_php(queryParams, keyword, myUserId, userConfig) {
        return '推荐主题'; // dead area
    },
    forumcp_php(queryParams, keyword, myUserId, userConfig) {
        return '版块管理';
    },
    plugin_php(queryParams, keyword, myUserId, userConfig) {
        if (queryParams.H_name == 'tasks') {
            switch (queryParams.actions||'') {
                case '': return '新任务选择| 社区论坛任务';
                case 'newtasks': return '进行中任务| 社区论坛任务';
                case 'endtasks': return '已完成任务| 社区论坛任务';
                case 'errotasks': return '已失败任务| 社区论坛任务';
                default: return '社区论坛任务';
            }
        }
        return '附加功能';
    },
};

function enhancePageTitle(queryParams, myUserId, userConfig, adminRole) {
    const originalTitle = document.title;
    const parts = originalTitle.match(/^(?:(.+) )?([^ -]+\+[^+-]+) - powered by Pu!mdHd$/);
    if (parts == null) {
        return;
    }
    const keyTitle = (parts[1]||'').replace(/ ? - ?$/, '');
    const siteName = parts[2];
    const key = document.location.pathname.replace(/^\//, '').replace(/\./g, '_');
    const handler = PAGE_TITLE_RULES[key];
    let keyword = null;
    if (handler) {
        keyword = handler(queryParams, keyTitle||'', myUserId, userConfig, adminRole);
    }
    if (keyword == null) {
        keyword = keyTitle||'';
    }
    if (keyword) {
        document.title = keyword.trim() + ' - ' + siteName;
    } else {
        document.title = siteName;
    }
}

function initSiteMainMenu(hasManagementRole) {
    const mainGuideBar = document.querySelector('#guide');
    if (hasManagementRole) {
        // add link to 系统设置 if absent
        if (document.querySelector('#guide > li > a[href="admin.php"]') == null) {
            const adminItem = addElem(mainGuideBar, 'li');
            addElem(adminItem, 'a', null, { href: 'admin.php' }).textContent = '系统设置';
        }
    }
}

function addModalMask() {
    return addElem(document.body, 'div', 'rinsp-dialog-modal-mask');
}

function createPopupMenu(popupId, anchor, rightAligned, verticallyInverted) {
    function computeStyle(hShift) {
        if (anchor) {
            const bounds = anchor.getClientRects()[0];
            const left = bounds.x + hShift;
            if (verticallyInverted) {
                return 'opacity: 0.95; left: ' + left.toFixed(0) + 'px; z-index: 3000; visibility: visible; top: ' + (bounds.top + document.documentElement.scrollTop).toFixed(0) + 'px; transform: translateY(-100%);';
            } else {
                return 'opacity: 0.95; left: ' + left.toFixed(0) + 'px; z-index: 3000; visibility: visible; top: ' + (bounds.height + bounds.top + document.documentElement.scrollTop).toFixed(0) + 'px;';
            }
        } else {
            return 'position: fixed; opacity: 0.95; left: calc(50vw - 400px); z-index: 3000; visibility: visible; top: 10vh';
        }

    }
    const menuElem = addElem(document.body, 'div', 'menu rinsp-common-popup-menu', {
        id: popupId,
        style: computeStyle(0)
    });

    // just copy-n-paste from site, lol
    menuElem.innerHTML = `<div class="bor" style="padding:13px 30px"><img src="images/loading.gif" align="absbottom"> 正在加载数据...</div>`;

    return {
        renderContent(renderer) {
            menuElem.innerHTML = '';
            const borElem = addElem(menuElem, 'div', 'bor');
            renderer(borElem);
            if (rightAligned) {
                menuElem.setAttribute('style', computeStyle(-menuElem.getClientRects()[0].width));
            }
        }
    };
}

async function setupPopupMenu(config) {
    const menuConfig = {
        title: '',
        width: 120,
        popupMenuId: '',
        anchor: null,
        rightAligned: false,
        verticallyInverted: false,
        onClose: () => {},
        items: [] // [ { label, class, action } ]
    };
    Object.assign(menuConfig, config);

    const modelMask = addModalMask();
    const popupMenu = createPopupMenu(menuConfig.popupMenuId, menuConfig.anchor, menuConfig.rightAligned, menuConfig.verticallyInverted);
    function close() {
        modelMask.remove();
        closePopupMenu(menuConfig.popupMenuId);
        menuConfig.onClose();
    }
    modelMask.addEventListener('click', () => close());

    popupMenu.renderContent(async function(borElem) {
        const tableElem = addElem(borElem, 'table', null, {
            width: `${menuConfig.width}`,
            cellspacing: '0',
            cellpadding: '0'
        });

        const tbodyElem = addElem(tableElem, 'tbody');
        const trElem1 = addElem(tbodyElem, 'tr');
        const thElem1_1 = addElem(trElem1, 'th', 'h');
        const frElem1 = addElem(thElem1_1, 'span', 'fr', {
            style: 'margin-top:2px;cursor:pointer'
        });
        frElem1.addEventListener('click', () => close());
        addElem(frElem1, 'img', null, {
            src: 'images/close.gif'
        });
        thElem1_1.appendChild(document.createTextNode(menuConfig.title));

        function addButton(item) {
            const trElem = addElem(tbodyElem, 'tr');
            const tdElem = addElem(trElem, 'td', item.cellClass||null);
            const button = addElem(tdElem, 'a', item.class||null);
            button.textContent = item.label;
            if (item.action == null) {
                // nothing
            } else if (typeof item.action === 'string') {
                button.setAttribute('href', item.action);
                if (item.target) {
                    button.setAttribute('target', item.target);
                }
            } else {
                button.setAttribute('href', 'javascript:');
                button.addEventListener('click', () => {
                    close();
                    setTimeout(() => item.action());
                    return false;
                });
            }
            return button;
        }
        menuConfig.items.forEach(item => {
            addButton(item);
        });
    });
}

function closePopupMenu(popupId) {
    const menu = document.getElementById(popupId);
    if (menu) {
        menu.remove();
    }
}

async function showMessagePopup(message, anchor, autoCloseTimeout) {
    return runWithProgressPopup(async () => message, '', anchor, autoCloseTimeout);
}

async function runWithProgressPopup(action, loadingMessage, anchor, feedbackTimeout) {
    return new Promise((resolve, reject) => {
        const modelMask = addModalMask();
        const popupMenu = createPopupMenu(LOADING_DIALOG_POPUP_MENU_ID, anchor);
        popupMenu.renderContent(async function(borElem) {
            // not happy about copy-n-paste ...
            borElem.innerHTML = '';
            const loadingContent = addElem(borElem, 'div', null, { style: 'padding: 16px 30px' });
            addElem(loadingContent, 'img', null, { src: 'images/loading.gif', align: 'absbottom' });
            loadingContent.appendChild(document.createTextNode(loadingMessage + ' '));
            const customContent = addElem(borElem, 'div');
        
            action(customContent)
                .then(async status => {
                    borElem.innerHTML = '';
                    const loadingContent = addElem(borElem, 'div', null, { style: 'padding: 16px 30px; font-size: 1.5em' });
                    loadingContent.appendChild(document.createTextNode(status||'✔️已完成'));
                    await sleep(feedbackTimeout);
                    closePopupMenu(LOADING_DIALOG_POPUP_MENU_ID);
                    resolve();
                })
                .catch(ex => {
                    reject(ex);
                })
                .finally(() => modelMask.remove());
        });
    });
}

async function openTextListEditor(popupMenuId, config, callback) {
    const modelMask = addModalMask();
    const popupMenu = createPopupMenu(popupMenuId, null);
    
    const initContent = await config.read();
    popupMenu.renderContent(async function(borElem) {
        const tableElem = addElem(borElem, 'table', 'rinsp-textlist-popup-table', {
            width: '700',
            cellspacing: '0',
            cellpadding: '0'
        });

        const tbodyElem = addElem(tableElem, 'tbody');
        const trElem1 = addElem(tbodyElem, 'tr');
        const thElem1_1 = addElem(trElem1, 'th', 'h');
        const frElem1 = addElem(thElem1_1, 'span', 'fr', {
            style: 'margin-top:2px;cursor:pointer'
        });
        frElem1.addEventListener('click', function() {
            modelMask.remove();
            closePopupMenu(popupMenuId);
        });
        addElem(frElem1, 'img', null, {
            src: 'images/close.gif'
        });
        thElem1_1.appendChild(document.createTextNode(config.title));
        
        const trElem2 = addElem(tbodyElem, 'tr', 'tr2 tac');
        const tdElem2 = addElem(trElem2, 'td');
        if (config.description) {
            addElem(tdElem2, 'div', 'rinsp-textlist-description').textContent = config.description;
        }
        const editorTextArea = addElem(tdElem2, 'textarea', 'rinsp-textlist-editor');
        editorTextArea.value = initContent;

        const footer = addElem(borElem, 'ul', null, {
            style: 'text-align:center;padding:4px 0;'
        });
        const submitButton = addElem(footer, 'input', 'btn', { type: 'button', value: '保存' });
        submitButton.addEventListener('click', async function() {
            tableElem.classList.remove('rinsp-config-saving');
            await config.save(editorTextArea.value)
                .then(function() {
                    modelMask.remove();
                    closePopupMenu(popupMenuId);
                    if (callback) callback();
                })
                .finally(function() {
                    tableElem.classList.remove('rinsp-config-saving');
                });
        });
    });
}

function initConfigAccess(myUserId, configKey, defaultValue) {
    return {
        async read() {
            return readUserConfig(myUserId, configKey, defaultValue);
        },
        async write(newValue) {
            await GM.setValue(configKey + '#' + myUserId, JSON.stringify(newValue));
        },
        async update(updater) {
            return updateUserConfig(myUserId, updater, configKey, defaultValue);
        }
    };
}

async function readUserConfig(myUserId, configKey, defaultValue) {
    try {
        let savedData = await GM.getValue(configKey + '#' + myUserId);
        return Object.assign({}, defaultValue, JSON.parse(savedData));
    } catch (e) {}
    return Object.assign({}, defaultValue);
}

async function updateUserConfig(myUserId, updater, configKey, defaultValue) {
    let oldConfig = await readUserConfig(myUserId, configKey, defaultValue);
    let newConfig = await updater(oldConfig);
    if (newConfig != null) {
        await GM.setValue(configKey + '#' + myUserId, JSON.stringify(newConfig));
    }
    return newConfig;
}

async function populateThreadAccess(tid, myUserId, threadHistoryAccess) {
    const doc = await fetchGetPage(`${document.location.origin}/read.php?tid-${tid}.html`);
    const pageError = findErrorMessage(doc);
    if (pageError) {
        if (pageError.indexOf('数据已被删除') !== -1) {
            await recordThreadDeleted(tid, myUserId, threadHistoryAccess);
        } else {
            throw new Error(pageError);
        }
    } else {
        const posts = getPosts(doc);
        await recordThreadAccess(doc, posts, myUserId, threadHistoryAccess, {});
    }
}

async function recordThreadDeleted(tid, myUserId, threadHistoryAccess) {
    const lastAccessRecord = await threadHistoryAccess.recentAccessStore.get(tid);
    if (lastAccessRecord && !lastAccessRecord.deleted) {
        lastAccessRecord.deleted = true;
        await threadHistoryAccess.recentAccessStore.put(tid, lastAccessRecord);
    }
}

async function recordThreadAccess(doc, posts, myUserId, threadHistoryAccess, memoryObj) {
    const currentPostLink = doc.querySelector('#breadcrumbs .crumbs-item.current strong > a[href^="read.php?tid-"]');
    if (currentPostLink == null) {
        return;
    }
    const areaLink = currentPostLink.closest('.crumbs-item').previousElementSibling;
    if (!areaLink.matches('a[href^="thread.php?fid-"]')) {
        return;
    }
    const fid = Number.parseInt(areaLink.getAttribute('href').substring(15));
    const threadTitle = currentPostLink.textContent.trim();
    const tid = Number.parseInt(currentPostLink.getAttribute('href').substring(13));
    const areaName = areaLink.textContent.trim();
    const uid = posts[0].floor === 0 ? posts[0].postUid : 0;

    const lastPost = posts[posts.length - 1];
    const lastFloor = lastPost.floor;
    if (memoryObj.lastFloor !== lastFloor) {
        if (DEBUG_MODE) console.info('recordThreadAccess', tid, lastFloor);
        await threadHistoryAccess.historyStore.set(tid, lastFloor);
        memoryObj.lastFloor = lastFloor;
    }

    const bountyStatus = getBountyStatus(doc);
    if (memoryObj.lastAccessRecord == null) {
        memoryObj.lastAccessRecord = await threadHistoryAccess.recentAccessStore.get(tid);
    }
    function getNewRecord(lastAccessRecord) {
        let hasBoughtAny = false;
        let lastReplied = 0;
        posts.forEach(post => {
            if (post.postUid === myUserId) {
                if (post.floor > lastReplied) {
                    lastReplied = post.floor;
                }
            } else {
                if (post.contentElem.querySelector('h6.quote.jumbotron + blockquote.jumbotron') != null) {
                    hasBoughtAny = true;
                }
            }
        });

        const newRecord = {
            tid, uid, fid, area: areaName, title: threadTitle, time: Date.now(), bought: hasBoughtAny, replied: lastReplied, bounty: bountyStatus
        };
        if (lastAccessRecord == null) {
            return newRecord;
        }
        if ((lastAccessRecord.replied||0) > lastReplied) {
            newRecord.replied = lastAccessRecord.replied;
        }
        if (bountyStatus == null && lastAccessRecord.bounty != null) {
            newRecord.bounty = lastAccessRecord.bounty;
        }
        let savingRecord = null;
        if (lastAccessRecord.initialTitle) {
            newRecord.initialTitle = lastAccessRecord.initialTitle;
        }
        if (lastAccessRecord.title !== threadTitle) {
            newRecord.bought = newRecord.bought || lastAccessRecord.bought;
            if (!newRecord.initialTitle) {
                newRecord.initialTitle = lastAccessRecord.title;
            }
            savingRecord = newRecord;
        }
        if (!lastAccessRecord.bought && newRecord.bought) {
            savingRecord = newRecord;
        }
        if (!lastAccessRecord.uid && newRecord.uid > 0) {
            savingRecord = newRecord;
        }
        if (lastReplied > (lastAccessRecord.replied||0)) {
            savingRecord = newRecord;
        }
        if (bountyStatus != null) {
            if (lastAccessRecord.bounty == null || lastAccessRecord.bounty.ended != bountyStatus.ended) {
                savingRecord = newRecord;
            }
        }
        return savingRecord;
    }
    const newRecord = getNewRecord(memoryObj.lastAccessRecord);
    if (newRecord) {
        if (DEBUG_MODE) console.info('recordThreadAccess', tid, newRecord);
        await threadHistoryAccess.recentAccessStore.put(tid, newRecord);
        memoryObj.lastAccessRecord = newRecord;
    }
}

function checkManagementRole(myUserId, userConfig, mainConfigAccess) {
    if (document.querySelector('#guide > li > a[href="admin.php"]') != null) {
        return true;
    }
    let hasManageRole = false;
    const userNavTopicLink = document.querySelector('#user_info .fl > .link5[href="u.php?action-topic.html"]');
    if (userNavTopicLink) {
        let rank = (userNavTopicLink.parentElement.textContent.match(/等级:([^,]+),/)||[])[1];
        hasManageRole = ['管理员', '总版主', '论坛版主'].includes(rank);
        if (hasManageRole !== userConfig.hasSeenAdminRole) {
            userConfig.hasSeenAdminRole = hasManageRole;
            mainConfigAccess.update(updatingUserConfig => {
                updatingUserConfig.hasSeenAdminRole = hasManageRole;
                return updatingUserConfig;
            });
        }
    } else {
        // some pages do not have rank information visible, use cached state instead
        hasManageRole = !!userConfig.hasSeenAdminRole;
    }
    return hasManageRole;
}

function showNativeWarningPopup(msg) {
    try {
        unsafeWindow.ajax.request = unsafeWindow.Object();
        unsafeWindow.ajax.request.responseText = msg;
        unsafeWindow.ajax.guide();
    } catch (ignore) {
        alert(msg);
    }
}

function showNativeSpinner(anchor) {
    try {
        unsafeWindow.read.obj = anchor;
        unsafeWindow.read.guide();
    } catch (ignore) {}
}
function closeNativeSpinner() {
    try {
        unsafeWindow.closep();
    } catch (ignore) {}
}

function addFloatingFavorButton(topControlContainer, tid, favorThreadsCacheAccess) {
    const storeButton = addElem(topControlContainer, 'a', 'rinsp-excontrol-item rinsp-excontrol-item-ticker');
    storeButton.classList.add('rinsp-excontrol-item-favor');
    storeButton.classList.add('rinsp-running');
    storeButton.textContent = '✨\n收\n藏';
    storeButton.addEventListener('click', async () => {
        showNativeSpinner();
        let favId = storeButton.dataset.favId * 1;
        if (favId) {
            let data;
            if (favId === -1) {
                data = await readFavorRecords(favorThreadsCacheAccess, true, false);
                if (Object_hasOwn(data, tid)) {
                    favId = data[tid].id;
                } else {
                    favId = null;
                }
            } else {
                data = await readFavorRecords(favorThreadsCacheAccess, false, false);
            }
            delete data[tid];
            await favorThreadsCacheAccess.write(data);
            if (favId != null) {
                const postData = new FormData();
                postData.set('verify', verifyhash());
                postData.set('selid[]', favId);
                postData.set('type', 0);
                postData.set('job', 'clear');
                await fetch(`${document.location.origin}/u.php?action=favor`, {
                    method: 'POST',
                    mode: 'same-origin',
                    credentials: 'same-origin',
                    body: postData
                })
                .then(resp => {
                    if (!resp.ok) throw Error();
                })
                .then(() => {
                    storeButton.dataset.favId = 0;
                    storeButton.classList.remove('rinsp-active');
                })
                .catch(ex => {
                    showNativeWarningPopup('操作出错');
                })
                .finally(() => closeNativeSpinner());
            }
        } else {
            fetchGetPage(`${document.location.origin}/pw_ajax.php?action=favor&tid=${tid}&type=0&nowtime=${Date.now()}&verify=${verifyhash()}`, 'text/xml')
                .then(async xml => {
                    const msg = xml.childNodes[0].textContent;
                    if (['您已经收藏了该主题', '帖子收藏成功!'].includes(msg)) {
                        await favorThreadsCacheAccess.update(cache => {
                            if (cache && cache.data) {
                                if (Object_hasOwn(cache.data, tid)) {
                                    return null;
                                }
                                cache.data[tid] = { tid: tid };
                                return cache;
                            } else {
                                return { data: {}, time: 0 };
                            }
                        });
                    } else {
                        throw msg;
                    }
                })
                .then(() => {
                    storeButton.dataset.favId = -1;
                    storeButton.classList.add('rinsp-active');
                })
                .catch(msg => {
                    showNativeWarningPopup('' + msg);
                })
                .finally(() => closeNativeSpinner());
        }
    });

    readFavorRecords(favorThreadsCacheAccess)
        .catch(ex => null)
        .then(data => {
            storeButton.classList.remove('rinsp-running');
            const favId = data && Object_hasOwn(data, tid) ? data[tid].id || -1 : 0;
            storeButton.dataset.favId = favId;
            if (favId) {
                storeButton.classList.add('rinsp-active');
            }
        });
}

function readFavorList(doc) {
    const items = {};
    doc.querySelectorAll('#u-contentmain .u-table tr > th > a[href^="read.php?tid-"]').forEach(a => {
        const id = a.closest('tr').querySelector('input[name="selid[]"]').value * 1;
        const tid = Number.parseInt(a.getAttribute('href').substring(13));
        const opLink = a.closest('tr').querySelector('a[href^="u.php?uid-"]');
        const opId = Number.parseInt(opLink.getAttribute('href').substring(10));
        const category = opLink.closest('td').nextElementSibling.textContent.trim();
        items[tid] = {
            id,
            tid,
            op: opId,
            category
        };
    });
    return items;
}

function readCurrentAndMaxPage(doc) {
    let currentPage = 1;
    let maxPage = 1;
    const pagesElem = doc.querySelector('.pages li.pagesone');
    if (pagesElem != null) {
        let match = pagesElem.textContent.replace(/\u00a0/g, ' ').match(/Pages: *(\d+)[^\/]*\/ *(\d+) */);
        if (match != null) {
            currentPage = Number.parseInt(match[1]);
            maxPage = Number.parseInt(match[2]);
        }
    }
    return [currentPage, maxPage];
}

function isCurrentThreadMatchingFid(fid) {
    if (document.location.pathname === '/thread.php') {
        return document.location.search.startsWith(`?fid-${fid}-`) ||
               document.location.search.startsWith(`?fid-${fid}.`) ||
               document.location.search.startsWith(`?fid=${fid}&`) ||
               document.location.search.endsWith(`?fid=${fid}`) ||
               document.location.search.indexOf(`&fid=${fid}&`);
    }
    return false;
}

function addBackToTopButton(container) {
    const button = addElem(container, 'a', 'rinsp-excontrol-item rinsp-excontrol-totop rinsp-opacity-0');
    button.addEventListener('click', () => {
        document.body.querySelector('#toptool').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    function checkScroll() {
        if (document.documentElement.scrollTop > 30) {
            button.classList.remove('rinsp-opacity-0');
        } else {
            button.classList.add('rinsp-opacity-0');
        }
    }
    document.addEventListener('scroll', () => {
        checkScroll();
    });
    setTimeout(checkScroll);
}

async function addSearchBar(queryParams, searchConfigAccess, userConfig) {
    const guide = document.querySelector('#guide');
    if (guide == null) {
        return;
    }
    const searchPref = await searchConfigAccess.read();
    guide.classList.add('rinsp-quicksearch-added');
    const quicksearchForm = newElem('form', 'rinsp-quicksearch', {
        method: 'post',
        action: '/search.php?'
    });
    function setFormTarget(forceNewWindow) {
        quicksearchForm.setAttribute('target', forceNewWindow || document.location.pathname !== '/search.php' ? '_blank' : '_self');
    }
    function addHiddenField(k, v) {
        return addElem(quicksearchForm, 'input', null, { type: 'hidden', name: k, value: v });
    }
    const keywordDataField = addHiddenField('keyword', '');
    addHiddenField('step', '2');
    addHiddenField('method', searchPref.defaultSearchAll ? 'AND' : 'OR');
    addHiddenField('sch_time', searchPref.defaultTimeRange||'all');
    addHiddenField('pwuser', '');
    addHiddenField('sch_area', '0');
    addHiddenField('f_fid', 'all');
    addHiddenField('orderway', 'postdate');
    addHiddenField('asc', 'DESC');

    if (userConfig.showSearchBar$align === 'menu-first') {
        guide.insertBefore(quicksearchForm, guide.firstChild);
    } else if (userConfig.showSearchBar$align === 'bar-center') {
        let gap = guide.getBoundingClientRect().width - 250;
        guide.classList.add('rinsp-quicksearch-align-center');
        guide.insertBefore(newElem('li', 'rinsp-spacer'), guide.firstChild);
        guide.insertBefore(quicksearchForm, guide.firstChild);
        guide.insertBefore(newElem('li', 'rinsp-spacer'), guide.firstChild);
        guide.insertBefore(newElem('li', null, { style: `flex: 0 1 ${gap.toFixed(0)}px` }), guide.firstChild);
    } else {
        guide.appendChild(quicksearchForm);
    }
    const searchField = addElem(quicksearchForm, 'input', 'rinsp-quicksearch-field', { required: '', value: queryParams.keyword||'' });
    const searchButton = addElem(quicksearchForm, 'a', 'rinsp-quicksearch-button');
    searchButton.addEventListener('click', evt => {
        if (beforeSubmit(evt.shiftKey)) {
            quicksearchForm.submit();
        } else {
            searchField.focus();
        }
    });
    quicksearchForm.addEventListener('submit', evt => {
        evt.stopPropagation();
        if (!beforeSubmit()) {
            evt.preventDefault();
            return false;
        }
    });
    function beforeSubmit(forceNewWindow) {
        keywordDataField.value = '';
        let keyword = searchField.value.trim();
        if (keyword.length === 0) {
            return false;
        }
        if (keyword.match(/^[\x00-\x7F]+$/)) {
            switch (keyword.replace(/\s/g, '').length) {
            case 0:
                return false;
            case 1:
                keyword = keyword + ' ' + keyword + ' ' + keyword;
                break;
            case 2:
                keyword = keyword + ' ' + keyword;
                break;
            }
        }
        keyword = keyword.replace(/\s+/g, ' ');
        keywordDataField.value = keyword;
        quicksearchForm.setAttribute('action', `/search.php?keyword-${encodeURIComponent(keyword).replace(/-/g, '%2D')}.html`);
        setFormTarget(forceNewWindow);
        return true;
    }
}

async function init() {
    // improve hover popup closing mechanism to avoid closing still active popups
    const scpt = document.createElement('script');
    scpt.textContent = `
    if (window['PwMenu']) {
        PwMenu.prototype.close = function() {
            read.t = setTimeout(() => {if (!read.menu.matches(':hover')) {closep()}}, 100);
        };
    }
    `;
    document.head.appendChild(scpt);

    // start main script
    const myUserId = findMyUserId();
    if (myUserId == null) {
        if (DEV_MODE) console.info('(southplus-watcher) cannot find user id');
        return;
    }

    let domainRedirectTarget = await getDomainRedirectTarget();
    if (domainRedirectTarget != null && domainRedirectTarget !== document.location.origin) {
        setDomainRedirectEnabled(true); // update target domain
        domainRedirectTarget = document.location.origin;
    }

    const mainConfigAccess = initConfigAccess(myUserId, MAIN_CONFIG_KEY, DEFAULT_MAIN_CONFIG);
    const searchConfigAccess = initConfigAccess(myUserId, SEARCH_CONFIG_KEY, DEFAULT_SEARCH_CONFIG);
    const contentIgnoreListConfigAccess = initConfigAccess(myUserId, CONTENT_IGNORE_LIST_CONFIG_KEY, DEFAULT_CONTENT_IGNORE_LIST_CONFIG);
    const threadFilterConfigAccess = initConfigAccess(myUserId, THREAD_FILTER_CONFIG_KEY, DEFAULT_THREAD_FILTER_CONFIG);
    const threadCategoryConfigAccess = initConfigAccess(myUserId, THREAD_CUSTOM_CATEGORY_CONFIG_KEY, DEFAULT_THREAD_CUSTOM_CATEGORY_CONFIG);
    const userFilterConfigAccess = initConfigAccess(myUserId, USER_FILTER_CONFIG_KEY, DEFAULT_USER_FILTER_CONFIG);
    const pinnedUsersConfigAccess = initConfigAccess(myUserId, PINNED_USERS_CONFIG_KEY, DEFAULT_PINNED_USERS_CONFIG);
    const sharetypeFilterConfigAccess = initConfigAccess(myUserId, SHARETYPE_FILTER_CONFIG_KEY, DEFAULT_SHARETYPE_FILTER_CONFIG);
    const favorThreadsCacheAccess = initConfigAccess(myUserId, FAVOR_THREADS_CACHE_CONFIG_KEY, DEFAULT_FAVOR_THREADS_CACHE_CONFIG);

    let userConfig = await mainConfigAccess.read();
    if (!userConfig.v15migrationApplied) {
        let migratedUserConfig = await mainConfigAccess.update(function(updatingUserConfig) {
            if (updatingUserConfig.v15migrationApplied) {
                return null;
            }
            const spuUserIds = new Set();
            Object.keys(updatingUserConfig.customUserHashIdMappings)
                .forEach(key => {
                    if (key[0] === '#') {
                        spuUserIds.add(key);
                    }
                });
            Object.entries(updatingUserConfig.customUserHashIdMappings)
                .forEach(entry => {
                    if (entry[0][0] === '@') {
                        spuUserIds.delete('#' + entry[1][0]);
                    }
                });
            for (let spuUserId of spuUserIds) {
                delete updatingUserConfig.customUserHashIdMappings[spuUserId];
            }
            updatingUserConfig.v15migrationApplied = true;
            return updatingUserConfig;
        });
        if (migratedUserConfig != null) {
            userConfig = migratedUserConfig;
        }
    }
    if (!userConfig.v42migrationApplied) {
        let migratedUserConfig = await mainConfigAccess.update(function(updatingUserConfig) {
            if (updatingUserConfig.v42migrationApplied) {
                return null;
            }
            const newMappings = {};
            Object.entries(updatingUserConfig.customUserHashIdMappings)
                .forEach(entry => {
                    if (entry[0][0] === '#') {
                        let userHashId = entry[1][1];
                        if (typeof userHashId === 'object' && typeof userHashId.hashId === 'string') {
                            userHashId = userHashId.hashId;
                        }
                        let newRecord = [entry[1][0] * 1, userHashId, entry[1][2]];
                        newMappings['#' + newRecord[0]] = newRecord;
                        newMappings['@' + newRecord[1]] = newRecord;
                    }
                });
            updatingUserConfig.customUserHashIdMappings = newMappings;
            updatingUserConfig.v42migrationApplied = true;
            return updatingUserConfig;
        });
        if (migratedUserConfig != null) {
            userConfig = migratedUserConfig;
        }
    }

    for (let i = userConfig.textSize * 1; i > 0; i--) {
        document.documentElement.classList.add('rinsp-textsize-step-' + i);
    }
    if (userConfig.siteThemeDarkerSubjectLine) {
        document.body.classList.add('rinsp-theme-darksubject');
    }
    if (userConfig.hideMobileVerSwitch) {
        document.body.classList.add('rinsp-hide-mobileswitch');
    }

    let showResourceSpots = null;
    Object.keys(DEFAULT_MAIN_CONFIG).filter(k => k.startsWith('showResourceSpots$')).forEach(k => {
        if (userConfig[k]) {
            showResourceSpots = showResourceSpots || {};
            showResourceSpots[k.substring(18)] = true;
        }
    });

    // 所在地是免空区
    const inResourceArea = document.querySelector('#breadcrumbs .crumbs-item[href="thread.php?fid-13.html"] + .crumbs-item') != null;

    // 所在地是事务受理
    const inOfficeArea = document.querySelector('#breadcrumbs .crumbs-item[href="thread.php?fid-2.html"] + .crumbs-item') != null;

    // 所在地是网赚区
    const inPaywallArea = document.querySelector('#breadcrumbs .crumbs-item[href="thread.php?fid-170.html"] + .crumbs-item') != null;
    const hasManagementRole = checkManagementRole(myUserId, userConfig, mainConfigAccess);

    initSiteMainMenu(hasManagementRole);
    const pendingWatchItemChecks = new Set();

    if (userConfig.floatingShortcut !== 'off') {
        const quickActionOverlay = addElem(document.body, 'div', 'rinsp-quick-action-overlay', { tabindex: "1" });
        quickActionOverlay.addEventListener('click', evt => {
            evt.stopPropagation();
        });
        document.body.addEventListener('click', () => {
            if (document.activeElement === quickActionOverlay) {
                quickActionOverlay.blur();
            }
        });
        addElem(quickActionOverlay, 'label', null, { version: VERSION_TEXT }).textContent = '⚙️';
    
        addElem(quickActionOverlay, 'div', 'rinsp-quick-action', { label: '🚫屏蔽关键词' })
            .addEventListener('mousedown', () => {
                openIgnoreThreadEditor(() => {
                    userPinArea.fireUpdateListeners();
                });
            });
    
        addElem(quickActionOverlay, 'div', 'rinsp-quick-action', { label: '💚喜欢关键词' })
            .addEventListener('mousedown', () => {
                openLikeThreadEditor(() => {
                    userPinArea.fireUpdateListeners();
                });
            });
    
        addElem(quickActionOverlay, 'div', 'rinsp-quick-action-divider');
    
        addElem(quickActionOverlay, 'div', 'rinsp-quick-action rinsp-dark-mode-toggle')
            .addEventListener('mousedown', () => {
                darkModeEnabledProperty.set(darkModeEnabledProperty.get() ? null : '1');
                applyDarkTheme();
            });
    
        addElem(quickActionOverlay, 'div', 'rinsp-quick-action rinsp-safe-mode-toggle')
            .addEventListener('mousedown', () => {
                setSafeMode(!isSafeMode());
            });
    
        addElem(quickActionOverlay, 'div', 'rinsp-quick-action-divider');
    
        addElem(quickActionOverlay, 'div', 'rinsp-quick-action', { label: '🔧设置页' })
            .addEventListener('mousedown', () => {
                document.location.href = '/u.php';
            });
        if (userConfig.floatingShortcut === 'tl') {
            quickActionOverlay.classList.add('rinsp-quick-action-overlay-pos-tl');
        } else {
            quickActionOverlay.classList.add('rinsp-quick-action-overlay-pos-tr');
        }
    }

    const notificationContainer = addElem(document.body, 'div', 'rinsp-notification-container');
    const extraControlContainer = addElem(document.body, 'div', 'rinsp-excontrol-container');
    const topControlContainer = addElem(document.body, 'div', 'rinsp-tpcontrol-container');
    const bottomControlContainer = addElem(document.body, 'div', 'rinsp-bmcontrol-container');
    const pmNotificationElem = addElem(notificationContainer, 'a', 'rinsp-notification-item rinsp-notification-item-type-pm');
    const watchNotificationElem = addElem(notificationContainer, 'div', 'rinsp-notification-item rinsp-notification-item-type-watch');
    if (userConfig.showBackToTopButton) {
        addBackToTopButton(bottomControlContainer);
    }

    function addIgnoreToggler(togglerClass, modeActiveClass, modeInactiveClass) {
        const lastStateKey = 'rinplus.mode.' + togglerClass + '.laststate';
        const togglerElem = addElem(extraControlContainer, 'a', 'rinsp-excontrol-item rinsp-excontrol-item-hidden');
        togglerElem.classList.add(togglerClass);
        togglerElem.addEventListener('click', function() {
            let newValue = !isActive();
            setActive(newValue);
            if (newValue) {
                localStorage.setItem(lastStateKey, '1');
            } else {
                localStorage.setItem(lastStateKey, '0');
            }
        });
        function restoreLastState(defaultActive) {
            const savedValue = localStorage.getItem(lastStateKey);
            if (defaultActive && savedValue !== '0') {
                setActive(true);
            } else {
                setActive(savedValue === '1');
            }
        }
        function isActive() {
            return document.body.classList.contains(modeActiveClass);
        }
        function setActive(active) {
            if (active) {
                document.body.classList.add(modeActiveClass);
                if (modeInactiveClass) {
                    document.body.classList.remove(modeInactiveClass);
                }
            } else {
                document.body.classList.remove(modeActiveClass);
                if (modeInactiveClass) {
                    document.body.classList.add(modeInactiveClass);
                }
            }
        }
        function setCount(count) {
            togglerElem.innerHTML = '';
            if (count !== 0) {
                togglerElem.classList.remove('rinsp-excontrol-item-hidden');
                addElem(togglerElem, 'span', `rinsp-excontrol-item-count rinsp-excontrol-item-count-${(''+count).length}d`).textContent = String(count);
            } else {
                togglerElem.classList.add('rinsp-excontrol-item-hidden');
            }
        }
        return {
            isActive,
            setActive,
            restoreLastState,
            setCount
        };
    }

    document.body.addEventListener('click', evt => {
        if (!evt.target) {
            return;
        }
        if (evt.target.classList.contains('r_two')) {
            const row = evt.target.closest('table');
            if (!row || !row.classList.contains('rinsp-filter-ignored')) {
                return;
            }
            document.body.classList.add('rinsp-filter-peek-mode');
            evt.target.scrollIntoView({
                behavior: 'auto',
                block: 'center'
            });
        }
        if (evt.target.tagName === 'TD' && (evt.target.getAttribute('id')||'').startsWith('td_')) {
            if (evt.target.parentNode.classList.contains('rinsp-thread-filter-dislike') || evt.target.parentNode.classList.contains('rinsp-thread-filter-masked-bysharetype')) {
                document.body.classList.add('rinsp-dislike-thread-peek-mode');
                evt.target.parentNode.scrollIntoView({
                    behavior: 'auto',
                    block: 'center'
                });
            } else if (evt.target.parentNode.classList.contains('rinsp-request-settlement-thread') && !evt.target.parentNode.classList.contains('rinsp-request-settlement-bypass')) {
                document.body.classList.add('rinsp-settlement-peek-mode');
                evt.target.scrollIntoView({
                    behavior: 'auto',
                    block: 'center'
                });
            }
        }
    });

    const userHashLookupStore = createUserHashLookupStore();
    const threadHistoryAccess = createThreadHistoryStore(myUserId, userConfig);
    const adminFunctions = (() => {
        if (!hasManagementRole) {
            return null;
        }
        const userPunishRecordStore = createRecordStore(`user_punish#${myUserId}`);
        return initAdminFunctions(myUserId, userConfig, userPunishRecordStore);
    })();

    const ignoreContentToggler = addIgnoreToggler('rinsp-content-ignore-toggler', 'rinsp-filter-peek-mode');
    const ignoreSettlementToggler = addIgnoreToggler('rinsp-settlement-ignore-toggler', 'rinsp-settlement-peek-mode');
    const ignorePaywellToggler = addIgnoreToggler('rinsp-paywall-ignore-toggler', 'rinsp-paywall-peek-mode');
    ignorePaywellToggler.restoreLastState(true);
    const ignoreDislikeThreadToggler = addIgnoreToggler('rinsp-dislike-thread-ignore-toggler', 'rinsp-dislike-thread-peek-mode');
    let hideAnsweredRequestToggler = null;
    let hideUnansweredRequestToggler = null;
    let hideExpiredRequestToggler = null;
    if (userConfig.showRequestThreadFilters) {
        if (isCurrentThreadMatchingFid(QUESTION_AND_REQUEST_AREA_ID)) {
            hideAnsweredRequestToggler = addIgnoreToggler('rinsp-answered-request-ignore-toggler', 'rinsp-answered-request-hide-mode');
            hideUnansweredRequestToggler = addIgnoreToggler('rinsp-unanswered-request-ignore-toggler', 'rinsp-unanswered-request-hide-mode');
            hideExpiredRequestToggler = addIgnoreToggler('rinsp-expired-request-ignore-toggler', 'rinsp-expired-request-hide-mode');
            hideAnsweredRequestToggler.restoreLastState();
            hideUnansweredRequestToggler.restoreLastState();
            hideExpiredRequestToggler.restoreLastState();
        }
    }
    let hideVisitedThreadToggler = null;
    if (threadHistoryAccess) {
        hideVisitedThreadToggler = addIgnoreToggler('rinsp-visited-thread-toggler', 'rinsp-visited-thread-view-mode', 'rinsp-visited-thread-mask-mode');
        hideVisitedThreadToggler.restoreLastState(true);

        const profilePopupMenu = document.querySelector('#menu_u > ul');
        if (profilePopupMenu) {
            const historyItem = addElem(profilePopupMenu, 'li');
            const historyLink = addElem(historyItem, 'a', null, { href: 'u.php?action-trade.html' });
            historyLink.textContent = '浏览记录';
        }
    }
    let scoringModeToggler = null;
    if (hasManagementRole && inResourceArea) {
        scoringModeToggler = addIgnoreToggler('rinsp-highlight-unscored-thread-toggler', 'rinsp-highlight-unscored-thread-mode');
        scoringModeToggler.setCount('+');
        scoringModeToggler.restoreLastState();
    }
    if (hasManagementRole && inOfficeArea) {
        document.addEventListener('mousedown', e => {
            if (e.target && e.target.tagName === 'A' && e.target.href) {
                if (!e.target.href.startsWith('javascript:')) {
                    document.querySelectorAll('.rinsp-last-clicked').forEach(el => el.classList.remove('rinsp-last-clicked'));
                    e.target.classList.add('rinsp-last-clicked');
                }
            }
        });
    }

    let hideClosedThreadToggler = addIgnoreToggler('rinsp-closed-thread-toggler', 'rinsp-closed-thread-view-mode', 'rinsp-closed-thread-mask-mode');
    hideClosedThreadToggler.restoreLastState(true);

    // auto-discover nick name the first time
    if (userConfig.myNickName == null) {
        const doc = await fetchGetPage(`${document.location.origin}/u.php?action-show-uid-${myUserId}.html`);
        let nickName = '';
        for (let td of doc.querySelectorAll('#u-profile .u-table > tbody > tr > td')) {
            if (td.textContent.trim() === '昵称') {
                nickName = td.parentNode.querySelector('th').textContent.trim();
                break;
            }
        }
        userConfig = await mainConfigAccess.update(function(updatingUserConfig) {
            updatingUserConfig.myNickName = nickName;
            return updatingUserConfig;
        });
    }

    if (userConfig.openIntroAfterUpdate) {
        tryOpenUpdateSummary();
    }

    if (userConfig.showFloatingMessageIndicator) {
        pmNotificationElem.setAttribute('href', 'message.php');
        addPrivateMessageNotifier();
    }
    if (userConfig.hideWatchButtonIfEmpty) {
        document.body.classList.add('rinsp-watchemnu-autohide');
    }

    if (userConfig.heightReductionMode) {
        const main = document.querySelector('#main');
        if (main) {
            main.classList.add('rinsp-compact-mode');
            if (userConfig.heightReductionMode$LV2) {
                main.classList.add('rinsp-compact-mode-smaller');
            }
        }
    }

    if (userConfig.hideFilteredThread) {
        document.body.classList.add('rinsp-threadfilter-hide-mode');
    }
    if (userConfig.requestThreadHighlightEnded) {
        document.body.classList.add('rinsp-request-highlight-ended-mode');
    }
    if (userConfig.requestThreadShowExtraBounty) {
        document.body.classList.add('rinsp-request-show-extra-bounty');
    }
    if (userConfig.requestThreadUseHistoryData) {
        document.body.classList.add('rinsp-request-show-bounty-history');
    }
    if (userConfig.hideSettlementPost) {
        if (userConfig.hideSettlementPost$GreyoutOnly) {
            document.body.classList.add('rinsp-request-settlement-greyout-mode');
        } else {
            document.body.classList.add('rinsp-request-settlement-hide-mode');
        }
    }
    if (userConfig.hideIgnoreContentPost) {
        document.body.classList.add('rinsp-filter-hide-mode');
    }
    if (userConfig.hideZeroReply) {
        document.body.classList.add('rinsp-byop-noreply-hide-mode');
    }
    
    const userPinArea = await addUserPinArea(pinnedUsersConfigAccess, userConfig.hideInactivePinnedUsers, userConfig.showResourceSpotsFloating);
    let shareTypeFilter = null;
    if (userConfig.showShareTypeFilter) {
        if (inResourceArea || inPaywallArea) {
            const headrow = document.querySelector('#ajaxtable .hthread');
            if (headrow) {
                shareTypeFilter = await addShareTypeFilterArea(headrow, sharetypeFilterConfigAccess);
            }
        } else {
            const headrow = document.querySelector('#main .t > table > tbody > tr > .h[colspan]');
            if (headrow && headrow.textContent.trim() === '主题列表') {
                shareTypeFilter = await addShareTypeFilterArea(headrow, sharetypeFilterConfigAccess);
            }
        }
    }

    const queryParams = {};
    const queryParamMatch = document.location.search.match(/^\?([A-Za-z_]+)-([^-]+)(?:-(.*))?\.html.*$/);
    if (queryParamMatch) {
        queryParams[queryParamMatch[1]] = decodeURIComponent(queryParamMatch[2]);
        if (queryParamMatch[3]) {
            const rest = queryParamMatch[3].split('-');
            while (rest.length > 0) {
                const key = rest.shift();
                const value = rest.shift();
                queryParams[key] = decodeURIComponent(value);
            }
        }
    } else if (document.location.search && !document.location.search.endsWith('.html')) {
        (new URLSearchParams(document.location.search)).forEach((value, key) => {
            queryParams[key] = value;
        });
    }
    if (userConfig.showSearchBar) {
        addSearchBar(queryParams, searchConfigAccess, userConfig);
    }

    let action = queryParams.action||'';
    if (document.location.pathname === '/' || document.location.pathname === '/index.php') {
        enhanceFrontPage(userConfig, mainConfigAccess);
    }

    if (document.location.pathname === '/u.php') {
        if (document.location.search === '' || queryParams.action == null && queryParams.uid * 1 === myUserId) {
            document.body.classList.add('rinsp-uphp-self');
            await initConfigPanel();
            rewriteUserRecentPostLinks(userConfig, userPinArea);
            await enhancePostListUserDisplay(queryParams.action||'', myUserId, myUserId, userConfig, userPinArea);
        } else if (['friend', 'favor', 'feed', ''].includes(action)) {
            const uid = queryParams.uid * 1 || myUserId;
            await enhancePostListUserDisplay(queryParams.action||'', uid, myUserId, userConfig, userPinArea);
            if (action === 'feed') {
                rewriteUserRecentPostLinks(userConfig, userPinArea);
            } else if (action === 'favor') {
                if (uid === myUserId) {
                    updateFavorRecords(favorThreadsCacheAccess);
                }
                enhanceFavorPageDisplay(uid, myUserId, userConfig, threadHistoryAccess);
            }
        } else if (action === 'trade') {
            if ((queryParams.uid * 1 || myUserId) === myUserId) {
                if (adminFunctions && queryParams.view === 'admin') {
                    adminFunctions.renderAdminHistoryPage(myUserId, userConfig);
                } else {
                    renderVisitHistoryPage(myUserId, userConfig, threadHistoryAccess);
                }
            } else if (adminFunctions) {
                adminFunctions.renderPunishHistoryPage(queryParams.uid * 1, userConfig);
            }
        }
        if (queryParams.uid) {
            enhanceUserProfilePages(queryParams.uid * 1, myUserId, userConfig, adminFunctions);
        } else {
            enhanceUserProfilePages(myUserId, myUserId, userConfig, adminFunctions);
        }

        if (action === 'topic') {
            enhanceTopicPostListDisplay(queryParams.uid * 1 || myUserId, myUserId, userConfig, threadHistoryAccess, threadCategoryConfigAccess, hideVisitedThreadToggler);
            setupInfiniteScroll_userTopics(userConfig, mainConfigAccess);
        } else if (action === 'post') {
            await enhanceReplyPostListDisplay(queryParams.uid * 1 || myUserId, myUserId, userConfig, userPinArea, mainConfigAccess, threadHistoryAccess, hideVisitedThreadToggler);
            setupInfiniteScroll_userReplies(userConfig, mainConfigAccess);
        }
        enhanceUserDetailPage(queryParams.action||'', queryParams.uid * 1, userConfig, userPinArea, adminFunctions);

        replaceTradeWithHistoryTab(myUserId, queryParams);
        if (adminFunctions) {
            replaceTradeWithPunishHistoryTab(myUserId, queryParams);
        }

        if (action) {
            document.body.classList.add('rinsp-uphp-' + action);
        }
    } else {
        if (userConfig.myUserHashId == null) {
            document.location.href = '/u.php';
        }
    }
    
    if (document.location.pathname === '/message.php') {
        if (action === '' || action === 'receivebox') {
            enhanceMessagingList(userConfig, userPinArea, true);
            setupInfiniteScroll_msgInbox(userConfig, mainConfigAccess);
        } else if (action === 'scout' || action === 'sendbox') {
            enhanceMessagingList(userConfig, userPinArea, false);
            setupInfiniteScroll_msgSent(userConfig, mainConfigAccess);
        } else if (action === 'chatlog') {
            setupInfiniteScroll_msgChatLog(userConfig, mainConfigAccess);
        } else if (action === 'write') {
            enhanceMessagingForm();
        } else if (action === 'read' || action === 'readsnd' || action === 'readscout') {
            enhanceMessageReadDisplay(userConfig);
            if (action === 'read' && threadHistoryAccess) {
                testRecordBestAnswerNotification(userConfig, threadHistoryAccess);
            }
        }
    }

    if (document.location.pathname === '/search.php') {
        enhanceSearchPage();
        setupInfiniteScroll_search(userConfig, mainConfigAccess);
        if (adminFunctions) {
            adminFunctions.addBatchDeleteFunction();
        }
    }

    if (document.location.pathname === '/read.php') {
        addSearchShortcut();
        setupInfiniteScroll_thread(userConfig, mainConfigAccess);
        addTitleLengthLimitIndicator();
    }

    if (document.location.pathname === '/plugin.php' || document.location.pathname === '/hack.php') {
        showAutoSpTaskStatus(myUserId, userConfig, mainConfigAccess);
    } else if (userConfig.autoSpTasks) {
        autoCompleteSpTasks(myUserId);
    }

    if (document.location.pathname === '/post.php') {
        addTitleLengthLimitIndicator();
    }

    if (document.location.pathname === '/thread.php' || document.location.pathname === '/thread_new.php') {
        enableForumAnnouncementFolding();
        addSearchShortcut();
        if (userConfig.showDefaultingPicWallOption) {
            addPicWallDefaultOption(queryParams.fid * 1);
        }
        if (document.location.pathname === '/thread.php') {
            setupInfiniteScroll_threadList(userConfig, mainConfigAccess);
        } else {
            setupInfiniteScroll_threadPicWall(userConfig, mainConfigAccess);
        }
    }

    if (userConfig.enhancePageTitle) {
        enhancePageTitle(queryParams, myUserId, userConfig, adminFunctions != null);
    }

    if (adminFunctions) {
        if (document.location.pathname === '/read.php') {
            if (inResourceArea) {
                adminFunctions.enableQuickPingFunction();
            }
            adminFunctions.addDeleteFormMetadata();
        } else if (document.location.pathname === '/masingle.php') {
            if (action === 'banuser') {
                adminFunctions.enhanceBanUserActionPage();
            } else {
                adminFunctions.enhanceReasonSelector();
                if (action === 'shield') {
                    adminFunctions.enhanceShieldActionPage();
                } else if (action === 'delatc') {
                    adminFunctions.enhanceDeleteReplyActionPage();
                }
            }
        } else if (document.location.pathname === '/mawhole.php') {
            adminFunctions.enhanceReasonSelector();
            adminFunctions.enhanceMawholeActionPage();
        } else if (document.location.pathname === '/operate.php') {
            adminFunctions.enhanceReasonSelector();
            if (action === 'showping') {
                if (queryParams.pid === 'tpc') {
                    adminFunctions.autoFillShowPingPage();
                }
                adminFunctions.enhancePingActionPage();
            }
        } else if (document.location.pathname === '/job.php') {
            if (action === 'endreward') {
                adminFunctions.enhanceEndRewardActionPage();
            }
        }
        if (document.location.pathname === '/thread.php') {
            const fid = queryParams.fid * 1;
            if (inResourceArea && fid > 0) {
                adminFunctions.addBatchPingFunction(fid);
            }
            adminFunctions.addBulkDeleteFormMetadata();
        }
    }

    if (userConfig.subCategoryInheritImageWallMode) {
        if (document.location.pathname === '/thread_new.php') {
            changeToImageWallThreadLinks();
        }
    }
    
    function tryRemoveCorruptDeployCookie() {
        try {
            const currentCookieString = document.cookie;
            if (!currentCookieString) {
                return;
            }
            
            const modified = currentCookieString
                .split(' ')
                .map(cookie => {
                    if (cookie.startsWith('deploy=') && cookie.length > 256) {
                        return 'deploy=\t\t\n';
                    }
                    return cookie;
                })
                .join(' ');
            
            if (currentCookieString !== modified) {
                if (DEV_MODE) {
                    console.info('dropped "deploy" cookie');
                }
                document.cookie = modified;
            }

        } catch (e) {
            if (DEV_MODE) {
                console.error(e);
            }
        }
    }
    tryRemoveCorruptDeployCookie();

    if (userConfig.siteNoticeSectionDefaultFolded) {
        const foldIcon = document.querySelector('.gongul #img_thread[src$="/cate_fold.gif"]');
        if (foldIcon) {
            if (DEV_MODE) {
                console.info('set notice default folded');
            }
            foldIcon.click();
        }
    }

    const watcherApi = initTopMenu();
    let ignoreList = await contentIgnoreListConfigAccess.read();
    let userFilter = await userFilterConfigAccess.read();
    initCurrentPost();

    function setupStickyUserInfoPopup() {
        let userInfoPopup = document.querySelector('body > .user-info');
        function bindUpdate() {
            const observer = new MutationObserver(() => {
                update();
            });
            observer.observe(userInfoPopup, { childList: false, subtree: false, attributes: true });
        }
        function update() {
            const top = Number.parseInt(userInfoPopup.style.top);
            if (document.documentElement.scrollTop > top && userInfoPopup.style.display !== 'none') {
                document.body.classList.add('rinsp-user-info-sticky-mode');
            } else {
                document.body.classList.remove('rinsp-user-info-sticky-mode');
            }
        }

        if (userInfoPopup == null) {
            const observer = new MutationObserver(() => {
                userInfoPopup = document.querySelector('body > .user-info');
                if (userInfoPopup != null) {
                    observer.disconnect();
                    observer.takeRecords();
                    bindUpdate();
                    update();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true, attributes: false });
        } else {
            bindUpdate();
        }
    }
    if (userConfig.stickyUserInfo) {
        setupStickyUserInfoPopup();
    }

    document.addEventListener('mousedown', function(e) {
        if (!e.target) {
            return;
        }
        const enclosingPost = e.target.closest('.rinsp-post');
        if (enclosingPost) {
            enclosingPost.focus();
        }
        if (document.querySelector('.rinsp-dialog-modal-mask') != null) {
            return;
        }
        const withinMenu = e.target.closest('.rinsp-common-popup-menu');
        let withinMenuId = '-n/a-';
        if (withinMenu != null) {
            withinMenuId = withinMenu.getAttribute('id');
        }
        document.querySelectorAll('.rinsp-common-popup-menu').forEach(function(menu) {
            if (menu.getAttribute('id') !== withinMenuId) {
                menu.remove();
            }
        });
    });

    if (userConfig.autoCheckReplyOption) {
        autoCheckReply();
    }

    const stickyUserpicController = (function() {
        let posts = [];
        let schedule = null;
        return {
            setPosts(newPosts) {
                posts = newPosts;
            },
            update() {
                let activeFound = false;
                for (let post of posts) {
                    post.userPicElem.classList.remove('rinsp-userpic-sticky');
                    post.userPicElem.style.top = '';
                    if (!activeFound) {
                        const postRect = post.rootElem.getBoundingClientRect();
                        const visibleHeight = postRect.top + postRect.height;
                        if (postRect.top < 0 && visibleHeight > 0) {
                            const userPicElemStaticRect = post.userPicElem.getBoundingClientRect();
                            if (postRect.height - userPicElemStaticRect.height >= MIN_OVER_HEIGHT_STICKY_MODE_TRIGGER) {
                                const dummy = post.userPicElem.parentNode.querySelector('.rinsp-user-pic-dummy');
                                dummy.style.height = userPicElemStaticRect.height.toFixed(0) + 'px';
                                if (userConfig.stickyUserInfo) {
                                    post.userPicElem.classList.add('rinsp-userpic-sticky');
                                }
                                const userPicElemStickyRect = post.userPicElem.getBoundingClientRect();
                                const overflowHeight = userPicElemStickyRect.height - visibleHeight;
                                if (overflowHeight > 0) {
                                    post.userPicElem.style.top = '-' + overflowHeight.toFixed(0) + 'px';
                                } else {
                                    post.userPicElem.style.top = '';
                                }
                            }
                            activeFound = true;
                            continue;
                        }
                    }
                }
            },
            scheduleUpdate() {
                if (schedule != null)
                    return;
                schedule = setTimeout(() => {
                    this.update();
                    schedule = null;
                }, 0);
            }
        };
    })();

    let forceCleanUpdate = false;
    let enhancementMemoryObj = {};
    let postEnhancementActions = [];
    let lastCacheKey = null;

    const observer = createMutationObserver(applyEnhancement);
    await applyEnhancement(true);

    async function applyEnhancement(firstTime) {
        if (DEBUG_MODE) console.info('applyEnhancement');

        function disableSystemPostCollapse(post) {
            if (userConfig.disablePostCollapse) {
                return true;
            }
            if (userConfig.customUserpicBypassIgnoreList && !post.defaultUserPic) {
                return true;
            }
            if (post.postUid === myUserId && userConfig.disablePostCollapse$Self) {
                return true;
            }
            if (userConfig.customUserBypassIgnoreList && userConfig.customUserHashIdMappings['#' + post.postUid]) {
                return true;
            }
            return false;
        }
        function handleCollapseStateClasses(post) {
            post.rootElem.classList.remove('rinsp-sys-collapse-override');
            post.rootElem.classList.remove('rinsp-post-sys-collapsed');
            if (!post.contentDefaultIgnorable) {
                return;
            }
            if (disableSystemPostCollapse(post)) {
                post.rootElem.classList.add('rinsp-sys-collapse-override');
                const expandButton = post.rootElem.querySelector('.js-puremark-content ~ .bianji > a[onclick="return expandpuremark(this)"]');
                if (expandButton) {
                    expandButton.click();
                }
            } else {
                post.rootElem.classList.add('rinsp-post-sys-collapsed');
            }
        }

        let threadFilter = await threadFilterConfigAccess.read();

        function onConfigUpdate(updatedConfigs) {
            forceCleanUpdate = true;
            if (updatedConfigs) {
                if (updatedConfigs.threadFilter != null) {
                    threadFilter = updatedConfigs.threadFilter;
                }
                if (updatedConfigs.userFilter != null) {
                    userFilter = updatedConfigs.userFilter;
                }
                if (updatedConfigs.ignoreList != null) {
                    ignoreList = updatedConfigs.ignoreList;
                }
            }
        }
        function contentFilter_onConfigUpdate(updatedConfigs) {
            onConfigUpdate(updatedConfigs);
            observer.trigger();
        }

        function threadTitleFilter_onConfigUpdate(updatedConfigs) {
            onConfigUpdate(updatedConfigs);
            observer.trigger();
        }

        if (userConfig.stickyUserInfo) {
            document.addEventListener('scroll', () => {
                stickyUserpicController.scheduleUpdate();
            });
        }
        async function enhanceThreadView(tid, posts, userMap, userFilter, userPinArea, adminFunctions) {
            let gfPost = null;

            if (userConfig.stickyUserInfo) {
                stickyUserpicController.setPosts(posts);
            }

            userPinArea.clearState();
            const postCountsByUid = new Map();
            if (userConfig.showActiveRepliers) {
                const minReplyCount = userConfig.showActiveRepliers$min * 1 || 2;
                posts.forEach(post => {
                    if (post.floor > 0) {
                        const count = postCountsByUid.get(post.postUid);
                        postCountsByUid.set(post.postUid, (count||0) + 1);
                    }
                });
                postCountsByUid.forEach((count, uid) => {
                    if (count >= minReplyCount) {
                        if (!isUserBlacklisted(userFilter, uid)) {
                            const userInfo = userMap.get(uid);
                            userPinArea.watchUserLocally(uid, userInfo.nickName, userInfo.img);
                        }
                    }
                });
            }
            posts.forEach(post => {
                post.rootElem.classList.add('rinsp-post');
                if (post.floor === 0) {
                    gfPost = post;
                    post.rootElem.classList.add('rinsp-post-gf');
                }
                handleCollapseStateClasses(post);
            });

            if (inResourceArea && gfPost) {
                // add scored marker
                const markElem = gfPost.rootElem.querySelector('#mark_tpc');
                if (markElem && markElem.textContent.indexOf('评分记录') !== -1) {
                    gfPost.rootElem.classList.add('rinsp-post-scored');
                } else {
                    gfPost.rootElem.classList.add('rinsp-post-unscored');
                }
            }
            if (gfPost && gfPost.areaId === QUESTION_AND_REQUEST_AREA_ID) {
                const tac = document.querySelector('.tpc_content > .tips:not(.rinsp-uid-inspected) > .tac:last-child');
                if (tac) {
                    const winnerMatch = tac.textContent.match(/最佳答案获得者: ([a-z0-9]{8})/);
                    if (winnerMatch) {
                        const tips = tac.parentNode;
                        tips.classList.add('rinsp-uid-inspected');
                        const uhash = winnerMatch[1];
                        let replace = null;
                        if (userConfig.highlightMyself && uhash === userConfig.myUserHashId) {
                            (replace = newElem('span', 'rinsp-nickname-byme')).textContent = MY_NAME_DISPLAY;
                        } else {
                            // userPinArea

                            const fullName = userConfig.customUserHashIdMappings['@' + uhash];
                            if (fullName != null) {
                                (replace = newElem('span', 'rinsp-nickname-byother')).textContent = fullName[2];
                            }
                        }
                        if (replace) {
                            tac.hidden = true;
                            const tac2 = addElem(tips, 'div', 'tac');
                            tac2.appendChild(document.createTextNode('最佳答案获得者: '));
                            tac2.appendChild(replace);
                        }
                    }
                }
            }
            
            const punishRecordAccess = adminFunctions ? adminFunctions.createPunishRecordAccess() : null;
            annotateUsers(posts, myUserId, userConfig, userMap, {
                punishRecordAccess,
                changeCustomUserMapping
            });

            if (userConfig.enhanceSellFrame || userConfig.buyRefreshFree) {
                enhanceBuyButtons(userConfig, () => {
                    forceCleanUpdate = true;
                    observer.trigger();
                });
            }
            if (userConfig.replyRefreshFree) {
                const lastPost = posts.at(-1);
                applyReplyRefreshFree(tid, lastPost, myUserId);
            }
    
            applySubjectLineEnhancement(posts, userConfig);

            applyHookDirectives(posts, myUserId, userConfig);

            await applyContentFilter(posts, myUserId, userConfig, threadFilter, userFilter, ignoreList, contentFilter_onConfigUpdate);

            if (showResourceSpots) {
                let likePatternMatcher = null;
                if (threadFilter && threadFilter.likes.length > 0) {
                    likePatternMatcher = createKeywordMatcherFactory(threadFilter.likes);
                }

                posts.forEach(post => {
                    if (!post.rootElem.classList.contains('rinsp-filter-ignored')) {
                        userPinArea.offerPostContent(post, showResourceSpots, likePatternMatcher);
                    }
                });
            }
            await userPinArea.update();

            posts.forEach(post => {
                post.rootElem.parentNode.classList.remove('rinsp-thread-filter-pinned');
                if (userPinArea.isWatching(post.postUid)) {
                    if (userPinArea.isPinned(post.postUid)) {
                        post.rootElem.parentNode.classList.add('rinsp-thread-filter-pinned');
                    } else {
                        post.rootElem.parentNode.classList.add('rinsp-thread-filter-active-reply');
                    }
                    
                    const bannedText = post.rootElem.querySelector('.tpc_content div[id^="read_"] > span[style="color:black;background-color:#ffff66"]');
                    const banned = bannedText && bannedText.textContent.trim() === '用户被禁言,该主题自动屏蔽!';
                    const contentIgnored =  post.rootElem.classList.contains('rinsp-filter-ignored');
                    const locClass = post.floor === 0 ? 'gf' : banned ? 'banned' : contentIgnored ? 'ignoredmark' : null;
                    userPinArea.addLocation(post.postUid, post.floor === 0 ? 'GF' : `${post.floor}F`, locClass, () => {
                        if (contentIgnored && !ignoreContentToggler.isActive()) {
                            ignoreContentToggler.setActive(true);
                        }
                        post.rootElem.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    });
                }
            });
            await userPinArea.update();

            if (adminFunctions) {
                adminFunctions.addPostAdminControl(posts, queryParams.page||1, userMap);
            }
        }

        if (document.location.pathname === '/read.php') {
            if (adminFunctions) {
                adminFunctions.addBatchPostSelectionControl();
            }
            const posts = getPosts(document);
            const cacheKey = 'posts:' + posts.length;
            if (forceCleanUpdate || cacheKey !== lastCacheKey) {
                lastCacheKey = cacheKey;
                if (posts.length > 0) {
                    const userMap = readEnhanceUserInfoMap(myUserId, userConfig);
                    const myself = userMap.get(myUserId);
                    if (myself) { // auto update my nick name if changed
                        if (userConfig.myNickName == null || myself.nickName !== userConfig.myNickName) {
                            userConfig = await mainConfigAccess.update(function(updatingUserConfig) {
                                updatingUserConfig.myNickName = myself.nickName;
                                return updatingUserConfig;
                            });
                        }
                    }

                    await enhanceThreadView(queryParams.tid * 1, posts, userMap, userFilter, userPinArea, adminFunctions);
                    if (threadHistoryAccess) {
                        recordThreadAccess(document, posts, myUserId, threadHistoryAccess, enhancementMemoryObj) // no need to wait
                            .catch(ex => console.error('recordThreadAccess FAILED', ex));
                    }
                    if (firstTime) {
                        const targetFloor = (document.location.hash.match(/^#fl-(\d+)$/)||[])[1] * 1;
                        if (targetFloor > 0) {
                            const targetElem = posts.filter(post => post.floor === targetFloor).map(post => post.rootElem)[0];
                            if (targetElem) {
                                postEnhancementActions.push(() => {
                                    targetElem.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start'
                                    });
                                });
                            }
                        }
                    }
                } else {
                    const pageError = findErrorMessage(document);
                    if (pageError && pageError.indexOf('数据已被删除') !== -1 && (queryParams.tid * 1) > 0) {
                        recordThreadDeleted(queryParams.tid * 1, myUserId, threadHistoryAccess); // no need to wait
                    }
                }
            } else {
                if (DEBUG_MODE) console.info('skipped update', cacheKey);
            }
        } else {
            const threadList = getThreadList();
            if (threadList == null) {
                lastCacheKey = null;
            } else {
                const cacheKey = 'threads:' + threadList.length;
                if (forceCleanUpdate || cacheKey !== lastCacheKey) {
                    lastCacheKey = cacheKey;

                    for (let thread of threadList) {
                        if (thread.opHashId) {
                            await userHashLookupStore.set(Number.parseInt(thread.opHashId, 16), thread.op).catch(ex => null);
                        }
                    }
                    await showUserNames(userConfig, userHashLookupStore, myUserId);
                    if (userConfig.threadListDefaultOpenNewPage) {
                        threadList.forEach(thread => {
                            thread.row.querySelectorAll('a[href]:not([target])').forEach(el => el.setAttribute('target', '_blank'));
                        });
                    }

                    // unused: reserved for later use
                    /*
                    const pagesElem = document.querySelector('#main .t3 .pages');
                    if (pagesElem && document.querySelector('#main .rinsp-threadlist-options') == null) {
                        const t3 = pagesElem.closest('.t3');
                        const c = Array.from(t3.children).find(el => el.classList.contains('c'));
                        const optionsElem = newElem('span', 'fr rinsp-threadlist-options');
                        t3.insertBefore(optionsElem, c);
                    }
                    */

                    let settlementPostMatcher = null;
                    if (userConfig.hideSettlementPost) {
                        if (document.location.href.match(/\/thread(_new)?\.php\?fid-48[-.]/)) {
                            const settlementDetectionRules = threadFilter.settlementKeywords||[];
                            if (settlementDetectionRules.length > 0) {
                                settlementPostMatcher = createKeywordMatcherFactory(settlementDetectionRules);
                            }
                        }
                    }
                    await applyThreadListEnhancement(myUserId, userConfig, threadList, threadFilter, userFilter, userPinArea, shareTypeFilter, settlementPostMatcher, threadHistoryAccess, threadTitleFilter_onConfigUpdate, forceCleanUpdate);
                } else {
                    if (DEBUG_MODE) console.info('skipped update', cacheKey);
                }
            }
        }
    
        forceCleanUpdate = false;

        const actions = postEnhancementActions;
        postEnhancementActions = [];
        actions.forEach(action => {
            action();
        });

    }

    function getThreadList() {
        switch (document.location.pathname) {
            case '/thread_new.php':
                return readPicWallThreadList();
            case '/thread.php':
                return readThreadList();
            case '/search.php':
                if (document.querySelector('form[action="search.php?"]')) {
                    return null;
                } else {
                    return readSearchThreadList();
                }
            default:
                return null;
        }
    }

    userPinArea.addUpdateListener(() => {
        forceCleanUpdate = true;
        observer.trigger();
    });
    if (shareTypeFilter) {
        shareTypeFilter.addUpdateListener(() => {
            forceCleanUpdate = true;
            observer.trigger();
        });
    }

    observer.init(document.getElementById('main'), { childList: true, subtree: true, attributes: false });

    let hiddenStateChangeObserver = null;
    const postListForm = document.querySelector('#main > form[name="delatc"]');
    if (postListForm) {
        let lastHiddenPostCount = 0;
        hiddenStateChangeObserver = createMutationObserver(async () => {
            const hiddenPostCount = document.querySelectorAll('.t5.t2[hidden]').length;
            if (hiddenPostCount != lastHiddenPostCount) {
                forceCleanUpdate = true;
                lastHiddenPostCount = hiddenPostCount;
                postEnhancementActions.push(() => {
                    document.querySelectorAll('#main > form[name="delatc"] > .t5.t2[hidden] > .js-post').forEach(defaultHiddenPost => {
                        if (defaultHiddenPost.classList.contains('rinsp-filter-bypass')) {
                            return;
                        }
                        const postContainer = defaultHiddenPost.parentElement;
                        if (postContainer.hidden) {
                            defaultHiddenPost.classList.remove('rinsp-filter-bypass');
                        } else {
                            defaultHiddenPost.classList.add('rinsp-filter-bypass');
                        }
                    });
                });
                observer.trigger();
            }
        });
        hiddenStateChangeObserver.init(postListForm, { childList: true, subtree: true, attributes: true });

    }

    if (threadHistoryAccess) {
        // if history based styling is active, need to recheck on page activation
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                forceCleanUpdate = true;
                observer.trigger();
            }
        });
    }

    if (DEV_MODE) console.info('(southplus-watcher) loaded');

    function getUserProfileHashId() {
        const elem = document.querySelector('#main #u-wrap #u-content #u-top h1');
        if (elem != null) {
            const userHashId = elem.textContent.trim();
            if (userHashId.match(/[0-9a-f]{8}/)) {
                return userHashId;
            }
        }
        return null;
    }

    async function enhanceUserProfilePages(userId, myUserId, userConfig, adminFunctions) {
        if (userId !== myUserId) {
            // add more action shortcuts
            const actionShortcutGrid = document.querySelector('#u-portrait ~ .bdbA > table > tbody');
            if (actionShortcutGrid) {
                const actionRow = addElem(actionShortcutGrid, 'tr');
                const cell = addElem(actionRow, 'td', null, { align: 'center' });
                addElem(cell, 'span', null, { style: 'display: inline-block; width: 14px' });
                cell.appendChild(document.createTextNode(' '));
                addElem(cell, 'a', null, { href: `message.php?action-chatlog-withuid-${userId}.html` }).textContent = '通信记录';
                addElem(actionRow, 'td');
                
                if (adminFunctions) {
                    const punishRecordAccess = adminFunctions.createPunishRecordAccess();
                    const record = await punishRecordAccess.getPunishRecord(userId);
                    if (record && record.logs.length > 0) {
                        const punishRecordRow = addElem(actionShortcutGrid, 'tr');
                        const punishRecordCell = addElem(punishRecordRow, 'td', 'rinsp-profile-punish-tag-cell', { colspan: '2' });
                        punishRecordCell.appendChild(renderPunishTags(userId, record));
                    }
                }
            }
        } else {
            document.querySelectorAll('#u-portrait img.pic').forEach(el => el.classList.add('rinsp-myavatar'));
        }
    }

    async function enhanceUserDetailPage(action, userId, userConfig, userPinArea, adminFunctions) {
        // add user memory action buttons
        let nickName = null;
        let uidCell = null;
        if (action === 'show') {
            for (let td of document.querySelectorAll('#u-profile table > tbody > tr > td')) {
                if (td.textContent === 'UID') {
                    uidCell = td.nextElementSibling;
                    if (!userId) {
                        userId = uidCell.textContent * 1;
                    }
                }
                if (td.textContent === '昵称') {
                    nickName = td.nextElementSibling.textContent.trim();
                    break;
                }
            }
        }
        const userHashId = getUserProfileHashId();
        if (userHashId != null) {
            if (uidCell) {
                const pinOper = addElem(uidCell, 'div', 'rinsp-user-action-pinuser-button');
                const update = () => {
                    pinOper.innerHTML = '';
                    delete pinOper.dataset.pinned;
                    if (userPinArea.isPinned(userId)) {
                        pinOper.dataset.pinned = '1';
                        addElem(pinOper, 'a', 'rinsp-user-action-pinuser-icon', { href: 'javascript:'})
                            .addEventListener('click', () => {
                                userPinArea.unwatchUser(userId);
                            });
                    } else {
                        addElem(pinOper, 'a', 'rinsp-user-action-pinuser-icon', { href: 'javascript:'})
                            .addEventListener('click', () => {
                                const img = document.querySelector('#u-portrait img.pic');
                                userPinArea.watchUser(userId, nickName, getImgSrc(img));
                            });
                    }
                };
                userPinArea.addUpdateListener(() => update());
                update();

                if (adminFunctions) {
                    uidCell.appendChild(document.createTextNode(' ／ '));
                    const showUserNameButton = addElem(uidCell, 'a', null, { href: 'javascript:'});
                    showUserNameButton.textContent = '显示用户名';
                    showUserNameButton.addEventListener('click', async () => {
                        const userNameDisplay = addElem(uidCell, 'span');
                        userNameDisplay.textContent = '⌛';
                        showUserNameButton.remove();
                        adminFunctions.findUserName(userId)
                            .then(userName => {
                                userNameDisplay.classList.add('rinsp-user-name-reveal');
                                userNameDisplay.textContent = userName;
                            })
                            .catch(ex => userNameDisplay.textContent = '⚠️' + ex);

                    });
                }
            }
    
            let customNameEntry = userConfig.customUserHashIdMappings['@' + userHashId];
            const parentElem = document.querySelector('#main #u-wrap #u-content #u-top h1');
            const button = addElem(parentElem, 'span', 'rinsp-user-map-icon');
            if (customNameEntry) {
                button.setAttribute('rinsp-nickname', customNameEntry[2]);
                button.classList.add('rinsp-user-mapped');
            }
            button.addEventListener('click', async () => {
                button.classList.add('rinsp-config-saving');
                changeCustomUserMapping(userId, userHashId, customNameEntry&&customNameEntry[2]||nickName||'')
                    .then(function(newName) {
                        if (newName == null) {
                            return;
                        }
                        if (newName) {
                            button.classList.add('rinsp-user-mapped');
                            button.setAttribute('rinsp-nickname', newName);
                        } else {
                            button.classList.remove('rinsp-user-mapped');
                            button.removeAttribute('rinsp-nickname');
                        }
                    })
                    .finally(() => {
                        button.classList.remove('rinsp-config-saving');
                    });
            });
        }
    
    }

    async function changeCustomUserMapping(userId, userHashId, nickName, bypassPrompt) {
        let chosenNickName = bypassPrompt ? nickName : prompt('记住昵称 - 输入空白以撤销记录', nickName);
        if (chosenNickName == null) { // cancelled
            return null;
        }
        chosenNickName = chosenNickName.trim();

        await mainConfigAccess.update(function(updatingUserConfig) {
            const currentMetadata = updatingUserConfig.customUserHashIdMappings['@' + userHashId];
            if (!chosenNickName && !currentMetadata) {
                return null;
            }
            if (chosenNickName) {
                const newMetadata = [userId * 1, userHashId, chosenNickName];
                updatingUserConfig.customUserHashIdMappings['#' + userId] = newMetadata;
                updatingUserConfig.customUserHashIdMappings['@' + userHashId] = newMetadata;
                return updatingUserConfig;
            } else {
                delete updatingUserConfig.customUserHashIdMappings['#' + currentMetadata[0]];
                delete updatingUserConfig.customUserHashIdMappings['@' + userHashId];
                return updatingUserConfig;
            }
        });
        return chosenNickName;
    }

    async function openClearHistoryMenu(anchor, onUpdate) {
        const items = [];

        function generateAction(task, confirmMessage, successMessage) {
            return async () => {
                if (!confirm('请确认 ' + confirmMessage))
                    return;
                const action = async () => {
                    await task();
                    return '✔️' + successMessage;
                };
                runWithProgressPopup(action, '清空中...', anchor, 1500)
                    .catch((ex) => alert(String(ex)))
                    .finally(() => onUpdate());
            };
        }

        items.push({
            label: '清空最近浏览列表',
            action: generateAction(async () => {
                await threadHistoryAccess.recentAccessStore.clear();
            }, '清空最近浏览列表', '已清空最近浏览列表')
        });

        items.push({
            label: '清空全部记录',
            action: generateAction(async () => {
                await threadHistoryAccess.historyStore.clear();
                await threadHistoryAccess.recentAccessStore.clear();
            }, '清空全部记录', '已清空全部记录')
        });

        setupPopupMenu({
            title: '清空帖子浏览记录',
            popupMenuId: 'CLEAR_HISTORY_MENU',
            width: 150,
            anchor,
            items
        });
    }

    async function initConfigPanel() {
        if (userConfig.myUserHashId == null) {
            const userHashId = getUserProfileHashId();
            if (userHashId != null) {
                userConfig = await mainConfigAccess.update(function(freshUserConfig) {
                    freshUserConfig.myUserHashId = userHashId;
                    return freshUserConfig;
                });
            }
        }

        const mainPanel = document.querySelector('#u-contentmain');
        const configPanel = addElem(mainPanel, 'div', 'rinsp-config-panel');
        const configHeading = addElem(configPanel, 'h5', 'u-h5');
        addElem(configHeading, 'span').textContent = `插件设置 (凛+ v${VERSION_TEXT})`;
        if (DEV_MODE) {
            const devToggler = addElem(configHeading, 'a', 'rinsp-dev-toggle r gray3');
            devToggler.textContent = '开发者模式';
            devToggler.addEventListener('click', () => {
                if (confirm('关闭开发者模式？')) {
                    localStorage.removeItem('RIN_PLUS_DEV_MODE');
                    window.location.reload();
                }
            });
        } else {
            const devToggler = addElem(configHeading, 'input', 'rinsp-dev-toggle r gray3', { size: 4 });
            devToggler.addEventListener('change', () => {
                if (devToggler.value === 'devmode') {
                    devToggler.value = '';
                    alert('开发者模式已打开');
                    localStorage.setItem('RIN_PLUS_DEV_MODE', '1');
                    window.location.reload();
                }
            });
        }
        const configList = addElem(configPanel, 'dl', 'rinsp-config-list');
        const introItem = addElem(configList, 'dt', 'rinsp-config-item-lv1 rinsp-config-item-checked');
        addElem(introItem, 'a', 'rinsp-intro-link', { href: INTRO_POST, target: '_blank' }).textContent = '🔗 捷径: 功能简介帖(茶館)';
        putCheckBoxItem('新功能更新后 自动打开简介帖', 'openIntroAfterUpdate', 2);

        addElem(configList, 'dt', 'rinsp-config-item-sep rinsp-config-item-lv1').textContent = '绑域名设置 (只同域名内适用)';
        putCheckBoxItem('暗黑模式', {
            get: () => darkModeEnabledProperty.get() != null,
            async update(enabled) {
                darkModeEnabledProperty.set(enabled ? '1' : null);
                applyDarkTheme();
            }
        });

        const darkModeOption = addElem(configList, 'dt', 'rinsp-config-item-lv2');
        addElem(darkModeOption, 'span').textContent = '🎨 样式 ';
        const darkModeSelect = addElem(darkModeOption, 'select');
        addElem(darkModeSelect, 'option', null, { value: 'darkbeige' }).textContent = '暗棕色';
        addElem(darkModeSelect, 'option', null, { value: 'hcdarkbeige' }).textContent = '暗棕色 (高反差)';
        addElem(darkModeSelect, 'option', null, { value: 'darkblue' }).textContent = '暗蓝色';
        addElem(darkModeSelect, 'option', null, { value: 'hcdarkblue' }).textContent = '暗蓝色 (高反差)';
        addElem(darkModeSelect, 'option', null, { value: 'darkred' }).textContent = '暗红色';
        addElem(darkModeSelect, 'option', null, { value: 'darkgrey' }).textContent = '暗灰色';
        darkModeSelect.value = darkModeThemeProperty.get();
        darkModeSelect.addEventListener('change', () => {
            darkModeThemeProperty.set(darkModeSelect.value);
            applyDarkTheme();
        });

        putCheckBoxItem('跟随系统偏好设置', {
            get: () => darkModeFollowsSystemProperty.get() === '1',
            async update(enabled) {
                darkModeFollowsSystemProperty.set(enabled ? '1' : null);
                applyDarkTheme();
            }
        }, 2);
        putCheckBoxItem('贤者模式 隐藏NSFW图片', {
            get: () => isSafeMode(),
            update: async (enabled) => setSafeMode(enabled)
        });
        putCheckBoxItem('贤者模式中不隐藏自己头像', {
            get: () => isSafeModeShowMyAvater(),
            update: async (enabled) => setSafeModeShowMyAvater(enabled)
        }, 2);
        putCheckBoxItem('提高页面加载速度 (日后论坛更新取代功能后移除)', {
            get: () => isFastLoadMode(),
            update: async (enabled) => setFastLoadMode(enabled)
        });
        putCheckBoxItem('延迟加载屏幕外的图片', {
            get: () => isFastLoadLazyImageMode(),
            update: async (enabled) => setFastLoadLazyImageMode(enabled)
        }, 2);

        addElem(configList, 'dt', 'rinsp-config-item-sep rinsp-config-item-lv1').textContent = '论坛设置';
        putCheckBoxItem('自动签到 (社区论坛任务)', 'autoSpTasks');
        if (userConfig.autoSpTasks) {
            const taskRecordAccess = initConfigAccess(myUserId, 'autosptask', {});
            const autoSpTasksSummary = addElem(configList, 'dt', 'rinsp-config-item-tip rinsp-config-item-lv2');
            taskRecordAccess.read().then(taskRecord => {
                if (taskRecord.lastCompleteSp > 0) {
                    const hr = (Date.now() - taskRecord.lastComplete) / 3600000;
                    autoSpTasksSummary.textContent = `💡 ${getAgeString(hr * 60)} 已领取 ${taskRecord.lastCompleteSp||'?'} SP | 记录中总共领取 ${taskRecord.totalSp||'?'} SP`;
                }
            });
        }
        putCheckBoxItem('自动域名跳转', {
            get: () => domainRedirectTarget != null,
            update: async (enabled) => setDomainRedirectEnabled(enabled)
        });
        putCheckBoxItem('增強网页标题 (令其更有意义)', 'enhancePageTitle');
        const searchBarItem = putCheckBoxItem('主菜单上添加快速搜索栏', 'showSearchBar');
        addElem(configList, 'dt', 'rinsp-config-item-tip rinsp-config-item-lv2').textContent = '💡 为了腾出空间 "社区论坛任务" 缩写为 "任务"';
        addElem(configList, 'dt', 'rinsp-config-item-tip rinsp-config-item-lv2').textContent = '💡 快速搜索使用已保存的默认设置 (发表主题时间、部分或完全匹配)';

        addElem(searchBarItem, 'span').textContent = '🔹位置 ';
        const searchBarAlignSelect = addElem(searchBarItem, 'select');
        addElem(searchBarAlignSelect, 'option', null, { value: 'default' }).textContent = '主菜单 最右边';
        addElem(searchBarAlignSelect, 'option', null, { value: 'menu-first' }).textContent = '主菜单 右边第一项';
        addElem(searchBarAlignSelect, 'option', null, { value: 'bar-center' }).textContent = '主菜单 空间置中';
        searchBarAlignSelect.value = userConfig.showSearchBar$align;
        searchBarAlignSelect.value = searchBarAlignSelect.value || 'default';
        searchBarAlignSelect.addEventListener('change', () => {
            configPanel.classList.add('rinsp-config-saving');
            mainConfigAccess.update(function(updatingUserConfig) {
                updatingUserConfig.showSearchBar$align = searchBarAlignSelect.value;
                return updatingUserConfig;
            })
            .finally(function() {
                configPanel.classList.remove('rinsp-config-saving');
                window.location.reload();
            });
        });


        
        const fontSizeOption = addElem(configList, 'dt', 'rinsp-config-item-lv1');
        addElem(fontSizeOption, 'span').textContent = '🗚 页面字体大小 ';
        const fontSizeSelect = addElem(fontSizeOption, 'select');
        addElem(fontSizeSelect, 'option', null, { value: '0' }).textContent = '论坛默认大小';
        addElem(fontSizeSelect, 'option', null, { value: '1' }).textContent = '列表标题大小 +1';
        addElem(fontSizeSelect, 'option', null, { value: '2' }).textContent = '列表标题及内容大小 +1';
        addElem(fontSizeSelect, 'option', null, { value: '3' }).textContent = '列表标题及内容大小 +2';
        fontSizeSelect.value = userConfig.textSize;
        fontSizeSelect.value = fontSizeSelect.value || '0';
        fontSizeSelect.addEventListener('change', () => {
            configPanel.classList.add('rinsp-config-saving');
            mainConfigAccess.update(function(updatingUserConfig) {
                updatingUserConfig.textSize = fontSizeSelect.value||0;
                return updatingUserConfig;
            })
            .finally(function() {
                configPanel.classList.remove('rinsp-config-saving');
                window.location.reload();
            });
        });

        const floatShortcutOption = addElem(configList, 'dt', 'rinsp-config-item-lv1');
        addElem(floatShortcutOption, 'span').textContent = '⚙️ 浮动式捷径窗口 ';
        const floatShortcutSelect = addElem(floatShortcutOption, 'select');
        addElem(floatShortcutSelect, 'option', null, { value: 'off' }).textContent = '不显示';
        addElem(floatShortcutSelect, 'option', null, { value: 'tr' }).textContent = '右上角';
        addElem(floatShortcutSelect, 'option', null, { value: 'tl' }).textContent = '左上角';
        floatShortcutSelect.value = userConfig.floatingShortcut;
        floatShortcutSelect.value = floatShortcutSelect.value || 'tr';
        floatShortcutSelect.addEventListener('change', () => {
            configPanel.classList.add('rinsp-config-saving');
            mainConfigAccess.update(function(updatingUserConfig) {
                updatingUserConfig.floatingShortcut = floatShortcutSelect.value;
                return updatingUserConfig;
            })
            .finally(function() {
                configPanel.classList.remove('rinsp-config-saving');
                window.location.reload();
            });
        });

        addElem(configList, 'dt', 'rinsp-config-item-lv1 rinsp-config-item-checked').textContent = '浮动功能捷径';
        putCheckBoxItem('浮动私信通知', 'showFloatingMessageIndicator', 2);
        putCheckBoxItem('浮动收藏按钮 (坛上内置功能)', 'showFloatingStoreThreadButton', 2);
        putCheckBoxItem('浮动关注按钮 (类似MARK++)', 'showFloatingWatchIndicator', 2);
        putCheckBoxItem('回到顶部按钮', 'showBackToTopButton', 2);

        addElem(configList, 'dt', 'rinsp-config-item-lv1 rinsp-config-item-checked').textContent = '自动无缝加载翻页';
        putCheckBoxItem('主题帖 - 列表', 'infiniteScroll$threads', 2);
        putCheckBoxItem('主题帖 - 图墙', 'infiniteScroll$threads_picwall', 2);
        putCheckBoxItem('用户主题', 'infiniteScroll$usertopics', 2);
        putCheckBoxItem('用户回复', 'infiniteScroll$userposts', 2);
        putCheckBoxItem('主题帖内容', 'infiniteScroll$thread_posts', 2);
        putCheckBoxItem('搜索结果', 'infiniteScroll$search', 2);
        putCheckBoxItem('收件箱', 'infiniteScroll$msg_inbox', 2);
        putCheckBoxItem('消息跟踪', 'infiniteScroll$msg_sent', 2);
        putCheckBoxItem('通信记录', 'infiniteScroll$msg_chatlog', 2);
        putCheckBoxItem('加载新页后取代地址 (即手动刷新时会停留在新的页数)', 'infiniteScrollReplaceURL', 2).classList.add('rinsp-config-item-sep');
        putCheckBoxItem('加载新页后滚动到新页顶部', 'infiniteScrollScrollToNewPage', 2);

        addElem(configList, 'dt', 'rinsp-config-item-lv1 rinsp-config-item-checked').textContent = '帖内标题';
        putCheckBoxItem('不灰暗化 (改为黑色)', 'siteThemeDarkerSubjectLine');
        putCheckBoxItem('隐藏多余的Re标题', 'hideRedundantReSubjectLine');
        putCheckBoxItem('增加可点击跳转回复原楼链接', 'addQuickJumpReSubjectLine');

        putCheckBoxItem('在列表上显示及加亮自己的主题及最后回复', 'highlightMyself').classList.add('rinsp-config-item-sep');
        putCheckBoxItem('列表内链接默认在新窗口打开', 'threadListDefaultOpenNewPage');
        putCheckBoxItem('发新帖吋自动选择 新回复站内通知', 'autoCheckReplyOption');
        putCheckBoxItem('色标出售框 (以及5sp以上警告)', 'enhanceSellFrame');
        putCheckBoxItem('购买免刷新', 'buyRefreshFree');
        putCheckBoxItem('回复免刷新', 'replyRefreshFree');
        putCheckBoxItem('显示网盘筛选栏', 'showShareTypeFilter');
        putCheckBoxItem('关注列表为空时不在主菜单上显示', 'hideWatchButtonIfEmpty');
        putCheckBoxItem('显示私信长度限制', 'showInputLimit');
        putCheckBoxItem('子分区承继当前图墙模式', 'subCategoryInheritImageWallMode');
        putCheckBoxItem('默认折叠版块公告', 'siteNoticeSectionDefaultFolded');
        putCheckBoxItem('显示默认图墙模式按钮', 'showDefaultingPicWallOption');
        putCheckBoxItem('隐藏 [-- 查看移动版 --]', 'hideMobileVerSwitch');

        addElem(configList, 'dt', 'rinsp-config-item-sep rinsp-config-item-lv1').textContent = '隐藏用户头像 (鼠标放在头像上才显示)';
        putCheckBoxItem('隐藏系统默认头像', 'hideDefaultUserpic');
        putCheckBoxItem('隐藏其他头像', 'hideOtherUserpic');
        putCheckBoxItem('收藏夹内用户除外', 'customUserBypassHideUserpic');
        putCheckBoxItem('自己头像除外', 'selfBypassHideUserpic');
        
        addElem(configList, 'dt', 'rinsp-config-item-sep rinsp-config-item-lv1').textContent = '其他用户头像及资料显示选项';
        putCheckBoxItem('替代弹出信息窗口内的快捷功能', 'useCustomUserInfoPopup');
        putCheckBoxItem('当前楼层用户头像常时可见', 'stickyUserInfo');
        putCheckBoxItem('显示更多用户信息 (头像下)', 'showExtendedUserInfo');
        putCheckBoxItem('显示及高亮负HP', 'showExtendedUserInfo$HP', 2);

        addElem(configList, 'dt', 'rinsp-config-item-sep rinsp-config-item-lv1 rinsp-config-item-checked').textContent = '显示焦点楼层快捷跳转栏';
        putCheckBoxItem('出售框', 'showResourceSpots$sells', 2);
        putCheckBoxItem('附件', 'showResourceSpots$attachments', 2);
        putCheckBoxItem('分享连接', 'showResourceSpots$shares', 2);
        putCheckBoxItem('图片', 'showResourceSpots$images', 2);
        putCheckBoxItem('其他连接', 'showResourceSpots$links', 2);
        putCheckBoxItem('喜欢关键词', 'showResourceSpots$likes', 2);
        putCheckBoxItem('浮动焦点列表 (页面左边)', 'showResourceSpotsFloating', 2).classList.add('rinsp-config-item-sep');
        
        putCheckBoxItem('减低高度占用量模式', 'heightReductionMode').classList.add('rinsp-config-item-sep');
        putCheckBoxItem('减低更多', 'heightReductionMode$LV2', 2);

        addElem(configList, 'dt', 'rinsp-config-item-sep rinsp-config-item-lv1 rinsp-config-item-checked').textContent = '调整论坛默认楼层折叠功能 (恢复论坛旧版模式)';
        putCheckBoxItem('完全不折叠', 'disablePostCollapse', 1, true);
        putCheckBoxItem('不折叠自己的楼层', 'disablePostCollapse$Self', 2);

        addElem(configList, 'dt', 'rinsp-config-item-lv1 rinsp-config-item-checked').textContent = '屏蔽内容/折叠 例外';
        putCheckBoxItem('不折叠及屏蔽收藏夹内用户', 'customUserBypassIgnoreList', 2);
        putCheckBoxItem('不折叠及屏蔽自订头像用户', 'customUserpicBypassIgnoreList', 2);


        addElem(configList, 'dt', 'rinsp-config-item-sep rinsp-config-item-lv1').textContent = '询问&求物区设置';
        putCheckBoxItem('加亮已有答案帖子', 'requestThreadHighlightEnded');
        putCheckBoxItem('显示额外悬赏', 'requestThreadShowExtraBounty');
        putCheckBoxItem('使用浏览记录显示更多资讯', 'requestThreadUseHistoryData');
        putCheckBoxItem('隐藏结算帖', 'hideSettlementPost');
        putCheckBoxItem('只灰暗化 不完全隐藏', 'hideSettlementPost$GreyoutOnly', 2);
        //        putCheckBoxItem('使用默认规则', 'hideSettlementPost$UseDefaultKeywords', 2);
        putCheckBoxItem('针对自己的结算帖除外', 'hideSettlementPost$HighlightMyself', 2);
        putCheckBoxItem('显示状态筛选操作 (在列表右边)', 'showRequestThreadFilters');
        putCheckBoxItem('求物区内不屏蔽用户回复', 'dontFilterRequestReplyByUser');
/*
        const ignoreSettlementItem = addElem(configList, 'dt', 'rinsp-config-item-lv2 rinsp-config-item-checked');
        const ignoreSettlementButton = addElem(ignoreSettlementItem, 'a');
        ignoreSettlementButton.textContent = '✏️编辑关键词列表';
        ignoreSettlementButton.addEventListener('click', function() {
            openIgnoreSettlementEditor();
        });
*/

        addElem(configList, 'dt', 'rinsp-config-item-sep rinsp-config-item-lv1 rinsp-config-item-checked').textContent = '改善帖列表上by乱码';
        putCheckBoxItem('改显示 by楼主 **如有记录时', 'replyShownAsByOp', 2);
        putCheckBoxItem('新帖无回复时不显示 by〷', 'hideZeroReply', 2);

        addElem(configList, 'dt', 'rinsp-config-item-sep rinsp-config-item-lv1 rinsp-config-item-checked').textContent = '🗞️记录已读帖子 - ⚠️占用资源较高';
        addElem(configList, 'dt', 'rinsp-config-item-tip rinsp-config-item-lv2').textContent = '💡 可搜索，主题及回复列表上也会显示记录中的完整标题';
        putCheckBoxItem('启用记录功能', 'keepVisitPostHistory', 2);
        putCheckBoxItem('主题及回复列表上显示原始标题', 'showInitialRememberedTitle', 2);
        const historySummaryItem = addElem(configList, 'dt', 'rinsp-config-item-tip rinsp-config-item-lv2');
        const historyActionItem = addElem(configList, 'dt', 'rinsp-config-item-lv2');
        const clearHistoryMenuButton = addElem(historyActionItem, 'a', 'rinsp-config-item-lv3');
        clearHistoryMenuButton.textContent = '🗑️ 打开清空菜单';
        clearHistoryMenuButton.addEventListener('click', async () => {
            openClearHistoryMenu(clearHistoryMenuButton, updateHistoryCount);
        });

        async function updateHistoryCount() {
            historySummaryItem.textContent = '💡 统计中...';
            const size = await threadHistoryAccess.historyStore.size();
            if (size > 0) {
                historySummaryItem.textContent = `💡 共大约 ${size} 条浏览记录`;
            } else {
                historySummaryItem.textContent = '💡 没有浏览记录';
            }
        }

        updateHistoryCount();


        const ignoreControlItem = addElem(configList, 'dt', 'rinsp-config-item-sep rinsp-config-item-lv1 rinsp-config-item-checked');
        const ignoreControlButton = addElem(ignoreControlItem, 'a');
        ignoreControlButton.textContent = '✏️ 编辑: 🚫屏蔽内容列表';
        ignoreControlButton.addEventListener('click', () => {
            openIgnoreListEditor();
        });
        addElem(configList, 'dt', 'rinsp-config-item-tip rinsp-config-item-lv2').textContent = '💡 南+内置的 (屏蔽此人) 会合并处理';
        addElem(configList, 'dt', 'rinsp-config-item-tip rinsp-config-item-lv2').textContent = '💡 自己的楼层不屏蔽';
        
        putCheckBoxItem('表情符号不予区分 (不同的表情都会一起屏蔽)', 'treatAllEmojiTheSameWay', 2);
        putCheckBoxItem('当有文字内容时不管其他表情 (例: 插眼)', 'ignoreContentUseTextOnly', 2);
        putCheckBoxItem('完全隐藏屏蔽内容的楼层', 'hideIgnoreContentPost', 2);
        addElem(configList, 'dt', 'rinsp-config-item-tip rinsp-config-item-lv3').textContent = '💡 不推荐 求帖有机会要选屏蔽内容为最佳以结帖';
        putCheckBoxItem('关注时屏蔽/折叠内容不予通知', 'watchSkipIgnoreContent', 2);
        putCheckBoxItem('收藏夹内用户的回复除外', 'customUserBypassWatchSkip', 3);

        const ignoreThreadItem = addElem(configList, 'dt', 'rinsp-config-item-sep rinsp-config-item-lv1 rinsp-config-item-checked');
        const ignoreThreadButton = addElem(ignoreThreadItem, 'a');
        ignoreThreadButton.textContent = '✏️ 编辑: 🚫屏蔽标题关键词列表';
        ignoreThreadButton.addEventListener('click', () => {
            openIgnoreThreadEditor();
        });
        putCheckBoxItem('完全隐藏被屏蔽的帖子', 'hideFilteredThread', 2);
        putCheckBoxItem('收藏夹内用户的帖子除外', 'customUserBypassThreadFilter', 2);

        const likeThreadItem = addElem(configList, 'dt', 'rinsp-config-item-lv1 rinsp-config-item-checked');
        const likeThreadButton = addElem(likeThreadItem, 'a');
        likeThreadButton.textContent = '✏️ 编辑: 💚喜欢帖子标题关键词列表 (屏蔽占优先权)';
        likeThreadButton.addEventListener('click', function() {
            openLikeThreadEditor();
        });
        putCheckBoxItem('浮动喜欢帖子列表', 'showFavThreadFloatingList', 2);
        putCheckBoxItem('显示标题前段文字', 'showFavThreadFloatingList$withTitle', 3);
        
        if (hasManagementRole) {
            addElem(configList, 'dt', 'rinsp-config-item-sep rinsp-config-item-lv1 rinsp-config-item-checked').textContent = '💯版主评分设置';
            putCheckBoxItem('免空区评分默认不发送通知', 'adminNoScoreNotifByDefault', 2);
            putCheckBoxItem('不显示 "格式不正" 快捷评分 (固定有通知)', 'adminHideMarkUnscoreButton', 2);
            putCheckBoxItem('不显示 "标记不评分" 快捷评分 (固定不通知)', 'adminHideMarkBadFormatButton', 2);
        }

        renderUserBookmarks();

        renderPinnedUsers();

        let userFilterConfig = await userFilterConfigAccess.read();
        renderUserBlacklist('屏蔽用户列表 - 屏蔽所有内容', entry => entry[1].hideReplies);
        renderUserBlacklist('屏蔽用户列表 - 只屏蔽主题帖', entry => entry[1].hideThreads && !entry[1].hideReplies);

        renderConfigManagement();

        function renderUserBookmarks() {
            const nickNameListHeading = addElem(configPanel, 'h5', 'u-h5');
            addElem(nickNameListHeading, 'span').textContent = '用户收藏夹';
            addElem(nickNameListHeading, 'span', null, { style: 'font-weight:normal'}).textContent = ' (亦记忆其昵称) 点击🔖打开菜单';
            const nickNameListHeadingControls = addElem(nickNameListHeading, 'span', 'r gray3');
            nickNameListHeadingControls.appendChild(document.createTextNode('顺序 '));
            const sortOrderSelect = addElem(nickNameListHeadingControls, 'select');
            addElem(sortOrderSelect, 'option', null, { value: 'uid' }).textContent = 'UID';
            addElem(sortOrderSelect, 'option', null, { value: 'nickname' }).textContent = '昵称';
            sortOrderSelect.value = userConfig.customUserOrderBy;
            sortOrderSelect.value = sortOrderSelect.value || 'uid';
            sortOrderSelect.addEventListener('change', () => {
                configPanel.classList.add('rinsp-config-saving');
                mainConfigAccess.update(function(updatingUserConfig) {
                    updatingUserConfig.customUserOrderBy = sortOrderSelect.value;
                    return updatingUserConfig;
                })
                .finally(function() {
                    configPanel.classList.remove('rinsp-config-saving');
                    window.location.reload();
                });
            });
    
            const nickNameMappingBlock = addElem(configPanel, 'dt', 'rinsp-nickname-list');

            let userItemComparator;
            if (userConfig.customUserOrderBy === 'nickname') {
                userItemComparator = comparator(2);
            } else {
                userItemComparator = comparator(item => item[0] * 1);
            }
    
            Object.entries(userConfig.customUserHashIdMappings)
                .filter(entry => entry[0][0]==='@')
                .map(entry => entry[1])
                .sort(userItemComparator)
                .forEach(function(entry) {
                    const userId = entry[0];
                    const userHashId = entry[1];
                    const userNickName = entry[2];
    
                    const userTag = addElem(nickNameMappingBlock, 'span', 'rinsp-user-tag', {
                        title: `${userNickName}\n${userHashId}`
                    });
                    nickNameMappingBlock.appendChild(document.createTextNode(' '));
                    const userTagIcon = addElem(userTag, 'span', 'rinsp-user-tag-icon');
    
                    const userLink = addElem(userTag, 'a', null, {
                        href: 'u.php?action-show-uid-' + userId + '.html',
                        target: '_blank'
                    });
                    userLink.textContent = userNickName;
                    userTagIcon.addEventListener('click', function() {
                        const deleteAction = () => {
                            if (confirm('取消收藏(' + userNickName + ')？')) {
                                configPanel.classList.add('rinsp-config-saving');
                                changeCustomUserMapping(userId, userHashId, '', true)
                                    .finally(function() {
                                        configPanel.classList.remove('rinsp-config-saving');
                                        userTag.remove();
                                    });
                            }
                        };
                        openBookmarkUserMenu(userTag, userId, userHashId, userNickName, deleteAction);
                    });
                });
        }

        async function renderPinnedUsers() {
            const pinListHeading = addElem(configPanel, 'h5', 'u-h5');
            addElem(pinListHeading, 'span').textContent = '焦点人物';
            configPanel.appendChild(putCheckBoxItem('焦点人物出现时才显示', 'hideInactivePinnedUsers'));
            const showActiveRepliersControl = putCheckBoxItem('自动显示当前页活跃回复者', 'showActiveRepliers');
            const showActiveRepliersMinControl = addElem(showActiveRepliersControl, 'a', null, { href: 'javascript:' });
            showActiveRepliersMinControl.addEventListener('click', async () => {
                let minCount = prompt('最低回复次数', '') * 1;
                if (minCount > 1) {
                    configPanel.classList.add('rinsp-config-saving');
                    mainConfigAccess.update(function(updatingUserConfig) {
                        updatingUserConfig.showActiveRepliers$min = minCount;
                        userConfig = updatingUserConfig;
                        return updatingUserConfig;
                    })
                    .finally(function() {
                        configPanel.classList.remove('rinsp-config-saving');
                        updateMinReplyDisplay();
                    });
                }
            });
            function updateMinReplyDisplay() {
                const minReplyCount = userConfig.showActiveRepliers$min > 1 ? userConfig.showActiveRepliers$min : 2;
                showActiveRepliersMinControl.textContent = ` [最低回复次数: ${minReplyCount}]`;
            }
            updateMinReplyDisplay();
            
            configPanel.appendChild(showActiveRepliersControl);
            const recordListBlock = addElem(configPanel, 'dt', 'rinsp-pinned-user-list');
            const pinnedUsersConfig = await pinnedUsersConfigAccess.read();
            Object.values(pinnedUsersConfig.users).forEach(record => {
                const item = addElem(recordListBlock, 'div', 'rinsp-pinuser-item');
                const face = addElem(item, 'div', 'rinsp-pinuser-item-face');
                addElem(face, 'img', null, { src: record.img });
                const label = addElem(face, 'div');
                addElem(label, 'a', null, { href: `u.php?action-show-uid-${record.uid}.html`, target: '_blank' }).textContent = record.nickName||`#${record.uid}`;
                const unpin = addElem(label, 'div', 'rinsp-pinuser-unpin-icon');
                unpin.addEventListener('click', async () => {
                    await pinnedUsersConfigAccess.update(function(updatingPinnedUsersConfig) {
                        delete updatingPinnedUsersConfig.users['#' + record.uid];
                        // clean up corrupt data ...
                        delete updatingPinnedUsersConfig.users['#NaN'];
                        delete updatingPinnedUsersConfig.users['#null'];
                        return updatingPinnedUsersConfig;
                    });
                    item.remove();
                });
            });

        }

        function renderUserBlacklist(heading, filter) {
            const blockedUserListHeading = addElem(configPanel, 'h5', 'u-h5');
            addElem(blockedUserListHeading, 'span').textContent = heading;
            addElem(blockedUserListHeading, 'span', null, { style: 'font-weight:normal'}).textContent = ' 点击🚫移除';
    
            let userItemComparator;
            if (userConfig.customUserOrderBy === 'nickname') {
                userItemComparator = comparator(item => item[1].name);
            } else {
                userItemComparator = comparator(item => item[0].substring(1) * 1);
            }

            const blockedUserListBlock = addElem(configPanel, 'dt', 'rinsp-user-blacklist');
            Object.entries(userFilterConfig.users)
                .filter(entry => entry[0][0]==='#')
                .sort(userItemComparator)
                .filter(filter)
                .forEach(function(entry) {
                    const userId = entry[0].substring(1) * 1;
                    const userNickName = entry[1].name;
                    const hideThreads = entry[1].hideThreads;
                    const hideReplies = entry[1].hideReplies;
                    if (!hideThreads && !hideReplies) {
                        return;
                    }
                    const userTag = addElem(blockedUserListBlock, 'span', 'rinsp-user-tag', {
                        title: userNickName + '\n' + (hideReplies ? '屏蔽所有内容' : '只屏蔽主题帖')
                    });
                    blockedUserListBlock.appendChild(document.createTextNode(' '));
                    const userTagDel = addElem(userTag, 'span', 'rinsp-user-tag-icon');
    
                    const userLink = addElem(userTag, 'a', null, {
                        href: 'u.php?action-show-uid-' + userId + '.html',
                        target: '_blank'
                    });
                    userLink.textContent = userNickName;
                    userTagDel.addEventListener('click', function() {
                        if (confirm('取消屏蔽(' + userNickName + ')？')) {
                            configPanel.classList.add('rinsp-config-saving');
                            userFilterConfigAccess
                                .update(function(userFilterConfig) {
                                    delete userFilterConfig.users[entry[0]];
                                    return userFilterConfig;
                                })
                                .finally(function() {
                                    configPanel.classList.remove('rinsp-config-saving');
                                    userTag.remove();
                                });
                        }
                    });
                });
        }
    
        function putCheckBoxItem(label, propertyNameOrAccessor, level, inverted) {
            let propertyAccess;
            if (typeof propertyNameOrAccessor === 'string') {
                propertyAccess = {
                    get() {
                        return !!userConfig[propertyNameOrAccessor];
                    },
                    update(newValue) {
                        return mainConfigAccess.update(function(updatingUserConfig) {
                            updatingUserConfig[propertyNameOrAccessor] = newValue;
                            return updatingUserConfig;
                        });
                    }
                };
            } else {
                propertyAccess = propertyNameOrAccessor;
            }
            const configItem = addElem(configList, 'dt', `rinsp-config-item-lv${level||1}`);
            const checkboxLabel = addElem(configItem, 'label');
            const checkbox = addElem(checkboxLabel, 'input', null, { type: 'checkbox' });
            checkboxLabel.appendChild(document.createTextNode(' ' + label));
            checkbox.checked = propertyAccess.get();
            updateStyle();
            function updateStyle() {
                const checkedValue = !inverted; // when inverted false is considered checked
                if (checkbox.checked === checkedValue) {
                    configItem.classList.add('rinsp-config-item-checked');
                } else {
                    configItem.classList.remove('rinsp-config-item-checked');
                }
            }
            checkbox.addEventListener('change', async function() {
                configPanel.classList.add('rinsp-config-saving');
                const newValue = checkbox.checked;
                propertyAccess.update(newValue)
                    .finally(function() {
                        configPanel.classList.remove('rinsp-config-saving');
                        updateStyle();
                    });
            });
            return configItem;
        }

        function renderConfigManagement() {
            const nickNameListHeading = addElem(configPanel, 'h5', 'u-h5');
            addElem(nickNameListHeading, 'span').textContent = '管理设置 (仅当前用户)';
            addElem(nickNameListHeading, 'span', null, { style: 'font-weight:normal'}).textContent = ' ⚠️进阶操作';
    
            const panel = addElem(configPanel, 'div', 'rinsp-config-manage-panel');
            const exportButton = addElem(panel, 'button', null, { type: 'button' });
            exportButton.textContent = '导出设置';
            exportButton.addEventListener('click', () => downloadUserSettings());
            
            addElem(panel, 'span').textContent = ' ／ ';
            
            const importButton = addElem(panel, 'button', null, { type: 'button' });
            importButton.textContent = '导入设置';
            addElem(panel, 'span').textContent = ' ';
            const uploadInput = addElem(panel, 'input', null, { type: 'file', accept: '.rpcfg', style: 'max-width: 18em' });
            importButton.addEventListener('click', () => importSettings(uploadInput));

        }
    }

    function rewriteUserRecentPostLinks(userConfig, userPinArea) {
        document.querySelectorAll('#minifeed .feed-list dt > a[href^="//"]').forEach(el => {
            const href = el.getAttribute('href');
            const tid = (href.match(/\/read.php\?tid-(\d+)\.html$/)||[])[1];
            if (tid) {
                el.setAttribute('href', `/read.php\?tid-${tid}.html`);
            }
        });
    }

    async function importSettings(input) {
        if (!input.value) {
            showMessagePopup('💡请选择文件', input, 1500);
            return;
        }
        async function readData() {
            const dataStream = new Blob([input.files[0]]).stream().pipeThrough(new DecompressionStream('gzip'));
            const rawData = await (await new Response(dataStream).blob()).text();
            return JSON.parse(rawData);
        }
        async function init() {
            const data = await readData();
            const userDataMap = new Map();
            Object.keys(data).forEach(key => {
                if (key[0] === '#') {
                    const id = key.substring(1) * 1;
                    if (id > 0) {
                        userDataMap.set(id, data[key]);
                    }
                }
            });
            if (userDataMap.size !== 1) {
                showMessagePopup('⚠️数据错误', null, 3000);
                return;
            }
            const importedUserId = Array.from(userDataMap.keys())[0];
            if (importedUserId !== myUserId) {
                if (!confirm('⚠️导入数据与用户ID不同，继续操作？')) {
                    return;
                }
            }

            setupPopupMenu({
                title: '已读取数据，请选择操作',
                width: 260,
                popupMenuId: 'CONFIG_IMPORT_ACTION_MENU',
                anchor: input,
                verticallyInverted: true,
                items: [
                    {
                        label: '❗操作前请先关闭其他页面❗',
                        cellClass: 'rinsp-alert-menu-message'
                    },
                    {
                        label: '⚠️注意，请先备份',
                        cellClass: 'rinsp-alert-menu-message'
                    },
                    {
                        label: '合并设置',
                        class: 'rinsp-alert-menu-button',
                        action: () => {
                            if (confirm('现有设置及资料会被改写！！确认执行？')) {
                                const action = async cnt => {
                                    const mergedUserData = await mergeUserData(myUserId, userDataMap.get(importedUserId));
                                    if (!confirm('合并准备完成，最终确认置换！？')) {
                                        return;
                                    }
                                    await importUserSettings(myUserId, mergedUserData);
                                    return '✔️导入完成，自动刷新窗口';
                                };
                                runWithProgressPopup(action, '导入中...', null, 5000)
                                    .then(() => document.location.reload())
                                    .catch(ex => { console.error(ex); alert('' + ex); });
                            }
                        }
                    },
                    {
                        label: '完全覆盖置换',
                        class: 'rinsp-alert-menu-button',
                        action: () => {
                            if (confirm('现有设置及资料会被覆盖！！确认执行？')) {
                                const action = async cnt => {
                                    await importUserSettings(myUserId, userDataMap.get(importedUserId));
                                    return '✔️导入完成，自动刷新窗口';
                                };
                                runWithProgressPopup(action, '导入中...', null, 5000)
                                    .then(() => document.location.reload())
                                    .catch(ex => { console.error(ex); alert('' + ex); });
                            }
                        }
                    },
                    {
                        label: '取消操作',
                        action: () => input.value = null
                    }
                ]
            });
        }
        init().catch(ex => showMessagePopup('⚠️' + ex, input, 3000));
    }

    function mergeArrayData(newData, currentData, keyFunc) {
        const set = new Set();
        newData.forEach(item => {
            set.add(keyFunc(item));
        });
        return currentData.filter(item => !set.has(keyFunc(item))).concat(newData);
    }

    async function importUserSettings(userId, userData) {
        const userKey = '#' + userId;
        const allKeys = await GM.listValues();
        const myKeys = allKeys.filter(key => key.split(':', 1)[0].endsWith(userKey));
        
        for (let key of myKeys) {
            await GM.deleteValue(key).catch(ex => null);
        }
        const entries = Object.entries(userData);
        for (let entry of entries) {
            let dbKey;
            if (entry[0].indexOf(':') === -1) {
                dbKey = entry[0] + userKey;
            } else {
                dbKey = entry[0].replace(':', userKey + ':');
            }
            await GM.setValue(dbKey, entry[1]);
        }
    }

    async function mergeUserData(userId, userData) {
        let currentUserData = await exportUserSettings(userId);

        function merger(configKey) {
            const newData = JSON.parse(userData[configKey]||'{}');
            const baseData = JSON.parse(currentUserData[configKey]||'{}');
            return {
                mergeArrayEntry(key, itemKeyFunc) {
                    newData[key] = mergeArrayData(newData[key]||[], baseData[key]||[], itemKeyFunc||(x=>x));
                    return this;
                },
                mergeKeyValueEntry(key) {
                    newData[key] = Object.assign({}, baseData[key]||{}, newData[key]||{});
                    return this;
                },
                getBaseData() {
                    return baseData;
                },
                getData() {
                    return newData;
                },
                replacing(targetData) {
                    targetData[configKey] = JSON.stringify(newData);
                }
            };
        }
        const newUserData = Object.assign({}, userData);

        merger(MAIN_CONFIG_KEY)
            .mergeKeyValueEntry('customUserHashIdMappings')
            .replacing(newUserData);

        merger(CONTENT_IGNORE_LIST_CONFIG_KEY)
            .mergeArrayEntry('terms')
            .mergeArrayEntry('exceptions')
            .replacing(newUserData);

        merger(SEARCH_CONFIG_KEY)
            .mergeKeyValueEntry('pinnedTopics')
            .replacing(newUserData);
        
        merger(THREAD_CUSTOM_CATEGORY_CONFIG_KEY)
            .mergeArrayEntry('keywords')
            .replacing(newUserData);
        
        merger(THREAD_FILTER_CONFIG_KEY)
            .mergeArrayEntry('dislikes')
            .mergeArrayEntry('likes')
            .mergeArrayEntry('settlementKeywords')
            .replacing(newUserData);

        merger(USER_FILTER_CONFIG_KEY)
            .mergeKeyValueEntry('users')
            .replacing(newUserData);

        merger(PINNED_USERS_CONFIG_KEY)
            .mergeKeyValueEntry('users')
            .replacing(newUserData);

        merger(SHARETYPE_FILTER_CONFIG_KEY)
            .mergeArrayEntry('hides')
            .replacing(newUserData);

        const my_watchlist_merger = merger('my_watchlist');
        newUserData['my_watchlist'] = JSON.stringify(Object.assign({}, my_watchlist_merger.getBaseData(), my_watchlist_merger.getData()));
        
        const tid_visit_history$map = new Map();
        Object.keys(userData).filter(key => key.startsWith('tid_visit_history:#')).forEach(key => {
            const itemMap = new Map();
            userData[key].split(' ').map(item => item.split(':')).forEach(pair => {
                const id = pair[0] * 1;
                if (id > 0) {
                    const count = (pair[1] * 1)||0;
                    itemMap.set(id, count);
                }
            });
            tid_visit_history$map.set(key, itemMap);
        });
        Object.keys(currentUserData).filter(key => key.startsWith('tid_visit_history:#')).forEach(key => {
            let itemMap;
            if (tid_visit_history$map.has(key)) {
                itemMap = tid_visit_history$map.get(key);
            } else {
                itemMap = new Map();
                tid_visit_history$map.set(key, itemMap);
            }
            currentUserData[key].split(' ').map(item => item.split(':')).forEach(pair => {
                const id = pair[0] * 1;
                if (id > 0) {
                    const count = (pair[1] * 1)||0;
                    itemMap.set(id, Math.max(count, itemMap.get(id)||0));
                }
            });
        });
        const tid_visit_history$index = Array.from(tid_visit_history$map.entries()).map(entry => entry[0].split('#', 2)[1] + ':' + entry[1].size).join(' ');
        Object.keys(newUserData).filter(key => key.startsWith('tid_visit_history:#')).forEach(key => delete newUserData[key]);
        tid_visit_history$map.forEach((itemMap, key) => {
            newUserData[key] = Array.from(itemMap.entries()).map(entry => entry[1] > 0 ? `${entry[0]}:${entry[1]}` : `${entry[0]}`).join(' ');
        });
        newUserData['tid_visit_history:index'] = tid_visit_history$index;

        const tid_recent$map = new Map();
        Object.keys(userData).filter(key => key.startsWith('tid_recent:#')).forEach(key => {
            const record = JSON.parse(userData[key]);
            tid_recent$map.set(record.tid, record);
        });
        Object.keys(currentUserData).filter(key => key.startsWith('tid_recent:#')).forEach(key => {
            const record = JSON.parse(currentUserData[key]);
            const dup = tid_recent$map.get(record.tid);
            if (dup == null || record.time > dup.time) {
                tid_recent$map.set(record.tid, record);
            }
        });
        const sortByVisitTime = comparator('time', true);
        const tid_recent$list = Array.from(tid_recent$map.values()).sort(sortByVisitTime).slice(0, MAX_RECENT_ACCESS_LOG);
        let tid_recent$index = '';
        if (tid_recent$list.length > 0) {
            let minTime = (tid_recent$list[0]||{}).time||0;
            tid_recent$list.forEach(record => {
                if (minTime > record.time) minTime = record.time;
            });
            tid_recent$index = tid_recent$list.map(record => record.tid + ':' + (record.time - minTime)).join(' ') + ' 0:' + minTime;
        }
        tid_recent$list.forEach(record => {
            newUserData['tid_recent:#' + record.tid] = JSON.stringify(record);
        });
        newUserData['tid_recent:recent'] = tid_recent$index;
        
        Object.keys(currentUserData)
            .filter(key => !key.startsWith('tid_visit_history:#') && !key.startsWith('tid_recent:#') && !Object_hasOwn(newUserData, key))
            .forEach(key => {
                newUserData[key] = currentUserData[key];
            });

        const user_punish$map = new Map();
        Object.keys(userData).filter(key => key.startsWith('user_punish:#')).forEach(key => {
            const record = JSON.parse(userData[key]);
            record.uid = key.substring(13) * 1;
            user_punish$map.set(key, record);
        });
        Object.keys(currentUserData).filter(key => key.startsWith('user_punish:#')).forEach(key => {
            const current = JSON.parse(currentUserData[key]);
            current.uid = key.substring(13) * 1;
            const dup = user_punish$map.get(key);
            if (dup == null) {
                user_punish$map.set(key, current);
            } else {
                dup.logs = mergeArrayData(current.logs, dup.logs, x=>x.time);
            }
        });
        user_punish$map.forEach((record, key) => {
            newUserData[key] = JSON.stringify(record);
        });
        return newUserData;
    }

    async function exportUserSettings(userId) {
        const userKey = '#' + userId;
        const allKeys = await GM.listValues();
        const myKeys = allKeys.filter(key => key.split(':', 1)[0].endsWith(userKey));
        const myData = {};
        for (let key of myKeys) {
            const value = await GM.getValue(key);
            const parts = key.split(':');
            parts[0] = parts[0].substring(0, parts[0].length - userKey.length);
            const localKey = parts.join(':');
            myData[localKey] = value;
        }
        return myData;
    }

    async function downloadUserSettings() {
        const action = async () => {
            const userData = await exportUserSettings(myUserId);
            const data = {};
            data['#' + myUserId] = userData;
            const utf8Bytes = new TextEncoder().encode(JSON.stringify(data));
            const chunks = [];
            const reader = new Blob([utf8Bytes]).stream().pipeThrough(new CompressionStream('gzip')).getReader();
            while (true) {
                const status = await reader.read();
                if (status.done) break;
                chunks.push(status.value);
            }
            const blob = new Blob(chunks, { type: 'application/octet-stream' });

            //const blob = new Blob([base64data], { type: 'text/plain;charset=utf-8' });
            
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `rinplus_${myUserId}_${new Date().toISOString().replace(/:/g, '').replace(/\.\d{3}Z$/, '')}.rpcfg`;
            downloadLink.click();
            URL.revokeObjectURL(downloadLink.href);
            return '✔️已触发下载';
        };
        await runWithProgressPopup(action, '导出中...', null, 1500)
            .catch((ex) => {
                console.error(ex);
                alert(String(ex));
            });
    }

    async function openIgnoreListEditor(callback) {
        openTextListEditor(IGNORE_LIST_POPUP_MENU_ID, {
            title: '🚫屏蔽内容列表',
            async read() {
                const ignoreList = await contentIgnoreListConfigAccess.read();
                return ignoreList.terms.sort().join('\n');
            },
            async save(textData) {
                return await contentIgnoreListConfigAccess.update(function(ignoreList) {
                    const newTerms = textData.split('\n').map(itm=>itm.trim()).filter(itm=>!!itm);
                    ignoreList.terms = newTerms;
                    return ignoreList;
                });
            }
        }, callback);
    }

    async function openIgnoreThreadEditor(callback) {
        openTextListEditor(THREAD_FILTER_POPUP_MENU_ID, {
            title: '🚫屏蔽标题关键词列表',
            async read() {
                const filterConfig = await threadFilterConfigAccess.read();
                return filterConfig.dislikes.sort().join('\n');
            },
            async save(textData) {
                return await threadFilterConfigAccess.update(function(filterConfig) {
                    const newKeywords = textData.toLowerCase().split('\n').map(itm=>itm.replace(/\s+/g, ' ').trim()).filter(itm=>!!itm);
                    filterConfig.dislikes = newKeywords;
                    return filterConfig;
                });
            }
        }, callback);
    }

    async function openLikeThreadEditor(callback) {
        openTextListEditor(THREAD_LIKE_POPUP_MENU_ID, {
            title: '💚喜欢帖子标题关键词列表',
            description: `每行一个关键字
正则表达式高级设置 (懂的都懂 不懂可无视) 格式: regex:/正则表达式语法/
      例子: regex:/[东南西北]\+/`,
            async read() {
                const filterConfig = await threadFilterConfigAccess.read();
                return filterConfig.likes.sort().join('\n');
            },
            async save(textData) {
                return await threadFilterConfigAccess.update(function(filterConfig) {
                    const newKeywords = textData.toLowerCase().split('\n').map(itm=>itm.replace(/\s+/g, ' ').trim()).filter(itm=>!!itm);
                    filterConfig.likes = newKeywords;
                    return filterConfig;
                });
            }
        }, callback);
    }

    function addPrivateMessageNotifier() {
        const pmElem = document.querySelector('#td_msg');
        const observer = new MutationObserver(function() {
            updatePrivateMessageStatus();
        });
        updatePrivateMessageStatus();
        observer.observe(pmElem, { childList: true, subtree: true, attributes: true });

        function updatePrivateMessageStatus() {
            const hasMessage = pmElem.querySelector('img[src="images/colorImagination/shortmail.gif"]') != null;
            pmNotificationElem.textContent = '';
            if (hasMessage) {
                pmNotificationElem.classList.add('rinsp-status-new');
                addElem(pmNotificationElem, 'img', null, { src: 'images/colorImagination/shortmail.gif', align: 'absmiddle' });
                pmNotificationElem.appendChild(document.createTextNode('\n未\n读\n私\n信'));
            } else {
                pmNotificationElem.classList.remove('rinsp-status-new');
            }
        }
    }

    function addTitleLengthLimitIndicator() {
        const titleField = document.querySelector('form[action="post.php?"] input[name="atc_title"]');
        if (titleField) {
            addLengthLimit(titleField, 300, 100, true, true);
        }
    }

    function addWatchMenuButton() {
        const userLogin = document.querySelector('#user-login #td_msg');
        if (userLogin != null) {
            const watchMenuElem = newElem('a', 'rinsp-watch-menuitem', {
                href: 'javascript:void(0)'
            });
            watchMenuElem.textContent = '关注';
            userLogin.after(watchMenuElem);
            return watchMenuElem;
        }
        return null;
    }

    function initTopMenu() {

        const watchMenuElem = addWatchMenuButton();
        if (watchMenuElem == null) {
            return;
        }
        watchNotificationElem.addEventListener('click', () => {
            document.body.scrollIntoView();
            watchMenuElem.click();
        });

        watchMenuElem.addEventListener('click', function() {
            showWatchMenu();
            return false;
        });

        async function tryCheck(override) {
            if (DEBUG_MODE) console.info('tryCheck (override=' + (override||null) + ')');
            let pending = [];
            let skipUntil = Date.now() + TEMP_INCREMENT;
            await updateWatchList(function(watchList) {
                const now = Date.now();
                const watchItems = Object.values(watchList).sort(comparator('lastChecked'));
                if (watchItems.length === 0) {
                    return null;
                }
                let checkableOldestItem = null;
                for (let watchItem of watchItems) {
                    if (isWatchExpired(watchItem)) {
                        continue;
                    }
                    if (typeof override === 'number') {
                        if (watchItem.id !== override) {
                            continue;
                        }
                    } else if (override !== true) {
                        let outdatedBy = now - watchItem.lastChecked;
                        if (watchItem.skipUntil > now) {
                            if (DEBUG_MODE) console.info('skip-for-now', watchItem.id);
                            continue;
                        }
                        if (outdatedBy < getScaledValue(watchItem, num(MIN_CHECK_INTERVAL), num(MAX_CHECK_INTERVAL)) * 60000) {
                            if (checkableOldestItem == null) {
                                if (outdatedBy >= getScaledValue(watchItem, num(MIN_CHECK_INTERVAL_OLDEST_ITEM), num(MAX_CHECK_INTERVAL_OLDEST_ITEM)) * 60000) {
                                    checkableOldestItem = watchItem;
                                }
                            }
                            continue;
                        }
                    }
                    pending.push(watchItem.id);
                    watchItem.skipUntil = skipUntil;
                }

                if (pending.length === 0 && checkableOldestItem != null) {
                    if (DEBUG_MODE) console.info('tryCheck - picked one oldest item: ' + checkableOldestItem.id);
                    pending.push(checkableOldestItem.id);
                    checkableOldestItem.skipUntil = skipUntil;
                }
                if (pending.length > 0) {
                    return watchList;
                } else {
                    return null;
                }
            });
            if (pending.length > 0) {
                if (DEBUG_MODE) console.info('tryCheck - ' + pending.length  + ' items');
                watchMenuElem.classList.add('rinsp-checking');
                await runCheck(pending, skipUntil)
                    .finally(function() {
                        watchMenuElem.classList.remove('rinsp-checking');
                    });
            } else {
                if (DEBUG_MODE) console.info('tryCheck - nothing to do');
            }
            await refreshWatchStatus();
        }

        async function runCheck(postIds, mySkipUntil) {
            let first = true;
            const ignoreList = await contentIgnoreListConfigAccess.read();
            async function checkWatchPost(watchList, watchPostId) {
                const watchItem = watchList['#' + watchPostId];
                if (watchItem == null) {
                    return null;
                }
                const now = Date.now();
                if (isWatchExpired(watchItem)) {
                    return null;
                }
                if (watchItem.skipUntil !== mySkipUntil && watchItem.skipUntil > now) {
                    return null;
                }
                watchItem.lastChecked = now;

                // enforce request rate control
                while (true) {
                    const rateInterval = Math.floor(now / MAX_ACC_REQUEST_RATE_BASE);
                    const lastRateRecord = (localStorage.getItem(REQUEST_RATE_RECORD_KEY)||'').split(':').map(item=>item*1);
                    if (rateInterval === lastRateRecord[0]) {
                        const accessCount = (lastRateRecord[1]*1)||0;
                        if (accessCount >= MAX_ACC_REQUEST_RATE_COUNT) {
                            if (DEBUG_MODE) console.info('HITTING RATE LIMIT - WAITING');
                            await sleep(MIN_REQUEST_DELAY);
                            continue;
                        }
                        localStorage.setItem(REQUEST_RATE_RECORD_KEY, `${rateInterval}:${accessCount + 1}`);
                    } else {
                        localStorage.setItem(REQUEST_RATE_RECORD_KEY, `${rateInterval}:1`);
                    }
                    break;
                }

                const lastPost = await fetchLastPost(watchPostId, ignoreList);
                if (lastPost.error) {
                    if (lastPost.errorMessage.indexOf('刷新不要') != -1) {
                        watchItem.skipUntil = Date.now() + MIN_REQUEST_DELAY;
                        return watchList;
                    } else {
                        watchItem.skipUntil = Number.MAX_SAFE_INTEGER;
                        watchItem.lastError = lastPost.errorMessage;
                        return watchList;
                    }
                }

                let bountyEnded = null;
                if (watchItem.bountyUntil > 0) {
                    if (lastPost.page > 1) {
                        await sleep(1500);
                        bountyEnded = !!(await fetchCheckBountyEnded(watchPostId));
                    } else {
                        bountyEnded = lastPost.bountyEnded;
                    }
                }

                if (lastPost.postUid === myUserId && lastPost.page == lastPost.maxPage && (lastPost.floor - watchItem.maxFloor) <= 1) {
                    // note: only can trust my own last post if the floor differs by one only
                    watchItem.lastVisitedPage = lastPost.page;
                    watchItem.lastVisitedFloor = lastPost.floor;
                    watchItem.lastVisitedPostId = lastPost.postId;
                }
                let lastUpdateIgnorable = null;
                if (userConfig.watchSkipIgnoreContent) {
                    const lastSeenPost = lastPost.postsByFloor[watchItem.lastVisitedFloor];
                    if (lastSeenPost != null && lastSeenPost.postId === watchItem.lastVisitedPostId) {
                        // last seen post is still valid and at the same floor
                        if (DEBUG_MODE) console.info('check floors', watchItem.lastVisitedFloor + 1, lastPost.floor);
                        for (let floor = watchItem.lastVisitedFloor + 1; floor <= lastPost.floor; floor++) {
                            if (lastUpdateIgnorable == null) {
                                lastUpdateIgnorable = true;
                            }
                            const newPost = lastPost.postsByFloor[floor];
                            if (!newPost.ignorable) {
                                lastUpdateIgnorable = false;
                                break;
                            }
                            if (userConfig.customUserBypassWatchSkip) {
                                if (userConfig.customUserHashIdMappings['#' + newPost.postUid] != null) {
                                    lastUpdateIgnorable = false;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (DEBUG_MODE) console.info('ignorable', watchItem, lastUpdateIgnorable);
                watchItem.lastUpdateIgnorable = !!lastUpdateIgnorable;
                watchItem.maxPage = lastPost.maxPage;
                watchItem.maxFloor = lastPost.floor;
                watchItem.maxFloorApprox = lastPost.maxPage !== lastPost.page;
                watchItem.lastPostId = lastPost.postId;
                watchItem.lastPostUid = lastPost.postUid;
                watchItem.lastPostTime = lastPost.postTime;
                watchItem.skipUntil = 0;
                watchItem.lastError = null;
                if (bountyEnded) {
                    watchItem.bountyUntil = -1;
                }
                return watchList;
            }
            async function checkAndUpdateWatchPost(watchPostId) {
                if (DEBUG_MODE) console.info('checking ... ' + watchPostId);
                watchMenuElem.classList.add('rinsp-checking');
                await updateWatchList(
                    async function(watchList) {
                        const updatedWatchList = await checkWatchPost(watchList, watchPostId);
                        if (updatedWatchList != null) {
                            refreshWatchStatus(updatedWatchList);
                        }
                        return updatedWatchList;
                    })
                    .catch(e => {
                        console.warn(`error when checking post ${watchPostId}:`, e);
                        return true;
                    })
                    .finally(() => {
                        pendingWatchItemChecks.delete(watchPostId);
                        if (pendingWatchItemChecks.size === 0) {
                            watchMenuElem.classList.remove('rinsp-checking');
                        }
                        if (document.getElementById(WATCHER_POPUP_MENU_ID)) {
                            showWatchMenu();
                        }
                    });
                if (DEBUG_MODE) console.info('done ... ' + watchPostId);
            }
            const checkablePostIds = [];
            postIds.forEach(postId => {
                if (!pendingWatchItemChecks.has(postId)) {
                    pendingWatchItemChecks.add(postId);
                    checkablePostIds.push(postId);
                }
            });
            if (document.getElementById(WATCHER_POPUP_MENU_ID)) {
                showWatchMenu();
            }
            for (let watchPostId of checkablePostIds) {
                if (first) {
                    //console.info('wait');
                    await sleep(MIN_REQUEST_DELAY);
                } else {
                    first = false;
                }
                await checkAndUpdateWatchPost(watchPostId);
            }
        }

        async function refreshWatchStatus(initWatchList) {
            const watchList = initWatchList ? initWatchList : await readWatchList();
            let errorCount = 0;
            let updateCount = 0;
            let totalCount = 0;
            for (let watchItem of Object.values(watchList)) {
                const itemStatus = getWatchItemStatus(watchItem);
                if (itemStatus === 'new') {
                    updateCount++;
                } else if (itemStatus === 'error') {
                    errorCount++;
                }
                totalCount++;
            }
            if (totalCount > 0) {
                watchMenuElem.classList.add('rinsp-status-enabled');
            } else {
                watchMenuElem.classList.remove('rinsp-status-enabled');
            }
            
            watchNotificationElem.textContent = '';
            if (updateCount > 0) {
                watchMenuElem.classList.add('rinsp-status-new');
                watchMenuElem.dataset.newCount = updateCount;
                watchNotificationElem.classList.add('rinsp-status-new');
                addElem(watchNotificationElem, 'div', 'rinsp-notification-item-count').textContent = String(updateCount);
                watchNotificationElem.appendChild(document.createTextNode('关\n注\n更\n新'));
            } else {
                watchMenuElem.dataset.newCount = '';
                watchMenuElem.classList.remove('rinsp-status-new');
                watchNotificationElem.classList.remove('rinsp-status-new');
            }
            if (errorCount > 0) {
                watchMenuElem.classList.add('rinsp-status-error');
                watchNotificationElem.classList.add('rinsp-status-error');
                watchNotificationElem.textContent = '⚠️\n关\n注\n出\n错';
            } else {
                watchMenuElem.classList.remove('rinsp-status-error');
                watchNotificationElem.classList.remove('rinsp-status-error');
            }
        }

        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                setTimeout(function() {
                    if (document.visibilityState === 'visible') {
                        tryCheck();
                    }
                }, 3000);
            }
        });

        refreshWatchStatus().then(() => {
            setTimeout(function() {
                tryCheck();
            }, 3000);
        });

        setInterval(function() {
            if (document.visibilityState === 'visible') {
                tryCheck();
            }
        }, num(MIN_CHECK_INTERVAL_OLDEST_ITEM) * 60000 + 1000);


        const currentThreadWatchControls = [];
        let currentThreadWatching = false;
        const currentThread = {
            register(ctrl) {
                currentThreadWatchControls.push(ctrl);
            },
            isWatching() {
                return currentThreadWatching;
            },
            setWatching(watching) {
                currentThreadWatching = watching;
                currentThreadWatchControls.forEach(ctrl => ctrl.setWatching(watching));
            },
            setBusy(busy) {
                currentThreadWatchControls.forEach(ctrl => ctrl.setBusy(busy));
            }
        };
        return {
            currentThread,
            tryCheck
        };
    }

    function getWatchItemStatus(watchItem) {
        if (watchItem.lastError) {
            return 'error';
        }
        if (watchItem.lastUpdateIgnorable) {
            return 'ignorable';
        }
        if (watchItem.lastPostUid !== myUserId && watchItem.maxFloor != watchItem.lastVisitedFloor) {
            return 'new';
        }
    }

    async function showWatchMenu() {
        closePopupMenu(WATCHER_POPUP_MENU_ID);
        const popupMenu = createPopupMenu(WATCHER_POPUP_MENU_ID, document.querySelector('#user-login'));
        const watchList = await readWatchList();
        popupMenu.renderContent(async function(borElem) {
            const watchItems = Object.values(watchList);
            if (watchItems.length === 0) {
                borElem.setAttribute('style', 'padding:13px 30px');
                borElem.textContent = '关注列表为空';
                return;
            }

            watchItems.sort(function(x, y) {
                const xNew = x.lastVisitedFloor != x.maxFloor;
                const yNew = y.lastVisitedFloor != y.maxFloor;
                if (xNew !== yNew) {
                    return xNew ? -1 : 1;
                }
                return x.timeAdded - x.timeAdded;
            });

            const tableElem = addElem(borElem, 'table', null, {
                width: '800',
                cellspacing: '0',
                cellpadding: '0',
                style: 'table-layout:fixed'
            });

            const colgroup = addElem(tableElem, 'colgroup');
            addElem(colgroup, 'col', null, { style: 'width: 100px' });
            addElem(colgroup, 'col');
            addElem(colgroup, 'col', null, { style: 'width: 100px' });
            addElem(colgroup, 'col', null, { style: 'width: 120px' });
            addElem(colgroup, 'col', null, { style: 'width: 120px' });
            addElem(colgroup, 'col', null, { style: 'width: 50px' });
            addElem(colgroup, 'col', null, { style: 'width: 20px' }); // allow for scrollbar
            const tbodyElem = addElem(tableElem, 'tbody');

            const trElem1 = addElem(tbodyElem, 'tr');

            const thElem1_1 = addElem(trElem1, 'th', 'h', {
                colspan: '6'
            });
            addElem(trElem1, 'th', 'h');

            const frElem1 = addElem(thElem1_1, 'span', 'fr', {
                style: 'margin-top:2px;cursor:pointer'
            });
            frElem1.addEventListener('click', function() {
                closePopupMenu(WATCHER_POPUP_MENU_ID);
            });

            addElem(frElem1, 'img', null, {
                src: 'images/close.gif'
            });
            thElem1_1.appendChild(document.createTextNode('关注列表'));

            const trElemAct = addElem(tbodyElem, 'tr', 'tr2 tac');
            const actCell = addElem(trElemAct, 'td', 'rinsp-action-bar', { colspan: '6' });
            addElem(trElemAct, 'td');
            const checkNowButton = addElem(actCell, 'span', 'rinsp-check-now');
            checkNowButton.textContent = '🔃立即检查';
            checkNowButton.addEventListener('click', function() {
                closePopupMenu(WATCHER_POPUP_MENU_ID);
                watcherApi.tryCheck(true);
            });
            let maxReachedWarnElem = null;
            if (watchItems.length >= num(MAX_WATCH_ITEM_COUNT)) {
                maxReachedWarnElem = addElem(actCell, 'span', 'rinsp-limit-warning').textContent = '关注数量已达上限';
            }

            const trElem2 = addElem(tbodyElem, 'tr', 'tr2 tac');
            addElem(trElem2, 'td').textContent = '版块名称';
            addElem(trElem2, 'td').textContent = '标题';
            addElem(trElem2, 'td').textContent = '悬赏剩时';
            addElem(trElem2, 'td').textContent = '最近回复';
            addElem(trElem2, 'td').textContent = '最近检查';
            addElem(trElem2, 'td').textContent = '删';
            addElem(trElem2, 'td');

            const now = Date.now();
            watchItems.forEach(function(watchItem) {
                const trElem3 = addElem(tbodyElem, 'tr', 'tr3 tac');
                addElem(trElem3, 'td').textContent = watchItem.areaName;
                const titleCell = addElem(trElem3, 'td', 'tal');
                let postUrl = `read.php?tid-${watchItem.id}.html`;
                if (watchItem.lastVisitedPage > 1) {
                    postUrl = `read.php?tid-${watchItem.id}-fpage-0-toread--page-${watchItem.lastVisitedPage}.html`;
                }
                addElem(titleCell, 'a', null, {
                    href: postUrl,
                    target: '_blank'
                }).textContent = watchItem.postTitle;
                const bountyCell = addElem(trElem3, 'td', 'rinsp-bounty-cell');
                const expired = isWatchExpired(watchItem);
                if (expired) {
                    trElem3.classList.add('rinsp-expired');
                    bountyCell.textContent = '关注已过期';
                } else if (watchItem.areaName === REQUEST_ZONE_NAME) {
                    if (watchItem.bountyUntil === -1) {
                        bountyCell.classList.add('rinsp-bounty-answered');
                        bountyCell.textContent = '已有答案';
                    } else {
                        const hourLeft = ((watchItem.bountyUntil||0) - now) / 3600000;
                        if (hourLeft <= 0) {
                            bountyCell.classList.add('rinsp-bounty-ended');
                            if (watchItem.bountyUntil != null) {
                                const ageString = getAgeString((now - watchItem.bountyUntil) / 60000);
                                bountyCell.textContent = `已过期 (${ageString})`;
                            } else {
                                bountyCell.textContent = '已过期';
                            }
                        } else {
                            bountyCell.textContent = `${Math.floor(hourLeft.toFixed(0))}小时`;
                        }
                    }

                }
                const lastReplyCell = addElem(trElem3, 'td', 'rinsp-lastreply-cell');
                const floorElem = newElem('span', 'rinsp-lastreply-floor');
                if (watchItem.lastPostUid === myUserId) {
                    floorElem.textContent = MY_NAME_DISPLAY;
                    lastReplyCell.classList.add('rinsp-reply-self');
                } else if (watchItem.maxFloor > 0) {
                    if (watchItem.maxFloorApprox) {
                        floorElem.textContent = `${watchItem.maxFloor}楼+`;
                    } else {
                        floorElem.textContent = `${watchItem.maxFloor}楼`;
                    }
                } else {
                    floorElem.textContent = '无回复';
                }
                if (watchItem.lastPostTime > 0) {
                    lastReplyCell.appendChild(document.createTextNode(`${getAgeString((now - watchItem.lastPostTime) / 60000)} / `));
                }
                lastReplyCell.appendChild(floorElem);
                
                const statusCell = addElem(trElem3, 'td', 'rinsp-status-cell');
                statusCell.textContent = getStatusText(watchItem);
                if (expired) {
                    statusCell.setAttribute('title', '下次检查: 已关闭');
                } else {
                    const checkMin = getScaledValue(watchItem, num(MIN_CHECK_INTERVAL), num(MAX_CHECK_INTERVAL));
                    const checkOneMin = getScaledValue(watchItem, num(MIN_CHECK_INTERVAL_OLDEST_ITEM), num(MAX_CHECK_INTERVAL_OLDEST_ITEM));
                    if (pendingWatchItemChecks.has(watchItem.id)) {
                        trElem3.classList.add('rinsp-checking');
                        statusCell.setAttribute('title', '正在检查');
                    } else {
                        if (checkMin >= 60) {
                            if (checkOneMin >= 60) {
                                statusCell.setAttribute('title', '下次检查: ' + formatRangeText((checkOneMin / 60).toFixed(0), (checkMin / 60).toFixed(0)) + ' 小时');
                            } else {
                                statusCell.setAttribute('title', '下次检查: ' + checkOneMin.toFixed(0) + ' 分钟 - ' + (checkMin / 60).toFixed(0) + ' 小时');
                            }
                        } else {
                            statusCell.setAttribute('title', '下次检查: ' + formatRangeText(checkOneMin.toFixed(0), checkMin.toFixed(0)) + ' 分钟');
                        }
                        statusCell.addEventListener('click', function() {
                            watcherApi.tryCheck(watchItem.id);
                        });
                    }
        
                }
                const delCell = addElem(trElem3, 'td');
                const delButton = addElem(delCell, 'img', null, {
                    src: 'images/post/c_editor/del.gif',
                    style: 'cursor:pointer'
                });
                delButton.addEventListener('click', function() {
                    if (watchItem.lastError == null && !expired) {
                        if (!confirm('从关注列表中移除？以后不会收到更多回复通知')) {
                            return;
                        }
                    }
                    showNativeSpinner();
                    updateWatchList(watchList => {
                        const postIdKey = '#' + watchItem.id;
                        if (!Object_hasOwn(watchList, postIdKey)) {
                            return null;
                        }
                        delete watchList[postIdKey];
                        return watchList;
                    })
                    .then(function() {
                        trElem3.remove();
                        if (maxReachedWarnElem != null) {
                            maxReachedWarnElem.remove();
                            maxReachedWarnElem = null;
                        }
                        if (tableElem.querySelectorAll('tr.tr3.tac').length === 0) {
                            closePopupMenu(WATCHER_POPUP_MENU_ID);
                        }
                    })
                    .finally(() => closeNativeSpinner());
                });
                addElem(trElem3, 'td');
                const status = getWatchItemStatus(watchItem);
                if (status != null) {
                    trElem3.classList.add('rinsp-' + status);
                }

            });
        });

        function formatRangeText(minText, maxText) {
            if (minText === maxText) {
                return minText;
            } else {
                return minText + ' - ' + maxText;
            }
        }
    }

    function initCurrentPost() {
        const currentPostLink = document.querySelector('#breadcrumbs .crumbs-item.current strong > a[href^="read.php?tid-"]');
        if (currentPostLink == null) {
            return;
        }

        const areaLink = currentPostLink.closest('.crumbs-item').previousElementSibling;
        const fid = Number.parseInt(areaLink.getAttribute('href').split('?fid-', 2)[1]);
        const areaName = areaLink.textContent.trim();
        const postTitle = currentPostLink.textContent.trim();
        const postId = Number.parseInt(currentPostLink.getAttribute('href').substring(13));
        if (Number.isNaN(postId)) {
            return;
        }
        const postIdKey = '#' + postId;

        const pageArr = readCurrentAndMaxPage(document);
        const currentPage = pageArr[0];
        let maxPage = pageArr[1];

        if (userConfig.showFloatingStoreThreadButton) {
            addFloatingFavorButton(topControlContainer, postId, favorThreadsCacheAccess);
        }
        if (userConfig.showFloatingWatchIndicator) {
            const watchButton = addElem(topControlContainer, 'a', 'rinsp-excontrol-item rinsp-excontrol-item-watch rinsp-excontrol-item-ticker');
            watchButton.textContent = '🔥\n关\n注';
            watchButton.addEventListener('click', () => {
                if (watcherApi.currentThread.isWatching()) {
                    showNativeSpinner();
                    removeFromWatchList()
                        .finally(() => closeNativeSpinner());
                } else {
                    showNativeSpinner();
                    addToWatchList()
                        .finally(() => closeNativeSpinner());
                }
            });
            
            watcherApi.currentThread.register({
                setWatching(watching) {
                    if (watching) {
                        watchButton.classList.add('rinsp-active');
                    } else {
                        watchButton.classList.remove('rinsp-active');
                    }
                },
                setBusy(busy) {
                    if (busy) {
                        watchButton.classList.add('rinsp-running');
                    } else {
                        watchButton.classList.remove('rinsp-running');
                    }
                }
            });
        }

        function initIfFirstPage() {
            const shouElem = document.querySelector('.tr1.r_one .tipad .readbot .shou');
            if (shouElem == null) {
                return;
            }

            const watchElem = document.createElement('li');
            watchElem.classList.add('rinsp-watch');
            watchElem.textContent = '关注: ';
            shouElem.parentNode.appendChild(watchElem);

            watcherApi.currentThread.register({
                setWatching(watching) {
                    if (watching) {
                        watchElem.classList.add('rinsp-active');
                    } else {
                        watchElem.classList.remove('rinsp-active');
                    }
                },
                setBusy(busy) {
                    if (busy) {
                        watchElem.classList.add('rinsp-running');
                    } else {
                        watchElem.classList.remove('rinsp-running');
                    }
                }
            });
            watchElem.addEventListener('click', function() {
                if (watcherApi.currentThread.isWatching()) {
                    showNativeSpinner();
                    removeFromWatchList()
                        .finally(() => closeNativeSpinner());
                } else {
                    showNativeSpinner();
                    addToWatchList()
                        .finally(() => closeNativeSpinner());
                }
            });

        }

        async function removeFromWatchList() {
            watcherApi.currentThread.setBusy(true);
            await updateWatchList(function(watchList) {
                if (!Object_hasOwn(watchList, postIdKey)) {
                    return null;
                }
                delete watchList[postIdKey];
                return watchList;
            });
            watcherApi.currentThread.setWatching(false);
            watcherApi.currentThread.setBusy(false);
        }

        async function addToWatchList() {
            watcherApi.currentThread.setBusy(true);
            let fp = null;
            if (currentPage === 1) {
                const onlyGfLink = document.querySelector('#td_tpc a[href^="read.php?tid-' + postId + '-uid-"]');
                if (onlyGfLink != null) {
                    fp = document;
                }
            }
            if (fp == null) {
                fp = await fetchGetPage(`${document.location.origin}/read.php?tid-${postId}.html`);
            }
            
            const onlyGfLink = fp.querySelector('#td_tpc a[href^="read.php?tid-' + postId + '-uid-"]');
            if (onlyGfLink == null) {
                return;
            }
            const gfUid = Number.parseInt(onlyGfLink.getAttribute('href').replace(/.*-uid-/, ''));
            const opDate = new Date(fp.querySelector('#td_tpc > .tiptop > .fl.gray[title^="发表于:"]').textContent.trim()) * 1;

            let bountyUntil = null;
            if (fid === QUESTION_AND_REQUEST_AREA_ID) {
                const bountyStatus = getBountyStatus(fp);
                bountyUntil = bountyStatus ? bountyStatus.bountyUntil : null;
            }

            const lastPost = await getLastPost();
            let added = false;
            await updateWatchList(watchList => {
                if (Object.keys(watchList).length >= num(MAX_WATCH_ITEM_COUNT)) {
                    return null;
                }
                watchList[postIdKey] = {
                    id: postId,
                    owner: gfUid,
                    areaName: areaName,
                    postTitle: postTitle,
                    maxPage: lastPost.page,
                    maxFloor: lastPost.floor,
                    maxFloorApprox: false,
                    lastVisitedPage: lastPost.page,
                    lastVisitedFloor: lastPost.floor,
                    lastVisitedPostId: lastPost.postId,
                    lastPostId: lastPost.postId,
                    lastPostUid: lastPost.postUid,
                    lastPostTime: lastPost.postTime,
                    lastUpdateIgnorable: false,
                    lastChecked: Date.now(),
                    skipUntil: 0,
                    lastError: null,
                    bountyUntil: bountyUntil,
                    timeOpened: opDate,
                    timeAdded: Date.now()
                };
                added = true;
                return watchList;
            });
            watcherApi.currentThread.setBusy(false);
            watcherApi.currentThread.setWatching(added);
            if (!added) {
                showWatchMenu();
            }
        }
        if (currentPage === 1) {
            initIfFirstPage();
        }

        async function update(alsoUpdateSavedData) {
            const watchList = await readWatchList();
            const watchItem = watchList[postIdKey];
            watcherApi.currentThread.setWatching(watchItem != null);
            if (watchItem != null && alsoUpdateSavedData) {
                if (DEBUG_MODE) console.info('mark read', postId);
                // only use the current page if applicable to update the current watch item
                let bountyUntil = null;
                if (watchItem.bountyUntil > 0) {
                    if (currentPage === 1) {
                        const bountyStatus = getBountyStatus(document);
                        if (bountyStatus != null) {
                            bountyUntil = bountyStatus.bountyUntil;
                        }
                    }
                }
                if (currentPage === maxPage) {
                    const lastPost = await getLastPost();
                    watchItem.postTitle = postTitle;
                    watchItem.maxPage = maxPage;
                    watchItem.maxFloor = lastPost.floor;
                    watchItem.maxFloorApprox = false;
                    watchItem.lastVisitedPage = lastPost.page;
                    watchItem.lastVisitedFloor = lastPost.floor;
                    watchItem.lastVisitedPostId = lastPost.postId;
                    watchItem.lastPostId = lastPost.postId;
                    watchItem.lastPostUid = lastPost.postUid;
                    watchItem.lastPostTime = lastPost.postTime;
                    watchItem.lastUpdateIgnorable = false;
                    watchItem.lastChecked = Date.now();
                    watchItem.skipUntil = 0;
                    watchItem.lastError = null;
                    if (bountyUntil != null) {
                        watchItem.bountyUntil = bountyUntil;
                    }
                    await writeWatchList(watchList);
                } else if (bountyUntil != null && watchItem.bountyUntil != bountyUntil) {
                    watchItem.bountyUntil = bountyUntil;
                    await writeWatchList(watchList);
                }
            }
        }

        update(true);

        async function getLastPost() {
            //console.info('getLastPost', currentPage, maxPage);
            if (currentPage === maxPage) {
                return findLastPost(document, null, null); // ignore filters not needed
            } else {
                return fetchLastPost(postId);
            }
        }

    }

    async function fetchCheckBountyEnded(postId) {
        const doc = await fetchGetPage(`${document.location.origin}/read.php?tid-${postId}.html`);
        const bountyStatus = getBountyStatus(doc);
        return bountyStatus == null ? null : bountyStatus.ended === 2;
    }

    async function fetchLastPost(postId, ignoreList) {
        const url = `${document.location.origin}/read.php?tid-${postId}-page-e-fpage-1.html`;
        const doc = await fetchGetPage(url);
        const lastPost = findLastPost(doc, userFilter, ignoreList);
        if (DEBUG_MODE) console.info('fetchLastPost', url, lastPost);
        if (lastPost == null) {
            return {
                error: 'PAGE_GONE',
                errorMessage: findErrorMessage(doc)
            };
        } else {
            return lastPost;
        }
    }

    function getStatusText(watchItem) {
        //console.info('getStatusText', watchItem);
        if (watchItem.lastError) {
            return watchItem.lastError;
        }
        const unreadFloor = watchItem.maxFloor - watchItem.lastVisitedFloor;
        if (unreadFloor === 0) {
            const ageMins = (Date.now() - watchItem.lastChecked) / 60000;
            let ageString = getAgeString(ageMins);
            return `${ageString}`;
        }
        if (unreadFloor < 0) {
            return '有新回复';
        }
        if (watchItem.lastUpdateIgnorable) {
            return '屏蔽 ' + unreadFloor + ' 回复';
        } else {
            return '有 ' + unreadFloor + ' 新回复';
        }
    }

    function findLastPost(doc, userFilter, ignoreList) {

        const posts = getPosts(doc);
        if (posts.length === 0) {
            return null;
        }
        const postsByFloor = Object.create(null);
        let highestFloor = 0;
        posts.forEach(post => {
            if (post.floor > highestFloor) {
                highestFloor = post.floor;
            }
            postsByFloor[post.floor] = {
                floor: post.floor,
                postId: post.postId,
                postUid: post.postUid,
                postUname: post.postUname,
                postTime: post.postTime,
                ignorable: false
            };
        });
        const lastPost = postsByFloor[highestFloor];
        const pageArr = readCurrentAndMaxPage(doc);

        if (ignoreList != null) {
            const ignoreContentMatcher = createIgnoreContentMatcher(ignoreList);
            posts.forEach(post => {
                if (post.floor > 0) {
                    const [ignoreState] = annotateIgnorablePost(post, myUserId, userConfig, userFilter, ignoreContentMatcher);
                    if (ignoreState) {
                        postsByFloor[post.floor].ignorable = true;
                    }
                }
            });
        }

        let bountyEnded = null;
        if (pageArr[0] === 1) {
            const bountyStatus = getBountyStatus(doc);
            bountyEnded = bountyStatus == null ? null : bountyStatus.ended === 2;
        }

        return {
            page: pageArr[0],
            maxPage: pageArr[1],
            floor: lastPost.floor,
            postsByFloor: postsByFloor,
            postId: lastPost.postId,
            postUid: lastPost.postUid,
            postTime: lastPost.postTime,
            bountyEnded: bountyEnded
        };
    }

    async function readWatchList() {
        try {
            let sSavedData = await GM.getValue('my_watchlist#' + myUserId);
            let watchList = JSON.parse(sSavedData);
            Object.values(watchList).forEach(watchItem => {
                if (watchItem.timeOpened == null) {
                    watchItem.timeOpened = Date.now(); // backward-compatibility
                }
            });
            return watchList;
        } catch (e) {}
        return {};
    }

    async function writeWatchList(watchList) {
        await GM.setValue('my_watchlist#' + myUserId, JSON.stringify(watchList));
        return true;
    }

    async function updateWatchList(updater) {
        async function execute() {
            const watchList = await readWatchList();
            const updatedWatchList = await updater(watchList);
            if (updatedWatchList != null) {
                await writeWatchList(updatedWatchList);
            }
        }
        await runWithLock('watchlist-update', 1500, execute);
    }

    async function testRecordBestAnswerNotification(userConfig, threadHistoryAccess) {
        const canditateThreadLink = document.querySelector('#info_base .set-table2 > tbody > tr > td > b + a[href^="//"][href$=".html"]');
        if (canditateThreadLink == null) {
            return;
        }
        const tid = (canditateThreadLink.getAttribute('href').match(/.*\/read\.php\?tid-(\d+)\.html$/)||[])[1] * 1;
        if (Number.isNaN(tid)) {
            return;
        }
        if (!canditateThreadLink.closest('td').textContent.startsWith('您的回复被设为最佳答案!')) {
            return;
        }
        const lastAccessRecord = await threadHistoryAccess.recentAccessStore.get(tid);
        if (lastAccessRecord && lastAccessRecord.bounty && lastAccessRecord.bounty.winner == null) {
            lastAccessRecord.bounty.winner = userConfig.myUserHashId;
            lastAccessRecord.bounty.ended = 2;
            await threadHistoryAccess.recentAccessStore.put(tid, lastAccessRecord);
            if (DEBUG_MODE) {
                console.info(`bounty winner recorded (tid=${tid})`);
            }
        }
    }

    function enhanceMessageReadDisplay(userConfig) {
        const userLink = document.querySelector('#info_base .set-table2 > tbody > tr:first-child > td > a[href^="u.php?action-show-uid-"]');
        if (userLink == null) {
            return;
        }
        const userId = Number.parseInt(userLink.getAttribute('href').substring(22));
        if (userId === 0) {
            userLink.textContent = SYSTEM_SENDER_DISPLAY_NAME;
            userLink.closest('table').classList.add('rinsp-system-message-view');
        } else {
            const userRecord = userConfig.customUserHashIdMappings['#' + userId];
            if (userRecord != null) {
                userLink.closest('td').classList.add('rinsp-message-user-mapped');
                const currentName = userLink.textContent;
                userLink.textContent = userRecord[2];
                userLink.setAttribute('title', '现在昵称: ' + currentName);
            }
        }

    }

    function enhanceMessagingList(userConfig, userPinArea, inboxMode) {
        document.querySelectorAll('#set-content .set-tab-box #info_base .set-table2').forEach(list => {

            let messages = [];

            const selectionPanel = newElem('div', 'rinsp-message-selection-panel');
            list.parentNode.insertBefore(selectionPanel, list);

            if (inboxMode) {
                const selectSysMsgButton = addElem(selectionPanel, 'div', 'rinsp-selection-button');
                selectSysMsgButton.textContent = '系统信息';
                selectSysMsgButton.addEventListener('click', () => {
                    messages.filter(message=>!!message.checkbox).forEach(m => m.checkbox.checked = m.userId === 0 || SYSTEM_MESSAGE_TITLES.has(m.title));
                });
    
                addElem(selectionPanel, 'div', 'rinsp-selection-sep').textContent = '|';
            }

            const selectAllButton = addElem(selectionPanel, 'div', 'rinsp-selection-button');
            selectAllButton.textContent = '全选';
            selectAllButton.addEventListener('click', () => {
                messages.filter(message=>!!message.checkbox).forEach(m => m.checkbox.checked = true);
            });

            const deselectAllButton = addElem(selectionPanel, 'div', 'rinsp-selection-button');
            deselectAllButton.textContent = '清除';
            deselectAllButton.addEventListener('click', () => {
                messages.filter(message=>!!message.checkbox).forEach(m => m.checkbox.checked = false);
            });


            const observer = createMutationObserver(async () => {
                apply();
            });
            observer.init(list, { childList: true, subtree: false, attributes: false });
            observer.trigger();
            userPinArea.addUpdateListener(() => {
                observer.trigger();
            });
        
            function apply() {
                messages.length = 0;
                userPinArea.clearState();
                list.querySelectorAll('tbody > tr > td > a[href^="u.php?action-show-uid-"]').forEach(userLink => {
                    const row = userLink.closest('tr');
                    const messageLink = row.querySelector('a[href^="message.php?action-read-mid-"],a[href^="message.php?action-readscout-mid-"],a[href^="message.php?action-readsnd-mid-"]');
                    if (messageLink == null) {
                        return;
                    }
                    const checkbox = row.querySelector('td > input[name="delid[]"]');
                    const userId = Number.parseInt(userLink.getAttribute('href').substring(22));
                    if (userId === 0) {
                        userLink.textContent = SYSTEM_SENDER_DISPLAY_NAME;
                        row.classList.add('rinsp-system-message-row');
                    } else {
                        const userCell = userLink.closest('td');
                        userCell.classList.remove('rinsp-message-user-pinned');
                        userCell.classList.remove('rinsp-message-user-mapped');
                        let pinnedUser = userPinArea.getPinned(userId);
                        if (pinnedUser) {
                            userCell.classList.add('rinsp-message-user-pinned');
                            userPinArea.addLocation(userId, '⚪', null, () => {
                                userLink.closest('tr').scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center'
                                });
                            });
                        }
                        let userRecord = userConfig.customUserHashIdMappings['#' + userId];
                        if (userRecord != null) {
                            if (!pinnedUser) {
                                userCell.classList.add('rinsp-message-user-mapped');
                            }
                            const currentName = userLink.textContent;
                            userLink.textContent = userRecord[2];
                            userLink.setAttribute('title', '现在昵称: ' + currentName);
                        }

                    }
                    const title = messageLink.textContent.trim();
                    messages.push({
                        row,
                        checkbox,
                        userLink,
                        userId,
                        title
                    });
                });
                selectionPanel.hidden = messages.length === 0;
                userPinArea.update();
            }


        }); 
    }

    function enhanceMessagingForm() {
        const form = document.querySelector('#main form[name="FORM"][action="message.php"]');
        if (form == null) {
            return null;
        }

        const touidmsg = form.querySelector('input[name="touidmsg"]');
        const touid = touidmsg.value * 1;
        if (touid > 0) {
            const nicknameCell = touidmsg.closest('tr').nextElementSibling.querySelector('td.td1 + td');
            const homeButton = newElem('a', 'abtn', { href: `u.php?action-show-uid-${touid}.html`, target: '_blank' });
            homeButton.textContent = '用户资料';
            nicknameCell.appendChild(homeButton);

            nicknameCell.appendChild(document.createTextNode(' '));

            const historyButton = newElem('a', 'abtn', { href: `message.php?action-chatlog-withuid-${touid}.html`, target: '_blank' });
            historyButton.textContent = '通信记录';
            nicknameCell.appendChild(historyButton);

        }
        if (userConfig.showInputLimit) {
            const input = form.querySelector('input[name="msg_title"]');
            if (input) {
                input.value = truncateByByteLength(input.value, 75, '...');
                addLengthLimit(input, 75);
            }
            const textarea = form.querySelector('textarea[name="atc_content"]');
            if (textarea) {
                addLengthLimit(textarea, 1500);
            }
            form.addEventListener('submit', evt => {
                if (form.querySelector('.rinsp-input-max-exceeded')) {
                    evt.preventDefault();
                    return false;
                }
            });
        }
    }

    function addLengthLimit(input, byteLimit, charLimit, warnOnly, skipRe) {
        const hint = newElem('span', 'rinsp-input-max-hint');
        input.after(hint);
        input.addEventListener('input', () => update());
        input.addEventListener('change', () => update());
        function update() {
            hint.classList.remove('rinsp-input-max-exceeded');
            input.classList.remove('rinsp-input-max-exceeded');
            hint.textContent = '';
            let valueTrim = input.value.trim();
            if (skipRe && valueTrim.startsWith('Re:')) {
                valueTrim = valueTrim.substring(3);
            }
            if (charLimit > 0) {
                if (valueTrim.length > charLimit) {
                    hint.textContent =  `${valueTrim.length} (过长) / ${charLimit}`;
                    hint.classList.add('rinsp-input-max-exceeded');
                    input.classList.add('rinsp-input-max-exceeded');
                    return;
                } else if (!warnOnly) {
                    hint.textContent =  `${valueTrim.length} / ${charLimit}`;
                }
            }
            if (byteLimit > 0) {
                const curLength = getByteLength(valueTrim);
                if (curLength > byteLimit) {
                    hint.textContent =  `${curLength} (过长) / ${byteLimit}字节`;
                    hint.classList.add('rinsp-input-max-exceeded');
                    input.classList.add('rinsp-input-max-exceeded');
                    return;
                } else if (!warnOnly) {
                    if (charLimit === 0) {
                        hint.textContent =  `${curLength} / ${byteLimit}字节`;
                    }
                }
            }
        }
        update();
    }

    function changeToImageWallThreadLinks() {
        document.querySelectorAll('ul.threadlist li a[href^="thread.php?"]').forEach(link => {
            link.setAttribute('href', 'thread_new' + link.getAttribute('href').substring(6));
        });
    }

    async function addPicWallDefaultOption(fid) {
        const toggleButton = document.querySelector('#breadcrumbs > .fr > a[href^="thread"]');
        if (toggleButton == null || !['[点击进入图墙模式]', '[点击进入列表模式]'].includes(toggleButton.textContent.trim())) {
            return;
        }
        const toggle = newElem('span', 'fr');
        toggleButton.parentElement.parentElement.insertBefore(toggle, toggleButton.parentElement.nextElementSibling);

        const labelElem = addElem(toggle, 'label');
        const checkbox = addElem(labelElem, 'input', null, { type: 'checkbox' });
        checkbox.checked = readPinnedPicWallFids().includes(fid);
        addElem(labelElem, 'span', null, { style: 'vertical-align: middle; margin-right: 0.5em' }).textContent = '默认图墙模式';
        checkbox.addEventListener('change', () => {
            const fids = readPinnedPicWallFids().filter(x=>x!==fid);
            if (checkbox.checked) {
                fids.push(fid);
            }
            localStorage.setItem(PIC_WALL_PREF_KEY, fids.join(' '));
            update();
        });
        update();

        function update() {
            if (checkbox.checked && toggleButton.getAttribute('href').startsWith('thread.php?')) {
                toggleButton.parentElement.setAttribute('style', 'opacity: 0.1; pointer-events:none');
            } else {
                toggleButton.parentElement.setAttribute('style', '');
            }
        }

    }

    async function enableForumAnnouncementFolding() {
        const anchor = document.querySelector('td.tac > img[src="images/colorImagination/thread/anc.gif"]');
        if (anchor == null) {
            return;
        }
        const th = anchor.parentNode.nextElementSibling;
        if (th == null || !th.textContent.trim().startsWith('论坛公告:')) {
            return;
        }
        const row = anchor.closest('tr.tr3');
        row.classList.add('rinsp-top-announcement-row');
        let announcementRows = [];
        const normalTopicMarker = document.querySelector('.rinsp-top-announcement-row ~ tr.tr2 > .tac');
        if (normalTopicMarker && normalTopicMarker.textContent.trim() === '普通主题') {
            const endMarkerRow = normalTopicMarker.closest('.tr2');
            let testRow = row;
            while ((testRow = testRow.nextElementSibling) !== endMarkerRow) {
                announcementRows.push(testRow);
            }
        } else {
            let testRow = row;
            while ((testRow = testRow.nextElementSibling) != null) {
                if (testRow.querySelector('td + td > img[src="images/colorImagination/file/headtopic_3.gif"]') == null) {
                    break;
                }
                announcementRows.push(testRow);
            }
            
        }
        if (announcementRows.length === 0) {
            return;
        }
        const toggler = newElem('a', 'rinsp-announcement-toggler');
        const img = newElem('img');
        toggler.appendChild(img);
        th.insertBefore(toggler, th.childNodes[0]);

        function updateFoldingState(folded) {
            if (folded) {
                row.classList.add('rinsp-announcement-folded');
                announcementRows.forEach(r => r.classList.add('rinsp-announcement-row-folded'));
                img.setAttribute('src', 'images/colorImagination/index/cate_open.gif');
            } else {
                row.classList.remove('rinsp-announcement-folded');
                announcementRows.forEach(r => r.classList.remove('rinsp-announcement-row-folded'));
                img.setAttribute('src', 'images/colorImagination/index/cate_fold.gif');
            }
        }
        updateFoldingState(userConfig.siteAnnouncementSectionDefaultFolded);
        toggler.addEventListener('click', async () => {
            const newFoldState = !row.classList.contains('rinsp-announcement-folded');
            updateFoldingState(newFoldState);
            await mainConfigAccess.update(function(updatingUserConfig) {
                updatingUserConfig.siteAnnouncementSectionDefaultFolded = newFoldState;
                return updatingUserConfig;
            });
        });
    }

    async function enhanceSearchPage() {
        const searchForm = document.querySelector('#main form[action="search.php?"]');
        if (searchForm == null) {
            return;
        }

        const searchPref = await searchConfigAccess.read();
        const keywordInput = searchForm.querySelector('input[name="keyword"]');
        if (keywordInput != null) {
            keywordInput.classList.add('rinsp-search-keyword-input');
            enhanceKeywordInput(keywordInput, searchPref);
            setTimeout(function () {
                keywordInput.focus();
            }, 0);
        }
    
        const dateRangeSelect = searchForm.querySelector('select[name="sch_time"]');
        if (dateRangeSelect != null) {
            enhanceSearchRangeSelect(dateRangeSelect, searchPref);
        }

        const topicSelect = searchForm.querySelector('select[name="f_fid"]');
        if (topicSelect != null) {
            enhanceSearchTopicSelect(topicSelect, searchPref);
        }
        const prefillParamString = (document.location.hash.match(/^#prefill\((.*)\)$/)||[])[1];
        if (prefillParamString) {
            const prefillData = {};
            try {
                const array = JSON.parse(`[${decodeURIComponent(prefillParamString)}]`);
                for (let i = 0; i < array.length - 1; i += 2) {
                    prefillData[array[i]] = array[i + 1];
                }
            } catch (ignore) {}

            if (prefillData.fid > 0) {
                topicSelect.value = String(prefillData.fid);
            }
            if (prefillData.keyword) {
                keywordInput.value = prefillData.keyword;
            }
            if (prefillData.pwuser) {
                searchForm.querySelector('input[name="pwuser"]').value = prefillData.pwuser;
            }
        }
    }

    async function enhanceKeywordInput(keywordInput, searchPref) {
        let defaultSearchAll = !!searchPref.defaultSearchAll;
    
        const parentCell = keywordInput.closest('th');
        const setDefaultButton = document.createElement('span');
        setDefaultButton.classList.add('rinsp-fav-search-setdefault-mode');
        setDefaultButton.classList.add('rinsp-hide');
        setDefaultButton.textContent = '➕设为默认';
        setDefaultButton.addEventListener('click', async function () {
            await searchConfigAccess.update(function(updatingSearchPref) {
                updatingSearchPref.defaultSearchAll = searchAllRadioOption.checked;
                return updatingSearchPref;
            });
            defaultSearchAll = searchAllRadioOption.checked;
            redraw();
        });
        parentCell.appendChild(setDefaultButton);
        const searchAllRadioOption = parentCell.querySelector('input[name="method"][value="AND"]');
        parentCell.querySelectorAll('input[name="method"]').forEach(function (methodRadioOption) {
            methodRadioOption.addEventListener('change', function () {
                redraw();
            });
        });
        function redraw() {
            if (defaultSearchAll === searchAllRadioOption.checked) {
                setDefaultButton.classList.add('rinsp-hide');
            } else {
                setDefaultButton.classList.remove('rinsp-hide');
            }
        }
        if (defaultSearchAll) {
            searchAllRadioOption.checked = true;
        }
        setTimeout(function () {
            redraw();
        }, 0); // account for browser auto-fill
    }
    
    async function enhanceSearchRangeSelect(rangeSelect, searchPref) {
        const parentCell = rangeSelect.closest('th');
        const setDefaultButton = addElem(parentCell, 'span', 'rinsp-fav-search-setdefault-range rinsp-hide');
        setDefaultButton.textContent = '➕设为默认';
        let currentDefaultRange = searchPref.defaultTimeRange||'all';
        function update() {
            if (rangeSelect.value === currentDefaultRange) {
                setDefaultButton.classList.add('rinsp-hide');
            } else {
                setDefaultButton.classList.remove('rinsp-hide');
            }
        }
        setDefaultButton.addEventListener('click', function () {
            parentCell.classList.add('rinsp-temp-disabled');
            async function execute() {
                await searchConfigAccess.update(function(updatingSearchPref) {
                    updatingSearchPref.defaultTimeRange = rangeSelect.value;
                    currentDefaultRange = rangeSelect.value;
                    return updatingSearchPref;
                });
            }
            execute().finally(function () {
                parentCell.classList.remove('rinsp-temp-disabled');
                update();
            });
        });
        rangeSelect.addEventListener('change', function () {
            update();
        });
        rangeSelect.value = currentDefaultRange;
    }

    async function enhanceSearchTopicSelect(topicSelect, searchPref) {
        const parentCell = topicSelect.closest('th');
        const pin = addElem(parentCell, 'span', 'rinsp-fav-search-area-pin');
        const originalContent = topicSelect.innerHTML;

        await update(searchPref.pinnedTopics || {});

        async function update(topicMappings) {
            let entries = Object.entries(topicMappings);

            let favOptGroup = null;
            const fullOptGroup = newElem('optgroup', null, { label: '目录树' });
            const allOptionValues = new Set();
            topicSelect.querySelectorAll('option').forEach(function (option, i) {
                if (i > 0) {
                    allOptionValues.add(option.getAttribute('value'));
                    fullOptGroup.appendChild(option);
                } else {
                    option.classList.add('rinsp-fav-search-area-all');
                }
            });
            if (entries.length > 0) {
                favOptGroup = newElem('optgroup', 'rinsp-fav-search-area-group', { label: '版块捷径' });
                entries.forEach(function (entry) {
                    const fid = entry[0].substring(1);
                    const favOption = addElem(favOptGroup, 'option', null, {
                        value: fid,
                        title: `fid: ${fid}`
                    });
                    if (allOptionValues.has(fid)) {
                        favOption.textContent = `🔖${entry[1]}`;
                    } else {
                        favOption.textContent = `⚠️${entry[1]} (此区不存在)`;
                    }
                });
            }
            if (favOptGroup != null) {
                topicSelect.appendChild(favOptGroup);
            }
            topicSelect.appendChild(fullOptGroup);
        }

        pin.addEventListener('click', function () {
            parentCell.classList.add('rinsp-temp-disabled');
            async function execute() {
                const current = getCurrentItem();
                let newSearchPref = await searchConfigAccess.update(function(updatingSearchPref) {
                    const updatingMappings = updatingSearchPref.pinnedTopics || {};
                    if (current.fav) {
                        delete updatingMappings['$' + current.value];
                    } else {
                        let chosenLabel = prompt('显示名称', current.label.trim().replace(/^.*? /, ''));
                        chosenLabel = chosenLabel ? chosenLabel.trim() : '';
                        if (!chosenLabel) {
                            return;
                        }
                        updatingMappings['$' + current.value] = chosenLabel;
                    }
                    updatingSearchPref.pinnedTopics = updatingMappings;
                    return updatingSearchPref;
                });
                if (newSearchPref != null) {
                    topicSelect.innerHTML = originalContent;
                    update(newSearchPref.pinnedTopics||{});
                    topicSelect.value = current.value;
                    if (!topicSelect.value) {
                        topicSelect.value = 'all';
                    }
                    updatePin();
                }
            }
            execute().finally(function () {
                parentCell.classList.remove('rinsp-temp-disabled');
            });
        });
        function updatePin() {
            const current = getCurrentItem();
            if (current == null || current.value === 'all') {
                pin.textContent = '';
            } else {
                pin.textContent = current.fav ? '❌删除捷径' : '➕存为捷径';
            }
        }
        function getCurrentItem() {
            let options = topicSelect.querySelectorAll('option[value="' + topicSelect.value + '"]');
            if (options.length === 0) {
                return null;
            }
            return {
                fav: options[0].closest('.rinsp-fav-search-area-group') != null,
                label: options[options.length - 1].textContent,
                value: topicSelect.value
            };
        }
        updatePin();
        topicSelect.addEventListener('change', function () {
            updatePin();
        });
    }

    function annotateIgnorablePost(post, myUserId, userConfig, userFilter, ignoreContentMatcher) {
        post.rootElem.classList.remove('rinsp-filter-default-ignorable');
        post.rootElem.classList.remove('rinsp-filter-ignored-bykeyword');
        post.rootElem.classList.remove('rinsp-filter-ignored-byuid');
        post.rootElem.classList.remove('rinsp-my-post');
        post.rootElem.classList.remove('rinsp-filter-bypass');
        post.rootElem.classList.add('rinsp-filter-added');
        if (post.postUid === myUserId) {
            post.rootElem.classList.add('rinsp-my-post');
            post.rootElem.classList.add('rinsp-filter-bypass');
        }
        let ignoreState = false;

        let userFilterRule;
        if (userConfig.dontFilterRequestReplyByUser && post.areaId === QUESTION_AND_REQUEST_AREA_ID) {
            userFilterRule = null;
        } else {
            userFilterRule = userFilter.users['#' + post.postUid];
        }
        let userBlacklisted = userFilterRule && userFilterRule.hideReplies;
        if (post.postDefaultHidden) {
            ignoreState = true;
        } else if (userBlacklisted) {
            post.rootElem.classList.add('rinsp-filter-ignored-byuid');
            ignoreState = true;
        } else {
            if (userConfig.customUserpicBypassIgnoreList && !post.defaultUserPic) {
                post.rootElem.classList.add('rinsp-filter-bypass');
            } else if (userConfig.customUserBypassIgnoreList) {
                // user blacklist still wins over bookmarked users
                if (userConfig.customUserHashIdMappings['#' + post.postUid] != null) {
                    post.rootElem.classList.add('rinsp-filter-bypass');
                }
            }
        }
        let effectiveContent = null;
        if (ignoreContentMatcher != null) {
            if (post.contentDefaultIgnorable) {
                effectiveContent = DEFAULT_IGNORABLE_MARKER_TAG;
            } else {
                effectiveContent = getEffectiveTextContent(post.contentElem, !!userConfig.ignoreContentUseTextOnly, !!userConfig.treatAllEmojiTheSameWay);
            }
            //if (DEBUG_MODE) console.info(item, 'effectiveContent: `' + effectiveContent + '`');
            if (!ignoreState && effectiveContent != null && ignoreContentMatcher.matches(effectiveContent)) {
                ignoreState = true;
                post.rootElem.classList.add('rinsp-filter-ignored-bykeyword');
            }
        }
    
        if (ignoreState) {
            post.rootElem.classList.add('rinsp-filter-ignored');
        } else {
            post.rootElem.classList.remove('rinsp-filter-ignored');
        }
        return [ignoreState, effectiveContent];
    }

    async function applyContentFilter(allPosts, myUserId, userConfig, threadFilter, userFilter, ignoreList, updateCallback) {
        const posts = allPosts.slice();
        if (posts.length === 0) {
            return;
        }

        function onUpdate(updatedConfigs) {
            // reset annotated state
            posts.forEach(post => {
                post.rootElem.parentNode.removeAttribute('rinsp-filter-ignored-cont');
                post.rootElem.classList.remove('rinsp-filter-added');
            });
            updateCallback(updatedConfigs);
        }
    
        posts.forEach(post => {
            // add block user
            const contentTh = post.contentElem.closest('th');
            contentTh.querySelectorAll('.rinsp-filter-block-menu-item,.rinsp-filter-block-menu-sep').forEach(el => el.remove());
            const blockMenu = contentTh.querySelector('.tiptop .fr > .dropdown > .dropdown-content');
            if (blockMenu) {
                const menuItem = blockMenu.previousElementSibling;
                menuItem.classList.remove('rinsp-filter-block-menu-item-active');
                const dislikeUserRule = userFilter.users['#' + post.postUid];
                const hideThreads = dislikeUserRule && dislikeUserRule.hideThreads;
                const hideReplies = dislikeUserRule && dislikeUserRule.hideReplies;
                
                addElem(blockMenu, 'div', 'rinsp-filter-block-menu-sep');
                const blockThreadButton = addElem(blockMenu, 'a', 'rinsp-filter-block-menu-item');
                if (hideThreads && !hideReplies) {
                    menuItem.classList.add('rinsp-filter-block-menu-item-active');
                    blockThreadButton.classList.add('rinsp-filter-block-menu-item-active');
                    blockThreadButton.textContent = '🚫只主题帖';
                    blockThreadButton.addEventListener('click', () => {
                        promptRemoveUserBlock(post.postUid, post.postUname, onUpdate);
                    });
                } else {
                    blockThreadButton.textContent = '只主题帖';
                    blockThreadButton.addEventListener('click', () => {
                        promptBlockOp(post.postUid, post.postUname, onUpdate);
                    });
                }

                const blockReplyButton = addElem(blockMenu, 'a', 'rinsp-filter-block-menu-item');
                if (hideReplies) {
                    menuItem.classList.add('rinsp-filter-block-menu-item-active');
                    blockReplyButton.classList.add('rinsp-filter-block-menu-item-active');
                    blockReplyButton.textContent = '🚫所有内容';
                    blockReplyButton.addEventListener('click', () => {
                        promptRemoveUserBlock(post.postUid, post.postUname, onUpdate);
                    });
                } else {
                    blockReplyButton.textContent = '所有内容';
                    blockReplyButton.addEventListener('click', () => {
                        promptBlockComplete(post.postUid, post.postUname, onUpdate);
                    });
                }
            }
        });

        // GF: add keyword filter
        if (posts[0].floor === 0) {
            const opPost = posts[0];
            const threadFilterExecutor = initThreadFilterExecutor(myUserId, threadFilter, userFilter, onUpdate, true);
            const subjectElem = opPost.rootElem.querySelector('#subject_tpc');
            const threadLikeModel = {
                tid: opPost.tid,
                row: opPost.rootElem,
                op: opPost.postUid,
                opName: opPost.postUname,
                opElem: null,
                titleCell: subjectElem,
                title: getEffectiveThreadTitle(subjectElem.textContent)
            };
            threadFilterExecutor.clear(threadLikeModel);
            threadFilterExecutor.run(threadLikeModel);
        }

        function ignoreButtonDef() {
            return {
                create(post) {
                    const ignoreElem = document.createElement('li');
                    const actionBar = post.rootElem.querySelector('.tipad .fl.readbot');
                    actionBar.appendChild(ignoreElem);
                    return ignoreElem;
                },
                restoreLabel: '已屏蔽',
                hideLabel: '屏蔽内容'
            };
        }
        function defaultIgnorableButtonDef() {
            return {
                create(post) {
                    const ignoreElem = document.createElement('span');
                    const actionBar = post.rootElem.querySelector('.tiptop > .fr');
                    const insertBeforeNode = actionBar.childNodes[0];
                    actionBar.insertBefore(ignoreElem, insertBeforeNode);
                    return ignoreElem;
                },
                restoreLabel: '已屏蔽',
                hideLabel: '屏蔽内容'
            };
        }
        const ignoreContentMatcher = createIgnoreContentMatcher(ignoreList);
        posts.forEach(post => {
            if (post.floor === 0) {
                annotateIgnorablePost(post, myUserId, userConfig, userFilter, null);
                return;
            }
            const [ignoreState, effectiveContent] = annotateIgnorablePost(post, myUserId, userConfig, userFilter, ignoreContentMatcher);
            if (post.contentDefaultIgnorable) {
                post.rootElem.classList.add('rinsp-filter-default-ignorable');
            }
            if (post.postDefaultHidden) {
                return;
            }

            // add block content
            post.rootElem.querySelectorAll('.rinsp-ignore-switch').forEach(el => el.remove());

            setupIgnoreButton(ignoreButtonDef());
            if (post.postCollapsed) {
                setupIgnoreButton(defaultIgnorableButtonDef());
            }

            function setupIgnoreButton(buttonDef) {
                if (effectiveContent != null && !post.rootElem.classList.contains('rinsp-filter-ignored-byuid')) {
                    let ignoreElem = buttonDef.create(post);
                    ignoreElem.classList.add('rinsp-ignore-switch');
                    const ignoreLabel = addElem(ignoreElem, 'a', null, { href: 'javascript:void(0)', title: '关键内容: \n' + effectiveContent });
    
                    ignoreLabel.addEventListener('click', async function() {
                        if (DEBUG_MODE) console.info('effective content = ' + effectiveContent);
                        ignoreElem.classList.add('rinsp-config-saving');
                        const newIgnoredState = !ignoreState;
                        const updatedIgnoreList = await contentIgnoreListConfigAccess.update(function(ignoreList) {
                            const newTerms = ignoreList.terms.filter(term => term !== effectiveContent);
                            if (newIgnoredState) {
                                newTerms.push(effectiveContent);
                            }
                            if (ignoreList.terms.length === newTerms.length) {
                                // no change
                                return;
                            }
                            ignoreList.terms = newTerms;
                            return ignoreList;
                        })
                        .finally(function() {
                            ignoreElem.classList.remove('rinsp-config-saving');
                        });
        
                        if (updatedIgnoreList != null) {
                            onUpdate({ ignoreList: updatedIgnoreList });
                        }
                        return false;
                    });
                    ignoreLabel.textContent = ignoreState ? buttonDef.restoreLabel : buttonDef.hideLabel;
                }
            }

        });

        const ignoredPosts = posts.filter(post => post.rootElem.classList.contains('rinsp-filter-ignored'));
        const ignoreCount = ignoredPosts.length;
        document.querySelectorAll('.r_two[rinsp-filter-group-size]').forEach(el=>el.removeAttribute('rinsp-filter-group-size'));
        document.querySelectorAll('.rinsp-filter-ignored-range-end-summary').forEach(el=>el.remove());
        if (ignoreCount > 0) {
            const groups = [];
            ignoredPosts.filter(post => !post.rootElem.classList.contains('rinsp-filter-bypass')).forEach(function(post) {
                const floor = post.floor;
                const forcedSingleton = post.rootElem.parentNode.previousElementSibling.matches('div');
                const thisSingleGroup = { elems: [{ row: post.rootElem, floor: post.floorElem }], floorMin: floor, floorMax: floor, singleton: forcedSingleton };
                if (groups.length === 0) {
                    groups.push(thisSingleGroup);
                } else {
                    const last = groups[groups.length - 1];
                    if (floor == last.floorMax + 1 && !forcedSingleton && !last.singleton) {
                        last.elems.push({ row: post.rootElem, floor: post.floorElem });
                        last.floorMax = floor;
                    } else {
                        groups.push(thisSingleGroup);
                    }
                }
            });
            groups.forEach(group => {
                group.elems[0].row.parentNode.removeAttribute('rinsp-filter-ignored-cont');
                group.elems[0].floor.closest('tr').querySelector('.r_two').removeAttribute('rinsp-filter-group-size');
                group.elems[0].floor.querySelectorAll('.rinsp-filter-ignored-range-end-summary').forEach(el => el.remove());
                if (group.floorMin === group.floorMax) {
                    return;
                }
                group.elems[0].floor.closest('tr').querySelector('.r_two').setAttribute('rinsp-filter-group-size', String(group.elems.length));
                const rangeEnd = newElem('span', 'rinsp-filter-ignored-range-end-summary');
                rangeEnd.appendChild(document.createTextNode(' - '));
                rangeEnd.appendChild(group.elems[group.elems.length - 1].floor.cloneNode(true));
                group.elems[0].floor.after(rangeEnd);

                const rangeEnd2 = newElem('span', 'rinsp-filter-ignored-range-end-summary');
                rangeEnd2.appendChild(document.createTextNode(' - '));
                const dateEndElem = group.elems[group.elems.length - 1].floor.closest('.fl').nextElementSibling.cloneNode(true);
                dateEndElem.classList.remove('fl');
                dateEndElem.classList.remove('gray');
                rangeEnd2.appendChild(dateEndElem);
                group.elems[0].floor.closest('.fl').nextElementSibling.appendChild(rangeEnd2);
                
                group.elems[0].floor.closest('tr').querySelector('.r_two').setAttribute('rinsp-filter-group-size', String(group.elems.length));
                group.elems.slice(1).forEach(el=>el.row.parentNode.setAttribute('rinsp-filter-ignored-cont', '1'));
            });
        }

        ignoreContentToggler.setCount(ignoreCount);
        if (ignoreCount === 0) {
            document.body.classList.remove('rinsp-filter-peek-mode');
        }
    }

    function createIgnoreContentMatcher(ignoreList) {
        const ignoreSet = new Set();
        ignoreList.terms.forEach(term => {
            const matchableText = term
                .split(/(<[^>]+>)/)
                .map(chunk => {
                    if (chunk.length === 0 || chunk[0] === '<') {
                        return chunk;
                    } else {
                        return simplifyText(chunk);
                    }
                })
                .join('');
            ignoreSet.add(matchableText);
        });
        return {
            matches(effectiveContent) {
                return ignoreSet.has(effectiveContent);
            }
        };
    }

    async function updateUserBlockRule(opId, opName, data, callback) {
        const updatedUserFilterConfig = await userFilterConfigAccess.update(function(userFilterConfig) {
            const userIdKey = '#' + opId;
            if (data) {
                const updateData = Object.assign({
                    name: opName
                }, data);
                if (userFilterConfig.users[userIdKey] == null) {
                    userFilterConfig.users[userIdKey] = updateData;
                } else {
                    userFilterConfig.users[userIdKey] = Object.assign(userFilterConfig.users[userIdKey], updateData);
                }
            } else {
                delete userFilterConfig.users[userIdKey];
            }
            return userFilterConfig;
        });
        callback({ userFilter: updatedUserFilterConfig });
    }

    async function promptBlockOp(opId, opName, callback) {
        if (confirm(`屏蔽此用户(${opName}) 所有主题帖？`)) {
            updateUserBlockRule(opId, opName, { hideThreads: true, hideReplies: false }, callback);
        }
    }

    async function promptRemoveUserBlock(opId, opName, callback) {
        if (confirm(`取消屏蔽此用户(${opName})？`)) {
            updateUserBlockRule(opId, opName, null, callback);
        }
    }

    async function promptBlockComplete(opId, opName, callback) {
        if (confirm(`屏蔽此用户(${opName}) 所有主题及回复？`)) {
            updateUserBlockRule(opId, opName, { hideThreads: true, hideReplies: true }, callback);
        }
    }

    async function promptEditKeywords(message, initValues, initText, attr, callback) {
        const input = prompt(message, initText == null ? initValues.slice(0).sort().join(' ') : initText);
        if (input == null) {
            return;
        }
        const keywords = input.toLowerCase().trim().split(' ').filter(s=>!!s);
        const updatedFilterConfig = await threadFilterConfigAccess.update(function(filterConfig) {
            const set = new Set(filterConfig[attr]);
            initValues.forEach(kw => set.delete(kw));
            keywords.forEach(kw => set.add(kw));
            filterConfig[attr] = Array.from(set);
            return filterConfig;
        });
        callback({ threadFilter: updatedFilterConfig });
    }

    async function removeBlockThread(tid, callback) {
        const updatedFilterConfig = await threadFilterConfigAccess.update(function(filterConfig) {
            const set = new Set(filterConfig.dislikes);
            set.delete(getTidMatchDirective(tid));
            filterConfig.dislikes = Array.from(set);
            return filterConfig;
        });
        callback({ threadFilter: updatedFilterConfig });
    }

    async function promptBlockThread(tid, callback) {
        if (confirm('屏蔽此帖？')) {
            const updatedFilterConfig = await threadFilterConfigAccess.update(function(filterConfig) {
                const set = new Set(filterConfig.dislikes);
                set.add(getTidMatchDirective(tid));
                filterConfig.dislikes = Array.from(set);
                return filterConfig;
            });
            callback({ threadFilter: updatedFilterConfig });
        }
    }

    async function removeLikeThread(tid, callback) {
        const updatedFilterConfig = await threadFilterConfigAccess.update(function(filterConfig) {
            const set = new Set(filterConfig.likes);
            set.delete(getTidMatchDirective(tid));
            filterConfig.likes = Array.from(set);
            return filterConfig;
        });
        callback({ threadFilter: updatedFilterConfig });
    }

    async function promptLikeThread(tid, callback) {
        if (confirm('标记此帖？')) {
            const updatedFilterConfig = await threadFilterConfigAccess.update(function(filterConfig) {
                const set = new Set(filterConfig.likes);
                set.add(getTidMatchDirective(tid));
                filterConfig.likes = Array.from(set);
                return filterConfig;
            });
            callback({ threadFilter: updatedFilterConfig });
        }
    }

    function initRequestThreadEnhancementExecutor(myUserId, userConfig, settlementPostMatcher) {
        const bountySteps = [10000, 5000, 2000, 1000, 500, 200, 100];
        
        function isSettlementPost(title) {
            if (userConfig.hideSettlementPost$UseDefaultKeywords) {
                if (title.match(DEFAULT_SETTLEMENT_BLACKLIST_PATTERN) != null) {
                    return false;
                }
                let titleReduced = title.replace(/@[^@ ]+/, '');
                const hasTarget = titleReduced.length < title.length;
                titleReduced = titleReduced.replace(DEFAULT_SETTLEMENT_STOPWORD_PATTERN, '');
                const beforeLength = titleReduced.length;
                titleReduced = titleReduced.replace(DEFAULT_SETTLEMENT_KEYWORD_PATTERN, '');
                const keywordLength = beforeLength - titleReduced.length;
                titleReduced = titleReduced.trim();
                if (hasTarget && titleReduced.length === 0)
                    return true;
                if (titleReduced.length <= DEFAULT_SETTLEMENT_TITLE_MAX_OTHER_TEXT_AMOUNT) {
                    if (hasTarget || keywordLength > 0) {
                        return true;
                    }
                }
            }
            if (settlementPostMatcher != null) {
                const matches = settlementPostMatcher.match(title.toLowerCase());
                if (matches.size > 0) {
                    return true;
                }
            }
            return false;
        }

        return {
            async run(thread) {
                this.clear(thread);
                const areaTag = thread.titleCell.querySelector(`.s8[href^="thread.php?fid-${QUESTION_AND_REQUEST_AREA_ID}-type-"]`);
                if (areaTag == null) {
                    return;
                }
                thread.row.classList.add('rinsp-request-thread');
                const title = thread.titleCell.querySelector('h3 > a').textContent;
                const bountyElem = thread.titleCell.querySelector('h3 > .s1');
                if (bountyElem) {
                    const betterBountyDisplay = newElem('span', 'rinsp-request-bounty');
                    bountyElem.parentNode.insertBefore(betterBountyDisplay, bountyElem);
    
                    const opDate = new Date((thread.row.querySelector('td[id^="td_"] + td > .f10.gray2')||{}).textContent||'') * 1;
                    const nowRoundDay = Math.floor(Date.now() / 86400000) * 86400000;
                    
                    const expired = nowRoundDay - opDate >= 30 * 86400000; // 30 days request expiry
                    const statusText = expired ? '已超时' : '悬赏金额';
                    if (expired) {
                        thread.row.classList.add('rinsp-request-thread-expired');
                    } else {
                        thread.row.classList.add('rinsp-request-thread-ongoing');
                    }
                    const baseBounty = (bountyElem.textContent.match(/ *— 悬赏金额：*(\d+) *— */)||[])[1]*1||0;
                    const extraBounty = parseSpAmount(title);
    
                    addElem(betterBountyDisplay, 'span').textContent = `— ${statusText}：`;
                    addElem(betterBountyDisplay, 'span', 'rinsp-base-bounty').textContent = String(baseBounty);
                    if (extraBounty > baseBounty) {
                        addElem(betterBountyDisplay, 'span', 'rinsp-extra-bounty').textContent = '+' + extraBounty;
                    }
                    addElem(betterBountyDisplay, 'span').textContent = ' —';
                    const totalBounty = extraBounty > baseBounty ? extraBounty : baseBounty;
                    thread.row.setAttribute('rinsp-request-bounty-steps', bountySteps.filter(amt => totalBounty > amt).join(' ') + ' min');
    
                } else {
                    if (userConfig.requestThreadUseHistoryData && threadHistoryAccess) {
                        const lastAccessRecord = await threadHistoryAccess.recentAccessStore.get(thread.tid);
                        if (lastAccessRecord && lastAccessRecord.bounty && lastAccessRecord.bounty.winner === userConfig.myUserHashId) {
                            thread.row.classList.add('rinsp-request-thread-won');
                        }
                    }
                    thread.row.classList.add('rinsp-request-thread-ended');
                }
    
                if (hasMentionedMe(title, myUserId, userConfig)) {
                    if (userConfig.hideSettlementPost$HighlightMyself) {
                        thread.row.classList.add('rinsp-request-settlement-bypass');
                    }
                    thread.row.classList.add('rinsp-thread-mention-me');
                }
                
                if (thread.op === myUserId) {
                    thread.row.classList.add('rinsp-thread-byme');
                }
                if (userConfig.hideSettlementPost) {
                    if (isSettlementPost(thread.title)) {
                        if (thread.op === myUserId) {
                            thread.row.classList.add('rinsp-request-settlement-bypass');
                        }
                        thread.row.classList.add('rinsp-request-settlement-thread');
                    }
                }
            },
            clear(thread) {
                thread.row.removeAttribute('rinsp-request-bounty-steps');
                thread.row.classList.remove('rinsp-request-thread');
                thread.row.classList.remove('rinsp-request-thread-ongoing');
                thread.row.classList.remove('rinsp-request-thread-ended');
                thread.row.querySelectorAll('.rinsp-request-bounty').forEach(el => el.remove());
                thread.row.classList.remove('rinsp-thread-mention-me');
                thread.row.classList.remove('rinsp-thread-byme');
                thread.row.classList.remove('rinsp-request-settlement-bypass');
                thread.row.classList.remove('rinsp-request-settlement-thread');
            }
        };
    }
    
    function isScoreMismatched(score, defaultRating, bold) {
        if (score <= 1) {
            return false;
        }
        if (defaultRating.baseTotalScore === 0) {
            return false;
        }
        const fid = getCurrentPageFid();
        const diffAllowance = SCORE_DIFF_ALLOWANCE[`fid=${fid}`] || SCORE_DIFF_ALLOWANCE['fid=*'];
        if (defaultRating.ownBought || defaultRating.ownTranslate || bold) {
            const diff = score - defaultRating.baseTotalScore * 10;
            if (diff < defaultRating.baseTotalScore + 10) {
                return false;
            }
            if (score <= diffAllowance[1]) {
                return false;
            }
        }
        const diff = score - defaultRating.baseTotalScore;
        if (diff < defaultRating.baseTotalScore / 2 + diffAllowance[0]) {
            return false;
        }
        return true;
    }

    function initThreadHistoryExecutor(threadHistoryAccess) {
        return {
            async runBatch(threads) {
                const threadsById = new Map();
                threads.forEach(thread => {
                    threadsById.set(thread.tid, thread);
                });
                const tids = Array.from(threadsById.keys());
    
                const lastSeenRecords = await threadHistoryAccess.historyStore.getBatch(tids);
                lastSeenRecords.forEach((record, i) => {
                    const thread = threadsById.get(tids[i]);
                    this.clear(thread);
                    if (record != null) {
                        thread.row.classList.add('rinsp-thread-visited');
                        if (thread.replyCount > record) {
                            thread.row.classList.add('rinsp-thread-visited-update');
                        }
                    }
                });
            },
            async run(thread) {
                await this.runBatch([thread]);
            },
            clear(thread) {
                thread.row.classList.remove('rinsp-thread-visited');
                thread.row.classList.remove('rinsp-thread-visited-update');
            }
        };
    }

    function initMarkPinnedUserThreadExecutor() {
        return {
            async runBatch(threads) {
                threads.forEach(thread => {
                    this.clear(thread);
                    if (userPinArea.isWatching(thread.op)) {
                        thread.row.classList.add('rinsp-thread-user-pinned');
                        userPinArea.addLocation(thread.op, '⚪', null, () => {
                            thread.row.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                        });
                    }
                });
            },
            clear(thread) {
                thread.row.classList.remove('rinsp-thread-user-pinned');
            }
        };
    }

    function initMarkPaywellThreadExecutor() {
        return {
            run(thread) {
                this.clear(thread);
                if (thread.areaId != null) {
                    if (PAYWALL_AREA_IDS.has(thread.areaId)) {
                        thread.row.classList.add('rinsp-thread-paywall');
                    }
                }
            },
            clear(thread) {
                thread.row.classList.remove('rinsp-thread-paywall');
            }
        };
    }

    function initClosedThreadFilterExecutor() {
        return {
            run(thread) {
                this.clear(thread);
                if (thread.row.querySelector('td > a > img[src="images/colorImagination/thread/topicclose.gif"]')) {
                    thread.row.classList.add('rinsp-thread-filter-closed');
                }
            },
            clear(thread) {
                thread.row.classList.remove('rinsp-thread-filter-closed');
            }
        };
    }

    function initScoredThreadFilterExecutor() {
        return {
            run(thread) {
                this.clear(thread);
                let scoreElem = thread.titleCell.querySelector('h3 + .gray.tpage');
                if (scoreElem) {
                    const score = (scoreElem.textContent.match(/ *( [+-]\d+ ) */)||[])[1] * 1;
                    
                    const defaultRating = getDefaultRating(thread.titleCell.querySelector('h3 > a').textContent);
                    if (isScoreMismatched(score, defaultRating, thread.titleCell.querySelector('h3 > a > b') != null)) {
                        thread.row.classList.add('rinsp-thread-filter-miscored');
                    } else {
                        thread.row.classList.add('rinsp-thread-filter-scored');
                    }
                } else {
                    thread.row.classList.add('rinsp-thread-filter-unscored');
                }
            },
            clear(thread) {
                thread.row.classList.remove('rinsp-thread-filter-scored');
                thread.row.classList.remove('rinsp-thread-filter-unscored');
            }
        };
    }

    function initCategorizeShareTypeThreadExecutor(shareTypeFilter) {
        return {
            async runBatch(threads) {
                shareTypeFilter.clearState();
                let rejectedChainSize = 0;
                let lastRejected = null;
                threads.slice().reverse().forEach(thread => {
                    if (thread.areaId > 0 && !RESOURCE_AREA_IDS.has(thread.areaId) && !PAYWALL_AREA_IDS.has(thread.areaId)) {
                        rejectedChainSize = 0;
                        lastRejected = null;
                        return;
                    }
                    this.clear(thread);
                    const accepted = shareTypeFilter.addAndAcceptThread(thread.tid, thread.title);
                    if (accepted) {
                        rejectedChainSize = 0;
                        lastRejected = null;
                    } else {
                        rejectedChainSize++;
                        thread.row.classList.add('rinsp-thread-filter-masked-bysharetype');
                        if (lastRejected) {
                            thread.row.setAttribute('rinsp-sharetype-chain', rejectedChainSize);
                            thread.titleCell.setAttribute('rinsp-sharetype-chain', rejectedChainSize);
                            lastRejected.titleCell.removeAttribute('rinsp-sharetype-chain');
                            lastRejected.row.classList.add('rinsp-thread-filter-masked-bysharetype-collapse');
                        }
                        lastRejected = thread;
                    }
                });
                await shareTypeFilter.update();
            },
            clear(thread) {
                thread.row.removeAttribute('rinsp-sharetype-chain');
                thread.titleCell.removeAttribute('rinsp-sharetype-chain');
                thread.row.classList.remove('rinsp-thread-filter-masked-bysharetype');
                thread.row.classList.remove('rinsp-thread-filter-masked-bysharetype-collapse');
            }
        };
    }

    async function openBookmarkUserMenu(anchor, userId, userHashId, userNickName, deleteAction) {
        setupPopupMenu({
            title: userNickName,
            width: 160,
            popupMenuId: USER_BOOKMARK_ACTION_POPUP_MENU_ID,
            anchor,
            items: [
                {
                    label: '发短消息',
                    class: 'rinsp-mailto-user-bookmark-button',
                    action: `message.php?action-write-touid-${userId}.html`
                },
                {
                    label: '通信记录',
                    action: `message.php?action-chatlog-withuid-${userId}.html`
                },
                {
                    label: '移除收藏',
                    class: 'rinsp-alert-menu-button',
                    action: deleteAction
                }
            ]
        });
    }

    async function openFilterMenu(anchor, thread, onClose, onUpdate, unblockable) {
        const fid = getCurrentPageFid();
        const items = [];

        const dlsiteMatch = thread.title.match(/[RBVrbv][Jj](?:01)?\d{6}/);
        if (dlsiteMatch) {
            const code = dlsiteMatch[0].toUpperCase();
            items.push({
                label: `${code} (官网)`,
                action: `https://www.dlsite.com/maniax/work/=/product_id/${code}.html`, // dlsite will handle redirection
                target: '_blank'
            });
        }

        items.push({
            label: '搜索 (全部版块)',
            action: `search.php#prefill("keyword",${JSON.stringify(thread.title)})`,
            target: '_blank'
        });

        items.push({
            label: '搜索 (此版块内)',
            action: `search.php#prefill("fid",${fid},"keyword",${JSON.stringify(thread.title)})`,
            target: '_blank'
        });

        items.push({
            label: '添加屏蔽词',
            class: 'rinsp-thread-filter-dislike-button',
            action: () => promptEditKeywords('请输入屏蔽关键词 用空格分开', [], thread.title, 'dislikes', onUpdate)
        });

        items.push({
            label: '添加喜欢项目',
            class: 'rinsp-thread-filter-like-button',
            action: () => promptEditKeywords('请输入喜欢的关键词 用空格分开', [], thread.title, 'likes', onUpdate)
        });

        if (thread.row.classList.contains('rinsp-thread-filter-like-bytid')) {
            items.push({
                label: '移除标记',
                class: 'rinsp-thread-filter-liketid-button',
                action: () => removeLikeThread(thread.tid, onUpdate)
            });
        } else {
            items.push({
                label: '标记此帖',
                class: 'rinsp-thread-filter-liketid-button',
                action: () => promptLikeThread(thread.tid, onUpdate)
            });
        }

        if (thread.row.classList.contains('rinsp-thread-filter-dislike-bytid')) {
            items.push({
                label: '取消屏蔽此帖',
                class: 'rinsp-thread-filter-hidetid-button',
                action: () => removeBlockThread(thread.tid, onUpdate)
            });
        } else if (!unblockable) {
            items.push({
                label: '🛇只屏蔽此帖',
                class: 'rinsp-thread-filter-hidetid-button',
                action: () => promptBlockThread(thread.tid, onUpdate)
            });
        }

        if (thread.row.classList.contains('rinsp-thread-filter-dislike-byuid')) {
            items.push({
                label: '取消屏蔽用户',
                class: 'rinsp-thread-filter-hideop-button',
                action: () => promptRemoveUserBlock(thread.op, thread.opName, onUpdate)
            });
        } else if (!unblockable) {
            items.push({
                label: '🛇屏蔽所有主题帖',
                class: 'rinsp-thread-filter-hideop-button',
                action: () => promptBlockOp(thread.op, thread.opName, onUpdate)
            });
        }

        setupPopupMenu({
            title: '帖子功能选择',
            popupMenuId: THREAD_FILTER_ACTION_POPUP_MENU_ID,
            width: 150,
            anchor,
            rightAligned: true,
            onClose,
            items
        });
    }

    function getTidMatchDirective(tid) {
        return 'tid:<' + tid + '>';
    }

    function initThreadFilterExecutor(myUserId, threadFilter, userFilter, onUpdate, isGF) {
        const dislikePatternMatcher = createKeywordMatcherFactory(threadFilter.dislikes);
        const likePatternMatcher = createKeywordMatcherFactory(threadFilter.likes);
        return {
            run(thread) {
                this.clear(thread);
                const unblockable = thread.op === myUserId || THREAD_FILTER_EXEMPTED_USERS.has(thread.op);
                const tidDirective = getTidMatchDirective(thread.tid);
                const matchableTitle = thread.title.toLowerCase() + ' ' + tidDirective;
                const filterMenuButton = addElem(thread.titleCell, 'div', 'rinsp-thread-filter-menu-button');
        
                filterMenuButton.addEventListener('click', () => {
                    thread.row.classList.add('rinsp-thread-selected');
                    openFilterMenu(filterMenuButton, thread, () => thread.row.classList.remove('rinsp-thread-selected'), onUpdate, unblockable);
                });
    
                thread.titleCell.appendChild(document.createTextNode(' ')); // put a space to avoid copying to include button text
                const dislikeUserRule = userFilter.users['#' + thread.op];
                if (dislikeUserRule != null) {
                    if (dislikeUserRule.hideThreads) {
                        thread.row.classList.add('rinsp-thread-filter-dislike');
                        thread.row.classList.add('rinsp-thread-filter-dislike-byuid');
                    }
                }
                if (dislikePatternMatcher != null) {
                    const matches = dislikePatternMatcher.match(matchableTitle);
                    if (matches.size > 0) {
                        thread.row.classList.add('rinsp-thread-filter-dislike');
                        thread.row.classList.add('rinsp-thread-filter-dislike-bytitle');
                        const filteredWords = addElem(thread.titleCell, 'div', 'rinsp-thread-filter-dislike-words');
                        if (matches.has(tidDirective)) {
                            thread.row.classList.add('rinsp-thread-filter-dislike-bytid');
                            filteredWords.textContent = '🚫此帖已屏蔽';
                            filteredWords.addEventListener('click', async () => {
                                if (confirm('取消屏蔽此帖？')) {
                                    removeBlockThread(thread.tid, onUpdate);
                                }
                            });
                        } else {
                            filteredWords.textContent = '🚫' + Array.from(matches).sort().join(' ').replace(/^(.{20}).+/, '$1...');
                            filteredWords.addEventListener('click', async () => {
                                const staticKeywords = Array.from(matches).filter(w => w !== tidDirective && dislikePatternMatcher.isStaticKeyword(w));
                                promptEditKeywords('请编辑屏蔽关键词 用空格分开', Array.from(staticKeywords), null, 'dislikes', onUpdate);
                            });
                        }
                        if (unblockable) {
                            thread.row.classList.add('rinsp-thread-filter-bypass');
                        } else if (userConfig.customUserBypassThreadFilter) {
                            if (userConfig.customUserHashIdMappings['#' + thread.op] != null) {
                                thread.row.classList.add('rinsp-thread-filter-bypass');
                            }
                        }
                    }
                }
                if (likePatternMatcher != null) {
                    const matches = likePatternMatcher.match(matchableTitle);
                    if (matches.size > 0) {
                        thread.row.classList.add('rinsp-thread-filter-like');
                        const filteredWords = addElem(thread.titleCell, 'div', 'rinsp-thread-filter-like-words');
                        if (matches.has(tidDirective)) {
                            thread.row.classList.add('rinsp-thread-filter-like-bytid');
                            filteredWords.textContent = '💚标记帖';
                            filteredWords.addEventListener('click', async () => {
                                if (confirm('移除标记？')) {
                                    removeLikeThread(thread.tid, onUpdate);
                                }
                            });
                            if (userConfig.showFavThreadFloatingList) {
                                if (isGF) {
                                    userPinArea.addLocationHighlight(0, '💚:标记帖');
                                } else {
                                    let label = userConfig.showFavThreadFloatingList$withTitle ? '标记帖 - ' + thread.title : '标记帖';
                                    userPinArea.addLocationHighlight(null, '💚:' + label, thread.row, `/read.php?tid-${thread.tid}.html`);
                                }
                            }
                        } else {
                            const matchList = Array.from(matches).sort();
                            filteredWords.textContent = '💚' + matchList.join(' ').replace(/^(.{20}).+/, '$1...');
                            filteredWords.addEventListener('click', async () => {
                                const staticKeywords = matchList.filter(w => likePatternMatcher.isStaticKeyword(w));
                                promptEditKeywords('请编辑喜欢的关键词 用空格分开', staticKeywords, null, 'likes', onUpdate);
                            });
                            if (userConfig.showFavThreadFloatingList) {
                                if (isGF) {
                                    userPinArea.addLocationHighlight(0, '💚:' + matchList[0]);
                                } else {
                                    let label = userConfig.showFavThreadFloatingList$withTitle ? matchList[0] + ' - ' + thread.title : matchList[0];
                                    userPinArea.addLocationHighlight(null, '💚:' + label, thread.row, `/read.php?tid-${thread.tid}.html`);
                                }
                            }
                        }
                    }
                }
    
                if (thread.opElem) {
                    if (thread.row.classList.contains('rinsp-thread-filter-dislike-byuid')) {
                        const removeFilterOpButton = newElem('div', 'rinsp-thread-filter-unhideop-button');
                        removeFilterOpButton.textContent = '🚫';
                        thread.opElem.after(removeFilterOpButton);
                        removeFilterOpButton.addEventListener('click', async () => {
                            promptRemoveUserBlock(thread.op, thread.opElem.textContent.trim(), onUpdate);
                        });
                    }
                }
            },
            clear(thread) {
                thread.row.classList.remove('rinsp-thread-filter-like');
                thread.row.classList.remove('rinsp-thread-filter-like-bytid');
                thread.row.classList.remove('rinsp-thread-filter-dislike');
                thread.row.classList.remove('rinsp-thread-filter-dislike-bytitle');
                thread.row.classList.remove('rinsp-thread-filter-dislike-bytid');
                thread.row.classList.remove('rinsp-thread-filter-dislike-byuid');
                thread.row.querySelectorAll('.rinsp-thread-filter-like-words,.rinsp-thread-filter-dislike-words,.rinsp-thread-filter-menu-button,.rinsp-thread-filter-unhideop-button').forEach(el => el.remove());
            }
        };
    }

    async function applyThreadListEnhancement(myUserId, userConfig, threadList, threadFilter, userFilter, userPinArea, shareTypeFilter, settlementPostMatcher, threadHistoryAccess, updateCallback, fresh) {
        if (DEBUG_MODE) console.info('thread-list', threadList);

        const executors = [
            initScoredThreadFilterExecutor(),
            initClosedThreadFilterExecutor(),
            initThreadFilterExecutor(myUserId, threadFilter, userFilter, onUpdate),
            initRequestThreadEnhancementExecutor(myUserId, userConfig, settlementPostMatcher),
            initMarkPaywellThreadExecutor(),
            initMarkPinnedUserThreadExecutor(userPinArea),
        ];
        
        if (shareTypeFilter) {
            executors.push(initCategorizeShareTypeThreadExecutor(shareTypeFilter));
        }
        if (threadHistoryAccess) {
            executors.push(initThreadHistoryExecutor(threadHistoryAccess));
        }

        function onUpdate(updatedConfigs) {
            updateCallback(updatedConfigs);
        }

        let newThreadList;
        if (fresh || threadList.some(thread => !thread.row.classList.contains('rinsp-thread-inspected'))) {
            threadList.forEach(thread => {
                thread.row.classList.remove('rinsp-thread-inspected');
            });
            newThreadList = threadList;
        } else {
            return;
        }

        userPinArea.clearState();
        for (let executor of executors) {
            if (typeof executor.runBatch === 'function') {
                await executor.runBatch(newThreadList);
            } else {
                const awaits = [];
                for (let thread of newThreadList) {
                    const returnValue = executor.run(thread);
                    if (returnValue instanceof Promise) {
                        awaits.push(returnValue);
                    }
                }
                if (awaits.length > 0) {
                    await Promise.allSettled(awaits);
                }
            }
        }
        await userPinArea.update();

        newThreadList.forEach(thread => {
            thread.row.classList.add('rinsp-thread-inspected');
        });

        const dislikeThreadCount = document.querySelectorAll('.rinsp-thread-filter-dislike').length;
        ignoreDislikeThreadToggler.setCount(dislikeThreadCount);

        const settlementCount = document.querySelectorAll('.rinsp-request-settlement-thread:not(.rinsp-request-settlement-bypass)').length;
        ignoreSettlementToggler.setCount(settlementCount);

        ignorePaywellToggler.setCount(document.querySelectorAll('.rinsp-thread-paywall').length);
        if (hideAnsweredRequestToggler) {
            hideAnsweredRequestToggler.setCount(document.querySelectorAll('.rinsp-request-thread.rinsp-request-thread-ended').length);
        }
        if (hideUnansweredRequestToggler) {
            hideUnansweredRequestToggler.setCount(document.querySelectorAll('.rinsp-request-thread.rinsp-request-thread-ongoing').length);
        }
        if (hideExpiredRequestToggler) {
            hideExpiredRequestToggler.setCount(document.querySelectorAll('.rinsp-request-thread.rinsp-request-thread-expired').length);
        }
        if (hideVisitedThreadToggler) {
            hideVisitedThreadToggler.setCount(document.querySelectorAll('.rinsp-thread-visited').length);
        }
        hideClosedThreadToggler.setCount(document.querySelectorAll('.rinsp-thread-filter-closed').length);
    }
    
} // END: init()

let forumUserBlacklistCache = {
    data: {
        banPosts: new Set(),
        banAvatars: new Set(),
    },
    key: ''
};

function getForumUserBlacklist() {
    if (forumUserBlacklistCache.key === localStorage.config||'') {
        return forumUserBlacklistCache.data;
    }
    const banPosts = new Set();
    const banAvatars = new Set();
    try {
        const data = JSON.parse(localStorage.config||'{}');
        for (let entry of Object.entries(data.blist||{})) {
            for (let mode of entry[1].level||[]) {
                if (mode === 'topic') {
                    banPosts.add(entry[0] * 1);
                } else if (mode === 'avatar') {
                    banAvatars.add(entry[0] * 1);
                }
            }
        }
    } catch (ex) {}
    const data = {
        banPosts, banAvatars
    };
    forumUserBlacklistCache = {
        data: data,
        key: localStorage.config||''
    };
    return data;
}
function isUserBlacklisted(userFilter, uid) {
    const userFilterRule = userFilter.users['#' + uid];
    if (userFilterRule && userFilterRule.hideReplies) {
        return true;
    }
    return getForumUserBlacklist().banPosts.has(uid * 1);
}

function getPosts(doc, max) {
    const tidRefLink = doc.querySelector('#td_tpc .tiptop .fr a[href^="read.php?tid-"], th[id^="td_"] .tiptop .fr a[href^="read.php?tid-"]');
    if (tidRefLink == null) {
        return [];
    }
    const tid = Number.parseInt(tidRefLink.getAttribute('href').substring(13));
    const currentLevel = doc.querySelector('#breadcrumbs > a.crumbs-item[href^="thread.php?fid-"] + .crumbs-item.current');
    let areaId = null;
    if (currentLevel) {
        areaId = Number.parseInt(currentLevel.previousElementSibling.getAttribute('href').substring(15));
    }
    function getAuthor(mainCell) {
        const nameElem = mainCell.closest('tr').querySelector('.user-pic ~ div a[href^="u.php?action-show-uid-"] > strong');
        return [Number.parseInt(nameElem.parentNode.getAttribute('href').substring(22)), nameElem.textContent.trim(), nameElem];
    }
    function getFloorElem(mainCell) {
        return mainCell.querySelector('.tiptop > .fl > .s3');
    }

    function getFloor(floorElem) {
        const flText = floorElem.textContent.trim();
        return flText === 'GF' ? 0 : Number.parseInt(flText.substring(1));
    }
    function getDate(mainCell) {
        return new Date(mainCell.querySelector('.tiptop > .fl + .fl.gray[title^="发表于"]').textContent.trim()) * 1;
    }

    const posts = [];
    doc.querySelectorAll('th.r_one[id^=td_] .tpc_content > div[id^="read_"]').forEach(function(contentElem) {
        if (max != null && posts.length >= max) {
            return;
        }
        const rootElem = contentElem.closest('.t2.t5 > table');
        if (rootElem == null) {
            return;
        }
        const mainCell = contentElem.closest('th.r_one[id^=td_]');
        const floorElem = getFloorElem(mainCell);
        const [postUid, postUname, nameElem] = getAuthor(mainCell);

        const userPicImg = rootElem.querySelector('.user-pic a[href^="u.php?action-show-uid-"] > img');
        const userPic = userPicImg.closest('.user-pic');
        const userPicImgSrc = getImgSrc(userPicImg);
        let defaultUserPic = false;
        if (userPicImgSrc.startsWith('images/face/')) {
            if (userPicImgSrc === 'images/face/none.gif') {
                defaultUserPic = 'none';
            } else {
                defaultUserPic = 'preset';
            }
        }

        const postDefaultHidden = rootElem.parentNode.getAttribute('hidden') != null;
        const puremarkContent = rootElem.querySelector('.tiptop > .js-puremark-content');
        const postCollapsed = puremarkContent != null && (puremarkContent.getAttribute('style')||'').match(/\bdisplay *: *none(?:;|\b)/) == null;

        const postEid = contentElem.getAttribute('id');
        const postId = postEid.split('_')[1] * 1;
        const post = {
            tid,
            areaId,
            postId,
            postUid,
            postUname,
            postTime: getDate(mainCell),
            floor: getFloor(floorElem),
            floorElem: getFloorElem(mainCell),
            rootElem,
            mainCell,
            contentElem,
            userNameElem: nameElem,
            userPicElem: userPic,
            defaultUserPic,
            postDefaultHidden,
            contentDefaultIgnorable: puremarkContent != null,
            postCollapsed
        };
        posts.push(post);
    });
    return posts;
}

function readThreadList() {
    const threadList = [];
    let divider = document.querySelector('tr.tr2 > .tac[colspan="6"]');
    let prefixSelector = '';
    if (divider && divider.textContent.trim() === '普通主题') {
        divider = divider.closest('tr');
        divider.classList.add('rinsp-thread-section-divider');
        prefixSelector = '.rinsp-thread-section-divider ~ ';
        let row = divider.previousElementSibling;
        while (row != null && row.classList.contains('t_one')) {
            const elem = row.querySelector('td[id^="td_"] > h3 > a[href^="read.php?tid-"]');
            if (elem && elem.closest('td').querySelector('a.s8[href^="thread.php?fid-"]') != null) {
                collect(elem);
            }
            row = row.previousElementSibling;
        }
        threadList.reverse();
    } else {
        divider = null;
    }
    document.querySelectorAll(prefixSelector + '.t_one > td[id^="td_"] > h3 > a[href^="read.php?tid-"], .rinsp-infscroll-divider ~ tbody .t_one > td[id^="td_"] > h3 > a[href^="read.php?tid-"], .spp-infinite-scroll-divider ~ tbody .t_one > td[id^="td_"] > h3 > a[href^="read.php?tid-"]').forEach(elem => {
        collect(elem);
    });
    function collect(link) {
        const tid = Number.parseInt(link.getAttribute('href').substring(13));
        const row = link.closest('tr');
        const opElem = row.querySelector('td > a.bl[href^="u.php?action-show-uid-"]');
        const countElem = row.querySelector('td.f10 > .s8');
        let replyCount = 0;
        let hitCount = 0;
        if (countElem) {
            const match = countElem.parentElement.textContent.trim().match(/^(\d+)[\u00A0 ]*\/[\u00A0 ]*(\d+)$/);
            if (match) {
                replyCount = match[1] * 1;
                hitCount = match[2] * 1;
            }
        }
        const byCell = row.querySelector('td.tal.y-style > .f10 + br + .gray2');
        const replyHashId = byCell ? (byCell.textContent.trim().match(/^by: ([a-f0-9]{8})$/)||[])[1]||null : null;
        threadList.push({
            tid,
            row: row,
            title: getEffectiveThreadTitle(link.textContent),
            titleCell: link.closest('td'),
            opElem: opElem,
            opName: opElem ? opElem.textContent.trim() : null,
            op: opElem ? Number.parseInt(opElem.getAttribute('href').substring(22)) : null,
            opHashId: replyCount === 0 ? replyHashId : null,
            replyCount,
            hitCount
        });
    }
    return threadList;
}

function readPicWallThreadList() {
    const threadList = [];
    document.querySelectorAll('#wall ul.stream > li > .inner').forEach(elem => {
        const row = elem.parentNode;
        const link = elem.querySelector('.section-title > a[href^="./read.php?tid-"]');
        const tid = Number.parseInt(link.getAttribute('href').substring(15));
        const countElem = elem.querySelector('.section-text > span + span');
        let replyCount = 0;
        let hitCount = 0;
        if (countElem) {
            const match = countElem.textContent.trim().match(/：[\u00A0 ]*(\d+)[\u00A0 ]*\/[\u00A0 ]*(\d+)$/);
            if (match) {
                replyCount = match[1] * 1;
                hitCount = match[2] * 1;
            }
        }
        const opElem = elem.querySelector('.section-intro a.bl[href^="u.php?action-show-uid-"]');
        threadList.push({
            tid,
            row,
            title: getEffectiveThreadTitle(link.textContent),
            titleCell: link.parentNode,
            opElem: opElem,
            opName: opElem ? opElem.textContent.trim() : null,
            op: opElem ? Number.parseInt(opElem.getAttribute('href').substring(22)) : null,
            replyCount,
            hitCount
        });
    });
    return threadList;
}

function readSearchThreadList() {
    const threadList = [];
    document.querySelectorAll('table > tbody > tr.tr3.tac > th > a[href^="read.php?tid-"]').forEach(link => {
        const tid = Number.parseInt(link.getAttribute('href').substring(13));
        const row = link.closest('tr');
        const areaElem = row.querySelector('th + td > a[href^="thread.php?fid-"]');
        const areaId = areaElem ? Number.parseInt(areaElem.getAttribute('href').substring(15)) : null;
        const areaName = areaElem ? areaElem.textContent.trim() : null;
        const opElem = row.querySelector('td.smalltxt > a[href^="u.php?action-show-uid-"]');
        const replyCountElem = opElem.parentElement.nextElementSibling;
        const hitCountElem = replyCountElem.nextElementSibling;
        threadList.push({
            tid,
            row: row,
            titleCell: link.closest('th'),
            title: getEffectiveThreadTitle(link.textContent),
            opElem: opElem,
            opName: opElem ? opElem.textContent.trim() : null,
            op: opElem ? Number.parseInt(opElem.getAttribute('href').substring(22)) : null,
            opHashId: opElem ? opElem.textContent.trim() : null,
            replyCount: replyCountElem.textContent.trim() * 1,
            hitCount: hitCountElem.textContent.trim() * 1,
            areaId: areaId,
            areaName: areaName
        });
    });
    return threadList;
}

function getEffectiveThreadTitle(rawTitle) {
    return rawTitle.replace(/^(\[(?:[三二]次元R18相关|全年龄正常向)\] *)+/g, '').replace(/\s+/g, ' ').trim();
}

function getEffectiveTextContent(rootNode, preferTextOnly, treatAllEmojiTheSameWay) {
    if (rootNode.textContent.length > MAX_IGNORE_CONTENT_TEXT_LENGTH || rootNode.innerHTML.length > MAX_IGNORE_CONTENT_HTML_LENGTH) {
        return null;
    }
    const contentList = [];
    let externalImg = false;
    let complexData = false;
    function visit(node) {
        let endContent = null;
        if (node.classList.contains('jumbotron')) {
            contentList.push('<SELL>');
            complexData = true;
            return;
        }
        switch (node.tagName) {
            case 'HR':
                return;
            case 'BR':
                contentList.push(' ');
                return;
            case 'SCRIPT':
            case 'STYLE':
            case 'BUTTON':
            case 'INPUT':
            case 'SELECT':
            case 'FORM':
            case 'VIDEO':
            case 'OBJECT':
            case 'FRAME':
            case 'IFRAME':
                contentList.push('<' + node.tagName + '>');
                complexData = true;
                return;
            case 'IMG':
                const imgSrc = getImgSrc(node)||'';
                if (imgSrc.startsWith('images/post/smile/')) {
                    let token;
                    if (treatAllEmojiTheSameWay) {
                        token = `<EMOJI>`;
                    } else {
                        const emojiId = imgSrc.substring(18).replace(/\//g, ':').replace(/\.[a-z]+$/, '').toUpperCase();
                        token = `<EMOJI:${emojiId}>`;
                    }
                    if (contentList.length === 0 || contentList[contentList.length - 1] !== token) {
                        contentList.push(token); // skip consecutive emoji
                    }
                } else {
                    contentList.push('<EXT_IMG>');
                    externalImg = true;
                }
                return;
            case 'FONT':
            case 'CENTER':
            case 'I':
            case 'U':
            case 'B':
            case 'SUP':
            case 'SUB':
            case 'CODE':
            case 'H1':
            case 'H2':
            case 'H3':
            case 'H4':
            case 'H5':
            case 'H6':
            case 'H7':
            case 'H8':
            case 'H9':
            case 'P':
            case 'SPAN':
            case 'DIV':
                break;
            case 'BLOCKQUOTE':
                if (node.classList.contains('blockquote3')) {
                    contentList.push('<QUOTE>');
                    complexData = true;
                    return;
                }
                break;
            case 'A':
            default:
                contentList.push(`<${node.tagName}>`);
                endContent = `<${node.tagName}_END>`;
                break;
            }
        for (const childNode of node.childNodes) {
            if (childNode.nodeType === 3) {
                const text = childNode.textContent.toLowerCase();
                if (text.length > 0) {
                    const normText = simplifyText(text);
                    if (normText) {
                        contentList.push(normText);
                    }
                }
            } else if (childNode.nodeType === 1) {
                visit(childNode);
                if (complexData) {
                    return;
                }
            }
        }
        if (endContent != null) {
            contentList.push(endContent);
        }
    }
    visit(rootNode);
    if (complexData) {
        return null;
    }
    if (preferTextOnly) {
        const textOnly = contentList.filter(s=>s[0]!=='<').join('').replace(/\s+/g, ' ').trim();
        if (textOnly) {
            const textWithoutSymbols = textOnly.replace(/!/g, ' ').replace(/ +/g, ' ').trim();
            if (textWithoutSymbols) {
                return textWithoutSymbols;
            }
            return textOnly;
        } else if (externalImg) {
            return null;
        }
    }
    return contentList.join('')
        .replace(/\s+/g, ' ')
        .trim() || '<EMPTY>';
}

function simplifyText(text) {
    const chars = Array.from(text);
    const normText = chars
        .reduce((arr, itm) => {
            if (arr.length === 0 || arr[arr.length - 1] !== itm) {
                arr.push(itm);
            }
            return arr;
        }, [])
        .join('');
    return normText.trim().replace(/\s+/g, ' ').replace(/[~⁉`‘’'～！!？?。，、,.<>]+/g, '!');
}

function num(v) {
    return atob(v)*1;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function tryOpenUpdateSummary() {
    const lastVersion = await GM.getValue('last_version') * 1||0;
    if (VERSION_MAJOR > lastVersion) {
        await GM.setValue('last_version', String(VERSION_MAJOR));
        GM.notification({
            title: `南家功能强化(凛+) 已更新 ver.${VERSION_MAJOR}`,
            text: "请参阅功能简介帖"
        });
        if (confirm(`凛+ 已更新 ${VERSION_MAJOR}，打开功能简介帖？(新页面)`)) {
            GM.openInTab(INTRO_POST, false);
        }
    }
}

const allowingHookPosters = [1597333055699695, 501998265301213];

function applyHookDirectives(posts, myUserId, userConfig) {
    
    function handleDirective_if_not_installed(hook) {
        const minVersion = (hook.getAttribute('sparg-min-ver')||'0') * 1;
        if (VERSION_FULL >= minVersion) {
            hook.setAttribute('hidden', '');
            hook.textContent = '';
        }
    }

    function handleDirective_if_installed(hook) {
        const minVersion = (hook.getAttribute('sparg-min-ver')||'0') * 1;
        if (VERSION_FULL >= minVersion) {
            hook.removeAttribute('hidden');
        }
    }

    function handleDirective_value_userhash(hook) {
        const prefix = hook.getAttribute('sparg-prefix')||'';
        const length = hook.getAttribute('sparg-length') * 1 || 6;
        const hashNum = cyrb53(prefix + myUserId);
        let hashStr = btoa(hashNum).replace(/[\+\/=]/g, '').split('').reverse().join('');
        while (hashStr.length < length) {
            hashStr = hashStr + hashStr;
        }
        hook.textContent = hashStr.substring(0, length).toUpperCase();
    }

    function handleDirective_value_version(hook) {
        hook.textContent = VERSION_TEXT;
    }

    function handleDirective(hook, directive) {
        switch (directive) {
            case 'when-not-installed':
                return handleDirective_if_not_installed(hook);
            case 'when-installed':
                return handleDirective_if_installed(hook);
            case 'value-userhash':
                return handleDirective_value_userhash(hook);
            case 'value-version':
                return handleDirective_value_version(hook);
        }
    }

    posts
        .filter(post => allowingHookPosters.indexOf(cyrb53(''+post.postUid, 233)) !== -1)
        .forEach(post => {
            post.contentElem.querySelectorAll('.rinsp-sp-hook').forEach(hook => {
                hook.classList.remove('rinsp-sp-hook');
                const directive = hook.getAttribute('sp-directive');
                hook.removeAttribute('sp-directive');
                if (directive) {
                    handleDirective(hook, directive);
                }
            });
        });
}

function applyReplyRefreshFree(tid, lastPost, myUserId) {
    const pagination = document.querySelector('.pages .pagesone');
    let onLastPage = true;
    if (pagination) {
        const match = pagination.textContent.match(/Pages: (\d+)\/(\d+)/);
        if (match && match[1] !== match[2]) {
            onLastPage = false;
        }
    }
    const replyForm = document.FORM;
    if (replyForm == null || replyForm.getAttribute('action') !== 'post.php?') {
        return;
    }
    if (replyForm.getAttribute('onsubmit') == null) {
        return;
    }
    
    const lastPageUrl = `${document.location.origin}/read.php?tid=${tid}&page=e&#a`;

    replyForm.addEventListener('submit', evt => {
        let ok = 1;
        try {
            ok = unsafeWindow.checkpost(replyForm);
        } catch (ignore) {
            console.warn('fail to execute unsafeWindow.checkpost', ignore);
        }
        if (!ok) {
            evt.preventDefault();
            return false;
        }

        executeSubmit()
            .catch(err => {
                console.error(err);
                document.location.href = lastPageUrl;
            })
            .finally(() => {
                replyForm.classList.remove('rinsp-refresh-free-submitting');
                // unlock and reset form for resubmission
                replyForm.Submit.disabled = false;
                replyForm.encoding = 'multipart/form-data';
                if (ok === true) { // meaning checkpost was executed successfully
                    unsafeWindow.cnt = 0;
                }
            });
        evt.preventDefault();
        return false;
    });
    replyForm.classList.add('rinsp-reply-refresh-free');
    replyForm.removeAttribute('onsubmit');

    let lastPostId = lastPost.postId;
    async function executeSubmit() {
        replyForm.classList.add('rinsp-refresh-free-submitting');
        const resp = await fetch(`${document.location.origin}/post.php`, {
            method: 'POST',
            mode: 'same-origin',
            credentials: 'same-origin',
            body: new FormData(replyForm)
        });
        if (!resp.ok) {
            throw Error('request failed');
        }
        const postFeedback = await resp.text();
        const parser = new DOMParser();
        const postFeedbackDoc = parser.parseFromString(postFeedback, 'text/html');
        const err = findErrorMessage(postFeedbackDoc);
        if (err) {
            alert(err.replace(/\s+/g, ' '));
            return;
        }

        if (onLastPage) {
            const newDoc = await fetchGetPage(lastPageUrl);
            const knownLastPost = newDoc.querySelector(`#td_${lastPostId||'tpc'}`);
            if (knownLastPost == null) {
                document.location.href = lastPageUrl;
                return;
            }
            const newRows = [];
            let myNewPostIdAttr = null;
            let row = knownLastPost.closest('.t5.t2');
            if (row.nextElementSibling && row.nextElementSibling.classList.contains('menu')) {
                row = row.nextElementSibling;
                if (row.nextElementSibling && row.nextElementSibling.matches('a[name="a"]')) {
                    row = row.nextElementSibling;
                }
            }
            while ((row = row.nextElementSibling) != null) {
                newRows.push(row.outerHTML);
                if (row.querySelector(`.user-pic a[href="u.php?action-show-uid-${myUserId}.html"]`)) {
                    myNewPostIdAttr = row.querySelector('th[id^="td_"]').getAttribute('id');
                }
            }

            if (myNewPostIdAttr == null) {
                // can't find new post, just load last page instead
                document.location.href = lastPageUrl;
            }

            const postList = lastPost.rootElem.closest('form');
            const tmpElem = newElem('div');
            tmpElem.innerHTML = newRows.join('\n');
            Array.from(tmpElem.children).forEach(node => postList.appendChild(node));
            tmpElem.remove();
            lastPostId = Number.parseInt(Array.from(postList.querySelectorAll('.t5.t2 th[id^="td_"]')).at(-1).getAttribute('id').substring(3));
            setTimeout(() => {
                document.querySelector(`#${myNewPostIdAttr}`).closest('.t5.t2').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            });

            document.FORM.atc_content.value = '';
            document.FORM.querySelector('#attach').innerHTML = '';
            try {
                if (unsafeWindow.newAtt) { // attachment might be disabled, check if handler exists first
                    unsafeWindow.newAtt.create();
                }
            } catch (ignore) {}

        } else {
            document.location.href = lastPageUrl;
        }
        
    }
}

function applySubjectLineEnhancement(posts, userConfig) {
    let threadTitle = null;
    if (userConfig.hideRedundantReSubjectLine) {
        threadTitle = (document.querySelector('#breadcrumbs .crumbs-item.current > strong')||{}).textContent;
        if (threadTitle) {
            threadTitle = threadTitle.replace(/\s|\u00A0|&[a-z;]{0,5}$/g, '').trim();
        }
    }
    const pageArr = readCurrentAndMaxPage(document);
    const currentPage = pageArr[0];
    const maxPage = pageArr[1];
    const form = document.querySelector('form[name="delatc"]');
    let pageSize = 0;
    if (currentPage === 1) {
        if (maxPage > currentPage) {
            for (let child of form.children) {
                if (child.matches('.rinsp-infscroll-divider')) {
                    break;
                }
                if (child.matches('.t5.t2')) {
                    pageSize++;
                }
            }
        }
    } else {
        pageSize = posts[0].floor / (currentPage - 1);
    }
    function getFloorTarget(targetFloor) {
        let targetElem = posts.filter(post => post.floor === targetFloor).map(post => post.rootElem)[0];
        let targetPage = pageSize === 0 ? 1 : Math.floor(targetFloor / pageSize)+1;
        let hash = targetFloor > 0 ? `#fl-${targetFloor}` : '';
        if (targetPage > 1) {
            return { url: `/read.php?tid-${posts[0].tid}-fpage-0-toread--page-${targetPage}.html${hash}`, targetElem };
        } else {
            return { url: `/read.php?tid-${posts[0].tid}.html${hash}`, targetElem };
        }
    }

    posts.forEach(post => {
        if (post.rootElem.classList.contains('rinsp-subject-inspected')) {
            return;
        }
        post.rootElem.classList.add('rinsp-subject-inspected');
        const subjectLine = post.mainCell.querySelector('.h1.fl > h1[id^="subject_"]');
        if (subjectLine) {
            if (post.floor === 0) {
                const textNode = subjectLine.childNodes[0];
                if (textNode) {
                    const prefix = textNode.textContent.match(/^(\[(?:二次元R18相关|三次元R18相关|全年龄正常向)\])/);
                    if (prefix) {
                        textNode.textContent = textNode.textContent.substring(prefix[1].length);
                        const classTag = newElem('span', 'rinsp-subject-class');
                        classTag.textContent = prefix[1];
                        subjectLine.insertBefore(classTag, textNode);
                    }
                }
            }
            if (threadTitle && post.floor > 0) {
                const subject = subjectLine.textContent.replace(/\s|\u00A0|&[a-z;]{0,5}$/g, '').trim();
                if (subject.startsWith('Re:') && threadTitle.startsWith(subject.substring(3))) {
                    subjectLine.parentNode.classList.add('rinsp-subject-redundant');
                }
            }
        }
        function addClickableLine(targetLine, floor, match) {
            const target = getFloorTarget(floor);
            addElem(targetLine, 'span').textContent = match[1];
            const link = addElem(targetLine, 'a', 'rinsp-subject-floor-link', { href: target.url, target: '_blank' });
            link.textContent = match[2];
            addElem(targetLine, 'span').textContent = match[3];
            if (target.targetElem) {
                link.addEventListener('click', evt => {
                    evt.preventDefault();
                    target.targetElem.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                });
            }
        }
        if (userConfig.addQuickJumpReSubjectLine) {
            if (subjectLine && subjectLine.childNodes.length === 1 && subjectLine.childNodes[0].nodeType === 3) {
                const match = subjectLine.textContent.match(/^((?:Re:)?回 )(\d+楼|楼主)(\(.+ 的帖子)$/);
                if (match) {
                    subjectLine.textContent = '';
                    const floor = Number.parseInt(match[2])||0;
                    addClickableLine(subjectLine, floor, match);
                    if (userConfig.hideRedundantReSubjectLine && floor === 0) {
                        subjectLine.classList.add('rinsp-subject-redundant');
                    }
                }
            }
            post.mainCell.querySelectorAll('.blockquote3 > .quote2 + div').forEach(quote => {
                if (quote.childNodes.length > 1 && quote.childNodes[1].nodeType === 1 && quote.childNodes[1].tagName === 'BR') {
                    const textNode = quote.childNodes[0];
                    if (textNode.nodeType === 3) {
                        const match = textNode.textContent.match(/^(引用 *)(第\d+楼|楼主)(.*)$/);
                        if (match) {
                            const floor = Number.parseInt(match[2].substring(1))||0;
                            const quoteLine = newElem('span');
                            addClickableLine(quoteLine, floor, match);
                            quote.childNodes[0].replaceWith(quoteLine);
                        }
                    }
                }
            });
        }
});
}

function getPostMetadata(postContent) {
    const row = postContent.closest('form > .t5.t2');
    if (row == null) return null;
    const link = row.querySelector('.tiptop a[href^="read.php?tid-"]');
    const match = link.getAttribute('href').match(/\?tid-(\d+)(?:-uid-(\d+))?\.html/);
    let tid = match[1] * 1;
    let uid;
    if (match[2] == null) {
        uid = Number.parseInt(link.closest('tr').querySelector('.user-pic a[href^="u.php?action-show-uid-"]').getAttribute('href').substring(22));
    } else {
        uid = match[2] * 1;
    }
    const pid = row.querySelector('.tpc_content > div[id^="read_"]').getAttribute('id').substring(5);
    return {
        tid, uid, pid
    };
}

function enhanceBuyButtons(userConfig, triggerRefresh) {
    
    document.querySelectorAll('span[id^="att_"]:not(.rinsp-att-enhanced) > a[href^="job.php?action-download-"]').forEach(function(attLink) {
        const root = attLink.parentNode;
        root.classList.add('rinsp-att-enhanced');
        const price = (root.textContent.match(/ 售价:(\d+)SP币/)||[])[1] * 1;
        if (Number.isNaN(price) || price <= 0) {
            return;
        }
        const href = attLink.getAttribute('href');
        attLink.dataset.price = String(price);
        attLink.removeAttribute('href');
        attLink.setAttribute('buyhref', href);
        root.classList.add('rinsp-att-sell');
        if (userConfig.enhanceSellFrame && price > 5) {
            root.classList.add('rinsp-att-sell-high');
        }
        attLink.addEventListener('click', () => {
            if (attLink.getAttribute('href'))
                return;
            if (price > 5) {
                let msg = `警告: 高额附件 ${price} SP 请确认购买？`;
                if (!confirm(msg)) {
                    return false;
                }
            }
            attLink.setAttribute('href', href);
        });
    });

    document.querySelectorAll('.quote.jumbotron > .s3 + .btn-danger:not(.rinsp-sell-relay-button):not(.rinsp-sell-enhanced)').forEach(function(buyButton) {
        const tpc = buyButton.closest('.tpc_content');
        const sellFrame = buyButton.closest('h6.jumbotron');
        buyButton.classList.add('rinsp-sell-enhanced');
        sellFrame.querySelectorAll('.rinsp-sell-relay-button').forEach(btn => btn.remove()); // remove any existing relay button and recreate again
        const relayButton = newElem('input', 'btn btn-danger rinsp-sell-relay-button', { type: 'button' });
        buyButton.parentNode.insertBefore(relayButton, buyButton);
        let priceMatch = sellFrame.querySelector('.s3').textContent.match(/此帖售价 (\d+) SP币,已有 (\d+) 人购买/);
        let price = priceMatch[1] * 1;
        if (userConfig.enhanceSellFrame) {
            if (price === 0) {
                relayButton.setAttribute('value', '免费');
                sellFrame.classList.add('rinsp-sell-free');
            } else if (price <= 5) {
                relayButton.setAttribute('value', `愿意购买, 售价 ${price} SP`);
                sellFrame.classList.add('rinsp-sell-5');
            } else if (price <= 100) {
                relayButton.setAttribute('value', `警告: 高额 ${price} SP 出售 (欢迎举报)`);
                sellFrame.classList.add('rinsp-sell-100');
            } else if (price >= 99999) {
                relayButton.setAttribute('value', '只楼主可见');
                sellFrame.classList.add('rinsp-sell-99999');
            } else {
                relayButton.setAttribute('value', `警告: 高额 ${price} SP 出售 (欢迎举报)`);
                sellFrame.classList.add('rinsp-sell-high');
            }
        } else {
            relayButton.setAttribute('value', buyButton.getAttribute('value'));
        }
        relayButton.addEventListener('click', evt => {
            evt.stopPropagation();
            if (price >= 99999) {
                return false;
            } else if (price > 5) {
                if (!confirm('高额出售 确认购买？')) {
                    return false;
                }
            }
            if (userConfig.buyRefreshFree) {
                relayButton.classList.add('rinsp-sell-buying');
                try {
                    const handled = executeBackgroundBuy(tpc, triggerRefresh);
                    if (handled) {
                        return false;
                    }
                } catch (err) {
                    console.error('exception when handling buy', err);
                }
            }
            // if failed, fallback to execute original buy action
            buyButton.click();
            return false;
        });
    });
}

function executeBackgroundBuy(tpc, triggerRefresh) {
    const pm = getPostMetadata(tpc);
    if (pm == null) {
        return false;
    }
    const {tid, uid, pid} = pm;
    const contentHref = `${document.location.origin}/read.php?tid-${tid}-uid-${uid}.html`; // one page should be enough to find the bought post
    const sellframes = [];
    tpc.querySelectorAll('.quote.jumbotron + blockquote').forEach(el => {
        el.innerHTML = '正在购买 ...';
        sellframes.push(el);
    });
    tpc.querySelectorAll('.quote.jumbotron').forEach(el => {
        el.innerHTML = '';
    });

    async function run() {
        let feedbackPage;
        while (true) {
            feedbackPage = await fetch(`${document.location.origin}/job.php?action=buytopic&tid=${tid}&pid=${pid}&verify=${verifyhash()}`, {
                method: 'GET',
                mode: 'same-origin',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(resp => resp.text());
            if (feedbackPage.indexOf('刷新不要快于') === -1) {
                break;
            }
            await sleep(1000);
        }
        if (feedbackPage.match(/>\s*操作完成\s*</)) {
            let html;
            while (true) {
                await sleep(1000);
                html = await fetch(contentHref, {
                    method: 'GET',
                    mode: 'same-origin',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(resp => resp.text());
                if (html.indexOf('刷新不要快于') === -1) {
                    break;
                }
            }
            const doc = new DOMParser().parseFromString(html, 'text/html');
            let purchasedContent = doc.querySelector('#read_' + pid);
            if (purchasedContent) {
                const oldContent = document.querySelector('#read_' + pid);
                oldContent.parentNode.replaceChild(purchasedContent, oldContent);
            } else {
                throw Error('content outdated');
            }
        } else {
            const title = feedbackPage.match(/<title>([^-<]+)/);
            if (title) {
                const reason = title[1].trim();
                sellframes.forEach(el => {
                    el.classList.add('rinsp-buy-failed');
                    el.textContent = reason;
                });
            }
        }
        triggerRefresh();
    }
    run().catch(e => {
        console.info('buy-refresh-free ERR', e);
        window.location.reload();
    });
    return true;
}

function autoCheckReply() {
    let cb = document.querySelector('form[action="post.php?"] input[name="atc_newrp"]');
    if (cb) {
        cb.checked = true;
    }
}

async function addUserPinArea(pinnedUsersConfigAccess, hideInactivePinnedUsers, showResourceSpotsFloating) {
    document.addEventListener('click', evt => {
        if (evt.target && evt.target.classList.contains('rinsp-button-placeholder-pinuser')) {
            const uid = evt.target.dataset.uid * 1;
            const nickName = evt.target.dataset.nickname;
            const img = evt.target.dataset.img;
            if (pinnedUsers.has(uid)) {
                unwatchUser(uid);
            } else {
                watchUser(uid, nickName, img);
            }
        }
    });

    const pinMain = addElem(document.body, 'div', 'rinsp-pinuser-main');
    let spotsMain = null;
    if (showResourceSpotsFloating) {
        spotsMain = addElem(document.body, 'div', 'rinsp-spots-main');
    }
    let spotsBar = null;
    const threadHeaderAnchor = document.querySelector('#main > .h2 > .fr.w');
    if (threadHeaderAnchor) {
        const targetControlBar = threadHeaderAnchor.parentNode;
        targetControlBar.classList.add('rinsp-thread-header');
        spotsBar = newElem('div', 'rinsp-spots-bar');
        targetControlBar.insertBefore(spotsBar, targetControlBar.childNodes[0]);
    }

    let updateListeners = [];
    const pinnedUsers = new Map([[0, null]]); // 0 entry marks it out of date
    const localWatchUsers = new Map();
    const locationHighlights = [];

    async function update(notifyListeners) {
        if (pinnedUsers.has(0)) {
            const pinnedUsersConfig = await pinnedUsersConfigAccess.read();
            pinnedUsers.clear();
            Object.values(pinnedUsersConfig.users).forEach(record => {
                pinnedUsers.set(record.uid, record);
            });
        }
        pinMain.innerHTML = '';
        if (spotsMain) {
            spotsMain.innerHTML = '';
        }
        if (spotsBar) {
            spotsBar.innerHTML = '';
        }
        function createSpotButton(spot) {
            let locButton = newElem('a', null, { href: spot.href||'javascript:', target: '_blank' });
            if (spot.floor != null) {
                const flootLabel = spot.floor === 0 ? 'GF' : '' + spot.floor + 'F';
                addElem(locButton, 'span', 'rinsp-spot-floor').textContent = flootLabel;
            }
            const pair = spot.type.split(':', 2);
            addElem(locButton, 'span', 'rinsp-spot-icon').textContent = pair[0];
            addElem(locButton, 'span', 'rinsp-spot-label').textContent = pair[1];
            locButton.addEventListener('click', evt => {
                evt.preventDefault();
                let alignment = spot.alignment||'center';
                if (alignment === 'center') {
                    let diff = spot.elem.getBoundingClientRect().height - window.screen.availHeight;
                    if (diff > window.screen.availHeight / 3) { // if target is larger than 2/3 of the screen, align top
                        alignment = 'start';
                    }
                }
                if (alignment === 'start') {
                    window.scrollTo({
                        behavior: 'smooth',
                        top: spot.elem.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 50
                    });
                } else {
                    spot.elem.scrollIntoView({
                        behavior: 'smooth',
                        block: alignment
                    });
                }
            });
            return locButton;
        }
        if (locationHighlights.length > 0) {
            if (spotsMain) {
                const list = addElem(spotsMain, 'div', 'rinsp-highlight-spots');
                addElem(list, 'b').textContent = '焦点';
                const dl = addElem(list, 'dl');
                locationHighlights.forEach(spot => {
                    let locItem = addElem(dl, 'dt');
                    locItem.appendChild(createSpotButton(spot));
                });
            }
            if (spotsBar) {
                locationHighlights.forEach(spot => {
                    spotsBar.appendChild(createSpotButton(spot));
                });
            }
        }
        const timeComparator = comparator('time');
        const pinnedRecords = Array.from(pinnedUsers.values()).filter(record => !hideInactivePinnedUsers || record.locations && record.locations.length > 0).sort(timeComparator);
        if (pinnedRecords.length + localWatchUsers.size > 0) {
            const list = addElem(pinMain, 'div', 'rinsp-pinuser-list');
            if (pinnedRecords.length > 0) {
                addElem(list, 'b').textContent = '焦点人物';
                const listitems = addElem(list, 'div');
                pinnedRecords.forEach(record => {
                    renderUserRecord(listitems, record);
                });
            }
            if (localWatchUsers.size > 0) {
                addElem(list, 'b').textContent = '活跃人物';
                const listitems = addElem(list, 'div');
                Array.from(localWatchUsers.values())
                    .sort((x, y) => {
                        const xc = (x.locations||[]).length;
                        const yc = (y.locations||[]).length;
                        if (xc > yc)
                            return -1;
                        if (xc < yc)
                            return 1;
                        return timeComparator(x, y);
                    })
                    .forEach(record => {
                        renderUserRecord(listitems, record);
                    });
            }
        }
        if (notifyListeners) {
            updateListeners.forEach(listener => {
                listener();
            });
        }

        function renderUserRecord(parent, record) {
            const item = addElem(parent, 'div', 'rinsp-pinuser-item');
            const face = addElem(item, 'div', 'rinsp-pinuser-item-face');
            const locs = addElem(item, 'dl', 'rinsp-pinuser-item-locs');

            const img = addElem(face, 'img', null, { src: record.img });
            const isDefaultImg = record.img == null || record.img.startsWith('images/face/');
            const label = addElem(face, 'div');
            addElem(label, 'a', null, { href: `u.php?action-show-uid-${record.uid}.html`, target: '_blank' }).textContent = record.nickName||`#${record.uid}`;
            const unpin = addElem(label, 'div', 'rinsp-pinuser-unpin-icon');
            unpin.addEventListener('click', () => {
                unwatchUser(record.uid);
            });
            const locCount = record.locations ? record.locations.length : 0;
            if (locCount > 0) {
                const locButtons = [];
                for (let loc of record.locations) {
                    let locItem = addElem(locs, 'dt', loc.style ? 'rinsp-pinuser-loc-' + loc.style : null);
                    let locButton = addElem(locItem, 'a', null, { href: 'javascript:' });
                    locButton.textContent = loc.label;
                    locButton.addEventListener('click', loc.action);
                    locButtons.push(locButton);
                }
                let lastIndex = -1;
                img.addEventListener('click', () => {
                    lastIndex += 1;
                    if (lastIndex >= locButtons.length) {
                        lastIndex = 0;
                    }
                    locButtons[lastIndex].click();
                });
                if (isDefaultImg) {
                    const estHeight = Math.max(locCount * 14, 32);
                    if (estHeight < 100) {
                        img.setAttribute('style', `max-height:${estHeight}px; object-fit:contain;background:#FFF`);
                    }
                }
            } else {
                item.classList.add('rinsp-pinuser-item-absent');
            }
        }

    }

    async function unwatchUser(uid) {
        await pinnedUsersConfigAccess.update(function(updatingPinnedUsersConfig) {
            delete updatingPinnedUsersConfig.users['#' + uid];
            // clean up corrupt data ...
            delete updatingPinnedUsersConfig.users['#NaN'];
            delete updatingPinnedUsersConfig.users['#null'];
            return updatingPinnedUsersConfig;
        });
        pinnedUsers.set(0, null);
        await update(true);
    }

    async function watchUserLocally(uid, nickName, img) {
        if (pinnedUsers.has(uid)) {
            return;
        }
        localWatchUsers.set(uid, {
            uid, nickName, img, time: Date.now(), locations: []
        });
    }

    async function watchUser(uid, nickName, img) {
        await pinnedUsersConfigAccess.update(function(updatingPinnedUsersConfig) {
            updatingPinnedUsersConfig.users['#' + uid*1] = {
                uid, nickName, img, time: Date.now(), locations: []
            };
            return updatingPinnedUsersConfig;
        });
        pinnedUsers.set(0, null);
        await update(true);
    }

    function guessInterestingContent(text, spotsFilter) {
        const textLower = text.toLowerCase();
        if (spotsFilter.shares) {
            if (textLower.indexOf('pan.baidu.com/') != -1) {
                return '📂:分享 (度盘)';
            }
            if (textLower.indexOf('pan.quark.cn/') != -1) {
                return '📂:分享 (夸克)';
            }
            if (textLower.indexOf('/mypikpak.com/s/') != -1) {
                return '📂:分享 (PP)';
            }
            if (textLower.indexOf('://mega.nz/') != -1) {
                return '📂:分享 (MEGA)';
            }
            if (textLower.indexOf('/drive.google.com/') != -1) {
                return '📂:分享 (谷歌)';
            }
            if (textLower.indexOf('/1drv.ms/f/s!') != -1 ||
                textLower.match(/:\/\/[a-zA-Z-]+\.sharepoint\.com\/:/) ||
                textLower.indexOf('-my.sharepoint.com/:') != -1) {
                return '📂:分享 (OD)';
            }
            if (textLower.indexOf('.lanzoub.com') != -1 ||
                textLower.indexOf('/share.weiyun.com/') != -1 ||
                textLower.indexOf('.aliyundrive.com') != -1 ||
                textLower.indexOf('.123pan.com/') != -1 ||
                textLower.indexOf('pan.xunlei.com/') != -1 ||
                textLower.indexOf('cowtransfer.com/s/') != -1 ||
                textLower.indexOf('/files.catbox.moe/') != -1 ||
                textLower.indexOf('/litter.catbox.moe/') != -1 ||
                textLower.indexOf('/pixeldrain.com/l/') != -1 ||
                textLower.indexOf('/pixeldrain.com/u/') != -1 ||
                textLower.indexOf('/gofile.io/d/') != -1 ||
                textLower.indexOf('/uploadhaven.com/download/') != -1 ||
                textLower.indexOf('/racaty.com/') != -1 ||
                textLower.indexOf('.swisstransfer.com/d/') != -1 ||
                textLower.indexOf('.gigafile.nu/') != -1 ||
                textLower.indexOf('/sakuradrive.com/s/') != -1 ||
                textLower.indexOf('/dogpan.com/s/') != -1) {
                return '📂:分享';
            }
            if (textLower.match(/https?:\/\/([a-z0-9]+\.)?[a-z0-9]+\.(com|net|io)\/s\//)) {
                return '📂:分享';
            }
            if (textLower.match(/(?:[^a-zA-Z0-9]|^)(?:bafy[a-z0-9]{55}|Qm[A-Za-z0-9]{44})(?:[^a-zA-Z0-9]|$)/)) {
                return '🧲:ipfs';
            }
            if (textLower.indexOf('magnet:?') != -1) {
                return '🧲:磁链';
            }
            if (textLower.indexOf('ed2k://') != -1) {
                return '🧲:ed2k';
            }
            if (textLower.indexOf('thunder://') != -1) {
                return '🧲:迅雷';
            }
            if (textLower.indexOf('/jmj.cc/s/') != -1 ||
                textLower.indexOf('.feimaoyun.com/') != -1 ||
                textLower.indexOf('/rosefile.net/') != -1 ||
                textLower.indexOf('.xun-niu.com/file-') != -1 ||
                textLower.indexOf('.xunniu-pan.com/file-') != -1) {
                return '💲:网赚盘';
            }
        }
    }

    async function offerPostContent(post, spotsFilter, likePatternMatcher) {
        if (spotsFilter.likes && likePatternMatcher) {
            scanTextualContent(childText => {
                const matches = likePatternMatcher.match(childText.toLowerCase());
                if (matches.size > 0) {
                    return '💚:' + Array.from(matches)[0];
                } else {
                    return null;
                }
            });
        }

        if (spotsFilter.sells) {
            const sellArea = post.contentElem.querySelector('.quote.jumbotron > .s3 + .btn-danger');
            if (sellArea) {
                const jumbotron = sellArea.closest('.jumbotron');
                let type = '💰:出售框';
                if (jumbotron.classList.contains('rinsp-sell-99999')) {
                    type = '🔒:密享';
                }
                locationHighlights.push({
                    floor: post.floor,
                    type: type,
                    elem: jumbotron
                });
                return;
            }
        }

        const found = scanTextualContent(childText => guessInterestingContent(childText, spotsFilter));
        if (found) {
            return;
        }

        let links = post.contentElem.querySelectorAll('a[href]:not(.rinsp-subject-floor-link)');
        for (let link of links) {
            let hit = guessInterestingContent(link.getAttribute('href'), spotsFilter);
            if (hit) {
                locationHighlights.push({
                    floor: post.floor,
                    type: hit,
                    elem: link
                });
                return;
            }
        }

        if (spotsFilter.images) {
            for (let img of post.contentElem.closest('.tpc_content').querySelectorAll('img[src],img[data-rinsp-defer-src]')) {
                let src = getImgSrc(img);
                if (src.startsWith('images/')) {
                    continue; // skip default emotions
                }
                if (!img.classList.contains('rinsp-img-loading') && img.naturalWidth > 0 && img.naturalHeight > 0 && img.naturalWidth < 64 && img.naturalHeight < 64) {
                    continue; // skip tiny images
                }
                locationHighlights.push({
                    floor: post.floor,
                    type: '🖼️:图片',
                    elem: img,
                    alignment: 'start'
                });
                return;
            }
            for (let link of links) {
                let href = link.getAttribute('href');
                if (href.match(/\.(png|jpg|jpeg|gif|avif|webp)$/)) {
                    locationHighlights.push({
                        floor: post.floor,
                        type: '🖼️:图片',
                        elem: link,
                        alignment: 'start'
                    });
                    return;
                }
            }
        }


        if (spotsFilter.attachments) {
            const attFile = post.rootElem.querySelector('a[href^="job.php?action-download-"]');
            if (attFile) {
                locationHighlights.push({
                    floor: post.floor,
                    type: '📄:附件',
                    elem: attFile
                });
                return;
            }
        }

        if (spotsFilter.sells) {
            const sellArea = post.contentElem.querySelector('h6.quote.jumbotron + blockquote.jumbotron');
            if (sellArea) {
                let type;
                if (sellArea.textContent.startsWith('若发现会员采用欺骗的方法获取财富')) {
                    type = '💰:出售框';
                } else {
                    type = '✔️:已购买';
                }

                locationHighlights.push({
                    floor: post.floor,
                    type: type,
                    elem: sellArea
                });
                return;
            }
        }

        if (spotsFilter.links) {
            for (let link of links) {
                if (link.querySelector('img') == null || link.textContent.length > 0) {
                    locationHighlights.push({
                        floor: post.floor,
                        type: '🔗:链接',
                        elem: link
                    });
                    return;
                }
            }
        }

        function scanTextualContent(handler) {
            let lastNode = null;
            for (let childNode of post.contentElem.childNodes) {
                let childText;
                if (childNode.nodeType === 3) {
                    childText = childNode.textContent.trim();
                } else if (childNode.nodeType === 1) {
                    childText = childNode.textContent.trim();
                    lastNode = childNode;
                }
                if (childText) {
                    let hit = handler(childText, spotsFilter);
                    if (hit) {
                        if (lastNode) {
                            locationHighlights.push({
                                floor: post.floor,
                                type: hit,
                                elem: lastNode
                            });
                        } else {
                            locationHighlights.push({
                                floor: post.floor,
                                type: hit,
                                elem: post.rootElem,
                                alignment: 'start'
                            });
                        }
                        return true;
                    }
                }
            }
            return false;
        }

    }

    await update();
    return {
        addUpdateListener(listener) {
            updateListeners.push(listener);
        },
        fireUpdateListeners() {
            updateListeners.forEach(listener => {
                listener();
            });
        },
        getWatchCount() {
            return pinnedUsers.size + localWatchUsers.size;
        },
        isPinned(uid) {
            return pinnedUsers.has(uid);
        },
        getPinned(uid) {
            const record = pinnedUsers.get(uid);
            if (record) {
                return {
                    uid: uid,
                    nickName: record.nickName,
                    img: record.img
                };
            } else {
                return null;
            }
        },
        isWatching(uid) {
            return pinnedUsers.has(uid) || localWatchUsers.has(uid);
        },
        clearState() {
            for (let record of pinnedUsers.values()) {
                record.locations = [];
            }
            localWatchUsers.clear();
            locationHighlights.length = 0;
        },
        addLocation(uid, label, locClass, action) {
            let record = pinnedUsers.get(uid);
            if (record == null) {
                record = localWatchUsers.get(uid);
            }
            if (record) {
                record.locations.push({ label, style: locClass, action });
            }
        },
        unwatchUser,
        watchUser,
        watchUserLocally,
        offerPostContent,
        addLocationHighlight(floor, type, elem, href) {
            locationHighlights.push({
                floor,
                type,
                elem,
                href
            });
        },
        update
    };
}

const TITLE_SPLIT_PATTERN = /[\u3000-\u303F（）/:,\s\[\]\{\}\(\)\\\/<>\u00A0➕\+]+|(?<![妙秒喵])[轉传]|原档|原檔|分享|下载|下載|长期|長期|直[链连連]接?|(?<![妙秒喵])[链连連]接?|[网網云雲][盘盤]|[盘盤云雲]|有效期?|(?<![0-9a-z])\d+(?:\.\d{1,2})?(?:[GMKT](?:i?B)?)|(?<![0-9a-z])\d{1,3}(?:[日天]|个?月)/i;
const SHARE_TYPES = [
    {
        name: '度盘',
        pattern: /(?:百?度(?:[标標][准準])?[长長短]?[盘盤云雲链连連]|百?度娘|毒[盘盤云雲链连連]|[妙秒喵][传傳链连連])+|^(?:bd|百度)$/i,
    },
    {
        name: 'OD',
        pattern: /(?:onedrive|one drive|微软盘)|^(?:OD|微软)$/i,
    },
    {
        name: 'Google盘',
        pattern: /(?:GoogleDrive|Google Drive)|(?:GD|Google|谷歌)$/i,
    },
    {
        name: 'MEGA',
        pattern: /(?:mega|mg)[盘盤云雲]|^(?:mega|mg)$/i,
    },
    {
        name: '樱盒',
        pattern: /(?:樱花?[盒盘盤云雲])|^(?:樱花)$/i,
    },
    {
        name: '微云',
        pattern: /(?:微[云雲][盘盤]?)/,
    },
    {
        name: '移动云',
        pattern: /(?:移动[云雲][盘盤]?)/,
    },
    {
        name: '夸克',
        pattern: /(?:夸克|Quack|夸[盘盤云雲])/,
    },
    {
        name: '阿里云',
        pattern: /(?:阿里|aliyun|aliyundrive)[网網]?[盘盤云雲]?|ali[网網]?[盘盤云雲]|^(?:阿里|aliyun|ali)$/i,
    },
    {
        name: 'mediafire',
        pattern: /^(?:mediafire)$/i,
    },
    {
        name: 'ipfs',
        pattern: /^(?:ipfs)$/i,
    },
    {
        name: 'BT',
        pattern: /^(?:磁[力链鏈]|bt|bittorrent|torrent)$/i,
    },
    {
        name: 'TERABOX',
        pattern: /(?:terabox)/i,
    },
    {
        name: 'catbox',
        pattern: /(?:catbox|[猫喵][猫喵]?盒)/i,
    },
    {
        name: 'PikPak',
        pattern: /(?:pikpak|p[网網]?[盘盤云雲])|^(?:pp)$/i,
    },
    {
        name: 'pixeldrain',
        pattern: /(?:pixeldrain)|^(?:pd)$/i,
    },
    {
        name: 'gofile',
        pattern: /(?:gofile)/i,
    },
    {
        name: '115',
        pattern: /^(?:ed2k|115ed2k|115)$/i,
    },
    {
        name: 'RF',
        pattern: /(?:rosefile)|^(?:RF)$/i,
    },
    {
        name: '飛猫',
        pattern: /^(?:飛[猫喵]|FM)$/i,
    },
    {
        name: '迅牛',
        pattern: /^(?:迅牛|XN)$/i,
    },
    {
        name: '不明',
        pattern: /^(?:多空|多[盘盤])$/,
    },
];
const SHARE_TYPES_MIXED_SPLIT_PATTERNS = /(bd|od|gd|mg)/i;
const SHARE_UNKNOWN_NAME = '不明';

async function addShareTypeFilterArea(target, sharetypeFilterConfigAccess) {
    let updateListeners = [];
    const controlBlock = addElem(target, 'div', 'rinsp-sharetype-filter');
    const states = new Map();
    const sharetypeFilterConfig = await sharetypeFilterConfigAccess.read();
    SHARE_TYPES.map(shareTypeDef => shareTypeDef.name).forEach(shareType => {
        const toggler = addElem(controlBlock, 'div', 'rinsp-sharetype-item');
        toggler.textContent = shareType;
        const model = {
            count: 0,
            toggler,
            disabled: sharetypeFilterConfig.hides.indexOf(shareType) !== -1
        };
        states.set(shareType, model);
        toggler.addEventListener('click', async () => {
            model.disabled = !model.disabled;
            sharetypeFilterConfigAccess.update(function(updatingSharetypeFilterConfigAccess) {
                const set = new Set(updatingSharetypeFilterConfigAccess.hides||[]);
                if (model.disabled) {
                    set.add(shareType);
                } else {
                    set.delete(shareType);
                }
                updatingSharetypeFilterConfigAccess.hides = Array.from(set);
                return updatingSharetypeFilterConfigAccess;
            });
            update(true);
        });
    });
    const clearButton = addElem(controlBlock, 'img', 'rinsp-sharetype-filter-clear', { src: '/images/close.gif'});
    clearButton.addEventListener('click', async () => {
        states.forEach(model => {
            model.disabled = false;
        });
        sharetypeFilterConfigAccess.update(function(updatingSharetypeFilterConfigAccess) {
            updatingSharetypeFilterConfigAccess.hides = [];
            return updatingSharetypeFilterConfigAccess;
        });
        update(true);
    });

    async function update(notifyListeners) {
        let disabledCount = 0;
        states.forEach(state => {
            state.toggler.setAttribute('count', state.count);
            state.toggler.setAttribute('disabled', state.disabled ? '1' : '0');
            if (state.disabled) {
                disabledCount++;
            }
        });
        if (notifyListeners) {
            updateListeners.forEach(listener => {
                listener();
            });
        }
        clearButton.setAttribute('disabled', disabledCount === 0 ? '1' : '0');
    }

    await update();
    return {
        addUpdateListener(listener) {
            updateListeners.push(listener);
        },
        clearState() {
            states.forEach(entry => entry.count = 0);
        },
        addAndAcceptThread(tid, title) {
            const shares = [];
            const parts = title.split(TITLE_SPLIT_PATTERN);
            parts.push(title);
            nextpart:
            for (let part of parts) {
                for (let shareTypeDef of SHARE_TYPES) {
                    if (part.match(shareTypeDef.pattern)) {
                        shares.push(shareTypeDef.name);
                        continue nextpart;
                    }
                }
                if (title.length > part.length) {
                    const splits = part.split(SHARE_TYPES_MIXED_SPLIT_PATTERNS);
                    if (splits.length > 1) {
                        for (let i = 0; i < splits.length; i += 2) {
                            if (splits[i]) { // any additional content between known share names invalidates the whole part
                                continue nextpart;
                            }
                        }
                        nextsubpart:
                        for (let i = 1; i < splits.length; i += 2) {
                            for (let shareTypeDef of SHARE_TYPES) {
                                if (splits[i].match(shareTypeDef.pattern)) {
                                    shares.push(shareTypeDef.name);
                                    continue nextsubpart;
                                }
                            }
                        }
                    }
                }
            }
            if (shares.length === 0) {
                shares.push(SHARE_UNKNOWN_NAME);
            }

            let accepted = false;
            shares.forEach(shareType => {
                const entry = states.get(shareType);
                entry.count++;
                if (!entry.disabled) {
                    accepted = true;
                }
            });
            return accepted;
        },
        update
    };
}

function readEnhanceUserInfoMap(myUserId, userConfig) {
    let map = new Map();
    document.querySelectorAll('.r_two .user-info > .user-infoWrap > .c + .f12').forEach(function(uidCell) {
        let uid = uidCell.textContent.trim() * 1;
        const img = uidCell.closest('.r_two').querySelector(`.user-pic a[href="u.php?action-show-uid-${uid}.html"] > img`);
        let imgSrc = null;
        if (img) {
            imgSrc = getImgSrc(img);
        }
        let infoWrap = uidCell.closest('.user-infoWrap');
        let infoText = infoWrap.textContent;
        let nickName = ((infoText.match(/\s昵称: *([^\r\n]+)在线时间/)||[])[1]||'').trim()||'';
        let unnamed = !!infoText.match(/昵称:\s*在线时间/);

        let m = infoText.match(/\s发帖: (\d+)\s+HP: (-?\d+) 点\s+SP币: (-?\d+) G\s+.*\s+在线时间: (\d+)\(小时\)\s+注册时间: (\d{4}-\d{2}-\d{2})\s*最后登录: (\d{4}-\d{2}-\d{2})\s/);
        let data = {
            post: m[1] * 1,
            hp: m[2] * 1,
            sp: m[3] * 1,
            online: m[4] * 1,
            register: m[5],
            login: m[6],
            img: imgSrc,
            nickName,
            unnamed
        };
        map.set(uid, data);

        if (userConfig.useCustomUserInfoPopup && infoWrap.querySelector('.listread > .rinsp-user-popup-action-list') == null) {
            const actionList = infoWrap.querySelector('.listread > ul');
            const actionItems = actionList.querySelectorAll('li');
            const newActionList = addElem(actionList.parentElement, 'ul', 'rinsp-user-popup-action-list');

            // read profile
            actionItems[0].querySelector('a').setAttribute('target', '_blank');
            newActionList.appendChild(actionItems[0]);

            if (myUserId !== uid) {
                // send mail
                const mailToItem = addElem(newActionList, 'li', 'rinsp-user-popup-action-mailto', { title: '发短消息' });
                addElem(mailToItem, 'a', null, { target: '_blank', href: `message.php?action-write-touid-${uid}.html` }).innerHTML = '<div></div>';
            }

            // show topics
            const showTopicItem = addElem(newActionList, 'li', 'rinsp-user-popup-action-topics', { title: '主题列表' });
            addElem(showTopicItem, 'a', null, { target: '_blank', href: `u.php?action-topic-uid-${uid}.html` }).innerHTML = '<div></div>';
   
            if (myUserId !== uid) {
                // add friend (and add confirmation)
                const addFriendAction = actionItems[2].querySelector('a');
                addFriendAction.setAttribute('onclick', "if (confirm('加为好友 ?')) " + addFriendAction.getAttribute('onclick'));
                newActionList.appendChild(actionItems[2]);
            }

            // show topics
            const pinUserItem = addElem(newActionList, 'li', 'rinsp-user-popup-action-pinuser', { title: '设为焦点' });
            const pinButton = addElem(pinUserItem, 'a', null, { href: 'javascript:' });
            const dataNode = addElem(pinButton, 'div', 'rinsp-button-placeholder-pinuser');
            dataNode.dataset.uid = uid;
            dataNode.dataset.nickname = nickName;
            const img = document.querySelector(`.user-pic a[href="u.php?action-show-uid-${uid}.html"] > img`);
            if (img) {
                dataNode.dataset.img = getImgSrc(img);
            }
    
            actionList.remove();
        }

    });
    return map;
}

function getCurrentPageFid() {
    const item = document.querySelector('#breadcrumbs .crumbs-item.current > strong > a[href^="thread.php?fid-"]') || Array.from(document.querySelectorAll('#breadcrumbs .crumbs-item[href^="thread.php?fid-"]')).pop() || null;
    if (item) {
        return Number.parseInt(item.getAttribute('href').substring(15));
    }
    return null;
}

function showAutoSpTaskStatus(myUserId, userConfig, mainConfigAccess) {

    const headCell = Array.from(document.querySelectorAll('td > .t > table td.h[colspan="4"]')).filter(el => el.textContent === '社区论坛任务')[0];
    if (headCell == null) {
        return;
    }
    const block = headCell.closest('.t').closest('td');

    const autoSpOptionBlock = addElem(block, 'div', null, { style: 'padding: 0.5em' });

    const labelElem = addElem(autoSpOptionBlock, 'label');
    const checkbox = addElem(labelElem, 'input', null, { type: 'checkbox' });
    checkbox.checked = !!userConfig.autoSpTasks;
    addElem(labelElem, 'span', null, { style: 'vertical-align: middle; margin-right: 0.5em' }).textContent = '自动签到 (社区论坛任务)';
    checkbox.addEventListener('change', () => {
        mainConfigAccess
            .update(updatingUserConfig => {
                updatingUserConfig.autoSpTasks = checkbox.checked;
                return updatingUserConfig;
            })
            .catch(ex => alert('' + ex))
            .then(() => document.location.reload());
    });

    if (userConfig.autoSpTasks) {
        const taskRecordAccess = initConfigAccess(myUserId, 'autosptask', {});
        const autoSpTasksSummary = addElem(autoSpOptionBlock, 'p');
        taskRecordAccess.read().then(taskRecord => {
            if (taskRecord.lastCompleteSp > 0) {
                const hr = (Date.now() - taskRecord.lastComplete) / 3600000;
                autoSpTasksSummary.textContent = `💡 ${getAgeString(hr * 60)} 已领取 ${taskRecord.lastCompleteSp||'?'} SP | 记录中总共领取 ${taskRecord.totalSp||'?'} SP`;
            }
        });
    }
}

function autoCompleteSpTasks(myUserId) {
    const taskMenuButton = document.querySelector('#guide a[href="plugin.php?H_name-tasks.html"]');
    const taskRecordAccess = initConfigAccess(myUserId, 'autosptask', {});
    async function execute() {
        const now = Date.now();
        let taskRecord = await taskRecordAccess.read();
        if ((Math.max(taskRecord.lastChecked, taskRecord.lastComplete, taskRecord.runningUntil) - now) / 3600000 > 23) {
            // if any time record is ahead of time for more than 23 hour, reset
            taskRecord = await taskRecordAccess.update(newRecord => {
                delete newRecord.lastChecked;
                delete newRecord.lastComplete;
                delete newRecord.lastCompleteSp;
                delete newRecord.runningUntil;
                return newRecord;
            });

        }

        if (taskRecord.lastComplete && now > taskRecord.lastComplete) {
            const hr = (now - taskRecord.lastComplete) / 3600000;
            if (taskMenuButton && taskRecord.lastCompleteSp > 0) {
                taskMenuButton.setAttribute('title', `${getAgeString(hr * 60)} 已领取 ${taskRecord.lastCompleteSp} SP`);
            }
            if (hr < 11) {
                // min. check interval from last completed task is 11 hour
                return;
            }
        }
        if (taskRecord.lastChecked && now > taskRecord.lastChecked && (now - taskRecord.lastChecked) < 3600000) {
            // min. check interval is 1 hour
            return;
        }

        if (taskRecord.runningUntil > now) {
            return;
        }

        await taskRecordAccess.update(newRecord => {
            newRecord.runningUntil = Date.now() + 10000; // pause other pages for 10 seconds
            return newRecord;
        });

        const newTaskDoc = await fetchGetPage(`${document.location.origin}/plugin.php?H_name-tasks.html`);
        const newTasks = await scanAndRunAllTasks(newTaskDoc, 'a[onclick^="startjob(\'"][title=按这申请此任务]', 'job');
        await taskRecordAccess.update(newRecord => {
            newRecord.runningUntil = Date.now() + 10000;
            return newRecord;
        });
        if (newTasks.length > 0) {
            await sleep(1500);
        }
        const currentTaskDoc = await fetchGetPage(`${document.location.origin}/plugin.php?H_name-tasks-actions-newtasks.html.html`);
        const completedTasks = await scanAndRunAllTasks(currentTaskDoc, 'a[onclick^="startjob(\'"][title=领取此奖励]', 'job2');
        const sp = completedTasks.reduce((acc, tk) => acc + (tk.sp||0), 0);
        await taskRecordAccess.update(newRecord => {
            const now = Date.now();
            newRecord.totalSp = (newRecord.totalSp || 0) + sp;
            newRecord.lastChecked = now;
            // if just complete a task
            if (completedTasks.length > 0) {
                newRecord.lastComplete = now;
                newRecord.lastCompleteSp = sp;
            }
            delete newRecord.runningUntil;
            return newRecord;
        });
        if (sp > 0) {
            if (taskMenuButton) {
                taskMenuButton.setAttribute('rinsp-sp-get', '' + sp);
            }
        }
        setTimeout(execute, 3600000); // 1 hour
    }
    
    async function scanAndRunAllTasks(doc, selector, actionType) {
        let completed = [];
        for (let taskButton of doc.querySelectorAll(selector)) {
            const rewardMatch = taskButton.closest('td').previousElementSibling.textContent.match(/奖励 : SP币 (\d+) G/);
            const sp = rewardMatch ? rewardMatch[1] * 1 : 0;
            const jobId = Number.parseInt(taskButton.getAttribute('onclick').substring(10));
            const taskURL = `${document.location.origin}/plugin.php?H_name=tasks&action=ajax&actions=${actionType}&cid=${jobId}&nowtime=${Date.now()}&verify=${verifyhash()}`;
            await sleep(100);
            const resp = await fetch(taskURL, {
                method: 'GET',
                mode: 'same-origin',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'text/html'
                },
                cache: 'no-cache'
            });
            if (resp.ok) {
                const xml = await resp.text();
                if (xml.indexOf('success\t')) {
                    // success
                    completed.push({sp});
                }
            }
        }
        return completed;
    }
    setTimeout(execute, 0);
}

function addSearchShortcut() {
    function createSearchButton(fid) {
        const button = newElem('a', 'rinsp-fid-search-button', { href: `search.php#prefill("fid",${fid})` });
        return button;
    }
    document.querySelectorAll('#breadcrumbs').forEach(breadcrumbs => {
        // how comes the same id used by multiple elements ...

        const currentThreadLink = breadcrumbs.querySelector('.crumbs-item.current > strong > a[href^="thread.php?fid-"]');
        if (currentThreadLink) {
            const fid = Number.parseInt(currentThreadLink.getAttribute('href').substring(15));
            currentThreadLink.closest('.crumbs-item').prepend(createSearchButton(fid));
        } else {
            const deepestThreadLink = Array.from(breadcrumbs.querySelectorAll('.crumbs-item[href^="thread.php?fid-"]')).pop();
            if (deepestThreadLink) {
                const fid = Number.parseInt(deepestThreadLink.getAttribute('href').substring(15));
                deepestThreadLink.prepend(createSearchButton(fid));
            }
        }
    });
}

function setAreaScoped(target, fid) {
    target.classList.add('rinsp-area-scoped-item');
    target.classList.add(`rinsp-area-scoped-item-${fid}`);
}

const specialAreaNames = {
    171: 'CG资源 (网赚)',
    172: '实用动画 (网赚)',
    173: '实用漫画 (网赚)',
    174: '游戏资源 (网赚)',
};

const PIC_WALL_PREF_KEY = 'rinsp:pic-wall-fids';
const LAST_AREA_FILTER_MEMORY_KEY = 'rinsp:last-filter-fid';
const REQUEST_RATE_RECORD_KEY = 'rinsp:request-rate';

function defaultAreaFilterHandler(fid) {
    const targetClass = `rinsp-area-scoped-item-${fid}`;
    document.querySelectorAll('.rinsp-area-scoped-item').forEach(item => {
        if (fid === 0 || item.classList.contains(targetClass)) {
            item.classList.remove('rinsp-area-scoped-item-hidden');
        } else {
            item.classList.add('rinsp-area-scoped-item-hidden');
        }
    });
}

function addAreaFilter(baseAreaMap, userId, filterHandler) {
    return addSectionFilter(baseAreaMap, userId, filterHandler, {
        nameMappings: specialAreaNames,
        heading: '版块分类',
        showAllLabel: '全部版块'
    });
}

function addSectionFilter(baseAreaMap, userId, filterHandler, options) {
    const areaMap = new Map(baseAreaMap);
    let basePageKey = document.location.href.replace(/(-page-\d+)?\.html$/, '');
    if (basePageKey.indexOf('-uid-') === -1) {
        basePageKey = basePageKey + '-uid-' + userId;
    }
    const specialNameMappings = options.nameMappings||{};
    Object.keys(specialNameMappings).forEach(spFid => {
        if (areaMap.get(spFid * 1)) {
            areaMap.set(spFid * 1, specialNameMappings[spFid]);
        }
    });

    let defaultFid = 0;
    let defaultFilterItem = null;
    try {
        const lastState = JSON.parse(localStorage.getItem(LAST_AREA_FILTER_MEMORY_KEY) || 'null');
        if (lastState != null && lastState.key === basePageKey) {
            areaMap.set(lastState.fid, lastState.areaName);
            defaultFid = lastState.fid;
        }
    } catch (ex) {}

    const sidePanel = document.querySelector('#u-contentside');
    sidePanel.querySelectorAll('.rinsp-area-filter-panel').forEach(el => el.remove());
    const section = addElem(sidePanel, 'div', 'rinsp-area-filter-panel');
    const heading = addElem(section, 'h5', 'u-h5');
    addElem(heading, 'span').textContent = options.heading||'分类';
    const table = addElem(section, 'table', 'u-table', { width: "100%", cellspacing: "0", cellpadding: "0", border: "0" });
    const tbody = addElem(table, 'tbody');
    const filterItems = [];
    function addFilterItem(fid, areaName) {
        const tr = addElem(tbody, 'tr');
        const td = addElem(tr, 'td', 'fav');
        const a = addElem(td, 'a', null, { href: fid > 0 ? `thread.php?fid-${fid}.html` : 'javascript:' });
        const count = addElem(td, 'span', null);
        const filterItem = {
            fid, td, areaName,
            setCount(n) {
                if (n >= 0) {
                    count.textContent = ` (${n})`;
                } else {
                    count.textContent = '';
                }
            },
            apply() {
                filterItems.forEach(item => item.td.classList.remove('current'));
                td.classList.add('current');
                filterHandler(fid);
                preserveState();
            }
        };

        if (defaultFid > 0 && defaultFid === fid) {
            defaultFilterItem = filterItem;
        }
        a.addEventListener('click', evt => {
            evt.preventDefault();
            filterItem.apply();
        });
        a.textContent = areaName;
        filterItems.push(filterItem);
        return filterItem;
    }
    const defaultAllItem = addFilterItem(0, options.showAllLabel||'全部');
    Array.from(areaMap.keys()).sort(comparator()).forEach(fid => {
        addFilterItem(fid, areaMap.get(fid));
    });

    if (defaultFilterItem) {
        defaultFilterItem.td.classList.add('current');
    } else {
        defaultAllItem.td.classList.add('current');
    }

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            preserveState();
        }
    });

    function getCurrentOption() {
        return filterItems.find(item => item.td.classList.contains('current'));
    }
    function preserveState() {
        const current = getCurrentOption();
        if (current && current.fid) {
            const data = { key: basePageKey, fid: current.fid, areaName: current.areaName };
            localStorage.setItem(LAST_AREA_FILTER_MEMORY_KEY, JSON.stringify(data));
        } else {
            localStorage.removeItem(LAST_AREA_FILTER_MEMORY_KEY);
        }
    }

    return {
        apply() {
            const current = getCurrentOption();
            if (current) {
                current.apply();
            }
        },
        getCurrentFid() {
            const current = getCurrentOption();
            return current ? current.fid : 0;
        },
        updateCounts(counts) {
            let total = 0;
            filterItems.forEach(filterItem => {
                if (filterItem.fid === 0) {
                    return;
                }
                const n = counts.get(filterItem.fid);
                filterItem.setCount(n);
                total += n;
            });
            defaultAllItem.setCount(total);
        }
    };
}

async function enhanceFrontPage(userConfig, mainConfigAccess) {
    const cell = document.querySelector('#main > .t > table > tbody > .tr2 > td:last-child > .b');
    if (cell == null || cell.textContent !== '提问求物') {
        return;
    }
    const tbody = cell.closest('tbody');
    const itemRow = tbody.querySelector('.tr3');
    const closeIcon = addElem(cell.parentNode, 'a', 'closeicon fr', { style: 'cursor: pointer' });
    const closeImg = addElem(closeIcon, 'img', null);
    let collapsed = !!userConfig.hideFrontPageRecentList;
    function update() {
        if (collapsed) {
            closeImg.setAttribute('src', 'images/colorImagination/index/cate_open.gif');
            itemRow.setAttribute('style', 'display: none');
        } else {
            closeImg.setAttribute('src', 'images/colorImagination/index/cate_fold.gif');
            itemRow.setAttribute('style', '');
        }
    }
    update();
    closeIcon.addEventListener('click', async () => {
        mainConfigAccess
            .update(function(updatingUserConfig) {
                collapsed = !collapsed;
                updatingUserConfig.hideFrontPageRecentList = collapsed;
                return updatingUserConfig;
            })
            .finally(() => update(collapsed));
    });

    let targets = {
        '最新讨论': '/thread.php?fid=9&page=1',
        '最新回复': '/thread.php?fid-9.html',
        '同人音声': '/thread.php?fid-128.html',
        '提问求物': '/thread.php?fid-48.html'
    };

    tbody.querySelectorAll('.tr2 > td > .b').forEach(el => {
        const label = el.textContent.trim();
        let target = targets[label];
        if (target) {
            el.textContent = '';
            addElem(el, 'a', null, { href: target }).textContent = label;
        }
    });
}

const cachedLastAccessRecords = new Map();
async function enrichThreadTitle(tid, tLink, myUserId, userConfig, threadHistoryAccess) {
    if (threadHistoryAccess == null) {
        return;
    }
    let prefix;
    if (tLink.textContent.endsWith(' ..')) {
        prefix = tLink.textContent.substring(0, tLink.textContent.length - 3).replace(/&?n?b?s?p?;?$/, '').trim();
    } else {
        prefix = tLink.textContent.trim();
    }
    function handleLastAccessRecord(lastAccessRecord, fromCache) {
        if (lastAccessRecord && lastAccessRecord.fid === QUESTION_AND_REQUEST_AREA_ID && userConfig.requestThreadUseHistoryData) {
            tLink.parentElement.querySelectorAll('.rinsp-thread-bounty-status').forEach(el => el.remove());
            const bountySummary = newElem('span', 'rinsp-thread-bounty-status');
            tLink.parentElement.insertBefore(bountySummary, tLink);
            const age = getAgeString((Date.now() - lastAccessRecord.time) / 60000);
            bountySummary.setAttribute('title', `记录时间: ${age}`);
            if (lastAccessRecord.uid === myUserId) {
                bountySummary.classList.add('rinsp-thread-bounty-status-own');
            }
            if (lastAccessRecord.bounty) {
                if (lastAccessRecord.bounty.ended > 0) {
                    if (lastAccessRecord.bounty.winner || lastAccessRecord.bounty.ended === 2) {
                        if (lastAccessRecord.bounty.winner === userConfig.myUserHashId) {
                            bountySummary.classList.add('rinsp-thread-bounty-status-won');
                        } else {
                            bountySummary.classList.add('rinsp-thread-bounty-status-ended');
                        }
                    } else {
                        bountySummary.classList.add('rinsp-thread-bounty-status-expired');
                    }
                } else {
                    bountySummary.classList.add('rinsp-thread-bounty-status-ongoing');
                }
                const baseBounty = lastAccessRecord.bounty.sp;
                const extraBounty = parseSpAmount(lastAccessRecord.title);
                if (extraBounty > baseBounty) {
                    addElem(bountySummary, 'span').textContent = `${baseBounty}+${extraBounty}`;
                } else {
                    addElem(bountySummary, 'span').textContent = `${baseBounty}`;
                }
    
            } else {
                bountySummary.classList.add('rinsp-thread-bounty-status-unknown');
            }
        }
    
        if (lastAccessRecord && lastAccessRecord.title.startsWith(prefix)) {
            tLink.textContent = lastAccessRecord.title;
            tLink.parentElement.querySelectorAll('.rinsp-thread-populate-button').forEach(el => el.remove());
            if (lastAccessRecord.initialTitle && lastAccessRecord.initialTitle !== lastAccessRecord.title) {
                if (userConfig.showInitialRememberedTitle) {
                    tLink.classList.add('rinsp-thread-title-replaced');
                    addElem(tLink, 'div', 'rinsp-thread-initial-title').textContent = lastAccessRecord.initialTitle;
                } else {
                    tLink.setAttribute('title', '原始标题: ' + lastAccessRecord.initialTitle);
                }
            }
    
        } else if (fromCache) {
            // skip modification
        } else if (tLink.textContent.endsWith(' ..') && tLink.parentElement.querySelector('.rinsp-thread-populate-button') == null) {
            const expander = newElem('a', 'rinsp-thread-populate-button', { href: 'javascript:'} );
            expander.textContent = '展开';
            tLink.parentElement.insertBefore(expander, tLink.nextElementSibling);
            expander.addEventListener('click', async () => {
                if (expander.getAttribute('href') == null) {
                    return;
                }
                expander.removeAttribute('href');
                expander.textContent = '⌛';
                try {
                    await populateThreadAccess(tid, myUserId, threadHistoryAccess);
                    const updatedAccessRecord = await threadHistoryAccess.recentAccessStore.get(tid);
                    if (updatedAccessRecord) {
                        tLink.textContent = updatedAccessRecord.title;
                    }
                    expander.remove();
                } catch (e) {
                    expander.textContent = '⚠️';
                }
            });
        }
    }
    let lastAccessRecord = cachedLastAccessRecords.get(tid);
    if (lastAccessRecord) {
        handleLastAccessRecord(lastAccessRecord, true); // purely to avoid flash-of-content when refreshed
    }
    lastAccessRecord = await threadHistoryAccess.recentAccessStore.get(tid);
    if (lastAccessRecord) {
        cachedLastAccessRecords.set(tid, lastAccessRecord);
    }
    handleLastAccessRecord(lastAccessRecord, false);
}

function isAlpha(c) {
    return c >= 'a' && c <= 'z';
}
function isNumeric(c) {
    return c >= '0' && c <= '9';
}

function createKeywordMatcherFactory(keywords) {
    if (keywords == null || keywords.length === 0) {
        return null;
    }
    const exp = keywords
        .sort(comparator('length', true)) // longest first for regex match to work correctly
        .filter(s => !!s)
        .map(s => {
            if (s.startsWith('ignored:')) {
                return null;
            }
            if (s.length > 8 && s.startsWith('regex:/') && s.endsWith('/')) {
                try {
                    const exp = s.substring(7, s.length - 1);
                    RegExp(exp);
                    return exp;
                } catch (e) {
                    console.info(`[rin+] invalid regex entry: ${s}`);
                    return null;
                }
            }
            const term = s.toLowerCase();
            let exp = escapeRegExp(term);
            if (isAlpha(term[0])) {
                exp = '(?<=[^a-z]|^)' + exp;
            } else if (isNumeric(term[0])) {
                exp = '(?<=[^0-9]|^)' + exp;
            }
            if (isAlpha(term[term.length - 1])) {
                exp = exp + '(?=[^a-z]|$)';
            } else if (isNumeric(term[term.length - 1])) {
                exp = exp + '(?=[^0-9]|$)';
            }
            return exp;
        })
        .filter(s => !!s)
        .join('|');
    try {
        new RegExp(exp, 'g');
    } catch (ex) {
        if (DEV_MODE) console.warn('invalid-regexp: ' + exp);
        return null;
    }
    return {
        isStaticKeyword(word) {
            return keywords.indexOf(word) != -1;
        },
        match(text) {
            const pattern = new RegExp(exp, 'g');
            const matches = new Set();
            while (true) {
                const match = pattern.exec(text);
                if (match == null) {
                    break;
                }
                matches.add(match[0]);
            }
            return matches;
        }
    };
}

async function openCustomThreadCategoryEditor(threadCategoryConfigAccess, callback) {
    openTextListEditor(THREAD_LIKE_POPUP_MENU_ID, {
        title: '自定分类词列表',
        description: `每行一个关键字
正则表达式高级设置 (懂的都懂 不懂可无视) 格式: regex:/正则表达式语法/
  例子: regex:/[东南西北]\+/`,
        async read() {
            const customConfig = await threadCategoryConfigAccess.read();
            return customConfig.keywords.sort().join('\n');
        },
        async save(textData) {
            return await threadCategoryConfigAccess.update(function(customConfig) {
                const newKeywords = textData.split('\n').map(itm=>itm.replace(/\s+/g, ' ').trim()).filter(itm=>!!itm);
                customConfig.keywords = newKeywords;
                return customConfig;
            });
        }
    }, callback);
}

function enhanceTopicPostListDisplay(userId, myUserId, userConfig, threadHistoryAccess, threadCategoryConfigAccess, hideVisitedThreadToggler) {
    
    const headerCell = document.querySelector('#u-contentmain .u-table tr:first-child > td');
    headerCell.textContent = '';
    headerCell.nextElementSibling.textContent = '';
    const editKeywordsButton = addElem(headerCell.nextElementSibling, 'a');
    editKeywordsButton.setAttribute('href', 'javascript:void(0)');
    editKeywordsButton.textContent = '自定分类';
    editKeywordsButton.addEventListener('click', () => {
        openCustomThreadCategoryEditor(threadCategoryConfigAccess, () => apply());
    });
    const toggleItemsArea = addElem(headerCell, 'span', 'rinsp-category-filter');
    const toggleItems = [];
    let activeKeyword = null;

    const threadsById = new Map();
    const threadsByKeywords = new Map();

    function refreshCategoryFilter() {
        toggleItems.forEach(toggleItem => {
            if (toggleItem.keyword === activeKeyword) {
                toggleItem.toggler.classList.add('rinsp-category-active');
            } else {
                toggleItem.toggler.classList.remove('rinsp-category-active');
            }
        });
        if (activeKeyword) {
            const activeTids = threadsByKeywords.get(activeKeyword);
            threadsById.forEach((row, tid) => {
                if (activeTids != null && activeTids.has(tid)) {
                    row.classList.remove('rinsp-category-hide');
                } else {
                    row.classList.add('rinsp-category-hide');
                }
            });
        } else {
            threadsById.forEach((row, tid) => {
                row.classList.remove('rinsp-category-hide');
            });
        }
    }

    async function apply() {

        let keywordPatternMatcher = null;
        let keywordCaseMappings = new Map();
        const threadCategoryConfig = await threadCategoryConfigAccess.read();
        if (threadCategoryConfig.keywords.length > 0) {
            let keywords = threadCategoryConfig.keywords.map(kw => {
                let lower = kw.toLowerCase();
                keywordCaseMappings.set(lower, kw);
                return lower;
            });
            keywordPatternMatcher = createKeywordMatcherFactory(keywords);
        }

        threadsById.clear();
        threadsByKeywords.clear();
        const areaMap = new Map();
        document.querySelectorAll('#u-contentmain th > a[href^="read.php?tid-"]:not(.rinsp-gf-link)').forEach(el => {
            const cell = el.closest('th');
            const row = cell.closest('tr');
            const tid = Number.parseInt(el.getAttribute('href').substring(13));
            threadsById.set(tid, row);

            if (cell.querySelector('.rinsp-gf-link') == null) {
                const gfLink = newElem('a', 'rinsp-gf-link', {
                    href: `read.php?tid-${tid}-uid-${userId}.html`,
                    target: '_blank'
                });
                gfLink.textContent = '只看楼主';
                cell.prepend(gfLink);
            }
    
            const fidLink = cell.querySelector('a[href^="thread.php?fid-"]');
            const fid = Number.parseInt(fidLink.getAttribute('href').substring(15));
            setAreaScoped(row, fid);
            areaMap.set(fid, fidLink.textContent.trim());
            cell.classList.remove('rinsp-thread-visited');
            enrichThreadTitle(tid, el, myUserId, userConfig, threadHistoryAccess);
            
            if (keywordPatternMatcher) {
                const threadTitle = el.textContent;
                const matches = keywordPatternMatcher.match(threadTitle.toLowerCase());
                for (let keyword of matches) {
                    let threadSet = threadsByKeywords.get(keyword);
                    if (threadSet == null) {
                        threadSet = new Set();
                        threadsByKeywords.set(keyword, threadSet);
                    }
                    threadSet.add(tid);
                }
            }

        });
        toggleItemsArea.textContent = '';
        toggleItems.length = 0;
        threadsByKeywords.forEach((threadSet, keyword) => {
            
            const toggler = addElem(toggleItemsArea, 'div', 'rinsp-category-toggle-item');
            toggler.setAttribute('count', '' + threadSet.size);
            toggler.textContent = keywordCaseMappings.get(keyword)||keyword;
            toggler.addEventListener('click', () => {
                if (activeKeyword === keyword) {
                    activeKeyword = null;
                } else {
                    activeKeyword = keyword;
                }
                refreshCategoryFilter();
            });
            toggleItems.push({
                toggler,
                keyword
            });
        });

        addAreaFilter(areaMap, myUserId, defaultAreaFilterHandler).apply();
        await updateHistoryCheck();

    }

    async function updateHistoryCheck() {
        if (threadHistoryAccess == null || hideVisitedThreadToggler == null)
            return;
        let visitedCount = 0;
        const tids = Array.from(threadsById.keys());
        const lastSeenRecords = await threadHistoryAccess.historyStore.getBatch(tids);
        lastSeenRecords.forEach((record, i) => {
            const row = threadsById.get(tids[i]);
            if (record != null) {
                row.classList.add('rinsp-thread-visited');
                visitedCount++;
            }
        });
        hideVisitedThreadToggler.setCount(visitedCount);
    }

    if (hideVisitedThreadToggler) {
        hideVisitedThreadToggler.restoreLastState(true);
        // if history based styling is active, need to recheck on page activation
        document.addEventListener('visibilitychange', async () => {
            if (!document.hidden) {
                await updateHistoryCheck();
            }
        });
    }

    // accounting for infinite scroll added by soul++
    const observer = createMutationObserver(async () => {
        await apply();
    });
    observer.init(document.querySelector('#u-contentmain .u-table'), { childList: true, subtree: false, attributes: false });
    observer.trigger();

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            observer.trigger();
        }
    });
}

async function enhanceReplyPostListDisplay(userId, myUserId, userConfig, userPinArea, mainConfigAccess, threadHistoryAccess, hideVisitedThreadToggler) {
    const firstItem = document.querySelector('#u-contentmain .u-table tr > th > a[href^="job.php?action-topost-tid-"]');
    if (firstItem == null) {
        return;
    }
    let userReplyListFolded = userConfig.userReplyListFolded;
    let accessUpdaters = [];
    function registerEnrichThreadTitle(tid, elem) {
        if (threadHistoryAccess) {
            const action = () => enrichThreadTitle(tid, elem, myUserId, userConfig, threadHistoryAccess);
            accessUpdaters.push(action);
            action();
        }
    }
    const baseTable = firstItem.closest('.u-table:not(.rinsp-reply-fold-table)');
    const threadsById = new Map();
    async function apply() {
        accessUpdaters.length = 0;
        threadsById.clear();
        let table = baseTable;
        const areaMap = new Map();
        if (userReplyListFolded) {
            const dataItems = [];
            table.querySelectorAll('tr + tr').forEach(row => {
                const th = row.querySelector('th');
                const topostLink = th.querySelector('a[href^="job.php?action-topost-tid-"]');
                const threadLink = th.querySelector('a[href^="thread.php?fid-"]');
                const areaHref = threadLink.getAttribute('href');
                const date = th.querySelector('span.gray.f9').textContent.replace(/^\[|\]$/g, '');
                const postUidLink = row.querySelector('td a[href^="u.php?action-show-uid-"]');
                const topostHref = topostLink.getAttribute('href');
                const topostRef = getPostRef(topostHref);
                if (topostRef) {
                    dataItems.push({
                        postTitle: topostLink.textContent.trim(),
                        topostHref: topostHref,
                        tid: topostRef.tid,
                        pid: topostRef.pid,
                        areaName: threadLink.textContent.trim(),
                        areaHref: areaHref,
                        areaFid: Number.parseInt(areaHref.substring(15)),
                        date,
                        postUid: Number.parseInt(postUidLink.getAttribute('href').substring(22)),
                        postUhash: postUidLink.textContent.trim()
                    });
                }
            });

            const groupedItems = [];
            const map = new Map();
            dataItems.forEach(item => {
                let group = map.get(item.tid);
                if (group == null) {
                    group = [];
                    map.set(item.tid, group);
                    groupedItems.push(group);
                }
                group.push(item);
            });
    
            baseTable.parentElement.querySelectorAll('.rinsp-reply-fold-table').forEach(el => el.remove());
            const foldTable = newElem('table', 'u-table rinsp-reply-fold-table');
            const foldTbody = addElem(foldTable, 'tbody');
            const foldTr1 = addElem(foldTbody, 'tr');
            foldTr1.innerHTML = '<td><br></td><td><br></td>';
            
            groupedItems.forEach(group => {
                const row = addElem(foldTbody, 'tr');
                const th = addElem(row, 'th');
                const td = addElem(row, 'td');
                td.textContent = '作者:';
                const firstItem = group[0];
                setAreaScoped(row, firstItem.areaFid);
                areaMap.set(firstItem.areaFid, firstItem.areaName);
                threadsById.set(firstItem.tid, [row]);

                addElem(td, 'a', 'gray', { href: `u.php?action-show-uid-${firstItem.postUid}.html`, target: '_blank' }).textContent = firstItem.postUhash;

                if (group.length === 1) {
                    const tLink = addElem(th, 'a', null, { href: firstItem.topostHref, target: '_blank' });
                    tLink.textContent = firstItem.postTitle;
                    addElem(th, 'br');
                    registerEnrichThreadTitle(firstItem.tid, tLink);
                } else {
                    const foldedItem = addElem(th, 'div', 'rinsp-reply-fold-item');
                    const tLink = addElem(foldedItem, 'a', null, { href: firstItem.topostHref, target: '_blank' });
                    tLink.textContent = firstItem.postTitle;
                    const pages = addElem(foldedItem, 'div', 'rinsp-reply-fold-pages');
                    addElem(pages, 'span', 'rinsp-reply-fold-count').textContent = `${group.length}`;
                    let range = addElem(pages, 'div', 'rinsp-reply-fold-remains');
                    const splitIndex = group.length > 5 ? group.length - 3 : group.length;
                    group.slice(1).forEach((item, i) => {
                        addElem(range, 'a', null, { href: item.topostHref, target: '_blank' }).textContent = `${group.length - i - 1}`;
                        if (i === splitIndex) {
                            range.classList.add('rinsp-reply-fold-remains-start');
                            range = addElem(pages, 'div', 'rinsp-reply-fold-remains rinsp-reply-fold-remains-end');
                        }
                    });
                    registerEnrichThreadTitle(firstItem.tid, tLink);
                }

                const gfLink = newElem('a', 'rinsp-gf-link', {
                    href: `read.php?tid-${firstItem.tid}-uid-${userId}.html#${firstItem.pid}`,
                    target: '_blank'
                });
                gfLink.textContent = '只看回复';
                th.append(gfLink);
    
                addElem(th, 'a', 'gray', { href: firstItem.areaHref, target: '_blank' }).textContent = firstItem.areaName;
                const lastItem = group[group.length - 1];
                if (firstItem.date === lastItem.date) {
                    addElem(th, 'span', 'gray f9').textContent = ` [${firstItem.date}]`;
                } else {
                    addElem(th, 'span', 'gray f9').textContent = ` [${firstItem.date} ~ ${lastItem.date}]`;
                }
            });
            table.parentElement.insertBefore(foldTable, table);
            table = foldTable;
        } else {
            document.querySelectorAll('#u-contentmain .u-table.rinsp-reply-fold-table').forEach(el => el.remove());
            table.querySelectorAll('tr > th > a[href^="job.php?action-topost-tid-"]').forEach(el => {
                const cell = el.closest('th');
                const row = cell.closest('tr');
                const postRef = getPostRef(el.getAttribute('href'));
                if (!postRef) {
                    return;
                }
                registerEnrichThreadTitle(postRef.tid, el);
                if (cell.querySelector('.rinsp-gf-link') == null) {
                    const gfLink = newElem('a', 'rinsp-gf-link', {
                        href: `read.php?tid-${postRef.tid}-uid-${userId}.html#${postRef.pid}`,
                        target: '_blank'
                    });
                    gfLink.textContent = '只看回复';
                    cell.prepend(gfLink);
                }
    
                const fidLink = cell.querySelector('a[href^="thread.php?fid-"]');
                const fid = Number.parseInt(fidLink.getAttribute('href').substring(15));
                setAreaScoped(row, fid);
                areaMap.set(fid, fidLink.textContent.trim());
                let rows = threadsById.get(postRef.tid);
                if (rows == null) {
                    rows = [];
                    threadsById.set(postRef.tid, rows);
                }
                rows.push(row);
                row.classList.remove('rinsp-thread-visited');
            });
        
        }

        addAreaFilter(areaMap, myUserId, defaultAreaFilterHandler).apply();
        await updateHistoryCheck();

        const controlContainer = table.querySelector('tr:first-child > td:first-child');
        if (controlContainer) {
            controlContainer.querySelectorAll('br, .rinsp-reply-list-controls').forEach(el => el.remove());
            const grouper = addElem(controlContainer, 'span', 'rinsp-reply-list-controls');
            grouper.appendChild(document.createTextNode('显示方式: '));
            const modeSelect = addElem(grouper, 'select');
            addElem(modeSelect, 'option', null, { value: '' }).textContent = '一般';
            addElem(modeSelect, 'option', null, { value: 'folding' }).textContent = '折叠式';
            modeSelect.value = userReplyListFolded ? 'folding' : '';
            modeSelect.value = modeSelect.value || '';
            modeSelect.addEventListener('change', () => {
                modeSelect.disabled = true;
                mainConfigAccess.update(function(updatingUserConfig) {
                    updatingUserConfig.userReplyListFolded = modeSelect.value === 'folding';
                    return updatingUserConfig;
                })
                .finally(function() {
                    userReplyListFolded = modeSelect.value === 'folding';
                    modeSelect.disabled = false;
                    apply();
                });
            });
        }
    }

    async function updateHistoryCheck() {
        if (threadHistoryAccess == null || hideVisitedThreadToggler == null)
            return;
        let visitedCount = 0;
        const tids = Array.from(threadsById.keys());
        const lastSeenRecords = await threadHistoryAccess.historyStore.getBatch(tids);
        lastSeenRecords.forEach((record, i) => {
            if (record != null) {
                const rows = threadsById.get(tids[i]);
                rows.forEach(row => row.classList.add('rinsp-thread-visited'));
                visitedCount++;
            }
        });
        hideVisitedThreadToggler.setCount(visitedCount);
    }

    if (hideVisitedThreadToggler) {
        hideVisitedThreadToggler.restoreLastState(true);
        // if history based styling is active, need to recheck on page activation
        document.addEventListener('visibilitychange', async () => {
            if (!document.hidden) {
                await updateHistoryCheck();
            }
        });
    }

    // accounting for infinite scroll added by soul++ (or me)
    const observer = createMutationObserver(async () => {
        await apply();
    });
    observer.init(baseTable, { childList: true, subtree: false, attributes: false });
    observer.trigger();

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            accessUpdaters.forEach(accessUpdater => accessUpdater());
        }
    });

    await enhancePostListUserDisplay('post', userId, myUserId, userConfig, userPinArea);

    function getPostRef(postUrl) {
        const match = postUrl.match(/-tid-(\d+)-pid-(\d+)\.html$/);
        if (!match)
            return null;
        return {
            tid: match[1] * 1,
            pid: match[2] * 1,
        };
    }

}

function enhanceFavorPageDisplay(userId, myUserId, userConfig, threadHistoryAccess) {
    if (threadHistoryAccess) {
        document.querySelectorAll('#u-contentmain th > a[href^="read.php?tid-"]').forEach(el => {
            const tid = Number.parseInt(el.getAttribute('href').substring(13));
            enrichThreadTitle(tid, el, myUserId, userConfig, threadHistoryAccess);
        });
    }
}

function updateFavorRecords(favorThreadsCacheAccess) {
    const favors = readFavorList(document);
    favorThreadsCacheAccess.write({
        data: favors,
        time: Date.now()
    });
}

async function readFavorRecords(favorThreadsCacheAccess, fresh, noupdate) {
    let cached = fresh ? null : await favorThreadsCacheAccess.read();
    const now = Date.now();
    if (cached == null || cached.time > now || (now - cached.time) > 79200000) { // older than 22 hours
        const doc = await fetchGetPage(`${document.location.origin}/u.php?action-favor.html`);
        const favors = readFavorList(doc);
        const cacheItem = {
            data: favors,
            time: now
        };
        if (!noupdate) {
            await favorThreadsCacheAccess.write(cacheItem);
        }
        return favors;
    } else {
        return cached.data;
    }
}

async function enhancePostListUserDisplay(action, userId, myUserId, userConfig, userPinArea) {
    const mappings = userConfig.customUserHashIdMappings;

    function transformUserDisplay(el, postUid) {
        el.classList.add('rinsp-user-link');
        if (Number.isNaN(postUid)) {
            return;
        }

        const myself = userConfig.highlightMyself && myUserId === postUid;
        const owner = userId === postUid;
        const userRecord = mappings ? mappings['#' + postUid] : null;
        const pinnedUser = userPinArea.getPinned(postUid);
        if (userRecord || myself || owner || pinnedUser) {
            if (!el.dataset.rinspRestore) {
                el.dataset.rinspRestore = el.textContent;
            }
            el.innerHTML = '';
            if (myself) {
                addElem(el, 'span', 'rinsp-nickname-byme').textContent = MY_NAME_DISPLAY;
            } else if (owner) {
                addElem(el, 'span', 'rinsp-nickname-byowner').textContent = '楼主';
            } else if (pinnedUser) {
                addElem(el, 'span', 'rinsp-nickname-bypinned').textContent = pinnedUser.nickName;
                userPinArea.addLocation(postUid, '⚪', null, () => {
                    el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                });
            } else {
                addElem(el, 'span', 'rinsp-nickname-byother').textContent = userRecord[2];
            }
        } else {
            const restore = el.dataset.rinspRestore;
            if (restore) {
                el.textContent = restore;
                delete el.dataset.rinspRestore;
            }
        }
    }

    async function update() {
        userPinArea.clearState();
        if (action === '' || action === 'feed') { // personal dashboard (好友近况)
            document.querySelectorAll('#minifeed .feed-list > dt > a.link1[href^="u.php?uid-"]').forEach(el => {
                const postUid = Number.parseInt(el.getAttribute('href').substring(10));
                transformUserDisplay(el, postUid);
            });
        } else if (action === 'favor') { // personal collection
            userPinArea.clearState();
            document.querySelectorAll('#u-content td > a[href^="u.php?uid-"]').forEach(el => {
                const postUid = Number.parseInt(el.getAttribute('href').substring(10));
                transformUserDisplay(el, postUid);
            });
        } else if (['topic', 'post', 'friend'].includes(action)) { // reply list, friend list
            const table = document.querySelector('#u-content .u-table');
            if (table) {
                table.querySelectorAll('td:nth-child(2) > a[href^="u.php?action-show-uid-"]').forEach(el => {
                    const postUid = Number.parseInt(el.getAttribute('href').substring(22));
                    transformUserDisplay(el, postUid);
                    const nextElem = el.nextElementSibling;
                    if (nextElem && nextElem.tagName === 'B' && nextElem.textContent === '在线') {
                        el.closest('tr').classList.add('rinsp-user-state-online');
                    }
                });
            }
        }
        await userPinArea.update();
    }
    // accounting for infinite scroll
    let triggerUpdate;
    const scope = document.querySelector('#u-contentmain');
    if (scope) {
        const observer = createMutationObserver(update);
        observer.init(scope, { childList: true, subtree: true, attributes: false });
        observer.trigger();
        triggerUpdate = () => observer.trigger();
    } else {
        await update();
        triggerUpdate = () => update();
    }
    userPinArea.addUpdateListener(() => {
        triggerUpdate();
    });

}

function createMutationObserver(callback) {
    let updateSchedule = null;
    let skipUpdate = 0;
    function onContentChange() {
        if (updateSchedule == null) {
            skipUpdate++;
            updateSchedule = setTimeout(function() {
                updateSchedule = null;
                callback()
                    .finally(() => skipUpdate--);
            }, 0);
        }
    }
    const observer = new MutationObserver(function(e) {
        if (DEBUG_MODE) console.info(skipUpdate > 0 ? 'skipped-mutation' : 'mutation');
        if (skipUpdate > 0) {
            return;
        }
        onContentChange();
    });
    return {
        init(watchElem, options) {
            observer.observe(watchElem, options);
        },
        trigger() {
            onContentChange();
        }
    };
}

function replaceTradeWithHistoryTab(myUserId, queryParams) {
    const tradeTab = document.querySelector(`#u_trade > a[href="u.php?action-trade.html"], #u_trade > a[href="u.php?action-trade-uid-${myUserId}.html"]`);
    if (tradeTab) {
        tradeTab.textContent = '浏览记录';
    }
}

function replaceTradeWithPunishHistoryTab(myUserId, queryParams) {
    const tradeTabLink = document.querySelector('#u_trade > a[href^="u.php?action-trade-uid-"]');
    if (tradeTabLink) {
        const tradeTab = tradeTabLink.closest('li');
        const uid = Number.parseInt(tradeTabLink.getAttribute('href').substring(23));
        if (uid === myUserId) {
            const adminHistoryTab = newElem('li');
            addElem(adminHistoryTab, 'a', null, { href: 'u.php?action-trade-view-admin.html' }).textContent = '管理记录';
            tradeTab.closest('ul').insertBefore(adminHistoryTab, tradeTab.nextElementSibling);
            if (queryParams.action === 'trade' && queryParams.view === 'admin') {
                tradeTab.classList.remove('current');
                adminHistoryTab.classList.add('current');
            }
        } else {
            tradeTabLink.textContent = '不良记录';
        }
    }
}

function comparator(prop, reversed) {
    const reverser = reversed ? -1 : 1;
    return (x, y) => {
        const xv = typeof prop === 'function' ? prop(x) : prop ? x[prop] : x;
        const yv = typeof prop === 'function' ? prop(y) : prop ? y[prop] : y;
        return xv > yv ? reverser : xv < yv ? -reverser : 0;
    };
}

function renderVisitHistoryPage(myUserId, userConfig, threadHistoryAccess) {
    const mainPane = document.querySelector('#u-content > #u-contentmain');
    const sidePane = document.querySelector('#u-content > #u-contentside');
    sidePane.innerHTML = '';
    if (threadHistoryAccess == null) {
        mainPane.innerHTML = '<div style="padding:16px 30px">💡 请先启用🗞️帖子记录功能</div>';
        return;
    }
    mainPane.innerHTML = '<div style="padding:16px 30px"><img src="images/loading.gif" align="absbottom"> 加载中 ... (请耐心等待)</div>';

    async function init() {
        const records = await threadHistoryAccess.recentAccessStore.list();
        if (records.length === 0) {
            mainPane.innerHTML = '<div style="padding:16px 30px">💡 没有历史记录</div>';
            return;
        }
        mainPane.innerHTML = '';
        const sortByVisitTime = comparator('time', true);
        const sortByPostTime = comparator('tid', true);
        
        const now = Date.now();
        const areaMap = new Map();
        records.forEach(record => areaMap.set(record.fid, record.area));
        const areaFilter = addAreaFilter(areaMap, myUserId, () => update(false));

        const table = addElem(mainPane, 'table', 'u-table rinsp-thread-history-table');
        const thead = addElem(table, 'thead');
        const tr1 = addElem(thead, 'tr');
        const filterCell = addElem(tr1, 'td', null, { colspan: '2' });
        const filterBox1 = addElem(filterCell, 'div', 'rinsp-quick-filter-box');
        addElem(filterBox1, 'div').textContent = '🔍︎搜索';
        const filterInput = addElem(filterBox1, 'input', null);

        addElem(filterBox1, 'div', null, { style: 'flex: 0 1 1em' });

        const controlBlock = addElem(filterBox1, 'div');
        controlBlock.appendChild(document.createTextNode('排序: '));
        const sortSelect = addElem(controlBlock, 'select');
        addElem(sortSelect, 'option', null, { value: 'last_visit' }).textContent = '访问时间';
        addElem(sortSelect, 'option', null, { value: 'thread_age' }).textContent = '发帖时间';
        sortSelect.value = 'last_visit';
        sortSelect.addEventListener('change', () => update(false));

        controlBlock.appendChild(document.createTextNode('显示数: '));
        const limitSelect = addElem(controlBlock, 'select');
        addElem(limitSelect, 'option', null, { value: '100' }).textContent = '100';
        addElem(limitSelect, 'option', null, { value: '200' }).textContent = '200';
        addElem(limitSelect, 'option', null, { value: '500' }).textContent = '500';
        addElem(limitSelect, 'option', null, { value: '1000' }).textContent = '1000';
        limitSelect.value = '100';
        limitSelect.addEventListener('change', () => update(false));

        const filterBox2 = addElem(filterCell, 'div', 'rinsp-quick-filter-box');
        addElem(filterBox2, 'div').textContent = '';
        const boughtFilterCheckbox = addCheckbox(filterBox2, '已购买', 'rinsp-quick-filter-checkbox rinsp-quick-filter-bought-checkbox');
        const repliedFilterCheckbox = addCheckbox(filterBox2, '已回复', 'rinsp-quick-filter-checkbox rinsp-quick-filter-replied-checkbox');
        const notmineFilterCheckbox = addCheckbox(filterBox2, '隐藏我的主题', 'rinsp-quick-filter-checkbox rinsp-quick-filter-notmine-checkbox');
        addElem(filterBox2, 'div', null, { style: 'flex: 1' });

        const tbody = addElem(table, 'tbody');
        const tfoot = addElem(table, 'tfoot');
        const statusRow = addElem(tfoot, 'tr');
        const statusCell = addElem(statusRow, 'td', 'grey', { colspan: '2' });

        let lastFilterString = '';
        function update(filterChangeOnly) {
            const terms = filterInput.value.toLowerCase().trim().split(/\s+/g);
            const thisFilterString = terms.join(' ');
            if (filterChangeOnly && lastFilterString === thisFilterString)
                return;
            lastFilterString = thisFilterString;
            statusCell.textContent = '';

            const limit = limitSelect.value * 1;
            const sortMethod = sortSelect.value === 'thread_age' ? sortByPostTime : sortByVisitTime;
            const fid = areaFilter.getCurrentFid();
            let selectedRecords;
            // apply area filter, also clone the list for sorting
            if (fid > 0) {
                selectedRecords = records.filter(record => record.fid === fid);
            } else {
                selectedRecords = records.slice();
            }

            // apply bought filter
            if (boughtFilterCheckbox.checked) {
                selectedRecords = selectedRecords.filter(record => !!record.bought);
            }

            // apply replied filter
            if (repliedFilterCheckbox.checked) {
                selectedRecords = selectedRecords.filter(record => record.replied > 0);
            }

            // apply not self filter
            if (notmineFilterCheckbox.checked) {
                selectedRecords = selectedRecords.filter(record => record.uid !== myUserId);
            }

            // apply text filter
            if (terms.length === 1 && terms[0] === '') {
                table.classList.remove('rinsp-table-filtered');
                if (selectedRecords.length > limit) {
                    statusCell.textContent = `💡只显示前${limit}条记录 / 共${selectedRecords.length}条`;
                }
            } else {
                table.classList.add('rinsp-table-filtered');
                selectedRecords = selectedRecords.filter(record => match(record, terms));

                if (selectedRecords.length === 0) {
                    statusCell.textContent = '💡没有搜索结果';
                } else if (selectedRecords.length > limit) {
                    statusCell.textContent = `💡只显示前${limit}条搜索结果 / 共${selectedRecords.length}条`;
                }
            }

            selectedRecords.sort(sortMethod);
            tbody.innerHTML = '';

            selectedRecords.slice(0, limit).forEach(record => {
                const row = addElem(tbody, 'tr');
                const th = addElem(row, 'th');
                const td = addElem(row, 'td');
                setAreaScoped(row, record.fid);

                const status = addElem(th, 'span', 'rinsp-thread-status-icons');
                if (record.deleted) {
                    row.classList.add('rinsp-thread-deleted');
                }
                if (record.replied) {
                    row.classList.add('rinsp-thread-replied');
                    addElem(status, 'a', 'rinsp-thread-replied-icon', { title: '已回复', href: `read.php?tid-${record.tid}-uid-${myUserId}.html`, target: '_blank' }).textContent = '↩️';
                }
                if (record.bought) {
                    row.classList.add('rinsp-thread-bought');
                    addElem(status, 'span', 'rinsp-thread-bought-icon', { title: '已购买' }).textContent = '💰';
                }
                addElem(th, 'a', null, { href: `read.php?tid-${record.tid}.html`, target: '_blank' }).textContent = record.title;
                addElem(th, 'div');
                if (record.initialTitle && record.initialTitle !== record.title) {
                    addElem(th, 'div', 'rinsp-thread-initial-title').textContent = record.initialTitle;
                }
    
                addElem(th, 'a', 'gray', { href: `thread.php?fid-${record.fid}.html`, target: '_blank' }).textContent = record.area;
                
                addElem(th, 'span', 'gray f9').textContent = ' [ ' + getAgeString((now - record.time) / 60000) + ' ]';

                const uidBlock = addElem(th, 'span', 'rinsp-thread-record-uid');

                if (record.uid > 0) {
                    if (record.uid === myUserId) {
                        row.classList.add('rinsp-thread-byme');
                        const userLink = addElem(uidBlock, 'a', 'rinsp-owner-isme', { href: `u.php?uid-${record.uid}.html`, target: '_blank' });
                        userLink.textContent = MY_NAME_DISPLAY;
                    } else {
                        let customNameEntry = userConfig.customUserHashIdMappings['#' + record.uid];
                        if (customNameEntry) {
                            const userLink = addElem(uidBlock, 'a', 'rinsp-owner-isknown', { href: `u.php?uid-${record.uid}.html`, target: '_blank' });
                            userLink.textContent = customNameEntry[2];
    
                        }
                    }
                }
            });
        }

        function addCheckbox(target, label, styleClass) {
            const labelElem = addElem(target, 'label', styleClass);
            const checkbox = addElem(labelElem, 'input', null, { type: 'checkbox' });
            addElem(labelElem, 'span', null, { style: 'vertical-align: text-top' }).textContent = label;
            checkbox.addEventListener('change', () => update(false));
            return checkbox;
        }

        let enqueueTimer = null;
        filterInput.addEventListener('keyup', () => {
            if (enqueueTimer) clearTimeout(enqueueTimer);
            enqueueTimer = setTimeout(() => update(true), 200);
            
        });
        filterInput.addEventListener('change', () => {
            if (enqueueTimer) clearTimeout(enqueueTimer);
            update(true);
        });

        update(false);
    }
    
    function match(record, searchTerms) {
        const title = record.title.toLowerCase();
        const initialTitle = (record.initialTitle||'').toLowerCase();
        for (let searchTerm of searchTerms) {
            if (title.indexOf(searchTerm) === -1 && initialTitle.indexOf(searchTerm) === -1)
                return false;
        }
        return true;
    }

    init();
}

const todayMs = Math.floor(new Date() / 86400000) * 86400000;
function annotateUsers(posts, myUserId, userConfig, userMap, services) {
    posts.forEach(post => {
        if (post.rootElem.classList.contains('rinsp-post-annotated')) {
            return;
        }
        post.rootElem.classList.add('rinsp-post-annotated');
        let customNameEntry = userConfig.customUserHashIdMappings['#' + post.postUid];
        if (!post.defaultUserPic) {
            post.rootElem.classList.add('rinsp-post-custom-userpic');
            const img = post.userPicElem.querySelector('img');
            if ((img.getAttribute('height')||'150') * 1 > 150) {
                post.rootElem.classList.add('rinsp-post-userpic-tall');
            }
        }
        if (userConfig.selfBypassHideUserpic && post.postUid === myUserId) {
            // skip
        } else {
            if (!userConfig.customUserBypassHideUserpic || customNameEntry == null) {
                if (post.defaultUserPic) {
                    if (userConfig.hideDefaultUserpic) {
                        post.rootElem.classList.add('rinsp-userpic-replace');
                        post.rootElem.classList.add('rinsp-userpic-replace-default');
                    }
                } else {
                    if (userConfig.hideOtherUserpic) {
                        post.rootElem.classList.add('rinsp-userpic-replace');
                        post.rootElem.classList.add('rinsp-userpic-replace-custom');
                    }
                }
            }
        }
        const data = userMap.get(post.postUid); // basically impossible
        if (data == null) {
            return;
        }
        const userLink = post.userNameElem.closest('a');
        const bookmarkElem = newElem('span', 'rinsp-userbookmark');
        userLink.parentNode.insertBefore(bookmarkElem, userLink);
        const bookmarkActionElem = addElem(bookmarkElem, 'span', 'rinsp-userbookmark-action');
        if (customNameEntry != null) {
            post.rootElem.classList.add('rinsp-userframe-userknown');
            const renamed = customNameEntry[2] !== post.postUname;
            if (data.unnamed || renamed) {
                bookmarkElem.classList.add('rinsp-userbookmark-takeover');
                if (renamed) {
                    post.rootElem.classList.add('rinsp-userframe-userrenamed');
                }
                const customUserLink = addElem(bookmarkElem, 'a');
                customUserLink.setAttribute('href', `u.php?action-show-uid-${post.postUid}.html`);
                customUserLink.setAttribute('target', '_blank');
                customUserLink.textContent = customNameEntry[2];
            }
        }
        
        bookmarkActionElem.addEventListener('click', async () => {
            if (customNameEntry == null) {
                const userHashId = await fetchUserHashId(post.postUid);
                services.changeCustomUserMapping(post.postUid, userHashId, post.postUname)
                    .then(value => {
                        if (value != null) {
                            location.reload();
                        }
                    });
            } else {
                services.changeCustomUserMapping(customNameEntry[0], customNameEntry[1], customNameEntry[2])
                    .then(value => {
                        if (value != null) {
                            location.reload();
                        }
                    });
            }
        });
        let cell = post.userPicElem.closest('.r_two');
        if (data.unnamed) {
            cell.classList.add('rinsp-userframe-unnamed');
        }

        if (userConfig.showExtendedUserInfo && data != null) {
            if (userConfig.showExtendedUserInfo$HP && data.hp < 0) {
                let hpTag = newElem('div', 'rinsp-userframe-udata-hp');
                hpTag.textContent = data.hp + 'HP';
                cell.querySelector('.user-pic + div > a').appendChild(hpTag);
            }
            addElem(post.userPicElem, 'div', 'rinsp-userframe-pulldown');
            let infoBlock = addElem(post.userPicElem, 'div', 'rinsp-userframe-userinfo');

            const addItem = (key, value, cls) => {
                let item = addElem(infoBlock, 'dl', cls);
                let dt = addElem(item, 'dt');
                dt.textContent = key;
                let dd = addElem(item, 'dd');
                dd.textContent = value;
            };
            addItem('SP', data.sp.toLocaleString(), 'rinsp-userframe-udata-sp');
            addItem('在线', String(data.online) + '小时', 'rinsp-userframe-udata-online', { title: '在线时间' });

            addElem(infoBlock, 'div', 'rinsp-userframe-udata-spacer');

            let actionItem = addElem(infoBlock, 'div', 'rinsp-userframe-udata-punish-tags');
            if (services.punishRecordAccess) {
                services.punishRecordAccess
                    .getPunishRecord(post.postUid)
                    .then(record => {
                        actionItem.innerHTML = '';
                        if (record == null || record.logs.length === 0) {
                            return;
                        }
                        actionItem.appendChild(renderPunishTags(post.postUid, record));
                    });
            }


            let loginItem = addElem(infoBlock, 'div', 'rinsp-userframe-udata-login');
            loginItem.textContent = '最后登录 ';
            let loginItemValue = addElem(loginItem, 'span');
            let awayDays = (todayMs - new Date(data.login)) / 86400000;
            if (awayDays < 1) {
                loginItemValue.classList.add('rinsp-userframe-udata-login-today');
                loginItemValue.textContent = '今天';
            } else if (awayDays < 2) {
                loginItemValue.classList.add('rinsp-userframe-udata-login-yesterday');
                loginItemValue.textContent = '昨天';
            } else {
                loginItemValue.textContent = data.login;
            }

        }

        const nameLabel = cell.querySelector('.user-pic ~ div[align="center"]');
        if (nameLabel) {
            nameLabel.classList.add('rinsp-userframe-username');
            if (userConfig.stickyUserInfo) {
                const nameLabelSticky = addElem(post.userPicElem, 'div', 'rinsp-userframe-username-sticky');
                nameLabelSticky.appendChild(bookmarkElem.cloneNode(true));
                nameLabelSticky.appendChild(nameLabel.querySelector('.rinsp-userbookmark + a').cloneNode(true));
                nameLabelSticky.querySelector('.rinsp-userbookmark > .rinsp-userbookmark-action').addEventListener('click', () => {
                    bookmarkElem.querySelector('.rinsp-userbookmark-action').click();
                });
            }
        }

        if (userConfig.stickyUserInfo) {
            const dummyUserPic = newElem('div', 'rinsp-user-pic-dummy');
            post.userPicElem.parentNode.insertBefore(dummyUserPic, post.userPicElem.nextElementSibling);
        }
    });
}

async function fetchGetPage(url, docType, autoRetry) {
    const resp = await fetch(url, {
        method: 'GET',
        mode: 'same-origin',
        credentials: 'same-origin',
        cache: 'no-cache'
    });

    if (!resp.ok) {
        throw new Error('网络或登入错误');
    }
    const content = await resp.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, docType || 'text/html');
    if (autoRetry) {
        if (findErrorMessage(doc) === '论坛设置:刷新不要快于 1 秒') {
            await sleep(1100);
            return await fetchGetPage(url, docType, false);
        }
    }
    return doc;
}

async function fetchUserHashId(userId) {
    const doc = await fetchGetPage(`${document.location.origin}/u.php?action-show-uid-${userId}.html`);
    const hashIdElem = doc.querySelector('#main #u-wrap #u-content #u-top h1');
    const hashId = hashIdElem.textContent.trim();
    return hashId;
}

async function showUserNames(userConfig, userHashLookupStore, myUserId) {
    let mappings = userConfig.customUserHashIdMappings;
    if (mappings == null) {
        mappings = {};
    }

    function transformOwnerCells(elemList, alsoChangeName) {
        elemList.forEach(el => {
            if (el.classList.contains('rinsp-uid-inspected')) {
                return;
            }
            el.classList.add('rinsp-uid-inspected');
            const uid = Number.parseInt(el.getAttribute('href').substring(22));
            if (userConfig.highlightMyself && uid === myUserId) {
                el.classList.add('rinsp-owner-isme');
                if (alsoChangeName) {
                    el.textContent = MY_NAME_DISPLAY;
                }
            } else {
                const fullName = mappings['#' + uid];
                if (fullName != null) {
                    el.classList.add('rinsp-owner-isknown');
                    if (alsoChangeName) {
                        el.textContent = fullName[2];
                    }
                }
            }
        });
    }

    if (document.location.pathname === '/search.php') {
        transformOwnerCells(document.querySelectorAll('tr.tr3.tac > td.smalltxt.y-style > a[href^="u.php?action-show-uid-"]'), true);
    } else {
        transformOwnerCells(document.querySelectorAll('td[id^="td_"] ~ td.tal > a.bl[href^="u.php?action-show-uid-"]'), true);
    }

    async function transformReplyCells(itemList) {
        const unresolved = [];
        for (let item of itemList) {
            if (item.byElem.classList.contains('rinsp-hashid-inspected')) {
                continue;
            }

            item.byElem.classList.add('rinsp-hashid-inspected');
            let match = item.byElem.textContent.match(/^by: ([0-9a-f]{8})$/);
            if (match) {
                const uhash = match[1];
                let myself = userConfig.highlightMyself && userConfig.myUserHashId === uhash;
                let fullName = mappings['@' + uhash];
                if (fullName || myself) {
                    if (myself) {
                        item.byElem.textContent = 'by ' + MY_NAME_DISPLAY;
                        item.byElem.classList.add('rinsp-nickname-byme');
                    } else {
                        item.byElem.textContent = 'by ' + fullName[2];
                        item.byElem.classList.add('rinsp-nickname-byother');
                    }
                } else if (userConfig.replyShownAsByOp) {
                    if (item.replyCount === 0 || item.opHashId === uhash) {
                        item.byElem.textContent = 'by 楼主';
                        item.byElem.classList.add('rinsp-nickname-byop');
                        if (item.replyCount === 0) {
                            item.byElem.classList.add('rinsp-nickname-byop-only');
                        }
                    } else {
                        unresolved.push({
                            item, uhash, uhashNum: Number.parseInt(uhash, 16)
                        });
                    }
                }
            }
        }
        if (unresolved.length > 0) {
            const uids = await userHashLookupStore.getBatch(unresolved.map(entry => entry.uhashNum));
            unresolved.forEach((entry, i) => {
                if (uids[i] != null && entry.item.opUid === uids[i]) {
                    entry.item.byElem.textContent = 'by 楼主';
                    entry.item.byElem.classList.add('rinsp-nickname-byop');
                }
            });
        }
    }

    let itemList;
    if (document.location.pathname === '/search.php') {
        itemList = Array.from(document.querySelectorAll('tr.tr3.tac > td.smalltxt.y-style ~ td > a[href^="read.php?tid-"] + br'))
            .map(br => {
                let byElem;
                let next = br.nextSibling;
                if (next.nodeType === 3) {
                    byElem = document.createElement('span');
                    byElem.textContent = next.textContent;
                    br.parentNode.insertBefore(byElem, next);
                    next.remove();
                } else {
                    byElem = br.nextElementSibling;
                }
                const tr = byElem.closest('tr');
                const replyCount = tr.querySelector('td.smalltxt.y-style + .y-style').textContent * 1;
                const op = tr.querySelector('td.smalltxt.y-style > a[href^="u.php?action-show-uid-"]');
                const opUid = op ? Number.parseInt(op.getAttribute('href').substring(22)) : null;
                const opHashId = op ? op.textContent.trim() : null;
                return {
                    opUid,
                    opHashId,
                    replyCount,
                    byElem
                };
            });
    } else {
        itemList = Array.from(document.querySelectorAll('td[id^="td_"] ~ td.tal > a[href^="read.php?tid-"] + br + span.gray2'))
            .map(byElem => {
                const tr = byElem.closest('tr');
                const replyCount = tr.querySelector('td.tal.y-style.f10 > .s8').textContent * 1;
                const op = tr.querySelector('td.tal.y-style > a[href^="u.php?action-show-uid-"]');
                const opUid = op ? Number.parseInt(op.getAttribute('href').substring(22)) : null;
                return {
                    opUid,
                    opHashId: null,
                    replyCount,
                    byElem
                };
            });
    }
    await transformReplyCells(itemList);
}

function getScaledValue(watchItem, min, max) {
    return min + (max - min) * Math.pow(Math.min(OLD_ITEM_THRESHOLD_DAYS, Math.floor(getPostAge(watchItem))), OLD_ITEM_SCALING) / Math.pow(OLD_ITEM_THRESHOLD_DAYS, OLD_ITEM_SCALING);
}

function getPostAge(watchItem) {
    return (Date.now() - watchItem.timeOpened) / 86400000;
}

function getWatchExpiryDays(watchItem) {
    switch (watchItem.areaName) {
        case REQUEST_ZONE_NAME:
            return 45;
        case '茶馆':
            return 120;
        case '茶楼':
            return 60;
        default:
        return -1;
    }
}

function isWatchExpired(watchItem) {
    if (watchItem.timeOpened == null) { // impossible actually
        return false;
    } else {
        const expiryDays = getWatchExpiryDays(watchItem);
        if (expiryDays < 0) {
            return false;
        } else {
            return Date.now() - watchItem.timeOpened > expiryDays * 86400000;
        }
    }
}

function createInfiniteScrollHandler(typeId, infConfig, userConfig, mainConfigAccess) {
    const configKey = 'infiniteScroll$' + typeId;
    const enableEffect = {
        value: !!userConfig[configKey],
        listeners: [],
        setValue(newValue) {
            this.value = newValue;
            this.listeners.forEach(fn => fn());
            if (this.value) {
                install();
            } else {
                uninstall();
            }
        }
    };
    const cfg = Object.assign({
        initPaginator(doc) {
            const pagesones = Array.from(doc.querySelectorAll('.pages > ul > li.pagesone'));
            if (pagesones.length === 0) {
                return null;
            }
            pagesones.forEach(el => addInfSwitch(el));
            
            const pagesone = pagesones.pop();
            const otherPageBars = pagesones.map(el => el.closest('.pages'));
            const match = pagesone.textContent.match(/Pages:\s*(\d+)(?: *\u2013 *(\d+))?\/(\d+)/);
            let curPageStart = match[1] * 1;
            let curPageEnd = (match[2]||match[1]) * 1;
            const maxPage = match[3] * 1;
            const curPageLabel = pagesone.closest('ul').querySelector('li > b');
            const curPageElem = curPageLabel.parentNode;
            let morePageElems = [];
            let pageElem = curPageElem.nextElementSibling;
            while (!pageElem.classList.contains('pagesone')) {
                morePageElems.push(pageElem);
                pageElem = pageElem.nextElementSibling;
            }
            morePageElems.pop();
            return {
                getMorePageElems() {
                    return morePageElems;
                },
                getCurrentStart() {
                    return curPageStart;
                },
                getCurrentEnd() {
                    return curPageEnd;
                },
                getMaxPage() {
                    return maxPage;
                },
                getNextPageURL() {
                    return morePageElems.length > 0 ? morePageElems[0].querySelector('a[href]').href : null;
                },
                setCurrentEnd(paginator) {
                    curPageEnd = paginator.getCurrentEnd();
                    const cur = curPageStart === curPageEnd ? curPageStart : `${curPageStart} \u2013 ${curPageEnd}`;
                    const input = pagesone.querySelector('input');
                    doc.body.appendChild(input);
                    pagesone.textContent = `Pages: ${cur}/${maxPage}\u00A0 \u00A0 \u00A0Go `;
                    pagesone.appendChild(input);
                    curPageLabel.textContent = cur;
                    while (morePageElems.length > 0) {
                        morePageElems.pop().remove();
                    }
                    const temp = doc.createElement('div');
                    temp.innerHTML = paginator.getMorePageElems().map(el => el.outerHTML).join('');
                    morePageElems = Array.from(temp.children);
                    morePageElems.slice().reverse().forEach(el => {
                        curPageElem.parentNode.insertBefore(el, curPageElem.nextElementSibling);
                    });
                    temp.remove();
                    otherPageBars.forEach(el => {
                        const extraSwitches = Array.from(el.querySelectorAll('.pagesone ~ li')); // retain added switches
                        extraSwitches.forEach(ext => document.body.appendChild(ext));
                        el.innerHTML = pagesone.closest('.pages').innerHTML;
                        el.querySelectorAll('.pagesone ~ li').forEach(el => el.remove());
                        extraSwitches.forEach(ext => el.querySelector('.pagesone').parentNode.appendChild(ext));
                    });
                }
            };
            function addInfSwitch(pagesone) {
                const li = addElem(pagesone.closest('ul'), 'li');
                const infToggle = addElem(li, 'a', 'rinsp-infscroll-switch', { href: 'javascript:', title: '自动加载下一页' });
                infToggle.textContent = '↷';
                infToggle.addEventListener('click', async () => {
                    const newUserConfig = await mainConfigAccess.update(updatingUserConfig => {
                        updatingUserConfig[configKey] = !enableEffect.value;
                        return updatingUserConfig;
                    });
                    enableEffect.setValue(!!newUserConfig[configKey]);
                });
                function update() {
                    if (enableEffect.value) {
                        infToggle.classList.add('rinsp-active');
                    } else {
                        infToggle.classList.remove('rinsp-active');
                    }
                }
                enableEffect.listeners.push(update);
                update();
            }
        },
        getItemId(item) {
            return null;
        },
        getContentItems(doc) {
            return [];
        },
        appendContentItems(items, start, end) {

        },
        getDividerLabel(page) {
            return `第 ${page} 页`;
        }
    }, infConfig);
    const paginator = cfg.initPaginator(document);
    if (paginator == null) {
        return;
    }
    let prepareFlipTimer = null;
    let triggerFlipTimer = null;
    const endTrigger = addElem(document.body, 'div', 'rinsp-infscroll-page-endtrigger');
    addElem(endTrigger, 'div', 'rinsp-infscroll-loader-bar');

    const delayBeforeFlipPage = 500;
    const delayBeforeAllowFlipPage = 200;
    const stayBottomThreshold = 15;
    const triggerMargin = 5;

    let currentState = 0;
    function setInfScrollState(state) {
        currentState = state;
        function clearPrepare() {
            if (prepareFlipTimer) {
                clearTimeout(prepareFlipTimer);
                prepareFlipTimer = null;
            }
        }
        function clearTrigger() {
            if (triggerFlipTimer) {
                clearTimeout(triggerFlipTimer);
                triggerFlipTimer = null;
            }
        }
        if (state === 0) { // idle
            clearPrepare();
            clearTrigger();
            document.documentElement.classList.remove('rinsp-infscroll-armed');
            document.documentElement.classList.remove('rinsp-infscroll-firing');
        } else if (state === 1) { // armed
            document.documentElement.classList.add('rinsp-infscroll-armed');
            document.documentElement.classList.remove('rinsp-infscroll-firing');
            clearPrepare();
            clearTrigger();
        } else if (state === 2) { // firing
            document.documentElement.classList.add('rinsp-infscroll-armed');
            document.documentElement.classList.add('rinsp-infscroll-firing');
            clearPrepare();
        }
    }
    const scrollEventListener = () => {
        const bottomGap = document.body.scrollHeight - window.scrollY - window.innerHeight;
        if (bottomGap <= triggerMargin) {
            if (currentState === 1) {
                setInfScrollState(2);
                if (triggerFlipTimer == null) {
                    triggerFlipTimer = setTimeout(async () => {
                        setInfScrollState(0);
                        await insertNextPageSync();
                    }, delayBeforeFlipPage);
                }
            } else if (currentState === 0) {
                if (prepareFlipTimer == null) {
                    const nextPageURL = paginator.getNextPageURL();
                    if (nextPageURL != null) {
                        fetchNextPage(nextPageURL); // prefetch
                    }
                    prepareFlipTimer = setTimeout(() => {
                        setInfScrollState(1);
                    }, delayBeforeAllowFlipPage);
                }
            }
        } else if (bottomGap > stayBottomThreshold) {
            setInfScrollState(0);
        }
    };

    function install() {
        uninstall();
        if (paginator.getNextPageURL() == null) {
            return;
        }
        document.documentElement.classList.add('rinsp-infscroll-enabled');
        window.addEventListener('scroll', scrollEventListener);
    }
    function uninstall() {
        document.documentElement.classList.remove('rinsp-infscroll-enabled');
        setInfScrollState(0);
        window.removeEventListener('scroll', scrollEventListener);
    }

    let busy = false;
    let nextPageCache = { expiry: Date.now(), url: null, data: null };
    async function fetchNextPage(url) {
        if (nextPageCache.url === url && nextPageCache.expiry > Date.now()) {
            return nextPageCache.data;
        }
        const data = fetchGetPage(url, null, true);
        nextPageCache = {
            url,
            expiry: Date.now() + 10000, // 10 seconds
            data
        };
        return data;
    }

    async function insertNextPageSync() {
        if (!busy) {
            busy = true;
            await insertNextPage()
                .then(obj => {
                    if (obj && userConfig.infiniteScrollScrollToNewPage) {
                        obj.scrollToNewPage();
                    }
                })
                .finally(() => { busy = false; });
        }
    }
    async function insertNextPage() {
        const nextPageURL = paginator.getNextPageURL();
        if (nextPageURL == null) {
            return;
        }
        const oldScrollTop = document.documentElement.scrollTop;
        const divider = cfg.appendDivider();
        divider.classList.add('rinsp-infscroll-loading');
        divider.textContent = `第 ${paginator.getCurrentEnd() + 1} 页 - 加载中 ...`;
        const nextDoc = await fetchNextPage(nextPageURL);
        if (isFastLoadMode()) {
            deferImageLoading(nextDoc);
        }
        const currentIds = new Set(Array.from(cfg.getContentItems(document)).map(item => cfg.getItemId(item)).filter(item => item != null));
        const newItems = Array.from(cfg.getContentItems(nextDoc)).filter(item => {
            const itemId = cfg.getItemId(item);
            return itemId == null || !currentIds.has(itemId);
        });
        const newPaginator = cfg.initPaginator(nextDoc);
        if (newPaginator == null) {
            divider.textContent = '找不到更多记录';
            uninstall();
            return;
        }
        divider.textContent = cfg.getDividerLabel(newPaginator.getCurrentStart());
        divider.classList.remove('rinsp-infscroll-loading');
        cfg.appendContentItems(newItems);
        paginator.setCurrentEnd(newPaginator);
        if (paginator.getCurrentEnd() >= paginator.getMaxPage()) {
            uninstall();
        }
        if (userConfig.infiniteScrollReplaceURL) {
            window.history.replaceState(null, null, nextPageURL);
        }
        if (isFastLoadMode()) {
            resumeImageLoading(document);
        }
        try { unsafeWindow.peacemaker.rescan(); } catch (ex) {}
        document.documentElement.scrollTop = oldScrollTop;
        return {
            scrollToNewPage() {
                divider.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        };
    }

    if (enableEffect.value) {
        install();
    }
}

function setupInfiniteScroll_userTopics(userConfig, mainConfigAccess) {
    const table = document.querySelector('#u-contentmain > .u-table');

    createInfiniteScrollHandler('usertopics', {
        getContentItems(doc) {
            return doc.querySelectorAll('#u-contentmain > .u-table > tbody > tr ~ tr');
        },
        appendDivider() {
            return addElem(addElem(addElem(table, 'tbody', 'rinsp-infscroll-divider'), 'tr'), 'td', null, { colspan: '2' });
        },
        appendContentItems(items) {
            const nextPageBody = addElem(table, 'tbody');
            items.forEach(item => nextPageBody.appendChild(item));
        },
        getItemId(item) {
            const a = item.querySelector('th > a[href^="read.php?tid-"]');
            return a ? a.getAttribute('href') : null;
        }
    }, userConfig, mainConfigAccess);

}

function setupInfiniteScroll_userReplies(userConfig, mainConfigAccess) {
    const table = document.querySelector('#u-contentmain > .u-table');

    createInfiniteScrollHandler('userposts', {
        getContentItems(doc) {
            return doc.querySelectorAll('#u-contentmain > .u-table > tbody > tr ~ tr');
        },
        appendDivider() {
            return addElem(addElem(addElem(table, 'tbody', 'rinsp-infscroll-divider'), 'tr'), 'td', null, { colspan: '2' });
        },
        appendContentItems(items) {
            const nextPageBody = addElem(table, 'tbody');
            items.forEach(item => nextPageBody.appendChild(item));
        },
        getItemId(item) {
            const a = item.querySelector('th > a[href^="job.php?action-topost-tid-"]');
            return a ? a.getAttribute('href') : null;
        }
    }, userConfig, mainConfigAccess);

}

function setupInfiniteScroll_thread(userConfig, mainConfigAccess) {
    const form = document.querySelector('form[name="delatc"]');

    createInfiniteScrollHandler('thread_posts', {
        getContentItems(doc) {
            const rows = Array.from(doc.querySelector('form[name="delatc"]').children);
            while (rows[0].tagName === 'INPUT') {
                rows.shift();
            }
            return rows;
        },
        appendDivider() {
            return addElem(form, 'div', 'rinsp-infscroll-divider');
        },
        appendContentItems(items) {
            items.forEach(item => {
                if (item.matches('.t5.t2[style="border-top:0"]')) {
                    item.removeAttribute('style');
                }
                form.appendChild(item);
            });
        },
        getItemId(item) {
            const idCell = item.querySelector('.t5.t2 tr > th[id^="td_"], div[id^="menu_read_"]');
            if (idCell) {
                return idCell.getAttribute('id');
            }
            if (item.matches('a[name]')) {
                return 'a:' + item.getAttribute('name');
            }
            return null;
        }
    }, userConfig, mainConfigAccess);

}

function setupInfiniteScroll_search(userConfig, mainConfigAccess) {
    const table = document.querySelector('#main > .t > table');

    createInfiniteScrollHandler('search', {
        getContentItems(doc) {
            return doc.querySelectorAll('#main > .t > table > tbody > .tr2, #main > .t > table > tbody > .tr3');
        },
        appendDivider() {
            return addElem(addElem(addElem(table, 'tbody', 'rinsp-infscroll-divider'), 'tr'), 'td', null, { colspan: '7' });
        },
        appendContentItems(items) {
            const endPaddingRow = table.querySelector('tbody > tr > td.f_one[colspan]');
            const nextPageBody = addElem(table, 'tbody');
            items.forEach(item => nextPageBody.appendChild(item));
            if (endPaddingRow) {
                nextPageBody.appendChild(endPaddingRow);
            }
        },
        getItemId(item) {
            const link = item.querySelector('.tr3 > th > a[href^="read.php?tid-"]');
            return link ? Number.parseInt(link.getAttribute('href').substring(13)) : null;
        }
    }, userConfig, mainConfigAccess);

}

function setupInfiniteScroll_threadList(userConfig, mainConfigAccess) {
    const table = document.querySelector('#ajaxtable');

    createInfiniteScrollHandler('threads', {
        getContentItems(doc) {
            return doc.querySelectorAll('#ajaxtable > tbody + tbody > .tr2, #ajaxtable > tbody + tbody > tr.t_one');
        },
        appendDivider() {
            return addElem(addElem(addElem(table, 'tbody', 'rinsp-infscroll-divider'), 'tr'), 'td', null, { colspan: '5' });
        },
        appendContentItems(items) {
            const endPaddingRow = table.querySelector('tbody > tr > td.f_one[colspan]');
            const nextPageBody = addElem(table, 'tbody');
            items.forEach(item => nextPageBody.appendChild(item));
            if (endPaddingRow) {
                nextPageBody.appendChild(endPaddingRow);
            }
        },
        getItemId(item) {
            const idCell = item.querySelector('.t_one > td[id^="td_"]');
            return idCell ? idCell.getAttribute('id') : null;
        }
    }, userConfig, mainConfigAccess);

}

function setupInfiniteScroll_threadPicWall(userConfig, mainConfigAccess) {
    const container = document.querySelector('#thread_img > .dcsns-content');

    createInfiniteScrollHandler('threads_picwall', {
        getContentItems(doc) {
            return doc.querySelectorAll('#thread_img > .dcsns-content > .stream > li');
        },
        appendDivider() {
            return addElem(container, 'div', 'rinsp-infscroll-divider');
        },
        appendContentItems(items) {
            const nextWall = addElem(container, 'ul', 'stream');
            items.forEach(item => nextWall.appendChild(item));
            try {
                unsafeWindow.jQuery('img.lazy', nextWall).lazyload({ skip_invisible : false });
            } catch (ignore) {}
        },
        getItemId(item) {
            const link = item.querySelector('.section-title > a[href]');
            return link ? link.getAttribute('href') : null;
        }
    }, userConfig, mainConfigAccess);

}

function setupInfiniteScroll_msgInbox(userConfig, mainConfigAccess) {
    const table = document.querySelector('#info_base .set-table2');

    createInfiniteScrollHandler('msg_inbox', {
        getContentItems(doc) {
            return doc.querySelectorAll('#info_base .set-table2 > tbody > tr');
        },
        appendDivider() {
            return addElem(addElem(addElem(table, 'tbody', 'rinsp-infscroll-divider'), 'tr'), 'td', null, { colspan: '5' });
        },
        appendContentItems(items) {
            const nextTbody = addElem(table, 'tbody');
            items.forEach(item => nextTbody.appendChild(item));
        },
        getItemId(item) {
            const link = item.querySelector('input[name="delid[]"]');
            return link ? link.value : null;
        }
    }, userConfig, mainConfigAccess);

}

function setupInfiniteScroll_msgSent(userConfig, mainConfigAccess) {
    const table = document.querySelector('#info_base .set-table2');

    createInfiniteScrollHandler('msg_sent', {
        getContentItems(doc) {
            return doc.querySelectorAll('#info_base .set-table2 > tbody > tr');
        },
        appendDivider() {
            return addElem(addElem(addElem(table, 'tbody', 'rinsp-infscroll-divider'), 'tr'), 'td', null, { colspan: '7' });
        },
        appendContentItems(items) {
            const nextTbody = addElem(table, 'tbody');
            items.forEach(item => nextTbody.appendChild(item));
        },
        getItemId(item) {
            const link = item.querySelector('input[name="delid[]"]');
            return link ? link.value : null;
        }
    }, userConfig, mainConfigAccess);

}

function setupInfiniteScroll_msgChatLog(userConfig, mainConfigAccess) {
    const table = document.querySelector('#info_base .set-table2');

    createInfiniteScrollHandler('msg_chatlog', {
        getContentItems(doc) {
            return doc.querySelectorAll('#info_base .set-table2 > tbody > tr');
        },
        appendDivider() {
            return addElem(addElem(addElem(table, 'tbody', 'rinsp-infscroll-divider'), 'tr'), 'td', null, { colspan: '7' });
        },
        appendContentItems(items) {
            const nextTbody = addElem(table, 'tbody');
            items.forEach(item => nextTbody.appendChild(item));
        },
        getItemId(item) {
            const link = item.querySelector('input[name="delid[]"]');
            return link ? link.value : null;
        }
    }, userConfig, mainConfigAccess);

}

function submitOriginalForm(form) {
    submitPostForm(form.getAttribute('action'), new FormData(form), form.getAttribute('target')||null);
}

function submitPostForm(action, formData, target) {
    const newForm = addElem(document.body, 'form', null, {
        action: action,
        method: 'post',
        target: target||''
    });
    formData.forEach((value, key) => {
        addElem(newForm, 'input', null, { type: 'hidden', name: key, value: value });
    });
    newForm.submit();
}

//============= admin =============//

function renderPunishTags(uid, record) {
    const tags = newElem('a', 'rinsp-profile-punish-tags', { href: `u.php?action-trade-uid-${uid}.html`, target: '_blank' });
    let bloodCount = 0;
    let banCount = 0;
    let delCount = 0;
    let otherCount = 0;
    record.logs.forEach(log => {
        switch (log.type) {
            case PUNISH_TYPE_HP:
                bloodCount++;
                break;
            case PUNISH_TYPE_BAN:
                banCount++;
                break;
            case PUNISH_TYPE_DELETE_THREAD:
            case PUNISH_TYPE_DELETE_REPLY:
            case PUNISH_TYPE_SHIELD:
                delCount++;
                break;
            case PUNISH_TYPE_UNSHIELD:
                // skip
                break;
            default:
                otherCount++;
        }
    });
    const putCountTag = (count, tag) => {
        if (count > 0) {
            addElem(tags, 'span', 'rinsp-profile-punish-tag rinsp-profile-punish-tag-' + tag).textContent = `${count}`;
        }
    };
    putCountTag(bloodCount, 'blood');
    putCountTag(banCount, 'ban');
    putCountTag(delCount, 'del');
    putCountTag(otherCount, 'misc');
    return tags;
}

function initAdminFunctions(myUserId, userConfig, userPunishRecordStore) {
    const NO_PING_NOTIFICATION = 'no-ping-mail';
    const extraPageParams = {};
    if (document.location.hash) {
        const pairs = document.location.hash.substring(1).split('-');
        while (pairs.length > 0) {
            const key = pairs.shift();
            const value = pairs.shift();
            extraPageParams[key] = value;
        }
    }

    const adminTemplateConfigAccess = initConfigAccess(myUserId, ADMIN_TEMPLATE_CONFIG_KEY, DEFAULT_ADMIN_TEMPLATEUSER_FILTER_CONFIG);

    async function recordPunishment(uid, type, summary, reason, data) {
        let punishRecord = await userPunishRecordStore.get(uid);
        if (punishRecord == null) {
            punishRecord = {
                uid,
                logs: []
            };
        }
        punishRecord.logs.push({
            time: Date.now(),
            type,
            summary,
            reason,
            data
        });
        await userPunishRecordStore.put(uid, punishRecord);
    }

    async function openReasonTemplateEditor(callback) {
        openTextListEditor(SCORING_REASON_TEMPLATE_POPUP_MENU_ID, {
            title: '常用评分或操作理由列表',
            async read() {
                const adminTemplate = await adminTemplateConfigAccess.read();
                const text = adminTemplate.pingReasons.join('\n');
                if (text.length === 0) {
                    return DEFAULT_ADMIN_TEMPLATEUSER_FILTER_CONFIG.pingReasons.slice().join('\n');
                }
                return text;
            },
            async save(textData) {
                return await adminTemplateConfigAccess.update(function(adminTemplate) {
                    adminTemplate.pingReasons = textData.split('\n').map(itm=>itm.trim()).filter(itm=>!!itm);
                    return adminTemplate;
                });
            }
        }, callback);
    }
    
    async function enableQuickPingFunction() {
        let gfPost = getPosts(document, 1)[0];
        if (gfPost == null || gfPost.floor !== 0) {
            return;
        }
        const postTitleElem = document.querySelector('#subject_tpc');
        if (postTitleElem == null) {
            return;
        }
        const postTitle = postTitleElem.textContent.trim();
        const postTime = gfPost.postTime;
        const postUid = gfPost.postUid;

        const headtopicButton = document.querySelector('.fl > #headtopic');
        if (headtopicButton) { // scoring allowed
            const markElem = document.querySelector('#mark_tpc');
            if (markElem) {
                const pingStatus = newElem('a', 'rinsp-quickping-status');
                const score = (markElem.textContent.match(/SP币:([+-]\d+)\b/)||[])[1];
                if (score) {
                    pingStatus.textContent = '已评分: SP' + score;
                } else {
                    pingStatus.textContent = '已评分';
                }
                headtopicButton.parentNode.prepend(pingStatus);
            } else {
                const currentPostLink = document.querySelector('#breadcrumbs > .crumbs-item.current > strong > a[href^="read.php?tid-"]');
                if (currentPostLink == null)
                    return;
                const tid = Number.parseInt(currentPostLink.getAttribute('href').substring(13));
                const fidLink = currentPostLink.closest('.crumbs-item').previousElementSibling.getAttribute('href');
                const fid = Number.parseInt(fidLink.substring(15)); // e.g. "thread.php?fid-4.html"
                const defaultRating = getDefaultRating(postTitle);

                let instantPingButton = null;
                if (defaultRating.baseTotalScore > 0 && defaultRating.baseTotalScore < 99999) {
                    if (!defaultRating.ownBought && !defaultRating.ownTranslate) {
                        const notif = !userConfig.adminNoScoreNotifByDefault;
                        const score = Math.min(Math.max(1, Math.floor(defaultRating.baseTotalScore)), 99999);
                        instantPingButton = newElem('a', 'rinsp-instantping-button');
                        instantPingButton.setAttribute('href', 'javascript:void(0)');
                        instantPingButton.textContent = notif ? `一键SP+${score}` : `一键SP+${score} (不通知)`;
                        instantPingButton.addEventListener('click', () => {
                            executeScoreThenReload(null, fid, tid, score, 0, {}, notif, '');
                            return false;
                        });
                        headtopicButton.parentNode.prepend(instantPingButton);
                        headtopicButton.parentNode.prepend(document.createTextNode(' | '));
                    }
                }
                
                const quickPingButton = newElem('a', 'rinsp-quickping-button');
                quickPingButton.setAttribute('href', 'javascript:void(0)');
                quickPingButton.textContent = '快捷评分';
                quickPingButton.addEventListener('click', () => {
                    let dayAge = (Date.now() - postTime) / 86400000;
                    openScoringDialog(tid, fid, postTitle, dayAge, defaultRating);
                    return false;
                });
                headtopicButton.parentNode.prepend(quickPingButton);

                if (!userConfig.adminHideMarkBadFormatButton) {
                    headtopicButton.parentNode.append(document.createTextNode(' | '));

                    const badFormatButton = newElem('a', 'rinsp-noping-button');
                    badFormatButton.setAttribute('href', 'javascript:void(0)');
                    badFormatButton.textContent = '格式不正';
                    badFormatButton.addEventListener('click', () => {
                        executeScoreThenReload(null, fid, tid, -1, 0, {}, true, '请修正格式问题');
                        return false;
                    });
                    headtopicButton.parentNode.append(badFormatButton);
                }
                
                if (!userConfig.adminHideMarkUnscoreButton) {
                    headtopicButton.parentNode.append(document.createTextNode(' | '));
                    const noPingButton = newElem('a', 'rinsp-noping-button');
                    noPingButton.setAttribute('href', 'javascript:void(0)');
                    noPingButton.textContent = '标记不评分';
                    noPingButton.addEventListener('click', () => {
                        executeScoreThenReload(null, fid, tid, 1, 0, {}, false, '');
                        return false;
                    });
                    headtopicButton.parentNode.append(noPingButton);
                }

                const customNameEntry = userConfig.customUserHashIdMappings['#' + postUid];
                if (customNameEntry && customNameEntry[2].startsWith(NEVER_SCORE_USER_PREFIX)) {
                    quickPingButton.classList.add('rinsp-quickping-grey');
                    if (instantPingButton) {
                        instantPingButton.classList.add('rinsp-instantping-grey');
                    }
                }

            }
        }
    }

    async function enhanceReasonSelector() {
        const reasonField = document.querySelector('form[action] textarea[name="atc_content"]');
        if (reasonField == null) {
            return;
        }
        const reasonSelect = reasonField.nextElementSibling;
        if (reasonSelect == null || reasonSelect.tagName !== 'SELECT' || !!reasonSelect.getAttribute('name')) {
            return;
        }
        const replacement = addReasonSelector(reasonField);
        replacement.setAttribute('style', 'display:inline-block;vertical-align:top');
        reasonField.parentNode.insertBefore(replacement, reasonSelect);
        reasonSelect.remove();
    }

    function autoFillShowPingPage() {
        const postTitle = (document.querySelector('form[name="ping"] .tr3 > th > a[href^="read.php?tid-"]')||{}).textContent||'';
        const defaultRating = getDefaultRating(postTitle);
        const addPointField = document.querySelector('form[name="ping"] input[name="addpoint"]');
        if (defaultRating.baseTotalScore > 0) {
            addPointField.value = String(Math.max(1, Math.floor(defaultRating.baseTotalScore)));
        } else {
            addPointField.value = '';
            setTimeout(() => addPointField.focus());
        }
    }

    const OPTION_SEPARATOR_VALUE = ' NONE ';
    const OPTION_CLEAR_ACTION_VALUE = ' CLEAR ';

    async function updateReasonSelect(reasonSelect, reasonField) {
        function addOption(value, label) {
            let option = addElem(reasonSelect, 'option');
            option.setAttribute('value', value);
            option.textContent = label;
        }
        reasonSelect.innerHTML = '';
        addOption('', '自定义');
        addOption(OPTION_CLEAR_ACTION_VALUE, '清除');
        addOption(OPTION_SEPARATOR_VALUE, '-------');
        const adminTemplate = await adminTemplateConfigAccess.read();
        adminTemplate.pingReasons.forEach(item => {
            item = item.trim();
            if (item) {
                if (item.match(/---+/)) {
                    addOption(OPTION_SEPARATOR_VALUE, '-------');
                } else {
                    addOption(item.replace(/\|/g, '\n'), item.substring(0, 10));
                }
            }
        });
        reasonSelect.value = reasonField.value.trim();
        reasonSelect.value = reasonSelect.value||'';
    }

    function addReasonSelector(reasonField) {
        const reasonTemplateElem = newElem('div');
        const reasonSelect = addElem(reasonTemplateElem, 'select');
        reasonSelect.setAttribute('name', '');
        reasonSelect.setAttribute('size', '6');
        reasonSelect.addEventListener('change', () => {
            if (reasonSelect.value === '' || reasonSelect.value === OPTION_SEPARATOR_VALUE) {
                reasonSelect.value = '';
            } else if (reasonSelect.value === OPTION_CLEAR_ACTION_VALUE) {
                reasonSelect.value = '';
                reasonField.value = '';
            } else {
                reasonField.value = reasonSelect.value;
            }
        });
        reasonField.addEventListener('change', () => {
            reasonSelect.value = reasonField.value.trim();
            reasonSelect.value = reasonSelect.value||'';
        });
        addElem(reasonTemplateElem, 'div');
        const editTemplateButton = addElem(reasonTemplateElem, 'a');
        editTemplateButton.setAttribute('href', 'javascript:void(0)');
        editTemplateButton.textContent = '📝编辑常用列表';
        editTemplateButton.addEventListener('click', () => {
            openReasonTemplateEditor(() => updateReasonSelect(reasonSelect, reasonField));
        });

        updateReasonSelect(reasonSelect, reasonField);
        return reasonTemplateElem;
    }

    async function openScoringDialog(tid, fid, postTitle, postAgeInDays, defaultRating) {
        const preset = DEFAULT_SCORING_PRESETS[`fid=${fid}`] || DEFAULT_SCORING_PRESETS['fid=*'];
        const anchor = null;
        const modelMask = addModalMask();
        const popupMenu = createPopupMenu(SCORING_DIALOG_POPUP_MENU_ID, anchor);
    
        popupMenu.renderContent(async function(borElem) {

            addElem(borElem, 'div', 'rinsp-quickping-subject').textContent = postTitle;
            const form = addElem(borElem, 'dl', 'rinsp-quickping-form');
            addElem(form, 'dt').textContent = '发帖日期';
            addElem(form, 'dd').textContent = postAgeInDays <= 1 ? '一天内' : postAgeInDays <= 2 ? '昨天' : `${Math.floor(postAgeInDays)} 天前`;
            addElem(form, 'div');

            addElem(form, 'dt').textContent = '资源大小';
            const sizeCell = addElem(form, 'dd');
            addElem(form, 'div');
            addElem(form, 'dt').textContent = '基础评分';
            const baseScoreCell = addElem(form, 'dd');
            const baseScoreInputField = addElem(baseScoreCell, 'input');
            baseScoreInputField.setAttribute('size', '12');

            addElem(baseScoreCell, 'span').textContent = ' \u00A0 \u00A0 可加乘部分: ';

            const multiBaseScoreInputField = addElem(baseScoreCell, 'input');
            multiBaseScoreInputField.setAttribute('type', 'text');
            multiBaseScoreInputField.setAttribute('size', '10');
            multiBaseScoreInputField.setAttribute('placeholder', '(全部)');


            baseScoreInputField.setAttribute('type', 'text');
            const resourcePackToggles = [];
            if (defaultRating.baseTotalScore) {
                baseScoreInputField.value = defaultRating.baseTotalScore;
            } else {
                setTimeout(() => baseScoreInputField.focus());
            }
            if (defaultRating.resourceSizeTexts.length === 0) {
                sizeCell.textContent = '不明';
            } else if (defaultRating.resourceSizeTexts.length === 1) {
                sizeCell.textContent = defaultRating.resourceSizeTexts[0];
            } else {
                const computeAutofillScore = () => {
                    let totalSizeMB = 0;
                    resourcePackToggles.forEach(toggle => {
                        if (toggle.checkbox.checked) {
                            totalSizeMB += toggle.sizeMB;
                        }
                    });
                    baseScoreInputField.value = computeBaseScoreText(totalSizeMB);
                    updatePreview();
                };
                const updateSizeCheckboxes = () => {
                    const sizeMB = Math.ceil(baseScoreInputField.value * 10);
                    if (sizeMB > 0) {
                        let remain = sizeMB;
                        resourcePackToggles.forEach(toggle => {
                            if (remain >= toggle.sizeMB) {
                                remain -= toggle.sizeMB;
                                toggle.checkbox.checked = true;
                            } else {
                                toggle.checkbox.checked = false;
                            }
                        });
                    } else {
                        resourcePackToggles.forEach(toggle => toggle.checkbox.checked = false);
                    }
                };
                defaultRating.resourceSizeTexts.forEach((sizeText, i) => {
                    if (i > 0) {
                        addElem(sizeCell, 'span').textContent = ' ';
                    }
                    const item = addElem(sizeCell, 'label');
                    const checkbox = addElem(item, 'input', null, { type: 'checkbox' });
                    addElem(item, 'span', null, { style: 'vertical-align:bottom' }).textContent = sizeText;
                    resourcePackToggles.push({
                        checkbox,
                        sizeMB: defaultRating.resourceSizeMBs[i]
                    });
                    checkbox.addEventListener('change', computeAutofillScore);
                });
                resourcePackToggles.sort(comparator(toggle => toggle.sizeMB, true));
                baseScoreInputField.addEventListener('change', updateSizeCheckboxes);
                baseScoreInputField.addEventListener('keyup', updateSizeCheckboxes);
            }

            addElem(form, 'div');
            addElem(form, 'dt').textContent = '加亮置顶';
            const attCell = addElem(form, 'dd');

            const ownBoughtLabel = addElem(attCell, 'label', 'rinsp-quickping-attr-ownbought');
            const ownBoughtField = addElem(ownBoughtLabel, 'input');
            ownBoughtLabel.appendChild(document.createTextNode('自购 / 原创首发'));
            ownBoughtField.setAttribute('type', 'checkbox');
            if (defaultRating.ownBought) {
                ownBoughtField.checked = true;
            }

            const ownTranslateLabel = addElem(attCell, 'label', 'rinsp-quickping-attr-owntranslate');
            const ownTranslateField = addElem(ownTranslateLabel, 'input');
            ownTranslateLabel.appendChild(document.createTextNode('红字 (例: 个人汉化游戏)'));
            ownTranslateField.setAttribute('type', 'checkbox');

            const compilationLabel = addElem(attCell, 'label', 'rinsp-quickping-attr-compilation');
            const compilationField = addElem(compilationLabel, 'input');
            compilationLabel.appendChild(document.createTextNode('优秀合集'));
            compilationField.setAttribute('type', 'checkbox');

            const extraScores = [];
            preset.extraScoreAdjustments.forEach(extra => {
                const extraOffsetLabel = addElem(attCell, 'label', 'rinsp-quickping-attr-extra');
                const extraOffsetField = addElem(extraOffsetLabel, 'input');
                extraOffsetLabel.appendChild(document.createTextNode(extra.label));
                extraOffsetField.setAttribute('type', 'checkbox');
                extraScores.push({
                    amount: extra.amount,
                    reason: extra.reason||'',
                    checkbox: extraOffsetField
                });
            });


            addElem(form, 'div');
            addElem(form, 'dt').textContent = '评分加乘';
            const multiScoreCell = addElem(form, 'dd');
            const multiScoreInputField = addElem(multiScoreCell, 'input');
            multiScoreInputField.setAttribute('type', 'text');
            multiScoreInputField.setAttribute('size', '12');
            
            addElem(form, 'div');
            addElem(form, 'dt').textContent = '置顶';
            const headtopCell = addElem(form, 'dd');
            const headtopInputField = addElem(headtopCell, 'input');
            headtopInputField.setAttribute('type', 'text');
            headtopInputField.setAttribute('size', '12');

            addElem(form, 'div');
            addElem(form, 'dt').textContent = '其他';
            const notifyCell = addElem(form, 'dd');
            const notifyLabel = addElem(notifyCell, 'label');
            const notifyField = addElem(notifyLabel, 'input');
            notifyLabel.appendChild(document.createTextNode('评分消息通知'));
            notifyField.setAttribute('type', 'checkbox');
            addElem(notifyCell, 'small').textContent = ' (加亮及置顶消息一律自动通知)';

            // NO_PING_NOTIFICATION
            notifyField.checked = !userConfig.adminNoScoreNotifByDefault;

            addElem(form, 'div');
            addElem(form, 'dt').textContent = '评分理由';
            const reasonCell = addElem(form, 'dd', 'rinsp-quickping-reason-cell');
            const reasonField = addElem(reasonCell, 'textarea');
            const templateColumn = addElem(reasonCell, 'div');
            templateColumn.appendChild(addReasonSelector(reasonField));

            addElem(form, 'div');
            addElem(form, 'dt').textContent = '最终效果';
            const previewSection = addElem(form, 'div', 'rinsp-quickping-preview-section');
            const previewCell = addElem(previewSection, 'div');

            baseScoreInputField.addEventListener('change', () => updatePreview());
            baseScoreInputField.addEventListener('keyup', () => updatePreview());
            multiBaseScoreInputField.addEventListener('change', () => updatePreview());
            multiBaseScoreInputField.addEventListener('keyup', () => updatePreview());
            multiScoreInputField.addEventListener('change', () => updatePreview());
            multiScoreInputField.addEventListener('keyup', () => updatePreview());
            headtopInputField.addEventListener('change', () => updatePreview());
            headtopInputField.addEventListener('keyup', () => updatePreview());
            ownBoughtField.addEventListener('change', () => updatePreview());
            ownTranslateField.addEventListener('change', () => updatePreview());
            compilationField.addEventListener('change', () => updatePreview());

            extraScores.forEach(extra => {
                extra.checkbox.addEventListener('change', () => {
                    if (extra.reason) {
                        const currentReason = reasonField.value.trim();
                        if (extra.checkbox.checked) {
                            if (currentReason.length === 0) {
                                reasonField.value = extra.reason;
                            }
                        } else {
                            if (currentReason === extra.reason) {
                                reasonField.value = '';
                            }
                        }
                    }
                    
                    updatePreview();
                });
            });


            function updatePreview() {
                previewCell.textContent = '';
                previewCell.setAttribute('class', '');

                const defaultHeadtopDays = getDefaultHeadtopDays();
                if (defaultHeadtopDays == null) {
                    headtopInputField.setAttribute('placeholder', '自动 (无)');
                } else {
                    if (defaultHeadtopDays[0] > 0) {
                        headtopInputField.setAttribute('placeholder', `自动 (${defaultHeadtopDays[0]}天)`);
                    } else if (defaultHeadtopDays[1] > 0) {
                        headtopInputField.setAttribute('placeholder', '自动 (旧帖省略)');
                    } else {
                        headtopInputField.setAttribute('placeholder', '自动 (无)');
                    }
                }

                multiScoreInputField.setAttribute('placeholder', '自动 (无)');
                const finalScore = getFinalScore();
                const headtopDays = getFinalHeadtopDays();

                if (finalScore == null || headtopDays == null) {
                    previewCell.classList.add('rinsp-quickping-status-error');
                    if (!baseScoreInputField.value.trim()) {
                        previewCell.textContent = '';
                    } else {
                        previewCell.textContent = '输入错误 请更正';
                    }
                } else {
                    if (finalScore.total < 0) {
                        let text = addElem(previewCell, 'span');
                        text.appendChild(document.createTextNode('扣分 '));
                        addElem(previewCell, 'b', null, { style: 'color: red' }).textContent = `${finalScore.total} SP`;
                    } else if (finalScore.multiplier > 1) {
                        let text = addElem(previewCell, 'span');
                        text.appendChild(document.createTextNode('评分'));
                        if (finalScore.nonboostedScore > 0) {
                            text.appendChild(document.createTextNode(` +${finalScore.boostedScore} SP`));
                            addElem(text, 'small').textContent = `(x${finalScore.multiplier})`;
                            text.appendChild(document.createTextNode(` +${finalScore.nonboostedScore} SP`));
                        } else {
                            addElem(text, 'small').textContent = `(x${finalScore.multiplier})`;
                            text.appendChild(document.createTextNode(` +${finalScore.total} SP`));
                        }
                        multiScoreInputField.setAttribute('placeholder', `自动 (x${finalScore.multiplier})`);
                    } else {
                        addElem(previewCell, 'span').textContent = `评分 +${finalScore.total} SP`;
                        multiScoreInputField.setAttribute('placeholder', '自动 (无)');
                    }

                    if (headtopDays > 0) {
                        addElem(previewCell, 'span').textContent = ' | ';
                        addElem(previewCell, 'span').textContent = '置顶 ' + headtopDays + '天';
                    }
                    
                    const hlParams = getHighlightParams();
                    if (hlParams.color || hlParams.bold) {
                        addElem(previewCell, 'span').textContent = ' | ';
                        const hlElem = addElem(previewCell, hlParams.bold ? 'b' : 'span');
                        hlElem.textContent = '加亮';
                        if (hlParams.color) {
                            hlElem.setAttribute('style', 'color:' + hlParams.color);
                        }
                    }
                }
                
            }
            updatePreview();

            function getHighlightParams() {
                let color = compilationField.checked ? '#FF00FF' : ownBoughtField.checked ? '#0000FF' : ownTranslateField.checked ? '#FF0000' : null;
                let bold = compilationField.checked || ownBoughtField.checked || ownTranslateField.checked;
                return { color, bold };
            }

            function getDefaultScoreMultiplier() {
                return ownBoughtField.checked || ownTranslateField.checked ? 10 : 1;
            }

            function getDefaultHeadtopDays() {
                const baseDays = compilationField.checked ? preset.headtopDaysCompilation : ownBoughtField.checked || ownTranslateField.checked ? preset.headtopDaysBought : 0;
                if (postAgeInDays >= baseDays) {
                    return [0, baseDays];
                }
                return [baseDays, baseDays];
            }

            function getFinalHeadtopDays() {
                if (headtopInputField.value.trim().length === 0) {
                    return getDefaultHeadtopDays()[0];
                } else {
                    let days = headtopInputField.value.trim() * 1;
                    if (!Number.isInteger(days) || days < 0)
                        return null; // invalid
                    return days;
                }
            }

            function getFinalScore() {
                let scoreMultiplier;
                if (multiScoreInputField.value.trim().length === 0) {
                    scoreMultiplier = getDefaultScoreMultiplier();
                } else {
                    scoreMultiplier = multiScoreInputField.value.trim() * 1;
                    if (!Number.isInteger(scoreMultiplier) || scoreMultiplier < 1)
                        return null; // invalid
                }
                let baseScore = baseScoreInputField.value * 1;
                if (Number.isNaN(baseScore)) {
                    baseScore = getDefaultRating(baseScoreInputField.value).baseTotalScore;
                }

                let boostableBaseScore = (multiBaseScoreInputField.value.trim()||'9999.9') * 1;
                if (Number.isNaN(boostableBaseScore)) {
                    boostableBaseScore = getDefaultRating(multiBaseScoreInputField.value).baseTotalScore;
                }

                if (Number.isNaN(baseScore) || baseScore == 0 || boostableBaseScore === 0) {
                    return null;
                }
                let scoreOffset = 0;
                for (let extraScore of extraScores) {
                    if (extraScore.checkbox.checked) {
                        scoreOffset += extraScore.amount;
                    }
                }
                if (baseScore < 0) {
                    if (scoreMultiplier === 1) {
                        const rawScore = Math.max(-99999, Math.min(-1, Math.floor(baseScore + scoreOffset)));
                        return {
                            total: rawScore,
                            multiplier: 1,
                            boostedScore: 0,
                            nonboostedScore: rawScore
                        };
                    } else {
                        return null;
                    }
                }
                if (scoreMultiplier > 1) {
                    let boostedScore = Math.floor(Math.min(baseScore, boostableBaseScore) * scoreMultiplier);
                    let nonboostedScore = Math.floor(Math.max(0, baseScore - boostableBaseScore)) + scoreOffset;
                    if (boostedScore + nonboostedScore === 0) {
                        nonboostedScore = 1;
                    }
                    return {
                        total: boostedScore + nonboostedScore,
                        multiplier: scoreMultiplier,
                        boostedScore: boostedScore,
                        nonboostedScore: nonboostedScore
                    };
                } else {
                    const rawScore = Math.max(1, Math.floor(baseScore * scoreMultiplier)) + scoreOffset;
                    return {
                        total: rawScore,
                        multiplier: scoreMultiplier,
                        boostedScore: 0,
                        nonboostedScore: rawScore
                    };
                }
            }

            const footer = addElem(borElem, 'ul', null, {
                style: 'text-align:center;padding:4px 0;'
            });
            const submitButton = addElem(footer, 'input', 'btn', { type: 'button', value: '执行评分' });
            submitButton.addEventListener('click', async function() {
                const finalHeadtopDays = getFinalHeadtopDays();
                const finalScore = getFinalScore();
                if (finalScore == null || finalHeadtopDays == null) {
                    alert('输入错误 请更正');
                } else {
                    modelMask.remove();
                    closePopupMenu(SCORING_DIALOG_POPUP_MENU_ID);
                    const notif = notifyField.checked ? true : NO_PING_NOTIFICATION;
                    executeScoreThenReload(anchor, fid, tid, finalScore.total, finalHeadtopDays, getHighlightParams(), notif, reasonField.value.trim());
                }

            });

            footer.appendChild(document.createTextNode(' '));

            const closeButton = addElem(footer, 'input', 'btn', { type: 'button', value: '关闭' });
            closeButton.addEventListener('click', function() {
                modelMask.remove();
                closePopupMenu(SCORING_DIALOG_POPUP_MENU_ID);
            });
        });
    }

    const RETRY_SIGNAL = 'RETRY_SIGNAL';
    async function readResponse(resp) {
        const respText = await resp.text();
        if (respText.indexOf('刷新不要快于') !== -1) {
            return Promise.resolve(RETRY_SIGNAL);
        } else if (!respText.match(/(操作完成|发帖完毕点击进入主题列表)/)) {
            const respDoc = new DOMParser().parseFromString(respText, 'text/html');
            if (((respDoc.querySelector('#main .t table .h')||{}).textContent||'').trim().endsWith('提示信息')) {
                return Promise.reject(((respDoc.querySelector('#main .t table .f_one center')||{}).textContent||'').trim());
            } else {
                return Promise.reject('不明错误');
            }
        } else {
            return Promise.resolve(true);
        }
    }

    let lastRequestTime = 0;

    async function attemptRequest() {
        let interval = Date.now() - lastRequestTime;
        if (interval < MIN_REQUEST_INTERVAL) {
            await sleep(MIN_REQUEST_INTERVAL - interval);
        }
        lastRequestTime = Date.now();
    }

    async function executeWithRetry(action) {
        let returnCode = await action();
        while (returnCode === RETRY_SIGNAL) {
            returnCode = await action();
        }
        return returnCode;
    }

    function encodeData(data) {
        return new URLSearchParams(data).toString();
    }

    async function executeScoreThenReload(anchor, fid, tid, addPoint, headtopDays, highlightParams, sendNotif, reason, pid) {
        const action = async () => {
            await executeScoreFunction(fid, tid, addPoint, headtopDays, highlightParams, sendNotif, reason, pid);
            return '✔️评分操作已完成';
        };
        runWithProgressPopup(action, '评分操作中...', anchor, 1500)
            .catch((ex) => alert(String(ex)))
            .finally(() => document.location.reload());
    }

    async function executeDeletePost(fid, tid, reason) {
        const url = `${document.location.origin}/mawhole.php`;
        await attemptRequest();
        await fetch(url, {
            method: 'POST',
            mode: 'same-origin',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: encodeData({
                'verify': verifyhash(),
                'action': 'del',
                'fid': fid,
                'tidarray[]': tid,
                'step': 2,
                'ifdel': 1,
                'ifmsg': 1,
                'atc_content': reason||'',
            })
        })
        .then(async resp => {
            await readResponse(resp);
            return true;
        });
    }

    async function executeDeleteReply(fid, tid, pid, reason) {
        const url = `${document.location.origin}/masingle.php?action=delatc`;
        await attemptRequest();
        await fetch(url, {
            method: 'POST',
            mode: 'same-origin',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: encodeData({
                'verify': verifyhash(),
                'fid': fid,
                'tid': tid,
                'step': 3,
                'selid[]': pid,
                'ifdel': 1,
                'ifmsg': 1,
                'atc_content': reason||'',
            })
        })
        .then(async resp => {
            await readResponse(resp);
            return true;
        });
    }

    async function executeScoreFunction(fid, tid, addPoint, headtopDays, highlightParams, sendNotif, reason, pid) {

        async function executePing(sp) {
            const url = `${document.location.origin}/operate.php?action=showping`;
            await attemptRequest();
            await fetch(url, {
                method: 'POST',
                mode: 'same-origin',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: encodeData({
                    'verify': verifyhash(),
                    'selid[]': pid||'tpc',
                    'cid': 'money',
                    'addpoint': sp,
                    'step': 1,
                    'ifmsg': sendNotif && sendNotif !== NO_PING_NOTIFICATION ? 1 : 0,
                    'atc_content': reason||'',
                    'page': 1,
                    'tid': tid
                })
            })
            .then(async resp => {
                await readResponse(resp);
                return true;
            });
        }

        async function executeHighlight() {
            if (!highlightParams.color && !highlightParams.bold)
                return Promise.resolve(true);
            const url = `${document.location.origin}/mawhole.php`;
            await attemptRequest();
            await fetch(url, {
                method: 'POST',
                mode: 'same-origin',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: encodeData({
                    'verify': verifyhash(),
                    'action': 'edit',
                    'fid': fid,
                    'tidarray[]': tid,
                    'title1': highlightParams.color||'',
                    'title2': highlightParams.bold ? 1 : '',
                    'title3': '',
                    'title4': '',
                    'ifmsg': sendNotif ? 1 : 0,
                    'atc_content': '',
                    'timelimit': '',
                    'nextto': '',
                    'step': 2
                })
            })
            .then(async resp => {
                await readResponse(resp);
                return null;
            });
        }

        async function executeHeadtopic() {
            if (headtopDays <= 0)
                return Promise.resolve(true);
            const url = `${document.location.origin}/mawhole.php`;
            await attemptRequest();
            await fetch(url, {
                method: 'POST',
                mode: 'same-origin',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: encodeData({
                    'verify': verifyhash(),
                    'action': 'headtopic',
                    'fid': fid,
                    'tidarray[]': tid,
                    'topped': 1,
                    'timelimit': headtopDays,
                    'ifmsg': sendNotif ? 1 : 0,
                    'atc_content': '',
                    'nextto': '',
                    'step': 2
                })
            })
            .then(async resp => {
                await readResponse(resp);
                return null;
            });
        }

        const extraBatches = Math.floor(addPoint / 99999);
        if (extraBatches > 0) {
            const lastLeftover = addPoint % 99999;
            await executeWithRetry(async () => executePing(lastLeftover));
            const ping99999 = async () => executePing(99999);
            for (let i = 0; i < extraBatches; i++) {
                await executeWithRetry(ping99999);
            }
        } else {
            await executeWithRetry(async () => executePing(addPoint));
        }

        await executeWithRetry(executeHighlight);
        await executeWithRetry(executeHeadtopic);

    }

    function enhanceShieldActionPage() {
        const uid = extraPageParams['uid'];
        if (uid == null) {
            return;
        }
        const form = document.querySelector('form[action="masingle.php?action=shield"]');
        if (form == null) {
            return;
        }

        const userNameCell = form.querySelector('table > tbody > tr + tr.tr3 > td.tar + td');
        const userName = userNameCell.textContent.trim();
        userNameCell.innerHTML = '';
        addElem(userNameCell, 'a', null, { href: `u.php?action-show-uid-${uid}.html`, target: '_blank' }).textContent = userName;
        if (uid !== myUserId) {
            userNameCell.append(document.createTextNode(' ／ 🚩记录已启用'));
        }
        
        async function handleSubmit() {
            const formData = new FormData(form);
            const step = formData.get('step') * 1;
            const fid = formData.get('fid') * 1;
            const tid = formData.get('tid') * 1;
            const pid = formData.get('pid') * 1 || 0; // tpc = 0
            const reason = formData.get('atc_content');
            if (uid !== myUserId) {
                await recordPunishment(uid, step === 5 ? PUNISH_TYPE_UNSHIELD : PUNISH_TYPE_SHIELD, '', reason, {
                    fid,
                    tid,
                    pid
                });
            }
            submitOriginalForm(form);
        }

        form.addEventListener('submit', evt => {
            evt.preventDefault();
            handleSubmit();
            return false;
        });
    }

    // ban user is missing the reason preset selector
    function enhanceBanUserActionPage() {
        const form = document.querySelector('form[action="masingle.php?action=banuser"]');
        if (form == null) {
            return;
        }
        const reasonField = form.querySelector('td > textarea[name="atc_content"]');
        if (reasonField == null) {
            return;
        }
        const userNameCell = form.querySelector('table > tbody > tr + tr.tr3 > td.tar + td');
        const userName = userNameCell.textContent.trim();
        const uid = extraPageParams['uid'];
        if (uid) {
            userNameCell.innerHTML = '';
            addElem(userNameCell, 'a', null, { href: `u.php?action-show-uid-${uid}.html`, target: '_blank' }).textContent = userName;
            userNameCell.append(document.createTextNode(' ／ 🚩记录已启用'));
        }
        
        const mainAreaName = form.querySelector('input[type="radio"][name="range"][value="0"]').nextSibling.textContent.trim();
        const initFormData = new FormData(form);
        const reasonSelector = addReasonSelector(reasonField);
        reasonField.setAttribute('style', 'width: 250px; height: 135px;');
        reasonSelector.setAttribute('style', 'display:inline-block;vertical-align:top');
        reasonField.parentElement.appendChild(reasonSelector);
        const delRow = newElem('tr', 'tr3');
        addElem(delRow, 'td', 'tar').textContent = '追加操作：';
        const extraOptionCell = addElem(delRow, 'td');
        const delCheckBox = addElem(extraOptionCell, 'input', null, { type: 'checkbox' });
        extraOptionCell.append(document.createTextNode(` 删除${initFormData.get('pid') === 'tpc' ? '主题 (注意：如帖上有其他违规回复，请先返回处理)' : '回复'}`));
        const reasonRow = reasonField.closest('tr');
        reasonRow.parentElement.insertBefore(delRow, reasonRow.previousElementSibling);
        form.addEventListener('submit', evt => {
            evt.preventDefault();
            const formData = new FormData(form);
            handleBanAndDelete(formData, delCheckBox.checked);
            return false;
        });

        async function handleBanAndDelete(banFormData, alsoDelete) {
            const pid = banFormData.get('pid');
            const fid = banFormData.get('fid');
            const tid = banFormData.get('tid');
            const page = banFormData.get('page');
            const limit = banFormData.get('type') * 1 === 1 ? banFormData.get('limit') : -1;

            let actionSummary = '禁言';
            if (limit > 0) {
                actionSummary += ` (${limit}天)`;
            } else {
                actionSummary += ' (永久)';
            }
            if (banFormData.get('range') * 1 === 0) {
                actionSummary += ` / 版块 (${mainAreaName})`;
            }
            const reason = banFormData.get('atc_content');
            if (uid) {
                await recordPunishment(uid, PUNISH_TYPE_BAN, actionSummary, reason, {
                    fid,
                    tid,
                    pid,
                    banDur: limit,
                    areaName: mainAreaName,
                    delete: alsoDelete
                });
            }

            async function executeDeleteViolationMaterial() {
                if (alsoDelete) {
                    if (pid === 'tpc') {
                        return await executeDeletePost(fid, tid, reason);
                    } else {
                        return await executeDeleteReply(fid, tid, pid, reason);
                    }
                } else {
                    return true;
                }
            }
            function finish() {
                if (!alsoDelete) {
                    document.location.href = `${document.location.origin}/read.php?tid=${tid}&page=${page||1}#${pid}`;
                } else if (pid === 'tpc') {
                    document.location.href = `${document.location.origin}/u.php?action=show&username=${encodeURIComponent(userName)}`;
                } else {
                    document.location.href = `${document.location.origin}/read.php?tid=${tid}&page=${page||1}`;
                }
            }

            addModalMask();
            const popupMenu = createPopupMenu(LOADING_DIALOG_POPUP_MENU_ID, null);
            popupMenu.renderContent(async function(borElem) {
                const operationLabel = alsoDelete ? '禁言及删除' : '禁言';
                // not happy about copy-n-paste ...
                borElem.innerHTML = `<div style="padding:16px 30px"><img src="images/loading.gif" align="absbottom">${operationLabel}操作中...</div>`;
    
                executeWithRetry(executeBan)
                    .then(() => executeWithRetry(executeDeleteViolationMaterial))
                    .then(() => {
                        borElem.innerHTML = `<div style="padding:16px 30px;font-size:1.5em">✔️${operationLabel}操作已完成</div>`;
                        setTimeout(() => {
                            closePopupMenu(LOADING_DIALOG_POPUP_MENU_ID);
                            finish();
                        }, 1500);
                    })
                    .catch(ex => {
                        alert(String(ex));
                        finish();
                    });
            });

            async function executeBan() {
                const url = `${document.location.origin}/masingle.php?action=banuser`;
                await attemptRequest();
                await fetch(url, {
                    method: 'POST',
                    mode: 'same-origin',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: encodeData(banFormData)
                })
                .then(async resp => {
                    await readResponse(resp);
                    return true;
                });
            }
        }

    }

    function addUserList(target, uids) {
        target.append(document.createTextNode(' ／ 对象: '));
        uids.forEach(uid => {
            target.append(document.createTextNode(' '));
            addElem(target, 'a', null, {
                href: 'u.php?action-show-uid-' + uid + '.html',
                target: '_blank'
            }).textContent = '#' + uid;
        });
    }

    function enhanceMawholeActionPage() {
        const form = document.querySelector('form[action="mawhole.php?"]');
        if (form == null) {
            return;
        }
        const actionField = form.querySelector('input[type="hidden"][name="action"]');
        if (actionField == null) {
            return;
        }
        if (actionField.value === 'del') {
            enhanceMawholeDelActionPage(form);
        }
    }

    function enhanceMawholeDelActionPage(form) {
        const uids = (extraPageParams.uids||'').split(':').map(x=>x*1).filter(x=>x>0);
        const tids = (extraPageParams.tids||'').split(':').map(x=>x*1).filter(x=>x>0);
        if (uids.length === 0 || uids.length !== tids.length) {
            return;
        }
        const ifdelCell = form.querySelector('input[type="radio"][name="ifdel"]').closest('th');
        if (uids.filter(uid => uid !== myUserId).length > 0) {
            addElem(ifdelCell, 'span', 'rinsp-record-delatc-msg').textContent = ' ／ 🚩记录已启用';
        }

        const mappings = new Map();

        tids.forEach((tid, i) => mappings.set(tid, uids[i]));

        async function handleSubmit() {
            const formData = new FormData(form);
            if (formData.get('ifdel') === '1') {
                const fid = formData.get('fid') * 1;
                const tids = formData.getAll('tidarray[]').map(x=>x*1);
                const reason = formData.get('atc_content');
                for (let tid of tids) {
                    const uid = mappings.get(tid);
                    if (uid && uid !== myUserId) {
                        const threadTitle = form.querySelector(`th > a[href="read.php?tid-${tid}.html"]`).textContent;
                        await recordPunishment(uid, PUNISH_TYPE_DELETE_THREAD, '', reason, {
                            fid,
                            tid,
                            title: threadTitle
                        });
                    }
                }
            }
            submitOriginalForm(form);
        }

        form.addEventListener('submit', evt => {
            evt.preventDefault();
            handleSubmit();
            return false;
        });
    }

    function enhanceDeleteReplyActionPage() {
        const form = document.querySelector('form[action="masingle.php?action=delatc"]');
        if (form == null) {
            return;
        }
        const countDisplayCell = form.querySelector('table > tbody > tr + tr.tr3 > td.tar + td');
        const ifdelCell = form.querySelector('input[type="radio"][name="ifdel"]').closest('td');
        const uids = (extraPageParams.uids||'').split(':').map(x=>x*1).filter(x=>x>0);
        if (uids.length > 0) {
            addUserList(countDisplayCell, uids);
            if (uids.filter(uid => uid !== myUserId).length > 0) {
                addElem(ifdelCell, 'span', 'rinsp-record-delatc-msg').textContent = ' ／ 🚩记录已启用';
            }
        }

        async function handleSubmit() {
            const formData = new FormData(form);
            if (formData.get('ifdel') === '1') {
                const tid = formData.get('tid') * 1;
                const fid = formData.get('fid') * 1;
                const reason = formData.get('atc_content');
                for (let uid of uids) {
                    if (uid !== myUserId) {
                        await recordPunishment(uid, PUNISH_TYPE_DELETE_REPLY, '', reason, {
                            tid,
                            fid
                        });
                    }
                }
            }
            submitOriginalForm(form);
        }

        form.addEventListener('submit', evt => {
            evt.preventDefault();
            handleSubmit();
            return false;
        });
    }

    function enhanceEndRewardActionPage() {
        const form = document.querySelector('form[action="job.php?action=endreward"]');
        if (form == null) {
            return;
        }
        const bounty = extraPageParams.bounty * 1;
        if (Number.isNaN(bounty)) {
            return;
        }
        const pts = extraPageParams.pts * 1 || 0;
        const opsp = extraPageParams.opsp * 1 || 0;

        const ifmsgRow = form.querySelector('input[name="ifmsg"]').closest('tr');
        const statusRow = newElem('tr', 'tr3');
        addElem(statusRow, 'th').textContent = '悬赏';
        addElem(statusRow, 'th').textContent = `最佳答案: ${bounty} SP` + (pts > 0 ? ` | 热心助人: ${pts}` : '') + ` | 楼主: ${opsp.toLocaleString('en-US')} SP`;
        ifmsgRow.parentNode.insertBefore(statusRow, ifmsgRow.previousElementSibling);

        const spRow = newElem('tr', 'tr3');
        addElem(spRow, 'th').textContent = 'SP 影响';
        const spCell = addElem(spRow, 'th');
        const spInput = addElem(spCell, 'input', null, { type: 'text', size: 4 });
        spCell.appendChild(document.createTextNode(' SP'));
        ifmsgRow.parentNode.insertBefore(spRow, ifmsgRow);

        const headerCell = form.querySelector('table tr > td.h');
        headerCell.removeAttribute('colspan');
        headerCell.parentNode.insertBefore(newElem('td', 'h'), headerCell);
        function addPresetButton(label, type, sp, ifmsg) {
            const presetButton = addElem(headerCell, 'a', 'rinsp-ping-preset-switch', { href: 'javascript:' });
            presetButton.addEventListener('click', () => {
                form.querySelector(`input[name="type"][value="${type}"]`).checked = true;
                spInput.value = sp == null ? '' : '' + sp;
                if (ifmsg) {
                    form.querySelector('input[name="ifmsg"][value="1"]').checked = true;
                } else {
                    form.querySelector('input[name="ifmsg"][value="0"]').checked = true;
                }
            });
            presetButton.textContent = label;
            headerCell.appendChild(document.createTextNode(' '));
            return presetButton;
        }
        addPresetButton('取消悬赏', 1, bounty * 2 + pts, true).setAttribute('style', 'color:#080');
        addPresetButton('返还押金', 2, bounty, true);
        addPresetButton('强行结案 (2倍)', 2, 0, true).setAttribute('style', 'color:#60C');
        addPresetButton('不结帖 (3倍)', 2, -bounty, true).setAttribute('style', 'color:#D00');

        form.addEventListener('submit', evt => {
            const sp = (spInput.value||'0') * 1;
            if (Number.isNaN(sp)) {
                evt.preventDefault();
                return false;
            }
            if (sp === 0) {
                return;
            }
            evt.preventDefault();

            const formData = new FormData(form);
            const tid = formData.get('tid');

            async function executeEndReward() {
                await attemptRequest();
                await fetch(form.action, {
                    method: 'POST',
                    mode: 'same-origin',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: encodeData(formData)
                })
                .then(async resp => {
                    await readResponse(resp);
                    return true;
                });
            }
            async function executeScore() {
                await attemptRequest();
                const reason = sp < 0 ? '不结帖' : '';
                await executeScoreFunction(48, tid, sp, 0, {}, true, reason);
            }
            function finish() {
                document.location.href = `${document.location.origin}/read.php?tid-${tid}.html`;
            }

            addModalMask();
            executeWithRetry(executeEndReward)
                .then(() => executeScore())
                .then(() => {
                    finish();
                })
                .catch(ex => {
                    alert(String(ex));
                    finish();
                });

            return false;
        });

    }

    function enhancePingActionPage() {
        const form = document.querySelector('form[action="operate.php?action=showping"]');
        if (form == null) {
            return;
        }
        const countDisplayCell = form.querySelector('table > tbody > tr + tr.tr3 + tr.tr3 > td.tar + th');
        const pingStepCell = form.querySelector('input[name="step"]').closest('th');
        const cidInput = form.querySelector('select[name="cid"]');
        const addpointInput = form.querySelector('input[name="addpoint"]');
        let logCheckbox = null;
        let onUpdate = () => {};
        function addPresetButton(label, cid, addpoint, log, ifmsg, reason) {
            const target = form.querySelector('table tr > th.h + th.h');
            const presetButton = addElem(target, 'a', 'rinsp-ping-preset-switch', { href: 'javascript:' });
            presetButton.addEventListener('click', () => {
                cidInput.value = cid;
                addpointInput.value = '' + addpoint;
                if (logCheckbox) {
                    logCheckbox.checked = log;
                }
                form.querySelector('input[name="step"][value="1"]').checked = true;
                if (ifmsg) {
                    form.querySelector('input[name="ifmsg"][value="1"]').checked = true;
                } else {
                    form.querySelector('input[name="ifmsg"][value="0"]').checked = true;
                }
                form.querySelector('textarea[name="atc_content"]').value = reason;
                onUpdate();
            });
            presetButton.textContent = label;
            target.appendChild(document.createTextNode(' '));
            
        }
        addPresetButton('清除', 'money', 0, true, true, '');
        addPresetButton('done', 'money', 1, true, true, 'done');
        addPresetButton('+5', 'money', 5, true, true, '');
        addPresetButton('+50', 'money', 50, true, true, '');

        const uids = (extraPageParams.uids||'').split(':').map(x=>x*1).filter(x=>x>0);
        if (uids.filter(uid => uid !== myUserId).length > 0) {
            addUserList(countDisplayCell, uids);
            const recordOption = addElem(pingStepCell, 'span', 'rinsp-record-showping-option rinsp-hide');
            recordOption.append(document.createTextNode(' ／ '));
            logCheckbox = addElem(recordOption, 'input', null, { type: 'checkbox', style: 'vertical-align: text-bottom' });
            logCheckbox.checked = true;
            recordOption.append(document.createTextNode('🚩启用扣分记录'));
            onUpdate = () => {
                if (addpointInput.value.startsWith('-')) {
                    recordOption.classList.remove('rinsp-hide');
                } else {
                    recordOption.classList.add('rinsp-hide');
                }
            };
            addpointInput.addEventListener('keyup', evt => onUpdate());
        }
        const soldSp = extraPageParams.sold * 1;
        if (soldSp > 0) {
            if (extraPageParams.badsell === 'opsell') {
                addPresetButton('楼主出售', 'money', -soldSp, true, true, '禁止楼主出售');
            } else {
                addPresetButton('违例出售', 'money', -soldSp, true, true, '');
            }
        }
        const ansSp = extraPageParams.answer * 1;
        if (ansSp > 0) {
            addPresetButton('小号自收', 'money', -ansSp, true, true, '禁止小号自收');
        }

        async function handleSubmit() {
            if (logCheckbox && logCheckbox.checked) {
                const formData = new FormData(form);
                const addpoint = formData.get('addpoint') * 1;
                const step = formData.get('step') * 1;

                let punishType = null;
                let actionSummary = '';
                if (step === 1 && addpoint < 0) {
                    const cid = formData.get('cid');
                    if (cid === 'money') {
                        punishType = PUNISH_TYPE_SP;
                        actionSummary = 'SP' + addpoint;
                    } else if (cid === 'rvrc') {
                        punishType = PUNISH_TYPE_HP;
                        actionSummary = 'HP' + addpoint;
                    }
                }
                if (punishType) {
                    const tid = formData.get('tid') * 1;
                    const reason = formData.get('atc_content');
                    for (let uid of uids) {
                        if (uid !== myUserId) { // actually impossible at this point
                            await recordPunishment(uid, punishType, actionSummary, reason, {
                                tid,
                                amount: addpoint
                            });
                        }
                    }
                }
            }
            submitOriginalForm(form);
        }

        form.addEventListener('submit', evt => {
            evt.preventDefault();
            handleSubmit();
            return false;
        });

    }

    function showBatchPingWindow(items) {
        const modelMask = addModalMask();
        const popupMenu = createPopupMenu(SCORING_DIALOG_POPUP_MENU_ID, null, false);
        popupMenu.renderContent(async function(borElem) {
            const eForm = addElem(borElem, 'div', 'rinsp-batchsel-form rinsp-batchping-form');
            const tableElem = addElem(eForm, 'table', null, {
                width: '850',
                cellspacing: '0',
                cellpadding: '0',
                style: 'table-layout:fixed'
            });

            const colgroup = addElem(tableElem, 'colgroup');
            addElem(colgroup, 'col', null, { style: 'width: 30px' });
            addElem(colgroup, 'col');
            addElem(colgroup, 'col', null, { style: 'width: 120px' });
            addElem(colgroup, 'col', null, { style: 'width: 40px' });
            addElem(colgroup, 'col', null, { style: 'width: 70px' });
            addElem(colgroup, 'col', null, { style: 'width: 90px' });
            addElem(colgroup, 'col', null, { style: 'width: 80px' });
            addElem(colgroup, 'col', null, { style: 'width: 20px' }); // allow for scrollbar
            const tbodyElem = addElem(tableElem, 'tbody');

            const trElem1 = addElem(tbodyElem, 'tr');

            const thElem1_1 = addElem(trElem1, 'th', 'h', { colspan: '7' });
            addElem(trElem1, 'th', 'h');

            const frElem1 = addElem(thElem1_1, 'span', 'fr', {
                style: 'margin-top:2px;cursor:pointer'
            });
            frElem1.addEventListener('click', function() {
                modelMask.remove();
                closePopupMenu(SCORING_DIALOG_POPUP_MENU_ID);
            });

            addElem(frElem1, 'img', null, {
                src: 'images/close.gif'
            });
            thElem1_1.appendChild(document.createTextNode('批量评分'));

            const trElem2 = addElem(tbodyElem, 'tr', 'tr2 tac');
            addElem(trElem2, 'td');
            addElem(trElem2, 'td').textContent = '帖子标题';
            addElem(trElem2, 'td').textContent = '发布者';
            addElem(trElem2, 'td').textContent = '回复';
            addElem(trElem2, 'td').textContent = '资源大小';
            addElem(trElem2, 'td').textContent = '评分';
            addElem(trElem2, 'td');

            const pingableItems = [];
            items.forEach(function(item) {
                const itemTr = addElem(tbodyElem, 'tr', 'tr3 tac rinsp-batchsel-form-item');
                const checkCell = addElem(itemTr, 'td');
                const selectCheckbox = addElem(checkCell, 'input', null, { type: 'checkbox' });
                const titleCell = addElem(itemTr, 'td', 'tal');
                let postUrl = `read.php?tid-${item.tid}.html`;
                addElem(titleCell, 'a', null, {
                    href: postUrl,
                    target: '_blank'
                }).textContent = item.title;

                const posterCell = addElem(itemTr, 'td', 'rinsp-batchsel-form-op-cell');
                if (item.opKnownName) {
                    posterCell.classList.add('rinsp-batchsel-form-op-known');
                    posterCell.textContent = item.opKnownName;
                } else {
                    posterCell.textContent = item.opName;
                }

                addElem(itemTr, 'td').textContent = '' + item.replyCount;

                addElem(itemTr, 'td').textContent = item.defaultScoreRating.resourceSizeTexts.join(' + ');

                const scoreCell = addElem(itemTr, 'td', 'rinsp-batchping-form-ping-cell');
                const scoreControls = addElem(scoreCell, 'div');
                const scoreInput = addElem(scoreControls, 'input', 'rinsp-batchping-form-sp-input', { type: 'text', size: '5' });
                addElem(scoreControls, 'span').textContent = ' SP';
                const unscoreCell = addElem(itemTr, 'td');
                const markUnscoredCheckbox = addElem(unscoreCell, 'input', null, { type: 'checkbox' });
                markUnscoredCheckbox.addEventListener('change', () => {
                    if (markUnscoredCheckbox.checked) {
                        selectCheckbox.checked = true;
                    }
                    sync();
                });
                selectCheckbox.addEventListener('change', () => {
                    if (!selectCheckbox.checked) {
                        markUnscoredCheckbox.checked = false;
                    }
                    sync();
                });
                addElem(unscoreCell, 'span').textContent = '不评分';

                const defaultUnscored = item.opKnownName && item.opKnownName.startsWith(NEVER_SCORE_USER_PREFIX);
                const defaultChecked = item.opKnownName && item.opKnownName.startsWith(TRUSTED_SCORE_USER_PREFIX);
                const unavailable = item.defaultScoreRating.baseTotalScore <= 0 || item.defaultScoreRating.ownBought || item.defaultScoreRating.ownTranslate;
                if (defaultUnscored) {
                    markUnscoredCheckbox.checked = true;
                }
                if (unavailable) {
                    itemTr.classList.add('rinsp-batchsel-form-item-unavailable');
                } else {
                    if (defaultChecked || defaultUnscored) {
                        selectCheckbox.checked = true;
                    }
                    scoreInput.value = '' + Math.min(99999, Math.max(1, Math.floor(item.defaultScoreRating.baseTotalScore)));
                }
                pingableItems.push({
                    item: item,
                    selected: () => selectCheckbox.checked,
                    score() {
                        if (markUnscoredCheckbox.checked) {
                            return -1;
                        }
                        const score = Math.floor(scoreInput.value * 1);
                        if (score > 0 && score <= 99999) {
                            return score;
                        }
                        return null;
                    },
                });
                
                sync();
                function sync() {
                    itemTr.classList.remove('rinsp-batchsel-form-item-checked');
                    itemTr.classList.remove('rinsp-batchsel-form-item-unchecked');
                    itemTr.classList.remove('rinsp-batchping-form-item-unscore');
                    if (selectCheckbox.checked) {
                        itemTr.classList.add('rinsp-batchsel-form-item-checked');
                        if (markUnscoredCheckbox.checked) {
                            itemTr.classList.add('rinsp-batchping-form-item-unscore');
                        }
                    } else {
                        itemTr.classList.add('rinsp-batchsel-form-item-unchecked');
                    }
                }
            });


            const footer = addElem(borElem, 'ul', null, {
                style: 'text-align:center;padding:4px 0;'
            });
            const submitButton = addElem(footer, 'input', 'btn', { type: 'button', value: '执行评分' });
            submitButton.addEventListener('click', () => {
                const pingItems = [];
                pingableItems.forEach(pItem => {
                    if (pItem.selected()) {
                        const score = pItem.score();
                        if (score != null) {
                            pingItems.push({
                                item: pItem.item,
                                score
                            });
                        }
                    }
                });
                if (pingItems.length === 0) {
                    showMessagePopup('没有项目', submitButton, 3000);
                    return;
                }
                if (confirm(`执行评分: ${pingItems.length} 个项目 ?`)) {
                    executeBatchPing(pingItems);
                }
            });

            footer.appendChild(document.createTextNode(' '));

            const closeButton = addElem(footer, 'input', 'btn', { type: 'button', value: '关闭' });
            closeButton.addEventListener('click', function() {
                modelMask.remove();
                closePopupMenu(SCORING_DIALOG_POPUP_MENU_ID);
            });

            function executeBatchPing(pingItems) {
                modelMask.remove();
                closePopupMenu(SCORING_DIALOG_POPUP_MENU_ID);
                runWithProgressPopup(action, '评分操作中...', null, 1500)
                    .catch((ex) => alert(String(ex)))
                    .finally(() => window.location.reload());

                async function action(progressDisplay) {
                    const itemList = addElem(progressDisplay, 'ul', 'rinsp-batchping-progress-list');
                    const displayItems = [];
                    for (let pingItem of pingItems) {
                        const li = addElem(itemList, 'li');
                        li.textContent = pingItem.item.title;
                        displayItems.push(li);
                    }
                    await sleep(1000);
                    for (let pingItem of pingItems) {
                        if (pingItem.score > 0) {
                            await executeScoreFunction(pingItem.item.fid, pingItem.item.tid, pingItem.score, 0, {}, true, '');
                        } else {
                            await executeScoreFunction(pingItem.item.fid, pingItem.item.tid, 1, 0, {}, false, '');
                        }
                        displayItems.shift().remove();
                    }
                    await sleep(500);
                    itemList.remove();
                    return '✔️已完成评分';
                }
            }
        });        
    }

    function addDeleteFormMetadata() {
        const delButton = document.querySelector('a#del[href^="mawhole.php?action-del-"]');
        if (delButton == null) {
            return null;
        }
        let gfPost = getPosts(document, 1)[0];
        if (gfPost == null || gfPost.floor !== 0) {
            return;
        }
        const actionHref = delButton.getAttribute('href');
        delButton.setAttribute('href', `${actionHref}#uids-${gfPost.postUid}-tids-${gfPost.tid}`);
    }

    function addBulkDeleteFormMetadata() {
        const form = document.querySelector('form[name="mawhole"][action="mawhole.php"]');
        if (form == null) {
            return;
        }
        const submitButton = form.querySelector('input[type="button"][name="hello"][onclick]');
        if (submitButton == null) {
            return;
        }
        submitButton.removeAttribute('onclick');
        submitButton.addEventListener('click', evt => {
            const formData = new FormData(form);
            const tids = formData.getAll('tidarray[]');
            if (formData.get('action') !== 'del' || tids.length === 0) {
                form.submit();
                return;
            }
            const uids = [];
            tids.forEach(tid => {
                const tr = document.getElementById(`td_${tid}`).closest('tr');
                const userLink = tr.querySelector('a.bl[href^="u.php?action-show-uid-"]');
                uids.push(Number.parseInt(userLink.getAttribute('href').substring(22)));
            });
            
            submitPostForm('mawhole.php#uids-' + Array.from(uids).join(':') + '-tids-' + Array.from(tids).join(':'), formData);
        });
    }

    function addBatchPingFunction(fid) {
        const adminAreaAnchor = document.querySelector('form[name="mawhole"] > .t + .t5.tac > div > .btn[name="chkall"]');
        if (adminAreaAnchor == null) {
            return;
        }
        const pingAllButton = newElem('input', 'btn', { type: 'button', name: 'chkall', value: '批量评分', style: 'float: left; margin-left: 1em; margin-right: -100%' });
        adminAreaAnchor.closest('div').appendChild(pingAllButton);
        pingAllButton.addEventListener('click', () => {
            const threadList = readThreadList();
            const unscoredThreads = threadList.filter(thread => !thread.row.classList.contains('rinsp-thread-filter-scored') && !thread.row.classList.contains('rinsp-thread-filter-miscored'));
            if (unscoredThreads.length === 0) {
                showMessagePopup('💡没有未评分帖子', pingAllButton, 3000);
                return;
            }
            const items = unscoredThreads.map(thread => {
                const defaultScoreRating = getDefaultRating(thread.title);
                const customNameEntry = userConfig.customUserHashIdMappings['#' + thread.op];
                return {
                    fid,
                    tid: thread.tid,
                    title: thread.title,
                    opName: thread.opName,
                    opKnownName: customNameEntry && customNameEntry[2],
                    replyCount: thread.replyCount,
                    defaultScoreRating
                };
            });
            showBatchPingWindow(items);
        });
    }

    function showBatchSelectionWindow(items, action) {
        const modelMask = addModalMask();
        const popupMenu = createPopupMenu(SCORING_DIALOG_POPUP_MENU_ID, null, false);
        popupMenu.renderContent(async function(borElem) {
            const eForm = addElem(borElem, 'div', 'rinsp-batchsel-form rinsp-batchping-form');
            const tableElem = addElem(eForm, 'table', null, {
                width: '850',
                cellspacing: '0',
                cellpadding: '0',
                style: 'table-layout:fixed'
            });

            const colgroup = addElem(tableElem, 'colgroup');
            addElem(colgroup, 'col', null, { style: 'width: 30px' });
            addElem(colgroup, 'col');
            addElem(colgroup, 'col', null, { style: 'width: 120px' });
            addElem(colgroup, 'col', null, { style: 'width: 120px' });
            addElem(colgroup, 'col', null, { style: 'width: 70px' });
            addElem(colgroup, 'col', null, { style: 'width: 160px' });
            addElem(colgroup, 'col', null, { style: 'width: 20px' }); // allow for scrollbar
            const tbodyElem = addElem(tableElem, 'tbody');

            const trElem1 = addElem(tbodyElem, 'tr');

            const thElem1_1 = addElem(trElem1, 'th', 'h', { colspan: '6' });
            addElem(trElem1, 'th', 'h');

            const frElem1 = addElem(thElem1_1, 'span', 'fr', {
                style: 'margin-top:2px;cursor:pointer'
            });
            frElem1.addEventListener('click', function() {
                modelMask.remove();
                closePopupMenu(SCORING_DIALOG_POPUP_MENU_ID);
            });

            addElem(frElem1, 'img', null, {
                src: 'images/close.gif'
            });
            thElem1_1.appendChild(document.createTextNode('批量选择'));

            const trElem2 = addElem(tbodyElem, 'tr', 'tr2 tac');
            const selCell = addElem(trElem2, 'td');
            addElem(trElem2, 'td').textContent = '帖子标题';
            addElem(trElem2, 'td').textContent = '论坛';
            addElem(trElem2, 'td').textContent = '发布者';
            addElem(trElem2, 'td').textContent = '回复';
            addElem(trElem2, 'td').textContent = '';
            addElem(trElem2, 'td');

            const selAll = addElem(selCell, 'a', null, { href: 'javascript:void(0)' });
            selAll.textContent = '☑️';
            const selectableItems = [];
            items.forEach(function(item) {
                const itemTr = addElem(tbodyElem, 'tr', 'tr3 tac rinsp-batchsel-form-item');
                const checkCell = addElem(itemTr, 'td');
                const selectCheckbox = addElem(checkCell, 'input', null, { type: 'checkbox' });
                selectCheckbox.addEventListener('change', () => sync());
                const titleCell = addElem(itemTr, 'td', 'tal');
                addElem(titleCell, 'a', null, {
                    href: `read.php?tid-${item.tid}.html`,
                    target: '_blank'
                }).textContent = item.title;

                const areaCell = addElem(itemTr, 'td', 'tal');
                addElem(areaCell, 'a', null, {
                    href: `thread.php?fid-${item.fid}.html`,
                    target: '_blank'
                }).textContent = item.areaName;

                const posterCell = addElem(itemTr, 'td', 'rinsp-batchsel-form-op-cell');
                const customNameEntry = userConfig.customUserHashIdMappings['#' + item.op];
                const opKnownName = customNameEntry && customNameEntry[2];

                if (opKnownName) {
                    posterCell.classList.add('rinsp-batchsel-form-op-known');
                    posterCell.textContent = opKnownName;
                } else {
                    posterCell.textContent = item.opName;
                }

                addElem(itemTr, 'td').textContent = '' + item.replyCount;
                const badRecordCell = addElem(itemTr, 'td');
                userPunishRecordStore.get(item.op)
                    .then(record => {
                        if (record) {
                            badRecordCell.appendChild(renderPunishTags(item.op, record));
                        }
                    });

                addElem(itemTr, 'td');

                selectableItems.push({
                    item: item,
                    selected: () => selectCheckbox.checked,
                    setSelected(b) {
                        selectCheckbox.checked = b;
                    }
                });
                
                sync();
                function sync() {
                    if (selectCheckbox.checked) {
                        itemTr.classList.add('rinsp-batchsel-form-item-checked');
                        itemTr.classList.remove('rinsp-batchsel-form-item-unchecked');
                    } else {
                        itemTr.classList.remove('rinsp-batchsel-form-item-checked');
                        itemTr.classList.add('rinsp-batchsel-form-item-unchecked');
                    }
                }
            });

            selAll.addEventListener('click', () => {
                const toSelect = selectableItems.find(item => !item.selected());
                selectableItems.forEach(item => item.setSelected(toSelect));
            });


            const footer = addElem(borElem, 'ul', null, {
                style: 'text-align:center;padding:4px 0;'
            });
            const submitButton = addElem(footer, 'input', 'btn', { type: 'button', value: '决定选择' });
            submitButton.addEventListener('click', () => {
                const selectedItems = [];
                selectableItems.forEach(pItem => {
                    if (pItem.selected()) {
                        selectedItems.push(pItem.item);
                    }
                });
                if (selectedItems.length === 0) {
                    showMessagePopup('没有项目', submitButton, 3000);
                    return;
                }
                if (confirm(`决定选择: ${selectedItems.length} 个项目 ?`)) {
                    executeAction(selectedItems);
                }
            });

            footer.appendChild(document.createTextNode(' '));

            const closeButton = addElem(footer, 'input', 'btn', { type: 'button', value: '关闭' });
            closeButton.addEventListener('click', function() {
                modelMask.remove();
                closePopupMenu(SCORING_DIALOG_POPUP_MENU_ID);
            });

            function executeAction(selectedItems) {
                modelMask.remove();
                closePopupMenu(SCORING_DIALOG_POPUP_MENU_ID);
                action(selectedItems);
            }
        });        
    }


    function checkSomePosts(decideChecked, skipScroll) {
        let first = null;
        Array.from(document.querySelectorAll('input[type="checkbox"][name="selid[]"]'))
            .forEach(el => {
                const value = decideChecked(el);
                if (first == null && value) {
                    first = el;
                }
                el.checked = value;
            });
        if (first && !skipScroll) {
            first.scrollIntoView();
        }
    }

    function addBatchPostSelectionControl() {
        const targetControlBar = document.querySelector('#main > .h2 > .fr.w');
        if (targetControlBar.querySelector('.rinsp-reply-batch-sel')) {
            return;
        }

        function isUnscored(el) {
            return el.closest('table').querySelector('div[id^="mark_"]') == null;
        }
          
        function isBanned(el) {
            const span = el.closest('table').querySelector('.tpc_content div[id^="read_"] > span[style="color:black;background-color:#ffff66"]');
            return span && span.textContent.trim() === '用户被禁言,该主题自动屏蔽!';
        }

        function checkNotDuplicates() {
            checkDuplicates(true);
        }

        function checkDuplicates(invert) {
            const checkValue = !invert;
            const seen = new Set();
            let first = null;
            const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"][name="selid[]"]'));
            checkboxes.forEach(el => {
                const a = el.closest('table').querySelector('.user-pic a[href^="u.php?action-show-uid-"]');
                const uid = Number.parseInt(a.getAttribute('href').substring(22));
                if (seen.has(uid)) {
                    el.checked = checkValue;
                    if (first == null) first = el;
                } else {
                    el.checked = !checkValue;
                    seen.add(uid);
                }
            });
            if (first) {
                first.scrollIntoView();
            }
        }

        const actions = [];
        actions.push({
            label: '全选',
            action: () => checkSomePosts(()=>true)
        });
        actions.push({
            label: '未评分',
            action: () => checkSomePosts(isUnscored)
        });
        actions.push({
            label: '重复',
            action: () => checkDuplicates()
        });
        actions.push({
            label: '非重复',
            action: () => checkNotDuplicates()
        });
        actions.push({
            label: '已禁言',
            action: () => checkSomePosts(isBanned)
        });
        actions.push({
            label: '清除',
            class: 'rinsp-alert-menu-button',
            action: () => checkSomePosts(()=>false)
        });
        targetControlBar.append(document.createTextNode(' | '));
        const batchSel = addElem(targetControlBar, 'a', 'fn rinsp-reply-batch-sel');
        batchSel.setAttribute('href', 'javascript:void(0)');
        batchSel.textContent = '批量选择';
        batchSel.addEventListener('click', () => {
            setupPopupMenu({
                title: '批量选择',
                popupMenuId: 'BATCH_SEL_MENU',
                width: 150,
                anchor: batchSel,
                verticallyInverted: false,
                items: actions
            });
        });
    }

    function addBatchDeleteFunction() {
        const adminAreaAnchor = document.querySelector('#main > .fr');
        if (adminAreaAnchor == null) {
            return;
        }
        const delAllButton = newElem('input', 'btn', { type: 'button', value: '批量删除', style: 'float: left; margin-left: 1em; margin-right: -100%' });
        adminAreaAnchor.closest('#main').appendChild(delAllButton);
        delAllButton.addEventListener('click', () => {
            const threadList = readSearchThreadList();
            const threads = threadList.map(thread => {
                return {
                    fid: thread.areaId,
                    areaName: thread.areaName,
                    tid: thread.tid,
                    title: thread.title,
                    op: thread.op,
                    opName: thread.opName,
                    replyCount: thread.replyCount,
                };
            });
            showBatchSelectionWindow(threads, async selection => {
                const fidGroups = new Map();
                selection.forEach(item => {
                    let group = fidGroups.get(item.fid);
                    if (group == null) {
                        group = [];
                        fidGroups.set(item.fid, group);
                    }
                    group.push(item);
                });

                for (let [fid, group] of fidGroups) {
                    openBulkDeletePage(fid, group);
                    await sleep(1000);
                }
                function openBulkDeletePage(fid, items) {
                    const formData = new FormData();
                    formData.set('action', 'del');
                    formData.set('fid', fid);
                    const tids = [];
                    const uids = [];
                    items.forEach(item => {
                        formData.append('tidarray[]', item.tid);
                        tids.push(item.tid);
                        uids.push(item.op);
                    });
                    submitPostForm('mawhole.php#uids-' + Array.from(uids).join(':') + '-tids-' + Array.from(tids).join(':'), formData, '_blank');
                }
            });
        });
    }

    async function handleOutZoneRequestPunish(post, deductSp, banDays) {
        if (!confirm(`执行求物处分 -${deductSp}SP + ${banDays > 0 ? `禁${banDays}天` : '删'}？`)) {
            return;
        }

        const threadTitle = (document.querySelector('#breadcrumbs .crumbs-item.current > strong')||{}).textContent;
        let reason = '禁止茶馆求物、出处、梯子机场、直求主题';
        if (banDays > 0) {
            reason += `- 因SP不足，清零追加禁言`;
        }
        const action = async () => {
            const extraDeduction = deductSp - 5;
            if (extraDeduction > 0) {
                await executeScoreFunction(post.areaId, post.tid, -extraDeduction, 0, {}, true, reason);
            }
            if (banDays > 0) {
                await executeBan();
            }
            await executeDeletePost(post.areaId, post.tid, reason);
            
            await recordPunishment(post.postUid, PUNISH_TYPE_DELETE_THREAD, '', `-${deductSp}SP ${reason}`, {
                fid: post.areaId,
                tid: post.tid,
                title: threadTitle
            });
            return '✔️处分操作已完成';
        };

        async function executeBan() {
            const banFormData = new FormData();
            banFormData.set('verify', verifyhash());
            banFormData.set('fid', post.areaId);
            banFormData.set('tid', post.tid);
            banFormData.set('pid', 'tpc');
            banFormData.set('type', 1);
            banFormData.set('limit', banDays);
            banFormData.set('page', 1);
            banFormData.set('step', 3);
            banFormData.set('ifmsg', 1);
            banFormData.set('atc_content', reason);

            const url = `${document.location.origin}/masingle.php?action=banuser`;
            await attemptRequest();
            await fetch(url, {
                method: 'POST',
                mode: 'same-origin',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: encodeData(banFormData)
            })
            .then(async resp => {
                await readResponse(resp);
                return true;
            });
        }

        runWithProgressPopup(action, '处分操作中...', null, 1500)
            .catch((ex) => alert(String(ex)))
            .finally(() => document.location.reload());
    }

    async function handleMisclassificationPunish(post) {
        if (!confirm('执行分类错误 SP-50？')) {
            return;
        }
        await executeScoreThenReload(null, post.areaId, post.tid, -50, 0, {}, true, '分类错误');
    }

    async function handleAwardBestAnswer(post, sp, multiplier) {
        const totalAmount = sp * multiplier;
        let suffix = multiplier > 1 ? ` (${multiplier}倍)` : '';
        if (!confirm(`选为最佳答案 ${totalAmount} SP${suffix}？`)) {
            return;
        }
        await executeScoreThenReload(null, post.areaId, post.tid, totalAmount, 0, {}, true, '最佳答案', post.postId);
    }

    function addPostAdminControl(posts, page, userMap) {

        function buildMultiAccountMap() {
            const colors = [ '#f9c6c9', '#bcd4e6', '#faedcb', '#c5dedd', '#eddcd2', '#dbcdf0' ];
        
            function nextColor() {
                const color = colors.shift();
                colors.push(color);
                return color;
            }
        
            const ipToUsers = new Map();
            const userToIps = new Map();
            function addMapping(map, key, value) {
                const values = map.get(key);
                if (values) {
                    values.add(value);
                } else {
                    map.set(key, new Set([value]));
                }
            }
        
            posts.forEach(post => {
                const banButton = post.rootElem.querySelector('.tipad a[id^="banuser_"]');
                if (banButton) {
                    const button = post.rootElem.querySelector('.rinsp-user-admin-button');
                    if (button) {
                        post.rootElem.classList.remove('rinsp-post-multi-uid');
                        button.parentElement.removeAttribute('style');
                        button.remove();
                    }
                    const ip = (banButton.closest('.fr').textContent.match(/IP:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}) \|/)||[])[1]||null;
                    if (ip) {
                        addMapping(ipToUsers, ip, post.postUid);
                        addMapping(userToIps, post.postUid, ip);
                    }
                }
            });
        
            let nextGid = 1;
            const userGrouped = new Map();
            ipToUsers.forEach((uids, ip) => {
                let group = userGrouped.get(ip);
                if (!group) {
                    group = {
                        gid: nextGid++,
                        uids: new Set()
                    };
                    userGrouped.set(ip, group);
                }
                for (let uid of uids) {
                    group.uids.add(uid);
                    const ips = userToIps.get(uid);
                    for (let ip2 of ips) {
                        if (ip2 !== ip) {
                            let group2 = userGrouped.get(ip2);
                            if (group2 && group2.gid !== group.gid) {
                                for (let uid2 of group2.uids) {
                                    group.uids.add(uid2); 
                                }
                                userGrouped.set(ip2, group);
                            }
                        }
                    }
                }
            });
        
            const multiAccountMap = new Map();
            Array.from(userGrouped.values())
                .filter(group => group.uids.size > 1)
                .forEach(group => {
                    if (!group.color) {
                        group.color = nextColor();
                    }
                    for (let uid of group.uids) {
                        multiAccountMap.set(uid, group);
                    }
                });
            return multiAccountMap;
        }

        function openActionPage(form, action) {
            const formData = new FormData(form);
            const postIds = new Set(formData.getAll('selid[]').map(pid => pid * 1));
            const postUids = new Set();
            posts.filter(post => postIds.has(post.postId)).forEach(post => {
                postUids.add(post.postUid);
            });
            submitPostForm(action + '#uids-' + Array.from(postUids).join(':'), formData);
        }

        const multiAccountMap = buildMultiAccountMap();
        let bountyStatus = null;
        let threadOwnerId = null;
        let bestAnswerMultiplier = 0;
        
        if (posts[0].areaId === 8 || posts[0].areaId === 9) { // ACG交流, 茶馆
            document.querySelectorAll('.rinsp-punishrequest-switch').forEach(el => el.remove());
            if (posts[0].floor === 0) {
                const showping = document.querySelector('li > #showping_tpc');
                let punishrequest = document.querySelector('li > #punishrequest_tpc');
                if (showping) {
                    const tpcPing = document.querySelector('#mark_tpc');
                    if (!punishrequest) {
                        if (tpcPing && tpcPing.textContent.match(/.*评分记录.*/) != null) {
                            // skip: already received penalty
                        } else {
                            const li = newElem('li', 'rinsp-punishrequest-switch');
                            showping.parentNode.parentNode.insertBefore(li, showping.parentNode.nextElementSibling);
                            punishrequest = addElem(li, 'a', null, { href: 'javascript:' });
                            punishrequest.textContent = '求物扣分';
                            const threadOwnerInfo = userMap.get(posts[0].postUid)||{ sp: 0 };
                            if (threadOwnerInfo.sp < 50) {
                                punishrequest.addEventListener('click', () => handleOutZoneRequestPunish(posts[0], threadOwnerInfo.sp, 1));
                            } else {
                                punishrequest.addEventListener('click', () => handleOutZoneRequestPunish(posts[0], 50, 0));
                            }
                        }
                    }
                }
            }
        } else if (posts[0].areaId === QUESTION_AND_REQUEST_AREA_ID) { // 求物区
            bountyStatus = getBountyStatus(document);
            document.querySelectorAll('.rinsp-punishclassify-switch').forEach(el => el.remove());
            if (posts[0].floor === 0) {
                threadOwnerId = posts[0].postUid;
                const showping = document.querySelector('li > #showping_tpc');
                let punishclassify = document.querySelector('li > #punishclassify_tpc');
                if (showping) {
                    const tpcPing = document.querySelector('#mark_tpc');
                    if (!punishclassify) {
                        if (tpcPing && tpcPing.textContent.match(/.*评分记录.*SP币:-50 .*分类.*/) != null) {
                            // skip: already received penalty
                        } else {
                            const li = newElem('li', 'rinsp-punishclassify-switch');
                            showping.parentNode.parentNode.insertBefore(li, showping.parentNode.nextElementSibling);
                            punishclassify = addElem(li, 'a', null, { href: 'javascript:' });
                            punishclassify.textContent = '分类错误';
                            punishclassify.addEventListener('click', () => handleMisclassificationPunish(posts[0]));
                        }
                    }
                    if (bountyStatus.ended === 2 && bountyStatus.winner == null) {
                        const pingSp = tpcPing ? (tpcPing.textContent.match(/.*评分记录.*SP币:\+?(-?\d+)/)||[null,0])[1] * 1 : 0;
                        if (pingSp === 0) {
                            bestAnswerMultiplier = 2;
                        } else if (bountyStatus.sp === pingSp) {
                            bestAnswerMultiplier = 1;
                        } else if (bountyStatus.sp === -pingSp) {
                            bestAnswerMultiplier = 3;
                        }
                    }
                    if (bestAnswerMultiplier > 0) {
                        posts.forEach(post => {
                            if (bestAnswerMultiplier === 0)
                                return;
                            const mark = post.rootElem.querySelector('div[id^="mark_"] li');
                            if (mark && mark.textContent.indexOf('最佳答案') !== -1) {
                                bestAnswerMultiplier = 0;
                            }
                        });
                    }
                }
            }
            const endrewardButton = document.querySelector('a[href^="job.php?action-endreward-tid-"]');
            if (endrewardButton) {
                const endrewardActionHref = endrewardButton.getAttribute('href');
                if (endrewardActionHref.indexOf('#') === -1) {
                    const threadOwnerInfo = userMap.get(threadOwnerId)||{ sp: 0 };
                    endrewardButton.setAttribute('href', endrewardActionHref + '#bounty-' + bountyStatus.sp + '-pts-' + bountyStatus.pts + '-opsp-' + threadOwnerInfo.sp);
                }
            }

        }
        posts.forEach(post => {
            const selCheckbox = post.rootElem.querySelector('.fr input[type="checkbox"][name="selid[]"]');
            if (selCheckbox) {
                const form = selCheckbox.closest('form[name="delatc"]');
                if (form) {
                    const deleteButton = selCheckbox.parentElement.querySelector('input[value="删除选定"][onclick]');
                    const pingButton = selCheckbox.parentElement.querySelector('input[value="评分选定"][onclick]');
                    if (deleteButton) {
                        deleteButton.removeAttribute('onclick');
                        deleteButton.addEventListener('click', () => {
                            openActionPage(form, 'masingle.php?action=delatc');
                        });
                    }
                    if (pingButton) {
                        pingButton.removeAttribute('onclick');
                        pingButton.addEventListener('click', () => {
                            openActionPage(form, `operate.php?action=showping&page=${page}`);
                        });
                    }
                    if (selCheckbox.parentElement.querySelector('.rinsp-selallid-button') == null) {
                        selCheckbox.parentElement.appendChild(document.createTextNode(' '));
                        const selAllButton = addElem(selCheckbox.parentElement, 'input', 'btn2 rinsp-selallid-button', { type: 'button', value: '全选' });
                        
                        selAllButton.addEventListener('click', () => {
                            const postIds = new Set(posts.filter(p => p.postUid === post.postUid).map(p => p.postId));
                            checkSomePosts(el => postIds.has(el.value * 1), true);
                        });
                    }
                }
            }

            const showpingButton = post.rootElem.querySelector('.tipad ul > li > a[id^="showping_"]');
            if (showpingButton) {
                const showpingActionHref = showpingButton.getAttribute('href');
                if (showpingActionHref.indexOf('#') === -1) {
                    let extraParams = [];
                    post.rootElem.querySelectorAll('.r_one .tpc_content .tips').forEach(tips => {
                        const match = tips.textContent.match(/最佳答案奖励:\s\(\+(\d+)\)\sSP币/);
                        if (match) {
                            extraParams.push('-answer-' + match[1] * 1);
                        }
                    });
                    let sellPrice = 0;
                    let boughtCount = 0;
                    post.contentElem.querySelectorAll('h6.quote.jumbotron > .s3.f12.fn').forEach(soldText => {
                        const match = soldText.textContent.match(/此帖售价 (\d+) SP币,已有 (\d+) 人购买/);
                        if (match) {
                            sellPrice = Math.max(sellPrice, match[1]*1);
                            boughtCount = match[2]*1;
                        }
                    });
                    if (boughtCount > 0 && bountyStatus != null) {
                        boughtCount--;
                    }
                    const total = sellPrice * boughtCount;
                    if (sellPrice > 0) {
                        if (bountyStatus != null && post.postUid === threadOwnerId) {
                            post.rootElem.classList.add('rinsp-post-illegal-sell');
                            extraParams.push('-badsell-opsell');
                        }
                        if (total > 0) {
                            extraParams.push(`-sold-${total}`);
                        }
                    }
                    if (post.postUid !== threadOwnerId) {
                        if (bountyStatus && bountyStatus.winner == null) {
                            extraParams.push('-bounty-' + bountyStatus.sp);
                        }
                        if (bestAnswerMultiplier > 0) {
                            const li = newElem('li', 'rinsp-markcorrect-switch');
                            showpingButton.parentNode.parentNode.insertBefore(li, showpingButton.parentNode.nextElementSibling);
                            const markcorrect = addElem(li, 'a', null, { href: 'javascript:' });
                            markcorrect.textContent = '最佳答案';
                            markcorrect.addEventListener('click', () => handleAwardBestAnswer(post, bountyStatus.sp, bestAnswerMultiplier));

                        }
                    }
                    showpingButton.setAttribute('href', showpingActionHref + '#uids-' + post.postUid + '-fid-' + post.areaId + extraParams.join(''));
                }
            }

            const shieldButton = post.rootElem.querySelector('.tipad a[id^="shield_"]');
            if (shieldButton) {
                const shieldActionHref = shieldButton.getAttribute('href');
                if (shieldActionHref.indexOf('#') === -1) {
                    shieldButton.setAttribute('href', shieldActionHref + '#uid-' + post.postUid);
                }
            }

            let adminBar;
            const banuserButton = post.rootElem.querySelector('.tipad a[id^="banuser_"]');
            if (banuserButton) {
                const banuserActionHref = banuserButton.getAttribute('href');
                if (banuserActionHref.indexOf('#') === -1) {
                    banuserButton.setAttribute('href', banuserActionHref + '#uid-' + post.postUid + '-fid-' + post.areaId);
                }
                adminBar = banuserButton.parentElement;
            }

            if (adminBar) {
                const group = multiAccountMap.get(post.postUid);
                const button = newElem('a', 'rinsp-user-admin-button', { href: 'javascript:'});
                button.textContent = '🔘';
                let addExtraMenuItems = () => {};
                if (group != null) {
                    adminBar.prepend(button);
                    adminBar.setAttribute('style', `outline: 2px solid ${group.color}; outline-offset: 2px`);
                    post.rootElem.classList.add('rinsp-post-multi-uid');
                    addExtraMenuItems = (items => {
                        if (document.body.classList.contains('rinsp-filter-multiip-focus-mode')) {
                            items.push({
                                label: '取消IP筛选',
                                action: () => {
                                    document.body.classList.remove('rinsp-filter-multiip-focus-mode');
                                    posts.forEach(p => {
                                        p.rootElem.classList.remove('rinsp-post-multi-uid-selected');
                                    });
                                }
                            });
                        } else {
                            items.push({
                                label: `只看相同IP用户 (${group.uids.size})`,
                                action: () => {
                                    document.body.classList.add('rinsp-filter-multiip-focus-mode');
                                    posts.forEach(p => {
                                        if (group.uids.has(p.postUid)) {
                                            p.rootElem.classList.add('rinsp-post-multi-uid-selected');
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                button.addEventListener('click', async () => {
                    const items = [];
                    addExtraMenuItems(items);
                    if (items.length === 0) {
                        return;
                    }
                    setupPopupMenu({
                        title: '请选择功能',
                        popupMenuId: 'MULTI_ACCOUNT_MENU',
                        width: 150,
                        anchor: button,
                        verticallyInverted: true,
                        items
                    });
                });
            }
        });
    }

    function renderAdminHistoryPage(myUserId, userConfig) {
        const services = {
            async getLogEntries() {
                const punishRecords = await userPunishRecordStore.list();
                const entries = [];
                punishRecords.forEach(record => {
                    record.logs.forEach(entry => {
                        entries.push(Object.assign({ uid: record.uid }, entry));
                    });
                });
                return entries;
            }
        };
        renderCommonPunishHistoryPage(myUserId, 0, services);
    }

    function renderPunishHistoryPage(userId, userConfig) {
        const services = {
            async getLogEntries() {
                let punishRecord = await userPunishRecordStore.get(userId);
                if (punishRecord == null) {
                    punishRecord = {
                        uid: userId,
                        logs: []
                    };
                }
                return punishRecord.logs.map(entry => {
                    return Object.assign({
                        uid: userId
                    }, entry);
                });
            }
        };
        renderCommonPunishHistoryPage(userId, userId, services);
    }

    function renderCommonPunishHistoryPage(pageScopeUid, subjectUid, services) {
        const mainPane = document.querySelector('#u-content > #u-contentmain');
        const sidePane = document.querySelector('#u-content > #u-contentside');
        sidePane.innerHTML = '';
        mainPane.innerHTML = '<div style="padding:16px 30px"><img src="images/loading.gif" align="absbottom">加载中...</div>';

        async function init() {
            mainPane.innerHTML = '';

            let entries = await services.getLogEntries();
            const sortByTime = comparator('time', true);
            entries.sort(sortByTime);
            
            const punishTypeToId = new Map();
            PUNISH_TYPES.forEach((type, i) => {
                punishTypeToId.set(type, i + 1);
            });

            const now = Date.now();
            const typeMap = new Map();
            entries = entries.map(entry => {
                let punishTypeId = punishTypeToId.get(entry.type);
                if (punishTypeId == null) {
                    punishTypeId = typeMap.size + 1;
                    punishTypeToId.set(punishTypeId, entry.type);
                }
                typeMap.set(punishTypeId, entry.type);
                return Object.assign({
                    typeId: punishTypeId
                }, entry);
            });
            const sectionFilter = addSectionFilter(typeMap, pageScopeUid, () => update(), {});
    
            const table = addElem(mainPane, 'table', 'u-table rinsp-punish-history-table');
            const thead = addElem(table, 'thead');
            const tr1 = addElem(thead, 'tr');
            const filterCell = addElem(tr1, 'td', null, { colspan: '3' });
            const filterBox1 = addElem(filterCell, 'div', 'rinsp-quick-filter-box');
            addElem(filterBox1, 'div').textContent = '🔍︎搜索';
            const filterInput = addElem(filterBox1, 'input', null);
            addElem(filterBox1, 'div', null, { style: 'flex: 0 1 4em' });
    
            if (subjectUid) {
                const addRecordButton = addElem(filterBox1, 'a', null, { href: 'javacript:'});
                addRecordButton.textContent = '➕添加记录';
                addRecordButton.addEventListener('click', async () => {
                    let comment = prompt('请添加备注');
                    if (comment) {
                        const newLogEntry = {
                            time: Date.now(),
                            type: PUNISH_TYPE_CUSTOM,
                            summary: comment,
                            reason: '',
                            data: {}
                        };
                        let updateRecord = await userPunishRecordStore.get(subjectUid);
                        if (updateRecord == null) {
                            updateRecord = {
                                uid: subjectUid,
                                logs: []
                            };
                        }
                        updateRecord.logs.push(newLogEntry);
                        await userPunishRecordStore.put(subjectUid, updateRecord);
                        entries.unshift(newLogEntry);
                        update();
                    }
                });
            }
            addElem(filterBox1, 'div', null, { style: 'flex: 0 1 1em' });
            const controlBlock = addElem(filterBox1, 'div');
    
            controlBlock.appendChild(document.createTextNode('显示数: '));
            const limitSelect = addElem(controlBlock, 'select');
            addElem(limitSelect, 'option', null, { value: '100' }).textContent = '100';
            addElem(limitSelect, 'option', null, { value: '200' }).textContent = '200';
            addElem(limitSelect, 'option', null, { value: '500' }).textContent = '500';
            addElem(limitSelect, 'option', null, { value: '1000' }).textContent = '1000';
            limitSelect.value = '100';
            limitSelect.addEventListener('change', () => update());
        
            const tbody = addElem(table, 'tbody');
            const tfoot = addElem(table, 'tfoot');
            const statusRow = addElem(tfoot, 'tr');
            const statusCell = addElem(statusRow, 'td', 'grey', { colspan: '2' });
    
            let lastFilterString = '';
            function update(filterChangeOnly) {
                const terms = filterInput.value.toLowerCase().trim().split(/\s+/g);
                const thisFilterString = terms.join(' ');
                if (filterChangeOnly && lastFilterString === thisFilterString)
                    return;
                lastFilterString = thisFilterString;
                statusCell.textContent = '';
                tbody.innerHTML = '';

                if (entries.length === 0) {
                    statusCell.textContent = '💡 没有记录';
                    return;
                }

                const countMap = new Map();
                entries.forEach(entry => {
                    countMap.set(entry.typeId, (countMap.get(entry.typeId)||0) + 1);
                });
                sectionFilter.updateCounts(countMap);
    
                const limit = limitSelect.value * 1;
                const punishTypeId = sectionFilter.getCurrentFid();
                let selectedEntries;
                // apply type filter, also clone the list for sorting
                if (punishTypeId > 0) {
                    selectedEntries = entries.filter(entry => entry.typeId === punishTypeId);
                } else {
                    selectedEntries = entries.slice();
                }
        
                // apply text filter
                if (terms.length === 1 && terms[0] === '') {
                    table.classList.remove('rinsp-table-filtered');
                    if (selectedEntries.length > limit) {
                        statusCell.textContent = `💡只显示前${limit}条记录 / 共${selectedEntries.length}条`;
                    }
                } else {
                    table.classList.add('rinsp-table-filtered');
                    selectedEntries = selectedEntries.filter(entry => match(entry, terms));

                    if (selectedEntries.length === 0) {
                        statusCell.textContent = '💡没有搜索结果';
                    } else if (selectedEntries.length > limit) {
                        statusCell.textContent = `💡只显示前${limit}条搜索结果 / 共${selectedEntries.length}条`;
                    }
                }

                if (selectedEntries.length > limit) {
                    statusCell.textContent = `💡只显示前${limit}条记录 / 共${selectedEntries.length}条`;
                }
    
                selectedEntries.slice(0, limit).forEach(entry => {
                    const row = addElem(tbody, 'tr');
                    switch (entry.type) {
                        case PUNISH_TYPE_HP:
                            row.classList.add('rinsp-profile-punish-tag-blood');
                            break;
                        case PUNISH_TYPE_BAN:
                            row.classList.add('rinsp-profile-punish-tag-ban');
                            break;
                        case PUNISH_TYPE_DELETE_THREAD:
                        case PUNISH_TYPE_DELETE_REPLY:
                        case PUNISH_TYPE_SHIELD:
                            row.classList.add('rinsp-profile-punish-tag-del');
                            break;
                        case PUNISH_TYPE_UNSHIELD:
                            row.classList.add('rinsp-profile-punish-tag-none');
                            break;
                        default:
                            row.classList.add('rinsp-profile-punish-tag-misc');
                    }
                    setAreaScoped(row, entry.typeId);

                    const th = addElem(row, 'th');
                    addElem(th, 'div').textContent = entry.type;
                    addElem(th, 'span', 'gray f9').textContent = ' [ ' + getAgeString((now - entry.time) / 60000) + ' ]';
                    
                    const descCell = addElem(row, 'td', 'rinsp-punish-history-summary-cell');
                    const details = addElem(descCell, 'details');
                    const summary = addElem(details, 'summary');
                    if (entry.summary) {
                        addElem(summary, 'span').textContent = entry.summary;
                        addElem(summary, 'div').textContent = entry.reason;
                    } else if (entry.reason) {
                        addElem(summary, 'span').textContent = entry.reason;
                    } else {
                        addElem(summary, 'span', 'gray').textContent = ' - ';
                    }
                    const fullContent = addElem(details, 'div', 'rinsp-punish-history-data');
                    const dataKeys = Object.keys(entry.data||{});
                    if (dataKeys.length === 0) {
                        addElem(fullContent, 'span', 'gray f9').textContent = '没有其他资讯';
                    } else {
                        dataKeys.forEach(key => {
                            const value = entry.data[key];
                            if (value != null) {
                                const pair = addElem(fullContent, 'div');
                                addElem(pair, 'label').textContent = key;
                                pair.appendChild(document.createTextNode(' '));
                                addElem(pair, 'span').textContent = value;
                            }
                        });
                    }

                    const delCell = addElem(row, 'td', 'rinsp-punish-history-del-cell');
                    const delButton = addElem(delCell, 'a');
                    delButton.textContent = '🗑️';
                    delButton.addEventListener('click', async () => {
                        if (confirm('删除这条记录？')) {
                            let updateRecord = await userPunishRecordStore.get(entry.uid);
                            if (updateRecord != null) {
                                updateRecord.logs = updateRecord.logs.filter(log => log.time != entry.time);
                                await userPunishRecordStore.put(entry.uid, updateRecord);
                            }
                            entries = entries.filter(r => r !== entry);
                            update();
                        }
                    });
                    if (!subjectUid) {
                        addElem(delCell, 'div');
                        const userLink = addElem(delCell, 'a', 'gray f9', {
                            href: `u.php?action-trade-uid-${entry.uid}.html`,
                            target: '_blank'
                        });
                        userLink.textContent = `#${entry.uid}`;
                    }
                });
                
            }

            let enqueueTimer = null;
            filterInput.addEventListener('keyup', () => {
                if (enqueueTimer) clearTimeout(enqueueTimer);
                enqueueTimer = setTimeout(() => update(true), 200);
                
            });
            filterInput.addEventListener('change', () => {
                if (enqueueTimer) clearTimeout(enqueueTimer);
                update(true);
            });
    
            update();

        }
        
        function match(entry, searchTerms) {
            foreach_term:
            for (let searchTerm of searchTerms) {
                if ((entry.summary||'').toLowerCase().indexOf(searchTerm) !== -1)
                    continue;
                if ((entry.reason||'').toLowerCase().indexOf(searchTerm) !== -1)
                    continue;
                if (entry.data) {
                    for (let value of Object.values(entry.data)) {
                        if (typeof value === 'string') {
                            if (value.toLowerCase().indexOf(searchTerm) !== -1)
                                continue foreach_term;
                        }
                    }
                }
                return false;
            }
            return true;
        }

        init();
    }

    function createPunishRecordAccess() {
        const punishRecordCache = new Map();
        return {
            async getPunishRecord(uid) {
                let record = punishRecordCache.get(uid);
                if (record == null) {
                    record = userPunishRecordStore.get(uid);
                    punishRecordCache.set(uid, record);
                }
                return await record;
            }
        };
    }

    async function findUserName(userId) {
        const doc = await fetchGetPage(`${document.location.origin}/sendemail.php?uid-${userId}.html`);
        const sendToField = doc.querySelector('input[name="sendtoname"]');
        if (sendToField) {
            return sendToField.value;
        }
        const userNameBold = doc.querySelector('#main .t .f_one center > b');
        if (userNameBold && userNameBold.parentElement.textContent.indexOf('不接受邮件') !== -1) {
            return userNameBold.textContent;
        }
        throw new Error('错误');
    }
    
    return {
        enableQuickPingFunction,
        autoFillShowPingPage,
        enhancePingActionPage,
        enhanceEndRewardActionPage,
        enhanceMawholeActionPage,
        enhanceDeleteReplyActionPage,
        enhanceReasonSelector,
        enhanceShieldActionPage,
        enhanceBanUserActionPage,
        addBatchPingFunction,
        addBatchDeleteFunction,
        addBatchPostSelectionControl,
        addDeleteFormMetadata,
        addBulkDeleteFormMetadata,
        addPostAdminControl,
        renderAdminHistoryPage,
        renderPunishHistoryPage,
        createPunishRecordAccess,
        findUserName
    };

}

function createLocalStorageProperty(name, defaultValue) {
    return {
        get() {
            let value = localStorage.getItem(name);
            if (value != null || defaultValue == null) {
                return value;
            }
            return defaultValue;
        },
        set(value) {
            if (value == null) {
                localStorage.removeItem(name);
            } else {
                localStorage.setItem(name, value);
            }
        }
    };
}

function applyDarkTheme() {
    document.documentElement.classList.forEach(cls => {
        if (cls.startsWith('rinsp-dark-theme-')) {
            document.documentElement.classList.remove(cls);
        }
    });
    if (darkModeEnabledProperty.get()) {
        document.documentElement.classList.add('rinsp-dark-mode-set');
        document.documentElement.classList.add(`rinsp-dark-theme-${darkModeThemeProperty.get()}`);
    } else {
        document.documentElement.classList.remove('rinsp-dark-mode-set');
    }
    if (isDarkMode()) {
        document.documentElement.classList.add('rinsp-dark-mode');
        return true;
    } else {
        document.documentElement.classList.remove('rinsp-dark-mode');
        return false;
    }
}

function isDarkMode() {
    if (darkModeEnabledProperty.get()) {
        if (darkModeFollowsSystemProperty.get()) {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
            return true;
        }
    }
    return false;
}

const DOMAIN_REDIRECT_ENABLED_KEY = 'domain-redirect-enabled';
async function setDomainRedirectEnabled(active) {
    if (active) {
        await GM.setValue(DOMAIN_REDIRECT_ENABLED_KEY, document.location.origin);
    } else {
        await GM.deleteValue(DOMAIN_REDIRECT_ENABLED_KEY);
    }
}

async function getDomainRedirectTarget() {
    let value = await GM.getValue(DOMAIN_REDIRECT_ENABLED_KEY);
    if (value && value.match(/\*?https?:\/\/.*/)) {
        // fix corrupt "*undefined" value
        return value;
    } else {
        return null;
    }
}

function requiresDomainRedirect() {
    // exclude redirection for the following pages
    switch (document.location.pathname) {
        case '/login.php':
        case '/register.php':
        case '/admin.php':
            return false;
    }
    return document.querySelector('#user-login > a[href="register.php"]') != null;
}

async function attemptDomainRedirect() {
    let domainRedirectTarget = await getDomainRedirectTarget();
    if (domainRedirectTarget && domainRedirectTarget.startsWith('*')) {
        domainRedirectTarget = domainRedirectTarget.substring(1);
        if (document.location.origin === domainRedirectTarget) {
            return false;
        } else {
            GM.setValue(DOMAIN_REDIRECT_ENABLED_KEY, domainRedirectTarget);
        }
    }
    if (domainRedirectTarget) {
        await GM.setValue(DOMAIN_REDIRECT_ENABLED_KEY, '*' + domainRedirectTarget); // deactivate the target until is it reachable
        window.location.replace(`${domainRedirectTarget}${document.location.pathname}${document.location.search}${document.location.hash}`);
    }
    return true;
}

function setSafeMode(active) {
    if (active) {
        localStorage.setItem('rinsp-safe-mode', '1');
        document.documentElement.classList.add('rinsp-safe-mode');
    } else {
        localStorage.removeItem('rinsp-safe-mode');
        document.documentElement.classList.remove('rinsp-safe-mode');
    }
}

function isSafeMode() {
    return localStorage.getItem('rinsp-safe-mode') === '1';
}

function setSafeModeShowMyAvater(active) {
    if (active) {
        localStorage.setItem('rinsp-safe-mode-allow-myself', '1');
        document.documentElement.classList.add('rinsp-safe-mode-allow-myself');
    } else {
        localStorage.removeItem('rinsp-safe-mode-allow-myself');
        document.documentElement.classList.remove('rinsp-safe-mode-allow-myself');
    }
}

function isSafeModeShowMyAvater() {
    return localStorage.getItem('rinsp-safe-mode-allow-myself') === '1';
}

function setFastLoadMode(active) {
    if (active) {
        localStorage.setItem('rinsp-fastload-mode', '1');
    } else {
        localStorage.setItem('rinsp-fastload-mode', '0');
    }
}

function isFastLoadMode() {
    return localStorage.getItem('rinsp-fastload-mode') !== '0';
}

function setFastLoadLazyImageMode(active) {
    if (active) {
        localStorage.setItem('rinsp-fastload-mode-lazyimg', '1');
    } else {
        localStorage.removeItem('rinsp-fastload-mode-lazyimg');
    }
}

function isFastLoadLazyImageMode() {
    return localStorage.getItem('rinsp-fastload-mode-lazyimg') === '1';
}

//============= utils =============//

let verifyhashCache = null;
function verifyhash() {
    if (unsafeWindow.verifyhash) {
        return unsafeWindow.verifyhash;
    }
    if (verifyhashCache) {
        return verifyhashCache;
    }
    const hiddenField = document.querySelector('form[name="FORM"][action="post.php?"] input[type="hidden"][name="verify"][value]');
    if (hiddenField) {
        verifyhashCache = hiddenField.value;
        return hiddenField.value;
    }
    for (let scriptElement of document.querySelectorAll('head > script')) {
        const match = scriptElement.textContent.match(/;var verifyhash = '([A-Za-z0-9]{8})';/);
        if (match) {
            verifyhashCache = match[1];
            return match[1];
        }
    }
    alert('无法取得操作验证码 (运作环境错误，请用篡改猴及谷歌火狐等主流浏览器)');
}

// accounting for any deferred image loading, returning the original image src
function getImgSrc(img) {
    return img.getAttribute('data-rinsp-defer-src') || img.getAttribute('src');
}

function getByteLength(text) {
    if (textEncoder == null) return 0;
    return textEncoder.encode(text).length;
}

function truncateByByteLength(text, limit, ellipsis) {
    let diff = getByteLength(text) - limit;
    if (diff > 0) {
        if (ellipsis) {
            diff += getByteLength(ellipsis);
        }
        const chars = Array.from(text);
        while (diff > 0) {
            diff -= getByteLength(chars.pop());
        }
        if (ellipsis) {
            chars.push(ellipsis);
        }
        return chars.join('');
    } else {
        return text;
    }
}

function addGlobalStyle(parent, css) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    parent.appendChild(style);
}

function parseSpAmount(text) {
    const match = text.match(/([0-9一二两三四五六七八九十]+ ?[kKwW万千]?) *的? *(sp|SP)/);
    if (match) {
        match[1] = match[1].replace(/十([^一二三四五六七八九])/g, '10$1').replace(/十/g, '1').replace(/一/g, '1').replace(/[二两]/g, '2').replace(/三/g, '3').replace(/四/g, '4').replace(/五/g, '5').replace(/六/g, '6').replace(/七/g, '7').replace(/八/g, '8').replace(/九/g, '9');
        if (match[1].endsWith('w') || match[1].endsWith('W') || match[1].endsWith('万')) {
            return parseInt(match[1]) * 10000;
        } else if (match[1].endsWith('千') || match[1].endsWith('k') || match[1].endsWith('K')) {
            return parseInt(match[1]) * 1000;
        } else {
            const amt = match[1] * 1;
            return amt === 99999 ? 0 : amt;
        }
    } else {
        return 0;
    }
}

function getBountyStatus(doc) {
    const tpc = doc.querySelector('#td_tpc');
    if (tpc == null) {
        return null;
    }
    const bountyTimeElem = tpc.closest('table').querySelector('.tpc_content .tips .s3');
    if (bountyTimeElem == null) {
        return null;
    }
    let bountyAmount = 0;
    let helppointAmount = 0;
    let winnerHashId = null;
    tpc.closest('table').querySelectorAll('.tpc_content .tips .tac').forEach(elem => {
        const msg = elem.textContent.trim();
        const bountyMatch = msg.match(/最佳答案: (\d+)\s+SP币/);
        const helpPtsMatch = msg.match(/热心助人剩余点数: (\d+)\s+SP币/);
        const winnerMatch = msg.match(/最佳答案获得者: ([a-z0-9]{8})/);
        if (bountyMatch) {
            bountyAmount = bountyMatch[1] * 1;
        }
        if (helpPtsMatch) {
            helppointAmount = helpPtsMatch[1] * 1;
        }
        if (winnerMatch) {
            winnerHashId = winnerMatch[1];
        }
    });
    const statusMessage = bountyTimeElem.textContent.trim();
    
    let bountyUntil;
    if (statusMessage === '此帖悬赏结束') {
        bountyUntil = -1;
    } else if (statusMessage === '此帖悬赏中(剩余时间:已结束)...') {
        bountyUntil = Date.now();
    } else {
        const bountyHourLeft = (statusMessage.match(/此帖悬赏中\(剩余时间:(\d+)小时\)/)||[])[1] * 1;
        bountyUntil = Date.now() + (bountyHourLeft||0) * 3600000;
    }
    return {
        sp: bountyAmount,
        pts: helppointAmount,
        winner: winnerHashId,
        bountyUntil,
        ended: bountyUntil === -1 ? 2 : Date.now() > bountyUntil ? 1 : 0
    };
}

function findErrorMessage(doc) {
    let err = doc.querySelector('#main .t .f_one center');
    return err ? err.textContent.trim()||'不明错误' : null;
}

function getAgeString(ageMins) {
    if (ageMins >= 1440) {
        return Math.floor(ageMins / 1440) + '天前';
    } else if (ageMins >= 60) {
        return Math.floor(ageMins / 60) + '小时前';
    } else if (ageMins > 1) {
        return Math.floor(ageMins) + '分钟前';
    } else {
        return '刚刚';
    }
}

function addElem(parent, tag, styleClass, attrs) {
    const elem = newElem(tag, styleClass, attrs);
    parent.appendChild(elem);
    return elem;
}

function newElem(tag, styleClass, attrs) {
    const elem = document.createElement(tag);
    if (styleClass) {
        styleClass.split(' ').forEach(function(cls) {
            elem.classList.add(cls);
        });
    }
    if (attrs) {
        for (let name of Object.keys(attrs)) {
            elem.setAttribute(name, attrs[name]);
        }
    }
    return elem;
}

async function runWithLock(key, duration, job) {
    const prop = `rinsp-lock-${key}`;
    async function acquire() {
        while (true) {
            const randToken = (Math.random() * 10000000000).toFixed(0);
            const lockUntil = Date.now() + duration;
            localStorage.setItem(prop, `${randToken}-${lockUntil}`);
            await sleep(0);
            const acquired = (localStorage.getItem(prop)||'').split('-', 2);
            if (acquired[0] === randToken) {
                return true;
            }
            let waitTime = lockUntil - Date.now();
            if (waitTime > duration * 2) { // invalid lock, retry acquire
                localStorage.removeItem(prop);
            } else {
                await sleep(waitTime);
            }
        }
    }
    await acquire();
    return await Promise.resolve(job())
    .finally(() => {
            localStorage.removeItem(prop);
        });
}

// polyfill replacement
function Object_hasOwn(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

function sleep(timeout) {
    return new Promise(function(resolve) {
        setTimeout(() => resolve(true), timeout);
    });
}

/*
    cyrb53 (c) 2018 bryc (github.com/bryc)
    License: Public domain. Attribution appreciated.
    A fast and simple 53-bit string hash function with decent collision resistance.
    Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
*/
function cyrb53(str, seed) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function checkDevMode() {
    return localStorage.getItem('RIN_PLUS_DEV_MODE') === '1';
}

function setCookie(name, value, hours) {
    var expires = '';
    if (hours) {
        var date = new Date();
        date.setTime(date.getTime() + (hours*60*60*1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '')  + expires + '; path=/';
}

function console_info() {
    let out = document.querySelector('#rinsp-debug-console');
    if (out == null) {
        out = addElem(document.body, 'pre', null, { id: 'rinsp-debug-console', style: 'position:fixed;top:20px;left:20px;width:40em;max-height:30em;outline:5px solid #CCC;background:#FFF9;color:#000;overflow:auto;z-index:99999;' });
    }
    out.textContent += Array.from(arguments).join(', ') + '\n';
    out.scrollTop = 10000000;
}

/* ==== START: script initialisation ==== */

function readPinnedPicWallFids() {
    return (localStorage.getItem(PIC_WALL_PREF_KEY)||'').split(' ').map(fid=>fid*1).filter(fid=>!!fid);
}

function redirectToDesktopVersion() {
    if (document.location.pathname === '/simple/index.php') {
        const pageMatch = document.location.search.match(/\^?t(\d+)(?:_(\d+))?\.html$/);
        if (pageMatch) {
            setCookie('mobilever', 1, 720);
            window.location.replace(`${document.location.origin}/read.php?tid=${pageMatch[1]}&fpage=0&toread=&page=${pageMatch[2]||1}`);
            return true;
        }
    }
}

function attemptPicWallRedirect() {
    if (window.location.pathname === '/thread.php') {
        const fid = (window.location.search.match(/[&?]fid[=-](\d+)/)||[])[1] * 1;
        if (fid) {
            const fids = readPinnedPicWallFids();
            if (fids.includes(fid)) {
                window.location.replace(`${window.location.origin}/thread_new.php${window.location.search}${window.location.hash}`);
                return true;
            }
        }
    }
}

const AVATAR_LOADING_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhlgCWAKIAANPT083Nzd3d3cXFxerq6uPj48PDw+3t7SH5BAAAAAAALAAAAACWAJYAAAP/eLrc/jDKSau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru987//AoHBILBqPyKRyyWw6n9CodEqtWq/YrHbL7Xq/4LB4TC6bz+i0es1uu9/wuHxOr9vv+Lx+z+/7/4CBgoOEhYaHiImKi4yNjhQCAQaTlJWWl5iVAQJ5BZmfoJ8FeAChpqcAeJIGnCUCkwGqk6Mlngaxd6u0JLa4droOkQMABBu9sga7Crawxs25sw2llcoWx9DJ0pbVFde/0QzMt87j2NzCxOS+dcC1z9/Z7uXw3CDe7OAZBAABAakN9+i0w1BgQKUBxRYEnDPQmkFLA3YtlNOwAD8A9QQ8vBRxkNk7fPEOvKr0b4FGUAM4TYzTbpqlAAlHhkq5Eo4uAqswwXSJ6qPASZFmntKJbOPQo/NAIl2a9CfTpeucPj0adQ7PqaZK1hGHNVQ9OUG7ftr0qKzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLly5gza4abAAA7';
const IMAGE_LOADING_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhIAAgAKIDAO3t7fn5+fr6+h8iJP7+/tTU1P///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgADACwAAAAAIAAgAAADozi63P4wyqmKvTjrCwsQQSiO5AgUnUCsbOu6AvoU6goGb07E6RpgNZ1N5qCtMgAhizernS5JFgCAazGLwWd09SxUhz1dDLkkNoy53yZ6PQdb3Q2tzUDD5Rn6wr7Da05hBGp+GmFxhBg9h4gcMwGLjBYdkXgUlpeYmZqbnJ2WiQ0CUwIPoh9FGQ1TUw+rAKigC66tq7CNC6akDrm2kp5nt7/CnAkAIfkEBQoAAwAsAgAYABwABgAAAxw4I6L+EAI1R60x0wea81r4PaAoXmaEWQqTZmgCACH5BAkKAAMALAIAGAAcAAYAAAMiOAOg/hAGFlwpMcsXwr2VljUO4H2kCKWLcqlaqIQMHFNDAgAh+QQFCgADACwAAAAAIAAgAAADSji63P4wykmrvTjrzbv/YCiOZGmeaKqubOuaAQAEm+wERV7QjSALD0AO0BDqiEUZkoHT8RTGoUO5XDSlVt3O4QMAp1im7ImxvUgJACH5BAkKAAMALAIAGAAcAAYAAAMjOFAF8zDKKMRzEM+dcYkftwlACQjhk4qUeWoKy5UZA8uUNSQAIfkEBQoAAwAsAAAAACAAIAAAAz84utz+MMpJq7046827/2AojmRpnmiqrmzrmkVcjLLsCAAgPLje1DFHLvcYAn5A4bC4ZABnjd7ulps6ba9sJAEAIfkEBQoAAwAsAgAYABEABgAAAxc4MMruQrDl6KP2aQm154yQZVPZnB+XAAAh+QQJCgADACwCABgAEQAGAAADHTgBEPPwsedgjaMUGQEOmrZ0X1g00RVpFqN23pAAACH5BAUKAAMALAAAAAAgACAAAANAOLrc/jDKSau9OOvNu/9gKI5kaZ5oqq5s654AAAVxkAFFITdBntuWng+4wPl2FWEOqTAuMUamQlkgWmKz2uuVAAAh+QQJCgADACwCABgAEQAGAAADHTgjou6gFADpUxYLwEF7Bbh1nxOaWPaoFnNBEpUAACH5BAUKAAMALAAAAAAgACAAAAM1OLrc/jDKSau9OOvNu/9gKI5kaZ5oqq5s675KIReZAACCM8/Yfes72sUHAO4wNpyRJzrCWgkAIfkEBQoAAwAsDQAYABEABgAAAxc4MMruQrDl6KP2aQm154yQZVPZnB+XAAAh+QQJCgADACwNABgAEQAGAAADHTgBEPPwsedgjaMUGQEOmrZ0X1g00RVpFqN23pAAACH5BAUKAAMALAAAAAAgACAAAAM/OLrc/jDKSau9OOvNu/9gKI5kaZ5oqq5s674LAECBHGRAUcxNoOs3i+8XjP12l6GOZ/wxKzlk71i0yGg22CgBADs=';
const IMAGE_LOADING_PLACEHOLDER_DARK = 'data:image/gif;base64,R0lGODlhIAAgAKIGAEVNUjA2OSImKD1ESCAjJTxDRx8iJDIyMiH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgAGACwAAAAAIAAgAAADsWi63P4wyqnKuDjrPQocQiiOZCkMn0CsbOu6Z9qGb03ED7gKVqfaLJxDRwh0LAFgEJX7GTHJYOC3lK0ChUL0iqHemEMvzJhFVps23rE8iAobRNilTPe9GXEWmc73geFie3x9WFY3FoOJiFYna4qDMoKPiRAFApKTkA9ZjpmaFKChoqOkpaanEwEAAAEOIw+vDaqrrA2xtiIOtLS4IbC5DburvQK/vg0Fux6oyKvLzNCnCQAh+QQFCgAGACwCABgAHAAGAAADIGhGpP4wlvJCiDg7Ym3T0lNw3QeKqGGd2OW4gsC205UAACH5BAkKAAYALAIAGAAcAAYAAAMkaCai/hCKEJoJCsftRBlDwTwWFwUgWJHmhqaYprXSF5a0Oa0JACH5BAUKAAYALAAAAAAgACAAAANJaLrc/jDKSau9OOvNu/9gKI5kaZ5oqq5s65pCEAibQDdCMQzFzdi2h0zWCOx2AQfQt4gNmcZjEgdUDmc/HY+pWAqHVqwm+CIlAAAh+QQJCgAGACwCABgAHAAGAAADJmhRFfYwykjICyADNzsUD1hoQOF5FkSMmnlO6UNgGvdKoJEvze0nACH5BAUKAAYALAAAAAAgACAAAANAaLrc/jDKSau9OOvNu/9gKI5kaZ5oqq5s65oBAARjLM+OoAvPzjO3W27XIwKDgKGuuGQUggXlr+FzPAHRlzaSAAAh+QQFCgAGACwCABgAEQAGAAADHWhWpf6EvElDUM1lR6wl2zJ1XvdcFWoEjDoJgpIAACH5BAkKAAYALAIAGAARAAYAAAMfaBIh9vAJp8oYhcbweLgXF2nKB4oQOVkY2b1lE81QAgAh+QQFCgAGACwAAAAAIAAgAAADQmi63P4wykmrvTjrzbv/YCiOZGmeaKqubOueggAJQSBjde0IxTAUtwotF1QEfL7AZVgrGo5I5SUnZfB8wExs1ny9EgAh+QQJCgAGACwCABgAEQAGAAADImhGpO6hlKBEfSqADUJzn1NwQBEu2MgVhtVihsZRMBZNRgIAIfkEBQoABgAsAAAAACAAIAAAAzloutz+MMpJq7046827/2AojmRpnmiqrmzrvkoAAEEm3IIjzzSG5w0ez4dzCGfEm6MgLIyYACeslQAAIfkEBQoABgAsDQAYABEABgAAAx1oVqX+hLxJQ1DNZUesJdsydV73XBVqBIw6CYKSAAAh+QQJCgAGACwNABgAEQAGAAADH2gSIfbwCafKGIXG8Hi4FxdpygeKEDlZGNm9ZRPNUAIAIfkEBQoABgAsAAAAACAAIAAAA0Noutz+MMpJq7046827/2AojmRpnmiqrmzrvosgQEIQzJhtO0IxDAVcpaYTKgK/X+BCtBkNyOTyopsyer9gRkZzwkYJADs=';

function deferImageLoading(doc) {
    if (DEBUG_MODE) console.info('[STAGE] deferImageLoading');
    const dark = isDarkMode();
    const defaultImagePath = `${document.location.origin}/images/face/`;
    doc.querySelectorAll('.user-pic img[src], #u-portrait img.pic[src]:not([data-org-img])').forEach(img => {
        if (img.src.startsWith(defaultImagePath))
            return; // skip default avatar images
        img.dataset.rinspDeferSrc = img.src;
        img.src = AVATAR_LOADING_PLACEHOLDER;
    });
    doc.querySelectorAll('.gonggao #cate_thread img[src], .tpc_content img[src]:not([src^="images/"]), #info_base img[src]:not([src^="images/"])').forEach(img => {
        img.dataset.rinspDeferSrc = img.src;
        img.src = dark ? IMAGE_LOADING_PLACEHOLDER_DARK : IMAGE_LOADING_PLACEHOLDER;
    });
}

const RESUME_IMG_LOAD_DELAY = 0;
function resumeImageLoading(doc) {
    const lazy = isFastLoadLazyImageMode();
    setTimeout(() => {
        if (DEBUG_MODE) console.info('[STAGE] resumeImageLoading');
        doc.querySelectorAll('img[data-rinsp-defer-src]').forEach(img => {
            if (lazy) {
                img.setAttribute('loading', 'lazy');
            }
            if (img.dataset.orgImg) {
                if (img.dataset.rinspDeferSrc) {
                    img.dataset.orgImg = img.dataset.rinspDeferSrc;
                }
            } else {
                img.classList.add('rinsp-img-loading');
                img.addEventListener('load', () => {
                    img.classList.remove('rinsp-img-loading');
                });
                img.src = img.dataset.rinspDeferSrc;
            }
            delete img.dataset.rinspDeferSrc;
        });
    }, RESUME_IMG_LOAD_DELAY);
}

function initWhenPageRootLoaded() {
    if (!document.documentElement || document.documentElement.dataset.rinspInstalled * 1 > 0) {
        return;
    }
    document.documentElement.dataset.rinspInstalled = '1';
    if (window.matchMedia) {
        try {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                applyDarkTheme();
            });
        } catch (ignore) {}
    }
    if (applyDarkTheme()) {
        // attempt to reduce flashing of unstyled content
        document.documentElement.setAttribute('style', 'filter:invert(0.5) filter:brightness(0.2)');
    } else {
        document.documentElement.setAttribute('style', 'filter:invert(0.5) filter:brightness(1.9)');
    }
    if (isSafeMode()) {
        document.documentElement.classList.add('rinsp-safe-mode');
    }
    if (isSafeModeShowMyAvater()) {
        document.documentElement.classList.add('rinsp-safe-mode-allow-myself');
    }
}
function initWhenPageHeadLoaded() {
    if (!document.head || document.documentElement.dataset.rinspInstalled * 1 > 1) {
        return;
    }
    document.documentElement.dataset.rinspInstalled = '2';
    addGlobalStyle(document.head, customCss);
    addGlobalStyle(document.head, darkThemeCss);
    if (DEV_MODE) {
        addGlobalStyle(document.head, devCss);
    }
}
function initWhenPageDomLoaded() {
    if (!document.body || document.documentElement.dataset.rinspInstalled * 1 > 2) {
        return;
    }
    document.documentElement.dataset.rinspInstalled = '3';

    document.documentElement.removeAttribute('style');
    if (findErrorMessage(document) === '论坛设置:刷新不要快于 1 秒') {
        document.documentElement.dataset.rinspInstalled = '9'; // skip all subsequent initialization
        setTimeout(() => document.location.reload(), 1000);
        return;
    }
    if (requiresDomainRedirect()) {
        attemptDomainRedirect().then(redirecting => {
            if (redirecting) {
                document.documentElement.dataset.rinspInstalled = '9'; // skip all subsequent initialization
            }
        });
    }

    if (isFastLoadMode()) {
        deferImageLoading(document);
        init().catch(ex => console.error(ex));
    }

}
function initWhenPageComplete() {
    if (document.readyState !== 'complete' || document.documentElement.dataset.rinspInstalled * 1 > 3) {
        return;
    }
    document.documentElement.dataset.rinspInstalled = '4';
    document.documentElement.removeAttribute('style'); // unhide those used to be unstyled content

    if (isFastLoadMode()) {
        resumeImageLoading(document);
    } else {
        init().catch(ex => console.error(ex));
    }
}

function begin() {
    if (redirectToDesktopVersion()) {
        return;
    }
    if (attemptPicWallRedirect()) {
        return;
    }
    
    let fallbackTimer = null;
    function handleInitStages() {
        if (DEBUG_MODE) console.info('[STAGE] ' + document.readyState);
        switch (document.readyState) {
            case "loading":
                initWhenPageRootLoaded();
                initWhenPageHeadLoaded();
                break;
            case "interactive":
                initWhenPageRootLoaded();
                initWhenPageHeadLoaded();
                initWhenPageDomLoaded();
                break;
            case "complete":
                if (fallbackTimer) {
                    clearTimeout(fallbackTimer);
                    fallbackTimer = null;
                }
                document.removeEventListener('readystatechange', handleInitStages);
                initWhenPageRootLoaded();
                initWhenPageHeadLoaded();
                initWhenPageDomLoaded();
                initWhenPageComplete();
                break;
        }
    }
    handleInitStages();

    if (document.readyState !== 'complete') {
        document.addEventListener('readystatechange', handleInitStages);
        // force a recheck after N seconds, in case a dodgy GM script plugin is in use
        fallbackTimer = setTimeout(() => {
            handleInitStages();
        }, 5000);
    }

    if (DEBUG_MODE) {
        document.addEventListener('DOMContentLoaded', () => {
            console.info('[STAGE] DOMContentLoaded');
        });
    }

}

if (document.location.pathname !== '/admin.php' && document.location.href !== 'about:blank') {
    begin();
}

})();
