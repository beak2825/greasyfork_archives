// ==UserScript==
// @name        SpecialZee
// @namespace   SpecialZee
// @description Specials Map HotLink
// @include     https://www.munzee.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14409/SpecialZee.user.js
// @updateURL https://update.greasyfork.org/scripts/14409/SpecialZee.meta.js
// ==/UserScript==
// Top menu
$('.navbar-right').append(' <li class="nav-short tooltip-helper" data-toggle="tooltip" data-placement="bottom" title="Specials"><a href="/specials/"><i class="fa fa-drupal"></i><span class="visible-xs">Specials</span></a></li>');
// EOF Top menu