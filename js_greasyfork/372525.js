// ==UserScript==
// @name        FUT 19 Auto Relist Unsold Transfers
// @version     0.3
// @description Automatically relist unsold items in the transfer list
// @license     MIT
// @author      Sy
// @match       https://www.easports.com/*/fifa/ultimate-team/web-app/*
// @grant       GM_notification
// @grant       window.focus
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @namespace SY
// @downloadURL https://update.greasyfork.org/scripts/372525/FUT%2019%20Auto%20Relist%20Unsold%20Transfers.user.js
// @updateURL https://update.greasyfork.org/scripts/372525/FUT%2019%20Auto%20Relist%20Unsold%20Transfers.meta.js
// ==/UserScript==
// ==OpenUserJS==
// @author Sy
// ==/OpenUserJS==
(function () {
  'use strict';

  var cssConfigAutorelist = 'height: 100%;' +
    'margin: 0 20px;' +
    'font-weight: bold;';


  ///////////////
  // GM CONFIG //
  ///////////////

  var autorelistGlobalConfigFields = {
    'autorelist_active':
    {
        'label': 'Activer Auto Relist',
        'section': ['Configuration'],
        'type': 'checkbox',
        'default': true,
    },
    'autorelist_delay':
    {
        'label': 'Délai entre chaque vérification (ms)',
        'section': ['Configuration'],
        'type': 'int',
        'default': '60000',
    },

  };

  var GM_configAutorelist = new GM_configStruct({
    'id': 'HighlightConfig',
    'title': 'FUT 18 - Highlight Contract & Fitness',
    'fields': autorelistGlobalConfigFields
  });

  function getConfigAutorelistActive()
  {
    return GM_configAutorelist.get('autorelist_active');
  }
  function getConfigAutorelistDelay()
  {
    return parseInt(GM_configAutorelist.get('autorelist_delay'));
  }



  ////////////
  // SCRIPT //
  ////////////

  services.Authentication._oAuthentication.observe(
    this,
    () => {

      console.log('Extension AUTO RELIST lancée');

      // force full web app layout in any case
      $('body').removeClass('phone').addClass('landscape');

      // get rid of pinEvents when switching tabs
      document.removeEventListener('visibilitychange', onVisibilityChanged);


      setTimeout(function() { launchAutoRelist(); }, getConfigAutorelistDelay());


      function launchAutoRelist()
      {
        if (getConfigAutorelistActive())
        {
          services.Item.requestTransferItems().observe(this, _handleExpiredAuctions);
        }

        setTimeout(function() { launchAutoRelist(); }, getConfigAutorelistDelay());
      }

      var _handleExpiredAuctions = function handleExpiredAuctions(observer, response) {
        var data = response.data;

        var countItemsToRelist = data.items.filter(function (d) { return d.state === enums.ItemState.FREE && d._auction.buyNowPrice > 0; }).length;
        if (countItemsToRelist > 0) {
          services.Item.relistExpiredAuctions();

          // Refresh screen if we are on the transfer list screen
          if (getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController()._currentController.className == "UTTransferListSplitViewController") {
            getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController()._currentController._listController.refreshList();
          }

          GM_notification({
            text: "Auto relist - " + countItemsToRelist + " items",
            title: "FUT 19 Web App",
            timeout: 5000,
            onclick: function () { window.focus(); },
          });
          console.log("Automatically Relisted Expired Auctions");
        }
      };
    },
  );    
      

  $(document).bind('DOMNodeInserted', function(event) {
    // DOM INSERT FOOTER
    if ($(event.target).attr('id') == 'FIFAHeader')
    {
      if ($(event.target).find('#autorelistConfig').length === 0)
      {
        $('#FIFAHeader').find('.fifa').after('<button id="autorelistConfig" class="" aria-disabled="false" style="'+cssConfigAutorelist+'">Auto-relist</button>');
        $('#autorelistConfig').click(function() {
          GM_configAutorelist.open();
        });
      }
    }
  });



})();
