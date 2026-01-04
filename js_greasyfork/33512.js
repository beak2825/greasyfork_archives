// ==UserScript==
// @name         FUT 18 APP - Auto Buy
// @namespace    SY
// @version      2.2
// @description  try to take over the world!
// @author       SY
// @match        https://www.easports.com/fifa/ultimate-team/web-app/*
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_notification
// @grant       window.focus
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_log
// @downloadURL https://update.greasyfork.org/scripts/33512/FUT%2018%20APP%20-%20Auto%20Buy.user.js
// @updateURL https://update.greasyfork.org/scripts/33512/FUT%2018%20APP%20-%20Auto%20Buy.meta.js
// ==/UserScript==


(function() {
  'use strict';

  ////////////
  // CONFIG //
  ////////////

  // Si activé, switch le level entre "rien/any" et "or/gold" pour éviter le cache au maximum
  var globalToggleLevel;
  var globalChangeMinBuy;


  ///////////////
  // GM CONFIG //
  ///////////////

  var globalConfigFields = {
    'max_buy':
    {
        'label': 'Nb. max de buy',
        'section': ['Configuration'],
        'type': 'int',
        'default': 10,
        'min': 1
    },

    'show_notification_success':
    {
        'label': 'SUCCESS',
        'section': ['Notification'],
        'type': 'checkbox',
        'default': true,
    },
    'show_notification_fail':
    {
        'label': 'FAIL',
        'type': 'checkbox',
        'default': false,
    },
    'show_notification_end':
    {
        'label': 'END',
        'type': 'checkbox',
        'default': true,
    },
    'show_notification_log':
    {
        'label': 'LOG',
        'type': 'checkbox',
        'default': false,
    },

    'delay_after_buy':
    {
        'label': 'Après un buy',
        'section': ['Délais / Pause (en ms)'],
        'type': 'int',
        'default': 30000,
        'min': 0
    },
    'delay_refresh_min':
    {
        'label': 'Après un refresh (MIN)',
        'type': 'int',
        'default': 5000,
        'min': 0
    },
    'delay_refresh_max':
    {
        'label': 'Après un refresh (MAX)',
        'type': 'int',
        'default': 9000,
        'min': 0
    },

    'pause_mode':
    {
        'label': 'Activer la pause',
        'section': ['Pause Mode'],
        'type': 'checkbox',
        'default': true,
    },
    'pause_nb_refresh_limit':
    {
        'label': 'Nb Refresh avant la pause',
        'type': 'int',
        'default': 35,
        'min': 0
    },
    'pause_delay':
    {
        'label': 'Durée de la pause (ms)',
        'type': 'int',
        'default': 65000,
        'min': 0
    },

    'level_switcher_mode':
    {
        'label': 'Activer le changement du filtre Level',
        'section': ['Anti-Cache : Level'],
        'type': 'checkbox',
        'default': true,
    },
    'level_switcher_default':
    {
        'label': 'Level à switcher',
        'type': 'select',
        'options': ['gold', 'silver', 'bronze'],
        'default': 'gold',
    },

    'min_buy_switcher_mode':
    {
        'label': 'Activer le changement du MinBuy',
        'section': ['Anti-Cache : Min Buy'],
        'type': 'checkbox',
        'default': true,
    },
    'min_buy_switcher_limit':
    {
        'label': 'Limit du minBuy',
        'type': 'int',
        'default': 600,
        'min': 0
    },

  };

  GM_config.init({
    'id': 'MyConfig',
    'title': 'FUT 18 - AutoBuyer',
    'fields': globalConfigFields
  });

  function getConfigMaxBuy()
  {
    return parseInt(GM_config.get('max_buy'));
  }

  function getConfigShowNotificationSuccess()
  {
    return GM_config.get('show_notification_success');
  }
  function getConfigShowNotificationFail()
  {
    return GM_config.get('show_notification_fail');
  }
  function getConfigShowNotificationEnd()
  {
    return GM_config.get('show_notification_end');
  }
  function getConfigShowNotificationLog()
  {
    return GM_config.get('show_notification_log');
  }

  function getConfigDelayAfterBuy()
  {
    return GM_config.get('delay_after_buy');
  }
  function getConfigDelayRefreshMin()
  {
    return GM_config.get('delay_refresh_min');
  }
  function getConfigDelayRefreshMax()
  {
    return GM_config.get('delay_refresh_max');
  }

  function getConfigPauseMode()
  {
    return GM_config.get('pause_mode');
  }
  function getConfigPauseNbRefreshLimit()
  {
    return GM_config.get('pause_nb_refresh_limit');
  }
  function getConfigPauseDelay()
  {
    return GM_config.get('pause_delay');
  }

  function getConfigLevelSwitcherMode()
  {
    return GM_config.get('level_switcher_mode');
  }
  function getConfigLevelSwitcherDefault()
  {
    return GM_config.get('level_switcher_default');
  }

  function getConfigMinBuySwitcherMode()
  {
    return GM_config.get('min_buy_switcher_mode');
  }
  function getConfigMinBuySwitcherLimit()
  {
    return GM_config.get('min_buy_switcher_limit');
  }

  /////////////
  // VARS    //
  /////////////


  // Pas touche :-)
  var globalIsPauseRefresh = false;

  var autoRefreshInterval;
  var globalCountAutoBuy = 0;
  var globalCountAutoRefresh = 0;
  var globalCurrentAuctions = [];

  var globalIsPause = false;
  var globalAutoBuyerStarted = false;
  var globalAutoBuyerObserver;
  var globalCurrentDefId;
  var globalCurrentMaxBid = 0;

  var globalSearchCategory;
  var globalSearchClub;
  var globalSearchLeague;
  var globalSearchMaskedDefId;
  var globalSearchNation;
  var globalSearchPlayStyle;
  var globalSearchPosition;
  var globalSearchType;

  var globalIsBuy = false;

    function getNewMinBuy(val)
    {
        val += 50;
        if (val > getConfigMinBuySwitcherLimit()) val = 0;
        return val;
    }

    function getRandom(min, max) {
        var randTime = Math.random() * (max - min) + min;
        randTime = Math.floor(randTime);
        return randTime;
    }

    function _onRequestItemsComplete2(t, data) {
        t.unobserve(this);
        if (globalAutoBuyerStarted)
        {
            globalAutoBuyerObserver = t;

            if (data.items.length > 0)
            {
                if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : CHECK ITEMS');

                // GET ITEM
                var itemSelected = false;
                data.items.forEach(function (item) {
                    if (getConfigShowNotificationLog()) console.log(item);
                    // if (globalCurrentAuctions.indexOf(item._auction.tradeId) < 0 && item._metaData.id == globalCurrentDefId && item._auction.buyNowPrice <= globalCurrentMaxBid)
                    if (globalCurrentAuctions.indexOf(item._auction.tradeId) < 0)
                    {
                        itemSelected = item;
                    }
                });

                if (itemSelected !== false)
                {
                    if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : ITEM FOUND');


                    // PUSH ITEM IN CURRENT AUCTIONS
                    globalCurrentAuctions.push(itemSelected._auction.tradeId);

                    // STOP AUTO BUYER

                    globalIsPause = true;

                    buyPlayer(itemSelected);

                    // TERMINE
                    if (globalCountAutoBuy >= getConfigMaxBuy())
                    {
                        if (getConfigShowNotificationEnd() === true)
                        {
                            GM_notification({
                                text: 'Autobuyer terminé',
                                title: "FUT 18 Web App",
                                onclick: function() { window.focus(); },
                            });
                        }
                        if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : END');
                        stopAutoBuyer();
                    }

                    globalIsPause = false;
                }
                else
                {
                    if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : NO ITEM SELECTED');
                }
            }
            else
            {
                if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : NOT FOUND');
                if (globalIsPauseRefresh)
                    $('#autoRefreshList').html('Auto Buyer en pause .. ('+globalCountAutoRefresh+') - ' + globalCountAutoBuy + ' buy sur ' + getConfigMaxBuy());
                else
                    $('#autoRefreshList').html('Auto Buyer en cours .. ('+globalCountAutoRefresh+') - ' + globalCountAutoBuy + ' buy sur ' + getConfigMaxBuy());
            }
        }
    }

    function buyPlayer(item)
    {

        var auction = item._auction;
        var tradeId = auction.tradeId;
        var buyNowPrice = auction.buyNowPrice;

        var o = new communication.BidDelegate(tradeId, buyNowPrice);
        o.addListener(communication.BaseDelegate.SUCCESS, this, function _bidSuccess(sender, response) {
            globalCountAutoBuy++;
            globalIsBuy = true;

            if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : BUY !!');
            if (getConfigShowNotificationLog()) console.log(auction);
            if (getConfigShowNotificationLog()) console.log(globalCurrentAuctions);
            if (getConfigShowNotificationLog()) console.log('SUCCESS BID');

            if (getConfigShowNotificationSuccess() === true)
            {
                GM_notification({
                    text: 'SUCCESS ('+globalCountAutoBuy+'/'+getConfigMaxBuy()+') - ' + buyNowPrice + ' / ' + globalCurrentMaxBid,
                    title: "FUT 18 Web App",
                    onclick: function() { window.focus(); },
                });
            }
        });
        o.addListener(communication.BaseDelegate.FAIL, this, function _bidFailure(sender, response) {
            if (getConfigShowNotificationLog()) console.log('FAIL BID');

            if (getConfigShowNotificationFail() === true)
            {
                GM_notification({
                    text: 'FAILED ('+globalCountAutoBuy+'/'+getConfigMaxBuy()+') - ' + buyNowPrice + ' / ' + globalCurrentMaxBid,
                    title: "FUT 18 Web App",
                    onclick: function() { window.focus(); },
                });
            }
        });
        o.send();

        // auction.bid(buyNowPrice);
    }

    function stopAutoBuyer()
    {
        globalAutoBuyerStarted = false;
        clearInterval(autoRefreshInterval);
        if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : STOP AUTO BUY');
        $('#autoRefreshList').removeClass('started');
        $('#autoRefreshList').html('Auto Buyer Stopped');
    }

    function stockAllSearchCriteria()
    {
        globalSearchCategory = gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.category;
        globalSearchClub = gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.club;
        globalSearchLeague = gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.league;
        globalSearchMaskedDefId = gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.maskedDefId;
        globalSearchNation = gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.nation;
        globalSearchPlayStyle = gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.playStyle;
        globalSearchPosition = gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.position;
        globalSearchType = gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.type;
    }

    function isCorrectCriteria()
    {
       if (
        globalSearchCategory === gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.category
        && globalSearchClub === gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.club
        && globalSearchLeague === gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.league
        && globalSearchMaskedDefId === gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.maskedDefId
        && globalSearchNation === gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.nation
        && globalSearchPlayStyle === gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.playStyle
        && globalSearchPosition === gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.position
        && globalSearchType === gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.type
       )
            return true;
        else
            return false;
    }

    function startAutobuyer()
    {
        console.log(GM_config.get('show_notification_success'));

        globalCountAutoRefresh = 0;
        globalCountAutoBuy = 0;

        stockAllSearchCriteria();

        // globalCurrentDefId = gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.maskedDefId;
        globalCurrentMaxBid = gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.maxBuy;
        var level = gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.level;
        if (level !== "any")
        {
            globalToggleLevel = false;
        }
        else
        {
            globalToggleLevel = getConfigLevelSwitcherMode();
        }

        var minBuy = gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.minBuy;
        if (minBuy > 0)
        {
            globalChangeMinBuy = false;
        }
        else
        {
            globalChangeMinBuy = getConfigMinBuySwitcherMode();
        }

        // if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : DEF ID : ' + globalCurrentDefId);
        // if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : MAX BID: ' + globalCurrentMaxBid);

        // if (globalAutoBuyerObserver !== false) globalAutoBuyerObserver.unobserve(this);

        globalIsPause = false;
        globalAutoBuyerStarted = true;

        if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : START AUTO BUY');
        $('#autoRefreshList').addClass('started');
        $('#autoRefreshList').html('Auto Buyer started ...');

        launchRefresh(getRandom(getConfigDelayRefreshMin(), getConfigDelayRefreshMax()));
    }

    function launchRefresh(timeRefresh)
    {
        setTimeout(function() {
            if (!globalIsPause)
            {
                if (gNavManager.getCurrentScreenController()._view._screenId !== "SearchResults" || isCorrectCriteria() === false)
                {
                    stopAutoBuyer();
                }
                else if (getConfigDelayAfterBuy() > 0 && globalIsBuy)
                {
                    globalIsBuy = false;
                    var timeRefresh = getConfigDelayAfterBuy();
                    launchRefresh(timeRefresh);
                }
                else
                {
                    if (globalChangeMinBuy)
                    {
                        var currentMinBuy = gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.minBuy;
                        gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.minBuy = getNewMinBuy(currentMinBuy);
                    }

                    if (globalToggleLevel && globalChangeMinBuy && gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.minBuy == 0)
                    {
                        if (gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.level == "any")
                            gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.level = getConfigLevelSwitcherDefault();
                        else
                            gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.level = "any";

                        if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : SWITCH LEVEL : ' + gNavManager.getCurrentScreenController()._controller._listController._searchCriteria.level);
                    }

                    gNavManager.getCurrentScreenController()._controller._listController.onDataChange.observe(this, _onRequestItemsComplete2);
                    globalCountAutoRefresh++;
                    if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : REQUEST ITEMS');
                    gNavManager.getCurrentScreenController()._controller._listController._requestItems();

                    if (globalAutoBuyerStarted)
                    {
                        if (getConfigPauseMode() && globalCountAutoRefresh > 2 && (globalCountAutoRefresh%getConfigPauseNbRefreshLimit()) == 0)
                        {
                            var timeRefresh = getConfigPauseDelay();
                            globalIsPauseRefresh = true;
                            if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : AUTO BUYER EN PAUSE');
                        }
                        else
                        {
                            globalIsPauseRefresh = false;
                            if (getConfigDelayAfterBuy() > 0 && globalIsBuy)
                            {
                                globalIsBuy = false;
                                var timeRefresh = getConfigDelayAfterBuy();
                            }
                            else
                            {
                                globalIsPauseRefresh = false;
                                var timeRefresh = getRandom(getConfigDelayRefreshMin(), getConfigDelayRefreshMax());
                            }
                        }

                        launchRefresh(timeRefresh);
                    }
                }
            }
        }, timeRefresh);
    }

  $(document).bind('DOMNodeInserted', function(event) {

    if ($(event.target).hasClass("Dialog")) {
        console.log('SEARCH MARKET : DIALOG DETECTED');
        var intervalVerificationDialog = setInterval(function () {
            if ($(event.target).find('header > h1:eq(0)').text() != "")
            {
                if ($(event.target).find('header > h1:eq(0)').text() == "Vérification requise")
                {
                    stopAutoBuyer();
                    console.log('SEARCH MARKET : STOP VERIFICATION !');
                }
                clearInterval(intervalVerificationDialog);
            }

        }, 50);
    }

    if ($(event.target).attr('id') == 'footer')
    {
        if ($(event.target).find('#autobuyConfig').length === 0)
        {
            $('#footer').append('<button id="autobuyConfig" class="btnFooter btnSettings selected" aria-disabled="false" style="bottom: 40px">Auto Buy</button>');
            $('#autobuyConfig').click(function() {
                GM_config.open();
            });
        }
    }

    if ($(event.target).hasClass("SearchResults")) {
      if ($(event.target).find('#autoRefreshList').length === 0) {
        setInterval(function() { $(event.target).find('.pagingContainer').show(); }, 1000);
        $(event.target).find('.pagingContainer').append('<a class="btn-flat pagination next" style="float: right" id="autoRefreshList">Auto Buyer</a>');

        $('#autoRefreshList').click(function () {
            // STOP AUTO BUY
            if ($('#autoRefreshList').hasClass('started') || globalAutoBuyerStarted)
            {
                stopAutoBuyer();
            }
            // START AUTO BUY
            else
            {
                startAutobuyer();
            }
        });
      }
    }
  });









})();