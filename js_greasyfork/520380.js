// ==UserScript==
// @name         票易通v2复制发票
// @namespace    http://tampermonkey.net/
// @version      2024-12-12
// @description  票易通v2复制发票-私人版
// @author       You
// @match        https://saas.xforceplus.com/?m_code=personTicket
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xforceplus.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520380/%E7%A5%A8%E6%98%93%E9%80%9Av2%E5%A4%8D%E5%88%B6%E5%8F%91%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/520380/%E7%A5%A8%E6%98%93%E9%80%9Av2%E5%A4%8D%E5%88%B6%E5%8F%91%E7%A5%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hahaha(){
        // 假设你已经有了一个DOM对象，我们从这个DOM结构中提取数据
        // 首先，找到所有勾选的行
        const checkedRows = document.querySelectorAll('.ReactVirtualized__Table__rowColumn.cell-align-center input[type="checkbox"]:checked');

        // 用来存储结果的数组
        const selectedInvoices = [];

        // 遍历所有勾选的行
        checkedRows.forEach((checkbox) => {
            // 获取当前勾选行的父级元素，即表格行
            const row = checkbox.closest('.ReactVirtualized__Table__row');

            // 在当前行中找到所需的字段
            const invoiceCode = row.querySelector('[data-index="invoice_code"]').textContent.trim();
            const invoiceNo = row.querySelector('[data-index="invoice_no"] span[title]').getAttribute('title');
            const amountWithTax = row.querySelector('[data-index="amount_with_tax"] span[title]').getAttribute('title');

            // 将这些字段作为一个对象存储到数组中
            selectedInvoices.push({
                发票代码: invoiceCode,
                发票号码: invoiceNo,
                含税金额: amountWithTax
            });
        });

        if(!selectedInvoices.length) {
            alert('请勾选发票');
            return;
        }

        // 输出结果
        //console.log(selectedInvoices);

        const text = selectedInvoices.map(item => `${item.发票代码}\t${item.发票号码}\t\t\t${item.含税金额}`).join(`\n`);

        const total = selectedInvoices.reduce((pre, cur) => Number(pre) + Number(cur.含税金额 || 0), 0);
        // copy(text);
        console.table(selectedInvoices);
        console.info(`总计：${total}`);

        const test = text;
        const MIMETYPE = 'text/plain';
        const data = [ new ClipboardItem({ [MIMETYPE]: new Blob([ test ], { type: MIMETYPE }) }) ];
        navigator.clipboard.write(data)
            .then(function() {
            alert(`总计${total}元,复制成功！去试试粘贴到Excel内吧～`);
        }, function() {
            alert('不知道怎么回事，再试一次吧！');
            console.error('Unable to write to clipboard. :-(');
        });
        // alert('复制成功！去试试粘贴到Excel内吧～');
    }


    var button = document.createElement('button');
    button.innerText = '复制选中的发票';
    button.className = 'xf-ant4-btn xf-ant4-btn-primary';
    button.addEventListener('click', hahaha);
    button.id = 'hahaha';
    button.style.margin = '10px 10px 0 10px';

    const i = setInterval(() => {
        const tab = document.querySelector('.table-app__table-condition-tab .xf-ant4-tabs-nav-list');
        if(tab) {
            clearInterval(i);
            tab.appendChild(button)
        }
    }, 300);
    const i2 = setInterval(() => {
        // 假设你已经有了一个DOM对象，我们从这个DOM结构中提取数据
        // 首先，找到所有勾选的行
        const checkedRows = document.querySelectorAll('.ReactVirtualized__Table__rowColumn.cell-align-center input[type="checkbox"]:checked');

        // 用来存储结果的数组
        const selectedInvoices = [];

        // 遍历所有勾选的行
        checkedRows.forEach((checkbox) => {
            // 获取当前勾选行的父级元素，即表格行
            const row = checkbox.closest('.ReactVirtualized__Table__row');

            // 在当前行中找到所需的字段
            //const invoiceCode = row.querySelector('[data-index="invoice_code"]').textContent.trim();
           // const invoiceNo = row.querySelector('[data-index="invoice_no"] span[title]').getAttribute('title');
            const amountWithTax = row.querySelector('[data-index="amount_with_tax"] span[title]').getAttribute('title');

            // 将这些字段作为一个对象存储到数组中
            selectedInvoices.push({
                //发票代码: invoiceCode,
                //发票号码: invoiceNo,
                含税金额: amountWithTax
            });
        });

        // 输出结果
        //console.log(selectedInvoices);

        const total = selectedInvoices.reduce((pre, cur) => Number(pre) + Number(cur.含税金额 || 0), 0);
        button.innerText = `复制选中的发票(${total.toFixed(2)}元)`;
    }, 1000)

    // hahaha();
    // Your code here...
    })();