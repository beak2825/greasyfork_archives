// ==UserScript==
// @name         23.08.06亚马逊商品调价（匹配最低价）
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  自动匹配最低价，并根据设置值进行调整
// @author       menkeng
// @run-at       context-menu
// @match        https://sellercentral.amazon.com/inventory?viewId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @license      GPLv3
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/472559/230806%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%95%86%E5%93%81%E8%B0%83%E4%BB%B7%EF%BC%88%E5%8C%B9%E9%85%8D%E6%9C%80%E4%BD%8E%E4%BB%B7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/472559/230806%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%95%86%E5%93%81%E8%B0%83%E4%BB%B7%EF%BC%88%E5%8C%B9%E9%85%8D%E6%9C%80%E4%BD%8E%E4%BB%B7%EF%BC%89.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
let runtime = 0;
let changetime = 0;
let modificationRecords = [];
var count = 0;
const rela_css = "class: a-input-text main-entry mt-icon-input mt-input-text; width: 113px;height: 25px;position: relative;text-align: right;padding-left: 21px;padding: 3px 7px;line-height: normal";
const buttonStyles = {
    margin: "0 10px 0 0",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
};

const buttonsContainer = document.createElement("div");
buttonsContainer.style.position = "fixed";
buttonsContainer.style.left = "20px";
buttonsContainer.style.bottom = "20px";
document.body.appendChild(buttonsContainer);

const saveButton = document.createElement("button");
saveButton.innerText = "保存数据";
saveButton.id = "saveButton";
Object.assign(saveButton.style, buttonStyles);
buttonsContainer.appendChild(saveButton);

const batchFillButton = document.createElement("button");
batchFillButton.innerText = "批量填写";
batchFillButton.id = "batchFillButton";
Object.assign(batchFillButton.style, buttonStyles);
buttonsContainer.appendChild(batchFillButton);

const runScriptButton = document.createElement("button");
runScriptButton.innerText = "运行脚本";
runScriptButton.id = "runScriptButton";
Object.assign(runScriptButton.style, buttonStyles);
buttonsContainer.appendChild(runScriptButton);

const startButton = document.createElement("button");
startButton.innerText = "随机循环";
startButton.id = "startButton";
Object.assign(startButton.style, buttonStyles);
buttonsContainer.appendChild(startButton);

const stopButton = document.createElement("button");
stopButton.innerText = "停止循环";
stopButton.id = "stopButton";
Object.assign(stopButton.style, buttonStyles);
buttonsContainer.appendChild(stopButton);

const downloadButton = document.createElement("button");
downloadButton.innerText = "导出记录";
downloadButton.id = "downloadButton";
Object.assign(downloadButton.style, buttonStyles);
buttonsContainer.appendChild(downloadButton);



var productRows = Array.from(document.querySelector("tbody:first-of-type").querySelectorAll("tr:not(:first-child)"));
productRows.forEach((row) => {
    let asin = row.getAttribute('data-delayed-dependency-data').split('Asin":"')[1].split('"')[0];
    let Foctory_price = row.querySelector("td:nth-child(1)");
    let Factory_priceInput = document.createElement("input");
    Factory_priceInput.type = "text";
    Factory_priceInput.style.cssText = rela_css
    Factory_priceInput.value = localStorage.getItem(`price_${asin}`) || 0;
    Foctory_price.appendChild(Factory_priceInput);

    let adjustmentCell = row.querySelector("td:nth-child(2)");
    let adjustmentInput = document.createElement("input");
    adjustmentInput.type = "text";
    adjustmentInput.style.cssText = rela_css
    adjustmentInput.value = localStorage.getItem(`adjustment_${asin}`) || 0;
    adjustmentCell.appendChild(adjustmentInput);
});

document.getElementById("saveButton").addEventListener("click", () => {
    productRows.forEach((row) => {
        let asin = row.getAttribute('data-delayed-dependency-data').split('Asin":"')[1].split('"')[0];
        let Factory_priceInput = row.querySelector("td:nth-child(1) input");
        let adjustmentInput = row.querySelector("td:nth-child(2) input");
        localStorage.setItem(`price_${asin}`, Factory_priceInput.value);
        localStorage.setItem(`adjustment_${asin}`, adjustmentInput.value);
    });
});

// 批量填写
document.getElementById("batchFillButton").addEventListener("click", () => {
    let priceValue = prompt("请输入底价：");
    let adjustmentValue = prompt("请输入调价幅度：");
    productRows.forEach((row) => {
        let Factory_priceInput = row.querySelector("td:nth-child(1) input");
        let adjustmentInput = row.querySelector("td:nth-child(2) input");
        Factory_priceInput.value = priceValue;
        adjustmentInput.value = adjustmentValue;
    });
});

// 运行脚本
document.getElementById("runScriptButton").addEventListener("click", () => {
    runtime++
    var NowTime = new Date().toLocaleString()
    console.log("已运行次数: " + runtime + "\t已修改次数:" + changetime + " \t" + NowTime);
    var productRows = Array.from(document.querySelector("tbody:first-of-type").querySelectorAll("tr:not(:first-child)"));
    productRows.forEach((row) => {
        let asin = row.getAttribute('data-delayed-dependency-data').split('Asin":"')[1].split('"')[0];
        let Factory_price = localStorage.getItem(`price_${asin}`) || 0;
        let adjustmentInput = localStorage.getItem(`adjustment_${asin}`) || 0;
        let lowestPriceText = row.querySelector("td[data-column='lowPrice'] a.a-link-normal.mt-link-content.mt-table-main")
        if (lowestPriceText == null) { return }
        let lowestPrice = parseFloat(lowestPriceText.innerText.replace("$", ""));
        var currentPrice = row.querySelector("[id$='price-price'] > div > span > input");
        console.log("asin:\n " + asin + "\nlowestPrice:\n " + lowestPrice + "\ncurrentPrice: \n" + currentPrice.value + "\nFactory_price: \n" + Factory_price + "\nadjustmentInput: \n" + adjustmentInput);
        if (count >= 10) {
            clickUntilDisabled();
            count = 0;
            setTimeout(() => {}, 3000);
        }
        if (lowestPrice == "NaN") {
            console.log("找不到最低价");
            return;
        }
        if (lowestPrice === 0 || adjustmentInput === "0" || adjustmentInput === "") {
            console.log("不做任何修改");
            return; 
        }
        // 第二个判断：如果当前价格大于最低价，价格修改为最低价-立减，同时确保最低价-立减大于出厂价
        if (parseFloat(currentPrice.value) > lowestPrice) {
            var adjustedPrice = (lowestPrice - parseFloat(adjustmentInput)).toFixed(2);
            if (parseFloat(adjustedPrice) >= Factory_price) {
                currentPrice.value = adjustedPrice;
                console.log(row.querySelector("[id$='price-price'] > div > span > input").value);
                console.log(asin + "价格修改成功" + adjustedPrice + "价格输入框" + row.querySelector("[id$='price-price'] > div > span > input").value);
                count++
                var event = new Event("change", {
                    bubbles: true,
                    cancelable: true,
                });
                setTimeout(() => {
                    currentPrice.dispatchEvent(event);
                    //价格保存延时
                }, 500);
                changetime++
                let record = {
                    asin: asin,
                    originalPrice: currentPrice.value,
                    modifiedPrice: adjustedPrice,
                    factoryPrice: Factory_price,
                    modificationTime: new Date().toLocaleString()
                };
                modificationRecords.push(record);
                setTimeout(() => {
                    var saveall = document.querySelector("#a-autoid-2-announce-floating");
                    saveall.click();
                    setTimeout(function () {
                        (function clickUntilDisabled() {
                            var e = document.querySelector("#a-autoid-2-announce-floating");
                            if (e.classList.contains("a-button-disabled")) {
                                return;
                            }
                            e.click();
                            setTimeout(clickUntilDisabled, 1000);
                        })();
                    }, 1000);
                    //点击保存延时  15s
                }, 15 * 1000);
            }
        }
    });
});
let refreshIntervalId;
document.getElementById("startButton").addEventListener("click", () => {
    const minutes = parseInt(prompt("随机时间上限：（分钟）"));
    const maxDuration = Math.max(1, minutes) * 60 * 1000; // 将分钟转换为毫秒
    const minDuration = 2 * 60 * 1000;
    document.getElementById("startButton").innerText = "正在循环...";
    const runScript = () => {
        document.querySelector("#myitable-search-button > span > input").click();
        setTimeout(() => {
            document.getElementById("runScriptButton").click();
        }, 5000);
    };

    const startRefresh = () => {
        const randomTime = Math.random() * (maxDuration - minDuration) + minDuration;
        setTimeout(() => {
            runScript();
            startRefresh();
        }, randomTime);
    };

    runScript();
    refreshIntervalId = setTimeout(startRefresh, 0);
});

document.getElementById("stopButton").addEventListener("click", () => {
    document.getElementById("startButton").innerText = "开始循环";
    clearTimeout(refreshIntervalId) // 停止循环刷新
});


document.getElementById("downloadButton").addEventListener("click", downloadCSV);

function generateCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ASIN,原价格,修改价,出厂价,修改时间\n";

    modificationRecords.forEach((record) => {
        csvContent += `${record.asin},${record.originalPrice},${record.modifiedPrice},${record.factoryPrice},${record.modificationTime}\n`;
    });

    return encodeURI(csvContent);
}

function downloadCSV() {
    const csvData = generateCSV();

    const link = document.createElement("a");
    link.setAttribute("href", csvData);
    link.setAttribute("download", "价格修改记录.csv");
    link.click();
}