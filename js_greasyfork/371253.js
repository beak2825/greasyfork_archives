// ==UserScript==
// @name Torn Set Calculator
// @version 0.5b
// @description Calculates prices of plushie and flower sets
// @author MrHat / foilman
// @namespace MrHat.Torn
// @require http://cdnjs.cloudflare.com/ajax/libs/accounting.js/0.4.1/accounting.min.js
// @match http://www.torn.com/imarket.php*
// @match https://www.torn.com/imarket.php*
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371253/Torn%20Set%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/371253/Torn%20Set%20Calculator.meta.js
// ==/UserScript==


//Jox Added - always display prices
GM_addStyle('ul.m-items-list>li>div.title>span.minprice{ display: inline !important;}');
GM_addStyle('ul.m-items-list>li>div.title>span.searchname{ display: none !important;}');

// List item sets
var itemSets = [
    {
        name: "Plushie Set",
        points: 10,
        itemIds: ["186", "215", "187", "261", "618", "258", "273", "269", "266", "268", "281", "274", "384"]
    }, {
        name: "Exotic Flower Set",
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
    
    // Show results on page (attempt to find container, if it's not there we create it)
    var container = $('#setCalculator');
    if (!container.length) {
        container = $('<div>').attr('id', 'setCalculator').addClass('msg right-round');

        var wrapper = $('<div>').addClass('info-msg border-round').html($('<i>').addClass('info-icon'));
        wrapper.append(container);
        wrapper.prependTo($('.main-market-page'));
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
            return "One " + setResult.set.name + " costs <b>" + accounting.formatMoney(setResult.totalCost, "$", 0) + "</b>. This equals to <b>" + accounting.formatMoney(setResult.individualCost, "$", 0) + "</b> per point.<br/>";
        });
        
        // Append the message to the container
        container.append($('<span>').html(message));
    } else {
        
        // No sets were present on this page
        container.append($('<span>').html('No sets available.'));
    }
};

$(document).ajaxComplete(function(e,xhr,settings){
    var marketRegex = /^imarket.php\?rfcv=(\d+)$/;
    if (marketRegex.test(settings.url)) {
        
         // Process the items and their prices
        var items = JSON.parse(xhr.responseText);
        if (items) itemsLoaded(items);
    }
});
