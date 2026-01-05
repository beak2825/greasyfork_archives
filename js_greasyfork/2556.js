// ==UserScript==
// @name        VQ Tab Close
// @namespace   DCI
// @include     https://www.mturk.com/mturk/submit
// @version     1
// @grant       none
// @description x
// @downloadURL https://update.greasyfork.org/scripts/2556/VQ%20Tab%20Close.user.js
// @updateURL https://update.greasyfork.org/scripts/2556/VQ%20Tab%20Close.meta.js
// ==/UserScript==

var needles = new Array("Your results have been submitted to Venue Quality","you have exceeded the maximum");

var haystack = document.body.innerHTML;

var my_pattern, my_matches, found = "";
for (var i=0; i<needles.length; i++){
  my_pattern = eval("/" + needles[i] + "/gi");
  my_matches = haystack.match(my_pattern);
  if (my_matches){
    found += "\n" + my_matches.length + " found for " + needles[i]; 
  }
}

if (found != "") 
    {
window.close()
    }