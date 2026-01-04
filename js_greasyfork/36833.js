// ==UserScript==
// @name         Reddit Peloton profile linkifier
// @namespace    http://www.tampermonkey.com
// @version      1.0
// @description  Turns the text of flair in reddit.com/r/pelotoncycle into links to Peloton Cycle / One Peloton profiles
// @author       Matt Taylor
// @match        http*://*.reddit.com/r/pelotoncycle/*
// @require      https://gitcdn.link/repo/fuzetsu/userscripts/b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/36833/Reddit%20Peloton%20profile%20linkifier.user.js
// @updateURL https://update.greasyfork.org/scripts/36833/Reddit%20Peloton%20profile%20linkifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
		.flair-link {
			text-decoration: none;
		}
		.flair-link:hover {
			text-decoration: underline;
		}
	`);

    const newLayoutId = '#SHORTCUT_FOCUSABLE_DIV';

   	waitForElems({
		sel: [
			// old reddit
			'span.flair',
			'span.Comment__authorFlair',

			// new reddit
			`${newLayoutId} span`
		].join(','),
		onmatch(flair) {
			if (flair.childNodes.length !== 1 || flair.childNodes[0].nodeType !== Node.TEXT_NODE || flair.closest('.DraftEditor-root')) return;
			const newhtml = flair.textContent.split(' ').map(
				segment => segment.match("")
					? `<a href="https://members.onepeloton.com/members/${segment}" target="_blank" rel="noopener noreferrer">${segment}</a>`
					: segment
			).join(' ');
			if (flair.innerHTML !== newhtml) flair.innerHTML = newhtml;
		}
	});
})();