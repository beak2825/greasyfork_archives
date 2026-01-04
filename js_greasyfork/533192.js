// ==UserScript==
// @name         Auto Click GSuite Login Link
// @namespace    http://sun-asterisk.vn
// @version      1.0
// @description  Automatically click GSuite login link on page load
// @author       You
// @match        https://wsm.sun-asterisk.vn/*
// @match        https://asset.sun-asterisk.vn/*
// @match        https://review.sun-asterisk.vn/*
// @match        https://insight.sun-asterisk.vn/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533192/Auto%20Click%20GSuite%20Login%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/533192/Auto%20Click%20GSuite%20Login%20Link.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOGOUT_FLAG = 'auto-login-prevented-due-to-logout';

    const loginTargets = [
        {
            name: 'WSM GSuite OAuth',
            selector: 'a.wsm-btn.btn-login[href*="google_oauth2"]'
        },
        {
            name: 'Asset GSuite OAuth',
            selector: 'a.btn.btn-primary.btn-single-logon[href="/auth/framgia"]'
        },
        {
            name: 'Review GSuite OAuth',
            selector: 'a[href="/api/social/google"]'
        },
        {
            name: 'Insight GSuite OAuth',
            find: () => Array.from(document.querySelectorAll('button.btn')).find(btn =>
                btn.innerText.toLowerCase().includes('login with') &&
                btn.querySelector('img[alt="Google"]')
            )
        }
    ];

    const logoutKeywords = ['logout', 'log out', 'sign out', 'đăng xuất'];

    function isLogoutElement(el) {
        if (!el) return false;
        const text = el.innerText?.toLowerCase() ?? '';
        const href = el.getAttribute?.('href') ?? '';

        return (
            href === '/logout' ||
            href.includes('/sign_out') ||
            logoutKeywords.some(keyword => text.includes(keyword))
        );
    }

    function watchForLogout() {
        // Passive click detection (works for Asset & WSM)
        document.addEventListener('click', e => {
            const target = e.target.closest('a, li, button, span, div');
            if (isLogoutElement(target)) {
                console.log('🚪 Logout clicked — flagging auto-login skip');
                sessionStorage.setItem(LOGOUT_FLAG, 'true');
            }
        });

        // SPA MutationObserver (for Insight & Review where <li> menu items change dynamically)
        const observer = new MutationObserver(() => {
            const possibleLogoutItems = Array.from(document.querySelectorAll('li, button, span, div'))
                .filter(el => isLogoutElement(el));
            if (possibleLogoutItems.length > 0) {
                possibleLogoutItems.forEach(el => {
                    el.addEventListener('click', () => {
                        console.log('🚪 Logout element clicked (via MutationObserver)');
                        sessionStorage.setItem(LOGOUT_FLAG, 'true');
                    }, { once: true });
                });
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function tryClickLogin() {
        if (sessionStorage.getItem(LOGOUT_FLAG)) {
            console.log('⏸️ Auto-login skipped (due to recent logout)');
            sessionStorage.removeItem(LOGOUT_FLAG);
            return true;
        }

        for (const target of loginTargets) {
            const el = target.find ? target.find() : document.querySelector(target.selector);
            if (el) {
                console.log(`✅ Auto-clicking ${target.name}...`);
                el.click();
                return true;
            }
        }

        return false;
    }

    function observeLoginTrigger() {
        if (!tryClickLogin()) {
            const observer = new MutationObserver((_, obs) => {
                if (tryClickLogin()) {
                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    watchForLogout();
    observeLoginTrigger();
})();
