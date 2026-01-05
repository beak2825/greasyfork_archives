// ==UserScript==
// @name        MTurk mosaic - Extract simple information (4 items)
// @namespace   http://idlewords.net
// @description Enlarge parts of the mosaic HIT UI
// @include     https://evolvdevelopment.com/hits/nexthit*
// @version     0.1
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12814/MTurk%20mosaic%20-%20Extract%20simple%20information%20%284%20items%29.user.js
// @updateURL https://update.greasyfork.org/scripts/12814/MTurk%20mosaic%20-%20Extract%20simple%20information%20%284%20items%29.meta.js
// ==/UserScript==


$(function() {
	$("#bigbox").attr('style', 'width: 95% !important;');
	$(".main").attr('style', 'height: 90% !important;');
	$(".chunkL").attr('style', 'width: 80% !important;');
	$(".chunkR").attr('style', 'width: 20% !important;');
});