// ==UserScript==
// @name         Xbox Store Checker - Buy Game Without VPN 2
// @namespace    XSC
// @version      1.5
// @description  Just go on the page, and press ARROW UP
// @author       XSC
// @match        https://www.microsoft.com/*/p/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_notification
// @grant       window.focus
// @downloadURL https://update.greasyfork.org/scripts/371960/Xbox%20Store%20Checker%20-%20Buy%20Game%20Without%20VPN%202.user.js
// @updateURL https://update.greasyfork.org/scripts/371960/Xbox%20Store%20Checker%20-%20Buy%20Game%20Without%20VPN%202.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var flagAutobuy = false;
  var flagNextButtonClicked = false;

  var timeRefresh = 200;

  $(window).keydown(function(event) {
      if (event.which == 38 || event.which == 16) startAutoBuy();
      else if (event.which == 40) stopAutoBuy();
  });


  $("body").bind('DOMNodeInserted', function(event) {
    if (flagAutobuy)
    {
      if ($(event.target).attr('id') == 'wb_auto_blend_container')
      {
        flagNextButtonClicked = false;

        goClickConfirmButton();
      }
    }
  });

  function goClickConfirmButton()
  {
    if ($('#wb_auto_blend_container').contents().find('#confirmButton').length > 0)
    {
      $('#wb_auto_blend_container').contents().find('#confirmButton').click();
      checkNextButton();
    }
    else
    {
      setTimeout(goClickConfirmButton, timeRefresh);
    }
  }

  function checkNextButton()
  {
    if ($('#wb_auto_blend_container').contents().find('.cli_errorCode').length > 0 &&
      $('#wb_auto_blend_container').contents().find('.cli_errorCode').text() == 'PUR-UserAlreadyOwnsContent')
    {
      flagAutobuy = false;
      GM_notification({
        text: 'BUY OK',
        title: "Xbox Store Checker",
        onclick: function() { window.focus(); },
      });
    }
    else
    {
      if ($('#wb_auto_blend_container').contents().find('#cancelButton').length > 0)
      {
        $('#wb_auto_blend_container').contents().find('#cancelButton').click();
        goClickBuyButton();

        flagNextButtonClicked = true;
        setTimeout(checkNextButton, timeRefresh);
      }
      else
      {
        if (flagNextButtonClicked == false)
        {
          setTimeout(checkNextButton, timeRefresh);
        }
        else
        {
          goClickBuyButton();
        }
      }
    }

  }




  function checkNextButton2()
  {
    if ($('#wb_auto_blend_container').contents().find('#cancelButton').length > 0)
    {
      $('#wb_auto_blend_container').contents().find('#cancelButton').click();
      goClickBuyButton();

      flagNextButtonClicked = true;
      setTimeout(checkNextButton, timeRefresh);
    }
    if ($('#wb_auto_blend_container').contents().find('#cli_errorCode').length > 0 &&
      $('#wb_auto_blend_container').contents().find('#cli_errorCode').text() == 'PUR-UserAlreadyOwnsContent')
    {
      flagAutobuy = false;
      GM_notification({
        text: 'BUY OK',
        title: "Xbox Store Checker",
        onclick: function() { window.focus(); },
      });
    }
    else
    {
      if (flagNextButtonClicked == false)
      {
        setTimeout(checkNextButton, timeRefresh);
      }
      else
      {
        goClickBuyButton();
      }
    }
  }

  function goClickBuyButton()
  {
    if ($('body').find('#buttonPanel_AppIdentityBuyButton').length > 0)
    {
      $('body').find('#buttonPanel_AppIdentityBuyButton').click();
    }
  }

  function startAutoBuy()
  {
    flagAutobuy = false;
    GM_notification({
      text: 'Autobuyer disabled',
      title: "Xbox Store Checker",
      onclick: function() { window.focus(); },
    });
  }

  function stopAutoBuy()
  {
    flagAutobuy = false;
    GM_notification({
      text: 'Autobuyer disabled',
      title: "Xbox Store Checker",
      onclick: function() { window.focus(); },
    });
  }


})();