// ==UserScript==
// @name          Steam Sale Xmas 2015 Card Farm
// @namespace     http://greasyfork.org/users/2240-doodles
// @author        Doodles
// @version       2
// @description   Automates Steam Exploration Queues for easy card farming.
// @include       *://store.steampowered.com/app/*
// @include       *://store.steampowered.com/explore/
// @include       *://store.steampowered.com/agecheck/app/*
// @run-at        document-end
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @grant         none
// @updateVersion 2
// @downloadURL https://update.greasyfork.org/scripts/15472/Steam%20Sale%20Xmas%202015%20Card%20Farm.user.js
// @updateURL https://update.greasyfork.org/scripts/15472/Steam%20Sale%20Xmas%202015%20Card%20Farm.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function () {
	function UrlContains(urlfragment) { return document.URL.indexOf(urlfragment) != -1; }
	if(UrlContains('steampowered.com/app/')){
		if($('.next_in_queue_content').length > 0){
			$('#next_in_queue_form').submit();
		}
	}
	if(UrlContains('steampowered.com/agecheck/app/')){
		$('#ageYear').val('1970');
		DoAgeGateSubmit();
	}
	if(UrlContains('steampowered.com/explore/')){
		if ($('.discovery_queue_winter_sale_cards_header:first():contains("Come back tomorrow")').length == 0) {
			if($('#refresh_queue_btn').length > 0){
				$('#refresh_queue_btn').trigger('click');
			}else if($('.discovery_queue_overlay_message:first():contains("Click here to begin exploring your queue")').length != 0){
				window.location.href = $('#discovery_queue_start_link').attr('href');
			}
		}
	}
});