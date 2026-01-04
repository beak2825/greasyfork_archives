// ==UserScript==
// @name         Vault Value Display
// @namespace    Madwolf
// @version      0.5
// @description vault value display
// @author       MadWolf [376657]
// @license      MadWolf [376657]
// @grant        GM_getValue
// @grant        GM_setValue
// @include      https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/437829/Vault%20Value%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/437829/Vault%20Value%20Display.meta.js
// ==/UserScript==

function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyleBy8626") || (function() {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.id = "GM_addStyleBy8626";
      document.head.appendChild(style);
      return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
  }

  (function() {
      'use strict'
      var formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
      });

      $.ajax({
                  url: 'https://api.torn.com/user',

                  data: {
                      selections: 'money',
                      key: 'Your API Key Here'
                  },

                  /**
                   * Show loader and update text before AJAX fires.
                   */
                  beforeSend: function () {
                      // self.loader.show().update('Preparing to gather all user items.');
                  },

                  /**
                   * Set up item in items object when scraped.
                   * @param data {object} | Torn API response.
                   */
                  success: function (data) {
                      var money = data;
                      console.log("Cayman bank money: " + money.cayman_bank);
                      console.log("Vault amount: " + money.vault_amount);
                      console.log("Daily networth: " + money.daily_networth);
                      console.log("City bank: " + money.city_bank.amount);
                      console.log(formatter.format(money.vault_amount));
                          var resultsDiv = $( `
          <p class="point-block___to3YE" style="white-space:nowrap; font-size:10pt; font-weight:bold">
          <span class="name___MTEAw">
          <span>Vault: <span STYLE="font-size:10pt; color:green; font-weight:bold"> ${formatter.format(money.vault_amount)}</span></span>
          </span>
          </p>
      ` );
                      var targetNd = $('div[class^=points]')
                      if (targetNd.length)
                          targetNd.append (resultsDiv);
                      else
                          console.error ("TM scrpt => Target node not found.");
                  },

                  /**
                   * Gather prices every selected interval (to not get API banned).
                   */
                  complete: function () {
  //                     var i = 0;

  //                     // If there are no items, stop script.
  //                     if ($.isEmptyObject(self.items)) {
  //                         self.loader.hide();
  //                         console.log('No items were scraped. Please try again.');
  //                     }

  //                     self.loader.update('All items gathered.');

  //                     _.each(pricer.items, function (value, key) {
  //                         setTimeout(function () {
  //                             self.getPrice(value.name, key);
  //                         }, options.interval.value * i);

  //                         i++;
  //                     });
                  },

                  /**
                   * If anything went wrong, hide the loader.
                   */
                  error: function () {
                      // self.loader.hide();
                      console.log('There was an error. Please try again.');
                  }
              });

      GM_addStyle ( `
      .tmJsonMashupResults {
          color: black;
          background: #f9fff9;
          margin-top: 10px;
          padding: 0.75ex 1.3ex;
          border: 1px double gray;
          border-radius: 1ex;
      }
  ` );

  })();