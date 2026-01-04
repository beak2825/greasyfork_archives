// ==UserScript==
// @name               All Ropro Icons (Read desc)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Puts all Ropro icons on ur profile (this doesn't give you any free ropro subscription, its for decoration purposes)
// @author       Emree.el on instagram
// @match        https://www.roblox.com/users/564962235/profile
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538731/All%20Ropro%20Icons%20%28Read%20desc%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538731/All%20Ropro%20Icons%20%28Read%20desc%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ICONS = [
        { class: 'ropro-ultra-icon', src: 'chrome-extension://adbacgifemdbhdkfppmeilbgppmhaobf/images/ultra_icon.png' },
        { class: 'ropro-rex-icon', src: 'chrome-extension://adbacgifemdbhdkfppmeilbgppmhaobf/images/rex_icon.png' },
        { class: 'ropro-plus-icon', src: 'chrome-extension://adbacgifemdbhdkfppmeilbgppmhaobf/images/plus_icon.png' }
    ];

    setInterval(() => {
        const defaultIcon = document.querySelector('.ropro-profile-icon');
        if (!defaultIcon) return;

        const container = defaultIcon.parentNode;
        if (!container) return;

        // Cleanup duplicates
        ICONS.forEach(({ class: cls }) => {
            const oldIcon = container.querySelector(`.${cls}`);
            if (oldIcon) oldIcon.remove();
        });

        // Add icons in the right order
        ICONS.forEach(({ class: cls, src }) => {
            const newIcon = document.createElement('img');
            newIcon.className = cls;
            newIcon.src = src;
            newIcon.style.width = '30px';
            newIcon.style.marginRight = '5px';
            container.insertBefore(newIcon, defaultIcon);
        });

    }, 300);
})();
