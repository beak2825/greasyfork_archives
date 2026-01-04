// ==UserScript==
// @name         Torn Trade Page Chat Button
// @namespace    https://www.torn.com/
// @version      1.2
// @description  Adds an 'Open Chat' button on trade pages that works with Chat 3.0 and Torn PDA
// @author       KillerCleat [2842410]
// @match        https://www.torn.com/trade.php*
// @match        https://www.torn.com/pda.php*
// @grant        none
// @license      MIT
// @locale       en-US
// @downloadURL https://update.greasyfork.org/scripts/542651/Torn%20Trade%20Page%20Chat%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/542651/Torn%20Trade%20Page%20Chat%20Button.meta.js
// ==/UserScript==

/**
 * Notes & Requirements:
 * – Author: KillerCleat [2842410]
 * – Description: Injects an 'Open Chat' button into any element starting with 'Trade Log' on PC and PDA trade pages.
 * – Works with Torn Chat 3.0 (PC) and Torn PDA chat interface.
 */

(function() {
    'use strict';

    /** Utility: Run callback when DOM is ready */
    function onReady(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    onReady(function() {
        // Locate the 'Trade Log' header element
        const header = Array.from(document.querySelectorAll('div,span'))
            .find(el => el.textContent.trim().startsWith('Trade Log'));
        if (!header) return;

        // Find the trade partner's user link (PC or PDA)
        const userLink = document.querySelector(
            'a[href*="user.php?ID="], a[href*="pda.php?XID="]'
        );
        if (!userLink) return;

        // Parse out the user ID
        const href = userLink.getAttribute('href');
        const match = href.match(/[?&](?:ID|XID)=([0-9]+)/);
        if (!match) return;
        const userId = match[1];

        // Create the 'Open Chat' button
        const btn = document.createElement('span');
        btn.className = 'tt-open-chat';
        btn.textContent = 'Open Chat';
        btn.style.cursor = 'pointer';
        btn.style.marginLeft = '10px';

        btn.addEventListener('click', () => {
            const chatUrl = location.pathname.includes('pda.php')
                ? `/pda.php?chat=${userId}`
                : `/chat.php?user2=${userId}`;
            window.open(chatUrl, '_blank', 'width=400,height=600');
        });

        // Append the button if not already present
        const container = header.querySelector('div') || header;
        if (!container.querySelector('.tt-open-chat')) {
            container.appendChild(btn);
        }
    });
})();
