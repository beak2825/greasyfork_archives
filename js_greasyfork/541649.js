// ==UserScript==
// @name         Wildhare Private Profile Mods
// @namespace    wildharePrivateProfileMods
// @version      2025.11.10
// @description  include mug data in player profile page
// @author       Wildhare
// @match        *://*.torn.com/profiles.php?XID=*
// @grant        GM_xmlhttpRequest
// @connect      s3.us-west-2.amazonaws.com
// @connect      api.torn.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541649/Wildhare%20Private%20Profile%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/541649/Wildhare%20Private%20Profile%20Mods.meta.js
// ==/UserScript==
 
const base = window.location.origin;
 
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const playerId = urlParams.get('XID');
 
(function() {
    'use strict';
    // load torn api key from browser storage location
    let api = localStorage['wildhare.torn.api'];
    // edit next line and uncomment next two lines to set public level API key in browser storage when you load a profile page.
    // api = '***********';
    // localStorage['wildhare.torn.api'] = api;
 
    let milliseconds = (new Date()).getTime();
    const twentyFourHoursInSeconds = 24*60*60;
    const millisecondsInMinute = 1000 * 60;
    const cacheBusting = Math.round(milliseconds / millisecondsInMinute) * millisecondsInMinute;
    const mugDataUrl = `https://s3.us-west-2.amazonaws.com/torndata.noskilz.com/player_${playerId}.json?v=${cacheBusting}`;
    const factionMugDataUrl = `https://s3.us-west-2.amazonaws.com/torndata.noskilz.com/faction_player_${playerId}.json?v=${cacheBusting}`;
    const auctionDataUrl = `https://s3.us-west-2.amazonaws.com/torndata.noskilz.com/auction-db.json?v=${cacheBusting}`;
    const playerProfileBaseUrl = `https://api.torn.com/v2/user?id=`
    let secondsInHour = 3600
    let secondsInDay = 86400
    let biggestMugTs;
    let biggestMug;
    let recentMugTs;
    let recentMug;
    let biggestMugString;
    let biggestMugTsString;
    let recentMugString;
    let recentMugTsString;
    let biggestMuggerId;
    let recentMuggerId;
    let biggestMuggerProfile;
    let recentMuggerProfile;
    let biggestMuggerName;
    let recentMuggerName;
    // needs a response cache, store in localStorage?
    // let playerMugHistory = getWithExpiry(`player${playerId}.mug.history.wildhare.torn`);
    // let factionPlayerMugHistory = getWithExpiry(`faction.player${playerId}.mug.history.wildhare.torn`);
    let playerMugHistory;
    let factionPlayerMugHistory;
    let initComplete;
    let auctionTimestamp;
 
    function setWithExpiry(key, value, ttl) {
        const now = new Date()
 
        // `item` is an object which contains the original value
        // as well as the time when it's supposed to expire
        const item = {
            value: value,
            expiry: now.getTime() + ttl,
        }
        localStorage.setItem(key, JSON.stringify(item))
    }
 
    function getWithExpiry(key) {
        const itemStr = localStorage.getItem(key)
        // if the item doesn't exist, return null
        if (!itemStr) {
            return null
        }
        const item = JSON.parse(itemStr)
        const now = new Date()
        // compare the expiry time of the item with the current time
        if (now.getTime() > item.expiry) {
            // If the item is expired, delete the item from storage
            // and return null
            localStorage.removeItem(key)
            return null
        }
        return item.value
    }
 
    function getTimeSince(timestamp) {
        let secondsSince = currentTimestamp - timestamp
        let timeSinceString;
 
        if (secondsSince < secondsInDay) {
            let hoursSince = Math.round(((secondsSince/secondsInHour) + Number.EPSILON) * 10) / 10
            timeSinceString = `${hoursSince} hours`
            return timeSinceString;
        } else {
            let daysSince = Math.round(secondsSince/secondsInDay)
            timeSinceString = `${daysSince} days`
            return timeSinceString;
        }
    }
 
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }
 
    function processMugs(mugHistory) {
        if (!recentMugTs) {
            biggestMug = 0;
            recentMugTs = 0;
        }
        for (const mug in mugHistory) {
            if (mugHistory[mug]) {
                if (mugHistory[mug].data.money_mugged > biggestMug) {
                    biggestMug = mugHistory[mug].data.money_mugged;
                    biggestMugTs = mugHistory[mug].timestamp;
                    //TODO: personal data doesn't currently store this value, I should add to the schema
                    biggestMuggerId = 2173250;
                    biggestMuggerName = localStorage[`wildhare.torn.player.name.${biggestMuggerId}`]
                    if (!biggestMuggerName) {
                        biggestMuggerProfile = getPlayerProfile(biggestMuggerId);
                    }
                }
                if (mugHistory[mug].timestamp > recentMugTs) {
                    recentMug = mugHistory[mug].data.money_mugged;
                    recentMugTs = mugHistory[mug].timestamp;
                    //TODO: personal data doesn't currently store this value, I should add to the schema
                    recentMuggerId = 2173250;
                    recentMuggerName = localStorage[`wildhare.torn.player.name.${recentMuggerId}`];
                    if (!recentMuggerName) {
                        recentMuggerProfile = getPlayerProfile(recentMuggerId);
                    }
                }
            } else if (recentMugTs = 0) {
                biggestMug = '';
                recentMugTs = '';
            }
        }
    }
 
    function processFactionMugs(mugHistory) {
        if (!recentMugTs) {
            biggestMug = 0;
            recentMugTs = 0;
        }
        for (const mug in mugHistory) {
            if (mugHistory[mug]) {
                if (mugHistory[mug].money_mugged > biggestMug) {
                    biggestMug = mugHistory[mug].money_mugged;
                    biggestMugTs = mugHistory[mug].ended;
                    biggestMuggerId = mugHistory[mug].attacker.id;
                    biggestMuggerName = localStorage[`wildhare.torn.player.name.${biggestMuggerId}`];
                    if (!biggestMuggerName) {
                        biggestMuggerProfile = getPlayerProfile(biggestMuggerId);
                    }
                }
                if (mugHistory[mug].ended > recentMugTs) {
                    recentMug = mugHistory[mug].money_mugged;
                    recentMugTs = mugHistory[mug].ended;
                    recentMuggerId = mugHistory[mug].attacker.id;
                    recentMuggerName = localStorage[`wildhare.torn.player.name.${recentMuggerId}`];
                    if (!recentMuggerName) {
                        recentMuggerProfile = getPlayerProfile(recentMuggerId);
                    }
                }
            } else if (recentMugTs = 0) {
                biggestMug = '';
                recentMugTs = '';
            }
        }
    }
 
    function processAuctions(auctionData) {
        /* example data
        [
            {
                "id": 1,
                "seller": {
                    "id": 1700279,
                    "name": "TestTestTest"
                },
                "end": {
                    "time_date": "TEST Test TEST",
                    "timestamp": 1752445914
                }
            },
        ]
        */
        let nextAuction;
        let lastAuction;
        let timedAuction;
        const now = new Date();
        const timestampNow = Math.floor(now.getTime() / 1000);
        const tFHIS = twentyFourHoursInSeconds;
 
        auctionData.forEach(function(auction) {
            if (auction.seller.id == playerId) {
                const tFAfter = auction.end.timestamp + twentyFourHoursInSeconds
                if (!lastAuction) {
                    lastAuction = auction;
                } else if (auction.end.timestamp > lastAuction.end.timestamp) {
                    lastAuction = auction;
                }
                if (!nextAuction) {
                    nextAuction = auction;
                } else if (tFAfter + 5 > timestampNow && auction.end.timestamp < nextAuction.end.timestamp) {
                    nextAuction = auction;
                }
                if (nextAuction.end.timestamp + tFHIS + 5 > timestampNow) {
                    timedAuction = nextAuction
                }
            }
 
        });
        if (nextAuction.end.timestamp + tFHIS + 5 > timestampNow) {
            timedAuction = nextAuction;
        } else {
            timedAuction = lastAuction;
        }
        auctionTimestamp = timedAuction.end.timestamp;
    }
 
    const lastMuggedNode = document.createElement("span");
    lastMuggedNode.className = 'mug-history';
 
    function processRecentMugs() {
        if (biggestMug > 0) {
            if (biggestMugTs) {
                biggestMugTsString = getTimeSince(biggestMugTs);
                biggestMugString = numberWithCommas(biggestMug);
            } else {
                biggestMugTs = '';
                biggestMugTsString = '';
            }
            if (recentMugTs) {
                recentMugTsString = getTimeSince(recentMugTs);
                recentMugString = numberWithCommas(recentMug);
            } else {
                recentMugTs = '';
                recentMugTsString = '';
            }
 
            if (!recentMuggerName && recentMuggerProfile) {
                recentMuggerName = recentMuggerProfile.name;
            }
 
            if (!biggestMuggerName && biggestMuggerProfile) {
                biggestMuggerName = biggestMuggerProfile.name;
            }
 
            lastMuggedNode.innerHTML = `Last: \$${recentMugString} ${recentMugTsString} `;
            if (recentMuggerName) {
                lastMuggedNode.innerHTML += `<a href="https://www.torn.com/profiles.php?XID=${recentMuggerId}" style="text-decoration: underline;">${recentMuggerName}</a><br>`;
            } else if (recentMuggerId) {
                lastMuggedNode.innerHTML += `<a href="https://www.torn.com/profiles.php?XID=${recentMuggerId}" style="text-decoration: underline;">${recentMuggerId}</a><br>`;
            } else {
                lastMuggedNode.innerHTML += `<br>`;
            }
 
            // Table formatted
            /*
            var tblRow = "<tr>" +
                    "<td sortdata=" + biggestMug + "> $" + biggestMugString + "</td>" +
                    "<td sortdata=" + biggestMugTs + " >" + biggestMugTsString +
                    "<td sortdata=" + recentMug + "> $" + recentMugString + "</td>" +
                    "<td sortdata=" + recentMugTs + " >" + recentMugTsString +
                "</tr>"
            */
            // append table to new space
            // $(tblRow).appendTo("#userdata tbody");
        }
    }
 
    function getPlayerMugs() {
        GM_xmlhttpRequest({
            method: 'GET', // Specify the HTTP method
            url: mugDataUrl, // Replace with your API endpoint URL
            onload: function(responseDetails) {
                // Handle the API response here
                console.log("API response:", responseDetails.responseText);
                let muggedDataResponse = responseDetails.responseText;
                let responseJson = JSON.parse(muggedDataResponse);
                playerMugHistory = responseJson.mug_history;
                // setWithExpiry(`player${playerId}.mug.history.wildhare.torn`, factionPlayerMugHistory, 30000);
                processMugs(playerMugHistory);
            },
            onerror: function(responseDetails) {
                // Handle errors here
                console.error("API error:", responseDetails);
            }
        });
    }
 
    function getFactionPlayerMugs() {
        GM_xmlhttpRequest({
            method: 'GET', // Specify the HTTP method
            url: factionMugDataUrl, // Replace with your API endpoint URL
            onload: function(responseDetails) {
                // Handle the API response here
                console.log("API response:", responseDetails.responseText);
                let factionMuggedDataResponse = responseDetails.responseText;
                let responseJson = JSON.parse(factionMuggedDataResponse);
                factionPlayerMugHistory = responseJson.mug_history;
                // setWithExpiry(`faction.player${playerId}.mug.history.wildhare.torn`, factionPlayerMugHistory, 30000);
                processFactionMugs(factionPlayerMugHistory);
            },
            onerror: function(responseDetails) {
                // Handle errors here
                console.error("API error:", responseDetails);
            }
        });
    }
 
    function getPlayerAuctionsEnding() {
        GM_xmlhttpRequest({
            method: 'GET', // Specify the HTTP method
            url: auctionDataUrl, // Replace with your API endpoint URL
            onload: function(responseDetails) {
                // Handle the API response here
                console.log("API response:", responseDetails.responseText);
                let auctionDataResponse = responseDetails.responseText;
                let responseJson = JSON.parse(auctionDataResponse);
                // setWithExpiry(`player${playerId}.mug.history.wildhare.torn`, factionPlayerMugHistory, 30000);
                processAuctions(responseJson);
            },
            onerror: function(responseDetails) {
                // Handle errors here
                console.error("API error:", responseDetails);
            }
        });
    }
 
    function getPlayerProfile(playerId) {
        const playerProfileUrl = playerProfileBaseUrl + `${playerId}&key=${api}`;
        GM_xmlhttpRequest({
            method: 'GET', // Specify the HTTP method
            url: playerProfileUrl, // Replace with your API endpoint URL
            onload: function(responseDetails) {
                // Handle the API response here
                console.log("Torn API response:", responseDetails.responseText);
                let playerProfile = JSON.parse(responseDetails.responseText);
                localStorage[`wildhare.torn.player.name.${playerId}`] = playerProfile.name;
                return playerProfile;
            },
            onerror: function(responseDetails) {
                // Handle errors here
                console.error("API error:", responseDetails);
            }
        });
    }
 
 
    getPlayerMugs();
    getFactionPlayerMugs();
    getPlayerAuctionsEnding();
 
 
    const currentTimestamp = Math.floor(Date.now() / 1000);
 
    const statusNodeSelector = '.profile-status > div > div > .profile-container > .description'
    const statusSubNodeSelector = '.profile-container > div > span.sub-desc'
    let statusSubNode;
 
    const timerNode = document.createElement("span")
    timerNode.className = 'mug-timer'
    const auctionTimerNode = document.createElement("span")
    auctionTimerNode.className = 'auction-timer'
    let playerMuggedTime = new Date().getTime();
    let lastMuggedString = 'last mugged >';
 
    function updateNewNode() {
        timerNode.innerText = `(${lastMuggedString} ${timeSince(playerMuggedTime)} ago)`
    }
 
    function updateAuctionNode() {
        if (auctionTimestamp) {
            auctionTimerNode.innerText = `${timeUntil((auctionTimestamp + (24*60*60))*1000)} until 24hrs after auction\n`
        }
    }
 
    let statusNodeContainer;
    let lastAction;
    function initTimer() {
        if (initComplete === undefined) {
            statusNodeContainer = document.querySelector('.profile-status > div > div > .profile-container > .description')
            let lastActionNode = document.querySelector('div.basic-information.profile-left-wrapper.left > div > div.cont.bottom-round > div > ul > li:nth-child(12) > div.user-info-value > span')
            if (statusNodeContainer && lastActionNode) {
                lastAction = lastActionNode.innerText
                let statusBar = document.querySelector('div.profile-buttons.profile-action > div > div.title-black.top-round')
                statusBar.innerText = `Last action: ${lastAction}`
                statusNodeContainer.appendChild(auctionTimerNode);
                statusNodeContainer.appendChild(lastMuggedNode);
                statusNodeContainer.appendChild(timerNode);
                setInterval(updateNewNode, 1000);
                setInterval(updateAuctionNode, 1000);
                initComplete = true;
            }
        }
    }
 
    let initMugDataComplete;
    let displayedMugTs;
    function initMugData() {
        if (initMugDataComplete === undefined || (displayedMugTs && recentMugTs > displayedMugTs)) {
            statusNodeContainer = document.querySelector('.profile-status > div > div > .profile-container > .description')
            // need to fix a timing issue here and make these independent?
            if (statusNodeContainer && recentMugTs > 0) {
                displayedMugTs = recentMugTs;
                processRecentMugs();
                initMugDataComplete = true;
            }
        }
    }
 
    function updateTimer() {
        let muggedStatus = "Mugged"
        statusSubNode = document.querySelector(statusSubNodeSelector);
        if (statusSubNode.innerText.includes(muggedStatus)) {
            lastMuggedString = 'last mugged at'
            //timerNode.innerText = `(${lastMuggedString} ${timeSince(playerMuggedTime)} ago)`
            playerMuggedTime = new Date().getTime();
        }
    }
 
    function timeSince(timeStamp) {
        let now = new Date(),
          secondsPast = (now.getTime() - timeStamp) / 1000;
        if (secondsPast < 60) {
          return parseInt(secondsPast) + 's';
        }
        if (secondsPast < 3600) {
          return parseInt(secondsPast / 60) + 'm';
        }
        if (secondsPast <= 86400) {
          return parseInt(secondsPast / 3600) + 'h';
        }
        if (secondsPast > 86400) {
          let day = timeStamp.getDate();
          let month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
          let year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
          return day + " " + month + year;
        }
    }
 
    function timeUntil(timeStamp) {
        let now = new Date(),
          secondsUntil = (timeStamp - now.getTime()) / 1000;
        if (secondsUntil < 0) {
            if (secondsUntil > -60) {
                return parseInt(secondsUntil) + 's';
            }
            if (secondsUntil > -3600) {
                return parseInt(secondsUntil / 60) + 'm';
            }
            if (secondsUntil >= -86400) {
                return parseInt(secondsUntil / 3600) + 'h';
            }
            if (secondsUntil < 86400) {
                return parseInt(secondsUntil / (24*3600)) + 'd';
            }
        }
        if (secondsUntil < 60) {
          return parseInt(secondsUntil) + 's';
        }
        if (secondsUntil < 3600) {
          return parseInt(secondsUntil / 60) + 'm';
        }
        if (secondsUntil <= 86400) {
          return parseInt(secondsUntil / 3600) + 'h';
        }
        if (secondsUntil > 86400) {
          let day = timeStamp.getDate();
          let month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
          let year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
          return day + " " + month + year;
        }
    }
 
    function isProfileStatusSub(node) {
        return node.classList !== undefined &&
            (node.classList.contains('sub-desc'));
    }
 
    function watchForPlayerStatusUpdates() {
        let target = document.querySelector('#profileroot');
        let mugObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                let doUpdateTimer = false;
                initMugData();
                initTimer();
                if (mutation.target.innerText) {
                    if (mutation.target.innerText.includes("Mugged")){
                        if (isProfileStatusSub(mutation.target)) {
                            doUpdateTimer = true;
                        }
                    }
                }
                if (doUpdateTimer) {
                    updateTimer();
                }
            });
        });
        // configuration of the observer:
        let config = { childList: true, subtree: true, characterData: true };
        // pass in the target node, as well as the observer options
        mugObserver.observe(target, config);
    }
 
 
    watchForPlayerStatusUpdates();
 
})();