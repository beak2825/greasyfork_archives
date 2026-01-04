// ==UserScript==
// @name         Tool UgPhone PRO MAX
// @namespace    https://ugphone.com/
// @version      2.3
// @description  Tự động đăng nhập và mua máy trên UgPhone
// @author       Hieu Dep Zai
// @match        *://*.ugphone.com/toc-portal/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/541691/Tool%20UgPhone%20PRO%20MAX.user.js
// @updateURL https://update.greasyfork.org/scripts/541691/Tool%20UgPhone%20PRO%20MAX.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isMobile = window.innerWidth < 600;

    // UI setup
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
    btnLogin.style.background = '#28a745';
    btnLogin.style.color = 'white';

    const btnClearJson = document.createElement('button');
    btnClearJson.textContent = '🗑️ Xoá JSON';
    btnClearJson.style.marginTop = '6px';
    btnClearJson.style.width = '100%';
    btnClearJson.style.background = '#dc3545';
    btnClearJson.style.color = 'white';

    const countryLabel = document.createElement('label');
    countryLabel.textContent = '🌐 Chọn Máy Chủ:';

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

    // === JSON FIX FUNCTION ===
    function fixJsonInput(raw) {
        try {
            return JSON.parse(raw);
        } catch {
            try {
                const fixed = raw.replace(
                    /"UGPHONE-MQTT":"({[^]*?})"/,
                    (_, inner) => `"UGPHONE-MQTT":${JSON.stringify(inner)}`
                );
                return JSON.parse(fixed);
            } catch {
                throw new Error("JSON vẫn lỗi sau khi cố sửa.");
            }
        }
    }

    // === Đăng nhập ===
    btnLogin.onclick = () => {
        try {
            const parsed = fixJsonInput(textarea.value);
            if (parsed.hasOwnProperty('userFloatInfo')) delete parsed.userFloatInfo;
            localStorage.clear();
            for (const key in parsed) {
                localStorage.setItem(key, parsed[key]);
            }
            GM_setValue('lastInput', JSON.stringify(parsed));
            showNotice("✅ Đăng nhập thành công! Reload sau 2s...");
            setTimeout(() => location.reload(), 2000);
        } catch (e) {
            showNotice("❌ JSON không hợp lệ hoặc lỗi sửa: " + e.message, true);
        }
    };

    // === Xoá JSON ===
    btnClearJson.onclick = () => {
        textarea.value = '';
        GM_setValue('lastInput', '');
        showNotice("🧹 Đã xoá JSON");
    };

    // === Mua máy ===
    btnBuy.onclick = async () => {
        const raw = textarea.value.trim();
        const country = selectCountry.value;
        if (!raw) return showNotice("❌ Thiếu nội dung JSON!", true);
        showNotice("⏳ Đang Mua Máy - Vui Lòng Đợi...");

        try {
            const parsed = fixJsonInput(raw);
            const content = JSON.stringify(parsed);

            const res = await fetch('https://tool.kingcrtis1.workers.dev/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, country_code: country })
            });

            const txt = await res.text();

            // Tự động đăng nhập
            try {
                if (parsed.hasOwnProperty('userFloatInfo')) delete parsed.userFloatInfo;
                localStorage.clear();
                for (const key in parsed) {
                    localStorage.setItem(key, parsed[key]);
                }
                GM_setValue('lastInput', content);
                showNotice("✅ Đã mua máy và đăng nhập thành công! Reload sau 2s...");
                setTimeout(() => location.reload(), 2000);
            } catch (e) {
                showNotice("⚠️ Mua máy xong nhưng lỗi khi đăng nhập!", true);
            }

        } catch (err) {
            showNotice("❌ JSON không hợp lệ hoặc lỗi gửi: " + err.message, true);
        }
    };

    // === Thêm UI ===
    menu.appendChild(textarea);
    menu.appendChild(btnLogin);
    menu.appendChild(btnClearJson);
    menu.appendChild(document.createElement('hr'));
    menu.appendChild(countryLabel);
    menu.appendChild(selectCountry);
    menu.appendChild(btnBuy);
    document.body.appendChild(menu);

    // === Thông báo nổi ===
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
