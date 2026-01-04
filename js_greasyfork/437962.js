// ==UserScript==
// @name         Google Meet Close Open Queue popup
// @namespace		 michaelwilkowski.com
// @version      0.1
// @description  Closes annoying Open queue pop-up automatically
// @author       mwilkowski
// @match        https://meet.google.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437962/Google%20Meet%20Close%20Open%20Queue%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/437962/Google%20Meet%20Close%20Open%20Queue%20popup.meta.js
// ==/UserScript==

(function() {
  setInterval(function() {
    q = document.evaluate('//span[text() = "Otwórz kolejkę" or text() = "Open queue"]/../../..//i',
                          document,
                          null,
                          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                          null);
    if (q.snapshotLength > 0) {
      console.log('Closing window');
      q.snapshotItem(0).click();
    }
  }, 100);
  
  console.log('Google Met Close Open Queue popup active');
})();
