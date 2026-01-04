// ==UserScript==
// @name         Instiz iOS Zoom Blocker (Final Attempt)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Prevent iOS Safari auto zoom on input focus by enforcing font-size 16px without breaking layout
// @author       San
// @match        *://*.instiz.net/*
// @match        *://instiz.net/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535709/Instiz%20iOS%20Zoom%20Blocker%20%28Final%20Attempt%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535709/Instiz%20iOS%20Zoom%20Blocker%20%28Final%20Attempt%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Viewport meta tag 설정 (확대 방지용)
    function setViewport() {
        let meta = document.querySelector('meta[name=viewport]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'viewport';
            document.head.appendChild(meta);
        }
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }

    // 입력 필드 폰트 크기 16px 이상으로 설정
    function fixInputFont() {
        const elements = document.querySelectorAll('input, textarea, select');
        elements.forEach(el => {
            const computedSize = window.getComputedStyle(el).fontSize;
            if (parseFloat(computedSize) < 16) {
                el.style.fontSize = '16px';
            }
            el.style.webkitTextSizeAdjust = '100%'; // 추가 조치
        });
    }

    function apply() {
        setViewport();
        fixInputFont();
    }

    apply();

    // DOM 변경 감지 시 재적용
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });

    // 주기적 재확인 (특히 동적 로딩되는 인풋 대응)
    setInterval(apply, 1000);
})();