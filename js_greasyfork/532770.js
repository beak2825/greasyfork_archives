// ==UserScript==
// @name         Simplify Xiaohongshu Link
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Simplify Xiaohongshu URL and copy to clipboard with toast notification
// @author       anthonymo
// @license MIT
// @match        *://www.xiaohongshu.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/532770/Simplify%20Xiaohongshu%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/532770/Simplify%20Xiaohongshu%20Link.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const btn = document.createElement('button');
    btn.innerText = '🔗 复制简化链接';
    Object.assign(btn.style, {
        position: 'fixed',
        top: '12px',
        right: '12px',
        zIndex: '9999',
        backgroundColor: '#f8f8f8',
        color: '#333',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '6px 10px',
        fontSize: '13px',
        fontFamily: 'sans-serif',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        transition: 'all 0.2s ease',
    });

    btn.addEventListener('mouseover', () => {
        btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)';
    });
    btn.addEventListener('mouseout', () => {
        btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
    });

    document.body.appendChild(btn);

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.innerText = msg;
        Object.assign(toast.style, {
            position: 'fixed',
            top: '60px',
            right: '16px',
            backgroundColor: 'rgba(50,50,50,0.85)',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: '6px',
            zIndex: '10000',
            fontSize: '13px',
            opacity: '1',
            transition: 'opacity 0.4s ease-out',
        });
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 1800);
    }

    function simplifyLink(url) {
        const base = url.split('?')[0];
        const query = new URLSearchParams(url.split('?')[1] || '');
        const token = query.get('xsec_token');
        return token ? `${base}?xsec_token=${encodeURIComponent(token)}` : base;
    }

    btn.addEventListener('click', () => {
        const simplified = simplifyLink(window.location.href);
        GM_setClipboard(simplified, 'text');
        showToast('✅ 已复制简化链接');
    });
})();