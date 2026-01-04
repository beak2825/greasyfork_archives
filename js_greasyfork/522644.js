// ==UserScript==
// @name        Stripchat Live Model Search
// @namespace   ""
// @match       https://*stripchat.com/search/models/*
// @match       https://*xhamsterlive.com/search/models/*
// @grant       none
// @version     1.1
// @author      zipperguy
// @license     MIT
// @description Limits Stripchat's model search to live models. Also sorts results by model name.
// @downloadURL https://update.greasyfork.org/scripts/522644/Stripchat%20Live%20Model%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/522644/Stripchat%20Live%20Model%20Search.meta.js
// ==/UserScript==

// Wait for specific DOM elements, abandoning the wait
// after the specified timeout period
function waitForElementToExist(selector, timeout) {
   return new Promise((resolve, reject) => {
      let found = false;

      const observer = new MutationObserver(() => {
         if (document.querySelector(selector)) {
            found = true;
            resolve(document.querySelector(selector));
            observer.disconnect();
         }
      });

      // If the element already exists, return immediately
      if (document.querySelector(selector)) {
         return resolve(document.querySelector(selector));
      }

      window.setTimeout(() => {
         if (!found) {
            reject("Timeout waiting for: " + selector);
            observer.disconnect();
         }
      }, timeout)

      observer.observe(document.body, {
         subtree: true,
         childList: true,
      });
   });
}

// Wait for the model list to load, then filter out the live models
waitForElementToExist(".model-list", 3000).then(element => {
   const model_list = document.querySelectorAll(".model-list");
   models = Array.from(model_list[0].children);

   // Sort the models in reverse alphabetical order. The order will be
   // reversed when live models are identified.
   models.sort(function(a, b) {
      a_href = a.querySelector("a").getAttribute("href");
      b_href = b.querySelector("a").getAttribute("href");
     return -a_href.localeCompare(b_href);
   });

   // Find the live models and add them to the list. This will reverse
   // the order of the models list. 
   live_models = document.createDocumentFragment();
   for (var i = (models.length - 1) ; i >= 0; i--) {
       if (models[i].getElementsByClassName("model-list-item-live").length > 0) {
          live_models.appendChild(models[i])
       }
   }

   // Create an HTML element with the live models
   live_list = document.createElement("section");
   live_list.className = "model-list";
   live_list.appendChild(live_models);

   // Replace the search result with the live models
   model_list[0].parentNode.replaceChild(live_list, model_list[0]);
});