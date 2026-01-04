// ==UserScript==
// @name         Discord Tweaks
// @namespace    https://greasyfork.org/en/users/8615-joeytwiddle
// @version      0.1.9
// @description  Reduce gap between messages, optionally unbrighten name of selected channel
// @author       joeytwiddle
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/453436/Discord%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/453436/Discord%20Tweaks.meta.js
// ==/UserScript==

(function() {
	'use strict';

	//// Options

	// Around 21/10/2022 Discord put a larger vertical gap between messages.
	// his reduces the gap size similar to how it was before.
	const reduceGapBetweenMessages = false; // Turned off while I try Appearance > Compact Mode.  I also see some settings in Discord we could play with.

	// When a channel has activity (new messages), Discord makes the name of that channel bold and white, which is fine.
	// But Discord also does that for the selected channel, which makes it look like it has new activity, when maybe it doesn't.
	// I can't stand that behaviour, so I disable it.
	const doNotBrightenSelectedChannel = true;

	// It turns out that on Windows, my Discord tab was zoomed to 70%, although I'm not sure how, because that wasn't in zoomValues.  Was it copying the zoom from Linux?
	const usePreferredFont = false; // navigator.userAgent.match(/Linux/);

	const giveTextInputBoxADarkBackground = true;

	//// End Options

	//

	if (reduceGapBetweenMessages) {
		GM_addStyle(`
			/* Original fix for 21/10/2022 */
			.group-spacing-16 .groupStart-3Mlgv1 {
				margin: 0.25em;
			}
			/* New CSS classes.  It looks like [role=article] will be the most resilient. I haven't seen it used for any other elements on a standard page, but it could be used in some Discord UI / menus. */
			[role=article], .message-2CShn3, .cozy-VmLDNB, .zalgo-26OfGz {
				padding-top: 0rem !important;
				padding-bottom: 0rem !important;
				margin-top: 0.05rem !important;
			}
		`);
	}

	if (doNotBrightenSelectedChannel) {
		// The problem is this CSS rule, specifically the .modeSelected selector, which highlights the currently selected channel the same as channels with unread activity.
		/*
			.modeConnected-NrO4cP .name-28HaxV,
			.modeConnected-NrO4cP:hover .name-28HaxV,
			.modeSelected-3DmyhH .name-28HaxV,
			.modeSelected-3DmyhH:hover .name-28HaxV,
			.modeUnread-3Cxepe .name-28HaxV,
			.modeUnread-3Cxepe:hover .name-28HaxV,
			.notInteractive-2tFrlE.modeConnected-NrO4cP .name-28HaxV,
			.notInteractive-2tFrlE.modeSelected-3DmyhH .name-28HaxV {
				color: var(--interactive-active);
			}
		*/

		// Let's try to fix it
		GM_addStyle(`
			.modeSelected-3DmyhH .name-28HaxV {
				color: var(--channels-default);
			}
			/* But if it really IS unread, then we will brighten the channel name */
			.modeSelected-3DmyhH.modeUnread-3Cxepe .name-28HaxV {
				color: var(--interactive-active);
			}
		`);
	}

	if (usePreferredFont) {
		// TODO: Isn't `font-family` set to `inherit` for this selector?  If so, we should just set this rule on `body`, to override `--font-primary` for the entire page.
		// I note that Windows uses "gg sans", but "Noto Sans" also looks ok for me (slightly more dense and maybe slighly thicker)
		GM_addStyle(`
			a, abbr, acronym, address, applet, big, blockquote, body, caption, cite, code, dd, del, dfn, div, dl, dt, em, fieldset, form, h1, h2, h3, h4, h5, h6, html, iframe, img, ins, kbd, label, legend, li, object, ol, p, pre, q, s, samp, small, span, strike, strong, table, tbody, td, tfoot, th, thead, tr, tt, ul, var {
				font-family: "Bitstream Vera Sans", "Sans", "Open Sans", "gg sans","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
			}
			/*
			html {
				font-size: 91%;
			}
			*/
		`);
		//const fontScale = '91%';    // when using Firefox with zoom 80%
		const fontScale = '102%';   // when using Firefox with zoom 67%
		document.firstElementChild.style.fontSize = fontScale;
		window.addEventListener('focus', () => { setTimeout(() => { document.firstElementChild.style.fontSize = fontScale; }, 1); })
		window.addEventListener('blur', () => { setTimeout(() => { document.firstElementChild.style.fontSize = fontScale; }, 1); })
	}

	if (giveTextInputBoxADarkBackground) {
		GM_addStyle(`
			/*
			The text input box used this (quite light):
				background: var(--bg-overlay-3,var(--channeltextarea-background));
				background: hsl(225, 6.5%, 23.5%);
			The search textbox used this (nicely dark):
				background: var(--bg-overlay-3,var(--background-tertiary));
				background: hsl(225, 6.5%, 12.5%);
			*/
			/* But we will do something different, for both: slightly dark when unfocused, quite dark when focused */
			/* Old selector, no longer working:
			.channelTextArea-1FufC0 .scrollableContainer-15eg7h,
			.searchBar-jGtisZ {
			*/
			/* This new selector might last a bit longer than the class, but it requires !important, and I couldn't find a new selector for the search box */
			main > form > div > div,
			.searchBar_e0c60b {
				background: hsl(225, 6.5%, 18%) !important;
			}
			main > form > div > div:focus-within,
			.searchBar_e0c60b:focus-within {
				background: hsl(225, 6.5%, 17%) !important;
			}
		`);
	}
})();
