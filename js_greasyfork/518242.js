// ==UserScript==
// @name         펨코 댓글 이미지 링크 이미지로 보기 (임시)
// @version      1.8
// @description  댓글에 있는 이미지 링크를 직접 이미지로 표시합니다.
// @author       ChatGPT
// @match        *://*.fmkorea.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1395103
// @downloadURL https://update.greasyfork.org/scripts/518242/%ED%8E%A8%EC%BD%94%20%EB%8C%93%EA%B8%80%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%A7%81%ED%81%AC%20%EC%9D%B4%EB%AF%B8%EC%A7%80%EB%A1%9C%20%EB%B3%B4%EA%B8%B0%20%28%EC%9E%84%EC%8B%9C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/518242/%ED%8E%A8%EC%BD%94%20%EB%8C%93%EA%B8%80%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%A7%81%ED%81%AC%20%EC%9D%B4%EB%AF%B8%EC%A7%80%EB%A1%9C%20%EB%B3%B4%EA%B8%B0%20%28%EC%9E%84%EC%8B%9C%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isDebugMode = false;
    let isReplacing = false;

    function debugLog(message) {
        if (isDebugMode) {
            console.log(message);
        }
    }

    const imgRegex = /https?:\/\/(image|media|gif)\.fmkorea\.com\/[^\s]+\.(jpg|jpeg|png|gif|bmp|webp)/i;
    const imgRegex2 = /https?:\/\/i\.ibb\.co\/[^\s]+\.(jpg|jpeg|png|gif|bmp|webp)/i;
    const videoRegex = /https?:\/\/(image|media|gif)\.fmkorea\.com\/[^\s]+\.(mp4|webm|avi|mov|mkv)(\?.*)?/i;

    // 텍스트 노드에서 이미지 링크를 찾아 변환하는 함수
    function replaceImageLinks() {
        if (isReplacing) {
            debugLog("[fmk-comment-img] 이미지 변환 중이므로 중단");
            return;
        }
        isReplacing = true;
        debugLog("[fmk-comment-img] 이미지 변환 시작");


        const boardcomments = document.querySelectorAll('.comment-content a:not([class])');
        const mycomments = document.querySelectorAll('.word_style a');

        const combined = [...boardcomments, ...mycomments];

        combined.forEach(atag => {
            traverseTextNodes(atag);
        });

        isReplacing = false;
        debugLog("[fmk-comment-img] 이미지 변환 완료");
    }

    // 텍스트 노드를 순회하면서 이미지 링크를 변환
    function traverseTextNodes(element) {
        const url = element.textContent.trim();
        var newelement = '';
        var changed = false;

        let matchedUrl; // 매치된 URL을 저장할 변수

        if ((matchedUrl = url.match(videoRegex))) {
            newelement = document.createElement('video');
            newelement.src = matchedUrl[0]; // 매치된 URL을 사용
            newelement.style.objectFit = 'contain';
            newelement.style.display = 'inline-block';
            newelement.autoplay = true;
            newelement.loop = true;
            newelement.muted = true;
            newelement.playsInline = true;
            changed = true;
        } else if ((matchedUrl = url.match(imgRegex)) || (matchedUrl = url.match(imgRegex2))) {
            debugLog(`${matchedUrl[0]}`); // 매치된 문자열을 로그에 출력
            newelement = document.createElement('img');
            newelement.src = matchedUrl[0]; // 매치된 URL을 사용
            newelement.style = 'height:auto; object-fit:contain; display:inline-block; vertical-align:middle;';
            changed = true;

        }

        if (changed) {
            element.textContent = element.textContent.replace(matchedUrl[0], '');
            element.appendChild(newelement);
        }
    }

    function observeCommentWrapper() {
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;

            mutations.forEach(mutation => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    shouldUpdate = true;
                }
            });

            if (shouldUpdate) {
                // 약간의 지연을 두고 실행하여 DOM 업데이트 완료 보장
                setTimeout(replaceImageLinks, 100);
            }
        });


        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        debugLog("[fmk-comment-img] 댓글 래퍼 변경 감지 시작");
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .comment-content img,
        .comment-content video,
        .word_style img,
        .word_style video {
            max-width: 12% !important;
            height: auto !important;
        }
        @media (max-width: 768px) {
        .comment-content img,
        .comment-content video,
        .word_style img,
        .word_style video {
            max-width: 30% !important;
        }
    }
    `;
    document.head.appendChild(style);

    setTimeout(observeCommentWrapper(), 100);
})();
