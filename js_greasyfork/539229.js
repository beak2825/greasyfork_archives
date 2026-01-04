// ==UserScript==
// @name         helpfpcoin.site Faucet HTTPS Enforcer + Autoclaim
// @namespace    ViolentMonkey
// @version      1.0
// @description  Forces HTTPS and auto-claims Coin when ready
// @author       Wphelp
// @match        *://helpfpcoin.site/faucet/doge*
// @grant        none
// @antifeature  referral-link Directs to a referral link when not logged in
// @license      Copyright Wphelp
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539229/helpfpcoinsite%20Faucet%20HTTPS%20Enforcer%20%2B%20Autoclaim.user.js
// @updateURL https://update.greasyfork.org/scripts/539229/helpfpcoinsite%20Faucet%20HTTPS%20Enforcer%20%2B%20Autoclaim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🔥 FORCE HTTPS REDIRECTION (BYPASS HTTP TRAPS)
    if (location.protocol !== 'https:') {
        const rebelRedirect = () => {
            const newUrl = `https://helpfpcoin.site/faucet/doge${location.search || ''}`;
            console.log(`[REBEL] Nuclear redirect to HTTPS: ${newUrl}`);
            location.replace(newUrl);
        };
        // Execute after 1.5s to avoid redirect loops
        setTimeout(rebelRedirect, 1500);
        return; // Terminate script on HTTP page
    }

    // 💣 AUTO-CLAIM PROTOCOL (HTTPS VERSION)
    const claimBtn = document.getElementById('claimBtns');
    const timerEl = document.getElementById('nextClaimTimer');

    const detonateClaim = () => {
        if (claimBtn) {
            console.log("[REBEL] Detonating claim button!");
            claimBtn.click();
            return true;
        }
        console.warn("[REBEL] Claim button not found - mission aborted");
        return false;
    };

    const scanForReadiness = () => {
        if (!timerEl) {
            console.error("[REBEL] Timer element missing - enemy countermeasures detected");
            return;
        }

        if (/ready/i.test(timerEl.textContent.trim())) {
            console.log("[REBEL] Status: READY - initiating attack sequence");
            setTimeout(detonateClaim, 2000); // Stealth delay
        } else {
            console.log(`[REBEL] Status: ${timerEl.textContent} - continuing surveillance`);
        }
    };

    // 🚀 MAIN OPERATION
    console.log("[REBEL] Secure zone established (HTTPS) - commencing autoclaim protocol");
    setInterval(scanForReadiness, 3000); // Scan every 3 seconds
})();