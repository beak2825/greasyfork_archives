// ==UserScript==
// @name           E-H GIF Filter
// @description    Find which pages of a gallery are animated.
// @author         Hen-Tie
// @homepage       https://hen-tie.tumblr.com/
// @namespace      https://greasyfork.org/en/users/8336
// @include        /https?:\/\/(e-|ex)hentai\.org\/g\/.*/
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @icon           https://i.imgur.com/pMMVGRx.png
// @version        2.0
// @downloadURL https://update.greasyfork.org/scripts/377108/E-H%20GIF%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/377108/E-H%20GIF%20Filter.meta.js
// ==/UserScript==

/*───────────────┬────────────────┐
│     Action     │     Value      │
├────────────────┼────────────────┤
│ Highlight GIFs │ filterMode = 0 │
│ Only show GIFs │ filterMode = 1 │
│ Click to start │ alwaysOn = 0   │
│ Always enabled │ alwaysOn = 1   │
└────────────────┴───────────────*/
var filterMode = 0;
var alwaysOn = 0;

if ($('.gdtl img[title$=".gif"]').length) {
	var notGif = $('.gdtl img:not([title$=".gif"])');
	var checked = "";

	$('<style type="text/css">.gif-filter .gif-filter-hidden {display:none;} .gif-filter .gif-filter-highlight {opacity:.33;} body:not(.gif-filter) .gif-filter-count {display:none;}</style>').appendTo('head');

	if (alwaysOn) {
		$('body').addClass('gif-filter');
		checked = 'type="checkbox" checked';
	} else {
		checked = 'type="checkbox"';
	}

	$('#gdt').prepend('<div class="gif-filter-info" style="display:block; padding:0 0 .5em; width:100%; text-align:center;"><label><input ' + checked + ' class="gif-filter-toggle" style="top:0;"/> E-H GIF Filter</label></div>');
	if (filterMode) {
		notGif.closest('.gdtl').addClass('gif-filter-hidden');
		$('.gif-filter-info').append('<span class="gif-filter-count">—' + notGif.length + ' hidden</span>');
	} else {
		notGif.addClass('gif-filter-highlight');
	}
}

$('.gif-filter-toggle').click(function() {
	$('body').toggleClass('gif-filter');
});