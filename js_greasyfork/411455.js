// ==UserScript==
// @name         Reddit Remove Ads
// @version      0.1
// @description  Remove promoted links on reddit
// @include      http://*.reddit.com/*
// @include      https://*.reddit.com/*
// @author       tlacuache
// @namespace https://greasyfork.org/users/688118
// @downloadURL https://update.greasyfork.org/scripts/411455/Reddit%20Remove%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/411455/Reddit%20Remove%20Ads.meta.js
// ==/UserScript==

$('#siteTable_organic').remove();
$('#ad-frame').remove();
$('#ad_main').remove();
$('.goldvertisement').remove();