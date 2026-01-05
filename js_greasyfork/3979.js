// ==UserScript==
// @name         inthemix hax for extreme postlords
// @namespace    https://greasyfork.org/users/4295-rwslol
// @description  because posting is a cool hobby
// @license      WTFPL 2.0
// @include      http://www.inthemix.com.au/forum/*
// @require      http://code.jquery.com/jquery-1.11.1.min.js
// @version      3.1.1
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/3979/inthemix%20hax%20for%20extreme%20postlords.user.js
// @updateURL https://update.greasyfork.org/scripts/3979/inthemix%20hax%20for%20extreme%20postlords.meta.js
// ==/UserScript==

/*
// swagometer
dls = document.getElementsByTagName('dl');
for (i = 0; i < dls.length; i++) {
	// lol just do everything with innerHTML nobody will care
	m = dls[i].innerHTML.match(/<\/span>[\r\n 	]*([0-9,]+)[\r\n 	]*<\/div>/i);
	likes = parseInt(m[1].replace(',', ''));
	
	m = dls[i].innerHTML.match(/info-second-amt">[\r\n 	]*([0-9,]+)[\r\n 	]*<\/dd>/i);
	posts = parseInt(m[1].replace(',', ''));
	
	swag = parseInt(likes / posts * 100000) / 1000;
	
	dls[i].innerHTML += '<dt style="border: 0; border-top: 1px solid #ccc">Swag</dt><dd style="border: 0; border-top: 1px solid #ccc; width: 100px">' + swag + '%</dd>';
}
*/

var widescreen_default = true;

// cats
$(function() {
	var catHtml = function() {
		$(this).html('<img src="http://thecatapi.com/api/images/get?category=sunglasses#' + Math.random() + '">');
	};
	
	$('.post-content a[href="profile.php?do=editlist"]').closest('.post-content').each(catHtml);
	
	$('img[src="http://ic.i.tsatic-cdn.net/people/RunningWithScissors/avatar-150x150?revision=1752261"]').attr('src', 'http://i.imgur.com/JOOkdGF.gif');
});



// youtube & soundcloud unfucker
var objects = document.body.getElementsByTagName('object');
for (var i = 0; i < objects.length; i++) {
	var params = objects[i].getElementsByTagName('param');
	for (var j = 0; j < params.length; j++) {
		if (params[j].getAttribute('name') == 'movie') {
			var url = params[j].getAttribute('value').match(/^https?:\/\/(www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/i);
			
			if (url) {
				
				// youtube
				var src = 'https://www.youtube.com/embed/' + url[2] + '?rel=0';
				
				var start = params[j].getAttribute('value').match(/start=([0-9]+)/i);
				if (start) {
					src += '&start=' + start[1];
				}
				
				var iframe = document.createElement('iframe');
				if (GM_getValue('inthemix_widescreen', widescreen_default)) {
					iframe.setAttribute('width', 960);
					iframe.setAttribute('height', 720);
				} else {
					iframe.setAttribute('width', 800);
					iframe.setAttribute('height', 450);					
				}
				iframe.setAttribute('src', src);
				iframe.setAttribute('frameborder', 0);
				iframe.setAttribute('allowfullscreen', true);
				
				objects[i].parentNode.insertBefore(iframe, objects[i]);
				objects[i].parentNode.removeChild(objects[i]);
				i--; //lol
				break;				
				
			} else {
				var url = params[j].getAttribute('value').match(/^https?:\/\/player\.soundcloud\.com\/player\.swf\?url=(.*?)&/i);

				if (url) {
					
					// soundcloud
					var src = 'https://w.soundcloud.com/player/?url=' + encodeURI(url[1]) + '&amp;color=0082c8&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false';

					var iframe = document.createElement('iframe');
					iframe.setAttribute('width', '100%');
					iframe.setAttribute('height', 166);
					iframe.setAttribute('src', src);
					iframe.setAttribute('frameborder', 0);
					iframe.setAttribute('scrolling', 0);

					objects[i].parentNode.insertBefore(iframe, objects[i]);
					objects[i].parentNode.removeChild(objects[i]);
					i--; //lol
					break;
					
				}
			}
		}
	}
}

// css
var css = '.post tbody .post-user-stats .thanked-contain, .post tbody .post-user-stats .thanked { display: block; float: none; clear: both; width: 100%; background: none; color: #666; } ';
css += '.post tbody .post-user-stats dd { width: 100px } .post tbody .post-user-stats .thanked .arrow-left { display: none; } ';
css += '.post .post-content .post-message img { max-width: 100%; }';
if (GM_getValue('inthemix_widescreen', widescreen_default)) {
	css += '#site, #site-footer { max-width: none; }';
}
GM_addStyle(css);

// hax
function toggle_widescreen() {
	GM_setValue('inthemix_widescreen', !GM_getValue('inthemix_widescreen', widescreen_default));
	window.location.reload(false);
}
GM_registerMenuCommand('toggle widescreen', toggle_widescreen);