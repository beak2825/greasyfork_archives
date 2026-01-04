// ==UserScript==
// @name         Insert Chart Above Price History (Beta)
// @description  Adds a line chart to show price changes over time on Jellyneo's Price History page
// @version      0.1
// @license      GNU GPLv3
// @match        https://items.jellyneo.net/item/*/price-history/
// @author       Posterboy
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @namespace    https://youtube.com/@Neo_Posterboy
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534682/Insert%20Chart%20Above%20Price%20History%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534682/Insert%20Chart%20Above%20Price%20History%20%28Beta%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

// ==============================
// Load External Resources
// ==============================

    // Load Chart.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => initChart();
    document.head.appendChild(script);

    // Initialize Chart and UI
    function initChart() {
        const container = document.querySelector('.pricing-row-container');
        if (!container) return;

        const priceRows = container.querySelectorAll('.price-row');
        const dataPoints = [];

        priceRows.forEach(row => {
            const priceText = row.childNodes[0].textContent.trim();
            const dateText = row.querySelector('.price-date')?.textContent.trim();

            const price = parseInt(priceText.replace(/,/g, '').replace('NP', '').trim());
            const date = dateText?.replace('on ', '').trim();

            if (!isNaN(price) && date) {
                dataPoints.push({ date, price });
            }
        });

        if (dataPoints.length === 0) return;

        dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date));

        const allLabels = dataPoints.map(dp => dp.date);
        const allPrices = dataPoints.map(dp => dp.price);

// ==============================
// UI Elements: Chart and Buttons
// ==============================

        // Create a wrapper container for the UI
        const chartDivWrapper = document.createElement('div');
        chartDivWrapper.style.border = '1px solid #ccc';
        chartDivWrapper.style.borderRadius = '8px';
        chartDivWrapper.style.marginBottom = '20px';
        chartDivWrapper.style.padding = '15px';
        chartDivWrapper.style.textAlign = 'center';

        // Create the UI buttons
        const chartDiv = document.createElement('div');
        const button3M = createButton('3 Months');
        const button6M = createButton('6 Months');
        const button1Y = createButton('1 Year');
        const buttonMax = createButton('Max');

        chartDiv.appendChild(button3M);
        chartDiv.appendChild(button6M);
        chartDiv.appendChild(button1Y);
        chartDiv.appendChild(buttonMax);

        // Create the chart canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'priceChart';
        canvas.style.maxWidth = '100%';
        canvas.style.margin = '20px auto';
        canvas.style.display = 'block';

        // Insert the UI elements into the wrapper container
        chartDivWrapper.appendChild(chartDiv);
        chartDivWrapper.appendChild(canvas);
        container.parentNode.insertBefore(chartDivWrapper, container);

        // Chart Configuration
        const chart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: allLabels,
                datasets: [{
                    label: 'NP Price',
                    data: allPrices,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.2,
                    fill: true,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // Button Event Listeners
        button3M.addEventListener('click', () => updateChart(0.25));
        button6M.addEventListener('click', () => updateChart(0.5));
        button1Y.addEventListener('click', () => updateChart(1));
        buttonMax.addEventListener('click', () => updateChart('max'));

        // Update Chart Data
        function updateChart(range) {
            let cutoff = new Date();
            let filtered;

            if (range === 'max') {
                filtered = dataPoints;
            } else if (range === 0.25) {
                cutoff.setMonth(cutoff.getMonth() - 3);
                filtered = dataPoints.filter(dp => new Date(dp.date) >= cutoff);
            } else if (range === 0.5) {
                cutoff.setMonth(cutoff.getMonth() - 6);
                filtered = dataPoints.filter(dp => new Date(dp.date) >= cutoff);
            } else {
                cutoff.setFullYear(cutoff.getFullYear() - range);
                filtered = dataPoints.filter(dp => new Date(dp.date) >= cutoff);
            }

            chart.data.labels = filtered.map(dp => dp.date);
            chart.data.datasets[0].data = filtered.map(dp => dp.price);
            chart.update();
        }

        // ==============================
        // Helper Functions
        // ==============================

        function createButton(label) {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.style.margin = '0 5px';
            btn.style.padding = '5px 10px';
            btn.style.cursor = 'pointer';
            btn.style.border = 'none';
            btn.style.borderRadius = '4px';
            btn.style.background = 'rgb(75, 192, 192)';
            btn.style.color = 'white';
            btn.style.fontSize = '12px';
            btn.addEventListener('mouseenter', () => btn.style.background = 'rgb(60, 160, 160)');
            btn.addEventListener('mouseleave', () => btn.style.background = 'rgb(75, 192, 192)');
            return btn;
        }
    }
})();