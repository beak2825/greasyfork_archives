// ==UserScript==
// @name         BlockchainCuties Currency Changer
// @version      0.62
// @description  a small script for Blockchain Cuties to change currency
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
// @downloadURL https://update.greasyfork.org/scripts/369958/BlockchainCuties%20Currency%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/369958/BlockchainCuties%20Currency%20Changer.meta.js
// ==/UserScript==
// @require http://code.jquery.com/jquery-latest.js

(function() {
    'use strict';
    var ethPriceEur = 0;
    var ethPriceUsd = 0;
$.ajax({
       url: 'https://api.coinmarketcap.com/v2/ticker/1027/?convert=EUR',
       type: 'GET',
       success: function(res) {
      ethPriceEur = res.data.quotes.EUR.price;
      ethPriceUsd = res.data.quotes.USD.price;
     }});
  $(document).ready(function() {
     setTimeout(
      function()
        {
         var ethVal = 0;
         $('.price_icon:contains("Ξ")').each(function(){
             ethVal = parseFloat($(this).next('span').text());
            var priceEur = (Math.round((ethVal * ethPriceEur)*100) / 100) + ' EUR';
            var priceUsd = (Math.round((ethVal * ethPriceUsd)*100) / 100) + ' USD';
             $(this).parents('.pet_card_status').attr('title', priceEur + ' / ' + priceUsd);
             $(this).parents('.pet_bid-box').attr('title', priceEur + ' / ' + priceUsd);
             $(this).parents('.pet_banner-status').attr('title', priceEur + ' / ' + priceUsd);
         });
         $('span[data-click="shop_buy_eth"]').each(function(){
             ethVal = parseFloat($(this).text().substring(2));
           console.log(ethVal);
            var priceEur = (Math.round((ethVal * ethPriceEur)*100) / 100) + ' EUR';
            var priceUsd = (Math.round((ethVal * ethPriceUsd)*100) / 100) + ' USD';
             $(this).parents('.shop-buy-button-empty').attr('title', priceEur + ' / ' + priceUsd);
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
            var priceEur = (Math.round((ethVal * ethPriceEur)*100) / 100) + ' EUR';
            var priceUsd = (Math.round((ethVal * ethPriceUsd)*100) / 100) + ' USD';
             $(this).parents('.pet_card_status').attr('title', priceEur + ' / ' + priceUsd);
         });
         $('span[data-click="shop_buy_eth"]').each(function(){
             ethVal = parseFloat($(this).text().substring(2));
           console.log(ethVal);
            var priceEur = (Math.round((ethVal * ethPriceEur)*100) / 100) + ' EUR';
            var priceUsd = (Math.round((ethVal * ethPriceUsd)*100) / 100) + ' USD';
             $(this).parents('.shop-buy-button-empty').attr('title', priceEur + ' / ' + priceUsd);
         });
       }, 2500);
});
})();