// ==UserScript==
// @name     			Reddit Hide Promoted Ads
// @description 	This script will hide the ads from reddit every 5 seconds. It is set in an interval to work with reddits "infinite" scroll version of the site.
// @version  			1.0
// @namespace			redditadblock
// @grant    			none
// @match        	https://www.reddit.com/*
// @license				GPL
// @downloadURL https://update.greasyfork.org/scripts/473665/Reddit%20Hide%20Promoted%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/473665/Reddit%20Hide%20Promoted%20Ads.meta.js
// ==/UserScript==

(function() {
    updateAdblock();
    
  function updateAdblock(){
      var span = document.getElementsByTagName("span");
    console.log("Searching for ads...");
    for (var i=0; i < span.length; i++)
    {

      if(span[i].innerHTML == "promoted")
      {
        console.log("Deleted ad.");

        span[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display  = 'none';

      }
    }

  }

	setInterval(updateAdblock, 5000);
  
})();