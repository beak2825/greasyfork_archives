// ==UserScript==
// @name        Bulk Steam Marketplace Item Seller
// @namespace   Violentmonkey Scripts
// @match       https://steamcommunity.com/id/*/inventory/*
// @grant       none
// @version     1.0
// @author      Zarobi
// @license     MIT
// @description Automate selling loads of steam items without getting repetitive strain injuries
// @downloadURL https://update.greasyfork.org/scripts/489058/Bulk%20Steam%20Marketplace%20Item%20Seller.user.js
// @updateURL https://update.greasyfork.org/scripts/489058/Bulk%20Steam%20Marketplace%20Item%20Seller.meta.js
// ==/UserScript==
async function BulkCardSeller() {
    const retry_delay_ms = 1000;
    const page_size = 2000;

    /** Whether to apply the fees to the price or not */
    let use_buyer_price = (localStorage.getItem('BulkCardSeller_use_buyer_price') ?? 'false') === 'true';

    /** If we want to wait for steam confirmation for each item that needs it */
    let wait_approval = (localStorage.getItem('BulkCardSeller_wait_approval') ?? 'false') === 'true';

    /** If we want to wait for steam confirmation for each item that needs it */
    let wait_sell = (localStorage.getItem('BulkCardSeller_wait_sell') ?? 'true') === 'true';

    /** @type {'lowest'|'highest'|'80%'|'median'|'mean'|'nosale'|'custom'} */
    let default_price_mode = localStorage.getItem('BulkCardSeller_default_price_mode') ?? '80%';

    /** How many days to look back for price estimates */
    let days_to_scan = Number.parseInt(localStorage.getItem('BulkCardSeller_days_to_scan') ?? '90');
    let date_start = new Date() - (days_to_scan * 8.64e+7);

    /**
     * @param {string} context 
     * @returns {Promise<object[]>}
     */
    const getCardListForContext = async (context) => {
        // For some reason this one always fails with 404
        if (context === APPWIDE_CONTEXT) {
            return [];
        }

        const response = await fetch(`https://steamcommunity.com/inventory/${ g_steamID }/${ UserYou.nActiveAppId }/${ context }?l=english&count=${page_size}`);

        // Too many requests, retry after a bit
        if (!response.ok) {
            try {
                if ((await response.json()).error === 'The request is a duplicate and the action has already occurred in the past, ignored this time (29)') {
                    await new Promise(resolve => window.setTimeout(() => resolve(0), retry_delay_ms));
                    return await getCardListForContext(context);
                }
            } catch {}
            return [];
        }

        const result = await response.json();
        const descriptions = result.descriptions.filter(d => d.marketable);
        for (let ele of descriptions) {
            const a = result.assets.find(ele2 =>
                (ele2.classid === ele.classid)
                && (ele2.instanceid === ele.instanceid)
            );

            ele.assetid ??= a.assetid;
            ele.contextid ??= a.contextid;
        }

        return descriptions;
    };

    /**
     * Get a list of all the cards
     * @returns {Promise<object[]>}
     */
    const getCardList = async () => {
        const contexts = UserYou.GetContextIdsForApp(UserYou.nActiveAppId);
        const returning = [];
        for (let context of contexts) {
            const descriptions = await getCardListForContext(context);
            returning.push(...descriptions);
        }

        return returning;
    };

    /**
     * Use the API to get the price
     * @param {string} market_hash_name
     * @returns {Promise<{ lowest: number; highest: number; 80%: number; median: number; mean: number; }>}
     */
    const estimatePrice = async (market_hash_name) => {
        const response = await fetch(`https://steamcommunity.com/market/pricehistory/?appid=${ UserYou.nActiveAppId }&market_hash_name=${ encodeURIComponent(market_hash_name) }`);

        // Too many requests, retry after a bit
        if (!response.ok && (response.status === 429)) {
            await new Promise(resolve => setTimeout(() => resolve(0), retry_delay_ms));
            return await estimatePrice(market_hash_name);
        }

        const result = await response.json();

        /** @type {number[]} */
        const prices = result.prices.filter(ele => new Date(ele[0] >= date_start)).map(ele => ele[1]).sort();
        return {
            lowest: Math.min(...prices),
            highest: Math.max(...prices),
            '80%': prices[Math.round(prices.length * 0.8)],
            median: prices[Math.round(prices.length / 2)],
            mean: prices.reduce((acc, ele) => acc + ele, 0) / prices.length,
            custom: 0,
            nosale: 0,
        };
    };

    /**
     * @param {string} assetid 
     * @param {string} contextid
     * @param {number} price 
     */
    const sellItem = async (assetid, contextid, price) => {
        const fd = new FormData();
        fd.set('sessionid', g_sessionID);
        fd.set('appid', UserYou.nActiveAppId);
        fd.set('contextid', contextid);
        fd.set('assetid', assetid);
        fd.set('amount', '1');
        fd.set('price', price.toString());

        // There doesn't seem to be any rate limiting currently on this API, but it only allows 1 active request at a time
        const requestURL = 'https://steamcommunity.com/market/sellitem/';
        let response = await fetch(requestURL, { method: 'POST', body: fd });

        // Try again 1 time
        if (!response.ok) {
            response = await fetch(requestURL, { method: 'POST', body: fd });
        }

        return await response.json();
    }
    
    /**
     * Display a UI so we can choose which cards to sell
     * @param {object[] cardList}
     * @returns {Promise<object[]>}
     */
    const createBulkSellerDialog = (cardList) => {
        // Create parent element and CSS
        const dialogEle = Object.assign(document.createElement('dialog'), { id: 'BulkSellerDialog' });
        const styleEle = document.createElement('style');
        styleEle.innerText = `
        #BulkSellerDialog {
            height: 80%;
            width: 80%;
            overflow: auto;
            position: relative;
            padding: 0;
        }

        #BulkSellerDialog input,
        #BulkSellerDialog select {
            all: revert;
        }

        #BulkSellerDialog details {
            white-space: pre-wrap;
            text-align: left;
        }

        #BulkSellerDialog input[type="number"] {
            width: 5em;
        }

        #BulkSellerDialog header {
            padding: 1em;
            text-align: center;
        }

        #BulkSellerDialog blockquote {
            text-align: left;
        }

        #BulkSellerDialog ul {
            display: flex;
            flex-wrap: wrap;
            gap: 1em;
        }

        #BulkSellerDialog li {
            list-style: none;
            flex: 0;
            width: 10em;
            flex: 0 0 10em;
        }

        #BulkSellerDialog label {
            display: block;
        }

        #BulkSellerDialog img {
            height: 10em;
            max-width: 100%;
            object-fit: contain;
            pointer-events: none;
        }

        #BulkSellerDialog input:checked ~ img {
            outline: 0.25em solid red;
        }

        #BulkSellerDialog footer {
            position: sticky;
            bottom: 0;
            height: 2em;
            padding: 1em;
            gap: 1em;
            text-align: center;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        `;

        dialogEle.appendChild(styleEle);

        // Instruction manual
        const headerEle = document.createElement('header');
        const guideEle = document.createElement('details');
        const guideSummaryEle = document.createElement('summary');
        guideSummaryEle.innerText = 'INSTRUCTIONS (read at least once)';
        guideEle.appendChild(guideSummaryEle);
        guideEle.append(`
        Do you have too many Steam cards burning in your pocket? Use this tool to sell dozens at a time, with detailed customisation on the rules used for pricing based on the current market. This is all written to use Steam's own API as if you were clicking the buttons yourself, which does mean it will probably break at some point and I'll forget to update it. The code is extremely quick and dirty as I have a full time job so feel completely free to improve upon it.
        
        # Instructions
        1. Select which items to sell.
        2. Once you click "Estimate" it will calculate based on configuration the prices for each item.
        3. (optional) Choose custom amounts for individual items.
        4. Click Submit, and wait until the progress bar finishes, then approve any confirmations in your Steam authentication app.
        
        # Caveats
        * I haven't tested on currencies other than AUD so maybe try selling 1 item as a test first.
        * Sometimes Steam gets confused if you have multiple items needing confirmation at once and the listing will fail - not my fault.
        * Untick the "reliability" boxes if you want faster but less reliable listings.
        * Note that the Steam API is buggy and sometimes items may just fail to be listed.
        * API limitations restrict the tool to up to 2000 items.
        * There are API limits on how many items can be sold per day / per week / per month. I don't know what this number is, but I did hit it a few times when using this tool. Keep this in mind that you may be temporarily blocked from listing items at some point.
        
        # Recommended settings
        * 80% (median at 80th percentile) gives great value, but may take slightly longer to sell items. Another great option is Median for quick sale at "market rate".
        * As of March 2024, Steam seems to require the "sell items 1 by 1" reliability setting, but the confirmations can be done in bulk.
        `);
        headerEle.appendChild(guideEle);

        // Configuration settings
        const waitApprovalParent = document.createElement('label');
        waitApprovalParent.appendChild(Object.assign(document.createElement('input'), {
            type: 'checkbox',
            checked: wait_approval,
            onchange: () => {
                wait_approval = !wait_approval;
                localStorage.setItem('BulkCardSeller_wait_approval', wait_approval);
            },
        }));
        waitApprovalParent.append('Wait for confirmation 1 by 1 (more reliable but slower)');

        const waitSellParent = document.createElement('label');
        waitSellParent.appendChild(Object.assign(document.createElement('input'), {
            type: 'checkbox',
            checked: wait_sell,
            onchange: () => {
                wait_sell = !wait_sell;
                localStorage.setItem('BulkCardSeller_wait_sell', wait_sell);
            },
        }));
        waitSellParent.append('Sell items 1 by 1 (more reliable but slower)');

        const useBuyerPriceParent = document.createElement('label');
        useBuyerPriceParent.appendChild(Object.assign(document.createElement('input'), {
            type: 'checkbox',
            checked: use_buyer_price,
            onchange: () => {
                use_buyer_price = !use_buyer_price;
                localStorage.setItem('BulkCardSeller_use_buyer_price', use_buyer_price);
            },
        }));
        useBuyerPriceParent.append('Use buyer price (including fees)');

        const daysToScanParent = document.createElement('label');
        daysToScanParent.appendChild(Object.assign(document.createElement('input'), {
            type: 'number',
            value: days_to_scan,
            min: 1,
            onchange: (event) => {
                days_to_scan = event.target.value;
                date_start = new Date() - (days_to_scan * 8.64e+7);
                localStorage.setItem('BulkCardSeller_days_to_scan', days_to_scan);
            }
        }));
        daysToScanParent.append('Max days to search for estimate');

        const priceModeParent = document.createElement('label');
        const priceMode = Object.assign(document.createElement('select'), {
            onchange: (event) => {
                default_price_mode = event.target.value;
                localStorage.setItem('BulkCardSeller_default_price_mode', default_price_mode);
            }
        })
        for (let ele of ['lowest','highest','80%','median','mean','nosale','custom']) {
            const eleE = document.createElement('option');
            eleE.value = eleE.innerText = ele;
            eleE.selected = ele === default_price_mode;
            priceMode.appendChild(eleE);
        }
        priceModeParent.appendChild(priceMode);
        priceModeParent.append('Default price mode');

        const configEle = document.createElement('details');
        const configSummaryEle = document.createElement('summary');
        configSummaryEle.innerText = 'Settings';
        configEle.appendChild(configSummaryEle);
        configEle.appendChild(waitApprovalParent);
        configEle.appendChild(waitSellParent);
        configEle.appendChild(useBuyerPriceParent);
        configEle.appendChild(daysToScanParent);
        configEle.appendChild(priceModeParent);
        headerEle.appendChild(configEle);
        dialogEle.appendChild(headerEle);

        const listEle = document.createElement('ul');
        dialogEle.appendChild(listEle);

        // Create the list of "checkbox" card selectors
        for (let card of cardList) {
            const li = document.createElement('li');
            const cardParent = document.createElement('label');

            cardParent.appendChild(Object.assign(document.createElement('input'), {
                type: 'checkbox',
                card: card,
            }));

            cardParent.appendChild(Object.assign(document.createElement('img'), {
                src: `https://community.akamai.steamstatic.com/economy/image/${card.icon_url}`,
                loading: 'lazy',
            }));
            
            const nameEle = document.createElement('p');
            nameEle.innerText = card.name;
            cardParent.appendChild(nameEle);

            li.appendChild(cardParent);
            listEle.appendChild(li);
        }

        // Create the buttons and their functions
        return new Promise((resolve, reject) => {
            const toggleAllButton = Object.assign(document.createElement('button'), {
                type: 'button',
                onclick: () => {
                    const cbs = [ ...dialogEle.querySelectorAll('ul input[type="checkbox"]') ];
                    const newChecked = !cbs.every(ele => ele.checked);
                    for (let ele of cbs) {
                        ele.checked = newChecked;
                    }
                }
            });

            const cancelButton = Object.assign(document.createElement('button'), {
                type: 'button',
                onclick: () => {
                    document.body.removeChild(dialogEle);
                    reject();
                }
            });

            const okButton = Object.assign(document.createElement('button'), {
                type: 'button',
                onclick: async () => {
                    // Get the selections and disable the buttons
                    [ ...dialogEle.querySelectorAll('ul input[type="checkbox"]') ].forEach(ele => ele.disabled = ele.readOnly = true);
                    toggleAllButton.disabled = true;
                    okButton.disabled = true;

                    // Calculate the estimates for each card
                    const selectedCards = [ ...dialogEle.querySelectorAll('ul input[type="checkbox"]:checked') ];
                    for (let ele of selectedCards) {
                        const card = ele.card;
                        card.estimate = await estimatePrice(GetMarketHashName(card));
                        card.selected_estimate = default_price_mode;
                        card.estimate_cents = {};

                        // Create 1 radio button for each type of price
                        for (let key in card.estimate) {
                            card.estimate_cents[key] = GetPriceValueAsInt(card.estimate[key].toFixed(2));
                            const priceEleLabel = document.createElement('label');
                            const priceEle = Object.assign(document.createElement('input'), {
                                type: 'radio',
                                name: `${card.assetid}_${card.contextid}_price`,
                                value: key,
                                checked: key === card.selected_estimate,
                                onchange: () => card.selected_estimate = key,
                            });

                            priceEleLabel.appendChild(priceEle);
                            priceEleLabel.append(`${key}: ${v_currencyformat(card.estimate_cents[key], GetCurrencyCode(g_rgWalletInfo['wallet_currency']))}`);

                            // Add a "custom" button
                            if (key === 'custom') {
                                priceEleLabel.appendChild(Object.assign(document.createElement('input'), {
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    onchange: (event) => {
                                        card.estimate.custom = event.target.value;
                                        card.estimate_cents.custom = GetPriceValueAsInt(event.target.value.toFixed(2));
                                    }
                                }));
                            }

                            ele.parentElement.appendChild(priceEleLabel);
                        }
                    }
                    
                    // Re enable the UI after finished estimating
                    setTimeout(() => {
                        alert('finished estimating');
                        okButton.disabled = false;
                        okButton.textContent = 'Sell selected items';
                        okButton.onclick = () => {
                            document.body.removeChild(dialogEle);
                            const selectedCards = [ ...dialogEle.querySelectorAll('ul input[type="checkbox"]:checked') ];
                            resolve(selectedCards.map(ele => ele.card));
                        };
                    }, 50);
                }
            });

            toggleAllButton.innerText = 'Toggle All';
            cancelButton.innerText = 'Cancel';
            okButton.innerText = 'Estimate';
    
            const footerEle = document.createElement('footer');
            footerEle.appendChild(cancelButton);
            footerEle.appendChild(okButton);
            footerEle.appendChild(toggleAllButton);
            dialogEle.appendChild(footerEle);

            document.body.appendChild(dialogEle);
            dialogEle.showModal();
        });
    };

    // Main function
    const run = async () => {
        // Get card list
        const cardList = await getCardList();
        if (!cardList.length) {
            alert('No items to sell!');
            return;
        }
    
        // Wait for user to finish interacting with UI
        const selectedCardList = await createBulkSellerDialog(cardList);

        // Create a progress bar for user feedback
        const cardProgress = Object.assign(document.createElement('progress'), {
            min: 0,
            max: selectedCardList.length,
            value: 0,
            style: `position: fixed; left: 50%; top: 50%; width: 10em; height: 2em;`,
        });
        document.body.appendChild(cardProgress);

        // Sell each card 1 by 1
        let some_failures = false;
        let requires_confirmation = false;
        const sellCard_Inner = async (card) => {
            if (card.selected_estimate === 'nosale') {
                return;
            }

            let price_cents = card.estimate_cents[card.selected_estimate];
            if (price_cents <= 0) {
                return;
            }

            // Subtract fees if we enabled that option
            if (use_buyer_price) {
                const fees = CalculateAmountToSendForDesiredReceivedAmount(price_cents, card.market_fee ?? g_rgWalletInfo['wallet_publisher_fee_percent_default']);
                price_cents -= fees.fees;
            }

            if (price_cents <= 0) {
                return;
            }

            // Sell the item
            const result = await sellItem(card.assetid, card.contextid, price_cents);
            if (result.requires_confirmation) {
                if (wait_approval && result.requires_confirmation) {
                    alert('Item needs mobile confirmation - click OK when you have done this')
                }
                else {
                    requires_confirmation ||= result.requires_confirmation;
                }
            }
            
            some_failures ||= !result.success;
            cardProgress.value++;
        };

        // Different functionality if we want to await each call (sell 1 by 1) or spam their servers
        if (wait_sell) {
            for (let card of selectedCardList) {
                await sellCard_Inner(card);
            }
        }
        else {
            await Promise.all(selectedCardList.map(sellCard_Inner));
        }

        cardProgress.remove();

        // Display alert to user when finished
        let alerts = ['Finished selling items'];
        if (some_failures) {
            alerts.push('* Some items failed to be listed');
        }
        else if (requires_confirmation) {
            alerts.push('* Some items need mobile confirmation');
        }

        alert(alerts.join('\n'));
    };

    return await run();
};

BulkCardSeller();