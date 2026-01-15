// ==UserScript==
// @name         天使动漫防社死 (自动签到/打工版)
// @namespace    https://www.tsdm39.com/
// @version      1.2
// @description  防止弹出页面社死，增加自动签到与自动打工功能
// @author       azwhikaru
// @include      http*://www.tsdm39.com*
// @match        http://www.tsdm39.com
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/495390/%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%AB%E9%98%B2%E7%A4%BE%E6%AD%BB%20%28%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E6%89%93%E5%B7%A5%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/495390/%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%AB%E9%98%B2%E7%A4%BE%E6%AD%BB%20%28%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E6%89%93%E5%B7%A5%E7%89%88%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const CLICK_DELAY = 800;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const currentUrl = window.location.href;

    if (currentUrl.includes('id=dsu_paulsign:sign')) {
        const ngBtn = document.getElementById('ng');
        if (ngBtn) {
            ngBtn.click();
            await sleep(CLICK_DELAY);
        }

        const radioMode = document.querySelector('input[name="qdmode"][value="3"]');
        if (radioMode) {
            radioMode.click();
            await sleep(CLICK_DELAY);
        }

        const signBtnImg = document.querySelector('img[src*="source/plugin/dsu_paulsign/img/qdtb.gif"]');
        if (signBtnImg && signBtnImg.parentNode) {
            signBtnImg.parentNode.click();
        }
    }

    if (currentUrl.includes('id=np_cliworkdz:work')) {
        const advIds = [
            'np_advid1',
            'np_advid2',
            'np_advid4',
            'np_advid6',
            'np_advid7',
            'np_advid9'
        ];

        for (const id of advIds) {
            const advDiv = document.getElementById(id);
            if (advDiv) {
                const link = advDiv.querySelector('a');
                if (link) {
                    link.click();
                    await sleep(CLICK_DELAY);
                }
            }
        }

        const rewardImg = document.getElementById('workstart');
        if (rewardImg && rewardImg.parentNode) {
            rewardImg.parentNode.click();
            await sleep(CLICK_DELAY);
        }
    }

})();