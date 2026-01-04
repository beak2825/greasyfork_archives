// ==UserScript==
// @name         TradingView - Remove pro ad
// @version      0.3
// @description  Remove TradingView GoPro Dialog.
// @author       TradingView
// @icon         https://api.iconify.design/simple-icons:tradingview.svg
// @include      https://www.tradingview.com/chart/*
// @grant        none
// @namespace    https://greasyfork.org/users/1443919
// @downloadURL https://update.greasyfork.org/scripts/529284/TradingView%20-%20Remove%20pro%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/529284/TradingView%20-%20Remove%20pro%20ad.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const checkProAd = setInterval(() => {
    const proBox = document.querySelector('div[data-dialog-name="gopro"]');
    if (proBox) {
      proBox.innerHTML = "";
    }
  }, 3000);
})();
