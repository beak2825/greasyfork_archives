// ==UserScript==
// @name        FUT 20 Highlight Contract & Fitness
// @version     0.5
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
// @downloadURL https://update.greasyfork.org/scripts/372526/FUT%2020%20Highlight%20Contract%20%20Fitness.user.js
// @updateURL https://update.greasyfork.org/scripts/372526/FUT%2020%20Highlight%20Contract%20%20Fitness.meta.js
// ==/UserScript==
// ==OpenUserJS==
// @author Sy
// ==/OpenUserJS==
(function () {
  'use strict';

  var cssConfigHighlight = 'height: 100%;' +
    'margin: 0 20px;' +
    'font-weight: bold;';


  ///////////////
  // GM CONFIG //
  ///////////////

  var highlightGlobalConfigFields = {
    'highlight_contract_min':
    {
        'label': 'Nb. minimum de contrat pour la surbrillance',
        'section': ['Configuration'],
        'type': 'int',
        'default': 10,
        'min': 1
    },
    'highlight_fitness_min':
    {
        'label': 'Nb. minimum de forme pour la surbrillance',
        'section': ['Configuration'],
        'type': 'int',
        'default': 90,
        'min': 1
    },
    'highlight_background-color_1':
    {
        'label': 'Si surbrillance contrat',
        'section': ['CSS'],
        'type': 'text',
        'default': 'background-color: rgba(33, 150, 243, 0.15);',
    },
    'highlight_background-color_2':
    {
        'label': 'Si surbrillance contrat + forme',
        'section': ['CSS'],
        'type': 'text',
        'default': 'background-color: rgba(76, 175, 80, 0.42);',
    }
  };

  var GM_configHighlight = new GM_configStruct({
    'id': 'HighlightConfig',
    'title': 'FUT 20 - Highlight Contract & Fitness',
    'fields': highlightGlobalConfigFields
  });

  function getConfigMinContract()
  {
    return parseInt(GM_configHighlight.get('highlight_contract_min'));
  }

  function getConfigMinFitness()
  {
    return parseInt(GM_configHighlight.get('highlight_fitness_min'));
  }

  function getConfigCss1()
  {
    return GM_configHighlight.get('highlight_background-color_1');
  }
  function getConfigCss2()
  {
    return GM_configHighlight.get('highlight_background-color_2');
  }


  ////////////
  // SCRIPT //
  ////////////

  services.Authentication._oAuthentication.observe(
    this,
    () => {

      console.log('Extension Highlight Contract & Fitness lancée');

      // force full web app layout in any case
      $('body').removeClass('phone').addClass('landscape');

      // get rid of pinEvents when switching tabs
      document.removeEventListener('visibilitychange', onVisibilityChanged);

    function highlightItem(target)
    {
        var controller = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController();
        var listController = null;
        var screen = controller.className;
        if (screen == 'UTTransferListSplitViewController')
        {
          listController = controller._leftController;
          var items = listController._viewmodel._collection;
          var item = items[$(target).index()];
        }
        else if (screen == 'SBCSquadSplitViewController')
        {
          listController = controller._itemDetailController.getCurrentController();
          var items = listController._view._list._listRows;
          var item = items[$(target).index()].data;
        }
        else
        {
          listController = controller._listController;
          var items = listController._view._list._listRows;
          var item = items[$(target).index()].data;
        }

        $(target).attr('style', '');

        if (item.contract >= getConfigMinContract())
        {
          if (item.fitness >= getConfigMinFitness())
          {
            $(target).attr('style', getConfigCss1());
          }
          else
          {
            $(target).attr('style', getConfigCss2());
          }
        }

    }


      $(document).bind('DOMNodeInserted', function(event) {
        if ($(event.target).hasClass("listFUTItem")) {
          highlightItem($(event.target));
        }
      });
    },
  );


  $(document).bind('DOMNodeInserted', function(event) {
    // DOM INSERT FOOTER
    if ($(event.target).attr('class') == 'ut-fifa-header-view')
    {
      if ($(event.target).find('#highlightConfig').length === 0)
      {
        $('.ut-fifa-header-view').find('.fifa').after('<button id="highlightConfig" class="" aria-disabled="false" style="'+cssConfigHighlight+'">Highlight Contract & Fitness</button>');
        $('#highlightConfig').click(function() {
          GM_configHighlight.open();
        });
      }
    }
  });





})();
