// ==UserScript==
// @name        FUT 19 Auto Refresh
// @version     0.1
// @description Automatically refresh the search result
// @license     MIT
// @author      Sy
// @match       https://www.easports.com/*/fifa/ultimate-team/web-app/*
// @grant       GM_notification
// @grant       window.focus
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue 
// @namespace SY
// @downloadURL https://update.greasyfork.org/scripts/372534/FUT%2019%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/372534/FUT%2019%20Auto%20Refresh.meta.js
// ==/UserScript==
// ==OpenUserJS==
// @author Sy
// ==/OpenUserJS==
(function () {
  'use strict';


  var cssConfigAutoRefresh = 'height: 100%;' +
    'margin: 0 20px;' +
    'font-weight: bold;';

  ///////////////
  // GM CONFIG //
  ///////////////

  var autorefreshConfigFields = {
    'autorefresh_delay':
    {
        'label': 'Délais de l\'auto refresh (ms)',
        'section': ['Configuration'],
        'type': 'int',
        'default': 3000,
    },
  };

  var GM_configAutoRefresh = new GM_configStruct({
    'id': 'AutoRefreshConfig',
    'title': 'FUT 18 - Auto Refresh',
    'fields': autorefreshConfigFields
  });

  function getConfigAutoRefreshDelay()
  {
    return GM_configAutoRefresh.get('autorefresh_delay');
  }


  ////////////
  // SCRIPT //
  ////////////


  services.Authentication._oAuthentication.observe(
    this,
    () => {

      console.log('Extension Auto refresh lancée');

      // force full web app layout in any case
      $('body').removeClass('phone').addClass('landscape');

      // get rid of pinEvents when switching tabs
      document.removeEventListener('visibilitychange', onVisibilityChanged);





    var autoRefreshInterval;


    $(document).bind('DOMNodeInserted', function(event) {
      if ($(event.target).hasClass("SearchResults")) {

        if ($(event.target).find('#autoRefreshList').length === 0) {
          setInterval(function() { $(event.target).find('.pagingContainer').show(); }, 1000);
          var $buttonAutoRefresh = $('<a class="btn-flat pagination next" style="float: right" id="autoRefreshList">Auto Refresh</a>');

          $(event.target).find('.pagingContainer').eq(0).append($buttonAutoRefresh);

          $('#autoRefreshList').click(function () {
            var countAutoRefresh = 0;
            if ($('#autoRefreshList').hasClass('started'))
            {
              $('#autoRefreshList').removeClass('started');
              clearInterval(autoRefreshInterval);
              $('#autoRefreshList').html('Auto Refresh Stopped');
            }
            else
            {
              $('#autoRefreshList').addClass('started').html('Auto refresh démarré ...');
              autoRefreshInterval = setInterval(function() {
                countAutoRefresh++;

                // Refresh Search
                getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController()._currentController._listController._requestItems()

                if ($('.paginated-item-list > ul > li').length > 0)
                {
                  clearInterval(autoRefreshInterval);
                  $('.FUINavigation.ui-layout-right').show();
                  GM_notification({
                    text: 'Un joueur trouvé !',
                    title: "FUT 18 Web App",
                    onclick: function() { window.focus(); },
                  });
                  $('#autoRefreshList').html('Auto Refresh Stopped');
                }
                else
                {
                  // console.log('SEARCH MARKET : NOT FOUND');
                  $('#autoRefreshList').html('Auto Refresh en cours .. ('+countAutoRefresh+')');
                }
              }, getConfigAutoRefreshDelay());
            }
          });
        }

      }


    });






    },
  );    



  $(document).bind('DOMNodeInserted', function(event) {
    // DOM INSERT FOOTER
    if ($(event.target).attr('id') == 'FIFAHeader')
    {
      if ($(event.target).find('#autorefreshConfig').length === 0)
      {
        $('#FIFAHeader').find('.fifa').after('<button id="autorefreshConfig" class="" aria-disabled="false" style="'+cssConfigAutoRefresh+'">Auto-Refresh</button>');
        $('#autorefreshConfig').click(function() {
          GM_configAutoRefresh.open();
        });
      }
    }
  });


      
})();
