// ==UserScript==
// @name        TalkBass price filter
// @namespace   thegarebear75@gmail.com
// @description Filters TalkBass for sale threads based on price
// @include     http://www.talkbass.com/forums/for-sale*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5340/TalkBass%20price%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/5340/TalkBass%20price%20filter.meta.js
// ==/UserScript==    

var FLOAT_REGEX = /\d+,?\d*(\.\d*)?/;
var PRICE_LOW_COOKIE_NAME = "talkbasspricefilter_pricelow";
var PRICE_HIGH_COOKIE_NAME = "talkbasspricefilter_pricehigh";
var HARD_FILTER_COOKIE_NAME = "talkbasspricefilter_hardfilter";

var getInput = function(promptString){
    //Prompts user to enter a price than can be converted to a float. 
    //Returns the value of the input converted to a float. Handles 
    //incorrect input by asking the user for a new entry.
    var acceptableInput =  false, priceString, priceVar;
    while(!acceptableInput){
        priceString = prompt(promptString).match(FLOAT_REGEX)[0]
            .replace(",", "");
        priceVar = parseFloat(priceString);
        if (isNaN(priceVar)){
            alert("Invalid input!");
        }
        else{
            acceptableInput = true;
        }
    }
    return priceVar;
};

var filterType = function(){
    //Asks the user whether she would like a hard or soft filter to be 
    //used. The hard filter eliminates threads without listed prices and 
    //threads with prices that cannot be converted to floats. The soft 
    //filter keeeps these threads. Returns true if hard filter is chosen 
    //or false if soft filter is chosen
    var acceptableInput = false;
    var hardFilter = false;
    while(!acceptableInput){
        var filterString = prompt("Would you like to use a HARD or " +
                                  "SOFT filter?").toUpperCase();
        switch(filterString){
            case "HARD":
                hardFilter = true;
                acceptableInput = true;
                break;
            case "SOFT":
                hardFilter = false;
                acceptableInput = true;
                break;
            default:
                alert("Invalid input!");
                break;
        }
    }
    return hardFilter;
};

var docCookies = {
/*\
|*|
|*|  :: cookies.js ::
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  Revision #1 - September 4, 2014
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
|*|
|*|  This framework is released under the GNU Public License, version 3 or 
|*|  later.
|*|
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path[, domain]])
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\*/
    getItem: function (sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(
            document.cookie.replace(
                new RegExp("(?:(?:^|.*;)\\s*" + 
                           encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, 
                                                            "\\$&") + 
                           "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { 
            return false; 
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? 
                        "; expires=Fri, 31 Dec 9999 23:59:59 GMT" :
                        "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + 
            encodeURIComponent(sValue) + sExpires + 
            (sDomain ? "; domain=" + sDomain : "") + 
            (sPath ? "; path=" + sPath : "") + 
            (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + 
            "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + 
            (sDomain ? "; domain=" + sDomain : "") + 
            (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        if (!sKey) { return false; }
        return (new RegExp("(?:^|;\\s*)" + 
                           encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, 
                                                            "\\$&") + 
                           "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
        var aKeys = document.cookie.replace(
            /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, 
            "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); 
        }
        return aKeys;
    }
};

var eraseAllCookies = function(){
    docCookies.removeItem(PRICE_LOW_COOKIE_NAME, "/", "talkbass.com");
    docCookies.removeItem(PRICE_HIGH_COOKIE_NAME, "/", "talkbass.com");
    docCookies.removeItem(HARD_FILTER_COOKIE_NAME, "/", "talkbass.com");
};

var createButton = function(){
    //Creates a button so that the filter parameters can be reset
    var input=document.createElement("input");
    input.type="button";
    input.value="Reset Filter";
    input.onclick = function(){
        eraseAllCookies();
        this.remove();
    };
    input.style.position = 'fixed';
    input.style.bottom = '240px';
    input.style.right = '80px';
    document.body.appendChild(input);
};

$(document).ready(function(){
    var priceLowCookieValue = docCookies.getItem(PRICE_LOW_COOKIE_NAME);
    var priceHighCookieValue = docCookies.getItem(PRICE_HIGH_COOKIE_NAME);
    var hardFilterCookieValue = docCookies.getItem(HARD_FILTER_COOKIE_NAME);
    var getPrices, hardFilter, priceLow, priceHigh;

    if(priceLowCookieValue === null || priceHighCookieValue === null || 
       hardFilterCookieValue === null){
        getPrices = true;

        while(getPrices){
            priceLow = getInput("Enter the lowest price you wish to see.");
            priceHigh = getInput("Enter the highest price you wish to see.");
            if(priceLow > priceHigh){
                alert("Your low price was greater than your high price!");
            }
            else{
                getPrices = false;
            }
        }

        hardFilter = filterType();
        docCookies.setItem(PRICE_LOW_COOKIE_NAME, priceLow.toString(), 24 * 3600,
                           "/", "talkbass.com");
        docCookies.setItem(PRICE_HIGH_COOKIE_NAME, priceHigh.toString(), 24 * 3600,
                           "/", "talkbass.com");
        if(hardFilter){
            hardFilterCookieValue = 'true';
        }
        else{
            hardFilterCookieValue = 'false';
        }
        docCookies.setItem(HARD_FILTER_COOKIE_NAME, hardFilterCookieValue, 24 * 3600,
                           "/", "talkbass.com");
    }
    else{
        priceLow = parseFloat(priceLowCookieValue);
        priceHigh = parseFloat(priceHighCookieValue);
        hardFilter = (hardFilterCookieValue == 'true');
    }

    createButton();

    if(hardFilter){
        $('li:not(:has(.pairsInline))').remove();
        $('.pairsInline:not(:has(span))').parents('li').remove();
        $('li[class*=prefix4]').remove();
        $('li[class*=prefix6]').remove();
        $('li[class*=prefix7]').remove();
    }

    //class pairsInline indicates the line under the thread titles that
    //contain the Price and Location information. The price itself is located 
    //in the only 'span' decendent of pairsInline 
    var prices = $('.pairsInline').find('span').contents(), price;

    for(var i = 0; i < prices.length; i++){
        price = prices[i].data.match(FLOAT_REGEX);
        if(price){
            price = parseFloat(price[0].replace(",",""));
            if(price < priceLow || price > priceHigh){
                //each thread is indicated by an 'li' selector, 'li' is not 
                //used for any other purpose
                $(prices[i]).parents('li').remove();
            }
        }
        else if(hardFilter){
            $(prices[i]).parents('li').remove();
        }
    }
});
