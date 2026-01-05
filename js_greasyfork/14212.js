// ==UserScript==
// @name        Append OneForum to tech sites
// @description Appends OneForum link to tech site navbars
// @namespace   appendmattertofecal
// @include     http://www.winbeta.org/*
// @include     http://www.pcworld.com/*
// @include     http://www.neowin.net/*
// @include     http://www.windowscentral.com/*
// @include     https://www.thurrott.com/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14212/Append%20OneForum%20to%20tech%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/14212/Append%20OneForum%20to%20tech%20sites.meta.js
// ==/UserScript==

$("ul#menu-topbar").append("<li id='menu-item-one'><a href='http://tinyurl.com/14mwinB'>1Forum </a></li>");
$("ul#panel-nav").append("<li class='oneforNav'><a id='oneforNav' href='http://tinyurl.com/14mwinB'>1Forum </a></li>");
$("ul.nav-menu").append("<li class='nav-item-onefor'><a id='oneforNav' href='http://tinyurl.com/14mwinB'>1Forum </a></li>");
$("#header-navigation-right ul li.forums").before("<li><a href='http://tinyurl.com/14mwinB'>1F</a></li>");
$("nav#tab-nav .menu-list").append("<li id='menu-item-lambda' class='menu-item menu-item-type-custom menu-item-object-custom current-menu-item current_page_item menu-item-home' style='display:inline'><a href='http://tinyurl.com/14mwinB' style='font-family:Open Sans'>1Forum</a></li>");