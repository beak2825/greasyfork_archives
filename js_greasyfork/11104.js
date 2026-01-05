// ==UserScript==
// @name          TwitterGreyBackground
// @namespace     http://www.slintes.net/greasemonkey/
// @description   grey background for twitter
// @description   use this add-on on firefox: https://addons.mozilla.org/firefox/addon/748
// @description   works natively on chrome, but I recommend this extension: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
// @author        Marc Sluiter
// @copyright     2015 Marc Sluiter
// @license       Apache License, Version 2.0, see https://github.com/slintes/userscripts/blob/master/LICENSE
// @include       https://mobile.twitter.com/*
// @include       https://twitter.com/*
// @version 0.0.5
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/11104/TwitterGreyBackground.user.js
// @updateURL https://update.greasyfork.org/scripts/11104/TwitterGreyBackground.meta.js
// ==/UserScript==

var bgcolor = "#333";
var cardbgcolor = "#FFFFFF";

GM_addStyle("body { background-color:" + bgcolor + ";}");
GM_addStyle(".TwitterCard { background-color:" + cardbgcolor + ";}");
GM_addStyle("section[role=\"region\"] { background-color:" + cardbgcolor + ";}");
