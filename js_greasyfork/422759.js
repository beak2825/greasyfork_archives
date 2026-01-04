// ==UserScript==
// @name        Autoskip Prime Trailers
// @namespace   Violentmonkey Scripts
// @match       https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/
// @grant       none
// @version     1.3
// @author      -
// @description 3/5/2021, 11:13:26 PM
// @match       https://www.amazon.com/gp/product/*
// @match       https://www.amazon.com/gp/video/*
// @downloadURL https://update.greasyfork.org/scripts/422759/Autoskip%20Prime%20Trailers.user.js
// @updateURL https://update.greasyfork.org/scripts/422759/Autoskip%20Prime%20Trailers.meta.js
// ==/UserScript==

const INTERVAL_MAX_ATTEMPTS = 120; // When triggered, the seekSkipButton method will run a maximum of 120 times before stopping 
const INTERVAL_WAIT_DURATION = 500; // when triggered, the seekSkipButton method will wait half a second in between each execution

let skipButtonInterval;
let intervalCurrentAttempts = 0;

let seekSkipButton = function() {
  intervalCurrentAttempts++;
  let xpath = "//div[text()='Skip']";
  let skipButton = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE, null).singleNodeValue;
  if (skipButton != null) {
    console.log("Skipping the ad lol.");
    skipButton.click();
    clearInterval(skipButtonInterval);
  }
  if (intervalCurrentAttempts >= INTERVAL_MAX_ATTEMPTS) {
    clearInterval(skipButtonInterval);
  }
}

const observer = new MutationObserver(function(mutationList) {
  console.log("mutations have been observed");
  for (let mutation of mutationList) {
    if (mutation.addedNodes.length == 0) {
      return;
    }
    for (let elem in mutation.addedNodes) {
      if (elem instanceof HTMLElement && elem.classList.contains("webPlayerUIContainer")) {
        intervalCurrentAttempts = 0;
        skipButtonInterval = setInterval(seekSkipButton, 500);
        return;
      }
    }
  }
});

console.log("We are listening");
observer.observe(document, {childList: true, subtree: true});