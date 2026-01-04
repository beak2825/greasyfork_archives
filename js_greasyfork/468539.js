// ==UserScript==
// @name         Amazon ASIN & Brand Batch Link Generator
// @namespace    asin-link-generator
// @version      1.2
// @description  批量打开Amazon产品详情页、ASIN搜索结果页和品牌搜索页
// @match        *://*.amazon.com/*
// @match        *://*.amazon.ca/*
// @match        *://*.amazon.co.uk/*
// @match        *://*.amazon.de/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/468539/Amazon%20ASIN%20%20Brand%20Batch%20Link%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/468539/Amazon%20ASIN%20%20Brand%20Batch%20Link%20Generator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取当前Amazon国家站的基础URL
    function getAmazonBaseURL() {
        const host = location.hostname;
        if (host.endsWith('.com')) return 'https://www.amazon.com';
        if (host.endsWith('.ca')) return 'https://www.amazon.ca';
        if (host.endsWith('.co.uk')) return 'https://www.amazon.co.uk';
        if (host.endsWith('.de')) return 'https://www.amazon.de';
        return null;
    }

    // 公共样式
    const commonStyle = `
        position: fixed;
        left: 20px;
        padding: 10px 12px;
        background-color: #FF9900;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 9999;
    `;

    // 创建按钮
    const openASINDetailBatchButton = document.createElement('button');
    const openBatchASINButton = document.createElement('button');
    const openBrandBatchButton = document.createElement('button');

    openASINDetailBatchButton.textContent = '批量打开详情页';
    openBatchASINButton.textContent = '打开批量ASIN';
    openBrandBatchButton.textContent = '批量打开品牌';

    openASINDetailBatchButton.style.cssText = commonStyle + 'top: 45%; transform: translateY(-50%);';
    openBatchASINButton.style.cssText = commonStyle + 'top: calc(45% + 50px); transform: translateY(-50%);';
    openBrandBatchButton.style.cssText = commonStyle + 'top: calc(45% + 100px); transform: translateY(-50%);';

    document.body.appendChild(openASINDetailBatchButton);
    document.body.appendChild(openBatchASINButton);
    document.body.appendChild(openBrandBatchButton);

    // 批量打开ASIN详情页
    openASINDetailBatchButton.addEventListener('click', function () {
        const input = prompt('请输入多个ASIN，以换行符分隔：');
        if (input) {
            const base = getAmazonBaseURL();
            const asinList = input.split('\n').map(a => a.trim()).filter(a => /^[A-Z0-9]{10}$/i.test(a));
            if (base && asinList.length > 0) {
                asinList.forEach(asin => {
                    window.open(`${base}/dp/${asin}`);
                });
            } else {
                alert('请输入有效的ASIN（每个10位字母或数字）');
            }
        }
    });

    // 打开多个ASIN搜索
    openBatchASINButton.addEventListener('click', function () {
        const asins = prompt('请输入多个ASIN，以换行符分隔：');
        if (asins) {
            const base = getAmazonBaseURL();
            if (base) {
                const query = asins.split('\n').map(s => s.trim()).filter(Boolean).join('%7C');
                const url = `${base}/s?rh=p_78%3A${query}`;
                window.open(url);
            }
        }
    });

    // 批量打开品牌搜索页
    openBrandBatchButton.addEventListener('click', function () {
        const brands = prompt('请输入多个品牌名称，以换行符分隔：');
        if (brands) {
            const base = getAmazonBaseURL();
            if (base) {
                const brandList = brands.split('\n').map(b => b.trim()).filter(Boolean);
                brandList.forEach(brand => {
                    const encodedBrand = encodeURIComponent(brand);
                    const url = `${base}/s?rh=p_4%3A${encodedBrand}`;
                    window.open(url);
                });
            }
        }
    });
})();
