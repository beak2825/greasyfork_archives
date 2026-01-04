// ==UserScript==
// @name         RemoveBlockedMessages
// @version      1.1.1
// @description  Get rid of blocked messages.
// @author       keanuplayz
// @license      Apache-2.0
// @match        https://discordapp.com/*
// @match        https://discord.com/*
// @grant        none
// @namespace https://greasyfork.org/users/671330
// @require https://greasyfork.org/scripts/407905-loggerjs/code/LoggerJS.js?version=831993
// @downloadURL https://update.greasyfork.org/scripts/407896/RemoveBlockedMessages.user.js
// @updateURL https://update.greasyfork.org/scripts/407896/RemoveBlockedMessages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Our `blockedlist` variable contains all elements with class `blockedSystemMessage`.
    var blockedMessages = document.querySelectorAll("div[class^='blockedSystemMessage']");

    // We simply set every blocked message's CSS `display` attribute to none, so they go invisible.
    blockedMessages.forEach(function(elem) { elem.parentElement.parentElement.style.display="none" });

    // Next, we use the `MutationObserver` Web API to watch for changes being made to the DOM tree.
    // Why do we do this? Say there are four blocked messages on-screen when the page loads.
    // These are removed by the above code, but what happens when a *new* blocked message is received?
    // Absolutely nothing. Which is why we need to continuously watch for changes being made, so we can block new blocked messages.
    var mutationObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach( function(currentValue, currentIndex, listObj) {
              if (currentValue.nodeType == Node.ELEMENT_NODE) {
                  // Once again, we select the blocked messages:
                  var blockedMessages = currentValue.querySelectorAll("div[class^='blockedSystemMessage']");
                  var spacer = currentValue.querySelectorAll("div[class^='groupStart']");
                  // And set their `display` to none.
                  blockedMessages.forEach(function(elem) {
                      elem.parentElement.parentElement.style.display="none"; logger("Hid blocked messages.", "log");
                  });
                  spacer.forEach(function(elem) {
                      elem.style.display="none"; logger("Hid spacers.", "log");
                  });
              }
          });
      });
  });

  // Here we tell the `mutationObserver` to start watching for changes made to the DOM tree.
  mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
  });
})();