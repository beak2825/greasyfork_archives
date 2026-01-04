// ==UserScript==
// @name         Anilife Player Hotkey Forwarder
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Forwards hotkeys, with special actions. Ignores events when Ctrl key is pressed.
// @author       Gemini
// @match        https://anilife.app/play?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545591/Anilife%20Player%20Hotkey%20Forwarder.user.js
// @updateURL https://update.greasyfork.org/scripts/545591/Anilife%20Player%20Hotkey%20Forwarder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const waitForElement = (selector, timeout = 1000000) =>
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
            setTimeout(() => {
                observer.disconnect();
                reject(new Error('Timeout waiting for element: ' + selector));
            }, timeout);
        });

    /**
     * "r" 단축키의 특별 동작을 처리합니다.
     * 크레딧이나 이전 줄거리 스킵 버튼을 우선적으로 클릭합니다.
     * @returns {boolean} - 클릭할 버튼을 찾아 클릭했으면 true, 아니면 false를 반환합니다.
     */
    function handleRKeySpecialAction() {
        const creditsSkipButton = document.querySelector('#art-credits-skip-button, .art-credits-skip-button');
        const creditSkipLocation = document.querySelector(`.art-auto-playback-last`)
            .textContent
            .replace("마지막으로 본 ", "")
            .split(":")
            .reverse()
            .map((t, idx)=>(t*Math.max(idx*60, 1)))
            .reduce((acc, cur)=>(acc+cur), 0);
        if (creditsSkipButton) {
            creditsSkipButton.click();
            return true;
        }

        const autoPlaybackJump = document.querySelector('.art-auto-playback-jump');
        if (
            autoPlaybackJump && autoPlaybackJump.textContent &&
            autoPlaybackJump.textContent.trim() !== '' &&
            document.querySelector('video').currentTime < creditSkipLocation ) {
            autoPlaybackJump.click();
            return true;
        }

        return false;
    }

    /**
     * "f" 단축키의 특별 동작으로 전체 화면을 제어합니다.
     * @returns {boolean} - 전체 화면 버튼을 찾아 클릭했으면 true, 아니면 false를 반환합니다.
     */
    function handleFKeyFullscreen() {
        const fullscreenButton = document.querySelector('.art-control.art-control-fullscreen.hint--rounded.hint--top');
        if (fullscreenButton) {
            fullscreenButton.click();
            return true;
        }
        return false;
    }

    
    // --- Main Script Logic ---

    const storageItem = localStorage.getItem("al.autohotkey.storage");
    let hotkeyCodes = [];

    if (storageItem) {
        try {
            const parsedStorage = JSON.parse(storageItem);
            const hotkeyMap = parsedStorage.HOTKEY.value;
            hotkeyCodes = Object.values(hotkeyMap).flat();
        } catch (e) {
            console.error("Failed to parse autohotkey storage:", e);
        }
    }

    hotkeyCodes.push(32, 80);
    hotkeyCodes = [...new Set(hotkeyCodes)];

    waitForElement(`#anilife-player > div > div.art-layers > div > div.art-auto-playback-jump`).then(el=>{
        let interval = setInterval(()=>{
            if (!el.textContent.trim()) return;
            el.click();
            clearInterval(interval);
        }, 4);
    });

    document.addEventListener('keydown', function(e) {
        // Ctrl 키 조합 무시: Ctrl 키가 눌러진 상태의 이벤트는 무시하여
        // 브라우저 기본 동작(Ctrl+R 등)을 방해하지 않도록 합니다.
        if (e.ctrlKey) {
            return;
        }

        if (hotkeyCodes.includes(e.keyCode)) {
            const targetTagName = e.target.tagName;
            if (targetTagName === 'INPUT' || targetTagName === 'TEXTAREA' || targetTagName === 'SELECT' || e.target.isContentEditable) {
                return;
            }

            let specialActionHandled = false;
            if (e.keyCode === 82) { // 'r'
                if (handleRKeySpecialAction()) specialActionHandled = true;
            } else if (e.keyCode === 70) { // 'f'
                if (handleFKeyFullscreen()) specialActionHandled = true;
            }

            if (specialActionHandled) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        }
    }, true);

})();