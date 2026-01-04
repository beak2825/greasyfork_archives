// ==UserScript==
// @name         Twitter cleaner
// @namespace    http://www.emilioveois.com
// @description  Removes the Twitter sidebar and shortens longer tweets.
// @include      https://twitter.com/*
// @grant        none
// @version      0.2
// @downloadURL https://update.greasyfork.org/scripts/442028/Twitter%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/442028/Twitter%20cleaner.meta.js
// ==/UserScript==

window.addEventListener('load', function() {

setInterval(function() { 
    
  function disable() {
    document.querySelectorAll('[aria-label="Communities"]')[0].style.display='none';
    document.querySelectorAll('[aria-label="Tweet"]')[0].style.display='none';
    document.querySelectorAll('[data-testid="sidebarColumn"]')[0].style.display='none';
  }
  disable();
  
  function truncateString(str, num) {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  }
  function shortener() {
    nodes = document.querySelectorAll('[data-testid="tweetText"] span');
    for (i = 0; i < nodes.length; i++) {
      tweetText = nodes[i].innerText;
      nodes[i].textContent = truncateString(tweetText, 280);
    }
  }
  shortener();
  
}, 8000);
  
}, false);