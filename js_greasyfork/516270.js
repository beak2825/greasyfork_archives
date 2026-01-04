// ==UserScript==
// @name         X 이미지 게시물만 표시
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  X(트위터)의 팔로우중 탭과 추천 탭에서 이미지가 있는 게시물만 표시합니다.
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516270/X%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EA%B2%8C%EC%8B%9C%EB%AC%BC%EB%A7%8C%20%ED%91%9C%EC%8B%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/516270/X%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EA%B2%8C%EC%8B%9C%EB%AC%BC%EB%A7%8C%20%ED%91%9C%EC%8B%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 게시물을 필터링하는 함수
    function filterPosts() {
        // 타임라인의 모든 게시물을 선택
        const posts = document.querySelectorAll('[data-testid="tweet"]');
        
        posts.forEach(post => {
            // 게시물 내의 이미지 요소를 찾습니다
            const image = post.querySelector('img[alt="Image"]');
            
            // 이미지가 없으면 게시물을 숨깁니다
            if (!image) {
                post.style.display = 'none';
            } else {
                post.style.display = 'block';
            }
        });
    }

    // MutationObserver를 사용하여 DOM 변경을 감지하고 필터링 함수를 실행
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                filterPosts();
            }
        });
    });

    // 타임라인을 관찰하기 시작
    function startObserving() {
        const timeline = document.querySelector('[data-testid="primaryColumn"]');
        if (timeline) {
            observer.observe(timeline, { childList: true, subtree: true });
            filterPosts(); // 초기 필터링 실행
        } else {
            // 타임라인이 로드되지 않았다면 잠시 후 다시 시도
            setTimeout(startObserving, 1000);
        }
    }

    // 페이지 로드 시 관찰 시작
    startObserving();

    // URL 변경 감지 및 필터링 재실행
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            filterPosts();
        }
    }).observe(document, {subtree: true, childList: true});

})();