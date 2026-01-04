// ==UserScript==
// @name         FUT 18 APP - Search Min BIN
// @namespace    SY
// @version      0.2
// @description  try to take over the world!
// @author       SY
// @match        https://www.easports.com/fifa/ultimate-team/web-app/*
// @grant       GM_notification
// @grant       window.focus
// @downloadURL https://update.greasyfork.org/scripts/33541/FUT%2018%20APP%20-%20Search%20Min%20BIN.user.js
// @updateURL https://update.greasyfork.org/scripts/33541/FUT%2018%20APP%20-%20Search%20Min%20BIN.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var globalMinimumBIN = 9999999999;
  var globalMaskedDefId = 0;
  var globalOldMinimumBIN = globalMinimumBIN;
  var globalRareFlag;


  function getRareFlag()
  {
    return gNavManager.getCurrentScreenController()._controller._rightController._currentController._quickListPanel._item.rareflag;
  }

  function getPlayerId()
  {
    return gNavManager.getCurrentScreenController()._controller._rightController._currentController._quickListPanel._item._metaData.id;
  }

  $(document).bind('DOMNodeInserted', function(event) {
    if ($(event.target).hasClass("DetailPanel")) {
      if ($(event.target).find('#searchMinBin').length === 0) {
        $(event.target).find('.bidOptions').append('<button class="standard" id="searchMinBin">Search min BIN</button><div id="searchMinBinText" style="padding: 3%;"></div>');
        $('#searchMinBin').click(function() {
          $('#searchMinBinText').html('');
          var playerId = getPlayerId();
          var rareFlag = getRareFlag();

          search(playerId, rareFlag, 9999999999).observe(this, handleSearch);
        });
      }

      if ($(event.target).find('#searchMinBinQuickList').length === 0) {
        $(event.target).find('.QuickListPanel').append('<button class="standard" id="searchMinBinQuickList">Search min BIN</button><div id="searchMinBinQuickListText" style="padding: 3%;"></div>');

        $('#searchMinBinQuickList').click(function () {
          $('#searchMinBinQuickListText').html('');
          var playerId = getPlayerId();
          var rareFlag = getRareFlag();

          search(playerId, rareFlag, 9999999999).observe(this, handleSearchQuickList);
        });
      }
    }
  });

  ///////////////////////////////
  // SEARCH MIN BIN QUICK LIST //
  ///////////////////////////////

  var handleSearchQuickList = function handleSearchQuickList(t, data) {
    addTextMinBin('#searchMinBinQuickListText', data.items.length, globalMinimumBIN);
    if (data.items.length > 0) {
      var newMinimumBIN = Math.min.apply(Math,data.items.map(function(o){return o._auction.buyNowPrice;}));
      if (newMinimumBIN < globalMinimumBIN || data.items.length >= 20) {
        $('#searchMinBinQuickList').html('Recherche en cours...');

        if (globalOldMinimumBIN === newMinimumBIN)
          var sameBid = true;
        else
          var sameBid = false;

        globalOldMinimumBIN = globalMinimumBIN;
        globalMinimumBIN = newMinimumBIN;

        if (sameBid)
          var minimumBINToSearch = globalMinimumBIN - getRange(globalMinimumBIN);
        else
          var minimumBINToSearch = globalMinimumBIN;

        setTimeout(function() { search(globalMaskedDefId, globalRareFlag, minimumBINToSearch).observe(this, handleSearchQuickList); }, 2000);
      } else {
        globalOldMinimumBIN = globalMinimumBIN;
        minBINFoundQuickList(globalMaskedDefId);
      }
    } else {
      globalOldMinimumBIN = globalMinimumBIN;
      minBINFoundQuickList(globalMaskedDefId);
    }
  };


  function minBINFoundQuickList(playerId)
  {
      $('#searchMinBinQuickList').html('Search min BIN');
      var lowestBIN = globalOldMinimumBIN;
      var player = repositories.Item.getStaticDataByDefId(playerId);

      var lowestBid = lowestBIN;
      var lowestBuyNow = lowestBIN + getRange(lowestBIN);
      gNavManager.getCurrentScreenController()._controller._rightController._currentController._quickListPanel._view._bidNumericStepper._numericInput.value = lowestBid;
      gNavManager.getCurrentScreenController()._controller._rightController._currentController._quickListPanel._view._buyNowNumericStepper._numericInput.value = lowestBuyNow;
      notifyMinBIN(player, lowestBIN);
  }

  ////////////////////
  // SEARCH MIN BIN //
  ////////////////////

  var handleSearch = function handleSearch(t, data) {
    addTextMinBin('#searchMinBinText', data.items.length, globalMinimumBIN);
    if (data.items.length > 0) {
      var newMinimumBIN = Math.min.apply(Math,data.items.map(function(o){return o._auction.buyNowPrice;}));
      if (newMinimumBIN < globalMinimumBIN || data.items.length >= 20) {
        $('#searchMinBin').html('Recherche en cours...');

        if (globalOldMinimumBIN === newMinimumBIN)
          var sameBid = true;
        else
          var sameBid = false;

        globalOldMinimumBIN = globalMinimumBIN;
        globalMinimumBIN = newMinimumBIN;

        if (sameBid)
          var minimumBINToSearch = globalMinimumBIN - getRange(globalMinimumBIN);
        else
          var minimumBINToSearch = globalMinimumBIN;

        setTimeout(function() { search(globalMaskedDefId, globalRareFlag, minimumBINToSearch).observe(this, handleSearch); }, 2000);
      } else {
        globalOldMinimumBIN = globalMinimumBIN;
        minBINFound(globalMaskedDefId);
      }
    } else {
      globalOldMinimumBIN = globalMinimumBIN;
      minBINFound(globalMaskedDefId);
    }
  };


  function minBINFound(playerId)
  {
      $('#searchMinBin').html('Search min BIN');
      var lowestBIN = globalOldMinimumBIN;
      var player = repositories.Item.getStaticDataByDefId(playerId);

      notifyMinBIN(player, lowestBIN);
  }


  //////////////////////
  // NOTIFY FUNCTIONS //
  //////////////////////

  function addTextMinBin(target, count, bin)
  {
    if (count == 20) count = '20+';
    $(target).append(count + ' <= ' + bin + '<br/>');
  }

  function notifyMinBIN(player, lowestBIN)
  {
        GM_notification({
          text: "Minimum BIN found for " + player.name + " is " + lowestBIN,
          title: "FUT 18 Web App",
          timeout: 5000,
          onclick: function() { window.focus(); },
        });
  }

  function getRange(oldVal)
  {
      oldVal = parseInt(oldVal);
      var range = 50;

      if (oldVal < 1000)
      {
          range = 50;
      }
      else if (oldVal < 10000)
      {
        range = 100;
      }
      else if (oldVal < 50000)
      {
       range = 250;
      }
      else
      {
          range = 500;
      }

      return range;
  }

  //
  // rareflag : 3 = Boost
  // 1 = gold, 1 = silver
  // Silver non rare : rareflag = 0, subtype = 1
  // Silver rare     : rareflag = 1, subtype = 1
  // Bronze non rare : rareflag = 0, subtype = 3
  // Bronze rare     : rareflag = 1, subtype = 3
  var search = function search(playerId, rareFlag, maxBuy) {
    globalMinimumBIN = maxBuy;
    globalRareFlag = rareFlag;
    globalMaskedDefId = playerId;
    console.log('MIN BIN : MaskedDefId' + globalMaskedDefId);

    if (maxBuy === 9999999999) {
      maxBuy = 0;
    }

    var searchCriteria = new transferobjects.SearchCriteria;
    searchCriteria.type = enums.SearchType.PLAYER;
    // searchCriteria.defId = [globalMaskedDefId];
    searchCriteria.maskedDefId = globalMaskedDefId;
    searchCriteria.maxBuy = maxBuy;

    if (rareFlag != 1 && rareFlag != 0)
    {
      searchCriteria.level = enums.SearchLevel.SPECIAL;
    }

    console.log(searchCriteria);

    return repositories.TransferMarket.search(searchCriteria);
  };
})();