// ==UserScript==
// @name          치지직 랜덤 라이브
// @namespace     치지직 랜덤 라이브
// @match         *://chzzk.naver.com/category/*
// @match         *://chzzk.naver.com/search?*
// @version       0.1
// @description   검색 창 혹은 카테고리에서 무작위 라이브 방송에 들어갑니다
// @icon          https://www.google.com/s2/favicons?sz=256&domain_url=chzzk.naver.com
// @author        mickey90427 <mickey90427@naver.com>
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/517053/%EC%B9%98%EC%A7%80%EC%A7%81%20%EB%9E%9C%EB%8D%A4%20%EB%9D%BC%EC%9D%B4%EB%B8%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/517053/%EC%B9%98%EC%A7%80%EC%A7%81%20%EB%9E%9C%EB%8D%A4%20%EB%9D%BC%EC%9D%B4%EB%B8%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 버튼 생성
    const button = document.createElement('button');
    button.innerText = "랜덤 라이브";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.left = "20px";
    button.style.zIndex = "99999"; // z-index를 최대한 높임
    button.style.padding = "10px";
    button.style.backgroundColor = "#ff0000"; // 빨간색 배경
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.3)"; // 그림자 추가
    document.body.appendChild(button);

    // 버튼 클릭 이벤트
    button.addEventListener("click", function() {
        // 모든 video_card_title__Amjk2 요소를 찾기
        const links = [...document.querySelectorAll('.video_card_title__Amjk2')]
            .map(a => a.href)
            .filter(href => href.includes('/live/')); // '/live/'가 포함된 링크만 필터링

        if (links.length > 0) {
            //console.log("Extracted Live Links:\n" + links.join("\n"));
            //alert("Live links extracted. Check the console for details.");

            // 랜덤한 링크 선택 후 새 탭에서 열기
            const randomLink = links[Math.floor(Math.random() * links.length)];
            window.open(randomLink, '_blank');
        } else {
            alert("라이브 링크 발견되지 않음.");
            //alert("No live links found.");
        }
    });
})();
