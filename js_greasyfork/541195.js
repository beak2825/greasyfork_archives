// ==UserScript==
// @name         天巡机票历史价格记录
// @namespace    http://tampermonkey.net/
// @version      2.20250906
// @description  比较现在和以前记录的价格
// @author       你的名字
// @match        https://www.tianxun.com/transport/flights/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541195/%E5%A4%A9%E5%B7%A1%E6%9C%BA%E7%A5%A8%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/541195/%E5%A4%A9%E5%B7%A1%E6%9C%BA%E7%A5%A8%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function waitForElement(selector, callback) {
        console.log('等待页面中出现' + selector + '元素');
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    // 等待页面中出现"条结果"文本
    function waitForText(text, callback) {
        console.log('等待页面中出现"条结果"文本');
        const el = Array.from(document.querySelectorAll('body *')).find(e => e.textContent.includes(text));
        if (el) {
            callback(el);
        } else {
            setTimeout(() => waitForText(text, callback), 1000);
        }
    }

    // 封装抓取和处理逻辑为extractFlightInfo函数
    function extractFlightInfo() {
        waitForText('条结果', () => {
            waitForElement('[class^="FlightsResults_dayViewItems__"]', (container) => {
                // 获取当前搜索结果的日期
                const dateInput = document.getElementById('outbound_date');
                const searchDate = dateInput ? dateInput.value : '';
                // 添加一个key，从<div class="SearchDetails_location__NDZmN">下的文本获取
                const searchLocation = document.querySelector('.SearchDetails_location__NDZmN')?.textContent.trim();

                // 获取所有子div
                const divs = Array.from(container.children);
                if (divs.length <= 1) return;

                // 排除第一个div .slice(1) 有时候不能排除第一个
                divs.forEach(div => {
                    debugger
                    // 获取航司名
                    const airlineSpan = div.querySelector('[class^="LogoImage_label__"]'); // 如果选择不到就得到null
                    const airline = airlineSpan ? airlineSpan.textContent.trim() : '';

                    // 获取出发和到达时间
                    const departDiv = div.querySelector('[class^="RoutePartial_routePartialDepart__"]');
                    const departTime = departDiv ? departDiv.textContent.trim() : '';

                    // 获取到达时间
                    const arriveDiv = div.querySelector('[class^="RoutePartial_routePartialArrive__"]');
                    const arriveTime = arriveDiv ? arriveDiv.textContent.trim() : '';

                    // 获取价格
                    const priceDiv = div.querySelector('[class^="Price_mainPriceContainer__"]');
                    const price = priceDiv ? priceDiv.textContent.trim() : '';

                    if (airline && departTime && price && searchDate) {
                        const key = `${airline}_${departTime}__${arriveTime}_${searchLocation}_${searchDate}`;

                        // 这里添加代码
                        let record = GM_getValue(key, null);
                        let lastPrice = null;
                        let minPrices = [];
                        if (record) {
                            try {
                                record = JSON.parse(record);
                                lastPrice = record.lastPrice;
                                minPrices = Array.isArray(record.minPrices) ? record.minPrices : (record.minPrice ? [record.minPrice] : []);
                            } catch (e) {
                                lastPrice = record;
                                minPrices = [record];
                            }
                        }
                        const infoSpan = document.createElement('span');
                        infoSpan.style.marginLeft = '10px';
                        infoSpan.style.color = '#f60';
                        if (lastPrice !== null) {
                            if (lastPrice === price) {
                                infoSpan.textContent = '没有变化';
                            } else {
                                infoSpan.textContent = `上次价格：${lastPrice}`;
                            }
                            if (minPrices.length > 0) {
                                infoSpan.textContent += ` / 历史价格：${minPrices.join('、')}`;
                            }
                            div.appendChild(infoSpan);
                            // 更新lastPrice和minPrices
                            // 只保留最多7个最低价，升序 修改，不只保留最低价了，只有最低价不好看这个价格变化的趋势
                            debugger
                            let allPrices = minPrices.concat([price]);

                            // allPrices = Array.from(new Set(allPrices.map(p => p.replace(/[^\d.]/g, '')))); // 去重，仅保留数字部分
                            // allPrices = allPrices.map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b).slice(0, 7);
                                
                            // 还原为带货币符号的字符串（用当前price的格式）
                            // const formatPrice = n => price.replace(/([\d.]+)/, n);

                            // 去重，仅保留数字部分
                            allPrices = Array.from(new Set(allPrices.map(p => p.replace(/[^\d.]/g, ''))));
                            allPrices = allPrices.map(Number).filter(n => !isNaN(n));
                            // 还原为字符串
                            const formatPrice = n => n.toString();
                            const minPricesStr = allPrices.slice(-15).map(formatPrice);
                            GM_setValue(key, JSON.stringify({ lastPrice: price, minPrices: minPricesStr }));
                        } else {
                            // 首次保存
                            GM_setValue(key, JSON.stringify({ lastPrice: price, minPrices: [price] }));
                            console.log(`已保存: ${key} => ${price}`);
                        }
                    }
                });
            });
        });
    }

    // 页面加载后执行一次
    extractFlightInfo();

    
    // // 鼠标点击时防抖执行
    // let debounceTimer = null;
    // document.addEventListener('click', () => {
    //     if (debounceTimer) clearTimeout(debounceTimer);
    //     debounceTimer = setTimeout(() => {
    //         extractFlightInfo();
    //     }, 500);
    // });

    // 按下Enter键时执行extractFlightInfo
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            extractFlightInfo();
        }
    });
    
})();
