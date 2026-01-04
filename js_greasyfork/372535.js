// ==UserScript==
// @name        FUT 21 Set Range Bid
// @version     0.4
// @description Set range bid
// @license     MIT
// @author      Sy
// @match        https://www.ea.com/*/fifa/ultimate-team/web-app/*
// @match        https://www.ea.com/fifa/ultimate-team/web-app/*
// @grant       GM_notification
// @grant       window.focus
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @namespace SY
// @downloadURL https://update.greasyfork.org/scripts/372535/FUT%2021%20Set%20Range%20Bid.user.js
// @updateURL https://update.greasyfork.org/scripts/372535/FUT%2021%20Set%20Range%20Bid.meta.js
// ==/UserScript==
// ==OpenUserJS==
// @author Sy
// ==/OpenUserJS==
(function () {
  'use strict';


  ////////////
  // SCRIPT //
  ////////////


  services.Authentication._oAuthentication.observe(
    this,
    () => {

      console.log('Extension Set Range Bid lancé');

      // force full web app layout in any case
      $('body').removeClass('phone').addClass('landscape');

      // get rid of pinEvents when switching tabs
      document.removeEventListener('visibilitychange', onVisibilityChanged);



      $('head').append(`
        <style id="addedCSSDetailPlayer" type="text/css">
          .detail-carousel {
            padding: 0px !important;
          }

          .DetailView .ut-item-details--metadata
          {
            padding: 4px !important;
          }
        </style>
      `);



    var globalButtons = [
      '200',
      '300',
      '800',
      '900'
    ];

    var globalFutbinButtons = [
      '0',
      '100',
      '200',
      '300'
    ];

    var globalCssButtons = [
      "background-color: #201a56",
      "color: #fff",
      "margin-top: 2px",
      "display: inline-block",
      "width: 45%",
      "margin-left: 5px",
      "text-align: center",
      "float: left"
    ];

    var globalCssButtonsFutbin = [
      "background-color: #0fc370",
      "color: #fff",
      "margin-top: 2px",
      "display: inline-block",
      "width: 45%",
      "margin-left: 5px",
      "text-align: center",
      "float: left"
    ];

    var globalCssDuplicateButtons = [
        "background-color: #7e42f5;color: #fff;margin-top: 2px;display: inline-block;width: 45%;margin-left: 5px;text-align: center;float: left;padding: 4px;"
    ];

    $(document).bind('DOMNodeInserted', function(event) {

      if ($(event.target).hasClass("DetailPanel") && $(event.target).find('.ut-quick-list-panel-view').length > 0) {

        var quickListPanel = getQuickListPanel();

        if ($(event.target).find('#duplicatePriceContainer').length === 0)
        {
          $('<div id="duplicatePriceContainer" style="width: 112px; margin: 0 auto;"></div><div style="clear:both;"></div>').insertBefore($(event.target).find('.panelActions .panelActionRow').get(2));
          $(event.target).find('#duplicatePriceContainer').append('<div class="panelActionRow"><button class="standard duplicatePriceUp" style="'+globalCssDuplicateButtons.join(';')+'">↑</button><button class="standard duplicatePriceDown" style="'+globalCssDuplicateButtons.join(';')+'">↓</button><div style="clear:both;"></div></div>');


          $('.duplicatePriceUp').click(function () {
            var buyNowPrice = getBuyNowPriceInputValue();
            var bidValue = buyNowPrice - getRange(buyNowPrice);

            quickListPanel._view._bidNumericStepper._currencyInput.value = bidValue;
            // gNavManager.getCurrentScreenController()._controller._rightController._currentController._quickListPanel._view._bidNumericStepper._numericInput.value = bidValue;
          });

         $('.duplicatePriceDown').click(function () {
            var bidValue = getBidPriceInputValue();
            var buyNowPrice = bidValue + getRange(bidValue);

            quickListPanel._view._buyNowNumericStepper._currencyInput.value = buyNowPrice;
            // gNavManager.getCurrentScreenController()._controller._rightController._currentController._quickListPanel._view._buyNowNumericStepper._numericInput.value = buyNowPrice;
          });

        }

        if ($(event.target).find('#setRangePriceContainer').length === 0)
        {
          $(event.target).find('.panelActions').append('<div id="setRangePriceContainer" style="margin-top: 12px;"></div><div style="clear:both;"></div>');
        }

        globalButtons.forEach(function (rangePrice) {
          if ($(event.target).find('#setRangePrice' + rangePrice).length === 0)
          {
            $(event.target).find('#setRangePriceContainer').append('<button class="list setRangePrice" id="setRangePrice'+rangePrice+'" data-range="'+rangePrice+'" style="'+globalCssButtons.join(';')+'">Set +'+rangePrice+'</button>');
          }
        });

        globalFutbinButtons.forEach(function(rangePrice) {
          if ($(event.target).find('#setRangePriceFutbin' + rangePrice).length === 0)
          {
            $(event.target).find('#setRangePriceContainer').append('<button class="list setRangePriceFutbin" id="setRangePriceFutbin'+rangePrice+'" data-range="'+rangePrice+'" style="'+globalCssButtonsFutbin.join(';')+'">Futbin -'+rangePrice+'</button>');
          }
        });


        $('.setRangePriceFutbin').click(function() {
          var range = $(this).attr('data-range');
          range = parseInt(range);

          var futBinPrice = $('.listFUTItem.selected .auctionValue.futbin').eq(0).find('.coins').text();
          futBinPrice = futBinPrice.replace(/\,/gi, "");
          futBinPrice = parseInt(futBinPrice);

          var lowestBuyNow = futBinPrice - range;
          var lowestBid = lowestBuyNow - getRange(lowestBuyNow);


          quickListPanel._view._bidNumericStepper._currencyInput.value = lowestBid;
          quickListPanel._view._buyNowNumericStepper._currencyInput.value = lowestBuyNow;

        });

        $('.setRangePrice').click(function() {
          var range = $(this).attr('data-range');
          range = parseInt(range);

          var boughtPrice = getBoughtPrice();
          var lowestBid = boughtPrice + range;
          var lowestBuyNow = lowestBid + getRange(lowestBid);

          quickListPanel._view._bidNumericStepper._currencyInput.value = lowestBid;
          quickListPanel._view._buyNowNumericStepper._currencyInput.value = lowestBuyNow;

          // gNavManager.getCurrentScreenController()._controller._rightController._currentController._quickListPanel._view._bidNumericStepper._numericInput.value = lowestBid;
          // gNavManager.getCurrentScreenController()._controller._rightController._currentController._quickListPanel._view._buyNowNumericStepper._numericInput.value = lowestBuyNow;
        });
      }


    });






    },
  );


  function getQuickListPanel()
  {
    var controller = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._rightController._currentController;
    var quickListPanel = controller._quickListPanel;
    return quickListPanel;
  }

  function getBidPriceInputValue()
  {
    var quickListPanel = getQuickListPanel();
    return quickListPanel._view._bidNumericStepper._currencyInput.value;
  }

  function getBuyNowPriceInputValue()
  {

    var quickListPanel = getQuickListPanel();
    return quickListPanel._view._buyNowNumericStepper._currencyInput.value;
  }

  function getBoughtPrice()
  {
    var quickListPanel = getQuickListPanel();
    var price = quickListPanel._view.__boughtPriceValue.innerHTML;

    price = price.replace(/&nbsp;/gi,'');
    price = price.replace(/ /gi,'');
    price = price.replace(/ /gi,'');
    return parseInt(price);
  }

  function getRange(oldVal)
  {
      oldVal = parseInt(oldVal);
      var range = 50;

      if (oldVal <= 1000)
      {
          range = 50;
      }
      else if (oldVal <= 10000)
      {
        range = 100;
      }
      else if (oldVal <= 50000)
      {
       range = 250;
      }
      else
      {
          range = 500;
      }

      return range;
  }


})();
