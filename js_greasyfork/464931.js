// ==UserScript==
// @name         SiriusXM.com Auto Play 2023
// @namespace    guipinto.com
// @version      1.0
// @description  Autoplays music on-load, and handles any other interruptions for you.
// @match        http*://player.siriusxm.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464931/SiriusXMcom%20Auto%20Play%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/464931/SiriusXMcom%20Auto%20Play%202023.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const LOG_PREFIX_PRE = `Gui's SiriusXM.com Auto Player:`;
  console.log(LOG_PREFIX_PRE, 'Initializing...');

  // We have better things to do, keep life simple and lets work within jQuery-land.
  const loadJQuery = callback => {
    const script = document.createElement('script');
    script.setAttribute('src', 'https://code.jquery.com/jquery-3.6.0.min.js');
    script.addEventListener('load', () => {
      const script = document.createElement('script');
      script.textContent = `((${callback.toString()})(jQuery.noConflict(true)));`;
      document.body.appendChild(script);
      console.log('JQuery Loading & Patching.');
    }, false);
    document.body.appendChild(script);
  };

  loadJQuery($ => {

    const LOG_PREFIX = `Gui's SiriusXM.com Auto Player:`;
    console.log(LOG_PREFIX, `Initialized! (jQuery ${$.fn.jquery})`);

    let processing = false;
    const tick_rate_ms = 3000; // not too fast there cowboy.

    setInterval(() => {
      if (processing) {
        console.log(LOG_PREFIX, 'Ignoring tick because we\'re still processing..');
        return;
      }
      processing = true;

      const keepListeningLabel = $(`span:contains('Keep Listening')`); // "Are you still there"
      const continueLabel = $(`span:contains('Continue')`); // "Another device is logged in"
      const playPauseButton = $(`button.play-pause-btn`);

      // Look for 'are you still listening'
      if (keepListeningLabel.length > 0) {
        console.log(LOG_PREFIX, 'Clicking Keep Listening Button.');
        keepListeningLabel.parent().click();
      }
      // Look for 'another device is logged in'
      else if (continueLabel.length > 0) {
        console.log(LOG_PREFIX, `Clicking 'Continue' button.`);
        continueLabel.parent().click();
      }
      else if (playPauseButton.attr('title').toLowerCase() === 'play') {
        // Play button is showing, click it.
        console.log(LOG_PREFIX, 'Clicking Play Button.');
        playPauseButton.click();
      }

      processing = false;
    }, tick_rate_ms);

  });

})();
