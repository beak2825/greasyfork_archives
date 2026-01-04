// ==UserScript==
// @name         픽시브 원본 이미지 다운로더
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  픽시브에서 원본 이미지를 직접 다운로드합니다
// @match        https://www.pixiv.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/519720/%ED%94%BD%EC%8B%9C%EB%B8%8C%20%EC%9B%90%EB%B3%B8%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%8D%94.user.js
// @updateURL https://update.greasyfork.org/scripts/519720/%ED%94%BD%EC%8B%9C%EB%B8%8C%20%EC%9B%90%EB%B3%B8%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%8D%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '10px';
    buttonContainer.style.right = '10px';
    buttonContainer.style.zIndex = 1000;

    const downloadButton = document.createElement('button');
    downloadButton.innerText = '원본 다운로드';
    buttonContainer.appendChild(downloadButton);
    document.body.appendChild(buttonContainer);

    downloadButton.addEventListener('click', () => {
        const imageElement = document.querySelector('img');
        if (imageElement) {
            const imageUrl = imageElement.src.replace('/img-master/', '/img-original/').replace('_master1200', '');
            GM_download(imageUrl, '픽시브_이미지.jpg');
        }
    });
})();