// ==UserScript==
// @name        FUT 21 Keyboard Shortcut
// @version     0.5
// @description Keyboard Shortcut
// @license     MIT
// @author      Sy
// @match        https://www.ea.com/*/fifa/ultimate-team/web-app/*
// @match        https://www.ea.com/fifa/ultimate-team/web-app/*
// @grant       GM_notification
// @grant       window.focus
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @namespace SY
// @downloadURL https://update.greasyfork.org/scripts/372539/FUT%2021%20Keyboard%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/372539/FUT%2021%20Keyboard%20Shortcut.meta.js
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

      console.log('Extension Keyboard Shortcut lancé');

      // force full web app layout in any case
      $('body').removeClass('phone').addClass('landscape');

      // get rid of pinEvents when switching tabs
      document.removeEventListener('visibilitychange', onVisibilityChanged);


      $(window).keydown(function(event) {
          if (event.which == 38) upInputFocus();
          else if (event.which == 40) downInputFocus();
          // Arrow left
          else if (event.which == 37)
          {
            buttonBack();
          }
          // Arrow right
          else if (event.which == 39)
          {
            // Si sur page filtre de recherche, on lance la recherche
            if (getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._view.className == "UTMarketSearchFiltersView")
            {
              searchButtonClicked();
            }
            // Sinon page suivante
            else
            {
              getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._listController._view._list._botNext._tapDetected(enums.Event.TAP);
            }
          }
          // CTRL RIGHT
          else if (event.which == 17 && event.originalEvent.code == 'ControlRight')
          {
              getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._listController._view._list._botPrev._tapDetected(enums.Event.TAP);
          }
      });

    },
  );

  function updatePriceInputs()
  {

    var view = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController()._currentController._view;
    if (view && typeof view._eMaxBuyPriceChanged !== "undefined")
    {
      view._eMaxBuyPriceChanged();
      view._eMaxBidPriceChanged();
      view._eMinBidPriceChanged();
      view._eMinBidPriceChanged();
    }

    if (getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController()._currentController._itemDetailController)
    {
      var quickListPanelView = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController()._currentController._itemDetailController._currentController._quickListPanel._view;
      if (quickListPanelView && typeof quickListPanelView._onBidPriceChanged !== "undefined")
      {
        quickListPanelView._onBidPriceChanged();
      }
    }
  }

  function upInputFocus()
  {
    var input = $(':focus');



    var oldVal = input.val();
    var newVal = augmentePrix(oldVal);
    input.trigger('focus').val(newVal).addClass('filled').trigger('change');
    updatePriceInputs();
  }

  function downInputFocus()
  {
    var input = $(':focus');
    var oldVal = input.val();
    var newVal = baisserPrix(oldVal);
    input.trigger('focus').val(newVal).addClass('filled').trigger('change');
    updatePriceInputs();
  }

  function buttonBack()
  {
    getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController()._currentController._view._superview._navbar.primaryButton._tapDetected(enums.Event.TAP);
  }


  function searchButtonClicked()
  {
    if ($('.QuickListPanel').length > 0)
    {
      // setPrixDepart();
    }
    else
    {
      updatePriceInputs();
      getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController()._currentController._view._searchButton._tapDetected(enums.Event.TAP);
    }
  }









    function augmentePrix(oldVal)
    {
        if (oldVal == "") oldVal = '100';
        oldVal = getPrix(oldVal);
        var range = getRange(oldVal);

        return (oldVal + range);
    }

    function baisserPrix(oldVal)
    {
        if (oldVal == "") oldVal = '100';

        oldVal = getPrix(oldVal);
        var range = getRange(oldVal);

        return (oldVal - range);
    }

    function getRange(oldVal)
    {
        oldVal = parseInt(oldVal);
        var range = 50;

        if (oldVal < 1000)
        {
            range = 50;
        }
        else if (oldVal < 10000)
        {
          range = 100;
        }
        else if (oldVal < 50000)
        {
         range = 250;
        }
        else
        {
            range = 500;
        }

        return range;
    }

    function getPrix(val)
    {
        val = val.replace(/\s+/g, '');
        val = parseInt(val);
        return val;
    }




})();
