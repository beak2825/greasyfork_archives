// ==UserScript==
// @name         Doobie's Stock Days Remaining Company Script
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Calculate and displays the remaining days you have left for company stock
// @author       Doobiesuckin
// @match        https://www.torn.com/companies.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541384/Doobie%27s%20Stock%20Days%20Remaining%20Company%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/541384/Doobie%27s%20Stock%20Days%20Remaining%20Company%20Script.meta.js
// ==/UserScript==

//::::::::::-+#@@@@@@@@#::::::::::::::::::::+@@@@@*::::::::::::::=--:::::::::::::::::::::
//:::::::#@@%-:::::::::-@+:::::::::::::::::#@-::-@*::%@@@@:::::::+::=+:::::::::::::::::::
//::::=@%=:::-+%@@@@#:::%@::=+=:::::::::::*@-::#@-::%@::=@=:::::--=:-::-:::::::::::::::::
//:::@@:::-@@@-:%@@@@:::@@@@+-%@::*@@@@@+*@-::@@@@:@@@-#@@@@@@@-:--::::=:=:::::::::::::::
//::@%::-@@@+::+@@@@+::@*:::-::@@@=::::+@@::-+:::@@*:::@@+::::#@:=::::::=::::::::::::::::
//:-@-:-@@@::+@@@@@+::%-:::#%:=@=:::@*:*@-:::-:::@+::=@+::-%#:*@-=-::::::=:::::::::::::::
//::%@=:::::#@@@@@-::%:::::@-:%:::::@::@-::-@#::++::*@:::%@=:=@+::*-:::--::::::::::::::::
//:::-#@@::#@@@@@:::%+::@-:-:*-::%::::#-::*@#::--::*@-::@+::#@%@::+-:::-:::::::::::::::::
//::::=@=:-@@@*::::-=::#@%::::::*@#::::::#@=::::::+@*:::::*@@:%%::+=::::-::::::::::::::::
//::::+@-=+:--:::*@+#::-::-@@@:::::=@+::::::::*-::=::::@@@#-:@@:::+=::::+::::::::::::::::
//::::@@::#::::=@@::*+:::@@=-@%::+@@@*:-+::-@@@::::#@::::::%@*::::+=::::+-:::::::::::::::
//:::@+::::::#@@%:::=@@@#-::::+@@@@@@@@@@%%*::+@@@@@%@@@@@#=:::--:+=::::-==::::::::::::::
//:::@@:::%@@=*@::::=@=:::::%@@@@@-::::#@::::::::::::::::::::#@=+@::::::-%--=::::::::::::
//:#%:=%%::+@#@+::::=@--*@@#--@@%:::::::%#::::::::::::::::::#@::*@:::-=-%=##=-:::::::::::
//:+@@=+@-:::@@:::::*@@@-:::-@@@#::+@%:-@@@@-:%@@=::*@@@@#:-@::+@@@@%-:%@@#%@@@+%@@%-::::
//:-@*@@@%:::-%::::-@+:::::+@@@@@+::@@@@@::%%@=:*@%@-::::+@@=:-@#:::=@@+:=@@*:**:::-@::::
//::*@--#@+::-=::::+::::::%@@-:-@@+::@%@::-@@*::@@*::*%:::@%::%*::::#@*::@@#:::::::-@--::
//:::%@-::::#*@-:%#+:::-@@@@:::#@@%:::@+::%@#::=@@::-@@-=@@::::::@@@@#::-@@-::*@@::#@%+@-
//::::+@#:::*%=:::**-=***++=::::::::::@:::::::::::::::+*+:::::@-:::::::::::::-@@-:::::@*:
//::::::+@@#:=+-@@-:::::::#@:::::::::*@::::==::::%-::::::=+:::@*:::::=::::-::=@@:::::@*::
//::-@@@%+:::+*+::+###@@@@:=@*:::::-@%%%+*@@@++#@*@%+++%@%@*+@#@#+*@@@*+#@@++@#@%++%@-:::
//:::::-%@@@@%+@@-:-@@@@+::::-%@@@@+:::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::::::::*@#@*:*%@@@*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Made with Love by Doobiesuckin [3255641] | Check out my Other Scripts! o7

(function() {
    'use strict';

    function addDaysLeftColumn() {
        const stockWrap = document.querySelector('.stock-list-wrap');
        if (!stockWrap) return;

        const headerList = stockWrap.querySelector('.stock-list-title');
        if (headerList) {
            const deliveryHeader = headerList.querySelector('.delivery');
            if (deliveryHeader && !deliveryHeader.textContent.includes('Days Left')) {
                deliveryHeader.innerHTML = 'Days Left<div class="t-delimiter"></div>';
            }
        }

        const pendingOrders = {};
        let orderListWrap = document.querySelector('.order-list-wrap');
        if (!orderListWrap) {
            orderListWrap = document.querySelector('[class*="order"]');
        }

        if (orderListWrap) {
            let orderItems = orderListWrap.querySelectorAll('.order-list li');
            if (orderItems.length === 0) {
                orderItems = orderListWrap.querySelectorAll('li');
            }

            orderItems.forEach((item, index) => {
                const nameDiv = item.querySelector('.name') || item.querySelector('[class*="name"]');
                const amountDiv = item.querySelector('.amount') || item.querySelector('[class*="amount"]');
                const statusDiv = item.querySelector('.status') || item.querySelector('[class*="status"]') || item.querySelector('[class*="delivered"]');

                if (nameDiv && amountDiv && statusDiv) {
                    const itemName = nameDiv.textContent.trim();
                    const amount = parseInt(amountDiv.textContent.replace(/,/g, '')) || 0;
                    const status = statusDiv.textContent.trim();

                    const isPending = status !== 'Delivered' &&
                                    !status.toLowerCase().includes('delivered') &&
                                    (status.includes(':') || status.match(/\d+:\d+/));

                    if (isPending) {
                        if (!pendingOrders[itemName]) {
                            pendingOrders[itemName] = 0;
                        }
                        pendingOrders[itemName] += amount;
                    }
                }
            });
        }

        const stockList = stockWrap.querySelector('.stock-list.fm-list');
        if (!stockList) return;

        const stockItems = stockList.querySelectorAll('li:not(.total):not(.quantity)');
        let processed = 0;

        stockItems.forEach((item, index) => {
            try {
                const existingBadges = item.querySelectorAll('.days-left-badge');
                existingBadges.forEach(badge => badge.remove());

                const nameDiv = item.querySelector('.name');
                if (!nameDiv) return;

                const itemName = nameDiv.textContent.trim();
                const accBody = item.querySelector('.acc-body');
                if (!accBody) return;

                const stockDiv = accBody.querySelector('.stock');
                const soldDailyDiv = accBody.querySelector('.sold-daily');
                if (!stockDiv || !soldDailyDiv) return;

                const currentStock = parseInt(stockDiv.textContent.replace(/[^0-9]/g, '')) || 0;
                const dailySales = parseInt(soldDailyDiv.textContent.replace(/[^0-9]/g, '')) || 0;

                let displayText = 'N/A';
                let backgroundColor = '#666';
                let textColor = '#fff';

                if (dailySales > 0) {
                    const currentDays = currentStock / dailySales;
                    const pendingAmount = pendingOrders[itemName] || 0;

                    let pendingText = '';
                    if (pendingAmount > 0) {
                        const additionalDays = pendingAmount / dailySales;
                        pendingText = ` (+${additionalDays.toFixed(2)})`;
                    }

                    displayText = currentDays.toFixed(2) + pendingText;

                    if (currentDays < 0.5) {
                        backgroundColor = '#8B0000';
                    } else if (currentDays < 1) {
                        backgroundColor = '#FF0000';
                    } else if (currentDays < 2) {
                        backgroundColor = '#FF4500';
                    } else if (currentDays < 3) {
                        backgroundColor = '#FFD700';
                        textColor = '#000';
                    } else {
                        backgroundColor = '#228B22';
                    }
                }

                const deliveryDiv = accBody.querySelector('.delivery');
                if (deliveryDiv) {
                    deliveryDiv.innerHTML = `
                        <span class="bold t-show">Days Left:</span>
                        <div style="margin-top: 2px;">
                            <span class="days-left-badge" style="
                                background-color: ${backgroundColor};
                                color: ${textColor};
                                padding: 2px 4px;
                                border-radius: 3px;
                                font-weight: bold;
                                display: inline-block;
                                min-width: 30px;
                                text-align: center;
                                font-size: 9px;
                                line-height: 1.2;
                                white-space: nowrap;
                            ">${displayText}</span>
                        </div>
                    `;
                } else {
                    const badge = document.createElement('span');
                    badge.className = 'days-left-badge';
                    badge.textContent = displayText;
                    badge.style.cssText = `
                        background-color: ${backgroundColor};
                        color: ${textColor};
                        padding: 1px 4px;
                        border-radius: 8px;
                        font-size: 10px;
                        font-weight: bold;
                        margin-left: 8px;
                        display: inline-block;
                        min-width: 28px;
                        text-align: center;
                        vertical-align: middle;
                        white-space: nowrap;
                    `;
                    nameDiv.appendChild(badge);
                }
                processed++;
            } catch (error) {
                console.error(`Error processing item ${index}:`, error);
            }
        });
    }

    function initializeScript() {
        if (window.location.href.includes('companies.php')) {
            setTimeout(() => {
                addDaysLeftColumn();
            }, 2000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(initializeScript, 2000);
        }
    }).observe(document, {subtree: true, childList: true});

    window.tornStockCalculator = addDaysLeftColumn;
})();