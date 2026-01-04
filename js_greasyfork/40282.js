// ==UserScript==
// @name         MLB The Show Nation Order Helper
// @namespace    https://greasyfork.org/en/users/8332-sreyemnayr
// @version      2018.4.4.2
// @description  Detects if your orders are outbid.  If you grant notification permissions, it will send a notification to your desktop!
// @author       sreyemnayr
// @match        https://mlb18.theshownation.com/orders
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40282/MLB%20The%20Show%20Nation%20Order%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/40282/MLB%20The%20Show%20Nation%20Order%20Helper.meta.js
// ==/UserScript==
//var notified = false;

function cardData(b){
    var buyNow = parseInt($($(b).find('.marketplace-card-order-now form button')[0]).text().replace(/,/g,"").match(/\d+/));
    var sellNow = parseInt($($(b).find('.marketplace-card-order-now form button')[1]).text().replace(/,/g,"").match(/\d+/));
    var profitMargin = parseInt(buyNow * 0.90 - sellNow);
    var rating = $($(b).find('.overall')[0]).text();
    var buyForm = $(b).find('#create-buy-order-form')[0];
    var sellForm = $(b).find('#create-sell-order-form')[0];
    var cardImage = $(b).find('.actionshot')[0].src;
    var teamLogo = $(b).find('.team img')[0].src;
    var cardClass = '';
    var shield = '';
    if (rating <= 64){ cardClass = 'common'; shield = 'https://s3.amazonaws.com/mlb-theshownation/tsn18/3/img/cards/shield-common.png';}
    else if (rating <= 74){ cardClass = 'bronze'; shield = 'https://s3.amazonaws.com/mlb-theshownation/tsn18/3/img/cards/shield-bronze.png'; }
    else if (rating <= 79){ cardClass = 'silver'; shield = 'https://s3.amazonaws.com/mlb-theshownation/tsn18/3/img/cards/shield-silver.png'; }
    else if (rating <= 85){ cardClass = 'gold'; shield = 'https://s3.amazonaws.com/mlb-theshownation/tsn18/3/img/cards/shield-gold.png'; }
    else { cardClass = 'diamond'; shield = 'https://s3.amazonaws.com/mlb-theshownation/tsn18/3/img/cards/shield-diamond.png';}

    var sellable = parseInt($($(b).find('.marketplace-card-owned')[1]).text().match(/\d+/g));
    return {
        'buyNow': buyNow,
        'sellNow': sellNow,
        'profitMargin': profitMargin,
        'rating': rating,
        'buyForm': buyForm,
        'sellForm': sellForm,
        'cardImage': cardImage,
        'teamLogo': teamLogo,
        'cardClass': cardClass,
        'shield': shield,
        'sellable': sellable
    };

}

var notifiedURL = '';
var myTimeout;
var firstTime = {};
var firstTimeSell = {};
var notified = {};
var notifiedSell = {};
var helperFrame;
var myStubs = 0;

var gotOne = false;
if(localStorage.autobid){
var autobid = true;
}
else
{
    var autobid = false;
}
if(localStorage.autobuy){
var autobuy = true;
}
else
{
    var autobuy = false;
}

var autobuyUrls = ['https://mlb18.theshownation.com/community_market/listings/27237-MLB_Card-aaron-hicks',
                  'https://mlb18.theshownation.com/community_market/listings/27319-MLB_Card-kevin-pillar',
                  'https://mlb18.theshownation.com/community_market/listings/27528-MLB_Card-michael-pineda',
                  'https://mlb18.theshownation.com/community_market/listings/27550-MLB_Card-blake-parker',
                  'https://mlb18.theshownation.com/community_market/listings/27635-MLB_Card-kyle-seager',
                  'https://mlb18.theshownation.com/community_market/listings/27705-MLB_Card-will-harris',
                  'https://mlb18.theshownation.com/community_market/listings/27715-MLB_Card-yuli-gurriel',
                  'https://mlb18.theshownation.com/community_market/listings/27717-MLB_Card-brian-mccann',
                  'https://mlb18.theshownation.com/community_market/listings/27821-MLB_Card-gio-gonzalez',
                  'https://mlb18.theshownation.com/community_market/listings/27381-MLB_Card-trevor-bauer',
                  'https://mlb18.theshownation.com/community_market/listings/27147-MLB_Card-mychal-givens',
                  'https://mlb18.theshownation.com/community_market/listings/28238-MLB_Card-yasmani-grandal',
                  'https://mlb18.theshownation.com/community_market/listings/27182-MLB_Card-drew-pomeranz',
                  'https://mlb18.theshownation.com/community_market/listings/27194-MLB_Card-hanley-ramirez'];
var autobuyThreshold = 550;
var autobuyStubsThreshold = 30000;

var buyThreshold = {};

buyThreshold['77'] = 600;
buyThreshold['78'] = 700;
buyThreshold['79'] = 800;

var now = new Date(Date.now());


function orderHelper(){
    //$('.helperDiv').remove();
    toastr.clear();
    var tables = $('.orders');
    var buy_orders = tables[0];
    var sell_orders = tables[1];

    var hrefs = {};
    var doubles = {};

    $(buy_orders).find('a').each(function(i){
    var url = $(this).attr('href');
        if(hrefs[url.match(/\/[^\/]+$/g)] == 1){
          doubles[url.match(/\/[^\/]+$/g)] = 1;
        }
        hrefs[url.match(/\/[^\/]+$/g)] = 1;

    });
    console.log(hrefs);

    console.log(autobuy);

    autobuyUrls.forEach(function(autobuyUrl){
    if(autobuy == true && myStubs > autobuyStubsThreshold && hrefs[autobuyUrl.match(/\/[^\/]+$/g)] != 1 && $('.order').length < 20)
    {

        $.ajax({url:autobuyUrl}).done(function(b){
        thisBuyNowPrice = parseInt($($(b).find('.marketplace-card-order-now form button')[0]).text().replace(/,/g,"").match(/\d+/));
            thisSellNowPrice = parseInt($($(b).find('.marketplace-card-order-now form button')[1]).text().replace(/,/g,"").match(/\d+/));
            if(thisSellNowPrice < autobuyThreshold && gotOne != true)
            {
                gotOne = true;
            var theForm = $(b).find('#create-buy-order-form')[0];
            $('.shop-menu').append(theForm);
                $($(theForm).find('#price')[0]).val(thisSellNowPrice+1);
                theForm.target = "helperFrame";

                helperFrame.onload = function(){
                            location.reload(true); };
                        $($(theForm).find('.g-recaptcha')[0]).click();
            }
        });
    }
    });


    $(buy_orders).find('a').each(function(i){
       var url = $(this).attr('href');
       var myBuyPrice = parseInt($(this).parent().parent().find('.item-price').text().replace(/,/g,"").match(/\d+/));
        var thisBuyNowPrice = "";
        var thisSellNowPrice = "";
        var profitMargin = "";
        $.ajax({url:url, context:this}).done(function(b){
            card = cardData(b);
            thisBuyNowPrice = parseInt($($(b).find('.marketplace-card-order-now form button')[0]).text().replace(/,/g,"").match(/\d+/));
            thisSellNowPrice = parseInt($($(b).find('.marketplace-card-order-now form button')[1]).text().replace(/,/g,"").match(/\d+/));
            profitMargin = parseInt(thisBuyNowPrice * 0.90 - thisSellNowPrice);
            this.target = '_blank';
            $(this).parent().parent().find('.helperDiv').remove();
            $(this).parent().parent().find('#create-buy-order-form').remove();

            var cancelForm = $(this).parent().parent().find('.item-cancel form input')[0];
            var rating = $($(b).find('.overall')[0]).text();

            if(firstTime[url.match(/\/[^\/]+$/g)] != 1){

                $($(this).parent().parent().children()[0]).prepend(rating+' ');
                $($(this).parent().parent().children()[0]).append(' ('+card.sellable+' sellable)');
            }
            if(myBuyPrice < thisSellNowPrice)
            {


                $(this).css('color','#e08000');
                var theForm = $(b).find('#create-buy-order-form')[0];
                $($(this).parent().parent().children()[0]).append(theForm);
                //$(theForm).css('width','50%');
                $(theForm).css('display','flex');
                $($(theForm).find('#price')[0]).val(thisSellNowPrice+1);
                theForm.target = "helperFrame";
                $($(this).parent().parent().children()[1]).append("<div class=\"helperDiv\" style=\"background-color:yellow; color:red\"><span class=\"stubs\"> </span> "+thisSellNowPrice+"</div>");


                    notified[url.match(/\/[^\/]+$/g)] = 1;
                    var icon = $(b).find('.actionshot')[0];

                if(!autobid || doubles[url.match(/\/[^\/]+$/g)] || thisSellNowPrice > buyThreshold[rating]){
                    var t = toastr["warning"]("<div class=\"tclick\" style=\"float:left; margin-right:5px;\"><img src=\""+icon.src+"\" width=\"50px\"><br />"+this.text+"</div>"+"<div class=\"helperDiv\"><span style=\"background-color:black; font-size:80%\">"+
                                                              "Buy Now: <span class=\"stubs\"> </span>"+
                                                              thisBuyNowPrice+
                                                              "</span><br /><span style=\"background-color:black; font-size:80%\">Sell Now: <span class=\"stubs\"> </span> "+
                                                              thisSellNowPrice+
                                                              "</span><br /><span style=\"background-color:black; font-size:80%\">Profit: <span class=\"stubs\"> </span> "+
                                                              profitMargin+"</span></div>","Buy Outbid: "+this.text);


                $('.tclick').click(function(){
                        helperFrame.onload = function(){
                            $(cancelForm).click(); };
                        $($(theForm).find('.g-recaptcha')[0]).click();
                    });
                }
                else{
                if(!gotOne){
                gotOne = true;
                    helperFrame.onload = function(){
                            $(cancelForm).click(); };
                        $($(theForm).find('.g-recaptcha')[0]).click();
                }
                }


                 }
            else
            {
                //this.className = 'btn btn-success';
                $(this).css('color','');
            }
            firstTime[url.match(/\/[^\/]+$/g)] = 1;
            $($(this).parent().parent().children()[0]).append("<div class=\"helperDiv\"><span style=\"background-color:black; font-size:80%\">"+
                                                              "Buy: <span class=\"stubs\"> </span>"+
                                                              thisBuyNowPrice+
                                                              "</span> | <span style=\"background-color:black; font-size:80%\">Sell: <span class=\"stubs\"> </span> "+
                                                              thisSellNowPrice+
                                                              "</span> | <span style=\"background-color:black; font-size:80%\">Profit: <span class=\"stubs\"> </span> "+
                                                              profitMargin+"</span></div>");

        });

    });

       $(sell_orders).find('a').each(function(i){
       var url = $(this).attr('href');
       var mySellPrice = parseInt($(this).parent().parent().find('.item-price').text().replace(/,/g,"").match(/\d+/));
        var thisBuyNowPrice = "";
        var thisSellNowPrice = "";
           var profitMargin = "";
        $.ajax({url:url, context:this}).done(function(b){
            thisBuyNowPrice = parseInt($($(b).find('.marketplace-card-order-now form button')[0]).text().replace(/,/g,"").match(/\d+/));
            thisSellNowPrice = parseInt($($(b).find('.marketplace-card-order-now form button')[1]).text().replace(/,/g,"").match(/\d+/));
            profitMargin = parseInt(thisBuyNowPrice * 0.90 - thisSellNowPrice);
            this.target = '_blank';

            $(this).parent().parent().find('.helperDiv').remove();
            $(this).parent().parent().find('#create-sell-order-form').remove();


            if(firstTimeSell[url] != 1){
                var rating = $($(b).find('.overall')[0]).text();
                $($(this).parent().parent().children()[0]).prepend(rating+' ');
            }


            if(mySellPrice < thisBuyNowPrice)
            {
                this.className = 'btn btn-warning';
                if(notifiedSell[url] == 1 || firstTimeSell[url] != 1)
                {
                    notifiedSell[url] = 1;

                }
                else{
                    notified[url] = 1;
                    var icon = $(b).find('.actionshot')[0];

                    toastr["warning"]("<img src=\""+icon.src+"\" width=\"50px\">","Sell Order Outbid");
                    notified = true;
                }
                $($(this).parent().parent().children()[0]).append("<div class=\"helperDiv\" style=\"background-color:yellow; color:red\">Outbid at <span class=\"stubs\"> </span> "+thisBuyNowPrice+"</div>");

            var theForm = $(b).find('#create-sell-order-form')[0];
                $($(this).parent().parent().children()[0]).append(theForm);
                //$(theForm).css('width','50%');
                $(theForm).css('display','flex');
                $($(theForm).find('#price')[0]).val(thisBuyNowPrice-1);
                theForm.target = "helperFrame";

            }
            else
            {
                this.className = 'btn btn-success';
            }
            $($(this).parent().parent().children()[1]).append("<div class=\"helperDiv\"><span style=\"background-color:black; font-size:80%\">"+
                                                              "Buy Now: <span class=\"stubs\"> </span> "+
                                                              thisBuyNowPrice+
                                                              "</span><br /><span style=\"background-color:black; font-size:80%\">Sell Now: <span class=\"stubs\"> </span> "+
                                                              thisSellNowPrice+
                                                              "</span><br /><span style=\"background-color:black; font-size:80%\">Profit: <span class=\"stubs\"> </span> "+
                                                              profitMargin+"</span></div>");
            firstTimeSell[url] = 1;

        });

    });
var refreshInterval = parseInt($('#refresh-interval').val()*1000*60);
    if (refreshInterval > 0){
        myTimeout = setTimeout(orderHelper,refreshInterval);
    }
//firstTime = false;
}

function completedOrders(){
    //$('.completedOrders').remove();
var newDiv = document.createElement('div');
    $('.shop-list').append(newDiv);
    newDiv.classList.add('orders');
    newDiv.classList.add('completedOrders');
    $(newDiv).append('<div class="heading">Completed Orders</div>');

    var completedOrders = [];
    var uniqueCards = firstTime;

    var urls = ['https://mlb18.theshownation.com/orders/completed'
               ,'https://mlb18.theshownation.com/orders/completed?page=2&'
               //,'https://mlb18.theshownation.com/orders/completed?page=3&'
               //,'https://mlb18.theshownation.com/orders/completed?page=4&'
               //,'https://mlb18.theshownation.com/orders/completed?page=5&'
               ];
    var counter = 1;
    urls.forEach(function(url){
        $.ajax({url:url, context:$(newDiv)}).done(function(b){
            ++counter;
            var thisTable = $(b).find('.order').each(function(i){
                var url = $(this).find('a')[0].href;
                if(uniqueCards[url] == 1){
                var zero = 0;
                }
                else
                {
                    completedOrders.push(this);
                    uniqueCards[url] = 1;
                }
            });
            if(counter == urls.length){
            $(this).append(completedOrders);
            $($(this).children()[0]).css('width','20%');

            $(completedOrders).each(function(i){
                var url = $(this).find('a')[0].href;
                $.ajax({url:url, context:this}).done(function(b){
                    var thisBuyNowPrice = parseInt($($(b).find('.marketplace-card-order-now form button')[0]).text().replace(/,/g,"").match(/\d+/));
                    var thisSellNowPrice = parseInt($($(b).find('.marketplace-card-order-now form button')[1]).text().replace(/,/g,"").match(/\d+/));
                    var profitMargin = parseInt(thisBuyNowPrice * 0.90 - thisSellNowPrice);

                    var icon = $(b).find('.actionshot')[0];
                    var rating = $($(b).find('.overall')[0]).text();
                    var theForm = $(b).find('#create-buy-order-form')[0];
                    $($(this).children()[0]).prepend(rating+' ');


                    $($(this).children()[0]).append("<div class=\"helperDiv\"><span style=\"background-color:black; font-size:80%\">"+
                                                              "Buy: <span class=\"stubs\"> </span>"+
                                                              thisBuyNowPrice+
                                                              "</span> | <span style=\"background-color:black; font-size:80%\">Sell: <span class=\"stubs\"> </span> "+
                                                              thisSellNowPrice+
                                                              "</span> | <span style=\"background-color:black; font-size:80%\">Profit: <span class=\"stubs\"> </span> "+
                                                              profitMargin+"</span></div>");
                    $($(this).children()[0]).append(theForm);
                    $($(this).children()[0]).css('width','0');

                    $(theForm).css('display','flex');
                    theForm.target = "helperFrame";
                    $($(theForm).find('#price')[0]).val(thisSellNowPrice+1);

                   });
            });
            }
        });







            //$(table).append($(thisTable).children());

        });
}

(function() {
    'use strict';
    toastr.options = {"closeButton": true,
                      "timeOut": 0,
                      "extendedTimeOut": 0,
                      "hideDuration":20,
                     };
    $('.shop-main-heading').children()[0].append(" ("+$($('.orders')[0]).find('.order').length+" Buy, "+$($('.orders')[1]).find('.order').length+" Sell)");
    $('.shop-main-heading').append('<div style="float:right">Refresh interval: <input id="refresh-interval" size="5" value=".15"></input></div>');

    helperFrame = document.createElement('iframe');

    helperFrame.name = 'helperFrame';
    helperFrame.sandbox = 'allow-same-origin';
    $(helperFrame).css('display','none');
    $('.shop-menu').append(helperFrame);
    helperFrame.onload = function(){
                        toastr["success"]("Rebid complete","Done!");
    };
    myStubs = parseInt($('.header-wallet').text());

    orderHelper();

    $('.item-date').each(function(i){
    var dateText = $(this).text();
        dateText = dateText.trim().replace(/\s\s+/g,' ');
        dateText = dateText.replace(/(\d+):(\d+)([AP]M)/,'$1:$2 $3');
        var thisDate = new Date(dateText);
    var diffMins = Math.round( (now-thisDate) / 60000 );

        if(diffMins<60)
        {
            if(diffMins<1)
            {
                $(this).text('< a minute ago');
            }
            else
            {
            $(this).text(diffMins+' minutes ago');
            }

        }
        else
        {
            var diffHours = Math.round( (diffMins / 60) * 100 ) / 100;
            $(this).text(diffHours+' hours ago');

        }

    });



    //myTimeout = setTimeout(orderHelper,60000);

    $('.item-name').css('width','20%');


    setTimeout(completedOrders,(1000*2));

    setTimeout(function(){ location.reload(true);}, (1000*60*3));


    $('#refresh-interval').change(function(){
        clearTimeout(myTimeout);
        var refreshInterval = parseInt($('#refresh-interval').val()*1000*60);
        myTimeout = setTimeout(orderHelper,refreshInterval);});


})();