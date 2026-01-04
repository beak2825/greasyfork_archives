// ==UserScript==
// @name         Zoho Desk FPT Popup
// @namespace    https://fpt.edu.vn/
// @version      1.0
// @description  Thêm nút FPT University hiện popup chào trên Zoho Desk
// @author       Minh Thanh
// @match        https://desk.zoho.com/agent/tharntien24/tharn-tien/tickets/list/all-cases
// @icon         https://upload.wikimedia.org/wikipedia/commons/2/29/FPT_Education_logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537512/Zoho%20Desk%20FPT%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/537512/Zoho%20Desk%20FPT%20Popup.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {
        // Tạo nút bằng logo FPT
        const button = document.createElement('img');
        button.src = 'https://upload.wikimedia.org/wikipedia/commons/2/29/FPT_Education_logo.png';
        button.alt = 'FPT';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.cursor = 'pointer';
        button.style.zIndex = 9999;
        button.style.borderRadius = '8px';
        button.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
        button.title = 'Bấm để chào';

        // Tạo popup
        const popup = document.createElement('div');
        popup.textContent = 'Xin chào bạn!';
        popup.style.position = 'fixed';
        popup.style.bottom = '80px';
        popup.style.right = '20px';
        popup.style.backgroundColor = '#fff';
        popup.style.border = '1px solid #ccc';
        popup.style.padding = '10px 15px';
        popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        popup.style.borderRadius = '8px';
        popup.style.zIndex = 9999;
        popup.style.display = 'none';
        popup.style.fontWeight = 'bold';

        // Sự kiện click
        button.addEventListener('click', () => {
            popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
        });

        document.body.appendChild(button);
        document.body.appendChild(popup);
    });
})();
