// ==UserScript==
// @name               YouTube 화질설정
// @version            1.0
// @description        항상 최고 화질 + 영화관 모드
// @author             김머시기
// @icon               https://cdn-icons-png.flaticon.com/64/2504/2504965.png
// @match              https://www.youtube.com/*
// @match              https://m.youtube.com/*
// @match              https://music.youtube.com/*
// @exclude            https://studio.youtube.com/*
// @grant              GM_registerMenuCommand
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_unregisterMenuCommand
// @license            MIT
// @namespace https://greasyfork.org/users/1307101
// @downloadURL https://update.greasyfork.org/scripts/532041/YouTube%20%ED%99%94%EC%A7%88%EC%84%A4%EC%A0%95.user.js
// @updateURL https://update.greasyfork.org/scripts/532041/YouTube%20%ED%99%94%EC%A7%88%EC%84%A4%EC%A0%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function getSetting(key, def = true) { return GM_getValue(key, def); }
    function setSetting(key, value) { return GM_setValue(key, value); }
    let menuID = null;
    async function toggleTheaterMode() {
        const current = await getSetting('theaterMode', true);
        await setSetting('theaterMode', !current);
        updateMenu();
    }
    async function updateMenu() {
        const isOn = await getSetting('theaterMode', true);
        if (menuID !== null) GM_unregisterMenuCommand(menuID);
        menuID = GM_registerMenuCommand(`🎬 영화관 모드　　${isOn ? 'ON' : 'OFF'}`, toggleTheaterMode, {
            autoClose: false,
            title: `영화관 모드 ${isOn ? '켜짐' : '꺼짐'}`
        });
    }
    updateMenu();
    let alreadyApplied = false;
    function applyTheaterMode() {
        if (!getSetting('theaterMode', true)) return;
        const theaterBtn = document.querySelector('.ytp-size-button');
        const isInTheater = document.querySelector('ytd-watch-flexy[theater]');
        if (theaterBtn && !isInTheater) theaterBtn.click();
    }
    function applyHighestQuality() {
        const playerApi = document.getElementById('movie_player');
        if (playerApi && typeof playerApi.getAvailableQualityLevels === 'function') {
            const qualities = playerApi.getAvailableQualityLevels();
            if (qualities.length > 0) {
                const best = qualities[0];
                playerApi.setPlaybackQualityRange(best);
                playerApi.setPlaybackQuality(best);
            }
        }
    }
    function setQualityAndTheater() {
        if (alreadyApplied) return;
        alreadyApplied = true;
        applyTheaterMode();
        applyHighestQuality();
    }
    function scheduleSetQualityAndTheater() {
        if ('requestIdleCallback' in window) requestIdleCallback(setQualityAndTheater, { timeout: 2000 });
        else setTimeout(setQualityAndTheater, 1000);
    }
    function observePageChange() {
        const observer = new MutationObserver(() => {
            alreadyApplied = false;
            scheduleSetQualityAndTheater();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    window.addEventListener('yt-navigate-finish', () => {
        alreadyApplied = false;
        scheduleSetQualityAndTheater();
    });
    window.addEventListener('DOMContentLoaded', () => {
        scheduleSetQualityAndTheater();
        observePageChange();
    });
})();
