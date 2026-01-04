// ==UserScript==
// @name         统计京东搜索页的商品信息
// @namespace    com.hailong
// @version      0.1
// @license      GNU General Public License v3.0
// @description  在京东搜索商品后，将将页面以内的商品信息统计下载到 excel
// @author       hailong
// @match        https://search.jd.com/*
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.16.9/dist/xlsx.mini.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @icon         图标icon地址
// @grant        GM_log
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/477149/%E7%BB%9F%E8%AE%A1%E4%BA%AC%E4%B8%9C%E6%90%9C%E7%B4%A2%E9%A1%B5%E7%9A%84%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/477149/%E7%BB%9F%E8%AE%A1%E4%BA%AC%E4%B8%9C%E6%90%9C%E7%B4%A2%E9%A1%B5%E7%9A%84%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("location.hostname:",location.hostname);

    // 获取销售数量
    function getNumber(str) {
        if (str.includes('万+')) {
            return parseInt(str) * 10000
        }
        return parseInt(str)
    }

    window.onload = function () {
    // 创建一个按钮用于触发数据导出
    var exportButton = document.createElement('button');
    exportButton.innerHTML = '导出商品信息';
    exportButton.style.position = 'fixed';
    exportButton.style.top = '10px';
    exportButton.style.right = '10px';
    exportButton.style.zIndex = '9999';
    document.body.appendChild(exportButton);
    // 绑定按钮点击事件
    exportButton.addEventListener('click', function() {
        exportToExcel();
    });
    }

    function getProductInfo() {
        var productInfoList = [];
        document.querySelectorAll('#J_goodsList > ul > li').forEach(el => {
         const id = el.getAttribute("data-sku");
         const name = el.querySelector('.p-name').innerText
         const price = parseFloat(el.querySelector('.p-price i').innerText)
         const sales = getNumber(el.querySelector('.p-commit a').innerText)
         console.log(id, name, price, sales)
            productInfoList.push({
                '商品ID': id,
                '商品名称': name,
                '价格': price,
                '评论数量': sales
            });
        })
        return productInfoList
       }


     // 导出数据到Excel
    function exportToExcel() {
        var productInfoList = getProductInfo();

        if (productInfoList.length === 0) {
            alert('没有找到商品信息！');
            return;
        }

        // 创建一个新的Excel文件
        var wb = XLSX.utils.book_new();
        // 将商品信息添加到工作表
        var ws = XLSX.utils.json_to_sheet(productInfoList);
        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '商品信息');
        // 生成Excel文件
        var today = new Date();
        var fileName = '京东商品信息_' + today.toISOString().slice(0, 10) + '.xlsx';

        // 保存文件
        XLSX.writeFile(wb, fileName);
    }

})()