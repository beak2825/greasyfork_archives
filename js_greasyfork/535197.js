// ==UserScript==
// @name         Replace download button in Sagepub with 易读通 for Chinese users
// @name:zh-CN   更换Sagepub中的下载链接按钮为中国易读通
// @namespace    http://tampermonkey.net/
// @version      2025-05-07
// @description  Add a link to download PDF from 易读通 for Chinese users on SAGE Journals
// @description:zh-cn 把Sagepub的下载按钮链接到中国易读通，方便中国用户下载
// @author       Hao_Tian
// @match        https://journals.sagepub.com/doi*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sagepub.com
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/535197/Replace%20download%20button%20in%20Sagepub%20with%20%E6%98%93%E8%AF%BB%E9%80%9A%20for%20Chinese%20users.user.js
// @updateURL https://update.greasyfork.org/scripts/535197/Replace%20download%20button%20in%20Sagepub%20with%20%E6%98%93%E8%AF%BB%E9%80%9A%20for%20Chinese%20users.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract DOI from the current URL
    const url = window.location.href;
    const doiMatch = url.match(/\/doi\/abs\/(.+)/);
    if (doiMatch && doiMatch[1]) {
        const doi = doiMatch[1];
        const downloadUrl = `https://sage.cnpereading.com/paragraph/download/?doi=${doi}`;

        // Locate the first specified element
        const targetElement1 = document.evaluate(
            '//*[@id="pb-page-content"]/div/div[4]/main/article/div[1]/ul/li[2]/a',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (targetElement1) {
            // Update the href and span text content
            targetElement1.href = downloadUrl;
            const spanElement1 = targetElement1.querySelector('.link-text');
            if (spanElement1) {
                spanElement1.textContent = 'CN User: Get from 易读通';
            }
        }

        // Locate the second specified element
        const targetElement2 = document.evaluate(
            '//*[@id="bodymatter"]/div/section/div/a',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (targetElement2) {
            // Update the href and span text content
            targetElement2.href = downloadUrl;
            const spanElement2 = targetElement2.querySelector('span');
            if (spanElement2) {
                spanElement2.textContent = 'CN User: Get from 易读通';
            }
        }
    }
})();