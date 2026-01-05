// ==UserScript==
// @name        revadburst - autoclose Ad
// @namespace   *
// @include     *revadburst.com/directory_view.php?i=*
// @include     *http://revadburst.com/ptc_view.php?i=*
// @description revadburst -subpage - autoclose Ad
// @namespace   *
// @version     0.11
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13218/revadburst%20-%20autoclose%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/13218/revadburst%20-%20autoclose%20Ad.meta.js
// ==/UserScript==
function doText() {
  var links = document.links;
  for (var i = 0; i < links.length; i++) {
    links[i].click();
  }
}
function closeTab() {
  self.close();
}
//var myInterval = setInterval(doText, 2000);


var myInterval = setInterval(closeTab, 30000);
