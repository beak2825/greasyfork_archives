// ==UserScript==
// @name         Pinned comments in Zendesk
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Allows the user to mark comments as pinned to top
// @author       You
// @match        https://*.zendesk.com/agent/tickets/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391964/Pinned%20comments%20in%20Zendesk.user.js
// @updateURL https://update.greasyfork.org/scripts/391964/Pinned%20comments%20in%20Zendesk.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //    this.$ = this.jQuery = jQuery.noConflict(true);
    window.addEventListener('load', function() {
var _s = `
<style>
.pinned_comment .actor {
    padding-bottom: 5px;
}

.pinned_comment .assign_to.for_save.link_light {
    display: none;
}

.pinned_comment .make-private.link_light {
    display: none;
}

.pinned_comment .user_photo {
    display: none;
}

.pinned_comment input {
	display: none;
}

.pinned_comment {
    background: lavender;
    padding: 10px 90px;
    border-bottom: 1px solid #d6d6d6;
}

input.pin_checkbox {
    float: right;
    margin-right: 18px;
    margin-top: -17px;
}
</style>
`;

// injecting CSS

jQuery( _s ).appendTo( "head" )

// toggling comments - this will clear all pinned comments and all checkboxes and reset them according to localStorage

function toggleComments(){
	jQuery('.pinned_comment').remove();
	jQuery('input.pin_checkbox').prop('checked',false);

	var storedComments = ( JSON.parse(localStorage.getItem('pinnedComments')) || [0] );
	storedComments.forEach(function(item, index) {
		jQuery('.ember-view.event[data-comment-id-parent="'+item+'"]>input.pin_checkbox').prop('checked',true);
		if (jQuery('.ember-view.event[data-comment-id-parent="'+item+'"]').closest('.ember-view.workspace').css('display') == 'block') {
			var isActiveTicket = true
		} //else { isActiveTicket = false }
		if(isActiveTicket) {
			var _h = jQuery('.ember-view.event[data-comment-id-parent="'+item+'"]').html();
			jQuery('div.pane_header.header').before('<div class="pinned_comment">'+_h+'</div>');
			jQuery('div.pinned_comment hr').nextAll().css('display','none');
		}
	})
}


function settingUp() {

	// adding comment-id to top div
	jQuery('.ember-view.audits>.ember-view.event>.content').each(function(){

		var commentId = jQuery(this).attr('data-comment-id');
		jQuery(this).parent().attr('data-comment-id-parent',commentId)
	});

	// adding timestamp to top div
	jQuery('.ember-view.audits>.ember-view.event>.content>.header>.actor>.live.full').each(function(){
		var commentTime = jQuery(this).attr('datetime');
		jQuery(this).parent().parent().parent().parent().attr('data-comment-time',commentTime)
	})

	// jQuery('div.ember-view.event[data-comment-id-parent="471194301799"]').attr('data-pinned-comment','pinned')


	// adding checkbox to all top div
	jQuery('.ember-view.audits>.ember-view.event:not(:has(input.pin_checkbox))').each(function(){
		var _i = '<input class="pin_checkbox" type="checkbox">'
		jQuery(this).prepend(_i);
	})


	// when checkbox is clicked, storedComments will get the localstorage info and toggleComments is called
	jQuery('input.pin_checkbox').off('change').on('change',function() {
		var storedComments = [];
		var currentComment = jQuery(this).parent().attr('data-comment-id-parent');
		storedComments = ( JSON.parse(localStorage.getItem('pinnedComments')) || [0] );
		if (jQuery(this).prop('checked')) {
			// adding comment ID uniquely
			if(storedComments.indexOf(currentComment) === -1) {
				storedComments.push(currentComment);
				jQuery.get( "https://us-central1-pinnedcomments.cloudfunctions.net/getPinnedComments?action=push&id="+storedComments.toString(), function(data) {
					console.log(data);
				});
			}
		} else {
			// removing current comment ID from list
			var _i = storedComments.indexOf(currentComment);
			if (_i > -1) {storedComments.splice(_i,1)}

			jQuery.get( "https://us-central1-pinnedcomments.cloudfunctions.net/getPinnedComments?action=delete&id="+currentComment, function(data) {
				console.log(data);
			});
		}

		localStorage.setItem('pinnedComments', JSON.stringify(storedComments));
		console.log(localStorage.getItem('pinnedComments'));

		toggleComments();
	});

}

function syncPinnedComments() {
	jQuery.get( "https://us-central1-pinnedcomments.cloudfunctions.net/getPinnedComments?action=get", function(data) {
		localStorage.setItem('pinnedComments', JSON.stringify(data));
		console.log(localStorage.getItem('pinnedComments'));
	});

}

function init() {
	syncPinnedComments();
	setInterval(function(){ settingUp(); toggleComments(); }, 1000)
	setInterval(function(){ syncPinnedComments(); toggleComments(); }, 30000)

}


init();

    }, false);
})();