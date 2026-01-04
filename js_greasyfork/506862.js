// ==UserScript==
// @name         YouTube 댓글에 현재 시간 입력 버튼
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  YouTube 댓글 이모티콘 버튼 옆에 현재 시간을 자동으로 입력하는 버튼을 추가합니다.
// @author       ChatGPT
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506862/YouTube%20%EB%8C%93%EA%B8%80%EC%97%90%20%ED%98%84%EC%9E%AC%20%EC%8B%9C%EA%B0%84%20%EC%9E%85%EB%A0%A5%20%EB%B2%84%ED%8A%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/506862/YouTube%20%EB%8C%93%EA%B8%80%EC%97%90%20%ED%98%84%EC%9E%AC%20%EC%8B%9C%EA%B0%84%20%EC%9E%85%EB%A0%A5%20%EB%B2%84%ED%8A%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 버튼을 추가하는 함수
    function addTimeButton() {
        // 기존에 버튼이 추가되어 있는지 확인
        if (document.getElementById('insert-time-button')) return;

        // 이모티콘 버튼을 찾기
        const emojiButton = document.querySelector('button.yt-spec-button-shape-next[aria-label="그림 이모티콘 선택도구 표시"]');

        if (!emojiButton) {
            // 이모티콘 버튼을 찾을 수 없으면 일정 시간 후 다시 시도
            setTimeout(addTimeButton, 1000);
            return;
        }

        // 버튼 요소 생성
        const button = document.createElement('button');
        button.id = 'insert-time-button';
        button.innerText = 'TIME'; // 텍스트를 'TIME'으로 변경
        button.style.marginLeft = '5px'; // 이모티콘 버튼과 간격 조정
        button.style.cursor = 'pointer';
        button.style.padding = '2px 8px'; // 세로 길이를 약간 줄임
        button.style.fontSize = '12px';
        button.style.backgroundColor = '#272727'; // 유튜브와 일관된 짙은 회색 배경
        button.style.color = '#FFFFFF'; // 흰색 글씨
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.transition = 'background-color 0.3s'; // 마우스오버 애니메이션

        // 마우스오버 시 배경색 변경
        button.onmouseover = () => button.style.backgroundColor = '#3e3e3e'; // 마우스오버 시 배경색 변경
        button.onmouseout = () => button.style.backgroundColor = '#272727'; // 마우스 아웃 시 원래 배경색 복원

        // 버튼 클릭 시 동작
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // 이벤트 버블링 방지, 이모티콘 버튼 클릭 방지

            // 현재 동영상의 시간을 가져옴
            const video = document.querySelector('video');
            if (!video) {
                alert('동영상을 찾을 수 없습니다.');
                return;
            }

            const currentTime = video.currentTime;
            const formattedTime = formatTime(currentTime);

            // 댓글 입력란에 시간을 입력
            const commentBox = document.querySelector('#contenteditable-root');
            if (commentBox) {
                commentBox.focus();
                document.execCommand('insertText', false, formattedTime);
            } else {
                alert('댓글 입력란을 찾을 수 없습니다.');
            }
        });

        // 이모티콘 버튼 옆에 버튼 추가
        emojiButton.parentElement.insertBefore(button, emojiButton.nextSibling);
    }

    // 초 단위를 시:분:초 형식으로 변환하는 함수
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        // 시간이 0인 경우 시:분:초 형식에서 시간 부분을 생략
        if (hours === 0) {
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 페이지 로드 시 버튼 추가
    window.addEventListener('load', addTimeButton);
    // YouTube SPA(싱글 페이지 애플리케이션) 환경 대응
    const observer = new MutationObserver(addTimeButton);
    observer.observe(document.body, { childList: true, subtree: true });
})();
