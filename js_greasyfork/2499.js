// ==UserScript==
// @name		Tumblr Reblog Fix & Quote Trimmer
// @namespace	the.vindicar.scripts
// @description	Pulls down reblogged text into rich-text editor and allows you to trim excessive nested quotes from it.
// @version	    3.1.1
// @include	    http://www.tumblr.com/*
// @include	    https://www.tumblr.com/*
// @exclude	    http://www.tumblr.com/help
// @exclude	    https://www.tumblr.com/help
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/2499/Tumblr%20Reblog%20Fix%20%20Quote%20Trimmer.user.js
// @updateURL https://update.greasyfork.org/scripts/2499/Tumblr%20Reblog%20Fix%20%20Quote%20Trimmer.meta.js
// ==/UserScript==

(function(){
	'use strict';
	if (	(typeof unsafeWindow.jQuery === 'undefined') || 
			(typeof unsafeWindow.Tumblr === 'undefined') || 
			(typeof unsafeWindow.Tumblr.Events === 'undefined') )
		return;
	//If we have no access to Greasemonkey methods, we will need dummy replacements
	if (typeof GM_getValue !== 'function') GM_getValue = function (target, deflt) { return deflt; };
	//How many levels of quotes we want to leave. Non-number values are ignored. 
	//You can enter a comma-separated list and have multiple buttons trimming to different levels.
	var TRIMLEVELS = levelsList(GM_getValue("trimlevels", "2"));
	//CSS styles for our buttons
	var styles = [
		'.bubbles > .trimquotes:before {content: "\uF11F"; color:#F99; font-family: "tumblr-icons","Blank"; font-style: normal; font-variant:normal; font-weight: 400; text-decoration: none; text-transform: none; }',
		'.bubbles > .trimquotes {position: relative;}',
		'.bubbles > .trimquotes > .trimquotes-level {color:#FFF; position: absolute; left: 0px; width: 100%; vertical-align: bottom; padding-top: 10px;}'
	].join('\n');
	GM_addStyle(styles);
	//setting up menu if we can
	if ((typeof GM_setValue === 'function') && (typeof GM_registerMenuCommand === 'function')) {
		GM_registerMenuCommand("Quote Trimmer Settings", function() {
			var newval = prompt("How many quoting levels should be left?\nYou can enter several numbers separated by comma.\nReload the page to apply any changes.", TRIMLEVELS.join(','));
			if (newval !== null) { //user pressed OK - saving the value
				var newarr = levelsList(newval); //parsing it into array of usable values
				//saving the values we understand. if there are none, oh well, too bad!
				GM_setValue("trimlevels", newarr.join(','));
			}
			else //user pressed Cancel - do nothing
				return;
		});
	}

	//code below will be executed in page scope and will be able to make use of jQuery lib used by Tumblr
	RunInPage(function(levels){
		'use strict';
		//we use Tumblr's own event system to monitor the moment when post form shows up.
		Tumblr.Events.listenTo(Tumblr.Events, 'postForms:opened', adjustPost);
		
		var $ = jQuery;
		//button template
		var TRIMBTN = '<div class="trimquotes" title="Trim blockquotes"><span class="trimquotes-level"></span></div>';
		
		//event handler that will trigger when a "trim" button is clicked
		function trimPostText(event) {
			event.preventDefault();
			//determining trim level of that button
			var level = parseInt($(event.target).closest('.trimquotes').attr('data-level'), 10);
			// making the search pattern
			var filter = 'blockquote';
			for (var i = 0; i < level; i++) filter += ' > blockquote';
			//post editor (rich text)
			var $post = $('.editor.editor-richtext');
			// moving post content to a temporary container
			var $markup = $('<body>').append($post.html()); 
			//looking for quotes to remove
			$markup.find(filter).each(function(i,e) {
				$(e).prev("p:has(a[href*='/post/'])").remove(); //removing the blog referal before the blockquote
				$(e).remove(); //removing the blockquote itself
			});
			//setting new post text. Yay!
			$post.html($markup.html());
			//okay, that's a shitty way of hiding formatting panel, but I'm too lazy to find the particular method that needs to be called - and the particular object that contains it.
			$post.trigger("mousedown").trigger("mouseup");
			//scrolling to the bottom of the post
			$('.post-forms-modal').scrollTop($post.offset().bottom);
		}
		//this function constructs "trim" buttons according ot settings and inserts them into formatting panel
		function makeButtons(levels) {
			//we make buttons in reverse order, so as we attach them in place the order will be left-to-right
			for (var i=levels.length-1; i>=0; i--) {
				//making a button
				var $button = $(TRIMBTN);
				if (levels.length>1) //if we have only one button, then no need to mark it with a number
					$button.find('.trimquotes-level').html(levels[i].toString(10));
				//save desired trimming level
				$button.attr("data-level", levels[i]); 
				//attach event handler
				$button.mousedown(trimPostText);
				//...and place it after "blockquote" button
				$('.post-content .editor-slot .bubbles .quote').after($button);
			}		
		}
		//this function is called when post form opens
		function adjustPost() {
			//find editor
			var $editor = $('.editor-richtext');
			//if it's rich-text
			if ($editor.length == 1) {
				//get reblogged text
				var reblogs = $('.reblog-tree.post_content');
				if (reblogs.length == 0) 
					return;
				//attach reblogged text
				$editor.html(reblogs.html()+"\n"+$editor.html());
				//remove it from its place
				$('.btn-remove-tree').click();
				//add our "trim" buttons
				makeButtons(levels);
			}
		}
	}, "["+TRIMLEVELS.join(",")+"]");
	//helper function
	function RunInPage(func, argsstr) {
		var s = document.createElement("script"); 
		if (typeof argsstr === 'undefined') argsstr = "";
		s.textContent = "(" + func + ")("+argsstr+");"; 
		document.body.appendChild(s);
		setTimeout(function(){document.body.removeChild(s)}, 0);
	}
	function levelsList(lst) {
		var i=0; 
		var arr = lst.split(',');
		while (i<arr.length) {
			arr[i] = parseInt(arr[i].trim(), 10);
			if (isNaN(arr[i]) || (arr[i]<0))
				arr.splice(i, 1);
			else
				i++;
		}
		return arr;
	}
	
})();