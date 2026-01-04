// ==UserScript==
// @name         라프텔 이어보기
// @namespace    https://laftel.net/
// @version      1.0
// @description  라프텔 에피소드 이어보기 기능을 지원하는 스크립트
// @author       Harim Kim
// @match        https://laftel.net/player/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=laftel.net
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442213/%EB%9D%BC%ED%94%84%ED%85%94%20%EC%9D%B4%EC%96%B4%EB%B3%B4%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/442213/%EB%9D%BC%ED%94%84%ED%85%94%20%EC%9D%B4%EC%96%B4%EB%B3%B4%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getWatchInfo() {
        let watchInfo;
        try {
            watchInfo = localStorage.getItem('watchInfo');
        } catch (e) {
            // ignore
        }
        return watchInfo ? JSON.parse(watchInfo) : null;
    }

    function setWatchInfo(value) {
        try {
            localStorage.setItem('watchInfo', JSON.stringify(value));
        } catch (e) {
            // ignore
        }
    }

    // 마지막 시청 시간 있으면 localStroage 에서 불러온 뒤 해당 시간으로 이동
    document.arrive('video', function () {
        const video = this;
        const watchInfo = getWatchInfo();
        if (!watchInfo) return;

        const [animation, episode] = window.location.pathname.replace('/player/', '').split('/');
        const lastPlaytime = Number(watchInfo[`${animation}-${episode}`]);
        if (!lastPlaytime) return;

        video.currentTime = lastPlaytime;
    });


    // 윈도우 닫을 때 마지막 시청 시간 localStorage에 저장
    window.addEventListener("beforeunload", function(event) {
        const video = document.querySelector('video');
        const watchInfo = getWatchInfo() || {};
        const [animation, episode] = window.location.pathname.replace('/player/', '').split('/');
        if (animation && episode && video.currentTime) {
            watchInfo[`${animation}-${episode}`] = Math.floor(video.currentTime);
            setWatchInfo(watchInfo);
        }
    });
})();