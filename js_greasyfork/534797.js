// ==UserScript==
// @name         비디오 배속 조절 (개인용 특정사이트만 기능)
// @namespace    dendenmushi
// @version     2.5.1
// @description 비디오 배속 조절 제한을 해제하고 최대 16배까지 조절 가능한 파란색 버튼을 제공합니다.
// @author      dendenmushi with Gemini
// @match       *://*/*
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/534797/%EB%B9%84%EB%94%94%EC%98%A4%20%EB%B0%B0%EC%86%8D%20%EC%A1%B0%EC%A0%88%20%28%EA%B0%9C%EC%9D%B8%EC%9A%A9%20%ED%8A%B9%EC%A0%95%EC%82%AC%EC%9D%B4%ED%8A%B8%EB%A7%8C%20%EA%B8%B0%EB%8A%A5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534797/%EB%B9%84%EB%94%94%EC%98%A4%20%EB%B0%B0%EC%86%8D%20%EC%A1%B0%EC%A0%88%20%28%EA%B0%9C%EC%9D%B8%EC%9A%A9%20%ED%8A%B9%EC%A0%95%EC%82%AC%EC%9D%B4%ED%8A%B8%EB%A7%8C%20%EA%B8%B0%EB%8A%A5%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_ID = "[Unlock Speed Control - Max Speed 16]";
    const DEFAULT_SPEED = 1.0;
    const MAX_SPEED = 16.0;
    const SPEED_INCREMENT = 2.0;
    let currentSpeed = DEFAULT_SPEED;
    const urlParams = new URLSearchParams(window.location.search);
    const numParam = urlParams.get('num');
    const chapterParam = urlParams.get('chapter');
    const paragraphParam = urlParams.get('paragraph');
    const contentIdParam = urlParams.get('content_id');

    const styleCode = `
        :root {
            --md-sys-color-primary-container: #004880;
            --md-sys-color-on-primary-container: #d1e4ff;
            --toggle-size: 56px;
            --toggle-opacity: 1.0;
        }
        #mes-blue-button {
            position: fixed !important;
            top: 50% !important;
            right: 20px !important;
            transform: translateY(-50%) !important;
            z-index: 2147483646 !important;
            background-color: var(--md-sys-color-primary-container) !important;
            color: var(--md-sys-color-on-primary-container) !important;
            opacity: var(--toggle-opacity) !important;
            width: var(--toggle-size) !important;
            height: var(--toggle-size) !important;
            border-radius: 18px !important;
            border: none !important;
            cursor: pointer !important;
            box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20) !important;
            transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease, opacity 0.3s ease;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            -webkit-tap-highlight-color: transparent !important;
            font-size: 16px;
            font-weight: bold;
        }
        #mes-blue-button:active {
            transform: translateY(-50%) scale(0.95) !important;
            box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12) !important;
        }
        .jp-progress,
        .jp-play-bar,
        .jp-seek-bar {
            pointer-events: auto !important;
        }
    `;

    const injectedScriptCode = `
        const SCRIPT_ID = "[AdGuard Inject Script - Speed Control + Selective Block - No Alert - Max Speed 16 - Increment x2]";
        const DEFAULT_SPEED = 1.0;
        const MAX_SPEED = 16.0;
        const SPEED_INCREMENT = 2.0;
        let currentSpeed = DEFAULT_SPEED;
        const urlParams = new URLSearchParams(window.location.search);
        const numParam = urlParams.get('num');
        const chapterParam = urlParams.get('chapter');
        const paragraphParam = urlParams.get('paragraph');
        const contentIdParam = urlParams.get('content_id');

        function findVideo() {
            return document.querySelector('video');
        }

        const blueButton = document.getElementById('mes-blue-button');
        const conarrInput = document.getElementById('conarr');

        window.onload = null;

        function triggerConarr() {
            if (conarrInput && numParam && chapterParam && paragraphParam && contentIdParam) {
                const num = parseInt(numParam, 10);
                if (!isNaN(num) && typeof window.conarr === 'function') {
                    setTimeout(() => {
                        const pageInfo = chapterParam + "_" + paragraphParam;
                        const currentPageInfo = paragraphParam;
                        sendParentPageInfo(pageInfo, currentPageInfo);
                        console.log(SCRIPT_ID, "페이지 정보 추출 및 부모 프레임에 전송 (사용자 스크립트)");
                    }, 1000);
                } else {
                    console.warn(SCRIPT_ID, "URL 파라미터 'num'이 유효하지 않거나 window.conarr 함수를 찾을 수 없습니다.");
                }
            } else {
                console.warn(SCRIPT_ID, "'conarr' 요소 또는 필요한 URL 파라미터를 찾을 수 없습니다.");
            }
        }

        function setPlaysInline() {
            const video = findVideo();
            if (video) {
                video.setAttribute('playsinline', true);
                console.log(SCRIPT_ID, "playsinline 속성 설정 (사용자 스크립트)");
            } else {
                console.warn(SCRIPT_ID, "비디오 요소를 찾을 수 없어 playsinline 속성을 설정할 수 없습니다.");
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                triggerConarr();
                setPlaysInline();
            });
        } else {
            triggerConarr();
            setPlaysInline();
        }

        if (blueButton) {
            blueButton.addEventListener('click', () => {
                const video = findVideo();
                if (video) {
                    currentSpeed *= SPEED_INCREMENT;
                    if (currentSpeed > MAX_SPEED) {
                        currentSpeed = DEFAULT_SPEED;
                    }
                    video.playbackRate = currentSpeed;
                    blueButton.textContent = \`x\${currentSpeed.toFixed(2)}\`;
                    console.log(SCRIPT_ID, \`비디오 재생 속도가 \${currentSpeed.toFixed(2)}로 변경되었습니다.\`);
                } else {
                    console.error(SCRIPT_ID, '비디오 요소를 찾을 수 없습니다.');
                }
            });
            console.log(SCRIPT_ID, "파란색 버튼 클릭 이벤트 리스너가 추가되었습니다.");
        } else {
            console.error(SCRIPT_ID, "파란색 버튼 요소를 찾을 수 없습니다.");
        }

        function sendParentPageInfo(pageInfo, currentPageInfo) {
            if (window.parent && typeof window.parent._setPageInfo === 'function' && typeof window.parent._setCurrentLocation === 'function' && typeof window.parent._progressSave === 'function') {
                window.parent._setPageInfo(pageInfo);
                window.parent._setCurrentLocation(currentPageInfo);
                window.parent._progressSave();
                console.log(SCRIPT_ID, "부모 프레임에 페이지 정보 전송 (사용자 스크립트)");
            } else {
                console.warn(SCRIPT_ID, "부모 프레임과의 통신 함수를 찾을 수 없습니다.");
            }
        }
    `;

    function initializeScript() {
        const styleElement = document.createElement('style');
        styleElement.textContent = styleCode;
        document.head.appendChild(styleElement);

        const blueButton = document.createElement('button');
        blueButton.id = 'mes-blue-button';
        blueButton.textContent = `x${DEFAULT_SPEED}`;
        blueButton.setAttribute('aria-label', '비디오 배속 조절 버튼');
        document.body.appendChild(blueButton);

        const scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.textContent = injectedScriptCode;
        document.body.appendChild(scriptElement);

        console.log(SCRIPT_ID, "자바스크립트 코드와 파란색 버튼이 동적으로 삽입되었습니다.");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }
})();
