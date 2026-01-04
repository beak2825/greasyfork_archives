// ==UserScript==
// @name         发票报销增强
// @namespace    http://tampermonkey.net/
// @version      2024-07-10
// @license MIT
// @description  内部使用
// @author       You
// @match        https://i.xforceplus.com/scan/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500181/%E5%8F%91%E7%A5%A8%E6%8A%A5%E9%94%80%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/500181/%E5%8F%91%E7%A5%A8%E6%8A%A5%E9%94%80%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';


    setInterval(() => {
        if($('.cuisini-btn').length) {return}
        $('.scan-card').each(function () {
            if($(this).find('.cuisini-btn').length) {return}
            // 初始化一个数组来存储解析结果
            var invoicesData = [];
            $(this).find('.card-item').each(function() {
                // 从当前card-item元素中提取信息
                var invoiceCode = $(this).find('span:contains("发票代码") + span').text().trim();
                var invoiceNumber = $(this).find('span:contains("发票号码") + span').text().trim();
                var amountWithTax = $(this).find('span:contains("含税金额") + span').text().trim();

                // 将提取的信息存储到一个对象中
                var invoiceData = {
                    invoiceCode: invoiceCode,
                    invoiceNumber: invoiceNumber,
                    amountWithTax: extractNumberFromString(amountWithTax)
                };

                // 将对象添加到结果数组中
                invoicesData.push(invoiceData);
            });

            console.log(invoicesData, this, $);

            const text = invoicesData.map(item => `${item.invoiceCode}\t${item.invoiceNumber}\t\t\t${item.amountWithTax}`).join(`\n`);
            const total = invoicesData.reduce((pre, cur) => Number(pre) + Number(cur.amountWithTax || 0), 0);
            let button = `<div class="cuisini-btn el-button el-button--mini" style="margin-left: 20px;position: relative;" data-value="${text}">复制信息
            <div style="position: absolute;bottom: -16px;font-size: 12px;width: auto;color: darkblue;">共￥${total.toFixed(2)}</div>
            </div>`
            $(this).find('.card-header').append(button);
        })
        $('.cuisini-btn').click(e => {
            console.log(e, e.target.dataset.value);
            const test = e.target.dataset.value;
            const MIMETYPE = 'text/plain';
            const data = [ new ClipboardItem({ [MIMETYPE]: new Blob([ test ], { type: MIMETYPE }) }) ];
            navigator.clipboard.write(data)
                .then(function() {
                alert('复制成功！去试试粘贴到Excel内吧～');
            }, function() {
                alert('不知道怎么回事，再试一次吧！');
                console.error('Unable to write to clipboard. :-(');
            });
        })
    }, 1000)
    function extractNumberFromString(str) {
        // 使用正则表达式匹配数字部分
        var match = str.match(/(\d+(\.\d+)?)/);
        // 如果找到匹配项，返回匹配的数字字符串；否则返回null
        return match ? match[0] : null;
    }

    // Your code here...
})();