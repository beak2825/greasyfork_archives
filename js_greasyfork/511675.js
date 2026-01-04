// ==UserScript==
// @name         Spelling Bee Unblocker
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  Removes NYT Spelling Bee unregistered user rank Limit
// @author       You
// @match        https://www.nytimes.com/puzzles/spelling-bee
// @match        https://www.nytimes.com/puzzles/spelling-bee/*
// @match        https://www.nytimes.com/puzzles/spelling-bee*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nytimes.com
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511675/Spelling%20Bee%20Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/511675/Spelling%20Bee%20Unblocker.meta.js
// ==/UserScript==

const mockedResponse = {
    "hitPaywall": false,
    "counted": false,
    "loggedIn": false,
    "hash": "9E22265122E1FBC5FFC6AA815E33AF6D",
    "gateway": true,
    "meter": true,
    "isCookieValid": true,
    "gatewayExempt": true,
    "hitRegiwall": false,
    "regiwall": true,
    "v": 0,
    "t": 0,
    "hitSoftPaywall": false,
    "hitSoftRegiwall": false,
    "showGrowl": false,
    "nytsNeedsRefresh": false,
    "ab": [],
    "assetType": null,
    "version": "e8c9a38",
    "rulesVersion": "d0a9acf",
    "grantReason": "WHITELISTED",
    "granted": true,
    "gatewayType": "",
    "gatewayTypeVariation": "",
    "countable": false,
    "gatewayEligible": false,
    "section": "spelling_bee",
    "extraData": []
};

const origOpen = XMLHttpRequest.prototype.open;
const origSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    this._url = url;
    origOpen.call(this, method, url, async, user, password);
};

XMLHttpRequest.prototype.send = function(body) {
    this.addEventListener('readystatechange', function() {
        if (this.readyState === 4 && this._url.includes("/meter.js?sourceApp=Games-web&url=https://www.nytimes.com/puzzles/spelling-bee")) {
            const mockedText = JSON.stringify(mockedResponse);
            Object.defineProperty(this, 'responseText', { value: mockedText });
            Object.defineProperty(this, 'response', { value: mockedText });
            Object.defineProperty(this, 'status', { value: 200 });
            Object.defineProperty(this, 'statusText', { value: 'OK' });
        }
    });
    origSend.call(this, body);
};

console.log('Ready.');
