// ==UserScript==
// @name         Auction Sheet Adder
// @namespace    http://tampermonkey.net/
// @version      1.0.11
// @description  Sends stuff to sheets
// @author       leonissenbaum
// @match        https://www.torn.com/amarket.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @connect      script.google.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/541695/Auction%20Sheet%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/541695/Auction%20Sheet%20Adder.meta.js
// ==/UserScript==
(function () {
    'use strict';

    //feel free to edit this if you want, if you're on tornPDA it's needed, if you aren't you don't need to edit this since you can change it via the tampermonkey menu, but it's fine either wey
    const DEFAULT_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwVjUH-CwfRTvuo_ld7smJigRIDJ7iuVtmgvHZuiMDrXkNdNZoJ3emN16Cn8lKmm-o_/exec'
    const API_KEY_INSERT_HERE = 'Insert key here'

    const isTornPDA = window.navigator.userAgent.includes("com.manuito.tornpda")

    let SHEET_ENDPOINT = DEFAULT_SHEET_ENDPOINT
    let API_KEY = ''

    if (!isTornPDA) {

        SHEET_ENDPOINT = GM_getValue('Auction_Sheet_Endpoint_LS', DEFAULT_SHEET_ENDPOINT);

        API_KEY = GM_getValue('Auction_Sheet_API_KEY', API_KEY_INSERT_HERE);

        // Register menu commands
        GM_registerMenuCommand('Set Sheet Endpoint', () => {
            const endpoint = prompt('Enter your sheet endpoint:', GM_getValue(DEFAULT_SHEET_ENDPOINT));
            if (endpoint !== null) {
                GM_setValue('Auction_Sheet_Endpoint_LS', endpoint);
                SHEET_ENDPOINT = GM_getValue('Auction_Sheet_Endpoint_LS', DEFAULT_SHEET_ENDPOINT);
            }
        });

        // Register menu commands
        GM_registerMenuCommand('Set API Key', () => {
            const endpoint = prompt('Enter your public key:', GM_getValue(API_KEY_INSERT_HERE));
            if (endpoint !== null) {
                GM_setValue('Auction_Sheet_API_KEY', endpoint);
                SHEET_ENDPOINT = GM_getValue('Auction_Sheet_API_KEY', API_KEY_INSERT_HERE);
            }
        });

    }

    const itemQualities = new Map()

    function addButtons() {
        document.querySelectorAll('div.confirm.p10').forEach((panel, i) => {
            // If our button is already there, nothing to do
            if (panel.querySelector('.sheet-button')) return;
            const tornButton = panel.querySelector('.bid') || panel.querySelector('p.t-green')
            if (!tornButton) return;
            const completedAuction = panel.querySelector('p.t-green')
            //if (!panel.querySelector('.bid')) return;

            const btn = document.createElement('button');
            btn.textContent = 'Item Details Required';
            btn.className = 'torn-btn sheet-button disabled';
            btn.addEventListener('click', function(event) {
                if (event.target.classList.contains('disabled')) return
                processData(event.target)
            })

            panel.style.position = 'relative'

            /* work out where the BID button sits */
            const panelBox = panel.getBoundingClientRect();
            const bidBox   = tornButton.getBoundingClientRect();
            let y        = bidBox.top - panelBox.top;                   // distance from panel’s top

            if (isTornPDA) {
                // if we don't do special styling it overlaps with the bid button :(
                y += (bidBox.top - bidBox.bottom) * 1.1
            }


            btn.style.position = 'absolute'
            btn.style.right = '15px'
            btn.style.top = `${y}px`
            btn.style.zIndex = '1000'

            if (completedAuction) {
                btn.style.right = '2px'
                btn.style.top = `${(panelBox.height - 34) / 2}px`
                btn.textContent = 'Details Req'
                completedAuction.style.zIndex = '2000'
                completedAuction.style.position = 'relative'
                completedAuction.style.pointerEvents = 'none'
            }

            tornButton.insertAdjacentElement('afterend', btn);      // drop button right after it

            const itemId = btn.closest('.active').querySelector('.item-hover').getAttribute('armoury')
            const id = btn.closest('[id]').id
            if (!itemQualities.has(id)) {
                getItemQuality(itemId, id)
            }

        });
    }

    function updateButtons() {
        document.querySelectorAll('.sheet-button').forEach((button, i) => {
            // If our button is disabled, nothing to do
            if (!button.classList.contains('disabled')) return
            const id = button.closest('[id]').id
            if (itemQualities.has(id)) {
                button.classList.remove('disabled')
                const shortContents = ['Details Req', 'Send']
                if (shortContents.includes(button.textContent)) {
                    button.textContent = 'Send'
                } else {
                    button.textContent = 'Send To Sheet'
                }
            }
        });
    }

    function updateItemQualities() {
        document.querySelectorAll('ul[class*="properties"]').forEach((property, i) => {
            const id = property.closest('[id]').id
            if (itemQualities.has(id)) {
                return
            }
            const itemRarityLocation = property.querySelector('i.bonus-attachment-item-rarity-bonus')
            if (!itemRarityLocation) {
                itemQualities.set(id, "N/A")
                return
            }
            const itemQualityBase = itemRarityLocation.parentElement.textContent
            const itemQuality = itemQualityBase.match(/\d+\.?\d*/)[0]
            itemQualities.set(id, itemQuality)
        })
    }

    function processData(element) {
        log('Starting to process data')
        const completedAuction = element.parentNode.querySelector('p.t-green')
        let price
        let text = element.parentNode.parentNode.textContent;
        if (completedAuction) {
            text = element.parentNode.textContent;
        }
        let match = text.match(/\$([0-9,]+)/)
        if (completedAuction) {
            match = text.replace(/[$,]/g, '').match(/\d+/g)
        }
        if (match) {
            const bidAmount = match[1].replace(/,/g, ''); // Remove commas
            price = Number(Math.floor(bidAmount/1.01))
            if (completedAuction) {
                price = Number(bidAmount)
            }
        }

        let queryBase = element.parentNode.parentNode.parentNode
        if (completedAuction) {
            queryBase = element.parentNode.parentNode
        }
        const bonusOne = getBonus(queryBase.querySelector('.iconsbonuses .bonus-attachment-icons')?.getAttribute('title') ?? undefined)
        const bonusTwo = getBonus(queryBase.querySelectorAll('.iconsbonuses .bonus-attachment-icons')[1]?.getAttribute('title') ?? undefined)
        const itemName = queryBase.querySelector('div > span > .bold').textContent

        const itemDetails = parseItem(queryBase.querySelector('.view-info').getAttribute('aria-label'))
        const colorElement = queryBase.querySelector('.item-plate')
        let color = "None"
        if (colorElement.classList.contains('glow-yellow')) {
            color = "Yellow"
        } else if (colorElement.classList.contains('glow-orange')) {
            color = "Orange"
        } else if (colorElement.classList.contains('glow-red')) {
            color = "Red"
        }

        const id = element.closest('[id]').id
        const quality = itemQualities.get(id)

        const data = [
            itemName,
            price,
            color,
            quality,
            bonusOne.bonus,
            bonusOne.percentage,
            bonusTwo.bonus,
            bonusTwo.percentage,
            itemDetails.damage ?? "",
            itemDetails.accuracy ?? "",
            itemDetails.defense ?? "",
            `${new Date().getUTCDate()}/${new Date().getUTCMonth()}/${new Date().getUTCFullYear()}`,
            `${new Date().getUTCHours()}:${new Date().getUTCMinutes()}`
        ]

        log('Completed processing data, sending data to sheet')
        sendToSheet(data, element)
    }



    function parseItem(description) {
        if (typeof description !== "string") throw new TypeError("description must be a string");

        // Extract Damage & Accuracy (first occurrence only)
        const damageMatch = description.match(/Damage:\s*([0-9]+(?:\.[0-9]+)?)/i);
        const accuracyMatch = description.match(/Accuracy:\s*([0-9]+(?:\.[0-9]+)?)/i);
        const defenseMatch = description.match(/Defence:\s*([0-9]+(?:\.[0-9]+)?)/i);

        return {
            damage: damageMatch ? parseFloat(damageMatch[1]) : null,
            accuracy: accuracyMatch ? parseFloat(accuracyMatch[1]) : null,
            defense: defenseMatch ? parseFloat(defenseMatch[1]) : null,
        };
    }

    function getBonus(str) {
        return {
            bonus: str?.match(/<b>(.*?)<\/b>/)?.[1] ?? "",
            percentage: str?.match(/<\/b>.*?(\d+)/)?.[1] ?? ""
        }
    }

    function sendToSheet(data, element) {
        GM_xmlhttpRequest({
            method:  'POST',
            url:     SHEET_ENDPOINT,
            headers: { 'Content-Type': 'application/json' },
            data:    JSON.stringify(data),

            onload:  () => updateToSent(element),
            onerror: (response) => {
                log('Request failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    responseText: response.responseText,
                    finalUrl: response.finalUrl
                })
                console.log(response)
                updateToSent(element);
            }
        });
    }

    function updateToSent(element) {
        element.textContent = 'Sent!'
    }

    function getItemQuality(itemId, id) {
        if (API_KEY === "Insert key here") {
            return
        }
        fetch(`https://api.torn.com/torn/${itemId}?selections=itemdetails&key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
            const itemQuality = data.itemdetails.quality
            itemQualities.set(id, itemQuality)
            updateButtons()
        })
            .catch(error => console.error('Error fetching item details:', error))
    }

    function log(message) {
        console.log(`Auction Sheet Adder Log: ${message}`)
    }

    // Set up MutationObserver to watch for DOM changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Check if nodes were added
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                addButtons()
                updateButtons()
                updateItemQualities()
            }
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

})();
