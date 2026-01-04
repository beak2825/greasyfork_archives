// ==UserScript==
// @name         bettercrkcoupons
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  쿠킹덤 쿠폰 입력이 한층 더 쉬워집니다.
// @author       ㅇㅇ
// @match        https://coupon.devplay.com/coupon/ck/ko
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533605/bettercrkcoupons.user.js
// @updateURL https://update.greasyfork.org/scripts/533605/bettercrkcoupons.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const STORAGE_KEY = 'devplay_account';
    const SHEET_ID = '150lRLUqmcS15ccl1-cjX8bfex7StwCsOuUasVXvJqvo';
    const API_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

    let account = await GM_getValue(STORAGE_KEY, 'Ctrl+Shift+/ 로 MID 입력');

    // MID 자동 입력
    window.addEventListener('load', () => {
        const input = document.getElementById('account-box');
        if (input) {
            input.value = account;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }

        createSidebar();
        fetchCoupons();
    });

    // 단축키로 MID 입력
    document.addEventListener('keydown', async function (e) {
        if (e.ctrlKey && e.shiftKey && e.key === '?') {
            const newValue = prompt('MID 입력:', account);
            if (newValue !== null) {
                await GM_setValue(STORAGE_KEY, newValue);
                alert('적용 완료: 이제부터 사이트 접속 시 MID가 자동 입력됨');
            }
        }
    });

    function createSidebar() {
        const sidebar = document.createElement('div');
        sidebar.id = 'coupon-sidebar';
        sidebar.style.cssText = `
            position: fixed;
            top: 100px;
            left: 10px;
            width: 180px;
            max-height: 80vh;
            overflow-y: auto;
            background: #f9f9f9;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 9999;
            border-radius: 8px;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
            font-family: sans-serif;
        `;
        sidebar.innerHTML = `<div style="text-align:center;font-weight:bold;margin-bottom:8px;">쿠폰 목록</div>`;
        document.body.appendChild(sidebar);
    }

    async function fetchCoupons() {
        try {
            const res = await fetch(API_URL);
            const text = await res.text();
            const json = JSON.parse(text.match(/(?<=\().*(?=\);)/)[0]);

            const rows = json.table.rows;

            const coupons = rows.map(row => ({
                code: row.c[0]?.v || '',
                status: row.c[2]?.v || ''
            })).filter(c => c.code);

            renderCouponCards(coupons);
        } catch (err) {
            console.error('쿠폰 시트 로딩 실패:', err);
        }
    }

    function renderCouponCards(coupons) {
        const sidebar = document.getElementById('coupon-sidebar');
        if (!sidebar) return;

        coupons.forEach(({ code, status }) => {
            const card = document.createElement('div');
            card.textContent = code;
            card.style.cssText = `
                margin-bottom: 8px;
                padding: 8px;
                border-radius: 6px;
                background: ${status === 'O' ? '#ff9999' : '#e0e0e0'};
                font-weight: bold;
                text-align: center;
                word-break: break-all;
                user-select: none;
                cursor: pointer;
                border: 1px solid #ccc;
                transition: background 0.3s;
            `;

            card.addEventListener('click', () => {
                const inputBox = document.getElementById('code-box');
                if (inputBox) {
                    inputBox.value = code;
                    inputBox.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });

            sidebar.appendChild(card);
        });
    }
})();