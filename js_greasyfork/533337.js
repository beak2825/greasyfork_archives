// ==UserScript==
// @name         YouTube: Return Grid Layout
// @namespace    Return YouTube Grid Layout
// @version      1.3.5
// @description  유튜브 홈에서 보여지는 영상 갯수 제한을 원래대로 돌립니다
// @description:en Force YouTube grid layout to show 1~6 videos per row responsively, and scale up thumbnails on wide screens
// @author       DOGJIP
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/533337/YouTube%3A%20Return%20Grid%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/533337/YouTube%3A%20Return%20Grid%20Layout.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STYLE_ID = 'custom-grid-style';

    function getItemsPerRow(width) {
        if (width >= 2400) return 6;
        if (width >= 1950) return 5;
        if (width >= 1500) return 4;
        if (width >= 1050) return 3;
        if (width >= 650) return 2;
        return 1;
    }

    function getItemWidth(width, itemsPerRow) {
        const containerWidth = width - 96;
        const totalMargin = 16 * (itemsPerRow - 1);
        const itemWidth = Math.floor((containerWidth - totalMargin) / itemsPerRow);

        const maxDefault = 300;
        const minDefault = 220;

        const maxW = Math.min(Math.max(itemWidth, maxDefault), 400);
        const minW = Math.min(Math.max(itemWidth - 25, minDefault), maxW - 15);

        return { maxW, minW };
    }

function generateStyle(width) {
    const n = getItemsPerRow(width);
    const { maxW, minW } = getItemWidth(width, n);

    return `
        /* —— 기존 유튜브 CSS 변수 유지 —— */
        ytd-rich-grid-renderer {
            --ytd-rich-grid-item-max-width: ${maxW}px !important;
            --ytd-rich-grid-item-min-width: ${minW}px !important;
            --ytd-rich-grid-row-margin: 32px !important;
            --ytd-rich-grid-items-per-row: ${n} !important;
            --ytd-rich-grid-item-margin: 16px !important;
            --ytd-rich-grid-posts-per-row: ${n} !important;
            --ytd-rich-grid-slim-items-per-row: ${n} !important;
            --ytd-rich-grid-game-cards-per-row: ${n} !important;
            --ytd-rich-grid-mini-game-cards-per-row: ${n} !important;
            --ytd-rich-grid-content-offset-top: 56px !important;

            /* 시작 오프셋 제거 */
            padding-inline-start: 0 !important;
            --ytd-rich-grid-content-offset-left: 0 !important;
        }

        /* —— CSS Grid: n개 컬럼 고정 + 밀도 채우기 —— */
        ytd-rich-grid-renderer ytd-rich-grid-row {
            display: grid !important;
            grid-auto-flow: row !important;
            grid-template-columns: repeat(${n}, minmax(${minW}px, 1fr)) !important;
            column-gap: 16px !important;
            row-gap: 16px !important;
            margin: 0 !important;
            justify-items: stretch !important;
        }

        /* 각 아이템이 셀 크기에 꽉 차도록 */
        ytd-rich-grid-renderer ytd-rich-grid-row ytd-rich-item-renderer {
            width: 100% !important;
            margin: 0 !important;
        }

        /* 숨겨진 아이템(placeholder)만 다시 보이게 */
        ytd-rich-item-renderer[hidden],
        ytd-rich-item-renderer[hidden][is-responsive-grid] {
            display: block !important;
        }

        /* 재생목록/믹스 섹션 제거 */
        ytd-rich-section-renderer,
        ytd-rich-section-renderer ytd-rich-shelf-renderer {
            display: none !important;
        }
    `;
}

    function isExcludedPage(path) {
        return /^\/@[^\/]+\/(?:videos|streams)(?:[\/?].*)?$/.test(path);
    }

    function applyStyle() {
        if (isExcludedPage(location.pathname + location.search)) {
            const old = document.getElementById(STYLE_ID);
            if (old) old.remove();
            return;
        }

        const old = document.getElementById(STYLE_ID);
        if (old) old.remove();

        const styleEl = document.createElement('style');
        styleEl.id = STYLE_ID;
        styleEl.textContent = generateStyle(window.innerWidth);
        document.head.appendChild(styleEl);
    }

    function registerNavigationListener() {
        window.addEventListener('yt-navigate-finish', applyStyle);
        const pushState = history.pushState;
        history.pushState = function () {
            pushState.apply(this, arguments);
            applyStyle();
        };
        window.addEventListener('popstate', applyStyle);
    }

    registerNavigationListener();
    document.addEventListener('DOMContentLoaded', applyStyle);
    window.addEventListener('resize', applyStyle);
    let debounceTimer = null;
    const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyStyle, 100); // 디바운싱
});
})();
