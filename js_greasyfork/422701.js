// ==UserScript==
// @name        New York Times: Press "View Full Article"
// @namespace   https://dbmiller.org/user.js/nyt-view-full.user.js
// @match       *://*.nytimes.com/*
// @grant       none
// @version     1.2
// @run-at      document-idle
// @author      -
// @description 3/5/2021, 2:52:09 AM
// @downloadURL https://update.greasyfork.org/scripts/422701/New%20York%20Times%3A%20Press%20%22View%20Full%20Article%22.user.js
// @updateURL https://update.greasyfork.org/scripts/422701/New%20York%20Times%3A%20Press%20%22View%20Full%20Article%22.meta.js
// ==/UserScript==

function contains(selector, text) {
  var elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, function(element){
    return RegExp(text).test(element.textContent);
  });
}

function start(counter){
  if(counter < 20){
    setTimeout(function(){
      counter++;
      contains('button','Show Full Article')[0].click();
      start(counter);
    }, 1000);
  }
}
start(0);

