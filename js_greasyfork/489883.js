// ==UserScript==
// @name         YouTube No Cookie Video Player
// @namespace    https://kuds.win/
// @version      1.1
// @description  YouTube で動画を再生する際、埋め込み動画 (No Cookie Video) を表示できます。プライバシー強化モードで視聴したい人に適しています。
// @author       KUDs
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/489883/YouTube%20No%20Cookie%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/489883/YouTube%20No%20Cookie%20Video%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastVideoId = '';

    function attemptUpdateEmbedVideo() {
        const videoId = getVideoId();
        if (videoId && videoId !== lastVideoId) {
            const existingIframeContainer = document.querySelector('.embed-video-container');
            if (existingIframeContainer) {
                existingIframeContainer.remove();
            }
            if (!document.getElementById('toggleEmbedVideo')) {
                addToggleButton();
            }
            insertEmbedVideo(videoId);
            lastVideoId = videoId;
        }
    }

    function getVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }

    function insertEmbedVideo(videoId) {
        const iframeContainer = document.createElement('div');
        iframeContainer.classList.add('embed-video-container');
        const toggleButton = document.getElementById('toggleEmbedVideo');
        iframeContainer.style.display = toggleButton && toggleButton.dataset.state === 'visible' ? 'block' : 'none';

        Object.assign(iframeContainer.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '560px',
            height: '315px',
            zIndex: '1000',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '10px',
            overflow: 'hidden'
        });

        iframeContainer.innerHTML = `
            <h1 style="color:red; margin: 0; padding: 10px; background-color: #000;">No Cookie Video</h1>
            <iframe id="ytplayer" type="text/html"
                src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&fs=1"
                frameborder="0" allow="fullscreen; picture-in-picture"
                style="width: 100%; height: calc(100% - 40px);"></iframe>`;

        document.body.appendChild(iframeContainer);
    }

    function addToggleButton() {
        const targetElement = document.getElementById('logo');
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggleEmbedVideo';
        toggleButton.dataset.state = 'visible';
        toggleButton.textContent = 'NoCookie';
        applyButtonStyles(toggleButton);

        toggleButton.addEventListener('mouseover', () => {
            Object.assign(toggleButton.style, {
                filter: 'brightness(1.25)',
                transform: 'scale(1.05)',
            });
        });

        toggleButton.addEventListener('mouseout', () => {
            Object.assign(toggleButton.style, {
                filter: 'brightness(1)',
                transform: 'scale(1)',
            });
        });

        toggleButton.addEventListener('click', function() {
            const embedVideoContainer = document.querySelector('.embed-video-container');
            if (this.dataset.state === 'hidden') {
                this.dataset.state = 'visible';
                this.textContent = 'NoCookie';
                this.style.backgroundColor = 'red';
                if (embedVideoContainer) embedVideoContainer.style.display = 'block';
            } else {
                this.dataset.state = 'hidden';
                this.textContent = 'Normal';
                this.style.backgroundColor = 'gray';
                if (embedVideoContainer) embedVideoContainer.style.display = 'none';
            }
        });

        targetElement.insertAdjacentElement('afterend', toggleButton);
    }

    function applyButtonStyles(button) {
        Object.assign(button.style, {
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'filter 0.3s, transform 0.3s',
            marginLeft: '20px',
        });
    }

    const pushState = history.pushState;
    history.pushState = function() {
        pushState.apply(history, arguments);
        attemptUpdateEmbedVideo();
    };
    window.addEventListener('popstate', attemptUpdateEmbedVideo);
    new MutationObserver(attemptUpdateEmbedVideo).observe(document.body, {childList: true, subtree: true});

    attemptUpdateEmbedVideo();
})();
