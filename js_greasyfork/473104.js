// ==UserScript==
// @name         iCan自检
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  免责声明：此程序只供学习和研究使用，不得用于商业或者非法用途，否则后果自负。本程序的开发者不承担任何法律责任。使用本程序造成的一切后果由使用者自行承担，与本程序的开发者无关。使用本程序即表示您已经接受了本声明。
// @author       自信膨胀的汤姆（zxpzdtm）
// @match        https://ipsapro.isoftstone.com/iCan/ITS/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=isoftstone.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473104/iCan%E8%87%AA%E6%A3%80.user.js
// @updateURL https://update.greasyfork.org/scripts/473104/iCan%E8%87%AA%E6%A3%80.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function clickFirstRadioOnAllPages() {
        const radioGroups = document.querySelectorAll('.ant-radio-group');

        const paginationItems = document.querySelectorAll('.ant-pagination-item');

        for (let i = 0; i < paginationItems.length; i++) {
            const item = paginationItems[i];

            item.click();

            const updatedRadioGroups = document.querySelectorAll('.ant-radio-group');

            for (let j = 0; j < updatedRadioGroups.length; j++) {
                const group = updatedRadioGroups[j];
                const firstRadio = group.querySelector('.ant-radio');

                if (firstRadio) {
                    firstRadio.click();
                    await delay(500);
                }
            }

            if (i < paginationItems.length - 1) {
                await delay(1000);
                const nextPageButton = document.querySelector('.ant-pagination-next');
                if (nextPageButton) {
                    nextPageButton.click();
                }
            }
        }
    }

    await delay(2000);

    clickFirstRadioOnAllPages();
})();
