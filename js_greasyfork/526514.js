// ==UserScript==
// @name         coolpc原價屋庫存自動查询
// @namespace    http://tampermonkey.net/
// @version      v0.2
// @description  頁面加載時即自動查詢心儀商品的庫存情況
// @author       You
// @match        https://coolpc.com.tw/evaluate.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://coolpc.com.tw/
// @grant        GM_xmlhttpRequest
// @connect      api.emailjs.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526514/coolpc%E5%8E%9F%E5%83%B9%E5%B1%8B%E5%BA%AB%E5%AD%98%E8%87%AA%E5%8B%95%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/526514/coolpc%E5%8E%9F%E5%83%B9%E5%B1%8B%E5%BA%AB%E5%AD%98%E8%87%AA%E5%8B%95%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const productName = "RTX5090";
    let hasChecked = false;

    function checkOptions() {
        const inStockItems = [];
        const optGroups = document.querySelectorAll(`optgroup[label*='${productName}']`);
        optGroups.forEach(optGroup => {
            const options = optGroup.querySelectorAll("option");
            options.forEach(option => {
                const optionText = option.text.trim();
                console.log(optionText);
                const isDisabled = option.disabled;
                const optionKey = `${option.value}`;
                inStockItems.push(optionText);
            });
        });

        const infoDiv = document.createElement('div');
        infoDiv.style.backgroundColor = '#ffffcc';
        infoDiv.style.padding = '10px';
        infoDiv.style.marginBottom = '10px';

        if (inStockItems.length > 0) {
            infoDiv.innerHTML = `
                <h2>以下是 ${productName} 商品庫存情況：</h2>
                <ul>
                    ${inStockItems.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        } else {
            infoDiv.innerHTML = `<h2>${productName} 仍售罄！</h2>`;
        }

        document.body.insertBefore(infoDiv, document.body.firstChild);
    }

    window.onload = function() {
        if (!hasChecked) {
            hasChecked = true;
            checkOptions();
        }
    };
})();