// ==UserScript==
// @name         FUT 18 APP - Set Range Bid
// @namespace    SY
// @version      0.2
// @description  try to take over the world!
// @author       SY
// @match        https://www.easports.com/fifa/ultimate-team/web-app/*
// @grant       GM_notification
// @grant       window.focus
// @downloadURL https://update.greasyfork.org/scripts/33585/FUT%2018%20APP%20-%20Set%20Range%20Bid.user.js
// @updateURL https://update.greasyfork.org/scripts/33585/FUT%2018%20APP%20-%20Set%20Range%20Bid.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var globalButtons = [
    '200',
    '300',
    '800',
    '900'
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

  var globalCssDuplicateButtons = [
    "margin-right: 5px",
    "display: inline-block",
    "float: left"
  ];

  $(document).bind('DOMNodeInserted', function(event) {
    if ($(event.target).hasClass("DetailPanel") && $(event.target).find('.QuickListPanel').length > 0) {

      if ($(event.target).find('#duplicatePriceContainer').length === 0)
      {
        $('<div id="duplicatePriceContainer" style="width: 112px; margin: 0 auto;"></div><div style="clear:both;"></div>').insertBefore($(event.target).find('.panelActions .panelActionRow').get(2));
        $(event.target).find('#duplicatePriceContainer').append('<div class="panelActionRow"><button class="standard duplicatePriceUp" style="'+globalCssDuplicateButtons.join(';')+'">↑</button><button class="standard duplicatePriceDown" style="'+globalCssDuplicateButtons.join(';')+'">↓</button><div style="clear:both;"></div></div>');

        $('.duplicatePriceUp').click(function () {
          var buyNowPrice = getBuyNowPriceInputValue();
          var bidValue = buyNowPrice - getRange(buyNowPrice);
          gNavManager.getCurrentScreenController()._controller._rightController._currentController._quickListPanel._view._bidNumericStepper._numericInput.value = bidValue;
        });

       $('.duplicatePriceDown').click(function () {
          var bidValue = getBidPriceInputValue();
          var buyNowPrice = bidValue + getRange(bidValue);
          gNavManager.getCurrentScreenController()._controller._rightController._currentController._quickListPanel._view._buyNowNumericStepper._numericInput.value = buyNowPrice;
        });

      }

      if ($(event.target).find('#setRangePriceContainer').length === 0)
      {
        $(event.target).find('.panelActions').append('<div id="setRangePriceContainer" style="margin-top: 12px;"></div><div style="clear:both;"></div>');
      }

      globalButtons.forEach(function (rangePrice) {
        console.log(rangePrice);
        if ($(event.target).find('#setRangePrice' + rangePrice).length === 0)
        {
          $(event.target).find('#setRangePriceContainer').append('<button class="list setRangePrice" id="setRangePrice'+rangePrice+'" data-range="'+rangePrice+'" style="'+globalCssButtons.join(';')+'">Set +'+rangePrice+'</button>');
        }
      });

      $('.setRangePrice').click(function() {
        var range = $(this).attr('data-range');
        range = parseInt(range);

        var boughtPrice = getBoughtPrice();

        var lowestBid = boughtPrice + range;
        var lowestBuyNow = lowestBid + getRange(lowestBid);

        gNavManager.getCurrentScreenController()._controller._rightController._currentController._quickListPanel._view._bidNumericStepper._numericInput.value = lowestBid;
        gNavManager.getCurrentScreenController()._controller._rightController._currentController._quickListPanel._view._buyNowNumericStepper._numericInput.value = lowestBuyNow;
      });
    }
  });

  function getBidPriceInputValue()
  {
    return gNavManager.getCurrentScreenController()._controller._rightController._currentController._quickListPanel._view._bidNumericStepper._numericInput.value
  }  

  function getBuyNowPriceInputValue()
  {
    return gNavManager.getCurrentScreenController()._controller._rightController._currentController._quickListPanel._view._buyNowNumericStepper._numericInput.value;
  }

  function getBoughtPrice()
  {
    var price = gNavManager.getCurrentScreenController()._controller._rightController._currentController._quickListPanel._view.$_boughtPriceValue.html();
    price = price.replace(/&nbsp;/gi,'');
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