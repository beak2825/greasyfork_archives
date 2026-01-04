// ==UserScript==
// @name         AH Scanner
// @namespace    heartflower.torn
// @version      1.1
// @description  Fetch red/orange from the Auction House and push to a Google Sheets
// @author       Heartflower
// @match        https://www.torn.com/amarket.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/521569/AH%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/521569/AH%20Scanner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentPage = window.location.href;

    function findElements() {
        let itemsListWrap = document.body.querySelector('.items-list-wrap');
        if (!itemsListWrap) {
            setTimeout(findElements, 100);
            return;
        }

        let ul = itemsListWrap.querySelector('.items-list');
        if (!ul) {
            setTimeout(findElements, 100);
            return;
        }

        let items = ul.querySelectorAll('li');
        items.forEach(item => {
            fetchItemData(item);
        });
    }

    function fetchItemData(item) {
        let orange = item.querySelector('.glow-orange');
        let red = item.querySelector('.glow-red');

        let quality;
        if (orange) {
            quality = 'Orange';
        } else if (red) {
            quality = 'Red';
        } else {
            return;
        }

        let currentTimestamp = Date.now();

        let auctionId = item.id;

        let itemName = item.querySelector('.item-name').textContent;

        let damageIcon = item.querySelector('.bonus-attachment-item-damage-bonus');
        let damage = damageIcon.parentNode.textContent;

        let accuracyIcon = item.querySelector('.bonus-attachment-item-accuracy-bonus');
        let accuracy = accuracyIcon.parentNode.textContent;

        let iconsBonuses = item.querySelector('.iconsbonuses');

        let mainBonus;
        let secondaryBonus = '';

        let bonusElements = iconsBonuses.querySelectorAll('i');
        let bonusIndex = 0;

        bonusElements.forEach(bonusElement => {
            let name = bonusElement.className.replace('bonus-attachment-', '');
            name = name.charAt(0).toUpperCase() + name.slice(1);

            if (bonusIndex === 0) {
                mainBonus = name;
            } else if (bonusIndex === 1) {
                secondaryBonus = name;
            }
            bonusIndex++;
        });

        let bid = parseInt(item.querySelector('.c-bid-wrap').textContent.replace('$', '').replace(/,/g, ''));

        let timeRemaining = item.querySelector('.dh-time').textContent;
        timeRemaining = timeInMinutes(timeRemaining);

        //console.log(`for itemName ${itemName}: ${auctionId} auctionId, ${quality} quality, ${damage} damage, ${accuracy} accuracy, ${mainBonus} as main bonus, ${secondaryBonus} as secondary bonus, ${bid} as bid and ${timeRemaining} minutes remaining`);

        let itemData = {
            currentTimestamp,
            auctionId,
            itemName,
            quality,
            damage,
            accuracy,
            mainBonus,
            secondaryBonus,
            bid,
            timeRemaining
        };

        sendDataToServer(itemData);
    }

    function timeInMinutes(timeString) {
        let totalMinutes = 0;

        // Regular expression to match days, hours, and minutes
        let regex = /(\d+)d|(\d+)h|(\d+)m/g;
        let match;

        while ((match = regex.exec(timeString)) !== null) {
            if (match[1]) { // Days
                totalMinutes += parseInt(match[1], 10) * 24 * 60;
            }
            if (match[2]) { // Hours
                totalMinutes += parseInt(match[2], 10) * 60;
            }
            if (match[3]) { // Minutes
                totalMinutes += parseInt(match[3], 10);
            }
        }

        return totalMinutes;
    }

    function sendDataToServer(data) {
        if (!data) {
            console.error('Trying to send data to server, but data is missing!');
        }

        console.log("Sending data to server...");

        GM.xmlHttpRequest({
            method: "POST",
            url: "https://torn-auction-house.vercel.app/api/fishyfox",
            headers: {
                "Content-Type": "application/json"
            },
            //data: extractedAuctionData,
            data: JSON.stringify(JSON.stringify(data)),
            onload: function(response) {
                console.log("Data sent succesfully:", response.responseText);
            },
            onerror: function(response) {
                console.log("Error sending data:", response.responseText);
            }
        });
    }

    // Attach click event listener
    document.body.addEventListener('click', handleButtonClick);

    // If anything on the page is clicked, check if it's a page chance - if yes, rerun script
    function handleButtonClick(event) {
        let clickedElement = event.target;

        // Use a slight delay to allow the URL change to occur after the click
        setTimeout(() => {
            let newPage = window.location.href;
            if (newPage !== currentPage) {
                currentPage = newPage;

                setTimeout(findElements, 200);
            }
        }, 50);
    }

    setTimeout(findElements, 200);
})();