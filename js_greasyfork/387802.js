// ==UserScript==
// @name            Remove Amazon Recommendations
// @author          Anonymous
// @namespace       https://greasyfork.org/en/scripts/387802-remove-amazon-recommendations
// @description     Eliminates all of the "useless crap" (as defined by me) on the Amazon homepage
// @version	    0.4
// @include         https://www.amazon.com/*
// @license         Creative Commons Attribution License
// @downloadURL https://update.greasyfork.org/scripts/387802/Remove%20Amazon%20Recommendations.user.js
// @updateURL https://update.greasyfork.org/scripts/387802/Remove%20Amazon%20Recommendations.meta.js
// ==/UserScript==
 
var crapFrames = [ "gw-layout", "desktop-grid-1", "desktop-grid-2", "desktop-grid-3", "gw-content-grid", "rhf-context", "desktop-ad-btf", "desktop-grid-1-D1", "desktop-grid-1-D2", "gw-desktop-herotator", "nav-swmslot", "gwm-Deck", "gwm-CardLoadingIndicator" ];
var crapClasses = [ "gwm-RecommendationsText gwm-u-blackjack-typography" ];
for (var i=0;i<crapFrames.length;i++) {
   var crapFrame = document.getElementById(crapFrames[i]);
   if (crapFrame) {
       crapFrame.parentNode.removeChild(crapFrame);
   }
}

for (var i=0;i<crapClasses.length;i++) {
   var crapClass = document.getElementsByClassName(crapClasses[i]);
   if (crapClass) {
       crapClass.parentNode.removeChild(crapClass);
   }
}
