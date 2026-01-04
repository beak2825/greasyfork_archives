// ==UserScript==
// @name         No-price package filter
// @namespace    https://greasyfork.org/en/users/738914-ibreakeverything
// @version      2024-02-06.1
// @description  Filter out subs on pricechanges with non-zero new price. Just click the "Recent price changes" title.
// @author       iBreakEverything
// @match        https://steamdb.info/pricechanges/
// @icon         https://steamdb.info/static/logos/vector_prefers_schema.svg
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/486789/No-price%20package%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/486789/No-price%20package%20filter.meta.js
// ==/UserScript==

(function() {
    const ANCHOR_SELECTOR = '.pre-table-title';
    (new MutationObserver((changes, observer) => check(changes, observer, ANCHOR_SELECTOR, main))).observe(document, {childList: true, subtree: true});
    
    function check(changes, observer, target, f) {
    	if (document.querySelector(target)) {
    		observer.disconnect();
    		f();
    	}
    }
    
    // Clicky title for trigger
    function main() {
    	document.querySelector(ANCHOR_SELECTOR).addEventListener('click', () => {showAll();});
    }
    
    function showAll() {
    	// Show 1k entries
    	const changeEvent = document.createEvent("HTMLEvents");
    	changeEvent.initEvent("change", false, true);
    	const entryCountSelect = document.querySelectorAll('select')[1];
    	entryCountSelect.selectedIndex = 4;
    	entryCountSelect.dispatchEvent(changeEvent);
    
        (new MutationObserver((changes, observer) => check(changes, observer, '.package', filterApps))).observe(document, {childList: true, subtree: true});
    }
    
    // Filter apps with new non-zero cost
    function filterApps() {
    	const tableRows = document.querySelectorAll('.package');
    	for(const row of tableRows) {
    		if (row.querySelectorAll('.b')[1].innerText != '—') {
    			row.hidden = true;
    		}
    	}
    }
})();