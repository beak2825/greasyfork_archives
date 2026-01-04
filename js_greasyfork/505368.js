// ==UserScript==
// @name         ECOSteam价格比例(找挂刀)插件
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  找挂刀，看比例
// @match        https://www.ecosteam.cn/goods/*.html
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      steamcommunity.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505368/ECOSteam%E4%BB%B7%E6%A0%BC%E6%AF%94%E4%BE%8B%28%E6%89%BE%E6%8C%82%E5%88%80%29%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/505368/ECOSteam%E4%BB%B7%E6%A0%BC%E6%AF%94%E4%BE%8B%28%E6%89%BE%E6%8C%82%E5%88%80%29%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const steamRatio = 1.15;
    
    // getItemId getSteamOrderList getSteamSoldNumber 取自网易BUFF价格比例(找挂刀)插件
    function getItemId(buff_item_id, steamLink) {
        return new Promise(function (resolve, reject) {
            let steam_item_id = GM_getValue(buff_item_id);
            if (steam_item_id) {
                resolve(steam_item_id);
                return;
            } else if (steam_item_id === null) {
                reject({ status: 404, statusText: "物品不在货架上" });
            }
            GM_xmlhttpRequest({
                url: steamLink,
                method: "get",
                onload: function (res) {
                    if (res.status == 200) {
                        let html = res.responseText;
                        try {
                            steam_item_id = /Market_LoadOrderSpread\(\s?(\d+)\s?\)/.exec(html)[1];
                        } catch (error) {
                            GM_setValue(buff_item_id, null);
                            res.status = 404;
                            res.statusText = "物品不在货架上";
                            console.log("获取itemID状态异常：", res);
                            reject(res);
                            return;
                        }
                        GM_setValue(buff_item_id, steam_item_id);
                        resolve(steam_item_id);
                    } else {
                        console.log("获取itemID状态异常：", res);
                        reject(res);
                    }
                },
                onerror: function (err) {
                    console.log("获取itemID错误：", err);
                    reject(err);
                },
                ontimeout: function () {
                    let err = { "status": 408, "statusText": "连接steam超时，请检查steam市场连接性" };
                    console.log("获取itemID超时：", err);
                    reject(err);
                }
            });
        });
    }

    function getSteamOrderList(buff_item_id, steamLink) {
        return new Promise(function (resolve, reject) {
            getItemId(buff_item_id, steamLink).then(function (steam_item_id) {
                GM_xmlhttpRequest({
                    url: `https://steamcommunity.com/market/itemordershistogram?country=CN&language=schinese&currency=23&item_nameid=${steam_item_id}&two_factor=0`,
                    headers: {
                        "referer": steamLink,
                        "X-Requested-With": "XMLHttpRequest",
                        "Host": "steamcommunity.com",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.35"
                    },
                    method: "get",
                    onload: function (res) {
                        if (res.status == 200) {
                            resolve(JSON.parse(res.responseText));
                            return;
                        }
                        console.log("访问steamorder状态异常：", res);
                        reject(res);
                    },
                    onerror: function (err) {
                        console.log("访问steamorder列表出错：", err);
                        reject(err);
                    },
                    ontimeout: function () {
                        let err = { "status": 408, "statusText": "连接steam超时，请检查steam市场连接性" };
                        console.log("访问steamorder列表超时：", err);
                        reject(err);
                    }
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    function getSteamSoldNumber(app_id, hash_name) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                url: `https://steamcommunity.com/market/priceoverview/?appid=${app_id}&currency=23&market_hash_name=${hash_name}`,
                headers: {
                    "referer": `https://steamcommunity.com/market/listings/${app_id}/${hash_name}`,
                    "X-Requested-With": "XMLHttpRequest",
                    "Host": "steamcommunity.com",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.35"
                },
                method: "get",
                onload: function (res) {
                    if (res.status == 200) {
                        let json = JSON.parse(res.responseText);
                        if (json.success) {
                            resolve(json);
                            return;
                        }
                    }
                    console.log("访问steam销售数量状态异常：", res);
                    reject(res);
                },
                onerror: function (err) {
                    console.log("访问steam销售数量出错：", err);
                    reject(err);
                },
                ontimeout: function () {
                    let err = { "status": 408, "statusText": "连接steam超时，请检查steam市场连接性" };
                    console.log("访问steam销售数量超时：", err);
                    reject(err);
                }
            });
        });
    }
    
    function parsePrice(priceString) {
        return priceString.match(/\d+(\.\d+)?/)[0];
    }

    function parseBuyOrderTable(table, price) {
        const div = document.createElement('adiv');
        div.innerHTML = table;

        const rows = div.querySelectorAll('tr:not(:first-child)');

        const orderData = Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td');
            const sellPriceString = cells[0].textContent.trim();
            const sellPrice = parsePrice(sellPriceString) / steamRatio;
            return {
                price: sellPriceString,
                ratio: (price / sellPrice).toFixed(2),
                quantity: parseInt(cells[1].textContent.trim(), 10)
            };
        });

        return orderData;
    }

    function showBuyOrderData(orderData) {
        const priceinfoDiv = document.querySelector('div.priceinfo-wrap');
        if (!priceinfoDiv) return;
        
        const containerDiv = document.createElement('div');
        containerDiv.className = 'float-right';
        containerDiv.style.marginRight = '-20px';
        containerDiv.style.fontFamily = 'Arial, sans-serif';
        containerDiv.style.fontSize = '12px';
        containerDiv.style.lineHeight = '26px';
        containerDiv.style.textAlign = 'center';
        
        const columnWidths = ['100px', '50px', '50px'];
        
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['价格', '比例', '数量'].forEach((headerText, index) => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.width = columnWidths[index];
            th.style.borderBottom = '1px solid #2a475e';
            if (index > 0) {
                th.style.borderLeft = '1px solid #2a475e';
            }
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        orderData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.style.backgroundColor = index % 2 === 0 ? '#16202d' : '#1b2838';
            [item.price, item.ratio, item.quantity].forEach((cellText, cellIndex) => {
                const td = document.createElement('td');
                td.textContent = cellText;
                td.style.width = columnWidths[cellIndex];
                if (cellIndex > 0) {
                    td.style.borderLeft = '1px solid #2a475e';
                }
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        containerDiv.appendChild(table);
        
        priceinfoDiv.appendChild(containerDiv);
    }
    
    function showSaleRatio(sellPrice) {
        const div = document.querySelector('div.layui-tab-item.text-center.sale.layui-show');
        if (!div) return;
        
        const headerRow = div.querySelector('thead tr');
        if (!headerRow) return;
        
        const flowerColumn = headerRow.querySelector('th:nth-child(2)');
        if (flowerColumn) {
            flowerColumn.remove();
        }
        
        const ratioHeader = document.createElement('th');
        ratioHeader.textContent = '比例';
        headerRow.insertBefore(ratioHeader, headerRow.querySelector('th:last-child'));
        
        const rows = div.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const flowerCell = row.querySelector('td:nth-child(2)');
            if (flowerCell) {
                flowerCell.remove();
            }
            
            const priceCell = row.querySelector('td:nth-child(3)');
            if (!priceCell) return;
            
            const priceString = priceCell.textContent.trim();
            const price = parsePrice(priceString);
            
            const ratio = (price / sellPrice * steamRatio).toFixed(2);
            
            const ratioCell = document.createElement('td');
            ratioCell.innerHTML = `<span style="color:  ">${ratio}</span>`;
            
            row.insertBefore(ratioCell, row.querySelector('td:last-child'));
        });
    }
    
    window.addEventListener('load', function () {
        let linkElement = document.querySelector('a.looksteamprice');
        let steamLink = linkElement.getAttribute('href');
        let linkParts = steamLink.split('/').filter(part => part !== '');
        let app_id = linkParts[linkParts.length - 2];
        let hash_name = linkParts[linkParts.length - 1];
        let buff_item_id = app_id + '/' + hash_name;
        let price = document.querySelector('span.-BottomPrice-').textContent;
        
        getSteamSoldNumber(app_id, hash_name).then(function (soldNumber) {
            if (soldNumber.success) {
                const value = soldNumber.volume || '0';
                const getColorByValue = value => {
                    const num = parseInt(value.replace(/,/g, ''), 10);
                    return num > 1000 ? '#EB4B4B' :
                    num > 500  ? '#D32CE6' :
                    num > 200  ? '#8847FF' :
                    num > 100  ? '#4B69FF' :
                    '#B0C3D9';
                }
                const color = getColorByValue(value);
                $(".goodsattr-wrap").append(`24小时销量丨                    <span style="color: ${color}">${value}</span>`);
            }
        });
        
        getSteamOrderList(buff_item_id, steamLink).then(function (orderList) {
            if (orderList.success) {
                if (orderList.buy_order_table != "") {
                    const orderData = parseBuyOrderTable(orderList.buy_order_table, price);
                    console.log('orderData', orderData);
                    
                    const sellPrice = orderData[0]['price'].match(/\d+(\.\d+)?/)[0];
                    
                    showSaleRatio(sellPrice);
                    
                    showBuyOrderData(orderData);
                }
            }
        });
    });
})();
