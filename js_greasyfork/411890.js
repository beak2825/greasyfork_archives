// ==UserScript==
// @name          Blackboard Collaborate Hide Avatar Images
// @namespace     http://userstyles.org
// @description   Hides Avatar Images on Blackboard Collaborate
// @author        636597
// @include       *://*bbcollab.com/collab/ui/session/join/*
// @run-at        document-start
// @version       0.7
// @downloadURL https://update.greasyfork.org/scripts/411890/Blackboard%20Collaborate%20Hide%20Avatar%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/411890/Blackboard%20Collaborate%20Hide%20Avatar%20Images.meta.js
// ==/UserScript==

function hide_existing_avatars() {
	try{
		let avatars = document.querySelectorAll( "img.no-avatar" );
		for ( let i = 0; i < avatars.length; ++i ){
			avatars[ i ].src = "/collab/ui/session/21.0.7-localization.0/assets/images/avatars/no-avatar.svg";
			avatars[ i ]["ng-src"] = "/collab/ui/session/21.0.7-localization.0/assets/images/avatars/no-avatar.svg";
		}
		let small_avatars = document.querySelectorAll( "div.avatar-image" );
		for ( let i = 0; i < small_avatars.length; ++i ){
			small_avatars[ i ].childNodes[ 1 ].src = "/collab/ui/session/21.0.7-localization.0/assets/images/avatars/no-avatar.svg"
		}
	}
	catch( e ) {}
}

function add_hide_avatar_css() {
	var style_sheets = window.document.styleSheets;
	var override_avatar_images_rule = `img.no-avatar {
	background: url( "/collab/ui/session/21.0.7-localization.0/assets/images/avatars/no-avatar.svg" ) no-repeat;
	content: url("/collab/ui/session/21.0.7-localization.0/assets/images/avatars/no-avatar.svg");
	!important;
}`;
	for ( let i = 0; i < style_sheets.length; ++i ) {
		try {
			style_sheets[ i ].insertRule( override_avatar_images_rule , style_sheets[ i ].cssRules.length );
			console.log( i );
			return;
		}
		catch( e ) {};
	}
}

var URL_STATE_IN_2020_INTERVAL = false;
var HIDE_AVATAR_INTERVAL = false;
var CURRENT_URL = false;
function observe_url_state() {
	if ( CURRENT_URL !== window.location.href ) {
		console.log( "URL State Changed" );
		CURRENT_URL = window.location.href;
		hide_existing_avatars();
		add_hide_avatar_css();
	}
}

function init() {
	console.log( "Loading Blackboard Collaborate Avatar Image Hider" );
	hide_existing_avatars();
	add_hide_avatar_css();
	URL_STATE_IN_2020_INTERVAL = setInterval( observe_url_state , 500 );
	HIDE_AVATAR_INTERVAL = setInterval( hide_existing_avatars , 1000 );
}

( function() {
	window.addEventListener ( "load" , init );
})();