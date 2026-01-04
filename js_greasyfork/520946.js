// ==UserScript==
// @name         Youtube autoplay stopper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disable YouTube autoplay with user interaction required and dynamic settings
// @author       You
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520946/Youtube%20autoplay%20stopper.user.js
// @updateURL https://update.greasyfork.org/scripts/520946/Youtube%20autoplay%20stopper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ayarları almak ve kaydetmek için GM API kullanıyoruz
    let prefs = {
        disableAutoplay: GM_getValue('disableAutoplay', true),
        disablePreload: GM_getValue('disablePreload', true)
    };

    let lastUrl;
    let playbackAuthorized = true;

    const videos = new Set();
    const userInputEvents = ['keyup', 'mouseup', 'touchend'];

    // Video durdurma fonksiyonu
    function stopVideo(video) {
        if (prefs.disableAutoplay) {
            if (prefs.disablePreload) {
                try {
                    video.parentElement.parentElement.stopVideo();
                } catch (e) {
                    //
                }
            } else {
                try {
                    video.parentElement.parentElement.pauseVideo();
                } catch (e) {
                    //
                }
            }
        }
    }

    // Kullanıcı etkileşimi olayları için callback
    function userInputCallback(e) {
        if (e.type === 'keyup' && e.keyCode !== 13 && e.keyCode !== 32) {
            return;
        }
        playbackAuthorized = true;
        lastUrl = window.location.href;
        for (const event of userInputEvents) {
            window.removeEventListener(event, userInputCallback, true);
        }
    }

    // Kullanıcı etkileşimi dinleyicilerini ekleme
    function addUserInputListeners() {
        for (const event of userInputEvents) {
            window.addEventListener(event, userInputCallback, true);
        }
    }

    // Video yüklenmeye başlandığında çağrılan fonksiyon
    function onVideoLoadStart(event) {
        if (!(event.target instanceof HTMLMediaElement)) {
            return;
        }
        if (!videos.has(event.target)) {
            videos.add(event.target);
            const ytapi = event.target.parentElement.parentElement;
            const originalPlayVideo = ytapi.playVideo;
            ytapi.playVideo = () => {
                originalPlayVideo();
                if (!playbackAuthorized) {
                    stopVideo(event.target);
                }
            };
        }
        if (prefs.disableAutoplay && !playbackAuthorized) {
            stopVideo(event.target);
        } else if (prefs.disableAutoplay && playbackAuthorized && window.location.href !== lastUrl) {
            playbackAuthorized = false;
            stopVideo(event.target);
            lastUrl = window.location.href;
            addUserInputListeners();
        }
    }

    // Ayar paneli oluşturma
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'yt-autoplay-settings-panel';
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        panel.style.color = 'white';
        panel.style.padding = '10px';
        panel.style.borderRadius = '5px';
        panel.style.zIndex = '9999';
        panel.style.fontSize = '14px';

        const autoplayLabel = document.createElement('label');
        autoplayLabel.textContent = 'Disable Autoplay';
        const autoplayCheckbox = document.createElement('input');
        autoplayCheckbox.type = 'checkbox';
        autoplayCheckbox.checked = prefs.disableAutoplay;
        autoplayCheckbox.addEventListener('change', () => {
            prefs.disableAutoplay = autoplayCheckbox.checked;
            GM_setValue('disableAutoplay', prefs.disableAutoplay);
        });
        autoplayLabel.appendChild(autoplayCheckbox);

        const preloadLabel = document.createElement('label');
        preloadLabel.textContent = 'Disable Preload';
        const preloadCheckbox = document.createElement('input');
        preloadCheckbox.type = 'checkbox';
        preloadCheckbox.checked = prefs.disablePreload;
        preloadCheckbox.addEventListener('change', () => {
            prefs.disablePreload = preloadCheckbox.checked;
            GM_setValue('disablePreload', prefs.disablePreload);
        });
        preloadLabel.appendChild(preloadCheckbox);

        // Checkbox ve yazıyı gizliyoruz
        autoplayLabel.style.display = 'none';
        preloadLabel.style.display = 'none';

        panel.appendChild(autoplayLabel);
        panel.appendChild(document.createElement('br'));
        panel.appendChild(preloadLabel);

        document.body.appendChild(panel);
    }

    // Paneli sayfaya ekleyelim
    createSettingsPanel();

    // Sayfa yüklendikten sonra video yüklenme olayını dinlemeye başla
    window.addEventListener('load', () => {
        window.addEventListener('loadstart', onVideoLoadStart, true);
    });

})();
