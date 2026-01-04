// ==UserScript==
// @name         Pionex 網格利潤顯示
// @namespace    http://tampermonkey.net/
// @version      2024-12-14
// @description  加強網格利潤顯功能
// @author       Rick
// @match        https://www.pionex.com/*/orders/bot/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520127/Pionex%20%E7%B6%B2%E6%A0%BC%E5%88%A9%E6%BD%A4%E9%A1%AF%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/520127/Pionex%20%E7%B6%B2%E6%A0%BC%E5%88%A9%E6%BD%A4%E9%A1%AF%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const profitItems = [
        { label: '網格年化報酬率', className: 'annualized-profit' },
        { label: '日均網格利潤 (USDT)', className: 'daily-profit' },
        { label: '累計格利潤 (USDT)', className: 'total-profit' },
    ];

    function extractDateFromRuntime(runtimeText) {
        const dateMatch = runtimeText.match(/(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2})/);
        if (dateMatch) {
            return new Date(dateMatch[1]);
        }
        return null;
    }

    function parseRuntimeToSeconds(runtimeText) {
        const durationMatch = runtimeText.match(/(?:(\d+)日 )?(?:(\d+)時 )?(?:(\d+)分 )?(?:(\d+)秒)/) ||
              runtimeText.match(/Lasting (?:(\d+)d )?(?:(\d+)h )?(?:(\d+)m )?(?:(\d+)s)/);
        let totalSeconds = 0;
        if (durationMatch) {
            const days = parseInt(durationMatch[1] || 0, 10);
            const hours = parseInt(durationMatch[2] || 0, 10);
            const minutes = parseInt(durationMatch[3] || 0, 10);
            const seconds = parseInt(durationMatch[4] || 0, 10);
            totalSeconds += days * 86400; // 一天有 86400 秒
            totalSeconds += hours * 3600; // 一小時有 3600 秒
            totalSeconds += minutes * 60; // 一分鐘有 60 秒
            totalSeconds += seconds;
        }
        return totalSeconds;
    }

    function appendGrid(item) {
        const profitTextElement = item.querySelector('span.mr-4px.text-increase')
        if (!profitTextElement) {
            return;
        }

        const grid = item.querySelector('div.grid');
        if (!grid) {
            return;
        }

        profitItems.forEach(({ label, value, className }) => {
            let profitDiv = grid.querySelector(`.${className}`);
            if (!profitDiv) {
                const profitDiv = document.createElement('div');
                profitDiv.className = `flex flex-col gap-2px text-increase ${className}`;
                profitDiv.innerHTML = `
                <div class="text-secondary text-sm font-r">${label}</div>
        <div class="text-base font-b">--</div>
        `;
                grid.prepend(profitDiv); // 插入到最前面
            }
        });

    }

    function updateGrid(item, {investmentAmount, totalProfitAmount, runtimeInDays}) {
        const grid = item.querySelector('div.grid');

        if (!grid || !investmentAmount || !runtimeInDays) {
            return;
        }

        const totalProfitRate = totalProfitAmount / investmentAmount;
        const dailyProfitAmount = totalProfitAmount / runtimeInDays;
        const dailyProfitRate = dailyProfitAmount / investmentAmount;
        const annualizedProfitAmount = dailyProfitAmount * 365;
        const annualizedProfitRate = dailyProfitRate * 365;

        const values = {
            'annualized-profit': `${(100 * annualizedProfitRate).toFixed(2)}%`,
            'daily-profit': `+${dailyProfitAmount.toFixed(4)} (${(100 * dailyProfitRate).toFixed(2)}%)`,
            'total-profit': `+${totalProfitAmount.toFixed(4)} (${(100 * totalProfitRate).toFixed(2)}%)`,
        }

        profitItems.forEach(({ label, className }) => {
            const value = values[className]
            let profitDiv = grid.querySelector(`.${className}`);
            const valueDiv = profitDiv.querySelector('.text-base.font-b');
            if (valueDiv) {
                valueDiv.innerText = value;
            }
        });
    }



    function findTotalProfitElement (item) {
        const profitTextElement = item.querySelector('span.mr-4px.text-increase')
        if (!profitTextElement) {
            return;
        }
        const profitText = profitTextElement.textContent.trim().replace('+','')
        const tooltipElements = document.querySelectorAll('div.flex.justify-between.text-base.gap-12px>div.text-accent-sub')
        const currentProfitElementArray = Array.from(tooltipElements).filter(element => element.firstChild.textContent.trim() === '總網格利潤' || element.firstChild.textContent.trim() === '當前網格利潤').map(element => element.nextSibling);
        const currentProrfitElement = currentProfitElementArray.find(element => profitText.includes(element.textContent.trim().split(' ')[0]))
        if (!currentProrfitElement) return;
        return currentProrfitElement.parentElement.parentElement.lastChild.lastChild;
    }

    function updateItem(item) {
        const rect = item.getBoundingClientRect()
        if (rect.y > window.innerHeight || rect.y < 0) return;
        const investmentAmountElement = item.querySelector('div.rounded-6px.rounded-tr-none>div.text-lg.font-sb')
        if (!investmentAmountElement) return;
        const investmentAmount = Number(investmentAmountElement.textContent.trim());
        const runtimeElement = item.querySelector(
            'div.text-sm.text-secondary.font-r'
        );
        const runtimeText = runtimeElement ? runtimeElement.textContent.trim() : null;
        if (!runtimeText) {
            return;
        }

        const runtime = parseRuntimeToSeconds(runtimeText);
        const runtimeInDays = runtime / (60 * 60 * 24);

        const totalProfitElement = findTotalProfitElement(item);
        if (totalProfitElement) {
            const totalProfitAmount = Number(totalProfitElement.textContent.split(' ')[0]);

            updateGrid(item, {investmentAmount, totalProfitAmount, runtimeInDays})
            return
        }

        const hoverSvg = item.querySelector('svg > path[fill="#E1E2E5"], svg > path[fill="#27282A"]');
        if (hoverSvg) {
            hoverSvg.dispatchEvent(new MouseEvent('mouseover', {
                bubbles: true,
                cancelable: true,
            }));

            // 等待 tooltip 顯示後，再抓取利潤數據
            setTimeout(() => {
                const totalProfitElement = findTotalProfitElement(item);
                hoverSvg.dispatchEvent(new MouseEvent('mouseout', {
                    bubbles: true,
                    cancelable: true,
                }));
                if (!totalProfitElement) {
                    return;
                }
                const totalProfitAmount = Number(totalProfitElement.textContent.split(' ')[0])
                updateGrid(item, {investmentAmount, totalProfitAmount, runtimeInDays})
            }, 100);
        }
    }

    const observedElements = new Set();
    const intersectingElements = new Set();
    const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                intersectingElements.add(entry.target)
            } else {
                intersectingElements.delete(entry.target)
            }
        });
    }, {
        root: null,
        threshold: 0
    });

    function updateIntersectionObserverItems() {
        const elements = document.querySelectorAll('div[data-index]');
        elements.forEach(element => {
            if (!observedElements.has(element)) {
                intersectionObserver.observe(element);
                observedElements.add(element);
            }
        });
    }

    function update() {
        updateIntersectionObserverItems();
        intersectingElements.forEach(element => {
            appendGrid(element);
            updateItem(element);
        })
    }

    update();
    setInterval(update, 500);
})();