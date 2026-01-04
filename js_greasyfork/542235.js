// ==UserScript==
// @name         Rustmagic data analyzer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Scrapes all pages of game history, analyzes the data, displays stats with graphs, and allows CSV export.
// @author       Puskevit
// @match        *://rustmagic.com/*
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/542235/Rustmagic%20data%20analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/542235/Rustmagic%20data%20analyzer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GAME_NAME_MAP = {
        'Battle': 'Case Battles',
        'Opening': 'Case Opening',
    };

    let allBetsData = [];
    let chartObjects = {};

    function showInitialPrompt() {
        if (document.getElementById('scraper-prompt')) return;
        const prompt = document.createElement('div');
        prompt.id = 'scraper-prompt';
        prompt.innerHTML = 'Click Your Avatar On Top Right & Go To "Games History" to Open The Scraper GUI';
        document.body.appendChild(prompt);
    }

    function createGUI() {
        if (document.getElementById('scraper-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'scraper-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h2>History Analyzer</h2>
                <button id="close-panel-btn">✖</button>
            </div>
            <div class="panel-content">
                <p>Ensure the "All" game type is selected, then click start.</p>
                <div class="button-container">
                    <button id="start-scrape-btn" class="action-btn">📊 Start Scraping</button>
                    <button id="download-csv-btn" class="action-btn" style="display:none;">📄 Download CSV</button>
                </div>
                <div id="scraper-status"></div>
                <div id="overall-stats" class="stats-container" style="display:none;"></div>
                <div id="charts-container"></div>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('start-scrape-btn').addEventListener('click', startScraping);
        document.getElementById('download-csv-btn').addEventListener('click', downloadCSV);
        document.getElementById('close-panel-btn').addEventListener('click', () => panel.style.display = 'none');
    }

    function addStyling() {
        GM_addStyle(`
            #scraper-prompt {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                background-color: #1a1a2e;
                color: #e0e0e0;
                border: 1px solid #5a5a9a;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.5);
                z-index: 9998;
                font-family: Arial, sans-serif;
                font-size: 15px;
                font-weight: bold;
            }
            #scraper-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 450px;
                max-height: 90vh;
                background-color: #1a1a2e;
                color: #e0e0e0;
                border: 1px solid #4a4a7a;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.5);
                z-index: 9999;
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
            }
            .panel-header {
                padding: 10px 15px;
                background-color: #2a2a4a;
                border-bottom: 1px solid #4a4a7a;
                border-radius: 10px 10px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .panel-header h2 { margin: 0; font-size: 18px; color: #fff; }
            #close-panel-btn { background: none; border: none; color: #9793BA; font-size: 20px; cursor: pointer; }
            .panel-content { padding: 15px; overflow-y: auto; }
            .panel-content p { font-size: 14px; line-height: 1.5; margin-bottom: 15px; }
            .button-container { display: flex; gap: 10px; margin-bottom: 15px; }
            .action-btn {
                flex-grow: 1; padding: 10px 15px; border: none; border-radius: 5px;
                background-color: #5a5a9a; color: white; font-size: 14px; font-weight: bold;
                cursor: pointer; transition: background-color 0.3s;
            }
            .action-btn:hover { background-color: #7a7ac2; }
            .action-btn:disabled { background-color: #444; cursor: not-allowed; }
            #scraper-status { margin-top: 10px; font-style: italic; color: #9793BA; min-height: 20px; }
            .stats-container { background-color: #2a2a4a; padding: 15px; border-radius: 5px; margin-top: 10px; }
            .stats-container h3 { margin-top: 0; border-bottom: 1px solid #4a4a7a; padding-bottom: 5px; color: #fff; }
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px; }
            .stat-item { display: flex; justify-content: space-between; }
            .stat-label { color: #ccc; }
            .stat-value.profit { color: #a5ec60; }
            .stat-value.loss { color: #ff6b6b; }
            #charts-container { margin-top: 20px; }
            .chart-wrapper { margin-bottom: 20px; background-color: #2a2a4a; padding: 10px; border-radius: 5px; }
        `);
    }

    async function startScraping() {
        document.getElementById('start-scrape-btn').disabled = true;
        document.getElementById('start-scrape-btn').textContent = "Scraping...";
        const statusEl = document.getElementById('scraper-status');
        const overallStatsEl = document.getElementById('overall-stats');
        const chartsContainer = document.getElementById('charts-container');

        allBetsData = [];
        overallStatsEl.style.display = 'none';
        chartsContainer.innerHTML = '';
        Object.values(chartObjects).forEach(chart => chart.destroy());
        chartObjects = {};
        let pageCount = 1;

        while (true) {
            statusEl.textContent = `Scraping page ${pageCount}...`;
            await new Promise(r => setTimeout(r, 500));

            const tableBeforeScrape = getTableContent();
            scrapeCurrentPage();

            const nextButton = Array.from(document.querySelectorAll('div.sc-aXZVg.dKpxMo.sc-bXCLTC.cpAwwW'))
                .find(el => el.querySelector('svg') && !el.style.cssText.includes('rotate'));

            if (!nextButton || nextButton.disabled || !nextButton.offsetParent) {
                statusEl.textContent = `Scraping finished! Reached the last page.`;
                break;
            }

            nextButton.click();
            pageCount++;

            try {
                await waitForTableLoad(tableBeforeScrape, 10000);
            } catch (error) {
                statusEl.textContent = `Scraping stopped. Table didn't update after click.`;
                console.error(error.message);
                break;
            }
        }

        statusEl.textContent = `Scraping complete! Processed ${pageCount} pages and ${allBetsData.length} bets.`;
        analyzeAndDisplayData();
        document.getElementById('start-scrape-btn').disabled = false;
        document.getElementById('start-scrape-btn').textContent = "📊 Re-Scrape";
        document.getElementById('download-csv-btn').style.display = 'inline-block';
    }

    function scrapeCurrentPage() {
        const rows = document.querySelectorAll('.sc-kOHTFB.cXnurL');
        rows.forEach(row => {
            const cells = row.querySelectorAll(':scope > div');
            if (cells.length < 5) return;

            const id = cells[0]?.textContent.trim();
            let game = cells[1]?.textContent.trim();
            if (GAME_NAME_MAP[game]) game = GAME_NAME_MAP[game];

            const wagerText = cells[2]?.textContent.trim();
            const payoutText = cells[3]?.textContent.trim();
            const time = cells[4]?.textContent.trim();
            const wager = parseFloat(wagerText.replace(/[^0-9.]/g, '')) || 0;

            const isWin = payoutText.includes('+') || cells[3].querySelector('div')?.style.color === 'rgb(165, 236, 96)';
            const payoutValue = parseFloat(payoutText.replace(/[^0-9.]/g, '')) || 0;
            const netProfit = isWin ? payoutValue : -wager;

            allBetsData.push({ id, game, wager, payout: isWin ? wager + payoutValue : 0, netProfit, time });
        });
    }

    function getTableContent() {
        const firstRow = document.querySelector('.sc-kOHTFB.cXnurL');
        return firstRow ? firstRow.textContent : '';
    }

    function waitForTableLoad(previousContent, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const newContent = getTableContent();
                if (newContent && newContent !== previousContent) {
                    clearInterval(interval);
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error("Timeout: Table content did not change after click."));
                }
            }, 200);
        });
    }

    function analyzeAndDisplayData() {
        if (allBetsData.length === 0) return;

        const totalWagered = allBetsData.reduce((sum, bet) => sum + bet.wager, 0);
        const totalProfit = allBetsData.reduce((sum, bet) => sum + bet.netProfit, 0);
        const totalWon = allBetsData.filter(b => b.netProfit > 0).reduce((sum, b) => sum + b.payout, 0);
        const totalLost = allBetsData.filter(b => b.netProfit < 0).reduce((sum, b) => sum + b.wager, 0);

        const overallStatsEl = document.getElementById('overall-stats');
        overallStatsEl.innerHTML = `
            <h3>Overall Stats</h3>
            <div class="stats-grid">
                <div class="stat-item"><span class="stat-label">Total Wagered:</span> <span class="stat-value">${totalWagered.toFixed(2)}</span></div>
                <div class="stat-item"><span class="stat-label">Total Won:</span> <span class="stat-value profit">+${totalWon.toFixed(2)}</span></div>
                <div class="stat-item"><span class="stat-label">Total Lost:</span> <span class="stat-value loss">-${totalLost.toFixed(2)}</span></div>
                <div class="stat-item"><span class="stat-label">Total Profit:</span> <span class="stat-value ${totalProfit >= 0 ? 'profit' : 'loss'}">${totalProfit.toFixed(2)}</span></div>
            </div>
        `;
        overallStatsEl.style.display = 'block';

        const statsByGame = allBetsData.reduce((acc, bet) => {
            if (!acc[bet.game]) {
                acc[bet.game] = { wager: 0, profit: 0, wins: 0, losses: 0, count: 0 };
            }
            acc[bet.game].wager += bet.wager;
            acc[bet.game].profit += bet.netProfit;
            acc[bet.game].count++;
            if (bet.netProfit > 0) acc[bet.game].wins++;
            else acc[bet.game].losses++;
            return acc;
        }, {});

        const chartsContainer = document.getElementById('charts-container');
        for (const gameName in statsByGame) {
            const gameData = statsByGame[gameName];
            const avgBet = gameData.wager / gameData.count;
            const winRate = (gameData.wins / gameData.count) * 100;
            const totalWonForGame = gameData.wager + gameData.profit;

            const chartWrapper = document.createElement('div');
            chartWrapper.className = 'chart-wrapper';
            chartWrapper.innerHTML = `
                <h3>${gameName}</h3>
                <div class="stats-grid">
                     <div class="stat-item"><span class="stat-label">Profit:</span> <span class="stat-value ${gameData.profit >= 0 ? 'profit' : 'loss'}">${gameData.profit.toFixed(2)}</span></div>
                     <div class="stat-item"><span class="stat-label">Avg. Bet:</span> <span class="stat-value">${avgBet.toFixed(2)}</span></div>
                     <div class="stat-item"><span class="stat-label">Win Rate:</span> <span class="stat-value">${winRate.toFixed(1)}%</span></div>
                     <div class="stat-item"><span class="stat-label">W/L:</span> <span class="stat-value">${gameData.wins}/${gameData.losses}</span></div>
                </div>
                <canvas id="chart-${gameName.replace(/\s+/g, '-')}"></canvas>
            `;
            chartsContainer.appendChild(chartWrapper);

            const ctx = document.getElementById(`chart-${gameName.replace(/\s+/g, '-')}`).getContext('2d');
            chartObjects[gameName] = new Chart(ctx, {
                type: 'bar', data: {
                    labels: ['Total Wagered', 'Total Won'],
                    datasets: [{
                        label: 'Amount', data: [gameData.wager, totalWonForGame],
                        backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(75, 192, 192, 0.5)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'], borderWidth: 1
                    }]
                },
                options: {
                    scales: { y: { beginAtZero: true, ticks: { color: '#e0e0e0' }}, x: { ticks: { color: '#e0e0e0' }}},
                    plugins: { legend: { display: false }}
                }
            });
        }
    }

    function downloadCSV() {
        if (allBetsData.length === 0) {
            alert("No data to download!"); return;
        }
        const headers = "ID,Game,Wager,Payout,NetProfit,Time";
        const rows = allBetsData.map(bet => [bet.id, bet.game, bet.wager.toFixed(2), bet.payout.toFixed(2), bet.netProfit.toFixed(2), `"${bet.time}"`].join(','));
        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "rustmagic_history_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 500);
    }

    addStyling();
    showInitialPrompt();

    waitForElement('.sc-kYxDKI.hzPxqP', () => {
        const prompt = document.getElementById('scraper-prompt');
        if (prompt) prompt.remove();
        createGUI();
    });

})();