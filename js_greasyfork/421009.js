// ==UserScript==
// @name        Invidious Instance Switcher
// @namespace   Violentmonkey Scripts
// @match       https://invidious.snopyta.org/*
// @match       https://invidious.13ad.de/*
// @match       https://invidious.kavin.rocks/*
// @grant       none
// @version     1.1
// @author      BErnd14
// @description Adds a link with a random public Invidious alternative to easily switch Invidious instances.
// @downloadURL https://update.greasyfork.org/scripts/421009/Invidious%20Instance%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/421009/Invidious%20Instance%20Switcher.meta.js
// ==/UserScript==

var instances = ["https://invidious.snopyta.org", 
                 "https://invidious.13ad.de", 
                 "https://invidious.kavin.rocks"]; 


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


function getIndex(array) {
  for (var i = 0; i < instances.length; i++) {
    if (window.location.href.includes(instances[i])) {
      return i;
    }
  }
  return 0;
}

shuffleArray(instances);

var found_at_index = getIndex(instances);
var next_instance = (found_at_index + 1) % instances.length;


if (!window.location.pathname.includes("/embed/")) {
  
  var instance_switch = document.createElement("a");
  instance_switch.setAttribute('href', instances[next_instance] + window.location.pathname + window.location.search);
  instance_switch.innerHTML = "Next instance (" + instances[next_instance] + ")";
  document.body.prepend(instance_switch); 
  
}

