// ==UserScript==
// @name         线性代数的崩坏星穹铁道&绝区零B站直播奖励兑换码导出脚本
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  线性代数的兑换码导出脚本\n首次使用，请阅读以下内容。1. 此脚本为闲鱼用户‘线性代数’原创，id只有“线性代数”四个字，未含任何多余字符，头像为粉色爱莉希雅，会员名为“x***5”请认准正版，支持原创，警惕冒充倒卖行为。2. 禁止一切倒卖行为，可以分享给朋友使用，但是严禁倒卖！！！ 3. 若您是购买获得的此脚本，请务必确认是否为正版！！！4. 务必认准id“线性代数”以及会员名“x***5”！！！
// @author       线性代数

// @match        https://www.bilibili.com/blackboard/award-history.html?activity_id=*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/490835/%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0%E7%9A%84%E5%B4%A9%E5%9D%8F%E6%98%9F%E7%A9%B9%E9%93%81%E9%81%93%E7%BB%9D%E5%8C%BA%E9%9B%B6B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%A5%96%E5%8A%B1%E5%85%91%E6%8D%A2%E7%A0%81%E5%AF%BC%E5%87%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/490835/%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0%E7%9A%84%E5%B4%A9%E5%9D%8F%E6%98%9F%E7%A9%B9%E9%93%81%E9%81%93%E7%BB%9D%E5%8C%BA%E9%9B%B6B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%A5%96%E5%8A%B1%E5%85%91%E6%8D%A2%E7%A0%81%E5%AF%BC%E5%87%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var fisrtUse = GM_getValue("fisrtUse", true);
    if (fisrtUse) {
       var message = "线性代数的兑换码导出脚本\n首次使用，请阅读以下内容。\n\n" +
              "1. 此脚本为闲鱼用户‘线性代数’原创，id只有“线性代数”四个字，未含任何多余字符，头像为粉色爱莉希雅，会员名为“x***5”请认准正版，支持原创，警惕冒充倒卖行为。\n\n" +
              "2. 禁止一切倒卖行为，可以分享给朋友使用，但是严禁倒卖！！！ \n" +
              "3. 若您是购买获得的此脚本，请务必确认是否为正版！！！\n"+
              "4. 务必认准id“线性代数”以及会员名“x***5”！！！\n"+
              "若您阅读完毕须知内容且确认为正版，请输入“同意” 然后开始使用。"
        var mzsm = prompt( message, "");
        if (mzsm == "同意") {
            GM_setValue("fisrtUse", false);
        }
        else {
            alert("须知内容未同意，脚本停止运行。\n");
            return;
        }
    }

    function processPrizeInformation() {
        const prizeList = document.querySelector("#app > section > div > div > div > ul");
        const categories = {};

        prizeList.querySelectorAll('li').forEach((item, index) => {
            const giftElement = item.querySelector('p[data-v-e7579516]');
            const cardNumberElement = item.querySelector('.lottery-history-item-center-content:nth-of-type(2)');
            const timeElement = item.querySelector('  div.lottery-history-item-center > span:nth-child(4)');


            const giftName = giftElement ? giftElement.textContent : '无';
            const cardNumber = cardNumberElement ? cardNumberElement.textContent : '无';
            const time = timeElement ? timeElement.textContent : '无';
            categories[giftName] = categories[giftName] || [];
            categories[giftName].push({ giftName, cardNumber, time });
        });

        return categories;
    }
    function saveToTxt(categories) {
        let starQiongData = '';
        let otherData = '';

        for (const categoryName in categories) {
            if (categories.hasOwnProperty(categoryName)) {
                const categoryData = categories[categoryName];
                let previousName = '';

                categoryData.forEach(item => {
                    const itemText = `${item.giftName}, ${item.cardNumber}, ${item.time}\n`;

                    if (item.giftName !== previousName) {
                        if (item.giftName.includes("星琼") || item.giftName.includes("通票")|| item.giftName.includes("菲林")|| item.giftName.includes("原装母带")) {
                            starQiongData += '\n' + itemText;
                        } else {
                            otherData += '\n' + itemText;
                        }
                    } else {
                        if (item.giftName.includes("星琼") || item.giftName.includes("通票")|| item.giftName.includes("菲林")|| item.giftName.includes("原装母带")) {
                            starQiongData += itemText;
                        } else {
                            otherData += itemText;
                        }
                    }
                    previousName = item.giftName;
                });
            }
        }

        const finalTextData = starQiongData + '\n' + otherData;
        const blob = new Blob([finalTextData], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'B站兑换码.txt';
        link.click();
    }

    function saveToExcel(categories) {
        const workbook = XLSX.utils.book_new();
        const starQiongData = [];
        const otherData = {};

        for (const categoryName in categories) {
            if (categories.hasOwnProperty(categoryName)) {
                const categoryData = categories[categoryName];

                categoryData.forEach(item => {
                    const sheetData = [item.giftName, item.cardNumber, item.time];

                    if (item.giftName.includes("星琼") || item.giftName.includes("通票")|| item.giftName.includes("菲林")|| item.giftName.includes("原装母带")) {
                        starQiongData.push(sheetData);
                    } else {
                        if (!otherData[item.giftName]) {
                            otherData[item.giftName] = [];
                        }
                        otherData[item.giftName].push(sheetData);
                    }
                });
            }
        }

        starQiongData.sort((a, b) => new Date(b[2]) - new Date(a[2]));

        const colWidths = [{wch: 20}, {wch: 20}, {wch: 20}];
        const starQiongWorksheet = XLSX.utils.aoa_to_sheet([['名称', '兑换码', '时间'], ...starQiongData]);
        XLSX.utils.book_append_sheet(workbook, starQiongWorksheet, '重要奖励');

        starQiongWorksheet['!rows'] = new Array(starQiongData.length + 1).fill({hpt: 30, hpx: 30});
        starQiongWorksheet['!cols'] = colWidths;

        for (const itemName in otherData) {
            if (otherData.hasOwnProperty(itemName)) {
                const sanitizedItemName = itemName.replace(/[:\/?*\[\]]/g, '_');
                const itemData = otherData[itemName];
                const itemWorksheet = XLSX.utils.aoa_to_sheet([['名称', '兑换码', '时间'], ...itemData]);
                XLSX.utils.book_append_sheet(workbook, itemWorksheet, sanitizedItemName);

                itemWorksheet['!rows'] = new Array(itemData.length + 1).fill({hpt: 30, hpx: 30});
                itemWorksheet['!cols'] = colWidths;
            }
        }

        const excelDataArrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelBlob = new Blob([excelDataArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(excelBlob);
        link.download = 'B站兑换码.xlsx';
        link.click();
    }

    function addExportButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '0';
        buttonContainer.style.left = '50%';
        buttonContainer.style.transform = 'translateX(-50%)';
        buttonContainer.style.display = 'flex';

        const createButton = (text, onClick) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.fontSize = '20px';
            button.style.color = 'white';
            button.style.backgroundColor = 'red';
            button.style.padding = '10px 25px';
            button.style.border = '2px solid black';
            button.style.cursor = 'pointer';
            button.onclick = onClick;
            return button;
        };

        const exportTxtBtn = createButton('导出兑换码为txt', () => {
            const categories = processPrizeInformation();
            if (categories) {
                saveToTxt(categories);
            }
        });

        const exportCsvBtn = createButton('导出兑换码为Excel', () => {
            const categories = processPrizeInformation();
            if (categories) {
                saveToExcel(categories);
            }
        });

        buttonContainer.appendChild(exportTxtBtn);
        buttonContainer.appendChild(exportCsvBtn);

        document.body.appendChild(buttonContainer);
    }

    window.onload = addExportButtons;
})();