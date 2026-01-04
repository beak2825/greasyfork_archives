// ==UserScript==
// @name         OKX Futures Volatility Tracker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Track volatility of the selected futures instrument on OKX
// @author       Boba2612
// @match        https://www.okx.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/505953/OKX%20Futures%20Volatility%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/505953/OKX%20Futures%20Volatility%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the API endpoint for futures
    const endpoint = 'https://www.okx.com/api/v5/market/tickers?instType=FUTURES';

    // Create a sidebar element
    const sidebar = document.createElement('div');
    sidebar.style.position = 'fixed';
    sidebar.style.top = '0';
    sidebar.style.right = '0';
    sidebar.style.width = '300px';
    sidebar.style.maxHeight = '100%';
    sidebar.style.overflowY = 'scroll';
    sidebar.style.backgroundColor = '#f8f9fa';
    sidebar.style.border = '1px solid #ccc';
    sidebar.style.padding = '10px';
    sidebar.style.zIndex = '1000';
    sidebar.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    document.body.appendChild(sidebar);

    // Function to fetch data from OKX API
    function fetchData(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data.data);
                    } catch (error) {
                        reject(`Error parsing data: ${error}`);
                    }
                },
                onerror: function(error) {
                    reject(`Error fetching data: ${error}`);
                }
            });
        });
    }

    // Function to calculate volatility
    function calculateVolatility(data) {
        return data.map(item => {
            const lastPrice = parseFloat(item.last);
            const high24h = parseFloat(item.high24h);
            const low24h = parseFloat(item.low24h);

            if (lastPrice && high24h && low24h) {
                const volatility = ((high24h - low24h) / lastPrice) * 100;
                return {
                    instId: item.instId,
                    volume: item.volCcy24h, // Assuming volCcy24h is the volume
                    volatility: volatility.toFixed(2)
                };
            }
            return null;
        }).filter(item => item !== null).sort((a, b) => b.volatility - a.volatility);
    }

    // Function to display the results in the sidebar
    function displayResults(data) {
        const titleElement = document.createElement('h2');
        titleElement.textContent = 'Futures Market Volatility Analysis';
        sidebar.appendChild(titleElement);

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        const thead = document.createElement('thead');
        thead.innerHTML = '<tr><th>Instrument</th><th>Volume</th><th>Volatility (%)</th></tr>';
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.instId}</td>
                <td>${item.volume}</td>
                <td>${item.volatility}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        sidebar.appendChild(table);
    }

    // Main function to fetch, calculate, and display volatility
    async function main() {
        try {
            const futuresData = await fetchData(endpoint);
            const futuresVolatility = calculateVolatility(futuresData);

            displayResults(futuresVolatility);

        } catch (error) {
            console.error('Error in main function:', error);
        }
    }

    // Run the main function
    main();
})();
