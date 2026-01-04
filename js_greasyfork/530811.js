// ==UserScript==
// @name         Goofish Price Distribution Graph
// @name:zh-CN   闲鱼页面价格分布图
// @name:zh-TW   闲鱼頁面价格分布圖
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Extract prices and display a distribution graph in a draggable popup.
// @description:zh-CN  从当前闲鱼页面生成价格分布图，生成的小窗可拖动。
// @description:zh-TW  从當前闲鱼頁面生成价格分布圖，生成的小窗可拖動。
// @author       AAur
// @match        *://*.goofish.com/*
// @grant        none
// @icon         https://img.alicdn.com/tfs/TB19WObTNv1gK0jSZFFXXb0sXXa-144-144.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530811/Goofish%20Price%20Distribution%20Graph.user.js
// @updateURL https://update.greasyfork.org/scripts/530811/Goofish%20Price%20Distribution%20Graph.meta.js
// ==/UserScript==

// Extract prices from spans with class like "number--{random ID}", display a distribution graph in a draggable popup.
// It's all about what is on your 1st page.

// 1.02: Remove all the outliers(geq(or leq) than median times upperBoundRatio(or lowerBoundRatio)) in search page

(function() {
    'use strict';

    let chartInstance = null;
    let allPrices = [];

    let upperBoundRatio = 1.6;
    let lowerBoundRatio = 0.5;

    // --- Utility: Dynamically load external JS (Chart.js) ---
    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        script.onerror = function() {
            console.error('Failed to load script:', url);
        };
        document.head.appendChild(script);
    }

    function removeOutliers(prices, upperBoundRatio, lowerBoundRatio) {
        prices.sort((a, b) => a - b);
        let median = prices[Math.round(prices.length / 2)];console.log(median);
        while (prices.length > 1) {
            let last = prices[prices.length - 1];

            if (last >= median * upperBoundRatio) {
                prices.pop(); // 移除极端值
            } else {
                break; // 退出循环
            }
        }
        while (prices.length > 1) {
            if (prices[1] <= median * (1 - lowerBoundRatio)) {
                prices.shift(); // 移除极端值
            } else {
                break; // 退出循环
            }
        }
    }

    // --- Extraction: Get all prices from span elements with class starting with "number--" ---
    function extractPrices() {
        const containers = document.querySelectorAll('div[class^="row3-wrap-price--"]');
        const prices = [];
        containers.forEach(container => {
            // Check for any descendant span with class "magnitude--EJxoo1DV" and text "万"
            const magnitudeSpan = container.querySelector('span.magnitude--EJxoo1DV');
            // Get the descendant span with class starting with "number--"
            const numberSpan = container.querySelector('span[class^="number--"]');
            const decimalSpan = container.querySelector('span[class^="decimal--"]');
            if (numberSpan) {
                let number = numberSpan.textContent.replace(/[^0-9\.]+/g, '') + decimalSpan.textContent.replace(/[^0-9\.]+/g, '');
                let value = parseFloat(number);
                if (!isNaN(value)) {
                    if (magnitudeSpan && magnitudeSpan.textContent.trim() === '万') {
                        value *= 10000;
                    }
                    prices.push(value);
                }
            }
        });
        // Remove Outlier in search page
        if(window.location.href.startsWith("https://www.goofish.com/search")) {
            removeOutliers(prices, upperBoundRatio, lowerBoundRatio);
        }
        return prices;
    }

    // --- Binning: Create histogram data with constant intervals (multiples of 5) ---
    // options: { binCount: number, fixedBinSize: number (optional) }
    // Returns: { bins: string[], counts: number[], binSize: number }
    function computeHistogram(prices, options = {}) {
        let bins, counts, binSize;
        if (options.fixedBinSize) {
            const fixedBinSize = options.fixedBinSize;
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const start = Math.floor(minPrice / fixedBinSize) * fixedBinSize;
            const end = Math.ceil(maxPrice / fixedBinSize) * fixedBinSize;
            const binCount = Math.ceil((end - start) / fixedBinSize);
            const edges = [];
            for (let i = 0; i <= binCount; i++) {
                edges.push(start + i * fixedBinSize);
            }
            counts = new Array(edges.length - 1).fill(0);
            prices.forEach(price => {
                let index = Math.floor((price - start) / fixedBinSize);
                if (index < 0) index = 0;
                if (index >= counts.length) index = counts.length - 1;
                counts[index]++;
            });
            // Only show the starting number of each bin on the x-axis.
            bins = edges.slice(0, -1).map(e => `${e}`);
            binSize = fixedBinSize;
        } else {
            // Auto-generated bin size based on a default bin count of 10.
            const binCount = options.binCount || 10;
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const start = Math.floor(minPrice / 5) * 5;
            const rawBinSize = (maxPrice - start) / binCount;
            binSize = Math.ceil(rawBinSize / 5) * 5 || 5;
            const edges = [];
            for (let i = 0; i <= binCount; i++) {
                edges.push(start + i * binSize);
            }
            counts = new Array(edges.length - 1).fill(0);
            prices.forEach(price => {
                let index = Math.floor((price - start) / binSize);
                if (index < 0) index = 0;
                if (index >= counts.length) index = counts.length - 1;
                counts[index]++;
            });
            // Only show the starting number of each bin.
            bins = edges.slice(0, -1).map(e => `${e}`);
        }
        return { bins, counts, binSize };
    }

    // --- Update Chart: Recalculate histogram, update the chart instance, and display the current bin size ---
    function updateChart(fixedBinSize) {
        const histogram = computeHistogram(allPrices, { binCount: 10, fixedBinSize: fixedBinSize });
        chartInstance.data.labels = histogram.bins;
        chartInstance.data.datasets[0].data = histogram.counts;
        chartInstance.update();
        // Update the bin size label, if present.
        const binSizeLabel = document.getElementById('currentBinSizeLabel');
        if (binSizeLabel) {
            binSizeLabel.textContent = 'Current Bin Size: ' + histogram.binSize;
        }
    }

    // --- Draggable Popup: Enable dragging functionality on an element via its titlebar ---
    function makeDraggable(draggableEl, handleEl) {
        let offsetX = 0, offsetY = 0, startX = 0, startY = 0;
        handleEl.style.cursor = 'move';

        handleEl.addEventListener('mousedown', dragMouseDown);

        function dragMouseDown(e) {
            e.preventDefault();
            startX = e.clientX;
            startY = e.clientY;
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('mouseup', closeDragElement);
        }

        function elementDrag(e) {
            e.preventDefault();
            offsetX = startX - e.clientX;
            offsetY = startY - e.clientY;
            startX = e.clientX;
            startY = e.clientY;
            draggableEl.style.top = (draggableEl.offsetTop - offsetY) + "px";
            draggableEl.style.left = (draggableEl.offsetLeft - offsetX) + "px";
        }

        function closeDragElement() {
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', closeDragElement);
        }
    }

    // --- Popup Creation: Create a draggable, professional popup with a titlebar, control buttons, and a bin size display ---
    function createPopup() {
        // Main overlay container
        const overlay = document.createElement('div');
        overlay.id = 'price-distribution-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            width: '680px',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ccc',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            fontFamily: 'Arial, sans-serif'
        });

        // Titlebar for dragging with key color #ad7aff
        const titlebar = document.createElement('div');
        Object.assign(titlebar.style, {
            backgroundColor: '#ad7aff',
            color: '#fff',
            padding: '10px 15px',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            userSelect: 'none',
            position: 'relative'
        });
        titlebar.textContent = 'Price Distribution Graph';

        // Larger close button for easier interaction
        const closeButton = document.createElement('span');
        closeButton.textContent = '×';
        Object.assign(closeButton.style, {
            position: 'absolute',
            top: '5px',
            right: '10px',
            cursor: 'pointer',
            fontSize: '24px',
            lineHeight: '24px'
        });
        closeButton.addEventListener('click', () => overlay.remove());
        titlebar.appendChild(closeButton);

        overlay.appendChild(titlebar);

        // Content container for controls and the chart
        const content = document.createElement('div');
        content.style.padding = '20px';
        content.style.backgroundColor = '#ffffff';

        // --- Control Panel: Three buttons to change the bin size ---
        const controlPanel = document.createElement('div');
        controlPanel.style.marginBottom = '10px';

        // Button style common to all control buttons
        const btnStyle = {
            marginRight: '10px',
            padding: '5px 10px',
            cursor: 'pointer',
            border: '1px solid #ad7aff',
            borderRadius: '4px',
            backgroundColor: '#ad7aff',
            color: '#fff'
        };

        // Button: Fixed bin size 100
        const btn100 = document.createElement('button');
        btn100.textContent = 'Bin Size: 100';
        Object.assign(btn100.style, btnStyle);
        btn100.addEventListener('click', () => updateChart(100));

        // Button: Fixed bin size 50
        const btn50 = document.createElement('button');
        btn50.textContent = 'Bin Size: 50';
        Object.assign(btn50.style, btnStyle);
        btn50.addEventListener('click', () => updateChart(50));

        // Button: Auto-generated bin size
        const btnAuto = document.createElement('button');
        btnAuto.textContent = 'Auto Bin';
        Object.assign(btnAuto.style, btnStyle);
        btnAuto.addEventListener('click', () => updateChart(null));

        controlPanel.appendChild(btn100);
        controlPanel.appendChild(btn50);
        controlPanel.appendChild(btnAuto);
        content.appendChild(controlPanel);

        // Create a label element to display current bin size
        const binSizeLabel = document.createElement('span');
        binSizeLabel.id = 'currentBinSizeLabel';
        binSizeLabel.style.marginRight = '20px';
        binSizeLabel.style.fontWeight = 'bold';
        // Default text (will be updated when chart is rendered)
        binSizeLabel.textContent = 'Current Bin Size: auto';
        controlPanel.appendChild(binSizeLabel);

        // Create canvas for Chart.js graph
        const canvas = document.createElement('canvas');
        canvas.id = 'priceDistributionChart';
        canvas.width = 640;
        canvas.height = 400;
        content.appendChild(canvas);

        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Make the overlay draggable via the titlebar
        makeDraggable(overlay, titlebar);
    }

    // --- Main: Extract prices, compute histogram, and render the chart ---
    function renderChart() {
        const prices = extractPrices();
        if (prices.length === 0) {
            console.warn('No prices found on this page.');
            return;
        }
        allPrices = prices; // store globally for updates
        const histogram = computeHistogram(prices, { binCount: 10 });
        createPopup();

        const ctx = document.getElementById('priceDistributionChart').getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: histogram.bins,
                datasets: [{
                    label: 'Price Distribution',
                    data: histogram.counts,
                    backgroundColor: 'rgba(173,122,255, 0.5)', // key color with transparency
                    borderColor: 'rgba(173,122,255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        title: { display: true, text: 'Bin Start Value' },
                        ticks: { maxRotation: 45, minRotation: 0 }
                    },
                    y: {
                        title: { display: true, text: 'Frequency' },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
        // Update the bin size label initially.
        updateChart(null);
    }

    // --- Create a fixed start button on the page ---
    function createStartButton() {
        const btn = document.createElement('button');
        btn.id = 'startPriceGraphBtn';
        btn.textContent = 'Show Price Graph';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 10000,
            padding: '10px 15px',
            backgroundColor: '#ad7aff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            fontSize: '14px'
        });
        btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#8a5cd6');
        btn.addEventListener('mouseleave', () => btn.style.backgroundColor = '#ad7aff');
        btn.addEventListener('click', () => {
            if (document.getElementById('price-distribution-overlay')) {
                console.warn('Graph already open.');
                return;
            }
            renderChart();
        });
        if (window.self === window.top) {
            document.body.appendChild(btn);
        }
    }

    // --- Load Chart.js then create the start button ---
    loadScript('https://cdn.jsdelivr.net/npm/chart.js', createStartButton);

})();