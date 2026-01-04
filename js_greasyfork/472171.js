// ==UserScript==
// @name          Toptoon Direct Link Fixer
// @namespace     Toptoon Direct Link Fixer
// @match         *://*toptoon.com/my/myList*
// @version       0.1
// @description   탑툰의 내가 본 웹툰, 알림목록, 즐겨찾기 의 모든 링크를 '직접 링크'로 수정합니다. 즉 '우클릭 → T'를 눌러서 새 탭에 열 수 있게 됩니다. (선물함 링크 제외)
// @icon          https://smurfs.akamaized.net/assets/favicon/android-icon-192x192.png
// @author        mickey90427 <mickey90427@naver.com>
// @downloadURL https://update.greasyfork.org/scripts/472171/Toptoon%20Direct%20Link%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/472171/Toptoon%20Direct%20Link%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 함수 정의
    function modifyLinks() {
        // 모든 만화 링크 선택
        let links = document.querySelectorAll('a.jsComicObj');
        for (let link of links) {
            // data-link 속성 추출
            let dataLink = link.getAttribute('data-link');
            if (dataLink) {
                // 링크 수정
                link.href = 'https://toptoon.com' + dataLink;
            }
        }
    }

    // DOM 변경 감지
    let observer = new MutationObserver(modifyLinks);
    observer.observe(document.body, {childList: true, subtree: true});

    // 초기 실행
    modifyLinks();
})();
