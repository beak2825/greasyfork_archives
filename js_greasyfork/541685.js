// ==UserScript==
// @name         Tool UgPhone PRO MAX (Mobile UI)
// @namespace    https://ugphone.com/
// @version      2.1
// @description  Tự động đăng nhập và mua máy trên UgPhone - hỗ trợ mobile
// @author       Hieu Dep Zai
// @match        *://*.ugphone.com/toc-portal/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/541685/Tool%20UgPhone%20PRO%20MAX%20%28Mobile%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541685/Tool%20UgPhone%20PRO%20MAX%20%28Mobile%20UI%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isMobile = window.innerWidth < 600;

    // === Tạo container menu chính ===
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = isMobile ? '50px' : '60px';
    menu.style.right = isMobile ? '10px' : '20px';
    menu.style.zIndex = '9999';
    menu.style.background = 'white';
    menu.style.border = '1px solid #ccc';
    menu.style.padding = '10px';
    menu.style.borderRadius = '10px';
    menu.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    menu.style.width = isMobile ? '90%' : '400px';
    menu.style.maxWidth = '95vw';
    menu.style.display = 'none';
    menu.style.fontSize = isMobile ? '14px' : '16px';

    // === Nút toggle menu ===
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '🧩 MENU';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.bottom = isMobile ? '100px' : '550px';
    toggleBtn.style.right = isMobile ? '10px' : '20px';
    toggleBtn.style.padding = isMobile ? '8px 12px' : '10px 15px';
    toggleBtn.style.borderRadius = '20px';
    toggleBtn.style.border = 'none';
    toggleBtn.style.background = '#007bff';
    toggleBtn.style.color = 'white';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.zIndex = '9999';
    document.body.appendChild(toggleBtn);

    toggleBtn.onclick = () => {
        menu.style.display = (menu.style.display === 'none') ? 'block' : 'none';
    };

    // === Các phần tử trong Menu ===
    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Dán localStorage JSON tại đây...';
    textarea.rows = 6;
    textarea.style.width = '100%';
    textarea.style.resize = 'vertical';
    textarea.style.fontSize = isMobile ? '13px' : '14px';
    textarea.value = GM_getValue('lastInput', '');

    const btnLogin = document.createElement('button');
    btnLogin.textContent = '✅ Đăng Nhập';
    btnLogin.style.marginTop = '8px';
    btnLogin.style.width = '100%';

    const btnClearJson = document.createElement('button');
    btnClearJson.textContent = '🗑️ Xoá JSON';
    btnClearJson.style.marginTop = '6px';
    btnClearJson.style.width = '100%';
    btnClearJson.style.background = '#dc3545';
    btnClearJson.style.color = 'white';

    const countryLabel = document.createElement('label');
    countryLabel.textContent = '🌐 Quốc gia:';

    const selectCountry = document.createElement('select');
    selectCountry.style.width = '100%';
    ['hk', 'sg', 'de', 'us', 'jp'].forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c.toUpperCase();
        selectCountry.appendChild(opt);
    });

    const btnBuy = document.createElement('button');
    btnBuy.textContent = '🛒 Tự động Mua Máy';
    btnBuy.style.marginTop = '10px';
    btnBuy.style.width = '100%';
    btnBuy.style.background = '#28a745';
    btnBuy.style.color = 'white';

    // === Xử lý sự kiện ===
    btnLogin.onclick = () => {
        try {
            const parsed = JSON.parse(textarea.value);
            if (parsed.hasOwnProperty('userFloatInfo')) delete parsed.userFloatInfo;
            localStorage.clear();
            for (const key in parsed) {
                localStorage.setItem(key, parsed[key]);
            }
            GM_setValue('lastInput', textarea.value);
            showNotice("✅ Đăng nhập thành công! Reload sau 2s...");
            setTimeout(() => location.reload(), 2000);
        } catch (e) {
            showNotice("❌ JSON không hợp lệ!", true);
        }
    };

    btnClearJson.onclick = () => {
        textarea.value = '';
        GM_setValue('lastInput', '');
        showNotice("🧹 Đã xoá JSON");
    };

    btnBuy.onclick = async () => {
        const content = textarea.value.trim();
        const country = selectCountry.value;
        if (!content) return showNotice("❌ Thiếu nội dung JSON!", true);
        try {
            const res = await fetch('https://tool.kingcrtis1.workers.dev/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, country_code: country })
            });
            const txt = await res.text();
            showNotice("✅ Đã gửi đơn mua:\n" + txt);
        } catch (err) {
            showNotice("❌ Lỗi gửi đơn mua: " + err.message, true);
        }
    };

    // === Thêm vào giao diện ===
    menu.appendChild(textarea);
    menu.appendChild(btnLogin);
    menu.appendChild(btnClearJson);
    menu.appendChild(document.createElement('hr'));
    menu.appendChild(countryLabel);
    menu.appendChild(selectCountry);
    menu.appendChild(btnBuy);
    document.body.appendChild(menu);

    // === Thông báo nổi tự biến mất ===
    function showNotice(msg, isError = false) {
        const notice = document.createElement('div');
        notice.textContent = msg;
        notice.style.position = 'fixed';
        notice.style.top = '20px';
        notice.style.left = '50%';
        notice.style.transform = 'translateX(-50%)';
        notice.style.background = isError ? '#dc3545' : '#28a745';
        notice.style.color = 'white';
        notice.style.padding = '10px 20px';
        notice.style.borderRadius = '8px';
        notice.style.zIndex = '10000';
        notice.style.fontWeight = 'bold';
        notice.style.maxWidth = '95%';
        document.body.appendChild(notice);
        setTimeout(() => notice.remove(), 3000);
    }
})();
