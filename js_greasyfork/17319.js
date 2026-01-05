// ==UserScript==
// @name        Remove stupid signatures
// @namespace   https://greasyfork.org/en/users/28684
// @description Remove signatures of people you want, on Vultyc.com.
// @description Modify the code to add usernames in the usernames array, and those will be removed
// @include     http://vultyc.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17319/Remove%20stupid%20signatures.user.js
// @updateURL https://update.greasyfork.org/scripts/17319/Remove%20stupid%20signatures.meta.js
// ==/UserScript==
$(document).ready(function () {
  
  //var imageURL = "put your image's url here"; -> this is if anyone wants to 
  //just replace a signature with an image of their choosing, not yet implemented
  var usernames = ['username','any username','just add here'];
  
  for (var i = 0; i < usernames.length; i++)
{
    var username = usernames[i];
    $("span.largetext").find("strong:contains('"+username+"')").closest('div:contains(\'post\')').find('div.signature').remove();
}
});

