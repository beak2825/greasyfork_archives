// ==UserScript==
// @name         Chzzk Theater Mode & Lolcast Sidebar Control
// @namespace    Chzzk Theater Mode & Lolcast Sidebar Control
// @version      0.5
// @description  Chzzk에서 채팅창 가리기+넓은 화면, Lolcast /player에서 사이드바 제어 및 설정 저장
// @author       lc2122
// @match        https://chzzk.naver.com/*
// @match        https://lolcast.kr/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/527302/Chzzk%20Theater%20Mode%20%20Lolcast%20Sidebar%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/527302/Chzzk%20Theater%20Mode%20%20Lolcast%20Sidebar%20Control.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let debug = false;

    // 공통: 요소가 로드될 때까지 기다리는 함수
    function waitForElement(selector, callback) {
        const existingElement = document.querySelector(selector);
        if (existingElement) {
            callback(existingElement);
        } else {
            const observer = new MutationObserver(() => {
                const targetElement = document.querySelector(selector);
                if (targetElement) {
                    observer.disconnect();
                    callback(targetElement);
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    // Chzzk 관련 기능 (넓은 화면 + 채팅 끄기)
    function applyChzzkTheaterMode() {
        let isTopWindow = window.self === window.top;
        if (isTopWindow) return;

        if (debug) console.log("Applying Chzzk theater mode");

        let player = undefined;
        let handleVideoReadyFired = false;

        let handleVideoReady = function () {
            if (handleVideoReadyFired) return;
            handleVideoReadyFired = true;
            let viewmode_buttons = document.querySelectorAll(".pzp-pc__viewmode-button");
            if (viewmode_buttons.length === 1) {
                viewmode_buttons[0].click();
            } else {
                for (let i = 0; i < viewmode_buttons.length; i++) {
                    let button = viewmode_buttons[i];
                    if (button.getAttribute('aria-label') === '넓은 화면') {
                        button.click();
                        break;
                    }
                }
            }
            document.querySelector('[class^="live_chatting_header_button__"]').click();
        };

        waitForElement("video.webplayer-internal-video", function (node) {
            if (debug) console.log("Found video player", node);
            player = node;
            if (player.readyState >= 2) {
                handleVideoReady();
            } else {
                player.addEventListener('loadedmetadata', function once() {
                    player.removeEventListener('loadedmetadata', once);
                    handleVideoReady();
                });
            }
            player.muted = false;
        });
    }

    // Lolcast 관련 기능 (사이드바 제어)
    function applyLolcastSidebarControl() {
        const LEFT_SIDEBAR_KEY = 'hideLeftSidebar';
        const RIGHT_SIDEBAR_KEY = 'hideRightSidebar';

        // 저장된 설정 적용
        function applySavedSettings() {
            const hideLeft = GM_getValue(LEFT_SIDEBAR_KEY, false);
            const hideRight = GM_getValue(RIGHT_SIDEBAR_KEY, false);

            if (hideLeft) {
                waitForElement('#menu-button', (menuButton) => menuButton.click());
            }
            if (hideRight) {
                waitForElement('#close-button', (closeButton) => closeButton.click());
            }
        }

        // 설정창 생성 및 표시
        function showSettingsPanel() {
            const url = window.location.href;
            if (!url.includes("/#/player/")) {
                alert("이 기능은 https://lolcast.kr/#/player/ 경로에서만 사용 가능합니다.");
                return;
            }

            const existingPanel = document.getElementById('sidebar-settings');
            if (existingPanel) existingPanel.remove();

            const style = document.createElement('style');
            style.textContent = `
                #sidebar-settings {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #fff;
                    border: 1px solid #ccc;
                    padding: 20px;
                    z-index: 10000;
                    box-shadow: 0 0 15px rgba(0,0,0,0.5);
                }
                #sidebar-settings button {
                    margin-top: 10px;
                    margin-right: 10px;
                }
            `;
            document.head.appendChild(style);

            const panel = document.createElement('div');
            panel.id = 'sidebar-settings';
            panel.innerHTML = `
                <h3>사이드바 설정</h3>
                <label><input type="checkbox" id="leftSidebar" ${GM_getValue(LEFT_SIDEBAR_KEY, false) ? 'checked' : ''}> 왼쪽 사이드바 숨기기</label><br>
                <label><input type="checkbox" id="rightSidebar" ${GM_getValue(RIGHT_SIDEBAR_KEY, false) ? 'checked' : ''}> 오른쪽 사이드바 숨기기</label><br>
                <button id="saveSettings">저장</button>
                <button id="closeSettings">닫기</button>
            `;
            document.body.appendChild(panel);

            document.getElementById('saveSettings').addEventListener('click', () => {
                const hideLeft = document.getElementById('leftSidebar').checked;
                const hideRight = document.getElementById('rightSidebar').checked;

                GM_setValue(LEFT_SIDEBAR_KEY, hideLeft);
                GM_setValue(RIGHT_SIDEBAR_KEY, hideRight);

                alert('설정이 저장되었습니다. 새로고침 시 적용됩니다.');
                panel.remove();
            });

            document.getElementById('closeSettings').addEventListener('click', () => {
                panel.remove();
            });
        }

        // 메뉴 항상 등록
        GM_registerMenuCommand('사이드바 설정 열기', showSettingsPanel);

        // URL 감지 및 설정 적용
        function checkAndApply() {
            const url = window.location.href;
            if (url.includes("/#/player/")) {
                applyChzzkTheaterMode(); // 먼저 Chzzk 적용
                setTimeout(applySavedSettings, 1000); // 1초 후 사이드바 설정 적용
            }
        }

        // 초기 실행
        checkAndApply();

        // 해시 변경 감지 (SPA 대응)
        window.addEventListener('hashchange', checkAndApply);
    }

    // 실행 로직
    const url = window.location.href;
    if (url.indexOf("//chzzk.naver.com/") !== -1) {
        applyChzzkTheaterMode();
    } else if (url.indexOf("//lolcast.kr/") !== -1) {
        applyLolcastSidebarControl();
    }
})();