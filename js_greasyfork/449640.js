// ==UserScript==
// @name            dominion.games Auto Table Setter
// @namespace       https://github.com/SlashNephy
// @version         0.4.1
// @author          SlashNephy
// @description     Automatically configures the table settings in dominion.games.
// @description:ja  dominion.games の卓設定を自動的に設定します。
// @homepage        https://scrapbox.io/slashnephy/Dominion_Online_%E3%81%AE%E5%8D%93%E3%82%92%E8%87%AA%E5%8B%95%E3%81%A7%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B_UserScript
// @homepageURL     https://scrapbox.io/slashnephy/Dominion_Online_%E3%81%AE%E5%8D%93%E3%82%92%E8%87%AA%E5%8B%95%E3%81%A7%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B_UserScript
// @icon            https://www.google.com/s2/favicons?sz=64&domain=dominion.games
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           https://dominion.games/
// @grant           none
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/449640/dominiongames%20Auto%20Table%20Setter.user.js
// @updateURL https://update.greasyfork.org/scripts/449640/dominiongames%20Auto%20Table%20Setter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const applySettings = () => {
        document.querySelector('div.clear-button')?.click();
        for (let i = 0; i < 2; i++) {
            document.querySelector('div.table-kingdom-landscape.add-landscape')?.click();
        }
        for (const element of document.querySelectorAll('div.landscape-selector-none')) {
            element.click();
        }
        document.querySelector('div#colony-selector')?.click();
        document.querySelector('div#shelter-selector')?.click();
        document
            .querySelector('div.game-options div.table-toggle-container:nth-child(3) > div.switch-button')
            ?.click();
        alert('Table settings applied!');
    };
    const observe = () => {
        const target = document.querySelector('div.window-container > div');
        if (target === null) {
            setTimeout(observe, 1000);
            return;
        }
        const observer = new MutationObserver((records) => {
            for (const record of records) {
                if (!(record.target instanceof Element)) {
                    continue;
                }
                if (record.oldValue?.split(/\s/).some((x) => x === 'my-table') === true) {
                    continue;
                }
                if (record.target.classList.contains('my-table')) {
                    applySettings();
                }
            }
        });
        observer.observe(target, {
            attributes: true,
            attributeFilter: ['class'],
            attributeOldValue: true,
        });
    };
    observe();

})();
