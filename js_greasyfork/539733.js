// ==UserScript==
// @name         에펨코리아 메모
// @name:ko      에펨코리아 메모
// @namespace    https://fmkorea.com
// @author       에펨코리아 메모
// @version      2506204
// @description    FM코리아 게시글 작성자에 대해 메모를 달 수 있는 확장 프로그램
// @description:ko FM코리아 게시글 작성자에 대해 메모를 달 수 있는 확장 프로그램
// @match        https://www.fmkorea.com/*
// @icon         https://www.fmkorea.com/favicon.ico?2
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539733/%EC%97%90%ED%8E%A8%EC%BD%94%EB%A6%AC%EC%95%84%20%EB%A9%94%EB%AA%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/539733/%EC%97%90%ED%8E%A8%EC%BD%94%EB%A6%AC%EC%95%84%20%EB%A9%94%EB%AA%A8.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const SCRIPT_NAME = 'FMK-MEMO-TM';
    const DEBUG_MODE = true;

    const log = (...args) => DEBUG_MODE && console.log(`[${SCRIPT_NAME}]`, ...args);
    const error = (...args) => console.error(`[${SCRIPT_NAME}]`, ...args);

    if (window.__fmkMemoAlreadyLoaded) {
        log('스크립트가 이미 로드되어 있어 중복 실행을 방지합니다.');
        return;
    }
    window.__fmkMemoAlreadyLoaded = true;
    log('스크립트 실행 시작');

    const MEMBER_CLASS_PREFIX = 'member_';

    const CONSTANTS = {
        SORT_BY_DATE: 'date',
        SORT_BY_NAME: 'name',
        MEMBER_CLASS_PREFIX: MEMBER_CLASS_PREFIX,
        PROCESSED_ATTR: 'data-fmk-processed',
        INLINE_MEMO_CLASS: 'fmk-inline-memo',
        SELECTORS: {
            managerOverlay: '#fmk-memo-manager-overlay',
            importOverlay: '#fmk-memo-import-overlay',
            memoList: '#memoList',
            unprocessedPlate: `a[data-class]:not([class*="${MEMBER_CLASS_PREFIX}"])`,
            processedPlate: (uid) => `.${MEMBER_CLASS_PREFIX}${uid}`,
            allPlates: `[class*="${MEMBER_CLASS_PREFIX}"]`,
            unprocessedAuthor: '.author:not(:has(.member_plate))',
            postBody: '.rd_body',
            authorAnchor: `.rd_hd .btm_area a.member_plate[class*="${MEMBER_CLASS_PREFIX}"], .author a[class*="${MEMBER_CLASS_PREFIX}"]`,
            docTitleLink: '.bd_tl h1 a[href^="/"]:not([href="/"])',
            ogUrlMeta: 'meta[property="og:url"]',
            memberInfoTable: 'table.table.row',
            loginFormPasswordInput: 'input[name="password"]',
            profileImageCell: 'td.profile_image',
            baseInfoRow: 'th[colspan]',
            postListRows: 'tbody tr, .list_tbody .list_row, .fm_best_widget li.li',
            postTitleLink: '.title a, h3.title a, td.title a',
            postCategoryLink: '.cate a',
            postTime: '.time, td.time, .regdate',
            postViews: '.m_no, td.m_no',
            postVotes: '.m_no_voted, td.m_no_voted, .pc_voted_count .count',
            inlineMemo: `.${'fmk-inline-memo'}`,
        }
    };

    function createElement(tag, properties = {}, children = []) {
        const el = document.createElement(tag);
        for (const key in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, key)) {
                if (key === 'style' && typeof properties.style === 'object') {
                    Object.assign(el.style, properties.style);
                } else if (key === 'dataset' && typeof properties.dataset === 'object') {
                    Object.assign(el.dataset, properties.dataset);
                } else if (key in el) {
                    try { el[key] = properties[key]; } catch (e) { el.setAttribute(key, properties[key]); }
                } else {
                    el.setAttribute(key, properties[key]);
                }
            }
        }
        children.forEach(child => { if(child) el.append(child); });
        return el;
    }

    GM_addStyle(`
    body:not(.night_mode) {
        --fmk-bg-primary: #ffffff;
        --fmk-bg-secondary: #ffffff;
        --fmk-bg-tertiary: #f0f2f5;
        --fmk-text-primary: #1c1e21;
        --fmk-text-secondary: #65676b;
        --fmk-border-primary: #dce0e4;
        --fmk-border-secondary: #bec3c9;
        --fmk-shadow-color: rgba(0, 0, 0, 0.15);
        --fmk-button-bg: #f5f6f7;
        --fmk-button-hover-bg: #e9eaec;
        --fmk-button-action-bg: #007bff;
        --fmk-button-action-text: #ffffff;
    }
    body.night_mode {
        --fmk-bg-primary: #2a2a2a;
        --fmk-bg-secondary: #3a3a3a;
        --fmk-bg-tertiary: #4a4a4a;
        --fmk-text-primary: #e4e6eb;
        --fmk-text-secondary: #b0b3b8;
        --fmk-border-primary: #555555;
        --fmk-border-secondary: #666666;
        --fmk-shadow-color: rgba(0, 0, 0, 0.6);
        --fmk-button-bg: #444444;
        --fmk-button-hover-bg: #555555;
        --fmk-button-action-bg: #4b87ff;
        --fmk-button-action-text: #ffffff;
    }
    #fmk-memo-manager-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 999998; display: flex; align-items: center; justify-content: center;
        backdrop-filter: blur(2px);
    }
    #fmk-memo-manager-container {
        font-family: 'Segoe UI', Arial, sans-serif;
        background-color: var(--fmk-bg-primary);
        color: var(--fmk-text-primary);
        width: 350px; max-height: 90vh; border-radius: 8px;
        box-shadow: 0 5px 25px var(--fmk-shadow-color);
        display: flex; flex-direction: column;
        animation: fmk-manager-fadein 0.2s ease-out;
        border: 1px solid var(--fmk-border-primary);
    }
    @keyframes fmk-manager-fadein { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
    #fmk-memo-manager-container .manager-header { padding: 16px; border-bottom: 1px solid var(--fmk-border-primary); }
    #fmk-memo-manager-container h1 { font-size: 18px; margin: 0; font-weight: 600; color: var(--fmk-text-primary); }
    #fmk-memo-manager-container .manager-content { padding: 16px; overflow-y: auto; flex-grow: 1; }
    #searchMemo {
        width: 100%; box-sizing: border-box; margin-bottom: 12px; padding: 8px 12px;
        background-color: var(--fmk-bg-secondary);
        color: var(--fmk-text-primary);
        border: 1px solid var(--fmk-border-primary);
        border-radius: 6px; font-size: 14px; transition: all 0.2s;
    }
    #searchMemo::placeholder { color: var(--fmk-text-secondary); }
    #searchMemo:focus { outline: none; border-color: var(--fmk-border-secondary); }
    .items-container {
        max-height: 280px; overflow-y: auto; margin-bottom: 16px;
        border: 1px solid var(--fmk-border-primary);
        border-radius: 8px; padding: 10px;
        background-color: var(--fmk-bg-secondary);
    }
    .item {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 2px; padding: 4px; border-radius: 6px;
        transition: background-color 0.2s; cursor: pointer;
    }
    .item:hover { background-color: var(--fmk-bg-tertiary); }
    .item span { flex: 1; word-break: break-word; color: var(--fmk-text-primary); }
    .import-export-area { display: flex; gap: 8px; }
    .import-export-area button {
        flex: 1; background-color: var(--fmk-button-bg); color: var(--fmk-text-primary);
        border: 1px solid var(--fmk-border-primary); border-radius: 6px;
        padding: 6px 12px; cursor: pointer; transition: all 0.2s; font-size: 12px;
    }
    .import-export-area button:hover {
        background-color: var(--fmk-button-hover-bg); border-color: var(--fmk-border-secondary);
    }
    #fmk-memo-manager-container .manager-footer {
        padding: 12px 16px; border-top: 1px solid var(--fmk-border-primary);
        display: flex; justify-content: flex-end; gap: 8px;
    }
    #fmk-memo-manager-container .manager-footer button {
        background-color: var(--fmk-button-bg); color: var(--fmk-text-primary);
        border: 1px solid var(--fmk-border-primary); border-radius: 6px;
        padding: 6px 14px; cursor: pointer; transition: all 0.2s; font-size: 13px;
    }
    #fmk-memo-manager-container .manager-footer button:hover {
        background-color: var(--fmk-button-hover-bg); border-color: var(--fmk-border-secondary);
    }
    .fmk-context-popup {
        position: absolute; z-index: 999999;
        background: var(--fmk-bg-primary);
        color: var(--fmk-text-primary);
        border: 1px solid var(--fmk-border-primary);
        border-radius: 8px; padding: 12px; width: 260px; font-size: 13px;
        box-shadow: 0 4px 12px var(--fmk-shadow-color);
        animation: fmk-popup-fadein 0.15s ease-out;
        display: flex; flex-direction: column; gap: 8px;
    }
    .fmk-popup-title-area {
        display: flex; justify-content: space-between; align-items: center;
        padding-bottom: 8px; border-bottom: 1px solid var(--fmk-border-primary); margin-bottom: 4px;
    }
    .fmk-popup-title {
        font-weight: 700; margin-right: 8px; flex-shrink: 1;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .fmk-context-popup textarea {
        width: 100%; box-sizing: border-box; background: var(--fmk-bg-secondary);
        color: var(--fmk-text-primary); border: 1px solid var(--fmk-border-primary);
        border-radius: 6px; padding: 6px; resize: vertical;
    }
    .fmk-context-popup textarea::placeholder { color: var(--fmk-text-secondary); }
    .fmk-history-container {
        margin-top: 4px; border-top: 1px solid var(--fmk-border-primary); padding-top: 8px;
    }
    .fmk-history-title {
        font-weight: bold; font-size: 12px; margin-bottom: 5px; color: var(--fmk-text-secondary);
    }
    .fmk-history-container ul {
        list-style: none; padding: 0; margin: 0; max-height: 80px; overflow-y: auto;
        font-size: 12px; color: var(--fmk-text-primary);
    }
    .fmk-history-container ul li { margin-bottom: 3px; }
    .fmk-color-wrap { margin-top: 4px; font-size: 12px; }
    .fmk-popup-buttons { display: flex; gap: 8px; margin-top: 4px; }
    .fmk-popup-buttons button {
        flex: 1; padding: 8px 0; border-radius: 6px; font-weight: 600;
        font-size: 13px; cursor: pointer;
        background: var(--fmk-button-bg);
        border: 1px solid var(--fmk-border-primary);
        color: var(--fmk-text-primary);
        transition: all .15s;
    }
    .fmk-popup-buttons button:hover {
        background: var(--fmk-button-hover-bg);
        border-color: var(--fmk-border-secondary);
    }
    .fmk-popup-buttons button.save-btn:hover {
        background: var(--fmk-button-action-bg);
        border-color: var(--fmk-button-action-bg);
        color: var(--fmk-button-action-text);
    }
    .fmk-info-panel {
        background: var(--fmk-bg-secondary);
        color: var(--fmk-text-primary);
        border: 1px solid var(--fmk-border-primary);
        margin: 32px 0; padding: 20px; border-radius: 8px;
        display: flex; gap: 24px; flex-wrap: nowrap;
        max-height: 250px; overflow: hidden;
    }
    .fmk-info-panel-box {
        flex: 1 1 auto;
        border: 1px solid var(--fmk-border-primary);
        background: var(--fmk-bg-primary);
        padding: 14px; min-width: 300px; overflow-y: auto;
        display: flex; flex-direction: column; border-radius: 6px;
    }
    .fmk-info-panel-left { flex-grow: 0; flex-shrink: 0; flex-basis: 320px; }
    .fmk-info-panel-right { overflow: hidden; }
    .fmk-info-panel-title { font-weight: 700; margin: 0 0 12px; color: var(--fmk-text-primary); flex-shrink: 0; }
    .fmk-info-panel-content { list-style: disc; padding-left: 18px; margin: 0; flex-grow: 1; overflow-y: auto; }
    .fmk-info-panel-content a { color: #4ea6ff; text-decoration: none; }
    .fmk-info-panel-content a:hover { text-decoration: underline; }
    .fmk-info-panel-content .fmk-post-meta { color: var(--fmk-text-secondary); font-size: 12px; }
    .fmk-info-panel-box table th,
    .fmk-info-panel-box table td {
        background-color: transparent !important;
        color: var(--fmk-text-primary) !important;
    }
    body.night_mode .fmk-info-panel { background: #1e1e1e; border: 1px solid #444; }
    body.night_mode .fmk-info-panel-box { background: #1e1e1e; border-color: #555; }
    @keyframes fmk-popup-fadein { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .fmk-inline-memo { display: inline; font-weight: bold; padding: 1px 2px; border-radius: 4px; }
    .author > span { display: inline !important; }
    li a .fmk-inline-memo { margin-left: 0px !important; }
    li a .fmk-inline-memo:before, .fmk-inline-memo:before { content: "["; margin-right: 1px; }
    li a .fmk-inline-memo:after, .fmk-inline-memo:after { content: "]"; margin-left: 1px; }
    @keyframes fmk-nick-blink {
      0%,100% { outline: 2px solid #ffb84d; outline-offset:2px; }
      50% { outline-color: transparent; }
    }
    .fmk-nick-blink { animation: fmk-nick-blink 1.5s ease-in-out 1; }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--fmk-bg-secondary); border-radius: 4px; }
    ::-webkit-scrollbar-thumb { background: var(--fmk-bg-tertiary); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--fmk-border-secondary); }
    input[type="color"] {
        vertical-align: middle; border-radius: 4px; border: 1px solid var(--fmk-border-primary);
        width: 35px; height: 20px; cursor: pointer; background-color: var(--fmk-bg-secondary); padding: 0;
    }
    .fmk-sort-controls {
        margin-bottom: 12px; font-size: 12px; display: flex; align-items: center;
        justify-content: space-between; gap: 8px; color: var(--fmk-text-secondary);
    }
    .fmk-sort-group { display: flex; align-items: center; gap: 8px; }
    .fmk-sort-controls button {
        background: none; border: 1px solid var(--fmk-border-primary); color: var(--fmk-text-secondary);
        padding: 3px 8px; border-radius: 12px; cursor: pointer; transition: all 0.2s;
    }
    .fmk-sort-controls button:hover { border-color: var(--fmk-border-secondary); color: var(--fmk-text-primary); }
    .fmk-sort-controls button.active {
        border-color: var(--fmk-button-action-bg);
        background-color: var(--fmk-button-action-bg);
        color: var(--fmk-button-action-text);
    }
    #clearAllBtn_inline {
        background: none; border: 1px solid #d9534f; color: #d9534f;
        padding: 3px 8px; border-radius: 12px; cursor: pointer; font-size: 12px; transition: all 0.2s;
    }
    #clearAllBtn_inline:hover { background-color: #d9534f; color: white; }
    .item-wrapper { display: flex; flex-direction: column; border-radius: 6px; transition: background-color 0.2s; }
    .item-wrapper:hover { background-color: var(--fmk-bg-tertiary); }
    .item { cursor: pointer; }
    .history-toggle-btn {
         margin-left: 6px; background-color: transparent; color: var(--fmk-text-secondary);
         border: 1px solid var(--fmk-border-secondary); border-radius: 6px; padding: 2px 6px;
         cursor: pointer; transition: all 0.2s; font-size: 10px; flex-shrink: 0;
    }
    .history-toggle-btn:hover { background-color: var(--fmk-button-hover-bg); }
    .item-history-container {
        padding: 8px 10px 4px 10px; margin: 0 4px 4px 4px;
        border-top: 1px solid var(--fmk-border-primary); animation: fmk-history-fadein 0.3s ease;
    }
    @keyframes fmk-history-fadein { from { opacity: 0; } to { opacity: 1; } }
    .item-history-title { font-weight: bold; font-size: 11px; margin-bottom: 5px; color: var(--fmk-text-secondary); }
    .item-history-container ul { list-style: none; padding: 0; margin: 0; font-size: 11px; color: var(--fmk-text-secondary); }
    .item-history-container ul li { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
    .history-delete-btn {
        background: none; border: none; color: var(--fmk-text-secondary); cursor: pointer;
        font-size: 16px; font-weight: bold; padding: 0 5px; border-radius: 50%;
        line-height: 1; width: 20px; height: 20px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center; transition: all 0.2s;
    }
    .history-delete-btn:hover { background-color: var(--fmk-button-hover-bg); color: #f44336; }
    #fmk-memo-import-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.7); z-index: 999999;
        display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);
    }
    #fmk-memo-import-popup {
        background-color: var(--fmk-bg-primary); color: var(--fmk-text-primary); width: 320px;
        border-radius: 8px; box-shadow: 0 5px 25px var(--fmk-shadow-color);
        display: flex; flex-direction: column; animation: fmk-manager-fadein 0.2s ease-out;
        border: 1px solid var(--fmk-border-primary);
    }
    #fmk-memo-import-popup .popup-header { padding: 14px; border-bottom: 1px solid var(--fmk-border-primary); font-size: 16px; font-weight: 600; }
    #fmk-memo-import-popup .popup-content { padding: 16px; }
    #fmk-memo-import-popup #importPopupText {
        width: 100%; height: 120px; box-sizing: border-box; background: var(--fmk-bg-secondary);
        color: var(--fmk-text-primary); border: 1px solid var(--fmk-border-primary);
        border-radius: 6px; padding: 8px; resize: vertical; font-size: 13px;
    }
    #fmk-memo-import-popup .popup-footer {
        padding: 12px 16px; border-top: 1px solid var(--fmk-border-primary);
        display: flex; justify-content: flex-end; gap: 8px;
    }
    #fmk-memo-import-popup .popup-footer button {
        background-color: var(--fmk-button-bg); color: var(--fmk-text-primary);
        border: 1px solid var(--fmk-border-primary); border-radius: 6px;
        padding: 6px 14px; cursor: pointer; transition: all 0.2s; font-size: 13px;
    }
    #fmk-memo-import-popup .popup-footer button#doImportBtn {
        background-color: var(--fmk-button-action-bg); border-color: var(--fmk-button-action-bg);
        color: var(--fmk-button-action-text);
    }
    .quick-delete-btn {
        background: none; border: none; color: var(--fmk-text-secondary); cursor: pointer;
        font-size: 16px; font-weight: bold; padding: 0 5px; border-radius: 50%;
        line-height: 1; width: 20px; height: 20px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.2s; margin-left: 6px;
    }
    .quick-delete-btn:hover { background-color: var(--fmk-button-hover-bg); color: #d9534f; }

    .fmk-activity-tracker {
        display: flex;
        align-items: center;
        gap: 5px;
        flex-shrink: 0;
    }
    .fmk-activity-tracker input[type="checkbox"] {
        margin: 0;
        width: 15px;
        height: 15px;
        vertical-align: middle;
        cursor: pointer;
    }
    .fmk-activity-tracker-button {
        font-size: 11px;
        font-weight: normal;
        padding: 3px 7px;
        border-radius: 4px;
        color: var(--fmk-text-secondary);
        background-color: transparent;
        border: 1px solid transparent;
        transition: all 0.25s ease-in-out;
        cursor: default;
    }
    .fmk-activity-tracker input[type="checkbox"]:checked + .fmk-activity-tracker-button {
        font-weight: bold;
        color: var(--fmk-button-action-text);
        background-color: var(--fmk-button-action-bg);
        border-color: var(--fmk-button-action-bg);
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .fmk-activity-tracker input[type="checkbox"]:checked + .fmk-activity-tracker-button:hover {
        filter: brightness(1.1);
    }
    .fmk-simple-popup {
    position: absolute;
    z-index: 1000000;
    background: var(--fmk-bg-primary);
    color: var(--fmk-text-primary);
    width: 500px; /* 너비를 320px에서 450px로 확장 */
    max-height: 500px; /* 최대 높이도 약간 확장 */
    border-radius: 8px;
    box-shadow: 0 5px 25px var(--fmk-shadow-color);
    display: flex;
    flex-direction: column;
    animation: fmk-popup-fadein .15s ease-out;
    border: 1px solid var(--fmk-border-primary);
}

/* 팝업 헤더 */
.fmk-simple-popup-header {
    padding: 12px 16px;
    border-bottom: 1px solid var(--fmk-border-primary);
    font-size: 14px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.fmk-simple-popup-close-btn {
    background: none;
    border: none;
    color: var(--fmk-text-secondary);
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    padding: 0 8px;
    border-radius: 50%;
    line-height: 1;
    transition: all 0.2s;
}
.fmk-simple-popup-close-btn:hover {
    background-color: var(--fmk-button-hover-bg);
    color: #f44336;
}

/* 팝업 본문 (스크롤 영역) */
.fmk-simple-popup-body {
    padding: 0; /* 내부 리스트에서 패딩을 관리하므로 0으로 설정 */
    overflow-y: auto;
    flex-grow: 1;
}
.fmk-simple-popup-body ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

/* 목록의 각 항목(li) - Flexbox 컨테이너 */
.fmk-simple-popup-body li {
    padding: 10px 16px; /* 좌우 패딩을 헤더와 맞춤 */
    border-bottom: 1px solid var(--fmk-border-primary);
    display: flex;
    align-items: center; /* 세로 상단 정렬 */
    gap: 12px; /* 왼쪽과 오른쪽 영역 사이의 간격 */
}
.fmk-simple-popup-body li:last-child {
    border-bottom: none;
}

/* 게시판 이름 (왼쪽 영역) */
.activity-log-board {
    font-size: 13px;
    font-weight: bold;
    color: var(--fmk-text-secondary);
    flex-shrink: 0; /* 너비가 줄어들지 않도록 고정 */
    max-width: 120px;
    white-space: nowrap; /* 이름이 길어도 한 줄로 표시 */
    overflow: hidden; /* 넘치는 부분은 숨김 */
    text-overflow: ellipsis; /* 넘치는 부분은 ...으로 표시 */
}

/* 글 제목 + 메타 정보 (오른쪽 영역) */
.activity-log-main {
    display: flex;
    flex-direction: column; /* 제목과 메타정보를 세로로 정렬 */
    gap: 4px; /* 제목과 메타정보 사이 간격 */
    flex-grow: 1; /* 남은 공간을 모두 차지 */
    min-width: 0; /* Flex 아이템이 넘칠 때 내부 요소가 올바르게 줄바꿈되도록 함 */
}
.activity-log-main a {
    font-size: 14px;
    color: #4ea6ff;
    text-decoration: none;
    word-break: break-all; /* 매우 긴 글 제목이 레이아웃을 깨뜨리는 것을 방지 */
}
.activity-log-main a:hover {
    text-decoration: underline;
}

/* 메타 정보 (작성시간, 조회수 등) */
.activity-log-meta {
    font-size: 11px;
    color: var(--fmk-text-secondary);
}

/* 로딩 메시지 */
.fmk-simple-popup-loading {
    text-align: center;
    padding: 40px;
    color: var(--fmk-text-secondary);
}
`);
    log('CSS 스타일 주입 완료');

    const cached = {};
    let panelInserted = false;
    let currentContextPopup = null;
    let currentActivityPanel = null;

    const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const getThemeAwareRandomColor = () => { const isDarkMode = document.body.classList.contains('night_mode'); let r, g, b; if (isDarkMode) { r = Math.floor(128 + Math.random() * 128); g = Math.floor(128 + Math.random() * 128); b = Math.floor(128 + Math.random() * 128); } else { r = Math.floor(Math.random() * 128); g = Math.floor(Math.random() * 128); b = Math.floor(Math.random() * 128); } return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0')}`; };
    const getNick = el => el.innerText.trim().replace(/^\/\s*/, '') || 'Unknown';
    const clampPopup = p => { const r = p.getBoundingClientRect(), pad = 8; let left = parseInt(p.style.left, 10), top = parseInt(p.style.top, 10); if (r.right > window.innerWidth - pad) left = window.innerWidth - pad - r.width; if (r.bottom > window.innerHeight - pad) top = window.innerHeight - pad - r.height; if (left < pad) left = pad; if (top < pad) top = pad; p.style.left = left + 'px'; p.style.top = top + 'px'; };

    function updNick(u, newNick) {
        if (!u || !u.nickname) return true;
        return u.nickname !== newNick;
    }
    function normalizeMemo(m) {
        if (!m) return null;
        if (!Array.isArray(m.history)) m.history = m.text ? [{ date: m.lastUpdate || today(), text: m.text }] : [];
        if (!Array.isArray(m.nickHistory)) { const seeds = Array.isArray(m.nicknames) ? m.nicknames : m.nickname ? [m.nickname] : []; m.nickHistory = seeds.map(n => ({ date: m.lastUpdate || today(), nick: n })); }
        if (!m.nickname && m.nickHistory.length) m.nickname = m.nickHistory.at(-1).nick;
        m.isMarked = m.isMarked || false;
        m.activityLog = m.activityLog || [];
        return m;
    }

    const setMemo = (el, t, c) => { let sp = el.querySelector(CONSTANTS.SELECTORS.inlineMemo); if (!sp) { sp = document.createElement('span'); sp.className = CONSTANTS.INLINE_MEMO_CLASS; el.appendChild(sp); } sp.textContent = t; Object.assign(sp.style, { color: c || '#ff7676', marginLeft: '2px', display: 'inline' }); };
    const delMemo = el => el.querySelector(CONSTANTS.SELECTORS.inlineMemo)?.remove();

    function closeContextPopup() { if (currentContextPopup) { document.body.removeChild(currentContextPopup); currentContextPopup = null; document.removeEventListener('mousedown', outsideContextPopup); } }
    const outsideContextPopup = e => {
        if (currentActivityPanel && currentActivityPanel.contains(e.target)) {
            return;
        }

        if (currentContextPopup && !currentContextPopup.contains(e.target)) {
            const trackerButton = currentContextPopup.querySelector('.fmk-activity-tracker-button');
            if (!trackerButton || !trackerButton.contains(e.target)) {
                closeContextPopup();
                closeActivityPanel();
            }
        }
    };
    function closeActivityPanel() { if (currentActivityPanel) { document.body.removeChild(currentActivityPanel); currentActivityPanel = null; } }

    async function showActivityLogPanel(uid, u, x, y) {
        log(`[활동 기록 열기 시작] 사용자: ${uid}`);
        closeActivityPanel();

        const closeBtn = createElement('button', { className: 'fmk-simple-popup-close-btn', textContent: '×', title: '닫기', onclick: (e) => { e.stopPropagation(); closeActivityPanel(); } });
        const panelHeader = createElement('div', { className: 'fmk-simple-popup-header' }, [ createElement('span', { textContent: `${u.nickname}님의 전체 활동 기록` }), closeBtn ]);
        const panelBody = createElement('div', { className: 'fmk-simple-popup-body' });
        const panel = createElement('div', { className: 'fmk-simple-popup', style: { left: `${x}px`, top: `${y + 30}px` } }, [ panelHeader, panelBody ]);

        document.body.appendChild(panel);
        currentActivityPanel = panel;
        clampPopup(panel);
        panelBody.innerHTML = '<div class="fmk-simple-popup-loading">최신 활동을 불러오는 중... (게시판 이름 확인 중)</div>';

        try {
            const searchMid = detectMid();
            log(`[데이터 가져오기] 현재 게시판(${searchMid})에서 검색 시작...`);
            const postHtml = await fetch(`https://www.fmkorea.com/search.php?mid=${searchMid}&search_target=member_srl&search_keyword=${uid}`).then(r => r.text());
            log('[데이터 가져오기] Fetch 완료.');

            const postDoc = new DOMParser().parseFromString(postHtml, 'text/html');
            const rows = [...postDoc.querySelectorAll(CONSTANTS.SELECTORS.postListRows)];
            log(`[데이터 파싱] ${rows.length}개의 행 발견.`);

            // 변경 시작: 각 게시글의 상세 페이지를 비동기 병렬로 요청하여 정확한 게시판 이름을 가져옵니다.
            const postPromises = rows.map(async (el) => {
                const a = el.querySelector(CONSTANTS.SELECTORS.postTitleLink);
                if (!a) return null;

                const docSrlMatch = a.href.match(/\/(\d+)(?:\?|#|$)|document_srl=(\d+)/);
                if (!docSrlMatch) return null;

                const docSrl = docSrlMatch[1] || docSrlMatch[2];
                if (!docSrl) return null;

                const postRelativeHref = `/${docSrl}`;
                let boardName = '알 수 없음'; // 기본값

                try {
                    // 각 게시글 페이지를 fetch
                    const singlePostHtml = await fetch(postRelativeHref).then(res => res.text());
                    const singlePostDoc = new DOMParser().parseFromString(singlePostHtml, 'text/html');
                    // '.bd_tl' 내부의 첫 번째 a 태그에서 게시판 이름 추출
                    const boardNameEl = singlePostDoc.querySelector('.bd_tl h1 a[href^="/"]');
                    if (boardNameEl) {
                        boardName = boardNameEl.textContent.trim();
                    } else {
                        // 만약 못 찾으면 기존 방식으로 fallback
                        const fallbackBoardNameEl = el.querySelector('td.cate a, .category a');
                        if(fallbackBoardNameEl) boardName = fallbackBoardNameEl.textContent.trim();
                    }
                } catch (fetchErr) {
                    error(`[Activity Log] 게시판 이름 가져오기 실패 (게시글: ${docSrl}):`, fetchErr);
                    // 실패 시 기존 방식으로 시도
                    const fallbackBoardNameEl = el.querySelector('td.cate a, .category a');
                    if(fallbackBoardNameEl) boardName = fallbackBoardNameEl.textContent.trim();
                }

                const date = (el.querySelector(CONSTANTS.SELECTORS.postTime)?.textContent || '').trim();
                const views = (el.querySelector(CONSTANTS.SELECTORS.postViews)?.textContent || '').trim();
                const votes = (el.querySelector(CONSTANTS.SELECTORS.postVotes)?.textContent || '').trim();

                return {
                    id: docSrl,
                    title: a.textContent.trim(),
                    href: postRelativeHref,
                    board: boardName, // 새로 가져온 게시판 이름 사용
                    date,
                    views,
                    votes,
                    timestamp: new Date(date).getTime() || Date.now()
                };
            });

            // 모든 Promise가 완료될 때까지 기다린 후 null 값을 필터링
            const resolvedPosts = await Promise.all(postPromises);
            const newPosts = resolvedPosts.filter(p => p !== null);
            // 변경 끝

            const existingLogIds = new Set(u.activityLog.map(p => p.id));
            let hasNewData = newPosts.some(p => !existingLogIds.has(p.id));

            log(`[데이터 파싱] ${newPosts.length}개의 유효한 글 파싱 완료.`);

            const combinedLog = [...u.activityLog, ...newPosts];
            const uniqueLog = Array.from(new Map(combinedLog.map(item => [item.id, item])).values());
            uniqueLog.sort((a, b) => b.timestamp - a.timestamp);
            const finalLog = uniqueLog.slice(0, 100);
            log(`[데이터 처리] 최종 기록 ${finalLog.length}개 생성 완료.`);

            panelBody.innerHTML = '';
            if (finalLog.length === 0) {
                panelBody.innerHTML = '<div class="fmk-simple-popup-loading">기록된 활동이 없습니다.</div>';
            } else {
                const ul = createElement('ul');
                finalLog.forEach(post => {
                    const metaParts = [];
                    if (post.date) metaParts.push(post.date);
                    if (post.views) metaParts.push(`조회 ${post.views}`);
                    if (post.votes) metaParts.push(`추천 ${post.votes}`);
                    const metaText = metaParts.join(' · ');

                    const boardSpan = createElement('div', {
                        className: 'activity-log-board',
                        textContent: `[${post.board || '기타'}]`,
                        title: post.board || '기타'
                    });

                    const titleLink = createElement('a', {
                        href: post.href,
                        textContent: post.title,
                        target: '_blank'
                    });
                    const metaInfo = createElement('div', {
                        className: 'activity-log-meta',
                        textContent: metaText
                    });
                    const mainArea = createElement('div', {
                        className: 'activity-log-main'
                    }, [titleLink, metaInfo]);

                    ul.appendChild(createElement('li', {}, [ boardSpan, mainArea ]));
                });
                panelBody.appendChild(ul);
            }

            if (hasNewData || u.activityLog.length !== finalLog.length) {
                log('[데이터 저장] 변경 사항 감지. 스토리지 업데이트 시작...');
                u.activityLog = finalLog;
                await GM_setValue(uid, u);
                log('[데이터 저장] 스토리지 업데이트 완료.');
            } else {
                log('[데이터 저장] 변경 사항 없음. 저장을 건너뜁니다.');
            }

        } catch (err) {
            error('활동 기록을 불러오는 중 오류 발생:', err);
            panelBody.innerHTML = '<div class="fmk-simple-popup-loading">오류가 발생했습니다.</div>';
        }
    }
    async function showMemoContextPopup(uid, u, x, y, cb) {
        closeContextPopup();
        closeActivityPanel();
        log(`우클릭 메모 팝업 열기: 사용자 ID ${uid}`);

        const main = createElement('textarea', { rows: 2, maxLength: 20, placeholder: '메모 (20자)', value: u.text || '' });
        const detail = createElement('textarea', { rows: 5, placeholder: '세부 메모', value: u.detail || '' });

        const activityCheckbox = createElement('input', { type: 'checkbox', checked: u.isMarked });
        const activityButton = createElement('div', { className: 'fmk-activity-tracker-button', textContent: '활동 기록' });
        const activityTracker = createElement('div', { className: 'fmk-activity-tracker' }, [
            activityCheckbox,
            activityButton,
        ]);

        const titleArea = createElement('div', { className: 'fmk-popup-title-area' }, [
            createElement('div', { className: 'fmk-popup-title', textContent: `${u.nickname || 'Unknown'}[${uid}]` }),
            activityTracker
        ]);

        const saveBtn = createElement('button', { textContent: '저장', className: 'save-btn' });
        const delBtn = createElement('button', { textContent: '삭제', style: { display: (u.text || u.isMarked) ? 'block' : 'none' } });
        const cancelBtn = createElement('button', { textContent: '취소' });
        const btns = createElement('div', { className: 'fmk-popup-buttons' }, [saveBtn, delBtn, cancelBtn]);

        const historyList = createElement('ul');
        if (u.nickHistory && u.nickHistory.length > 1) { u.nickHistory.slice().reverse().forEach(entry => historyList.appendChild(createElement('li', { textContent: `• ${entry.date}: ${entry.nick}` }))); } else { historyList.appendChild(createElement('li', { textContent: '변경 이력이 없습니다.', style: { fontStyle: 'italic' } })); }
        const historyContainer = createElement('div', { className: 'fmk-history-container' }, [createElement('div', { className: 'fmk-history-title', textContent: '닉네임 변경 이력' }), historyList]);
        const colorI = createElement('input', { type: 'color', value: u.color || getThemeAwareRandomColor() });
        const colorWrap = createElement('div', { className: 'fmk-color-wrap', innerHTML: '글자 색상: ' }, [colorI]);

        const p = createElement('div', { className: 'fmk-context-popup', style: { left: `${x}px`, top: `${y}px` } }, [
            titleArea, main, detail, historyContainer, colorWrap, btns
        ]);

        document.body.appendChild(p);
        currentContextPopup = p;
        document.addEventListener('mousedown', outsideContextPopup);
        clampPopup(p);

        activityButton.onclick = (e) => {
            if (activityCheckbox.checked) {
                showActivityLogPanel(uid, u, e.pageX, e.pageY);
            }
        };

        const updateDelButtonVisibility = () => {
            delBtn.style.display = (main.value.trim() || activityCheckbox.checked) ? 'block' : 'none';
        };
        activityCheckbox.onchange = updateDelButtonVisibility;
        main.oninput = updateDelButtonVisibility;

        saveBtn.onclick = async () => {
            const isMarked = activityCheckbox.checked;
            const t = main.value.trim().slice(0, 20);
            if (!t && !isMarked) {
                delBtn.onclick();
                return;
            }
            if (u.text !== t) { u.history ??= []; u.history.push({ date: today(), text: t }); if (u.history.length > 50) u.history.splice(0, u.history.length - 50); }
            u.text = t;
            u.detail = detail.value.trim();
            u.color = colorI.value;
            u.isMarked = isMarked;
            u.lastUpdate = Date.now();
            if (!isMarked) u.activityLog = [];
            cached[uid] = u;
            log(`메모 저장: ID ${uid}, 내용 '${t}', 추적: ${u.isMarked}`);
            await GM_setValue(uid, u);

            closeContextPopup();
            closeActivityPanel();

            cb?.({ text: t, color: u.color }, false);
        };
        delBtn.onclick = async () => { log(`메모 삭제: ID ${uid}`); await GM_deleteValue(uid); delete cached[uid]; closeContextPopup(); closeActivityPanel(); cb?.(null, true); };
        cancelBtn.onclick = () => { closeContextPopup(); closeActivityPanel(); };
    }

    function showImportPopup(onSuccess) {
        if (document.querySelector(CONSTANTS.SELECTORS.importOverlay)) return;

        const importText = createElement('textarea', { id: 'importPopupText', placeholder: '백업된 JSON 데이터를 여기에 붙여넣으세요...' });
        const cancelImportBtn = createElement('button', { id: 'cancelImportBtn', textContent: '취소' });
        const doImportBtn = createElement('button', { id: 'doImportBtn', textContent: '가져오기' });

        const popup = createElement('div', { id: 'fmk-memo-import-popup' }, [
            createElement('div', { className: 'popup-header', textContent: '메모 가져오기' }),
            createElement('div', { className: 'popup-content' }, [importText]),
            createElement('div', { className: 'popup-footer' }, [cancelImportBtn, doImportBtn])
        ]);

        const overlay = createElement('div', { id: 'fmk-memo-import-overlay' }, [popup]);
        document.body.appendChild(overlay);

        const closePopup = () => document.body.removeChild(overlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePopup();
        });
        cancelImportBtn.onclick = closePopup;
        doImportBtn.onclick = async () => {
            const jsonStr = importText.value.trim();
            if (!jsonStr) {
                alert('가져올 데이터가 없습니다. 텍스트 영역에 JSON 데이터를 붙여넣어 주세요.');
                return;
            }
            try {
                const newData = JSON.parse(jsonStr);
                if (typeof newData !== 'object' || newData === null) {
                    throw new Error('올바른 JSON 객체 형식이 아닙니다.');
                }
                const keys = Object.keys(newData);
                if (keys.length === 0) {
                    alert('가져올 데이터가 비어있습니다.');
                    return;
                }
                const merge = confirm('기존 메모에 가져온 데이터를 병합(추가/덮어쓰기)하시겠습니까?\n[취소]를 누르면 모든 기존 메모를 삭제하고 새로 가져옵니다.');
                if (!merge) {
                    log('기존 데이터 삭제 후 가져오기 시작');
                    const allKeys = await GM_listValues();
                    for (const key of allKeys) if (!isNaN(key)) await GM_deleteValue(key);
                    Object.keys(cached).forEach(key => delete cached[key]);
                }
                log(`메모 가져오기: ${keys.length}개 항목 처리 시작`);
                let importedCount = 0;
                for (const key of keys) {
                    if (isNaN(key)) continue;
                    const normalized = normalizeMemo(newData[key]);
                    if (normalized) {
                        cached[key] = normalized;
                        await GM_setValue(key, normalized);
                        importedCount++;
                    }
                }
                alert(`성공적으로 ${importedCount}개의 메모를 가져왔습니다.`);
                log('메모 가져오기 완료.');
                onSuccess?.(newData);
                closePopup();
            } catch (err) {
                error('데이터 가져오기 실패:', err);
                alert(`데이터를 가져오는 데 실패했습니다. JSON 형식이 올바른지 확인해주세요.\n\n오류: ${err.message}`);
            }
        };
    }

    async function showManagementPanel() {
        if (document.querySelector(CONSTANTS.SELECTORS.managerOverlay)) return;
        let currentSortBy = CONSTANTS.SORT_BY_DATE;
        const searchInput = createElement('input', { type: 'text', id: 'searchMemo', placeholder: '메모 검색...' });
        const memoListEl = createElement('div', { className: 'items-container', id: 'memoList' });
        const exportBtn = createElement('button', { id: 'exportBtn', textContent: '클립보드로 복사' });
        const showImportPopupBtn = createElement('button', { id: 'showImportPopupBtn', textContent: '붙여넣기로 가져오기' });
        const closeManagerBtn = createElement('button', { id: 'closeManagerBtn', textContent: '닫기' });
        const clearAllBtn = createElement('button', { id: 'clearAllBtn_inline', textContent: '전체 초기화' });
        const sortBtnDate = createElement('button', { textContent: '최신순', className: 'active', dataset: { sort: CONSTANTS.SORT_BY_DATE } });
        const sortBtnName = createElement('button', { textContent: '이름순', dataset: { sort: CONSTANTS.SORT_BY_NAME } });
        const sortButtons = [sortBtnDate, sortBtnName];
        const container = createElement('div', { id: 'fmk-memo-manager-container' }, [ createElement('div', { className: 'manager-header' }, [createElement('h1', { textContent: '메모 관리' })]), createElement('div', { className: 'manager-content' }, [ searchInput, createElement('div', { className: 'fmk-sort-controls' }, [ createElement('div', { className: 'fmk-sort-group' }, [ createElement('span', { textContent: '정렬:' }), sortBtnDate, sortBtnName ]), clearAllBtn ]), memoListEl, createElement('div', { className: 'import-export-area' }, [exportBtn, showImportPopupBtn]) ]), createElement('div', { className: 'manager-footer' }, [closeManagerBtn]) ]);
        const overlay = createElement('div', { id: 'fmk-memo-manager-overlay' }, [container]);
        document.body.appendChild(overlay);
        const closePanel = () => { log('메모 관리자 패널 닫기'); document.body.removeChild(overlay); };
        closeManagerBtn.onclick = closePanel;
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closePanel(); });
        showImportPopupBtn.onclick = () => showImportPopup(() => { renderMemoList(cached, searchInput.value.trim().toLowerCase(), currentSortBy); run(); });
        clearAllBtn.onclick = async () => { if (!confirm('모든 메모를 영구적으로 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) return; log('모든 메모 데이터 초기화 시작'); const allKeys = await GM_listValues(); for (const key of allKeys) if (!isNaN(key)) await GM_deleteValue(key); Object.keys(cached).forEach(key => delete cached[key]); renderMemoList(cached, '', currentSortBy); clearAllInlineMemos(); alert('모든 메모가 성공적으로 삭제되었습니다.'); };
        exportBtn.onclick = async () => { const dataToExport = Object.fromEntries(Object.entries(cached).filter(([key]) => !isNaN(key))); const jsonStr = JSON.stringify(dataToExport, null, 2); try { await navigator.clipboard.writeText(jsonStr); const originalText = exportBtn.textContent; exportBtn.textContent = '복사 완료!'; exportBtn.disabled = true; setTimeout(() => { exportBtn.textContent = originalText; exportBtn.disabled = false; }, 2000); } catch (err) { error('클립보드 복사 실패:', err); alert('클립보드 복사에 실패했습니다. 브라우저 콘솔을 확인해주세요.'); } };
        searchInput.addEventListener("input", () => renderMemoList(cached, searchInput.value.trim().toLowerCase(), currentSortBy));
        sortButtons.forEach(button => button.addEventListener('click', () => { currentSortBy = button.dataset.sort; sortButtons.forEach(btn => btn.classList.remove('active')); button.classList.add('active'); renderMemoList(cached, searchInput.value.trim().toLowerCase(), currentSortBy); }));
        renderMemoList(cached, '', currentSortBy);
    }

    function renderMemoList(data, keyword = "", sortBy = CONSTANTS.SORT_BY_DATE, openedHistoryUid = null) {
        const memoListEl = document.getElementById("memoList");
        if (!memoListEl) return;
        const scrollPosition = memoListEl.scrollTop;
        memoListEl.innerHTML = "";
        let filteredData = Object.entries(data).filter(([key, val]) => { if (isNaN(key) || (!val.text && !val.isMarked)) return false; const combinedText = `${key} ${val?.nickname ?? ""} ${val?.text ?? ""} ${val?.detail ?? ""}`.toLowerCase(); return !keyword || combinedText.includes(keyword); });
        filteredData.sort(([, a], [, b]) => (sortBy === CONSTANTS.SORT_BY_NAME) ? (a.nickname || '').localeCompare(b.nickname || '') : (b.lastUpdate || 0) - (a.lastUpdate || 0));

        if (filteredData.length === 0) { memoListEl.appendChild(createElement('div', { textContent: keyword ? "일치하는 메모가 없습니다." : "저장된 메모가 없습니다.", style: { padding: "10px", textAlign: "center", color: "var(--fmk-text-secondary)" } })); return; }

        for (const [key, val] of filteredData) {
            const itemWrapper = createElement('div', { className: 'item-wrapper', dataset: { uid: key } });
            let historyHtml = '', buttonHtml = '';
            const markedIndicator = val.isMarked ? '📌' : '';
            if (val.history && val.history.length > 1) {
                const historyItems = val.history.slice().reverse().map((h, reverseIndex) => { const originalIndex = val.history.length - 1 - reverseIndex; return `<li data-history-index="${originalIndex}"><span>• ${h.date}: ${h.text}</span><button class="history-delete-btn" title="이력 삭제">×</button></li>`; }).join('');
                const historyDisplayStyle = (openedHistoryUid === key) ? 'display: block;' : 'display: none;';
                historyHtml = `<div class="item-history-container" style="${historyDisplayStyle}"><div class="item-history-title">메모 변경 이력</div><ul>${historyItems}</ul></div>`;
                buttonHtml = `<button class="history-toggle-btn">이력</button>`;
            } else { buttonHtml = `<button class="quick-delete-btn" title="메모 삭제">×</button>`; }
            itemWrapper.innerHTML = `<div class="item"><span style="${val.color ? `border-left: 3px solid ${val.color}; padding-left: 6px;` : ''}">${markedIndicator} ${val.nickname || 'Unknown'}[${key}] : ${val.text || '(추적중)'}</span>${buttonHtml}</div>${historyHtml}`;
            itemWrapper.querySelector('.item')?.addEventListener('click', (e) => { if (e.target.closest('button')) return; showMemoContextPopup(key, val, e.pageX, e.pageY, () => { const searchInput = document.getElementById('searchMemo'); const currentSortBy = document.querySelector('.fmk-sort-controls button.active')?.dataset.sort || CONSTANTS.SORT_BY_DATE; renderMemoList(cached, searchInput.value.trim(), currentSortBy); run(); }); });
            itemWrapper.querySelector('.history-toggle-btn')?.addEventListener('click', (e) => { e.stopPropagation(); const historyContainer = itemWrapper.querySelector('.item-history-container'); if (historyContainer) { historyContainer.style.display = historyContainer.style.display === 'none' ? 'block' : 'none'; } });
            memoListEl.appendChild(itemWrapper);
        }
        memoListEl.scrollTop = scrollPosition;
    }

    document.addEventListener('click', async (e) => {
        const memoListEl = e.target.closest(CONSTANTS.SELECTORS.memoList);
        if (!memoListEl) return;
        if (e.target.classList.contains('quick-delete-btn')) {
            e.stopPropagation();
            const itemWrapper = e.target.closest('.item-wrapper[data-uid]');
            if (!itemWrapper) return;
            const uid = itemWrapper.dataset.uid;
            const userMemo = cached[uid];
            const displayName = userMemo?.nickname || `ID ${uid}`;
            if (confirm(`'${displayName}' 님의 메모 전체를 삭제하시겠습니까? (추적 정보도 함께 삭제됩니다)`)) {
                await GM_deleteValue(uid);
                delete cached[uid];
                const searchInput = document.getElementById('searchMemo');
                const currentSortBy = document.querySelector('.fmk-sort-controls button.active')?.dataset.sort || CONSTANTS.SORT_BY_DATE;
                renderMemoList(cached, searchInput.value.trim(), currentSortBy);
                document.querySelectorAll(CONSTANTS.SELECTORS.processedPlate(uid)).forEach(delMemo);
            }
        } else if (e.target.classList.contains('history-delete-btn')) {
            e.stopPropagation();
            const itemWrapper = e.target.closest('.item-wrapper[data-uid]');
            if (!itemWrapper) return;
            const uid = itemWrapper.dataset.uid;
            const li = e.target.closest('li[data-history-index]');
            const index = parseInt(li.dataset.historyIndex, 10);
            const userMemo = cached[uid];
            if (userMemo && userMemo.history && !isNaN(index)) {
                userMemo.history.splice(index, 1);
                await GM_setValue(uid, userMemo);
                const searchInput = document.getElementById('searchMemo');
                const currentSortBy = document.querySelector('.fmk-sort-controls button.active')?.dataset.sort || CONSTANTS.SORT_BY_DATE;
                const uidToKeepOpen = userMemo.history.length > 1 ? uid : null;
                renderMemoList(cached, searchInput.value.trim(), currentSortBy, uidToKeepOpen);
            }
        }
    });

    GM_registerMenuCommand('메모 관리자 열기', showManagementPanel);

    function getPostDate(element) {
        const postContainer = element.closest(CONSTANTS.SELECTORS.postListRows);
        if (!postContainer) return null;

        const timeEl = postContainer.querySelector(CONSTANTS.SELECTORS.postTime);
        if (!timeEl || !timeEl.textContent) return null;

        const dateText = timeEl.textContent.trim();
        if (dateText.includes(':')) {
            return new Date();
        }
        const date = new Date(dateText.replace(/\./g, '-'));
        return isNaN(date.getTime()) ? null : date;
    }

    const profileCheckCache = {};

    async function bindPlate(a) {
        if (a.getAttribute(CONSTANTS.PROCESSED_ATTR)) return;
        a.setAttribute(CONSTANTS.PROCESSED_ATTR, '1');
        const m = a.className.match(/member_(\d+)/);
        if (!m) return;

        const uid = m[1];
        const nick = getNick(a);
        let u = cached[uid];

        // 닉네임 변경 가능성 감지
        if (u && updNick(u, nick)) {
            log(`[닉네임 변경 감지] UID: ${uid}, 저장된 닉: '${u.nickname}', 발견된 닉: '${nick}'`);

            // 1차 필터링: 게시물 날짜 확인
            const postDate = getPostDate(a);
            const lastNickChangeDate = u.nickHistory?.length > 0 ? new Date(u.nickHistory.at(-1).date) : new Date(0);

            if (postDate && postDate < lastNickChangeDate) {
                log(`[1차 필터링] 과거 게시물(${postDate.toLocaleDateString()})이므로 대표 닉네임은 갱신하지 않습니다.`);
                // 과거 닉네임 이력에만 추가 (선택적)
                if (!u.nickHistory.some(h => h.nick === nick)) {
                    log(`[이력 추가] 과거 닉네임 '${nick}'을 이력에 추가합니다.`);
                    u.nickHistory.push({ date: postDate.toISOString().split('T')[0], nick: nick });
                    // 이력 정렬 및 저장
                    u.nickHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
                    await GM_setValue(uid, u);
                }
            } else {
                // 2차 검증: 프로필 정보 조회 (캐시 확인 후)
                const now = Date.now();
                const lastCheck = profileCheckCache[uid] || 0;

                if (now - lastCheck > 60000) { // 60초(1분) 캐시
                    log(`[2차 검증] 프로필 정보 조회를 시작합니다. UID: ${uid}`);
                    profileCheckCache[uid] = now; // 캐시 시간 갱신

                    try {
                        const pageContextMid = new URL(location.href).searchParams.get('mid') || detectMid();
                        const infoHtml = await fetch(`https://www.fmkorea.com/index.php?mid=${pageContextMid}&act=dispMemberInfo&member_srl=${uid}`, { credentials: 'include' }).then(r => r.text());
                        const infoDoc = new DOMParser().parseFromString(infoHtml, 'text/html');
                        const officialNickEl = infoDoc.querySelector('a.member_plate > b, a.member_plate');
                        const officialNick = officialNickEl ? officialNickEl.innerText.trim() : nick; // 조회 실패 시 현재 발견된 닉으로 대체

                        if (u.nickname !== officialNick) {
                            log(`[최종 갱신] 공식 닉네임 '${officialNick}'으로 정보를 업데이트합니다.`);
                            u.nickname = officialNick;
                            const currentDate = today();
                            const lastHistory = u.nickHistory.at(-1);
                            if (!lastHistory || lastHistory.nick !== officialNick) {
                                if (u.nickHistory.findIndex(entry => entry.date === currentDate) === -1) {
                                    u.nickHistory.push({ date: currentDate, nick: officialNick });
                                    if (u.nickHistory.length > 30) u.nickHistory.splice(0, u.nickHistory.length - 30);
                                    a.classList.add('fmk-nick-blink');
                                    setTimeout(() => a.classList.remove('fmk-nick-blink'), 1500);
                                }
                            }
                            await GM_setValue(uid, u);
                        } else {
                            log(`[2차 검증] 저장된 닉네임이 공식 닉네임과 동일하여 변경하지 않습니다.`);
                        }
                    } catch (err) {
                        error(`[2차 검증 실패] 프로필 정보 조회 중 오류 발생:`, err);
                    }
                } else {
                    log(`[2차 검증] 캐시된 정보가 있어 조회를 건너뜁니다.`);
                }
            }
        }

        // 메모 표시 로직 (기존과 동일)
        u = cached[uid]; // 최신 데이터 다시 가져오기
        if (u && u.text) {
            setMemo(a, u.text, u.color);
        }

        // 우클릭 이벤트 핸들러 (기존과 동일)
        a.addEventListener('contextmenu', e => {
            e.preventDefault();
            // 메모 팝업을 열 때는 항상 최신 캐시 데이터를 사용하도록 보장
            const currentUserData = cached[uid] ||= { color: getThemeAwareRandomColor(), nickname: nick, nickHistory: [{ date: today(), nick }], history: [], lastUpdate: Date.now(), isMarked: false, activityLog: [] };
            currentUserData.nickname = getNick(a); // 팝업 여는 시점의 닉네임으로 한번 더 보정
            showMemoContextPopup(uid, currentUserData, e.pageX, e.pageY, (up, rm) => {
                document.querySelectorAll(CONSTANTS.SELECTORS.processedPlate(uid)).forEach(el => {
                    if (rm) delMemo(el);
                    else if (up?.text) setMemo(el, up.text, up.color);
                });
            });
        });
    }

    const bindAuthor = el => { if (el.getAttribute(CONSTANTS.PROCESSED_ATTR)) return; el.setAttribute(CONSTANTS.PROCESSED_ATTR, '1'); const n = getNick(el); for (const [uid, u] of Object.entries(cached)) { if (u.nickname === n && u.text) { setMemo(el, u.text, u.color); break; } } };
    const detectMid = () => { const IGNORE_FOR_ORIGIN = ['best', 'best2', 'best_day']; let mid = new URL(location.href).searchParams.get('mid'); if (mid && !IGNORE_FOR_ORIGIN.includes(mid)) return mid; if (window.__fm_best_config?.target_mid) return window.__fm_best_config.target_mid; if (window.document_mid && !IGNORE_FOR_ORIGIN.includes(window.document_mid)) return window.document_mid; const docLink = document.querySelector(CONSTANTS.SELECTORS.docTitleLink); if (docLink) { const m = docLink.getAttribute('href').match(/^\/([^/?#]+)/); if (m && !IGNORE_FOR_ORIGIN.includes(m[1])) return m[1]; } const p = location.pathname.split('/').filter(Boolean); if (p.length > 0 && isNaN(p[0])) return p[0]; if (p.length > 1 && isNaN(p[1])) return p[1]; const og = document.querySelector(CONSTANTS.SELECTORS.ogUrlMeta)?.content; const mOg = og?.match(/^https?:\/\/[^/]+\/([^/?#]+)/); if (mOg) return mOg[1]; return 'stock'; };
    const authorAnchor = () => document.querySelector(CONSTANTS.SELECTORS.authorAnchor);

    async function injectPanel() {
        if (panelInserted || !document.querySelector(CONSTANTS.SELECTORS.postBody)) return;
        const anc = authorAnchor();
        const m = anc?.className.match(/member_(\d+)/);
        if (!m) return;
        panelInserted = true;
        const memberId = m[1];
        const searchMid = detectMid();
        const pageContextMid = new URL(location.href).searchParams.get('mid') || searchMid;
        const wrap = createElement('div', { className: 'fmk-info-panel' });
        const leftBox = createElement('div', { className: 'fmk-info-panel-box fmk-info-panel-left' }, [createElement('p', { className: 'fmk-info-panel-title', innerHTML: '🛈 회원 정보' })]);
        const rightBox = createElement('div', { className: 'fmk-info-panel-box fmk-info-panel-right' }, [createElement('p', { className: 'fmk-info-panel-title', innerHTML: '📝 최근 작성글' })]);
        wrap.append(leftBox, rightBox);
        const bodyEl = document.querySelector(CONSTANTS.SELECTORS.postBody);
        bodyEl.parentNode.insertBefore(wrap, bodyEl.nextSibling);
        try {
            const [infoHtml, postHtmlRaw] = await Promise.all([ fetch(`https://www.fmkorea.com/index.php?mid=${pageContextMid}&act=dispMemberInfo&member_srl=${memberId}`, { credentials: 'include' }).then(r => r.text()), fetch(`https://www.fmkorea.com/search.php?mid=${searchMid}&search_target=member_srl&search_keyword=${memberId}`, { credentials: 'include' }).then(r => r.text()) ]);
            const infoDoc = new DOMParser().parseFromString(infoHtml, 'text/html');
            const infoTbl = infoDoc.querySelector(CONSTANTS.SELECTORS.memberInfoTable);
            if (infoTbl) {
                if (infoTbl.querySelector(CONSTANTS.SELECTORS.loginFormPasswordInput)) { leftBox.appendChild(createElement('p', { textContent: '회원 정보를 보려면 로그인이 필요합니다.', style: { color: 'var(--fmk-text-secondary)', padding: '20px', textAlign: 'center' }})); } else {
                    const latestNick = infoTbl.querySelector('a.member_plate > b, a.member_plate')?.innerText.trim();
                    if (latestNick && cached[memberId] && cached[memberId].nickname !== latestNick) { updNick(cached[memberId], latestNick); await GM_setValue(memberId, cached[memberId]); }
                    infoTbl.querySelectorAll('th').forEach(th => { if (th.textContent.trim().startsWith('블라인드 유저')) th.textContent = '블라인드 유저'; });
                    infoTbl.style.tableLayout = 'fixed'; infoTbl.querySelectorAll('th').forEach(th => (th.style.width = '90px'));
                    infoTbl.querySelector(CONSTANTS.SELECTORS.profileImageCell)?.parentElement?.remove();
                    [...infoTbl.rows].find(tr => tr.querySelector(CONSTANTS.SELECTORS.baseInfoRow)?.innerText.trim() === '기본 정보')?.remove();
                    infoTbl.querySelectorAll('th,td').forEach(c => (c.style.padding = '4px 10px'));
                    leftBox.appendChild(infoTbl);
                }
            } else { leftBox.appendChild(createElement('p', { textContent: '정보를 불러올 수 없습니다.'})); }
            let postHtml = /list_?tbody|tbody/i.test(postHtmlRaw) ? postHtmlRaw : await fetch(`https://www.fmkorea.com/search.php?search_target=member_srl&search_keyword=${memberId}`, { credentials: 'include' }).then(r => r.text());
            const postDoc = new DOMParser().parseFromString(postHtml, 'text/html');
            const rows = [...postDoc.querySelectorAll(CONSTANTS.SELECTORS.postListRows)].filter(el => el.querySelector(CONSTANTS.SELECTORS.postTitleLink));
            const ul = createElement('ul', { className: 'fmk-info-panel-content' });
            if (rows.length > 0) {
                rows.forEach(el => {
                    if (el.querySelector(CONSTANTS.SELECTORS.postCategoryLink)?.textContent.trim() === '공지') return;
                    const a = el.querySelector(CONSTANTS.SELECTORS.postTitleLink); if (!a) return;
                    const id = (a.href.match(/document_srl=(\d+)/) || [])[1];
                    const meta = [ (el.querySelector(CONSTANTS.SELECTORS.postTime)?.textContent || '').trim(), (el.querySelector(CONSTANTS.SELECTORS.postViews)?.textContent || '').trim() && `조회 ${el.querySelector(CONSTANTS.SELECTORS.postViews).textContent.trim()}`, (el.querySelector(CONSTANTS.SELECTORS.postVotes)?.textContent || '').trim() && `추천 ${el.querySelector(CONSTANTS.SELECTORS.postVotes).textContent.trim()}` ].filter(Boolean).join(' · ');
                    ul.appendChild(createElement('li', { innerHTML: `<a href="${id ? `/${id}` : a.href}" target="_blank">${a.textContent.trim()}</a>${meta ? ` <span class="fmk-post-meta">· ${meta}</span>` : ''}` }));
                });
            } else { Object.assign(ul, { textContent: '최근 작성한 글이 없습니다.', style: { listStyle: 'none', paddingLeft: '0' } }); }
            rightBox.appendChild(ul);
        } catch (e) { error('작성자 정보 패널 데이터 로딩 중 오류 발생:', e); leftBox.appendChild(createElement('p', { textContent: '정보 로딩 중 오류가 발생했습니다.'})); rightBox.appendChild(createElement('p', { textContent: '정보 로딩 중 오류가 발생했습니다.'})); }
    }

    function clearAllInlineMemos() { document.querySelectorAll(CONSTANTS.SELECTORS.inlineMemo).forEach(el => el.remove()); }
        function run(container = document.body) { container.querySelectorAll(CONSTANTS.SELECTORS.unprocessedPlate).forEach(a => { const id = a.getAttribute('data-class'); if (id) a.classList.add(`${MEMBER_CLASS_PREFIX}${id}`); }); container.querySelectorAll(CONSTANTS.SELECTORS.allPlates).forEach(bindPlate); container.querySelectorAll(CONSTANTS.SELECTORS.unprocessedAuthor).forEach(bindAuthor); if (!panelInserted) injectPanel(); enhanceCopyButton(container); enhanceCommentCopyButtons(container); }

    async function initialize() {
        log('데이터 초기화 시작...');
        const keys = await GM_listValues();
        log(`저장된 키 ${keys.length}개 발견`);
        let migrationCount = 0;
        for (const key of keys) {
            if (!isNaN(key)) {
                let memo = await GM_getValue(key);
                let needsUpdate = false;
                if (memo && typeof memo.lastUpdate === 'string') { memo.lastUpdate = new Date(memo.lastUpdate).getTime(); needsUpdate = true; }
                if (memo && !memo.lastUpdate) { memo.lastUpdate = new Date(0).getTime(); needsUpdate = true; }
                if (needsUpdate) { await GM_setValue(key, memo); migrationCount++; }
                cached[key] = normalizeMemo(memo);
            }
        }
        if (migrationCount > 0) log(`${migrationCount}개의 기존 메모 데이터 형식을 성공적으로 변환했습니다.`);
        log(`데이터 캐싱 완료. ${Object.keys(cached).length}개의 메모 로드.`);
        run();
        const observer = new MutationObserver(mutations => { let processed = false; const runOnce = () => { if (processed) return; run(document.body); processed = true; setTimeout(() => { processed = false; }, 0); }; for (const mutation of mutations) { if (mutation.type === 'childList') { runOnce(); break; } if (mutation.type === 'attributes' && mutation.attributeName === 'style' && mutation.target.style.display !== 'none') { runOnce(); break; } } });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
        log('최적화된 MutationObserver 시작. 페이지 변경 및 속성 변경을 감시합니다.');
    }

    function enhanceCopyButton(container = document) {
        const copyButton = container.querySelector('.document_address .btn_pack button');
        if (!copyButton || copyButton.dataset.enhancedCopy) {
            return;
        }

        copyButton.dataset.enhancedCopy = 'true';

        const originalUrl = copyButton.dataset.clipboardText;
        if (!originalUrl) return;

        copyButton.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const titleElement = document.querySelector('.rd_hd h1 .np_18px_span');
            const title = titleElement ? titleElement.textContent.trim() : '제목을 찾을 수 없음';

            const textToCopy = `${title}\n${originalUrl}`;

            try {
                await navigator.clipboard.writeText(textToCopy);

                const originalButtonText = copyButton.textContent;
                copyButton.textContent = '복사 완료!';
                copyButton.disabled = true;
                setTimeout(() => {
                    copyButton.textContent = originalButtonText;
                    copyButton.disabled = false;
                }, 1500);
            } catch (err) {
                console.error('[FMK-MEMO] 클립보드 복사 실패:', err);
                alert('클립보드 복사에 실패했습니다.');
            }
        });
    }
    function enhanceCommentCopyButtons(container = document) {
        const copyButtons = container.querySelectorAll('a[title="주소복사"][data-clipboard-text]');

        copyButtons.forEach(button => {
            if (button.dataset.enhancedCommentCopy) {
                return;
            }
            button.dataset.enhancedCommentCopy = 'true';

            const originalUrl = button.dataset.clipboardText;
            if (!originalUrl) return;

            button.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const commentItem = button.closest('li.fdb_itm');
                if (!commentItem) return;

                const contentElement = commentItem.querySelector('.xe_content');
                if (!contentElement) return;

                const commentText = contentElement.textContent.trim();

                const textToCopy = `${commentText}\n${originalUrl}`;

                try {
                    await navigator.clipboard.writeText(textToCopy);

                    const icon = button.querySelector('i');
                    if (icon) {
                        const originalColor = icon.style.color;
                        icon.style.transition = 'color 0.2s';
                        icon.style.color = '#4CAF50';
                        setTimeout(() => {
                            icon.style.color = originalColor;
                        }, 1500);
                    }
                } catch (err) {
                    console.error('[FMK-MEMO] 댓글 링크 복사 실패:', err);
                    alert('댓글 주소 복사에 실패했습니다.');
                }
            });
        });
    }

    initialize();
})();