// ==UserScript==
// @name         Stock Market Shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.torn.com/stockexchange.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398491/Stock%20Market%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/398491/Stock%20Market%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let portfolio = document.querySelectorAll('.stock-main-wrap .item-wrap .logo a');
    let market = document.querySelectorAll('.stock-list .item .acc-header');

    let stocks = market.length > 0 ? market : portfolio;

    let nextStock = stocks.length;

    let linkNext = document.createElement('a');
    linkNext.href = '#';
    linkNext.innerHTML = 'NEXT SHARE';
    linkNext.addEventListener('click', e => {
        e.preventDefault();

        nextStock++
        if(nextStock >= stocks.length){
            nextStock = 0;
        }

        if(stocks[nextStock].wasClicked){
            stocks[nextStock].wasClicked = false;
        }
        stocks[nextStock].click();
    });

    let linkPrev = document.createElement('a');
    linkPrev.href = '#';
    linkPrev.innerHTML = 'PREV SHARE';
    linkPrev.addEventListener('click', e => {
        e.preventDefault();

        nextStock--;
        if(nextStock < 0){
            nextStock = stocks.length - 1;
        }

        if(stocks[nextStock].wasClicked){
            stocks[nextStock].wasClicked = false;
        }
        stocks[nextStock].click();
    });

    document.querySelector('.content-title').appendChild(linkNext);
    document.querySelector('.content-title').appendChild(linkPrev);
})();