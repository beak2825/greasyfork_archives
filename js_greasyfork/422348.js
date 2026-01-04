// ==UserScript==
// @name            Facebook Block Sponsored Section in Messenger
// @version         0.7
// @description     Removes the section titled "Sponsored" on the right side of Facebook in the messenger area
// @author          asheroto
// @license         MIT
// @icon            https://facebook.com/favicon.ico
// @match           https://www.facebook.com/
// @namespace       https://greasyfork.org/en/scripts/422348-facebook-block-sponsored-section-in-messenger
// @grant           GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/422348/Facebook%20Block%20Sponsored%20Section%20in%20Messenger.user.js
// @updateURL https://update.greasyfork.org/scripts/422348/Facebook%20Block%20Sponsored%20Section%20in%20Messenger.meta.js
// ==/UserScript==

// ==OpenUserScript==
// @author          asheroto
// ==/OpenUserScript==

/* jshint esversion: 6 */

(function () {
  let xpath = function (xpathToExecute) {
    let result = [];
    let nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
      result.push(nodesSnapshot.snapshotItem(i));
    }
    return result;
  };

  let thePath = "/html/body/div[1]/div/div[1]/div/div[5]/div/div/div[3]/div/div/div[1]/div[1]/div/div[2]/div/div/div[1]/div/div[1]/span";

  let runCount;
  let intv = 500; // Run every 0.5 seconds
  let intvEnd = 5000; // Clear after 5 seconds
  let go = setInterval(pollDOM, intv);

  function pollDOM() {
    runCount += intv; // Add intv value to runCount every time to count the amount of ms ran
    if (runCount >= intvEnd) {
      // Clear interval after intvEnd ms
      clearInterval(go);
    }

    try {
      if (xpath(thePath)[0].children[0].children.length) {
        xpath(thePath)[0].children[0].remove();
      }
    }
    catch (e) {}
  }
})();
