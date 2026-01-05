// ==UserScript==
// @name TW-FixMyWindowTitles
// @version 0.03
// @description The West Script: Fixes the current mess with window titles on zz2
// @author Bluep
// @grant none
// @include http://w2.public.beta.the-west.net/game.php*
// @namespace https://greasyfork.org/users/2382
// @downloadURL https://update.greasyfork.org/scripts/4697/TW-FixMyWindowTitles.user.js
// @updateURL https://update.greasyfork.org/scripts/4697/TW-FixMyWindowTitles.meta.js
// ==/UserScript==

jQuery(function($) {
    $("head").append($('<style type="text/css">').text(".tw2gui_win2 div.tw2gui_inner_window_title {z-index:2!important}"))
});