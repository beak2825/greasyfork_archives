// ==UserScript==
// @name         Google SEO Helper - KGR, Volume, Competition & Trend Chart
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  All-in-one SEO analysis tool for Google. Features: KGR calculator, Allintitle/Intitle, Monthly search volume, Competition, CPC, Historical/Forecast trend chart.
// @author       WWW (Upgraded by AI)
// @match        *://*/search*
// @include      *://www.google.*/search*
// @include      *://google.*/search*
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js
// @grant        GM_xmlhttpRequest
// @connect      insight.gotrends.app
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519831/Google%20SEO%20Helper%20-%20KGR%2C%20Volume%2C%20Competition%20%20Trend%20Chart.user.js
// @updateURL https://update.greasyfork.org/scripts/519831/Google%20SEO%20Helper%20-%20KGR%2C%20Volume%2C%20Competition%20%20Trend%20Chart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        API_URL: 'https://insight.gotrends.app/kw/gethistorymetric',
        INJECTION_POINT_SELECTORS: [
            'form[id="tsf"] div:nth-child(1) > div:nth-child(1) > div:nth-child(2)',
            'form[role="search"] div[role="search"]',
            'div[role="search"]'
        ],
        MONTHS: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
        MONTHS_SHORT: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        DIFFICULTY_LEVELS: {
            EASY: { threshold: 0.25, text: 'Easy', color: '#00a000' },
            MEDIUM: { threshold: 1, text: 'Medium', color: '#ffa500' },
            HARD: { text: 'Hard', color: '#ff0000' }
        },
        CSS: `
            .seo-helper-container {
                --bg-color: #f8f9fa; --text-color: #666; --link-color: #1a73e8;
                --border-color: rgba(0, 0, 0, 0.1); --chart-line-color: #1a73e8;
                --chart-fill-color: rgba(26, 115, 232, 0.2);
            }
            .seo-helper-container[data-theme="dark"] {
                --bg-color: #35363a; --text-color: #bdc1c6; --link-color: #8ab4f8;
                --border-color: rgba(255, 255, 255, 0.1); --chart-line-color: #8ab4f8;
                --chart-fill-color: rgba(138, 180, 248, 0.2);
            }
            .seo-helper-button { color: var(--link-color); cursor: pointer; padding: 5px 0 0 0; margin: 0 0 0 10px; font-size: 14px; }
            .seo-helper-results { color: var(--text-color); background-color: var(--bg-color); padding: 12px 16px; margin-top: 5px; font-size: 14px; display: none; border-radius: 8px; position: relative; line-height: 1.6; }
            .seo-helper-results div { margin-top: 8px; }
            .seo-helper-results div:first-child { margin-top: 0; }
            .seo-helper-close-btn { position: absolute; top: 8px; right: 12px; color: var(--text-color); cursor: pointer; font-size: 18px; line-height: 1; font-weight: bold; }
            .seo-helper-chart-container { position: relative; height: 150px; margin-top: 15px; }
            .seo-helper-placeholder { height: 0px; transition: height 0.3s ease; }
        `
    };

    // --- Helper Functions ---

    const getQuery = () => new URLSearchParams(window.location.search).get('q');
    const isDarkMode = () => document.documentElement.hasAttribute('data-darkmode');

    // [修复 2] 创建一个更安全的数字格式化函数，能正确处理'N/A'等非数字情况
    const formatNumber = (num) => {
        const n = Number(String(num).replace(/,/g, ''));
        if (num === null || num === undefined || isNaN(n)) {
            return num; // Return original value if it's not a valid number (e.g., 'N/A')
        }
        return n.toLocaleString();
    };

    function animateLoadingText(element) {
        let dots = 0;
        const intervalId = setInterval(() => {
            dots = (dots + 1) % 4;
            element.textContent = 'Loading' + '.'.repeat(dots);
        }, 500);
        return intervalId;
    }

    // [修复 1] 恢复使用更稳健的、包含多个后备模式的解析函数
    function parseResultCount(html) {
        const patterns = [
            /id="result-stats"[^>]*>About\s+([\d,]+)\s+results/i,
            /id="result-stats"[^>]*>([\d,]+)\s+results/i,
            /About\s+([\d,]+)\s+results/i,
            /([\d,]+)\s+results/i
        ];
        for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                return match[1].replace(/,/g, '');
            }
        }
        return 'N/A';
    }


    function getKGRDifficulty(kgr) {
        const { EASY, MEDIUM, HARD } = CONFIG.DIFFICULTY_LEVELS;
        if (kgr < EASY.threshold) return { text: EASY.text, color: EASY.color };
        if (kgr <= MEDIUM.threshold) return { text: MEDIUM.text, color: MEDIUM.color };
        return { text: HARD.text, color: HARD.color };
    }

    function gmFetch(options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...options,
                onload: response => resolve(response),
                onerror: error => reject(error),
                ontimeout: error => reject(error),
            });
        });
    }

    // --- UI Creation ---
    function createUI() {
        const style = document.createElement('style');
        style.textContent = CONFIG.CSS;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.className = 'seo-helper-container';
        container.dataset.theme = isDarkMode() ? 'dark' : 'light';

        const button = document.createElement('span');
        button.textContent = 'SEO Analysis';
        button.className = 'seo-helper-button';

        const resultsPanel = document.createElement('div');
        resultsPanel.className = 'seo-helper-results';

        const contentPlaceholder = document.createElement('div');
        contentPlaceholder.className = 'seo-helper-placeholder';

        container.append(button, resultsPanel);

        const observer = new MutationObserver(() => {
            container.dataset.theme = isDarkMode() ? 'dark' : 'light';
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-darkmode'] });

        return { container, button, resultsPanel, contentPlaceholder, observer };
    }

    // --- Data Fetching ---
    function fetchVolumeData(keyword) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 13);
        const requestData = {
            keywords: [keyword], geoTargetConstants: [],
            historicalMetricsOptions: {
                includeAverageCpc: true,
                yearMonthRange: {
                    start: { year: startDate.getFullYear(), month: CONFIG.MONTHS[startDate.getMonth()] },
                    end: { year: endDate.getFullYear(), month: CONFIG.MONTHS[endDate.getMonth()] }
                }
            },
            language: "languageConstants/1000"
        };
        return gmFetch({
            method: 'POST', url: CONFIG.API_URL, headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(requestData), responseType: 'json'
        }).then(response => {
            const metrics = response.response?.results?.[0]?.keywordMetrics;
            if (!metrics) throw new Error('Invalid volume data response');
            const historicalData = metrics.monthlySearchVolumes || [];
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const pastOrPresentData = historicalData.filter(d => new Date(`${d.year}-${CONFIG.MONTHS.indexOf(d.month) + 1}-01`) <= today);
            const latestDataPoint = pastOrPresentData.pop() || historicalData[0] || null;
            return {
                latestSearchVolume: latestDataPoint ? parseInt(latestDataPoint.monthlySearches) : null,
                latestMonthStr: latestDataPoint ? `${latestDataPoint.month.toLowerCase().replace(/^\w/, c => c.toUpperCase())} ${latestDataPoint.year}` : 'N/A',
                avgMonthlySearches: metrics.avgMonthlySearches ? parseInt(metrics.avgMonthlySearches) : null,
                competition: metrics.competition || 'N/A',
                competitionIndex: metrics.competitionIndex || 'N/A',
                lowTopOfPageBid: metrics.lowTopOfPageBidMicros ? (metrics.lowTopOfPageBidMicros / 1000000).toFixed(2) : '0',
                highTopOfPageBid: metrics.highTopOfPageBidMicros ? (metrics.highTopOfPageBidMicros / 1000000).toFixed(2) : '0',
                historicalData: historicalData,
            };
        }).catch(err => {
            console.error('Error fetching volume data:', err);
            return null;
        });
    }

    function fetchTitleCount(query, type = 'allintitle') {
        const url = `https://www.google.com/search?q=${type}:"${encodeURIComponent(query)}"`;
        return gmFetch({ method: 'GET', url })
            .then(response => parseResultCount(response.responseText))
            .catch(err => {
                console.error(`Error fetching ${type} count:`, err);
                return 'N/A';
            });
    }

    // --- Chart Rendering ---
    function renderTrendChart(canvas, historicalData) {
        if (!canvas || !historicalData || historicalData.length === 0) return;
        const monthMap = Object.fromEntries(CONFIG.MONTHS.map((m, i) => [m, i]));
        const labels = historicalData.map(d => `${CONFIG.MONTHS_SHORT[monthMap[d.month]]} '${String(d.year).slice(2)}`);
        const dataPoints = historicalData.map(d => parseInt(d.monthlySearches));
        const today = new Date();
        let forecastStartIndex = historicalData.findIndex(d => new Date(`${d.year}-${monthMap[d.month] + 1}-01`) > today);
        if (forecastStartIndex === -1) forecastStartIndex = historicalData.length;
        const styles = getComputedStyle(canvas.closest('.seo-helper-container'));
        const gridColor = styles.getPropertyValue('--border-color');
        const fontColor = styles.getPropertyValue('--text-color');
        const lineColor = styles.getPropertyValue('--chart-line-color');
        const fillColor = styles.getPropertyValue('--chart-fill-color');
        new Chart(canvas, {
            type: 'line', data: { labels: labels, datasets: [{
                label: 'Search Volume', data: dataPoints, borderColor: lineColor, backgroundColor: fillColor,
                borderWidth: 2, pointRadius: 3, pointBackgroundColor: lineColor, fill: true, tension: 0.3,
                segment: {
                    borderColor: ctx => ctx.p1DataIndex < forecastStartIndex ? lineColor : 'rgba(128,128,128,0.7)',
                    borderDash: ctx => ctx.p1DataIndex < forecastStartIndex ? [] : [5, 5],
                }
            }]},
            options: { responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `Volume: ${formatNumber(ctx.raw)}` } } },
                scales: {
                    y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: fontColor, callback: val => val > 999 ? `${(val/1000).toFixed(0)}k` : val } },
                    x: { grid: { display: false }, ticks: { color: fontColor } }
                }
            }
        });
    }

    // --- Main Logic ---
    async function showResults(query, resultsPanel, contentPlaceholder) {
        resultsPanel.style.display = 'block';
        resultsPanel.innerHTML = ''; // Clear previous
        const closeButton = document.createElement('span');
        closeButton.textContent = '×';
        closeButton.className = 'seo-helper-close-btn';
        closeButton.title = 'Close';
        resultsPanel.appendChild(closeButton);
        const loadingIndicator = document.createElement('div');
        resultsPanel.appendChild(loadingIndicator);
        const loadingInterval = animateLoadingText(loadingIndicator);

        const [volumeData, allintitleCount, intitleCount] = await Promise.all([
            fetchVolumeData(query),
            fetchTitleCount(query, 'allintitle'),
            fetchTitleCount(query, 'intitle')
        ]);

        clearInterval(loadingInterval);
        loadingIndicator.remove();

        let contentHtml = '';
        if (volumeData) {
            contentHtml += `<div>Search Volume (${volumeData.latestMonthStr}): <strong>${formatNumber(volumeData.latestSearchVolume)}</strong> | Avg. (12m): ${formatNumber(volumeData.avgMonthlySearches)}</div>`;
        }
        if (allintitleCount !== 'N/A' || intitleCount !== 'N/A') {
            contentHtml += `<div>Allintitle: <strong>${formatNumber(allintitleCount)}</strong> | Intitle: <strong>${formatNumber(intitleCount)}</strong></div>`;
        }
        if (volumeData?.latestSearchVolume > 0 && allintitleCount !== 'N/A' && intitleCount !== 'N/A') {
            const allintitleKGR = (Number(allintitleCount) / volumeData.latestSearchVolume).toFixed(3);
            const intitleKGR = (Number(intitleCount) / volumeData.latestSearchVolume).toFixed(3);
            const allintitleDifficulty = getKGRDifficulty(allintitleKGR);
            const intitleDifficulty = getKGRDifficulty(intitleKGR);
            contentHtml += `<div>Allintitle KGR: <strong>${allintitleKGR}</strong> (<span style="color:${allintitleDifficulty.color};font-weight:bold;">${allintitleDifficulty.text}</span>) | Intitle KGR: <strong>${intitleKGR}</strong> (<span style="color:${intitleDifficulty.color};font-weight:bold;">${intitleDifficulty.text}</span>)</div>`;
        }
        if (volumeData) {
             contentHtml += `<div>Competition: <strong>${volumeData.competition}</strong> (Index: ${volumeData.competitionIndex}) | CPC Range: <strong>$${volumeData.lowTopOfPageBid} - $${volumeData.highTopOfPageBid}</strong></div>`;
        }

        resultsPanel.insertAdjacentHTML('beforeend', contentHtml);
        if (!contentHtml) {
             resultsPanel.insertAdjacentHTML('beforeend', '<div>Could not retrieve any SEO data. Please try again.</div>');
        }

        if (volumeData?.historicalData?.length > 0) {
            const chartContainer = document.createElement('div');
            chartContainer.className = 'seo-helper-chart-container';
            const canvas = document.createElement('canvas');
            chartContainer.appendChild(canvas);
            resultsPanel.appendChild(chartContainer);
            renderTrendChart(canvas, volumeData.historicalData);
        }

        requestAnimationFrame(() => {
            const resultsHeight = resultsPanel.offsetHeight;
            contentPlaceholder.style.height = `${resultsHeight + 20}px`;
        });
    }

    function main() {
        const query = getQuery();
        if (!query) return;

        function attachUI() {
            for (const selector of CONFIG.INJECTION_POINT_SELECTORS) {
                const targetElement = document.querySelector(selector);
                if (targetElement && !targetElement.querySelector('.seo-helper-container')) {
                    const { container, button, resultsPanel, contentPlaceholder, observer } = createUI();
                    targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
                    const cnt = document.querySelector('#cnt');
                    if (cnt?.firstChild) cnt.insertBefore(contentPlaceholder, cnt.firstChild);

                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        button.style.display = 'none';
                        showResults(query, resultsPanel, contentPlaceholder);
                    });

                    resultsPanel.addEventListener('click', (e) => {
                        if (e.target.classList.contains('seo-helper-close-btn')) {
                            resultsPanel.style.display = 'none';
                            button.style.display = 'inline';
                            contentPlaceholder.style.height = '0px';
                        }
                    });
                    return { success: true, observer };
                }
            }
            return { success: false };
        }

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            const attachResult = attachUI();
            if (attachResult.success) return;
        }

        const observer = new MutationObserver((_, obs) => {
            const fallbackResult = attachUI();
            if (fallbackResult.success) {
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 10000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();