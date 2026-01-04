// ==UserScript==
// @name         DDG Shortcuts
// @version      1.2.1
// @description  Adds DuckDuckGo keyboard shortcuts to other search engines
// @author       ReimarPB
// @match        *://*/*
// @namespace    https://reimarpb.com/userscripts
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/443930/DDG%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/443930/DDG%20Shortcuts.meta.js
// ==/UserScript==

(function() {

	// The CSS selectors for each search engine to get different parts of the page
	var selectors = {
		google: {
			input:            "input[name=q]",
			tab:              ".hdtb-mitem a, .hdtb-mitem.hdtb-msel, .T47uwc > a, .T47uwc > span",
			currentTab:       ".hdtb-mitem.hdtb-msel, .rQEFy.NZmxZe",
			resultHoverElem:  ".LC20lb.MBeuO.DKV0Md",
			resultHoverClass: "AraNOb",
			resultLink:       ".yuRUbf a",
		},
		startpage: {
			input:            "#q",
			tab:              ".inline-nav-menu__link__post-link, .css-dkelex",
			currentTab:       ".inline-nav-menu__link__post-link.inline-nav-menu__link__active, .css-156jy2m button",
			resultHoverElem:  ".w-gl__result",
			resultHoverClass: "linkHover",
			resultLink:       ".w-gl__result-title.result-link",
		},
		brave: {
			input:            "#searchbox",
			tab:              ".tab-item > a",
			currentTab:       ".tab-item.active > a",
			resultLink:       ".result-header",
		},
		searx: {
			input:            "#q",
			tab:              ".category > label, #categories > label",
			currentTab:       ".category input[type=checkbox]:checked + label, #categories input[type=checkbox]:checked + label",
			resultLink:       ".result > h3 > a, .result_header > a",
		}
	};

	// Get selectors for this search engine
	if (location.host.indexOf("www.google.") === 0 && location.pathname.indexOf("/search") === 0)
		selectors = selectors.google;
	else if (location.host === "www.startpage.com" && location.pathname == "/sp/search")
		selectors = selectors.startpage;
	else if (location.host === "search.brave.com" && ["/search", "/images", "/news", "/videos"].indexOf(location.pathname) !== -1)
		selectors = selectors.brave;
	else if (window.searx || window.searxng) {
		selectors = selectors.searx;
		document.getElementById("q").blur(); // Remove autofocus
	} else return;

	var tabs = document.querySelectorAll(selectors.tab);

	var resultIndex = -1;
	var tabIndex = [].indexOf.call(tabs, document.querySelector(selectors.currentTab));

	document.addEventListener("keydown", function(event) {

		// Return if input is focused
		if (document.querySelector("input:focus")) return;

		var preventDefault = true;
		if (selectors.resultHoverElem) var resultHoverElems = document.querySelectorAll(selectors.resultHoverElem);
		var resultLinks = document.querySelectorAll(selectors.resultLink);
		var searchField = document.querySelector(selectors.input);
		var currentResult = resultLinks[resultIndex === -1 ? 0 : resultIndex]; // Default to first result if none selected

		switch (event.key) {

			// Focus search field
			case "/":
			case "h":
				searchField.focus();
				searchField.select();
				break;

			// Domain search
			case "d":
				searchField.value = searchField.value
					.replace(/site:\S+/g, "")
					.replace(/\s+$/, "")
					+ " site:" + currentResult.host;
				searchField.form.submit();
				break;

			// Open link
			case "Enter":
			case "l":
			case "o":
				// Allow CTRL + Enter
				if (event.ctrlKey) {
					preventDefault = false;
					break;
				}
				location.href = currentResult.href;
				break;

			// Open link in new tab
			case "'":
			case "v":
				open(currentResult.href, "_blank");
				break;

			// Scroll to top
			case "t":
				scrollTo({ top: 0 });
				resultIndex = -1;
				break;

			// Move between results
			case "ArrowUp":
			case "k":
				if (resultIndex === 0) resultLinks[resultIndex--].blur();
				if (resultLinks[resultIndex - 1]) resultLinks[--resultIndex].focus();
				resultUpdated();
				break;
			case "ArrowDown":
			case "j":
				if (resultLinks[resultIndex + 1]) resultLinks[++resultIndex].focus();
				resultUpdated();
				break;
			case "m":
				resultIndex = 0;
				resultUpdated();
				break;

			// Change tabs
			case "ArrowLeft":
				if (tabs[tabIndex - 1]) tabs[tabIndex - 1].click();
				break;
			case "ArrowRight":
				if (tabs[tabIndex + 1]) tabs[tabIndex + 1].click();
				break;

			default:
				preventDefault = false;
		}

		if (preventDefault) event.preventDefault();

		// Called when the user presses down/up
		function resultUpdated() {

			// Remove old hover effect
			if (selectors.resultHoverClass) {
				var old = document.querySelector("." + selectors.resultHoverClass + selectors.resultHoverElem);
				if (old) old.classList.remove(selectors.resultHoverClass);
			}

			if (resultIndex >= 0) {
				// Scroll to result
				var elem = resultLinks[resultIndex], top = 0;
				do {
					top += elem.offsetTop || 0;
					elem = elem.offsetParent;
				} while(elem)
				scrollTo({ top: top - innerHeight / 2 });
				// Add hover effect
				if (resultHoverElems) resultHoverElems[resultIndex].classList.add(selectors.resultHoverClass);
			}
		}

	});

})();
