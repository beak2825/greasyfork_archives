// ==UserScript==
// @name         QnA 게시글 자동 이동
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  페이지 로드 시 게시물 확인, 게시물 없으면 자동 새로고침, 엔터키 누르면 이동, 1키로 메인 페이지 복귀
// @author       You
// @match        https://www.a-ha.io/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529081/QnA%20%EA%B2%8C%EC%8B%9C%EA%B8%80%20%EC%9E%90%EB%8F%99%20%EC%9D%B4%EB%8F%99.user.js
// @updateURL https://update.greasyfork.org/scripts/529081/QnA%20%EA%B2%8C%EC%8B%9C%EA%B8%80%20%EC%9E%90%EB%8F%99%20%EC%9D%B4%EB%8F%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 상태 저장 변수
    let isWaitingForPosts = false;  // 게시물이 나타날 때까지 대기 중인지
    let isRedirecting = false;      // 페이지 이동 중인지
    let refreshTimer = null;        // 새로고침 타이머
    let postCount = 0;              // 게시물 개수

    // 메인 페이지 URL (1키를 누를 때 이동할 URL)
    const MAIN_PAGE_URL = 'https://www.a-ha.io/?feed=answer&sub=everyone&answerType=unanswered';

    // 현재 메인 페이지인지 확인하는 함수
    function isMainPage() {
        return window.location.href.includes('feed=answer&sub=everyone&answerType=unanswered');
    }

    // 디버깅을 위한 상태 표시 요소 추가
    function addStatusDisplay() {
        let statusDiv = document.getElementById('monitor-status');

        // 이미 존재하면 반환
        if (statusDiv) return statusDiv;

        // 없으면 새로 생성
        statusDiv = document.createElement('div');
        statusDiv.id = 'monitor-status';
        statusDiv.style.position = 'fixed';
        statusDiv.style.top = '10px';
        statusDiv.style.right = '10px';
        statusDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        statusDiv.style.color = 'white';
        statusDiv.style.padding = '10px';
        statusDiv.style.borderRadius = '5px';
        statusDiv.style.zIndex = '9999';
        statusDiv.style.fontFamily = 'Arial, sans-serif';
        statusDiv.style.fontSize = '14px';
        statusDiv.innerHTML = '초기화 중...';
        document.body.appendChild(statusDiv);
        return statusDiv;
    }

    // 상태 표시 업데이트 함수
    function updateStatus(message, bgColor = 'rgba(0, 0, 0, 0.7)') {
        const statusDiv = document.getElementById('monitor-status') || addStatusDisplay();
        statusDiv.innerHTML = message;
        statusDiv.style.backgroundColor = bgColor;
    }

    // 게시글 확인 함수
    function checkPosts() {
        if (!isMainPage()) {
            updateStatus('메인 페이지가 아닙니다.<br>1키를 누르면 메인으로 돌아갑니다.', 'rgba(128, 128, 0, 0.7)');
            return;
        }

        const posts = document.querySelectorAll('div.css-1xc0fl5');
        postCount = posts.length;

        if (postCount === 0) {
            // 게시물이 없는 경우
            updateStatus(`게시물이 없습니다. 자동 새로고침 중...<br>${new Date().toLocaleTimeString()}`, 'rgba(0, 0, 255, 0.7)');

            // 게시물 대기 모드 활성화
            isWaitingForPosts = true;

            // 1.8초에서 2.0초 사이의 랜덤한 시간 후 새로고침
            const randomDelay = Math.floor(Math.random() * 201) + 1800; // 1800ms ~ 2000ms
            refreshTimer = setTimeout(() => {
                if (isWaitingForPosts && !isRedirecting) {
                    updateStatus('페이지 새로고침 중...');
                    location.reload();
                }
            }, randomDelay);
        } else {
            // 게시물이 있는 경우
            updateStatus(`게시물 ${postCount}개 발견!<br>엔터키를 눌러 최신 게시물로 이동`, 'rgba(0, 128, 0, 0.7)');

            // 게시물 대기 모드가 활성화되어 있었다면 (처음 로드 시 게시물이 없었다면)
            if (isWaitingForPosts) {
                isWaitingForPosts = false;
                redirectToLatestPost(posts);
            }
        }
    }

    // 게시글로 이동하는 함수
    function redirectToLatestPost(posts) {
        if (isRedirecting) return;

        isRedirecting = true; // 중복 리다이렉트 방지

        // 타이머 중지
        if (refreshTimer) {
            clearTimeout(refreshTimer);
            refreshTimer = null;
        }

        updateStatus(`가장 최신 게시글로 이동 중...`, 'rgba(0, 128, 0, 0.7)');

        console.log(`게시글 ${posts.length}개 발견! 가장 최신 게시글로 이동합니다.`);

        // 마지막(가장 최신) 게시글 선택
        const lastPost = posts[posts.length - 1];

        try {
            // 게시글의 링크 찾기 - 여러 방법 시도
            // 1. 답변하기 버튼 찾기
            const answerButton = lastPost.querySelector('button.css-tuvd54');

            if (answerButton) {
                // 버튼에서 URL 추출이 어려울 수 있으므로 다른 요소에서 정보 추출
                // 게시글 제목에서 정보 추출 시도
                const questionTitle = lastPost.querySelector('.css-1j6eql0') || lastPost.querySelector('.css-mq1lnh span');

                if (questionTitle) {
                    // 알림 표시
                    updateStatus(`게시글 제목: "${questionTitle.textContent}"<br>클릭 이벤트 시뮬레이션 중...`);

                    // 클릭 이벤트 시뮬레이션
                    setTimeout(() => {
                        answerButton.click();
                        console.log('답변하기 버튼 클릭됨');
                    }, 500);
                    return;
                }
            }

            // 2. 다른 클릭 가능한 요소 찾기
            const clickableElement = lastPost.querySelector('a') || lastPost.querySelector('.css-1j6eql0') || lastPost;

            if (clickableElement) {
                // 알림 표시
                updateStatus(`클릭 가능한 요소 발견! 클릭 중...`);

                // 클릭 이벤트 시뮬레이션
                setTimeout(() => {
                    clickableElement.click();
                    console.log('클릭 가능한 요소 클릭됨');
                }, 500);
                return;
            }

            // 3. 위 방법이 모두 실패할 경우 - 사용자에게 알림
            updateStatus(`게시글 발견! 하지만 자동 이동 실패.<br>수동으로 클릭해주세요.`, 'rgba(255, 165, 0, 0.7)');

            // 소리 알림 추가
            const audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
            audio.play().catch(e => console.log('오디오 재생 실패:', e));

        } catch (error) {
            console.error('게시글 이동 중 오류 발생:', error);
            updateStatus(`오류 발생: ${error.message}<br>수동으로 확인해주세요.`, 'rgba(255, 0, 0, 0.7)');
            isRedirecting = false;
        }
    }

    // 메인 페이지로 이동하는 함수
    function goToMainPage() {
        updateStatus('메인 페이지로 이동 중...', 'rgba(0, 0, 255, 0.7)');
        window.location.href = MAIN_PAGE_URL;
    }

    // 키보드 이벤트 처리
    function setupKeyboardControls() {
        document.addEventListener('keydown', function(event) {
            // 엔터키 처리
            if (event.key === 'Enter' && postCount > 0 && !isRedirecting && !isWaitingForPosts && isMainPage()) {
                const posts = document.querySelectorAll('div.css-1xc0fl5');
                redirectToLatestPost(posts);
            }
            // 1키 - 메인 페이지로 돌아가기
            else if (event.key === '1') {
                // 이미 메인 페이지면 새로고침
                if (isMainPage()) {
                    isWaitingForPosts = false;
                    isRedirecting = false;
                    if (refreshTimer) {
                        clearTimeout(refreshTimer);
                        refreshTimer = null;
                    }
                    location.reload();
                } else {
                    goToMainPage();
                }
            }
            // ESC 키 - 자동 새로고침 중지
            else if (event.key === 'Escape') {
                // 새로고침 중지
                if (refreshTimer) {
                    clearTimeout(refreshTimer);
                    refreshTimer = null;
                }
                isWaitingForPosts = false;

                updateStatus('자동 새로고침 중지됨.<br>엔터키를 눌러 게시물로 이동<br>1키를 눌러 다시 시작', 'rgba(128, 0, 0, 0.7)');
            }
        });
    }

    // 페이지 로드 완료 후 실행
    function init() {
        console.log("QnA 모니터링 스크립트가 로드되었습니다.");

        // 상태 표시 추가
        addStatusDisplay();

        // 키보드 컨트롤 설정
        setupKeyboardControls();

        // 메인 페이지에서만 초기 확인 실행
        if (isMainPage()) {
            updateStatus('페이지 로드 완료. 게시물 확인 중...');

            // 게시글 확인 (자동으로 실행)
            setTimeout(() => {
                checkPosts();
            }, 1000); // 페이지가 완전히 로드된 후 실행하기 위해 약간의 지연 추가
        } else {
            updateStatus('메인 페이지가 아닙니다.<br>1키를 누르면 메인으로 돌아갑니다.', 'rgba(128, 128, 0, 0.7)');
        }
    }

    // 페이지 로드 또는 URL 변경 시 초기화
    window.addEventListener('load', init);

    // 페이지 로드가 이미 완료된 경우에도 실행
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 100);
    }
})();