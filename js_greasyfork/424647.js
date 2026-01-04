// ==UserScript==
// @name         Custom Script For booth.pm - hide choosen spammers
// @namespace    https://www.fiverr.com/users/luhari
// @version      0.2
// @description  Hides choosen sellers cards.
// @author       Luhari - @luhari98
// @match        https://booth.pm/*
// @grant        none
// @create       2021-03-28
// @supportURL   https://bit.ly/3lLDquw
// @run-at       document-begin
// @downloadURL https://update.greasyfork.org/scripts/424647/Custom%20Script%20For%20boothpm%20-%20hide%20choosen%20spammers.user.js
// @updateURL https://update.greasyfork.org/scripts/424647/Custom%20Script%20For%20boothpm%20-%20hide%20choosen%20spammers.meta.js
// ==/UserScript==

// Array of sellers that you want to hide
// Notice that the last seller doesn't have a commma or else the script will fail
var hidden_sellers_url = [
    'https://animedakimakura.booth.pm',
    'https://zhaiyou.booth.pm',
    'https://cytmnew.booth.pm',
    'https://22jigen.booth.pm',
    'https://lenovogg.booth.pm'
];

(function() {
    'use strict';

    console.log('%cSTART SCRIPT', 'color:cyan');

    var cards = document.getElementsByClassName('item-card__shop-name-anchor');

    for (var i = 0; i < cards.length; ++i) {
        if (hidden_sellers_url.includes(cards[i].href.slice(0,-1))) {
            cards[i].parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        }

    }

    console.log('%cEND SCRIPT', 'color:cyan');
})();