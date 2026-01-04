// ==UserScript==
// @name         Holodex - Auto Click Sort Dropdown and Select Most Viewers (With Load Detection)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically clicks the sort dropdown and selects "Most Viewers" on Holodex.net with load detection
// @author       ChatGPT
// @match        https://holodex.net/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535602/Holodex%20-%20Auto%20Click%20Sort%20Dropdown%20and%20Select%20Most%20Viewers%20%28With%20Load%20Detection%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535602/Holodex%20-%20Auto%20Click%20Sort%20Dropdown%20and%20Select%20Most%20Viewers%20%28With%20Load%20Detection%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 정렬 아이콘 클릭을 위한 함수
    function findSortButton() {
        return [...document.querySelectorAll('svg.v-icon__svg')].find(svg => {
            const path = svg.querySelector('path');
            return path?.getAttribute('d') === 'M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z';
        })?.closest('button');
    }

    // "Sort" 탭 클릭
    function clickSortTab() {
        const sortTab = document.querySelector('.v-select__selection--comma');
        if (sortTab && sortTab.textContent.includes('Latest')) {
            console.log('[Tampermonkey] "Sort" tab found, clicking...');
            sortTab.click();
        } else {
            console.log('[Tampermonkey] "Sort" tab not found!');
        }
    }

    // "Most Viewers" 항목 선택
    function selectMostViewers() {
        const listItems = document.querySelectorAll('.v-list-item');
        for (const item of listItems) {
            if (item.textContent.includes('Most Viewers')) {
                console.log('[Tampermonkey] "Most Viewers" found, selecting...');
                item.click();
                return true;
            }
        }
        return false;
    }

    // 첫 번째 정렬 버튼 클릭 및 이후 단계 처리
    function trySortClickAndSelect() {
        const sortButton = findSortButton();
        if (sortButton) {
            console.log('[Tampermonkey] Sort button found, clicking...');
            sortButton.click();

            // 바로 "Sort" 탭 클릭
            clickSortTab();

            // "Most Viewers" 항목을 바로 선택 시도
            if (!selectMostViewers()) {
                console.log('[Tampermonkey] "Most Viewers" not found yet, retrying...');
                // 만약 아직 항목이 준비되지 않았다면 다시 시도
                setTimeout(() => {
                    console.log('[Tampermonkey] Retry select "Most Viewers"...');
                    selectMostViewers();
                }, 300);
            }
        } else {
            console.log('[Tampermonkey] Sort button not found!');
        }
    }

    // 로딩 완료 감지 함수
    function detectPageLoad() {
        // 페이지 로딩이 완료되고 나면 클릭 작업 시작
        if (document.readyState === 'complete') {
            console.log('[Tampermonkey] Page loaded, starting sort click...');
            trySortClickAndSelect();
        }
    }

    // 페이지 로딩 상태 감지
    window.addEventListener('load', detectPageLoad);

    // DOM 변화 감지
    const observer = new MutationObserver(() => {
        const sortButton = findSortButton();
        if (sortButton) {
            sortButton.click();
            console.log('[Tampermonkey] Sort dropdown button clicked');
            observer.disconnect(); // 버튼 클릭 후 감지 종료

            // 버튼 클릭 후 나머지 작업 수행
            trySortClickAndSelect();
        }
    });

    // 페이지 로드 후 감지 시작
    window.addEventListener('load', () => {
        console.log('[Tampermonkey] Script loaded, starting observer...');
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
