// ==UserScript==
// @name        FUT 19 Search Min BIN
// @version     0.1
// @description Search Min Bin
// @license     MIT
// @author      Sy
// @match       https://www.easports.com/*/fifa/ultimate-team/web-app/*
// @grant       GM_notification
// @grant       window.focus
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @namespace SY
// @downloadURL https://update.greasyfork.org/scripts/372541/FUT%2019%20Search%20Min%20BIN.user.js
// @updateURL https://update.greasyfork.org/scripts/372541/FUT%2019%20Search%20Min%20BIN.meta.js
// ==/UserScript==
// ==OpenUserJS==
// @author Sy
// ==/OpenUserJS==
(function () {
  'use strict';

  var globalMinimumBIN = 9999999999;
  var globalMaskedDefId = 0;
  var globalOldMinimumBIN = globalMinimumBIN;
  var globalRareFlag;

  var cssConfigSearchMinBIN = 'height: 100%;' +
    'margin: 0 20px;' +
    'font-weight: bold;';

  ///////////////
  // GM CONFIG //
  ///////////////

  var searchMinBINConfigFields = {
    'searchminbin_delay':
    {
        'label': 'Délais entre chaque recherche (ms)',
        'section': ['Configuration'],
        'type': 'int',
        'default': 4000,
        'min': 1
    },
  };

  var GM_configSearchMinBIN = new GM_configStruct({
    'id': 'SearchMinBINConfig',
    'title': 'FUT 19 - Search Min BIN',
    'fields': searchMinBINConfigFields
  });

  function getConfigRequestDelay()
  {
    return parseInt(GM_configSearchMinBIN.get('searchminbin_delay'));
  }


  ////////////
  // SCRIPT //
  ////////////


  services.Authentication._oAuthentication.observe(
    this,
    () => {

      console.log('Extension Search Min BIN lancée');

      // force full web app layout in any case
      $('body').removeClass('phone').addClass('landscape');

      // get rid of pinEvents when switching tabs
      document.removeEventListener('visibilitychange', onVisibilityChanged);



    $(document).bind('DOMNodeInserted', function(event) {
    
      if ($(event.target).hasClass("DetailPanel")) {

        if ($(event.target).find('#searchMinBin').length === 0) {
          $(event.target).find('.bidOptions').append('<button class="btn-standard" id="searchMinBin">Search min BIN</button><div id="searchMinBinText" style="padding: 3%;"></div>');
          $('#searchMinBin').click(function() {
            $('#searchMinBinText').html('');
            var playerId = getPlayerId();
            var rareFlag = getRareFlag();

            search(playerId, rareFlag, 9999999999).observe(this, handleSearch);
          });
        }

        if ($(event.target).find('#searchMinBinQuickList').length === 0) {
          $(event.target).find('.QuickListPanel .ut-button-group').append('<button class="list" id="searchMinBinQuickList"><span class="btn-text">Search min BIN</span></button><div id="searchMinBinQuickListText" style="padding: 3%;"></div>');

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

          setTimeout(function() { search(globalMaskedDefId, globalRareFlag, minimumBINToSearch).observe(this, handleSearchQuickList); }, getConfigRequestDelay());
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

        var quickList = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController()._currentController._itemDetailController._currentController._quickListPanel;

        quickList._view._bidNumericStepper._currencyInput.value = lowestBid;
        quickList._view._buyNowNumericStepper._currencyInput.value = lowestBuyNow;
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

          setTimeout(function() { search(globalMaskedDefId, globalRareFlag, minimumBINToSearch).observe(this, handleSearch); }, getConfigRequestDelay());
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
            title: "FUT 19 Web App",
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



    },
  );    



  function getRareFlag()
  {
    return getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController()._currentController._itemDetailController._currentController._quickListPanel._item.rareflag;
  }

  function getPlayerId()
  {
    return getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController()._currentController._itemDetailController._currentController._quickListPanel._item._metaData.id;
  }

  
  $(document).bind('DOMNodeInserted', function(event) {
    // DOM INSERT FOOTER
    if ($(event.target).attr('id') == 'FIFAHeader')
    {
      if ($(event.target).find('#searchMinBINConfig').length === 0)
      {
        $('#FIFAHeader').find('.fifa').after('<button id="searchMinBINConfig" class="" aria-disabled="false" style="'+cssConfigSearchMinBIN+'">Search Min BIN</button>');
        $('#searchMinBINConfig').click(function() {
          GM_configSearchMinBIN.open();
        });
      }
    }
  });

})();
