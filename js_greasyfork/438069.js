// ==UserScript==
// @name          Anti Debug Protection
// @namespace     https://tampermonkey.net/
// @version       1.0.0
// @description   Disable debug protection process
// @license       MIT
// @icon          https://diep.io/favicon-96x96.png
// @author        PonyoLab
// @match         *://diep.io/*
// @grant         unsafeWindow
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/438069/Anti%20Debug%20Protection.user.js
// @updateURL https://update.greasyfork.org/scripts/438069/Anti%20Debug%20Protection.meta.js
// ==/UserScript==

unsafeWindow.Function.prototype.constructor = new Proxy(unsafeWindow.Function.prototype.constructor, {
	apply: function (target, thisArg, args) {
		if (args[0] === "debugger") {
			args[0] = "";
		}
		return target.apply(thisArg, args);
	}
});
