// ==UserScript==
// @name         FMK 포텐제거
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  광고 제거 + 안내 문구 순서 조정 (영상 아래로 이동 + 순서 고정)
// @author       You
// @match        https://www.fmkorea.com/afreecatv*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537385/FMK%20%ED%8F%AC%ED%85%90%EC%A0%9C%EA%B1%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/537385/FMK%20%ED%8F%AC%ED%85%90%EC%A0%9C%EA%B1%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function modifyLayout() {
        // 광고 제거
        document.querySelectorAll('.content_widget, .adpost, [id^="fmad_wrapper"]').forEach(el => el.remove());

        const video = document.querySelector('video');
        if (!video) return;

        const wrapper = video.parentElement;

        // 1. "게시판 통계 + 서버 확장" 문구 찾기
        const infoText = Array.from(document.querySelectorAll('p')).find(p =>
            p.textContent.includes('게시판 통계')
        );

        // 2. "1:1 숲(SOOP)" 링크 부모 요소 찾기
        const inquiryLink = Array.from(document.querySelectorAll('a')).find(a =>
            a.textContent.includes('1:1 숲(SOOP)')
        );
        const inquiryWrapper = inquiryLink?.parentElement;

        if (!infoText || !inquiryWrapper) return;

        // 3. 둘 다 영상 아래로 이동하되, 순서: infoText → inquiryWrapper
        wrapper.appendChild(infoText);
        wrapper.appendChild(inquiryWrapper);

        clearInterval(interval); // 작업 완료 후 반복 중지
    }

    const interval = setInterval(modifyLayout, 500);
    setTimeout(() => clearInterval(interval), 5000);
})();
