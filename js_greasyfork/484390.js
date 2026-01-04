// ==UserScript==
// @name         Tribal Wars Resource Buyer (Multi-language)
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  Automate buying resources in Tribal Wars with premium points limit - works in all languages
// @author       ricardofauch (modified)
// @match        https://*.die-staemme.de/game.php?village=*&screen=market&mode=exchange
// @match        https://*.tribalwars.*/game.php?village=*&screen=market&mode=exchange
// @match        https://*.plemiona.pl/game.php?village=*&screen=market&mode=exchange
// @match        https://*.tribal-wars.*/game.php?village=*&screen=market&mode=exchange
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484390/Tribal%20Wars%20Resource%20Buyer%20%28Multi-language%29.user.js
// @updateURL https://update.greasyfork.org/scripts/484390/Tribal%20Wars%20Resource%20Buyer%20%28Multi-language%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default configuration
    const DEFAULT_CONFIG = {
        MAX_PREMIUM_POINTS: 300,
        PREMIUM_POINTS_TIMEOUT: 600000, // 10 minutes in ms
        PURCHASE_PERCENTAGE: 0.7,
        MIN_STOCK_THRESHOLD: 50,
        PAGE_RELOAD_INTERVAL: 10000, // 10 seconds in ms
        RANDOM_INTERVAL_MIN: 50,
        RANDOM_INTERVAL_MAX: 180,
        ENABLED: true
    };

    // Load configuration from storage or use defaults
    let config = Object.assign({}, DEFAULT_CONFIG, GM_getValue('buyerConfig', {}));

    let isReloadNeeded = false;
    let reloadInterval;

    // Create and inject configuration UI
    function createConfigUI() {
        const configDiv = document.createElement('div');
        configDiv.style.cssText = `
            position: fixed;
            top: 10%;
            left: 4%;
            background-color: rgba(240, 216, 176, 0.90);
            border: 1px solid #333;
            padding: 10px;
            z-index: 9999;
            max-width: 200px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        `;

        configDiv.innerHTML = `
            <h3 style="margin: 0 0 10px 0;">Resource Buyer Settings</h3>
            <div style="display: grid; gap: 5px;">
                <label>
                    <input type="checkbox" id="buyer-enabled" ${config.ENABLED ? 'checked' : ''}>
                    Enable Buyer
                </label>
                <label>
                    Max Premium Points:
                    <input type="number" id="max-premium" value="${config.MAX_PREMIUM_POINTS}" min="0">
                </label>
                <label>
                    Premium Points Timeout (min):
                    <input type="number" id="premium-timeout" value="${config.PREMIUM_POINTS_TIMEOUT / 60000}" min="1">
                </label>
                <label>
                    Purchase Percentage:
                    <input type="number" id="purchase-percentage" value="${config.PURCHASE_PERCENTAGE * 100}" min="1" max="100" step="1">
                </label>
                <label>
                    Min Stock Threshold:
                    <input type="number" id="min-stock" value="${config.MIN_STOCK_THRESHOLD}" min="1">
                </label>
                <label>
                    Page Reload Interval (sec):
                    <input type="number" id="reload-interval" value="${config.PAGE_RELOAD_INTERVAL / 1000}" min="1">
                </label>
                <label>
                    Random Interval Min (ms):
                    <input type="number" id="random-min" value="${config.RANDOM_INTERVAL_MIN}" min="0">
                </label>
                <label>
                    Random Interval Max (ms):
                    <input type="number" id="random-max" value="${config.RANDOM_INTERVAL_MAX}" min="0">
                </label>
                <button id="save-config" style="margin-top: 5px;">Save Settings</button>
                <div id="save-status" style="color: green; display: none;">Settings saved!</div>
            </div>
        `;

        document.body.appendChild(configDiv);

        // Add event listener for save button
        document.getElementById('save-config').addEventListener('click', saveConfig);

        document.getElementById('buyer-enabled').addEventListener('change', function(e) {
            config.ENABLED = e.target.checked;
            GM_setValue('buyerConfig', config);
            restartIntervals();

            // Show save confirmation
            const saveStatus = document.getElementById('save-status');
            saveStatus.style.display = 'block';
            saveStatus.textContent = config.ENABLED ? 'Buyer enabled!' : 'Buyer disabled!';
            setTimeout(() => {
                saveStatus.style.display = 'none';
            }, 2000);
});

    }

    function saveConfig() {
        config = {
            ENABLED: document.getElementById('buyer-enabled').checked,
            MAX_PREMIUM_POINTS: parseInt(document.getElementById('max-premium').value),
            PREMIUM_POINTS_TIMEOUT: parseInt(document.getElementById('premium-timeout').value) * 60000,
            PURCHASE_PERCENTAGE: parseInt(document.getElementById('purchase-percentage').value) / 100,
            MIN_STOCK_THRESHOLD: parseInt(document.getElementById('min-stock').value),
            PAGE_RELOAD_INTERVAL: parseInt(document.getElementById('reload-interval').value) * 1000,
            RANDOM_INTERVAL_MIN: parseInt(document.getElementById('random-min').value),
            RANDOM_INTERVAL_MAX: parseInt(document.getElementById('random-max').value)
        };

        GM_setValue('buyerConfig', config);

        // Show save confirmation
        const saveStatus = document.getElementById('save-status');
        saveStatus.style.display = 'block';
        setTimeout(() => {
            saveStatus.style.display = 'none';
        }, 2000);

        // Restart intervals with new config
        restartIntervals();
    }

    function restartIntervals() {
        // Clear existing intervals
        if (reloadInterval) clearInterval(reloadInterval);

        // Set up new intervals if enabled
        if (config.ENABLED) {
            console.log(`Setting up automatic reload every ${config.PAGE_RELOAD_INTERVAL/1000} seconds`);
            reloadInterval = setInterval(function() {
                console.log('Executing scheduled reload...');
                window.location.reload();
            }, config.PAGE_RELOAD_INTERVAL);
        }
    }

    function checkPremiumPoints() {
        console.log('Checking premium points...');
        const marketStatusBar = document.getElementById('market_status_bar');
        if (marketStatusBar) {
            const premiumIcon = marketStatusBar.querySelector('.icon.header.premium');
            if (premiumIcon) {
                const parentElement = premiumIcon.closest('th');
                if (parentElement) {
                    const text = parentElement.textContent;
                    const points = parseInt(text.replace(/\D/g, ''));
                    console.log(`Current premium points: ${points}`);
                    if (points > config.MAX_PREMIUM_POINTS) {
                        console.log(`⚠️ Premium points exceed ${config.MAX_PREMIUM_POINTS}! Setting timeout...`);
                        return new Promise(resolve => setTimeout(resolve, config.PREMIUM_POINTS_TIMEOUT));
                    }
                }
            }
        }
        return Promise.resolve();
    }

    function checkForUsageWarningAndReload() {
        console.log('Checking for usage warning...');
        const errorMessages = document.querySelectorAll('.error_box');
        for (const errorBox of errorMessages) {
            if (errorBox.textContent.includes('premium') ||
                errorBox.textContent.includes('börse') ||
                errorBox.textContent.includes('market') ||
                errorBox.textContent.includes('exchange')) {
                console.log("⚠️ Usage warning detected! Initiating page reload...");
                window.location.reload();
                return;
            }
        }
        console.log("✓ No usage warning found");
    }

    function checkForErrorAndReload() {
        console.log('Checking for error image...');
        const errorImages = document.querySelectorAll('.error_image, img[src*="error"]');

        if (errorImages.length > 0) {
            console.log("⚠️ Error image detected! Initiating reload...");
            window.location.reload();
        } else {
            console.log("✓ No error images found");
        }
    }

    function clickBuyButton() {
        console.log('Attempting to click buy button...');
        const buyButton = document.querySelector('.btn-premium-exchange-buy');
        if (buyButton) {
            console.log("✓ Found buy button. Clicking...");
            buyButton.click();
        } else {
            console.error("❌ Buy button not found!");
        }
    }

    function clickConfirmButton() {
        console.log('Starting confirmation dialog check...');
        let counter = 0;
        const checkDialog = setInterval(function() {
            const confirmDialog = document.querySelector('.confirmation-box');
            if (confirmDialog && confirmDialog.style.display !== 'none') {
                clearInterval(checkDialog);
                console.log("✓ Confirmation dialog detected");
                const confirmButton = document.querySelector('.btn-confirm-yes');

                if (confirmButton) {
                    console.log("✓ Found confirm button");

                    // Add click event listener before clicking
                    confirmButton.addEventListener('click', function() {
                        console.log("✓ Button click confirmed");
                        const randomIntervalReload = Math.random() * (65 - 50) + 420;
                        console.log(`Scheduling page reload in ${randomIntervalReload.toFixed(2)}ms`);
                        setTimeout(function() {
                            console.log('Executing scheduled reload...');
                            window.location.reload();
                        }, randomIntervalReload);
                    });

                    console.log("Clicking button...");
                    confirmButton.click();
                } else {
                    console.error("❌ Confirm button not found! Initiating fallback reload...");
                    window.location.reload();
                }
            }
        }, 20);
    }

    async function checkAndBuyResources() {
        if (!config.ENABLED) {
            console.log('Buyer is disabled in settings');
            return;
        }

        console.log('-----------------------------------');
        console.log('Starting resource check cycle...');

        await checkPremiumPoints();
        checkForUsageWarningAndReload();
        console.log(`Current reload flag status: ${isReloadNeeded}`);

        console.log(`Purchase percentage set to: ${config.PURCHASE_PERCENTAGE * 100}%`);
        const resources = ['wood', 'stone', 'iron'];
        let anyResourceAvailable = false;

        for (let i = 0; i < resources.length; i++) {
            const resource = resources[i];
            const stockElement = document.getElementById(`premium_exchange_stock_${resource}`);

            if (!stockElement) {
                console.error(`❌ Could not find stock element for ${resource}!`);
                continue;
            }

            const stock = parseInt(stockElement.innerText.replace(/\D/g, ''), 10);
            console.log(`📊 ${resource.toUpperCase()}: Current stock: ${stock}`);

            if (stock > config.MIN_STOCK_THRESHOLD) {
                anyResourceAvailable = true;
                const amountToBuy = Math.floor(stock * config.PURCHASE_PERCENTAGE);
                console.log(`✓ ${resource.toUpperCase()}: Sufficient stock available. Attempting to buy: ${amountToBuy}`);

                const buyInputField = document.querySelector(`input[name="buy_${resource}"]`);
                if (buyInputField) {
                    buyInputField.value = amountToBuy;
                    console.log(`✓ ${resource.toUpperCase()}: Set buy amount to ${amountToBuy}`);
                    isReloadNeeded = false;

                    const randomIntervalBuy = Math.random() * (config.RANDOM_INTERVAL_MAX - config.RANDOM_INTERVAL_MIN) + config.RANDOM_INTERVAL_MIN;
                    console.log(`Scheduling buy click in ${randomIntervalBuy.toFixed(2)}ms`);
                    setTimeout(function() {
                        console.log('Executing scheduled buy click...');
                        clickBuyButton();
                    }, randomIntervalBuy);

                    const randomIntervalConfirm = Math.random() * (65 - 50) + 50;
                    console.log(`Scheduling confirm click in ${randomIntervalConfirm.toFixed(2)}ms`);
                    setTimeout(function() {
                        console.log('Executing scheduled confirm click...');
                        clickConfirmButton();
                    }, randomIntervalConfirm);

                    break;
                } else {
                    console.error(`❌ ${resource.toUpperCase()}: Buy input field not found!`);
                }
            } else {
                console.log(`ℹ️ ${resource.toUpperCase()}: Insufficient stock (${stock} < ${config.MIN_STOCK_THRESHOLD})`);
            }
        }

        isReloadNeeded = !anyResourceAvailable;
        console.log(`Resource check complete. Reload needed: ${isReloadNeeded}`);

        if (isReloadNeeded) {
            const randomInterval = Math.random() * (4000 - 50) + 200;
            console.log(`No resources available. Scheduling reload in ${randomInterval.toFixed(2)}ms`);
            setTimeout(function() {
                console.log('Executing scheduled reload due to no resources...');
                window.location.reload();
            }, randomInterval);
        }
    }

    // Initialize UI and start script
    console.log('Script initialized. Version 1.4.0');
    createConfigUI();

    const randomIntervalCheck = Math.random() * (config.RANDOM_INTERVAL_MAX - config.RANDOM_INTERVAL_MIN) + config.RANDOM_INTERVAL_MIN;
    console.log(`Initial check scheduled in ${randomIntervalCheck.toFixed(2)}ms`);
    setTimeout(function() {
        console.log('Executing initial resource check...');
        checkAndBuyResources();
    }, randomIntervalCheck);

    restartIntervals();

})();