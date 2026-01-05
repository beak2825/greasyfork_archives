// ==UserScript==
// @name        Better Stocktwits
// @description Adds links to various financial outlets to stocktwit stock pages
// @author      dividendnoob.com
// @version     0.1
// @include     http*://stocktwits.com/symbol/*
// @include     http*://*.stocktwits.com/symbol/*
// @namespace   DividendNoob    
// @downloadURL https://update.greasyfork.org/scripts/19203/Better%20Stocktwits.user.js
// @updateURL https://update.greasyfork.org/scripts/19203/Better%20Stocktwits.meta.js
// ==/UserScript==


//Link Location URL's
var NASDAQ = "http://www.nasdaq.com/symbol/";
var GOOGLE = "https://www.google.com/finance?q=";
var YAHOO = "https://beta.finance.yahoo.com/quote/";
var FINVIZ = "http://www.finviz.com/quote.ashx?t=";
var SALPHA = "http://seekingalpha.com/symbol/";

//Get the div tag where we want to add our links. This will not work with IE 8 or before.
var x = document.getElementsByClassName("ticker-container");

//Parse the stock symbol from the URL
var symbol = window.location.pathname.match(/\/symbol\/(.*)/)[1];

//Add the Links
for (i = 0; i < x.length; i++) {
    x[i].innerHTML = x[i].innerHTML + "<b>Financials:</b>&nbsp;" + 
        "<a href='" + NASDAQ + symbol +"' target='_blank'>Nasdaq</a>" + "&nbsp;|&nbsp;" +
        "<a href='" + GOOGLE + symbol +"' target='_blank'>Google Finance</a>" + "&nbsp;|&nbsp;" +
        "<a href='" + YAHOO + symbol + "' target='_blank'>Yahoo Finance</a>" + "&nbsp;|&nbsp;" +
        "<a href='" + FINVIZ + symbol +"' target='_blank'>Finviz</a>" + "&nbsp;|&nbsp;" +
         "<a href='" + SALPHA + symbol +"' target='_blank'>Seeking Alpha</a>";
}