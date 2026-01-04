// ==UserScript==
// @name         Wildhare Profile Mods
// @namespace    wildhareProfileMods
// @version      2.1
// @description  helpful changes to player profile page
// @author       wildhare
// @match        *://*.torn.com/profiles.php?XID=*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/435048/Wildhare%20Profile%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/435048/Wildhare%20Profile%20Mods.meta.js
// ==/UserScript==

const userApiProfileEndpoint = 'https://api.torn.com/user/';
let api = localStorage['wildhare.torn.api'];
if (!api) {
  api = '**********';
  localStorage['wildhare.torn.api'] = api;
}
const base = window.location.origin;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userID = urlParams.get('XID');

(function() {
    'use strict';

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const fiveHoursAgo = currentTimestamp - 18000;
    let defendsLostStart;
    let defendsLostNow;
    let defendsDelta;
    const userProfileApiLinkNow = `${userApiProfileEndpoint}${userID}?selections=personalstats&stat=defendslost&key=${api}`
    const userProfileApiLinkStart = `${userApiProfileEndpoint}${userID}?selections=personalstats&stat=defendslost&timestamp=${fiveHoursAgo}&key=${api}`

    const statusNodeSelector = '.profile-status > div > div > .profile-container > .description'
    const statusSubNodeSelector = '.profile-container > div > span.sub-desc'
    let statusSubNode;

    const timerNode = document.createElement("span")
    timerNode.className = 'mug-timer'
    let playerMuggedTime = new Date().getTime();
    let lastMuggedString = 'last mugged over';

    function updateNewNode() {
        timerNode.innerText = `(${lastMuggedString} ${timeSince(playerMuggedTime)} ago, 5hr defends: ${defendsDelta})`
    }

    let statusNodeContainer;
    let initComplete;
    function initTimer() {
        if (initComplete === undefined) {
            statusNodeContainer = document.querySelector('.profile-status > div > div > .profile-container > .description')
            if (statusNodeContainer) {
                statusNodeContainer.appendChild(timerNode);
                setInterval(updateNewNode, 1000);
                initComplete = true;
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

    function isProfileStatusSub(node) {
        return node.classList !== undefined &&
            (node.classList.contains('sub-desc'));
    }

    function watchForPlayerStatusUpdates() {
        let target = document.querySelector('#profileroot');
        let mugObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                let doUpdateTimer = false;
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

    fetch(userProfileApiLinkNow)
        .then(resNow => {
        return resNow.json()
        })
        .then(dataNow => {
            setTimeout(console.log(dataNow), 1000);
            defendsLostNow = dataNow.personalstats.defendslost.toString();
            fetch(userProfileApiLinkStart)
                .then(res => {
                return res.json()
                })
                .then(data => {
                    console.log(data);
                    defendsLostStart = data.personalstats.defendslost.toString();
                    defendsDelta = Number(defendsLostNow) - Number(defendsLostStart);
                    watchForPlayerStatusUpdates();
                    initTimer();
                }).catch((err) => { console.log(err); });
        }).catch((err) => { console.log(err); });
})();
