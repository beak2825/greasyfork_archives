// ==UserScript==
// @name          Are You Sure You Want To Log Out Icon-based Navigation
// @description   IT'S RIGHT NEXT TO MY TABS, GOD, WHY
// @author        Klimtog
// @include       *127.0.0.1:*/awesomemenu.php
// @include       *kingdomofloathing.com/awesomemenu.php
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @version 0.0.1.20140808230327
// @namespace https://greasyfork.org/users/3824
// @downloadURL https://update.greasyfork.org/scripts/3996/Are%20You%20Sure%20You%20Want%20To%20Log%20Out%20Icon-based%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/3996/Are%20You%20Sure%20You%20Want%20To%20Log%20Out%20Icon-based%20Navigation.meta.js
// ==/UserScript==

var $klimlog = jQuery.noConflict();

$klimlog(document).ready(function() {
	$klimlog('img[src*="/tinyicon_logout.gif"]').click(function() {
		if(confirm("do you actually want to log out or are you as dumb as klimtog and meant to click a chat tab or something?")) {
			return true;
		} else {
			return false;	
		}
	});
	
});