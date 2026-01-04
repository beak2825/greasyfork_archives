// ==UserScript==
// @name         네이버 카페 동영상 반복재생 옵션 추가
// @namespace    http://cafe.naver.com/video
// @version      1.5
// @description  네이버 카페 동영상에 반복 재생 버튼 추가 (녹색 활성화, 흰색 비활성화)
// @author       ExplainPark
// @match        https://cafe.naver.com/ca-fe/cafes/*/articles/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540033/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EB%8F%99%EC%98%81%EC%83%81%20%EB%B0%98%EB%B3%B5%EC%9E%AC%EC%83%9D%20%EC%98%B5%EC%85%98%20%EC%B6%94%EA%B0%80.user.js
// @updateURL https://update.greasyfork.org/scripts/540033/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EB%8F%99%EC%98%81%EC%83%81%20%EB%B0%98%EB%B3%B5%EC%9E%AC%EC%83%9D%20%EC%98%B5%EC%85%98%20%EC%B6%94%EA%B0%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NAVER_GREEN = '#03C75A';

    // 버튼 기본 숨김, hover/focus 시 표시
    GM_addStyle(`
        .pzp-pc__autorepeat-button {
            transition: 100ms;
            opacity: 0;
        }
        .pzp-pc--playing:is(:hover) .pzp-pc__autorepeat-button {
            opacity: 1 !important;
        }
    `);

    // 끝날 때 반복 재생 로직
    function setupLoop(video) {
        video.addEventListener('ended', () => {
            if (video.dataset.loop === 'true') {
                video.currentTime = 0;
                video.play();
            }
        });
    }

    // 반복 재생 버튼 생성
    function createLoopButton(video) {
        const seVideo = video.closest('.se-video');
        if (!seVideo) return;

        const btnContainer = seVideo.querySelector('.pzp-pc__bottom-buttons > .pzp-pc__bottom-buttons-right');
        if (!btnContainer || btnContainer.querySelector('.pzp-pc__autorepeat-button')) return;

        // 버튼 요소
        const btn = document.createElement('button');
        btn.title = "반복재생";
        btn.className = 'pzp-button pzp-setting-button pzp-pc-setting-button pzp-pc__autorepeat-button';
        btn.type = 'button';
        Object.assign(btn.style, {
            padding: '0',
            marginLeft: '4px',
            display: 'flex',
            alignItems: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
        });

        // SVG 아이콘
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', 'M7 7V3L3 7l4 4V8.1c3.39.49 6 3.39 6 6.9 0 3.31-2.69 6-6 6s-6-2.69-6-6H1c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.08-3.05-7.44-7-7.92z M17 17v4l4-4-4-4v2.1c-3.39-.49-6-3.39-6-6.9 0-3.31 2.69-6 6-6s6 2.69 6 6h2c0-4.42-3.58-8-8-8s-8 3.58-8 8c0 4.08 3.05 7.44 7 7.92z');
        svg.appendChild(path);
        btn.appendChild(svg);
        btnContainer.insertAdjacentElement("afterBegin", btn);

        // 클릭 시 토글
        btn.addEventListener('click', () => {
            const active = video.dataset.loop === 'true';
            video.dataset.loop = active ? 'false' : 'true';
            updateIcon();
        });

        // 아이콘 색상 업데이트
        function updateIcon() {
            const active = video.dataset.loop === 'true';
            path.setAttribute('fill', active ? NAVER_GREEN : '#fff');
        }

        updateIcon();
    }

    // 초기화 함수
    function init() {
        document.querySelectorAll('.se-video video').forEach(video => {
            if (!video.dataset.loopSetup) {
                video.dataset.loop = 'false';
                setupLoop(video);
                createLoopButton(video);
                video.dataset.loopSetup = 'true';
            }
        });
    }

    document.addEventListener('DOMContentLoaded', init);
    setInterval(init, 2000);
})();
