// ==UserScript==
// @name        FUT 19 Change List Size
// @version     0.1
// @description Change List Size
// @license     MIT
// @author      Sy
// @match       https://www.easports.com/*/fifa/ultimate-team/web-app/*
// @grant       GM_notification
// @grant       window.focus
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @namespace SY
// @downloadURL https://update.greasyfork.org/scripts/372558/FUT%2019%20Change%20List%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/372558/FUT%2019%20Change%20List%20Size.meta.js
// ==/UserScript==
// ==OpenUserJS==
// @author Sy
// ==/OpenUserJS==
(function () {
  'use strict';

  var cssConfigListSize = 'height: 100%;' +
    'margin: 0 20px;' +
    'font-weight: bold;';


  ///////////////
  // GM CONFIG //
  ///////////////

  var listSizeGlobalConfigFields = {
    'listsize_transfermarket':
    {
        'label': 'Items par page sur le marché (max 30)',
        'section': ['Configuration'],
        'type': 'int',
        'default': 20,
        'max': 30
    },
    'listsize_club':
    {
        'label': 'Items par page dans mon club (max 90)',
        'section': ['Configuration'],
        'type': 'int',
        'default': 20,
        'max': 90
    },

  };

  var GM_configListSize = new GM_configStruct({
    'id': 'ListSizeConfig',
    'title': 'FUT 18 - List Size',
    'fields': listSizeGlobalConfigFields,
    'events':
    {
      'save': function() {
        setListSize();
      }
    }
  });

  function getConfigListSizeTransferMarket()
  {
    return parseInt(GM_configListSize.get('listsize_transfermarket'));
  }
  function getConfigListSizeClub()
  {
    return parseInt(GM_configListSize.get('listsize_club'));
  }



  ////////////
  // SCRIPT //
  ////////////

  services.Authentication._oAuthentication.observe(
    this,
    () => {

      console.log('Extension List Size lancée');

      // force full web app layout in any case
      $('body').removeClass('phone').addClass('landscape');

      // get rid of pinEvents when switching tabs
      document.removeEventListener('visibilitychange', onVisibilityChanged);

      setListSize();

    },
  );

  function setListSize()
  {
      const itemsOnMarket = getConfigListSizeTransferMarket();
      const itemsOnClub = getConfigListSizeClub();
      const configObj = gConfigurationModel
      .getConfigObject(models.ConfigurationModel.KEY_ITEMS_PER_PAGE);
      configObj[models.ConfigurationModel.ITEMS_PER_PAGE.TRANSFER_MARKET] = itemsOnMarket;
      configObj[models.ConfigurationModel.ITEMS_PER_PAGE.CLUB] = itemsOnClub;
  }

  $(document).bind('DOMNodeInserted', function(event) {
    // DOM INSERT FOOTER
    if ($(event.target).attr('id') == 'FIFAHeader')
    {
      if ($(event.target).find('#listsizeConfig').length === 0)
      {
        $('#FIFAHeader').find('.fifa').after('<button id="listsizeConfig" class="" aria-disabled="false" style="'+cssConfigListSize+'">List Size</button>');
        $('#listsizeConfig').click(function() {
          GM_configListSize.open();
        });
      }
    }
  });



})();