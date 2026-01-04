// ==UserScript==
// @name         MLB The Show Nation Profit Calculator
// @namespace    https://greasyfork.org/en/users/177153-anthoney-kalasho
// @version      2018.4.5.2
// @description  Calculates the current profitability of a card and displays it on search page
// @author       AnthoneyKalasho
// @match        https://mlb19.theshownation.com/community_market/listings*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/382242/MLB%20The%20Show%20Nation%20Profit%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/382242/MLB%20The%20Show%20Nation%20Profit%20Calculator.meta.js
// ==/UserScript==


(function() {




    'use strict';

    //var toTableBtn = '<button class="button toTableButton">To Table</button>';
    //$(".marketplace-main-heading > h2").append(toTableBtn);

    //$('.toTableButton').click(function(){

    var objectArray = new Array();


    $('div.marketplace-filter-item').each(function(){

        var buyNow = $(this).find(".price").eq(0).text();
        buyNow = buyNow.replace("Buy Now","");
        buyNow = buyNow.replace(" ","");
        buyNow = buyNow.replace(/\n|\r/g, "");
        buyNow = buyNow.replace(",", "");

        buyNow = parseFloat(buyNow);

        var sellNow = $(this).find(".price").eq(1).text();
        sellNow = sellNow.replace("Sell Now","");
        sellNow = sellNow.replace(" ","");
        sellNow = sellNow.replace(/\n|\r/g, "");
        sellNow = sellNow.replace(",", "");
        sellNow = parseFloat(sellNow);

        var difAfterTax = (buyNow - (buyNow * 0.1)) - sellNow;
        difAfterTax = precisionRound(difAfterTax , 2);

        var color = "green";


        var percentDiff = (difAfterTax/sellNow)*100;
        percentDiff = precisionRound(percentDiff , 2);

        if(percentDiff < 5){
            color = "red";
        } else if (percentDiff < 10){
            color = "yellow";
        }
        percentDiff = percentDiff.toString() + "%";


        if(percentDiff == "-100%"){
            percentDiff = "N/A";
            color = "red";
        }


        var percentDiffHTML = '<div class="marketplace-filter-item-stats-block price" style="color: '+ color+ '";><span class="label">% Difference:</span></span>'+percentDiff+'</div>';
        var difAfterTaxHTML = '<div class="marketplace-filter-item-stats-block price" style="color: '+ color+ '";><span class="label">Buy-Sell:</span></span>'+difAfterTax+'</div>';

        $(this).find(".marketplace-filter-item-stats").append(difAfterTaxHTML);
        $(this).find(".marketplace-filter-item-stats").append(percentDiffHTML);


        var name = $(this).find(".marketplace-filter-item-name > a").text();
        var url =  $(this).find(".marketplace-filter-item-name > a").attr('href');
        var imgUrl = $(this).find(".marketplace-filter-item-picture > img").attr('src');
        var star = $(this).find(".marketplace-filter-item-favorite").prop('outerHTML');
        var ovr =  $(this).find(".overall").text();
        ovr = ovr.replace("OVR","");
        ovr = ovr.replace(" ", "");
        ovr = ovr.replace(/\n|\r/g, "");
        var series = $(this).find(".series").text();
        var rarity = $(this).find(".rarity").text();
        var pos = $(this).find(".position").text();
        var team = $(this).find(".team").text();
        var set = $(this).find(".set").text();
        var row = {
            url: url,
            name: name,
            imgUrl: imgUrl,
            star: star,
            ovr: ovr,
            series: series,
            rarity: rarity,
            pos: pos,
            team: team,
            set: set,
            perDif: percentDiff,
            difAfterTax: difAfterTax,
            color: color,
            buyNow: buyNow,
            sellNow: sellNow,
        };
        objectArray.push(row);


    });

    $('div.marketplace-filter-item').each(function(){
        $(this).hide();
    });

    var tableHTML = '<table class="sortable" style="width:100%; font-size: 13px;"><tr><th>Name</th><th>Buy Now</th><th>Sell Now</th><th>Overall</th><th>Series</th><th>Rarity</th><th>Position</th><th>Team</th><th>Set</th><th>Buy-Sell</th><th>% Difference</th><th>Sold/hour</th></tr>';

    for (var j = 0; j < objectArray.length; j++){
        var thisRow = '<tr><td class="nameRow"><a href="'+objectArray[j].url+'">'+objectArray[j].name+'</a></td><td class="buyNowRow">'+objectArray[j].buyNow+'</td><td class="sellNowRow">'+objectArray[j].sellNow+'</td><td>'+objectArray[j].ovr+'</td><td>'+objectArray[j].series+'</td><td>'+objectArray[j].rarity+'</td><td>'+objectArray[j].pos+'</td><td>'+objectArray[j].team+'</td><td>'+objectArray[j].set +'</td><td style="color: '+ objectArray[j].color + '" class="datRow">'+objectArray[j].difAfterTax +'</td><td style="color: '+ objectArray[j].color + '" class="pdRow">'+objectArray[j].perDif +'</td><td style="color: '+ objectArray[j].color + '"class="soldInHourRow">0</td></tr>';
        tableHTML = tableHTML + thisRow;
    }
    tableHTML = tableHTML + '</table>';
    //style="color: '+ color+ '"


    //<tr><td>January</td><td>$100</td></tr></table>';
    $(".marketplace-filter-disclaimer").append('<script type="text/javascript" src="https://www.kryogenix.org/code/browser/sorttable/sorttable.js">');
    $(".marketplace-filter-disclaimer").append(tableHTML);

    var btn = '<button class="button updateButton">Update prices</button>';
    $(".marketplace-main-heading > h2").append(btn);


    $('.updateButton').click(function(){
        $('.sortable > tbody  > tr').each(function() {

            var mBuyNowPrice;
            var mSellNowPrice;
            var mSoldInHour;


            var rowURL = $(this).find(".nameRow > a").attr('href');
            //var mBuyNowPrice;
            //var mSellNowPrice;

            $(this).find(".buyNowRow").replaceWith('<td class="buyNowRow">'+ 0 +'</td>');
            $(this).find(".sellNowRow").replaceWith('<td class="sellNowRow">'+ 0 +'</td>');

            $.ajax({ url: rowURL, async: false, success: function(data) {
                //$(this).find(".buyNowRow").replaceWith('<td class="buyNowRow">'+ mBuyNowPrice +'</td>');
                //$(this).find(".sellNowRow").replaceWith('<td class="sellNowRow">'+ mSellNowPrice +'</td>');
                mBuyNowPrice  = parseInt($(jQuery.parseHTML(data)).find('.marketplace-card-order-now form button').text().split('Sell')[0].replace(/\D/g,''));
                mSellNowPrice = parseInt($(jQuery.parseHTML(data)).find('.marketplace-card-order-now form button').text().split('Sell')[1].replace(/\D/g,''));

                //Credit to /u/sreyemnayr for the below block


                var dates = [];
                dates = [];
                $(jQuery.parseHTML(data)).find('.completed-order').each(function(i){var thisDate = new Date($(this).find('.date').text() + ' UTC'); dates.push(thisDate);});
                var numHour = 0;
                var numThreeHours = 0;
                var numToday = 0;
                var now = new Date(Date.now());
                var today = new Date(Date.now());
                var rate = 0;
                today.setHours(0);
                var OneHourAgo = new Date(Date.now());
                OneHourAgo.setHours(OneHourAgo.getHours()-1);
                for(var iii=0,lll=dates.length;iii<lll;iii++){
                    if(dates[iii] > OneHourAgo)
                    {
                        numHour++;

                    }
                    if(dates[iii] > now-(1000*60*60*3))
                    {
                        numThreeHours++;

                    }
                    if(dates[iii] > today)
                    {
                        numToday++;

                    }
                }
                now = new Date(Date.now());
                var minDate=new Date(Math.min.apply(null,dates));
                var diffMins = Math.round( (now-minDate) / 60000 );


                if (dates.length >= diffMins){
                    rate = (dates.length / diffMins);
                    mSoldInHour = parseFloat(rate);
                    mSoldInHour = parseFloat(rate*60);
                    mSoldInHour = parseInt(precisionRound(mSoldInHour, 2));


                }
                else {
                    //rate = (diffMins / dates.length)/60.0;
                    mSoldInHour = numHour;
                }

                //Credit to /u/sreyemnayr for the above block





                console.log('Buy Now  - '+ mBuyNowPrice);
                console.log('Sell Now - '+ mSellNowPrice);


                //console.log('Buy Now  - '+ mBuyNowPrice);
                //console.log('Sell Now - '+ mSellNowPrice);



            }});
            console.log('---');

            //console.log($(this).find(".buyNowRow").html())

            $(this).find(".buyNowRow").replaceWith('<td class="buyNowRow">'+ mBuyNowPrice +'</td>');
            $(this).find(".sellNowRow").replaceWith('<td class="sellNowRow">'+ mSellNowPrice +'</td>');


            var mDifAfterTax = (mBuyNowPrice - (mBuyNowPrice * 0.1)) - mSellNowPrice;
            mDifAfterTax = precisionRound(mDifAfterTax , 2);

            var mColor = "green";


            var mPercentDiff = (mDifAfterTax/mSellNowPrice)*100;
            mPercentDiff = precisionRound(mPercentDiff , 2);

            if(mPercentDiff < 5){
                mColor = "red";
            } else if (mPercentDiff < 10){
                mColor = "yellow";
            }
            mPercentDiff = mPercentDiff.toString() + "%";


            if(mPercentDiff == "-100%"){
                mPercentDiff = "N/A";
                mColor = "red";
            }





            $(this).find(".datRow").replaceWith('(<td style="color: '+ mColor + '" class="datRow">'+ mDifAfterTax +'</td>');
            $(this).find(".pdRow").replaceWith('<td style="color: '+ mColor + '" class="pdRow">'+ mPercentDiff +'</td>');
            $(this).find(".soldInHourRow").replaceWith('<td style="color: '+ mColor + '" class="soldInHourRow">'+ mSoldInHour +'</td>');



            //<td style="color: '+ objectArray[j].color + '" class="datRow">'+objectArray[j].difAfterTax +'</td><td style="color: '+ objectArray[j].color + '" class="pdRow">'+objectArray[j].perDif +'</td>

            //$.get(rowURL, function( data ) {
                //console.log($(this).attr("href"));
                //mBuyNowPrice = parseInt($($('.marketplace-card-order-now form button')[0]).text().replace(/,/g,"").match(/\d+/));
                //mSellNowPrice = parseInt($($('.marketplace-card-order-now form button')[1]).text().replace(/,/g,"").match(/\d+/));
            //});



        });

    });
    //});

})();

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}



$(document).ready(function(){

});