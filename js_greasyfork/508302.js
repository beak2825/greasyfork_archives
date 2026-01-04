// ==UserScript==
// @name         YouTube Auto PIP with Class Detection
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Automatically activates Picture-in-Picture mode on YouTube videos when class changes to 'playing-mode'.
// @author       임바다
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508302/YouTube%20Auto%20PIP%20with%20Class%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/508302/YouTube%20Auto%20PIP%20with%20Class%20Detection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkVideoAndActivatePIP = (video) => {
        if (video && video.requestPictureInPicture) {
            video.requestPictureInPicture()
                .catch(error => {
                    if (error.name !== "NotAllowedError"){
                        console.error('Failed to enter Picture-in-Picture mode:', error);
                    }
                });
        }
    };

    const waitForVideoReady = (video) => {
        if (video.readyState >= 1) {  // 1은 HAVE_METADATA 상태를 의미
            checkVideoAndActivatePIP(video);
        } else {
            video.addEventListener('loadedmetadata', () => {
                checkVideoAndActivatePIP(video);
            }, { once: true });
        }
    };

    const isYouTubeVideoPage = () => {
        return window.location.href.startsWith('https://www.youtube.com/watch?v=');
    };

    const observePlayerClassChanges = () => {
        const playerDiv = document.querySelector('.html5-video-player');
        if (!playerDiv) return; // 플레이어 div가 없으면 종료

        const video = document.querySelector('video');
        if (!video) return; // 비디오 요소가 없으면 종료

        // MutationObserver를 사용하여 플레이어의 클래스 변화를 감지
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const classList = playerDiv.classList;

                    // playing-mode가 있을 때 PIP 모드 활성화
                    if (classList.contains('playing-mode') && isYouTubeVideoPage()) {
                        waitForVideoReady(video);
                    }
                }
            });
        });

        // 클래스 변경 사항을 감지하도록 설정
        observer.observe(playerDiv, { attributes: true });
    };

    const initPIPOnYouTube = () => {
        const playerDivInterval = setInterval(() => {
            observePlayerClassChanges();
        }, 300); // PIP 상태 감지 300ms
    };

    // URL 변경을 감지하여 새로고침 없이도 PIP가 작동하게 함
    const observeURLChange = () => {
        const pushState = history.pushState;
        history.pushState = function () {
            pushState.apply(history, arguments);
            initPIPOnYouTube(); // URL이 변경될 때마다 다시 PIP 확인
        };

        window.addEventListener('popstate', () => {
            initPIPOnYouTube(); // 뒤로 가기/앞으로 가기에서도 작동
        });
    };

    // 페이지 로드 및 URL 변경 시 감시 시작
    window.addEventListener('load', () => {
        initPIPOnYouTube(); // 페이지 로드 시 PIP 확인
    });

    document.addEventListener('click', () => {
        const video = document.querySelector('#movie_player');
        console.log(video);

        const classList = video.classList;
        if (!classList.contains('playing-mode')) return;

        if (video && isYouTubeVideoPage()) {
            waitForVideoReady(video);
        }
    });

    observeURLChange(); // URL 변경 감지
})();
