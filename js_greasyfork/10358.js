// ==UserScript==
// @name YahooFinance
// @namespace https://greasyfork.org/en/scripts/10358-YahooFinance
// @version    0.4
// @description  Add StockCharts AND stockTwits links to YahooFinance .
// @include http://finance.yahoo.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @copyright  Daif Alotaibi E-mail: daif55@gmail.com
// @downloadURL https://update.greasyfork.org/scripts/10358/YahooFinance.user.js
// @updateURL https://update.greasyfork.org/scripts/10358/YahooFinance.meta.js
// ==/UserScript==


$(document).ready( function(){
    if($('div.title h2').length>0 ) {
        $symbol = $('div.title h2').text().match(/\((.+)\)/)[1];
        $links  = ' <span style="background:#eee">';
        $links += '<a style="color: #333367;" href="http://stockcharts.com/h-sc/ui?s='+$symbol+'">StockCharts</a>';
        $links += ' , <a style="color: #313131;" href="http://stocktwits.com/symbol/'+$symbol+'">StockTwits</a>';
        $links += '</span> ';
        $($('div.title h2')).after($links);
    }
});