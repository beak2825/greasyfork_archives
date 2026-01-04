// ==UserScript==
// @name         Translate Web Page
// @description  Translate Web Page.
// @version      0.1
// @author       to
// @namespace    https://github.com/to
// @license      MIT
// @match        *://*/*
//
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
//
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @downloadURL https://update.greasyfork.org/scripts/444171/Translate%20Web%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/444171/Translate%20Web%20Page.meta.js
// ==/UserScript==

const TO_LANG = 'ja';
const FROM_LANG = 'auto';

GM_registerMenuCommand('by Google', () => {
	GM_openInTab(
		location.href.replace(
			location.host,
			location.host.replaceAll('.', '-') + '.translate.goog') +
			`?_x_tr_sl=${FROM_LANG}&_x_tr_tl=${TO_LANG}&_x_tr_hl=${TO_LANG}`);
});