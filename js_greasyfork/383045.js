// ==UserScript==
// @name         Kill Twitter Interests
// @version      0.1
// @description  Unchecks all of Twitter's infered interests when you go to that page in you account settings. You need to manually click save.
// @author       Ryan Castellucci @ryancdotorg
// @namespace    Violentmonkey Scripts
// @match        https://twitter.com/settings/your_twitter_data/twitter_interests
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383045/Kill%20Twitter%20Interests.user.js
// @updateURL https://update.greasyfork.org/scripts/383045/Kill%20Twitter%20Interests.meta.js
// ==/UserScript==

(function(){
  var h = 0, timeout = Date.now() + 15000, a = function(){
    document.querySelectorAll(".interest-label>input:checked").forEach(function(e){h=1;e.checked=0;});
    if (!h) setTimeout(a, 100);
  };
  a();
})();