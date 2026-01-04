// ==UserScript==
// @name			Larger Action Buttons
// @namespace			http://tampermonkey.net/
// @version			0.1
// @description			Enlarges action buttons for replies and likes on Anilist
// @match			https://anilist.co/*
// @icon			https://anilist.co/favicon.ico
// @grant			GM_addStyle
// @license			MIT
// @downloadURL https://update.greasyfork.org/scripts/518768/Larger%20Action%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/518768/Larger%20Action%20Buttons.meta.js
// ==/UserScript==

GM_addStyle ( `
/* Edit numerical value below to change the button size */

.action.replies, .actions .button, .actions .count {
	font-size: 1.8rem !important;
}
` );