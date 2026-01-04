// ==UserScript==
// @name         计算利润率
// @namespace    http://tampermonkey.net/
// @version      24.3.15.1
// @description  Add buttons to the page for extracting ASIN values, combining them with Amazon product URL, displaying for easy copying, supporting pagination, and including separate functionalities for copy, open all links, clear data, and close window.
// @author       You
// @match        https://www.amazon.com/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.co.uk/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/489044/%E8%AE%A1%E7%AE%97%E5%88%A9%E6%B6%A6%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/489044/%E8%AE%A1%E7%AE%97%E5%88%A9%E6%B6%A6%E7%8E%87.meta.js
// ==/UserScript==


// 立即执行函数，用于封装作用域，防止全局污染
(function() {
    'use strict'; // 使用严格模式

    // 创建表格的函数
    function createTable() {
        // 遍历所有商品元素
        document.querySelectorAll('#gridItemRoot, [data-component-type="s-search-result"]').forEach(function(gridItem) {
            // 获取重量元素，并提取重量文本
            let weightElement = gridItem.querySelector('.exts-color-gray');
            let weightText = weightElement ? weightElement.textContent : '';
            // 正则匹配重量数字和单位
            let weightMatches = weightText.match(/(\d+(\.\d+)?)(\s*)(g|kg)/);
            let weight = weightMatches ? parseFloat(weightMatches[1]) : 0; // 解析重量数值
            let weightUnit = weightMatches ? weightMatches[4] : ''; // 解析重量单位

            // 获取FBA费用元素，并提取费用数值
            let fbaFeeElement = gridItem.querySelector('.exts-color-border-black.ml-ext-3.el-tooltip__trigger');
            let fba_fee = fbaFeeElement ? parseFloat(fbaFeeElement.textContent.replace(/[^\d.]/g, '')) : 0;

            // 尝试获取两种页面结构的价格信息
            let originalPrice = 0; // 默认价格
            let priceElementOld = gridItem.querySelector('._cDEzb_p13n-sc-price_3mJ9Z');
            let priceElementNew = gridItem.querySelector('.show-coupon-price .exts-color-border-black');
            if (priceElementNew) {
                originalPrice = parseFloat(priceElementNew.textContent.replace(/[^\d.]/g, ''));
            } else if (priceElementOld) {
                originalPrice = parseFloat(priceElementOld.textContent.replace(/[^\d.]/g, ''));
            }

            // 获取优惠券信息
            let coupon = 0;
            let couponElement = gridItem.querySelector('.price-coupon');
            if (couponElement) {
                let couponText = couponElement.textContent;
                let match = couponText.match(/(\d+(\.\d+)?)%/);
                if (match) {
                    coupon = parseFloat(match[1]) / 100 * originalPrice;
                } else {
                    match = couponText.match(/(\d+(\.\d+)?)/);
                    if (match) {
                        coupon = parseFloat(match[1]);
                    }
                }
            }

            let price = originalPrice - coupon;

            gridItem.querySelectorAll('span.word-title').forEach(span => {
                if (span.textContent.includes('上架时间')) {
                    let daysSpan = span.parentNode.querySelector('.exts-color-gray');
                    if (daysSpan) {
                        let daysText = daysSpan.textContent;
                        let daysNumberMatch = daysText.match(/\(([\d,]+)天\)/);
                        let days_lasting = daysNumberMatch ? parseInt(daysNumberMatch[1].replace(/,/g, '')) : 0;
                        gridItem.dataset.daysLasting = days_lasting;
                    }
                }
            });

            gridItem.querySelectorAll('span.word-title').forEach(span => {
                if (span.textContent.includes('评分(评分数)')) {
                    let ratingSpan = span.parentNode.querySelector('span.exts-color-border-black').lastElementChild;
                    if (ratingSpan) {
                        let ratingText = ratingSpan.textContent;
                        let ratingNumberMatch = ratingText.match(/\(([\d,]+)\)/);
                        let rating_number = ratingNumberMatch ? parseInt(ratingNumberMatch[1].replace(/,/g, '')) : 0;
                        let days_lasting = gridItem.dataset.daysLasting || 0;

                        if (days_lasting > 0) {
                            let efficiency = (rating_number / days_lasting).toFixed(2);
                            let efficiencySpan = document.createElement('span');
                            efficiencySpan.innerHTML = `&nbsp;&nbsp;上评效率：<span style="color: red;">${efficiency}</span>`;
                            efficiencySpan.style.display = 'block';
                            efficiencySpan.style.fontWeight = 'normal';
                            efficiencySpan.style.textAlign = 'left';

                            span.parentNode.insertAdjacentElement('afterend', efficiencySpan);
                        }
                    }
                }
            });

            let Volume_weight = 0;
            gridItem.querySelectorAll('span.word-title').forEach(span => {
                if (span.textContent.includes('尺寸')) {
                    let sibling = span.nextElementSibling;
                    while (sibling) {
                        if (sibling.tagName === 'SPAN') {
                            const dimensions = sibling.textContent.match(/\d+(\.\d+)?/g);
                            if (dimensions) {
                                Volume_weight = dimensions.reduce((acc, dimension) => acc * parseFloat(dimension), 1) * 16.387064 / 6000;
                                let weightInGrams = weightUnit === 'kg' ? weight * 1000 : weight;
                                let bubbleRatio = weightInGrams > 0 ? (Volume_weight * 1000 / weightInGrams).toFixed(2) : 0;

                                let volumeWeightText = document.createElement('span');
                                volumeWeightText.innerHTML = `体积重： <span style="color: red;">${(Volume_weight.toFixed(2) * 1000).toFixed(0)}g</span>；&nbsp;&nbsp;泡重比：<span style="color: red;">${bubbleRatio}</span>`;
                                volumeWeightText.style.display = 'block';
                                volumeWeightText.style.marginBottom = '0px';

                                let insertAfter = sibling.nextElementSibling;
                                if (insertAfter) {
                                    insertAfter.parentNode.insertBefore(volumeWeightText, insertAfter.nextElementSibling);
                                } else {
                                    sibling.parentNode.appendChild(volumeWeightText);
                                }
                            }
                            break;
                        }
                        sibling = sibling.nextElementSibling;
                    }
                }
            });
            let Volume_weight_cost = Volume_weight * 10;

            var headers = ["成本%", "营销%", "汇率", "退款", "S头程", "利润率"];
            var table = document.createElement('table');
            table.style.width = gridItem.offsetWidth * 0.85 + 'px';
            table.style.borderCollapse = 'collapse';
            table.style.borderColor = 'rgba(255, 157, 36, 0.3)';
            table.style.borderStyle = 'dashed';
            table.style.borderWidth = '0.75px';

            var headerRow = document.createElement('tr');
            headers.forEach(function(header) {
                var th = document.createElement('th');
                th.textContent = header;
                th.style.textAlign = 'center';
                th.style.fontSize = '0.825rem';
                th.style.fontWeight = '500';
                th.style.transform = 'scale(0.9)';
                th.style.cursor = 'pointer';
                th.style.backgroundColor = 'rgb(255, 157, 36)';
                th.style.color = 'white';
                th.style.padding = '2px';
                th.style.borderRadius = '2px';
                th.style.border = '1px dashed rgba(255, 157, 36, 0.3)';
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

            // 定义营销百分比变量，并设置初始数据
            var marketingPercent1;
            if (price > 0 && price <= 10) {
                marketingPercent1 = "10%";
            } else if (price > 10 && price <= 20) {
                marketingPercent1 = "9%";
            } else if (price > 20 && price <= 30) {
                marketingPercent1 = "8%";
            } else if (price > 30 && price <= 40) {
                marketingPercent1 = "7%";
            } else if (price > 40 && price <= 50) {
                marketingPercent1 = "6%";
            } else if (price > 50) {
                marketingPercent1 = "5%";
            } else {
                marketingPercent1 = "0%";
            }

            var data = [
                ["20%", "5%", "7.15", "5%", "", ""],
                ["25%", marketingPercent1, "7.15", "5%", "", ""],
                ["30%", "15%", "7.15", "5%", "", ""]
            ];

            data.forEach(function(rowData) {
                var tr = document.createElement('tr');
                rowData.forEach(function(cellData, cellIndex) {
                    var td = document.createElement('td');
                    td.textContent = cellData;
                    td.style.border = '1px dashed #ffa500';
                    td.style.textAlign = 'center';
                    if (cellIndex !== headers.length - 1) {
                        td.setAttribute('contenteditable', 'true');
                        td.addEventListener('input', function() {
                            updateProfitRate(tr, fba_fee, price, weight, weightUnit, Volume_weight_cost);
                        });
                    }
                    tr.appendChild(td);
                });
                table.appendChild(tr);
                updateProfitRate(tr, fba_fee, price, weight, weightUnit, Volume_weight_cost);
            });

            if (gridItem.matches('[data-component-type="s-search-result"]')) {
                let targetDiv = gridItem.querySelector('.align-items-center.bottom-btn-groups.d-flex-wrap');
                if (targetDiv) {
                    targetDiv.appendChild(table);
                } else {
                    gridItem.appendChild(table);
                }
            } else {
                gridItem.appendChild(table);
            }
        });
    }

    function updateProfitRate(row, fba_fee, price, weight, weightUnit, Volume_weight_cost) {
        var cells = row.querySelectorAll('td');
        var exchangeRate = parseFloat(cells[2].textContent) || 1;
        var shippingCost;
        if (weightUnit === 'g') {
            shippingCost = (weight / 1000) * 10 / exchangeRate;
        } else if (weightUnit === 'kg') {
            shippingCost = weight * 10 / exchangeRate;
        } else {
            shippingCost = 0;
        }

        shippingCost = Math.max(shippingCost, Volume_weight_cost / exchangeRate);
        cells[4].textContent = shippingCost.toFixed(2);

        var costPercent = parseFloat(cells[0].textContent.replace('%', '')) / 100;
        var marketingPercent = parseFloat(cells[1].textContent.replace('%', '')) / 100;
        var refundPercent = parseFloat(cells[3].textContent.replace('%', '')) / 100;
        var sum = costPercent + marketingPercent + refundPercent + 0.15 + 0.02;

        let profitRate = (1 - sum) - fba_fee / price - shippingCost / price;
        cells[cells.length - 1].textContent = (profitRate * 100).toFixed(2) + '%';
    }

    function addButton() {
        var button = document.createElement('button');
        button.textContent = '计算利润率';
        button.style.position = 'fixed';
        button.style.top = '40%';
        button.style.right = '10px';
        button.style.transform = 'translateY(-50%)';
        button.style.backgroundColor = '#FFA500';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.padding = '10px';
        button.style.color = 'white';
        let isClicked = false;

        button.addEventListener('click', function() {
            if (!isClicked) {
                createTable();
                isClicked = true;
                button.style.cursor = 'default';
                button.disabled = true;
            }
        });

        document.body.appendChild(button);
    }

    addButton();
})();
