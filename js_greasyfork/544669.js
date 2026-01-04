// ==UserScript==
// @name         zod.kr 닉네임으로 게시글 숨기기 (수정)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  zod.kr 게시판에서 지정된 닉네임("차단")을 사용하는 사용자의 게시글을 자동으로 숨깁니다.
// @author       Your Name
// @match        *://zod.kr/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544669/zodkr%20%EB%8B%89%EB%84%A4%EC%9E%84%EC%9C%BC%EB%A1%9C%20%EA%B2%8C%EC%8B%9C%EA%B8%80%20%EC%88%A8%EA%B8%B0%EA%B8%B0%20%28%EC%88%98%EC%A0%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544669/zodkr%20%EB%8B%89%EB%84%A4%EC%9E%84%EC%9C%BC%EB%A1%9C%20%EA%B2%8C%EC%8B%9C%EA%B8%80%20%EC%88%A8%EA%B8%B0%EA%B8%B0%20%28%EC%88%98%EC%A0%95%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 설정 ---
    // 숨기고 싶은 닉네임을 이곳에 추가하세요.
    const blockedUsernames = ["차단"];

    // --- 핵심 기능 ---

    // 게시글을 검사하고 차단된 사용자의 글을 숨기는 함수
    function hideBlockedPosts() {
        // 1. 모든 게시글 목록(li 태그)을 가져옵니다.
        // 클래스 이름이 zod-board-list--free, --community 등 다양하므로 공통된 부분만 사용합니다.
        const posts = document.querySelectorAll('ul.app-board-template-list > li');

        posts.forEach(post => {
            // 3. 각 게시글(li) 내에서 닉네임이 포함된 요소를 찾습니다.
            // 실제 HTML 구조에 맞춰, class가 "member_"로 시작하는 div를 찾도록 수정했습니다.
            const nicknameElement = post.querySelector('div[class^="member_"]');

            // 4. 닉네임 요소가 존재하고, 그 내용이 차단 목록에 포함되어 있는지 확인합니다.
            if (nicknameElement && blockedUsernames.includes(nicknameElement.textContent.trim())) {
                // 5. 조건에 맞으면 해당 게시글(li) 전체를 보이지 않게 처리합니다.
                post.style.display = 'none';
            }
        });
    }

    // --- 스크립트 실행 및 동적 콘텐츠 감시 ---

    // 페이지가 동적으로 변경될 때를 감지하기 위한 MutationObserver 설정
    // 대상 노드를 찾을 때까지 주기적으로 시도합니다.
    function setupObserver() {
        // 감시를 시작할 대상을 지정합니다. 게시판 전체를 감싸는 컨테이너입니다.
        // ID 'board-list' 대신 더 확실한 클래스 선택자로 변경했습니다.
        const targetNode = document.querySelector('.app-board-section');

        if (targetNode) {
            const observer = new MutationObserver(() => {
                // 변경이 감지되면 다시 숨김 함수를 실행합니다.
                hideBlockedPosts();
            });

            observer.observe(targetNode, {
                childList: true, // 자식 요소의 추가/제거를 감시
                subtree: true    // 자손 요소까지 모두 감시
            });

            // 페이지가 처음 로드되었을 때 한 번 실행하여 이미 있는 게시글을 처리합니다.
            hideBlockedPosts();
        } else {
            // 대상 노드를 아직 찾지 못했다면 0.5초 후에 다시 시도합니다.
            setTimeout(setupObserver, 500);
        }
    }

    // 스크립트 실행 시작
    setupObserver();

})();
