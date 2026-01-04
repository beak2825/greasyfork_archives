// ==UserScript==
// @name         SimCompanies-Helper
// @namespace    http://tampermonkey.net/
// @version      1.17
// @description  code based on MOBIL SUPER (bot_7420)
// @match        https://www.simcompanies.com/*
// @require      https://code.highcharts.com/highcharts.js
// @require      https://code.highcharts.com/modules/stock.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.simcotools.com
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520445/SimCompanies-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/520445/SimCompanies-Helper.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const CustomProductionTimeInputs = ["24hr+1pm",'1pm','48hr']; // 生产页面，自定义输入生产时间按钮
    const CustomMpPrice = ["MP-4%","MP-3%","MP-2%",'MP-1'];
    let pageSpecifiedTimersList = [];

    let lastKnownURL = "";
    const mainCheckingURLLoop = () => {
        const currentURL = window.location.href;
        if (currentURL !== lastKnownURL) {
            handleURLChange(currentURL);
            lastKnownURL = currentURL;
        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        while (pageSpecifiedTimersList.length > 0) {
            clearInterval(pageSpecifiedTimersList.pop());
        }
        global_addCSS();
        const currentURL = window.location.href;
        lastKnownURL = currentURL;
        handleURLChange(currentURL);
        setInterval(mainCheckingURLLoop, 1000);
    });

    function handleURLChange(currentURL) {
        while (pageSpecifiedTimersList.length > 0) {
            clearInterval(pageSpecifiedTimersList.pop());
        }
        if (currentURL.includes("/b/")) {
            handleCustomHourInput();
        }
        else if(currentURL.includes("/warehouse/")&&
                currentURL !== "https://www.simcompanies.com/zh/headquarters/warehouse/" &&
                !currentURL.includes("/research/")&&
                !currentURL.includes("contracts/")&&
                !currentURL.includes("/stats/")){
            handleWarehouseItem();
        }
         else if(currentURL.includes("/market/")){
            handleMarketItem();
        }
         else if(currentURL.includes("/messages/")){
            handleChatroom();
        }
    }

    function setInput(inputNode, value) {
        let lastValue = inputNode.value;
        inputNode.value = value;
        let event = new Event("input", { bubbles: true });
        event.simulated = true;
        if (inputNode._valueTracker) inputNode._valueTracker.setValue(lastValue);
        inputNode.dispatchEvent(event);
    }

    function handleCustomHourInput() {
        const checkElementExist = () => {
            const selectedElems = document.querySelectorAll("h3 > svg");
            let isReady = selectedElems.length > 0;
            if (isReady) {
                selectedElems.forEach((node) => {
                    isReady = isReady && node?.parentElement?.parentElement?.querySelector("div > button")?.parentElement;
                });
            }
            if (isReady) {
                clearInterval(timer);
                selectedElems.forEach((node) => {
                    let buttons = node.parentElement.parentElement.querySelectorAll("div > button");
                    let targetNode = buttons[buttons.length - 1];
                    for (const text of CustomProductionTimeInputs) {
                        let newNode = document.createElement("button");
                        newNode.className = "script_custom_hour_button";
                        Object.assign(newNode, { type: "button", role: "button" });
                        newNode.onclick = (e) => {
                            let target_node = e.target.parentElement.parentElement.querySelector("input");
                            let target_text = e.target.innerText;
                            if (e.target.innerText.includes("24hr")|e.target.innerText.includes("24HR")){
                                target_node.click();
                                const now = new Date();
                                // 创建一个后天的日期对象
                                const nextTime = new Date(now);
                                const hours=parseTime(e.target.innerText.split("+")[1]);
                                if (now.getHours() < hours) {
                                    nextTime.setDate(nextTime.getDate() + 1); // 明天
                                } else {
                                    nextTime.setDate(nextTime.getDate() + 2); // 后天
                                }
                                nextTime.setHours(hours, 0, 0, 0);
                                // 计算与当前时间的时间差（毫秒）
                                const timeDifference = nextTime - now;
                                setInput(target_node, timeDifference/1000/60+"m");
                                e.preventDefault();
                            }
                            else {
                                target_node.click();
                                setInput(target_node, target_text);
                                e.preventDefault();
                            }
                        };
                        let commonClass = buttons[0].className;
                        newNode.className += ` ${commonClass}`;
                        newNode.innerText = text;
                        targetNode.before(newNode);
                    }
                });
            }
        };
        let timer = setInterval(checkElementExist, 100);
    }

    function handleWarehouseItem() {
        const newCostTextNode = document.createTextNode("");
        const newMPTextNode = document.createTextNode("");
        const container = document.createElement('div');
        container.id = 'candlestick-chart';
        const incomeText= document.createElement("span");
        incomeText.style.display='inline-block';
        const br1=document.createElement("br");
        const br2=document.createElement("br");
        const checkElementExist = () => {
            const table = document.querySelector(`.css-1vwotq4`);
            const inputPrice = document.querySelector(`input[name="price"]`);
            const inputAmount = document.querySelector(`input[name="amount"]`);
            const amountSpans = document.querySelectorAll(`div.css-1erjzjw span.css-14is9qy`);
            const quality = document.querySelector(`a.css-34bgqk`);
            const record_white = document.querySelector(`div.css-17ayim`);
            const record_black = document.querySelector(`div.css-1hjzqaw`);
            const selling = document.querySelectorAll(`div.col-xs-6`);
            // 计算利润
            if (inputPrice && inputAmount && amountSpans.length >=2 && inputPrice.value>0 && inputAmount.value>0){
                let buttonDiv =document.querySelector(`.e1m6m2hg7`);
                let income=inputPrice.value*inputAmount.value*0.97;
                if (buttonDiv===null){
                    buttonDiv=document.querySelector(`.e1w27nku13`);
                    income=inputPrice.value*inputAmount.value;
                }
                let costPrice = Number(amountSpans[1].textContent.replace(/,/g, "").replace(/\$/g, ""));
                let profit=income-inputAmount.value*costPrice;
                buttonDiv.before(incomeText);
                incomeText.textContent ='收入 $'+numberAddCommas(income.toFixed(0))+' | 利润 $'+numberAddCommas(profit.toFixed(0)) +'(不包含运输费用)';
            }
            // 添加销售按钮
            if (table && selling.length >=2 && !selling[0].classList.contains("script_checked")){
                let marketPriceSpan=table.querySelector("span.css-rnnx2x");
                if (marketPriceSpan===null){
                    marketPriceSpan=table.querySelector("span.css-13ddv1a");
                }
                const exchangePrice = Number(marketPriceSpan.nextSibling.nextSibling.textContent.replace(/,/g, ""));
                selling[0].classList.add("script_checked");
                let p = document.createElement("p");
                p.style.marginBottom = "5px";
                selling[1].appendChild(p);
                for (const text of CustomMpPrice) {
                    let newNode = document.createElement("button");
                    newNode.className = "script_custom_button";
                    Object.assign(newNode, { type: "button", role: "button" });
                    newNode.onclick = (e) => {
                        let target_node = e.target.parentElement.querySelector("input");
                        let target_text = e.target.innerText;
                        setInput(target_node,calcPrice(target_text,exchangePrice));
                        e.preventDefault();
                    }
                    selling[1].appendChild(newNode);
                    newNode.className += ` css-uyxdsm btn btn-secondary`;
                    newNode.innerText = text;
                }
            }
            if (table && amountSpans.length >= 2 && !amountSpans[1].classList.contains("script_checked")) {
                amountSpans[1].classList.add("script_checked");
                const totalCostPriceContainer = document.createElement("span");
                totalCostPriceContainer.appendChild(document.createTextNode("$"));
                totalCostPriceContainer.appendChild(newCostTextNode);
                totalCostPriceContainer.className = "css-14is9qy e12j7voa17";
                amountSpans[1].nextSibling.nextSibling.nextSibling.after(totalCostPriceContainer);
                totalCostPriceContainer.after(" 总成本价值");
                totalCostPriceContainer.nextSibling.after(document.createElement("br"));
                //
                const totalMPContainer = document.createElement("span");
                totalMPContainer.appendChild(document.createTextNode("$"));
                totalMPContainer.appendChild(newMPTextNode);
                totalMPContainer.className = "css-14is9qy e12j7voa17";
                totalCostPriceContainer.nextSibling.nextSibling.after(totalMPContainer);
                totalMPContainer.after(" 总市场价值");
                totalMPContainer.nextSibling.after(document.createElement("br"));
            }
            if(amountSpans.length >= 2 && amountSpans[1].classList.contains("script_checked")){
                let marketPriceSpan=table.querySelector("span.css-rnnx2x");
                if (marketPriceSpan===null){
                    marketPriceSpan=table.querySelector("span.css-13ddv1a");
                }
                const exchangePrice = Number(marketPriceSpan.nextSibling.nextSibling.textContent.replace(/,/g, ""));
                let itemAmount = Number(amountSpans[0].textContent.replace(/,/g, ""));
                let costPrice = Number(amountSpans[1].textContent.replace(/,/g, "").replace(/\$/g, ""));
                let totalCostValue = costPrice * itemAmount;
                totalCostValue = totalCostValue.toFixed(0);
                newCostTextNode.textContent = numberAddCommas(totalCostValue);
                let discountedPrice = exchangePrice * 0.97;
                let totalMarketValue = discountedPrice * itemAmount;
                totalMarketValue = totalMarketValue.toFixed(0);
                newMPTextNode.textContent = numberAddCommas(totalMarketValue);
            }
            // 图信息
            if(quality && record_white && !record_white.classList.contains("script_checked")){
                record_white.classList.add("script_checked");
                const customColors = ['#FFFFFF', '#000000'];
                const urlObj = new URL(quality.href);
                const qualityValue = urlObj.searchParams.get("quality");
                record_white.before(container);
                let realm = 0;
                if (document.querySelector(`div.css-inxa61.e1uuitfi4 img[alt*="企业家"]`)) {
                    realm = 1;
                }
                const array = table.parentNode.href.split("/");
                let itemId = array[array.length - 2];
                const itemName= window.location.href.split("/").slice(-1)[0];

                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://api.simcotools.com/v1/realms/${realm}/market/resources/${itemId}/${qualityValue}/candlesticks/`,
                    headers: {
                        "content-type": "application/json",
                    },
                    onload:function(response){
                        let result = JSON.parse(response.response);
                        const highchartsData=convertCandlesticksData(result);
                        const vwapData=convertVwapData(result);
                        let series=[{
                            type: 'candlestick',
                            name: 'Q'+qualityValue,
                            data: highchartsData
                        }, {
                            type: 'area',
                            id: 'Q'+qualityValue + ' VWAP',
                            name: 'Q'+qualityValue + ' VWAP',
                            data: vwapData
                        }];
                        createCandlestickChart('candlestick-chart',decodeURIComponent(itemName),series,customColors);
                    }
                });
            }
            if(quality && record_black && !record_black.classList.contains("script_checked")){
                record_black.classList.add("script_checked");
                const customColors = ['#222222', '#FFFFFF'];
                const urlObj = new URL(quality.href);
                const qualityValue = urlObj.searchParams.get("quality");
                record_black.before(container);
                let realm = 0;
                if (document.querySelector(`div.css-inxa61.e1uuitfi4 img[alt*="企业家"]`)) {
                    realm = 1;
                }
                const array = table.parentNode.href.split("/");
                let itemId = array[array.length - 2];
                const itemName= window.location.href.split("/").slice(-1)[0];

                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://api.simcotools.com/v1/realms/${realm}/market/resources/${itemId}/${qualityValue}/candlesticks/`,
                    headers: {
                        "content-type": "application/json",
                    },
                    onload:function(response){
                        let result = JSON.parse(response.response);
                        const highchartsData=convertCandlesticksData(result);
                        const vwapData=convertVwapData(result);
                        let series=[{
                            type: 'candlestick',
                            name: 'Q'+qualityValue,
                            data: highchartsData
                        }, {
                            type: 'area',
                            id: 'Q'+qualityValue + ' VWAP',
                            name: 'Q'+qualityValue + ' VWAP',
                            data: vwapData
                        }];
                        createCandlestickChart('candlestick-chart',decodeURIComponent(itemName),series,customColors);
                    }
                });
            }
        }
        const tempTimer = setInterval(checkElementExist, 200);
        pageSpecifiedTimersList.push(tempTimer);
    }

    function convertCandlesticksData(jsondata){
        const highchartsData = jsondata.candlesticks.map(candle => {
            return [
                new Date(candle.date).getTime(),
                candle.open,
                candle.high,
                candle.low,
                candle.close
            ];
        });
        return highchartsData
    }

    function convertVwapData(jsondata){
        const vwapData = jsondata.candlesticks.map(candle => {
            return [
                new Date(candle.date).getTime(),
                candle.vwap
            ];
        });
        return vwapData
    }

    function createCandlestickChart(containerId, chartName,series,customColors) {
        let legendCofig={
            enable: false
        }
        if (series.length>1){
            let legendCofig={
                enable: true,
                align: 'right',
                layout: 'vertical'
            }
            }
        // 创建图表
        Highcharts.stockChart(containerId, {
            chart: {
                backgroundColor: customColors[0]
            },
            title: {
                text: chartName,
                style: {
                    color: customColors[1]
                }
            },
            series: series,
            xAxis: {
                type: 'datetime'
            },
            yAxis: [{
                labels: {
                    align: 'left'
                },
                height: '80%',
                resize: {
                    enabled: true
                }
            }, {
                labels: {
                    align: 'left'
                },
                top: '80%',
                height: '20%'
            }],
            plotOptions: {
                candlestick: {
                    color: '#FF0000',
                    upColor: '#00FF00',
                    lineColor: customColors[1],
                    upLineColor: customColors[1]
                },
                area: {
                    yAxis: 1,
                    color: '#87b4e7'
                }
            },
            rangeSelector: {
                buttons: [{
                    type: 'week',
                    count: 1,
                    text: '近一周'
                },{
                    type: 'month',
                    count: 1,
                    text: '近一月'
                },{
                    type: 'month',
                    count: 3,
                    text: '近一季度'
                }, {
                    type: 'month',
                    count: 6,
                    text: '近半年'
                }, {
                    type: 'ytd',
                    count: 1,
                    text: '近一年'
                }, {
                    type: 'year',
                    count: 1,
                    text: '今年'
                },{
                    type: 'all',
                    count: 1,
                    text: '全部'
                }],
                selected: 0,
                inputEnabled: false
            },
            legend: legendCofig,
        });
    }

    function global_addCSS() {
        // 交易所 左侧栏显示物品名称
        GM_addStyle(`
        .css-1luaoxw {
            display: block !important;
        }
        .css-1fync1v {
            display: block !important;
        }`);
        GM_addStyle(`
        .script_scroll {
            height: 85% !important;
            display: flow;
        }`);
    }

    function numberAddCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function parseTime(timeStr) {
        // 提取小时和上午/下午标识
        const match = timeStr.match(/(\d+)(am|pm)/i);
        if (!match) {
            throw new Error("Invalid time format");
        }

        let hour = parseInt(match[1], 10);
        const period = match[2].toLowerCase();

        // 根据上午/下午转换小时
        if (period === "pm" && hour < 12) {
            hour += 12; // 转换为24小时制
        } else if (period === "am" && hour === 12) {
            hour = 0; // 12am转换为0
        }
        return hour;
    }

    function handleMarketItem(){
        const checkElementExist = () => {
            const header_white= document.querySelector(`div.css-1b1lwg7`);
            const header_black = document.querySelector(`div.css-rnlot4`);
            var backdiv = document.querySelectorAll(`div.css-13mrtrz`);
            if(header_white && !header_white.classList.contains("script_checked")){
                header_white.classList.add("script_checked");
                backdiv[1].classList.add("script_scroll");
                const customColors = ['#FFFFFF', '#000000'];

                // 创建一个容器来放置图表
                const container = document.createElement('div');
                container.id = 'candlestick-chart';
                container.style.width = '100%';
                header_white.before(container);
                let realm = 0;
                if (document.querySelector(`div.css-inxa61.e1uuitfi4 img[alt*="企业家"]`)) {
                    realm = 1;
                }
                const itemId = window.location.href.split("/").slice(-2)[0];
                const itemName= document.querySelector(`span.css-1o0ufd9`).textContent;

                const urlObj = new URL(window.location.href);
                const qualityValue = urlObj.searchParams.get("quality");
                const quality = qualityValue?qualityValue:0;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://api.simcotools.com/v1/realms/${realm}/market/resources/${itemId}/${quality}/candlesticks/`,
                    headers: {
                        "content-type": "application/json",
                    },
                    onload:function(response){
                        let result = JSON.parse(response.response);
                        const highchartsData=convertCandlesticksData(result);
                        const vwapData=convertVwapData(result);
                        let series=[{
                            type: 'candlestick',
                            name: 'Q'+quality,
                            data: highchartsData
                        }, {
                            type: 'area',
                            id: 'Q'+quality+' VWAP',
                            name: 'Q'+quality+' VWAP',
                            data: vwapData,
                        }];
                        createCandlestickChart('candlestick-chart',itemName,series,customColors);
                    }
                });
            }
            if(header_black && !header_black.classList.contains("script_checked")){
                header_black.classList.add("script_checked");
                backdiv[1].classList.add("script_scroll");
                const customColors = ['#222222', '#FFFFFF'];

                // 创建一个容器来放置图表
                const container = document.createElement('div');
                container.id = 'candlestick-chart';
                container.style.width = '100%';
                header_black.before(container);
                let realm = 0;
                if (document.querySelector(`div.css-inxa61.e1uuitfi4 img[alt*="企业家"]`)) {
                    realm = 1;
                }
                const itemId = window.location.href.split("/").slice(-2)[0];
                const itemName= document.querySelector(`span.css-3u1epz`).textContent;

                const urlObj = new URL(window.location.href);
                const qualityValue = urlObj.searchParams.get("quality");
                const quality = qualityValue?qualityValue:0;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://api.simcotools.com/v1/realms/${realm}/market/resources/${itemId}/${quality}/candlesticks/`,
                    headers: {
                        "content-type": "application/json",
                    },
                    onload:function(response){
                        let result = JSON.parse(response.response);
                        const highchartsData=convertCandlesticksData(result);
                        const vwapData=convertVwapData(result);
                        let series=[{
                            type: 'candlestick',
                            name: 'Q'+quality,
                            data: highchartsData
                        }, {
                            type: 'area',
                            id: 'Q'+quality+' VWAP',
                            name: 'Q'+quality+' VWAP',
                            data: vwapData,
                        }];
                        createCandlestickChart('candlestick-chart',itemName,series,customColors);
                    }
                });
            }
        }
        const tempTimer = setInterval(checkElementExist, 500);
        pageSpecifiedTimersList.push(tempTimer);
    }

    function calcPrice(text, mp) {
        if (text.includes('%')) {
            let percentage = parseFloat(text.replace('MP-', '').replace('%', ''));
            return mp * (1 - percentage / 100);
        } else if (text.startsWith('MP-')) {
            let value = parseFloat(text.replace('MP-', ''));
            return mp - value;
        } else {
            throw new Error("无效的输入格式");
        }
    }

    function handleChatroom(){
        const checkElementExist = () => {
            if ("textarea" == document.activeElement.type){
                let t = document.activeElement.selectionStart;
                !!document.activeElement.value.match("：") &&
                    (setTextarea(document.activeElement,
                                 document.activeElement.value.replace("：", ":")),
                     document.activeElement.setSelectionRange(t, t));
            }
        }
        const tempTimer = setInterval(checkElementExist, 1);
        pageSpecifiedTimersList.push(tempTimer);
    }

    function setTextarea(inputElement, newValue, attempts = 3) {
        const currentValue = inputElement.value;
        inputElement.value = newValue;
        const inputEvent = new Event("input", { bubbles: true });
        inputEvent.simulated = true;
        if (inputElement._valueTracker) {
            inputElement._valueTracker.setValue(currentValue);
        }
        inputElement.dispatchEvent(inputEvent);
        if (attempts > 0) {
            return setTextarea(inputElement, newValue, attempts - 1);
        }
    }
})();