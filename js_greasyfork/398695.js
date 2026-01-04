// ==UserScript==// @name         MonMask01042020轉移版
// @namespace    amazon全自動搶購
// @version      2.0.666
// @description  amazon全自動搶購
// @author       amazonbot
// @match        https://amazonbotauth.herokuapp.com/*
// @match        https://www.amazon.co.jp/gp/offer-listing/*
// @match        https://www.amazon.co.jp/gp/*
// @match        https://www.amazon.co.jp/dp/*
// @match        https://www.amazon.co.jp/gp/buy/addressselect/handlers/*
// @match        https://www.amazon.com/gp/offer-listing/*
// @match        https://www.amazon.com/gp/*
// @match        https://www.amazon.com/gp/buy/addressselect/handlers/*
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/398695/MonMask01042020%E8%BD%89%E7%A7%BB%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/398695/MonMask01042020%E8%BD%89%E7%A7%BB%E7%89%88.meta.js
// ==/UserScript==

// 未來將會從Google/FireFox插件商店進行更新。以及基於原生Google/FireFox插件，效能更快更好
// 如更新後需要再註冊 請連繫Telegram : https://t.me/amazon2020bot 協助
// 未來更新展望 : history系統
//               改善效能
//               Email / Telegram 提醒功能

var refresh = 2; //刷新秒數 建議兩秒
var Bprice = 2000; //貨品價錢
var Bshiprice = 100; //運費
var disable = 0; //開關只購買sold by amazon貨品，0為不限制，1為只購買sold by amazon貨品
var cartAutoBuy = 1; //開關購物車自動購買，1打開，0關閉

// 自動加骨 自動加wish list上第一項的產品 目前只支援加一款
var autoAddon = 1;
// 自動加骨 自動加wish list上第一項的產品 目前只支援加一款

//手動加骨功能 請先關閉購物車自動購買 cartAutoBuy = 0
var addOnItem = 0; //打開addOnItem模式，0關閉，1打開，自動檢測購物車產品數量，
var CartCount = 0; //設置購物車貨品上限，數字超到設置數目後自動下單購買，例如輸入2，代表購物車兩件貨不會操作，而第三件時才自動購買
//手動加骨功能 請先關閉購物車自動購買 cartAutoBuy = 0

/*
 2.01正式版
 完善版本

 2.0beta - beta7
 處理QTY BUG
 新增自動加骨功能
 自動QTY頁面自動刷新
 再次修正Payment bug

 1.2522 - 1.2525 - 1.26
 同時支援美版亞馬遜
 日文介面回複正常服務
 用戶能調整刷新時間 建議兩秒
 緊急修正錯誤畫面不檢測bug
 增加更多錯誤畫面返回機制(包括產品數量不夠,產品被移走,ご迷惑をおかけしています！等)
 更正sold by amazon產品只搜尋第一行bug

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



var time = refresh * 1000;
var ii = GM_getValue('counter', 0);
var open = 1;
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

function Mn(){

    if (window.location.href.indexOf("payselect") != -1) {
        sleep(1*1540);
        document.getElementsByName("ppw-widgetEvent:SetPaymentPlanSelectContinueEvent")[0].click();
    }
    if (window.location.href.indexOf("addressselect") != -1) {
        sleep(1*440);
        if ( document.querySelector('a[data-action="page-spinner-show"]') ) {
            document.querySelector('a[data-action="page-spinner-show"]').click();
        }
    }
    if (window.location.href.indexOf("shipoptionselect") != -1) {
        sleep(1*840);
        if ( document.querySelector('input[class="a-button-text"]') ) {
            document.querySelector('input[class="a-button-text"]').click();
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
    var Jon = document.querySelector('input[value="カートに戻す"]');
    if ( on ) {
        on.click();
        beep(200, 520, 200);
        //window.open('https://www.amazon.co.jp/gp/cart/view.html?ref_=nav_cart');
    }else if (Jon){
        Jon.click();
        beep(200, 520, 200);
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


async function er() {
    if ( document.querySelector('b[class="h1"]') ) {
    var error = document.querySelector('b[class="h1"]')
    if (error.innerText == 'ご迷惑をおかけしています！' || error.innerText == 'I am sorry for the inconvenience!'){
            await sleep(5000);

            location.reload();
    }
    }
    if( window.location.href.indexOf("go-to-checkout") != -1) {
        await sleep(5000);
        window.location.replace(document.referrer);
    }
    if( window.location.href.indexOf("item-dispatch") != -1) {
        await sleep(500);
        window.location.replace(document.referrer);
    }
    if( window.location.href.indexOf("itemselect") != -1 && window.location.href.indexOf("outOfStock") == -1 && window.location.href.indexOf("singleAddress") == -1) {
        await sleep(500);
        window.location.href = "https://www.amazon.co.jp/gp/cart/view.html?ref_=nav_cart";
    }
    if( window.location.href.indexOf("cs_503_link") != -1) {
        await sleep(1000);window.location.replace(document.referrer);
    }
	if( window.location.href.indexOf("outOfStock") != -1) {
	      await sleep(300);

        var exist= document.querySelector('p[class="a-size-base a-text-bold a-spacing-micro breakword"]')
        if (exist) {
            window.location.replace(window.location.href);
        }else {
            window.location.href = "https://www.amazon.co.jp/gp/cart/view.html?ref_=nav_cart";
        }
    }
    if( window.location.href.indexOf("singleAddress") != -1) {
	      var single = document.querySelector('input[name="continue-bottom"]')

          if ( single ) {
              beep(200, 520, 200);
              single.click();
          }
    }
    if( window.location.href.indexOf("ox_checkout_redirects_yourstore") != -1) {
          window.location.href = "https://www.amazon.co.jp/gp/cart/view.html?ref_=nav_cart";
    }
    if( window.location.href.indexOf("lh_continue_shopping") != -1) {
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
            localStorage.setItem('auth', aaa)
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


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
var one = GM_getValue('OneUrl') || 0;
async function OpenAddon() {
    if ( one == 0) {
        GM_setValue('OneUrl',1);
        var tab = window.open("https://www.amazon.co.jp/gp/registry/wishlist/");
        await sleep(3000);
        GM_setValue('OneUrl',0);
        tab.close();
    }
}
async function Addon(){
    if (window.location.href.indexOf("wishlist") != -1) {
        var add = document.querySelector('a[class="a-button-text a-text-center"]')
        if ( add ) {
            add.click();
            await sleep(4000);
        }

    }
   // window.open('','_self').close();
}
function CheckAddOn(){
        var cartbuy = document.querySelector('div[data-name] span.a-list-item i[class="a-icon a-icon-addon a-spacing-mini"]')
        if (cartbuy) {
            open = 0;
            return true;
        }
}

(async function() {
    'use strict';
    var shipping;
    var shprice;

if( qqq() ){ ccc();
        bbb();
        await Mn();
        await er();
        Addon();
if (window.location.href.indexOf("cart") != -1) {


// alert(on)
MoveToCart();
var cartbuy = document.querySelector('input[value="Proceed to checkout"]');
var productCount = checkCartNo();
try{
    var addon2 = document.querySelector('div[data-name] span.a-list-item i[class="a-icon a-icon-addon a-spacing-mini"]').textContent;
}
catch(e2){}

if ( autoAddon == 1 && addon2 == "Add-on Item" && productCount <= 1){
    await( CheckAddOn() );

    await OpenAddon();
    await sleep(200);
    window.location.replace(window.location.href);
}
// alert(on)
else if ( cartbuy && cartAutoBuy == 1 ) {
    cartbuy.click();
    beep(200, 520, 200);

}else if ( cartbuy && addOnItem == 1 ) {
    //cartbuy.click();
    productCount = checkCartNo();
    if ( productCount > CartCount ) {
        cartbuy.click();
    }
    else{
        await sleep(time);
        location.reload();
    }

}




if ( document.getElementsByClassName('a-box a-alert-inline a-alert-inline-error a-row a-spacing-top-mini lineitem-error-message ')[0] ) {
    await sleep(time);
    location.reload();
}

if ( document.getElementsByClassName('a-row sc-your-amazon-cart-is-empty')[0] ) {
    var emptyCart = document.getElementsByClassName('a-row sc-your-amazon-cart-is-empty')[0].innerText;
    if ( emptyCart.length > 1 )
    {
        //      window.scrollTo(0,document.body.scrollHeight);
        await sleep(time);
        location.reload();
    }
}
if ( document.getElementsByClassName('a-spacing-mini a-spacing-top-base')[0] ) {
    var emptyCart2 = document.getElementsByClassName('a-spacing-mini a-spacing-top-base')[0].innerText;
    if ( emptyCart2.length > 1 )
    {
        //      window.scrollTo(0,document.body.scrollHeight);
        await sleep(time);
        location.reload();
    }
}
}
//----------------------------------------//

try{
var noseller = document.getElementsByClassName('a-size-medium')[0].innerText;
}catch(e1){ noseller = 'noseller' }

try{
var priceStr = document.getElementsByClassName('olpOfferPrice')[0].innerText;
var price = priceStr.replace(/(\D+)/g, '');

}catch(e1){ priceStr = 'noPrice' }

if ( window.location.href.indexOf("offer-listing") != -1 ){
if ( noseller == 'noseller' || priceStr == 'noPrice' ) {
   await sleep(time);
   location.reload();
}}

try{
shipping = document.getElementsByClassName("a-column a-span2 olpPriceColumn")[0].getElementsByClassName("olpShippingPrice")[0].innerText;
shprice = shipping.replace(/(\D+)/g, '');
}
catch(e1)
{
shprice = 0;
}
console.log('1');

var sellerG = document.querySelectorAll('.olpSellerName');

if ( disable == 0 ) {
    if ( shprice > Bshiprice ) {
        await sleep(2*1000);
        location.reload();
    }
    else if( price < Bprice ){
    //price
    document.body.style.background = "pink";
    beep(200, 520, 200);
    document.getElementsByName("submit.addToCart")[0].click();
    }
    else if( sellerG ){
        for ( var i = 0 ; i<sellerG.length; i++ ) {
            if ( sellerG[i].children[0].tagName == 'IMG' ) {
                document.body.style.background = "blue";
                beep(200, 520, 200);
                document.getElementsByName("submit.addToCart")[0].click();
            }
        }
    }
}else if(sellerG){
   for ( var d = 0 ; d<sellerG.length; d++ ) {
       if ( sellerG[d].children[0].tagName == 'IMG' ) {
           document.body.style.background = "blue";
           beep(200, 520, 200);
           document.getElementsByName("submit.addToCart")[0].click();

       }
   }
}
if (window.location.href.indexOf("shipoptionselect") != -1) {
    await sleep(5000);
    location.reload();
}
        console.log('refresh');
            if ( window.location.href.indexOf("shipoptionselect") == -1 && window.location.href.indexOf("addressselect") == -1 && window.location.href.indexOf("/gp/buy/spc/handlers/") == -1 && window.location.href.indexOf("order-history") == -1 && window.location.href.indexOf("order") == -1) {
                await sleep(time);
                location.reload();
            }

}
    else{
         if (window.location.href.indexOf("amazonbotauth") != -1) {
         }else{
         alert('請先註冊');
         }
    }
})();