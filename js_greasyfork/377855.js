// ==UserScript==
// @name         Navigational Keyboard Shortcuts SFW
// @namespace    https://github.com/kittenparry/
// @version      1.10.1
// @description  Navigate through websites using keyboard buttons N/B for next/previous pages.
// @author       kittenparry
// @match        *://*/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/377855/Navigational%20Keyboard%20Shortcuts%20SFW.user.js
// @updateURL https://update.greasyfork.org/scripts/377855/Navigational%20Keyboard%20Shortcuts%20SFW.meta.js
// ==/UserScript==

/* LIST:
 * archived.moe
 * google.com
 * imgfrog.pw
 * metal-tracker.com
 * mods.factorio.com
 * nexusmods.com
 * nyaa.si
 * opengameart.org
 * rarbg.to || rarbgproxy.org || rarbg2020.org || rarbgget.org
 * reddit.com
 * stargate.fandom.com
 * steamcommunity.com/workshop/
 * steamgifts.com
 * trakt.tv
 * tumblr.com
 * xkcd.com
 */

/* CHANGELOG:
 * 1.10.1:    +rarbgget.org (rarbg.to alt)
 * 1.10:      +opengameart.org
 * 1.9:       +rarbg2020.org (rarbg.to alt) +xkcd.com
 * 1.8.1:     fix archived.moe first (& likely last) page navigation
 * 1.8:       +google.com | carry over the required extra functionality from nks.user.js
 * 1.7:       +archived.moe
 * 1.6:       +mods.factorio.com
 * 1.5:       +imgfrog.pw
 * 1.4.1:     fix trakt.tv back keybind not working
 * 1.4:       +stargate.fandom.com | navigates the episodes (preceded by & followed by)
 * 1.3:       +trakt.tv | only works in episode/season views | switch to semantic versioning so incrementing minor instead of patch part (https://semver.org/)
 * 1.2.3:     +rarbgproxy.org as an alternative to rarbg.to
 * 1.2.2:     +nexusmods.com | assignment is in the function
 * 1.2.1:     +steamcommunity.com/workshop/ | remove sfw from version naming
 * 1.2.sfw:   metal-tracker.com | btn case switch
 * 1.1.1.sfw: prevent execution of code when not on these sites
 * 1.1:       +nyaa.si
 * 1.0:       initial | rarbg.com reddit.com steamgifts.com tumblr.com
 */

check_nav_key_press = (e, prev, next, special = '') => {
	var type = e.target.getAttribute('type');
	var tag = e.target.tagName.toLowerCase();
	if (type != 'text' && tag != 'textarea' && type != 'search') {
		if (e.keyCode == 66) {
			if (special == 'nexusmods') {
				document.querySelector('li[class="prev"]').firstElementChild.click();
			} else if (special == 'btn' && prev != undefined) {
				document.querySelector(prev).click();
			} else if (special == 'url' && prev != undefined) {
				window.location = prev;
			} else if (special == '') {
				window.location = document.querySelector(prev).href;
			}
		} else if (e.keyCode == 78) {
			if (special == 'nexusmods') {
				document.querySelector('li[class="next"]').firstElementChild.click();
			} else if (special == 'btn' && next != undefined) {
				document.querySelector(next).click();
			} else if (special == 'url' && next != undefined) {
				window.location = next;
			} else if (special == '') {
				window.location = document.querySelector(next).href;
			}
		}
	}
};

// return the first result of a given tag with the text
// eg. ('a', 'prev') returns the anchor with 'prev' innerHTML
find_els_with_text = (tag, text) => {
	var els = document.getElementsByTagName(tag);
	var found = [];
	for (var i = 0; i < els.length; i++) {
		if (els[i].innerHTML == text) {
			found.push(els[i]);
		}
	}

	return found[0].href;
};

// return the href of given selector at idxth
get_sel_href = (sel, idx) => {
	return document.querySelectorAll(sel)[idx].href;
}

/* probably need a better way than simply .includes()
 * pqsel: previous query selector
 * nqsel: next query selector
 * nav_spcl: used when url is given instead of selector
 *	 check steamgifts example
 *	 also these include try/catch if they don't exist yet (first/last page)
 *	 !this section really looks ugly and repetitive
 */

var cur_loc = window.location.href;

if (cur_loc.includes('archived.moe')) {
	var nav_spcl = 'url';
	try {
		var pqsel = document.querySelector('li[class="prev"]').firstElementChild.href;
	} catch (e) {}
	try {
		var nqsel = document.querySelector('li[class="next"]').firstElementChild.href;
	} catch (e) {}
} else if (cur_loc.includes('google.com')) {
	var nav_spcl = 'url';
	try {
		var nqsel = get_sel_href('.pn', 1);
	} catch (e) {
		// if the first page
		var nqsel = get_sel_href('.pn', 0);
	}
	try {
		var pqsel = get_sel_href('.pn', 0);
		// if the first page
		if (nqsel == pqsel) {
			pqsel = null;
		}
	} catch (e) {}
} else if (cur_loc.includes('imgfrog.pw')) {
	var pqsel = 'a[data-pagination="prev"]';
	var nqsel = 'a[data-pagination="next"]';
} else if (cur_loc.includes('metal-tracker.com')) {
	var nav_spcl = 'btn';
	var pqsel = 'li[class="previous"]';
	var nqsel = 'li[class="next"]';
} else if (cur_loc.includes('mods.factorio.com')) {
	var nav_spcl = 'url';
	try {
		var pqsel = find_els_with_text('a', '« Previous');
	} catch (e) {}
	try {
		var nqsel = find_els_with_text('a', 'Next »');
	} catch (e) {}
} else if (cur_loc.includes('nexusmods.com')) {
	var nav_spcl = 'nexusmods';
	var pqsel = '';
	var nqsel = '';
} else if (cur_loc.includes('nyaa.si')) {
	var pqsel = 'a[rel="prev"]';
	var nqsel = 'a[rel="next"]';
} else if (cur_loc.includes('opengameart.org')) {
	var pqsel = 'a[title="Go to previous page"]';
	var nqsel = 'a[title="Go to next page"]';
} else if (cur_loc.includes('rarbg.to') || cur_loc.includes('rarbgproxy.org') || (cur_loc.includes('rarbg2020.org')) || (cur_loc.includes('rarbgget.org'))) {
	var pqsel = 'a[title="previous page"]';
	var nqsel = 'a[title="next page"]'
} else if (cur_loc.includes('reddit.com')) {
	var pqsel = 'a[rel="nofollow prev"]';
	var nqsel = 'a[rel="nofollow next"]';
} else if (cur_loc.includes('stargate.fandom.com')) {
	var nav_spcl = 'url';
	try {
		var pqsel = document.querySelector('div[data-source="preceded_by"]').lastElementChild.firstElementChild.href;
	} catch (e) {}
	try {
		var nqsel = document.querySelector('div[data-source="followed_by"]').lastElementChild.firstElementChild.href;
	} catch (e) {}
} else if (cur_loc.includes('steamcommunity.com/workshop/')) {
	var nav_spcl = 'url';
	try {
		var pqsel = document.querySelectorAll('.pagebtn')[0].href;
	} catch (e) {}
	try {
		var nqsel = document.querySelectorAll('.pagebtn')[1].href;
	} catch (e) {}
} else if (cur_loc.includes('steamgifts.com')) {
	var nav_spcl = 'url';
	try {
		var pqsel = document.querySelector('i[class="fa fa-angle-left"]').parentNode.href;
	} catch (e) {}
	try {
		var nqsel = document.querySelector('i[class="fa fa-angle-right"]').parentNode.href;
	} catch (e) {}
} else if (cur_loc.includes('trakt.tv')) {
	var pqsel = 'a[rel="prev"]';
	var nqsel = 'a[rel="next"]';
} else if (cur_loc.includes('tumblr.com')) {
	var pqsel = 'a[id="previous_page_link"]';
	var nqsel = 'a[id="next_page_link"]';
} else if (cur_loc.includes('xkcd.com')) {
	var pqsel = 'a[rel="prev"]';
	var nqsel = 'a[rel="next"]';
}

if (pqsel != undefined || nqsel != undefined) {
	try {
		if (nav_spcl) {
			window.addEventListener('keydown', (e) => check_nav_key_press(e, pqsel, nqsel, nav_spcl), false);
		} else {
			window.addEventListener('keydown', (e) => check_nav_key_press(e, pqsel, nqsel), false);
		}
	} catch (e) {}
}
