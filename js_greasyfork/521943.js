// ==UserScript==
// @name         Gamebanana 자동 다운로드
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Gamebanana 사이트에서 다양한 태그와 클래스를 기반으로 링크 자동 클릭 및 미디어 자동 다운로드
// @author       Your Name
// @match        *://*gamebanana.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521943/Gamebanana%20%EC%9E%90%EB%8F%99%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/521943/Gamebanana%20%EC%9E%90%EB%8F%99%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 다운로드 설정
    const downloadConfig = {
        click: {
            classes: ["GreenColor"],
            substrings: [],
            tags: ["a"],  // 주로 'a' 태그만 검색
            index: 0,  // 첫 번째 링크 대상
            maxCount: 1  // 예시로 한 개만 다운로드하도록 설정
        },
        image: {
            classes: ["PrimaryPreview"],
            substrings: [],
            tags: ["a"],  // 'a' 태그만 검색
            index: 0,  // 첫 번째 링크 대상
            maxCount: 1  // 한 개만 다운로드
        },
        video: {
            classes: [],
            substrings: [],
            tags: [],
            index: 0,
            maxCount: 0
        }
    };

    // 다운로드 실행 함수
    function executeDownloads(type) {
        const config = downloadConfig[type];
        let downloads = 0;

        if (config.tags.length > 0 && config.maxCount > 0) {
            config.tags.forEach(tag => {
                const elements = document.querySelectorAll(tag);
                elements.forEach((element, index) => {
                    if (downloads >= config.maxCount) return;
                    if (index === config.index && (Array.from(element.classList).some(className =>
                        config.classes.includes(className) || config.substrings.some(sub => className.includes(sub))))) {
                        if (element.click && type === 'click') {
                            console.log(`클릭할 요소 발견: ${element.tagName}, 클래스: ${element.className}`);
                            element.click();
                            downloads++;
                        } else {
                            const url = element.tagName.toUpperCase() === tag.toUpperCase() ? element.src : element.href;
                            console.log(`다운로드할 ${type} URL 발견: ${url}`);
                            downloadMedia(url, url.split('/').pop());
                            downloads++;
                        }
                    }
                });
            });
        }
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
        ['click', 'image', 'video'].forEach(type => {
            if (downloadConfig[type].tags.length > 0 && downloadConfig[type].maxCount > 0) {
                executeDownloads(type);
            }
        });
    });

})();
