// ==UserScript==
// @name         Chzzk Auto High Quality
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Chzzk자동으로 최고화질로 설정
// @author       DSK
// @match        https://chzzk.naver.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518798/Chzzk%20Auto%20High%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/518798/Chzzk%20Auto%20High%20Quality.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let lastUrl = location.href;
    let adBlockInterval = null;
    let qualityInterval = null;
    let playbackInterval = null;

    function handleAdBlockPopup() {
        const popupContainer = document.querySelector('div[class^="popup_container"]');
        if (popupContainer && popupContainer.textContent.includes('광고 차단 프로그램을 사용 중이신가요')) {
            popupContainer.remove();

            // Remove existing keydown event listener first
            const existingListener = (event) => {
                if (!(event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'PRE')) {
                    let button;
                    switch (event.key) {
                        case 'k':
                        case ' ':
                            button = document.querySelector('button.pzp-playback-switch');
                            button?.click();
                            break;
                        case 'm':
                            button = document.querySelector('button.pzp-pc-volume-button');
                            button?.click();
                            break;
                        case 't':
                            button = document.querySelector('button.pzp-pc-viewmode-button');
                            button?.click();
                            break;
                        case 'f':
                            button = document.querySelector('button.pzp-pc-fullscreen-button');
                            button?.click();
                            break;
                    }
                }
            };
            document.removeEventListener('keydown', existingListener);
            document.addEventListener('keydown', existingListener);
            if (adBlockInterval) {
                clearInterval(adBlockInterval);
                adBlockInterval = null;
            }
            return true;
        }
        return false;
    }

    function handlePlaybackButton() {
        const playbackSwitchButton = document.querySelector('button.pzp-playback-switch');
        if (playbackSwitchButton) {
            const animateElement = playbackSwitchButton.querySelector('animate');
            if (!animateElement) {
                playbackSwitchButton.click();
                return false;
            }
        }
        if (playbackInterval) {
            clearInterval(playbackInterval);
            playbackInterval = null;
        }
        return true;
    }

    function selectHighestQuality() {
        const settingsButton = document.querySelector('button[class*="pzp-setting-button"]');
        if (!settingsButton) return false;

        settingsButton.click();

        const qualityButton = document.querySelector('div[class*="pzp-pc-setting-intro-quality"]');
        if (!qualityButton) return false;
        qualityButton.click();

        const qualityOptions = document.querySelectorAll('li[class*="quality-item"]');
        let qualityOption = Array.from(qualityOptions).find(option => option.textContent.includes('1080'));
        if (!qualityOption) {
            qualityOption = Array.from(qualityOptions).find(option => option.textContent.includes('720'));
        }
        if (!qualityOption) return false;

        qualityOption.focus();
        const enterEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13
        });

        if (!playbackInterval) {
            playbackInterval = setInterval(handlePlaybackButton, 100);
        }

        qualityOption.dispatchEvent(enterEvent);

        if (qualityInterval) {
            clearInterval(qualityInterval);
            qualityInterval = null;
        }
        return true;
    }

    function startIntervals() {
        if (!adBlockInterval) {
            adBlockInterval = setInterval(handleAdBlockPopup, 100);
        }
        if (!qualityInterval) {
            qualityInterval = setInterval(selectHighestQuality, 100);
        }
    }

    // Listen for click events
    document.addEventListener('click', () => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if (lastUrl.includes('/live/') || lastUrl.includes('/video/')) {
                startIntervals();
            }
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
            document.body.style.position = 'relative';
            document.documentElement.style.position = 'relative';
        }
    });
    // Execute once when page loads
    startIntervals();

})();