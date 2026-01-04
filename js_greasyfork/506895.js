// ==UserScript==
// @name         유튜브 맞춤 URL 복사 버튼
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  유튜브 플레이어에 동영상 URL 복사와 현재 시간 동영상 URL 복사 버튼 추가
// @author       waveCodeNoob
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506895/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EB%A7%9E%EC%B6%A4%20URL%20%EB%B3%B5%EC%82%AC%20%EB%B2%84%ED%8A%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/506895/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EB%A7%9E%EC%B6%A4%20URL%20%EB%B3%B5%EC%82%AC%20%EB%B2%84%ED%8A%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 버튼을 추가하는 함수
    function addCustomButtons() {
        // 유튜브 컨트롤 바 찾기
        const controlBar = document.querySelector('.ytp-right-controls');
        if (!controlBar || document.getElementById('copy-url-button')) return;

        // '동영상 URL 복사' 버튼 생성
        const copyUrlButton = document.createElement('button');
        copyUrlButton.innerHTML = '동영상 URL 복사';
        copyUrlButton.id = 'copy-url-button';
        copyUrlButton.style.margin = '0 5px';
        copyUrlButton.style.padding = '5px';
        copyUrlButton.style.background = '#FF0000';
        copyUrlButton.style.color = 'white';
        copyUrlButton.style.border = 'none';
        copyUrlButton.style.cursor = 'pointer';

        // '현재 시간에 동영상 URL 복사' 버튼 생성
        const copyCurrentTimeUrlButton = document.createElement('button');
        copyCurrentTimeUrlButton.innerHTML = '현재 시간에 동영상 URL 복사';
        copyCurrentTimeUrlButton.id = 'copy-current-time-url-button';
        copyCurrentTimeUrlButton.style.margin = '0 5px';
        copyCurrentTimeUrlButton.style.padding = '5px';
        copyCurrentTimeUrlButton.style.background = '#FF0000';
        copyCurrentTimeUrlButton.style.color = 'white';
        copyCurrentTimeUrlButton.style.border = 'none';
        copyCurrentTimeUrlButton.style.cursor = 'pointer';

        // '동영상 URL 복사' 버튼 클릭 이벤트
        copyUrlButton.onclick = function() {
            const videoUrl = window.location.href.split('&')[0];
            navigator.clipboard.writeText(videoUrl).then(() => {
                alert('동영상 URL이 복사되었습니다: ' + videoUrl);
            });
        };

        // '현재 시간에 동영상 URL 복사' 버튼 클릭 이벤트
        copyCurrentTimeUrlButton.onclick = function() {
            const videoUrl = window.location.href.split('&')[0];
            const video = document.querySelector('video');
            const currentTime = Math.floor(video.currentTime);
            const timeUrl = `${videoUrl}&t=${currentTime}s`;
            navigator.clipboard.writeText(timeUrl).then(() => {
                alert('현재 시간에 동영상 URL이 복사되었습니다: ' + timeUrl);
            });
        };

        // 버튼을 유튜브 컨트롤 바에 추가
        controlBar.insertBefore(copyUrlButton, controlBar.firstChild);
        controlBar.insertBefore(copyCurrentTimeUrlButton, controlBar.firstChild);
    }

    // 페이지가 로드될 때 버튼 추가
    window.addEventListener('yt-navigate-finish', addCustomButtons);
    window.addEventListener('DOMContentLoaded', addCustomButtons);
})();
