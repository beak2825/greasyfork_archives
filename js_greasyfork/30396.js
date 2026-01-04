// ==UserScript==
// @name        Super fix for Bottols Display
// @namespace   AbbraCaddabra
// @description Eliminate Ads and Shift screen
// @copyright	Christopher Peter, The Toga, Your Virmship
// @include     *apps.facebook.com/gloryofrome/*
// @inlcude     *https://www.facebook.com/gloryofromegame
// @include     *gloryofrome.com/*
// @include     *https://ryrome1-a.akamaihd.net/*
// @include     *https://fb0.gloryofrome.com/
// @version     1
// @grant       GM_addStyle
// @include     *static.xx.fbcdn.net/rsrc.php/*
// @downloadURL https://update.greasyfork.org/scripts/30396/Super%20fix%20for%20Bottols%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/30396/Super%20fix%20for%20Bottols%20Display.meta.js
// ==/UserScript==

GM_addStyle("._2pi9 { display: none;}"); // eliminate facebook games toolbar
GM_addStyle("._4n06.center_fixed_width_app #pagelet_canvas_content { max-width: 2000px;}");//set true width after clearfix
