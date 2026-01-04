// ==UserScript==
// @name         Navigational Keyboard Shortcuts
// @namespace    https://github.com/kittenparry/
// @version      1.27.1
// @description  Navigate through websites using keyboard buttons N/B for next/previous pages.
// @author       kittenparry
// @match        *://*/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/377854/Navigational%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/377854/Navigational%20Keyboard%20Shortcuts.meta.js
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

 * NSFW:
 * 420chan.org
 * 8muses.com
 * *.booru.org
 * camshowhub.to
 * camvault.xyz
 * camwhores.tv
 * chaturbate.com
 * coedcherry.com
 * erome.com
 * f95zone.com
 * forum.sexy-egirls.com
 * forum.thotsbay.com
 * forums.sexy-youtubers.com
 * forums.socialmediagirls.com
 * hanime.tv
 * hentai-foundry.com
 * hongfire.com
 * javbus.com
 * kitty-kats.net
 * loverslab.com
 * meitulu.com
 * meituri.com
 * nhentai.net
 * nobodyhome.tv
 * pixietrixcomix.com
 * planetsuzy.org
 * pornbay.org
 * pornhub.com
 * recurbate.com
 * rec-tube.com
 * shadbase.com
 * simpcity.su
 * sinnercomics.com
 * thothub.tv
 * totempole666.com
 * xbunker.nu
 * xbunker.su
 * yiff.party/activity
 */

/* CHANGELOG:
 * 1.27.1: +xbunker.nu (xbunker.su alt/ rather updated domain)
 * 1.27:   +xbunker.su +simpcity.su +forums.socialmediagirls.com
 * 1.26.1: +rarbgget.org (rarbg.to alt)
 * 1.26:   +forum.thotsbay.com
 * 1.25:   +opengameart.org
 * 1.24:   +rarbg2020.org (rarbg.to alt) +xkcd.com +pixietrixcomix.com
 * 1.23:   +forums.sexy-youtubers.com +forum.sexy-egirls.com
 * 1.22:   +420chan.org
 * 1.21:   +totempole666.com
 * 1.20.1: fix archived.moe first (& likely last) page navigation
 * 1.20:   +loverslab.com | could probably be better with a special of its own similar to nexusmods
 * 1.19:   +pornhub.com
 * 1.18:   +google.com
 * 1.17:   +archived.moe
 * 1.16:   +kitty-kats.net
 * 1.15:   +mods.factorio.com
 * 1.14:   +imgfrog.pw
 * 1.13.1: lack of special handling similar to focus_input_key script (fik.user.js)
 * 1.13:   +*.booru.org
 * 1.12:   +camshowhub.to
 * 1.11.1: fix trakt.tv back keybind not working
 * 1.11:   +stargate.fandom.com | navigates the episodes (preceded by & followed by)
 * 1.10:   +trakt.tv +camvault.xyz | trakt.tv only works in episode/season views
 * 1.9.2:  additional functions to ease repetition & meituri/meitulu isn't special anymore
 * 1.9.1:  ability to navigate to first/last pages on pornbay.org
 * 1.9:    +rec-tube.com
 * 1.8:    +erome.com +recurbate.com +hanime.tv
 * 1.7.1:  +nobodyhome.tv instead of nobodyhome.ga (domain change)
 * 1.7:    +planetsuzy.org
 * 1.6.1:  +rarbgproxy.org as an alternative to rarbg.to
 * 1.6:    +chaturbate.com
 * 1.5:    +meituri.com +meitulu.com | they work the same way so a simple or will do
 * 1.4:    +javbus.com | switch to semantic versioning so incrementing minor instead of patch part (https://semver.org/)
 * 1.3.7:  +thothub.tv
 * 1.3.6:  +nexusmods.com | a special case similar to camwhores.tv
 * 1.3.5:  +yiff.party/activity | with some clunky mechanics
 * 1.3.4:  +steamcommunity.com/workshop/
 * 1.3.3:  +f95zone.to/latest/ | change the original link to .to as well
 * 1.3.2:  +metal-tracker.com | btn case i wanted to use in camwhores.tv
 * 1.3.1:  +shadbase.com
 * 1.3:    +camwhores.tv | element needs to be reassigned each time so it's in the function
 * 1.2.4:  +8muses.com
 * 1.2.3:  +nobodyhome.ga
 * 1.2.2:  +hongfire.com
 * 1.2.1:  prevent execution of code when not on these sites
 * 1.2:    +f95zone.com
 * 1.1:    +nyaa.si +coedcherry.com
 * 1.0:    initial | rarbg.com reddit.com steamgifts.com tumblr.com
 *           & hentai-foundry.com nhentai.net pornbay.org sinnercomics.com
 */

check_nav_key_press = (e, prev, next, special) => {
	var type = e.target.getAttribute('type');
	var tag = e.target.tagName.toLowerCase();
	if (type != 'text' && tag != 'textarea' && type != 'search') {
		if (e.keyCode == 66) {
			if (special == 'camwhores') {
				document.querySelector('li[class="page-current"]').previousElementSibling.firstElementChild.click();
			} else if (special == 'nexusmods') {
				document.querySelector('li[class="prev"]').firstElementChild.click();
			} else if (special == 'hanime') {
				sel_and_click('.pagination__navigation', 0);
			} else if (special == 'btn' && prev != undefined) {
				document.querySelector(prev).click();
			} else if (special == 'url' && prev != undefined) {
				window.location = prev;
			} else if (special == '') {
				window.location = get_query_href(prev);
			}
		} else if (e.keyCode == 78) {
			if (special == 'camwhores') {
				document.querySelector('li[class="page-current"]').nextElementSibling.firstElementChild.click();
			} else if (special == 'nexusmods') {
				document.querySelector('li[class="next"]').firstElementChild.click();
			} else if (special == 'hanime') {
				sel_and_click('.pagination__navigation', 3);
			} else if (special == 'btn' && next != undefined) {
				document.querySelector(next).click();
			} else if (special == 'url' && next != undefined) {
				window.location = next;
			} else if (special == '') {
				window.location = get_query_href(next);
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

// return the href of given selector
get_query_href = (sel) => {
	return document.querySelector(sel).href;
};

// click the idxth element of given selector
sel_and_click = (sel, idx) => {
	document.querySelectorAll(sel)[idx].click();
};

// return the href of given selector at idxth
get_sel_href = (sel, idx) => {
	return document.querySelectorAll(sel)[idx].href;
};

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
		var pqsel = get_sel_href('.pagebtn', 0);
	} catch (e) {}
	try {
		var nqsel = get_sel_href('.pagebtn', 1);
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
	/* * * * * * * *
	 * * * * * * * *
	 * NSFW BELOW  *
	 * * * * * * * *
	 * * * * * * * */
} else if (cur_loc.includes('420chan.org')) {
	var nav_spcl = 'url';
	try {
		var pqsel = find_els_with_text('a', '« Previous');
	} catch (e) {}
	try {
		var nqsel = find_els_with_text('a', 'Next »');
	} catch (e) {}
} else if (cur_loc.includes('8muses.com')) {
	var pqsel = 'a[class="pageNav-jump pageNav-jump--prev"]';
	var nqsel = 'a[class="pageNav-jump pageNav-jump--next"]';
} else if (cur_loc.includes('.booru.org')) {
	var pqsel = 'a[alt="back"]';
	var nqsel = 'a[alt="next"]';
} else if (cur_loc.includes('camshowhub.to')) {
	var pqsel = 'a[title="Previous page"]';
	var nqsel = 'a[title="Next page"]';
} else if (cur_loc.includes('camvault.xyz')) {
	var pqsel = 'a[rel="prev"]';
	var nqsel = 'a[rel="next"]';
} else if (cur_loc.includes('camwhores.tv')) {
	var nav_spcl = 'camwhores';
	var pqsel = '';
	var nqsel = '';
} else if (cur_loc.includes('chaturbate.com')) {
	var pqsel = 'a[class="prev endless_page_link"]';
	var nqsel = 'a[class="next endless_page_link"]';
} else if (cur_loc.includes('coedcherry.com')) {
	var pqsel = 'a[rel="prev"]';
	var nqsel = 'a[rel="next"]';
} else if (cur_loc.includes('erome.com')) {
	var pqsel = 'a[rel="prev"]';
	var nqsel = 'a[rel="next"]';
} else if (cur_loc.includes('f95zone.to/latest/')) {
	// something else for "/pages/latest/"
	var pqsel = 'a[class="nav_prev"]';
	var nqsel = 'a[class="nav_next"]';
} else if (cur_loc.includes('f95zone.to')) {
	// for only threads/forums
	// something else is required for /pages/latest/
	var pqsel = 'a[class="pageNav-jump pageNav-jump--prev"]';
	var nqsel = 'a[class="pageNav-jump pageNav-jump--next"]';
} else if (cur_loc.includes('hanime.tv')) {
	var nav_spcl = 'hanime'
	var pqsel = '';
	var nqsel = '';
} else if (cur_loc.includes('hentai-foundry.com')) {
	var nav_spcl = 'url';
	try {
		var pqsel = document.querySelector('li[class="previous"]').firstChild.href;
	} catch (e) {}
	try {
		var nqsel = document.querySelector('li[class="next"]').firstChild.href;
	} catch (e) {}
} else if (cur_loc.includes('hongfire.com')) {
	var pqsel = 'a[class="js-pagenav-button js-pagenav-prev-button b-button b-button--secondary js-shrink-event-child"]';
	var nqsel = 'a[class="js-pagenav-button js-pagenav-next-button b-button b-button--secondary js-shrink-event-child"]';
} else if (cur_loc.includes('javbus.com')) {
	var pqsel = 'a[id="pre"]';
	var nqsel = 'a[id="next"]';
} else if (cur_loc.includes('kitty-kats.net')) {
	var pqsel = 'a[class="pageNav-jump pageNav-jump--prev"]';
	var nqsel = 'a[class="pageNav-jump pageNav-jump--next"]';
} else if (cur_loc.includes('loverslab.com')) {
	var pqsel = 'a[rel="prev"]';
	var nqsel = 'a[rel="next"]';
} else if (cur_loc.includes('meituri.com') || cur_loc.includes('meitulu.com')) {
	var nav_spcl = 'url';
	try {
		var pqsel = get_sel_href('.a1', 0);
	} catch (e) {}
	try {
		var nqsel = get_sel_href('.a1', 1);
	} catch (e) {}
} else if (cur_loc.includes('nhentai.net')) {
	var pqsel = 'a[class="previous"]';
	var nqsel = 'a[class="next"]';
} else if (cur_loc.includes('nobodyhome.tv')) {
	var pqsel = 'a[class="pagination_previous"]';
	var nqsel = 'a[class="pagination_next"]';
} else if (cur_loc.includes('pixietrixcomix.com')) {
	var pqsel = 'a[rel="prev"]';
	var nqsel = 'a[rel="next"]';
} else if (cur_loc.includes('planetsuzy.org')) {
	var pqsel = 'a[rel="prev"]';
	var nqsel = 'a[rel="next"]';
} else if (cur_loc.includes('pornbay.org')) {
	var nav_spcl = 'url';
	try {
		try {
			var pqsel = get_query_href('a[class="pager pager_prev"]');
		} catch (e) {
			var pqsel = get_query_href('a[class="pager pager_first"]');
		}
	} catch (e) {}
	try {
		try {
			var nqsel = get_query_href('a[class="pager pager_next"]');
		} catch (e) {
			var nqsel = get_query_href('a[class="pager pager_last"]');
		}
	} catch (e) {}
} else if (cur_loc.includes('pornhub.com')) {
	var nav_spcl = 'url';
	try {
		var pqsel = document.querySelector('li[class="page_previous alpha"]').firstElementChild.href;
	} catch (e) {}
	try {
		var nqsel = document.querySelector('li[class="page_next omega"]').firstElementChild.href;
	} catch (e) {}
} else if (cur_loc.includes('recurbate.com')) {
	var pqsel = 'a[aria-label="Previous"]';
	var nqsel = 'a[aria-label="Next"]';
} else if (cur_loc.includes('rec-tube.com')) {
	var nav_spcl = 'url';
	try {
		try {
			var pqsel = find_els_with_text('a', 'Prev Page');
		} catch (e) {
			var pqsel = find_els_with_text('a', 'First Page')
		}
	} catch (e) {}
	try {
		try {
			var nqsel = find_els_with_text('a', 'Next Page');
		} catch (e) {
			var nqsel = find_els_with_text('a', 'Last Page')
		}
	} catch (e) {}
} else if (cur_loc.includes('shadbase.com')) {
	var pqsel = 'a[class="navi navi-prev"]';
	var nqsel = 'a[class="navi navi-next"]';
} else if (cur_loc.includes('sinnercomics.com')) {
	var pqsel = 'a[class="comic-nav-base comic-nav-previous"]';
	var nqsel = 'a[class="comic-nav-base comic-nav-next"]';
} else if (cur_loc.includes('thothub.tv') || cur_loc.includes('forums.sexy-youtubers.com') || cur_loc.includes('forum.sexy-egirls.com') || cur_loc.includes('forum.thotsbay.com') || cur_loc.includes('xbunker.su') || cur_loc.includes('simpcity.su') || cur_loc.includes('forums.socialmediagirls.com') || cur_loc.includes('xbunker.nu')) {
	var pqsel = 'a[class="pageNav-jump pageNav-jump--prev"]';
	var nqsel = 'a[class="pageNav-jump pageNav-jump--next"]';
} else if (cur_loc.includes('totempole666.com')) {
	var pqsel = 'a[class="navi comic-nav-previous navi-prev"]';
	var nqsel = 'a[class="navi comic-nav-next navi-next"]';
} else if (cur_loc.includes('yiff.party/activity')) {
	var nav_spcl = 'url';
	try {
		var pqsel = find_els_with_text('a', 'prev');
	} catch (e) {}
	try {
		var nqsel = find_els_with_text('a', 'next');
	} catch (e) {}
}

if (pqsel != undefined || nqsel != undefined) {
	try {
		if (!nav_spcl) {
			var nav_spcl = '';
		}
		window.addEventListener('keydown', (e) => check_nav_key_press(e, pqsel, nqsel, nav_spcl), false);
	} catch (e) {}
}
