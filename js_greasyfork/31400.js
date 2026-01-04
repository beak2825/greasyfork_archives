// ==UserScript==
// @name        AO3: Comment Formatting Options
// @namespace   adustyspectacle
// @description Adds interface to comments to easily insert formatting options in HTML
// @include     http://*archiveofourown.org/*
// @include     https://*archiveofourown.org/*
// @version     1.2
// @history     1.2 - updated to use searchParams to make life easier
// @history     1.1 - Updated included urls
// @history     1.0 - Initial release
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31400/AO3%3A%20Comment%20Formatting%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/31400/AO3%3A%20Comment%20Formatting%20Options.meta.js
// ==/UserScript==

(function($) {
	
	//
	var ICONIFY = true;
	//

	if (ICONIFY) {
		var font_awesome_icons = document.createElement('script');
		font_awesome_icons.setAttribute('src', 'https://use.fontawesome.com/ed555db3cc.js');
		document.getElementsByTagName('head')[0].appendChild(font_awesome_icons);

		var fa_icons_css = document.createElement('style');
		fa_icons_css.setAttribute('type', 'text/css');
		fa_icons_css.innerHTML = `
			.comment-formatting {
				font-family: FontAwesome, sans-serif;
			}
		`
		document.getElementsByTagName('head')[0].appendChild(fa_icons_css);
	}

	// note: commentId must be in the form of #comment_content_for_COMMENTID
	function addCommentFormattingUI(commentId) {
		var postCommentField = $(commentId);
		var commentUniqueId = postCommentField[0].id.slice(20);
		var commentFormatting = document.createElement("ul");

		var commentFormattingOptions = {
			bold_text: [["Bold", "&#xf032"], ["<strong>", "</strong>"]],
			italic_text: [["Italic", "&#xf033"], ["<em>", "</em>"]],
			underline_text: [["Underline", "&#xf0cd"], ["<u>", "</u>"]],
			strike_text: [["Strikethrough", "&#xf0cc"], ["<s>", "</s>"]],
			insert_link: [["Insert Link", "&#xf0c1"], ['<a href="">', "</a>"]],
			insert_image: [["Insert Image", "&#xf03e"], ['<img src="">']],
			blockquote_text: [["Blockquote", "&#xf10d"], ["<blockquote>", "</blockquote>"]]
		}

		commentFormatting.setAttribute("id", "comment_formatting_for_" + commentUniqueId);
		commentFormatting.setAttribute("class", "actions comment-formatting");
		commentFormatting.setAttribute("style", "float: left; text-align: left;");
		commentFormatting.innerHTML = "<h4>Formatting Options:</h4>";
		
		postCommentField.before(commentFormatting);

		for (let key in commentFormattingOptions) {
			var commentFormattingOptionItem = document.createElement("li");
			var commentFormattingOptionLink = document.createElement("a");
			let commentFormattingOptionItemId = key + "_" + commentUniqueId;

			commentFormattingOptionItem.setAttribute("id", commentFormattingOptionItemId);
			commentFormattingOptionItem.setAttribute("class", key);
			commentFormattingOptionItem.setAttribute("title", commentFormattingOptions[key][0][0]);

			if (ICONIFY) commentFormattingOptionLink.innerHTML = commentFormattingOptions[key][0][1];
			else commentFormattingOptionLink.innerHTML = commentFormattingOptions[key][0][0];

			commentFormattingOptionItem.appendChild(commentFormattingOptionLink);
			commentFormatting.appendChild(commentFormattingOptionItem);
			
			$("#" + commentFormattingOptionItemId).on('click', 'a', function() {
				
				var caretPos = $(commentId)[0].selectionStart;
				var caretEnd = $(commentId)[0].selectionEnd;
				var textAreaTxt = $(commentId).val();
				
				if (caretPos == caretEnd) {
					var formatToAdd = commentFormattingOptions[key][1].join("");
				} else {
					var textAreaHighlight = textAreaTxt.slice(caretPos, caretEnd);
					var formatToAdd = commentFormattingOptions[key][1].join(textAreaHighlight);
				}
				
				$(commentId).val(textAreaTxt.substring(0, caretPos) + formatToAdd + textAreaTxt.substring(caretEnd) );

				$(commentId).focus();
				$(commentId)[0].selectionStart = caretPos + txtToAdd.length
				$(commentId)[0].selectionEnd = caretPos + txtToAdd.length
			});
		}

		
	}
	
	// For the Add Comment area found in works/tags
	if ( $("#add_comment textarea").length ) {
		var add_comment_box_id = "#" + $("#add_comment textarea")[0].id;
		
		addCommentFormattingUI(add_comment_box_id);
	}
	
	// This whole bit is for Reply Comments stuff, because AJAX
	$( document ).ajaxSuccess(function( event, xhr, settings ) {
		
		// This is for replying to comments
		if (settings.url.indexOf("add_comment_reply") !== -1) {
			var params = (new URL(settings.url)).searchParams;
			var commentReplyId = params.get("id");
			
			var commentReplyIdSelector = $("#comment_content_for_" + commentReplyId).selector;

			addCommentFormattingUI(commentReplyIdSelector);
		}
		
		// This is for inbox comments
		else if (settings.url.indexOf("inbox/reply?") !== -1) {
			var params = (new URL(settings.url)).searchParams;
			var commentReplyId = params.get("comment_id");
			
			var commentReplyIdSelector = $("#comment_content_for_" + commentReplyId).selector;

			addCommentFormattingUI(commentReplyIdSelector);
		}

// Commented out for now since it still doesn't work properly.
//		// This is for when editing a comment.
//		else if (settings.url.indexOf("comments/") !== -1 && settings.url.indexOf("/edit") !== -1) {
//			var sliceStart = settings.url.indexOf("comments/") + 9;
//			var sliceEnd = settings.url.indexOf("/edit");
//			var commentEditId = settings.url.slice(sliceStart, sliceEnd);
//			var commentEditIdSelector = "#" + $("#comment_" + commentEditId + " textarea")[0].id;
			
//			addCommentFormattingUI(commentEditIdSelector);
//		}
	});
	
})(jQuery);