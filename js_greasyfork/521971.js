// ==UserScript==
// @name         아카라이브 레인보우
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  아카라이브의 복잡하게 된 답글을 무지개 형식으로 구분해줍니다.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arca.live
// @author       Arcalive User
// @match        https://arca.live/b/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521971/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%A0%88%EC%9D%B8%EB%B3%B4%EC%9A%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/521971/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%A0%88%EC%9D%B8%EB%B3%B4%EC%9A%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 무지개 색상 배열 정의 (indent-rainbow와 유사한 색상)
    const colors = [
        'rgba(255,123,123,0.1)', // 빨간색
        'rgba(255,192,120,0.1)', // 주황색
        'rgba(255,255,123,0.1)', // 노란색
        'rgba(123,255,123,0.1)', // 초록색
        'rgba(123,123,255,0.1)', // 파란색
        'rgba(192,120,255,0.1)'  // 보라색
    ];

    // border 색상 배열 (좀 더 진한 버전)
    const borderColors = [
        'rgba(255,123,123,0.4)',
        'rgba(255,192,120,0.4)',
        'rgba(255,255,123,0.4)',
        'rgba(123,255,123,0.4)',
        'rgba(123,123,255,0.4)',
        'rgba(192,120,255,0.4)'
    ];

    function applyRainbowIndentation() {
        // 모든 댓글 래퍼를 찾음
        const commentWrappers = document.querySelectorAll('.comment-wrapper');

        commentWrappers.forEach(wrapper => {
            // 댓글의 중첩 레벨을 계산
            let level = 0;
            let parent = wrapper;
            while ((parent = parent.parentElement.closest('.comment-wrapper'))) {
                level++;
            }

            // 중첩된 댓글에만 스타일 적용 (level > 0)
            if (level > 0) {
                const colorIndex = (level - 1) % colors.length;

                // 댓글 아이템에 스타일 적용
                const commentItem = wrapper.querySelector('.comment-item');
                if (commentItem) {
                    commentItem.style.backgroundColor = colors[colorIndex];
                    commentItem.style.borderLeft = `3px solid ${borderColors[colorIndex]}`;
                    commentItem.style.margin = '5px 0';
                    commentItem.style.paddingLeft = '10px';
                }
            }
        });
    }

    // 페이지 로드 시 적용
    applyRainbowIndentation();

    // 댓글이 동적으로 로드되는 경우를 위한 MutationObserver 설정
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            // 새 댓글 알림이나 페이지 변경으로 인한 DOM 변화 감지
            if (mutation.type === 'childList' ||
                mutation.target.classList.contains('newcomment-alert') ||
                mutation.target.classList.contains('pagination-wrapper')) {
                applyRainbowIndentation();
                break;
            }
        }
    });

    // 댓글 영역과 페이지네이션 영역 감시 시작
    const commentSection = document.querySelector('.list-area');
    const paginationWrapper = document.querySelector('.pagination-wrapper');

    if (commentSection) {
        observer.observe(commentSection, {
            childList: true,
            subtree: true
        });
    }

    if (paginationWrapper) {
        observer.observe(paginationWrapper, {
            childList: true,
            subtree: true
        });
    }

    // 새 댓글 알림 영역도 감시
    const newCommentAlert = document.querySelector('.newcomment-alert');
    if (newCommentAlert) {
        observer.observe(newCommentAlert, {
            attributes: true,
            childList: true
        });
    }

    // 댓글 새로고침 버튼 클릭 이벤트 감지
    const refreshButton = document.querySelector('.MuiIconButton-root');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            // 약간의 지연을 주어 DOM 업데이트 후 스타일 적용
            setTimeout(applyRainbowIndentation, 500);
        });
    }
})();