// ==UserScript==
// @name 		Correct All The Coordinates
// @namespace	http://www.dennistreysa.de
// @author 		dennistreysa
// @oujs:author	dennistreysa
// @copyright	2015-2016, dennistreysa
// @version 	1.0
// @icon		https://raw.githubusercontent.com/dennistreysa/CATC/master/res/logo.png
// @description	This script enables the functionality to change the coordinates of every cachetype
// @include		*.geocaching.com/seek/cache_details.aspx*
// @include		*.geocaching.com/geocache/GC*
// @noframes
// @grant 		none
// @downloadURL https://update.greasyfork.org/scripts/21923/Correct%20All%20The%20Coordinates.user.js
// @updateURL https://update.greasyfork.org/scripts/21923/Correct%20All%20The%20Coordinates.meta.js
// ==/UserScript==

var CATC = {

	onStart : function(){

		// Find coords container
		var $CacheInformationTable = $("#ctl00_ContentBody_CacheInformationTable").find(".NoBottomSpacing :first");
		var $coords = $CacheInformationTable.find("strong :first");

		if($CacheInformationTable.length && $coords.length){

			// Check if coords are original or already changed
			if(!$coords.parent().is("a")){

				// Set up userdefined coords
				var userDefinedCoords = {"status":"success","data":{"isUserDefined":false,"oldLatLngDisplay":$coords.find("#uxLatLon").text()}};

				mapLatLng.oldLatLngDisplay = userDefinedCoords.data.oldLatLngDisplay;

				// Create link
				var $a = $('<a href="#" class="edit-cache-coordinates" id="uxLatLonLink" title="Correct All The Coordinates"></a>');

				// Append original coordinates
				$a.append($coords.clone(true));

				// Replace old coordinates
				$coords.replaceWith($a);

				// Add click-event
				$a.qtip({
					suppress:false,
					content: buildCacheCoordMenu(),
					position: {
						my: 'left top',
						at: 'right top',
						adjust: {
							x: 10, y: -10
						}
					},
					show: {
						ready: false,
						event: "click",
						solo: true
					}, hide: {
						event: 'unfocus'
					},
					style: {
						tip: {
							corner: false
						},
						classes: 'ui-tooltip-widget'
					},
					events: {
						show: function () {
							if ($("#uxLatLon").data("isOverridden")) {
								$("a.ccu-restore").show();
							} else {
								$("a.ccu-restore").hide();
							}

							if (userDefinedCoords.status != "success") {
								$("div.ccu-update").hide();
							} else {
								$("div.ccu-update").show();
							}
						}
					}
				}).click(function (e) {
					e.preventDefault();
					return false;
				});
			}
		}
	}
};

$(document).ready(function(){
	CATC.onStart();
});