// ==UserScript==
// @name         Torn Crime Notifier
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Displays shop security statuses and search for cash data from the Torn API, Colored for easier viewing. Mobile-friendly!
// @author       QueenLunara [3408686]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @license      GNU GLPv3
// @downloadURL https://update.greasyfork.org/scripts/507732/Torn%20Crime%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/507732/Torn%20Crime%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
    const storedTimestamp = GM_getValue('API_KEY_TIMESTAMP');
    const currentTime = Date.now();

    if (!storedTimestamp || currentTime - storedTimestamp > ONE_MONTH_MS) {
        GM_deleteValue('API_KEY');
        GM_deleteValue('API_KEY_TIMESTAMP');
    }

    let API_KEY = GM_getValue('API_KEY') || prompt("Please enter your API key:");
    if (API_KEY) {
        GM_setValue('API_KEY', API_KEY);
        GM_setValue('API_KEY_TIMESTAMP', currentTime);
    }

    const CHECK_INTERVAL = 30000;
    let isMinimized = GM_getValue('isMinimized', false);
    const lastCheckedTime = GM_getValue('lastCheckedTime', null);
    const savedShopData = GM_getValue('shopData', 'No data yet.');
    const savedSearchData = GM_getValue('searchData', 'No data yet.');
    let previousShopsData = GM_getValue('previousShopsData', {});
    let previousSearchData = GM_getValue('previousSearchData', {});

    function getScreenSize() {
        if (window.innerWidth <= 480) return 'small';
        if (window.innerWidth <= 768) return 'medium';
        return 'large';
    }

    function createPanel() {
        const screenSize = getScreenSize();
        let panelWidth = screenSize === 'small' ? '90%' : screenSize === 'medium' ? '320px' : '400px';
        let panelMaxHeight = screenSize === 'small' ? '250px' : screenSize === 'medium' ? '300px' : '400px';

        let panel = document.createElement('div');
        panel.id = 'shopPanel';
        panel.style.position = 'fixed';
        panel.style.top = '50px';
        panel.style.right = '5px';
        panel.style.padding = '8px';
        panel.style.border = '2px solid #444';
        panel.style.backgroundColor = '#1f1f1f';
        panel.style.color = 'white';
        panel.style.width = panelWidth;
        panel.style.borderRadius = '6px';
        panel.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        panel.style.zIndex = '10000';
        panel.style.fontSize = screenSize === 'small' ? '12px' : '14px';
        panel.innerHTML = `
            <button id="minimizeButton" style="padding: 6px; background-color: #4CAF50; color: white; font-weight: bold; border: none; cursor: pointer; width: 100%; border-radius: 4px; font-size: 14px;">${isMinimized ? '+' : '-'}</button>
            <div id="content" style="display: ${isMinimized ? 'none' : 'block'}; max-height: ${panelMaxHeight}; overflow-y: auto;">
                <div style="padding: 10px; font-weight: bold; background: #2e2e2e; text-align: center; border-radius: 4px; margin-bottom: 8px;">Shop Security Status</div>
                <p id="lastChecked" style="color: #a0a0a0; text-align: center; margin-bottom: 10px;">Last checked: ${lastCheckedTime ? new Date(lastCheckedTime).toLocaleString() : 'Never'}</p>
                <div class="shop_List" style="padding: 8px; background-color: #292929; border-radius: 4px;">${savedShopData}</div>
                <div style="padding: 10px; font-weight: bold; background: #2e2e2e; text-align: center; border-radius: 4px; margin-top: 10px; margin-bottom: 8px;">Search for Cash Status</div>
                <div class="search_List" style="padding: 8px; background-color: #292929; border-radius: 4px;">${savedSearchData}</div>
            </div>
        `;
        document.body.appendChild(panel);
        document.getElementById('minimizeButton').addEventListener('click', toggleMinimize);
    }

    function toggleMinimize() {
        const content = document.getElementById('content');
        if (content.style.display === 'none') {
            content.style.display = 'block';
            this.textContent = '-';
            GM_setValue('isMinimized', false);
        } else {
            content.style.display = 'none';
            this.textContent = '+';
            GM_setValue('isMinimized', true);
        }
    }

    function fetchShopData() {
        fetch(`https://api.torn.com/torn/?selections=shoplifting&key=${API_KEY}`)
        .then(response => response.json())
        .then(apiData => {
            if (apiData.error) {
                alert(`Error code - ${apiData.error.code} | ${apiData.error.error}`);
                return;
            }
            GM_setValue('lastCheckedTime', Date.now());
            const shops = extractShopsData(apiData.shoplifting);
            checkForSecurityDown(shops);
            displayShops(shops);
        })
        .catch(error => {
            console.error('Error fetching shop data:', error);
        });

        fetchSearchData();
    }

    function extractShopsData(shoplifting) {
        return {
            "Sally's Sweet Shop": shoplifting.sallys_sweet_shop,
            "Bits 'n' Bobs": shoplifting.Bits_n_bobs,
            "TC Clothing": shoplifting.tc_clothing,
            "Super Store": shoplifting.super_store,
            "Pharmacy": shoplifting.pharmacy,
            "Cyber Force": shoplifting.cyber_force,
            "Jewelry Store": shoplifting.jewelry_store,
            "Big Al's Gun Shop": shoplifting.big_als
        };
    }

    function displayShops(shops) {
        let shopDisplay = '';
        Object.keys(shops).forEach(shopName => {
            shopDisplay += `
                <div style="margin-bottom: 8px;">
                    <div style="font-weight: bold; color: #f5f5f5; margin-bottom: 4px;">${shopName}</div>
                    ${shops[shopName].map(security => `
                        <div style="display: flex; justify-content: space-between; padding: 4px; background: ${security.disabled ? '#ff4d4d' : '#4CAF50'}; border-radius: 4px; color: white; margin-bottom: 4px;">
                            <span>${security.title}</span>
                            <span>${security.disabled ? 'Disabled' : 'Enabled'}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        });
        GM_setValue('shopData', shopDisplay);
        document.querySelector('.shop_List').innerHTML = shopDisplay;
        document.getElementById('lastChecked').innerText = `Last checked: ${new Date().toLocaleString()}`;
    }

    function checkForSecurityDown(currentShops) {
        let alerts = [];
        let storedShops = GM_getValue('previousShopsData', {});

        Object.keys(currentShops).forEach(shopName => {
            currentShops[shopName].forEach((security, index) => {
                const prevShops = storedShops[shopName] || [];
                const prevSecurity = prevShops[index] || {};

                if (!prevSecurity.disabled && security.disabled) {
                    alerts.push(`${shopName}: ${security.title} is now Disabled!`);
                }
            });
        });

        if (alerts.length > 0) {
            alert(alerts.join('\n'));
        }

        GM_setValue('previousShopsData', currentShops);
    }

    function fetchSearchData() {
        fetch(`https://api.torn.com/torn/?selections=searchforcash&key=${API_KEY}`)
        .then(response => response.json())
        .then(apiData => {
            if (apiData.error) {
                alert(`Error code - ${apiData.error.code} | ${apiData.error.error}`);
                return;
            }
            displaySearchData(apiData.searchforcash);
            checkForSearchThresholds(apiData.searchforcash);
        })
        .catch(error => {
            console.error('Error fetching search for cash data:', error);
        });
    }

    function displaySearchData(searchData) {
        let searchDisplay = '';
        const sortedData = Object.entries(searchData).sort((a, b) => b[1].percentage - a[1].percentage);

        sortedData.forEach(([searchType, data]) => {
            const percentage = data.percentage;
            let backgroundColor = '#4CAF50';
            if (percentage < 50) {
                backgroundColor = '#ff4d4d';
            } else if (percentage < 80) {
                backgroundColor = '#ffcc00';
            }
            searchDisplay += `
                <div style="margin-bottom: 8px;">
                    <div style="font-weight: bold; color: #f5f5f5; margin-bottom: 4px;">${data.title}</div>
                    <div style="display: flex; justify-content: space-between; padding: 4px; background: ${backgroundColor}; border-radius: 4px; color: white; margin-bottom: 4px;">
                        <span>Percentage</span>
                        <span>${percentage}%</span>
                    </div>
                </div>
            `;
        });
        GM_setValue('searchData', searchDisplay);
        document.querySelector('.search_List').innerHTML = searchDisplay;
    }

    function checkForSearchThresholds(currentSearchData) {
        let storedSearchData = GM_getValue('previousSearchData', {});
        let notifications = [];

        Object.keys(currentSearchData).forEach(searchType => {
            const currentPercentage = currentSearchData[searchType].percentage;
            const previousPercentage = storedSearchData[searchType]?.percentage || 0;

            if (currentPercentage > 80 && previousPercentage <= 80) {
                notifications.push(`${searchType}: ${currentPercentage}% (Above 80%)`);
            }
        });

        if (notifications.length > 0) {
            GM_notification({
                title: 'Search for Cash Alert',
                text: notifications.join('\n'),
                timeout: 5000,
            });
        }

        GM_setValue('previousSearchData', currentSearchData);
    }

    fetchShopData();
    setInterval(fetchShopData, CHECK_INTERVAL);

    createPanel();
})();