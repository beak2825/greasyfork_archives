// ==UserScript==
// @name         주소창 자동 숨김/표시
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  스크롤에 따라 크롬 주소창을 숨기거나 표시합니다
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516718/%EC%A3%BC%EC%86%8C%EC%B0%BD%20%EC%9E%90%EB%8F%99%20%EC%88%A8%EA%B9%80%ED%91%9C%EC%8B%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/516718/%EC%A3%BC%EC%86%8C%EC%B0%BD%20%EC%9E%90%EB%8F%99%20%EC%88%A8%EA%B9%80%ED%91%9C%EC%8B%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastScrollTop = 0;
    const delta = 5;
    let ticking = false;

    function hideShowAddressBar() {
        const st = window.pageYOffset;

        if (Math.abs(lastScrollTop - st) <= delta) return;

        if (st > lastScrollTop && st > 50) {
            // 아래로 스크롤
            window.scrollTo(0, 1);
        } else if (st + window.innerHeight < document.documentElement.scrollHeight) {
            // 위로 스크롤
            window.scrollTo(0, 0);
        }

        lastScrollTop = st <= 0 ? 0 : st;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                hideShowAddressBar();
                ticking = false;
            });

            ticking = true;
        }
    });
})();