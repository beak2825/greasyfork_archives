// ==UserScript==
// @name        Marktplaats Opschoner
// @namespace   CookieFoetsie
// @include     http://www.marktplaats.*/*
// @grant       none
// @version     1.10
// @description Cleans up marktplaats.nl (Topadvertenties, Adsense, Admarkt, cookie notice)
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/2132/Marktplaats%20Opschoner.user.js
// @updateURL https://update.greasyfork.org/scripts/2132/Marktplaats%20Opschoner.meta.js
// ==/UserScript==

// remove cookie notice footer (black bar at bottom)
var CookieFoetsie = document.getElementById('layover-target');
CookieFoetsie.parentElement.removeChild(CookieFoetsie);

// Remove 'Topadvertenties' (by pettenstein - jquery)
$("span.mp-listing-priority-product:contains('Topadvertentie')").parent().parent().parent().remove();
$("td.inline-listings-banner").parent().remove();

// Remove Admarkt zut
$("#bottom-listings-divider").remove();
$("tr.bottom-listing").remove();
$("#adsense-top.adsense-block").remove();
$("#adsense-bottom.adsense-block").remove();
$("div.row.bottom-group-1.search-result.bottom-listing.listing-cas").remove();
$("div.row.bottom-group-0.search-result.bottom-listing.listing-cas").remove();
$("div.mp-adsense-header-top").remove();
$("#superCasContainerTop.adsense-csa").remove();

// Remove stupid saved searches widget
$("#saved-searches-widget.saved-searches-widget").remove();

// Remove ads with "gezocht"
$("span.mp-listing-title.wrapped:contains('Gezocht')").parent().parent().parent().parent().parent().remove();
$("div.listing-title-description:contains('Gezocht')").parent().parent().parent().remove();

// Remove ads with "Heel Nederland"
$("div.location-name:contains('Heel Nederland')").parent().parent().parent().parent().remove();

// Remove ads with thumbs-up icon
$("span.icon-thumb-up").parent().parent().parent().remove();

// Remove "Ook van deze adverteerder" junk
$("TR.search-result.horizontalRichSnippet.group-0").remove();
$("TR.search-result.horizontalRichSnippet.group-1").remove();
$("TR.horizontal-extended-listing.group-0").remove();
$("TR.horizontal-extended-listing.group-1").remove();
$("div.listing-extension").remove();

// Remove useless "Anderen Bekeken"
var SimilarFoetsie = document.getElementById('vip-right-cas-listings');
SimilarFoetsie.parentElement.removeChild(SimilarFoetsie);