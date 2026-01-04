// ==UserScript==
// @name          'Stylizes' Chess24's Learn-Video Page
// @namespace     http://userstyles.org
// @description	  chess24LearnVideoClean
// @author        ceberous
// @locale        en
// @homepage      https://creatitees.info
// @include       https://chess24.com/*/learn/*/video/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @run-at        document-start
// @version       0.2
// @downloadURL https://update.greasyfork.org/scripts/33474/%27Stylizes%27%20Chess24%27s%20Learn-Video%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/33474/%27Stylizes%27%20Chess24%27s%20Learn-Video%20Page.meta.js
// ==/UserScript==

(function() {

	var wInt = null;
	function sInt( wTime , wCTime ) {
		wInt = setInterval(function(){
			$(".sidebarWrapper").hide();
			$(".contentWrap").css("width", "inherit");
		} , wTime );
		setTimeout(function(){
			clearInterval(wInt);
		} , wCTime );
	}

	$( document ).ready( function() { 

		$(".sidebarWrapper").remove();
		$(".stickyQuickies").remove();

    	setTimeout( function() {
    		$(".sidebarWrapper").remove();
    		$(".stickyQuickies").remove();
			$(".contentWrap").css("width", "inherit");
			$(".rightContainer").css("float", "left");
			$(".rightContainer").css("padding-left", "10%");
    		//sInt( 100 , 3000 );
    	} , 5000 );		
	});

})();