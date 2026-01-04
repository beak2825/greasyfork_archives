// ==UserScript==
// @name         Notification Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Notification Enhancer script
// @author       Realwdpcker
// @match        https://pixelplace.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531937/Notification%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/531937/Notification%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const getVolume = (key, defaultValue) => {
        const val = localStorage.getItem(key);
        return val !== null ? parseFloat(val) : defaultValue;
    };

    const setVolume = (key, value) => {
        localStorage.setItem(key, value.toString());
    };

    const warningSound = new Audio('https://cdn.uppbeat.io/audio-files/a34d50ecafdf61ec63b0f3d2f41f9998/18d864b70347c0e38362eb8af60aec76/a29e3c935133c0fdd759e7a61725fbc5/STREAMING-positive-notification-digital-ding-gamemaster-audio-1-00-01.mp3');
    const successSound = new Audio('https://cdn.uppbeat.io/audio-files/a34d50ecafdf61ec63b0f3d2f41f9998/b9ca7d21360f106c0fe9ea3cb80000ea/7a14a9faba4c1884bb8eb46ad3f1fa9e/STREAMING-positive-notification-digital-beep-double-gamemaster-audio-1-00-02.mp3');
    const errorSound = new Audio('https://cdn.uppbeat.io/audio-files/06ae18f31ba6d2a5dd6b6f941ae28d0a/d3e6f01a2b686bb9d88df304bb54e46c/7bf25893b999d81e63f376f8b0d634d4/STREAMING-ui-access-denied-jam-fx-1-00-01.mp3');

    warningSound.volume = getVolume('warningVolume', 0.5);
    successSound.volume = getVolume('successVolume', 0.5);
    errorSound.volume = getVolume('errorVolume', 0.5);

    const menu = document.createElement('div');
    menu.id = 'notificationVolumeMenu';
    menu.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #222222;
        color: white;
        padding: 5px;
        font-family: Consolas, sans-serif;
        z-index: 99999;
        border: 2.5px solid rgb(0, 226, 255);
        display: none;
    `;

    menu.innerHTML = `
        <label style="font-family: Consolas, sans-serif;">Warning: <input type="range" id="warningVolume" min="0" max="1" step="0.01" value="${warningSound.volume}"></label><br>
        <label style="font-family: Consolas, sans-serif;">Success: <input type="range" id="successVolume" min="0" max="1" step="0.01" value="${successSound.volume}"></label><br>
        <label style="font-family: Consolas, sans-serif;">Error: <input type="range" id="errorVolume" min="0" max="1" step="0.01" value="${errorSound.volume}"></label>
    `;
    document.body.appendChild(menu);

    const style = document.createElement('style');
    style.textContent = `
        #notificationVolumeMenu input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            background: #ffffff;
            cursor: pointer;
        }

        #notificationVolumeMenu input[type="range"]::-webkit-slider-runnable-track {
            background: #444;
            border-radius: 0px;
        }
    `;
    document.head.appendChild(style);

    document.getElementById('warningVolume').addEventListener('input', e => {
        const vol = parseFloat(e.target.value);
        warningSound.volume = vol;
        setVolume('warningVolume', vol);
    });

    document.getElementById('successVolume').addEventListener('input', e => {
        const vol = parseFloat(e.target.value);
        successSound.volume = vol;
        setVolume('successVolume', vol);
    });

    document.getElementById('errorVolume').addEventListener('input', e => {
        const vol = parseFloat(e.target.value);
        errorSound.volume = vol;
        setVolume('errorVolume', vol);
    });

    document.addEventListener('keydown', function (e) {
        if (e.altKey && e.key.toLowerCase() === 'm') {
            const isVisible = menu.style.display === 'block';
            menu.style.display = isVisible ? 'none' : 'block';
        }
    });

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const el = node;

                    if (el.matches('.box.warning')) {
                        warningSound.currentTime = 0;
                        warningSound.play();
                    } else if (el.matches('.box.success')) {
                        successSound.currentTime = 0;
                        successSound.play();
                    } else if (el.matches('.box.error')) {
                        errorSound.currentTime = 0;
                        errorSound.play();
                    }
                }
            }
        }
    });

    const waitForContainer = setInterval(() => {
        const container = document.querySelector('#notification');
        if (container) {
            clearInterval(waitForContainer);
            observer.observe(container, { childList: true, subtree: true });
        }
    }, 500);
})();