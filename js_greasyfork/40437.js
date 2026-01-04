// ==UserScript==
// @name     defeat-bank-of-america-nag-elements
// @version  0.1.1
// @grant    
// @description removes annoying stuff from Bank of America when you're logged in
// @require https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @match https://*.bankofamerica.com/*
// @namespace https://greasyfork.org/users/178895
// @downloadURL https://update.greasyfork.org/scripts/40437/defeat-bank-of-america-nag-elements.user.js
// @updateURL https://update.greasyfork.org/scripts/40437/defeat-bank-of-america-nag-elements.meta.js
// ==/UserScript==

/**

When you're logged into the BofA, if you're running even the latest Firefox under the latest 
Ubuntu, you get a very annoying (and gratuitous) warning about your browser not being supported.
This removes the DOM element that contains that stuff.

I have also been getting nagged about updating my personal information, but when I try to
comply, they insist that I select my occupation from a dropdown menu all of whose options 
are so remote from what I actually do for a living, I just can't take it. It is simply too 
stupid. This takes care of that.

Of course, this will only work as long as their markup doesn't change enough to break this.

This is my GreaseMonkey/GreasyFork debut, and surely a naive effort. I wonder how, for example, 
you constrain this to run only on the applicable domain, so you don't waste resources when it doesn't 
apply. But I was too impatient to research it. Maybe next version.

Update: I think I now know the answer is @match

*/

 if (document.location.host == 'secure.bankofamerica.com') {
   
   console.debug("hey, welcome to the BofA (said the greasemonkey)");
   var browserBullshit = $("#browserUpgradeNoticeBar");
   if (browserBullshit.length) {   
     browserBullshit.remove();
     console.debug("removed annoyance: browser upgrade notice. :-)");     
   } else {
     console.debug("no stupid browser warning?");
   }
   var personalInfoNag = $(".critical-notification").first();
   if (
       personalInfoNag.length && 
     		personalInfoNag.text().indexOf("some time since you updated your personal information") > -1
     ) {    	 
     personalInfoNag.remove();
     console.debug("removed annoyance re updating your personal info. yay!");
   } else {
     console.debug("no stupid reminder to fill out a nonsensical form?");
   }
 }