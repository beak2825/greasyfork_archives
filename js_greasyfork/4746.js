// KoL Equipment Character Counter
// BETA
//
// ==UserScript==
// @name          Equipment Character Counter
// @description   Counts characters of your equipment
// @include       *127.0.0.1:*/inventory.php?which=2
// @include       *kingdomofloathing.com/inventory.php?which=2
// @include       *localhost:60080/inventory.php?which=2
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @version 0.0.1.20140901195043
// @namespace https://greasyfork.org/users/3824
// @downloadURL https://update.greasyfork.org/scripts/4746/Equipment%20Character%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/4746/Equipment%20Character%20Counter.meta.js
// ==/UserScript==

var $jklimcount = jQuery.noConflict();

$jklimcount(window).load(function() {
	$jklimcount('b[class="ircm"]').each(function(){
		$jklimcount(this).append(' <span style="color: green;font-size:10px;">(' + $jklimcount(this).text().length + ' ch)</span>');
	});
	$jklimcount('#curequip b').each(function(){
		$jklimcount(this).append(' <span style="color: green;font-size:10px;">(' + $jklimcount(this).text().length + ' ch)</span>');
	});
});