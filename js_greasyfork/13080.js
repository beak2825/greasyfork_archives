// ==UserScript==
// @name           remove overscroll
// @namespace      boeckogrease
// @description    Disables the overscroll to homepage feature on spiegel.de and sueddeutsche.de
// @author         boecko
// @version        0.1
// @license        GPLv2
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @include        http://www.spiegel.de/*
// @include        http://www.sueddeutsche.de/*
// @downloadURL https://update.greasyfork.org/scripts/13080/remove%20overscroll.user.js
// @updateURL https://update.greasyfork.org/scripts/13080/remove%20overscroll.meta.js
// ==/UserScript==
jQuery.noConflict();

var removeScroller = function () {
	var $scrollingTargets = jQuery('#article-overscroll-area, #article-overscrolling');
	$scrollingTargets.remove();
	if ($scrollingTargets.length > 0) {
		GM_log('scrollingTargets removed: ' + $scrollingTargets.length);
		$scrollingTargets.remove();
	}
};
jQuery(function ($) {
	removeScroller();
});
removeScroller();