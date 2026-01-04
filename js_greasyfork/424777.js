// ==UserScript==
// @name         torn-tools-stocks
// @version      0.30
// @description  torn stocks tool
// @match        https://www.torn.com/page.php?sid=stocks
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @namespace    https://greasyfork.org/users/108911
// @downloadURL https://update.greasyfork.org/scripts/424777/torn-tools-stocks.user.js
// @updateURL https://update.greasyfork.org/scripts/424777/torn-tools-stocks.meta.js
// ==/UserScript==

const original_fetch = fetch;

var _dataStocks = {};

unsafeWindow.fetch = async (input, init) => {
    const response = await original_fetch(input, init);
    const response_json = await response.json();

    console.log(response_json);

    if(response_json['stocks']){
        /*
        $.each(response_json['stocks'], function(i, v) {
            console.log('"'+v.profile.acronym+'":{name:"'+v.profile.name+'", id:"'+v.id+'"}');
        })
        */

        var shareTotalVal = 0;
        var shareTotalPft = 0;
        var nextDividend;

        $.each(response_json['stocks'], function(i, v){
            var shareVal = v.sharesPrice.chartData[1].value;
            var shareValOld = v.sharesPrice.chartData[0].value;
            var bbVal = shareVal * v.dividends.requirements.forOne;
            var fxDesc = 'BB: ' + formatNumberA(bbVal) + ' (' + v.dividends.bonus.default + ')';
            var fxName = v.profile.name;

            v.fxdata = {stockpct:0, profit:0, changepct:-999};
            v.fxdata.stockpct = ((shareVal-shareValOld)/shareVal)*100;

            if(v.userOwned.sharesAmount > 0){
                var pm = 0;
                $.each(v.userOwned.transactions, function(iT, vT){
                    pm += (vT.amount * vT.boughtPrice);
                });
                pm = (pm / v.userOwned.sharesAmount).toFixed(2);

                var totBuy = v.userOwned.sharesAmount * pm;
                var totNow = v.userOwned.sharesAmount * shareVal;

                v.fxdata.profit    = (totNow-totBuy);
                v.fxdata.changepct = (v.fxdata.profit/totNow)*100;
                
                fxDesc = 'PM: ' + pm + '; Pft.: ' + formatNumberA(v.fxdata.profit) + ' (' + formatNumber2(v.fxdata.changepct) + '%); ' + fxDesc;

                shareTotalVal += (shareVal * v.userOwned.sharesAmount);
                shareTotalPft += v.fxdata.profit;

                if(v.dividends.type == 'active' && v.dividends.increment.current >= 1){
                   if(nextDividend == undefined || (v.dividends.progress.total-v.dividends.progress.current) < (nextDividend.dividends.progress.total-nextDividend.dividends.progress.current)){
                      nextDividend = v;
                   }
                }
            }

            v.profile.name = fxName;
            v.profile.description = fxDesc;

            _dataStocks[v.profile.name] = v;

            response_json['stocks'][i] = v;
        });

        // painel custom
        var shareTotalPftPct = (shareTotalPft/shareTotalVal)*100;
        var fxPainel =
            "<strong>Total:</strong> $"+formatNumber(shareTotalVal)+"; "+
            "<strong>Profit:</strong> $"+formatNumber(shareTotalPft)+ " (" + formatNumber2(shareTotalPftPct) + "%); ";

        if(nextDividend !== undefined){
            fxPainel += "<strong>Next Dividend:</strong> ["+nextDividend.profile.acronym+'] '+nextDividend.dividends.bonus.current+" in "+formatNumber(nextDividend.dividends.progress.total-nextDividend.dividends.progress.current)+" day(s); ";
        }

        fxPainel += "<br><br><hr class='page-head-delimiter'>";
        $("#fxPainel").html(fxPainel);
    }

    const b = new Blob([JSON.stringify(response_json, null, 2)], {type : 'application/json'})
    return new Response(b);
}

$(document).ready(function(){
    'use strict';

    $("div#stockmarketroot").before("<div id='fxPainel'>");

    var fLoop = function(){
        var oLoop = $("div#stockmarketroot").find("ul[role='tablist']");        

        if(oLoop.length > 0) clearInterval(iLoop1m);

        for(var i = 0; i < oLoop.length; i++) {
            var o = oLoop.eq(i);
            var stockName = o.find("div[class^=nameContainer]").html();
            stockName = stockName.replace('&amp;','&');
            var stockData = _dataStocks[stockName];

            //var stockPrice = o.find("li[class^=stockPrice]").attr('aria-label'); stockPrice = stockPrice.split('Share stock price: $')[1];
            //var stockOwned = o.find("li[class^=stockOwned]").attr('aria-label'); stockOwned = stockOwned.split(' ')[1];

            if(stockData.userOwned && stockData.userOwned.sharesAmount > 0){
                if(o.find('li[class^="stockOwned"]').find('p[class="fx"]').length == 0){
                    o.find('li[class^="stockOwned"]').append('<p class="fx"></p>');
                }
                if(stockData.fxdata.profit > 0){
                    o.find('li[class^="stockOwned"]').find('p[class="fx"]').html('<font color=#5c940d>'+formatNumberA(stockData.fxdata.profit)+'('+formatNumber1(stockData.fxdata.changepct) + '%)</font>');
                } else {
                    o.find('li[class^="stockOwned"]').find('p[class="fx"]').html('<font color=#de5b30>'+formatNumberA(stockData.fxdata.profit)+'('+formatNumber1(stockData.fxdata.changepct) + '%)</font>');
                }            
            }
        }
        //console.log('loop');
    }

    if($(window).width() < 700) return; // no tablet, estraga o layout

    var iLoop1m = setInterval(fLoop, 1000); // 1s
});

function formatNumber1(n){
    return numeral((n).toFixed(2)).format('0,0.0');
}

function formatNumber2(n){
    return numeral((n).toFixed(2)).format('0,0.00');
}

function formatNumber(n){
    return numeral((n).toFixed(0)).format('0,0');
}

function formatNumberA(n){
    return numeral((n).toFixed(0)).format('0,0[.]00a');
}