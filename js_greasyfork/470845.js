// ==UserScript==
// @name        XNXX Dark Theme
// @namespace   Violentmonkey Scripts
// @match       *://www.xnxx.com/*
// @include     *://www.xnxx.gold/*
// @grant       none
// @license     MIT
// @version     1.3.6
// @author      Capone
// @description XNXX Dark them.
// @icon        https://cdn3.iconfinder.com/data/icons/weather-575/64/Cloudstar-256.png
// @downloadURL https://update.greasyfork.org/scripts/470845/XNXX%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/470845/XNXX%20Dark%20Theme.meta.js
// ==/UserScript==


//Simple JQuery to convert the site to dark mode.
$("#content").css("background-color","#000017");
$("#site-nav,#header #site-nav ul,#listing-page-filters-block #filters-list,#mobile-categories #mobile-cat-list li a").css("background-color","#06063A");
$(".form-control,.btn-primary,#side-categories.side-cover,.side-categories-block.side-cover,.thumb-block .thumb-inside,#listing-page-filters-block button.filters-opener").css("background-color","#06063A");