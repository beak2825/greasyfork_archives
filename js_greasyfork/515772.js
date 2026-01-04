// ==UserScript==
// @name         치지직 1080p 고정 + 광고 팝업 삭제 +치직치지직 광고 차단 로그 제거
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  치지직 1080p 고정 및 광고 팝업 삭제, 치직치지직 광고 차단 로그 제거 각 기능 별도로 실행 후 종료
// @match        *://chzzk.naver.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515772/%EC%B9%98%EC%A7%80%EC%A7%81%201080p%20%EA%B3%A0%EC%A0%95%20%2B%20%EA%B4%91%EA%B3%A0%20%ED%8C%9D%EC%97%85%20%EC%82%AD%EC%A0%9C%20%2B%EC%B9%98%EC%A7%81%EC%B9%98%EC%A7%80%EC%A7%81%20%EA%B4%91%EA%B3%A0%20%EC%B0%A8%EB%8B%A8%20%EB%A1%9C%EA%B7%B8%20%EC%A0%9C%EA%B1%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/515772/%EC%B9%98%EC%A7%80%EC%A7%81%201080p%20%EA%B3%A0%EC%A0%95%20%2B%20%EA%B4%91%EA%B3%A0%20%ED%8C%9D%EC%97%85%20%EC%82%AD%EC%A0%9C%20%2B%EC%B9%98%EC%A7%81%EC%B9%98%EC%A7%80%EC%A7%81%20%EA%B4%91%EA%B3%A0%20%EC%B0%A8%EB%8B%A8%20%EB%A1%9C%EA%B7%B8%20%EC%A0%9C%EA%B1%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let previousChannelId = null;
    let scriptRunning = false;

    // URL 변화를 감지하는 함수
    const detectChannelChange = () => {
        const currentUrl = window.location.href;
        const channelIdMatch = currentUrl.match(/live\/([a-f0-9]{32})/);
        const currentChannelId = channelIdMatch ? channelIdMatch[1] : null;

        if (currentChannelId && currentChannelId !== previousChannelId) {
            previousChannelId = currentChannelId;
            if (!scriptRunning) {
                executeScripts();
            }
        }
    };

    // 주기적으로 URL 변경 확인 (5000ms마다 확인)
    setInterval(detectChannelChange, 5000);

    // 각 기능을 수행하는 스크립트 실행 함수
    function executeScripts() {
        scriptRunning = true;

        // 랜덤 지연 시간 생성 함수 (500ms ~ 1500ms 사이 랜덤)
        function getRandomDelay() {
            return Math.floor(Math.random() * 1000) + 500;
        }

        // 중복 실행 방지를 위한 플래그
        let qualitySet = false;
        let adRemoved = false;

        // 모든 작업이 완료되었는지 확인하고 스크립트를 종료하는 함수
        function checkAndTerminate() {
            if (qualitySet && adRemoved) {
                scriptRunning = false;
                previousChannelId = null; // 이전 채널 ID 초기화하여 재실행 방지
                return true;
            }
            return false;
        }

        // 품질 설정을 1080p로 고정하는 코드
        const qualityInterval = setInterval(() => {
            if (qualitySet) {
                clearInterval(qualityInterval); // 플래그가 true이면 인터벌 종료
                return;
            }

            const qualityElement = document.querySelector(
                `.pzp-pc-setting-quality-pane__list-container > li:first-child:not(.pzp-pc-ui-setting-item--checked)`
            );
            if (qualityElement) {
                setTimeout(() => {
                    qualityElement.click();
                    qualitySet = true; // 작업 완료 플래그 설정
                    clearInterval(qualityInterval);
                    if (checkAndTerminate()) {
                        return;
                    }
                }, getRandomDelay());
            }
        }, 500);

        // 광고 팝업 제거 코드
        const adInterval = setInterval(() => {
            if (adRemoved) {
                clearInterval(adInterval); // 플래그가 true이면 인터벌 종료
                return;
            }

            const adbb = document.querySelector(`[class^="ad_block_title"]`);
            if (adbb) {
                setTimeout(() => {
                    const closeButton = document.querySelector(`[class^=popup_cell] > button`);
                    if (closeButton) {
                        closeButton.click();
                        adRemoved = true; // 작업 완료 플래그 설정
                        clearInterval(adInterval); // 광고 팝업을 찾으면 인터벌을 종료하여 한 번만 실행
                        if (checkAndTerminate()) {
                            return;
                        }
                    }
                }, getRandomDelay());
            }
        }, 500);

        // 광고 API 요청을 차단하는 코드 (에러 로그 방지)
        const originalFetch = window.fetch;
        window.fetch = function() {
            const url = arguments[0];
            if (typeof url === 'string' && url.includes('/ad-polling/')) {
                return new Promise((resolve, reject) => {
                    resolve({ ok: false, status: 403 });
                });
            }
            return originalFetch.apply(this, arguments);
        };

        // XMLHttpRequest 차단 (에러 로그 방지)
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (url.includes('/ad-polling/')) {
                this.abort();
                return;
            }
            return originalOpen.apply(this, arguments);
        };
    }

    // 처음 페이지 로드 시 스크립트 실행
    if (!scriptRunning) {
        executeScripts();
    }
})();