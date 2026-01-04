// ==UserScript==
// @name        FUT 19 DCE GOLD
// @version     0.1
// @description FUT 19 DCE GOLD !
// @license     MIT
// @author      Sy
// @match       https://www.easports.com/*/fifa/ultimate-team/web-app/*
// @grant       GM_notification
// @grant       window.focus
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @namespace SY
// @downloadURL https://update.greasyfork.org/scripts/376533/FUT%2019%20DCE%20GOLD.user.js
// @updateURL https://update.greasyfork.org/scripts/376533/FUT%2019%20DCE%20GOLD.meta.js
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

      console.log('Extension FUT 19 DCE GOLD lancée');

      // force full web app layout in any case
      $('body').removeClass('phone').addClass('landscape');

      // get rid of pinEvents when switching tabs
      document.removeEventListener('visibilitychange', onVisibilityChanged);



    $(document).bind('DOMNodeInserted', function(event) {
    
      if ($(event.target).hasClass("SquadBuilder")) {

        if ($(event.target).find('#getGoldSquad').length === 0) {
          $(event.target).find('.button-container').after('<div class="button-container"><button class="btn-standard call-to-action" id="getGoldSquad">Gold Squad</button></div>');
          $('#getGoldSquad').click(function() {
            getGoldSquad();
          });
        }
      }

    });


    ////////////////////
    // GET GOLD SQUAD //
    ////////////////////

    var handleSearchGoldSquad = function handleSearchGoldSquad(t, data) {

    };


    var getGoldSquad = function getGoldSquad() {
      console.log('GET GOLD SQUAD');
      var sbcController = getSBCController();
      repositories.Item.getClubItems(sbcController._viewmodel.searchCriteria).observe(this, _onClubSearchCompleteAutoSBC);
    };

    function _onClubSearchCompleteAutoSBC(t, data) {
      t.unobserve(this);
      checkItems(data.items);
    }

    function checkItems(items)
    {
      var sbcController = getSBCController();

      sbcController._squad && sbcController._squad.isSBC() && (items = items.filter(function(t) {
          return !(t.isLoaned() || entities.Item.isAlex(t.id) || entities.Item.isJim(t.id) || entities.Item.isDanny(t.id) || (t.rareflag != 0 && t.rareflag != 1))
      })),
      0 !== items.length ? buildSquadAutoSBC(items) : utils.PopupManager.ShowAlert(utils.PopupManager.Alerts.SQUAD_BUILDER_NO_RESULTS);
      
    }

    function buildSquadAutoSBC(items) {

      var sbcController = getSBCController();

        var i = new viewmodels.ItemList([])
          , s = sbcController._viewmodel.searchCriteria.acquiredDate
          , o = s !== enums.SearchSort.NONE;
        i.sortByRecency = o,
        i.sort = o ? s : sbcController._viewmodel.sort,
        i.addArray(items),
        items = i.getItemList();
        var l;

        l = sbcController._squadBuilder.buildSquad(sbcController._squad._formation._name, items, sbcController._squad);
        console.log('L', l);
        sbcController._squad.setPlayers(l, sbcController._replacePlayers);
        // sbcController._challenge ? sbcController._challenge.save().observe(this, this._onSBCSaveComplete) : sbcController._squad.save().observe(this, this._onSquadSaveComplete);

        return false;
    }

    function getSearchCriteria()
    {
      var searchCriteria = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._rightController.getCurrentController()._viewmodel.searchCriteria;
      return searchCriteria;
    }

  function getSBCController()
  {
    var sbcController = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._rightController.getCurrentController();
    return sbcController;
  }

    },
  );    

})();
