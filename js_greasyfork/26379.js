// ==UserScript==
// @name			code to video on darkwarez.pl
// @version			1.1
// @author			norbi1952
// @description		Zamiana linków do plików webm/mp4/ogg oraz streamable.com umieszczonych w tagu [code] na player
// @include			http://darkwarez.pl/*
// @include			https://darkwarez.pl/*
// @require			https://cdn.jsdelivr.net/jquery/3.1.1/jquery.min.js
// @namespace https://greasyfork.org/users/9446
// @downloadURL https://update.greasyfork.org/scripts/26379/code%20to%20video%20on%20darkwarezpl.user.js
// @updateURL https://update.greasyfork.org/scripts/26379/code%20to%20video%20on%20darkwarezpl.meta.js
// ==/UserScript==
$(document).ready(function() {
	$('td.code').each(function() {
		var str = $(this).text();
		var codeTag = $(this).closest('table');

		var streamableRegex = /(?:http|https):\/\/streamable\.com\/(?:[a-z][a-z0-9_]*)/gi;
		var isStreamable = streamableRegex.test(str);

		var regex = /(?:http|https):\/\/.+(?:webm|mp4|ogg)\b/gi;
		var newStr = str;

		var replaced = str.search(regex) >= 0;

		if(replaced) {
			newStr = newStr.replace(regex, '<br><video controls muted preload="metadata" style="max-width: 100%;"><source src="$&">Your browser does not support the video tag.</video><br><br>');
		}

		if(isStreamable) {
			newStr = newStr.replace(streamableRegex, '<div style="width: 100%; height: 0px; position: relative; padding-bottom: 56.200%;"><iframe src="$&" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen scrolling="no" style="width: 100%; height: 100%; position: absolute;"></iframe><script async defer src="https://v.embedcdn.com/embed.js"></script></div><br>').replace(RegExp('streamable.com/', 'g'), 'streamable.com/e/');
		}

		if(isStreamable || replaced) {
			codeTag.replaceWith('<div id="player" style="font-size: 12px; line-height: 18px;">' + newStr + '</div>');
		}
	});
});