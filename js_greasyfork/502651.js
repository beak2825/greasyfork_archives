
// ==UserScript==
// @name        Yandex Music Prev Button Extension (One)
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Разблокирует кнопку назад в Яндекс волне (анлок вырезанного функционала)
// @icon        https://raw.githubusercontent.com/doctored11/YandexMusicPreviousTrack/main/source/YanUnlock32.jpg
// @icon64      https://raw.githubusercontent.com/doctored11/YandexMusicPreviousTrack/main/source/YanUnlock64.jpg
// @author       doctored11
// @match        https://music.yandex.ru/*
// @grant        none
// @license      MIT


// @downloadURL https://update.greasyfork.org/scripts/502651/Yandex%20Music%20Prev%20Button%20Extension%20%28One%29.user.js
// @updateURL https://update.greasyfork.org/scripts/502651/Yandex%20Music%20Prev%20Button%20Extension%20%28One%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const style = document.createElement('style');
    style.textContent = `
    .player-controls__btn_prev.disabled {
        display: inline-block;
        opacity: 0.15;
        cursor: not-allowed;
    }
    .player-controls__btn_prev.enabled {
        display: inline-block;
        opacity: 0.5;
        cursor: pointer;
        pointer-events: auto;
    }
    .player-controls__btn_prev.enabled:hover {
        opacity: 1;
    }
    .player-controls__btn_prev.disabled:hover {
        opacity: 0.1;
    }
    .player-controls__track-controls{
        display:flex;
        align-items: center;
    }
   .player-controls__speed-controls{
        display:inline-block !important;
        right:110px;
        transform:translateY(-2px)
   }
    
    ` ;
    document.head.appendChild(style);

    function speedUpdate() {
        const seqControls = document.querySelector('.player-controls__seq-controls');
        const speedControls = document.querySelector('.player-controls__speed-controls');
    
        if (!speedControls || !seqControls) return;
    
        const visibleChildrenCount = Array.from(seqControls.children).filter(child =>
            getComputedStyle(child).display != 'none'
        ).length;
    
        speedControls.style.right = visibleChildrenCount > 1 ? '210px' : '110px';
    }

    function applyStyles(state) {

        const prevButton = document.querySelector('.player-controls__btn_prev');
        if (prevButton) {
            prevButton.classList.remove('disabled', 'enabled');
            prevButton.classList.add(state);
        }
    }

    function updateCurrentTrack() {
        speedUpdate();
        const trackIndex = window.externalAPI?.getTrackIndex();
        applyStyles(trackIndex < 1 ? 'disabled' : 'enabled');
    }

    function goPrev() {
        const currentIndex = window.externalAPI?.getTrackIndex();
        if (currentIndex > 0) {
            window.externalAPI.play(currentIndex - 1);
        }
    }

    function initialize() {
        console.log("Запуск кнопочки");
        const prevButton = document.querySelector('.player-controls__btn_prev');
        if (prevButton) {
            prevButton.addEventListener('click', goPrev);
        }
        updateCurrentTrack();

        if (window.externalAPI) {
            window.externalAPI.on(window.externalAPI.EVENT_TRACK, updateCurrentTrack);
        }
    }
    initialize()
})();