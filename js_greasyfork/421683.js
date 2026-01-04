// ==UserScript==
// @name        Habitica Dismiss Alerts
// @description Automatically dismisses alerts.
// @author      TwentyPorts
// @license     MIT
// @version     1
// @include     https://habitica.com/*
// @namespace https://greasyfork.org/users/737264
// @downloadURL https://update.greasyfork.org/scripts/421683/Habitica%20Dismiss%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/421683/Habitica%20Dismiss%20Alerts.meta.js
// ==/UserScript==

let callback = function (mutationList, observer) {
        //console.log("called callback");
        
        const dismissButton = document.querySelector("div.modal-footer > .btn-primary");
        if(dismissButton !== null) {
          console.log("found button");
          dismissButton.click();
          document.querySelector("body").style.overflow = "visible"; // enables scrollbar, otherwise you'll have to refresh after this script clicks a button
          observer.disconnect();
        }
}

// Setup a MutationObserver to watch the document for the nodes we need.
let targetNode = document.querySelector('body');
let observerConfig = {
  childList: true,
  subtree: true,
};
let observer = new MutationObserver(callback);
observer.observe(targetNode, observerConfig);