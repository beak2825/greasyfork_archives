// ==UserScript==
// @name        Linkedin-Addon
// @namespace   bitbucket.org/Odahviing
// @include     https://www.linkedin.com/people*
// @description Basic version of linkedin add people clicker
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19722/Linkedin-Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/19722/Linkedin-Addon.meta.js
// ==/UserScript==

// Version 1.0 - Simple Linkedin clicker to add people, 13 people each 8 seconds, waiting for requests

var allButtons = document.getElementsByClassName('bt-request-buffed buffed-blue-bkg-1'); // Each item
for (var index = 0 ; index < allButtons.length; index++)
{
   setTimeout(
     doAction.bind(null, allButtons[index]), (index+1) * 500); // 13 Items == 14 * 500 For the last one == 7 Sec per page
}

setTimeout(function(){location.reload();}, 8000); // Refresh on 8 seconds

function doAction(ele){ele.click();} // Click

