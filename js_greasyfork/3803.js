// ==UserScript==
// @name        Remove Halifax Offers
// @namespace   http://jamie-thompson.co.uk
// @description Removes crap plastered over the page
// @include     https://secure.halifax-online.co.uk/personal/a/account_overview_personal/
// @Require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant       none
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/3803/Remove%20Halifax%20Offers.user.js
// @updateURL https://update.greasyfork.org/scripts/3803/Remove%20Halifax%20Offers.meta.js
// ==/UserScript==
$(".yourOffers").parent().hide();
$(".productPromo").hide();
$(".clearfix .webTrends").parent().parent().hide();