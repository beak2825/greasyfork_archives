
// ==UserScript==
// @name         클린티비위키(CleanTvwiki)
// @namespace    https://xlqldnlzl.site
// @version      2025-10-07
// @description  TVWIKI 광고 제거판 코드
// @author       You

// @include      /^https?:\/\/[^/]*tvwiki[^/]*\/.*$/
// @icon         https://assets.request-support.com/images/favicon/apple-icon-57x57.png
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/487606/%ED%81%B4%EB%A6%B0%ED%8B%B0%EB%B9%84%EC%9C%84%ED%82%A4%28CleanTvwiki%29.user.js
// @updateURL https://update.greasyfork.org/scripts/487606/%ED%81%B4%EB%A6%B0%ED%8B%B0%EB%B9%84%EC%9C%84%ED%82%A4%28CleanTvwiki%29.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function() {
  document.documentElement.requestFullscreen();
});

// 상단 공지 삭제
document.querySelectorAll('.notice').forEach(element => {
    element.remove();
});

// 메인 문구 삭제
document.querySelectorAll('.emer-content').forEach(element => {
    element.remove();
});

// 상단 메뉴 높이 수정
document.getElementById('header').style.height = '80px';

document.querySelectorAll('.top-menus').forEach(element => {
    element.style.height = '150px';
});

// 컨테이너 제목 높이 수정
document.querySelectorAll('.coordinates').forEach(element => {
    element.style.height = '50px';
});
// 컨테이너 제목 높이 수정
document.querySelectorAll('.title').forEach(element => {
    element.style.height = '50px';
});

// 영상별 높이
document.querySelectorAll('.main-ranking').forEach(element => {
    element.style.height = '474px';
});

// 재생 플레이어 여백 제거거
document.querySelectorAll('.playstart').forEach(element => {
    element.style.padding = '0';
});

// 재생 플레이어 상단 여백 없애기
document.querySelectorAll('.frame-video').forEach(element => {
    element.style.marginTop = '0';
});

// 재생 플레이어 제목 여백 수정
document.querySelectorAll('.player-header').forEach(element => {
    element.style.padding = '10px 0';
});

// 재생 플레이어 줄거리 삭제
document.querySelectorAll('#bo_v_atc').forEach(element => {
    element.remove();
});

// 재생 플레이어 배우 삭제
document.querySelectorAll('.cast').forEach(element => {
    element.remove();
});

// 재생 플레이어 댓글 삭제
document.querySelectorAll('.view-comment-area').forEach(element => {
    element.remove();
});

// 재생 전 공지사항 팝업 삭제
document.querySelectorAll('.over').forEach(element => {
    element.remove();
});


// 아래 다음화 항상 보이게
document.querySelectorAll('.video-remote').forEach(element => {
    element.style.display = 'block';

    element.style.bottom = '60px';
    element.style.width = '150px';
});

// 배너 이미지 삭제
(function() {
    'use strict';

    // 배너 이미지를 숨기는 함수
    function hideBannerImages() {
        document.querySelectorAll('img').forEach(img => {
            if (img.src.includes('banner')) {
                img.style.display = 'none';
            }
        });
    }

    // 페이지 로드 후 1회 실행
    hideBannerImages();

    // 동적으로 로드되는 배너(예: Ajax, SPA)를 감지해서 계속 적용
    const observer = new MutationObserver(hideBannerImages);
    observer.observe(document.body, { childList: true, subtree: true });
})();

