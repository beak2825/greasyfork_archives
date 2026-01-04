// ==UserScript==
// @name         Flight Rising - Add Auction Search Links to Market Items
// @version      0.2
// @author       Jicky
// @description  Adds Auction House search buttons to market item listings, allowing users to easily check for better prices.
// @namespace    https://greasyfork.org/users/547396
// @match        https://www1.flightrising.com/market
// @match        https://www1.flightrising.com/market/*
// @icon         https://www.google.com/s2/favicons?domain=flightrising.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/426112/Flight%20Rising%20-%20Add%20Auction%20Search%20Links%20to%20Market%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/426112/Flight%20Rising%20-%20Add%20Auction%20Search%20Links%20to%20Market%20Items.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currency;
    // currency='0'; // Uncomment if you only want to search treasure listings
    // currency='1'; // Uncomment if you only want to search gem listings
    var currencyTable = { 'treasure': '0', 'gems': '1' };
    var tab;
    var tabTable = {
        'apparel': 'app',
        'familiars': 'fam',
        'specialty': 'specialty',
        'genes': 'specialty',
        'scenes': 'specialty',
        'skins': 'skins',
        'battle': 'battle',
        'bundles': 'other'
    }

    // INSERTING AH LINK ICONS
    // ------

    function insertAhLinkIcons() {
        if (document.querySelector('a.market-item-ah-search')) {
            return; // Links have already been added
        }
        var listings = document.querySelectorAll('span.market-item-result');
        if (listings.length==0) { return; }
        if (!tab) { tab = parseTabName(); }
        if (!currency) { currency = parseCurrency(); }
        for (const span of listings) {
            let name = parseListingName(span);
            if (!name) { return; } // Done; we've hit empty listings.
            let link = buildAhLinkIcon(name, tab, currency);
            span.querySelector('span.market-item-icons').appendChild(link);
        }
    }
    function buildAhLinkIcon(itemName, tab, currency) {
        let url = `https://www1.flightrising.com/auction-house/buy/realm/${tab}?itemname=${itemName}&perpage=50&sort=unit_cost_asc`
        if (currency=='0') { url=`${url}&currency=${currency}`; }
        let link = document.createElement('a');
        link.innerHTML = `<a class="tooltip-icon market-item-ah-search" href="${url}" target="_blank"><img src="/static/layout/game-database/button-auction-house.png" class="common-tooltip" border="0" style="max-width: 20px; max-height: 20px;"></a>`;
        return link;
    }


    // PARSING
    // ------

    function parseTabName() {
        let link = document.querySelector('div.common-tab-selected a');
        let url = link.getAttribute('href');
        let matches = /(treasure|gem)\/(?<tab>\w+)/.exec(url);
        return tabTable[matches.groups.tab];
    }
    function parseCurrency() { // treasure=0, gems=1
        if (window.location.href.includes('/gem')) { return '1'; }
        else { return '0'; }
    }
    function parseListingName(span) {
        let inner = span.querySelector('[data-name]');
        if (inner) { return inner.getAttribute('data-name'); }
        else { return false; }
    }


    // WATCH FOR ITEMS TO LOAD
    // ------

    const observer = new MutationObserver(function(mutationsList, observer) {
        insertAhLinkIcons();
    });
    const container = document.querySelector('div#market-results');
    observer.observe(container, {childList: true});

})();