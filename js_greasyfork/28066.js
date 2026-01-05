// ==UserScript==
// @name           eBay sort by max price
// @description    Sort the items by the to price instead of the from price because sellers use this to put their items at the head of the list even when the real item is more expensive.
// @namespace      kwhitefoot@hotmail.com
// @include        http://www.ebay.com/sch/*
// @version        1.1
// @resource       license https://www.gnu.org/licenses
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/28066/eBay%20sort%20by%20max%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/28066/eBay%20sort%20by%20max%20price.meta.js
// ==/UserScript==

/*
Tested only on http://www.ebay.com/sch/*

Basic idea shamelessly ripped from the eBay Collection Sorter:
https://greasyfork.org/en/scripts/6120-ebay-collection-sorter by
Tophness: https://greasyfork.org/en/users/5680-tophness.

kwhitefoot@hotmail.com

Copyright 2017 Kevin Whitefoot

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


var debug = true;
var TAG = 'ebsbmp: ';
function dlog(msg) {
  if (debug) console.log(TAG + msg);
}

dlog('start');

try {
    // var prevY = 0;
    // windowscroll = setInterval(doscroll, 800);
    // function doscroll() {
    //     if (window.scrollMaxY !== prevY) {
    //         prevY = window.scrollMaxY;
    //         window.scrollTo(0, window.scrollMaxY);
    //     } else {
    //         clearInterval(windowscroll);
    //         window.scrollTo(0, 0);
    //         process();
    //     }
    // }

    process();

    // Get the item with class="sresult lvresult clearfix li shic".
    // Then extract the price and shipping using
    // getElementsByClassName on the item.
    function getPrices() {
        dlog( 'getPrices');
        var prices = new Array();
        var items = document.getElementsByClassName("sresult lvresult clearfix li shic");
        for (var i = 0; i < items.length; ++i) {
            var item = items[i];
            var priceSpanParent = item.getElementsByClassName('lvprice prc')[0];
            var priceSpan = priceSpanParent.firstElementChild;
            var priceSpanText = priceSpan.innerText.trim();
            dlog('pst: <' + priceSpanText + '>');
            var re = /\s+/;
            var priceSpanArray = priceSpanText.trim().split(re);
            dlog('psa: ' + priceSpanArray.length);
            var priceIndex;
            if (priceSpanArray.length == 5) {
                priceIndex = 4;
            } else {
                priceIndex = 1;
            }
            dlog('pi: ' + priceIndex);
            var price = getNumber(priceSpanArray[priceIndex]);
            dlog('price: ' + price);
            //var itemElement = element.parentNode.parentNode;
            var descriptionElement = item.getElementsByClassName('vip'); 
            var priceShipping = 0.0;
            var priceShippingElements = item.getElementsByClassName('fee');
            if (priceShippingElements.length > 0) {
                var priceShippingElement = priceShippingElements[0];
                var priceShippingText = priceShippingElement.innerText.trim();
                var priceShippingArray = priceShippingText.split(re);   
                priceShipping = getNumber(priceShippingArray[1]);
                dlog('priceShipping: ' + priceShipping);
            }
            prices.push(new Price(price, 
                                  priceShipping,
                                  descriptionElement.textContent,
                                  item));

        }
        
        return prices;
    }

    // Expects a price with a decimal point.  Copes with prices that
    // include a thousands separator.
    function getNumber(text) {
        return parseFloat(text.replace(',', ''));
    }


    function Price(price, 
                   priceShipping,
                   description,
                   item) {
        this.priceItem = price;
        this.priceShipping = priceShipping;
        this.description = description;
        this.listItem = item;
        this.price = function(withShipping) {
            if (withShipping) {
                dlog('price fun with ' + this.priceItem + ' ' + this.priceShipping);
                return this.priceItem + this.priceShipping;
            } else {
                dlog('price fun without ' + this.priceItem);
                return this.priceItem;
            }
        }
    }


    // sortType determines whether the sort will be asscending or
    // descending by multiplying the comparison result by plus of
    // minus one.
    function rearrange(prices,
                       sortType) {
        dlog('rearrange');
        var order = sortType.order;
        var withShipping = sortType.withShipping;
        dlog('order: ' + order + ' type: ' + typeof order); 
        dlog('withShipping: ' + withShipping + ' type: ' + typeof withShipping); 
        prices.sort(function (a, b) {
            var result = a.price(withShipping) - b.price(withShipping);
            return result * order;
        });
        //     var result = a.priceItem - b.priceItem;
        //     if (result == 0) {
        //         if (a.description < b.description) {
        //             result = -1;
        //         } else if (b.description < a.description) {
        //             result = +1;
        //         }
        //     }
        //     return result * order;
        // });
        
        // Now remove all the items from the list
        // var container = document.getElementById('ListViewInner');
        // for (var i = 0; i < prices.length; ++i) {
	//     var item = prices[i].listItem;
        //     dlog('remove item ' + prices[i].price(withShipping) + ' ' + item.className);
	//     container.removeChild(item);
        // }

        
        var container = document.getElementById('ListViewInner');
        removeItems(container);
        reinstate(prices, withShipping, container);
    }

    function removeItems(container) {
        dlog('removeItems ' + container.id);
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
    
    function reinstate(prices, withShipping, container) {
        
        // And put them back in the correct order.
        dlog('reinstate');
        for (var j = 0; j < prices.length; j++) {
            var item = prices[j].listItem;
            dlog('reinstate item ' + prices[j].price(withShipping) + ' ' + item.className);
            container.appendChild(item);
        }
    }
    function getSortType() {
        var url = document.location.search;
        var pricePlusShippingLowestFirst = '_sop=15';
        var pricePlusShippingHighestFirst = '_sop=16';
        var priceHighestFirst = '_sop=3';
        if (url.includes(pricePlusShippingLowestFirst)) {
            return {order: +1,
                    withShipping: true};
        } else if (url.includes(pricePlusShippingHighestFirst)) {
            return {order: -1,
                    withShipping: true};
        } else if (url.includes(priceHighestFirst)) {
            return {order: -1,
                    withShipping: false};
        }
        return {order: 0,
                withShipping: false};
    }

    function process() {
        var sortType = getSortType();
        dlog('sortType: ' + sortType);
        if (sortType.order !== 0) {
            var prices = getPrices();
            dlog("ps: " + prices.length);
            rearrange(prices, sortType);
        }
    }
    
} catch (ex){
    dlog("error: " + ex.message);
}

dlog('finish');
