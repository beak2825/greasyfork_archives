// ==UserScript==
// @name         FUT 18 APP - Auto Refresh
// @namespace    SY
// @version      0.2
// @description  try to take over the world!
// @author       SY
// @match        https://www.easports.com/fifa/ultimate-team/web-app/*
// @grant       GM_notification
// @grant       window.focus
// @downloadURL https://update.greasyfork.org/scripts/33489/FUT%2018%20APP%20-%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/33489/FUT%2018%20APP%20-%20Auto%20Refresh.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var timeAutoRefresh = 3000;
  var autoRefreshInterval;
  $(document).bind('DOMNodeInserted', function(event) {

    if ($(event.target).hasClass("SearchResults")) {
      if ($(event.target).find('#autoRefreshList').length === 0) {
        setInterval(function() { $(event.target).find('.pagingContainer').show(); }, 1000);
        $(event.target).find('.pagingContainer').append('<a class="btn-flat pagination next" style="float: right" id="autoRefreshList">Auto Refresh</a>');

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
                $('#autoRefreshList').addClass('started');
                autoRefreshInterval = setInterval(function() {
                    countAutoRefresh++;

                    gNavManager.getCurrentScreenController()._controller._listController._requestItems();
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
                }, timeAutoRefresh);
            }
        });
      }
    }
  });
})();