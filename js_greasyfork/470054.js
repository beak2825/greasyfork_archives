// ==UserScript==
// @name           Tumblr: Post Reader Mode
// @namespace      https://github.com/w4tchdoge
// @version        1.0.0-20230703_152333
// @description    Add a clickable div element to a tumblr post to toggle a "Reader Mode" which removes the tags and related posts
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @exclude        http://www.tumblr.com/*
// @exclude        https://www.tumblr.com/*
// @match          *://*.tumblr.com/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// @grant          GM_registerMenuCommand
// @grant          GM.registerMenuCommand
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @noframes
// @license        AGPL-3.0-or-later
// @history        1.0.0 — Initial "publish" to my GitHub repo
// @downloadURL https://update.greasyfork.org/scripts/470054/Tumblr%3A%20Post%20Reader%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/470054/Tumblr%3A%20Post%20Reader%20Mode.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Don't run on frames or iframes -- taken from https://stackoverflow.com/a/1535421/11750206
	if (window.top != window.self) {
		return;
	}

	// Get tags element & related posts element
	var tags_Sec = document.querySelector('.tagged-page-cta');
	var related_posts_Sec = document.querySelector('.related-posts-wrapper');

	// Make the elements for toggling Reader Mode
	var toggle_RM_button = Object.assign(document.createElement('div'), {
		className: 'tumblr_RM_toggle_div',
		id: 'tumblr_RM_toggle_div',
		style: 'padding-bottom: 0.8rem',
		innerHTML: '<div style="font-size: 0.9rem; color: #bdb7af; display: flex; justify-content: flex-end;">Toggle Reader Mode</div>'
	});
	var RM_disabled = Object.assign(document.createElement('div'), {
		className: 'tumblr_RM_status_disabled',
		id: 'tumblr_RM_status_disabled',
		style: 'font-size: 0.9rem; display: flex; justify-content: flex-end; flex-direction: row; flex-wrap: nowrap;',
		innerHTML: '<div style="padding-right: 0.2rem; color: #bdb7af;">Reader Mode:</div><div style="color: #fd6666;">Disabled</div>'
	});
	var RM_enabled = Object.assign(document.createElement('div'), {
		className: 'tumblr_RM_status_enabled',
		id: 'tumblr_RM_status_enabled',
		style: 'font-size: 0.9rem; display: flex; justify-content: flex-end; flex-direction: row; flex-wrap: nowrap;',
		innerHTML: '<div style="padding-right: 0.2rem; color: #bdb7af;">Reader Mode:</div><div style="color: #6fff6f;">Enabled</div>'
	});

	// Append the disabled elem to the main toggle div as that is the default state
	toggle_RM_button.appendChild(RM_disabled);

	// Find element to add the button before
	var before_elem = document.querySelector('.main > article.active.exposed .post-wrapper.clearfix');

	// Add Reader Mode Toggle before the above element
	before_elem.before(toggle_RM_button);


	// Function for enabling "Reader Mode"
	function enable_ReaderMode() {
		let RM_dis_el = document.querySelector('#tumblr_RM_status_disabled');
		if (Boolean(RM_dis_el)) {
			RM_dis_el.replaceWith(RM_enabled);
		}
		tags_Sec.style.setProperty('display', 'none');
		related_posts_Sec.style.setProperty('display', 'none');
	}

	// Function for disabling "Reader Mode"
	function disable_ReaderMode() {
		let RM_en_el = document.querySelector('#tumblr_RM_status_enabled');
		if (Boolean(RM_en_el)) {
			RM_en_el.replaceWith(RM_disabled);
		}
		tags_Sec.style.removeProperty('display');
		related_posts_Sec.style.removeProperty('display');
	}

	// Function for toggling "Reader Mode"
	function toggle_ReaderMode() {
		if (Boolean(tags_Sec.style.display) == false || Boolean(related_posts_Sec.style.display) == false) {
			enable_ReaderMode();
		}
		else if (Boolean(tags_Sec.style.display) == true || Boolean(related_posts_Sec.style.display) == true) {
			disable_ReaderMode();
		}
	}

	// Make the toggle actually do the thing by listening for any clicks on the toggle div
	toggle_RM_button.addEventListener('click', function (event) {
		toggle_ReaderMode();
	});

	// Add a menu command just in case
	GM.registerMenuCommand('Toggle Tumblr "Reader Mode"', toggle_ReaderMode);
})();