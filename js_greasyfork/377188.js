// ==UserScript==
// @name		FER2.net Preddiplomski
// @description Puts Preddiplomski tab active on load
// @run-at document-start
// @include http://www.fer2.net*
// @include https://www.fer2.net*
// @version  1
// @grant    none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js 
// @namespace https://greasyfork.org/users/237220
// @downloadURL https://update.greasyfork.org/scripts/377188/FER2net%20Preddiplomski.user.js
// @updateURL https://update.greasyfork.org/scripts/377188/FER2net%20Preddiplomski.meta.js
// ==/UserScript==


$( document).ready(function () {
  var tabs = document.getElementsByClassName("tabs mainTabs Tabs")[0];
  tabs.children[1].firstChild.click();
});
