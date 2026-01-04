// ==UserScript==
// @name         치지직 팔로우 목록 자동 새로고침 + 자동 펼치기
// @namespace    http://tampermonkey.net/
// @version      25091101
// @description  팔로우 목록을 원하는 시간마다 반복 새로고침 + 팔로우 목록을 자동으로 전부 펼칩니다.
// @match        *://chzzk.naver.com/*
// @grant        none
// @author       Lusyeon | 루션
// @icon         https://chzzk.naver.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533790/%EC%B9%98%EC%A7%80%EC%A7%81%20%ED%8C%94%EB%A1%9C%EC%9A%B0%20%EB%AA%A9%EB%A1%9D%20%EC%9E%90%EB%8F%99%20%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8%20%2B%20%EC%9E%90%EB%8F%99%20%ED%8E%BC%EC%B9%98%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/533790/%EC%B9%98%EC%A7%80%EC%A7%81%20%ED%8C%94%EB%A1%9C%EC%9A%B0%20%EB%AA%A9%EB%A1%9D%20%EC%9E%90%EB%8F%99%20%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8%20%2B%20%EC%9E%90%EB%8F%99%20%ED%8E%BC%EC%B9%98%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const refreshInterval = 60000; // 30초마다 새로고침 (Refresh every 30 seconds)
    const hideOffline = 0;         // 1이면 오프라인 숨김 (1 = Hide offline streamers)
    const Count = 0;               // 0이면 카운트 표시, 1이면 표시 안 함 (0 = Show count, 1 = Hide count)

    let isFirstRun = true;

    function clickRefreshButton() {
        const refreshBtn = document.querySelector('button.navigator_button__HhFim');
        if (refreshBtn) {
            refreshBtn.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        }
    }

    function clickAllMoreButtons(callback) {
        const moreBtn = document.querySelector('button[aria-label="더보기"][aria-expanded="false"]');
        if (moreBtn) {
            moreBtn.click();
            setTimeout(() => clickAllMoreButtons(callback), 700);
        } else {
            if (hideOffline === 1) hideOfflineItems();
            if (typeof callback === 'function') callback();
        }
    }

    function hideOfflineItems() {
        const items = document.querySelectorAll('#root aside ul > li');
        items.forEach(item => {
            const span = item.querySelector('span.blind');
            if (span?.textContent?.trim() === '오프라인') {
                item.style.display = 'none';
            }
        });
    }

function updateFollowCount() {
    if (Count === 1) return;

    const sectionTitle = [...document.querySelectorAll('strong.navigation_bar_title__1UBnx')]
        .find(el => el.textContent.includes('팔로잉 채널'));
    if (!sectionTitle) return;

    const section = sectionTitle.closest('nav');
    if (!section) return;

    const listItems = section.querySelectorAll('ul > li');

    const liveItems = [...listItems].filter(li => {
        const span = li.querySelector('span.blind');
        return span?.textContent?.trim() === 'LIVE';
    });

    const live = liveItems.length;
    const total = listItems.length;
    const totalDisplay = total >= 505 ? '505+' : total;

    let countSpan = sectionTitle.querySelector('span.follow-count');
    if (!countSpan) {
        countSpan = document.createElement('span');
        countSpan.className = 'follow-count';
        countSpan.style.marginLeft = '20px';
        countSpan.style.fontSize = '0.9em';
        countSpan.style.color = '#888';
        sectionTitle.appendChild(countSpan);
    }

    if (isFirstRun) {
        countSpan.textContent = `${live} / ${totalDisplay}`;

        if (total >= 505) {
            setTimeout(() => {
                countSpan.textContent = `${live}`;
            }, 5000);
        }

        isFirstRun = false;
    } else {
        countSpan.textContent = `${live}`;
    }
}

    function runInitial() {
        clickAllMoreButtons(updateFollowCount);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runInitial);
    } else {
        setTimeout(runInitial, 1500);
    }

    setInterval(() => {
        clickRefreshButton();
        setTimeout(() => clickAllMoreButtons(updateFollowCount), 2000);
    }, refreshInterval);
})();
