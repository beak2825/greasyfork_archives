// ==UserScript==
// @name         Remove PNL value.
// @namespace    https://www.binance.com/
// @version      0.2
// @description  Removes the PNL value to prevent emotional trading.
// @author       @Pierre_Le_Guen
// @match        https://www.binance.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421383/Remove%20PNL%20value.user.js
// @updateURL https://update.greasyfork.org/scripts/421383/Remove%20PNL%20value.meta.js
// ==/UserScript==

const checkElement = async selector => {
  while ( document.querySelector(selector) === null) {
    await new Promise( resolve => requestAnimationFrame(resolve) )
  }
  return document.querySelector(selector);
};

(function() {
    'use strict';

    console.log("Remove PNL value v0.1 - MOON or DOOM");

    checkElement('.pnl').then((selector) => {
        var config = { attributes: true, childList: true, characterData: true, subtree: true };

        var callback = function(mutationsList) {
            if (mutationsList[0].target.textContent.includes("-")) {
                selector.firstChild.innerHTML = "";
            } else if(selector.firstChild.innerHTML != "TO THE MOON" && selector.firstChild.innerHTML != "") {
                selector.firstChild.innerHTML = "TO THE MOON";
            }
        };
        var observer = new MutationObserver(callback);
        observer.observe(selector, config);
    });
})();