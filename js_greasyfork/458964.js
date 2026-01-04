// ==UserScript==
// @name YouTube Truffle Channel Points Claimer
// @version 3.1
// @author JakeBathman
// @description Automatically claim channel points from Truffle
// @match https://*.youtube.com/*
// @license MIT
// @grant none
// @namespace https://github.com/jakebathman/Twitch-Channel-Points-Claimer
// @downloadURL https://update.greasyfork.org/scripts/458964/YouTube%20Truffle%20Channel%20Points%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/458964/YouTube%20Truffle%20Channel%20Points%20Claimer.meta.js
// ==/UserScript==

console.log('[AutoClaimer] Started');

const myHeaders = new Headers();
myHeaders.append(
    'x-access-token',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJ1c2VySWQiOiIzNzU4N2NmMC1mNjJkLTExZWMtODlhYy1jM2VkMjYxYzI1NmEiLCJzY29wZXMiOlsiKiJdLCJpYXQiOjE2NjQ5OTA2MDMsImlzcyI6InNwb3JlIiwic3ViIjoiMzc1ODdjZjAtZjYyZC0xMWVjLTg5YWMtYzNlZDI2MWMyNTZhIn0.FyJsm7o96CqM0Du0OoH1BjjtNVdcicNTFDNRwmKxPqdAg0nzqmaqwBbg6Nzdz2or-qw9WkDF3c8MhmOd-DEmpA'
);
myHeaders.append('x-org-id', '3a0d9a70-d7e7-11ec-8c8a-994d3437ad2d');

const raw =
    '{"query":"mutation ($sourceType: String!) {\\n  watchTimeClaim(input: {sourceType: $sourceType}) {\\n    economyTransactions {\\n      amountId\\n      amountValue\\n      __typename\\n    }\\n    __typename\\n  }\\n}","variables":{"sourceType":"youtube"}}';

const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
};
function claimPoints() {
    fetch('https://mycelium.truffle.vip/graphql', requestOptions)
        .then((response) => response.text())
        .then((result) => console.log('[AutoClaimer] result', result))
        .catch((error) => console.log('[AutoClaimer] error', error));
}

// Claim to start
claimPoints();

// Claim points every 5 minutes (plus 10 seconds for buffer)
setInterval(claimPoints, 5 * 70 * 1000);
