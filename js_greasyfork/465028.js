// ==UserScript==
// @name        Copy spy details
// @namespace   https://politicsandwar.com/nation/id=98616
// @match       https://politicsandwar.com/nation/id=*
// @grant       none
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @version     0.30
// @license     GPL-3.0-or-later
// @author      Talus
// @description Create a button to copy details required for getting spy ops.
// @downloadURL https://update.greasyfork.org/scripts/465028/Copy%20spy%20details.user.js
// @updateURL https://update.greasyfork.org/scripts/465028/Copy%20spy%20details.meta.js
// ==/UserScript==

(function() {
  var $ = window.jQuery;

  function getNationStrength() {
    const NATION_STRENGTH_LABEL_SELECTOR = "td:contains('Nation Score:')";
    return Math.round(parseFloat($.trim($(NATION_STRENGTH_LABEL_SELECTOR).next().text().replaceAll(/,/g, ''))));
  }

  function getSpies() {
    const SPIES_LABEL_SELECTOR = "td:contains('Spies:')";
    return $(SPIES_LABEL_SELECTOR).next().contents().filter(function(){return this.nodeType === Node.TEXT_NODE;}).first().text();
  }

  function getWarPolicy() {
    const WAR_POLICY_LABEL_SELECTOR = "td:contains('War Policy:')";
    return $.trim($(WAR_POLICY_LABEL_SELECTOR).next().contents().filter(function(){return this.nodeType === Node.TEXT_NODE;}).first().text());
  }

  function hasSpySatellite() {
    return $("td:contains('Spy Satellite')").length > 0 ? "SS" : "No SS";
  }

  function generateRequestSpyOpsMessage() {

    // jQuery Selectors
    const SIDEBAR_SELECTOR = 'ul.sidebar span';
    const MY_NATION_SELECTOR = '#leftcolumn > ul:nth-child(2)';

    // If not on your own nation page, this script won't work, so return
    if ($(MY_NATION_SELECTOR).contents()[3].href != window.location.href) {
      return
    }

    // Define messages
    const GET_REQUEST_SPY_OPS_MESSAGE_TEXT = 'Get spy details'
    let REQUEST_SPY_OPS_MESSAGE = `${getNationStrength()} / ${getSpies()} / ${hasSpySatellite()} / ${getWarPolicy()} <@&601936110607925251>`;

    let SIDEBAR_PREPEND_HTML = `
      <span style="font-weight:bold; font-size: 18px;">Talus Tools</span>
      <li><button id="getRequestSpyOpsMessageButton">${GET_REQUEST_SPY_OPS_MESSAGE_TEXT}</button></li>
    `;
    $(SIDEBAR_SELECTOR).first().before(SIDEBAR_PREPEND_HTML);

    var getRequestSpyOpsMessageButton = document.getElementById('getRequestSpyOpsMessageButton')
    getRequestSpyOpsMessageButton.addEventListener('click', () => {
      navigator.clipboard.writeText(REQUEST_SPY_OPS_MESSAGE)
        .then(() => {
        getRequestSpyOpsMessageButton.textContent = 'Copied';
        setTimeout(() => {
          getRequestSpyOpsMessageButton.textContent = GET_REQUEST_SPY_OPS_MESSAGE_TEXT;
        }, 1000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      })
    });
  }
  window.addEventListener('load', generateRequestSpyOpsMessage);
})();