// ==UserScript==
// @name         Купи АУ. КУПИ. КУПИ.
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Напоминалка об ау.
// @author       QIYANA
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.market/*
// @match        https://zelenka.market/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511802/%D0%9A%D1%83%D0%BF%D0%B8%20%D0%90%D0%A3%20%D0%9A%D0%A3%D0%9F%D0%98%20%D0%9A%D0%A3%D0%9F%D0%98.user.js
// @updateURL https://update.greasyfork.org/scripts/511802/%D0%9A%D1%83%D0%BF%D0%B8%20%D0%90%D0%A3%20%D0%9A%D0%A3%D0%9F%D0%98%20%D0%9A%D0%A3%D0%9F%D0%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .auto-giveaway-button {
            width: 100%;
            max-width: 596px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    `);

    if (window.location.href.includes('account/upgrades')) {
        const upgradeDiv = document.getElementById('upgrade19');
        if (upgradeDiv) {
            const titleElement = upgradeDiv.querySelector('.displayIfLanguage--2 .group-box-title');
            const expirationElement = upgradeDiv.querySelector('abbr.DateTime');

            if (titleElement && expirationElement) {
                const title = titleElement.textContent.trim();
                const expiration = expirationElement.textContent.trim();

                GM_setValue('autoGiveawayInfo', `Автоучастие в розыгрышах истекает: ${expiration}`);
            }
        }
    }

    if (window.location.href.includes('forums/contests')) {
        const infoToDisplay = GM_getValue('autoGiveawayInfo', '');

        if (infoToDisplay) {
            const targetDiv = document.querySelector('.linkGroup.SelectionCountContainer.mobile-gap');

            if (targetDiv && !targetDiv.querySelector('.auto-giveaway-button')) {
                const newElement = document.createElement('a');
                newElement.href = '/account/upgrades';
                newElement.className = 'button auto-giveaway-button';
                newElement.textContent = infoToDisplay;

                targetDiv.appendChild(newElement);

                const participateButton = targetDiv.querySelector('a.button:contains("Принять участие во всех розыгрышах")');
                if (participateButton) {
                    const width = window.getComputedStyle(participateButton).width;
                    newElement.style.width = width;
                }
            }
        }
    }
})();
