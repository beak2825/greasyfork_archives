// ==UserScript==
// @name         获取Cookie（仅lqfp-ssoticket）
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  仅在*.chinatax.gov.cn:8443页面添加可拖拽圆形按钮，实时显示lqfp-ssoticket Cookie状态
// @author       YourName
// @match        *://*.chinatax.gov.cn:8443/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/542433/%E8%8E%B7%E5%8F%96Cookie%EF%BC%88%E4%BB%85lqfp-ssoticket%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542433/%E8%8E%B7%E5%8F%96Cookie%EF%BC%88%E4%BB%85lqfp-ssoticket%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hasLqfpSsoTicket() {
        return /(?:^|;\s*)lqfp-ssoticket=([^;]*)/.test(document.cookie);
    }
    function getLqfpSsoTicketCookie() {
        const match = document.cookie.match(/(?:^|;\s*)lqfp-ssoticket=([^;]*)/);
        if (match) {
            return `lqfp-ssoticket=${match[1]};`;
        }
        return '';
    }

    const btn = document.createElement('button');
    btn.title = '点击复制lqfp-ssoticket Cookie';
    btn.style.position = 'fixed';
    btn.style.right = '18px';
    btn.style.bottom = '18px';
    btn.style.zIndex = 9999;
    btn.style.width = '38px';
    btn.style.height = '38px';
    btn.style.background = '#1976d2';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '50%';
    btn.style.cursor = 'grab';
    btn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.12)';
    btn.style.fontSize = '18px';
    btn.style.opacity = '0.85';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.transition = 'opacity 0.2s, box-shadow 0.2s';

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    btn.addEventListener('mousedown', function(e) {
        isDragging = true;
        btn.style.opacity = '0.6';
        btn.style.cursor = 'grabbing';
        const rect = btn.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            let left = e.clientX - offsetX;
            let top = e.clientY - offsetY;
            left = Math.max(0, Math.min(left, window.innerWidth - btn.offsetWidth));
            top = Math.max(0, Math.min(top, window.innerHeight - btn.offsetHeight));
            btn.style.left = left + 'px';
            btn.style.top = top + 'px';
            btn.style.right = 'auto';
            btn.style.bottom = 'auto';
        }
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            btn.style.opacity = '0.85';
            btn.style.cursor = 'grab';
        }
    });

    function updateBtnStatus() {
        btn.textContent = hasLqfpSsoTicket() ? '✔' : '✗';
    }
    updateBtnStatus();
    setInterval(updateBtnStatus, 2000);

    btn.onclick = function(e) {
        if (isDragging) return;
        const cookieStr = getLqfpSsoTicketCookie();
        if (cookieStr) {
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(cookieStr);
                btn.textContent = '✔';
                setTimeout(updateBtnStatus, 1200);
            } else {
                alert('当前环境不支持自动复制，请手动复制：\n' + cookieStr);
            }
        } else {
            btn.textContent = '✗';
            setTimeout(() => {
                updateBtnStatus();
                alert('未找到 lqfp-ssoticket Cookie');
            }, 1200);
        }
    };

    document.body.appendChild(btn);
})();
