// ==UserScript==
// @name         Filmarks - Stop Spoiler Confirmation
// @description  Filmarks - Stop Spoiler Confirmation .
// @version      0.3
// @author       to
// @namespace    https://github.com/to
// @license      MIT
//
// @noframes
// @match        https://filmarks.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=filmarks.com
// 
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/495509/Filmarks%20-%20Stop%20Spoiler%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/495509/Filmarks%20-%20Stop%20Spoiler%20Confirmation.meta.js
// ==/UserScript==

const _confirm = unsafeWindow.confirm;
unsafeWindow.confirm =
	message => (/ネタバレ/).test(message) ?
		true :
		_confirm(message);