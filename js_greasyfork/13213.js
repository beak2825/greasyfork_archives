// ==UserScript==
// @name        ayuwage_sub_openAdlink
// @description www.ayuwage.com - sub - click open link Ad
// @namespace   *
// @version      0.1
// @include     *upvotesearch*
// @include *todayreads*
// @include *todaysreads*
// @include *readnmark*
// @include *pindatread*
// @include *toponlinesource*
// @include *nyaasearch*
// @include *helpticle*


// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13213/ayuwage_sub_openAdlink.user.js
// @updateURL https://update.greasyfork.org/scripts/13213/ayuwage_sub_openAdlink.meta.js
// ==/UserScript==
function doText() {
   document.links[0].click();

}
function closeTab() {
  self.close();
}
var myInterval = setInterval(doText, 500);
var myInterval = setInterval(closeTab, 50000);
