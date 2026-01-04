// ==UserScript==
// @name          유튜브 쇼츠 영상을 일반 영상으로(버튼 추가)
// @namespace     유튜브 쇼츠 영상을 일반 영상으로(버튼 추가)
// @match         *://*.youtube.com/shorts/*
// @version       0.1
// @description   우측 하단의 [쇼츠 → 일반] 기능을 하는 버튼을 추가힌다.
// @icon          https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @author        mickey90427 <mickey90427@naver.com>
// @downloadURL https://update.greasyfork.org/scripts/467324/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EC%87%BC%EC%B8%A0%20%EC%98%81%EC%83%81%EC%9D%84%20%EC%9D%BC%EB%B0%98%20%EC%98%81%EC%83%81%EC%9C%BC%EB%A1%9C%28%EB%B2%84%ED%8A%BC%20%EC%B6%94%EA%B0%80%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467324/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EC%87%BC%EC%B8%A0%20%EC%98%81%EC%83%81%EC%9D%84%20%EC%9D%BC%EB%B0%98%20%EC%98%81%EC%83%81%EC%9C%BC%EB%A1%9C%28%EB%B2%84%ED%8A%BC%20%EC%B6%94%EA%B0%80%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 스타일을 위한 CSS 코드
    var style = document.createElement('style');
    style.innerHTML = `
        .yt-button {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 9999;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: bold;
            color: #fff;
            background-color: #f00;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }

        .yt-button:hover {
            background-color: #c00;
        }
    `;

    // CSS 코드를 <head> 요소에 추가
    document.head.appendChild(style);

    // 버튼을 생성하고 이벤트 리스너 등록
    var button = document.createElement('button');
    button.className = 'yt-button';
    button.innerHTML = '쇼츠 → 일반';
    button.addEventListener('click', function() {
        var url = window.location.href;
        url = url.replace('/shorts/', '/watch?v=');
        window.location.href = url;
    });

    // 버튼을 <body> 요소에 추가
    document.body.appendChild(button);
})();