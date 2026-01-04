// ==UserScript==
// @name        AO3: Dusty's General JS
// @namespace   adustyspectacle
// @description A Javascript companion for AO3: Dusty's General CSS
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @version     1.1
// @history     1.1 updated include urls
// @history     1.0 initial release
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31233/AO3%3A%20Dusty%27s%20General%20JS.user.js
// @updateURL https://update.greasyfork.org/scripts/31233/AO3%3A%20Dusty%27s%20General%20JS.meta.js
// ==/UserScript==

// OPTIONS
var CLONE_SUBSCRIBE = true;
var FANDOMLIST_COUNTERS = true;
var BLURB_TAGS_HELPER = true;
var UNCHECK_WARNS = true;
var SORT_DIR = true;
//

// HELPER FUNCTIONS
// Yay PlainJS
function insertAfter(el, referenceNode) {
	referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function insertBefore(el, referenceNode) {
	referenceNode.parentNode.insertBefore(el, referenceNode);
}

// CLONE SUBSCRIBE BUTTON
if (CLONE_SUBSCRIBE && document.querySelector('li.subscribe')) {
	var bottom_subscribe = document.querySelector('li.subscribe').cloneNode(true);
	insertBefore(bottom_subscribe, document.querySelector('#feedback ul.actions li:last-child'));
}

// COUNTERS IN FANDOM LISTINGS
if (FANDOMLIST_COUNTERS && location.pathname.startsWith("/media")) {
	var fandomlistings_countercss = document.createElement("style");

	fandomlistings_countercss.setAttribute('type', 'text/css');
	fandomlistings_countercss.innerHTML = `
  li.listbox ul.tags {
    counter-reset: fandom;
  }
`

	document.getElementsByTagName("head")[0].appendChild(fandomlistings_countercss);

	var fandomlistings_p = document.querySelector("#main.fandoms-index p");
	var fandomlistings_allcounter = document.createElement("a");
	var fandomlistings_sectioncounter = document.createElement("a");

	fandomlistings_allcounter.innerHTML = "[Total Fandoms Counter]";
	fandomlistings_sectioncounter.innerHTML = "[Fandoms By Section Counter]";

	fandomlistings_allcounter.setAttribute("style", "margin: 0 0.25em;");
	fandomlistings_sectioncounter.setAttribute("style", "margin: 0 0.25em; font-weight: bold;");

	fandomlistings_p.appendChild(fandomlistings_allcounter);
	fandomlistings_p.appendChild(fandomlistings_sectioncounter);

	fandomlistings_allcounter.onclick = function(event) {
		fandomlistings_allcounter.setAttribute("style", "margin: 0 0.25em; font-weight: bold;");
		fandomlistings_sectioncounter.setAttribute("style", "margin: 0 0.25em;");
		fandomlistings_countercss.innerHTML = `
  body {
    counter-reset: fandom;
  }
`
	}

	fandomlistings_sectioncounter.onclick = function(event) {
		fandomlistings_allcounter.setAttribute("style", "margin: 0 0.25em;");
		fandomlistings_sectioncounter.setAttribute("style", "margin: 0 0.25em; font-weight: bold;");
		fandomlistings_countercss.innerHTML = `
  li.listbox ul.tags {
    counter-reset: fandom;
  }
`
	}
}


// TAG SECTION IN BLURBS
// This is really just a thing to hide the separator on each tag type,
// and is only useful if you're using the CSS that's intended for this.
if (BLURB_TAGS_HELPER && document.querySelector('li.blurb')) {
	var blurb_tags = document.querySelectorAll('li.blurb ul.tags');

	for (i = 0; i < blurb_tags.length; i++) {
		var blurb_warns = blurb_tags[i].getElementsByClassName('warnings');
		var blurb_rels = blurb_tags[i].getElementsByClassName('relationships');
		var blurb_chars = blurb_tags[i].getElementsByClassName('characters');

		if (blurb_warns.length > 0) blurb_warns[blurb_warns.length - 1].setAttribute('class', 'warnings last');
		if (blurb_rels.length > 0) blurb_rels[blurb_rels.length - 1].setAttribute('class', 'relationships last');
		if (blurb_chars.length > 0) blurb_chars[blurb_chars.length - 1].setAttribute('class', 'characters last');
	}
}

// UNCHECK WARNINGS IN WORK AND BOOKMARK FILTER
// I am prone to accidentally selecting a rating when I didn't mean to, so yeah ^^;;;
if (UNCHECK_WARNS && document.querySelector('#work-filters')) {
	var ratingRadios = document.getElementsByName('work_search[rating_ids][]');
	var setCheck;

	for (i = 0; i < ratingRadios.length; i++) {
		ratingRadios[i].onclick = function() {
			if (setCheck != this) {
				setCheck = this;
			} else {
				this.checked = false;
				setCheck = null;
			}
		};
	}
}

// ADD SORT DIRECTION TO WORK FILTER
// Because I'm sad it's not there when it's in the work search page.
if (SORT_DIR && document.querySelector('#work-filters')) {
	var sortby_filter = document.querySelector('#work-filters dl.filters dd:nth-of-type(2)');

	var sortdir_filter_label = document.createElement('dt');
	var sortdir_filter = document.createElement('dd');

	sortdir_filter_label.innerHTML = '<label for="work_search_sort_direction">Sort direction</label>';

	sortdir_filter.innerHTML = '<select id="work_search_sort_direction" name="work_search[sort_direction]"><option value=""></option><option value="asc">Ascending</option><option value="desc">Descending</option></select>';

	insertAfter(sortdir_filter_label, sortby_filter);
	insertAfter(sortdir_filter, sortdir_filter_label);
}