// ==UserScript==
// @name        Forecast.io – auto-show today’s outlook
// @namespace   roryokane.com
// @description Automatically expand the detailed forecast for today when visiting Forecast.io
// @include     http://forecast.io/
// @include     http://forecast.io/#*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4699/Forecastio%20%E2%80%93%20auto-show%20today%E2%80%99s%20outlook.user.js
// @updateURL https://update.greasyfork.org/scripts/4699/Forecastio%20%E2%80%93%20auto-show%20today%E2%80%99s%20outlook.meta.js
// ==/UserScript==


// jQuery waitUntilExists plugin
// copied directly from https://gist.githubusercontent.com/PizzaBrandon/5709010/raw/57edca8e8aba3954551397167039a049a572018c/jquery.waituntilexists.min.js
// for the unminified version, see https://gist.github.com/PizzaBrandon/5709010/e539a6f16c10465eb948b9ef6b0fe1d4c17a7c3e#file-jquery-waituntilexists-js
// Why include this inline instead of using @require? To satisfy [Greasy Fork’s policy](https://greasyfork.org/help/external-scripts).
// I can’t find this plugin or any equivalent on a whitelisted site, even though it fits Greasy Fork’s three criteria for external scripts.
// ========== START included plugin ==========
(function(e,f){var b={},g=function(a){b[a]&&(f.clearInterval(b[a]),b[a]=null)};e.fn.waitUntilExists=function(a,h,j){var c=this.selector,d=e(c),k=d.not(function(){return e(this).data("waitUntilExists.found")});"remove"===a?g(c):(k.each(a).data("waitUntilExists.found",!0),h&&d.length?g(c):j||(b[c]=f.setInterval(function(){d.waitUntilExists(a,h,!0)},500)));return d}})(jQuery,window);
// ========== END included plugin ==========


var todayPanelSelected = jQuery('#outlook .day.panel:first .top');
todayPanelSelected.waitUntilExists(function(matchIndex, todayPanel) {
	todayPanel.click();
});
