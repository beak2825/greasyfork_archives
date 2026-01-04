// ==UserScript==
// @name         chzzk-bypass + auto quality
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Chzzk 자동 최고화질 + 그리드 우회
// @author       김머시기
// @icon         https://play-lh.googleusercontent.com/wvo3IB5dTJHyjpIHvkdzpgbFnG3LoVsqKdQ7W3IoRm-EVzISMz9tTaIYoRdZm1phL_8
// @match        https://chzzk.naver.com/*
// @match        https://*.chzzk.naver.com/*
// @grant        none
// @require      https://unpkg.com/xhook@latest/dist/xhook.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532055/chzzk-bypass%20%2B%20auto%20quality.user.js
// @updateURL https://update.greasyfork.org/scripts/532055/chzzk-bypass%20%2B%20auto%20quality.meta.js
// ==/UserScript==

xhook.after(function(t,e){
    if(-1!==t.url.indexOf("live-detail"))try{
        let n=JSON.parse(e.text);
        n.content&&n.content.p2pQuality&&(
            n.content.p2pQuality=[],
            Object.defineProperty(n.content,"p2pQuality",{configurable:!1,writable:!1})
        ),
        e.text=JSON.stringify(n)
    }catch(r){
        console.error(r)
    }
});

(function() {
    'use strict';

    let lastUrl = location.href;
    let adBlockInterval = null;
    let qualityInterval = null;
    let playbackInterval = null;
    let unmuteInterval = null;

    function handleAdBlockPopup() {
        const popupContainer = document.querySelector('div[class^="popup_container"]');
        if (popupContainer && popupContainer.textContent.includes('광고 차단 프로그램을 사용 중이신가요')) {
            popupContainer.remove();

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
        const settingsButton = document.querySelector('button[class*="pzp-pc-setting-button"]');
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
    function unmutePlayer() {
        const volumeButton = document.querySelector('button.pzp-pc-volume-button');
        if (volumeButton && volumeButton.getAttribute('aria-label')?.includes('음소거 해제')) {
            volumeButton.click();
        }
    }

    function startIntervals() {
        if (!adBlockInterval) {
            adBlockInterval = setInterval(handleAdBlockPopup, 100);
        }
        if (!qualityInterval) {
            qualityInterval = setInterval(selectHighestQuality, 100);
        }
        if (!unmuteInterval) {
            unmuteInterval = setInterval(unmutePlayer, 300);
        }
    }

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

    startIntervals();
})();
