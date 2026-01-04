// ==UserScript==
// @name         사이트 자동 다운로드 템플릿
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  사이트에서 다양한 태그와 클래스를 기반으로 링크 자동 클릭 및 미디어 자동 다운로드
// @author       Your Name
// @match        *://*nahida.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521909/%EC%82%AC%EC%9D%B4%ED%8A%B8%20%EC%9E%90%EB%8F%99%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%20%ED%85%9C%ED%94%8C%EB%A6%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/521909/%EC%82%AC%EC%9D%B4%ED%8A%B8%20%EC%9E%90%EB%8F%99%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%20%ED%85%9C%ED%94%8C%EB%A6%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 다운로드 설정
    const downloadConfig = {
        click: {
            classes: ["GreenColor", "DownloadLink", "DownloadButton"],
            substrings: ["Download", "download-link"],
            tags: ["a", "button", "div"],
            index: 1,
            maxCount: 2
        },
        image: {
            classes: ["ImageDownload", "GalleryImage", "DownloadImage"],
            substrings: ["image", "img"],
            tags: ["img", "a"],
            index: 1,
            maxCount: 3
        },
        video: {
            classes: ["VideoDownload", "GalleryVideo", "DownloadVideo"],
            substrings: ["video", "clip"],
            tags: ["video", "a"],
            index: 1,
            maxCount: 1
        }
    };

    // 다운로드 실행 함수
    function executeDownloads(type) {
        const config = downloadConfig[type];
        let downloads = 0;

        config.tags.forEach(tag => {
            const elements = document.querySelectorAll(tag);
            elements.forEach((element, index) => {
                if (downloads >= config.maxCount) return;
                if (index === config.index && (Array.from(element.classList).some(className =>
                    config.classes.includes(className) || config.substrings.some(sub => className.includes(sub))))) {
                    if (element.click && type === 'click') {
                        console.log(`클릭할 요소 발견: ${element.tagName}, 클래스: ${element.className}`);
                        element.click();
                    } else {
                        const url = element.tagName.toUpperCase() === tag.toUpperCase() ? element.src : element.href;
                        console.log(`다운로드할 ${type} URL 발견: ${url}`);
                        downloadMedia(url, url.split('/').pop());
                    }
                    downloads++;
                }
            });
        });
    }

    // 미디어 다운로드 함수
    function downloadMedia(url, filename) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = function () {
            if (xhr.status === 200) {
                const blob = xhr.response;
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };
        xhr.send();
    }

    // 페이지 로드 후 다운로드 함수 호출
    window.addEventListener('load', () => {
        ['click', 'image', 'video'].forEach(type => executeDownloads(type));
    });

})();
