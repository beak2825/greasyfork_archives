// ==UserScript==
// @name        DCInside Mobile Image Viewer Extended
// @namespace   https://m.dcinside.com
// @version     1.1
// @description 모바일 DCInside 이미지 뷰어 개선(스와이프 뿐만이 아닌 키보드 입력 또는 클릭으로 페이지 이동/뷰어에서 본 이미지로 스크롤 이동)
// @author      iwj9
// @match       https://m.dcinside.com/board/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/539404/DCInside%20Mobile%20Image%20Viewer%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/539404/DCInside%20Mobile%20Image%20Viewer%20Extended.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function syncScrollPosition(index) {
        const imageInDoc = document.querySelector(`.thum-txtin img[zoom-number="${index}"]`);
        if (imageInDoc) {
          imageInDoc.scrollIntoView({ block: 'center' });
        }
    }

    function handleKeyDown(swiper, e) {
        const viewerContainer = document.getElementById('img_zoom_pop');
        if (!viewerContainer || viewerContainer.style.display === 'none') {
            return; // 뷰어 끈 상태에서 키 입력 시 오동작 방지
        }

        const prevKeys = ['ArrowLeft', 'ArrowUp', 'PageUp'];
        const nextKeys = ['ArrowRight', 'ArrowDown', 'PageDown'];

        if (prevKeys.includes(e.key)) {
            e.preventDefault();
            swiper.slidePrev();
        } else if (nextKeys.includes(e.key)) {
            e.preventDefault();
            swiper.slideNext();
        }
    }

    function handleClickNavigation(swiper, e) {
        if (!e.target.closest('.swiper-zoom-container')) {
            return;
        }

        const viewWidth = window.innerWidth;
        const clickX = e.clientX;

        if (clickX < viewWidth / 3) {
            swiper.slidePrev();
        } else if (clickX > viewWidth * 2 / 3) {
            swiper.slideNext();
        }
    }

    function enhanceSwiper(swiper) {
        if (swiper.isEnhanced) {
            return;
        }
        swiper.isEnhanced = true;

        swiper.el.addEventListener('click', (e) => handleClickNavigation(swiper, e));

        const keyboardListener = (e) => handleKeyDown(swiper, e);
        document.addEventListener('keydown', keyboardListener);

        swiper.on('slideChange', () => {
            syncScrollPosition(swiper.activeIndex);
        });

        swiper.on('destroy', () => {
            document.removeEventListener('keydown', keyboardListener);
        });

        syncScrollPosition(swiper.activeIndex);
    }

    function initObserver() {
        const observer = new MutationObserver((mutationsList, obs) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                      if (node.nodeType === 1 && node.id === 'img_zoom_pop') {
                        const swiperEl = node.querySelector('#img_zoom_swiper');
                        if (swiperEl && swiperEl.swiper) {
                            setTimeout(() => enhanceSwiper(swiperEl.swiper), 100);
                            obs.disconnect();
                        }
                      }
                    });
                }
            }
        });
        observer.observe(document.body, { childList: true });
    }

    initObserver();
})();