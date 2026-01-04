// ==UserScript==
// @name        Nitter Instance Switcher
// @namespace   Violentmonkey Scripts
// @match       https://nitter.snopyta.org/*
// @match       https://nitter.net/*
// @match       https://nitter.13ad.de/*
// @match       https://nitter.kavin.rocks/*
// @match       https://nitter.cc/*
// @match       https://nitter.eu/*
// @grant       none
// @version     1.0
// @author      BErnd14
// @description Adds a link with a random public Nitter alternative to easily switch Nitter instances.
// @downloadURL https://update.greasyfork.org/scripts/421011/Nitter%20Instance%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/421011/Nitter%20Instance%20Switcher.meta.js
// ==/UserScript==

var instances = ["https://nitter.snopyta.org", 
                 "https://nitter.net",
                 "https://nitter.13ad.de",
                 "https://nitter.kavin.rocks",
                 "https://nitter.cc",
                 "https://nitter.eu"]; 


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
  
var instance_switch = document.createElement("a");
instance_switch.setAttribute('href', instances[next_instance] + window.location.pathname + window.location.search);
instance_switch.innerHTML = "Next instance (" + instances[next_instance] + ")";
document.getElementsByTagName("nav")[0].prepend(instance_switch); 


