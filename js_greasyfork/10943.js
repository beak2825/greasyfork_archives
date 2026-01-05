// ==UserScript==
// @name        Product Recommendation Relevance
// @namespace   http://idlewords.net
// @description	Assigns keyboard shortcuts to answer each question, and hides instruction box
// @include     https://s3.amazonaws.com/mturk_bulk/hits/*
// @version     0.1
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10943/Product%20Recommendation%20Relevance.user.js
// @updateURL https://update.greasyfork.org/scripts/10943/Product%20Recommendation%20Relevance.meta.js
// ==/UserScript==

function keyHandler(event, index) {
	var rating_id = "-1";
	switch(event.which) {
		case 49:
		case 97:
			rating_id = "1";
			break;
		case 50:
		case 98:
			rating_id = "2";
			break;
		case 51:
		case 99:
			rating_id = "3";
			break;
		case 52:
		case 100:
			rating_id = "4";
			break;
		case 53:
		case 101:
			rating_id = "5";
			break;
	}

	if (rating_id != "-1") {
		$("#Q" + (index+1) + "_" + rating_id).prop('checked', true);
	}

	if (rating_id != "-1" || (event.which == 9 && !event.shiftKey)) {
		event.preventDefault();
		$("#Q" + (index+2) + "_head").get(0).scrollIntoView();
		$("#Q" + (index+2) + "_ratingbox").focus();
	} else if (event.which == 9 && event.shiftKey && index !== 0) {
		event.preventDefault();
		$("#Q" + (index) + "_head").get(0).scrollIntoView();
		$("#Q" + (index) + "_ratingbox").focus();
	}

	if (event.which == 1) {
		// do stuff
	}
}

if ($("span:contains('Imagine that you are using an onine store')").length) {
	$("div#main").find("td[style*='lightgray']").find("h4:contains('- ')").each(function(index, element) {
		var this_head = $(this).parent().attr('id', 'Q' + (index+1) + '_head');
		//var this_table = $(this).parent().parent().attr('id', 'Q' + (index+1) + '_table');
		$(this).html('<input type="text" name="ratingbox" value="" id="Q' + (index+1) + '_ratingbox" readonly="readonly" />&nbsp;&nbsp;' + $(this).text());
		var this_ratingbox = $("#Q" + (index+1) + "_ratingbox")
		this_ratingbox.css('width', '10px').css('border-color', 'blue');
		this_ratingbox.keydown(function(event) {
			keyHandler(event, index);
		});
	});

	$('[id$="ratingbox"]').each(function(r_index, element) {
		$(this).focus(function(f_index, element) {
			$(this).css('border-color', 'red');
		});
		$(this).blur(function(b_index, element) {
			$(this).css('border-color', 'blue');
		});
	});

	var i = 5;
	$("label[for^='Q']").each(function(index, element) {
		i = (i == 0) ? 5 : i;
		var cur_text = $(this).text();
		$(this).contents().filter(function() {
	      return this.nodeType == 3; //Node.TEXT_NODE
	    }).wrap("<span class='orphan'></span>");
		$("span.orphan").remove();
		$(this).append("<span>" + i + " " + cur_text + "</span>");
		i--;
	});

	$("div.panel-heading").children("strong:contains('Instructions')").parent().parent().hide();

	$("#Q1_head").get(0).scrollIntoView();
	$("#Q1_ratingbox").focus();
}