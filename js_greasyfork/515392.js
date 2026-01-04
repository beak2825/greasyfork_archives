// ==UserScript==
// @name         Youtube Logout Confirm
// @name:zh      防止在 Youtube 誤觸登出
// @namespace    http://tampermonkey.net/
// @author       Microdust
// @version      1.0
// @description  Prevent logout all your account accidentally by misclick at YouTube.
// @description:zh  為 Youtube 登出鈕增加確認對話框，避免誤點導致帳號全部登出
// @include      *://*.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515392/Youtube%20Logout%20Confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/515392/Youtube%20Logout%20Confirm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MSG = (() => {
        const userLanguage = navigator.language || navigator.userLanguage;
        switch (userLanguage) {
            case 'zh-TW':
                return '確定要登出嗎？';
            case 'zh-HK':
                return '確定要登出嗎？';
            case 'zh-CN':
                return '确定要登出吗？';
            default:
                return 'Are you sure you want to log out?';
        }
    })();

    function confirmLogout(element) {
        const parent = element.closest('a');
        if (parent && !parent.dataset.processed) {
            parent.dataset.processed = 'true';
            const clonedLink = parent.cloneNode(false);
            clonedLink.removeAttribute('href');
            clonedLink.appendChild(parent.children[0]);
            clonedLink.addEventListener('click', (event) => {
                event.preventDefault();
                if (confirm(MSG)) {
                    parent.click();
                }
            });

            parent.parentElement.insertBefore(clonedLink, parent);
            parent.style.display = 'none';
        }
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const logoutElements = Array.from(document.querySelectorAll('[id=endpoint]')).filter(el => el.href.includes('logout') && !el.closest('a').dataset.processed);
                if (logoutElements.length) {
                    confirmLogout(logoutElements[0]);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();