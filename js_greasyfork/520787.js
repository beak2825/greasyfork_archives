// ==UserScript==
// @name         SOOP 채팅창 아이디 복사 버튼
// @namespace    https://www.sooplive.co.kr/
// @version      1.1
// @description  SOOP 채팅창에 아이디 복사 버튼을 추가합니다.
// @match        https://play.sooplive.co.kr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=play.sooplive.co.kr
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520787/SOOP%20%EC%B1%84%ED%8C%85%EC%B0%BD%20%EC%95%84%EC%9D%B4%EB%94%94%20%EB%B3%B5%EC%82%AC%20%EB%B2%84%ED%8A%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/520787/SOOP%20%EC%B1%84%ED%8C%85%EC%B0%BD%20%EC%95%84%EC%9D%B4%EB%94%94%20%EB%B3%B5%EC%82%AC%20%EB%B2%84%ED%8A%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList.contains('chatIct-card')) {
                        addCopyButton(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function addCopyButton(card) {
        let userId = card.getAttribute('user_id');
        userId = userId.replace(/\(\d+\)/g, ''); // 괄호 안의 숫자를 제거
        const menuList = card.querySelector('.menu-list');

        if (menuList) {
            const copyButton = document.createElement('button');
            copyButton.type = 'button';
            copyButton.id = 'copyUserId';
            copyButton.textContent = '아이디 복사';
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(userId).then(() => {
                    alert('아이디가 복사되었습니다: ' + userId);
                }).catch((err) => {
                    console.error('아이디 복사 실패: ', err);
                });
            });

            const listItem = document.createElement('li');
            listItem.appendChild(copyButton);
            menuList.insertBefore(listItem, menuList.firstChild);
        }
    }
})();

