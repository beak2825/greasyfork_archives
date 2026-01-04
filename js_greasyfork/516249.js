// ==UserScript==
// @name         chzzk-1080p
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  치지직 1080p 해상도로 고정합니다
// @match        *://chzzk.naver.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516249/chzzk-1080p.user.js
// @updateURL https://update.greasyfork.org/scripts/516249/chzzk-1080p.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isQualitySet = false;

    function openQualitySettings() {
        if (isQualitySet) return;

        const settingsButton = document.querySelector('.pzp-ui-icon.pzp-pc-setting-button__icon');
        if (settingsButton) {
            settingsButton.click();

            setTimeout(() => {
                const qualityMenu = document.querySelector('.pzp-pc-ui-setting-intro-panel.pzp-pc-setting-intro-quality');
                if (qualityMenu) {
                    qualityMenu.click();

                    setTimeout(() => {
                        try {
                            const quality1080pSpan = Array.from(document.querySelectorAll('span.pzp-pc-ui-setting-quality-item__prefix'))
                                .find(span => span.textContent.trim().includes('1080p'));

                            if (quality1080pSpan) {
                                const quality1080p = quality1080pSpan.closest('li.pzp-pc-ui-setting-quality-item');
                                if (quality1080p) {
                                    // 1. element.click() 시도
                                    quality1080p.click();

                                    // 2. mousedown/mouseup 시뮬레이션 (필요 시 추가)
                                    // quality1080p.dispatchEvent(new MouseEvent('mousedown', ...));
                                    // quality1080p.dispatchEvent(new MouseEvent('mouseup', ...));

                                    // 3. 좌표 기반 클릭 시뮬레이션 (필요 시 추가)
                                    // const rect = quality1080p.getBoundingClientRect();
                                    // ... 좌표 계산 및 이벤트 발생 ...

                                    console.log("1080p로 설정되었습니다.");
                                    isQualitySet = true;
                                } else {
                                    console.log("1080p 옵션의 li 요소를 찾을 수 없습니다.");
                                }
                            } else {
                                console.log("1080p 옵션을 찾을 수 없습니다.");
                            }
                        } catch (error) {
                            console.error("1080p 설정 중 오류 발생:", error);
                        }
                    }, 3000);
                }
            }, 500);
        }
    }

    function watchForPlayer() {
    const observer = new MutationObserver((mutations, obs) => {
        const player = document.querySelector('video');
        if (player) {
            openQualitySettings();
            obs.disconnect(); // observer 중단 활성화
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    return observer;
}

function fixScrollIssue() {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.position = 'relative';
    document.documentElement.style.position = 'relative';
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';
    console.log("스크롤 문제가 수정되었습니다.");
}

let currentObserver = null;

function applySettingsOnSpecificPages() {
    if (currentObserver) {
        currentObserver.disconnect();
    }

    isQualitySet = false; // URL 변경 시 플래그 초기화

    if (
        location.href.includes("/live/") ||
        location.href.includes("/video/")
    ) {
        currentObserver = watchForPlayer();
        fixScrollIssue();
    } else {
        fixScrollIssue();
    }
}

// 페이지 로드 시 설정 적용
window.addEventListener("load", applySettingsOnSpecificPages);

// URL 변경 감지
let lastPathname = location.pathname;
new MutationObserver(() => {
    const pathname = location.pathname;
    if (pathname !== lastPathname) {
        lastPathname = pathname;
        applySettingsOnSpecificPages();
    }
}).observe(document, {subtree: true, childList: true});
})();