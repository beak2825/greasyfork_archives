// ==UserScript==
// @name         Anilife 고급 기능 스크립트
// @namespace    http://tampermonkey.net/
// @version      6.0.9
// @description  IndexedDB 기반 시청기록 영구 저장, 자동 백업, 북마크, 요일 이동 등 다양한 편의 기능을 절차지향으로 구현합니다.
// @author       Google Gemini (수정: Gemini)
// @match        https://anilife.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilife.app
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @require      https://update.greasyfork.org/scripts/472236/1585366/GM%20Fetch.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542204/Anilife%20%EA%B3%A0%EA%B8%89%20%EA%B8%B0%EB%8A%A5%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/542204/Anilife%20%EA%B3%A0%EA%B8%89%20%EA%B8%B0%EB%8A%A5%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 특정 요소 내에서 Tailwind CSS 선택자로 단일 요소를 검색합니다.
     * :nth-child()를 포함한 조건부 콜론 이스케이프를 지원합니다.
     * @param {string} selector - CSS 선택자
     * @param {Element} [parentElement=document] - 검색을 시작할 부모 요소
     * @returns {Element | null}
     */
    function tq(selector, parentElement) {
        const root = parentElement || document;
        const escapedSelector = selector.replaceAll("\\", "\\\\");
        return root.querySelector(escapedSelector);
    }

    /**
     * 특정 요소 내에서 Tailwind CSS 선택자로 여러 요소를 검색합니다.
     * :nth-child()를 포함한 조건부 콜론 이스케이프를 지원합니다.
     * @param {string} selector - CSS 선택자
     * @param {Element} [parentElement=document] - 검색을 시작할 부모 요소
     * @returns {NodeListOf<Element>}
     */
    function tqa(selector, parentElement) {
        const root = parentElement || document;
        const escapedSelector = selector.replaceAll("\\", "\\\\");
        return root.querySelectorAll(escapedSelector);
    }
    // =================================================================================
    // Polyfill & Constants
    // =================================================================================

    const STYLE_CONTENT = /** css */`
        @import "https://cdn.jsdelivr.net/npm/@azurity/pure-nerd-font@3.0.5/pure-nerd-font.min.css";

        .nf-md-eye::after {
            font-family: PureNerdFont;
            content: "\\f0208";
            text-decoration: none;
            font-style: normal !important;
        }
        .nf-md-eye-off::after {
            font-family: PureNerdFont;
            content: "\\f0209";
            text-decoration: none;
            font-style: normal !important;
        }
        .nf-clipboard::after {
            font-family: PureNerdFont;
            content: "\\f07f";
            text-decoration: none;
            font-style: normal !important;
        }
        .nf-fa-trash::after {
            font-family: PureNerdFont;
            content: "\\f1f8";
            text-decoration: none;
            font-style: normal !important;
        }
        .nf-cod-three_bars::after {
            font-family: PureNerdFont;
            content: "\\f44e";
            text-decoration: none;
            font-style: normal !important;
        }
        #root > div > div > aside > div.al-scroll-none.hover\\:al-scroll.flex-1.overflow-y-auto.overflow-x-hidden.pr-1 > div > ul > li:has(> [href="/archive/bookmark"]) {
            display: none !important; /* 기존 보관함 탭 숨기기 */
        }
        .EGnq21D { width: unset !important; }
        body { user-select: unset !important; }
        .T9U2lbp:has(.art-video) {
            max-width: unset !important;
        }
        .d-none { display: none !important; }
        .anilife-toast-notification {
            position: fixed; bottom: 20px; right: 20px; padding: 12px 20px; border-radius: 8px;
            font-size: 14px; font-weight: 500; z-index: 10001; opacity: 0;
            transform: translateY(20px); transition: opacity 0.3s ease, transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .anilife-toast-notification.show { opacity: 1; transform: translateY(0); }
        .anilife-toast-notification.light { background-color: #ffffff; color: #1a1a1a; border: 1px solid #e5e5e5; }
        .anilife-toast-notification.dark { background-color: #2a2a2a; color: #e0e0e0; border: 1px solid #3a3a3a; }

        .anilife-floating-button {
            position: fixed; bottom: 20px; left: 20px; z-index: 9998;
            width: 50px; height: 50px; border-radius: 50%;
            background-color: #1c73e8; color: white; border: none;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2); cursor: pointer; transition: background-color 0.2s;
        }
        html:has(.art-fullscreen-web) .anilife-floating-button { display: none !important; }
        .anilife-floating-button:hover { background-color: #1a65c9; }
        html[data-theme="dark"] .anilife-floating-button { background-color: #8ab4f8; color: #202124; }
        html[data-theme="dark"] .anilife-floating-button:hover { background-color: #9ac1ff; }

        .anilife-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.6); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
            opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s;
        }
        .anilife-modal-overlay.show { opacity: 1; visibility: visible; }
        .anilife-modal-content {
            width: 90%; max-width: 680px; max-height: 80vh;
            border-radius: 12px; transform: scale(0.95);
            transition: transform 0.3s; display: flex; flex-direction: column;
        }
        .anilife-modal-overlay.show .anilife-modal-content { transform: scale(1); }
        .anilife-modal-content.light { background-color: #f1f3f4; color: #202124; }
        .anilife-modal-content.dark { background-color: #202124; color: #e8eaed; }
        .anilife-modal-header { padding: 12px 24px 0; border-bottom: 1px solid; }
        .light .anilife-modal-header { border-color: #dadce0; }
        .dark .anilife-modal-header { border-color: #3c4043; }
        .anilife-modal-tabs { display: flex; gap: 16px; }
        .anilife-modal-tab {
            background: none; border: none; color: inherit; cursor: pointer;
            padding: 12px 4px; font-size: 16px; font-weight: 500; opacity: 0.7;
            border-bottom: 2px solid transparent;
        }
        .anilife-modal-tab.active { opacity: 1; border-bottom-color: #8ab4f8; }
        .anilife-modal-search-wrapper { padding: 12px 0; }
        .anilife-modal-search-input {
            width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid;
        }
        .light .anilife-modal-search-input { border-color: #dadce0; background-color: #fff; }
        .dark .anilife-modal-search-input { border-color: #5f6368; background-color: #3c4043; color: #e8eaed; }


        .anilife-modal-body { flex-grow: 1; overflow-y: auto; }
        .anilife-modal-tab-panel { display: none; padding: 8px 0; }
        .anilife-modal-tab-panel.active { display: block; }

        .anilife-list-item { display: flex; align-items: center; padding: 12px 24px; gap: 16px; transition: background-color 0.2s; }
        .anilife-list-item.dragging { opacity: 0.5; background-color: rgba(138, 180, 248, 0.3); }
        .anilife-list-item.drag-over-top { border-top: 2px solid #8ab4f8; }
        .anilife-list-item.drag-over-bottom { border-bottom: 2px solid #8ab4f8; }

        .light .anilife-list-item:hover { background-color: #e8eaed; }
        .dark .anilife-list-item:hover { background-color: #3c4043; }
        .anilife-item-drag-handle { cursor: grab; padding-right: 8px; opacity: 0.5; }
        .anilife-item-drag-handle:hover { opacity: 1; }
        .anilife-item-thumbnail img {
            width: 60px; height: 84px; object-fit: cover; border-radius: 4px;
            background-color: #ccc; pointer-events: none;
        }
        .dark .anilife-item-thumbnail img { background-color: #3c4043; }
        .anilife-item-info-wrapper { flex-grow: 1; pointer-events: none; }
        .anilife-item-title { font-weight: bold; }
        .anilife-item-meta { font-size: 13px; opacity: 0.8; margin-top: 4px; }
        .anilife-item-genres { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .anilife-item-genre-tag { font-size: 12px; background-color: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 4px; }
        .dark .anilife-item-genre-tag { background-color: rgba(255,255,255,0.1); }

        .anilife-item-actions { display: flex; align-items: center; gap: 4px; }
        .anilife-item-actions a, .anilife-item-actions button {
            cursor: pointer; background: none; border: none; padding: 5px;
            display: flex; align-items: center; justify-content: center; opacity: 0.6; color: inherit;
        }
        .anilife-item-actions a:hover, .anilife-item-actions button:hover { opacity: 1; }

        .anilife-modal-footer {
            padding: 12px 24px; border-top: 1px solid;
            display: flex; justify-content: space-between; align-items: center;
            transition: outline 0.2s;
        }
        .dragover { outline: 2px dashed #8ab4f8; outline-offset: -8px; }
        .light .anilife-modal-footer { border-color: #dadce0; }
        .dark .anilife-modal-footer { border-color: #3c4043; }
        .anilife-modal-action-btn, .anilife-modal-close-btn {
            padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer;
            font-weight: 500; transition: background-color 0.2s;
        }
        .anilife-modal-action-btn { background-color: transparent; border: 1px solid; }
        .light .anilife-modal-action-btn { color: #3c4043; border-color: #dadce0; }
        .dark .anilife-modal-action-btn { color: #e8eaed; border-color: #3c4043; }
        .light .anilife-modal-action-btn:hover { background-color: #e8eaed; }
        .dark .anilife-modal-action-btn:hover { background-color: #3c4043; }
        .light .anilife-modal-close-btn { background-color: #1a73e8; color: white; }
        .dark .anilife-modal-close-btn { background-color: #8ab4f8; color: #202124; }

        .anilife-modal-action-buttons {
            display: flex;
            gap: 8px;
        }
        .anilife-dropdown {
            position: relative;
        }
        .anilife-dropdown-content {
            visibility: hidden;
            opacity: 0;
            transform: translateY(5px);
            position: absolute;
            bottom: calc(100% + 5px); /* Position above the button */
            left: 0;
            min-width: max-content; /* Adjust width to content */
            background-color: #f1f3f4;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1;
            border-radius: 8px;
            padding: 4px;
            transition: all 0.2s ease-out;
        }
        .dark .anilife-dropdown-content {
            background-color: #2d2e30;
            border: 1px solid #3c4043;
        }
        /* Show dropdown on focus-within */
        .anilife-dropdown:focus-within .anilife-dropdown-content {
            visibility: visible;
            opacity: 1;
            transform: translateY(0);
        }
        .anilife-dropdown-item {
            color: inherit;
            padding: 8px 12px;
            text-decoration: none;
            display: block;
            width: 100%;
            text-align: left;
            background: none;
            border: none;
            cursor: pointer;
            border-radius: 4px;
            font-size: 14px;
            white-space: nowrap;
        }
        .light .anilife-dropdown-item:hover {
            background-color: #e8eaed;
        }
        .dark .anilife-dropdown-item:hover {
            background-color: #3c4043;
        }

        .anilife-modal-content.light .anilife-icon-bg-stroke { stroke: #f1f3f4; }
        .anilife-modal-content.dark .anilife-icon-bg-stroke { stroke: #202124; }
        a.anilife-bookmarked > div:has(> img) {
            border: inset yellow;
        }

        a.anilife-bookmarked:not(.anilife-goto-home-btn)::before {
            /* Bookmarked Svg Icon */
            font-family: PureNerdFont;
            content: "\\f02e";
            font-size: 3rem;
            line-height: 3rem;

            display: inline-block;
            background-size: contain;
            background-repeat: no-repeat;
            margin-left: 4px;
            vertical-align: middle;
            opacity: 0.8;

            position: absolute;
            color: crimson;
            border-radius: 4px;
            top: -.1rem;
            right: .25rem;
            z-index: 10;
            transition: top .15s cubic-bezier(.4,0,.2,1);
        }
        :hover > a.anilife-bookmarked:not(.anilife-goto-home-btn)::before {
            top: -.7rem;
        }
        #swiper-banner > swiper-slide > div > div.absolute.bottom-8.left-5.max-w-xl.text-white > a.anilife-bookmarked::before {
            display: none !important;
        }
        a.anilife-bookmarked {
            position: relative;
        }
        html:is(.dark, [data-theme="dark"]) a.anilife-bookmarked {
            color: white;
        }
        html:is(.dark, [data-theme="dark"]) a.anilife-bookmarked .G5R-BbO {
            color: black;
        }
        html:is(.dark, [data-theme="dark"]) #swiper-banner > swiper-slide > div > div.absolute.bottom-8.left-5.max-w-xl.text-white > a > span {
            color: black;
        }

        li._52cuRn-:has(>.d-none) {
            display: none !important;
        }
        .bookmarked-hated {
            background: linear-gradient(to right, crimson , transparent 30%);
        }
        .visually-hidden {
            user-select: none !imporatnt;
        }
        h1.fpUXWby {
            font-size: 2rem;
        }
        .viewed {
            opacity: 0.3;
        }
        div:has(> .EGnq21D) + a.anilife-bookmarked::before { display: none !important; }
    `;
    const bookmarkButtonSelector = "body > div.al-scroll-none.pointer-events-auto.fixed.left-1\\/2.top-1\\/2.z-40.block.h-full.w-full.max-w-5xl.-translate-x-1\\/2.-translate-y-1\\/2.shadow-xl.shadow-black\\/10.sm\\:rounded-xl.md\\:max-h-\\[calc\\(90vh-2px\\)\\] > div > div.relative.divide-none > div.absolute.bottom-0.left-0.right-0.px-2.pb-8.md\\:px-8 > div > div.text-white > div.flex.items-center.gap-3 > button:nth-child(2)";

    // =================================================================================
    // Global State
    // =================================================================================

    let modalElement;
    let historyUpdateInterval = null;
    let isCapturing = false;
    let historyDB = null;
    let fullHistoryCache = {}; // Cache for full history to ensure reliable auto-backup
    let backupHasBeenSent = false;
    let videoBackupFlags = { mid: false, end: false }; // For video progress backup

    // =================================================================================
    // Utility & Helper Functions
    // =================================================================================

    /**
     * Waits for an element to appear in the DOM.
     * @param {string} selector - The CSS selector for the element.
     * @param {number} [timeout=30000] - The maximum time to wait in milliseconds.
     * @returns {Promise<Element>} A promise that resolves with the element when found.
     */
    function waitForElement(selector, timeout = 300000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const targetElement = document.querySelector(selector);
                if (targetElement) {
                    observer.disconnect();
                    resolve(targetElement);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            if (timeout != Infinity && timeout > 0) {
                setTimeout(() => {
                    observer.disconnect();
                    const el = document.querySelector(selector);
                    if (el) resolve(el);
                    else reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms.`));
                }, timeout);
            }
        });
    }

    function capture(video, objectDict = {}) {
        const { scaleFactor, download, returnCanvas } = Object.assign({ download: true, returnCanvas: false, scaleFactor: 1 }, objectDict);
        let w = video.videoWidth * scaleFactor;
        let h = video.videoHeight * scaleFactor;
        let canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, w, h);
        const href = canvas.toDataURL("image/png");
        if (download) {
            let a = document.createElement("a");
            a.download = 'capture.png';
            a.href = href;
            a.click();
            a.remove();
        }
        return returnCanvas ? canvas : href;
    }

    async function copyVideoCapture(e) {
        if (window.getSelection().toString() != '') return;
        e.preventDefault();
        if (isCapturing) return;
        isCapturing = true;
        showToast("화면을 캡쳐중이에요...");
        const blob = await new Promise(resolve => { capture(document.querySelector(`video`), { download: false, returnCanvas: true }).toBlob(resolve) });
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);
        showToast("캡쳐된 화면이 클립보드에 복사되었어요!");
        isCapturing = false;
    }


    // =================================================================================
    // List Item Classes (OOP Part)
    // =================================================================================

    /**
     * @class ListItem
     * @description Abstract base class for items displayed in the modal.
     */
    class ListItem {
        #element;
        #data;

        constructor(data) {
            this.#data = data;
            if (this.constructor === ListItem) {
                throw new TypeError('Abstract class "ListItem" cannot be instantiated directly.');
            }
        }
        get data() {
            return this.#data;
        }
        get _data() {
            return this.#data;
        }
        get element() {
            if (!this.#element) {
                this.#element = this._createElement();
            }
            return this.#element;
        }
        get isHated() {
            return (getAnilifeSettings()["anilife-hate"] || []).map(id => parseInt(id, 10)).includes(+this.data.contentId);
        }
        _createElement() {
            throw new Error("Method '_createElement()' must be implemented.");
        }
    }

    /**
     * @class HistoryItem
     * @description Represents a viewing history item.
     */
    class HistoryItem extends ListItem {
        _createElement() {
            const { contentId, episode, time, title_ko, genres = [], image } = this.data;
            const item = document.createElement('div');
            item.className = 'anilife-list-item';
            if (this.isHated) item.classList.add('bookmarked-hated');

            item.dataset.key = `${contentId}-${episode}`;
            item.dataset.contentId = contentId;

            const title = title_ko || `콘텐츠 ID: ${contentId}`;
            const genreTags = genres.map(g => `<span class="anilife-item-genre-tag">${g}</span>`).join('');
            const episodeText = episode ? `${episode}화` : '정보 없음';
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60).toString().padStart(2, '0');
            const metaText = `${episodeText} &middot; <span class="anilife-item-time">${minutes}:${seconds} 시청</span>`;

            const isBookmarkedNow = isBookmarked(parseInt(contentId, 10));
            const bookmarkButtonHTML = isBookmarkedNow
                ? `<button title="이미 북마크됨" class="anilife-add-bookmark-from-history-btn" disabled><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></button>`
                : `<button title="북마크에 추가" class="anilife-add-bookmark-from-history-btn"><i class="nf nf-oct-bookmark"></i></button>`;
            const hatedButtonHTML = isHated(parseInt(contentId, 10))
                ? `<button title="싫어요 항목에서 제거" class="anilife-remove-hate-from-history-btn"><i class="nf nf-fa-ban"></i></button>`
                : `<button title="싫어요 항목에 추가" class="anilife-add-hate-from-history-btn"><i class="nf nf-oct-no_entry"></i></button>`;
            const actionsHTML = `
                ${bookmarkButtonHTML}
                <a href="/content/${contentId}" title="콘텐츠 홈으로" class="anilife-goto-home-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M3 6h.01"></path><path d="M3 12h.01"></path><path d="M3 18h.01"></path></svg></a>
                ${episode ? `<button title="해당 회차 보러가기" class="anilife-goto-episode-btn" data-episode="${episode}"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></button>` : ''}
                ${hatedButtonHTML}
                <button title="기록 삭제" class="anilife-delete-history-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
            `;

            item.innerHTML = `
                <div class="anilife-item-thumbnail">
                    <img src="${image}" alt="${title}" onerror="this.style.display='none'; this.parentElement.style.border='1px solid #ccc';">
                </div>
                <div class="anilife-item-info-wrapper">
                    <div class="anilife-item-title">${title}</div>
                    <div class="anilife-item-meta">${metaText}</div>
                    <div class="anilife-item-genres">${genreTags}</div>
                </div>
                <div class="anilife-item-actions">${actionsHTML}</div>`;
            return item;
        }
    }

    /**
     * @class HateItem
     * @description Represents a 'hated' item.
     */
    class HateItem extends ListItem {
        _createElement() {
            const { contentId, title_ko, genres = [], image, release } = this.data;
            const item = document.createElement('div');
            item.className = 'anilife-list-item';
            item.dataset.contentId = contentId;

            const title = title_ko || `콘텐츠 ID: ${contentId}`;
            const genreTags = genres.map(g => `<span class="anilife-item-genre-tag">${g}</span>`).join('');
            const metaText = release || '';
            const actionsHTML = `
                <a href="/content/${contentId}" title="콘텐츠 홈으로" class="anilife-goto-home-btn">
                    <i class="nf nf-cod-three_bars"></i>
                </a>
                <button title="싫어요 항목에서 제거" class="anilife-delete-hate-btn">
                    <i class="nf nf-fa-trash"></i>
                </button>
            `;

            item.innerHTML = `
                <div class="anilife-item-thumbnail">
                    <img src="${image}" alt="${title}" onerror="this.style.display='none'; this.parentElement.style.border='1px solid #ccc';">
                </div>
                <div class="anilife-item-info-wrapper">
                    <div class="anilife-item-title">${title}</div>
                    <div class="anilife-item-meta">${metaText}</div>
                    <div class="anilife-item-genres">${genreTags}</div>
                </div>
                <div class="anilife-item-actions">${actionsHTML}</div>`;
            return item;
        }
    }

    /**
     * @class BookmarkItem
     * @description Represents a bookmark item.
     */
    class BookmarkItem extends ListItem {
        _createElement() {
            const { contentId, title_ko, genres = [], image, release } = this.data;
            const item = document.createElement('div');
            item.className = 'anilife-list-item';
            if (this.isHated) item.classList.add('bookmarked-hated');
            item.dataset.contentId = contentId;
            item.draggable = true;

            const title = title_ko || `콘텐츠 ID: ${contentId}`;
            const genreTags = genres.map(g => `<span class="anilife-item-genre-tag">${g}</span>`).join('');
            const metaText = release || '';
            const handleHTML = `<div class="anilife-item-drag-handle" title="순서 변경"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle><circle cx="5" cy="5" r="1"></circle><circle cx="5" cy="12" r="1"></circle><circle cx="5" cy="19" r="1"></circle></svg></div>`;
            const actionsHTML = `
                <a href="/content/${contentId}" title="콘텐츠 홈으로" class="anilife-goto-home-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M3 6h.01"></path><path d="M3 12h.01"></path><path d="M3 18h.01"></path></svg></a>
                <button title="북마크 삭제" class="anilife-delete-bookmark-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="currentColor" stroke-width="2" d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                        <line x1="22" y1="3" x2="1" y2="21" stroke-width="7" class="anilife-icon-bg-stroke"></line>
                        <line x1="22" y1="3" x2="1" y2="21" stroke="currentColor" stroke-width="1.5"></line>
                    </svg>
                </button>
            `;

            item.innerHTML = `
                ${handleHTML}
                <div class="anilife-item-thumbnail">
                    <img src="${image}" alt="${title}" onerror="this.style.display='none'; this.parentElement.style.border='1px solid #ccc';">
                </div>
                <div class="anilife-item-info-wrapper">
                    <div class="anilife-item-title">${title}</div>
                    <div class="anilife-item-meta">${metaText}</div>
                    <div class="anilife-item-genres">${genreTags}</div>
                </div>
                <div class="anilife-item-actions">${actionsHTML}</div>`;
            return item;
        }
    }

    // =================================================================================
    // Data Management Functions
    // =================================================================================

    function getAnilifeSettings() {
        return JSON.parse(localStorage.getItem('anilife_settings') || '{}');
    }
    function setAnilifeSettings(settings) {
        localStorage.setItem('anilife_settings', JSON.stringify(settings));
    }
    function getArtplayerSettings() {
        return JSON.parse(localStorage.getItem('artplayer_settings') || '{}');
    }
    function setArtplayerSettings(settings) {
        localStorage.setItem('artplayer_settings', JSON.stringify(settings));
    }

    // --- IndexedDB Functions ---
    function openHistoryDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('anilife_history_db', 2); // DB version bumped to 2
            request.onerror = () => reject("IndexedDB 열기 오류");
            request.onsuccess = () => {
                historyDB = request.result;
                resolve(historyDB);
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('history')) {
                    const store = db.createObjectStore('history', { keyPath: 'anime_id' });
                    store.createIndex('updated_datetime', 'updated_datetime', { unique: false });
                }
            };
        });
    }

    function updateHistoryInDB(anime_id, time) {
        if (!historyDB) return;
        const transaction = historyDB.transaction(['history'], 'readwrite');
        const store = transaction.objectStore('history');
        const getRequest = store.get(anime_id);

        getRequest.onsuccess = () => {
            const existingRecord = getRequest.result;
            // If record exists and time is the same, do not update to improve efficiency.
            if (existingRecord && existingRecord.time === time) {
                return;
            }

            // Otherwise, add or update the record.
            const newRecord = {
                anime_id: anime_id,
                time: time,
                updated_datetime: new Date().toISOString()
            };
            const putRequest = store.put(newRecord);
            putRequest.onsuccess = () => {
                // Update cache only on successful write
                fullHistoryCache[anime_id] = time;
            };
        };
    }

    function removeHistoryFromDB(anime_id) {
        // Also remove from localStorage
        const artSettings = getArtplayerSettings();
        if (artSettings.times && artSettings.times[anime_id]) {
            delete artSettings.times[anime_id];
            setArtplayerSettings(artSettings);
        }
        // Update cache
        if (fullHistoryCache[anime_id]) {
            delete fullHistoryCache[anime_id];
        }

        if (!historyDB) return Promise.reject("DB not initialized");
        return new Promise((resolve, reject) => {
            const transaction = historyDB.transaction(['history'], 'readwrite');
            const store = transaction.objectStore('history');
            const request = store.delete(anime_id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject("Error deleting history from DB");
        });
    }

    function getAllHistoryFromDB() {
        return new Promise((resolve, reject) => {
            if (!historyDB) return reject("DB not initialized");
            const transaction = historyDB.transaction(['history'], 'readonly');
            const store = transaction.objectStore('history');
            const index = store.index('updated_datetime');
            const request = index.getAll();
            request.onsuccess = () => resolve(request.result.reverse()); // Sort DESC
            request.onerror = () => reject("Error fetching all history from DB");
        });
    }

    async function clearAllHistory() {
        if (!historyDB) return Promise.reject("DB not initialized");

        // Clear localStorage
        const artSettings = getArtplayerSettings();
        artSettings.times = {};
        setArtplayerSettings(artSettings);

        // Clear cache
        fullHistoryCache = {};

        // Clear IndexedDB
        return new Promise((resolve, reject) => {
            const transaction = historyDB.transaction(['history'], 'readwrite');
            const store = transaction.objectStore('history');
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject("Error clearing history from DB");
        });
    }

    async function populateHistoryCache() {
        const historyFromDB = await getAllHistoryFromDB();
        fullHistoryCache = {}; // Reset
        historyFromDB.forEach(item => {
            fullHistoryCache[item.anime_id] = item.time;
        });
        console.log('[Anilife 스크립트] 시청 기록 캐시가 업데이트되었습니다.');
    }

    async function syncLocalStorageToDB() {
        return;
        if (!historyDB) await openHistoryDB();
        const artSettings = getArtplayerSettings();
        const times = artSettings.times || {};
        for (const [anime_id, time] of Object.entries(times)) {
            updateHistoryInDB(anime_id, time);
        }
    }

    /**
     * [MODIFIED]
     * Imports history records into IndexedDB.
     * It checks for existing records and only adds/updates if the record is new or the viewing time is different.
     * This prevents unnecessary updates and preserves the original 'updated_datetime' for unchanged records.
     * @param {object} times - An object where keys are 'anime_id' and values are viewing 'time'.
     */
    async function syncHistoryFromImport(times) {
        if (!historyDB) await openHistoryDB();
        const transaction = historyDB.transaction(['history'], 'readwrite');
        const store = transaction.objectStore('history');

        // Use Promise.all to handle all database operations concurrently for efficiency.
        const promises = Object.entries(times).map(([anime_id, time]) => {
            return new Promise((resolve, reject) => {
                const getRequest = store.get(anime_id);
                getRequest.onerror = () => reject(`[DB Error] Failed to get item: ${anime_id}`);
                getRequest.onsuccess = () => {
                    const existingRecord = getRequest.result;
                    // If a record with the same ID and time already exists, do nothing to preserve the original 'updated_datetime'.
                    if (existingRecord && existingRecord.time === time) {
                        resolve(); // Resolve without making any changes.
                        return;
                    }

                    // If the record is new, or the time is different, add or update it.
                    const newRecord = {
                        anime_id: anime_id,
                        time: time,
                        updated_datetime: new Date().toISOString() // Set a new timestamp for the update/creation.
                    };
                    const putRequest = store.put(newRecord);
                    putRequest.onerror = () => reject(`[DB Error] Failed to put item: ${anime_id}`);
                    putRequest.onsuccess = resolve; // Resolve after the put operation is successful.
                };
            });
        });

        await Promise.all(promises);

        // After all operations are complete, repopulate the cache from the database
        // to ensure it accurately reflects the current state.
        await populateHistoryCache();
    }


    // --- Bookmark Functions ---
    function isBookmarked(contentId) {
        const settings = getAnilifeSettings();
        const bookmarks = (settings['anilife-bookmark'] || []).map(id => parseInt(id, 10));
        return bookmarks.includes(+contentId);
    }
    function getBookmarks(query = '') {
        const settings = getAnilifeSettings();
        let bookmarks = settings['anilife-bookmark'] || [];
        const contentInfo = settings.content_info || {};
        if (query) {
            bookmarks = bookmarks.filter(id => {
                const info = contentInfo[id] || {};
                const title = info.title_ko || `콘텐츠 ID: ${id}`;
                return title.toLowerCase().includes(query);
            });
        }
        return bookmarks.map(id => new BookmarkItem({ contentId: id, ...contentInfo[id] })).reverse();
    }
    function addBookmark(contentId) {
        const settings = getAnilifeSettings();
        if (!settings['anilife-bookmark']) settings['anilife-bookmark'] = [];
        if (isBookmarked(contentId)) return false;
        settings['anilife-bookmark'].unshift(contentId);
        setAnilifeSettings(settings);
        return true;
    }
    function removeBookmark(contentId) {
        const settings = getAnilifeSettings();
        if (!settings['anilife-bookmark']) return false;
        const index = settings['anilife-bookmark'].map(String).indexOf(String(contentId));
        if (index > -1) {
            settings['anilife-bookmark'].splice(index, 1);
            setAnilifeSettings(settings);
            return true;
        }
        return false;
    }
    function toggleBookmark(contentId) {
        if (isBookmarked(contentId)) {
            removeBookmark(contentId);
            return 'removed';
        } else {
            addBookmark(contentId);
            return 'added';
        }
    }
    function reorderBookmarks(draggedId, targetId, isAfter) {
        const settings = getAnilifeSettings();
        let bookmarks = settings['anilife-bookmark'] || [];
        const draggedIndex = bookmarks.map(String).indexOf(String(draggedId));
        if (draggedIndex === -1) return;

        const [item] = bookmarks.splice(draggedIndex, 1);
        const targetIndex = bookmarks.map(String).indexOf(String(targetId));
        bookmarks.splice(targetIndex + (isAfter ? 1 : 0), 0, item);

        settings['anilife-bookmark'] = bookmarks;
        setAnilifeSettings(settings);
    }

    // --- History Functions ---
    async function getHistory(query = '') {
        const anilifeSettings = getAnilifeSettings();
        const contentInfo = anilifeSettings.content_info || {};
        let historyFromDB = await getAllHistoryFromDB();

        if (query) {
            historyFromDB = historyFromDB.filter(item => {
                const [contentId] = item.anime_id.split('-');
                const info = contentInfo[contentId] || {};
                const title = info.title_ko || `콘텐츠 ID: ${contentId}`;
                return title.toLowerCase().includes(query);
            });
        }

        return historyFromDB.map(item => {
            const [contentId, episode] = item.anime_id.split('-');
            return new HistoryItem({
                contentId,
                episode,
                time: item.time,
                ...contentInfo[contentId]
            });
        });
    }

    // --- Hate Functions ---
    function isHated(contentId) {
        const settings = getAnilifeSettings();
        const hates = (settings['anilife-hate'] || []).map(id => parseInt(id, 10));
        return hates.includes(+contentId);
    }
    function getHates(query = '') {
        const settings = getAnilifeSettings();
        let hates = settings['anilife-hate'] || [];
        const contentInfo = settings.content_info || {};
        if (query) {
            hates = hates.filter(id => {
                const info = contentInfo[id] || {};
                const title = info.title_ko || `콘텐츠 ID: ${id}`;
                return title.toLowerCase().includes(query);
            });
        }
        return hates.map(id => new HateItem({ contentId: id, ...contentInfo[id] }));
    }
    function addHate(contentId) {
        const settings = getAnilifeSettings();
        if (!settings['anilife-hate']) settings['anilife-hate'] = [];
        if (isHated(contentId)) return false;
        settings['anilife-hate'].unshift(contentId);
        setAnilifeSettings(settings);
        return true;
    }
    function removeHate(contentId) {
        const settings = getAnilifeSettings();
        if (!settings['anilife-hate']) return false;
        const index = settings['anilife-hate'].map(String).indexOf(String(contentId));
        if (index > -1) {
            settings['anilife-hate'].splice(index, 1);
            setAnilifeSettings(settings);
            return true;
        }
        return false;
    }
    function toggleHate(contentId) {
        if (isHated(contentId)) {
            removeHate(contentId);
            return 'removed';
        } else {
            addHate(contentId);
            return 'added';
        }
    }


    // =================================================================================
    // UI Management Functions
    // =================================================================================

    function injectStyles() {
        // const style = document.createElement('style');
        // style.textContent = STYLE_CONTENT;
        // document.head.appendChild(style);

        GM_addStyle(STYLE_CONTENT);
    }

    function createUIElements() {
        createModal();
        createFab();
    }

    function createModal() {
        const modalContainer = document.createElement('div');
        modalContainer.id = 'anilife-app-modal';
        modalContainer.className = 'anilife-modal-overlay';
        modalContainer.innerHTML = /*html*/`
            <div class="anilife-modal-content">
                <div class="anilife-modal-header">
                    <div class="anilife-modal-tabs">
                        <button class="anilife-modal-tab active" data-tab="bookmarks">북마크</button>
                        <button class="anilife-modal-tab" data-tab="history">시청 기록</button>
                        <button class="anilife-modal-tab" data-tab="hates">싫어요</button>
                    </div>
                </div>
                <div class="anilife-modal-body">
                    <div class="anilife-modal-search-wrapper">
                         <input type="search" id="anilife-modal-search" class="anilife-modal-search-input" placeholder="검색...">
                    </div>
                    <div id="anilife-bookmarks-panel" class="anilife-modal-tab-panel active"></div>
                    <div id="anilife-history-panel" class="anilife-modal-tab-panel"></div>
                    <div id="anilife-hates-panel" class="anilife-modal-tab-panel"></div>
                </div>
                <div class="anilife-modal-footer">
                    <div class="anilife-modal-action-buttons">
                        <div class="anilife-dropdown">
                            <button id="anilife-file-dropdown-btn" class="anilife-modal-action-btn" tabindex="0">JSON ▼</button>
                            <div class="anilife-dropdown-content">
                                <button id="anilife-export-btn" class="anilife-dropdown-item">내보내기</button>
                                <button id="anilife-import-btn" class="anilife-dropdown-item">가져오기</button>
                            </div>
                        </div>
                        <div class="anilife-dropdown">
                            <button id="anilife-webhook-dropdown-btn" class="anilife-modal-action-btn" tabindex="0">웹훅 ▼</button>
                            <div class="anilife-dropdown-content">
                                <button id="anilife-webhook-btn" class="anilife-dropdown-item">웹훅 백업</button>
                                <button id="anilife-webhook-restore-btn" class="anilife-dropdown-item">웹훅 복구</button>
                                <button id="anilife-webhook-url-btn" class="anilife-dropdown-item">웹훅 URL설정</button>
                            </div>
                        </div>
                        <button id="anilife-clear-history-btn" class="anilife-modal-action-btn" style="display: none; border-color: #cf6679; color: #cf6679;">전체 기록 삭제</button>
                    </div>
                    <button class="anilife-modal-close-btn">닫기</button>
                </div>
            </div>`;
        document.body.appendChild(modalContainer);
        modalElement = modalContainer;
        attachModalListeners();
    }

    function createFab() {
        const fab = document.createElement('button');
        fab.className = 'anilife-floating-button';
        fab.title = '라이브러리 열기';
        fab.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
        fab.addEventListener('click', showModal);
        document.body.appendChild(fab);
    }

    function attachModalListeners() {
        document.getElementById('anilife-modal-search').addEventListener('input', renderActiveTab);
        modalElement.addEventListener('click', handleModalClick);

        // Drag and Drop for file import
        const footer = modalElement.querySelector('.anilife-modal-footer');
        footer.addEventListener('dragover', e => { e.preventDefault(); footer.classList.add('dragover'); });
        footer.addEventListener('dragleave', e => { e.preventDefault(); footer.classList.remove('dragover'); });
        footer.addEventListener('drop', e => {
            e.preventDefault();
            footer.classList.remove('dragover');
            if (e.dataTransfer.files?.length > 0) processImportFile(e.dataTransfer.files[0]);
        });

        // Drag and Drop for reordering bookmarks
        let draggedElement = null;
        modalElement.addEventListener('dragstart', e => {
            if (e.target.matches('#anilife-bookmarks-panel .anilife-list-item')) {
                draggedElement = e.target;
                setTimeout(() => draggedElement.classList.add('dragging'), 0);
            }
        });
        modalElement.addEventListener('dragend', () => {
            if (draggedElement) {
                draggedElement.classList.remove('dragging');
                draggedElement = null;
            }
        });
        modalElement.addEventListener('dragover', e => {
            e.preventDefault();
            const target = e.target.closest('#anilife-bookmarks-panel .anilife-list-item');
            modalElement.querySelectorAll('.drag-over-top, .drag-over-bottom').forEach(el => el.classList.remove('drag-over-top', 'drag-over-bottom'));
            if (target && target !== draggedElement) {
                const rect = target.getBoundingClientRect();
                target.classList.add((e.clientY - rect.top) > rect.height / 2 ? 'drag-over-bottom' : 'drag-over-top');
            }
        });
        modalElement.addEventListener('drop', e => {
            e.preventDefault();
            const dropTarget = e.target.closest('#anilife-bookmarks-panel .anilife-list-item');
            modalElement.querySelectorAll('.drag-over-top, .drag-over-bottom').forEach(el => el.classList.remove('drag-over-top', 'drag-over-bottom'));
            if (!dropTarget || !draggedElement) return;

            const draggedId = parseInt(draggedElement.dataset.contentId, 10);
            const targetId = parseInt(dropTarget.dataset.contentId, 10);
            if (draggedId === targetId) return;

            const isAfter = (e.clientY - dropTarget.getBoundingClientRect().top) > dropTarget.getBoundingClientRect().height / 2;
            reorderBookmarks(draggedId, targetId, isAfter);
            renderActiveTab();
        });
    }

    async function handleModalClick(e) {
        const target = e.target;
        if (target === modalElement || target.classList.contains('anilife-modal-close-btn')) {
            hideModal();
        } else if (target.id === 'anilife-export-btn') {
            handleExport();
        } else if (target.id === 'anilife-import-btn') {
            handleImportClick();
        } else if (target.id === 'anilife-webhook-btn') {
            backupJsonViaWebhook();
        } else if (target.id === 'anilife-webhook-restore-btn') {
            restoreFromWebhook();
        } else if (target.id === 'anilife-webhook-url-btn') {
            setWebhookUrl();
        } else if (target.id === 'anilife-clear-history-btn') {
            if (confirm('정말로 모든 시청 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                await clearAllHistory();
                showToast('모든 시청 기록을 삭제했습니다.');
                await renderActiveTab();
            }
        } else if (target.matches('.anilife-modal-tab')) {
            modalElement.querySelectorAll('.anilife-modal-tab, .anilife-modal-tab-panel').forEach(el => el.classList.remove('active'));
            target.classList.add('active');
            document.getElementById(`anilife-${target.dataset.tab}-panel`)?.classList.add('active');

            const clearBtn = document.getElementById('anilife-clear-history-btn');
            clearBtn.style.display = target.dataset.tab === 'history' ? 'inline-block' : 'none';

            await renderActiveTab();
        } else {
            const item = target.closest('.anilife-list-item');
            if (!item) return;
            const { contentId, key } = item.dataset;
            const intContentId = parseInt(contentId, 10);

            if (target.closest('.anilife-delete-history-btn')) {
                await removeHistoryFromDB(key);
                showToast('시청 기록을 삭제했습니다.');
                await renderActiveTab();
            } else if (target.closest('.anilife-delete-bookmark-btn')) {
                if (removeBookmark(intContentId)) {
                    showToast('북마크를 삭제했습니다.');
                    await renderActiveTab();
                    syncBookmarkButton(intContentId, false);
                }
            } else if (target.closest('.anilife-add-bookmark-from-history-btn')) {
                const button = target.closest('.anilife-add-bookmark-from-history-btn');
                if (addBookmark(intContentId)) {
                    showToast('북마크에 추가되었습니다.');
                    button.disabled = true;
                    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>`;
                }
            } else if (target.closest('.anilife-goto-episode-btn')) {
                const { episode } = target.closest('.anilife-goto-episode-btn').dataset;
                if (contentId && episode) {
                    localStorage.setItem('anilife-temp-want-to-see-this-episode', JSON.stringify({ contentId, episode }));
                    window.location.href = `/content/${contentId}`;
                }
            } else if (target.closest('.anilife-delete-hate-btn')) {
                if (removeHate(intContentId)) {
                    showToast('싫어요 항목에서 제거되었습니다.');
                    await renderActiveTab();
                }
            } else if (target.closest('.anilife-add-hate-from-history-btn')) {
                const button = target.closest('.anilife-add-hate-from-history-btn');
                if (addHate(intContentId)) {
                    button.className = 'anilife-remove-hate-from-history-btn';
                    showToast('싫어요 항목에 추가되었습니다.');
                    button.innerHTML = `<i class="nf nf-fa-ban"></i>`;
                }
            } else if (target.closest('.anilife-remove-hate-from-history-btn')) {
                const button = target.closest('.anilife-remove-hate-from-history-btn');
                if (removeHate(intContentId)) {
                    button.className = 'anilife-add-hate-from-history-btn';
                    showToast('싫어요 항목에서 제거되었습니다.');
                    button.innerHTML = `<i class="nf nf-oct-no_entry"></i>`;
                }
            }
        }
    }

    function showModal() {
        if (!modalElement) return;
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        modalElement.querySelector('.anilife-modal-content').className = `anilife-modal-content ${theme}`;
        modalElement.classList.add('show');

        const clearBtn = document.getElementById('anilife-clear-history-btn');
        clearBtn.style.display = isTabActive('history') ? 'inline-block' : 'none';

        renderActiveTab();
        historyUpdateInterval = setInterval(() => {
            syncLocalStorageToDB();
            if (isTabActive('history')) {
                renderActiveTab();
            }
        }, 1000);
    }

    function hideModal() {
        if (modalElement) {
            modalElement.classList.remove('show');
            const searchInput = document.getElementById('anilife-modal-search');
            if (searchInput) searchInput.value = '';
            clearInterval(historyUpdateInterval);
            historyUpdateInterval = null;
        }
    }

    function isModalVisible() {
        return modalElement && modalElement.classList.contains('show');
    }

    function isTabActive(tabName) {
        const activeTab = modalElement.querySelector('.anilife-modal-tab.active');
        return activeTab && activeTab.dataset.tab === tabName;
    }

    async function renderActiveTab() {
        if (!isModalVisible()) return;
        const activeTab = modalElement.querySelector('.anilife-modal-tab.active');
        const query = document.getElementById('anilife-modal-search').value.toLowerCase().trim();
        if (activeTab) {
            await renderTabContent(activeTab.dataset.tab, query);
        }
    }

    async function renderTabContent(tabName, query) {
        const panelId = `anilife-${tabName}-panel`;
        const panel = document.getElementById(panelId);
        if (!panel) return;

        let items;
        if (tabName === 'history') {
            items = await getHistory(query);
        } else if (tabName === 'hates') {
            items = getHates(query);
        } else {
            items = getBookmarks(query);
        }

        if (items.length === 0) {
            const message = query ? '검색 결과가 없습니다.' : (tabName === 'history' ? '시청 기록이 없습니다.' : tabName === 'hates' ? '싫어요 항목이 없습니다.' : '북마크가 없습니다.');
            panel.innerHTML = `<div style="text-align:center; padding: 20px;">${message}</div>`;
            return;
        }

        const fragment = document.createDocumentFragment();
        const existingElements = new Map(Array.from(panel.children).map(el => [el.dataset.key, el]));

        items.forEach(item => {
            const key = `${item.data.contentId}-${item.data.episode}`;
            const existingEl = existingElements.get(key);

            if (existingEl) {
                // Update time if it has changed
                const minutes = Math.floor(item.data.time / 60);
                const seconds = Math.floor(item.data.time % 60).toString().padStart(2, '0');
                const newTimeText = `${minutes}:${seconds} 시청`;
                const timeEl = existingEl.querySelector('.anilife-item-time');
                if (timeEl && !timeEl.textContent.includes(newTimeText)) {
                    const episodeText = item.data.episode ? `${item.data.episode}화` : '정보 없음';
                    existingEl.querySelector('.anilife-item-meta').innerHTML = `${episodeText} &middot; <span class="anilife-item-time">${newTimeText}</span>`;
                }
                fragment.appendChild(existingEl);
            } else {
                // It's a new element
                fragment.appendChild(item.element);
            }
        });

        // Use replaceChildren for efficient, non-destructive update that also maintains order
        panel.replaceChildren(fragment);
    }


    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.className = 'anilife-toast-notification';
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        toast.classList.add(theme);
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.parentElement?.removeChild(toast), 300);
        }, 3000);
    }

    function syncBookmarkButton(contentId, isBookmarkedNow) {
        if (!window.location.pathname.startsWith(`/content/${contentId}`)) return;
        const button = document.querySelector(bookmarkButtonSelector);
        if (!button) return;
        if (isBookmarkedNow) {
            button.querySelector("svg").style.setProperty("color", "red");
            button.querySelector("span").textContent = "북마크됨";
        } else {
            button.querySelector("svg").style.removeProperty("color");
            button.querySelector("span").textContent = "북마크 하기";
        }
    }

    function syncHateButton(contentId, isHatedNow) {
        if (!window.location.pathname.startsWith(`/content/${contentId}`)) return;
        const button = document.querySelector(`#anilife-hate-button`);
        if (!button) return;
        if (isHatedNow === undefined) isHatedNow = isHated(contentId);
        if (isHatedNow) {
            button.querySelector("i").className = `nf nf-md-eye-off`;
        } else {
            button.querySelector("i").className = `nf nf-md-eye`;
        }
    }


    // =================================================================================
    // Data I/O Functions
    // =================================================================================

    function handleExport() {
        try {
            const anilifeSettings = getAnilifeSettings();
            const artplayerSettings = getArtplayerSettings();
            artplayerSettings.times = fullHistoryCache;

            const backupData = { anilife_settings: anilifeSettings, artplayer_settings: artplayerSettings };
            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const date = new Date().toISOString().slice(0, 10);
            a.href = url;
            a.download = `anilife_backup_${date}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('데이터를 내보냈습니다.');
        } catch (e) {
            showToast('내보내기에 실패했습니다.');
            console.error('[Anilife 스크립트] 내보내기 오류:', e);
        }
    }

    function handleImportClick() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.onchange = e => {
            if (e.target.files.length > 0) processImportFile(e.target.files[0]);
        };
        input.click();
    }

    /**
     * [MODIFIED]
     * Processes the imported JSON file.
     * It now handles 'merge' and 'overwrite' operations for IndexedDB differently.
     * Merge: Calls the modified syncHistoryFromImport to merge data without overwriting identical records.
     * Overwrite: Clears the IndexedDB store first, then calls syncHistoryFromImport to populate it with new data.
     * @param {File} file - The JSON file to import.
     */
    function processImportFile(file) {
        const reader = new FileReader();
        reader.onload = async event => {
            try {
                const importedData = JSON.parse(event.target.result);
                if (!importedData.anilife_settings || !importedData.artplayer_settings) throw new Error('유효하지 않은 백업 파일 형식입니다.');

                const currentAnilife = getAnilifeSettings();
                const currentArt = getArtplayerSettings();

                const restoreType = prompt('복원 타입을 선택하세요. (1: 병합 / 2: 덮어쓰기)', '1');
                if (restoreType === null) return showToast('데이터 복원을 취소했습니다.');

                let newAnilife, newArt;

                if (restoreType === '1') { // Merge
                    newAnilife = { ...currentAnilife, ...importedData.anilife_settings };
                    newAnilife['anilife-bookmark'] = [...new Set([...(currentAnilife['anilife-bookmark'] || []), ...(importedData.anilife_settings['anilife-bookmark'] || [])])];
                    newAnilife['anilife-hate'] = [...new Set([...(currentAnilife['anilife-hate'] || []), ...(importedData.anilife_settings['anilife-hate'] || [])])];
                    newAnilife.content_info = { ...(currentAnilife.content_info || {}), ...(importedData.anilife_settings.content_info || {}) };
                    newArt = { ...currentArt, ...importedData.artplayer_settings };
                    newArt.times = { ...(currentArt.times || {}), ...(importedData.artplayer_settings.times || {}) };

                    setAnilifeSettings(newAnilife);
                    setArtplayerSettings(newArt);

                    // Sync only the imported history data into IndexedDB using the merge logic.
                    await syncHistoryFromImport(importedData.artplayer_settings.times || {});

                } else if (restoreType === '2') { // Replace
                    // For overwrite, first clear the existing IndexedDB history store.
                    if (!historyDB) await openHistoryDB();
                    await new Promise((resolve, reject) => {
                        const transaction = historyDB.transaction(['history'], 'readwrite');
                        const store = transaction.objectStore('history');
                        const request = store.clear();
                        request.onsuccess = resolve;
                        request.onerror = reject;
                    });

                    newAnilife = importedData.anilife_settings;
                    newArt = importedData.artplayer_settings;

                    setAnilifeSettings(newAnilife);
                    setArtplayerSettings(newArt);

                    // Then, populate the empty DB with the imported history.
                    await syncHistoryFromImport(newArt.times || {});
                } else {
                    return showToast('잘못된 복원 타입을 선택했습니다. (1 또는 2)');
                }


                showToast('데이터를 성공적으로 가져왔습니다.');
                await renderActiveTab();

                const match = window.location.pathname.match(/^\/content\/(\d+)/);
                if (match) {
                    syncBookmarkButton(parseInt(match[1], 10), isBookmarked(parseInt(match[1], 10)));
                }
            } catch (err) {
                showToast('파일을 가져오는 데 실패했습니다.');
                console.error('[Anilife 스크립트] 가져오기 오류:', err);
            }
        };
        reader.readAsText(file);
    }

    function getWebhookUrl() {
        const url = localStorage.getItem('anilife_webhook_url');
        if (url) return url;
        return setWebhookUrl();
    }

    function setWebhookUrl() {
        const url = prompt('웹훅 주소를 입력하세요.', localStorage.getItem('anilife_webhook_url') || '');
        if (url) {
            localStorage.setItem('anilife_webhook_url', url);
            showToast('백업 웹훅 주소를 설정했습니다.');
        }
        return url;
    }

    async function backupJsonViaWebhook() {
        const webhookUrl = getWebhookUrl();
        if (!webhookUrl) return showToast('웹훅 주소가 설정되지 않았습니다.');
        if (!confirm('Webhook을 활용하여 백업을 시작하시겠습니까?')) {
            return showToast('백업을 취소했습니다.');
        }

        const anilifeSettings = getAnilifeSettings();
        const artplayerSettings = getArtplayerSettings();
        artplayerSettings.times = fullHistoryCache;

        const backupData = { anilife_settings: anilifeSettings, artplayer_settings: artplayerSettings };
        const jsonBackUp = JSON.stringify(backupData, null, 2);
        const jsonBackUpFile = new File([jsonBackUp], `anilife_backup_${new Date().toISOString().slice(0, 19)}.json`, { type: 'application/json' });

        const payload = {
            content: `Anilife 백업 파일`,
            username: "Anilife Assistant",
            avatar_url: "https://anilife.app/favicon.ico",
        };

        const formData = new FormData();
        formData.append('files[0]', jsonBackUpFile);
        formData.append("payload_json", JSON.stringify(payload));

        try {
            const response = await gmFetch(webhookUrl, { method: 'POST', body: formData });
            if (!response.ok) throw new Error(`Webhook failed with status ${response.status}`);
            const data = await response.json();
            localStorage.setItem('anilife_webhook_backup_last_id', data.id);
            showToast('데이터를 성공적으로 백업했습니다.');
        } catch (error) {
            showToast('백업에 실패했습니다.');
            console.error('[Anilife 스크립트] 백업 오류:', error);
        }
    }

    async function restoreFromWebhook() {
        const webhookUrl = getWebhookUrl();
        if (!webhookUrl) return showToast('웹훅 주소가 설정되지 않았습니다.');
        const messageId = prompt('복원할 메시지 ID를 입력하세요.', localStorage.getItem('anilife_webhook_backup_last_id') || '');
        if (!messageId) return showToast('데이터 복원을 취소했습니다.');

        try {
            const msgResponse = await fetch(`${webhookUrl}/messages/${messageId}`);
            if (!msgResponse.ok) throw new Error('메시지를 찾을 수 없습니다.');
            const msgData = await msgResponse.json();
            const attachmentUrl = msgData.attachments[0]?.url;
            if (!attachmentUrl) throw new Error('첨부 파일을 찾을 수 없습니다.');

            const fileResponse = await gmFetch(attachmentUrl);
            const blob = await fileResponse.blob();
            processImportFile(blob);
        } catch (error) {
            showToast('데이터를 가져오는 데 실패했습니다.');
            console.error('[Anilife 스크립트] 가져오기 오류:', error);
        }
    }

    function handleAutoBackupOnUnload() {
        if (backupHasBeenSent) return;
        backupHasBeenSent = true;

        const webhookUrl = localStorage.getItem('anilife_webhook_url');
        if (!webhookUrl) {
            console.log('[Anilife 스크립트] 자동 백업 건너뜀: 웹훅 URL이 설정되지 않았습니다.');
            return;
        }

        const anilifeSettings = getAnilifeSettings();
        const artplayerSettings = getArtplayerSettings();
        artplayerSettings.times = fullHistoryCache;

        const backupData = { anilife_settings: anilifeSettings, artplayer_settings: artplayerSettings };
        const jsonBackUp = JSON.stringify(backupData);
        const blob = new Blob([jsonBackUp], { type: 'application/json' });

        const payload = {
            content: `Anilife 자동 백업`,
            username: "Anilife Auto-Backup",
            avatar_url: "https://anilife.app/favicon.ico",
        };

        const formData = new FormData();
        formData.append('files[0]', blob, `anilife_autobackup_${new Date().toISOString().slice(0, 10)}.json`);
        formData.append("payload_json", JSON.stringify(payload));

        if (navigator.sendBeacon(webhookUrl, formData)) {
            console.log('[Anilife 스크립트] 자동 백업 데이터 전송을 시도했습니다.');
        } else {
            console.error('[Anilife 스크립트] 자동 백업 데이터 전송에 실패했습니다.');
        }
    }

    async function triggerAutoBackup(reason = "자동") {
        const webhookUrl = localStorage.getItem('anilife_webhook_url');
        if (!webhookUrl) return; // URL 없으면 조용히 종료

        console.log(`[Anilife 스크립트] 자동 백업 트리거됨 (${reason})`);

        const anilifeSettings = getAnilifeSettings();
        const artplayerSettings = getArtplayerSettings();
        artplayerSettings.times = fullHistoryCache; // 최신 기록 캐시 사용

        const backupData = { anilife_settings: anilifeSettings, artplayer_settings: artplayerSettings };
        const jsonBackUp = JSON.stringify(backupData);
        const blob = new Blob([jsonBackUp], { type: 'application/json' });

        const payload = {
            content: `Anilife 자동 백업 (${reason})`,
            username: "Anilife Auto-Backup",
            avatar_url: "https://anilife.app/favicon.ico",
        };

        const formData = new FormData();
        formData.append('files[0]', blob, `anilife_autobackup_${new Date().toISOString().slice(0, 10)}.json`);
        formData.append("payload_json", JSON.stringify(payload));

        try {
            const response = await gmFetch(webhookUrl, { method: 'POST', body: formData });
            if (!response.ok) {
                console.error(`[Anilife 스크립트] 자동 백업 실패: ${response.status}`);
            } else {
                console.log(`[Anilife 스크립트] 자동 백업 성공.`);
            }
        } catch (error) {
            console.error('[Anilife 스크립트] 자동 백업 오류:', error);
        }
    }

    // =================================================================================
    // Core Logic & Event Handlers
    // =================================================================================

    function handleBookmarkAction() {
        const pathname = window.location.pathname;
        let contentId = null;

        const contentMatch = pathname.match(/^\/content\/(\d+)/);
        if (contentMatch) {
            contentId = parseInt(contentMatch[1], 10);
        } else if (pathname.startsWith('/play')) {
            const linkElement = document.querySelector('#__nuxt > div > div > div.n-qPRf7 > div > div.E5n2is9 > div > div._2TM96Un > a.-PelM3I');
            if (linkElement?.href) {
                const linkMatch = new URL(linkElement.href).pathname.match(/^\/content\/(\d+)/);
                if (linkMatch?.[1]) contentId = parseInt(linkMatch[1], 10);
            }
        }

        if (contentId) {
            const result = toggleBookmark(contentId);
            showToast(result === 'added' ? '북마크에 추가되었습니다.' : '북마크가 해제되었습니다.');
            syncBookmarkButton(contentId, result === 'added');
            if (isModalVisible() && isTabActive('bookmarks')) {
                renderActiveTab();
            }
        }
    }

    function handleHateAction() {
        const pathname = window.location.pathname;
        let contentId = null;
        const contentMatch = pathname.match(/^\/content\/(\d+)/);
        if (contentMatch) {
            contentId = parseInt(contentMatch[1], 10);
        }
        if (contentId) {
            const result = toggleHate(contentId);
            showToast(result === 'added' ? '싫어요 항목에 추가되었습니다.' : '싫어요 항목에서 제거되었습니다.');
            syncHateButton(contentId, result === 'added');
            if (isModalVisible() && isTabActive('hates')) {
                renderActiveTab();
            }
        }
    }

    function handleKeyDown(event) {
        const key = event.key.toLowerCase();
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) return;

        if (event.ctrlKey && key === 'b') {
            event.preventDefault();
            handleBookmarkAction();
        }
        if (window.location.pathname.startsWith('/play') && event.key === "c" && event.ctrlKey && !event.altKey && !event.shiftKey) {
            copyVideoCapture(event);
        }
    }

    function handleStorageChange(event) {
        if (event.key === 'artplayer_settings') {
            syncLocalStorageToDB();
            if (isModalVisible()) {
                renderActiveTab();
            }
        }
    }

    function attachGlobalListeners() {
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('storage', handleStorageChange);
        // Use 'pagehide' and 'beforeunload' for modern browsers, which are more reliable than 'unload'.
        // The flag prevents sending multiple times.
        window.addEventListener('pagehide', (event) => {
            if (!event.persisted) {
                handleAutoBackupOnUnload();
            }
        });
        window.addEventListener('beforeunload', handleAutoBackupOnUnload);
    }

    // =================================================================================
    // Page Mutation & Dynamic Content Functions
    // =================================================================================
    function handleVideoTimeUpdate(event) {
        const video = event.target;
        if (!video || !video.duration) return;

        const progress = video.currentTime / video.duration;

        // Midpoint check
        if (progress >= 0.5 && !videoBackupFlags.mid) {
            videoBackupFlags.mid = true;
            triggerAutoBackup("비디오 50% 진행");
        }

        // End check (95%)
        if (progress >= 0.95 && !videoBackupFlags.end) {
            videoBackupFlags.end = true;
            triggerAutoBackup("비디오 95% 진행");
        }
    }

    async function setupVideoProgressListener() {
        if (!window.location.pathname.startsWith('/play')) return;

        try {
            const video = await waitForElement('video', 10000); // Wait for 10s

            const resetFlags = () => {
                console.log('[Anilife 스크립트] 새 비디오 로드, 백업 플래그 초기화.');
                videoBackupFlags = { mid: false, end: false };
            };

            // Remove old listeners to prevent duplication
            video.removeEventListener('loadstart', resetFlags);
            video.removeEventListener('timeupdate', handleVideoTimeUpdate);

            // Add new listeners
            video.addEventListener('loadstart', resetFlags);
            video.addEventListener('timeupdate', handleVideoTimeUpdate);

            console.log('[Anilife 스크립트] 비디오 진행도 감시자 설정 완료.');

        } catch (error) {
            console.error('[Anilife 스크립트] 비디오 요소를 찾을 수 없어 진행도 감시자를 설정할 수 없습니다:', error);
        }
    }

    async function syncHistoryForCurrentContentPage() {
        if (!location.pathname.startsWith("/content/") || !historyDB) return;
        const contentId = location.pathname.split("/").at(2);
        if (!contentId) return;

        try {
            const transaction = historyDB.transaction(['history'], 'readonly');
            const store = transaction.objectStore('history');
            const range = IDBKeyRange.bound(`${contentId}-`, `${contentId}-z`);
            const request = store.getAll(range);

            const records = await new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = (event) => reject(event.target.error);
            });

            if (records.length > 0) {
                const artSettings = getArtplayerSettings();
                const newTimes = {};
                records.forEach(record => {
                    newTimes[record.anime_id] = record.time;
                });

                const updatedTimes = { ...(artSettings.times || {}), ...newTimes };

                if (JSON.stringify(artSettings.times) !== JSON.stringify(updatedTimes)) {
                    artSettings.times = updatedTimes;
                    setArtplayerSettings(artSettings);
                }
            }
        } catch (error) {
            console.error('[Anilife 스크립트] 콘텐츠 페이지 시청 기록 동기화 실패:', error);
        }
    }

    const syncPlayRecordsIntoLocalStorageByContentId = async (contentId) => {
        try {
            const transaction = historyDB.transaction(['history'], 'readonly');
            const store = transaction.objectStore('history');
            const range = IDBKeyRange.bound(`${contentId}-`, `${contentId}-z`);
            const request = store.getAll(range);

            const records = await new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = (event) => reject(event.target.error);
            });

            if (records.length > 0) {
                const artSettings = getArtplayerSettings();
                const newTimes = {};
                console.log(records);
                records.forEach(record => {
                    newTimes[record.anime_id] = record.time;
                });

                const updatedTimes = { ...(artSettings.times || {}), ...newTimes };

                if (JSON.stringify(artSettings.times) !== JSON.stringify(updatedTimes)) {
                    artSettings.times = updatedTimes;
                    setArtplayerSettings(artSettings);
                }
            }
        } catch (error) {
            console.error('[Anilife 스크립트] 콘텐츠 페이지 시청 기록 동기화 실패:', error);
        }
    }

    function saveContentInfo() {
        if (!window.location.pathname.startsWith('/content/')) return;
        const match = window.location.pathname.match(/^\/content\/(\d+)/);
        if (!match) return;

        const contentId = match[1];
        const infoContainer = document.querySelector("body > div.al-scroll-none.pointer-events-auto.fixed.left-1\\/2.top-1\\/2.z-40.block.h-full.w-full.max-w-5xl.-translate-x-1\\/2.-translate-y-1\\/2.shadow-xl.shadow-black\\/10.sm\\:rounded-xl.md\\:max-h-\\[calc\\(90vh-2px\\)\\]");
        if (!infoContainer) return;

        try {
            const info = {
                title_ko: infoContainer.querySelector('h1')?.textContent.replace('에피소드', '').trim() || '',
                genres: Array.from(infoContainer.querySelectorAll('div.mb-2.flex.flex-wrap.gap-1\\.5 a[aria-label$=" 장르"]')).map(el => el.textContent.trim()),
                image: infoContainer.querySelector(`div > div.relative.divide-none > div.absolute.bottom-0.left-0.right-0.px-2.pb-8.md\\:px-8 > div > div.relative.hidden.md\\:block > img`)?.src || '',
                release: infoContainer.querySelector('a[href^="/season/"]')?.textContent.trim() || ''
            };
            const settings = getAnilifeSettings();
            if (!settings.content_info) settings.content_info = {};
            if (JSON.stringify(settings.content_info[contentId]) !== JSON.stringify(info)) {
                settings.content_info[contentId] = info;
                setAnilifeSettings(settings);
            }
        } catch (e) {
            console.error('[Anilife 스크립트] 콘텐츠 정보 저장 실패:', e);
        }
    }

    function checkAndGoToEpisode() {
        const pendingActionJSON = localStorage.getItem('anilife-temp-want-to-see-this-episode');
        if (!pendingActionJSON) return;

        const pendingAction = JSON.parse(pendingActionJSON);
        const currentContentIdMatch = window.location.pathname.match(/^\/content\/(\d+)/);

        if (currentContentIdMatch && currentContentIdMatch[1] === pendingAction.contentId) {
            localStorage.removeItem('anilife-temp-want-to-see-this-episode');
            (async()=>{
                const episodeList = Array.from(
                    document.querySelectorAll("body > div.al-scroll-none.pointer-events-auto.fixed.left-1\\/2.top-1\\/2.z-40.block.h-full.w-full.max-w-5xl.-translate-x-1\\/2.-translate-y-1\\/2.shadow-xl.shadow-black\\/10.sm\\:rounded-xl.md\\:max-h-\\[calc\\(90vh-2px\\)\\] > div > div.z-0.bg-theme-background.text-text-primary.dark\\:bg-\\[\\#121212\\] > div.mx-2.min-h-screen.w-auto.md\\:mx-8.mb-6 > section > ul > li")
                );
                const episodeElement = episodeList.find(el=>el.querySelector(`span.text-sm.font-normal.text-text-secondary.md\\:text-base`).textContent.trim() === `${pendingAction.episode}화`);
                if (episodeElement) {
                    episodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    while (location.pathname.startsWith("/content/")) {
                        console.log(`[Anilife 스크립트] ${pendingAction.episode}화 요소를 찾았습니다. 스크롤 및 클릭 시도...`, episodeElement);
                        await new Promise(resolve=>setTimeout(resolve, 1000));
                        episodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        episodeElement.click();
                    }
                } else {
                    console.error(`[Anilife 스크립트] ${pendingAction.episode}화 요소를 찾지 못했습니다.`);
                }
            })();
        }
    }

    function attachBookmarkButtonListener() {
        const button = document.querySelector(bookmarkButtonSelector);
        if (button && !button.dataset.bookmarkListenerAttached) {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                handleBookmarkAction();
            });
            button.dataset.bookmarkListenerAttached = 'true';
        }
    }

    function addHateButton() {
        if (document.querySelector(`#anilife-hate-button`)) return;
        if (!location.pathname.startsWith('/content/')) return;
        const contentId = location.pathname.split('/')[2];
        const isHatedNow = isHated(contentId);
        const button = document.createElement('button');
        button.id = 'anilife-hate-button';
        button.className = 'relative overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 dark:ring-offset-stone-950 dark:focus-visible:ring-stone-300 border h-9 rounded-full border-solid border-white/30 bg-transparent p-2.5 text-white hover:bg-white/10 hover:text-white/90 dark:bg-transparent dark:hover:bg-white/10';
        button.type = "button";
        button.innerHTML = isHatedNow ? '<i class="nf nf-md-eye-off"></i>' : '<i class="nf nf-md-eye"></i>';
        button.addEventListener('click', (event) => {
            event.preventDefault();
            handleHateAction();
        });
        document.querySelector("body > div.al-scroll-none.pointer-events-auto.fixed.left-1\\/2.top-1\\/2.z-40.block.h-full.w-full.max-w-5xl.-translate-x-1\\/2.-translate-y-1\\/2.shadow-xl.shadow-black\\/10.sm\\:rounded-xl.md\\:max-h-\\[calc\\(90vh-2px\\)\\] > div > div.relative.divide-none > div.absolute.bottom-0.left-0.right-0.px-2.pb-8.md\\:px-8 > div > div.text-white > div.flex.items-center.gap-3")?.appendChild(button);
    }

    let hatedStyle = GM_addStyle(``);
    function hideHatedContents() {
        const hates = getHates();
        const builtHatedStyle = hates.map(hate => `
            .swiper-slide:has(> article > a[href^="/content/${hate._data.contentId}"]), article:has(> a[href^="/content/${hate._data.contentId}"]), a[href^="/content/${hate._data.contentId}"]:not([href$="/ep"]):not([href$="/info"]):not([href$="/related"]):not([class="anilife-goto-home-btn"]) {
                display: none !important;
            }
            swiper-slide:has(> a[href^="/content/${hate._data.contentId}"]) {
                display: none !important;
            }
        `).join("\n");
        hatedStyle.remove();
        hatedStyle = GM_addStyle(builtHatedStyle);
    }

    function mutateBookmarkedContents() {
        const bookmarks = getBookmarks();
        bookmarks.forEach(bookmark => {
            const { contentId, title_ko } = bookmark._data;
            document.querySelectorAll(`a[href^="/content/${contentId}"]:not([href$="/ep"]):not([href$="/info"]):not([href$="/related"])`).forEach(a => {
                a.classList.add("anilife-bookmarked");
                if (a.closest('article')) {
                    a.closest('article').classList.add('anilife-bookmarked');
                    a.closest('article').title = title_ko;
                }
            });
        });
    }

    async function addViewedClass() {
        if (!location.pathname.startsWith("/content/")) return;
        const contentId = location.pathname.split("/").at(2);
        const historyItems = await getHistory();
        const episodeList = Array.from(document.querySelectorAll("body > div.al-scroll-none.pointer-events-auto.fixed.left-1\\/2.top-1\\/2.z-40.block.h-full.w-full.max-w-5xl.-translate-x-1\\/2.-translate-y-1\\/2.shadow-xl.shadow-black\\/10.sm\\:rounded-xl.md\\:max-h-\\[calc\\(90vh-2px\\)\\] > div > div.z-0.bg-theme-background.text-text-primary.dark\\:bg-\\[\\#121212\\] > div.mx-2.min-h-screen.w-auto.md\\:mx-8.mb-6 > section > ul > li:has(> article > span.text-sm.font-normal.text-text-secondary.md\\:text-base)"));
        historyItems.filter(item => item._data.contentId === contentId).forEach(item => {
            const { episode } = item._data;
            episodeList.find(el=>el.querySelector(`span.text-sm.font-normal.text-text-secondary.md\\:text-base`).textContent.trim() === `${episode}화`)?.classList?.add("viewed");
            document.getElementById(`episode-${episode}`)?.classList?.add("viewed");
        });
    }

    function addCaptureClipboardButtonAtPlayer() {
        if (!location.pathname.startsWith("/play")) return;
        if (document.querySelector("#anilife-capture-clipboard-button")) return;
        const playerControl = document.querySelector(`.art-controls-right`);
        if (!playerControl) return;

        const button = document.createElement("div");
        button.id = "anilife-capture-clipboard-button";
        button.className = "art-control art-control-screenshot-clipboard hint--rounded hint--top";
        button.ariaLabel = "클립보드에 복사 (Ctrl+C)";
        button.innerHTML = "<i class='nf nf-fa-clipboard'></i>";
        button.addEventListener("click", copyVideoCapture);
        playerControl.insertAdjacentElement("afterbegin", button);
    }

    function episodeTitleEdit() {
        if (!location.pathname.startsWith("/content/")) return;
        const foreignTitle = document.querySelector("main > header h2.visually-hidden");
        if (!foreignTitle) return;
        foreignTitle.classList.remove("visually-hidden");
        Object.assign(foreignTitle.style, { display: "flex", gap: ".5rem", marginTop: ".5rem" });
    }

    async function handleMutation() {
        // Functions to run on any DOM change
        await syncHistoryForCurrentContentPage();
        saveContentInfo();
        checkAndGoToEpisode();
        attachBookmarkButtonListener();
        addHateButton();
        hideHatedContents();
        mutateBookmarkedContents();
        episodeTitleEdit();
        addCaptureClipboardButtonAtPlayer();
        // syncWatchTime();
        await addViewedClass();
    }


    // =================================================================================
    // Observers & Initialization
    // =================================================================================


    async function videoChangeObserver() {
        while(!location.pathname.startsWith("/watch")) await new Promise(resolve => setTimeout(resolve, 4));
        const video = await waitForElement("video", Infinity);
        const observer = new MutationObserver(syncWatchTime);
        observer.observe(video, { attributes: true, attributeFilter: ['src'] });

    }

    function startMutationObserver() {
        const observer = new MutationObserver(handleMutation);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    let lastVideoSrc = null;
    let confirmationDialogShown = false;
    async function syncWatchTime() {
        /** @type { HTMLVideoElement } */
        const video = await waitForElement("video");
        if (lastVideoSrc === video.src) return;
        lastVideoSrc = video.src;

        let watchTime = 0, tempWatchTime = null;
        const thumbnailItem = await waitForElement("#root > div > div > main > div:nth-child(2) > div > div.sJiuczE > div.relative.overflow-hidden.al-scroll.h-\\[480px\\] > div > div > ul > li[id^='episode']:has(> div.absolute.left-0.top-0.h-full.w-1.rounded-sm.bg-blue-500.dark\\:bg-blue-400) > div > div > img");
        while(!thumbnailItem.src.startsWith("https://")) await new Promise(resolve => setTimeout(resolve, 4));
        const animeID = thumbnailItem.src.split("/").at(6).split("_").at(0);
        const episodeItem = document.querySelector("#root > div > div > main > div:nth-child(2) > div > div.h2XNx7A > div.relative.mx-2.mb-6.overflow-hidden.md\\:mx-0 > span");
        const episodeTitle = episodeItem.getAttribute("title");
        const episodeNumber = episodeItem.textContent.replace(episodeTitle, "").trim().replace("화", "");
        const watchId = `${animeID}-${episodeNumber}`;

        syncPlayRecordsIntoLocalStorageByContentId(animeID).then(()=>
            new Promise(resolve=>{
                video.addEventListener("play", resolve, { once: true });
            })
        ).then(()=>{
            const maxPlayTime = parseInt(video.duration);
            const artSettings = getArtplayerSettings();
            const lastPlayTime = artSettings.times[watchId];
            if (confirmationDialogShown) return;
            confirmationDialogShown = true;
            if (lastPlayTime && lastPlayTime != maxPlayTime) video.pause();
            const confirmed = lastPlayTime && lastPlayTime != maxPlayTime && confirm("마지막으로 재생하던 곳부터 다시 보시겠습니까?");
            confirmationDialogShown = false;
            if (!confirmed) return;
            video.currentTime = lastPlayTime;
            video.play();
        });

        video.addEventListener("timeupdate", (event) => {
            watchTime = parseInt(video.currentTime);
            if (watchTime != tempWatchTime) {
                const artSettings = getArtplayerSettings();
                artSettings.times[watchId] = watchTime;

                localStorage.setItem(`artplayer_settings`, JSON.stringify(artSettings));
                updateHistoryInDB(watchId, watchTime);
            }
            tempWatchTime = watchTime;
        });
    }

    async function init() {
        injectStyles();
        createUIElements();
        attachGlobalListeners();
        await openHistoryDB();
        await syncLocalStorageToDB();
        await populateHistoryCache();

        // 페이지 로드 시 UI가 올바르게 설정되도록 초기 실행
        await handleMutation();

        // 옵저버 시작
        startMutationObserver();
        videoChangeObserver();

        // 페이지가 재생 페이지에서 직접 로드된 경우 비디오 리스너 설정
        if (window.location.pathname.startsWith('/play')) {
            setupVideoProgressListener();
        }
    }

    // --- Run Script ---
    init();

})();