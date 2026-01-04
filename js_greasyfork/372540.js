// ==UserScript==
// @name        FUT 19 Buy Now One Click
// @version     0.1
// @description Buy Now in One Click
// @license     MIT
// @author      Sy
// @match       https://www.easports.com/*/fifa/ultimate-team/web-app/*
// @grant       GM_notification
// @grant       window.focus
// @namespace SY
// @downloadURL https://update.greasyfork.org/scripts/372540/FUT%2019%20Buy%20Now%20One%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/372540/FUT%2019%20Buy%20Now%20One%20Click.meta.js
// ==/UserScript==
// ==OpenUserJS==
// @author Sy
// ==/OpenUserJS==
(function () {
  'use strict';

  services.Authentication._oAuthentication.observe(
    this,
    () => {

      console.log('Extension Buy Now One Click lancée');

      // force full web app layout in any case
      $('body').removeClass('phone').addClass('landscape');

      // get rid of pinEvents when switching tabs
      document.removeEventListener('visibilitychange', onVisibilityChanged);



    $(document).bind('DOMNodeInserted', function(event) {
    
      if ($(event.target).hasClass("Dialog")) {
          var intervalBuyNow = setInterval(function () {
              if ($(event.target).find('header > h1:eq(0)').text() != "")
              {
                  if ($(event.target).find('header > h1:eq(0)').text().toLowerCase() == "acheter maintenant")
                  {
                      gPopupClickShield._activePopup._eOptionSelected(2);
                  }
                  clearInterval(intervalBuyNow);
              }

          }, 50);
      }

    });






    },
  );    
      
})();
