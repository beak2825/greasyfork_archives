// ==UserScript==
// @name        Marktplaats - Reloaded
// @namespace   Waldema
// @description Removes all unwanted crap from Marktplaats.nl
// @include     *.marktplaats.*
// @version     2015.0.2
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/10517/Marktplaats%20-%20Reloaded.user.js
// @updateURL https://update.greasyfork.org/scripts/10517/Marktplaats%20-%20Reloaded.meta.js
// ==/UserScript==

// remove cookie notice footer (black bar at bottom)
var CookieFoetsie = document.getElementById('layover-target');
CookieFoetsie.parentElement.removeChild(CookieFoetsie);

//removes adsense-block / google crap
$('div.adsense-block').remove();

// Remove banner-rubrieks and other banners
$('.inline-listings-banner').remove();
$('#banner-mr').remove();
$('#banner-top').remove();
$('#banner-bottom').remove();
$('.smart-banner').remove();

// Removes 'Andere bekeken' crap
$('.cas-other-items').remove();