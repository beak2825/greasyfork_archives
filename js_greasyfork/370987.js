// ==UserScript==
// @author      Tommy Reynolds <oldest.software.guy@gmail.com>
// @description Save your eyes by changing white background color
// @grant	none
// @include	https?://*
// @name	No White Background Color
// @namespace	www.MegaCoder.com
// @run-at	document-end
// @version	1.0.2
// @downloadURL https://update.greasyfork.org/scripts/370987/No%20White%20Background%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/370987/No%20White%20Background%20Color.meta.js
// ==/UserScript==
// ============================================================================
// No White Background Color (NWBC) Script for GreaseMonkey
// Modified by oldest.software.guy@gmail.com
// Modified by Wellen
// Originally by Howard Smith
// ---------------------------------------------------------------------------
// This was originally by Howard Smith and seems to be the best script which
// works on the most websites for getting the eyeball burning white background
// color most sites seem to use, to be a less harsh color of the users
// choice. Firstly I have no intention of taking the credit for this script as
// it is Howard's work from many years ago, but as I couldn't find it online
// easily I wanted to make sure it wasn't lost to the Internet ether so I
// thought I should post it here.
// ---------------------------------------------------------------------------
// I found it on:
//	http://superuser.com/questions/181214/change-the-white-background-in-webpages-to-another-color
// Must also thanks user The Bahamunt for not only posting it there, but for
// digging it out from an old computer! Hope everyone finds it useful and
// enjoys not having their eyes burnt at night!
// ---------------------------------------------------------------------------
// wellen
// ===========================================================================

(function()	{
	function noWhiteBackgroundColor()	{
		function changeBackgroundColor( x )	{
			// auto change colors too close to white
			var backgroundColorRGB =
				window.getComputedStyle( x, null ).backgroundColor;
			if(  backgroundColorRGB != "transparent" )	{
				// convert hex color to rgb color to compare
				var RGBValuesArray = backgroundColorRGB.match( /\d+/g );
				var red   = RGBValuesArray[ 0 ];
				var green = RGBValuesArray[ 1 ];
				var blue  = RGBValuesArray[ 2 ];

				// ===========================================================
				// Set the base colors you require:
				// use: http://www.colorpicker.com
				// to find the rgb values of the base color you wish to
				// suppress white backgrounds with:
				// Default grey provided:
				// ===========================================================

				var red_needed	 = 230;
				var green_needed = 230;
				var blue_needed  = 230;

				if(
					red   >= 220							&&
					green >= 220							&&
					blue  >= 220
				)	{
					// This color is just too bright for this world
					if(
						red   >= 250						&&
						red   <= 255						&&
						green >= 250						&&
						green <= 255						&&
						blue  >= 250						&&
						blue  <= 255
					)	{
						red_needed	 += 0;
						green_needed += 0;
						blue_needed  += 0;
					} else if(
						red   >= 240						&&
						red   <= 255						&&
						green >= 240						&&
						green <= 255						&&
						blue  >= 240						&&
						blue  <= 255
					)	{
						red_needed	 += 6;
						green_needed += 3;
						blue_needed  += 0;
					} else if(
						red   >= 230						&&
						red   <= 255						&&
						green >= 230						&&
						green <= 255						&&
						blue  >= 230						&&
						blue  <= 255
					)	{
						red_needed	 += 10;
						green_needed += 5;
						blue_needed  += 0;
					} else if(
						red  >= 220							&&
						red  <= 255							&&
						green >= 220						&&
						green <= 255						&&
						blue  >= 220						&&
						blue  <= 255
					)	{
						red_needed   += 14;
						green_needed += 7;
						blue_needed  += 0;
					}
					// the background-color you want
					x.style.backgroundColor =
						"rgb( "			+
						red_needed		+
						", "			+
						green_needed	+
						", "			+
						blue_needed		+
						")";
				}
			}
		}
		// Check and possibly change background color on each element
		var allElements = document.getElementsByTagName( "*" );
		for( var i = 0; i < allElements.length; i++ )	{
			changeBackgroundColor( allElements[ i ] );
		}
	}
	window.addEventListener(
		"DOMContentLoaded",
		noWhiteBackgroundColor,
		false
	);
})();

// vim: nonu noet sw=4 ts=4 ai sm
