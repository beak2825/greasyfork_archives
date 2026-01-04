// ==UserScript==
// @name         GeoGuessr Rating History Displayer
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @match        https://www.geoguessr.com/*
// @description  Display rating history from georank.io on GeoGuessr profile pages
// @author       AaronThug
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/546625/GeoGuessr%20Rating%20History%20Displayer.user.js
// @updateURL https://update.greasyfork.org/scripts/546625/GeoGuessr%20Rating%20History%20Displayer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isExpanded = false;
    let chartInstance = null;
    let cachedData = null;
    let currentUserId = null;

    const styles = `
        .rating-history-bar {
            background: #2c2c54;
            border: 1px solid #3c3c7e;
            border-radius: 8px;
            margin-bottom: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .rating-history-bar:hover {
            background: #3c3c7e;
            border-color: #4c4c8e;
        }
        .rating-history-content {
            padding: 8px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .rating-history-content h4 {
            color: #ffffff;
            margin: 0;
            font-size: 14px;
            font-weight: 600;
        }
        .rating-history-arrow {
            color: #ffffff;
            font-size: 12px;
            transition: transform 0.3s ease;
        }
        .rating-history-arrow.expanded {
            transform: rotate(180deg);
        }
        .rating-history-chart-container {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            background: #1a1a2e;
            border-top: 1px solid #3c3c7e;
        }
        .rating-history-chart-container.expanded {
            max-height: 600px;
        }
        .rating-history-chart {
            padding: 20px;
            height: 400px;
        }
        .rating-history-loading {
            text-align: center;
            padding: 40px 20px;
            color: #ffffff;
        }
        .rating-history-error {
            text-align: center;
            padding: 40px 20px;
            color: #ff6b6b;
        }
    `;

    function addStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function isProfilePage() {
        const path = window.location.pathname;
        if (path === '/me/profile' || path.startsWith('/user/')) return true;
        const pathParts = path.split('/').filter(part => part !== '');
        if (pathParts.length >= 2 && pathParts[0].length === 2) {
            const remainingPath = '/' + pathParts.slice(1).join('/');
            return remainingPath === '/me/profile' || remainingPath.startsWith('/user/');
        }
        return false;
    }

    async function getUserId() {
        const path = window.location.pathname;
        if (path.startsWith('/user/')) return path.split('/user/')[1];
        if (path === '/me/profile') return await fetchCurrentUserId();
        const pathParts = path.split('/').filter(part => part !== '');
        if (pathParts.length >= 2 && pathParts[0].length === 2) {
            const remainingPath = '/' + pathParts.slice(1).join('/');
            if (remainingPath.startsWith('/user/')) return remainingPath.split('/user/')[1];
            if (remainingPath === '/me/profile') return await fetchCurrentUserId();
        }
        return null;
    }

    async function fetchCurrentUserId() {
        try {
            const response = await fetch('https://www.geoguessr.com/api/v3/profiles');
            const data = await response.json();
            return data.id || data.user?.id || data.profile?.id || null;
        } catch (error) {
            return null;
        }
    }

    async function fetchRatingHistory(userId) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://georank.io/api/userhistory/${userId}`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                onload: function(response) {
                    try {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            resolve(data.rating?.overall || null);
                        } else {
                            resolve(null);
                        }
                    } catch (error) {
                        resolve(null);
                    }
                },
                onerror: () => resolve(null),
                ontimeout: () => resolve(null),
                timeout: 10000
            });
        });
    }

    function createRatingHistoryBar() {
        const bar = document.createElement('div');
        bar.className = 'rating-history-bar';
        bar.innerHTML = `
            <div class="rating-history-content">
                <h4>Rating History</h4>
                <span class="rating-history-arrow">▼</span>
            </div>
            <div class="rating-history-chart-container">
                <div class="rating-history-chart">
                    <canvas id="rating-history-canvas"></canvas>
                </div>
            </div>
        `;
        
        const arrow = bar.querySelector('.rating-history-arrow');
        const container = bar.querySelector('.rating-history-chart-container');
        
        bar.addEventListener('click', async function() {
            if (!isExpanded) {
                isExpanded = true;
                arrow.classList.add('expanded');
                container.classList.add('expanded');
                if (!cachedData) {
                    showLoading();
                    await loadAndDisplayChart();
                }
            } else {
                isExpanded = false;
                arrow.classList.remove('expanded');
                container.classList.remove('expanded');
            }
        });
        
        return bar;
    }

    function showLoading() {
        const chartDiv = document.querySelector('.rating-history-chart');
        chartDiv.innerHTML = '<div class="rating-history-loading">Loading rating history...</div>';
    }

    function showError(message) {
        const chartDiv = document.querySelector('.rating-history-chart');
        chartDiv.innerHTML = `<div class="rating-history-error">${message}</div>`;
    }

    async function loadAndDisplayChart() {
        try {
            if (!currentUserId) {
                currentUserId = await getUserId();
                if (!currentUserId) {
                    showError('Failed to get rating history. Try again later.');
                    return;
                }
            }

            const ratingData = await fetchRatingHistory(currentUserId);
            if (!ratingData) {
                showError('Failed to get rating history. Try again later.');
                return;
            }
            if (Object.keys(ratingData).length === 0) {
                showError('The user has no available rating history.');
                return;
            }

            cachedData = ratingData;
            displayChart(ratingData);
        } catch (error) {
            showError('Failed to get rating history. Try again later.');
        }
    }

    function displayChart(data) {
        const chartDiv = document.querySelector('.rating-history-chart');
        chartDiv.innerHTML = '<canvas id="rating-history-canvas"></canvas>';
        
        const canvas = document.getElementById('rating-history-canvas');
        const ctx = canvas.getContext('2d');
        const dates = Object.keys(data).sort();
        const ratings = dates.map(date => data[date]);

        if (chartInstance) chartInstance.destroy();

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Overall Rating',
                    data: ratings,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#4CAF50',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#ffffff' } },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#4CAF50',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#ffffff', maxTicksLimit: 10 },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                interaction: { intersect: false, mode: 'index' }
            }
        });
    }

    function insertRatingHistoryBar() {
        if (document.querySelector('.rating-history-bar')) return true;
        const widgetRow = document.querySelector('.profile-v2_widgetRow__n1A_N');
        if (widgetRow) {
            const ratingHistoryBar = createRatingHistoryBar();
            widgetRow.parentNode.insertBefore(ratingHistoryBar, widgetRow);
            return true;
        }
        return false;
    }

    function init() {
        if (!isProfilePage()) return;
        addStyles();
        
        isExpanded = false;
        cachedData = null;
        currentUserId = null;
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
        
        if (insertRatingHistoryBar()) return;
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    if (insertRatingHistoryBar()) {
                        setTimeout(() => {
                            if (!document.querySelector('.rating-history-bar')) {
                                insertRatingHistoryBar();
                            }
                        }, 500);
                    }
                }
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        if (window.location.pathname.includes('/me/profile')) {
            const interval = setInterval(() => {
                if (insertRatingHistoryBar()) clearInterval(interval);
            }, 1000);
            setTimeout(() => clearInterval(interval), 10000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            const existingBar = document.querySelector('.rating-history-bar');
            if (!isProfilePage()) {
                if (existingBar) existingBar.remove();
                return;
            }
            cachedData = null;
            currentUserId = null;
            isExpanded = false;
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null;
            }
            if (existingBar) existingBar.remove();
            setTimeout(init, 1500);
        }
    }).observe(document, {subtree: true, childList: true});

})();

