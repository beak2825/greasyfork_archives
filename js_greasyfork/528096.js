// ==UserScript==
// @name         중고나라 VIP 게시글 제거 스크립트
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  중고나라 VIP 회원의 게시글을 표시하지 않습니다.
// @match        *://cafe.naver.com/Article*List.nhn?search.clubid=10050146&*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528096/%EC%A4%91%EA%B3%A0%EB%82%98%EB%9D%BC%20VIP%20%EA%B2%8C%EC%8B%9C%EA%B8%80%20%EC%A0%9C%EA%B1%B0%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/528096/%EC%A4%91%EA%B3%A0%EB%82%98%EB%9D%BC%20VIP%20%EA%B2%8C%EC%8B%9C%EA%B8%80%20%EC%A0%9C%EA%B1%B0%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeRows() {
        const vipImages = document.querySelectorAll('img[src="https://cafe.pstatic.net/levelicon/1/1_150.gif"][width="11"][height="11"]');

        vipImages.forEach(img => {
            const pnickTr = img.closest('tr');
            if (pnickTr) {
                const outerTr = pnickTr.parentElement.closest('tr');
                if (outerTr) {
                    outerTr.remove();
                }
            }
        });
    }

    removeRows();

    const observer = new MutationObserver(removeRows);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();