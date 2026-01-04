// ==UserScript==
// @name         Torn Buy-Mug Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fetches Torn user profile data from elements with specific classes
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/519972/Torn%20Buy-Mug%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/519972/Torn%20Buy-Mug%20Helper.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2024. All rights reserved.
 * Proprietary Software License
 *
 * This software and its source code are the exclusive property of the copyright holder.
 *
 * Permission is granted for PERSONAL USE ONLY.
 * You may not:
 * - Modify this software
 * - Distribute this software
 * - Use this software for commercial purposes
 * - Share or redistribute this software in any form
 *
 * All rights of modification and distribution are reserved by the copyright holder.
 * Unauthorized copying, modification, or distribution of this software, via any medium,
 * is strictly prohibited and will be prosecuted to the fullest extent of the law.
 *
 * This software is provided "as is" without any express or implied warranties.
 */

(function() {
    'use strict';
    let IsSubscriptionActive = getCookie('tornBuyMugSubscription') === 'true';

    const userId = JSON.parse(document.querySelector('#torn-user').value).id

    console.log(userId)

    const addGlobalStyles = () => {
        const css = `
        .userInfoWrapper___B2a2P {
            width: 240px !important;
        }
        .rowWrapper___me3Ox {
            height: 55px !important;
        }
        .flexCenter___bV1QP {
width:100%;
}
    `;

        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    const createElement = (IsSubscriptionActive) => {
        return `<div id="api-key" style="margin:2px 0;" class=" collapsible compact ">
            <div class="title" style="
            background-color:blue;
            padding: 0 10px 0 10px;
            cursor:pointer;
    font-size: 13px;
    letter-spacing: 1px;
    display: flex;
    justify-content:space-between;
    height: 22px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    align-items: center;
    white-space: nowrap;
    margin: initial;
    ">
                <div class="text">Buy-Mug Helper</div>
                <div class="options"></div>
                <i class="icon fas fa-caret-down"></i>
            </div>
            <main>
                <div class="area-desktop___bpqAS">
                    <div class="area-row___iBD8N">
                        <span style="display:flex" class="linkName___FoKha">
                            <span style="align-items: center; display: flex; flex-direction: row; height: 23px; justify-content: center; margin-left: 0; width: 34px;">
                                <svg width="16px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 244.948 244.948" xml:space="preserve" fill="${IsSubscriptionActive ? 'green':'red'}">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <g>
                                            <g>
                                                <path style="fill:${IsSubscriptionActive ? 'green':'red'};" d="M122.474,0C54.948,0,0.008,54.951,0.008,122.477s54.94,122.471,122.466,122.471 S244.94,189.997,244.94,122.471S190,0,122.474,0z M122.474,222.213c-55.005,0-99.752-44.742-99.752-99.742 c0-55.011,44.747-99.752,99.752-99.752s99.752,44.742,99.752,99.752C222.221,177.477,177.479,222.213,122.474,222.213z"></path>
                                                <path style="fill:${IsSubscriptionActive ? 'green':'red'};" d="M113.739,180.659c-6.092-0.228-11.438-0.881-16.023-1.958c-4.596-1.093-8.175-2.35-10.742-3.758 l6.255-18.324c1.92,1.175,4.618,2.295,8.088,3.361c3.47,1.061,7.615,1.822,12.423,2.252v-32.547 c-3.312-1.485-6.598-3.144-9.856-4.966c-3.258-1.817-6.168-3.998-8.735-6.57c-2.567-2.562-4.629-5.624-6.173-9.208 c-1.545-3.584-2.322-7.821-2.322-12.744c0-9.192,2.431-16.323,7.294-21.403c4.857-5.069,11.46-8.354,19.793-9.85V50.344h16.671 v13.951c4.699,0.31,8.817,0.946,12.341,1.909c3.525,0.946,6.783,2.067,9.774,3.329l-5.771,17.672 c-1.817-0.848-4.112-1.702-6.891-2.562c-2.779-0.848-5.929-1.485-9.459-1.92v30.122c3.312,1.501,6.652,3.182,10.019,5.047 c3.361,1.882,6.353,4.096,8.974,6.652c2.616,2.578,4.754,5.586,6.413,9.067c1.653,3.481,2.486,7.604,2.486,12.417 c0,9.839-2.486,17.497-7.457,23.002c-4.966,5.504-11.776,9.045-20.429,10.644v14.914h-16.671L113.739,180.659L113.739,180.659z M107.484,94.341c0,3.225,1.251,5.918,3.764,8.055c2.513,2.148,5.64,4.15,9.382,5.978v-26.14c-5.026,0.228-8.48,1.458-10.34,3.72 C108.42,88.205,107.484,91.006,107.484,94.341z M137.459,148.274c0-3.389-1.36-6.162-4.085-8.316 c-2.725-2.159-6.01-4.145-9.861-5.945v28.218c4.705-0.538,8.202-2.012,10.503-4.438 C136.311,155.361,137.459,152.19,137.459,148.274z"></path>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </span>
                            <span class="linkName___FoKha" style="display:flex;gap:8px; align-items:center;">Subscription ${IsSubscriptionActive ? 'Active':'Inactive'}<svg fill="#ffffff" height="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 489.645 489.645" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M460.656,132.911c-58.7-122.1-212.2-166.5-331.8-104.1c-9.4,5.2-13.5,16.6-8.3,27c5.2,9.4,16.6,13.5,27,8.3 c99.9-52,227.4-14.9,276.7,86.3c65.4,134.3-19,236.7-87.4,274.6c-93.1,51.7-211.2,17.4-267.6-70.7l69.3,14.5 c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-122.8-25c-20.6-2-25,16.6-23.9,22.9l15.6,123.8 c1,10.4,9.4,17.7,19.8,17.7c12.8,0,20.8-12.5,19.8-23.9l-6-50.5c57.4,70.8,170.3,131.2,307.4,68.2 C414.856,432.511,548.256,314.811,460.656,132.911z"></path> </g> </g></svg></span>

                        </span>
                    </div>
                </div>
                <div class="input-wrap" style="display: flex;">
                    <input type="text" placeholder="API key" class="api-input" id="apiKeyInput" style="width:100%; padding: 5px 5px; margin-top:2px; border-bottom-right-radius: 5px; border-top-right-radius: 5px;">
                </div>
                <div class="input-wrap" style="display: flex;">
                    <input type="text" placeholder="Min buy-mug amount" class="min-amount-input" id="minAmountInput" style="width:100%; padding: 5px 5px; margin-top:2px; border-bottom-right-radius: 5px; border-top-right-radius: 5px;">
                </div>
            </main>
        </div>`;
    };

    const firstBlock = document.querySelector('.sidebar___xipSp .sidebar-block___Ef1l1.desktop___aYLqo');
    if (firstBlock) {
        addGlobalStyles();

        firstBlock.insertAdjacentHTML('afterend', createElement(IsSubscriptionActive));

        const apiKeyInput = document.getElementById('apiKeyInput');
        const minAmountInput = document.getElementById('minAmountInput');
        const savedApiKey = getCookie('tornBuyMugApiKey');
        const savedMinAmount = getCookie('tornBuyMugMinAmount');

        if (savedApiKey) apiKeyInput.value = savedApiKey;
        if (savedMinAmount) minAmountInput.value = savedMinAmount;

        apiKeyInput.addEventListener('change', function() {
            setCookie('tornBuyMugApiKey', this.value, 365);
        });

        minAmountInput.addEventListener('change', function() {
            setCookie('tornBuyMugMinAmount', this.value, 365);
        });

        document.querySelector('#api-key .title').addEventListener('click', function() {
            this.classList.toggle('collapsed');
            const mainElement = this.closest('#api-key').querySelector('main');
            if (mainElement) {
                mainElement.style.display = this.classList.contains('collapsed') ? 'none' : 'block';
            }
        });

        document.querySelector('#api-key .area-desktop___bpqAS').addEventListener('click', async function() {
            const apiKey = getCookie('tornBuyMugApiKey');
            if (!apiKey) {
                console.log('API key not set');
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://torn-scripts.jacobbuckingham.com/api/TornProfile/CheckSubscription/${userId}`,
                headers: {
                    'accept': '*/*',
                    'X-API-Key': apiKey
                },
                onload: function(response) {
                    if (response.status === 200) {
                        IsSubscriptionActive = JSON.parse(response.responseText);

                        setCookie('tornBuyMugSubscription', IsSubscriptionActive, 365);

                        // Remove old element and create new one with updated subscription status
                        const oldElement = document.getElementById('api-key');
                        if (oldElement) {
                            oldElement.insertAdjacentHTML('afterend', createElement(IsSubscriptionActive));
                            oldElement.remove();

                            // Reattach event listeners to new element
                            attachEventListeners();
                        }
                    }
                },
                onerror: function(error) {
                    console.log('Request Error:', error);
                }
            });
        });
    }

    function attachEventListeners() {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const minAmountInput = document.getElementById('minAmountInput');
        const savedApiKey = getCookie('tornBuyMugApiKey');
        const savedMinAmount = getCookie('tornBuyMugMinAmount');

        if (savedApiKey) apiKeyInput.value = savedApiKey;
        if (savedMinAmount) minAmountInput.value = savedMinAmount;

        apiKeyInput.addEventListener('change', function() {
            setCookie('tornBuyMugApiKey', this.value, 365);
        });

        minAmountInput.addEventListener('change', function() {
            setCookie('tornBuyMugMinAmount', this.value, 365);
        });

        document.querySelector('#api-key .title').addEventListener('click', function() {
            this.classList.toggle('collapsed');
            const mainElement = this.closest('#api-key').querySelector('main');
            if (mainElement) {
                mainElement.style.display = this.classList.contains('collapsed') ? 'none' : 'block';
            }
        });

        document.querySelector('#api-key .area-desktop___bpqAS').addEventListener('click', async function() {
            // Subscription check code here
        });
    }

    const extractMarketInfo = (element) => {
        // Find the nearest parent that would contain both price and availability
        let container = element.closest('[class*="item-market-link"]') || element.parentElement;
        let searchDepth = 0;
        const maxDepth = 5; // Maximum levels to search up

        // Search up the DOM tree if we don't find our elements
        while (container && searchDepth < maxDepth) {
            const priceElement = container.querySelector('.price___Uwiv2');
            const availableElement = container.querySelector('.available___xegv_');

            if (priceElement || availableElement) {
                const price = priceElement ? parseInt(priceElement.textContent.replace('$', '').replace(/,/g, '')) : null;
                const available = availableElement ?
                      parseInt(availableElement.textContent.replace(' available', '')) : null;


                return { price, available };
            }

            container = container.parentElement;
            searchDepth++;
        }

        return { price: null, available: null };
    }

    const makeApiRequest = async (userIds) => {
        const apiKey = getCookie('tornBuyMugApiKey');
        if (!apiKey) {
            console.log('API key not set');
            return null;
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://torn-scripts.jacobbuckingham.com/api/TornProfile/GetUserDetails/${userId}`,
                headers: {
                    'accept': '*/*',
                    'X-API-Key': apiKey,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(userIds),
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(`API Error: ${response.status} ${response.statusText}`);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    const highlightPlayer = (element, total, stats, minutesRemaining) => {
        // Find or create the info box
        let infoBox = element.parentElement.parentElement;

        const highlightColor = minutesRemaining <= 10 ? '#FFD700' : '#FF5722'; // Yellow vs Red
        const backgroundColor = minutesRemaining <= 10 ? 'rgba(255,215,0,0.1)' : 'rgba(255,87,34,0.1)';

        // Create or update the total display
        const totalDisplay = document.createElement('div');
        totalDisplay.style.color = '#FF5722';
        totalDisplay.style.fontWeight = 'bold';
        totalDisplay.style.padding = '2px';
        totalDisplay.style.margin = '2px 2px 2px 18px';
        totalDisplay.style.border = `1px solid ${highlightColor}`;
        totalDisplay.style.borderRadius = '4px';
        totalDisplay.style.borderRadius = '4px';

        totalDisplay.style.backgroundColor = backgroundColor;
        totalDisplay.style.fontSize = '10px';
        totalDisplay.textContent = `$${total.toLocaleString()} L: ${stats.level} A:${stats.age} X: ${stats.xan} R: ${stats.refil}`;

        infoBox.appendChild(totalDisplay);

        // Highlight the original element
        element.style.backgroundColor = backgroundColor;
        element.style.border = `1px solid ${highlightColor}`;
        element.style.borderRadius = '4px';
        element.style.padding = '2px 5px';
    }

    const extractUserId = (href) => {
        const match = href.match(/XID=(\d+)|\/profiles\.php\?XID=(\d+)/);
        return match ? (match[1] || match[2]) : null;
    }

    let lastProcessedTime = 0;
    const PROCESS_COOLDOWN = 1000; // 1 second cooldown

    const processElements = async () => {
        const currentTime = Date.now();
        if (currentTime - lastProcessedTime < PROCESS_COOLDOWN) {
            return;
        }
        lastProcessedTime = currentTime;

        const elements = document.querySelectorAll('a.linkWrap___ZS6r9.flexCenter___bV1QP');
        let userIds = [];
        let elementMap = new Map(); // Store element references with their userIds

        for (const element of elements) {
            const userId = extractUserId(element.href);
            const { price, available } = extractMarketInfo(element);
            const total = price * available;
            const priceCap = getCookie('tornBuyMugMinAmount');

            if(total >= priceCap && userId != null) {
                userIds.push(userId);
                elementMap.set(userId, { element, total }); // Store both element and total
            }
        }

        if (userIds.length > 0) {
            const res = await makeApiRequest(userIds);

            // Process each user in the response
            res.forEach(userStats => {
                const elementInfo = elementMap.get(userStats.tornUserId);
                if (elementInfo) {



                    highlightPlayer(
                        elementInfo.element,
                        elementInfo.total,
                        {
                            level: userStats.level,
                            age: userStats.age,
                            xan: userStats.xanax,
                            refil: userStats.refills
                        },
                        userStats.hospitaltimeremaining
                    );
                }
            });
        }
    }

    const waitForElements = (selector, callback, maxAttempts = 10) => {
        let attempts = 0;

        const checkElements = () => {
            attempts++;
            const elements = document.querySelectorAll(selector);

            if (elements.length > 0) {
                callback();
            } else if (attempts < maxAttempts) {
                setTimeout(checkElements, 1000);
            } else {
            }
        };

        checkElements();
    };

    // Wait for elements and then run the script
    waitForElements('a.linkWrap___ZS6r9.flexCenter___bV1QP', processElements);

    const watchBuyButtons = () => {
        // Using event delegation for dynamically added buttons
        document.addEventListener('click', (e) => {
            // Check if clicked element is a buy button or its child elements
            const buyButton = e.target.closest('.actionButton___pb_Da');
            if (buyButton && buyButton.querySelector('.title___Zkrpo')?.textContent === 'Buy Item') {
                // Wait a short moment for the DOM to update
                setTimeout(() => {
                    waitForElements('a.linkWrap___ZS6r9.flexCenter___bV1QP', processElements);
                }, 500); // Adjust timeout as needed
            }
        });
    }

    // Initialize button watching
    watchBuyButtons();
})();