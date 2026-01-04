// ==UserScript==
// @name         抓取数据
// @description  抓取弱点产品数据
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1
// @author       37
// @match        https://www.pepperl-fuchs.com/*
// @match        https://mall.industry.siemens.com/*

// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @require      http://code.jquery.com/jquery-migrate-1.2.1.min.js

// @require      https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js


// @downloadURL https://update.greasyfork.org/scripts/492983/%E6%8A%93%E5%8F%96%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/492983/%E6%8A%93%E5%8F%96%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
(async function () {
    'use strict';
    function getGoodsList() {
        var data = []
        if (window.location.origin == 'https://www.pepperl-fuchs.com') {
            var regex = /^([\d.,]+)\s+(\w+)$/;
            $('.table_product_details').each(function () {
                // 在这里操作每个 .table_product_details 元素
                data.push({
                    "商品编码": $(this).find('.list_inline_link li:eq(0)').text().trim(),
                    "商品名称": $(this).find('.list_inline_link li:eq(1)').text().trim(),
                    "系列编号": $('.alternative').text().trim(),
                    "规格": $(this).find('.list_inline_link li:eq(0)').text().trim(),
                    "型号": $(this).find('.list_inline_link li:eq(0)').text().trim(),
                    "辅助信息1": $(this).find('.info').text().trim(),
                    "销售单价": $(this).find('.product_price').text() ? $(this).find('.product_price').text().match(regex)[1] : 0,
                    "单位": "个"
                })
            });
            createXlsx(data, $('.alternative').text().trim())
        }
        if (window.location.origin == 'https://mall.industry.siemens.com') {
            alert('数据分析成功，确认开始抓取数据...')
            // $.ajaxSetup({ async: false });
            const str = $(".tabActive").text().trim();
            const regex = /\((\d+)\)/;
            const match = regex.exec(str);
            const productId = Math.ceil((match[1] - 0)/500)
            var nowIndex = 0
            for (let index = 1; index <= productId; index++) {
                $.get(`https://mall.industry.siemens.com/mall/webapi/ProductExportApi/ExportBySearch`,
                {
                    'request[SearchTerm]': $('.ui-autocomplete-input')[0].value,
                    'request[ProductResultPage]': index,
                },
                function (result) {
                    result.forEach(item => {
                        data.push({
                            "商品编码": item.articleNumber,
                            "商品名称": item.articleNumber,
                            "系列编号": item.articleNumber,
                            "规格": item.articleNumber,
                            "型号": item.articleNumber,
                            "辅助信息1": item.description,
                            "销售单价": 0,
                            "单位": "个"
                        })
                        
                    })
                    nowIndex++
                    productId == nowIndex && createXlsx(data, $('.ui-autocomplete-input')[0].value)
                });
            }
        }
    }
    function createXlsx(data, name) {
        alert('数据抓取成功，确认后整合数据下载...')
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
        XLSX.utils.sheet_add_aoa(worksheet, [["商品编码", "商品名称", "系列编号", "规格", "型号", "辅助信息1", "销售单价", "单位"]], { origin: "A1" });
        XLSX.writeFile(workbook, name + ".xlsx", { compression: true });
    }
    function initGoods() {
        if (window.location.origin == 'https://www.pepperl-fuchs.com') {
            var newUrl = window.location.href + '?itemsperpage=' + $('.content_info')[1].innerText.match(/\/(\d+)$/)[1]
            window.location.href = newUrl
        }

    }
    function createFloatingInput() {
        const inputContainer = document.createElement("div");
        inputContainer.style.position = "fixed";
        inputContainer.style.top = "60px";
        inputContainer.style.left = "20px";
        inputContainer.style.zIndex = "999999";

        const submitButton = document.createElement("button");
        submitButton.textContent = "抓取商品数据";

        const changeButton = document.createElement("button");
        changeButton.textContent = "重定向数据";

        submitButton.addEventListener("click", () => {
            getGoodsList();
        });
        changeButton.addEventListener("click", () => {
            initGoods();
        });
        inputContainer.appendChild(submitButton);
        window.location.origin == 'https://www.pepperl-fuchs.com' && inputContainer.appendChild(changeButton);
        document.body.appendChild(inputContainer);
    }
    createFloatingInput()
})();
