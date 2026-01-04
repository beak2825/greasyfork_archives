// ==UserScript==
// @name         Supjav 种子搜索（支持FC2PPV新版）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Supjav 种子搜索，支持无码影片包括FC2（自动提取FC2PPV后数字）和其他无码厂商
// @author       You
// @match        https://supjav.com/*.html
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545185/Supjav%20%E7%A7%8D%E5%AD%90%E6%90%9C%E7%B4%A2%EF%BC%88%E6%94%AF%E6%8C%81FC2PPV%E6%96%B0%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545185/Supjav%20%E7%A7%8D%E5%AD%90%E6%90%9C%E7%B4%A2%EF%BC%88%E6%94%AF%E6%8C%81FC2PPV%E6%96%B0%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const titleElement = document.querySelector('.archive-title h1');
        if (!titleElement) return;

        const titleText = titleElement.textContent.trim();
        let targetNumber = null;

        // ✅ 优先匹配 FC2PPV-xxxxxxx 或 FC2-PPV-xxxxxxx 等格式
        const fc2Match = titleText.match(/FC2\s*[-]?\s*PPV\s*[-]?\s*(\d+)/i);
        if (fc2Match) {
            targetNumber = fc2Match[1];
        } else {
            // 否则 fallback 到原逻辑：取第一个空格后的数字
            const fallbackMatch = titleText.match(/\b(\d{3,})\b/);
            if (fallbackMatch) targetNumber = fallbackMatch[1];
        }

        if (!targetNumber) return;

        // 删除旧按钮
        const existingBtn = document.getElementById('sukebei-search-btn');
        if (existingBtn) existingBtn.remove();

        // 创建按钮
        const floatingBtn = document.createElement('a');
        floatingBtn.id = 'sukebei-search-btn';
        floatingBtn.textContent = `🔍 Search ${targetNumber}`;
        floatingBtn.href = `https://sukebei.nyaa.si/?f=0&c=0_0&q=${targetNumber}`;
        floatingBtn.target = '_blank';

        // 样式
        Object.assign(floatingBtn.style, {
            position: 'fixed',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: '9999',
            padding: '12px 20px',
            backgroundColor: '#4a76d0',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '25px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            textDecoration: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        });

        floatingBtn.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#3a66c0';
            this.style.transform = 'translateY(-50%) scale(1.05)';
        });

        floatingBtn.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#4a76d0';
            this.style.transform = 'translateY(-50%) scale(1)';
        });

        document.body.appendChild(floatingBtn);

        console.log(`提取的编号: ${targetNumber}`);
    });
})();
