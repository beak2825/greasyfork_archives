// ==UserScript==
// @name         dominion.games Automated Table Setup
// @version      0.40
// @description  Click on the 'New Table' button to trigger the script
// @author       Rafi_
// @match        https://dominion.games/
// @namespace    http://tampermonkey.net/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407793/dominiongames%20Automated%20Table%20Setup.user.js
// @updateURL https://update.greasyfork.org/scripts/407793/dominiongames%20Automated%20Table%20Setup.meta.js
// ==/UserScript==
// global waitForKeyElements
'use strict';

// Bypass the option to load an old game
waitForKeyElements('div.window.new-table', () => $('button:contains("Create Table")').click(), true);

// Configure 'Basic Options'
waitForKeyElements('div.window.my-table', () => {
  /* Set max. players (to 4, or 5 during peak hours) */
  const maxCtrl = $('select[ng-model="$ctrl.tableRules.maxPlayers"]');
  maxCtrl.val(`number:${4 + (Math.abs(new Date().getHours() - 19) <= 4)}`);
  angular.element(maxCtrl).triggerHandler('change');

  /* Open 'Advanced Options' */
  $('button:contains("Advanced Options")').click();
}, true);

// Configure 'Advanced Options'
waitForKeyElements('div.rules-checkboxes', () => {
  /* Check 'Rated Game' */
  $('input[ng-model="$ctrl.tableRules.isRatedGame"]').click();

  /* Uncheck 'Show VP counter' */
  $('input[ng-model="$ctrl.tableRules.useVPCounter"]').click();

  /* Open 'Select Kingdom Cards' view */
  $('button:contains("Select Kingdom Cards")').click();
}, true);

// Configure 'Select Kingdom Cards' view options
waitForKeyElements('div.kingdom-selection-window', () => {
  /* Turn on Colonies */
  _.times(2, () => $('button:contains("Colonies")').click());

  /* Add third and fourth landscape slots */
  _.times(2, () => $('landscape-plus-slot > div > div').click());

  /* Set first landscape slot to always be a Way */
  const ls = $('landscape-slot');
  [...'NPEL'].forEach(t => ls[0].firstChild.querySelector(`.type-${t}`).click());

  /* Set second landscape slot to always be either an Event or a Landmark */
  [...'NP'].forEach(t => ls[1].firstChild.querySelector(`.type-${t}`).click());

  /* Set third and fourth landscape slots to be either be an Event or a Project */
  [2, 3].forEach(n => ls[n].firstChild.querySelector('.type-L').click());

  /* Select 'Done' */
  $('.lobby-button.close').click();

  // Perform tasks upon entering a Game for the first time
  waitForKeyElements('div.game-button.big-button', () => {
    /* Click 'Start Game' */
    $('div.game-button.big-button').click();

    /* Open the Kingdom view */
    $('div.control-link:contains("Kingdom")').click();
  }, true);
}, true);