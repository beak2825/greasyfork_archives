// ==UserScript==
// @name       Steam Item Price Averager
// @namespace  https://greasyfork.org/scripts/4219-steam-item-price-averager
// @version    1.1
// @description  Takes the average of the last 10 items sold of the current item
// @include      http://steamcommunity.com/market/*
// @require    http://code.jquery.com/jquery-latest.js
// @copyright  2014, Nate
// @downloadURL https://update.greasyfork.org/scripts/4219/Steam%20Item%20Price%20Averager.user.js
// @updateURL https://update.greasyfork.org/scripts/4219/Steam%20Item%20Price%20Averager.meta.js
// ==/UserScript==

$(document).ready(function() {
    
    // Add table header
    $("#searchResults").find(".market_listing_table_header").first().children(".market_listing_right_cell").last().after('<div class="market_listing_right_cell" style="padding: 0 0.5em">AVG. PRICE</div>');
    $("#sellListings").find(".market_listing_table_header").first().children(".market_listing_right_cell").last().after('<div class="market_listing_right_cell" style="padding: 0 0.5em">AVG. PRICE</div>');
    
    var url = window.location.pathname;
    var pageType = getPageType(url);
    //console.log(url);
        
    if (pageType == "item") {
        var item = $(".market_listing_nav a:last-child").html();
		new Ajax.Request( 'http://steamcommunity.com/market/pricehistory/', {
            method: 'get',
            parameters: {
                appid: getAppIDItem(url),
                market_hash_name: item
            },
            onSuccess: function( transport ) { sumAverage(transport) },
            onFailure: function( transport ) { failed() }
        } );  
    } else if (pageType == "search") {
		// Get average price for each item
        $('#searchResults').find('.market_listing_item_name').each(function() {
            var item = $(this).text();
            var currItem = this;
            
            new Ajax.Request( 'http://steamcommunity.com/market/pricehistory/', {
                method: 'get',
                parameters: {
                    appid: getAppIDMulti(this),
                    market_hash_name: item
                },
                onSuccess: function( transport ) { sumAverage(transport, currItem, item) },
                onFailure: function( transport ) { failed(item) }
            } ); 
        });  
    } else {
		// Get average price for each item
        $('#sellListings').find('.market_listing_item_name').each(function() {
            var item = $(this).text();
            var currItem = this;
            
            new Ajax.Request( 'http://steamcommunity.com/market/pricehistory/', {
                method: 'get',
                parameters: {
                    appid: getAppIDMulti(this),
                    market_hash_name: item
                },
                onSuccess: function( transport ) { sumAverage(transport, currItem, item) },
                onFailure: function( transport ) { failed(item) }
            } ); 
        });  
    }
    
    
    function getPageType(url) {
        var splitURL = url.split("/");
        var pageType = splitURL[2];
        //console.log(pageType);
        if (pageType == "listings") {
            //console.log("item");
            return "item";
        } else if (pageType == "search") {
            //console.log("search");
            return "search";
        } else {
            //console.log("main");
            return "main";
        }
    }
    
    function getAppIDMulti(elem) {
        var a = $(elem).parent().parent().parent().attr('href');
        //console.log(a);
        var url = a.split("/");
        var appid = url[5];
        //console.log(appid);
        return appid;
    }
    
    function getAppIDItem(url) {
        var splitURL = url.split("/");
        var appid = splitURL[3];
        //console.log(appid);
        return appid;
    }
    
    function failed() {
     	console.log("Could not get price history for " + item);   
    }
    
    function sumAverage(transport, currItem, item) {
        // JSON
        var results = transport.responseText;
        
        // Print results - debugging
        //console.log(results);
        
        // Parse JSON
        var parsed = JSON.parse(results);
        
        // Store in array
        var arr = $.map(parsed, function(el) { return el; });

        // Number of sales
        //console.log(arr.length);
        
        // Variables
        var total = 0;
        var count = 10;
        
        for (var i=arr.length-1; i >= arr.length - count;i--) {
            // Get sale price
            var val = arr[i][1];
            // Add to total
            total = total + val
            // Value output - debugging
            //console.log("VALUE " + val);
        }
        
        // Calculate average
        var avg = parseFloat(total/count).toFixed(2);
        
        // Average output - debugging
        //console.log("AVERAGE " + avg);
        
        if (pageType == "item") {
            // Show on page
        	$(".item_desc_content").append('<div class="average_price" style="font-size: 1.2em"> Average price: <span style="font-size: 1.75em">$' + avg + '</span></div>');
        } else {
            // Show on page
            $(currItem).parent().parent().children(".market_listing_right_cell").last().after('<div class="market_listing_right_cell average_price" style="text-align: center; width: 80px"><span class="market_table_value" style="padding: 0 0.5em">$' + avg + '</span></span></div>');   
        }
        
    }
});