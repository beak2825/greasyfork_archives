// ==UserScript==
// @name         Zoho Desk FPT Popup
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hiển thị logo FPT ở góc phải và bật popup khi nhấn logo trên Zoho Desk
// @author       Bạn
// @match        https://desk.zoho.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537516/Zoho%20Desk%20FPT%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/537516/Zoho%20Desk%20FPT%20Popup.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("✅ Script FPT đã chạy");

    // Delay 2 giây để đảm bảo DOM đã load hết (do Zoho dùng SPA)
    setTimeout(() => {
        // Tạo nút logo
        const button = document.createElement('img');
        button.src = 'https://upload.wikimedia.org/wikipedia/commons/2/29/FPT_Education_logo.png';
        button.alt = 'FPT Logo';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.cursor = 'pointer';
        button.style.zIndex = 9999;

        // Tạo popup
        const popup = document.createElement('div');
        popup.textContent = 'Xin chào từ FPT!';
        popup.style.position = 'fixed';
        popup.style.bottom = '80px';
        popup.style.right = '20px';
        popup.style.padding = '10px';
        popup.style.background = 'white';
        popup.style.border = '1px solid black';
        popup.style.borderRadius = '5px';
        popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        popup.style.zIndex = 9999;
        popup.style.display = 'none';

        // Sự kiện click vào logo → bật/tắt popup
        button.addEventListener('click', () => {
            popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
        });

        // Gắn vào trang
        document.body.appendChild(button);
        document.body.appendChild(popup);
    }, 2000); // delay 2s
})();
