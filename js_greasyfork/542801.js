// ==UserScript==
// @name         better milkcnomy
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  一键读取api的价格并导入
// @author       deric
// @match        *://*milkonomy.pages.dev/*
// @author       deric
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542801/better%20milkcnomy.user.js
// @updateURL https://update.greasyfork.org/scripts/542801/better%20milkcnomy.meta.js
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
    function transformApiData(apiData) {
        if (!apiData || !apiData.marketData) return [];
        const result = [];
        for (const hrid in apiData.marketData) {
            const itemData = apiData.marketData[hrid];
            for (const level in itemData) {
                const priceData = itemData[level];
                if (priceData.a === -1 && priceData.b === -1) continue; // 跳过无效价格
                result.push({
                    hrid: hrid,
                    level: parseInt(level),
                    ask: {
                        manual: priceData.b !== -1,
                        manualPrice: priceData.b === -1 ? 0 : priceData.b
                    },
                    bid: {
                        manual: priceData.a !== -1,
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
        btn.textContent = '导入API';
        btn.style.position = 'fixed';
        // 读取上次位置
        const lastLeft = localStorage.getItem('mwiApiBtnLeft');
        const lastTop = localStorage.getItem('mwiApiBtnTop');
        btn.style.top = lastTop ? lastTop + 'px' : '18px';
        btn.style.left = lastLeft ? lastLeft + 'px' : '';
        btn.style.right = lastLeft ? '' : '24px';
        btn.style.zIndex = 99999;
        btn.style.background = '#4a6';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.padding = '8px 18px';
        btn.style.fontSize = '16px';
        btn.style.cursor = 'pointer';
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
            btn.textContent = '导入中...';
            const data = await fetchMWIApiJson();
            btn.disabled = false;
            btn.textContent = '导入API';
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

    // 页面加载后自动添加按钮
    addApiButton();
})(); 