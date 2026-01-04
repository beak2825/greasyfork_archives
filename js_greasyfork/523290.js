// ==UserScript==
// @name         Add Comma to Viewer Nickname
// @namespace    https://chzzk-vote.vercel.app/
// @version      0.4
// @description  Add a comma after the viewer nickname in specific buttons
// @author       PowerNao
// @match        https://chzzk-vote.vercel.app/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523290/Add%20Comma%20to%20Viewer%20Nickname.user.js
// @updateURL https://update.greasyfork.org/scripts/523290/Add%20Comma%20to%20Viewer%20Nickname.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1초마다 버튼을 확인하여 쉼표 추가 (동적 페이지를 위해)
    setInterval(() => {
        // 버튼을 선택
        const buttons = document.querySelectorAll('button.sc-f0d59364-2');

        buttons.forEach((button) => {
            // 버튼의 텍스트 노드만 처리 (이미 쉼표가 추가된 경우는 제외)
            const nicknameNode = Array.from(button.childNodes).find(
                (node) => node.nodeType === Node.TEXT_NODE && !node.textContent.includes(',')
            );

            if (nicknameNode) {
                // 닉네임 뒤에 쉼표 추가
                nicknameNode.textContent = nicknameNode.textContent.trim() + ',';
            }
        });
    }, 1000);
})();
