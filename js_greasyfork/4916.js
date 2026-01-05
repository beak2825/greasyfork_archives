// Pirates vs Ninjas
//
// ==UserScript==
// @name          Pirates vs Ninjas
// @description   Make sure you have that swashbuckling outfit on!
// @include       *127.0.0.1:*
// @include       *kingdomofloathing.com*
// @include       *localhost*
// @version 0.1
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @namespace https://greasyfork.org/users/3824
// @downloadURL https://update.greasyfork.org/scripts/4916/Pirates%20vs%20Ninjas.user.js
// @updateURL https://update.greasyfork.org/scripts/4916/Pirates%20vs%20Ninjas.meta.js
// ==/UserScript==


$(document).ready(function() {
	$('a[href="adventure.php?snarfblat=272"]').click(function(){
		if( !$('span:contains("Swashbuckling Getup")', window.parent.frames["charpane"].document).length ){
			if(confirm("Do you want to fight ninjas without a swashbuckling outfit on?")) {
				return true;
			} else {
				return false;	
			}
		}
	});
});