// ==UserScript==
// @name         孔夫子旧书网库存显示及自动计算售价
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  孔夫子库存显示
// @author       图南
// @match        https://search.kongfz.com/product_result/*
// @match        https://book.kongfz.com/*
// @grant        GM_xmlhttpRequest
// @connect      book.kongfz.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475705/%E5%AD%94%E5%A4%AB%E5%AD%90%E6%97%A7%E4%B9%A6%E7%BD%91%E5%BA%93%E5%AD%98%E6%98%BE%E7%A4%BA%E5%8F%8A%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97%E5%94%AE%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/475705/%E5%AD%94%E5%A4%AB%E5%AD%90%E6%97%A7%E4%B9%A6%E7%BD%91%E5%BA%93%E5%AD%98%E6%98%BE%E7%A4%BA%E5%8F%8A%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97%E5%94%AE%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to show price details when on detail page
    function showPriceDetailsOnDetailPage() {
        let productPriceElement = document.querySelector('.now-price .now-price-text');
        let productPrice = parseFloat(productPriceElement.textContent.trim().replace('￥', ''));
        let shippingFeeElement = document.querySelector('.carry-cont .express-wrapper');
        let shippingFeeText = shippingFeeElement.textContent.match(/快递 ￥(\d+(\.\d{1,2})?)/);
        let shippingFee = shippingFeeText ? parseFloat(shippingFeeText[1]) : 0;
        let costPrice = productPrice + shippingFee;
        //修改下面这行，costPrice * 1.3 ，这里的数字就可以了，1.3就是加价30%
        let sellingPrice = costPrice * 1.3;
        let profit = sellingPrice - costPrice;
        let priceInfoDiv = document.createElement('div');
        priceInfoDiv.style.marginTop = '10px';
        priceInfoDiv.style.border = '1px solid #e0e0e0';
        priceInfoDiv.style.padding = '10px';
        priceInfoDiv.style.backgroundColor = '#f7f7f7';
        priceInfoDiv.style.borderRadius = '5px';
        priceInfoDiv.innerHTML = `
            <div style="margin-bottom: 5px;"><strong>包含快递总价:</strong> ¥${costPrice.toFixed(2)}</div>
            <div style="margin-bottom: 5px;"><strong>建议售价:</strong> ¥${sellingPrice.toFixed(2)}</div>
            <div><strong>预计利润（+30%）:</strong> ¥${profit.toFixed(2)}</div>
        `;
        let priceContainer = document.querySelector('.now-price');
        priceContainer.insertAdjacentElement('afterend', priceInfoDiv);
    }

    // Functions related to the search page
    function getDetailPageLinks() {
        let detailPageLinks = document.querySelectorAll('.item-info .title a.link');
        let links = Array.from(detailPageLinks).map(link => link.href);
        console.log(`找到了 ${links.length} 个商品详情页链接`);
        return links;
    }

    function fetchStockInfo(link) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: link,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const stockInfoElementOne = doc.querySelector('.count-state.state-one');
                    const stockInfoElementMultiple = doc.querySelector('.count-state .store-count');
                    let stockInfo = '';
                    if (stockInfoElementOne) {
                        stockInfo = '库存：1';
                    } else if (stockInfoElementMultiple) {
                        stockInfo = '库存：' + stockInfoElementMultiple.textContent.trim();
                    } else {
                        stockInfo = '库存信息暂无';
                    }
                    console.log(`已获取 ${link} 的库存信息: ${stockInfo}`);
                    resolve(stockInfo);
                }
            });
        });
    }

    function displayStockInfo(stockInfo, stockInfoDiv) {
        if (stockInfo) {
            stockInfoDiv.innerText = stockInfo;
            if (stockInfo === '库存：1') {
                stockInfoDiv.style.color = 'red';
                stockInfoDiv.style.fontWeight = 'bold';
            }
        } else {
            stockInfoDiv.innerText = '库存信息暂无';
        }
    }

    async function fetchAndDisplayStockInfo() {
        let detailPageLinks = getDetailPageLinks();
        let concurrentRequests = 5;
        let index = 0;
        while (index < detailPageLinks.length) {
            let batchLinks = detailPageLinks.slice(index, index + concurrentRequests);
            let batchPromises = batchLinks.map(link => fetchStockInfo(link));
            let batchResults = await Promise.all(batchPromises);
            batchResults.forEach((stockInfo, i) => {
                let currentIndex = index + i;
                let stockInfoDiv = document.querySelectorAll('.collection-btn.stock-info')[currentIndex];
                displayStockInfo(stockInfo, stockInfoDiv);
            });
            index += concurrentRequests;
        }
    }

    function removeStockInfoDivs() {
        let oldDivs = document.querySelectorAll('.collection-btn.stock-info');
        oldDivs.forEach(div => div.remove());
        let buyButtonContainers = document.querySelectorAll('.collection-btn.stockInfoAdded');
        buyButtonContainers.forEach(container => container.classList.remove('stockInfoAdded'));
    }

    function initSearchPage() {
        function addStockInfoDivs() {
            let buyButtonContainers = document.querySelectorAll('.collection-btn:not(.stockInfoAdded)');
            console.log(`找到了 ${buyButtonContainers.length} 个“立即购买”容器`);
            buyButtonContainers.forEach(container => {
                let stockInfoDiv = document.createElement('div');
                stockInfoDiv.className = 'collection-btn stock-info';
                stockInfoDiv.style.marginRight = '10px';
                let stockInfoSpan = document.createElement('span');
                stockInfoSpan.className = 'bold';
                stockInfoSpan.innerText = '库存信息加载中...';
                stockInfoDiv.appendChild(stockInfoSpan);
                container.parentNode.insertBefore(stockInfoDiv, container.nextSibling);
                container.classList.add('stockInfoAdded');
            });
        }
        addStockInfoDivs();
        let startFetchButton = document.createElement('button');
        startFetchButton.style.position = 'fixed';
        startFetchButton.style.bottom = '10px';
        startFetchButton.style.right = '10px';
        startFetchButton.style.padding = '10px 20px';
        startFetchButton.style.border = 'none';
        startFetchButton.style.borderRadius = '5px';
        startFetchButton.style.background = '#3498db';
        startFetchButton.style.color = 'white';
        startFetchButton.style.cursor = 'pointer';
        startFetchButton.style.fontSize = '16px';
        startFetchButton.style.transition = 'background 0.3s';
        startFetchButton.style.width = '120px';
        startFetchButton.style.height = '60px';
        startFetchButton.innerHTML = '点击查询<br>展示库存';
        startFetchButton.addEventListener('mouseover', () => {
            startFetchButton.style.background = '#2980b9';
        });
        startFetchButton.addEventListener('mouseout', () => {
            startFetchButton.style.background = '#3498db';
        });
        document.body.appendChild(startFetchButton);
        let isDragging = false;
        let deltaX = 0;
        let deltaY = 0;
        startFetchButton.addEventListener('mousedown', (e) => {
            isDragging = true;
            deltaX = e.clientX - startFetchButton.getBoundingClientRect().left;
            deltaY = e.clientY - startFetchButton.getBoundingClientRect().top;
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                startFetchButton.style.left = e.clientX - deltaX + 'px';
                startFetchButton.style.bottom = 'auto';
                startFetchButton.style.top = e.clientY - deltaY + 'px';
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        startFetchButton.addEventListener('click', () => {
            removeStockInfoDivs();
            addStockInfoDivs();
            fetchAndDisplayStockInfo();
        });
    }

    window.onload = function() {
        if (window.location.href.includes("book.kongfz.com")) {
            showPriceDetailsOnDetailPage();
        } else if (window.location.href.includes("search.kongfz.com")) {
            initSearchPage();
        }
    };
})();
