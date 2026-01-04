// ==UserScript==
// @name         N予備校動画自動切り替え
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically skips to the next unlocked essential video and auto-plays videos
// @match        https://www.nnn.ed.nico/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498925/N%E4%BA%88%E5%82%99%E6%A0%A1%E5%8B%95%E7%94%BB%E8%87%AA%E5%8B%95%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88.user.js
// @updateURL https://update.greasyfork.org/scripts/498925/N%E4%BA%88%E5%82%99%E6%A0%A1%E5%8B%95%E7%94%BB%E8%87%AA%E5%8B%95%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Auto Skip Variables
    let lastUrl = location.href;
    let lastClickTime = 0;
    const CLICK_COOLDOWN = 2000; // 2 seconds cooldown between clicks

    // Auto Play Variables
    const STOP_BEFORE_END = 10; // Seconds before the end to stop auto-play
    let isAutoPlayEnabled = true;

    // Auto Skip Functions
    function isEssentialVideo(element) {
        const textbookRef = element.querySelector('.sc-rux73v-0');
        return textbookRef && textbookRef.textContent.includes('教科書');
    }

    function getVideoNumber(element) {
        const numberSpan = element.querySelector('span[font-size="1.5rem"]');
        if (numberSpan) {
            const match = numberSpan.textContent.match(/(\d+)\./);
            return match ? parseInt(match[1]) : 0;
        }
        return 0;
    }

    function isVideoUnlocked(element) {
        const container = element.closest('.sc-1otp79h-0');
        return container && !container.classList.contains('hoWVG');
    }

    function findNextEssentialVideo() {
        const videoElements = Array.from(document.querySelectorAll('.sc-lcfvsp-10'));
        const currentVideo = videoElements.find(el => !el.classList.contains('cqkVcF'));

        if (currentVideo) {
            const currentIndex = videoElements.indexOf(currentVideo);
            const currentNumber = getVideoNumber(currentVideo);

            for (let i = currentIndex + 1; i < videoElements.length; i++) {
                const video = videoElements[i];
                if (isEssentialVideo(video) && isVideoUnlocked(video)) {
                    const videoNumber = getVideoNumber(video);
                    if (videoNumber > currentNumber) {
                        return video;
                    }
                }
            }
        }
        return null;
    }

    function clickNextEssentialVideo() {
        console.log('次に飛ばす動画を検索中');
        const nextVideo = findNextEssentialVideo();

        if (nextVideo) {
            console.log('Found next essential video:', nextVideo);
            const currentTime = Date.now();
            if (currentTime - lastClickTime >= CLICK_COOLDOWN) {
                console.log('次の動画をクリック中');
                nextVideo.click();
                lastClickTime = currentTime;
                setTimeout(checkUrlAndContinue, 1000);
            } else {
                console.log('コールダウン実施中クリックまでに待ってください');
                setTimeout(clickNextEssentialVideo, CLICK_COOLDOWN - (currentTime - lastClickTime));
            }
        } else {
            console.log('必修動画が見れないもしくは全て解除されていない状態です');
            setTimeout(clickNextEssentialVideo, 5000); // Retry after 5 seconds
        }
    }

    function checkUrlAndContinue() {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(clickNextEssentialVideo, 2000);
        } else {
            setTimeout(checkUrlAndContinue, 1000);
        }
    }

    // Auto Play Functions
    function playVideo(event) {
        if (isAutoPlayEnabled) {
            event.target.play();
            console.log('自動的に動画を再開');
        }
    }

    function checkTimeToDisable(video) {
        const timeRemaining = video.duration - video.currentTime;
        if (timeRemaining <= STOP_BEFORE_END) {
            isAutoPlayEnabled = false;
            console.log('終わりの10前につき自動再開を停止');
        } else {
            isAutoPlayEnabled = true;
        }
    }

    function addPlayListener() {
        const videoElements = document.querySelectorAll('video');

        videoElements.forEach(video => {
            video.removeEventListener('pause', playVideo); // Remove existing listener to avoid duplication
            video.addEventListener('pause', playVideo); // Add pause event listener to play video

            video.addEventListener('timeupdate', () => checkTimeToDisable(video)); // Check time remaining on each time update
        });
    }

    // Set up observers
    const skipObserver = new MutationObserver((mutations) => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('URL changed. Attempting to click next essential video element...');
            setTimeout(clickNextEssentialVideo, 2000);
        }
    });

    const playObserver = new MutationObserver(() => {
        addPlayListener();
    });

    // Start observing
    skipObserver.observe(document, { subtree: true, childList: true });
    playObserver.observe(document, { childList: true, subtree: true });

    console.log('N予備校動画自動切り替えコードロード完了');

    // Initial runs
    setTimeout(clickNextEssentialVideo, 2000);
    addPlayListener();
})();