// ==UserScript==
// @name         BotFlashSale Mi v1.5
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  try to take over the world!
// @author       Harry Andre
// @match        https://buy.mi.co.id/id/buy/product/pocophone-f1*
// @match        https://buy.mi.co.id/id/buy/product/redmi-7*
// @match        https://buy.mi.co.id/id/buy/product/redmi-note-7*
// @match        https://buy.mi.co.id/id/buy/product/redmi-go*
// @match        https://buy.mi.co.id/id/cart*
// @match        https://buy.mi.co.id/id/buy/checkout*
// @match        http://promo.mi.com/webfile/globalweb/in/404.html*
// @match        http://promo.mi.com/webfile/globalweb/id/404.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383616/BotFlashSale%20Mi%20v15.user.js
// @updateURL https://update.greasyfork.org/scripts/383616/BotFlashSale%20Mi%20v15.meta.js
// ==/UserScript==

(function() {
    'use strict';
        var d = new Date();
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var countDownDate = new Date(months[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear()+" 09:58:00").getTime();
    var items = Array(0,1,2);
// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;
    if (distance < 0) {
            setTimeout(function() {
        var cekTitle = document.getElementsByTagName("title")[0].innerHTML;
        if(cekTitle == "Pastiin alamat halaman web yang kamu masukin bener - Xiaomi Indonesia"){
        window.location.href = 'https://buy.mi.co.id/id/buy/product/redmi-note-7';
        } else if(cekTitle == "Yikes! - Xiaomi Indonesia"){
        window.location.href = 'https://buy.mi.co.id/id/buy/product/redmi-note-7';
        }
    }, 1);
    setTimeout(function() {
        document.querySelectorAll('li.step-option.J_stepOption')[0].click();
    }, 2);

function start(index){
    setTimeout(function(){
        document.querySelectorAll('li.step-option.J_stepOption.with-icon.step-option-s')[index].click();
    },500);
    setTimeout(function() {
          var cekText = document.querySelector('a#J_nextBtn.button.active.btn-primary').innerText;
       if(cekText == 'BELI SEKARANG') {
           document.querySelectorAll('a#J_nextBtn.button.active.btn-primary')[0].click();
    } else {
                location.reload();
    }
            }, 500);
}
        var x = items[Math.floor(Math.random()*items.length)];
        start(x);

               setTimeout(function() {
        document.querySelectorAll('a#mi_checkout.btn.btn-orange.btn-buy.J_checkout')[0].click();
    }, 2);
    setTimeout(function() {
        document.querySelectorAll('a.btn.btn-orange.J_continueDel')[0].click();
    }, 2);

                   setTimeout(function() {
        document.querySelectorAll('input#checkoutFormBtn.btn.btn-orange.btn-checkout.J_checkoutOrder')[0].click();
    }, 2);
    }
},500);
})();