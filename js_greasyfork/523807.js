// ==UserScript==
// @name         Shift+Wheel to Swiper Bullet for ZOD.kr
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Shift + 마우스휠로 Swiper 페이지 이동
// @author
// @match        https://zod.kr/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/523807/Shift%2BWheel%20to%20Swiper%20Bullet%20for%20ZODkr.user.js
// @updateURL https://update.greasyfork.org/scripts/523807/Shift%2BWheel%20to%20Swiper%20Bullet%20for%20ZODkr.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 스크립트 초기화
     */
    function initSwiperShiftScroll() {
        // 현재 페이지 내 모든 Swiper 영역을 탐색
        const swiperPaginations = document.querySelectorAll('.swiper-pagination');

        swiperPaginations.forEach((paginationEl) => {
            // 이미 이벤트가 붙어있다면 재등록 방지
            if (paginationEl.getAttribute('data-shift-scroll-initialized') === 'true') {
                return;
            }

            // 실제로 휠 이벤트를 받을 .swiper 부모 컨테이너
            const swiperContainer = paginationEl.closest('.swiper');
            if (!swiperContainer) return;

            swiperContainer.addEventListener('wheel', function (event) {
                // Shift 키가 눌려있는 경우에만 동작
                if (event.shiftKey) {
                    event.preventDefault();

                    // 불릿 리스트 가져오기
                    const bullets = paginationEl.querySelectorAll('.swiper-pagination-bullet');
                    if (!bullets || bullets.length === 0) return;

                    // 현재 활성화된 불릿 인덱스 찾기
                    let activeIndex = 0;
                    for (let i = 0; i < bullets.length; i++) {
                        if (bullets[i].getAttribute('aria-current') === 'true') {
                            activeIndex = i;
                            break;
                        }
                    }

                    // event.deltaY > 0 이면 → 다음 슬라이드로
                    // event.deltaY < 0 이면 → 이전 슬라이드로
                    if (event.deltaY > 0) {
                        // 다음 불릿이 있으면 클릭
                        if (activeIndex < bullets.length - 1) {
                            bullets[activeIndex + 1].click();
                        }
                    } else {
                        // 이전 불릿이 있으면 클릭
                        if (activeIndex > 0) {
                            bullets[activeIndex - 1].click();
                        }
                    }
                }
            }, { passive: false });

            // 중복 방지 마크
            paginationEl.setAttribute('data-shift-scroll-initialized', 'true');
        });
    }

    // DOM 변경을 감지하면서, 새로 생긴 Swiper에도 동일 동작을 적용
    const observer = new MutationObserver(() => {
        initSwiperShiftScroll();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // 처음 스크립트가 실행될 때도 한 번 초기화
    initSwiperShiftScroll();
})();
