// ==UserScript==
// @name         淘工厂折扣获取
// @namespace    http://tampermonkey.net/
// @version      2024-04-16 
// @description  1.使得点击【登录复制】后可以直接复制，而不用登录; 2.设置整个页面的文本为可选中以及复制。
// @author       逃逸线-芸茄商贸
// @match        *://tgc.tmall.com/ds/page/supplier*
// @match        *:tgc.tmall.com/ds/page/supplier/marketing-operating-data*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmall.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.3/dist/xlsx.full.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492701/%E6%B7%98%E5%B7%A5%E5%8E%82%E6%8A%98%E6%89%A3%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/492701/%E6%B7%98%E5%B7%A5%E5%8E%82%E6%8A%98%E6%89%A3%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';


    let page = 1;
    let dataList = [];



     // Your code here...
    function waitForElement(selector, callback) {
        var element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(function() {
                waitForElement(selector, callback);
            }, 500);
        }
    }
    // 尝试等待淘宝页面元素加载完成
    waitForElement('.component-form-sn-operations-absolute', function(element) {
        // 找到元素后执行您的操作
        return createBtn()

    });



    function createBtn(){
        // 创建按钮元素
        var button = document.createElement('button');
        button.textContent = '点击下载';
        button.id = 'downloadButton';

        // 设置按钮样式
        button.style.padding = '10px';
        button.style.backgroundColor = '#3498db';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.disabled=false
        var element = document.querySelector('.component-form-sn-operations-absolute');
        element.appendChild(button);


        // 添加点击事件处理程序
        button.addEventListener('click', function() {
           // Entry point
            page = 1;
            dataList = [];
            var button = document.getElementById('downloadButton');
            button.disabled=true
            button.textContent='下载中。。。'
             button.style.backgroundColor = '#056b00';
           getFirstData();



        });
    }



    function getFirstData() {
        fetchData(page);
    }

    function fetchData(page) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://tgc.tmall.com/ds/api/v1/c2mpromotion/pkg/dailyDiscount/queryEnrolledItemListNew?page=${page}&itemsPerPage=10&pkgId=3583&pageCode=supplier-item-acceleration-manage`,
            onload: function(res) {
                const currentData = JSON.parse(res.response);
                for (const item of currentData.data) {
                    dataList.push(item);
                }
                const total = currentData.paginator.items;
                if (total > page * 10) {
                    var delay = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
                    setTimeout(() => fetchData(++page), delay); // Fetch next page
                } else {
                    console.log("dataList",dataList)
                   // downloadExcel(dataList);
                    var button = document.getElementById('downloadButton');
                    button.disabled=false
                    button.style.backgroundColor = '#3498db';
                    button.textContent = '点击下载';
                }
            },
            onerror: function(error) {
                console.error("Error fetching data:", error);
            }
        });
    }

    function downloadExcel(data) {
        const filteredData = data.map(row => [
            row.itemName ?? "",
            row.itemId ?? "",
            row.itemImgUrl ?? "",
            `${row.dailyPriceVO?.lowDailyPrice ?? ""}-${row.dailyPriceVO?.highDailyPrice ?? ""}`,
            row.currentEffectiveDiscount ?? "",
            getSchemeDiscount(row, '日常'),
            getSchemeDate(row, '日常'),
            getSchemeStatus(row, '日常'),
            getSchemeDiscount(row, '活动'),
            getSchemeDate(row, '活动'),
            getSchemeStatus(row, '活动'),
            getSchemeDiscount(row, '大促'),
            getSchemeDate(row, '大促'),
            getSchemeStatus(row, '大促'),
            getSchemeDiscount(row, '智能跟价'),
            getSchemeDate(row, '智能跟价'),
            getSchemeStatus(row, '智能跟价')
        ]);

        const headers = ['商品名称', '商品id', '商品图片', '日销范围价', '当前折扣', '日常方案折扣', '日常方案期限', '日常方案状态', '活动方案折扣', '活动方案期限', '活动方案状态', '大促方案折扣', '大促方案期限', '大促方案状态', '智能跟价折扣', '智能跟价期限', '智能跟价状态'];

        const worksheetData = [headers, ...filteredData];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        const excelUrl = URL.createObjectURL(excelBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = excelUrl;
        downloadLink.download = 'exported_data.xlsx';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    function getSchemeDiscount(row, schemeType) {
        const scheme = row.enrolledPkgElementVOList.find(scheme => scheme.schemeType === schemeType);
        return scheme ? scheme.supplierConfirmDiscount : "";
    }

    function getSchemeDate(row, schemeType) {
        const scheme = row.enrolledPkgElementVOList.find(scheme => scheme.schemeType === schemeType);
        return scheme ? `${scheme.onlineStartTime}-${scheme.onlineEndTime}` : "";
    }

    function getSchemeStatus(row, schemeType) {
        const scheme = row.enrolledPkgElementVOList.find(scheme => scheme.schemeType === schemeType);
        return scheme ? scheme.pkgElementStatusName : "";
    }

})();
