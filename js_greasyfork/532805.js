// ==UserScript==
// @name         Market Mug Ping
// @namespace    heartflower.torn
// @version      1.0.2
// @description  Pings a Discord Webhook whenever an item sells on the item market
// @author       Heartflower [2626587]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/532805/Market%20Mug%20Ping.user.js
// @updateURL https://update.greasyfork.org/scripts/532805/Market%20Mug%20Ping.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Only pings for items above this value - be sure to just write numbers, exclude any "," and "." and "$" etc.
    let minimumValue = 1;

    // Change the URL here to your actual webhook URL - be sure to keep the '' there!
    let webhookUrl = 'https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN?thread_id=THREAD_ID';

    console.log('[HF] Market Mug Ping running');

    let previousMessage;

    let currentPage = window.location.href;
    if (currentPage.includes('addListing') || currentPage.includes('viewListing')) {
        return;
    } else if (currentPage.includes('ItemMarket')) {
        listenForExpansion();
    }

    function checkBought(itemName, price, span, parent, amount = 0) {
        let anonymous = parent.querySelector('.anonymous___P3s5s');
        if (anonymous) return;

        let availableElement = parent.querySelector('.available___xegv_');
        let available = parseInt(availableElement.textContent.replace(' available', '').trim()).toLocaleString('en-US');
        if (amount === 0) {
            amount = available;
        }

        let userInfoWrapper = parent.querySelector('.userInfoWrapper___B2a2P');
        let svg = userInfoWrapper.querySelector('svg');
        let status;
        if (svg) {
            let fill = svg.getAttribute('fill');
            status = fill.includes('offline') ? '🔴' :
            fill.includes('idle') ? '🟠' :
            fill.includes('online') ? '🟢' : '';
        }

        if (status === '🟢') return;

        let honorWrap = userInfoWrapper.querySelector('.honorWrap___BHau4');
        let honorName = honorWrap.querySelector('.honorName___JWG9U');

        let userName = 'Unknown';
        if (!honorName) {
            let img = honorWrap.querySelector('img');
            userName = img.alt;
        } else {
            userName = honorName.textContent.trim();
        }

        let link = honorWrap.querySelector('a');
        let href = link.getAttribute('href');

        let userId = href.replace('/profiles.php?XID=', '');
        userId = userId.replace('/loader.php?sid=attack&user2ID=', '');
        userId = userId.replace('https://www.torn.com', '');

        if (price * amount >= minimumValue) {
            let message = `${status} [${userName} [${userId}]](<https://www.torn.com/loader.php?sid=attack&user2ID=${userId}>) sold ${amount.toLocaleString('en-US')} ${itemName} for $${(price * amount).toLocaleString('en-US')}`;
            sendToDiscord(message);
        }
    }

    function checkForPriceElements(node, itemName, oldValue = 0, newValue = 0) {
        let priceElements = node.querySelectorAll('.price___Uwiv2');
        if (!priceElements || priceElements.length == 0) {
            setTimeout(() => checkForPriceElements(node, itemName), 100);
            return;
        }

        if (priceElements.length > 0) {
            priceElements.forEach(priceElement => {
                let price = parseInt(priceElement.textContent.replace('$', '').replaceAll(',', ''));
                let amount = oldValue - newValue;
                checkBought(itemName, price, priceElement, priceElement.parentNode, amount);
            });
        }
    }

    function listenForExpansion() {
        let sellerListWrapper = document.body.querySelector('.sellerListWrapper___PN32N');
        if (sellerListWrapper) {
            listenForNewLines(sellerListWrapper);
            listenForLineChange(sellerListWrapper);
        } else {
            let target = document.body.querySelector('.itemListWrapper___MuV0O');
            if (!target) {
                setTimeout(listenForExpansion, 100);
                return;
            }

            createObserver(target);
        }
    }

    function listenForNewLines(sellerListWrapper) {
        let sellerList = sellerListWrapper.querySelector('.sellerList___kgAh_');
        if (!sellerList) {
            setTimeout(() => listenForNewLines(sellerListWrapper), 100);
            return;
        }

        createObserver(sellerList, sellerListWrapper);
    }

    function listenForLineChange(sellerListWrapper) {
        let rowWrappers = sellerListWrapper.querySelectorAll('.rowWrapper___me3Ox');
        if (!rowWrappers || rowWrappers.length == 0) {
            setTimeout(() => listenForLineChange(sellerListWrapper), 100);
            return;
        }

        rowWrappers.forEach(rowWrapper => {
            createObserver(rowWrapper, sellerListWrapper);
        });
    }

    function createObserver(element, sellerListWrapper) {
        let target = element;
        if (!target) {
            //console.error(`Target not found.`);
            return;
        }

        let observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'characterData') {
                    let parent = mutation.target.parentNode;
                    if (parent.classList.contains('available___xegv_')) {
                        let sellerRow = parent.parentNode;
                        let titleNode = sellerListWrapper.previousElementSibling;
                        let itemElement = titleNode.querySelector('.name___ukdHN');
                        let itemName = itemElement.textContent;

                        checkForPriceElements(sellerRow, itemName, mutation.oldValue, mutation.target.data);
                    }
                } else if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('sellerListWrapper___PN32N')) {
                            listenForNewLines(node);
                            listenForLineChange(node);
                        }
                    });

                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && (node.classList.contains('rowWrapper___me3Ox') || node.classList.contains('sellerRow___AI0m6'))) {
                            let titleNode = sellerListWrapper.previousElementSibling;
                            let itemElement = titleNode.querySelector('.name___ukdHN');
                            let itemName = itemElement.textContent

                            checkForPriceElements(node, itemName);
                        }
                    });
                }
            }
        });

        let config = { attributes: true, childList: true, subtree: true, characterData: true, characterDataOldValue: true };
        observer.observe(target, config);
    }

    function handleButtonClick(event) {
        let clickedElement = event.target;

        setTimeout(() => {
            let newPage = window.location.href;

            if (currentPage.includes('addListing') || currentPage.includes('viewListing')) {
                return;
            } else if (currentPage.includes('ItemMarket')) {
                if (newPage !== currentPage) {
                    currentPage = newPage;
                    listenForExpansion();
                }
            }
        }, 50);
    }

    function sendToDiscord(message) {
        if (message === previousMessage) return;

        previousMessage = message;
        message += ` <t:${Math.floor(Date.now() / 1000)}:R>`;

        let data = {
            content: message,
        };

        GM.xmlHttpRequest({
            method: "POST",
            url: webhookUrl,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data),
            anonymous: true,
            onload: function(response) {
                console.log("Message sent to Discord:", response, message);
            },
            onerror: function(error) {
                console.error("Error sending message:", error);
            }
        });
    }

})();