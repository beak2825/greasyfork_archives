// ==UserScript==
// @name        Fill YouTube Search Box
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @version     0.1
// @copyright   Copyright 2018 Jefferson Scher
// @license     BSD-3-Clause
// @description If YouTube search box is empty, check for query text in the page URL and fill it. v0.1 2018-09-16
// @match       https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/372264/Fill%20YouTube%20Search%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/372264/Fill%20YouTube%20Search%20Box.meta.js
// ==/UserScript==

function fillQuery(frmctrl){
  // Is there a query in the URL?
  if (location.search.indexOf('search_query=') < 1) return;
  // Fetch the parameters and create an array of them
  var parms = location.search.substr(1).split("&");
  var qtext = '';
  for (var j=0; j<parms.length; j++){
    if (parms[j].indexOf('search_query=') === 0) {
      // Grab what follows the = sign
      qtext = parms[j].split('=')[1];
      // Decode from URL-safe back to normal text
      qtext = decodeURIComponent(qtext);
      // Turn + back into a space
      qtext = qtext.replace(/\+/g, ' ');
      // We're done with the parms array
      break;
    }
  }
  // Stop if the query string is blank
  if (qtext.length < 1) return;
  // Insert query text into the search box
  frmctrl.value = qtext;
}

// Check for a blank search box and call function to fill it -- do we need to wait for any reason?
var ytsearchbox = document.querySelector('input#search');
if (ytsearchbox) {
  if (ytsearchbox.value == ''){
    fillQuery(ytsearchbox);
  } else {
    console.log('Fill YouTube Search Box says: search box isn\'t empty, so not messing');
  }
} else {
  // WTF, no search box?
  console.log('Fill YouTube Search Box says: no search box found on this page');
}
