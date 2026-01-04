// ==UserScript==
// @name         TikTok Video İndirici
// @namespace    Cybercode
// @version      1.0.1
// @description  TikTok videolarını indirebilmenizi sağlar.
// @author       Ali Osman Dinke
// @match        https://www.tiktok.com/*
// @grant        free
// @downloadURL https://update.greasyfork.org/scripts/466884/TikTok%20Video%20%C4%B0ndirici.user.js
// @updateURL https://update.greasyfork.org/scripts/466884/TikTok%20Video%20%C4%B0ndirici.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Türkçe indirme butonu oluşturma
    function createDownloadButton(videoUrl) {
        const downloadButton = document.createElement('a');
        downloadButton.innerHTML = 'İndir';
        downloadButton.href = videoUrl;
        downloadButton.download = 'video.mp4';
        downloadButton.style.marginLeft = '10px';
        downloadButton.style.color = '#fff';
        downloadButton.style.backgroundColor = '#ff0000';
        downloadButton.style.padding = '5px 10px';
        downloadButton.style.borderRadius = '4px';
        downloadButton.style.textDecoration = 'none';
        
        const buttonContainer = document.querySelector('.video-controls-right');
        buttonContainer.appendChild(downloadButton);
    }

    // Videoyu indirme işlemini gerçekleştirme
    function downloadVideo(videoUrl) {
        const qualityOptions = ['360p', '480p', '720p', '1080p']; // İstediğiniz video kalite seçeneklerini buraya ekleyin
        const selectedQuality = prompt('Video kalitesini seçin: ' + qualityOptions.join(', '));

        if (qualityOptions.includes(selectedQuality)) {
            const downloadUrl = videoUrl.replace('api.tiktokv.com', 'api2.musical.ly') + '&quality=' + selectedQuality;
            createDownloadButton(downloadUrl);
        } else {
            alert('Geçersiz video kalite seçeneği!');
        }
    }

    // Video sayfasında tetiklenen olay
    function handleVideoPage() {
        const videoUrl = window.__INIT_PROPS__.metaParams.video.playAddr;
        createDownloadButton(videoUrl);
    }

    // Ana fonksiyon
    function main() {
        const currentUrl = window.location.href;

        if (currentUrl.includes('/video/')) {
            handleVideoPage();
        }
    }

    // Scripti başlat
    main();
})();