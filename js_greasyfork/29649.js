// ==UserScript==
// @name         MLB The Show Nation Order Helper 18
// @namespace    https://greasyfork.org/en/users/8332-sreyemnayr
// @version      2018.4
// @description  Detects if your orders are outbid.  If you grant notification permissions, it will send a notification to your desktop!
// @author       sreyemnayr
// @match        https://mlb18.theshownation.com/orders
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29649/MLB%20The%20Show%20Nation%20Order%20Helper%2018.user.js
// @updateURL https://update.greasyfork.org/scripts/29649/MLB%20The%20Show%20Nation%20Order%20Helper%2018.meta.js
// ==/UserScript==
var notified = false;
var notifiedURL = '';
var myTimeout;

function orderHelper(){
    //$('.helperDiv').remove();
    toastr.clear();
var tables = $('.orders');
    var buy_orders = tables[0];
    var sell_orders = tables[1];

    $(buy_orders).find('a').each(function(i){
       var url = $(this).attr('href');
       var myBuyPrice = parseInt($(this).parent().parent().find('.item-price').text());
        var thisBuyNowPrice = "";
        var thisSellNowPrice = "";
        var profitMargin = "";
        $.ajax({url:url, context:this}).done(function(b){
            thisBuyNowPrice = parseInt($($(b).find('.marketplace-card-order-now form button')[0]).text().replace(/,/g,"").match(/\d+/));
            thisSellNowPrice = parseInt($($(b).find('.marketplace-card-order-now form button')[1]).text().replace(/,/g,"").match(/\d+/));
            profitMargin = parseInt(thisBuyNowPrice * 0.90 - thisSellNowPrice);
            this.target = 'blank';
            $(this).parent().parent().find('.helperDiv').remove();
            if(myBuyPrice < thisSellNowPrice)
            {
                //this.className = 'btn btn-warning';
                $(this).css('color','#e08000');
                //if(Notification.permission === 'granted' && notified === false){
                    var icon = $(b).find('.actionshot')[0];
                      var options = {
                          body: "You have been outbid for "+this.textContent+" at $"+thisSellNowPrice,
                          icon: 'https://s3.amazonaws.com/mlb-theshownation/tsn18/3/img/shared/Icon_Stub_256x256.png',
                          image: icon.src
                      };
                    //var notification = new Notification("Buy: "+this.textContent,options);
                    toastr["warning"]("<div style=\"float:left; margin-right:5px;\"><a href=\""+$(this).attr('href')+"\" target=\"_blank\"><img src=\""+icon.src+"\" width=\"50px\"><br />"+this.text+"</a></div>"+"<div class=\"helperDiv\"><span style=\"background-color:black; font-size:80%\">"+
                                                              "Buy Now: <span class=\"stubs\"> </span>"+
                                                              thisBuyNowPrice+
                                                              "</span><br /><span style=\"background-color:black; font-size:80%\">Sell Now: <span class=\"stubs\"> </span> "+
                                                              thisSellNowPrice+
                                                              "</span><br /><span style=\"background-color:black; font-size:80%\">Profit: <span class=\"stubs\"> </span> "+
                                                              profitMargin+"</span></div>","Buy Outbid: "+this.text);
                    notified = true;
                    //console.log(this);
                    notifiedURL = this.href;
                    //notification.addEventListener('click',function(){this.close();window.open(notifiedURL);},false);
                //}
                $($(this).parent().parent().children()[1]).append("<div class=\"helperDiv\" style=\"background-color:yellow; color:red\"><span class=\"stubs\"> </span> "+thisSellNowPrice+"</div>");
            }
            else
            {
                //this.className = 'btn btn-success';
                $(this).css('color','');
            }
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
       var mySellPrice = parseInt($(this).parent().parent().find('.item-price').text());
        var thisBuyNowPrice = "";
        var thisSellNowPrice = "";
           var profitMargin = "";
        $.ajax({url:url, context:this}).done(function(b){
            thisBuyNowPrice = parseInt($($(b).find('.marketplace-card-order-now form button')[0]).text().replace(/,/g,"").match(/\d+/));
            thisSellNowPrice = parseInt($($(b).find('.marketplace-card-order-now form button')[1]).text().replace(/,/g,"").match(/\d+/));
            profitMargin = parseInt(thisBuyNowPrice * 0.90 - thisSellNowPrice);
            this.target = 'blank';
            $(this).parent().parent().find('.helperDiv').remove();
            if(mySellPrice > thisBuyNowPrice)
            {
                this.className = 'btn btn-warning';
                //if(Notification.permission === 'granted' && notified === false){
                    var icon = $(b).find('.actionshot')[0];
                      var options = {
                          body: "You have been outbid for "+this.textContent+" at $"+thisBuyNowPrice,
                          icon: icon.src
                      };
                    //var notification = new Notification("Sell Order Outbid",options);
                    toastr["warning"]("<img src=\""+icon.src+"\" width=\"50px\">","Sell Order Outbid");
                    notified = true;
                //}
                $($(this).parent().parent().children()[0]).append("<div class=\"helperDiv\" style=\"background-color:yellow; color:red\">Outbid at <span class=\"stubs\"> </span> "+thisBuyNowPrice+"</div>");
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

        });

    });
var refreshInterval = parseInt($('#refresh-interval').val()*1000*60);
    if (refreshInterval > 0){
        myTimeout = setTimeout(orderHelper,refreshInterval);
    }
}

(function() {
    'use strict';
    toastr.options = {"closeButton": true,
                      "timeOut": 0,
                      "extendedTimeOut": 0,
                      "hideDuration":20,
                     };
    $('.shop-main-heading').children()[0].append(" ("+$('.order').length+")");
    $('.shop-main-heading').append('<div style="float:right">Refresh interval: <input id="refresh-interval" size="5" value="0"></input></div>');
    orderHelper();
    //myTimeout = setTimeout(orderHelper,60000);

    $('#refresh-interval').change(function(){
        clearTimeout(myTimeout);
        var refreshInterval = parseInt($('#refresh-interval').val()*1000*60);
        myTimeout = setTimeout(orderHelper,refreshInterval);});
})();