// ==UserScript==
// @name        TabClose
// @namespace   DCI
// @version     1.1
// @grant       none
// @match       https://www.mturk.com/mturk/preview?groupId=30B721SJLR5BYYBNQJ0CVKJEQOZ0OB* 
// @match       https://www.mturk.com/mturk/preview?groupId=3SI493PTSWRNV2K9KNV25SFBTCTDZ4* 
// @match       https://www.mturk.com/mturk/preview?groupId=3DXFGU9SKN2U70BZQM3ZWZUTL7VXEP*
// @match       https://www.mturk.com/mturk/preview?groupId=36FIWAXJH5545834T2EBIPRHNYVA3P*
// @match       https://www.mturk.com/mturk/preview?groupId=3EGG3WLVA0K75BCSXC8U46W9L5PIXX*
// @description x
// @downloadURL https://update.greasyfork.org/scripts/2551/TabClose.user.js
// @updateURL https://update.greasyfork.org/scripts/2551/TabClose.meta.js
// ==/UserScript==

var needles = new Array("Your results have been submitted","you have exceeded the maximum");

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