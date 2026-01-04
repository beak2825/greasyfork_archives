// ==UserScript==
// @name         Stockx Results Exporter
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Collects search results from Baidu and exports as Excel
// @author       Your Name
// @match        https://stockx.com/*
// @grant        GM_addStyle
// @require      https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/523204/Stockx%20Results%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/523204/Stockx%20Results%20Exporter.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let retryTimes = 5;

    async function postDataToAPI(apiUrl, formData) {
        for (let i = 0; i < retryTimes; i++) {
            try {
                await randomSleep(10000, 15000);
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    body: formData, // 直接使用 FormData 作为请求体
                    credentials: 'include' // 设置 credentials 为 'include' 以携带 cookie
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const responseData = await response.json();
                if (responseData.code != 200) {
                    throw new Error(`HTTP error! Status: ${responseData}`);
                }
                return responseData;
            } catch (error) {
                if (i >= retryTimes) {
                    await randomSleep(10000, 30000);
                    alert("网络请求异常，请稍后再重试！")
                    return null;
                }
            }
        }
    }

    async function getDataFromAPI(apiUrl) {
        try {
            await randomSleep(5000, 8000);
            const response = await fetch(apiUrl, {
                method: 'GET',
                credentials: 'include' // 设置 credentials 为 'include' 以携带 cookie
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.text();
            return data;
        } catch (error) {
            alert("网络请求异常，请稍后再重试！")
            return null;
        }
    }


    function displayButton() {
        const $dataElement = $("div.css-1l34g8p");
        if ($dataElement) {
            $dataElement.eq(0).append('<button class="css-1igj0n9" id="downStockx" style="background-color: #ad3a10;color: wheat">导出当前页面产品</button>');
        }
    }

    function textButton(index, total) {
        // const $dataElement = $("div.css-1l34g8p");
        // if ($dataElement) {
        //     $dataElement.eq(0).append('<button class="css-1igj0n9" style="background-color: orangered">+'</button>');
        // }
        $("#downStockx").text("正在导出中，导出进度："+index+"/"+total);
    }


    function downStockx() {
        $("#downStockx").one("click", async function () {
            var $a = $("a[data-testid='productTile-ProductSwitcherLink']");

            var blocks = [];
            $a.each(function (index, ele) {
                let block = {};
                let link = "https://stockx.com" + $(ele).attr("href");
                let price = $(ele).find("p[data-testid=\"product-tile-lowest-ask-amount\"]").text();
                let img = $(ele).find("img").attr("src");
                block.link = link;
                block.price = price;
                block.img = img;
                blocks.push(block);
            });

            let data = [];
            for (let i = 0; i < blocks.length; i++) {
                textButton(i+1, blocks.length);
                let htmlString = await getDataFromAPI(blocks[i].link)
                let parser = new DOMParser();
                let doc = parser.parseFromString(htmlString, 'text/html');
                let cates = $(doc).find("a.chakra-breadcrumb__link")
                let catesStr = [];
                cates.each(function (index, element){
                    catesStr.push($(element).text())
                })
                let imgs = $(doc).find("div[data-component=\"MediaContainer\"] img");
                let img1 = "";
                let img2 = "";

                imgs.each(function (index, element){
                    if(index == 0){
                        img1 = $(element).attr("src")
                    }else{
                        img2 = $(element).attr("src")
                    }
                })
                let title = $(doc).find("h1[data-component=\"primary-product-title\"]").text();
                let title2 = $(doc).find("span[data-component=\"secondary-product-title\"]").text();

                data.push({
                    "产品图片1": img1,
                    "产品图片2": img2,
                    "产品标题1": title.replace(title2, ""),
                    "产品标题2": title2,
                    "类目": catesStr.join("/"),
                    "价格": blocks[i].price,
                    "产品链接": blocks[i].link,

                })
            }
            createExcelFile(data)
        })
    }


    function randomSleep(min, max) {
        return new Promise((resolve) => {
            var randomTime = Math.floor(Math.random() * (max - min + 1)) + min;
            setTimeout(resolve, randomTime);
        });
    }

    function createExcelFile(data) {
        const ws = XLSX.utils.json_to_sheet(data);
        ws['!cols'] = [
            {wch: 30}, // 第一列宽度为20个字符宽度
            {wch: 30}
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'stockx');

        XLSX.writeFile(wb, formatDate(new Date()) + 'stockx.xlsx');
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    displayButton();
    downStockx();
})();