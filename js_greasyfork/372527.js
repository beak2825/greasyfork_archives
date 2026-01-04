// ==UserScript==
// @name        FUT 20 Show Contract & Fitness
// @version     0.5
// @description Automatically relist unsold items in the transfer list
// @license     MIT
// @author      Sy
// @match       https://www.easports.com/*/fifa/ultimate-team/web-app/*
// @grant       GM_notification
// @grant       window.focus
// @namespace SY
// @downloadURL https://update.greasyfork.org/scripts/372527/FUT%2020%20Show%20Contract%20%20Fitness.user.js
// @updateURL https://update.greasyfork.org/scripts/372527/FUT%2020%20Show%20Contract%20%20Fitness.meta.js
// ==/UserScript==
// ==OpenUserJS==
// @author Sy
// ==/OpenUserJS==
(function () {
  'use strict';

  services.Authentication._oAuthentication.observe(
    this,
    () => {

      console.log('Extension Show Contract & Fitness lancée');

      // force full web app layout in any case
      $('body').removeClass('phone').addClass('landscape');

      // get rid of pinEvents when switching tabs
      document.removeEventListener('visibilitychange', onVisibilityChanged);




    $('head').append(`
    <style id="addedCSS" type="text/css">
      .item.player.small.TOTW .stats-contract-fitness,
      .item.player.small.OTW .stats-contract-fitness,
      .item.player.small.TOTS .stats-contract-fitness,
      .item.player.small.TOTY .stats-contract-fitness,
      .item.player.small.legend .stats-contract-fitness {
        color: white;
      }
      .item.player.small .stats-contract-fitness
      {
        position: absolute;
        right: 6px;
        top: 50px;
        background-color: black;
        color: #0afff6;
        text-align: center;
        font-size: 18px;
      }

      .item.player.large .stats-contract-fitness
      {
        position: absolute;
        top: -82px;
        right: 15px;
        background-color: black;
        color: #0afff6;
        text-align: center;
        font-size: 18px;
      }
    </style>`);

    function showInformation(target)
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
          listController = controller._leftController;
          var items = listController._view._list._listRows;
          var item = items[$(target).index()].data;
        }
        if ($(target).find('.stats-contract-fitness').length > 0)
        {
          $(target).find('.stats-contract-fitness').remove();
        }

        $(target).find('.ut-item-view--main.ut-item-view').append(
          '<div class="stats-contract-fitness">' +
            '<div class="fitness">' +
            item.fitness +
            '</div>' +
            '<div class="contracts">' +
            item.contract +
            '</div>' +
          '</div>'
        );
    }


    $(document).bind('DOMNodeInserted', function(event) {
      if ($(event.target).hasClass("listFUTItem")) {
        showInformation($(event.target));
      }
      else if ($(event.target).hasClass("tns-carousel"))
      {
        // CAROUSEL (page Mon equipe)
        var itemsCollectionDOM = $(event.target).find('.tns-item');
        if (itemsCollectionDOM.length > 1)
        {
          var itemsCollection = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._rightController.getCurrentController()._viewmodel._collection;
          console.log(itemsCollectionDOM);
          console.log(itemsCollection);
          for(var i in itemsCollection)
          {
            var item = itemsCollection[i];
            // itemContainer = $(event.target).parent().find('.tns-item:eq('+i+')');
            itemContainer = itemsCollectionDOM[i];
            console.log(itemContainer);
            if ($(itemContainer).find('.stats-contract-fitness').length > 0)
            {
              $(itemContainer).find('.stats-contract-fitness').remove();
            }
            $(itemContainer).find('.ut-item-view--main.ut-item-view').append(
              '<div class="stats-contract-fitness">' +
              '<div class="fitness">' +
              item.fitness +
              '</div>' +
              '<div class="contracts">' +
              item.contract +
              '</div>' +
              '</div>'
            );
          }
        }
      }
      else if ($(event.target).hasClass("DetailPanel")) {
        var itemContainer = $(event.target).parent().find('.item');
        if (typeof getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._rightController.getCurrentController()._quickListPanel !== "undefined")
        {
          var item = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._rightController.getCurrentController()._quickListPanel._item;
          if ($(itemContainer).find('.stats-contract-fitness').length > 0)
          {
            $(itemContainer).find('.stats-contract-fitness').remove();
          }
          $(itemContainer).find('.ut-item-view--main.ut-item-view').append(
            '<div class="stats-contract-fitness">' +
            '<div class="fitness">' +
            item.fitness +
            '</div>' +
            '<div class="contracts">' +
            item.contract +
            '</div>' +
            '</div>'
          );
        }
      }


    });






    },
  );

})();
