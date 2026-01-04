// ==UserScript==
// @name        eBay easy item ID
// @namespace   pnppl
// @match       https://www.ebay.com/itm/*
// @match       https://www.ebay.at/itm/*
// @match       https://www.ebay.ca/itm/*
// @match       https://www.ebay.ch/itm/*
// @match       https://www.ebay.co.nz/itm/*
// @match       https://www.ebay.co.uk/itm/*
// @match       https://www.ebay.com.au/itm/*
// @match       https://www.ebay.com.hk/itm/*
// @match       https://www.ebay.com.my/itm/*
// @match       https://www.ebay.com.sg/itm/*
// @match       https://www.ebay.de/itm/*
// @match       https://www.ebay.es/itm/*
// @match       https://www.ebay.fr/itm/*
// @match       https://www.ebay.ie/itm/*
// @match       https://www.ebay.in/itm/*
// @match       https://www.ebay.it/itm/*
// @match       https://www.ebay.nl/itm/*
// @match       https://www.ebay.ph/itm/*
// @match       https://www.ebay.pl/itm/*
// @grant       none
// @version     1.11
// @author      pnppl
// @description Puts the item ID under the title with buttons for copying it and the cleaned URL
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/475038/eBay%20easy%20item%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/475038/eBay%20easy%20item%20ID.meta.js
// ==/UserScript==

const url = window.location.href;
const reItm = /.*\/([0-9]{12})/;
const itm = url.match(reItm)[1];
const reTLD = /^https:\/\/(?:www.)?(ebay\.[a-z]{2,3}(?:\.[a-z]{2,3})?)/i;
const tld = url.match(reTLD)[1];
const cleanURL = `https://${tld}/itm/${itm}`;
const titleMob = document.querySelector("#vi-frag-app-title");
const titleDesk = document.querySelector(".x-item-title");
const newHTML = `               \
    <style>                     \
        button:focus.userjs {   \
            background:lime;    \
        }                       \
    </style>                    \
    <div>                       \
        <p>                     \
            ${itm} <button class="userjs" onclick="navigator.clipboard.writeText('${itm}')">📋</button> <button class="userjs" onclick="navigator.clipboard.writeText('${cleanURL}')">🔗</button> \
        </p>                    \
    </div>                      \
`;

if (titleMob == null) {
    titleDesk.insertAdjacentHTML("afterend", newHTML);
} else {
    titleMob.insertAdjacentHTML("afterend", newHTML);
}