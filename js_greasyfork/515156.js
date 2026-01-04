// ==UserScript==
// @name        [루시퍼홍] 상권 핀 삭제
// @namespace   Violentmonkey Scripts
// @match       *://hogangnono.com/*
// @grant       none
// @version     1.00
// @author      루시퍼홍
// @description 2024. 5. 3. 오후 14:05:18
// @downloadURL https://update.greasyfork.org/scripts/515156/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%83%81%EA%B6%8C%20%ED%95%80%20%EC%82%AD%EC%A0%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/515156/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%83%81%EA%B6%8C%20%ED%95%80%20%EC%82%AD%EC%A0%9C.meta.js
// ==/UserScript==


window.onload = () => {
    console.log("스크립트 동작 중...");

    // MutationObserver 설정
    const observer = new MutationObserver(() => {
        const toolGroup = document.querySelector('.tool-group');

        if (toolGroup) {
            console.log(".tool-group 요소를 찾았습니다.");

            // 버튼 요소 생성 및 설정
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '핀 삭제';
            deleteButton.className = 'css-191hamz e10ldppk1';
            deleteButton.style.marginTop = '10px';

            // 버튼 클릭 시 .pin 요소들을 삭제하는 이벤트 리스너 추가
            deleteButton.addEventListener('click', () => {
                document.querySelectorAll('.pin').forEach(pin => pin.remove());
                console.log('.pin 요소들이 삭제되었습니다.');
            });

            // .tool-group의 자식 요소로 버튼 추가
            toolGroup.appendChild(deleteButton);

            // observer를 중지하여 더 이상 실행하지 않도록 합니다.
            observer.disconnect();
        }
    });

    // observer 시작 - document의 변경 사항을 감지
    observer.observe(document, { childList: true, subtree: true });
};
