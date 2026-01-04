// ==UserScript==
// @name         Twitter Image-Only Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  트위터에서 이미지가 있는 게시물만 표시합니다.
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516266/Twitter%20Image-Only%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/516266/Twitter%20Image-Only%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .hidden-tweet {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // 이미지 필터 토글 버튼 추가
    const addFilterButton = () => {
        const nav = document.querySelector('nav[aria-label="주요 내비게이션"]');
        if (nav && !document.getElementById('image-filter-toggle')) {
            const button = document.createElement('button');
            button.id = 'image-filter-toggle';
            button.textContent = '이미지 필터 켜기';
            button.style.cssText = 'margin: 10px; padding: 5px 10px; background-color: #1da1f2; color: white; border: none; border-radius: 20px; cursor: pointer;';
            button.addEventListener('click', toggleImageFilter);
            nav.appendChild(button);
        }
    };

    // 이미지 필터 토글 함수
    let filterEnabled = false;
    const toggleImageFilter = () => {
        filterEnabled = !filterEnabled;
        const button = document.getElementById('image-filter-toggle');
        if (button) {
            button.textContent = filterEnabled ? '이미지 필터 끄기' : '이미지 필터 켜기';
        }
        filterTweets();
    };

    // 트윗 필터링 함수
    const filterTweets = () => {
        const tweets = document.querySelectorAll('article[data-testid="tweet"]');
        tweets.forEach(tweet => {
            const hasImage = tweet.querySelector('img[alt="Image"]');
            if (filterEnabled && !hasImage) {
                tweet.classList.add('hidden-tweet');
            } else {
                tweet.classList.remove('hidden-tweet');
            }
        });
    };

    // 주기적으로 새 트윗 확인 및 필터링
    const observeTimeline = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    filterTweets();
                }
            });
        });

        const timeline = document.querySelector('div[data-testid="primaryColumn"]');
        if (timeline) {
            observer.observe(timeline, { childList: true, subtree: true });
        }
    };

    // 초기 실행
    const init = () => {
        addFilterButton();
        observeTimeline();
    };

    // 페이지 로드 완료 후 실행
    window.addEventListener('load', init);
})();