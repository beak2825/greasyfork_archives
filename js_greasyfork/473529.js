// ==UserScript==
// @name        Disallow console.clear
// @author      brian6932
// @namespace   https://greasyfork.org/users/581142
// @namespace   https://github.com/brian6932
// @license     gpl-3.0-only
// @match       *://*/*
// @grant       none
// @version     1.0.3
// @description Self explanatory. As of Firefox 117, you can just use the `Enable persistent logs` feature in devtools, it now disables console.clear().
// @downloadURL https://update.greasyfork.org/scripts/473529/Disallow%20consoleclear.user.js
// @updateURL https://update.greasyfork.org/scripts/473529/Disallow%20consoleclear.meta.js
// ==/UserScript==

globalThis.Object.defineProperty(globalThis.console, 'clear', {
	__proto__: null,
	value: () => {},
	enumerable: true
})