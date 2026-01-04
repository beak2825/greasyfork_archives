// ==UserScript==
// @name         네이버 게임 알림 필터 탭 추가
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  네이버 게임 알림 페이지에 구독권/다시보기/새 영상 필터 탭을 추가합니다.
// @match        https://game.naver.com/notify
// @grant        none
// @author       루션 | Lusyeon
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534973/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EA%B2%8C%EC%9E%84%20%EC%95%8C%EB%A6%BC%20%ED%95%84%ED%84%B0%20%ED%83%AD%20%EC%B6%94%EA%B0%80.user.js
// @updateURL https://update.greasyfork.org/scripts/534973/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EA%B2%8C%EC%9E%84%20%EC%95%8C%EB%A6%BC%20%ED%95%84%ED%84%B0%20%ED%83%AD%20%EC%B6%94%EA%B0%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FILTERS = {
        all: () => true,
        gift: (text) => text.includes("구독권을 선물받았어요"),
        vod: (text) => text.includes("다시보기가 올라왔어요"),
        video: (text) => text.includes("새 영상이 올라왔어요"),
    };

    const TABS = [
        { name: "구독권", key: "gift" },
        { name: "다시보기", key: "vod" },
        { name: "새 영상", key: "video" },
    ];

    function applyFilter(filterKey) {
        const items = document.querySelectorAll('.notify_list_title__2lbQ4');
        items.forEach(item => {
            const text = item.textContent.trim();
            const li = item.closest('li');
            if (!li) return;

            const show = FILTERS[filterKey](text);
            li.style.display = show ? '' : 'none';
        });
    }

    function clearActiveTabs() {
        document.querySelectorAll('.notify_keyword_tab__3im4F').forEach(btn => {
            btn.setAttribute('aria-selected', 'false');
        });
    }

    function createButton(tab) {
        const li = document.createElement('li');
        li.className = 'notify_keyword_item__2-r08';
        li.setAttribute('role', 'presentation');

        const button = document.createElement('button');
        button.type = 'button';
        button.role = 'tab';
        button.className = 'notify_keyword_tab__3im4F';
        button.textContent = tab.name;
        button.setAttribute('aria-selected', 'false');
        button.dataset.filterKey = tab.key;

        button.addEventListener('click', () => {
            clearActiveTabs();
            button.setAttribute('aria-selected', 'true');
            applyFilter(tab.key);
        });

        li.appendChild(button);
        return li;
    }

    function enhanceTabs() {
        const tabList = document.querySelector('ul.notify_keyword_list__1ecK3');
        if (!tabList || tabList.querySelector('[data-filter-key]')) return; // 중복 방지

        TABS.forEach(tab => {
            const tabButton = createButton(tab);
            tabList.appendChild(tabButton);
        });

        // "전체" 버튼 클릭 시 전체 보기
        const 전체버튼 = [...tabList.querySelectorAll('button')]
            .find(btn => btn.textContent.trim() === '전체');

        if (전체버튼) {
            전체버튼.addEventListener('click', () => {
                clearActiveTabs();
                전체버튼.setAttribute('aria-selected', 'true');
                applyFilter('all');
            });
        }
    }

    function observeAndInject() {
        const observer = new MutationObserver(() => {
            enhanceTabs();

            // 활성 탭이 있을 경우 필터 유지
            const activeTab = document.querySelector('.notify_keyword_tab__3im4F[aria-selected="true"][data-filter-key]');
            if (activeTab) {
                applyFilter(activeTab.dataset.filterKey);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        enhanceTabs();
        observeAndInject();
    });
})();