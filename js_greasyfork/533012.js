// ==UserScript==
// @name        GitLab Dark Theme
// @namespace   https://greasyfork.org/users/581142
// @include     /^https?:\/{2}(?:git(?:\.(?:linux-kernel\.at|coop|fosscommunity\.in|jami\.net|oeru\.org|pleroma\.social)|lab\.(?:com|(?:gnome|haskell|trisquel|torproject|isc)\.org|e\.foundation|freedesktop\.org)|gud\.io)|(?:code\.(?:briarproject|videolan)|0xacab|salsa\.debian|framagit|dev\.gajim)\.org||lab\.libreho\.st)\//
// @grant       none
// @version     1.0.6
// @author      brian6932
// @run-at      document-start
// @license		MPL-2.0
// @description Forces GitLab to use it's dark mode when not logged in.
// @downloadURL https://update.greasyfork.org/scripts/533012/GitLab%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/533012/GitLab%20Dark%20Theme.meta.js
// ==/UserScript==
// jshint esversion: 11

// I can't do anything about the initial screen flash.
const
	dark = () => {
		if (!globalThis.document.cookie.includes('gitlab_user=true')) {
			const oldGon = globalThis.gon
			globalThis.Object.defineProperties(
				globalThis.Object.defineProperty(globalThis, 'gon', {
					__proto__: null,
					value: { __proto__: null },
					enumerable: true,
					configurable: true
				}).gon,
				{
					__proto__: null,
					user_color_scheme: {
						__proto__: null,
						value: 'dark',
						enumerable: true
					},
					user_color_mode: {
						__proto__: null,
						value: 'gl-system',
						enumerable: true
					}
				}
			)

			if (oldGon)
				for (const prop in oldGon)
					if (!(prop in globalThis.gon))
						globalThis.gon[prop] = oldGon[prop]

			globalThis.document.documentElement.classList.add('gl-dark')
		}
	},
	eventType = 'beforescriptexecute'

// Chromium and WebKit don't support this for some reason, and I cba to use a polyfill here.
if (GM_info.platform.browserName === 'Firefox' || globalThis.geteventTypeListeners?.(globalThis).hasOwnProperty(eventType))
	globalThis.addEventListener(eventType, dark)
else
	dark()