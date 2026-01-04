// ==UserScript==
// @name         CUSTOMER POSITION - Nut menu nhanh tren T24
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Them nut CUSTOMER POSITION vao frame MENU cua T24 (nam o duoi man hinh, mau xanh la)
// @match        *://*/BrowserWeb/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544378/CUSTOMER%20POSITION%20-%20Nut%20menu%20nhanh%20tren%20T24.user.js
// @updateURL https://update.greasyfork.org/scripts/544378/CUSTOMER%20POSITION%20-%20Nut%20menu%20nhanh%20tren%20T24.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Chi chay trong frame MENU
    if (!window.name.toLowerCase().includes('menu')) return;

    console.log('✅ Script CUSTOMER POSITION dang chay trong frame menu:', window.name);

    // Neu nut da ton tai thi khong tao lai
    if (document.getElementById('nut-customer-position')) return;

    // Ham tim va click theo href
    function clickTheoHref(doenqCode) {
        const all = document.getElementsByTagName('a');
        for (let i = 0; i < all.length; i++) {
            const href = all[i].getAttribute('href');
            if (href && typeof href === 'string' && href.includes(doenqCode)) {
                all[i].click();
                console.log("🟢 Da click: " + doenqCode);
                return;
            }
        }
        alert("❌ Khong tim thay menu chua: " + doenqCode);
    }

    // Tao nut UI
    const nut = document.createElement('button');
    nut.id = 'nut-customer-position';
    nut.innerText = 'CUSTOMER POSITION';
    Object.assign(nut.style, {
        position: 'fixed',
        bottom: '20px',          // 👉 Dưới cùng
        right: '20px',           // 👉 Gần mép phải
        zIndex: 9999,
        padding: '10px 15px',
        background: '#28a745',   // 👉 Màu xanh lá
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        fontSize: '14px'
    });

    nut.addEventListener('click', function() {
        clickTheoHref("ENQ CBS.CUSTOMER.POSITION.DETAIL");
    });

    document.body.appendChild(nut);

    // Alt + 3 de mo nhanh
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === '3') {
            clickTheoHref("ENQ CBS.CUSTOMER.POSITION.DETAIL");
        }
    });

    console.log("🚀 Nut CUSTOMER POSITION da duoc hien thi");
})();