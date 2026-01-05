// ==UserScript==
// @name         eRev Improver
// @namespace    https://greasyfork.org/es/scripts/21827-erev-improver
// @version      0.4
// @description  Añade mejoras a eRevollution.com
// @author       DonNadie
// @match        https://www.erevollution.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21827/eRev%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/21827/eRev%20Improver.meta.js
// ==/UserScript==

(function()
{
  'use strict';

  var eImprover = function()
  {
      var oldHealth = {},
          config = {
              hideBattleResults: true
          };

      var init = function()
      {
          if (localStorage.getItem("erev-improver")) {
              config = JSON.parse(localStorage.getItem("erev-improver"));
          }

          // detect changes on player health and max regen
          $('#energyBarT, #energyButtonT').on("DOMSubtreeModified", function() {
              showMaxRegenBar();
          });

          // click on local feeds/news
          $('a[data-target="#tab-feeds4"]').click();
          $('a[href="#tab-national"]').click();

          showMaxRegenBar();

          if (config.hideBattleResults) {
              hideBattleResults();
          }

          // remove energy time loader image
          $('#energyTime img').remove();

          // fix comment's newlines
          $('.conversation-item.item-left.clearfix .text').each(function() {
              $(this).html($(this).html().replace(/\n/g, "<br>")); 
          });
      };

      var hideBattleResults = function ()
      {
          $('body').append(parseTemplate(function() {
            /*
             <style>
             #battleBlack, #battleLog {
                 display: none !important;
             </style>
             }*/
          }));
      };

      var showMaxRegenBar = function()
      {
          var tmp = $('#energyBarT').text().split(' / '),
              health = {
                  current: parseInt(tmp[0]),
                  max: parseInt(tmp[1])
              },
              $maxHealth = $('#max-health');

          health.maxRegex = parseInt($('#energyButtonT').text()) + health.current;

          if (health.current < 0 || health.max < 0 || isNaN(health.current) || isNaN(health.current) || isNaN(health.maxRegex) || oldHealth == health) {
              return;
          }
          oldHealth = health;

          // first load, setup everything
          if ($maxHealth.length === 0)
          {
              $('body').append(parseTemplate(function() {
                  /*
                    <style>
                    .vs100.progress {
                        background: transparent !important;
                    }

                    #max-health {
                        width: 100%;
                        height: 3vh;
                        position: absolute;
                        z-index: -1;
                        border: 0;
                    }

                    #max-health::-webkit-progress-bar {
                        background-color: #eee;
                    }
                    #max-health::-webkit-progress-value {
                        background: #a7d8a7;
                    }
                    </style>
                */
              }));

              $('#energyBarP').before('<progress id="max-health" value="' + health.maxRegex + '" max="' + health.max + '"></progress>');
          } else {
              $maxHealth.val(health.maxRegex);
              $maxHealth.attr("max", health.max);
          }
      };

      var parseTemplate = function(func) {
          return func.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '');
      };

      $(function() {
          setTimeout(init, 1000);
      });
  }();
})();