// ==UserScript==
// @name          wv_no_ads
// @description   Removes ads from WizardValley site
// @namespace     bon
// @include       http://www.wizardsvalley.ru/*
// @require				https://code.jquery.com/jquery-3.2.1.min.js
// @version 0.0.1.20171225111244
// @downloadURL https://update.greasyfork.org/scripts/36694/wv_no_ads.user.js
// @updateURL https://update.greasyfork.org/scripts/36694/wv_no_ads.meta.js
// ==/UserScript==

var ad = $('div[id^=wprdv]');
ad.remove();