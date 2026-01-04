// ==UserScript==
// @name         FUT 18 APP - Buy Now One Click
// @namespace    SY
// @version      0.1
// @description  try to take over the world!
// @author       SY
// @match        https://www.easports.com/fifa/ultimate-team/web-app/*
// @grant       GM_notification
// @grant       window.focus
// @downloadURL https://update.greasyfork.org/scripts/33490/FUT%2018%20APP%20-%20Buy%20Now%20One%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/33490/FUT%2018%20APP%20-%20Buy%20Now%20One%20Click.meta.js
// ==/UserScript==

(function() {
  'use strict';

  $(document).bind('DOMNodeInserted', function(event) {

    if ($(event.target).hasClass("Dialog")) {
        var intervalBuyNow = setInterval(function () {
            if ($(event.target).find('header > h1:eq(0)').text() != "")
            {
                if ($(event.target).find('header > h1:eq(0)').text() == "Acheter maintenant")
                {
                    gPopupClickShield._activePopup._eOptionSelected(2);
                }
                clearInterval(intervalBuyNow);
            }

        }, 50);
    }

  });

})();