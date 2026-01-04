// ==UserScript==
// @name         MonMask13032020_US
// @namespace    amazon全自動搶購
// @version      v1.212
// @description  amazon全自動搶購
// @author       amazon全自動搶購
// @match        https://www.amazon.com/gp/offer-listing/*
// @match        https://www.amazon.com/gp/*
// @match        https://www.amazon.com/gp/buy/addressselect/handlers/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397846/MonMask13032020_US.user.js
// @updateURL https://update.greasyfork.org/scripts/397846/MonMask13032020_US.meta.js
// ==/UserScript==

var Bprice = 2000; //貨品價錢
var Bshiprice = 100; //運費
var disable = 0; //開關只購買sold by amazon貨品，0為不限制，1為只購買sold by amazon貨品
var cartAutoBuy = 1; //開關購物車自動購買，1打開，0關閉
/*
 1.212
 fix Bug
*/
/*
 1.2測試版
 改善自動購買速度
 改善插件佔用資源
 新增Cart購物車Save For Later自動購買
 新增Cart購物車Save For Later自動購買開關
*/

var time = 0;
var a = new AudioContext()

function beep(vol, freq, duration){
         var v=a.createOscillator()
         var u=a.createGain()
         v.connect(u)
         v.frequency.value=freq
         v.type="square"
         u.connect(a.destination)
         u.gain.value=vol*0.01
         v.start(a.currentTime)
         v.stop(a.currentTime+duration*0.005)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async function() {
    'use strict';

    var addToCart = document.getElementById("hlb-ptc-btn-native");
    var addToCart2 = document.getElementById("hlb-cs-btn-announce");
    if( addToCart ) {
        addToCart.click();
    }
    else if ( addToCart2 ) {
        addToCart2.click();
    }

    var buy = document.querySelector('input[class="a-button-text place-your-order-button"]')
    var buy2 = document.querySelector('a[data-action="page-spinner-show"]')
    if ( buy ) {
        buy.click();
    }
    else if ( buy2 ) {
        buy2.click();
    }
	else {
            document.querySelector('input[name="placeYourOrder1"]').click();
    }

    if( window.location.href.indexOf("item-dispatch") != -1) {
        window.location.replace(document.referrer);
    }
    if( window.location.href.indexOf("cs_503_link") != -1) {
        window.location.replace(document.referrer);
    }


    if (window.location.href.indexOf("addressselect") != -1) {
        await sleep(1*1040);
        if ( document.querySelector('a[data-action="page-spinner-show"]') ) {
            document.querySelector('a[data-action="page-spinner-show"]').click();
        }
    }


if (window.location.href.indexOf("cart") != -1) {
    await sleep(2*500);
    var on = document.querySelector('input[value="Move to cart"]');
    // alert(on)
    if ( on ) {
        on.click();
        beep(200, 520, 200);
        //window.open('https://www.amazon.com/gp/cart/view.html?ref_=nav_cart');
    }
    var cartbuy = document.querySelector('input[value="Proceed to checkout"]');
    // alert(on)
    if ( cartbuy && cartAutoBuy ==1 ) {
        cartbuy.click();
        beep(200, 520, 200);
        //window.open('https://www.amazon.com/gp/cart/view.html?ref_=nav_cart');
    }


    if ( document.getElementsByClassName('a-row sc-your-amazon-cart-is-empty')[0] ) {
        var off = document.getElementsByClassName('a-row sc-your-amazon-cart-is-empty')[0].innerText;
        if ( off.length > 1 )
        {
            //      window.scrollTo(0,document.body.scrollHeight);
            await sleep(2*500);
            location.reload();
        }
    }
}

    var shipping;
    var shprice;
    var noseller = document.getElementsByClassName('a-size-medium')[0].innerText;

    if ( noseller.length > 50 ) {
        await sleep(2*800);
        location.reload();
    }

    try{
        shipping = document.getElementsByClassName("a-column a-span2 olpPriceColumn")[0].getElementsByClassName("olpShippingPrice")[0].innerText;
        shprice = shipping.replace(/(\D+)/g, '');
    }
    catch(e1)
    {
      shprice = 0;
    }


    try{

    var priceStr = document.getElementsByClassName('olpOfferPrice')[0].innerText;
    var price = priceStr.replace(/(\D+)/g, '');

    }catch(e1)
    {}

    var seller = document.getElementsByClassName('olpSellerName')[0].children[0];


  if ( disable == 0 ) {
    if ( seller.tagName == 'IMG' ) {
        //amazon product
        document.body.style.background = "blue";
        document.getElementsByName("submit.addToCart")[0].click();

        beep(200, 520, 200);
        time = 1;
    }
    else if ( shprice > Bshiprice ) {
            //ship price
            await sleep(2*1000);
            location.reload();
        }
    else if(price<Bprice){
        //price

        document.body.style.background = "pink";
        document.getElementsByName("submit.addToCart")[0].click();

        beep(200, 520, 200);
        time = 1;
        //window.open('https://www.amazon.com/gp/cart/view.html?ref_=nav_cart');

    }else{
        await sleep(2*1000);
        location.reload();
    }
  }else{
        if ( seller.tagName == 'IMG' ) {
        //amazon product
        document.body.style.background = "blue";
        document.getElementsByName("submit.addToCart")[0].click();

        beep(200, 520, 200);
        time = 1;
        }
        else{
          await sleep(2*1000);
          location.reload();
        }
  }
await sleep(30*1000);
location.reload();
})();