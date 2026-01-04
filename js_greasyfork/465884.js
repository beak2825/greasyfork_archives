// ==UserScript==
// @name        Gyazo Redirector
// @author      brian6932
// @namespace   https://greasyfork.org/users/581142
// @namespace   https://github.com/brian6932
// @license     agpl-3.0-only
// @description Redirects gyazo.com -> i.gyazo.com
// @include     /^ht{2}ps:\/{2}gyazo\.com\/[\da-f]+$/
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @version     1.5
// @downloadURL https://update.greasyfork.org/scripts/465884/Gyazo%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/465884/Gyazo%20Redirector.meta.js
// ==/UserScript==
// jshint esversion: 11

'use-strict'
const
	redirect = () => GM_xmlhttpRequest({
		url: 'https://api.gyazo.com/api/oembed?url=' + globalThis.location.href,
		responseType: 'json',
		onload: _ => globalThis.location.href = _.response.url ?? (() => { throw globalThis.Error('OEmbed request failed') })()
	}),
	eventType = 'beforescriptexecute'

// Chromium and WebKit don't support this for some reason, and I cba to use a polyfill here.
if (GM_info.platform.browserName === 'Firefox' || globalThis.geteventTypeListeners?.(globalThis).hasOwnProperty(eventType))
	globalThis.addEventListener(eventType, redirect)
else
	redirect()
