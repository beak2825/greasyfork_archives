// ==UserScript==
// @name         Chzzk Tweak (P2P Bypass & Auto Max Quality)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  치지직 P2P 연결을 우회하고, 라이브/VOD 시청 시 자동으로 1080p 최고 화질로 설정합니다. SPA 환경에 최적화되었습니다.
// @author       Perplexity (based on eta66, DSK)
// @match        https://chzzk.naver.com/*
// @match        https://*.chzzk.naver.com/*
// @grant        none
// @require      https://unpkg.com/xhook@latest/dist/xhook.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543585/Chzzk%20Tweak%20%28P2P%20Bypass%20%20Auto%20Max%20Quality%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543585/Chzzk%20Tweak%20%28P2P%20Bypass%20%20Auto%20Max%20Quality%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. P2P 우회 스크립트 (즉시 실행) ---
    try {
        xhook.after(function(request, response) {
            if (request.url.includes("live-detail")) {
                try {
                    let data = JSON.parse(response.text);
                    if (data.content && data.content.p2pQuality) {
                        data.content.p2pQuality = [];
                        Object.defineProperty(data.content, "p2pQuality", { configurable: false, writable: false });
                    }
                    response.text = JSON.stringify(data);
                } catch (e) {
                    console.error("[Chzzk Tweak] P2P Bypass Error:", e);
                }
            }
        });
    } catch (e) {
        console.error("[Chzzk Tweak] xhook 초기화 실패:", e);
    }

    // --- 2. 자동 최고 화질 설정 로직 ---

    // 여러 번 실행되는 것을 방지하기 위한 플래그
    let qualityCheckRunning = false;
    let lastCheckedUrl = '';

    // 안정적인 클릭을 위한 지연 함수
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // 광고 차단 팝업 제거 함수
    function handleAdBlockPopup() {
        const popup = document.querySelector('div[class^="popup_container"]');
        if (popup && popup.textContent.includes('광고 차단 프로그램을 사용 중이신가요')) {
            popup.remove();
            console.log('[Chzzk Tweak] 광고 차단 팝업을 제거했습니다.');
        }
    }

    // 최고 화질 설정 함수 (비동기 처리로 안정성 향상)
    async function selectHighestQuality() {
        if (qualityCheckRunning) return;
        qualityCheckRunning = true;

        try {
            console.log('[Chzzk Tweak] 최고 화질 설정을 시작합니다.');

            // 설정 버튼 클릭
            const settingsButton = document.querySelector('button[class*="pzp-pc-setting-button"]');
            if (!settingsButton) {
                console.log('[Chzzk Tweak] 설정 버튼을 찾을 수 없습니다.');
                qualityCheckRunning = false;
                return;
            }
            settingsButton.click();
            await delay(500); // UI 반응 대기

            // 화질 메뉴 버튼 클릭
            const qualityMenuButton = Array.from(document.querySelectorAll('div[class*="pzp-pc-setting-menu-item"]')).find(el => el.textContent.includes('화질'));
            if (!qualityMenuButton) {
                console.log('[Chzzk Tweak] 화질 메뉴를 찾을 수 없습니다.');
                // 메뉴가 이미 열려있을 수 있으므로 닫고 다시 시도하지 않도록 함
                settingsButton.click(); // 설정 메뉴 닫기
                qualityCheckRunning = false;
                return;
            }
            qualityMenuButton.click();
            await delay(500); // UI 반응 대기

            // 화질 옵션 선택 (1080p 우선, 없으면 720p)
            const qualityOptions = document.querySelectorAll('li[class*="quality-item"]');
            let targetQuality = Array.from(qualityOptions).find(opt => opt.textContent.includes('1080p'));
            if (!targetQuality) {
                targetQuality = Array.from(qualityOptions).find(opt => opt.textContent.includes('720p'));
            }

            if (targetQuality) {
                // 이미 선택된 화질인지 확인
                if (!targetQuality.querySelector('div[class*="pzp-pc-setting-option-check-icon"]')) {
                    targetQuality.click();
                    console.log(`[Chzzk Tweak] 화질을 ${targetQuality.textContent.trim()} (으)로 설정했습니다.`);
                    await delay(200);
                } else {
                    console.log(`[Chzzk Tweak] 이미 최고 화질(${targetQuality.textContent.trim()})로 설정되어 있습니다.`);
                    settingsButton.click(); // 설정 메뉴 닫기
                }
            } else {
                console.log('[Chzzk Tweak] 1080p 또는 720p 화질 옵션을 찾을 수 없습니다.');
                settingsButton.click(); // 설정 메뉴 닫기
            }
        } catch (e) {
            console.error('[Chzzk Tweak] 화질 설정 중 오류 발생:', e);
        } finally {
            qualityCheckRunning = false;
        }
    }

    // 메인 로직 실행 함수
    function runMainLogic() {
        handleAdBlockPopup();
        // 비디오 플레이어가 있고, 현재 URL에 대해 아직 실행되지 않았다면 화질 설정 시도
        if (document.querySelector('video.pzp-pc-video-element') && lastCheckedUrl !== location.href) {
            lastCheckedUrl = location.href;
            // 약간의 지연 후 실행하여 플레이어 로드를 보장
            setTimeout(selectHighestQuality, 1000);
        }
    }

    // --- 3. DOM 변경 감지 및 스크립트 실행 트리거 ---

    // MutationObserver를 사용하여 SPA 페이지 전환 감지
    const observer = new MutationObserver(() => {
        // 비디오 페이지(/live/ 또는 /video/)에서만 실행
        if (location.pathname.startsWith('/live/') || location.pathname.startsWith('/video/')) {
            runMainLogic();
        }
    });

    // body 요소의 자식요소 변화를 감지하여 옵저버 시작
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 초기 페이지 로드 시 한 번 실행
    runMainLogic();
})();
