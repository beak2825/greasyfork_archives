// ==UserScript==
// @name         X.com Media Gallery Slideshow with Timer and Video Support + Pause
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Extract images and videos from X.com (Twitter) media gallery and play slideshow with controls, countdown timer and pause on spacebar
// @author       OpenAI
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542422/Xcom%20Media%20Gallery%20Slideshow%20with%20Timer%20and%20Video%20Support%20%2B%20Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/542422/Xcom%20Media%20Gallery%20Slideshow%20with%20Timer%20and%20Video%20Support%20%2B%20Pause.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let slideshowOverlay = null;
    let slideshowMedia = []; // Array of objects {type: 'image'|'video', src: URL}
    let currentIndex = 0;
    let slideshowTimeout = null;
    let countdownInterval = null;
    let countdownSeconds = 10;
    let isPaused = false;
    let currentVideo = null;

    // Extract media URLs (images and videos) from X.com media gallery
    function extractMedia() {
        const seen = new Set();
        const media = [];

        // Images
        const imgElements = document.querySelectorAll('img[src*="pbs.twimg.com/media/"]');
        imgElements.forEach(img => {
            const baseUrl = img.src.split('?')[0];
            if (!seen.has(baseUrl)) {
                seen.add(baseUrl);
                // Images full size
                media.push({ type: 'image', src: baseUrl + '?format=jpg&name=large' });
            }
        });

        // Videos
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(video => {
            let src = video.currentSrc || video.src;
            if (src && !seen.has(src)) {
                seen.add(src);
                media.push({ type: 'video', src: src });
            }
        });

        return media;
    }

    function clearTimers() {
        clearTimeout(slideshowTimeout);
        clearInterval(countdownInterval);
    }

    // Create and show slideshow overlay
    function showSlideshow(mediaArray) {
        if (mediaArray.length === 0) {
            alert('No media found!');
            return;
        }

        if (slideshowOverlay) {
            slideshowOverlay.remove();
            clearTimers();
            document.removeEventListener('keydown', keyHandler);
        }

        slideshowMedia = mediaArray;
        currentIndex = 0;
        countdownSeconds = 10;
        isPaused = false;
        currentVideo = null;

        slideshowOverlay = document.createElement('div');
        slideshowOverlay.style.position = 'fixed';
        slideshowOverlay.style.top = '0';
        slideshowOverlay.style.left = '0';
        slideshowOverlay.style.width = '100vw';
        slideshowOverlay.style.height = '100vh';
        slideshowOverlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
        slideshowOverlay.style.display = 'flex';
        slideshowOverlay.style.alignItems = 'center';
        slideshowOverlay.style.justifyContent = 'center';
        slideshowOverlay.style.flexDirection = 'column';
        slideshowOverlay.style.zIndex = '100000';

        const mediaContainer = document.createElement('div');
        mediaContainer.style.maxWidth = '90%';
        mediaContainer.style.maxHeight = '90%';
        mediaContainer.style.borderRadius = '10px';
        mediaContainer.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.7)';
        mediaContainer.style.display = 'flex';
        mediaContainer.style.alignItems = 'center';
        mediaContainer.style.justifyContent = 'center';
        slideshowOverlay.appendChild(mediaContainer);

        const timerDisplay = document.createElement('div');
        timerDisplay.style.color = 'white';
        timerDisplay.style.fontSize = '18px';
        timerDisplay.style.marginTop = '10px';
        timerDisplay.style.fontFamily = 'Arial, sans-serif';
        timerDisplay.textContent = `Next media in: ${countdownSeconds} seconds`;
        slideshowOverlay.appendChild(timerDisplay);

        const closeBtn = document.createElement('button');
        closeBtn.innerText = '✕';
        closeBtn.style.position = 'fixed';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '20px';
        closeBtn.style.fontSize = '30px';
        closeBtn.style.background = 'transparent';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.zIndex = '100001';
        closeBtn.title = 'Close Slideshow';
        closeBtn.addEventListener('click', () => {
            clearTimers();
            slideshowOverlay.remove();
            slideshowOverlay = null;
            document.removeEventListener('keydown', keyHandler);
        });
        slideshowOverlay.appendChild(closeBtn);

        function loadMedia(index) {
            mediaContainer.innerHTML = '';
            currentVideo = null;
            const mediaObj = slideshowMedia[index];
            if (!mediaObj) return;

            if (mediaObj.type === 'image') {
                const img = document.createElement('img');
                img.src = mediaObj.src;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                img.style.borderRadius = '10px';
                mediaContainer.appendChild(img);

                countdownSeconds = 10;
                timerDisplay.textContent = `Next media in: ${countdownSeconds} seconds`;

                resetInterval(10000);
            } else if (mediaObj.type === 'video') {
                const video = document.createElement('video');
                video.src = mediaObj.src;
                video.style.maxWidth = '100%';
                video.style.maxHeight = '100%';
                video.style.borderRadius = '10px';
                video.autoplay = true;
                video.controls = true;
                video.loop = false;
                mediaContainer.appendChild(video);

                currentVideo = video;

                video.addEventListener('loadedmetadata', () => {
                    countdownSeconds = Math.ceil(video.duration);
                    timerDisplay.textContent = `Next media in: ${countdownSeconds} seconds`;
                    resetInterval(countdownSeconds * 1000);
                    if (isPaused) video.pause();
                });

                video.addEventListener('ended', () => {
                    nextMedia();
                });
            }
        }

        function showMedia(index) {
            currentIndex = (index + slideshowMedia.length) % slideshowMedia.length;
            loadMedia(currentIndex);
        }

        function nextMedia() {
            showMedia(currentIndex + 1);
        }

        function prevMedia() {
            showMedia(currentIndex - 1);
        }

        function resetInterval(duration) {
            clearTimers();

            countdownSeconds = Math.floor(duration / 1000);
            timerDisplay.textContent = `Next media in: ${countdownSeconds} seconds`;

            if (!isPaused) {
                slideshowTimeout = setTimeout(() => {
                    nextMedia();
                }, duration);

                countdownInterval = setInterval(() => {
                    if (!isPaused) {
                        countdownSeconds--;
                        if (countdownSeconds < 0) countdownSeconds = 0;
                        timerDisplay.textContent = `Next media in: ${countdownSeconds} seconds`;
                    }
                }, 1000);
            }
        }

        function togglePause() {
            isPaused = !isPaused;
            if (isPaused) {
                clearTimers();
                if (currentVideo && !currentVideo.paused) currentVideo.pause();
            } else {
                if (currentVideo && currentVideo.paused) currentVideo.play();
                resetInterval(countdownSeconds * 1000);
            }
        }

        function keyHandler(e) {
            if (!slideshowOverlay) return;

            if (e.key === 'ArrowRight') {
                nextMedia();
            } else if (e.key === 'ArrowLeft') {
                prevMedia();
            } else if (e.key === 'Escape') {
                closeBtn.click();
            } else if (e.code === 'Space') {
                e.preventDefault(); // prevent page scroll
                togglePause();
            }
        }

        document.addEventListener('keydown', keyHandler);

        showMedia(0);

        document.body.appendChild(slideshowOverlay);
    }

    function addButton() {
        if (document.getElementById('extract-media-btn')) return;

        const btn = document.createElement('button');
        btn.innerText = 'Start X.com Slideshow';
        btn.id = 'extract-media-btn';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = '9999';
        btn.style.padding = '10px';
        btn.style.background = '#1da1f2';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.title = 'Start slideshow';

        btn.addEventListener('click', () => {
            const media = extractMedia();
            showSlideshow(media);
        });

        document.body.appendChild(btn);
    }

    const observer = new MutationObserver(() => {
        addButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    addButton();
})();
