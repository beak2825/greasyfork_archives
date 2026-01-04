// ==UserScript==
// @name         DCInside Auto Dark Mode (Mobile)
// @namespace    https://m.dcinside.com
// @version      1.1
// @description  모바일 DCInside 다크 모드를 브라우저 설정에 맞춰 자동으로 전환
// @author       iwj9
// @match        https://m.dcinside.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539234/DCInside%20Auto%20Dark%20Mode%20%28Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539234/DCInside%20Auto%20Dark%20Mode%20%28Mobile%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * dark.css 없는 페이지들 있어서 추가 (디시콘, 상품권)
     * 다크모드 적용 안 되는 요소들은 수동으로 추가함
     */
    function ensureDarkCss() {
        if (!document.querySelector('link[href*="dark.css"]')) {
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://nstatic.dcinside.com/dc/m/css/dark.css';
            document.head.appendChild(cssLink);
            const style = document.createElement('style');
            style.id = 'tm-custom-dark-css';
            style.textContent = `
.darkmode #dcconList > li > a,
.darkmode span.thum-img > img,
.darkmode div.thum-img > span > img,
.darkmode #giftcard_frm > ul.form-minifx-txt {
    background-color: #000 !important;
}
.darkmode #dcconList > li > a > div.thum-txt > span.name,
.darkmode #dcconList > li > a > div.thum-txt > span.caption,
.darkmode #giftcard_frm > ul.form-minifx-txt > li {
    color: #ddd !important;
}
`;
            document.head.appendChild(style);
        }
    }


    function syncDarkMode() {
        // 사이트 자체의 set_darkmode 함수가 로드되었는지 확인
        if (typeof window.set_darkmode !== 'function')
            return;

        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isSiteDark = document.documentElement.classList.contains('darkmode');

        if (isSystemDark) {
            ensureDarkCss();
        }

        if (isSystemDark !== isSiteDark) {
            window.set_darkmode();
        }
    }

    // 더 이상 실시간으로 다크모드를 갱신하지 않음.  
    //window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncDarkMode);
    document.addEventListener('DOMContentLoaded', syncDarkMode);

})();