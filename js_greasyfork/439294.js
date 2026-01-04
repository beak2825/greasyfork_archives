// ==UserScript==
// @name           Neopets Neopoints Link Fix
// @author         Rae
// @description    Clicking on your Neopoints should redirect you to your inventory, not the bank!
// @include        *neopets.com/*
// @version        0.1d
// @namespace      https://greasyfork.org/users/866507
// @icon           http://images.neopets.com/themes/h5/basic/images/np-icon.svg
// @require        https://code.jquery.com/jquery-3.6.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/439294/Neopets%20Neopoints%20Link%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/439294/Neopets%20Neopoints%20Link%20Fix.meta.js
// ==/UserScript==

var inv = '/inventory.phtml';
var $navsub = $("div.navsub-right__2020")

$(document).ready(function(){
    $navsub.find("a:first").attr("href", inv);
  }
)