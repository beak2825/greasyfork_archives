// ==UserScript==
// @name         Sbeam 黑科技
// @namespace    http://tampermonkey.net/
// @version      0.20
// @description  Fucking nekogirl is the best thing in the world
// @author       香草喵 Cauchy https://steamcommunity.com/id/cauchykronecker
// @match        https://greasyfork.org/en/scripts/369401-sbeam-%E9%BB%91%E7%A7%91%E6%8A%80-sky
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//　下面資訊必填寫！！！！！！！！！！！！，否則無法運作　把下面網址換成想買的物品的網址！！！！
// @include			https://steamcommunity.com/market/listings/753/385800-%3Avanilla2%3A?filter=nekopara%20emoticon
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// @grant			GM_addStyle
// @grant			GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/369401/Sbeam%20%E9%BB%91%E7%A7%91%E6%8A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/369401/Sbeam%20%E9%BB%91%E7%A7%91%E6%8A%80.meta.js
// ==/UserScript==

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//下面資訊必填修改！！！！！！！！！！！！，否則無法運作
var max_bid = 45; //　數字改成，你能接受的最高出價，超過這個價就不會繼續往上跟標，或是有賣方賣東西低於這個價，則直接購入
var wallet = 120.76; // 代碼執行前，Steam錢包有多少錢，用來判斷是否買到東西，如果等一下Steam的錢和這不同太多，且變動量大於一定的量(wallet_tollerance)，則停止競標
var refresh_time = 60; //單位:秒 60
/////////////////////////////////////////////////////////////////////////////////////////////////////////

var prices = [];
var top_selling_price = 99999;
var quantities = [];
var table_tds;
var table_sell_tds;
////////////////////////////////
//下面參數若不清楚是啥，請勿隨意修改
var wallet_tollerance = max_bid*0.8;// 現在Steam的錢和一開始wallet相差多少內，仍要繼續競標（因為可能賣卡片，幾毛，錢會稍微浮動）
var increment = 0.5;　//　換成你每次的加價增額　預設每次多喊0.5元
var rebid_diff = 2*increment;　// 和第二標相差超過rebid_diff，則重標(標太高了，降價重新標價)
////////////////////////////////

(function() {

    // we have to make sure the page has been loaded fully

    // your code here
        'use strict';
    //setInterval(main_routine, 15000);
    console.log('start');
    setInterval(main_sub_routine, 1000*refresh_time)
    //main_routine();
})();

function main_routine(){
    location.reload(true);
    window.addEventListener('load', function() { //start loading
        //wait 3 secs to start parsing !!
        setTimeout(main_sub_routine, 5000);
    }, false);// end loading
}


function main_sub_routine(){
    location.reload(true);
    var cur_wallet = parse_price(document.getElementById('header_wallet_balance').textContent);
    //console.log("current_wallet: "+ cur_wallet);
    if( Math.abs( wallet - cur_wallet ) > wallet_tollerance){ console.log("wallet is different! item was bought!"); cancle_item(); return;}

    // automatically check "Steam Subscriber Agreement" (SSA)
    document.getElementById('market_buyorder_dialog_accept_ssa').checked = true;
    //console.log("SSA SET TRUE");

    // get the current buyer's price table
    table_tds = document.getElementById('market_commodity_buyreqeusts_table').getElementsByTagName("TD");
    table_sell_tds = document.getElementById('market_commodity_forsale_table').getElementsByTagName("TD");
    //console.log(table_tds.length);

    // check if the page (price table) is fully loaded
    if ( table_tds.length == 0 || table_sell_tds.length == 0)
    {
        console.log("Failed to load the price:( :( :( ");
    }else{
        store_price_table();
        if(has_buy_order())
        {
            //cancle_item();

            if(!is_highest_bid())
            {
                var my_price_text = document.getElementsByClassName("market_listing_price")[0].innerHTML;
                var my_price = parse_price(my_price_text.substr(68));
                // we can't bid higher, stick to 2nd bid place
                if((prices[0] + increment > max_bid) && (my_price - prices[2]>0) && (my_price - prices[2]) < rebid_diff)
                {
                    console.log("do nothing, stick to 2nd place")
                    // do nothing, stick to 2nd place
                }else{
                    console.log("is not highest bid, or is not second, cancle our current bid and rebid")
                    cancle_item();
                }
            }else{
                console.log("is highest bid, check if we can lower the bid");
                var difference = (prices[0]-prices[1]);
                if(difference > rebid_diff){ cancle_item(); console.log("Cancle the bid because we can lower the price");}
                else if(top_selling_price < max_bid)
                {
                    console.log("Snipe the item, cancle the bid");
                    cancle_item();
                }
                else { console.log("No need to lower the bid")}
            }

        }else{ // does not has active order
            if(top_selling_price < max_bid)
            {
                console.log("Found a good deal, buy immediately!");
                document.querySelector('.market_commodity_buy_button').click();
                //wait?
                document.getElementById('market_buy_commodity_input_price').value = top_selling_price;
                document.getElementById('market_buy_commodity_input_quantity').value = 1; // we always bid 1
                document.querySelector('#market_buyorder_dialog_purchase').click();
            }
            else if(prices[0] + increment < max_bid)
            {
                //console.log("try to bid 1st place");
                bid_item();
            }
            else
            {
             //fail to bid any higher //TODO
                //alert("the current price on the market is higher than your maximum price");
                console.log("try to bid 2nd place with price: "+(prices[1] + increment));
               // bid the item using prices[1] +　increment
                //console.log("try to bid the item using price: "+ (prices[1] + increment));
                document.querySelector('.market_commodity_buy_button').click();
                //wait?
                document.getElementById('market_buy_commodity_input_price').value = prices[1] + increment;
                document.getElementById('market_buy_commodity_input_quantity').value = 1; // we always bid 1
                document.querySelector('#market_buyorder_dialog_purchase').click();
            }
        }
    }

}

function store_price_table(){
// store the price table
    for( var i = 0; i < table_tds.length -2; i+=2){
        var price = parse_price(table_tds[i].textContent);
        var quantity = parseInt(table_tds[i+1].textContent);
        prices.push(price);
        quantities.push(quantity);
       // console.log("price: "+price+" quantity: "+quantity);
    }
// store the selling price table
    //for( var i = 0; i < table_tds.length -2; i+=2){
        top_selling_price = parse_price(table_sell_tds[0].textContent);
        console.log("top selling price: "+top_selling_price);
    //}




}
function parse_price( price ) {
    var result = price.replace ( /[^\d.]/g, '' );
    return parseFloat(result);
}

// check if the client has an active bid or not
function has_buy_order(){
    var order_count = parseInt(document.getElementById('my_market_buylistings_number').textContent);
    if(order_count > 0){
       // console.log("Has buy order: " + order_count);
        return true;
    }else{
      //  console.log("No buy order: 0");
        return false;
    }
}

// only call this function assuming has_buy_order() is true
function is_highest_bid(){
    var my_price_text = document.getElementsByClassName("market_listing_price")[0].innerHTML;
    var my_price = parse_price(my_price_text.substr(68));
    console.log("Has active bidding and the price is :" + my_price);
    console.log("Top price is: " + prices[0]);
    //check if someone's price is higher or equal than us
    if (my_price < prices[0] || (my_price==prices[0] && quantities[0]>1))
    {
        return false;
    }else{
        return true;
    }
}

function bid_item()
{

        // bid the item using prices[0] +　increment
        console.log("try to bid 1st price using price: "+ (prices[0] + increment));
        document.querySelector('.market_commodity_buy_button').click();
    //wait?
        document.getElementById('market_buy_commodity_input_price').value = prices[0] + increment;
        document.getElementById('market_buy_commodity_input_quantity').value = 1; // we always bid 1
        document.querySelector('#market_buyorder_dialog_purchase').click();
    //wait 2 secs and close the bottom
    setTimeout(close_buy_bottom, 5000);
}

function cancle_item()
{
    document.querySelector('.item_market_action_button_contents').click();
}

function close_buy_bottom()
{
    document.querySelector('.newmodal_close').click();
}
