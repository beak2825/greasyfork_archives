// ==UserScript==
// @name        FUT 19 Search Consummables
// @version     0.1
// @description Keyboard Shortcut
// @license     MIT
// @author      Sy
// @match       https://www.easports.com/*/fifa/ultimate-team/web-app/*
// @grant       GM_notification
// @grant       window.focus
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @namespace SY
// @downloadURL https://update.greasyfork.org/scripts/372881/FUT%2019%20Search%20Consummables.user.js
// @updateURL https://update.greasyfork.org/scripts/372881/FUT%2019%20Search%20Consummables.meta.js
// ==/UserScript==
// ==OpenUserJS==
// @author Sy
// ==/OpenUserJS==
(function () {
  'use strict';


  ////////////
  // SCRIPT //
  ////////////


  services.Authentication._oAuthentication.observe(
    this,
    () => {

      console.log('Extension Search Consummables lancé');

      // force full web app layout in any case
      $('body').removeClass('phone').addClass('landscape');

      // get rid of pinEvents when switching tabs
      document.removeEventListener('visibilitychange', onVisibilityChanged);


      $(document).bind('DOMNodeInserted', function(event) {
        if ($(event.target).hasClass("SearchResults")) {
          if ($(event.target).find('.searchConsummableButton').length === 0) {
            $(event.target).find('.pagingContainer').eq(0).append('<a class="btn-flat pagination next searchConsummableButton" style="float: left" data-id="5001006" data-type="development">Contrat Or Rare</a>  ');
            $(event.target).find('.pagingContainer').eq(0).append('<a class="btn-flat pagination next searchConsummableButton" style="float: left" data-id="5001007" data-type="development">Contrat Or 99</a>  ');
            $(event.target).find('.pagingContainer').eq(0).append('<a class="btn-flat pagination next searchConsummableButton" style="float: left" data-id="5002006" data-type="development">Forme Equipe +30</a>  ');
            $(event.target).find('.pagingContainer').eq(0).append('<a class="btn-flat pagination next searchConsummableButton" style="float: left" data-id="5002004" data-type="development">Forme Equipe +10</a>  ');
            $('.searchConsummableButton').click(function() {
              var defId = $(this).attr('data-id');
              var type = $(this).attr('data-type');

              var searchCriteria = getSearchCriteria();
              console.log(searchCriteria);
              searchCriteria.maskedDefId = parseInt(defId);
              searchCriteria.type = type;

              var listController = getListController();
              listController._requestItems();
            });
          }
        }
      });


    },
  );


  function getSearchCriteria()
  {
    var searchCriteria = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._listController._searchCriteria;
    return searchCriteria;
  }
  function getListController()
  {
    var listController = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._listController;
    return listController;
  }




})();
