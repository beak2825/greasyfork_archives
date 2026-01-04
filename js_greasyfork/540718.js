// ==UserScript==
// @name         크래커 차감 팝업 표시기🍪
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  방금 먹은 크래커 양을 🍪로 표시하며, 중복 감지를 방지하고 스타일을 강조합니다.
// @match        https://crack.wrtn.ai/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540718/%ED%81%AC%EB%9E%98%EC%BB%A4%20%EC%B0%A8%EA%B0%90%20%ED%8C%9D%EC%97%85%20%ED%91%9C%EC%8B%9C%EA%B8%B0%F0%9F%8D%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/540718/%ED%81%AC%EB%9E%98%EC%BB%A4%20%EC%B0%A8%EA%B0%90%20%ED%8C%9D%EC%97%85%20%ED%91%9C%EC%8B%9C%EA%B8%B0%F0%9F%8D%AA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("[Cracker Delta Popup] 스크립트 시작됨");

    const LAST_KEY = 'wrtnCrackerLastValue';
    const POS_LEFT_KEY = 'wrtnCrackerDeltaPopup_left';
    const POS_TOP_KEY = 'wrtnCrackerDeltaPopup_top';

    const popup = document.createElement('div');
    popup.id = 'crackerDeltaPopup';
    popup.innerHTML = `
        <div style="font-weight:bold; margin-bottom:4px;">[방금 먹은 🍪양]</div>
        <div id="crackerDeltaAmount">-</div>
    `;
    document.body.appendChild(popup);

    GM_addStyle(`
        #crackerDeltaPopup {
            position: fixed;
            background: #fff3e0;
            color: #bf360c;
            border: 1px solid #ffcc80;
            border-radius: 10px;
            padding: 10px 14px;
            font-size: 14px;
            z-index: 99999;
            font-weight: bold;
            cursor: move;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            user-select: none;
            max-width: 220px;
        }
        #crackerDeltaAmount {
            font-size: 21px; /* 1.5배 크기 */
            color: red;
        }
    `);

    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    let lastShown = 0; // ✅ 이전에 표시한 값 저장용

    popup.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        const rect = popup.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        let left = e.clientX - offsetX;
        let top = e.clientY - offsetY;
        const maxW = window.innerWidth - popup.offsetWidth;
        const maxH = window.innerHeight - popup.offsetHeight;
        popup.style.left = Math.min(Math.max(0, left), maxW) + 'px';
        popup.style.top = Math.min(Math.max(0, top), maxH) + 'px';
    }

    function onMouseUp() {
        if (!isDragging) return;
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        localStorage.setItem(POS_LEFT_KEY, popup.offsetLeft);
        localStorage.setItem(POS_TOP_KEY, popup.offsetTop);
    }

    function restorePopupPosition() {
        const savedLeft = localStorage.getItem(POS_LEFT_KEY);
        const savedTop = localStorage.getItem(POS_TOP_KEY);
        if (savedLeft && savedTop) {
            popup.style.left = savedLeft + 'px';
            popup.style.top = savedTop + 'px';
        } else {
            popup.style.left = '20px';
            popup.style.top = '200px';
        }
    }

    function getCrackerCount() {
        const allP = document.querySelectorAll('p[color="text_primary"]');
        for (const p of allP) {
            const text = p.textContent?.trim();
            if (text && /^\d+[,]?\d*$/.test(text)) {
                return parseInt(text.replace(/[^0-9]/g, ''), 10);
            }
        }
        return null;
    }

    function updateDelta() {
        const now = getCrackerCount();
        if (now === null) return;

        const prev = parseInt(localStorage.getItem(LAST_KEY) || now.toString(), 10);
        const diff = prev - now;

        if (now < prev && diff !== lastShown) {
            document.getElementById('crackerDeltaAmount').textContent = `🍪${diff}개`;
            lastShown = diff;
        }

        if (now > prev) {
            // 크래커가 충전되었거나 복구된 경우 초기화
            lastShown = 0;
        }

        localStorage.setItem(LAST_KEY, now.toString());
    }

    restorePopupPosition();
    setInterval(updateDelta, 1000);
})();
