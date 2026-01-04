// ==UserScript==
// @name        Google Search URL Fixup Fork
// @namespace   https://greasyfork.org/users/581142
// @namespace   https://github.com/brian6932/gsearch-urlfix
// @license		MPL-2.0
// @include     /^https?:\/{2}w{3}\.google\.(?:a[delmstz]|b[aefgijsty]|c(?:o(?:m(?:\.(?:a[fgru]|b[dhnorz]|c[ouy]|do|e[cgt]|fj|g[hit]|hk|jm|k[hw]|l[by]|m[mtxy]|n[agip]|om|p[aeghkry]|qa|s[abglv]|t[jrw]|u[ay]|v[cn]))?|\.(?:ao|bw|c[kr]|i[dln]|jp|k[er]|ls|m[az]|nz|t[hz]|u[gkz]|v[ei]|z[amw]))|[adfghilmnvz])|d[ejkmz]|e[es]|f[imr]|g[aeglmry]|h[nrtu]|i[emqst]|j[eo]|k[giz]|l[aiktuv]|m[degklnuvw]|n[eloru]|p[lnst]|r[osuw]|s[cehikmnort]|t[dglmnot]|vu|ws)\/search\?/
// @icon        https://raw.githubusercontent.com/brian6932/gsearch-urlfix/master/icon.svg
// @grant       none
// @version     0.8.10
// @author      brian6932
// @description Sets the links in the JavaScript-free Google Basic Variant (gbv=1) search results to their original domains, which circumvents click routing through Google's query parameters, fixes browser history mismatch, and strips tracking query parameters.
// @downloadURL https://update.greasyfork.org/scripts/503151/Google%20Search%20URL%20Fixup%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/503151/Google%20Search%20URL%20Fixup%20Fork.meta.js
// ==/UserScript==
// jshint esversion: 11

let i = -1
const
	pathToParam = {
		__proto__: null,
		"/url": "q",
		"/imgres": "imgurl"
	},
	strippableParams = [
		"ei",
		"fbs",
		"sa",
		"sca_esv",
		"sca_upv",
		"source",
		"sxsrf",
		"ved",
	],
	{ links } = globalThis.document,
	fixLinks = () => {
		while (++i < links.length) {
			if (links[i].search === "" && links[i].host !== "www.google.com")
				continue

			const mappedParam = pathToParam[links[i].pathname]
			if (mappedParam !== undefined) {
				const encodedLink = new globalThis.URLSearchParams(links[i].search).get(mappedParam)
				if (encodedLink === null)
					continue

				if (!(links[i].href = globalThis.decodeURIComponent(encodedLink)).startsWith("https://www.google.com/"))
					continue
			}

			/*
			 * Should hit the following paths:
				  /
				  /maps
				  /preferences
				  /search
				  /setprefs
				  /travel
				  /webhp
			 */
			const link = new globalThis.URL(links[i].href)

			for (const param of strippableParams)
				link.searchParams.delete(param)

			links[i].href = link.toString()
		}
	}

// Invoke on load.
fixLinks()

// Reinvoke on body change.
new globalThis.MutationObserver(mutations => {
	for (const mutation of mutations)
		if (mutation.type === "childList")
			return fixLinks()
}).observe(globalThis.document.body, { __proto__: null, childList: true, subtree: true })
