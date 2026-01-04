// ==UserScript==
// @name			Copy Options on ComicVine
// @namespace		https://izaiah.carrd.co/
// @version			0.1
// @description		Allow some options for copy-pasting contents of a thread.
// @author			Izaiah Thera
// @match			https://comicvine.gamespot.com/forums/*
// @icon			https://comicvine.gamespot.com/a/bundles/comicvinesite/images/favicon.ico
// @grant			GM_addStyle
// @grant			GM_xmlhttpRequest
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @run-at			document-start
// @downloadURL https://update.greasyfork.org/scripts/511669/Copy%20Options%20on%20ComicVine.user.js
// @updateURL https://update.greasyfork.org/scripts/511669/Copy%20Options%20on%20ComicVine.meta.js
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

//After half a second has passed, run this...
setTimeout(function(){
	if (window.top != window.self) { return; }
	var $optpane = '';
	if ($('.js-message').length) {
		//If the page is a thread (containing at least one .js-message element), do the following...

		//Creates a button and inserts it at the forum bar at the top of the thread page.
		var $copyoptionstoggle = $('<a class="Copy-Options-Toggle btn btn-primary btn-mini" style="font-weight: 700; font-style: italic;"><span>Toggle View of Copy Options</span></a>');
		$('.forum-bar').eq(0).append($copyoptionstoggle);

		// This creates an options pane.
		$optpane = $(`<div class="Copy-Options-Inner" style="width: 50vw;">
<span class="Draggable"><a class="Drag-This" title="Hold to drag the options pane to where on the screen you'd prefer it." style="background-color: aqua;">↕️&#xFE0F;</a><a class="Undrag-This" title="Click to reattach this pane to the top of the thread." style="background-color: red;">⚓&#xFE0F;</a></span><br/>
Click on a username or a post on the lists below to enable or disable them. Ctrl + Click on a post link to scroll to it.
<h4>Users:</h4> <div class="Users"></div>
<h4>Posts:</h4> <div class="Posts" style="height: 100px; overflow-y: scroll;"></div>
<h4><a class="Update-Content">Update</a>:</h4>
Click "Update" to generate a block of text according to the settings.<br/><br/>
<textarea class="Text-Content-Output" style="color: black; min-height: 100px;"></textarea>
</div>`);
		var $copyoptionsouter = $('<div class="Copy-Options-Outer" style="display: none; margin: 5px; padding: 5px; background-color: #ecedee; border: 1px solid #d1d4d6;"></div>').append($optpane);
		$optpane.find('.Drag-This, .Undrag-This').setcss('display: inline-block; color: black; line-height: 1.5em; font-size: 1.5em; height: 30px; width: 30px; margin: 0.1em; vertical-align: middle; text-align: center; border-radius: 0.3em; position: relative; user-select: none;');

		//This inserts the options pane onto the page.
		$('.js-forum-block').eq(0).before($copyoptionsouter);

		// Allows the options pane to be dragged.
		dragElement($('.Copy-Options-Inner')[0], $('.Copy-Options-Outer .Copy-Options-Inner .Draggable')[0]);

		// Now, go through every message on the page and do the following...
		$('.js-message').each(function(i,e){
			var $post = $(this);
			var $user = $post.find('.message-title > .message-user').eq(0);
			var $username = $user.text();

			// Acquire the contents of the post and trim it into a markdown-readable format.
			var $content = $post.find('.message-content').eq(0).html();
			$content = $('<div>' + $content + '</div>');
			$content.children('blockquote').each(function(i,ee){
				$(ee).find('blockquote').remove();
				$(ee).find('span').toArray().filter(o => o.innerHTML.trim() == '').forEach(function(oi){ $(oi).remove(); });
				$(ee).html($(ee).html().replace(/<strong>(.*?)<\/strong> said:\s*/gm,'').replace(/<p>\s*<\p>/gm,'').split(/\r?\n|\r|\n|<br>/g).filter(o => o.trim() != '').map(o => '> ' + o).join('\n'));
				$(ee).find('p').toArray().filter(o => o.innerHTML.trim() == '').forEach(function(oi){ $(oi).remove(); });
			});
			$content.find('img').remove();
			$content = $content.html().replace(/<h([1-6])>(.*?)<\/h\1>/g, (match, level, content) => {
					return `${'#'.repeat(level)} ${content.trim()}`;
				});
			$content = $content
				.replace(/<blockquote>(.*?)<\/blockquote>/g,'$1\n')
				.replace(/<br>/g,'\n')
				.replace(/<img (.*?)>/g,'')
				.replace(/<\/p>/g,'\n\n')
				.replace(/<p>/g,'')
				.replace(/<span data-embed-type="spoiler">(.*?)<\/span>/g,'~~$1~~')
				//.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')
				.replace(/<(i|em)>(.*?)<\/\1>/g, '*$2*')
				.replace(/<(b|strong)>(.*?)<\/\1>/g, '**$2**');
				//.replace(/<blockquote>(.*?)<\/blockquote>/g,'> $1\n');

			// The number of the given post.
			var $num = $post.find('.message-title > a[href*="#"]').length ? $post.find('.message-title > a[href*="#"]').eq(0).text() : '#0';

			// Creates buttons for the posts and the users to put in the options pane. If the user is already present there, the button is not added.
			var $postbtn = $('<a class="Toggle-Post Enabled btn btn-primary" style="margin: 2px; padding: 2px 4px;" data-user="' + $username + '">' + $num + '. ' + $username + '</a>');
			var $userbtn = $('<a class="Toggle-User Enabled btn btn-primary" style="margin: 2px; padding: 2px;" data-user="' + $username + '">' + $username + '</a>');

			// Add the post to the $postsarr array. That will allow it to be accessed elsewhere in the script.
			$postsarr.push([$num, $username, $('<div>' + $content + '</div>'), $post, $postbtn]);
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
				console.log($postsarr.filter(o => o[4].is('.Enabled')).map(o => o[4]));
				var $updatedarr = $postsarr.filter(o => o[4].is('.Enabled')).map(o => '# ' + o[1] + '\n\n' + o[2].text()).join('\n\n\n');
				$('.Copy-Options-Outer textarea.Text-Content-Output').eq(0).val($updatedarr);
			break; }
			case 'Drag-This': {
				// If the options pane isn't currently detached, make it detached...
				if (!$optpane.is('.Detached')) {
					$optpane.addClass('Detached');
					$optpane.css('top', '100px').css('left', '100px');
					$optpane.setcss('position: fixed; z-index: 11; background-color: rgba(255,255,255,1); border: 1px solid gray; overflow: unset;');
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