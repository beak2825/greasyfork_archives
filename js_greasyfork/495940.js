// ==UserScript==
// @name         Torn Points Market Monitor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Monitor the current cost of points on Torn
// @author       FunkyCrunchy[1021188]
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/495940/Torn%20Points%20Market%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/495940/Torn%20Points%20Market%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add button to input API key
    const button = $('<button>')
        .text('Set API Key')
        .css({
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            padding: '5px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
        })
        .appendTo('body');

    button.on('click', () => {
        const apiKey = prompt('Please enter your Torn API Key:', GM_getValue('apiKey', ''));
        if (apiKey) {
            GM_setValue('apiKey', apiKey);
            fetchPointCosts(apiKey);
        }
    });

    // Fetch point costs from the API
    function fetchPointCosts(apiKey) {
        const apiUrl = `https://api.torn.com/market/?selections=pointsmarket&key=${apiKey}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.pointsmarket) {
                    const costs = Object.values(data.pointsmarket).map(item => item.cost);
                    const minCost = Math.min(...costs);
                    displayMinCost(minCost);
                } else {
                    alert('Failed to fetch points market data. Please check your API key.');
                }
            }
        });
    }

    // Display the minimum cost
    function displayMinCost(cost) {
        const formattedCost = `$${cost.toLocaleString()}`;
        let costDisplay = $('#cost-display');

        if (!costDisplay.length) {
            costDisplay = $('<div>')
                .attr('id', 'cost-display')
                .css({
                    position: 'fixed',
                    top: '40px',
                    right: '10px',
                    zIndex: 1000,
                    padding: '5px',
                    backgroundColor: '#000',
                    color: 'green',
                    border: '1px solid #fff'
                })
                .appendTo('body');
        }

        costDisplay.text(`Lowest Point Cost: ${formattedCost}`);
    }

    // Function to auto-refresh the data
    function autoRefresh() {
        const savedApiKey = GM_getValue('apiKey', '');
        if (savedApiKey) {
            fetchPointCosts(savedApiKey);
        }
    }

    // Load API key if already saved and fetch the costs
    const savedApiKey = GM_getValue('apiKey', '');
    if (savedApiKey) {
        fetchPointCosts(savedApiKey);
    }

    // Set interval to refresh data every 5 seconds
    setInterval(autoRefresh, 5000);
})();