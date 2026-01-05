// ==UserScript==
// @name        WhatsAppChatListToggler
// @namespace   https://web.whatsapp.com/
// @description Toggle visibility of the left panel (chats list).
// @include     https://web.whatsapp.com/
// @version     4
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @require     https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @run-at      document-idle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28033/WhatsAppChatListToggler.user.js
// @updateURL https://update.greasyfork.org/scripts/28033/WhatsAppChatListToggler.meta.js
// ==/UserScript==

// fix overwrites of jQuery outside of sandbox
this.$ = this.jQuery = jQuery.noConflict(true);

function hideAndSeek(jNode) {
	// when a chat is selected
	$('.infinite-list-viewport').on('click', '.infinite-list-item', function() {
		var titleAvatar = $('header.pane-header.pane-chat-header > div.chat-avatar'),
			arrowsDiv = $('<div>&lt;</div>').on('click', togglePanel);
		
		arrowsDiv.insertBefore(titleAvatar);
		
		arrowsDiv.css({
			'width': 42+'px',
			'height': 42+'px',
			'text-align': 'center',
			'line-height': 42+'px',
			'font-size': 30+'px',
			'font-family': 'Roboto',
			'font-weight': 300,
			'cursor': 'pointer',
			'background-color': '#fff',
			'border-radius': '50%',
			'box-shadow': '0 1px 1px 0 rgba(0,0,0,0.06),0 2px 5px 0 rgba(0,0,0,0.2)',
			'position': 'absolute',
			'top': 70+'px'
		});
	});
}

function togglePanel() {
	
	var sideDiv = $('#side'),
		mainDiv = $('#main'),
		arrows = this;
	
	// toggle visibility, arrows directions and chat width
	if (sideDiv.is(':visible')) {
		mainDiv.css('width', '100%');
		
		sideDiv.hide(250, function() {
			arrows.innerHTML = '&gt;';
		});
	}
	else {
		sideDiv.show(250, function() {
			mainDiv.css('width', '70%');
			arrows.innerHTML = '&lt;';
		});
	}
}

// wait for element to load
waitForKeyElements('#side', hideAndSeek);