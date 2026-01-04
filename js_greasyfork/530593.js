// ==UserScript==
// @name         YouTube 임베디드 동영상 더보기 제거
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  유튜브 임베디드 동영상에서 '동영상 더보기' 오버레이를 제거합니다.
// @match        *://*/*
// @grant        none
// @author       physickskim
// @downloadURL https://update.greasyfork.org/scripts/530593/YouTube%20%EC%9E%84%EB%B2%A0%EB%94%94%EB%93%9C%20%EB%8F%99%EC%98%81%EC%83%81%20%EB%8D%94%EB%B3%B4%EA%B8%B0%20%EC%A0%9C%EA%B1%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/530593/YouTube%20%EC%9E%84%EB%B2%A0%EB%94%94%EB%93%9C%20%EB%8F%99%EC%98%81%EC%83%81%20%EB%8D%94%EB%B3%B4%EA%B8%B0%20%EC%A0%9C%EA%B1%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const css = `.ytp-pause-overlay { display: none !important; }`;
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
})();
