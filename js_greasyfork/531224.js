// ==UserScript==
// @name         AutoDL 每页 100 个
// @namespace    http://tampermonkey.net/
// @version      2025-03-19
// @description  自动点击“100条/页”
// @author       Ganlv
// @match        https://www.autodl.com/login*
// @match        https://www.autodl.com/subAccountLogin*
// @match        https://www.autodl.com/deploy*
// @match        https://www.autodl.com/console*
// @icon         https://www.autodl.com/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531224/AutoDL%20%E6%AF%8F%E9%A1%B5%20100%20%E4%B8%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/531224/AutoDL%20%E6%AF%8F%E9%A1%B5%20100%20%E4%B8%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    (async () => {
        while (true) {
            const href = location.href;
            if ((href.includes('/console/instance/list') || href.includes('/deploy/list') || href.includes('/deploy/details/') || href.includes('/deploy/duration') || href.includes('/console/image')) && !href.includes('page_size')) {
                const elPaginationSize = document.querySelector('.el-pagination__sizes input[placeholder="请选择"]');
                if (elPaginationSize) {
                    elPaginationSize.click();
                    await sleep(16);
                    Array.from(document.querySelectorAll('.el-select-dropdown__item span')).find(el => el.textContent === '100条/页')?.click();
                    console.log(location.href + ' set page size to 100');
                }
            }
            await sleep(16);
        }
    })();
})();