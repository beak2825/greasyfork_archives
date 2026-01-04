// ==UserScript==
// @name         Video Speed Control (Focus/Blur Aware)
// @namespace    https://explainpark101.videocontrol.speed/
// @version      0.7.5
// @description  [마우스/터치 지원] 길게 누르기: (마우스) 좌-2배속/우-4배속. 브라우저 창의 포커스를 잃어도(blur) 배속이 유지됩니다.
// @author       Google Gemini
// @match        https://player.bunny-frame.online/*
// @match        https://anilife.app/*
// @match        https://kr1.yohli24.net/vod/play*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542614/Video%20Speed%20Control%20%28FocusBlur%20Aware%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542614/Video%20Speed%20Control%20%28FocusBlur%20Aware%29.meta.js
// ==/UserScript==

(async () => {
    'use strict';
    GM_addStyle(`pjsdiv:has(> video) {left: 0 !important;} #oframeplayer > pjsdiv:nth-child(27) > pjsdiv {display: none !important;} .art-contextmenus { display: none !important; `);
    console.log("Video Speed Controller (Focus/Blur Aware) Loaded");

    const waitForElement = (selector, timeout = Infinity) =>
        new Promise((resolve, reject) => {
            const existing = document.querySelector(selector);
            if (existing) return resolve(existing);
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            if ( timeout && timeout !== Infinity ) setTimeout(() => {
                observer.disconnect();
                reject(new Error('Timeout waiting for element: ' + selector));
            }, timeout);
        });

    try {
        const video = await waitForElement('video');
        video.focus();
        const wrapperDiv = video.parentElement;
        if (!wrapperDiv) return;

        if (window.getComputedStyle(wrapperDiv).position === 'static') {
            wrapperDiv.style.position = 'relative';
        }

        let lastVideoPlayBackRate = 1;
        let holdTimer;
        let pressOnLeft = false;
        let pressOnRight = false;
        let holdTriggered = false;
        let overlay;

        const showOverlay = (text) => {
            if (!overlay) {
                overlay = document.createElement('div');
                Object.assign(overlay.style, {
                    position: 'absolute', top: '10px', left: '50%',
                    transform: 'translateX(-50%)', padding: '5px 10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white',
                    fontSize: '16px', fontWeight: 'bold', borderRadius: '8px',
                    pointerEvents: 'none', zIndex: '2147483647', textAlign: 'center'
                });
                wrapperDiv.appendChild(overlay);
            }
            overlay.innerText = text;
            overlay.style.display = 'block';
        };

        const removeOverlay = () => {
            if (overlay) overlay.style.display = 'none';
        };

        const updateSpeed = () => {
            if (holdTriggered) {
                if (pressOnRight) {
                    video.playbackRate = 4;
                    showOverlay("▶▶▶ 4배속");
                } else if (pressOnLeft) {
                    video.playbackRate = 2;
                    showOverlay("▶▶ 2배속");
                }
            } else {
                video.playbackRate = lastVideoPlayBackRate;
                removeOverlay();
            }
        };

        const handlePress = (e) => {
            if (!wrapperDiv.contains(e.target)) return;
            pressOnLeft = false;
            pressOnRight = false;

            if (e.type === 'mousedown') {
                if (e.button === 0) pressOnLeft = true;
                else if (e.button === 2) pressOnRight = true;
                else return; // 다른 마우스 버튼은 무시
            } else if (e.type === 'touchstart') {
                pressOnLeft = true;
            }

            clearTimeout(holdTimer);
            holdTimer = setTimeout(() => {
                if (pressOnLeft || pressOnRight) {
                    holdTriggered = true;
                    video.addEventListener("pause", event => {
                        event.preventDefault();
                        video.play();
                    }, { once: true });
                    updateSpeed();
                }
            }, 200);
        };

        const handleRelease = () => {
            clearTimeout(holdTimer);
            if (holdTriggered) {
                holdTriggered = false;
                pressOnLeft = false;
                pressOnRight = false;
                updateSpeed();
            }
        };

        /**
         * @brief 창이 다시 포커스될 때 마우스 상태를 확인하는 함수
         * 창이 blur 상태일 때 사용자가 마우스 버튼을 놓으면 'mouseup' 이벤트가 발생하지 않음.
         * 이로 인해 다시 focus 했을 때 배속 상태가 '고착'되는 문제가 발생.
         * 이 함수는 focus시 마우스를 한 번이라도 움직였을 때, 실제 마우스 버튼 상태(e.buttons)를 체크하여
         * 눌린 버튼이 없으면(e.buttons === 0) 강제로 상태를 해제함.
         */
        const checkMouseStateOnFocus = () => {
            if (!holdTriggered) return; // 배속 상태가 아니면 실행할 필요 없음

            window.addEventListener('mousemove', (e) => {
                if (e.buttons === 0) {
                    console.log("Mouse release outside window detected. Reverting speed.");
                    handleRelease();
                }
            }, { once: true }); // 포커스 후 첫 마우스 이동 시 한 번만 체크
        };

        const handleTouchMove = () => {
            clearTimeout(holdTimer);
        };

        // --- 이벤트 리스너 등록 ---
        wrapperDiv.addEventListener('mousedown', handlePress);
        wrapperDiv.addEventListener('touchstart', handlePress, { passive: true });
        wrapperDiv.addEventListener("contextmenu", e => e.preventDefault());

        // '떼기' 이벤트는 페이지 전체(window)에서 감지
        window.addEventListener('mouseup', handleRelease);

        // '포커스' 이벤트를 감지하여 마우스 '고착' 상태 해결
        window.addEventListener('focus', checkMouseStateOnFocus);

        // 터치 이벤트
        wrapperDiv.addEventListener('touchend', handleRelease);
        wrapperDiv.addEventListener('touchcancel', handleRelease);
        wrapperDiv.addEventListener('touchmove', handleTouchMove);

    } catch (err) {
        console.error("Video Speed Controller Error:", err);
    }
})();