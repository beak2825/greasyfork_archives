// ==UserScript==
// @name         FUT 18 APP - Highlight Contract & Fitness
// @namespace    SY
// @version      0.1
// @description  try to take over the world!
// @author       SY
// @match        https://www.easports.com/fifa/ultimate-team/web-app/*
// @grant       GM_notification
// @grant       window.focus
// @downloadURL https://update.greasyfork.org/scripts/33506/FUT%2018%20APP%20-%20Highlight%20Contract%20%20Fitness.user.js
// @updateURL https://update.greasyfork.org/scripts/33506/FUT%2018%20APP%20-%20Highlight%20Contract%20%20Fitness.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var globalContractMin = 10;
  var globalFitnessMin  = 90;
  var globalCss2 = 'background-color: rgba(33, 150, 243, 0.15);';
  var globalCss1 = 'background-color: rgba(76, 175, 80, 0.42);';

  $(document).bind('DOMNodeInserted', function(event) {
    if ($(event.target).hasClass("listFUTItem")) {
      var items = gNavManager.getCurrentScreenController()._controller._listController._viewmodel._collection;
      var rows = $('.listFUTItem');
      rows.each(function(index, row) {
          if (items[index].contract >= globalContractMin)
          {
             if (items[index].fitness >= globalFitnessMin)
             {
                 $(row).attr('style', globalCss1);
             }
             else
             {
                 $(row).attr('style', globalCss2);
             }
          }
      });
    }
  });
})();