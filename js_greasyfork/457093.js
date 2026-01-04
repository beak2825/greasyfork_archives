// ==UserScript==
// @name         Reset to Clear Font
// @description  Reset to Clear Font.
// @version      0.1
// @author       to
// @namespace    https://github.com/to
// @license      MIT
// 
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fonts.google.com
//
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/457093/Reset%20to%20Clear%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/457093/Reset%20to%20Clear%20Font.meta.js
// ==/UserScript==

const style = `
* {
  font-family : "BIZ UDPGothic", メイリオ, Meiryo, verdana, sans-serif !important;
}`;
window.addEventListener('keydown', e => {
	if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() == 'f')
		GM_addStyle(style);
});