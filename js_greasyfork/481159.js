// ==UserScript==
// @name         商品信息下载脚本
// @namespace    spider
// @version      1.0
// @description  下载网页上的商品基本信息和图片信息，并保存到一个excel文件汇总
// @author       flying
// @match        https://h5.waimai.meituan.com/*
// @grant        none
// @license.     MIT
// @downloadURL https://update.greasyfork.org/scripts/481159/%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/481159/%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建下载按钮
    var downloadButton = document.createElement('div');
    downloadButton.innerHTML = '下载信息';
    downloadButton.style.position = 'fixed';
    downloadButton.style.top = '10px';
    downloadButton.style.right = '10px';
    downloadButton.style.zIndex = '9999';
    downloadButton.style.backgroundColor = '#fff';
    downloadButton.style.padding = '10px';
    document.body.appendChild(downloadButton);

    // 点击下载按钮时执行下载操作
    downloadButton.addEventListener('click', function() {
        var shop = document.querySelector('.title_X4W1xy').textContent;
        var data = [];
        var rows = document.querySelectorAll('dd[data-tag="spu"]');
        rows.forEach(function(row) {
            var item = {};
            var nameElement = row.querySelector('.name_hTGUTi');
            var unitElement = row.querySelector('.unit_tMOCKq');
            var soldElement = row.querySelector('.mtsi-num');
            var imageElement = row.querySelector('.imgTag_M6x_zl');
            var priceElement = row.querySelector('.cprice_RfVnJ3');
            var estimateElement = row.querySelectorAll('.price_EwEf0X span');

            item.商品名 = nameElement ? nameElement.textContent : '';
            item.规格 = unitElement ? unitElement.textContent : '';
            item.销量 = soldElement ? soldElement.textContent : '';
            item.图片 = imageElement ? imageElement.getAttribute('src') : '';
            item.价格 = priceElement ? priceElement.textContent.replace('¥', '') : '';
            item.到手预估 = estimateElement.length > 0 ? estimateElement[1].textContent : '';

            console.log(item.商品名 + ',' + item.规格 + ',' + item.价格 + ',' + item.到手预估 + ',' + item.销量 + ',' + item.图片 );

            data.push(item);
        });

        // 创建excel文件
        var csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += '序号,商品名,规格,价格,到手预估,销量,图片\n';
        data.forEach(function(item, index) {
            csvContent += (index + 1) + ',' + item.商品名 + ',' + item.规格 + ',' + item.价格 + ',' + item.到手预估 + ',' + item.销量 + ',' + item.图片 + '\n';
        });

        // 下载excel文件
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', shop+'.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 遍历所有的 div name="cate-*"，按规则写入excel
    var categories = document.querySelectorAll('div[name^="cate-"]');
    var index = 0;
    var interval = setInterval(function() {
        if (index >= categories.length) {
            clearInterval(interval);
            return;
        }

        var category = categories[index];
        // TODO: 根据规则写入excel

        index++;
    }, 1000);
})();
