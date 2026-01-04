// ==UserScript==
// @name         Get Market Listings
// @namespace    heartflower.torn
// @version      3.1.1
// @description  You know what it does
// @author       Heartflower [2626587]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/540517/Get%20Market%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/540517/Get%20Market%20Listings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[HF] Get Market Listings running');

    let pda = ('xmlhttpRequest' in GM);
    let httpRequest = pda ? 'xmlhttpRequest' : 'xmlHttpRequest';

    let currentHref = window.location.href;

    function mobileListExpanded() {
        console.log('[HF] Mobile list expanded');

        let itemInfo = document.body.querySelector('.itemInfo___mNZ5j');
        let id = itemInfo.id;
        let armouryId = id.split('-').pop();

        console.log('Armoury ID', armouryId);

        let itemName = document.body.querySelector('.title___ruNCT').textContent.trim();

        let dmg = '0.0';
        let accuracy = '0.0';
        let dmgIcon = document.body.querySelector('.bonus-attachment-item-damage-bonus');
        if (dmgIcon) {
            dmg = dmgIcon.parentNode.querySelector('span').textContent.trim();

            let accuracyIcon = document.body.querySelector('.bonus-attachment-item-accuracy-bonus');
            accuracy = accuracyIcon.parentNode.querySelector('span').textContent.trim();
        } else {
            let armorIcon = document.body.querySelector('.bonus-attachment-item-defence-bonus');
            if (!armorIcon) return;

            dmg = armorIcon.parentNode.querySelector('span').textContent.trim();
        }

        let honorWrap = document.body.querySelector('.honorWrap___BHau4');
        if (!honorWrap) return;

        let title = document.body.querySelector('.title___ruNCT');
        title.style.display = 'flex';
        title.style.justifyContent = 'space-between';
        title.style.alignItems = 'center';

        let button = document.createElement('button');
        button.classList.add('hf-button', 'torn-btn');
        button.textContent = 'Log Data';
        button.style.lineHeight = 'normal';
        button.style.height = '26px';
        button.style.fontSize = '1em';
        button.style.background = 'var(--default-bg-20-gradient)';
        button.style.color = '#EEEEEE';

        button.addEventListener('click', function() {
            let lister = null;
            if (honorWrap) {
                let idElement = honorWrap.querySelector('a');
                let id = idElement.getAttribute('href');
                lister = parseInt(id.replace('/profiles.php?XID=', ''));
            }

            let price = document.body.querySelector('.price___v8rRx').textContent.replace('$', '').replace(/,/g, '').trim();
            let adder = JSON.parse(document.body.querySelector('#torn-user').value).playername.trim();

            if (lister) {
                let listing = {
                    "item_name": itemName,
                    "damage_armor": dmg,
                    "accuracy": accuracy,
                    "lister": lister,
                    "price": price,
                    "adder": adder,
                    "armoury_id": armouryId,
                }

                console.log('[HF] Sending listing', listing);

                sendListing(listing);
            } else {
                console.log('[HF] Anonymous seller, not sending listing');
            }
        });

        title.appendChild(button);
    }

    function listExpanded(ul, retries = 30) {
        let items = ul.querySelectorAll('.rowWrapper___me3Ox');
        if (!items || items.length < 1) {
            if (retries > 0) {
                setTimeout(() => listExpanded(ul, retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for items after the seller list was expanded after 30 retries.');
            }
            return;
        }

        let openedListing = document.body.querySelector('.expanded___xsZfG');
        let itemName = openedListing?.querySelector('.name___ukdHN')?.textContent.trim();

        let propertyValues = openedListing.querySelectorAll('.properties___QCPEP .value___cwqHv');
        if (!propertyValues || propertyValues.length === 0) return;
        let dmg = propertyValues[0].textContent.trim();
        let accuracy = propertyValues[1]?.textContent.trim() || '0.0';

        for (let item of items) {
            let honorWrap = item.querySelector('.honorWrap___BHau4');
            if (!honorWrap) continue;

            let container = item.querySelector('.sellerRow___AI0m6');
            let priceElement = item.querySelector('.price___Uwiv2');

            let lister = null;
            if (honorWrap) {
                let idElement = honorWrap.querySelector('a');
                let id = idElement.getAttribute('href');
                lister = parseInt(id.replace('/profiles.php?XID=', ''));
            }

            let price = item.querySelector('.price___Uwiv2').textContent.replace('$', '').replace(/,/g, '').trim();
            let adder = JSON.parse(document.body.querySelector('#torn-user').value).playername.trim();

            openedListing.parentNode.setAttribute('hf-item-name', itemName);
            openedListing.parentNode.setAttribute('hf-damage-armor', dmg);
            openedListing.parentNode.setAttribute('hf-accuracy', accuracy);
            openedListing.parentNode.setAttribute('hf-lister', lister);
            openedListing.parentNode.setAttribute('hf-price', price);
            openedListing.parentNode.setAttribute('hf-adder', adder);

            let armouryId = openedListing.parentNode.getAttribute('hf-armoury-id');

            let div = document.createElement('div');
            div.classList.add('hf-container');
            div.style.borderRight = 'var(--item-market-inner-border)';
            div.style.padding = '0px 10px';

            let button = document.createElement('button');
            button.classList.add('hf-button', 'torn-btn');
            button.textContent = 'Log Data';
            button.style.lineHeight = 'normal';
            button.style.height = '26px';
            button.style.fontSize = '1em';
            button.style.background = 'var(--default-bg-20-gradient)';
            button.style.color = '#EEEEEE';

            div.appendChild(button);

            container.insertBefore(div, priceElement);

            button.addEventListener('click', function() {
                let listing = {};

                if (lister) {
                    if (armouryId) {
                        listing = {
                            "item_name": itemName,
                            "damage_armor": dmg,
                            "accuracy": accuracy,
                            "lister": lister,
                            "price": price,
                            "adder": adder,
                            "armoury_id": armouryId,
                        }

                        console.log('[HF] Listing after fetching details AND armoury ID', listing);
                    } else {
                        listing = {
                            "item_name": itemName,
                            "damage_armor": dmg,
                            "accuracy": accuracy,
                            "lister": lister,
                            "price": price,
                            "adder": adder,
                        }

                        console.log('[HF] Listing after fetching details BUT NOT armoury ID', listing);
                    }

                    console.log('[HF] Sending listing', listing);

                    let sent = false;

                    try {
                        sent = sendListing(listing);
                    } catch (error) {
                        console.error('Error while sending listing:', error);
                        sent = false;
                    }

                } else {
                    console.log('[HF] Anonymous seller, not sending listing');
                }
            });
        }
    }

    function findListings() {
        console.log('[HF] Finding Listings...');

        let url = `https://tolerant-kite-quickly.ngrok-free.app/lids`;

        GM[httpRequest]({
            method: 'GET',
            url: url,
            responseType: 'json',
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        response.response ??= JSON.parse(response.responseText); // In order for it to work with Torn PDA
                    } catch (error) {
                        throw new Error(`Something went wrong whilst trying to reach the database: ${response}`);
                    }

                    let data = response.response;

                    displayListings(data);

                    return true;
                } else {
                    throw new Error(`Failed to reach database: ${response.statusText}`);
                }
            },
            onerror: function(response) {
                console.error('Error sending data:', response);
            }
        });
    }

    function displayListings(data, retries = 30) {
        let items = document.body.querySelectorAll('.itemList___u4Hg1 li');

        if (!items || items.length < 1) {
            if (retries > 0) {
                setTimeout(() => displayListings(data, retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for items whilst trying to highlight listings after 30 retries.');
            }
            return;
        }

        for (let item of items) {
            let itemName = item.querySelector('.name___ukdHN');
            if (!itemName) continue;
            itemName = itemName.textContent.trim();

            let propertyValues = item.querySelectorAll('.properties___QCPEP .value___cwqHv');
            if (!propertyValues || propertyValues.length === 0) continue;

            let dmg = propertyValues[0].textContent.trim();
            let accuracy = propertyValues[1]?.textContent.trim() || '0.0';

            let id = `${itemName}_${dmg}_${accuracy}`;
            let index = data.indexOf(id);
            if (index === -1) continue;

            item.style.background = 'var(--default-bg-blue-hover-color)';
        }
    }

    function sendListing(listing) {
        let url = `https://tolerant-kite-quickly.ngrok-free.app/listing?name=${encodeURIComponent(listing.item_name)}&damage=${listing.damage_armor}&accuracy=${listing.accuracy}&lister=${listing.lister}&price=${listing.price}&adder=${listing.adder}`;

        GM[httpRequest]({
            method: 'POST',
            url: url,
            responseType: 'json',
            onload: function(response) {
                if (response.status === 200) {
                    if (response.responseText == 1) {
                        console.log('[HF] Listing added on server', listing);
                    } else if (response.responseText == 2) {
                        console.log('[HF] Listing edited on server', listing);
                    }

                    //setTimeout(() => findListings(), 1000);
                } else {
                    throw new Error(`Failed to update database: ${response.statusText}`);
                }
            },
            onerror: function(response) {
                console.error('Error sending data:', response);
            }
        });
    }

    function createFetchButton(retries = 30) {
        let existingButton = document.body.querySelector('.hf-button');
        if (existingButton) return;

        let mobile = document.body.querySelector('.area-mobile___BH0Ku');

        let itemsHeader = document.body.querySelector('.itemsHeader___ZTO9r');
        if (mobile) itemsHeader = document.body.querySelector('.titleContainer___QrlWP');

        if (!itemsHeader) {
            if (retries > 0) {
                setTimeout(() => createFetchButton(retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for the item header to add fetch button after 30 retries.');
            }
            return;
        }

        let button = document.createElement('button');
        button.classList.add('hf-button', 'torn-btn');
        button.textContent = 'Mark Listings';
        button.style.lineHeight = 'normal';
        button.style.height = '26px';
        button.style.fontSize = '1em';
        button.style.background = 'var(--default-bg-20-gradient)';
        button.style.color = '#EEEEEE';
        button.style.marginRight = '8px';

        button.addEventListener('click', function() {
            findListings();
        });

        itemsHeader.appendChild(button);
    }

    function infoWrapperAdded(container) {
        let id = container.id;
        let armouryId = id.split('-').pop();

        let openedListing = document.body.querySelector('.expanded___xsZfG');
        openedListing.parentNode.setAttribute('hf-armoury-id', armouryId);

        let itemName = openedListing.parentNode.getAttribute('hf-item-name');
        let dmg = openedListing.parentNode.getAttribute('hf-damage-armor');
        let accuracy = openedListing.parentNode.getAttribute('hf-accuracy');
        let lister = openedListing.parentNode.getAttribute('hf-lister');
        let price = openedListing.parentNode.getAttribute('hf-price');
        let adder = openedListing.parentNode.getAttribute('hf-adder');

        let listing = {};

        if (itemName) {
            listing = {
                "item_name": itemName,
                "damage_armor": dmg,
                "accuracy": accuracy,
                "lister": lister,
                "price": price,
                "adder": adder,
                "armoury_id": armouryId,
            }

            console.log('[HF] Listing after fetching details AND armoury ID', listing);
        } else {
            listing = {
                "armoury_id": armouryId,
            }

            console.log('[HF] Listing after fetching armoury ID BUT NOT details', listing);
        }
    }

    // HELPER function to create a mutation observer to check if user clicks open an item
    function createObserver(element) {
        let target;
        target = element;

        if (!target) {
            console.error(`[HF] Mutation Observer target not found.`);
            return;
        }

        let mobile = document.body.querySelector('.bars-mobile___PDyjE');

        let observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('sellerListWrapper___PN32N')) {
                            listExpanded(node);
                        } else if (!mobile && node.nodeType === Node.ELEMENT_NODE && node.classList.contains('itemInfo___mNZ5j')) {
                            infoWrapperAdded(node);
                        } else if (mobile && node.nodeType === Node.ELEMENT_NODE && node.classList.contains('item-info')) {
                            mobileListExpanded();
                        } else if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('sellerList___e4C9_')) {
                            let button = document.body.querySelector('.hf-button');
                            if (button) button.remove();
                        } else if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('marketWrapper___S5pRm')) {
                            setTimeout(() => createFetchButton(), 1000);
                        }

                    });
                }
            }
        });

        let config = { attributes: true, childList: true, subtree: true, characterData: true };
        observer.observe(target, config);
    }

    //Attach click event listener
    //document.body.addEventListener('click', findListings);

    createObserver(document.body);
    createFetchButton();
    findListings();


})();