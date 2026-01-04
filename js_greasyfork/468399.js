// ==UserScript==
// @name         巴哈帳號黑名單
// @description  巴哈姆特電玩資訊站針對使用者帳號執行的功能
// @version      0.1
// @license      MIT
// @namespace    bahamut_David79523
// @author       David79523
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=David79523
// @match        https://forum.gamer.com.tw/*
// @icon         https://i2.bahamut.com.tw/apple-touch-icon.png
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/468399/%E5%B7%B4%E5%93%88%E5%B8%B3%E8%99%9F%E9%BB%91%E5%90%8D%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/468399/%E5%B7%B4%E5%93%88%E5%B8%B3%E8%99%9F%E9%BB%91%E5%90%8D%E5%96%AE.meta.js
// ==/UserScript==

/**
 * 處理程式執行器
 */
class Runner {
    /**
     * 處理程式清單
     *
     * @type {Array<{ pattern: string, callback: Function }>}
     */
    #processors;

    constructor() {
        this.#processors = [];
    }

    /**
     * 註冊處理程式
     *
     * @param {string} pattern 網址路徑規則
     * @param {Function} callback 執行動作
     */
    register(pattern, callback) {
        this.#processors.push({
            pattern: pattern,
            callback: callback
        });
    }

    /**
     * 執行處理程式, 當有規則符合時執行對應動作並停止執行
     */
    start() {
        const url = new URL(document.location);
        for (const processor of this.#processors) {
            if (processor.pattern.test(url.pathname)) {
                processor.callback();
                break;
            }
        }
    }
}

/**
 * 自訂事件: 點擊更多留言並接收完畢時觸發
 *
 * @type {string}
 */
const EVENT_ON_EXTEND_COMMENT = 'bahamut_onExtendComment';

/**
 * 自訂事件: 標記狀態是否改變
 *
 * @type {string}
 */
const EVENT_ON_HIGHLIGHT_STATE_CHANGED = 'bahamut_onHighlightStateChanged';

/**
 * 設定值 key: 是否自動標記
 *
 * @type {string}
 */
const SETTING_KEY_AUTO_HIGHLIGHT = 'autoHighlight';

/**
 * 設定值 key: 設定檔
 *
 * @type {string}
 */
const SETTING_KEY_INFOS = 'infos';

/**
 * 處理程式執行器
 *
 * @type {Runner}
 */
const runner = new Runner();

/**
 * 全域資料
 */
const globalData = {
    infos: {                            // 標記資料
        color: {
            // '標記類型': '顏色, ex: rgb(220, 53, 69) 或 #dc3545',
        },
        user: {
            // '帳號 id': {
            //     title: '滑鼠移到連結上方的提示訊息',
            //     type: '標記類型'
            // },
        },
    },
    highlightState: false,              // 是否已標記
    extendCommentIsOverwrite: false,    // 更多留言功能是否已覆蓋
    gmMenuId_setManual: null,           // 設定為手動標記功能選單 ID
    gmMenuId_setAuto: null,             // 設定為自動標記功能選單 ID
};

/**
 * 設定是否已標記
 * @param {boolean} value
 * @returns
 */
function setHighlightState(value) {
    if (globalData.highlightState === value) {
        return;
    }

    globalData.highlightState = value;
    unsafeWindow.dispatchEvent(new CustomEvent(
        EVENT_ON_HIGHLIGHT_STATE_CHANGED,
        {
            detail: {
                value: value
            }
        }
    ));
}

/**
 * 覆蓋更多留言的功能, 令更多留言的動作觸發自訂事件 `bahamut_onExtendComment`
 */
function overwriteExtendComment() {
    const handler = {
        apply: function(target, thisArg, argumentsList) {
            const bsn = argumentsList[0];           // 哈拉版編號
            const snB = argumentsList[1];           // 文章編號
            const doneCallback = argumentsList[2];  // 執行完畢後的動作

            // 強制包一層以觸發事件
            const doneCallbackWrapper = function () {
                if (doneCallback) {
                    doneCallback();
                }
                unsafeWindow.dispatchEvent(new CustomEvent(
                    EVENT_ON_EXTEND_COMMENT,
                    {
                        detail: {
                            bsn: bsn,
                            snB: snB,
                        }
                    }
                ));
            };

            return target(bsn, snB, doneCallbackWrapper);
        }
    };

    unsafeWindow.extendComment = new Proxy(unsafeWindow.extendComment, handler);
    globalData.extendCommentIsOverwrite = true;
}

/**
 * 頁面載入完畢後等待 extendComment 有資料後才覆蓋原功能
 */
function tryOverwriteExtendComment() {
    if (unsafeWindow.extendComment) {
        overwriteExtendComment();
        return;
    }

    setTimeout(() => {
        tryOverwriteExtendComment();
    }, 100);
}

/**
 * 取得帳號頭像縮圖連結
 *
 * @param {string} userId 帳號名稱
 * @returns {string} 帳號頭像縮圖連結
 */
function getAvatarUserPicUrl(userId) {
    userId = userId.toLowerCase();

    const pathParts = [
        'avataruserpic',
        userId[0],
        userId[1],
        userId,
        `${userId}_s.png`
    ];
    const path = pathParts.map((e) => encodeURIComponent(e)).join('/');

    const url = new URL('https://avatar2.bahamut.com.tw');
    url.pathname += path;
    url.searchParams.set('v', (new Date()).getTime());

    return url.toString();
}

/**
 * 修改標籤文字顏色及提示訊息
 *
 * @param {HTMLElement} tag 標籤
 * @param {string} color 顏色
 * @param {string} title 提示文字
 */
function highlightTag(tag, color, title) {
    tag.dataset.bahaUserHighlight = true;
    if (color) {
        tag.style.color = color;
    }
    if (title) {
        tag.title = title;
    }
}

/**
 * 清除所有標記
 */
function clearHighlight() {
    const tags = document.querySelectorAll('[data-baha-user-highlight]');
    for (const tag of tags) {
        tag.removeAttribute('style');
        tag.removeAttribute('title');
        delete tag.dataset.bahaUserHighlight;
    }
    setHighlightState(false);
}

/**
 * 文章列表處理程式
 */
function handleListPage() {
    /**
     * 標記標籤內的帳號名稱
     *
     * @param {HTMLElement} tag
     */
    function highlight(tag) {
        const userId = tag.innerText.toLowerCase();
        const user = globalData.infos.user[userId];
        if (user) {
            const color = globalData.infos.color[user.type];
            highlightTag(tag, color, user.title);
        }
    }

    // 文章列表
    const formm = document.querySelector('form .b-list-wrap');

    // 「互動/人氣」的作者
    const countUsers = formm.querySelectorAll('p.b-list__count__user a');
    for (const countUser of countUsers) {
        highlight(countUser);
    }

    // 「最新回覆」的作者
    const timeUsers = formm.querySelectorAll('p.b-list__time__user a');
    for (const timeUser of timeUsers) {
        highlight(timeUser);
    }
    setHighlightState(true);
}

/**
 * 文章內文處理程式
 */
function handlePostPage() {
    const disablePostRegexList = [
        /^【(\w+) 的文章已折疊】.+$/,
        /^此文章已由原作者\((\w+)\)刪除$/,
        /^【刪除】(\w+)：.*/,
    ];

    // 樓層區塊
    function getSectionFloor(section) {
        const postHeader = section.querySelector('div.c-section__main div.c-post__header__author');
        const floor = postHeader.querySelector('a.floor').dataset.floor;
        return floor;
    }

    // 每一樓留言區塊
    function handleReply(tag) {
        const replys = tag.querySelectorAll('.c-reply__item');
        for (const reply of replys) {
            const userId = reply.querySelector('a.reply-avatar img').dataset.gamercardUserid.toLowerCase();
            const user = globalData.infos.user[userId];
            if (user) {
                const color = globalData.infos.color[user.type];
                highlightTag(reply, color, user.title);
                if (color) {
                    reply.style.borderLeft = `3px solid ${color}`;
                    reply.style.paddingLeft = '33px';
                }
            }
        }
    }

    // 每一樓文章作者
    function handlePost(section) {
        const sectionMain = section.querySelector('div.c-section__main');

        if (sectionMain.classList.contains('c-disable')) {
            // 被摺疊的文章/原作者刪文/被版主刪文
            const hint = sectionMain.querySelector('div.hint');
            for (const regex of disablePostRegexList) {
                const matches = regex.exec(hint.innerText);
                if (matches) {
                    const userId = matches[1].toLowerCase();
                    const user = globalData.infos.user[userId];
                    if (user) {
                        const span = document.createElement('span');
                        span.innerText = userId;

                        const color = globalData.infos.color[user.type];
                        highlightTag(span, color, user.title);

                        hint.innerHTML = hint.innerText.replace(userId, span.outerHTML);
                    }
                    break;
                }
            }
        }
        else if (sectionMain.classList.contains('c-post')) {
            // 一般文章
            const tag = sectionMain.querySelector('div.c-post__header__author a.userid');
            const userId = tag.innerText.toLowerCase();
            const user = globalData.infos.user[userId];
            if (user) {
                const color = globalData.infos.color[user.type];
                highlightTag(tag, color, user.title);
            }
        }
    }

    // 展開留言時取得留言清單並處理標示動作
    if (!globalData.extendCommentIsOverwrite) {
        tryOverwriteExtendComment();
        unsafeWindow.addEventListener(EVENT_ON_EXTEND_COMMENT, function (e) {
            const snB = e.detail.snB;
            const commentList = document.querySelector(`div#Commendlist_${snB}`);
            handleReply(commentList);
        });
    }

    // 每一樓區塊
    const sections = document.querySelectorAll('#BH-master section.c-section');
    for (const section of sections) {
        handlePost(section);
        handleReply(section);
    }
    setHighlightState(true);
}

/**
 * 刪除手動標記選單並顯示自動標記選單功能
 */
function setupSetAutoMenu() {
    if (globalData.gmMenuId_setManual) {
        GM_unregisterMenuCommand(globalData.gmMenuId_setManual);
        globalData.gmMenuId_setManual = null;
    }

    globalData.gmMenuId_setAuto = GM_registerMenuCommand('設定為自動標記', function () {
        GM_setValue(SETTING_KEY_AUTO_HIGHLIGHT, true);

        setupSetManualMenu();
        runner.start();
    });
}

/**
 * 刪除自動標記選單並顯示手動標記選單功能
 */
function setupSetManualMenu() {
    if (globalData.gmMenuId_setAuto) {
        GM_unregisterMenuCommand(globalData.gmMenuId_setAuto);
        globalData.gmMenuId_setAuto = null;
    }

    globalData.gmMenuId_setManual = GM_registerMenuCommand('設定為手動標記', function () {
        GM_setValue(SETTING_KEY_AUTO_HIGHLIGHT, false);

        setupSetAutoMenu();
    });
}

/**
 * 匯出設定檔
 */
function exportHighlightInfos() {
    const downloadLink = document.createElement('a');
    const blob = new Blob([JSON.stringify(globalData.infos)], {type: 'text/plain'});
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'infos.json';
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);
}

/**
 * 驗證 infos 資料是否正確
 *
 * @param {any} infos JSON 檔案內容
 */
function validateInfos(infos) {
    if (typeof infos !== 'object') {
        throw '不正確的 JSON (非 object 型別)';
    }

    if ('color' in infos) {
        if (typeof infos.color !== 'object') {
            throw 'color 型別不正確';
        }

        for (const [name, color] of Object.entries(infos.color)) {
            if (typeof color !== 'string') {
                throw `color.${name} 型別不正確`;
            }
        }
    }

    if ('user' in infos) {
        if (typeof infos.user !== 'object') {
            throw 'user 型別不正確';
        }

        for (const [userId, info] of Object.entries(infos.user)) {
            if (typeof info !== 'object') {
                throw `user.${userId} 型別不正確`;
            }
            if (!('title' in info)) {
                throw `user.${userId} 缺少 title 屬性`;
            }
            if (typeof info.title !== 'string') {
                throw `user.${userId}.title 型別不正確`;
            }
            if (!('type' in info)) {
                throw `user.${userId} 缺少 type 屬性`;
            }
            if (typeof info.type !== 'string') {
                throw `user.${userId}.type 型別不正確`;
            }
        }
    }
}

/**
 * 設定腳本選單功能
 */
function setupGMMenu() {
    if (GM_getValue(SETTING_KEY_AUTO_HIGHLIGHT)) {
        setupSetManualMenu();
    }
    else {
        setupSetAutoMenu();
    }
}

/**
 * 置頂列增加功能選項
 */
async function addTopBarOption() {
    const TOPBAR_MSG_ID = 'highlight';
    const ICON_COLOR_OFF = '#0e4355';
    const ICON_COLOR_ON = '#fff';

    /**
     * 建立置頂列按鈕
     *
     * @returns {HTMLLIElement}
     */
    function createTopBarButton() {
        // 提示訊息
        const span = document.createElement('span');
        span.classList.add('text-tooltip');
        span.innerText = '帳號標記';

        // Font Awesome 4 圖示
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-lightbulb-o', 'fa-lg');
        icon.style.height = '25px';
        icon.style.position = 'relative';
        icon.style.lineHeight = '35px';
        icon.style.color = ICON_COLOR_OFF;

        // 使用巴哈原有的 dropdown 功能
        const a = document.createElement('a');
        a.id = 'topBar_highlight';
        a.href = `javascript:TopBar.showMenu('${TOPBAR_MSG_ID}', '')`;
        a.appendChild(span);
        a.appendChild(icon);

        // 手機模式不顯示選項
        const li = document.createElement('li');
        li.classList.add('mobilehide');
        li.appendChild(a);

        // 標記狀態改變時切換圖示顏色
        unsafeWindow.addEventListener(EVENT_ON_HIGHLIGHT_STATE_CHANGED, function (e) {
            icon.style.color = e.detail.value ? ICON_COLOR_ON : ICON_COLOR_OFF;
        });

        return li;
    }

    /**
     * 建立選單內容
     *
     * @returns {HTMLDivElement}
     */
    function createContent() {
        function fileReaderOnLoad(e) {
            let infos = null;
            try {
                infos = JSON.parse(this.result);
                if (!('color' in infos)) {
                    infos.color = {};
                }
                if (!('user' in infos)) {
                    infos.user = {};
                }
            }
            catch (error) {
                toastr.error('非 JSON 檔案');
                return;
            }

            try {
                validateInfos(infos);
            }
            catch (error) {
                toastr.error(error);
                return;
            }

            globalData.infos = infos;

            GM_setValue(SETTING_KEY_INFOS, infos);
            toastr.success('匯入成功');

            if (GM_getValue(SETTING_KEY_AUTO_HIGHLIGHT)) {
                clearHighlight();
                runner.start();
            }
        }

        /**
         * 建立選單底部按鈕
         *
         * @param {string} href link href，無功能時填 `'#'`
         * @param {string} text 文字
         * @param {string[]} iconClasses Font Awesome 4 圖示類別名稱
         * @returns {HTMLAnchorElement}
         */
        function createFooterButton(href, text, iconClasses) {
            const icon = document.createElement('i');
            icon.classList.add(...iconClasses);
            icon.setAttribute('aria-hidden', 'true');

            const link = document.createElement('a');
            link.href = href;
            link.appendChild(icon);
            link.appendChild(document.createTextNode(text));

            return link;
        }

        // 標題
        const titleSpan = document.createElement('span');
        titleSpan.innerText = '帳號標記腳本功能';

        const contentDiv = document.createElement('div');
        contentDiv.id = `topBarMsgList_${TOPBAR_MSG_ID}`;
        contentDiv.classList.add('TOP-msglist', 'TOP-board');

        const fileSelector = document.createElement('input');
        fileSelector.type = 'file';
        fileSelector.accept = 'application/json';
        contentDiv.appendChild(fileSelector);

        const fileReader = new FileReader();
        fileReader.addEventListener('load', fileReaderOnLoad);

        const footerDiv = document.createElement('div');
        footerDiv.classList.add('TOP-msgbtn');

        const importButton = createFooterButton('#', '匯入', ['fa', 'fa-download']);
        importButton.addEventListener('click', function (e) {
            if (fileSelector.files.length <= 0) {
                toastr.error('請選擇檔案');
                return;
            }

            fileReader.readAsText(fileSelector.files[0]);
        });
        footerDiv.appendChild(importButton);

        const exportButton = createFooterButton('#', '匯出', ['fa', 'fa-upload']);
        exportButton.addEventListener('click', function (e) {
            exportHighlightInfos();
        });
        footerDiv.appendChild(exportButton);

        // 內容
        const wrapperDiv = document.createElement('div');
        wrapperDiv.id = `topBarMsg_${TOPBAR_MSG_ID}`;
        wrapperDiv.classList.add('TOP-msg');
        wrapperDiv.style.display = 'none';
        wrapperDiv.appendChild(titleSpan);
        wrapperDiv.appendChild(contentDiv);
        wrapperDiv.appendChild(footerDiv);

        return wrapperDiv;
    }

    // 插入在站內信左邊
    const topUl = document.querySelector('div.TOP-my ul');
    topUl.insertBefore(createTopBarButton(), topUl.firstChild);

    // 比照巴哈網頁架構塞入選單內頁至同樣的 div 下
    const topDataDiv = document.querySelector('#BH-top-data');
    topDataDiv.appendChild(createContent());
}

/**
 * 主程式
 */
async function main() {
    runner.register(/^\/B[o]?\.php$/, handleListPage);
    runner.register(/^\/C[o]?\.php$/, handlePostPage);

    runner.start();
}

(function() {
    'use strict';

    setupGMMenu();
    addTopBarOption();

    const infos = GM_getValue(SETTING_KEY_INFOS, {color: {}, user: {}});
    if (infos) {
        globalData.infos = infos;
    }

    if (GM_getValue(SETTING_KEY_AUTO_HIGHLIGHT)) {
        main();
    }
})();