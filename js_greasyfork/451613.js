// ==UserScript==
// @name         HoloLens Device Portal - Skip Confirmation
// @description  HoloLens Device Portal - Skip Confirmation.
// @version      0.1
// @namespace    https://github.com/to
// @license      MIT
//
// @include 
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.microsoft.com
// 
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/451613/HoloLens%20Device%20Portal%20-%20Skip%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/451613/HoloLens%20Device%20Portal%20-%20Skip%20Confirmation.meta.js
// ==/UserScript==

var skips = [
	'Are you sure you want to restart',
	'Are you sure you want to shutdown',
	'Permanently delete',
	'Do you want to close',
];
var _confirm = unsafeWindow.confirm;
unsafeWindow.confirm = (message) => {
	console.log(message);

	// 省略対象のメッセージか？
	if (skips.some(skip => message.startsWith(skip)))
		return true;

	return _confirm(message);
}
