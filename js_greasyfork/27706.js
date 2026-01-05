// ==UserScript==
// @name         block ads @ diablowiki.net
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  blocks dynamic ads on diablowiki.net
// @author       You
// @match        *://www.diablowiki.net/*
// @grant        none
// @run-at 		 document-end
// @downloadURL https://update.greasyfork.org/scripts/27706/block%20ads%20%40%20diablowikinet.user.js
// @updateURL https://update.greasyfork.org/scripts/27706/block%20ads%20%40%20diablowikinet.meta.js
// ==/UserScript==

(function() {
	'use strict';
	function removeAds(){
		var toRemove = [];
		var adImages = document.querySelectorAll('#ab-bg img, #bottom-abbr img, #background-min img, #abFooter img');
		for (var i = 0, len = adImages.length; i < len; ++i) {
			var adImage = adImages[i];
			adImage.src = "";
			toRemove.push(adImage.parentNode);
		}

		// remove ADVERTISEMENT block
		var boldTexts = document.getElementsByTagName('b');
		for (i = 0, len = boldTexts.length; i < len; ++i) {
			var boldText = boldTexts[i];
			if(boldText.innerHTML == "ADVERTISEMENT"){
				toRemove.push(boldText.parentNode);
			}
		}
		while(toRemove.length > 0){
			var toRemoveElement = toRemove.pop();
			toRemoveElement.parentNode.removeChild(toRemoveElement);
		}
	}

	removeAds();

	var observer = new MutationObserver(removeAds);
	var config = {childList: true, subtree: true};
	observer.observe(document.body, config);
})();