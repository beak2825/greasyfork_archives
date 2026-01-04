// ==UserScript==
// @name         Wrtn 크래커 팝업 (채팅별 표시)
// @namespace    
// @version      1.4
// @description  크래커 잔여 수치 및 채팅별 사용 가능 횟수와 사용량을 표시합니다.
// @match        https://crack.wrtn.ai/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539064/Wrtn%20%ED%81%AC%EB%9E%98%EC%BB%A4%20%ED%8C%9D%EC%97%85%20%28%EC%B1%84%ED%8C%85%EB%B3%84%20%ED%91%9C%EC%8B%9C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539064/Wrtn%20%ED%81%AC%EB%9E%98%EC%BB%A4%20%ED%8C%9D%EC%97%85%20%28%EC%B1%84%ED%8C%85%EB%B3%84%20%ED%91%9C%EC%8B%9C%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'wrtnSuperchatBaseValue';
    const PRICES = {
        하이퍼챗: 175,
        슈퍼챗: 35,
        파워챗: 15
    };
    let hasAutoReset = false;

    // ✅ 팝업 생성
    const popup = document.createElement('div');
    popup.id = 'wrtnSuperchatPopup';
    popup.innerHTML = `
        <div id="superchatTop">
            <div id="superchatIcon">💬</div>
            <div id="superchatValue">-</div>
            <button id="superchatReset">리셋</button>
            <div id="superchatUsage" style="color: red; margin-left: auto;">[사용량: -]</div>
        </div>
        <div id="superchatBreakdown"></div>
    `;
    document.body.appendChild(popup);

    // ✅ 스타일 정의
    GM_addStyle(`
        #wrtnSuperchatPopup {
            position: fixed;
            bottom: 180px;
            right: 20px;
            background: #fff8e1;
            color: #333;
            border: 1px solid #f5c35c;
            border-radius: 12px;
            padding: 10px 16px;
            font-size: 15px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 8px;
            box-shadow: 0 6px 10px rgba(0,0,0,0.2);
            font-weight: bold;
            max-width: 300px;
        }
        #superchatTop {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        #wrtnSuperchatPopup svg {
            width: 20px;
            height: 20px;
        }
        #superchatReset {
            margin-left: auto;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 13px;
        }
        #superchatBreakdown {
            font-size: 13px;
            line-height: 1.4;
        }
    `);

    function getSuperchatInfo() {
        const header = [...document.querySelectorAll('.css-5w39sj')]
            .find(p => p.textContent.includes('나의 크래커'));
        if (!header) return null;

        const box = header.closest('.css-j7qwjs')?.querySelector('.css-1dib65l');
        if (!box) return null;

        const iconSvg = box.querySelector('svg');
        const numberText = box.querySelector('p.css-1xke5yy')?.textContent?.trim();
        const number = parseInt(numberText?.replace(/[^0-9]/g, '') || '0', 10);

        return { iconSvg, number };
    }

    function updatePopup() {
        const info = getSuperchatInfo();
        if (!info) return;

        const iconContainer = document.getElementById('superchatIcon');
        const valueContainer = document.getElementById('superchatValue');
        const usageContainer = document.getElementById('superchatUsage');
        const breakdownContainer = document.getElementById('superchatBreakdown');

        if (info.iconSvg) {
            const clonedIcon = info.iconSvg.cloneNode(true);
            iconContainer.innerHTML = '';
            iconContainer.appendChild(clonedIcon);
        }

        valueContainer.textContent = info.number;

        if (!hasAutoReset) {
            localStorage.setItem(STORAGE_KEY, info.number.toString());
            hasAutoReset = true;
        }

        const baseValue = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
        const diff = baseValue - info.number;
        usageContainer.textContent = `[사용량: ${diff}]`;

        // 가능 횟수 및 사용량 계산
        const lines = [];

        for (const [label, cost] of Object.entries(PRICES)) {
            const available = Math.floor(info.number / cost);
            const used = Math.floor(diff / cost);
            lines.push(`${label}: ${available}회 가능 | 사용 ${used}회`);
        }

        breakdownContainer.innerHTML = lines.join('<br>');
    }

    // ✅ 리셋 버튼
    document.getElementById('superchatReset').addEventListener('click', () => {
        const current = parseInt(document.getElementById('superchatValue').textContent || '0', 10);
        localStorage.setItem(STORAGE_KEY, current.toString());
        updatePopup();
    });

    // ✅ 정기 검사 (1초 간격)
    setInterval(() => {
        const found = getSuperchatInfo();
        if (found) updatePopup();
    }, 1000);
})();
