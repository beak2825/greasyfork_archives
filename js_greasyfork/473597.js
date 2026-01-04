// ==UserScript==
// @name         23.8.20旺销王商品id导出
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  旺销王商品id导出
// @author       menkeng
// @match        https://v3.wxwerp.com/goods/match/AliExpress*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wxwerp.com
// @license      GPLv3
// @run-at       context-menu
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/473597/23820%E6%97%BA%E9%94%80%E7%8E%8B%E5%95%86%E5%93%81id%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/473597/23820%E6%97%BA%E9%94%80%E7%8E%8B%E5%95%86%E5%93%81id%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function () {
    'use strict';

    let trElements = [];
    let allIds = [];
    let zeroIds = [];
    let exceptionIds = [];

    let currentIndex = 0;

    function processTrElements() {
        if (currentIndex >= trElements.length) {
            console.log('全部商品下载完成');
            if (document.querySelector('div.bottom-menu.sticky-bottom.border-b > div.bottom-layout > div > button.btn-next[disabled="disabled"]')) {
                downloadIdsAsTxt(zeroIds, '[异常]数量为0.txt');
                downloadIdsAsTxt(exceptionIds, '已配对.txt');
                return;
            } else {
                processNextPage();
                return;
            }
        }

        const tr = trElements[currentIndex];
        // 获取商品 ID
        const idElement = tr.querySelector(
            'div.match-caption > div:nth-child(2) > span:nth-child(3)'
        );
        const idtxt = idElement.textContent;
        const id = idtxt.match(/\d+/)[0];
        allIds.push(id);
        // 获取span.PRIMARY.c-pointer元素文本
        const spanElements = tr.querySelectorAll('span.PRIMARY.c-pointer');
        spanElements.forEach(span => {
            if (span.textContent == '0') {
                zeroIds.push(id);
            }
        });
        // 存储商品ID
        exceptionIds.push(id);
        console.log(`商品 (${currentIndex + 1}/${trElements.length}): ${id}`);

        currentIndex++;
        processTrElements();
    }

    function processPage() {
        trElements = document.querySelectorAll('tbody tr');
        console.log(`正在存储当前页面 (${trElements.length} 个商品)...`);
        currentIndex = 0;
        processTrElements();
    }

    function processNextPage() {
        const nextPageButton = document.querySelector(
            'div.bottom-menu.sticky-bottom.border-b > div.bottom-layout > div > button.btn-next[disabled="disabled"]'
        );
        if (nextPageButton) {
            console.log('已到达最后一页');
            processPage();
            return;
        } else {
            const nextPageButton = document.querySelector(
                'div.bottom-menu.sticky-bottom.border-b > div.bottom-layout > div > button.btn-next'
            );
            nextPageButton.click();
            setTimeout(() => {
                processPage();
                return;
            }, 5000);
        }
    }

    function downloadIdsAsTxt(ids, filename) {
        const txtContent = ids.join('\n');
        const blob = new Blob([txtContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log(`商品ID已下载为TXT文件: ${filename}`);
    }

    processPage();

})();