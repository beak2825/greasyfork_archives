// ==UserScript==
// @name         best milkcnomy
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  一键读取api的价格并导入
// @author       deric
// @match        *://*milkonomy.pages.dev/*
// @author       deric
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544309/best%20milkcnomy.user.js
// @updateURL https://update.greasyfork.org/scripts/544309/best%20milkcnomy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 这里可以编写你的代码

    // 新增：从 MWIApi 仓库读取 milkyapi.json 的函数
    async function fetchMWIApiJson() {
        // 直接用原始内容链接（raw.githubusercontent.com）
        const url = 'https://www.milkywayidle.com/game_data/marketplace.json';
        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error('网络请求失败');
            const data = await resp.json();
            console.log('MWIApi JSON:', data);
            return data;
        } catch (e) {
            console.error('获取 MWIApi JSON 失败:', e);
            return null;
        }
    }

    // 新增：API结构转换函数
    function transformApiData(apiData, makeAskManualFalse = false, makeBidManualFalse = false) {
        if (!apiData || !apiData.marketData) return [];
        const result = [];
        for (const hrid in apiData.marketData) {
            const itemData = apiData.marketData[hrid];
            for (const level in itemData) {
                const priceData = itemData[level];
                if (priceData.a === -1 && priceData.b === -1) continue; // 跳过无效价格
                // 检查价格差异
                const askPrice = priceData.b === -1 ? 0 : priceData.b;
                const bidPrice = priceData.a === -1 ? 0 : priceData.a;
                const priceDiff = Math.abs(askPrice - bidPrice) / Math.max(askPrice, bidPrice);
                const isPriceDiffLarge = priceDiff > 0.1; // 20%差异
                // 检查价格上限（10M）
                const isPriceTooHigh = askPrice > 10000000000 || bidPrice > 1000000000;
                result.push({
                    hrid: hrid,
                    level: parseInt(level),
                    ask: {
                        manual: makeAskManualFalse || priceData.a === -1 ? false : (priceData.b !== -1 && !isPriceDiffLarge && !isPriceTooHigh),
                        manualPrice: priceData.b === -1 ? 0 : priceData.b
                    },
                    bid: {
                        manual: makeBidManualFalse || priceData.a === -1 ? false : (priceData.a !== -1 && !isPriceDiffLarge && !isPriceTooHigh),
                        manualPrice: priceData.a === -1 ? 0 : priceData.a
                    }
                });
            }
        }
        return result;
    }

    // 新增：右上角添加按钮，点击后显示API内容
    function addApiButton() {
        if (document.getElementById('mwiApiBtn')) return;
        const btn = document.createElement('button');
        btn.id = 'mwiApiBtn';
        btn.textContent = '';
        btn.innerHTML = `<div style="text-align:right;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-right:8px;"><path d="M10 2V14M10 14L5 9M10 14L15 9" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="16" width="14" height="2" rx="1" fill="#fff"/></svg>右买左卖<br><span style="font-size:17px;">低买高卖</span></div>`;
        btn.style.position = 'fixed';
        // 读取上次位置
        const lastLeft = localStorage.getItem('mwiApiBtnLeft');
        const lastTop = localStorage.getItem('mwiApiBtnTop');
        btn.style.top = lastTop ? lastTop + 'px' : '18px';
        btn.style.left = lastLeft ? lastLeft + 'px' : '';
        btn.style.right = lastLeft ? '' : '24px';
        btn.style.zIndex = 99999;
        btn.style.background = 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '10px';
        btn.style.padding = '10px 24px 12px 18px';
        btn.style.fontSize = '17px';
        btn.style.fontWeight = 'bold';
        btn.style.boxShadow = '0 4px 16px rgba(56,249,215,0.18)';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'background 0.2s, box-shadow 0.2s, transform 0.1s';
        btn.onmouseenter = function() {
            btn.style.background = 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)';
            btn.style.boxShadow = '0 6px 24px rgba(67,233,123,0.25)';
            btn.style.transform = 'scale(1.04)';
        };
        btn.onmouseleave = function() {
            btn.style.background = 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)';
            btn.style.boxShadow = '0 4px 16px rgba(56,249,215,0.18)';
            btn.style.transform = 'scale(1)';
        };
        // 拖动功能
        let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
        btn.addEventListener('mousedown', function(e) {
            isDragging = true;
            dragOffsetX = e.clientX - btn.offsetLeft;
            dragOffsetY = e.clientY - btn.offsetTop;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                let newLeft = e.clientX - dragOffsetX;
                let newTop = e.clientY - dragOffsetY;
                // 限制范围
                newLeft = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, newLeft));
                newTop = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, newTop));
                btn.style.left = newLeft + 'px';
                btn.style.top = newTop + 'px';
                btn.style.right = '';
            }
        });
        document.addEventListener('mouseup', function(e) {
            if (isDragging) {
                isDragging = false;
                localStorage.setItem('mwiApiBtnLeft', parseInt(btn.style.left));
                localStorage.setItem('mwiApiBtnTop', parseInt(btn.style.top));
                document.body.style.userSelect = '';
            }
        });
        btn.onclick = async function() {
            if (isDragging) return; // 拖动时不触发点击
            btn.disabled = true;
            btn.innerHTML = `<div style="text-align:right;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-right:8px;"><path d="M10 2V14M10 14L5 9M10 14L15 9" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="16" width="14" height="2" rx="1" fill="#fff"/></svg>处理中...<br><span style="font-size:17px;">请稍候</span></div>`;
            const data = await fetchMWIApiJson();
            btn.disabled = false;
            btn.innerHTML = `<div style="text-align:right;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-right:8px;"><path d="M10 2V14M10 14L5 9M10 14L15 9" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="16" width="14" height="2" rx="1" fill="#fff"/></svg>右买左卖<br><span style="font-size:17px;">低买高卖</span></div>`;
            // 新增：重构并写入localStorage
            const transformed = data ? transformApiData(data) : null;
            if (transformed) {
                localStorage.setItem('price-list', JSON.stringify(transformed));
            }
            // 处理完后刷新网页
            setTimeout(() => { location.reload(); }, 500);
        };
        document.body.appendChild(btn);


    }

    // 新增：右买右卖按钮
    function addRightBuySellButton() {
        if (document.getElementById('rightBuySellBtn')) return;
        const btn = document.createElement('button');
        btn.id = 'rightBuySellBtn';
        btn.textContent = '';
        btn.innerHTML = `<div style="text-align:right;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-right:8px;"><path d="M10 2V14M10 14L5 9M10 14L15 9" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="16" width="14" height="2" rx="1" fill="#fff"/></svg>右买右卖<br><span style="font-size:17px;">低买低卖</span></div>`;
        btn.style.position = 'fixed';
        // 读取上次位置
        const lastLeft = localStorage.getItem('rightBuySellBtnLeft');
        const lastTop = localStorage.getItem('rightBuySellBtnTop');
        btn.style.top = lastTop ? lastTop + 'px' : '68px';
        btn.style.left = lastLeft ? lastLeft + 'px' : '';
        btn.style.right = lastLeft ? '' : '24px';
        btn.style.zIndex = 99999;
        btn.style.background = 'linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '10px';
        btn.style.padding = '10px 24px 12px 18px';
        btn.style.fontSize = '17px';
        btn.style.fontWeight = 'bold';
        btn.style.boxShadow = '0 4px 16px rgba(67,97,238,0.18)';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'background 0.2s, box-shadow 0.2s, transform 0.1s';
        btn.onmouseenter = function() {
            btn.style.background = 'linear-gradient(90deg, #3a0ca3 0%, #4361ee 100%)';
            btn.style.boxShadow = '0 6px 24px rgba(67,97,238,0.25)';
            btn.style.transform = 'scale(1.04)';
        };
        btn.onmouseleave = function() {
            btn.style.background = 'linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)';
            btn.style.boxShadow = '0 4px 16px rgba(67,97,238,0.18)';
            btn.style.transform = 'scale(1)';
        };
        // 拖动功能
        let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
        btn.addEventListener('mousedown', function(e) {
            isDragging = true;
            dragOffsetX = e.clientX - btn.offsetLeft;
            dragOffsetY = e.clientY - btn.offsetTop;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                let newLeft = e.clientX - dragOffsetX;
                let newTop = e.clientY - dragOffsetY;
                // 限制范围
                newLeft = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, newLeft));
                newTop = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, newTop));
                btn.style.left = newLeft + 'px';
                btn.style.top = newTop + 'px';
                btn.style.right = '';
            }
        });
        document.addEventListener('mouseup', function(e) {
            if (isDragging) {
                isDragging = false;
                localStorage.setItem('rightBuySellBtnLeft', parseInt(btn.style.left));
                localStorage.setItem('rightBuySellBtnTop', parseInt(btn.style.top));
                document.body.style.userSelect = '';
            }
        });
        btn.onclick = async function() {
            if (isDragging) return; // 拖动时不触发点击
            btn.disabled = true;
            btn.innerHTML = `<div style="text-align:right;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-right:8px;"><path d="M10 2V14M10 14L5 9M10 14L15 9" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="16" width="14" height="2" rx="1" fill="#fff"/></svg>处理中...<br><span style="font-size:17px;">请稍候</span></div>`;
            const data = await fetchMWIApiJson();
            btn.disabled = false;
            btn.innerHTML = `<div style="text-align:right;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-right:8px;"><path d="M10 2V14M10 14L5 9M10 14L15 9" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="16" width="14" height="2" rx="1" fill="#fff"/></svg>右买右卖<br><span style="font-size:17px;">低买低卖</span></div>`;
            // 新增：重构并写入localStorage，将所有ask.manual设置为false
            const transformed = data ? transformApiData(data, false, true) : null;
            if (transformed) {
                localStorage.setItem('price-list', JSON.stringify(transformed));
            }
            // 处理完后刷新网页
            setTimeout(() => { location.reload(); }, 500);
        };
        document.body.appendChild(btn);
    }

    // 新增：左买左卖按钮
    function addLeftBuySellButton() {
        if (document.getElementById('leftBuySellBtn')) return;
        const btn = document.createElement('button');
        btn.id = 'leftBuySellBtn';
        btn.textContent = '';
        btn.innerHTML = `<div style="text-align:right;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-right:8px;"><path d="M10 2V14M10 14L5 9M10 14L15 9" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="16" width="14" height="2" rx="1" fill="#fff"/></svg>左买左卖<br><span style="font-size:17px;">高买高卖</span></div>`;
        btn.style.position = 'fixed';
        // 读取上次位置
        const lastLeft = localStorage.getItem('leftBuySellBtnLeft');
        const lastTop = localStorage.getItem('leftBuySellBtnTop');
        btn.style.top = lastTop ? lastTop + 'px' : '118px';
        btn.style.left = lastLeft ? lastLeft + 'px' : '';
        btn.style.right = lastLeft ? '' : '24px';
        btn.style.zIndex = 99999;
        btn.style.background = 'linear-gradient(90deg, #f72585 0%, #7209b7 100%)';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '10px';
        btn.style.padding = '10px 24px 12px 18px';
        btn.style.fontSize = '17px';
        btn.style.fontWeight = 'bold';
        btn.style.boxShadow = '0 4px 16px rgba(247,37,133,0.18)';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'background 0.2s, box-shadow 0.2s, transform 0.1s';
        btn.onmouseenter = function() {
            btn.style.background = 'linear-gradient(90deg, #7209b7 0%, #f72585 100%)';
            btn.style.boxShadow = '0 6px 24px rgba(247,37,133,0.25)';
            btn.style.transform = 'scale(1.04)';
        };
        btn.onmouseleave = function() {
            btn.style.background = 'linear-gradient(90deg, #f72585 0%, #7209b7 100%)';
            btn.style.boxShadow = '0 4px 16px rgba(247,37,133,0.18)';
            btn.style.transform = 'scale(1)';
        };
        // 拖动功能
        let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
        btn.addEventListener('mousedown', function(e) {
            isDragging = true;
            dragOffsetX = e.clientX - btn.offsetLeft;
            dragOffsetY = e.clientY - btn.offsetTop;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                let newLeft = e.clientX - dragOffsetX;
                let newTop = e.clientY - dragOffsetY;
                // 限制范围
                newLeft = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, newLeft));
                newTop = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, newTop));
                btn.style.left = newLeft + 'px';
                btn.style.top = newTop + 'px';
                btn.style.right = '';
            }
        });
        document.addEventListener('mouseup', function(e) {
            if (isDragging) {
                isDragging = false;
                localStorage.setItem('leftBuySellBtnLeft', parseInt(btn.style.left));
                localStorage.setItem('leftBuySellBtnTop', parseInt(btn.style.top));
                document.body.style.userSelect = '';
            }
        });
        btn.onclick = async function() {
            if (isDragging) return; // 拖动时不触发点击
            btn.disabled = true;
            btn.innerHTML = `<div style="text-align:right;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-right:8px;"><path d="M10 2V14M10 14L5 9M10 14L15 9" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="16" width="14" height="2" rx="1" fill="#fff"/></svg>处理中...<br><span style="font-size:17px;">请稍候</span></div>`;
            const data = await fetchMWIApiJson();
            btn.disabled = false;
            btn.innerHTML = `<div style="text-align:right;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-right:8px;"><path d="M10 2V14M10 14L5 9M10 14L15 9" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="16" width="14" height="2" rx="1" fill="#fff"/></svg>左买左卖<br><span style="font-size:17px;">高买高卖</span></div>`;
            // 新增：重构并写入localStorage，将所有bid.manual设置为false
            const transformed = data ? transformApiData(data,true) : null;
            if (transformed) {
                localStorage.setItem('price-list', JSON.stringify(transformed));
            }
            // 处理完后刷新网页
            setTimeout(() => { location.reload(); }, 500);
        };
        document.body.appendChild(btn);
    }

    // 页面加载后自动添加按钮
    addApiButton();
    addRightBuySellButton();
    addLeftBuySellButton();
})();