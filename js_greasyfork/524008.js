// ==UserScript==
// @name         印迹查看要过期的视觉需求
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自動點擊美團 Ingee 頁面元素並統計日期 (使用最快速的北京時間比較和正確的日期提取)
// @author       Gemini
// @match        https://ingee.meituan.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/524008/%E5%8D%B0%E8%BF%B9%E6%9F%A5%E7%9C%8B%E8%A6%81%E8%BF%87%E6%9C%9F%E7%9A%84%E8%A7%86%E8%A7%89%E9%9C%80%E6%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/524008/%E5%8D%B0%E8%BF%B9%E6%9F%A5%E7%9C%8B%E8%A6%81%E8%BF%87%E6%9C%9F%E7%9A%84%E8%A7%86%E8%A7%89%E9%9C%80%E6%B1%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickElement(xpath) {
        try {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                element.click();
                console.log("成功點擊元素: " + xpath);
                return true;
            } else {
                console.log("未找到元素: " + xpath);
                return false;
            }
        } catch (error) {
            console.error("點擊元素出錯: " + error);
            return false;
        }
    }

    function executeClicksAndAnalyze() {
        const step1Success = clickElement('//*[@id="app"]/main/div/div/div[2]/div[2]/div[2]/div[1]/p[4]');

        if (step1Success) {
            setTimeout(() => {
                const step2Success = clickElement('//*[@id="app"]/main/div/div/div[2]/div[2]/div[2]/div[3]/div/div/div');
                if (step2Success) {
                    setTimeout(() => {
                        clickElement('/html/body/div[5]/ul/div/li[4]');
                        setTimeout(() => { analyzeDates(); }, 1500); // 確保下拉選單內容載入完成
                    }, 500);
                }
            }, 1000);
        }
    }

    function analyzeDates() {
        let todayCount = 0;
        let futureCount = 0;

        const dateElements = document.querySelectorAll('.mtd-ingee-table-body p.cycle');

        const todayString = new Date().toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/');

        dateElements.forEach(element => {
            const dateText = extractEndDate(element.textContent);
            if (dateText) {
                if (dateText === todayString) {
                    todayCount++;
                } else if (dateText < todayString) {
                    futureCount++;
                }
            }
        });

        displayResults(todayCount, futureCount);
    }

    function extractEndDate(text) {
        if (!text) return null;

        const parts = text.split('至');
        if (parts.length === 2) {
            const endDate = parts[1].trim();
            if (endDate.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
                return endDate;
            }
        }
        return null;
    }

    function displayResults(todayCount, futureCount) {
        const oldResultDiv = document.getElementById('ingee-result');
        if (oldResultDiv) {
            oldResultDiv.remove();
        }

        const resultDiv = document.createElement('div');
        resultDiv.id = 'ingee-result';
        resultDiv.style.position = 'fixed';
        resultDiv.style.top = '6px';
        resultDiv.style.right = '0px';
        resultDiv.style.backgroundColor = 'white';
        resultDiv.style.padding = '10px';
        resultDiv.style.border = '0px solid black';
        resultDiv.style.zIndex = 9999;
        resultDiv.innerHTML = `今天到期 <b>${todayCount}</b> 个视觉需求，已过期 <b>${futureCount}</b> 个视觉需求`;
        document.body.appendChild(resultDiv);
    }

    let checkInterval = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(checkInterval);
            executeClicksAndAnalyze();
        }
    }, 500);
})();