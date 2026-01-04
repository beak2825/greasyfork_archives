// ==UserScript==
// @name         aquagloop auction house to sheet 
// @author       aquagloop
// @match        https://www.torn.com/amarket.php*
// @namespace    https://github.com/RyuFive/TornScripts/raw/main/Auction%20Names.user.js
// @version      1.5
// @description  Scrapes auction data and sends it the google sheet.
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @connect      script.google.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544625/aquagloop%20auction%20house%20to%20sheet.user.js
// @updateURL https://update.greasyfork.org/scripts/544625/aquagloop%20auction%20house%20to%20sheet.meta.js
// ==/UserScript==

function waitForKeyElements (
    selectorTxt,/* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce, /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis= $(this);
            var alreadyFound = jThis.data ('alreadyFound') || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound= false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements ( selectorTxt,
                                         actionFunction,
                                         bWaitOnce,
                                         iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}


(function () {
    'use strict';

    const SCRIPT_PREFIX = '[aquagloop auction scraper]';
    const STORAGE_KEY = 'torn_api_key';
    const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwzp-zABtZ7ar1K0z_4EsRdOCHrYJdX0ewG1MoF9_X5FwaLA3TIodAyM1K9ACMOE2M/exec';
    let processedPageStarts = [];

    function log(message, ...args) { console.log(`${SCRIPT_PREFIX} ${message}`, ...args); }
    function error(message, ...args) { console.error(`${SCRIPT_PREFIX} ${message}`, ...args); }

    function getApiKey() {
        let key = localStorage.getItem(STORAGE_KEY);
        if (!key) {
            key = prompt("Enter your Torn API Key:");
            if (key) {
                localStorage.setItem(STORAGE_KEY, key);
            } else {
                alert("No API key entered. The script will not run.");
            }
        }
        return key;
    }

    function getUrlParameterFromHash(parameter) {
        const hash = window.location.hash;
        const urlParams = new URLSearchParams(hash.substring(hash.indexOf('?')));
        return urlParams.get(parameter);
    }

    function sendDataToGoogleSheet(data) {
        if (GOOGLE_SHEET_WEB_APP_URL === 'YOUR_WEB_APP_URL_HERE') {
            error("Please update the Google Sheet URL in the script.");
            return;
        }
        log('Data being sent to Google Sheet:', data);
        GM_xmlhttpRequest({
            method: 'POST',
            url: GOOGLE_SHEET_WEB_APP_URL,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(data),
            onload: function (response) {
                log('Google Sheets request finished. Status:', response.status, response.responseText);
            },
            onerror: function (response) {
                error('FATAL ERROR: Could not connect to Google Sheets URL.', response);
            }
        });
    }

    function fetchItemDetails(itemUID, apiKey) {
        return new Promise((resolve) => {
            const apiUrl = `https://api.torn.com/torn/${itemUID}?selections=itemdetails&key=${apiKey}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: function (response) {
                    try {
                        const json = JSON.parse(response.responseText);
                        if (json.error) {
                            error(`Torn API Error for UID ${itemUID}:`, json.error.error);
                            resolve(null);
                        } else {
                            resolve(json.itemdetails);
                        }
                    } catch (e) {
                        error(`Failed to parse API response for UID ${itemUID}:`, e, response.responseText);
                        resolve(null);
                    }
                },
                onerror: function (response) {
                    error(`Network error fetching details for UID ${itemUID}:`, response);
                    resolve(null);
                }
            });
        });
    }

    async function parseAuctionItems() {
        const startValue = getUrlParameterFromHash('start');
        if (startValue === null || processedPageStarts.includes(startValue)) return;
        processedPageStarts.push(startValue);
        log("Parsing auction items from start value:", startValue);

        const apiKey = getApiKey();
        if (!apiKey) return;

        const liElements = document.querySelectorAll('div.items-list-wrap > ul.items-list > li[id]');
        const promises = [];

        liElements.forEach((liElement) => {
            if (liElement.dataset.processed) return;
            liElement.dataset.processed = 'true';

            const itemHoverElement = liElement.querySelector('span.item-hover');
            const itemUID = itemHoverElement ? itemHoverElement.getAttribute('armoury') : null;
            const priceElement = liElement.querySelector('div.c-bid-wrap');
            const itemPrice = priceElement ? priceElement.textContent.trim().replace(/[^0-9]/g, '') : null;

            const sellerWrapDiv = liElement.querySelector('div.seller-wrap');
            let sellerID = null;
            let highBidderName = 'N/A';
            let highBidderID = 'N/A';
            if (sellerWrapDiv) {
                const sellerLink = sellerWrapDiv.querySelector('div.name a[href*="profiles.php?XID="]');
                sellerID = sellerLink ? sellerLink.getAttribute('href').split('profiles.php?XID=')[1] : null;

                const highBidderLink = sellerWrapDiv.querySelector('div.namehight a[href*="profiles.php?XID="]');
                if (highBidderLink) {
                    highBidderName = highBidderLink.textContent.trim();
                    highBidderID = highBidderLink.getAttribute('href').split('profiles.php?XID=')[1];
                }
            }

            const timeWrapDiv = liElement.querySelector('div.time-wrap > span[title]');
            const auctionEnds = timeWrapDiv ? timeWrapDiv.getAttribute('title') : 'N/A';

            if (itemUID && itemPrice) {
                liElement.style.border = "1px solid orange";
                const promise = fetchItemDetails(itemUID, apiKey).then(details => {
                    if (!details) {
                        liElement.style.border = "1px solid red";
                        return null;
                    }
                    liElement.style.border = "1px solid limegreen";
                    const bonuses = Object.values(details.bonuses || {});
                    const defenseValue = details.armor ?? details.defense;

                    return {
                        Timestamp: new Date().toISOString(),
                        ItemUUID: itemUID,
                        SellerID: sellerID,
                        ItemPrice: itemPrice,
                        ItemName: details.name || 'N/A',
                        Color: details.rarity || 'N/A',
                        Quality: typeof details.quality === 'number' ? details.quality.toFixed(2) : 'N/A',
                        Damage: typeof details.damage === 'number' ? details.damage.toFixed(2) : 'N/A',
                        Accuracy: typeof details.accuracy === 'number' ? details.accuracy.toFixed(2) : 'N/A',
                        Defense: typeof defenseValue === 'number' ? defenseValue.toFixed(2) : 'N/A',
                        Bonus1Name: bonuses.length > 0 ? bonuses[0].bonus : '',
                        Bonus1Value: bonuses.length > 0 ? bonuses[0].value : '',
                        Bonus2Name: bonuses.length > 1 ? bonuses[1].bonus : '',
                        Bonus2Value: bonuses.length > 1 ? bonuses[1].value : '',
                        AuctionEnds: auctionEnds,
                        HighBidderName: highBidderName,
                        HighBidderID: highBidderID
                    };
                });
                promises.push(promise);
            }
        });

        if (promises.length > 0) {
            const results = await Promise.all(promises);
            const finalData = results.filter(item => item !== null);
            if (finalData.length > 0) {
                log(`Assembled ${finalData.length} valid items. Preparing to send.`);
                sendDataToGoogleSheet(finalData);
            }
        }
    }

    waitForKeyElements(".item-cont-wrap", parseAuctionItems, false);
})();