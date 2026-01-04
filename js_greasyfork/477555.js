// ==UserScript==
// @name         PreviewLinks
// @namespace    https://jirehlov.com
// @version      0.2.8
// @description  Preview links and show their titles with caching for 3 days
// @author       Jirehlov
// @include      /^https?://(bangumi\.tv|bgm\.tv|chii\.in)/.*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477555/PreviewLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/477555/PreviewLinks.meta.js
// ==/UserScript==

(function () {
	"use strict";
	const CACHE_PREFIX = "PLinksCache_";
	const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000;
	const getTitleFromLink = async link => {
		const linkURL = link.href;
		const cachedTitle = getCachedTitle(linkURL);
		if (cachedTitle !== null) {
			return cachedTitle;
		}
		try {
			let title = "";
			if (link.textContent === link.href) {
				const response = await fetch(linkURL);
				const data = await response.text();
				const parser = new DOMParser();
				const htmlDoc = parser.parseFromString(data, "text/html");
				const titleElement = htmlDoc.querySelector("h1.nameSingle a");
				const blogTitleElement = htmlDoc.querySelector("h1");
				const epTitleElement = htmlDoc.querySelector("h2.title");
				title = titleElement ? titleElement.textContent : "";
				const chineseName = titleElement ? titleElement.getAttribute("title") : "";
				if (chineseName && (link.href.includes("subject") || link.href.includes("ep"))) {
					title += title ? ` | ${ chineseName }` : chineseName;
				}
				if (link.href.includes("ep") && epTitleElement) {
					epTitleElement.querySelectorAll("small").forEach(small => small.remove());
					const epTitle = epTitleElement.textContent.trim();
					title += title ? ` | ${ epTitle }` : epTitle;
				}
				if ((link.href.includes("blog") || link.href.includes("topic") || link.href.includes("index")) && blogTitleElement) {
					title = blogTitleElement.textContent.trim();
				}
				const prefix = link.href.match(/\/(subject\/topic|subject|ep|character|person|blog|group\/topic|index)\/[^/]+/);
				const prefixText = prefix ? `[${ prefix[1] }] ` : "";
				title = prefixText + title;
				cacheTitle(linkURL, title);
				return title;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			return null;
		}
	};
	const cacheTitle = (url, title) => {
		const cacheKey = CACHE_PREFIX + url;
		const cacheValue = {
			title: title,
			timestamp: Date.now()
		};
		localStorage.setItem(cacheKey, JSON.stringify(cacheValue));
	};
	const getCachedTitle = url => {
		const cacheKey = CACHE_PREFIX + url;
		const cacheValue = localStorage.getItem(cacheKey);
		if (cacheValue !== null) {
			const {title, timestamp} = JSON.parse(cacheValue);
			if (Date.now() - timestamp < CACHE_EXPIRATION) {
				return title;
			} else {
				localStorage.removeItem(cacheKey);
			}
		}
		return null;
	};
	const domains = [
		"bgm.tv",
		"chii.in",
		"bangumi.tv"
	];
	const paths = [
		"subject/",
		"ep/",
		"character/",
		"person/",
		"blog/",
		"group/topic/",
		"index/"
	];
	const selectors = [];
	domains.forEach(domain => {
		paths.forEach(path => {
			selectors.push(`a[href^="https://${ domain }/${ path }"]`);
		});
	});
	const allLinks = document.querySelectorAll(selectors.join(","));
	const fetchAndReplaceLinkText = () => {
		let index = 0;
		const processNextLink = async () => {
			if (index < allLinks.length) {
				const link = allLinks[index];
				const cachedTitle = getCachedTitle(link.href);
				if (link.textContent === link.href) {
					if (cachedTitle) {
						link.textContent = cachedTitle;
					} else {
						const title = await getTitleFromLink(link);
						if (title) {
							link.textContent = title;
						}
						setTimeout(processNextLink, 3000);
						return;
					}
				}
				index++;
				processNextLink();
			}
		};
		processNextLink();
	};
	fetchAndReplaceLinkText();
}());