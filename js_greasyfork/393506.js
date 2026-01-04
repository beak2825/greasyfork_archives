// ==UserScript==
// @name         Mixer Sparks Monitor
// @namespace    http://tampermonkey.net/
// @version      0.442
// @description  Monitors Spark Earnings
// @author       Karizmatik
// @match        mixer.com/ConcealedBones
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393506/Mixer%20Sparks%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/393506/Mixer%20Sparks%20Monitor.meta.js
// ==/UserScript==
// target element that we will observe
const target = document.getElementsByClassName("spark-count")[0];

// config object
const config = {
  attributes: true,
  attributeOldValue: true,
  characterData: true,
  characterDataOldValue: true,
  childList: true,
  subtree: true
};

// subscriber function
function subscriber(mutations) {
  mutations.forEach((mutation) => {
    // handle mutations here
    console.log(mutation);
  });
}

// instantiating observer
const observer = new MutationObserver(subscriber);

// observing target
observer.observe(target, config);