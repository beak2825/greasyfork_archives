// ==UserScript==
// @name         enbita fullscreen
// @namespace    enbita fullscreen
// @version      1.0
// @description  Automatically enter fullscreen when a page loads
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534422/enbita%20fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/534422/enbita%20fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 전체화면 요청 함수
    function enterFullscreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { // Safari
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE11
            elem.msRequestFullscreen();
        }
    }

    // 사용자의 상호작용이 필요하므로 트리거 버튼 삽입
    function createTriggerButton() {
        const btn = document.createElement('button');
        btn.textContent = '전체화면 시작';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = '9999';
        btn.style.padding = '10px';
        btn.style.backgroundColor = '#000';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.fontSize = '16px';
        btn.onclick = function () {
            enterFullscreen();
            btn.remove(); // 버튼은 한 번 누른 뒤 제거
        };
        document.body.appendChild(btn);
    }

    window.addEventListener('load', () => {
        createTriggerButton();
    });

})();