// ==UserScript==
// @name         TORN - Set Calculator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Calculate the price of museum sets / price per point
// @author       Untouchable [1360035]
// @match        https://www.torn.com/imarket.php
// @require      http://cdnjs.cloudflare.com/ajax/libs/accounting.js/0.4.1/accounting.min.js
// @require      https://greasyfork.org/scripts/11365-library-for-intercepting-ajax-communications/code/Library%20for%20intercepting%20AJAX%20communications.js?version=65323
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/401975/TORN%20-%20Set%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/401975/TORN%20-%20Set%20Calculator.meta.js
// ==/UserScript==

// List item sets
var itemSets = [
    {
        name: "Plushie Set",
        points: 10,
        itemIds: ["186", "215", "187", "261", "618", "258", "273", "269", "266", "268", "281", "274", "384"]
    }, {
        name: "Flower Set",
        points: 10,
        itemIds: ["260", "617", "263", "272", "264", "271", "267", "277", "282", "276", "385"]
    }, {
        name: "Medieval Coin Set",
        points: 100,
        itemIds: ["450", "451", "452"]
    }, {
        name: "Vairocana Buddha",
        points: 100,
        itemIds: ["454"]
    }, {
        name: "Ganesha Sculpture",
        points: 250,
        itemIds: ["453"]
    }, {
        name: "Shabti Sculpture",
        points: 500,
        itemIds: ["458"]
    }, {
        name: "Scripts from the Quran Set",
        points: 1000,
        itemIds: ["455", "456", "457"]
    }, {
        name: "Senet Game Set",
        points: 2000,
        itemIds: ["460", "460", "460", "460", "460", "461", "461", "461", "461", "461", "462"]
    }, {
        name: "Egyptian Amulet",
        points: 10000,
        itemIds: ["459"]
    }];

function itemsLoaded(items) {

    $('#item-set-container').remove()
    addStyles();
    drawFilterBar();
    setInitialValue();

    // Show results on page (attempt to find container, if it's not there we create it)
    var container = $('#setCalculator');
    if (!container.length) {
        container = $('<div>').attr('id', 'setCalculator').addClass('msg right-round');
        var wrapper = $('#item-set-container-inside');
        wrapper.append(container);
    }

    // Clear text
    container.empty();

    // Loop over itemsets and create a result message
    var setResults = [];

    $.each(itemSets, function(i, itemSet) {
        var sum = 0;
        $.each(items, function(j, item) {

            // Lookup how many times this item is required in this given set
            var occurence = $.grep(itemSet.itemIds, function (itemId) {
                return itemId === item.itemID;
            }).length;

            // We add the total price for this item
            sum += (parseInt(item.price) * occurence);
        });

        if (sum > 0) {

            setResults.push({
                set: itemSet,
                totalCost: sum,
                individualCost: sum/itemSet.points
            });
        }
    });

    // Show message on page
    if (setResults.length) {

        // Sort sets from cheap to expensive
        var sortedResults = setResults.sort(function(a, b) {
            return a.individualCost > b.individualCost;
        });

        // Generate final message
        var message = sortedResults.map(function(setResult) {
            return setResult.set.name + ": <b>" + accounting.formatMoney(setResult.totalCost, "$", 0) +
                   "</b> - <b>" + accounting.formatMoney(setResult.individualCost, "$", 0) + "</b> per point <br/>";
        });

        // Append the message to the container
        container.append($('<span class="pad">').html(message));

        container.append($('<br/>'));
        container.append($('<hr>'));
        container.append($('<br/>'));

        items.forEach((itm) => {
            console.log(itm);
            if(setResults[0].set.itemIds.includes(itm.itemID)){
                container.append($('<span class="pad" style="padding-right:10px">').html(itm.itemName.replace(/ /g,'&nbsp;') + ':&nbsp;<b>$' + itm.minPrice + '</b> '));
            }
        });

    } else {

        // No sets were present on this page
        container.append($('<span>').html('No sets available.'));
    }
};



// Set up interceptor
var AjaxInterceptor = require("ajax-intercept");
AjaxInterceptor.addResponseCallback(function(xhr) {
    if (xhr.responseURL.includes("imarket.php?rfcv=")) {
        var items = JSON.parse(xhr.response);
        itemsLoaded(items);
    }
});

// Proxify XHR to fire the above callbacks
AjaxInterceptor.wire();

/**
 * Creates and draws the filter bar onto the dom
 */
function drawFilterBar() {
    // Creating the filter bar and adding it to the dom.
    let element = $(`
  <div class="item-set-container m-top10" id="item-set-container">
    <div class="title-gray top-round">Museum Set Pricing</div>

    <div class="cont-gray p10 bottom-round">

      <div id="item-set-container-inside"></div>

    </div>
  </div>`);

    $(".main-market-page").before(element); // <- Adding to the dom.
}

/**
 * Retrieves the initial values last used out of the cache and sets them
 */
function setInitialValue() {
    let storedFilters = GM_getValue('storedFilters', {});
    let filterContainer = $(".filter-container")

    for (let filter in storedFilters) {
        let domFilter = $(filterContainer).find(`[name="${filter}"]`);
        domFilter.eq(0).val(storedFilters[filter]);
        domFilter.eq(1).prop('checked', true);
    }
}

function addStyles() {
    GM_addStyle(`
    .pad {
        line-height:2;
     }
    .textbox {
        padding: 5px;
        border: 1px solid #ccc;
        width: 100px;
        text-align: left;
        height: 16px;
    }
  `);
}