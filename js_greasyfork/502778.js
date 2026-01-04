// ==UserScript==
// @name        WaniKani Prefetch Audio
// @namespace   WaniKani_Prefetch_Audio
// @match       https://www.wanikani.com/*
// @grant       none
// @version     1.2
// @author      Flipp Fuzz
// @description 21/8/2024, 5:09:39 PM
// @run-at      document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502778/WaniKani%20Prefetch%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/502778/WaniKani%20Prefetch%20Audio.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.debug("Setting up Event Listener");
  window.addEventListener("willShowNextQuestion", (ev) => {
    console.debug(ev);

    for (const reading of ev?.detail?.subject?.readings ?? []) {
      for (const source of reading?.pronunciation?.sources ?? []) {
        var audio = source["url"];
        console.debug("Pre-fetching " + audio);
        fetch(audio, {
          mode: 'no-cors'
        });
      }
    }
  });
})();