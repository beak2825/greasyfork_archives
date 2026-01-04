// ==UserScript==
// @name         Blockchain Cuties Currency Changer HUF
// @name:hu      Blockchain Cuties Pénznem váltó / számláló
// @version      0.6
// @description  a small script for Blockchain Cuties to change currency to HUF and USD
// @description:hu  egy kis program, ami az aktuális Ethereum árak alapján hover-re kiírja az aktuális Cutie, vagy felszerelés forint és dollár értékét
// @author       VeRychard  <me@verychard.com>
// @icon         http://hyperfocus.net/darkcuties_logo.png
// @match        https://blockchaincuties.co/pet/*
// @match        https://blockchaincuties.co/item/*
// @match        https://blockchaincuties.co/pets_sell*
// @match        https://blockchaincuties.co/pets_breed*
// @match        https://blockchaincuties.co/items_sell*
// @match        https://blockchaincuties.co/shop
// @match        https://blockchaincuties.com/pet/*
// @match        https://blockchaincuties.com/item/*
// @match        https://blockchaincuties.com/pets_sell*
// @match        https://blockchaincuties.com/pets_breed*
// @match        https://blockchaincuties.com/items_sell*
// @match        https://blockchaincuties.com/shop
// @grant        none
// @namespace https://greasyfork.org/users/193828
// @downloadURL https://update.greasyfork.org/scripts/369959/Blockchain%20Cuties%20Currency%20Changer%20HUF.user.js
// @updateURL https://update.greasyfork.org/scripts/369959/Blockchain%20Cuties%20Currency%20Changer%20HUF.meta.js
// ==/UserScript==
// @require http://code.jquery.com/jquery-latest.js

(function() {
    'use strict';
    var ethPriceHuf = 0;
    var ethPriceUsd = 0;
$.ajax({
       url: 'https://api.coinmarketcap.com/v2/ticker/1027/?convert=HUF',
       type: 'GET',
       success: function(res) {
      ethPriceHuf = res.data.quotes.HUF.price;
      ethPriceUsd = res.data.quotes.USD.price;
     }});
  $(document).ready(function() {
     setTimeout(
      function()
        {
         var ethVal = 0;
         $('.price_icon:contains("Ξ")').each(function(){
             ethVal = parseFloat($(this).next('span').text());
            var priceHuf = Math.ceil(ethVal * ethPriceHuf) + ' HUF';
            var priceUsd = (Math.round((ethVal * ethPriceUsd)*100) / 100) + ' USD';
             $(this).parents('.pet_card_status').attr('title', priceHuf + ' / ' + priceUsd);
             $(this).parents('.pet_bid-box').attr('title', priceHuf + ' / ' + priceUsd);
             $(this).parents('.pet_banner-status').attr('title', priceHuf + ' / ' + priceUsd);
             $(this).parents('.pet_status-note').attr('title', priceHuf + ' / ' + priceUsd);
         });
          
        
         $('span[data-click="shop_buy_eth"]').each(function(){
             ethVal = parseFloat($(this).text().substring(2));
           console.log(ethVal);
            var priceHuf = Math.ceil(ethVal * ethPriceHuf) + ' HUF';
            var priceUsd = (Math.round((ethVal * ethPriceUsd)*100) / 100) + ' USD';
             $(this).parents('.shop-buy-button-empty').attr('title', priceHuf + ' / ' + priceUsd);
         });
       }, 2500);
});

    $("body").on('DOMSubtreeModified', ".cutie_gal", function() {
     setTimeout(
      function()
        {
         var ethVal = 0;
         $('.price_icon:contains("Ξ")').each(function(){
             ethVal = parseFloat($(this).next('span').text());
            var priceHuf = Math.ceil(ethVal * ethPriceHuf) + ' HUF';
            var priceUsd = (Math.round((ethVal * ethPriceUsd)*100) / 100) + ' USD';
             $(this).parents('.pet_card_status').attr('title', priceHuf + ' / ' + priceUsd);
             $(this).parents('.pet_bid-box').attr('title', priceHuf + ' / ' + priceUsd);
             $(this).parents('.pet_banner-status').attr('title', priceHuf + ' / ' + priceUsd);
             $(this).parents('.pet_status-note').attr('title', priceHuf + ' / ' + priceUsd);
         });
         $('span[data-click="shop_buy_eth"]').each(function(){
             ethVal = parseFloat($(this).text().substring(2));
            var priceHuf = Math.ceil(ethVal * ethPriceHuf) + ' HUF';
            var priceUsd = (Math.round((ethVal * ethPriceUsd)*100) / 100) + ' USD';
             $(this).parents('.shop-buy-button-empty').attr('title', priceHuf + ' / ' + priceUsd);
         });
       }, 2500);
});
})();