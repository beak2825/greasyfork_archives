// ==UserScript==
// @name         TrustBTCFaucet - Go to FreeBitcoin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirects to /freebitcoin after logging in on trustbtcfaucet.com
// @author       spookyahell
// @match        *www.trustbtcfaucet.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376808/TrustBTCFaucet%20-%20Go%20to%20FreeBitcoin.user.js
// @updateURL https://update.greasyfork.org/scripts/376808/TrustBTCFaucet%20-%20Go%20to%20FreeBitcoin.meta.js
// ==/UserScript==

(function() {
    if (window.location.href == 'https://www.trustbtcfaucet.com/index'){
        if (document.referrer == 'https://www.trustbtcfaucet.com/login') {
        window.location.href = 'https://www.trustbtcfaucet.com/freebitcoin'
        };
       // window.location.href = 'https://www.trustbtcfaucet.com/freebitcoin'
    }
    'use strict';

    // Your code here...
})();