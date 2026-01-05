// ==UserScript==
// @name        MTurk Myhobnob - Analyze party invitations to understand user demographics
// @namespace   http://idlewords.net
// @include     https://www.mturkcontent.com/dynamic/hit*
// @description Float information tables and event image to enable quick completion of HIT
// @version     0.2
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11966/MTurk%20Myhobnob%20-%20Analyze%20party%20invitations%20to%20understand%20user%20demographics.user.js
// @updateURL https://update.greasyfork.org/scripts/11966/MTurk%20Myhobnob%20-%20Analyze%20party%20invitations%20to%20understand%20user%20demographics.meta.js
// ==/UserScript==

var right = 0;

// Container
if ($(":contains('closely to ascertain your best guess')").length) {
	var div = $("<div>")
	    .css('position', "fixed")
	    .css('top', "0px")
	    .css('left', "0px")
		.css('right', '0px')
		.css('margin', '0px 0px auto auto')
	    .css('padding', "3px")
		.css('width', '87%')
	    .css('background-color', "rgba(255, 255, 255, 0.85)")
	    //.css('border', "1px solid rgba(130,200,220,0.75)")
	    .css('border-width', "1px 0 0 1px")
	    .css('border-radius', "2px 0 0 0")
	    .css('font', "11pt sans-serif")
	    .append(
	        $("table").eq(0),
			$("table").eq(1)
	    );
	if (right === 1) {
		div.css('margin', '0px auto auto 0px');
	}
	var div2 = $("<div>")
	    .css('position', "fixed")
	    .css('top', "0px")
	    .css('padding', "3px")
	    //.css('background-color', "rgba(160,215,255,0.75)")
	    //.css('border', "1px solid rgba(130,200,220,0.75)")
	    .css('border-width', "1px 0 0 1px")
	    .css('border-radius', "2px 0 0 0")
	    .css('font', "11pt sans-serif")
	    .append(
	        $("img[src*='cloudfront']").css({'padding': '0px', 'max-width': '200px'})
	    );
	if (right === 1) {
		div2.css('right', '0px');
	} else {
		div2.css('left', '0px');
	}

	// Add some shared styles
	$("p", div).css('text-align', "right").css('display', "inline");
	$("input", div).css('background-color', "rgba(255,255,255,0.65)").css('border', "1px solid #ddd");

	if (right === 1) {
		$("body").append(div2, div);
	} else {
		$("body").append(div, div2);
	}
}