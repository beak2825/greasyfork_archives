// ==UserScript==
// @name         Binance SortBalances
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows you to sort balances by BTC value on binance balances page.
// @author       You
// @match        https://*.binance.com/userCenter/balances.html*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/379881/Binance%20SortBalances.user.js
// @updateURL https://update.greasyfork.org/scripts/379881/Binance%20SortBalances.meta.js
// ==/UserScript==


//Credit:
//  Taken from https://github.com/where-are-the-faces/binance-enhancement-suite

//Licence:
//  GPL-3.0

const CLASS_SYMBOL = "coin";
const CLASS_NAME = "fullName";
const CLASS_TOTAL = "total";
const CLASS_AVAILABLE = "useable";
const CLASS_INORDER = "locked";
const CLASS_BTCVAL = "equalValue";

const CLASS_WRAPPER = "accountInfo-lists";
const CLASS_HEADER = "th";
const CLASS_ITEM = "td";
const CLASS_ARROW = "icon-die";

const ARROW_DOWN = "\u25BC";
const ARROW_UP = "\u25B2";
const PIE_SYMBOL = "\u25D4";

const USD = "usd";
const BTC = "btc";
const ID_CHECKBOX_USD = "checkBoxUSD";

const S_CURRENCY = "currency";
const S_MIN_BALANCE = "minBalance";
const S_HIDE_CHECKED = "hideChecked";



var curSort = null;

function sort(selector, asc){
    var wrapper = $("." + CLASS_WRAPPER);
    var li = wrapper.children("." + CLASS_ITEM);

    li.detach().sort(function(a,b){
        aVal = $(a).find("." + selector).text();
        bVal = $(b).find("." + selector).text();

        //parse strings that represent floats
        if (selector == CLASS_TOTAL || selector == CLASS_AVAILABLE || selector == CLASS_INORDER || selector == CLASS_BTCVAL){
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
        }

        order = asc ? (-1) : (1);
        if (aVal == bVal) return 0;
        if (aVal > bVal) return order * 1;
        if (aVal < bVal) return order * -1;
    });
    wrapper.append(li);

    setArrow(selector, asc);

    curSort = [selector, asc]; //save current sort type, order
}

function setArrow(selector, asc) {

    $("." + CLASS_ARROW).hide(); //hide binance's arrow icon

    var header = $("." + CLASS_HEADER);

    //remove arrow from previously active header
    if (curSort != null){
        var prev = header.find("." + curSort[0]);
        prev.text(prev.text().replace(ARROW_UP,"").replace(ARROW_DOWN,"").trim());
    }

    //add arrow to current header, depending on sort direction
    var curHeader = header.find("." + selector);
    curHeader.text(curHeader.text() + " " + (asc ? ARROW_UP : ARROW_DOWN));
}

 $(window).on('load', function () {
    sort(CLASS_BTCVAL, true);
    var header = $("." + CLASS_HEADER);
    var classes = [CLASS_SYMBOL, CLASS_NAME, CLASS_TOTAL, CLASS_AVAILABLE, CLASS_INORDER, CLASS_BTCVAL];

    //Give each header a click event that will sort coins by appropriate value
    classes.forEach(function(c){
        header.find("." + c).click = null;
        header.find("." + c).click(function(){
            sort(c, curSort[0] == c ? !curSort[1] : false); //toggle if sorting on same header, else default to desc
        });
        header.find("." + c).css({"cursor":"pointer"});
    });

});