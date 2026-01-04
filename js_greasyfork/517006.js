// ==UserScript==
// @name         치지직 광고 팝업 차단
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove ad block popup
// @author       You
// @match        https://chzzk.naver.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517006/%EC%B9%98%EC%A7%80%EC%A7%81%20%EA%B4%91%EA%B3%A0%20%ED%8C%9D%EC%97%85%20%EC%B0%A8%EB%8B%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/517006/%EC%B9%98%EC%A7%80%EC%A7%81%20%EA%B4%91%EA%B3%A0%20%ED%8C%9D%EC%97%85%20%EC%B0%A8%EB%8B%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 광고차단 팝업 제거 함수
    function removeAdBlockPopup() {
        const popups = document.querySelectorAll('div[class*="popup"], div[class*="modal"]');
        popups.forEach(popup => {
            if (popup.textContent.includes('광고 차단')) {
                popup.remove();
            }
        });
    }

    // 광고 차단 옵저버 설정
    const adBlockObserver = new MutationObserver(removeAdBlockPopup);
    adBlockObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 초기 실행
    removeAdBlockPopup();

    // 디버깅을 위한 전역 변수 설정
    window.debugChzzk = {
        observer: adBlockObserver,
        removeAdBlockPopup: removeAdBlockPopup
    };
})();