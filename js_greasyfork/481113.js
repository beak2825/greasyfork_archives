// ==UserScript==
// @name         Meta Snitch
// @namespace    https://github.com/appel/userscripts
// @version      0.2.1
// @description  Print page meta data like title, meta keywords, meta description, canonical URL, hreflang tags, OG tags and twitter cards to the console. Also detects different versions of Google Analytics and prints the measurement ID if it can find it.
// @author       Ap
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481113/Meta%20Snitch.user.js
// @updateURL https://update.greasyfork.org/scripts/481113/Meta%20Snitch.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const labelColor = "color: #00bcd4";
	const labelColorError = "color: #f44336";

	// Ensure that it's running in the top-level browsing context and not inside an iframe
	if (window !== window.top) {
		return;
	}

	// Only check html docs
	if (!document.contentType.startsWith("text/html")) {
		return;
	}

	function isDevToolsOpen() {
		const devtools = function () { };
		devtools.toString = function () {
			this.opened = true;
		};
		console.debug(devtools);
		return devtools.opened || false;
	}

	if (!isDevToolsOpen()) {
		return;
	}

	console.group("Meta Tags");

	// Print title
	console.log("%cPage Title%c " + document.title, labelColor, "");

	// Print meta keywords
	var metaKeywords = document.querySelector('meta[name="keywords"]');
	if (metaKeywords) {
		console.log("%cMeta Keywords%c " + metaKeywords.content, labelColor, "");
	}

	// Print meta description
	var metaDescription = document.querySelector('meta[name="description"]');
	if (metaDescription) {
		var fullDescription = metaDescription.content;
		var truncatedDescription = fullDescription.slice(0, 300);
		var displayDescription = fullDescription.length > 300 ? truncatedDescription + "..." : truncatedDescription;
		console.log("%cMeta Description%c " + displayDescription, labelColor, "");
	} else {
		console.log("%cNo meta description found.", labelColorError);
	}

	// Print canonical URL
	var canonical = document.querySelector('link[rel="canonical"]');
	if (canonical) {
		console.log("%cCanonical%c " + canonical.href, labelColor, "");
	} else {
		console.log("%cNo canonical URL found.", labelColorError);
	}

	// Print hreflang tags
	var hreflangTags = document.querySelectorAll('link[rel="alternate"][hreflang]');
	if (hreflangTags.length > 0) {
		hreflangTags.forEach(function (tag) {
			console.log("%cHreflang (" + tag.hreflang + ")%c " + tag.href, labelColor, "");
		});
	}

	console.groupEnd();


	function printOgTag(properties) {
		let ogTagsFound = false;
		properties.forEach((property) => {
			const ogTag = document.querySelector(`meta[property="og:${property}"]`);
			if (ogTag) {
				ogTagsFound = true;
				console.log(`%cog:${property}%c ${ogTag.content}`, labelColor, "");
			}
		});
	}

	function printTwitterTag(names) {
		let twitterTagsFound = false;
		names.forEach((name) => {
			const twitterTag = document.querySelector(`meta[name="twitter:${name}"]`);
			if (twitterTag) {
				twitterTagsFound = true;
				console.log(`%ctwitter:${name}%c ${twitterTag.content}`, labelColor, "");
			}
		});
	}

	console.groupCollapsed("Open Graph / Twitter");

	// Print Open Graph (OG) tags
	printOgTag(["title", "type", "image", "url", "description"]);

	// Print Twitter tags
	printTwitterTag(["card", "title", "description", "image"]);

	console.groupEnd(); // Open Graph / Twitter
	console.groupCollapsed("Structured data");

	// Print Microdata
	const microdataItems = document.querySelectorAll("[itemscope]");
	if (microdataItems.length > 0) {
		microdataItems.forEach((item, index) => {
			console.groupCollapsed(`%cItem (${index + 1})%c ${item.getAttribute("itemtype")}`, labelColor, "");
			const itemProps = item.querySelectorAll("[itemprop]");
			itemProps.forEach((prop) => {
				console.log(`%c${prop.getAttribute("itemprop")}%c ${prop.content || prop.textContent.trim()}`, labelColor, "");
			});
			console.groupEnd();
		});
	}  

	// Find all ld+json script tags
	const ldJsonScripts = document.querySelectorAll('script[type="application/ld+json"]');

	if (ldJsonScripts.length > 0) {
		ldJsonScripts.forEach((script, index) => {
			console.group(`%cLD+JSON (${index + 1})%c`, labelColor, "");
			try {
				// Parse and then stringify the JSON with indentation
				const json = JSON.parse(script.innerText);
				const formattedJson = JSON.stringify(json, null, 2);
				console.log(formattedJson);
			} catch (e) {
				console.log("%cError parsing JSON%c" + e.message, labelColorError, "");
			}
			console.groupEnd();
		});
	} else {
		console.log("%cNo LD+JSON scripts found.", labelColorError);
	}

	console.groupEnd(); // Structured data



	// Get all script tags
	const scripts = Array.from(document.getElementsByTagName("script"));

	// Regular expressions for different versions of Google Analytics
	const versions = [
		{
			key: "GASC",
			name: "Google Analytics Synchronous Code (ga.js/2009)",
			regex: /_gat\._getTracker\(["'](UA-[^"']+)["']\)/
		},
		{
			key: "GAAC",
			name: "Google Analytics Asynchronous Code (ga.js/2009)",
			regex: /_gaq\.push\(\['_setAccount', ['"](UA-[^"']+)['"]\]\)/
		},
		{
			key: "UAT",
			name: "Universal Analytics Tag (analytics.js/2013)",
			regex: /ga\('create', ['"](UA-[^"']+)['"],/
		},
		{
			key: "GST",
			name: "Global Site Tag (gtag.js/2017)",
			regex: /gtag\('config', ['"](UA-[^"']+)['"]/
		},
		{
			key: "GA4",
			name: "Google Analytics 4 (GA4/2020)",
			regex: /gtag\('config', ['"](G-[^"']+)['"]/
		},
		{
			key: "GTM",
			name: "Google Tag Manager",
			regex: /(GTM-\w+)/
		}
	];

	// Iterate over all script tags
	scripts.forEach((script) => {
		// Convert HTMLScriptElement to string
		const scriptString = script.innerHTML;

		// Iterate over all versions of Google Analytics
		versions.forEach((version) => {
			const match = scriptString.match(version.regex);
			if (match) {
				if (version.key === "GA4" || version.key === "GTM") {
					console.log(`[GA] %c${version.name}%c ${match[1]}`, labelColor, "");
				} else {
					console.log(`[GA] %c${version.name} ${match[1]}`, labelColorError);
				}
			}
		});
	});
})();
