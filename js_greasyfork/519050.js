// ==UserScript==
// @name         Reject cookie banners
// @namespace    http://tampermonkey.net/
// @version      1.7.3.2
// @description  Automatically rejects cookies and legitimate interest
// @author       https://greasyfork.org/en/users/85040-d-a-n
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519050/Reject%20cookie%20banners.user.js
// @updateURL https://update.greasyfork.org/scripts/519050/Reject%20cookie%20banners.meta.js
// ==/UserScript==

// MIT License

// Copyright(c) 2024-2025 Dan

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files(the "Software"), to deal
// 	in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// 	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// 	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function() {
	const rejections = [
		// common
		{
			// reject consent and reject legitimate interest
			// follows GPC
			banner: 'body > .fc-consent-root',
			btn: 'button[aria-label^="Manage"] > p',
			onBtnFound: function(btn) {
				return btn.innerHTML.match(/^Manage options$/) && btn;
			},
			toggles: '.fc-preference-slider input[aria-label^="Consent"]:checked, .fc-preference-slider input[aria-label^="Legitimate interest"]:checked',
			confirm: 'button[aria-label^="Confirm"] p',
			onConfirmFound: function(btn) {
				return btn.innerHTML.match(/^Confirm choices$/) && btn;
			}
		},
		{
			// more options, reject all, click legitimate interest then object all, save
			// follows GPC
			banner: 'body > .qc-cmp2-container',
			btn: '.qc-cmp2-summary-buttons > button[mode="secondary"][size="large"] > span',
			onBtnFound: function(btn) {
				return btn.innerHTML.match(/^MORE OPTIONS$/) && btn;
			},
			toggles: [
				{query: '.qc-cmp2-header-links > button[mode="link"][size="small"]', htmlMatch: /^REJECT ALL$/},
				{query: '.qc-cmp2-footer-links > button[mode="link"][size="small"]', htmlMatch: /^LEGITIMATE INTEREST$/},
				{query: '.qc-cmp2-header-links > button[mode="link"][size="small"]', htmlMatch: /^OBJECT ALL$/}
			],
			confirm: '.qc-cmp2-footer-links + .qc-cmp2-buttons-desktop button[mode="primary"][size="large"]',
			onConfirmFound: function(btn) {
				return btn.innerHTML.match(/^SAVE &amp; EXIT$/) && btn;
			}
		},
		{
			// only accept necessary cookies
			// stackexchange sites
			banner: 'body > #onetrust-consent-sdk',
			btn: '[aria-label="Cookie banner"] #onetrust-reject-all-handler'
		},
		{
			// LEARN MORE, Show Preferences, change all checked checkboxes to not checked, SAVE AND CLOSE
			// fandom
			// you need to actually need to scroll down the page for preferences to be changed
			// hence the while loop
			banner: 'body > div:has(div[data-tracking-opt-in-overlay])',
			btn: 'div[data-tracking-opt-in-learn-more]',
			onBtnFound: function(btn) {
				return btn.innerHTML.match(/^LEARN MORE$/) && btn;
			},
			toggles: [
				{query: 'div[class]', htmlMatch: /^\s*Show Preferences\s*<svg\s+/, queryAll: true},
				{query: 'input[id^="switch"][type="checkbox"]:checked', htmlMatch: /(^$|.)/, queryAll: true, onToggleFound: function(toggle, cookieNotice, toggleItemNo) {
					while (toggle.checked) {
						toggle.click();
					}
				}}
			],
			confirm: 'div[data-tracking-opt-in-save]',
			onConfirmFound: function(btn) {
				return btn.innerHTML.match(/^Save And Close$/) && btn;
			}
		},

		// linuxy
		// U
		{
			// manage settings, make sure all inputs are not checked
			banner: 'body > dialog.cookie-policy[open="true"]',
			btn: '#cookie-policy-content button',
			onBtnFound: function(btn) {
				return btn.innerHTML.match(/^Manage your tracker settings$/) && btn;
			},
			toggles: '#controls input[type="checkbox"]:checked',
			confirm: 'button',
			onConfirmFound: function(btn) {
				return btn.innerHTML.match(/^Save preferences$/) && btn;
			}
		},

		// news
		// B
		{
			// reject additional cookies
			banner: 'section[aria-labelledby="consent-banner-title"]',
			btn: 'div[class*="Options"] button',
			onBtnFound: function(btn) {
				return btn.innerHTML.match(/^Reject additional cookies$/) && btn;
			}
		},

		// weather
		// M
		{
			// (starts on How data is used) make sure cookies are rejected and disable legitimate interest, Save Preferences and Exit
			// no need to click Third party vendors because they correctly recognise legitimate interest rejected
			banner: 'body > div#ccc[aria-label="Cookie preferences"]',
			toggles: [
				{query: 'input[type="checkbox"]:checked', htmlMatch: /(^$|.)/, queryAll: true}
			],
			confirm: 'button#ccc-dismiss-button span',
			onConfirmFound: function(btn) {
				return btn.innerHTML.match(/^Save Preferences and Exit$/) && btn;
			}
		},
		// N
		{
			// click customize and reject all
			banner: 'body > .cmpwrapper',
			btn: 'div#cmpbox > div.cmpboxinner > div.cmpboxbtns > div.cmpmore > a.cmpmorelink.cmptxt_btn_custom',
			toggles: null,
			confirm: 'div#cmpbox > div.cmpboxinner > div.cmpboxbtnscustomchoices > a.cmpboxbtn.cmpboxbtnreject.cmpboxbtnrejectcustomchoices.cmptxt_btn_no'
		},

		// social media
		// most are hard to parse with just css selectors for the banner
		// or tell you to use browser controls
		// F
		{
			// decline optional cookies
			banner: 'body > div:has(> div + div[role="dialog"][aria-labelledby="manage_cookies_title"])',
			btn: 'div[aria-label="Decline optional cookies"][role="button"]'
		},

		// free to watch ad-supported tv streaming services
		// 4, U
		{
			// Manage, make sure all are off (they default to off anyway)
			banner: 'body > #cookie-consent-banner',
			btn: 'button[aria-label="Manage which purposes to accept cookies for."]',
			toggles: [
				{query: '[class$="cc-popup-absolute"] > [class$="__component"] > [class$="__header"] + [class*="__content-area"] > [class$="cc-accordion-container"] [class$="cc-accordion-item--header"] [role="switch"][aria-checked="true"]', htmlMatch: /(^$|.)/, queryAll: true}
			],
			confirm: 'button[aria-label="Save cookie preferences and continue"]'
		},
		// I
		{
			// MANAGE, make sure all are off (off automatically), SAVE & CLOSE
			banner: 'body > [class*="cookie-widget"][role="dialog"]:has([aria-label="Cookie Preferences"])',
			btn: '.cassie-pre-banner button#cassie-cookie-modal-manage-button',
			toggles: '.cassie-cookie-modal[role="dialog region"][aria-modal="true"] #cassie_consent_tab_cookies .cassie-cookie-modal--group-head-container .cassie-toggle-switch[role="switch"][aria-checked="true"]',
			confirm: 'button[aria-label="Save & close"]'
		},

		// uk supermarkets
		// T
		{
			// reject all. the Show purposes button does nothing, neither does the List of vendors
			banner: 'body div[data-mfe="mfe-header"] div[class*="mfe-header"]',
			btn: 'div[class*="consent-banner__buttons-container"] button',
			onBtnFound: function(btn) {
				return btn.innerHTML.match(/[>]\s*Reject all<\/span>$/) && btn;
			}
		},
		{
			// Manage Cookies - this opens __tealiumGDPRcpPrefs
			banner: 'body > #__tealiumGDPRecModal:has(.privacy_prompt_fadeout + .privacy_prompt_centre .privacy_prompt_footer)',
			btn: '#privacy-more-information.button',
			onBtnFound: function(btn) {
				return btn.innerHTML.match(/[>]\s*Manage Cookies<\/span>\s*$/) && btn;
			}
		},
		{
			// make sure all are off then Save preferences
			banner: 'body > #__tealiumGDPRcpPrefs:has(.privacy_prompt_fadeout + .categories_centre .consent_preferences .privacy_prompt_content)',
			toggles: '.table-wrapper table tr input.toggle[type="checkbox"]:checked',
			confirm: '#preferences_prompt_submit.button',
			onConfirmFound: function(btn) {
				return btn.innerHTML.match(/[>]\s*Save preferences<\/span>\s*$/) && btn;
			}
		}
	];

	// if same banner seen more than once, remove the banner instead of clicking buttons
	const timesSeenSameBanners = {};

	function sleep(ms) {
		// cookie banner not fully loaded when trying to select elements
		// so wait for a bit until it has

		return new Promise((resolve) => {
			setTimeout(() => resolve(), ms);
		})
	}

	function getBanner(cookieNotice) {
		const banner = document.querySelector(cookieNotice.banner);

		if (typeof cookieNotice.onBannerFound === 'function') {
			// onBannerFound for selecting when selectors arent enough

			return cookieNotice.onBannerFound(banner);
		}

		return banner;
	}

	async function getBtn(cookieNotice) {
		const fakeBtn = {click: function() {}};

		if (!cookieNotice.btn) {
			return fakeBtn;
		}

		const banner = getBanner(cookieNotice);

		if (!banner) {
			// somehow happens on at least one site where the banner suddenly disappears
			// possibly due to cursor or touch or resize events which change the DOM

			return fakeBtn;
		}

		if (typeof cookieNotice.onBtnFound === 'function') {
			// onBtnFound for selecting when selectors alone are not enough

			const btns = (banner.shadowRoot || banner).querySelectorAll(cookieNotice.btn);

			for (const btn of btns) {
				const ret = cookieNotice.onBtnFound(btn);

				if (ret) {
					return ret;
				}
			}
		}
		else {
			const btn = (banner.shadowRoot || banner).querySelector(cookieNotice.btn);

			if (btn) {
				return btn;
			}
		}

		// if made it down to here then btn does not exist, so wait and try again

		await sleep(10);

		return await getBtn(cookieNotice);
	}

	async function clickToggle(cookieNotice, toggleItemNo) {
		if (toggleItemNo >= cookieNotice.toggles.length) {
			return;
		}

		const toggleItem = cookieNotice.toggles[toggleItemNo];
		let banner = getBanner(cookieNotice);

		if (toggleItem.htmlMatch) {
			if (toggleItem.queryAll) {
				// forcefully wait for the cookie notice to load

				await sleep(2000);
				banner = getBanner(cookieNotice);
			}

			const toggles = (banner.shadowRoot || banner).querySelectorAll(toggleItem.query);

			for (const toggle of toggles) {
				if (toggle.innerHTML.match(toggleItem.htmlMatch)) {
					if (typeof toggleItem.onToggleFound === 'function') {
						await toggleItem.onToggleFound(toggle, cookieNotice, toggleItemNo);
					}
					else {
						toggle.click();
					}

					if (!toggleItem.queryAll) {
						break;
					}
				}
			}

			return await clickToggle(cookieNotice, toggleItemNo + 1);
		}
		else {
			const toggle = (banner.shadowRoot || banner).querySelector(toggleItem.query);

			if (toggle) {
				toggle.click();
				return await clickToggle(cookieNotice, toggleItemNo + 1);
			}
		}

		// if made it down to here then toggle does not exist, so wait then try again
		await sleep(10);
		await clickToggle(cookieNotice, toggleItemNo);
	}

	async function getConfirmBtn(cookieNotice) {
		const banner = getBanner(cookieNotice);

		if (typeof cookieNotice.onConfirmFound === 'function') {
			const btns = (banner.shadowRoot || banner).querySelectorAll(cookieNotice.confirm);

			for (const btn of btns) {
				const ret = cookieNotice.onConfirmFound(btn);

				if (ret) {
					return ret;
				}
			}
		}
		else {
			const btn = (banner.shadowRoot || banner).querySelector(cookieNotice.confirm);

			if (btn) {
				return btn;
			}
		}

		if (typeof cookieNotice.toggles === 'string') {
			// confirm button not loaded to go back and make sure that all toggles have been disabled
			clickToggle(cookieNotice, 0);
		}

		// if made it down to here then it does not exist, so wait then try again

		await sleep(10);

		return await getConfirmBtn(cookieNotice);
	}

	async function tryRejecting(cookieNotice) {
		if (!getBanner(cookieNotice)) {
			return;
		}

		if (!timesSeenSameBanners[cookieNotice.banner]) {
			timesSeenSameBanners[cookieNotice.banner] = 0;
		}

		if (timesSeenSameBanners[cookieNotice.banner] > 1) {
			// clicking buttons can cause cookie notice to appear again
			// in that case remove the banner without clicking buttons

			getBanner(cookieNotice).remove();

			return;
		}

		const btn = await getBtn(cookieNotice);

		const togglesIsString = typeof cookieNotice.toggles == 'string';
		const togglesIsArray = Array.isArray(cookieNotice.toggles);

		if (cookieNotice.toggles === null || togglesIsString || togglesIsArray) {
			btn.click();

			if (togglesIsString) {
				// if toggles arent loaded by the time the confirm button exists, toggles will be disabled

				const banner = getBanner(cookieNotice);

				(banner.shadowRoot || banner).querySelectorAll(cookieNotice.toggles).forEach(function(toggle) {
					toggle.click();
				});
			}
			else if (togglesIsArray) {
				// clicks all toggles in the exact order they appear in
				// for buttons like 'reject all' or 'object all' when they are actually provided

				await clickToggle(cookieNotice, 0);
			}

			if (cookieNotice.DONT_CLOSE) {
				return;
			}

			(await getConfirmBtn(cookieNotice)).click();
		}
		else {
			// some pages would constantly reload because of automatically clearing and rejecting cookies
			// so check if cookies are stored before trying to reject them

			if (document.cookie) {
				// reject cookies
				btn.click();
			}

			if (cookieNotice.DONT_CLOSE) {
				return;
			}

			// make sure there is no persistent banner
			const banner = getBanner(cookieNotice);

			if (banner) {
				// banner might be removed after clicking button
				banner.outerHTML = '';
			}
		}

		timesSeenSameBanners[cookieNotice.banner]++;
	}

	// stop checking for cookie banners after first 30 seconds of visiting a page
	// for performance/call-stack size reasons

	const endTime = new Date().getTime() + 30000;

	function rejectAll() {
		if (new Date().getTime() > endTime) {
			return;
		}

		for (let i = 0; i < rejections.length; i++) {
			tryRejecting(rejections[i], true);
		}

		// cookie banner may not have been created yet, try again
		setTimeout(rejectAll, 200);
	}

	rejectAll();
})();