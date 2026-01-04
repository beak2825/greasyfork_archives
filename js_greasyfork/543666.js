// ==UserScript==
// @name         SatsFaucet Auto Dashboard + Bounty LOOP
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Continuous automation: Dashboard → Faucet → Bounty → Claim → wait 1h → repeat
// @author       Rubystance
// @license      MIT
// @match        https://www.satsfaucet.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543666/SatsFaucet%20Auto%20Dashboard%20%2B%20Bounty%20LOOP.user.js
// @updateURL https://update.greasyfork.org/scripts/543666/SatsFaucet%20Auto%20Dashboard%20%2B%20Bounty%20LOOP.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const log = (...args) => console.log('[SatsBot]', ...args);

    const ONE_HOUR = 60 * 60 * 1000;
    const STORAGE_KEY = 'satsfaucet_last_claim';

    function isVisible(el) {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
    }

    function clickByText(tag, text) {
        const els = [...document.querySelectorAll(tag)];
        return els.find(el =>
            el.textContent.trim().toLowerCase() === text &&
            isVisible(el)
        );
    }

    function clickAllClaimRewards() {
        const buttons = [...document.querySelectorAll('button')];

        buttons.forEach(btn => {
            if (
                btn.textContent.trim().toLowerCase() === 'claim reward' &&
                !btn.disabled &&
                isVisible(btn)
            ) {
                btn.click();
                log('Clicked: Claim reward');

                localStorage.setItem(STORAGE_KEY, Date.now().toString());
            }
        });
    }

    function handleDashboard() {
        const faucet = clickByText('span', 'faucet');
        if (faucet) {
            faucet.click();
            log('Clicked: Faucet (Dashboard)');
        }
    }

    function handleBounty() {
        clickAllClaimRewards();
    }

    function checkCooldownAndRestart() {
        const lastClaim = localStorage.getItem(STORAGE_KEY);
        if (!lastClaim) return;

        const elapsed = Date.now() - Number(lastClaim);

        if (elapsed >= ONE_HOUR) {
            log('Cooldown finished. Restarting routine.');
            localStorage.removeItem(STORAGE_KEY);
            location.href = 'https://www.satsfaucet.com/app/dashboard';
        }
    }

    let lastURL = location.href;

    setInterval(() => {
        if (location.href !== lastURL) {
            lastURL = location.href;
            log('URL changed:', lastURL);
        }

        checkCooldownAndRestart();

        if (lastURL.includes('/app/dashboard')) {
            handleDashboard();
        }

        if (lastURL.includes('/app/bounty')) {
            handleBounty();
        }
    }, 1000);

    const observer = new MutationObserver(() => {
        if (location.href.includes('/app/bounty')) {
            handleBounty();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
