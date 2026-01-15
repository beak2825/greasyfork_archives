// ==UserScript==
// @name         Google SEO Helper - KGR, Volume, Competition & Trend Chart
// @namespace    http://tampermonkey.net/
// @version      2.4
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
                margin-bottom: 10px;
            }
            .seo-helper-container[data-theme="dark"] {
                --bg-color: #35363a; --text-color: #bdc1c6; --link-color: #8ab4f8;
                --border-color: rgba(255, 255, 255, 0.1); --chart-line-color: #8ab4f8;
                --chart-fill-color: rgba(138, 180, 248, 0.2);
            }
            .seo-helper-button { color: var(--link-color); cursor: pointer; padding: 5px 10px; font-size: 14px; border: 1px solid var(--border-color); border-radius: 4px; }
            .seo-helper-results { color: var(--text-color); background-color: var(--bg-color); padding: 12px 16px; margin-top: 5px; font-size: 14px; display: none; border-radius: 8px; position: relative; line-height: 1.6; border: 1px solid var(--border-color); }
            .seo-helper-results div { margin-top: 8px; }
            .seo-helper-close-btn { position: absolute; top: 8px; right: 12px; color: var(--text-color); cursor: pointer; font-size: 18px; font-weight: bold; }
            .seo-helper-chart-container { position: relative; height: 150px; margin-top: 15px; }
            .seo-helper-placeholder { height: 0px; transition: height 0.3s ease; }
        `
    };

    // --- Helper Functions ---
    const getQuery = () => new URLSearchParams(window.location.search).get('q');
    const isDarkMode = () => document.documentElement.getAttribute('data-darkmode') === 'true' || document.querySelector('meta[content*="light dark"]');

    const formatNumber = (num) => {
        if (num === null || num === undefined || isNaN(num)) return 'N/A';
        return Number(num).toLocaleString();
    };

    function animateLoadingText(element) {
        let dots = 0;
        const intervalId = setInterval(() => {
            dots = (dots + 1) % 4;
            element.textContent = 'Analyzing' + '.'.repeat(dots);
        }, 500);
        return intervalId;
    }

    function parseResultCount(html) {
        const patterns = [/About ([\d,]+) results/i, /([\d,]+) results/i, /找到约 ([\d,]+) 条结果/i];
        for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match && match[1]) return match[1].replace(/,/g, '');
        }
        return '0';
    }

    function getKGRDifficulty(kgr) {
        const { EASY, MEDIUM, HARD } = CONFIG.DIFFICULTY_LEVELS;
        const val = parseFloat(kgr);
        if (val < EASY.threshold) return EASY;
        if (val <= MEDIUM.threshold) return MEDIUM;
        return HARD;
    }

    function gmFetch(options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...options,
                onload: res => resolve(res),
                onerror: err => reject(err)
            });
        });
    }

    // --- Data Fetching ---
    async function fetchVolumeData(keyword) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 13);

        const requestData = {
            keywords: [keyword],
            geoTargetConstants: [],
            historicalMetricsOptions: {
                includeAverageCpc: true,
                yearMonthRange: {
                    start: { year: startDate.getFullYear(), month: CONFIG.MONTHS[startDate.getMonth()] },
                    end: { year: endDate.getFullYear(), month: CONFIG.MONTHS[endDate.getMonth()] }
                }
            },
            language: "languageConstants/1000"
        };

        try {
            const response = await gmFetch({
                method: 'POST',
                url: CONFIG.API_URL,
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain, */*',
                    'User-Agent': navigator.userAgent,
                    'Origin': 'https://www.google.com',
                    'Referer': 'https://www.google.com/'
                },
                data: JSON.stringify(requestData),
                responseType: 'json'
            });

            // 检查是否被 Cloudflare 拦截 (返回 HTML 而不是 JSON)
            if (typeof response.response === 'string' && response.response.includes('cloudflare')) {
                return { error: 'BlockedByCloudflare' };
            }

            const data = response.response;
            const results = data?.results?.[0];
            
            if (!results || !results.keywordMetrics) {
                console.error('No metrics found in API response', data);
                return null;
            }

            const metrics = results.keywordMetrics;
            let historicalData = metrics.monthlySearchVolumes || [];

            // 排序逻辑：确保最新的月份在最后
            historicalData.sort((a, b) => {
                const dateA = new Date(`${a.year}-${CONFIG.MONTHS.indexOf(a.month) + 1}-01`);
                const dateB = new Date(`${b.year}-${CONFIG.MONTHS.indexOf(b.month) + 1}-01`);
                return dateA - dateB;
            });

            const latestPoint = historicalData[historicalData.length - 1];

            return {
                latestSearchVolume: latestPoint ? parseInt(latestPoint.monthlySearches) : 0,
                latestMonthStr: latestPoint ? `${latestPoint.month} ${latestPoint.year}` : 'N/A',
                avgMonthlySearches: metrics.avgMonthlySearches ? parseInt(metrics.avgMonthlySearches) : 0,
                competition: metrics.competition || 'N/A',
                competitionIndex: metrics.competitionIndex || 0,
                lowCpc: metrics.lowTopOfPageBidMicros ? (metrics.lowTopOfPageBidMicros / 1000000).toFixed(2) : '0.00',
                highCpc: metrics.highTopOfPageBidMicros ? (metrics.highTopOfPageBidMicros / 1000000).toFixed(2) : '0.00',
                historicalData: historicalData
            };
        } catch (err) {
            console.error('Fetch volume error:', err);
            return null;
        }
    }

    async function fetchTitleCount(query, type = 'allintitle') {
        try {
            const url = `https://www.google.com/search?q=${type}:"${encodeURIComponent(query)}"`;
            const res = await gmFetch({ method: 'GET', url });
            return parseResultCount(res.responseText);
        } catch (err) {
            return '0';
        }
    }

    // --- Chart Rendering ---
    function renderTrendChart(canvas, historicalData) {
        if (!window.Chart || !historicalData.length) return;
        
        const labels = historicalData.map(d => `${d.month.slice(0,3)} ${String(d.year).slice(2)}`);
        const values = historicalData.map(d => parseInt(d.monthlySearches));
        const styles = getComputedStyle(canvas.closest('.seo-helper-container'));

        new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    borderColor: styles.getPropertyValue('--chart-line-color').trim(),
                    backgroundColor: styles.getPropertyValue('--chart-fill-color').trim(),
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: styles.getPropertyValue('--text-color'), font: { size: 10 } }, grid: { display: false } },
                    y: { beginAtZero: true, ticks: { color: styles.getPropertyValue('--text-color'), font: { size: 10 } } }
                }
            }
        });
    }

    // --- Main Logic ---
    async function showResults(query, resultsPanel, contentPlaceholder) {
        resultsPanel.style.display = 'block';
        resultsPanel.innerHTML = '<div class="loading-status"></div>';
        const loadingStatus = resultsPanel.querySelector('.loading-status');
        const loadingInterval = animateLoadingText(loadingStatus);

        const [volumeData, allintitleCount, intitleCount] = await Promise.all([
            fetchVolumeData(query),
            fetchTitleCount(query, 'allintitle'),
            fetchTitleCount(query, 'intitle')
        ]);

        clearInterval(loadingInterval);
        resultsPanel.innerHTML = '<span class="seo-helper-close-btn">×</span>';

        if (!volumeData) {
            resultsPanel.insertAdjacentHTML('beforeend', '<div>❌ Error fetching volume data. API might be down.</div>');
            return;
        }

        if (volumeData.error === 'BlockedByCloudflare') {
            resultsPanel.insertAdjacentHTML('beforeend', '<div>⚠️ Access denied by Cloudflare. Please visit <a href="https://insight.gotrends.app/" target="_blank" style="color:var(--link-color)">gotrends.app</a> once to solve the captcha.</div>');
            return;
        }

        const kgr = (volumeData.latestSearchVolume > 0) ? (allintitleCount / volumeData.latestSearchVolume).toFixed(3) : 'N/A';
        const difficulty = kgr !== 'N/A' ? getKGRDifficulty(kgr) : { text: '-', color: 'inherit' };

        const html = `
            <div>Search Volume (<b>${volumeData.latestMonthStr}</b>): <strong>${formatNumber(volumeData.latestSearchVolume)}</strong> | Avg: ${formatNumber(volumeData.avgMonthlySearches)}</div>
            <div>Allintitle: <strong>${formatNumber(allintitleCount)}</strong> | Intitle: <strong>${formatNumber(intitleCount)}</strong></div>
            <div>KGR (Allintitle): <strong style="color:${difficulty.color}">${kgr}</strong> (<span>${difficulty.text}</span>)</div>
            <div>CPC: <strong>$${volumeData.lowCpc} - $${volumeData.highCpc}</strong> | Comp. Index: <strong>${volumeData.competitionIndex}</strong></div>
            <div class="seo-helper-chart-container"><canvas></canvas></div>
        `;

        resultsPanel.insertAdjacentHTML('beforeend', html);
        
        const canvas = resultsPanel.querySelector('canvas');
        renderTrendChart(canvas, volumeData.historicalData);

        contentPlaceholder.style.height = `${resultsPanel.offsetHeight + 20}px`;
        
        resultsPanel.querySelector('.seo-helper-close-btn').onclick = () => {
            resultsPanel.style.display = 'none';
            contentPlaceholder.style.height = '0px';
            document.querySelector('.seo-helper-button').style.display = 'inline-block';
        };
    }

    function init() {
        const query = getQuery();
        if (!query || document.querySelector('.seo-helper-container')) return;

        let target;
        for (const s of CONFIG.INJECTION_POINT_SELECTORS) {
            target = document.querySelector(s);
            if (target) break;
        }

        if (!target) return;

        const style = document.createElement('style');
        style.textContent = CONFIG.CSS;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.className = 'seo-helper-container';
        container.dataset.theme = isDarkMode() ? 'dark' : 'light';

        const btn = document.createElement('span');
        btn.className = 'seo-helper-button';
        btn.textContent = '🔍 SEO Analysis';

        const panel = document.createElement('div');
        panel.className = 'seo-helper-results';

        const placeholder = document.createElement('div');
        placeholder.className = 'seo-helper-placeholder';

        container.append(btn, panel);
        target.after(container);
        
        const mainContent = document.querySelector('#cnt');
        if (mainContent) mainContent.prepend(placeholder);

        btn.onclick = () => {
            btn.style.display = 'none';
            showResults(query, panel, placeholder);
        };
    }

    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);

})();