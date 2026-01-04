// ==UserScript==
// @name         Add Conversion Rate to Orders
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a conversion rate column to the orders table
// @author       Your Name
// @match        https://advertising.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499449/Add%20Conversion%20Rate%20to%20Orders.user.js
// @updateURL https://update.greasyfork.org/scripts/499449/Add%20Conversion%20Rate%20to%20Orders.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract, calculate, and display values
    function extractAndCalculate() {
        console.log('Script is running');

        const elements = document.querySelectorAll('.sc-fzqBkg.fCkJVF');
        if (elements.length === 0) {
            console.log('No elements found with the specified class');
            return;
        }

        const values = Array.from(elements).map(el => {
            const value = parseFloat(el.innerText.trim());
            return isNaN(value) ? 0 : value;
        });

        if (values.length < 12) {
            console.log('Not enough values found');
            return;
        }

        const a = values[1] !== 0 ? (values[2] / values[1]) * 100 : 0;
        const b = values[4] !== 0 ? (values[5] / values[4]) * 100 : 0;
        const c = values[7] !== 0 ? (values[8] / values[7]) * 100 : 0;
        const d = values[10] !== 0 ? (values[11] / values[10]) * 100 : 0;

        console.log(`a = ${a}%`);
        console.log(`b = ${b}%`);
        console.log(`c = ${c}%`);
        console.log(`d = ${d}%`);

        // Function to display results on the page
        function displayResults(a, b, c, d) {
            const resultContainer = document.createElement('div');
            resultContainer.style.position = 'fixed';
            resultContainer.style.bottom = '550px';
            resultContainer.style.left = '70%';
            resultContainer.style.transform = 'translateX(-50%)';
            resultContainer.style.backgroundColor = 'white';
            resultContainer.style.border = '1px solid black';
            resultContainer.style.padding = '10px';
            resultContainer.style.zIndex = 1000;
            resultContainer.style.width = '300px';
            resultContainer.style.textAlign = 'center';

            resultContainer.innerHTML = `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2;"></th>
                            <th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2;">转化率</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">汇总</td>
                            <td style="border: 1px solid black; padding: 8px;">${a.toFixed(2)}%</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">搜索结果顶部（首页）</td>
                            <td style="border: 1px solid black; padding: 8px;">${b.toFixed(2)}%</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">搜索结果的其余位置</td>
                            <td style="border: 1px solid black; padding: 8px;">${c.toFixed(2)}%</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">商品页面</td>
                            <td style="border: 1px solid black; padding: 8px;">${d.toFixed(2)}%</td>
                        </tr>
                    </tbody>
                </table>
            `;

            document.body.appendChild(resultContainer);
            console.log('Results displayed');
        }

        // Display the calculated values on the page
        displayResults(a, b, c, d);
    }

    // Run the function to calculate and display values on page load
    window.addEventListener('load', function() {
        // Wait for 2 seconds to ensure all elements are loaded
        setTimeout(extractAndCalculate, 1000);
    });
})();