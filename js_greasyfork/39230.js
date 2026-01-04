// ==UserScript==
// @name        DN.se Paywall
// @description Hides the DN.se paywall and shows the premium content
// @version     0.1
// @@author     Brosk Menmi
// @include     https://www.dn.se/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       none
// @namespace https://greasyfork.org/users/173571
// @downloadURL https://update.greasyfork.org/scripts/39230/DNse%20Paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/39230/DNse%20Paywall.meta.js
// ==/UserScript==

$(".paywall-content").hide();
$(".article__premium-content").show();