// ==UserScript==
// @name         Xbox-Now.com
// @namespace    XN	
// @version      1.0
// @description  Just go on the page, and press ARROW UP
// @author       XN
// @match        https://www.microsoft.com/*/p/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_notification
// @grant       window.focus
// @downloadURL https://update.greasyfork.org/scripts/371968/Xbox-Nowcom.user.js
// @updateURL https://update.greasyfork.org/scripts/371968/Xbox-Nowcom.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var flagAutobuy = false;
  var flagNextButtonClicked = false;

  var timeRefresh = 200;

  $(window).keydown(function(event) {
      if (event.which == 38) startAutoBuy();
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
        title: "Xbox-Now.com",
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
        title: "Xbox-Now.com",
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
    flagAutobuy = true;
    GM_notification({
      text: 'Autobuyer enabled',
      title: "Xbox-Now.com",
      onclick: function() { window.focus(); },
    });
  }

  function stopAutoBuy()
  {
    flagAutobuy = false;
    GM_notification({
      text: 'Autobuyer disabled',
      title: "Xbox-Now.com",
      onclick: function() { window.focus(); },
    });
  }


})();