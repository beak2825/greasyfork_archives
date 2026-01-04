// ==UserScript==
// @name         SKU提取复制
// @namespace    https://tampermonkey.net/
// @version      0.1
// @description  提取 SKU 并去掉 `-` 或 `_` 后面的内容，显示在右上角并可复制
// @author       Ano_via
// @match        *://*/*/products/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/523283/SKU%E6%8F%90%E5%8F%96%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/523283/SKU%E6%8F%90%E5%8F%96%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个 div 元素来显示 SKU
    const skuDisplay = document.createElement('div');
    skuDisplay.style.position = 'fixed';
    skuDisplay.style.top = '10px';
    skuDisplay.style.right = '10px';
    skuDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    skuDisplay.style.color = 'white';
    skuDisplay.style.padding = '5px 10px';
    skuDisplay.style.borderRadius = '5px';
    skuDisplay.style.zIndex = '10000';
    skuDisplay.style.cursor = 'pointer';

    // 提取 SKU
    const regex = /"sku":"([^"]+)"/;
    const match = document.body.innerHTML.match(regex);

    // 如果找到 SKU，则显示
    if (match && match[1]) {
        let sku = match[1];

        // 去掉 '-' 或 '_' 后面的内容
        sku = sku.split(/[-_]/)[0];

        skuDisplay.textContent = `SKU: ${sku}`;

        // 添加复制功能
        skuDisplay.addEventListener('click', () => {
            navigator.clipboard.writeText(sku).then(() => {
                alert('SKU已复制！');
            }).catch(err => {
                alert('复制失败，请手动复制。');
            });
        });

        // 将显示元素添加到页面
        document.body.appendChild(skuDisplay);
    } else {
        console.log('未找到 SKU');
    }
})();
