// ==UserScript==
// @name         AppliedRec
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copy applied position to clipboard
// @author       Hsiang
// @match        https://www.linkedin.com/*
// @match        https://www.glassdoor.com/Job/*
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/387314/AppliedRec.user.js
// @updateURL https://update.greasyfork.org/scripts/387314/AppliedRec.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var observer = new MutationObserver(resetTimer);
	var timer = setTimeout(action, 1000, observer); // wait for the page to stay still for 1 seconds
	observer.observe(document, {
		childList: true,
		subtree: true
	});

	function resetTimer(changes, observer) {
		clearTimeout(timer);
		timer = setTimeout(action, 1000, observer);
	}

	function action(o) {
		//o.disconnect();
		var appbtn = document.evaluate("//button[contains(@class,'jobs-apply-button--top-card')]|//a[contains(@class,'applyButton')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
		appbtn.addEventListener("click", mainfc);
	}
	// var observer = new MutationObserver(check);
	// observer.observe(document, {childList:true,subtree:true})
	// function check(changes, observer){
	// 	if(appbtn){
	// 		observer.disconnect;
	// 		//fire...
	// 		appbtn.addEventListener("click", mainfc);
	// 	}
	// }


	function mainfc() {
		var arr = [];
		var title;
		var company;
		var loc;
		var des;
		if (document.URL.match(/glassdoor/gi)) {
			title = document.evaluate("//h1[@class='jobTitle h2 strong']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).textContent;
			company = document.evaluate("//a[@class='plain strong empDetailsLink']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).textContent;
			loc = document.evaluate("//div[@class='compInfo']//span[2]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).textContent;
			des = document.evaluate("//div[@class='jobDescriptionContent desc']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).textContent;
		} else if (document.URL.match(/linkedin/gi)) {
			title = document.evaluate("//h1[@class='jobs-details-top-card__job-title t-20 t-black t-normal']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).textContent;
			company = document.evaluate("//h3[contains(@class,'jobs-details-top-card__company-info')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).textContent.match(/(?<=Company Name)[\w\W]+?(?=Company Location)/g)[0].trim();
			loc = document.evaluate("//h3[@class='jobs-details-top-card__company-info t-14 t-black--light t-normal mt1']/span[3]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).textContent;
			des = document.evaluate("//div[@id='job-details']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).textContent;
		}
		arr.push(getdate());
		arr.push(company);
		arr.push(title);
		arr.push(loc);
        arr.push('');
		arr.push(des);
		var apply = arr.join('\t');
		copyToClipboard(apply);
		//confirm('done');
	}

	function copyToClipboard(text) {
		var dummy = document.createElement("input");
		document.body.appendChild(dummy);
		dummy.setAttribute('value', text);
		dummy.select();
		document.execCommand("copy");
		document.body.removeChild(dummy);
	}

	function getdate() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1;
		var yyyy = today.getFullYear();
		if (dd < 10) {
			dd = '0' + dd;
		}
		if (mm < 10) {
			mm = '0' + mm;
		}
		today = mm + '/' + dd + '/' + yyyy;
		return today;
	}
})();