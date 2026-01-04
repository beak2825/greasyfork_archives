// ==UserScript==
// @name        fal_rnd_HOJ
// @namespace   https://twitter.com/fal_rnd
// @version     0.2.4
// @description HOJの問題リストでsolvedを非表示にしたり
// @author      fal_rnd
// @include     https://hoj.hamako-ths.ed.jp/onlinejudge/problems
// @include     https://hoj.hamako-ths.ed.jp/onlinejudge/problems?*
// @include     https://hoj.hamako-ths.ed.jp/onlinejudge*/state*
// @supportURL  https://twitter.com/fal_rnd
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/371203/fal_rnd_HOJ.user.js
// @updateURL https://update.greasyfork.org/scripts/371203/fal_rnd_HOJ.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

jQuery(function($) {
	if (new RegExp("https://hoj.hamako-ths.ed.jp/onlinejudge/problems($|\\?.*)").test(location.href)) {
		problems($);
	}
	if (new RegExp("https://hoj.hamako-ths.ed.jp/onlinejudge/(contest/\\d+/)?state/\\d+").test(location.href)) {
		state_update($);
	}
	if (new RegExp("https://hoj.hamako-ths.ed.jp/onlinejudge/(contest/\\d+/)?state(\\?*|(/me*))").test(location.href)) {
		state_pageswitch($);
	}
});

function problems($) {
	const table = $('#head');
	const tablebody = table.children('tbody');
	const solved = tablebody.children('tr:has(.fa-check)');
	const solvedclone = solved.clone();

	$('#main > div > ul').clone().css('margin-bottom', '1em').insertBefore(table);

	$('#menu > div > ul')
			.append('<a></a>')
			.append('<li class="pure-menu-item""><a class="pure-menu-link" id="fal_rnd_splitsolved"><input type="checkbox"> solvedを隔離</a></li>')
			.append('<li class="pure-menu-item""><a class="pure-menu-link" id="fal_rnd_marksolved"><input type="checkbox"> solvedを黒塗り</a></li>');

	solvedclone.appendTo(tablebody).hide();

	set_splitsolved($, solved, solvedclone);
	set_marksolved($, solved, solvedclone);
}
function set_splitsolved($, solved, solvedclone) {
	const splitsolved = $('#fal_rnd_splitsolved>input');
	splitsolved.change(function() {
		const f = $(this).is(':checked');
		$.removeCookie('fal_rnd_splitsolved');
		$.cookie('fal_rnd_splitsolved', f ? 1 : 0);
		if (f) {
			solved.hide();
			solvedclone.show();
		} else {
			solved.show();
			solvedclone.hide();
		}
	});
	const cookie = $.cookie('fal_rnd_splitsolved');
	if (cookie) {
		splitsolved.prop('checked', cookie == 1).change();
	}
}
function set_marksolved($, solved, solvedclone) {
	const marksolved = $('#fal_rnd_marksolved>input');
	marksolved.change(function() {
		const f = $(this).is(':checked');
		$.cookie('fal_rnd_marksolved', f ? 1 : 0);
		if (f) {
			solved.css('background-color', 'gray');
			solvedclone.css('background-color', 'gray');
		} else {
			solved.css('background-color', 'white');
			solvedclone.css('background-color', 'white');
		}
	});
	const cookie = $.cookie('fal_rnd_marksolved');
	if (cookie) {
		marksolved.prop('checked', cookie == 1).change();
	}
}

function state_update($) {
	if ($('#main > div > table:nth-child(7) > tbody > tr:nth-child(5) > td:nth-child(2) > span[class="label label-warning"]').length > 0) {
		setTimeout(location.reload, 5000);
	}
}

function state_pageswitch($) {
	$('#main > div > div.pure-menu.pure-menu-open.pure-menu-horizontal > ul > li:nth-child(1) > a')
			.attr('href', location.href.replace(new RegExp("/me"), ""));
	$('#main > div > div.pure-menu.pure-menu-open.pure-menu-horizontal > ul > li:nth-child(2) > a')
			.attr('href', location.href.replace(new RegExp("/state(/me)?"), "/state/me"));
}
