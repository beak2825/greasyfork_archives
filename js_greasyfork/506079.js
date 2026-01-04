// ==UserScript==
// @name            Roblox Free Verification badge (FIXED)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds the roblox blue verified badge next to ur profile header, I finally fixed this shit again after a whole ass year :))
// @author           Emree.el on Instagram
// @match        https://www.roblox.com/users/564962235/profile
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506079/Roblox%20Free%20Verification%20badge%20%28FIXED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/506079/Roblox%20Free%20Verification%20badge%20%28FIXED%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const badgeSVG = `<img class="profile-verified-badge-icon" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="328744005" alt="328744005">`;

    function addBadge() {
        const container = document.querySelector('.profile-header-title-container');
        if (!container) return;

        // Prevent adding badge multiple times
        if (container.querySelector('.profile-verified-badge-icon')) return;

        // Create wrapper for badge with styling to push it right
        const badgeWrapper = document.createElement('span');
        badgeWrapper.style.cssText = `
            display: inline-flex;
            align-items: center;
            margin-left: 12px;
            vertical-align: middle;
        `;
        badgeWrapper.innerHTML = badgeSVG;

        // Append badge at the end (right side)
        container.appendChild(badgeWrapper);
    }

    // Wait for page and element
    const interval = setInterval(() => {
        if (document.readyState === 'complete') {
            addBadge();
            clearInterval(interval);
        }
    }, 300);
})();
