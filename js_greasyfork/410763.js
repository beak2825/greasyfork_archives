// ==UserScript==
// @name         Torn: Live Networth
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Untouchable [1360035]
// @match        https://www.torn.com/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410763/Torn%3A%20Live%20Networth.user.js
// @updateURL https://update.greasyfork.org/scripts/410763/Torn%3A%20Live%20Networth.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let api_key = localStorage.getItem('uapikey');
    if(api_key == "" || api_key == undefined){
        api_key = prompt("Please enter your api key");
        localStorage.setItem('uapikey',api_key);
    }

    let selector = '#item640540 > div.bottom-round > div > ul > li.last';

    let stocks = true,
        company = true,
        display = false,
        items = true,
        bank = false,
        auction = false,
        bazaar = false,
        bookies = false,
        cayman = false,
        loan = false,
        pending = false,
        piggybank = false,
        points = false,
        properties = false,
        unpaid = false,
        vault = true,
        wallet = false;

    $.get( "https://api.torn.com/user/?selections=networth&key=" + api_key, function( data ) {

        console.log(data);

        $('#item640540 > div.bottom-round > div > ul > li.last > span.desc')[0].innerHTML = "$" + nwc(data.networth.total)
        + '<i class="networth-info-icon" id="networth-icon" title="Your networth is calculated every 24 hours"></i>';

        if (stocks) /* Stocks */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Stock Market"> <span class="divider"> <span>Stocks</span> </span> <span class="desc">$' + nwc(data.networth.stockmarket) + '</span> </li>' );

        if (company) /* Company */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Company"> <span class="divider"> <span>Company</span> </span> <span class="desc">$' + nwc(data.networth.company) + '</span> </li>' );

        if (display) /* Display Case */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Display Case"> <span class="divider"> <span>Display Case</span> </span> <span class="desc">$' + nwc(data.networth.displaycase) + '</span> </li>' );

        if (items) /* Items */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Items"> <span class="divider"> <span>Items</span> </span> <span class="desc">$' + nwc(data.networth.items) + '</span> </li>' );

        if (bank) /* Bank */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Bank"> <span class="divider"> <span>Bank</span> </span> <span class="desc">$' + nwc(data.networth.bank) + '</span> </li>' );

        if (auction) /* Auction House */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Auction House"> <span class="divider"> <span>Auction House</span> </span> <span class="desc">$' + nwc(data.networth.auctionhouse) + '</span> </li>' );

        if (bazaar) /* Bazaar */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Bazaar"> <span class="divider"> <span>Bazaar</span> </span> <span class="desc">$' + nwc(data.networth.bazaar) + '</span> </li>' );

        if (bookies) /* Bookies */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Bookies"> <span class="divider"> <span>Bookies</span> </span> <span class="desc">$' + nwc(data.networth.bookie) + '</span> </li>' );

        if (cayman) /* Cayman Islands */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Cayman Islands"> <span class="divider"> <span>Cayman Islands</span> </span> <span class="desc">$' + nwc(data.networth.cayman) + '</span> </li>' );

        if (loan) /* Loan */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Loans"> <span class="divider"> <span>Loan</span> </span> <span class="desc">$' + nwc(data.networth.loan) + '</span> </li>' );

        if (pending) /* Pending */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Pending"> <span class="divider"> <span>Pending</span> </span> <span class="desc">$' + nwc(data.networth.pending) + '</span> </li>' );

        if (piggybank) /* Piggybank */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Piggybank"> <span class="divider"> <span>Piggybank</span> </span> <span class="desc">$' + nwc(data.networth.piggybank) + '</span> </li>' );

        if (points) /* Points */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Points"> <span class="divider"> <span>Points</span> </span> <span class="desc">$' + nwc(data.networth.points) + '</span> </li>' );

        if (properties) /* Properties */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Properties"> <span class="divider"> <span>Properties</span> </span> <span class="desc">$' + nwc(data.networth.properties) + '</span> </li>' );

        if (unpaid) /* Unpaid Fees */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Unpaid Feed"> <span class="divider"> <span>Unpaid</span> </span> <span class="desc">$' + nwc(data.networth.unpaidfees) + '</span> </li>' );

        if (vault) /* Vault */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Vault"> <span class="divider"> <span>Vault</span> </span> <span class="desc">$' + nwc(data.networth.vault) + '</span> </li>' );

        if (wallet) /* Wallet */
        $(selector).before( '<li tabindex="0" role="row" aria-label="Networth in Wallet"> <span class="divider"> <span>Wallet</span> </span> <span class="desc">$' + nwc(data.networth.wallet) + '</span> </li>' );

    });

    function nwc(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

})();