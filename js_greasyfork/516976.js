// ==UserScript==
// @name          치지직 1080p
// @namespace     치지직 1080p
// @match         *://chzzk.naver.com/*
// @version       0.1
// @grant         none
// @license       MIT
// @description asd
// @downloadURL https://update.greasyfork.org/scripts/516976/%EC%B9%98%EC%A7%80%EC%A7%81%201080p.user.js
// @updateURL https://update.greasyfork.org/scripts/516976/%EC%B9%98%EC%A7%80%EC%A7%81%201080p.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 팝업 제거 함수
    function removePopup() {
        const popup = document.querySelector('.popup_dimmed__zs78t');
        if (popup) {
            popup.remove();
        }
    }

    // 해상도 설정 함수
    function setResolution() {
        const settingsButton = document.querySelector('.pzp-pc-setting-button');

        if (settingsButton) {
            settingsButton.click();

            setTimeout(() => {
                const qualityMenu = document.querySelector('.pzp-pc-setting-intro-quality');
                if (qualityMenu) {
                    qualityMenu.click();

                    setTimeout(() => {
                        const options = document.querySelectorAll('.pzp-pc-ui-setting-quality-item__prefix');
                        const option1080p = Array.from(options).find(option => option.textContent.includes('1080p'));
                        const option720p = Array.from(options).find(option => option.textContent.includes('720p'));

                        if (option1080p && !option1080p.classList.contains('pzp-pc-ui-setting-item--checked')) {
                            option1080p.click();
                        } else if (option720p && !option720p.classList.contains('pzp-pc-ui-setting-item--checked')) {
                            option720p.click();
                        }
                    }, 500);
                }
            }, 500);
        }
    }

    // 스크롤 오류 수정 함수
    function fixScrollIssue() {
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        // `position: fixed` 속성 제거
        document.body.style.position = '';
        document.documentElement.style.position = '';

        // `height` 속성 재설정
        document.body.style.height = 'auto';
        document.documentElement.style.height = 'auto';
    }

    // URL 변화 감지하여 해상도 및 스크롤 재설정
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;

            if (location.href === 'https://chzzk.naver.com/lives') {
                setTimeout(fixScrollIssue, 500);
            } else {
                setTimeout(setResolution, 1000);
            }
        }
    }, 1000);

    // 페이지 처음 로드 시 해상도 설정 및 스크롤 문제 확인
    window.addEventListener('load', () => {
        if (location.href === 'https://chzzk.naver.com/lives') {
            fixScrollIssue();
        } else {
            setTimeout(setResolution, 1000);
        }
    });

    // MutationObserver를 사용하여 DOM 변화를 감지하여 팝업 제거
    const observer = new MutationObserver(removePopup);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 초기 로딩 시 팝업이 있을 경우 제거
    removePopup();
})();
