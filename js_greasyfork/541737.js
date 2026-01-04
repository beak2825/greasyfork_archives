// ==UserScript==
// @name        DropBox Download Continue Clicker
// @namespace   Violentmonkey Scripts
// @match       *://*.dropbox.com/*
// @grant       none
// @version     1.0
// @author      Leak
// @description Clicks the "Or continue with download only" and/or "Close" buttons on DropBox's sign-in nag dialogs
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541737/DropBox%20Download%20Continue%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/541737/DropBox%20Download%20Continue%20Clicker.meta.js
// ==/UserScript==

(function() {
  function mutated(records){
    const button = [...document.querySelectorAll("button[data-dig-button=true]")]
      .find(x =>
        x.innerText === "Or continue with download only" ||
        x.innerText === "Close");

    if (button)
      button.click();
  }

  const observer = new MutationObserver(mutated);
  observer.observe(document.body, { subtree: true, childList: true });
})()