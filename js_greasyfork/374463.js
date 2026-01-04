// ==UserScript==
// @name        FUT 20 Auto Buyer - Android
// @version     0.5
// @description Auto Buyer Android
// @license     MIT
// @author      Sy
// @match       https://www.easports.com/*/fifa/ultimate-team/web-app/*
// @grant       GM_notification
// @grant       window.focus
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @namespace SY
// @downloadURL https://update.greasyfork.org/scripts/374463/FUT%2020%20Auto%20Buyer%20-%20Android.user.js
// @updateURL https://update.greasyfork.org/scripts/374463/FUT%2020%20Auto%20Buyer%20-%20Android.meta.js
// ==/UserScript==
// ==OpenUserJS==
// @author Sy
// ==/OpenUserJS==
(function () {
  'use strict';

  var cssConfigAutoBuyer = 'height: 100%;' +
    'margin: 0 20px;' +
    'font-weight: bold;';

  ////////////
  // CONFIG //
  ////////////

  // Si activé, switch le level entre "rien/any" et "or/gold" pour éviter le cache au maximum
  var globalToggleLevel;
  var globalToggleIPP;
  var globalChangeMinBuy;
  var globalChangeMaxOffre;
  var globalItemPerPage;
  var globalItemsFound;
  var globalCurrentPage;
  var globalItems;

  var globalMultiAutobuyer = false;
  var globalMultiAutobuyerIterator = 0;
  var globalMultiAutobuyerSearchCriteria;

  var globalDefaultMaxBuy;
  var globalDefaultMinBuy;
  var globalDefaultMaxOffre;
  var globalDefaultPlayStyle;

  var globalCrezipActive = false;

  var globalUltraFastMode = false;

  var globalCrezipStyleAll = [];
  var globalCrezipStyleGardien = [];
  var globalCrezipStyleDefenseur = [];
  var globalCrezipStyleMilieux = [];
  var globalCrezipStyleAttaquant = [];
  var globalCrezipCurrentStyles = [];
  var globalCrezipNewLoop = false;

  var globalTimeCanBuy = 0;
  var globalTimeSuccessBuy = 0;
  var globalTimeFailBuy = 0;
  var globalTimeCheckItem = 0;
  var globalTimeStartBuyPlayer = 0;
  var globalTimeLaunchNextPage = 0;

  var globalForceMaxBuy = false;

  var globalPlayStyles = {
    "all": -1,
    "base": 250,
    "sniper": 251,
    "finisseur": 252,
    "vista": 253,
    "marquage": 254,
    "oeil de lynx": 255,
    "artiste": 256,
    "architecte": 257,
    "roc": 258,
    "maestro": 259,
    "moteur": 260,
    "sentinelle": 261,
    "garde": 262,
    "gladiateur": 263,
    "charnière": 264,
    "pilier": 265,
    "chasseur": 266,
    "catalyseur": 267,
    "hom. de l'ombre": 268,
    "mur": 269,
    "bouclier": 270,
    "chat": 271,
    "gant": 272,
    "g de base": 273
  };


  /////////////
  // GM CONFIG //
  ///////////////

  var globalConfigFields = {
    'ultra_fast_mode':
    {
        'label': 'Mode ULTRA FAST',
        'section': ['Configuration'],
        'type': 'checkbox',
        'default': false,
    },
    'max_buy':
    {
        'label': 'Nb. max de buy',
        'type': 'int',
        'default': 10,
        'min': 1
    },
    'min_contract':
    {
        'label': 'Nb. min contrat',
        'type': 'int',
        'default': 0,
        'min': 0
    },
    'min_fitness':
    {
        'label': 'Nb. min forme',
        'type': 'int',
        'default': 0,
        'min': 0
    },
    'buy_first_item':
    {
        'label': 'Acheter le premier joueur trouvé. Si décocher : On fini toutes les pages pour acheter le joueur le moins cher',
        'type': 'checkbox',
        'default': true,
    },
    'buy_only_rare':
    {
        'label': 'Acheter seulement les cartes rares',
        'type': 'checkbox',
        'default': false,
    },
    'alert_when_captcha':
    {
        'label': 'Afficher un ALERT JS quand captcha',
        'type': 'checkbox',
        'default': true,
    },

    'multi_autobuyer':
    {
        'section': ['MULTI AUTO BUYER'],
        'label': '[{"maskedDefId":45854,"maxBuy":1500,"level":"gold"},{"maskedDefId":11412,"maxBuy":1100,"level":"gold"}]',
        'type': 'text',
        'default': '',
    },

    'filter_ignores_ids':
    {
        'section': ['FILTRES'],
        'label': 'On ignore les joueurs IDs suivant : (séparés par une virgule)',
        'type': 'text',
        'default': '',
    },

    'filter_buy_ids':
    {
        'label': 'maxBuy spécial selon les IDs ( ex : 160524:850,158856:1120 )',
        'type': 'text',
        'default': '',
    },

    'crezip_all_style':
    {
        'label': 'Style pour ALL',
        'section': ['CREZIP'],
        'type': 'text',
        'default': "sniper,finisseur,vista,marquage,oeil de lynx,artiste,architecte,roc,maestro,moteur,sentinelle,garde,gladiateur,charnière,pilier,chasseur,catalyseur,hom. de l'ombre,mur,bouclier,chat,gant",
    },
    'crezip_gardien_style':
    {
        'label': 'Style pour Gardien',
        'type': 'text',
        'default': "gant,chat",
    },
    'crezip_defenseur_style':
    {
        'label': 'Style pour Défenseur',
        'type': 'text',
        'default': "pilier,sentinelle,charnière",
    },
    'crezip_milieux_style':
    {
        'label': 'Style pour Milieux',
        'type': 'text',
        'default': "moteur,maestro,artiste,architecte",
    },
    'crezip_attaquant_style':
    {
        'label': 'Style pour Attaquant',
        'type': 'text',
        'default': "oeil de lynx,finisseur,vista,sniper",
    },
    'crezip_max_buy_limit':
    {
        'label': 'Limit du maxBuy (+)',
        'type': 'int',
        'default': 0,
        'min': 0
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

    'delay_refresh_min_next_page':
    {
        'label': 'Pour la page suivante (MIN)',
        'type': 'int',
        'default': 1500,
        'min': 0
    },
    'delay_refresh_max_next_page':
    {
        'label': 'Pour la page suivante (MAX)',
        'type': 'int',
        'default': 3000,
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
        'default': false,
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
        'default': false,
    },
    'min_buy_switcher_limit':
    {
        'label': 'Limit du minBuy',
        'type': 'int',
        'default': 600,
        'min': 0
    },

    'max_offre_switcher_mode':
    {
        'label': 'Activer le changement du Max Offre',
        'section': ['Anti-Cache : Max Offre'],
        'type': 'checkbox',
        'default': true,
    },
    'max_offre_switcher_start':
    {
        'label': 'Commencement du Max Offre',
        'type': 'int',
        'default': 1500000,
        'min': 0
    },

    'item_per_page_switcher_mode':
    {
        'label': 'Activer le changement du nombre d\'item par page',
        'section': ['Anti-Cache : Item par page'],
        'type': 'checkbox',
        'default': false,
    }


  };


  var GM_configAB = new GM_configStruct({
    'id': 'ABConfig',
    'title': 'FUT 20 - Auto Buyer',
    'fields': globalConfigFields
  });

  function getConfigMultiAutobuyer()
  {
    var str = GM_configAB.get('multi_autobuyer');
    if (str)
    {
      var arr = JSON.parse(str);
      return arr;
    }
    else
    {
      return false;
    }
  }

  function getConfigFilterIgnoresIds()
  {
    var ids = GM_configAB.get('filter_ignores_ids');
    return ids.split(',');
  }

  function getConfigFilterMaxBuyIds()
  {
    var arr = GM_configAB.get('filter_buy_ids').split(',');
    var arr2 = [];

    for(var i in arr)
    {
      var tmp = arr[i].split(':');
      arr2[tmp[0]] = tmp[1];
    }

    return arr2;
  }

  function getConfigBuyOnlyRare()
  {
    return GM_configAB.get('buy_only_rare');
  }

  function getConfigUltraFastMode()
  {
    return GM_configAB.get('ultra_fast_mode');
  }
  function getConfigMaxBuy()
  {
    return parseInt(GM_configAB.get('max_buy'));
  }
  function getConfigMinContract()
  {
    return parseInt(GM_configAB.get('min_contract'));
  }
  function getConfigMinFitness()
  {
    return parseInt(GM_configAB.get('min_fitness'));
  }
  function getConfigCrezipMaxBuyLimit()
  {
    return parseInt(GM_configAB.get('crezip_max_buy_limit'));
  }
  function getConfigShowNotificationSuccess()
  {
    return GM_configAB.get('show_notification_success');
  }
  function getConfigBuyFirstPlayerFound()
  {
    return GM_configAB.get('buy_first_item');
  }
  function getConfigAlertWhenCaptcha()
  {
    return GM_configAB.get('alert_when_captcha');
  }
  function getConfigCrezipStyle(position)
  {
    return GM_configAB.get('crezip_'+position+'_style');
  }
  function getConfigShowNotificationFail()
  {
    return GM_configAB.get('show_notification_fail');
  }
  function getConfigShowNotificationEnd()
  {
    return GM_configAB.get('show_notification_end');
  }
  function getConfigShowNotificationLog()
  {
    return GM_configAB.get('show_notification_log');
  }

  function getConfigDelayAfterBuy()
  {
    return GM_configAB.get('delay_after_buy');
  }
  function getConfigDelayRefreshMin()
  {
    return GM_configAB.get('delay_refresh_min');
  }
  function getConfigDelayRefreshMax()
  {
    return GM_configAB.get('delay_refresh_max');
  }

  function getConfigDelayRefreshMinNextPage()
  {
    return GM_configAB.get('delay_refresh_min_next_page');
  }
  function getConfigDelayRefreshMaxNextPage()
  {
    return GM_configAB.get('delay_refresh_max_next_page');
  }

  function getConfigPauseMode()
  {
    return GM_configAB.get('pause_mode');
  }
  function getConfigPauseNbRefreshLimit()
  {
    return GM_configAB.get('pause_nb_refresh_limit');
  }
  function getConfigPauseDelay()
  {
    return GM_configAB.get('pause_delay');
  }
  function getConfigLevelSwitcherMode()
  {
    return GM_configAB.get('level_switcher_mode');
  }
  function getConfigLevelSwitcherDefault()
  {
    return GM_configAB.get('level_switcher_default');
  }
  function getConfigMinBuySwitcherMode()
  {
    return GM_configAB.get('min_buy_switcher_mode');
  }
  function getConfigMinBuySwitcherLimit()
  {
    return GM_configAB.get('min_buy_switcher_limit');
  }

  function getConfigMaxOffreSwitcherMode()
  {
    return GM_configAB.get('max_offre_switcher_mode');
  }
  function getConfigMaxOffreSwitcherStart()
  {
    return GM_configAB.get('max_offre_switcher_start');
  }

  function getConfigItemPerPageMode()
  {
    return GM_configAB.get('item_per_page_switcher_mode');
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
  var globalRefreshSansResultat = 0;


  ////////////
  // SCRIPT //
  ////////////



  function generateUI(textStatus, maxBuy, minBuy, currentStyle)
  {
    var searchCriteria = getSearchCriteria();
    $('body').find('.view-navbar-abinfo').remove();

    var namePlayStyle = searchCriteria.playStyle;
    // Get style name
    for(var i in globalPlayStyles)
    {
      if (globalPlayStyles[i] == searchCriteria.playStyle)
      {
        namePlayStyle = i;
      }
    }


    var cssStatus =
      'margin-right: 15px;' +
      'font-size: 21px;' +
      'width: 50%;' +
      'text-align: center;' +
      'font-weight: bold;';

    var cssEl = 'margin-right: 25px;';


    var $status =
      '<div class="view-navbar-abinfo" style="'+cssStatus+'">' +
        textStatus +
      '</div>';

    var $containerInfo1 =
      '<div class="view-navbar-abinfo" style="'+cssEl+'">' +
        '<div class="view-navbar">' +
          'Nb. Refresh : ' + globalCountAutoRefresh +
        '</div>' +
        '<div class="view-navbar">' +
          'MaxBuy : ' + searchCriteria.maxBuy +
        '</div>' +
      '</div>';


    var $containerInfo2 =
      '<div class="view-navbar-abinfo" style="'+cssEl+'">' +
        '<div class="view-navbar">' +
          'Nb. Buy : ' + globalCountAutoBuy + ' / ' + getConfigMaxBuy() +
        '</div>' +
        '<div class="view-navbar">' +
          'MinBuy : ' + searchCriteria.minBuy +
        '</div>' +
      '</div>';

    var $containerInfo3 =
      '<div class="view-navbar-abinfo" style="'+cssEl+'">' +
        '<div class="view-navbar">' +
          'Style : ' + namePlayStyle +
        '</div>' +
        '<div class="view-navbar">' +
          'Page : ' + globalCurrentPage +
        '</div>' +
      '</div>';

    var $containerInfo5 =
      '<div class="view-navbar-abinfo" style="'+cssEl+'">' +
        '<div class="view-navbar">' +
          'Max Offre : ' + searchCriteria.maxBid +
        '</div>' +
        '<div class="view-navbar">' +
          'Min Offre : ' + searchCriteria.minBid +
        '</div>' +
      '</div>';

    var $containerInfo4 =
      '<div class="view-navbar-abinfo" style="'+cssEl+'">' +
        '<div class="view-navbar">' +
          'Contrat Min. : ' + getConfigMinContract() +
        '</div>' +
        '<div class="view-navbar">' +
          'Forme Min. : ' + getConfigMinFitness() +
        '</div>' +
      '</div>';

    var toInsert = $status + $containerInfo1 + $containerInfo2 + $containerInfo5 + $containerInfo3 + $containerInfo4;
    $('body').find('.ut-navigation-bar-view .view-navbar-currency').before(toInsert);
  }




  services.Authentication._oAuthentication.observe(
    this,
    () => {

      console.log('Extension Auto buyer lancée');

      // force full web app layout in any case
      // $('body').removeClass('phone').addClass('landscape');

      // get rid of pinEvents when switching tabs
      document.removeEventListener('visibilitychange', onVisibilityChanged);

      $('head').append(`
        <style id="addedCSSAutoBuyer" type="text/css">
          .stats-def-id {
            font-size: 19px;
            position: absolute;
            top: -130px;
            left: 25%;
            background: azure;
            padding: 5px;
            user-select: text;
          }
        </style>
      `);

    setInterval(removeOrientationWarning, 3000);
    function removeOrientationWarning()
        {
            if ($(".ui-orientation-warning").attr("styte") !== "display: none !important;")
            {
                $('.ui-orientation-warning').attr('style', 'display: none !important;');
            }
        }

    var autoRefreshInterval;


    $(document).bind('DOMNodeInserted', function(event) {


      // DETECTION DU POPUP DE VERIFICATION : CAPTCHA
      if ($(event.target).hasClass("Dialog")) {
        console.log('SEARCH MARKET : DIALOG DETECTED');
        var intervalVerificationDialog = setInterval(function () {
            if ($(event.target).find('header > h1:eq(0)').text() != "")
            {
                if ($(event.target).find('header > h1:eq(0)').text() == "Vérification requise")
                {
                    var time = new Date($.now());
                    var timeText = time.getDate() + '/' + (time.getMonth()+1) + '/' + time.getFullYear() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();


                    stopAutoBuyer();
                    console.log('SEARCH MARKET : STOP VERIFICATION !');
                    GM_notification({
                        text: 'ERREUR : CAPTCHA !!! (' + globalRefreshSansResultat + ' refresh sans resultat). Time : ' + timeText,
                        title: "FUT 20 Web App",
                        onclick: function() { window.focus(); },
                    });
                    if (getConfigAlertWhenCaptcha())
                    {
                      alert('ERREUR : CAPTCHA !!! (' + globalRefreshSansResultat + ' refresh sans resultat). Time : ' + timeText);
                    }
                }
                clearInterval(intervalVerificationDialog);
            }

        }, 50);
      }

      // On affiche le DefId de la carte
      else if ($(event.target).hasClass("DetailPanel")) {
        var itemContainer = $(event.target).parent().find('.item');
        var item = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._rightController.getCurrentController()._quickListPanel._item;
        if ($(itemContainer).find('.stats-def-id').length > 0)
        {
          $(itemContainer).find('.stats-def-id').remove();
        }
        $(itemContainer).find('.ut-item-view--main.ut-item-view').append(
          '<div class="stats-def-id">id : ' +
            item.resourceId +
          '</div>'
        );

      }
      // AJOUT DU BOUTON START/STOP AUTO BUYER
      else if ($(event.target).hasClass("SearchResults")) {
        generateUI("");
        if ($(event.target).find('#autoBuyerButton').length === 0) {
          setInterval(function() { $(event.target).find('.pagingContainer').show(); }, 1000);
          // $(event.target).find('.pagingContainer').eq(0).append('<a class="btn-flat pagination next" style="float: right" id="autoBuyerCrezipAllButton">Crezip ALL</a>  ');
          // $(event.target).find('.pagingContainer').eq(0).append('<a class="btn-flat pagination next" style="float: right" id="autoBuyerCrezipGardienButton">Crezip GARDIEN</a>  ');
          // $(event.target).find('.pagingContainer').eq(0).append('<a class="btn-flat pagination next" style="float: right" id="autoBuyerCrezipDefenseurButton">Crezip DEFENSEUR</a>  ');
          // $(event.target).find('.pagingContainer').eq(0).append('<a class="btn-flat pagination next" style="float: right" id="autoBuyerCrezipMilieuxButton">Crezip MILIEUX</a>  ');
          // $(event.target).find('.pagingContainer').eq(0).append('<a class="btn-flat pagination next" style="float: right" id="autoBuyerCrezipAttaquantButton">Crezip ATTAQUANT</a>  ');
          $(event.target).find('.pagingContainer').eq(0).append('<a class="btn-flat pagination next" style="float: right" id="autoBuyerButton">Auto Buyer</a>');

          $('#autoBuyerButton').on('touchstart', function (e) {
              e.preventDefault();
            globalCrezipActive = false;
            // STOP AUTO BUY
            if ($('#autoBuyerButton').hasClass('started') || globalAutoBuyerStarted)
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



    }); // END DOM NODE INSERTED



    },
  );


  ///////////////////////////////
  // Ajout du bouton de config //
  ///////////////////////////////


  $(document).bind('DOMNodeInserted', function(event) {
    // DOM INSERT FOOTER
    if ($(event.target).attr('class') == 'ut-fifa-header-view')
    {
      if ($(event.target).find('#autobuyerConfig').length === 0)
      {
        $('.ut-fifa-header-view').find('.fifa').after('<button id="autobuyerConfig" class="" aria-disabled="false" style="'+cssConfigAutoBuyer+'">Auto-Buyer</button>');
        $('#autobuyerConfig').click(function() {
          GM_configAB.open();
        });
      }
    }
  });



  ////////////////
  // BUY PLAYER //
  ////////////////

  /**
   * Pour acheter un joueur
   *
   * @param  {[type]} item [description]
   * @return {[type]}      [description]
   */
  function buyPlayer(item)
  {
      globalTimeStartBuyPlayer = $.now();

      var auction = item._auction;
      var tradeId = auction.tradeId;
      var buyNowPrice = auction.buyNowPrice;

      if (getConfigUltraFastMode())
      {
        globalTimeCanBuy = $.now();

        var auth = services.Authentication;
        var obs = new UTObservable,
            req = new UTUtasHttpRequest(auth),
            serviceResponse = new transferobjects.ServiceResponse;

        var urlPath = "/ut/game/fifa20/trade/" + tradeId + "/bid";

        req.setPath(urlPath);
        req.setRequestType(enums.HTTPRequestMethod.PUT);
        req.setRequestBody({
            bid: buyNowPrice
        });

        req.observe(this, function _onBidComplete(request, response) {
          request.unobserve(this);

          // SUCCESS BUY
          if (response.success && response.status === 200)
          {
            globalTimeSuccessBuy = $.now();

            globalCountAutoBuy++;
            globalIsBuy = true;
            showTimes(false);
            if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : BUY !!');
            if (getConfigShowNotificationLog()) console.log(auction);
            if (getConfigShowNotificationLog()) console.log(globalCurrentAuctions);
            if (getConfigShowNotificationLog()) console.log('SUCCESS BID');
            globalRefreshSansResultat = 0;

            if (getConfigShowNotificationSuccess() === true)
            {
                GM_notification({
                    text: 'SUCCESS ('+globalCountAutoBuy+'/'+getConfigMaxBuy()+') - ' + buyNowPrice + ' / ' + globalCurrentMaxBid,
                    title: "FUT 20 Web App",
                    onclick: function() { window.focus(); },
                });
            }

            // NOTIFY / API

            serviceResponse.success = response.success;
            serviceResponse.status = response.status;
            serviceResponse.data = {
              itemIds: []
            };

            var dataCurrencies = response.success ? response.response.currencies.map(function(t) {
              return new valueobjects.Currency(t.name,t.funds)
            }) : [];
            var dataItems = response.success ? factories.Item.generateItemsFromAuctionData(response.response.auctionInfo, response.response.duplicateItemIdList) : [];
            var dataObjectiveUpdates = new transferobjects.ObjectiveUpdates(response.response ? response.response.dynamicObjectivesUpdates : null);

            var auctionData = item.getAuctionData();
            var isWatched = auctionData.watched;
            services.Objectives.update(dataObjectiveUpdates);
            item.update(dataItems[0]);
            isWatched && auctionData.isBought() && repositories.Item.setDirty(enums.FUTItemPile.INBOX);
            var u = services.User.getUser();
            dataCurrencies.forEach(function(t) {
              u.setCurrency(t.type, t.amount)
            });
            serviceResponse.data.itemIds = [item.id];
            repositories.Item.add(item);
            getDefaultDispatcher().notify(enums.Notification.ITEM_BID, this, serviceResponse.data);


          }
          // FAIL BUY
          else
          {
            globalTimeFailBuy = $.now();
            showTimes(true);
            if (getConfigShowNotificationLog()) console.log('FAIL BID');
            globalRefreshSansResultat = 0;
            if (getConfigShowNotificationFail() === true)
            {
                GM_notification({
                    text: 'FAILED ('+globalCountAutoBuy+'/'+getConfigMaxBuy()+') - ' + buyNowPrice + ' / ' + globalCurrentMaxBid,
                    title: "FUT 20 Web App",
                    onclick: function() { window.focus(); },
                });
            }
          }
        });
        req.send();
      }
      else if (auction.canBuy())
      {
        services.Item.bid(item, buyNowPrice).observe(this, function _onBidComplete(observer, response) {
          // SUCCESS BUY
          if (response.success && response.status === 200)
          {
            globalTimeSuccessBuy = $.now();

            globalCountAutoBuy++;
            globalIsBuy = true;
            showTimes(false);
            if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : BUY !!');
            if (getConfigShowNotificationLog()) console.log(auction);
            if (getConfigShowNotificationLog()) console.log(globalCurrentAuctions);
            if (getConfigShowNotificationLog()) console.log('SUCCESS BID');
            globalRefreshSansResultat = 0;

            if (getConfigShowNotificationSuccess() === true)
            {
                GM_notification({
                    text: 'SUCCESS ('+globalCountAutoBuy+'/'+getConfigMaxBuy()+') - ' + buyNowPrice + ' / ' + globalCurrentMaxBid,
                    title: "FUT 20 Web App",
                    onclick: function() { window.focus(); },
                });
            }
          }
          // FAIL BUY
          else
          {
            globalTimeFailBuy = $.now();
            showTimes(true);
            if (getConfigShowNotificationLog()) console.log('FAIL BID');
            globalRefreshSansResultat = 0;
            if (getConfigShowNotificationFail() === true)
            {
                GM_notification({
                    text: 'FAILED ('+globalCountAutoBuy+'/'+getConfigMaxBuy()+') - ' + buyNowPrice + ' / ' + globalCurrentMaxBid,
                    title: "FUT 20 Web App",
                    onclick: function() { window.focus(); },
                });
            }
          }
        });
      }
      // CANT BUY
      else
      {
        if (getConfigShowNotificationLog()) console.log('CANT BUY THIS AUCTION');

        if (getConfigShowNotificationFail() === true)
        {
            GM_notification({
                text: 'CANT BUY ('+globalCountAutoBuy+'/'+getConfigMaxBuy()+') - ' + buyNowPrice + ' / ' + globalCurrentMaxBid,
                title: "FUT 20 Web App",
                onclick: function() { window.focus(); },
            });
        }
      }
  }


  ////////////////////////////////
  // MULTI AUTO BUYER FUNCTIONS //
  ////////////////////////////////

  function multiAutobuyerIncrementIterator()
  {
    globalMultiAutobuyerIterator++;
    if (globalMultiAutobuyerIterator >= globalMultiAutobuyer.length)
      globalMultiAutobuyerIterator = 0;
  }

  function multiAutobuyerRefreshSearchCriteria()
  {
    reinitSearchCriteria();
    var currentParams = globalMultiAutobuyer[globalMultiAutobuyerIterator];
    var searchCriteria = getSearchCriteria();
    for(var key in currentParams)
    {
      searchCriteria[key] = parseKey(key, currentParams[key]);
    }
  }

  function reinitSearchCriteria()
  {
    var searchCriteria = getSearchCriteria();
    for(var key in globalMultiAutobuyerSearchCriteria)
    {
      searchCriteria[key] = globalMultiAutobuyerSearchCriteria[key];
    }
  }

  function parseKey(key, val)
  {
    return val;
    if (
      key === 'club' ||
      key === 'count' ||
      key === 'league' ||
      key === 'maskedDefId' ||
      key === 'maxBid' ||
      key === 'maxBuy' ||
      key === 'minBid' ||
      key === 'minBuy' ||
      key === 'nation' ||
      key === 'offset' ||
      key === 'playStyle'
      )
    {
      return parseInt(val);
    }
  }

  function initDefaultSearchCriteria()
  {
    var searchCriteria = getSearchCriteria();

    globalMultiAutobuyerSearchCriteria = {
      'category': false,
      'club': false,
      'count': false,
      'isExactSearch': false,
      'league': false,
      'level': false,
      'maskedDefId': false,
      'maxBuy': false,
      'minBid': false,
      'minBuy': false,
      'nation': false,
      'offset': false,
      'playStyle': false,
      'position': false,
      'type': false,
      'zone': false
    };
  }

  function saveDefaultSearchCriteria()
  {
    var searchCriteria = getSearchCriteria();

    globalMultiAutobuyerSearchCriteria = {
      'category': searchCriteria.category,
      'club': searchCriteria.club,
      'count': searchCriteria.count,
      'isExactSearch': searchCriteria.isExactSearch,
      'league': searchCriteria.league,
      'level': searchCriteria.level,
      'maskedDefId': searchCriteria.maskedDefId,
      'maxBuy': searchCriteria.maxBuy,
      'minBid': searchCriteria.minBid,
      'minBuy': searchCriteria.minBuy,
      'nation': searchCriteria.nation,
      'offset': searchCriteria.offset,
      'playStyle': searchCriteria.playStyle,
      'position': searchCriteria.position,
      'type': searchCriteria.type,
      'zone': searchCriteria.zone
    };
  }


  ///////////////
  // FUNCTIONS //
  ///////////////

  function startAutobuyer()
  {
      console.log(GM_configAB.get('show_notification_success'));

      globalCountAutoRefresh = 0;
      globalCountAutoBuy = 0;
      globalItemsFound = [];
      globalItems = [];
      globalCurrentPage = 1;
      globalIsBuy = false;
      globalCrezipNewLoop = false;

      /////////////////////////
      // MULTI AUTOBUYER START //
      /////////////////////////

      globalMultiAutobuyer = getConfigMultiAutobuyer();
      globalMultiAutobuyerIterator = 0;
      if (globalMultiAutobuyer !== false)
      {
        initDefaultSearchCriteria();
        saveDefaultSearchCriteria();
      }

      /////////////////////////
      // MULTI AUTOBUYER END //
      /////////////////////////


      stockAllSearchCriteria();

      var searchCriteria = getSearchCriteria();

      globalDefaultMaxBuy = searchCriteria.maxBuy;
      globalDefaultMinBuy = searchCriteria.minBuy;

      globalDefaultMaxOffre = searchCriteria.maxBid;

      globalDefaultPlayStyle = searchCriteria.playStyle;

      // Init crezip style
      globalCrezipStyleAll = [];
      for(var styleName of getConfigCrezipStyle('all').split(','))
      {
        globalCrezipStyleAll.push(styleName);
      }


      globalCrezipStyleGardien = [];
      for(var styleName of getConfigCrezipStyle('gardien').split(','))
      {
        globalCrezipStyleGardien.push(styleName);
      }

      globalCrezipStyleDefenseur = [];
      for(var styleName of getConfigCrezipStyle('defenseur').split(','))
      {
        globalCrezipStyleDefenseur.push(styleName);
      }

      globalCrezipStyleMilieux = [];
      for(var styleName of getConfigCrezipStyle('milieux').split(','))
      {
        globalCrezipStyleMilieux.push(styleName);
      }

      globalCrezipStyleAttaquant = [];
      for(var styleName of getConfigCrezipStyle('attaquant').split(','))
      {
        globalCrezipStyleAttaquant.push(styleName);
      }

      if (globalCrezipActive === false)
      {
        globalCrezipCurrentStyles = [];
      }
      else if (globalCrezipActive === "gardien")
      {
        globalCrezipCurrentStyles = globalCrezipStyleGardien;
      }
      else if (globalCrezipActive === "defenseur")
      {
        globalCrezipCurrentStyles = globalCrezipStyleDefenseur;
      }
      else if (globalCrezipActive === "milieux")
      {
        globalCrezipCurrentStyles = globalCrezipStyleMilieux;
      }
      else if (globalCrezipActive === "attaquant")
      {
        globalCrezipCurrentStyles = globalCrezipStyleAttaquant;
      }
      else if (globalCrezipActive === "all")
      {
        globalCrezipCurrentStyles = globalCrezipStyleAll;
      }


      // globalCurrentDefId = searchCriteria.maskedDefId;
      globalCurrentMaxBid = searchCriteria.maxBuy;
      var level = searchCriteria.level;
      if (level !== "any")
      {
          globalToggleLevel = false;
      }
      else
      {
          globalToggleLevel = getConfigLevelSwitcherMode();
      }

      var minBuy = searchCriteria.minBuy;
      if (minBuy > 0)
      {
          // Override
          globalChangeMinBuy = false;
      }
      else
      {
          globalChangeMinBuy = getConfigMinBuySwitcherMode();
      }


      var maxBid = searchCriteria.maxBid;
      if (maxBid > 0)
      {
          // Override
          globalChangeMaxOffre = false;
      }
      else
      {
          globalChangeMaxOffre = getConfigMaxOffreSwitcherMode();
      }
      // ITEM PER PAGE
      globalToggleIPP = getConfigItemPerPageMode();

      const configObj = gConfigurationModel.getConfigObject(models.ConfigurationModel.KEY_ITEMS_PER_PAGE);
      globalItemPerPage = configObj[models.ConfigurationModel.ITEMS_PER_PAGE.TRANSFER_MARKET];

      // if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : DEF ID : ' + globalCurrentDefId);
      // if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : MAX BID: ' + globalCurrentMaxBid);

      // if (globalAutoBuyerObserver !== false) globalAutoBuyerObserver.unobserve(this);

      globalIsPause = false;
      globalAutoBuyerStarted = true;

      if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : START AUTO BUY');
      $('#autoBuyerButton').addClass('started');

      generateUI("Auto Buyer Started ...", false, false, false);

      $('#autoBuyerButton').html('CLICK HERE TO STOP ...');

      launchRefresh(getRandom(getConfigDelayRefreshMin(), getConfigDelayRefreshMax()), 'refresh');
  }

  function stopAutoBuyer()
  {
    console.log('Auto buyer stopped');
      globalAutoBuyerStarted = false;
      clearInterval(autoRefreshInterval);
      if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : STOP AUTO BUY');
      $('#autoBuyerButton').removeClass('started');

      var searchCriteria = getSearchCriteria();
      searchCriteria.maxBuy = globalDefaultMaxBuy;
      searchCriteria.minBuy = globalDefaultMinBuy;
      searchCriteria.maxBid = globalDefaultMaxOffre;
      searchCriteria.playStyle = globalDefaultPlayStyle;

      generateUI("Auto Buyer Stopped ...", false, false, false);
      $('#autoBuyerButton').html('Auto buyer');

      // $('#autoBuyerButton').html('Auto Buyer Stopped');
  }

  function getNewMinBuy(val)
  {
      val += getNextStepPrice(val, 'up');
      if (val > globalDefaultMinBuy+getConfigMinBuySwitcherLimit()) val = globalDefaultMinBuy;
      return val;
  }

  function getNewMaxBuy(val)
  {
      val += getNextStepPrice(val, 'up');
      if (val > globalDefaultMaxBuy+getConfigCrezipMaxBuyLimit()) val = globalDefaultMaxBuy;
      return val;
  }

  function getNewMaxBid(val)
  {
      val -= getNextStepPrice(val, 'down');
      if (val <= globalDefaultMaxBuy) val = getConfigMaxOffreSwitcherStart();
      return val;
  }

  function getRandom(min, max) {
      var randTime = Math.random() * (max - min) + min;
      randTime = Math.floor(randTime);
      return randTime;
  }

  function getNextStepPrice(val, direction)
  {
    if (val >= 100000)
    {
      if (val > 100000 || direction == 'up') return 1000;
      else return 500;
    }
    if (val >= 50000)
    {
      if (val > 50000 || direction == 'up') return 500;
      else return 250;
    }
    if (val >= 10000)
    {
      if (val > 10000 || direction == 'up') return 250;
      else return 100;
    }
    if (val >= 1000)
    {
      if (val > 1000 || direction == 'up') return 100;
      else return 50;
    }
    else
    {
      return 50;
    }

  }

  /**
   * On stock les critères de recherche
   * @return {[type]} [description]
   */
  function stockAllSearchCriteria()
  {
      var searchCriteria = getSearchCriteria();

      globalSearchCategory = searchCriteria.category;
      globalSearchClub = searchCriteria.club;
      globalSearchLeague = searchCriteria.league;
      globalSearchMaskedDefId = searchCriteria.maskedDefId;
      globalSearchNation = searchCriteria.nation;
      globalSearchPlayStyle = searchCriteria.playStyle;
      globalSearchPosition = searchCriteria.position;
      globalSearchType = searchCriteria.type;
    }

  /**
   * On check si les critères de recherche n'ont pas changés
   * @return {Boolean} [description]
   */
  function isCorrectCriteria()
  {

    var searchCriteria = getSearchCriteria();

    if (
      globalSearchCategory === searchCriteria.category
      && globalSearchClub === searchCriteria.club
      && globalSearchLeague === searchCriteria.league
      && globalSearchMaskedDefId === searchCriteria.maskedDefId
      && globalSearchNation === searchCriteria.nation
      && globalSearchPlayStyle === searchCriteria.playStyle
      && globalSearchPosition === searchCriteria.position
      && globalSearchType === searchCriteria.type
      )
          return true;
      else
          return false;
  }

  function getSearchCriteria()
  {
    var searchCriteria = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._searchCriteria;
    return searchCriteria;
  }

  function getListController()
  {
    var listController = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController();
    return listController;
  }


  /**
   * A chaque lancement du refresh
   */
  function launchRefresh(timeRefresh, typeRefresh)
  {
      setTimeout(function() {
          if (!globalIsPause)
          {
              // Check security
              if (
                  ! getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController()._currentController ||
                  ! getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController()._currentController.className ||
                  (getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController()._currentController.className !== "UTMarketSearchResultsSplitViewController" && 
                   getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController()._currentController.className !== "UTMarketSearchResultsViewController") 

                  || isCorrectCriteria() === false)
              {
                  stopAutoBuyer();
              }
              // Si un achat est fait, on programme le prochain launch
              else if (getConfigDelayAfterBuy() > 0 && globalIsBuy)
              {
                  globalIsBuy = false;


                  if (checkAutobuyFinish() === true)
                  {
                    return false;
                  }

                  var timeRefresh = getConfigDelayAfterBuy();
                  launchRefresh(timeRefresh, 'refresh');
              }
              else
              {
                  // Si multi autobuyer
                  if (globalMultiAutobuyer !== false)
                  {
                    multiAutobuyerIncrementIterator();
                    multiAutobuyerRefreshSearchCriteria();
                    stockAllSearchCriteria();
                  }

                  var searchCriteria = getSearchCriteria();

                  // Si Crezip
                  if (globalCrezipActive !== false)
                  {
                    var newPlayStyle = getNextStyleId();
                    searchCriteria.playStyle = newPlayStyle;
                    stockAllSearchCriteria();

                    if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : SWITCH PLAY STYLE : ' + searchCriteria.playStyle);


                    // Nouveau tour des styles, on augmente le maxBuy
                    if (globalCountAutoRefresh > 0 && globalCrezipNewLoop === true)
                    {
                      globalCrezipNewLoop = false;
                      var currentMaxBuy = searchCriteria.maxBuy;
                      searchCriteria.maxBuy = getNewMaxBuy(currentMaxBuy);
                      if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : SWITCH PLAY STYLE MAX BUY : ' + searchCriteria.maxBuy);
                    }
                  }

                  // Si on doit changer le maximum en offre (anti cache)
                  if (globalChangeMaxOffre)
                  {
                      var currentMaxBid = searchCriteria.maxBid;
                      searchCriteria.maxBid = getNewMaxBid(currentMaxBid);
                  }

                  // Si on doit changer le minimum en achat immédiat (anti cache)
                  if (globalChangeMinBuy &&
                    (globalChangeMaxOffre == false || (globalChangeMaxOffre && searchCriteria.maxBid == getConfigMaxOffreSwitcherStart()))
                    )
                  {
                      var currentMinBuy = searchCriteria.minBuy;
                      searchCriteria.minBuy = getNewMinBuy(currentMinBuy);
                  }

                  // Si on doit changer le level (gold/silver/bronze) (anti-cache)
                  if (globalToggleLevel &&
                      (globalChangeMinBuy == false || (globalChangeMinBuy && searchCriteria.minBuy == 0)) &&
                      (globalChangeMaxOffre == false || (globalChangeMaxOffre && searchCriteria.maxBid == getConfigMaxOffreSwitcherStart()))
                      )
                  {
                      if (searchCriteria.level == "any")
                          searchCriteria.level = getConfigLevelSwitcherDefault();
                      else
                          searchCriteria.level = "any";

                      if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : SWITCH LEVEL : ' + searchCriteria.level);
                  }

                  // Si on doit faire un changement de item par page (anti-cache)
                  if (globalToggleIPP &&
                   (globalToggleLevel == false || (globalToggleLevel && searchCriteria.level === "any")) &&
                   (globalChangeMinBuy == false || (globalChangeMinBuy && searchCriteria.minBuy == 0)) &&
                   (globalChangeMaxOffre == false || (globalChangeMaxOffre && searchCriteria.maxBid == getConfigMaxOffreSwitcherStart()))
                   )
                  {
                      var itemPerPage = getNextItemPerPage(searchCriteria.count);
                      globalItemPerPage = itemPerPage;

                      if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : SWITCH ITEM PER PAGE : ' + itemPerPage);
                  }

                  if (globalToggleIPP)
                  {
                    searchCriteria.count = globalItemPerPage;
                  }


                  if (typeRefresh == 'refresh')
                  {
                    // On fait un refresh de la recherche
                    globalCountAutoRefresh++;
                    globalRefreshSansResultat++;
                    if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : REQUEST ITEMS');
                    globalTimeLaunchNextPage = $.now();

                    if (getConfigUltraFastMode())
                    {
                      search();
                    }
                    else
                    {
                      // On observe le prochain résultat de recherche
                      var listController = getListController();
                      listController.onDataChange.observe(this, _onRequestItemsCompleteAutoBuyer2);
                      listController._requestItems();
                    }
                  }
                  else if (typeRefresh == 'nextPage')
                  {
                    // On doit passer à la page suivante
                    globalCurrentPage++;

                    // On fait un refresh de la recherche
                    if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : NEXT PAGE ' + globalCurrentPage);
                    globalTimeLaunchNextPage = $.now();

                    if (getConfigUltraFastMode())
                    {
                      searchCriteria.offset += globalItemPerPage;
                      search();
                    }
                    else
                    {
                      // On observe le prochain résultat de recherche
                      var listController = getListController();
                      listController.onDataChange.observe(this, _onRequestItemsCompleteAutoBuyer2);
                      listController._eNextPage();
                    }
                  }
                  else if (typeRefresh == 'previousPage')
                  {
                    globalCurrentPage--;

                    // On fait un refresh de la recherche
                    if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : PREVIOUS PAGE ' + globalCurrentPage);
                    globalTimeLaunchNextPage = $.now();

                    if (getConfigUltraFastMode())
                    {
                      searchCriteria.offset -= globalItemPerPage;
                      search();
                    }
                    else
                    {
                      // On observe le prochain résultat de recherche
                      var listController = getListController();
                      listController.onDataChange.observe(this, _onRequestItemsCompleteAutoBuyer2);
                      listController._ePreviousPage();
                    }
                  }

              }
          }
      }, timeRefresh);
  }

  function launchTest()
  {
    search();
  }

  function search()
  {
    var searchCriteria = getSearchCriteria();
    var event = new UTObservable;
    var i = {
            success: !1,
            items: [],
            error: null
        };

    var s = new communication.SearchAuctionDelegate(searchCriteria);
    // s._cache = 1;

    s.addListener(communication.BaseDelegate.SUCCESS, this, function _onMarketSearchSuccess(sender, response) {
      sender.clearListenersByScope(this);
      var t = factories.Item.generateItemsFromAuctionData(response.auctionInfo || [], response.duplicateItemIdList || []);
      i.success = !0;
      i.items = t;

      checkItems(i.items);
      event.notify(i);

      var itemsNotify = i.items.slice();

      var viewmodel = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._listController._viewmodel;
      viewmodel.resetCollection(itemsNotify);
      var view = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._listController.getView();
      view.setItems(viewmodel.values());
      itemsNotify.length > 0 && view.selectListRow(viewmodel.current().id);
    });
    s.addListener(communication.BaseDelegate.FAIL, this, function _onMarketSearchFail(sender, error) {
      sender.clearListenersByScope(this);
      NetworkErrorManager.handle(error, !1, function() {
          error.getCode() === enums.HTTPStatusCode.SERVICE_IS_DISABLED && gSettingsModel.disableService(models.SettingsModel.TRADING_ENABLED),
          i.error = error;
          event.notify(i);
      });
    });

    s.send();
  }


  function checkItems(items) {
    var isLastPage = true;
    var forceBuy = false;
    var hasItemLessOneHour = false;
    var hasItemMoreOneHour = false;

    if (globalAutoBuyerStarted)
    {
        if (items.length > 0)
        {
            if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : CHECK ITEMS');
            globalTimeCheckItem = $.now();


            for(var item of items)
            {

              // On check si l'expiration est inférieur à 1h
              if (item._auction.expires <= 3600)
              {
                hasItemLessOneHour = true;
              }
              else
              {
                hasItemMoreOneHour = true;
              }

              // On check les contrats & formes
              if (item.type != 'player' || (item.fitness >= getConfigMinFitness() && item.contract >= getConfigMinContract()))
              {
                var ignoresIds = getConfigFilterIgnoresIds();

                // On check si l'id est dans la ignore list
                if (ignoresIds.indexOf(item.resourceId.toString()) < 0)
                {

                  var ignoreThisItem = false;

                  globalForceMaxBuy = false;
                  if (getConfigBuyFirstPlayerFound())
                  {

                    // On check si le joueur dans le filtre max buy (force buy)
                    var filterMaxBuyIds = getConfigFilterMaxBuyIds();
                    if (filterMaxBuyIds.hasOwnProperty(item.resourceId.toString()))
                    {


                      var tmpMaxBuy = filterMaxBuyIds[item.resourceId.toString()];
                      if (item._auction.buyNowPrice <= parseInt(tmpMaxBuy))
                      {
                        globalForceMaxBuy = filterMaxBuyIds[item.resourceId.toString()];
                      }
                      else
                      {
                        ignoreThisItem = true;
                      }
                    }
                  }



                  // On check si on achète seulement les cartes rares ou non
                  if (globalForceMaxBuy !== false || getConfigBuyOnlyRare() == false || item.rareflag == 1)
                  {
                    // On check si on l'a pas déjà acheté
                    if (ignoreThisItem === false && globalCurrentAuctions.indexOf(item._auction.tradeId) < 0)
                    {
                      console.log('ITEM', item);

                      // Si OK, on le push dans la liste des items à acheter
                      globalItemsFound.push(item);

                      if (getConfigBuyFirstPlayerFound())
                      {
                        forceBuy = true;
                      }
                    }
                  }
                }
              }
            }

            var searchCriteria = getSearchCriteria();

            console.log('hasItemLessOneHour', hasItemLessOneHour);
            console.log('hasItemMoreOneHour', hasItemMoreOneHour);

            /////////////////////////////////////////////////////////////////////////////////////////
            // il faut savoir s'il y a au moins un item avec une expiration < 1h //
            /////////////////////////////////////////////////////////////////////////////////////////

            // Si il n'y a pas de joueur à moins d'une heure, on doit aller sur la page précédente !
            if (hasItemLessOneHour === false && forceBuy === false)
            {
              isLastPage = false;
              launchRefresh(getRandom(getConfigDelayRefreshMinNextPage(), getConfigDelayRefreshMaxNextPage()), 'previousPage')
            }
            ///////////////////
            // PAGE SUIVANTE //
            ///////////////////
            else if (hasItemMoreOneHour === false && forceBuy === false && items.length == searchCriteria.count)
            {
              // globalToggleIPP = false;
              isLastPage = false;
              launchRefresh(getRandom(getConfigDelayRefreshMinNextPage(), getConfigDelayRefreshMaxNextPage()), 'nextPage')
            }
            ///////////////////
            // DERNIERE PAGE OR FORCE BUY //
            ///////////////////
            else
            {
              if (forceBuy === true)
              {
                if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : FORCE BUY');
              }
              else
              {
                if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : LAST PAGE ' + globalCurrentPage);
              }
              // On check s'il y a des joueurs de trouvés
              if (globalItemsFound.length > 0)
              {

                // On prend l'item le moins cher
                var itemSelected;
                var priceItemSelected = 999999999;
                for(var i in globalItemsFound)
                {
                  if (globalItemsFound[i]._auction.buyNowPrice < priceItemSelected)
                  {
                    priceItemSelected = globalItemsFound[i]._auction.buyNowPrice;
                    itemSelected = globalItemsFound[i]
                  }
                }


                if (itemSelected)
                {
                  // PUSH ITEM IN CURRENT AUCTIONS
                  globalCurrentAuctions.push(itemSelected._auction.tradeId);

                  if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : ITEM FOUND');

                  // PAUSE AUTOBUYER AND BUY
                  globalIsPause = true;
                  buyPlayer(itemSelected);

                  // RESET
                  globalItemsFound = [];

                  checkAutobuyFinish();

                  globalIsPause = false;
                }
              }

            }
        }
        else
        {
            if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : NOT FOUND');
        }

        if (globalIsPauseRefresh)
        {
          generateUI('Auto Buyer en pause ..', false, false, false);
        }
        else
        {
          generateUI('Auto Buyer en cours ..', false, false, false);
        }

        if (isLastPage)
        {
          // ON RELANCE LE REFRESH

          // Si auto buyer en PAUSE (anti ban)
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

          launchRefresh(timeRefresh, 'refresh');
        }

    }
  }



  function getNextStyleId()
  {
    var searchCriteria = getSearchCriteria();
    var indexStyle = 0;
    var playStyleId = false;

    for(var j = 0; j < globalCrezipCurrentStyles.length; j++)
    {
      playStyleId = globalPlayStyles[globalCrezipCurrentStyles[j]];
      if (playStyleId === searchCriteria.playStyle)
      {
        if (j == globalCrezipCurrentStyles.length-1)
        {
          indexStyle = 0;
          globalCrezipNewLoop = true;
        }
        else indexStyle = j + 1;

        break;
      }
    }

    playStyleId = globalPlayStyles[globalCrezipCurrentStyles[indexStyle]];
    return playStyleId;

  }

  function getNextItemPerPage(currentItemPerPage)
  {
    // Comportement +1 pour la tech crezip (plusieurs pages)
    if (globalCurrentPage > 1)
    {
      if (currentItemPerPage >= 30) return 20;
      else return currentItemPerPage+1;
    }
    // Comportement normal pour la tech59
    else
    {
      if (currentItemPerPage >= 30) return 5;
      else return currentItemPerPage+1;
      // else return currentItemPerPage+5;
    }
  }



  function _onRequestItemsCompleteAutoBuyer2(t, data) {
    t.unobserve(this);
    checkItems(data.items);
  }


  function checkAutobuyFinish()
  {
    // TERMINE
    if (globalCountAutoBuy >= getConfigMaxBuy())
    {
        // STOP AUTO BUYER
        if (getConfigShowNotificationEnd() === true)
        {
            GM_notification({
                text: 'Autobuyer terminé',
                title: "FUT 20 Web App",
                onclick: function() { window.focus(); },
            });
        }
        if (getConfigShowNotificationLog()) console.log('SEARCH MARKET : END');
        stopAutoBuyer();

        return true;
    }

    return false;
  }

  function showTimes(isFail)
  {
    console.log('=== TIMER INFO ===');

    var diffNextPage = globalTimeCheckItem - globalTimeLaunchNextPage;

    console.log('TIME NEXT PAGE = ' + globalTimeLaunchNextPage);
    console.log('CHECK ITEM = ' + globalTimeCheckItem);
    console.log('DIFFERENCE = ' + diffNextPage);
    console.log('START BUY PLAYER = ' + globalTimeStartBuyPlayer);
    console.log('CAN BUY = ' + globalTimeCanBuy);
    if (isFail)
    {
      var diffTime = globalTimeFailBuy - globalTimeCheckItem;
      console.log('FAIL BUY = ' + globalTimeFailBuy);
      console.log('DIFFERENCE = ' + diffTime);
    }
    else
    {
      var diffTime = globalTimeSuccessBuy - globalTimeCheckItem;
      console.log('SUCCESS BUY = ' + globalTimeSuccessBuy);
      console.log('DIFFERENCE = ' + diffTime);
    }
    console.log('=== TIMER INFO ===');


  }

})();
