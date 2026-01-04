// ==UserScript==// @name         MonMask17032020
// @namespace    amazon全自動搶購
// @version      1.2522
// @description  amazon全自動搶購
// @author       amazonbot
// @match        https://amazonbotauth.herokuapp.com/*
// @match        https://www.amazon.co.jp/gp/offer-listing/*
// @match        https://www.amazon.co.jp/gp/*
// @match        https://www.amazon.co.jp/gp/buy/addressselect/handlers/*
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/398134/MonMask17032020.user.js
// @updateURL https://update.greasyfork.org/scripts/398134/MonMask17032020.meta.js
// ==/UserScript==
var Bprice = 2000; //貨品價錢
var Bshiprice = 100; //運費
var disable = 0; //開關只購買sold by amazon貨品，0為不限制，1為只購買sold by amazon貨品
var cartAutoBuy = 1; //開關購物車自動購買，1打開，0關閉
var addOnItem = 0; //打開addOnItem模式，0關閉，1打開，自動檢測購物車產品數量，需要先關閉購物車自動購買
var CartCount = 0; //設置購物車貨品上限，數字超到設置數目後自動下單購買，例如輸入2，代表購物車兩件貨不會操作，而第三件時才自動購買

/*
 1.2522
 增加更多錯誤畫面返回機制

 1.252
 改善特定人士無法進行下一步Payment bug

 1.251
 使用前需進行認證

 1.25
 新增addOnItem模式
 此模式能夠幫助Add-on貨品的購買

 1.212
 fix Bug

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

function moveToNext(){
 if (window.location.href.indexOf("addressselect") != -1) {
        sleep(1*1040);
        if ( document.querySelector('a[data-action="page-spinner-show"]') ) {
            document.querySelector('a[data-action="page-spinner-show"]').click();
        }
    }
		if (window.location.href.indexOf("payselect") != -1) {
				sleep(1*540);
				if ( document.querySelector('input[class="a-button-input a-button-text"]') ) {
					document.querySelector('input[class="a-button-input a-button-text"]').click();
				}
			}
		if (window.location.href.indexOf("shipoptionselect") != -1) {
				sleep(1*840);
				if ( document.querySelector('input[class="a-button-text"]') ) {
					document.querySelector('input[class="a-button-text"]').click();
				}

				sleep(1*1540);

		if ( document.querySelector('input[class="a-button-input a-button-text"]') ) {
					document.querySelector('input[class="a-button-input a-button-text"]').click();
				}
			}
}

function checkCartNo() {
 if ( document.querySelector('div[data-name="Active Items"]') ) {
          var No = document.querySelectorAll('div[data-name="Active Items"] > div[data-asin]').length;
    }
    return No;
}

function MoveToCart() {
    var on = document.querySelector('input[value="Move to cart"]');
    if ( on ) {
        on.click();
        beep(200, 520, 200);
        sleep(2*500);
        //window.open('https://www.amazon.co.jp/gp/cart/view.html?ref_=nav_cart');
    }
}

function gc(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function ccc() {
    var cccc = document.getElementById("hlb-ptc-btn-native");
    var cccc2 = document.getElementById("hlb-cs-btn-announce");
    if( cccc ) {
        cccc.click();
    }
    else if ( cccc2 ) {
        cccc2.click();
    }
}

function Error() {
    if( window.location.href.indexOf("item-dispatch") != -1) {
        sleep(1*300);
        window.location.replace(document.referrer);
    }
    if( window.location.href.indexOf("cs_503_link") != -1) {
        window.location.replace(document.referrer);
    }
	if( window.location.href.indexOf("outOfStock") != -1) {
	      sleep(2*500);
          window.location.href = "https://www.amazon.co.jp/gp/cart/view.html?ref_=nav_cart";
    }
    if( window.location.href.indexOf("singleAddress") != -1) {
	      sleep(2*500);
          window.location.href = "https://www.amazon.co.jp/gp/cart/view.html?ref_=nav_cart";
    }
    if( window.location.href.indexOf("ox_checkout_redirects_yourstore") != -1) {
	      sleep(2*500);
          window.location.href = "https://www.amazon.co.jp/gp/cart/view.html?ref_=nav_cart";
    }

}
function bbb() {
    var bbbbb = document.querySelector('input[class="a-button-text place-your-order-button"]')
    var bbbbb2 = document.querySelector('a[data-action="page-spinner-show"]')

    if ( bbbbb ) {
        bbbbb.click();
    }
    else if ( bbbbb2 ) {
        bbbbb2.click();
    }
}

var authc = null;
function qqq(){
    if (window.location.href.indexOf("amazonbotauth") != -1) {
        var code = gc('code');
        GM.setValue ('auth', code);
    }
    else {
        let aaa = GM.getValue('auth');
        if ( aaa ) {
            aaa.then(function(result) {
                // you can access the result from the promise here
                if ( result == undefined ) {
                    authc = null;
                }else{
                    aaa = 'set'
                }
            });

        }
        return aaa
    }
}

function ct(){
 if (window.location.href.indexOf("cart") != -1) {
    // alert(on)
    MoveToCart()

    var cartbuy = document.querySelector('input[value="Proceed to checkout"]');
    // alert(on)
    if ( cartbuy && cartAutoBuy == 1 ) {
        cartbuy.click();
        beep(200, 520, 200);
        //window.open('https://www.amazon.co.jp/gp/cart/view.html?ref_=nav_cart');
    }else if ( cartbuy && addOnItem == 1 ) {
        //cartbuy.click();
        var productCount = checkCartNo();
        if ( productCount > CartCount ) {
            cartbuy.click();
        }
        else{
            sleep(1*900);
            location.reload();
        }
        //window.open('https://www.amazon.co.jp/gp/cart/view.html?ref_=nav_cart');
    }

    if ( document.getElementsByClassName('a-box a-alert-inline a-alert-inline-error a-row a-spacing-top-mini lineitem-error-message ')[0] ) {
          sleep(1*1000);
          location.reload();
    }

    if ( document.getElementsByClassName('a-row sc-your-amazon-cart-is-empty')[0] ) {
        var emptyCart = document.getElementsByClassName('a-row sc-your-amazon-cart-is-empty')[0].innerText;
        if ( emptyCart.length > 1 )
        {
            //      window.scrollTo(0,document.body.scrollHeight);
            sleep(1*900);
            location.reload();
        }
    }
    if ( document.getElementsByClassName('a-spacing-mini a-spacing-top-base')[0] ) {
        var emptyCart2 = document.getElementsByClassName('a-spacing-mini a-spacing-top-base')[0].innerText;
        if ( emptyCart2.length > 1 )
        {
            //      window.scrollTo(0,document.body.scrollHeight);
            sleep(1*900);
            location.reload();
        }
    }
 }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async function() {
    'use strict';

if(await qqq()) {ccc();

await moveToNext();
await ct();

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
        //window.open('https://www.amazon.co.jp/gp/cart/view.html?ref_=nav_cart');

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
}
    else{
         if (window.location.href.indexOf("amazonbotauth") != -1) {
         }else{
         alert('請先註冊');
         }
    }
})();