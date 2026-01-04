// ==UserScript==
// @name         Wildhare Auction Data Grabber
// @namespace    wildhareAuctionDataGrabber
// @version      2025.08.31
// @description  save auction data for processing
// @author       Wildhare
// @match        *://*.torn.com/amarket.php*
// @grant        GM_xmlhttpRequest
// @connect      firm-modern-ibex.ngrok-free.app
// @connect      172.232.160.68
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542562/Wildhare%20Auction%20Data%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/542562/Wildhare%20Auction%20Data%20Grabber.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let ngrokUrl = 'http://172.232.160.68:3000/data'

    function postToHttp(payload) {
        GM_xmlhttpRequest({
            method: 'POST', // Specify the HTTP method
            url: ngrokUrl, // Replace with your API endpoint URL
            headers: {
                'Content-type': 'application/json'
            },
            data: JSON.stringify(payload),
            onload: function(responseDetails) {
                // Handle the API response here
                console.log("API response:", responseDetails.responseText);
            },
            onerror: function(responseDetails) {
                // Handle errors here
                console.error("API error:", responseDetails);
            }
        });
    }

    function postData() {
        let auctionArray = [];
        let auctionList;
        let weaponList = document.querySelector('#types-tab-1 > div.items-list-wrap > ul');
        let armorList = document.querySelector('#types-tab-2 > div.items-list-wrap > ul');
        let itemList = document.querySelector('#types-tab-3 > div.items-list-wrap > ul');

        let auctionLists = [weaponList, armorList, itemList];
        for (let i = 0; i < auctionLists.length; i++) {
            auctionList = auctionLists[i];
            let auctionData = {};
            if (auctionList) {
                for (let auction of auctionList.children) {
                    if (!auction.hasAttribute('wildhare-processed') && auction.hasChildNodes()) {
                        auctionArray.push(auction);
                        auction.setAttribute('wildhare-processed', 'true');
                    }
                }
                if (auctionArray.length > 0) {
                    console.log(`array length is ${auctionArray.length}`);
                    // post data here
                    for (let x = 0; x < auctionArray.length; x++) {
                        let auctionId = auctionArray[x].id;
                        let sellerName = auctionArray[x].children[1].children[0].querySelector('a').innerText;
                        let sellerId = auctionArray[x].children[1].children[0].querySelector('a').href.split('=')[1]
                        let itemBidString = auctionArray[x].children[6].children[2].innerText.split(':')[1]
                        let itemBidAmountString;
                        let bidderName;
                        let bidderId;
                        if (itemBidString && itemBidString != ' None') {
                            console.log(`${itemBidString}`);
                            itemBidAmountString = itemBidString.trimStart(' ');
                            bidderName = auctionArray[x].children[1].children[2].querySelector('a').innerText;
                            bidderId = auctionArray[x].children[1].children[2].querySelector('a').href.split('=')[1]
                        }

                        // example value: 'Butterfly Knife (Common 429336). Damage: 40.04. Accuracy: 65.29. Plunder: 38% increased money mugged on final hit. Item seller: Zhengyi. High bidder: Heart. 24 bids. $532,692,032. Ends on 19:48:03 - 04/08/25. '
                        let itemInfo = auctionArray[x].children[0].children[0].children[1].querySelector('button').ariaLabel
                        let itemName = itemInfo.split('. ')[0].split(' (')[0];
                        // let itemGlow = document.querySelector('#\\34 34480 > div.item-cont-wrap > span.img-wrap.wai-hover > span.item-plate').classList[1];
                        let itemPlate = auctionArray[x].children[0].children[0].children[0]
                        let itemGlow;
                        if (itemPlate.classList.length > 1) {
                            itemGlow = itemPlate.classList[1];
                        }
                        let itemRarity;
                        if (itemGlow) {
                            itemRarity = itemGlow.split("-")[1];
                        }
                        let itemType;
                        let weaponDamage;
                        let weaponAccuracy;
                        let armorDefense;
                        let itemPerks;

                        // example value: 'Conserve: 38% increased ammo conservation.Sure Shot: 5% chance of a guaranteed hit'
                        if (i == 0) {
                            itemType = 'weapon';
                            weaponDamage = itemInfo.split('. ')[1].split(': ')[1];
                            weaponAccuracy = itemInfo.split('. ')[2].split(': ')[1];
                        } else if (i == 1) {
                            itemType = 'armor';
                            armorDefense = itemInfo.split('. ')[1].split(': ')[1];
                        } else {
                            itemType = 'item';
                        }

                        // example value: "Ends on 07:17:52 - 13/07/25"
                        let endTime = auctionArray[x].children[5].children[0].title;
                        let day = endTime.split(' ')[4].split('/')[0];
                        let month = endTime.split(' ')[4].split('/')[1];
                        let year = endTime.split(' ')[4].split('/')[2];
                        let time = endTime.split(' ')[2];
                        // Example ISO 8601 string (UTC) "2024-07-12T18:30:00Z"
                        // Good for 75 years at least...
                        const dateString = `20${year}-${month}-${day}T${time}Z`;
                        const dateObject = new Date(dateString);
                        const timestampMilliseconds = dateObject.getTime();
                        const timestamp = Math.floor(timestampMilliseconds / 1000);
                        console.log(`auction id: ${auctionId}, seller name: ${sellerName}, seller Id: ${sellerId}, ends: ${endTime}, timestamp: ${timestamp}`);
                        // switch conditional to check for previously processed auctions or not
                        // if (!localStorage[`wildhare.torn.auction.${auctionId}`]) {
                        if (true) {
                            auctionData[auctionId] = {
                                item: {
                                    name: itemName,
                                    type: itemType
                                },
                                seller: {
                                    id: sellerId,
                                    name: sellerName
                                },
                                end: {
                                    time_date: endTime,
                                    timestamp: timestamp
                                }
                            }
                            if (itemRarity) {
                                auctionData[auctionId].item.rarity = itemRarity;
                            }
                            if (itemType == 'weapon') {
                                auctionData[auctionId].item.accuracy = weaponAccuracy;
                                auctionData[auctionId].item.damage = weaponDamage;
                                if (itemInfo.split('. ').length == 10) {
                                    itemPerks = itemInfo.split('. ')[itemInfo.split('. ').length - 7];
                                    console.log(`${itemPerks}`);
                                    auctionData[auctionId].item.perks = [];
                                    auctionData[auctionId].item.perks.push({
                                        type: itemPerks.split('.')[0].split(':')[0],
                                        perk: itemPerks.split('.')[0].split(':')[1]
                                    });
                                    if (itemPerks.split('.').length > 1) {
                                        auctionData[auctionId].item.perks.push({
                                            type: itemPerks.split('.')[1].split(':')[0],
                                            perk: itemPerks.split('.')[1].split(':')[1]
                                        });
                                    }
                                }
                            } else if (itemType == 'armor') {
                                auctionData[auctionId].item.defense = armorDefense;
                                if (itemInfo.split('. ').length == 9) {
                                    itemPerks = itemInfo.split('. ')[itemInfo.split('. ').length - 7];
                                    console.log(`${itemPerks}`);
                                    auctionData[auctionId].item.perks = [];
                                    auctionData[auctionId].item.perks.push({
                                        type: itemPerks.split('.')[0].split(':')[0],
                                        perk: itemPerks.split('.')[0].split(':')[1]
                                    });
                                }
                            }
                            if (itemBidString && itemBidString != ' None') {
                                const currentDateObject = new Date();
                                const currentTime = currentDateObject.getTime();
                                const currentTimestamp = Math.floor(currentTime / 1000);
                                auctionData[auctionId].bidders = [];
                                auctionData[auctionId].bidders.push({
                                    id: bidderId,
                                    name: bidderName,
                                    bid: itemBidAmountString,
                                    timestamp: currentTimestamp
                                });
                            }

                        } else {
                            console.log(`auction ${auctionId} previously processed`);
                        }
                    }
                    const currentDateObject = new Date();
                    const currentTime = currentDateObject.getTime();
                    const fileName = `${currentTime.json}`;
                    const auctionDataString = JSON.stringify(auctionData);
                    console.log(auctionDataString);

                    if (auctionDataString != '{}') {
                        GM_xmlhttpRequest({
                            method: 'POST', // Specify the HTTP method
                            url: ngrokUrl, // Replace with your API endpoint URL
                            headers: {
                                'Content-type': 'application/json'
                            },
                            data: auctionDataString,
                            onload: function(responseDetails) {
                                // Handle the API response here
                                console.log("API response:", responseDetails.responseText);
                                /* for (let auction in auctionData) {
                                    console.log(`storing process auction ${auction}`);
                                    localStorage[`wildhare.torn.auction.${auction}`] = auctionData[auction];
                                } */
                            },
                            onerror: function(responseDetails) {
                                // Handle errors here
                                console.error("API error:", responseDetails);
                            }
                        });
                    }

                    // clear array
                    auctionArray = [];
                }
            }
        }
    }


    const auctionObserver = new MutationObserver(() => {
        if (document.querySelector('#types-tab-1 > div.items-list-wrap > ul') ||
           document.querySelector('#types-tab-2 > div.items-list-wrap > ul') ||
           document.querySelector('#types-tab-3 > div.items-list-wrap > ul')) {
            postData();
        }
    });
    // configuration of the observer:
    let config = { attributes: true, childList: true, subtree: true };
    // pass in the target node, as well as the observer options
    auctionObserver.observe(document.body, config);


})();