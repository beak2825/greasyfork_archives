// ==UserScript==
// @name			Tomassie91's Usenet4All experience
// @namespace		http://www.usenet4all.eu
// @description		Enhances the experience on the usenet4all forum.
// @version			v2.2 full
// @include			http://www.usenet4all.eu/unet/viewtopic.php*
// @include			http://usenet4all.eu/unet/viewtopic.php*
// @include			https://www.usenet4all.eu/unet/viewtopic.php*
// @include			https://usenet4all.eu/unet/viewtopic.php*
// @require 		https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/4242/Tomassie91%27s%20Usenet4All%20experience.user.js
// @updateURL https://update.greasyfork.org/scripts/4242/Tomassie91%27s%20Usenet4All%20experience.meta.js
// ==/UserScript==


//--------------------------------------
// hide all the comments in a topic
//--------------------------------------


//check if the first post has been skipped
var skippedstartpost;

//add the posthider
$(".unreadpost").first().after("<div id=\"posthidercontainer\" class=\"bg1 unreadpost\"><p id=\"posthider\" style=\"text-align:center; padding: 10px; cursor:pointer; \">show/hide posts</p></div>");

//add the posthider trigger
$("#posthider").bind("click", function() {
	//reset the skip value
	skippedstartpost = false;
	
	//loop through the posts to hide the proper posts
	$(".unreadpost").each(function() {
		//check if the post isn't the posthider or startpost
		if(skippedstartpost == true && $(this).attr('id') !== "posthidercontainer") {
			//hide or show them
			if($(this).css("display") != "none") {
				$(this).css("display", "none");
			} else {
				$(this).css("display", "inline");
			}
		} else {
			//skip the start post
			skippedstartpost = true;
		}
	});
});

//auto-hide the posts
$("#posthider").trigger("click");

//--------------------------------------
// add the quickreply button and message
//--------------------------------------

//create the quickreply button
$(".pull-left .btn").each(function() {
	if($(this).attr("data-original-title") == "Post a reply") {
		$(this).after('<a class="btn btn-default quick-reply-button" role="button" data-original-title="Quickreply"><i class="fa fa-plus"> </i> Quickreply</a>');
	}
});

//add the quickreply button trigger
$(".quick-reply-button").bind("click", function() {
	$('form[role="form"] .btn[name="post"]').trigger("click");
});

//insert the message
$("#message").val("Thanks for this vid!");

//give reputation points to first post
$('form[role="form"]').on("submit", function() {
		var id = $('.unreadpost').first().attr('id').substring(1);
		$.ajax({
			url: './reputation.php?p=' + id,
			async: false
		});
		
		return true;
});

//--------------------------------------
// duplicate the hidden box at the top of the post
//--------------------------------------

var hiddenhtml = $(".content .alert-success")[0].outerHTML; //contents of the hidden section

//fill the contents of the hidden section variable
$(".content .alert-success").nextAll().each(function() { 
	hiddenhtml += $(this)[0].outerHTML;
});

//add the hidden part as the first part of the post
$(".content").each(function() {
	hiddenhtml += "<br/><br/>"; //add some spacing

	var firstchild = $(this).children().first();
	if(firstchild.is("center")) //add it in the center if possible
		firstchild.prepend(hiddenhtml);
	else
		$(this).prepend(hiddenhtml);
});