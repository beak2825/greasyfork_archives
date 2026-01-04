// ==UserScript==
// @name         Download Video
// @namespace    ViolentMonkey Scripts
// @version      0.2
// @description  Adiciona um botão de download para o vídeo na página com marca d'água do Jeiel Miranda
// @match        https://metodosanches.com.br/*
// @grant        none
// @author       Jeiel Miranda
// @downloadURL https://update.greasyfork.org/scripts/484354/Download%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/484354/Download%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let videoElement = document.querySelector('.tutorPlayer');

    if (videoElement) {
        let videoUrl = videoElement.querySelector('source').src;

        let downloadButton = document.createElement('a');
        downloadButton.textContent = 'Baixar Vídeo';
        downloadButton.href = videoUrl;
        downloadButton.download = videoUrl.split('/').pop();

        downloadButton.style.cssText = 'display: block; padding: 10px; background-color: #3498db; color: #fff; text-decoration: none; text-align: center;';

        videoElement.parentNode.insertBefore(downloadButton, videoElement.nextSibling);

        let courseHeader = document.querySelector('.tutor-course-topic-single-header-title');

        if (courseHeader) {
            let yourNameLink = document.createElement('a');
            yourNameLink.textContent = '| Jeiel Miranda';
            yourNameLink.href = 'https://is.gd/JeielMiranda';
            yourNameLink.style.cssText = 'color: #555; font-size: 14px; text-decoration: none;';

            courseHeader.appendChild(yourNameLink);
        }
    }
})();