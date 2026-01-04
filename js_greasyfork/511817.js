// ==UserScript==
// @name			Copy Options on Last Horizon
// @namespace		https://izaiah.carrd.co/
// @version			0.2
// @description		Allow some options for copy-pasting contents of a thread.
// @author			Izzy
// @match			https://lasthorizon.boards.net/thread/*
// @icon			https://storage.proboards.com/7042935/images/gZJcsEPFmvoCIchdNexa.ico
// @grant			GM_addStyle
// @grant			GM_xmlhttpRequest
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @run-at			document-start
// @downloadURL https://update.greasyfork.org/scripts/511817/Copy%20Options%20on%20Last%20Horizon.user.js
// @updateURL https://update.greasyfork.org/scripts/511817/Copy%20Options%20on%20Last%20Horizon.meta.js
// ==/UserScript==

var $ = window.jQuery;
var jQuery = window.jQuery;
this.$ = this.jQuery = jQuery.noConflict(true);

var $postsarr = [];

// This allows an element to be dragged.
function dragElement(host, handle) {
	// https://www.w3schools.com/howto/howto_js_draggable.asp
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	if (handle) {
		/* if present, the header is where you move the DIV from:*/
		handle.onmousedown = dragMouseDown;
		} else {
		/* otherwise, move the DIV from anywhere inside the DIV:*/
		host.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		host.style.top = (host.offsetTop - pos2) + "px";
		host.style.left = (host.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		/* stop moving when mouse button is released:*/
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

// Some logic to add and remove styles...
jQuery.fn.extend({ removestyles: function($stylearray) {
	var $obj = $(this);
	$obj.each(function(i, e) {
		if ($(this).is('[style]')) {
			$(this).attr('style', $(this).attr('style').split(/\s*;\s*/g).filter(o => o != '').filter(o => !$stylearray.includes(o.split(/\s*:\s*/g)[0])).map(o => o + ';').join(''));
		}
	});
} });
jQuery.fn.extend({ setcss: function($stylestr) {
	var $obj = $(this);
	var $stylearray = $stylestr.split(/\s*;\s*/).filter(o => o != o.trim(''));
	$obj.each(function(i, e) {
		if ($(this).is('[style]')) {
			$(this).attr('style', $(this).attr('style').split(/\s*;\s*/g).filter(o => o != '').filter(o => !$stylearray.includes(o.split(/\s*:\s*/g)[0])).map(o => o + ';').join(''));
			$(this).attr('style', $(this).attr('style') + $stylestr);
		}
		else {
			$(this).attr('style', $stylestr);
		}
	});
} });

// A function that scrolls to an element.
function $scrollto($item, $parent) {
	//https://stackoverflow.com/a/2906009
	var $outerbody = $parent.is('html') ? $([$parent[0], $parent.children('body')[0]]) : $parent;
	var $body = $parent.is('html') ? $parent.children('body').eq(0) : $parent;
	$outerbody.animate({
		scrollTop: ($item.offset().top - 30) - $body.offset().top + $body.scrollTop()
	});
}

function htmlToMarkdown($html) {
	// Courtesy of ChatGPT.
	// Function to convert individual elements to markdown
	function convertElementToMarkdown($el) {
		let tag = $el.is('div.quote') ? 'blockquote' : $el.prop("tagName").toLowerCase();
		let markdown = '';
		switch(tag) {
			case 'h1':
			case 'h2':
			case 'h3':
			case 'h4':
			case 'h5':
			case 'h6': {
				markdown = '\n' + '#'.repeat(parseInt(tag.match(/\d/))) + ' ' + $el.text().trim() + '\n';
			break; }
			case 'li': {
				markdown = '\n' + ($el.parents('li').length ? ' '.repeat($el.parents('li').length) : '') + '- ' + $el.text().trim() + '\n';
			break; }
			case 'p': {
				markdown = '\n' + $el.text().trim() + '\n\n';
			break; }
			case 'blockquote': {
				markdown = '\n> ' + $el.text().trim().split('\n').join('\n> ') + '\r\n';
			break; }
			case 'div': {
				markdown = '\n' + $el.text().trim() + '\n';
			break; }
			case 'a': {
				markdown = '[' + $el.text().trim() + '](' + $el[0].href + ')';
			break; }
			case 'br': {
				markdown = '\n';
			break; }
			case 'b':
			case 'strong': {
				markdown = '**' + $el.text().trim() + '**';
			break; }
			case 'i':
			case 'em': {
				markdown = '*' + $el.text().trim() + '*';
			break; }
			// Add more cases as needed for other elements
			default: {
				markdown = $el.text();
			break; }
		}
		return markdown;
	}

	var $ph = $($html[0].outerHTML);

	// Get all elements, sorted by depth (deepest first)
	let elements = $ph.find('*').toArray();
	elements.sort((a, b) => $(b).parents().length - $(a).parents().length);

	// Process the deepest elements first
	elements.forEach(el => {
		let $el = $(el);
		let markdown = convertElementToMarkdown($el);

		// Replace the element's HTML with its Markdown equivalent
		$el.replaceWith(markdown);
	});

	// Return the converted Markdown from the container
	return $ph.text().trim().split(/\n|\r\n/).filter(o => o.trim() != '')
		.join('\r\n')
		.replace(/^> ([^>\n\r].*?)$(.*?)^([^>].*?)$/gms,'> $1$2\n$3'); // The last bit is for quote blocks that cause Markdown to behave strangely in Obsidian...
}

//After half a second has passed, run this...
setTimeout(function(){
	if (window.top != window.self) { return; }
	var $optpane = '';
	if ($('div.message').length) {
		//If the page is a thread (containing at least one div.message element), do the following...

		//Creates a button and inserts it at the forum bar at the top of the thread page.
		var $copyoptionstoggle = $('<li style=""><a class="Copy-Options-Toggle">Copy...</a></li>');
		$('.container.posts .title-bar ul.controls').eq(0).prepend($copyoptionstoggle);
		$('.container.posts .title-bar ul.controls li').css({'display': 'inline-block', 'margin-left': '3px'});

		// This creates an options pane.
		$optpane = $(`<div class="Copy-Options-Inner" style="max-width: 100%;">
<span class="Draggable" style="display: inline; position: relative;"><a class="Drag-This" title="Hold to drag the options pane to where on the screen you'd prefer it." style="background-color: aqua;"></a><a class="Undrag-This" title="Click to reattach this pane to the top of the thread." style="background-color: red;"></a></span><br/>
Click on a username or a post on the lists below to enable or disable them. Ctrl + Click on a post link to scroll to it.
<h4 style="margin: 3px;">Users:</h4> <div class="Users" style="max-width: 95%;"></div>
<h4 style="margin: 3px;">Posts:</h4> <div class="Posts" style="max-width: 95%; max-height: 100px; min-height: 2em; padding: 3px; overflow-y: scroll;"></div>
<h4><a class="Update-Content">Update</a>:</h4>
Click "Update" to generate a block of text according to the settings.<br/><br/>
<textarea class="Text-Content-Output" style="color: white; background-color: rgba(0,0,0,0.9) min-height: 100px; resize: both; max-width: 95%; width: 70%;"></textarea>
</div>`);
		var $copyoptionsouter = $('<div class="Copy-Options-Outer" style="display: none; margin: 3px; padding: 3px; border: 1px solid darkgray;"></div>').append($optpane);
		$optpane.find('.Drag-This, .Undrag-This').setcss('display: inline-block; color: black; line-height: 1.5em; font-size: 1.5em; height: 30px; width: 30px; margin: 0.1em; vertical-align: middle; text-align: center; border-radius: 0.3em; position: relative; user-select: none;');

		//This inserts the options pane onto the page.
		$('.container.posts .title-bar').eq(0).before($copyoptionsouter);

		// Allows the options pane to be dragged.
		dragElement($('.Copy-Options-Inner')[0], $('.Copy-Options-Outer .Copy-Options-Inner .Draggable')[0]);

		// Now, go through every message on the page and do the following...
		$('tr.item.post div.message').each(function(i,e){
			var $post = $(this).closest('tr.item.post');
			var $user = $post.find('.left-panel .user-link').eq(0);
			var $username = $user.text().trim();

			// Acquire the contents of the post and trim it into a markdown-readable format.
			var $content = htmlToMarkdown($(e));

			// The number of the given post.
			var $num = $post.attr('id').replace('post-','');

			// Creates buttons for the posts and the users to put in the options pane. If the user is already present there, the button is not added.
			var $postbtn = $('<a class="Toggle-Post Enabled" style="display: inline-block; margin: 2px; padding: 2px; border: 1px solid darkgray;" data-user="' + $username + '">' + $num + '. ' + $username + '</a>');
			var $userbtn = $('<a class="Toggle-User Enabled" style="display: inline-block; margin: 2px; padding: 2px; border: 1px solid darkgray;" data-user="' + $username + '">' + $username + '</a>');

			// Add the post to the $postsarr array. That will allow it to be accessed elsewhere in the script.
			$postsarr.push([$num, $username, $content, $post, $postbtn]);
			$optpane.find('.Posts').eq(0).append($postbtn);
			if (!$optpane.find('.Users').eq(0).find('.Toggle-User[data-user="' + $username + '"]').length) { $optpane.find('.Users').eq(0).append($userbtn); }
		});
	}

	// When certain links/buttons are clicked, do the following...
	$('body').on('click', '.Copy-Options-Toggle, .Copy-Options-Outer a', function(event){
		var $a = $(this);
		var $classarr = $a.attr('class')?.split(/\s+/);
		//alert($classarr);

		// Choose what will happen depending on which button (what class it has) was clicked.
		switch ($classarr?.[0]) {
			case 'Copy-Options-Toggle': {
				// Toggle view of the options pane.
				$('.Copy-Options-Outer').eq(0).toggle();
			break; }
			case 'Update-Content': {
				// Insert the contents of the posts (according to the given settings) in the textarea.
				var $updatedarr = $postsarr.filter(o => o[4].is('.Enabled')).map(o => '# ' + o[1] + '\n\n' + o[2]).join('\n\n\n');
				$('.Copy-Options-Outer textarea.Text-Content-Output').eq(0).val($updatedarr);
			break; }
			case 'Drag-This': {
				// If the options pane isn't currently detached, make it detached...
				if (!$optpane.is('.Detached')) {
					$optpane.addClass('Detached');
					$optpane.css('top', '100px').css('left', '100px');
					$optpane.setcss('position: fixed; z-index: 11; background-color: rgba(0,0,0,1); border: 1px solid gray; overflow: unset;');
				}
			break; }
			case 'Undrag-This': {
				// Re-attach the options pane to its original position.
				$optpane.removeClass('Detached');
				$optpane.removestyles(('top, left, position, z-index, background-color, border, overflow').split(', '));
			break; }
			case 'Toggle-Post': {
				// Toggle whether a given post is enabled or disabled... Unless Ctrl is held, in which case, scroll to the post.
				if (event.ctrlKey) {
					$scrollto($postsarr.filter(o => o[4].is($a)).map(o => o[3])?.[0], $('html, body'));
				}
				else if ($a.is('.Enabled')) {
					$a.addClass('Disabled').removeClass('Enabled').setcss('background-color: gray;');
					$postsarr.filter(o => o[4].is($a)).map(o => o[3]).forEach(function(e){ e.setcss('background-color: red'); });
				}
				else {
					$a.addClass('Enabled').removeClass('Disabled').removestyles(['background-color']);
					$postsarr.filter(o => o[4].is($a)).map(o => o[3]).forEach(function(e){ e.removestyles(['background-color']); });
				}
			break; }
			case 'Toggle-User': {
				// Toggle whether a given user's posts are enabled or disabled.
				if ($a.is('.Enabled')) {
					$a.addClass('Disabled').removeClass('Enabled').setcss('background-color: gray;');
					$optpane.find('.Toggle-Post[data-user="' + $a.attr('data-user') + '"]').removeClass('Enabled').addClass('Disabled').setcss('background-color: gray;');
					$postsarr.filter(o => o[1] == $a.attr('data-user')).map(o => o[3]).forEach(function(e){ e.setcss('background-color: red'); });
				}
				else {
					$a.addClass('Enabled').removeClass('Disabled').removestyles(['background-color']);
					$optpane.find('.Toggle-Post[data-user="' + $a.attr('data-user') + '"]').removeClass('Disabled').addClass('Enabled').removestyles(['background-color']);
					$postsarr.filter(o => o[1] == $a.attr('data-user')).map(o => o[3]).forEach(function(e){ e.removestyles(['background-color']); });
				}
			break; }
			default: {
			break; }
		}
	});
}, 500);