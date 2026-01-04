// ==UserScript==
// @name         inZOI Canvas Auth Exporter
// @namespace    https://cybar.xyz/
// @version      1.0
// @description  Extract and export the auth token from Canvas (playinzoi.com) as used by Sorrow446's downloader
// @author       you
// @match        https://canvas.playinzoi.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/531927/inZOI%20Canvas%20Auth%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/531927/inZOI%20Canvas%20Auth%20Exporter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createFloatingButton() {
        const btn = document.createElement('button');
        btn.textContent = 'Export auth';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '9999';
        btn.style.padding = '10px 16px';
        btn.style.background = '#444';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        btn.style.fontSize = '14px';

        btn.addEventListener('click', () => {
            const token = localStorage.getItem('auth');
            if (token) {
                GM_setClipboard(token);
                showToast('Auth token copied to clipboard!');
            } else {
                showToast('Auth token not found!');
            }
        });

        document.body.appendChild(btn);
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '60px';
        toast.style.right = '20px';
        toast.style.padding = '10px 16px';
        toast.style.background = '#222';
        toast.style.color = '#fff';
        toast.style.borderRadius = '6px';
        toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';

        document.body.appendChild(toast);
        setTimeout(() => (toast.style.opacity = '1'), 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    window.addEventListener('load', () => {
        createFloatingButton();
    });
})();
