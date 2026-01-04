// ==UserScript==
// @name     Craigslist Search Hide All
// @namespace   technote.fyi
// @description Trash all the listings on this page.
// @include     https://*.craigslist.org/search/*
// @version     1
// @grant       none	
// @require https://code.jquery.com/jquery-3.5.1.slim.min.js 
// @downloadURL https://update.greasyfork.org/scripts/423272/Craigslist%20Search%20Hide%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/423272/Craigslist%20Search%20Hide%20All.meta.js
// ==/UserScript==

/* <span class="price"><div class="ink-wrapper" title="">19,999.99 <span class="ink-unit">PTS</span></div></span> */
var hideall = jQuery('<button>hide all</button>');
hideall.on("click", function() {
  // remove any nearby recommendation that show up when you search
  jQuery('.nearby ~ .result-row').remove();
  
  // hide all the results
  jQuery('.banish').each(function(index, elem) {
      jQuery(this).click();
  });
  
  // reload the page 
  var url = window.location + '';
  window.location = url.replace( /query=.+/, 'query=' );
});

jQuery('.userlinks').append(hideall);