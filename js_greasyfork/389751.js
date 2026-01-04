// ==UserScript==
// @name         Google Search restore URLs (undo breadcrumbs)
// @namespace    https://greasyfork.org/en/users/27283-mutationobserver
// @version      2023.02.21v15
// @description  Brings back the full URLs in results.
// @author       MutationObserver
// @match        https://*.google.com/search?*
// @include     /^https?://(?:www|encrypted|ipv[46])\.google\.[^/]+/(?:$|[#?]|search|webhp)/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389751/Google%20Search%20restore%20URLs%20%28undo%20breadcrumbs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/389751/Google%20Search%20restore%20URLs%20%28undo%20breadcrumbs%29.meta.js
// ==/UserScript==

if (navigator.userAgent.includes("Firefox/")) document.body.classList.add("url-restore-userscript-FIREFOX");
if (document.querySelector('#rso img[src^="data:"][style*=width]')) document.body.classList.add("url-restore-userscript-2023q1");

restoreURLs();

function restoreURLs() {
	var results = document.querySelectorAll(".g");
	if (!results) {
		var results = document.querySelectorAll(".r");
		if (!results) return;
	}
	
	var linkFontSize;
	var originalWidths = [];
	var originalHeights_link = [];
	
	for (i=0; i < results.length; i++) {
		try {
			if (results[i].querySelector(".g a")) {
				var link = results[i].querySelector(".g a").getAttribute("href");
			}
			else {
				var link = results[i].querySelector(".rc a").getAttribute("href");
			}

			// Find options dropdown
			var dropdownArrow = results[i].querySelector('[aria-label="Result Options"]');
			if (dropdownArrow) { 
				dropdownArrow.parentElement.parentElement.parentElement.classList.add("url-restore-userscript-dropdownArrow");
			}
						
			// Calculate max dimensions
			var linkElems = results[i].querySelectorAll("cite");			
			var oldWidth = results[i].offsetWidth;
			var oldHeight_link = linkElems[0].offsetHeight;
			
			// Start replacing breadcrumbs
			var linkElem = linkElems[0];
			linkElems.forEach(function(e) {
				e.innerHTML = link;
			});
			linkElem.innerHTML = link;
			
			if (!linkFontSize) linkFontSize = window.getComputedStyle(linkElem, null).getPropertyValue('font-size');
			linkElem.setAttribute("data-full-link", link);
			
			// Fit to max dimensions
			var currentWidth = linkElem.offsetWidth;
			var currentHeight_link = linkElem.offsetHeight;
			if ( (currentWidth > oldWidth) || (currentHeight_link > oldHeight_link) ) {
				var link_truncated = urlTruncate(linkElem.innerHTML)
				linkElems.forEach(function(e) {
					e.innerHTML = link_truncated;
					e.setAttribute("data-trunc-link", link_truncated);
					e.parentElement.setAttribute("onmouseover", 'linkTruncationState(this, "off")');
					e.parentElement.setAttribute("onmouseout", 'linkTruncationState(this, "on")');
					e.classList.add("url-restore-userscript-truncated");
				});
				results[i].classList.add("url-restore-userscript-truncated");
			}
		}
		catch(e){ console.log("Google Search restore URLs: skipped result #" + i); continue; }
	}
	
	document.querySelector("body").insertAdjacentHTML("afterbegin", `
		<style id="url-restore-userscript">
			.url-restore-userscript-HOVER .url-restore-userscript-dropdownArrow {
				position: absolute;
			}

			cite[data-full-link] { color: green; }
			.url-restore-userscript-HOVER cite { background: white; }
			
			/* Firefox workaround (issue: some link <cites> are half-width) */
			.url-restore-userscript-FIREFOX .url-restore-userscript-dropdownArrow {
				position: absolute;
				right: -2em;
			}
			.url-restore-userscript-FIREFOX cite {
				display: inline-block;
				width: max-content;
			}
			
			.url-restore-userscript-2023q1 cite { max-width: unset!important; }
			.url-restore-userscript-2023q1 #rso a[data-ved] > div > span { margin-right: 2px; }
		</style>
	`);
}

function urlTruncate(url) {
    return url.substr(0, 37) + '...' + url.substr(url.length-37, url.length);
}

window.linkTruncationState = function(elem, state) {
	elems = elem.parentElement.parentElement.querySelectorAll("cite");
	switch(state) {
		case "off":
			var linkFull = elems[0].getAttribute("data-full-link");
			elems.forEach(function(e) {
				e.innerHTML = linkFull;
			});
			break;
		case "on":
			elems.forEach(function(e) {
				e.innerHTML = e.getAttribute("data-trunc-link");
			});
			break;
	}
	
	elems[0].parentElement.parentElement.parentElement.classList.toggle("url-restore-userscript-HOVER");
}