// ==UserScript==
// @name TwitterCashtag
// @namespace https://greasyfork.org/en/scripts/10315-twittercashtag
// @version    0.8
// @description  Add StockCharts, YahooFinance AND stockTwits links to any CashTag .
// @include https://www.twitter.com/*
// @include https://twitter.com/*
// @copyright  Daif Alotaibi E-mail: daif55@gmail.com
// @downloadURL https://update.greasyfork.org/scripts/10315/TwitterCashtag.user.js
// @updateURL https://update.greasyfork.org/scripts/10315/TwitterCashtag.meta.js
// ==/UserScript==

function appendLinksToTwitterCashtag() {
    $('a.twitter-cashtag:not(".CashTagAdded")').each(function(){
        $symbol = $('b',this).text();
        $links  = ' <span style="background:#eee">';
        $links += '<a style="color: #333367;" href="http://stockcharts.com/h-sc/ui?s='+$symbol+'">StockCharts</a>';
        $links += ' , <a style="color: #1D1DA3;" href="http://finance.yahoo.com/q?s='+$symbol+'">Yahoo</a>';
        $links += ' , <a style="color: #313131;" href="http://stocktwits.com/symbol/'+$symbol+'">StockTwits</a>';
        $links += '</span> ';
        $(this).after($links);
        $(this).addClass('CashTagAdded');
    });
}

window.setInterval( function() {
    appendLinksToTwitterCashtag();
}, 3000);
