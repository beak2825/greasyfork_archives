// ==UserScript==
// @name         counterfeit_blocker
// @namespace    nodelore.torn.easy-market
// @version      1.0
// @description  Block counterfeit in bazzar, for example, vic sold at 830k.
// @author       nodelore[2786679]
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479090/counterfeit_blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/479090/counterfeit_blocker.meta.js
// ==/UserScript==

(function () {
  "use strict";

  //================ Easy-market Configuration =======================
  const API = ""; // Insert your API here (PUBLIC level is fine)
  
  // Extend your block items here, just add item name
  const blockList = [
    "Vicodin", 
    "Box of Grenades", 
    "Mistletoe", 
    "Medium Suitcase"
  ];

  // You should also add threshold for the newly added item
  const blockThreshold = {
    "Vicodin": 2000,
    "Box of Grenades": 1500000,
    "Mistletoe": 1000000,
    "Medium Suitcase": 5000000,
  };

  // If the item price is over BLOCK_RATE * THRESHOLD, it would be blocked. You could change the default rate here.
  const BLOCK_RATE = 2.0
  //==================================================================

  if (window.COUNTERFEIT_BLOCKER) return;
  window.COUNTERFEIT_BLOCKER = true;

  const updateBlockThreshold = async ()=>{
    if(!API) return;
    const url = `https://api.torn.com/torn/?selections=items&key=${API}`;
    const resp = await fetch(url);
    if('error' in resp){
      console.error("Fail to fetch item from APIs");
      return;
    }
    const data = await resp.json();
    if(data && data.items){
      for(let item_id in data.items){
        const item_detail = data.items[item_id];
        const {name, market_value} = item_detail;
        if(blockList.indexOf(name) !== -1){
          const origThreshold = blockThreshold[name];
          if(market_value < origThreshold){
            blockThreshold[name] = market_value;
            console.log(`[Counterfeit-Blocker] Update market value of ${name} to ${market_value}`);
          }
        }
      }
    }
  }

  const pricePattern = /\$(\d{1,3}(?:,\d{3})*|\d{1,2})(?:\.\d+)?/;

  const blockCounterfeit = function (item) {
    const name = item.find("p[class^='name']").text();
    const priceText = item.find("p[class^='price']").text().trim();
    const match = pricePattern.exec(priceText);
    if (name !== "" && match) {
      const matchPrice = match[1];
      const stringWithoutCommas = matchPrice.replace(/,/g, "");
      const priceValue = parseInt(stringWithoutCommas, 10);
      if (blockThreshold[name]) {
        if (priceValue > blockThreshold[name]*BLOCK_RATE) {
          console.log(
            `[Counterfeit-Blocker] Detect counterfeid ${name} with price ${priceValue}, block`
          );
          item.hide();
        }
      }
    }
  };

  updateBlockThreshold().then(()=>{
    waitForKeyElements("div[class^='itemDescription']", blockCounterfeit);
  });
})();

function waitForKeyElements(
  selectorTxt,
  actionFunction,
  bWaitOnce,
  iframeSelector
) {
  var targetNodes, btargetsFound;
  if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
  else targetNodes = $(iframeSelector).contents().find(selectorTxt);

  if (targetNodes && targetNodes.length > 0) {
    btargetsFound = true;
    /*--- Found target node(s).  Go through each and act if they
          are new.
      */
    targetNodes.each(function () {
      var jThis = $(this);
      var alreadyFound = jThis.data("alreadyFound") || false;

      if (!alreadyFound) {
        //--- Call the payload function.
        var cancelFound = actionFunction(jThis);
        if (cancelFound) btargetsFound = false;
        else jThis.data("alreadyFound", true);
      }
    });
  } else {
    btargetsFound = false;
  }

  //--- Get the timer-control variable for this selector.
  var controlObj = waitForKeyElements.controlObj || {};
  var controlKey = selectorTxt.replace(/[^\w]/g, "_");
  var timeControl = controlObj[controlKey];

  //--- Now set or clear the timer as appropriate.
  if (btargetsFound && bWaitOnce && timeControl) {
    //--- The only condition where we need to clear the timer.
    clearInterval(timeControl);
    delete controlObj[controlKey];
  } else {
    //--- Set a timer, if needed.
    if (!timeControl) {
      timeControl = setInterval(function () {
        waitForKeyElements(
          selectorTxt,
          actionFunction,
          bWaitOnce,
          iframeSelector
        );
      }, 300);
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}
