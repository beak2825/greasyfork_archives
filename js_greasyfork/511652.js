// ==UserScript==
// @name         OpenRouter Activity Exporter
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Export OpenRouter activity data to JSON
// @author       Romboter
// @match        https://openrouter.ai/activity*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/511652/OpenRouter%20Activity%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/511652/OpenRouter%20Activity%20Exporter.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

(function() {
    'use strict';

    let activityData = [];
    let currentPage = 1;
    const DEBUG = false; // Set to false to minimize logs in production
    const MAX_RETRIES = 3;

    // Create a floating button
    const button = document.createElement('button');
    button.innerHTML = 'Export Activity';
    button.id = 'orp-export-activity-button';
    document.body.appendChild(button);

    // Style the button
    GM_addStyle(`#orp-export-activity-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
    }
    #orp-export-activity-button:hover {
        background-color: #0056b3;
    }`);

    // Attach click event to the button
    button.addEventListener('click', function() {
        button.disabled = true;
        button.innerHTML = 'Loading...';
        fetchActivity(currentPage);
    });

    function log(...args) {
        if (DEBUG) {
            console.log(...args);
        }
    }

    function handleError(message) {
        alert(`Error: ${message}`);
        button.disabled = false;
        button.innerHTML = 'Export Activity';
    }

    async function retryFetch(url, options, retries = MAX_RETRIES) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (response.ok) {
                    return response;
                }
            } catch (e) {
                log(`Fetch attempt ${i + 1} failed:`, e);
            }
        }
        throw new Error('Maximum retries reached for fetching activity data.');
    }

    function extractData(responseText) {
        const data = {
            transactions: null,
            appInfo: null,
            pagination: null
        };

        // Extract transactions array
        const transactionsRegex = /"transactions":\s*(\[[\s\S]*?\])\s*\]/;
        const transactionsMatch = responseText.match(transactionsRegex);

        if (transactionsMatch) {
            const individualTransactionRegex = /\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/g;
            const individualTransactions = transactionsMatch[1].match(individualTransactionRegex);
            if (individualTransactions) {
                data.transactions = individualTransactions.map(transaction => {
                    try {
                        const parsedTransaction = JSON.parse(transaction);
                        // Filter out pagination object if mistakenly included
                        if (parsedTransaction.page !== undefined && parsedTransaction.hasNextPage !== undefined) {
                            return null;
                        }
                        return parsedTransaction;
                    } catch (parseError) {
                        log('Error parsing individual transaction:', parseError);
                        return null;
                    }
                }).filter(Boolean);
            }

            if (!data.transactions || data.transactions.length === 0) {
                log('Failed to parse any transactions');
            }
        } else {
            log('No transactions match found');
        }

        // Extract pagination info
        const paginationRegex = /"page":\s*(\d+),\s*"hasNextPage":\s*(true|false)/;
        const paginationMatch = responseText.match(paginationRegex);

        if (paginationMatch) {
            data.pagination = {
                page: parseInt(paginationMatch[1]),
                hasNextPage: paginationMatch[2] === 'true'
            };
        } else {
            log('No pagination match found');
        }

        return data;
    }

    async function fetchActivity(page) {
        try {
            log(`Fetching activity for page: ${page}`);
            const url = `https://openrouter.ai/activity?page=${page}`;
            const options = {
                "credentials": "include",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "RSC": "1",
                    "Next-Url": "/activity",
                    "Priority": "u=0"
                },
                "referrer": "https://openrouter.ai/activity",
                "method": "GET",
                "mode": "cors"
            };

            const response = await retryFetch(url, options);
            const responseText = await response.text();

            if (responseText.startsWith("<!DOCTYPE html>")) {
                handleError("Received HTML instead of JSON. Possible login issue.");
                return;
            }

            const extractedData = extractData(responseText);

            if (extractedData.transactions && Array.isArray(extractedData.transactions)) {
                activityData.push(...extractedData.transactions);
                log(`Added ${extractedData.transactions.length} transactions. Total transactions: ${activityData.length}`);
            } else {
                log('No valid transactions data found in response.');
            }

            if (extractedData.pagination && extractedData.pagination.hasNextPage) {
                log('Next page found, fetching next page...');
                button.innerHTML = `Loading... (Page ${page})`;
                fetchActivity(extractedData.pagination.page + 1);
            } else {
                log('No more pages, downloading activity data...');
                downloadActivityData();
            }
        } catch (e) {
            handleError("Error fetching activity data: " + e.message);
        }
    }

    function downloadActivityData() {
        log('Downloading activity data. Total transactions:', activityData.length);
        const blob = new Blob([JSON.stringify(activityData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'activity_transactions.json';
        a.click();
        URL.revokeObjectURL(url);
        button.disabled = false;
        button.innerHTML = 'Export Activity';
    }
})();