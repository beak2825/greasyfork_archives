// ==UserScript==
// @name         CHZZK - 해상도 1080p 자동 선택
// @icon         https://play-lh.googleusercontent.com/wvo3IB5dTJHyjpIHvkdzpgbFnG3LoVsqKdQ7W3IoRm-EVzISMz9tTaIYoRdZm1phL_8
// @namespace    http://tampermonkey.net/

// @license      MIT
// @author       고기
// @version      250226
// @match        *://*.chzzk.naver.com/*
// @description  치지직 1080p 자동 선택
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/527910/CHZZK%20-%20%ED%95%B4%EC%83%81%EB%8F%84%201080p%20%EC%9E%90%EB%8F%99%20%EC%84%A0%ED%83%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/527910/CHZZK%20-%20%ED%95%B4%EC%83%81%EB%8F%84%201080p%20%EC%9E%90%EB%8F%99%20%EC%84%A0%ED%83%9D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let firstRun = true;

    function triggerClick(element) {
        if (element) {
            element.click();

            let event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(event);

            let enterEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                code: 'Enter'
            });
            element.dispatchEvent(enterEvent);
        }
    }

    function selectBestAvailableQuality() {
        let settingButton = document.querySelector('.pzp-setting-button');
        if (!settingButton) return;

        triggerClick(settingButton);

        setTimeout(() => {
            let qualityButton = document.querySelector('.pzp-setting-intro-quality');
            if (!qualityButton) return;

            triggerClick(qualityButton);

            setTimeout(() => {
                let qualityItems = document.querySelectorAll('.pzp-ui-setting-quality-item.pzp-ui-setting-pane-item');
                if (qualityItems.length === 0) return;

                let targetQuality = Array.from(qualityItems).find(item =>
                    item.textContent.trim().startsWith("1080p")
                );

                if (!targetQuality) {
                    targetQuality = Array.from(qualityItems).find(item =>
                        item.textContent.trim().startsWith("720p")
                    );
                }

                if (targetQuality) {
                    triggerClick(targetQuality);
                    let innerButton = targetQuality.querySelector("div") || targetQuality.querySelector("span");
                    if (innerButton) triggerClick(innerButton);
                }
            }, 0);
        }, 0);
    }

    function initAutoQualitySelection() {
        let delay = firstRun ? 3000 : 700; // 첫방송입장 3000ms : 다음방송입장 700ms
        firstRun = false;

        setTimeout(() => {
            let settingButton = document.querySelector('.pzp-setting-button');
            if (settingButton) {
                selectBestAvailableQuality();
            } else {
                let observer = new MutationObserver((mutations, obs) => {
                    let settingButton = document.querySelector('.pzp-setting-button');
                    if (settingButton) {
                        selectBestAvailableQuality();
                        obs.disconnect();
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });
            }
        }, delay);

        // 1초 동안 메뉴 숨기기
        const style = document.createElement('style');
        style.innerHTML = `
            .pzp-setting-pane,
            .pzp-setting-quality-pane,
            .pzp-settings { display: none !important; }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            document.head.removeChild(style);
        }, 1000);
    }

    function observeUrlChange(callback) {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                if (currentUrl.includes('/live/')) {
                    callback();
                }
            }
        }).observe(document, { childList: true, subtree: true });

        window.addEventListener('popstate', () => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                if (currentUrl.includes('/live/')) {
                    callback();
                }
            }
        });
    }

    initAutoQualitySelection();
    observeUrlChange(initAutoQualitySelection);
})();