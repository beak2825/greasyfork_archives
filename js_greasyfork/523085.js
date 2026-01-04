// ==UserScript==
// @name         WaitForKeyElements3
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Find the specified element and execute subsequent code after finding it. 
// @author       Zero
// @grant        none
// ==/UserScript==

// Example usage:
// waitForKeyElements("div.comments", {"textContent":"xxx"}, commentCallbackFunction);
// function commentCallbackFunction(node) {
//     node.textContent = "This comment changed by waitForKeyElements().";
// }

function waitForKeyElements(
	selectorTxt,    // Required: The CSS selector string that specifies the desired element(s).
	actionFunction, // Required: The code to run when elements are found. It is passed the matched element.
	attributeFilter,// Optional: Filter the element by target attribute(s).
	bWaitOnce,      // Optional: If false, will continue to scan for new elements even after the first match is found.
	iframeSelector  // Optional: If set, identifies the iframe to search.
) {
	var targetNodes, btargetsFound = false;

	function querySelectorAllInIframe(iframe, selector) {
		var doc = iframe.contentDocument || iframe.contentWindow.document;
		return doc.querySelectorAll(selector);
	}

	if (typeof iframeSelector !== "undefined") {
		var iframe = document.querySelector(iframeSelector);
		if (iframe) {
			targetNodes = querySelectorAllInIframe(iframe, selectorTxt);
		}
	} else {
		targetNodes = document.querySelectorAll(selectorTxt);
	}

	if (targetNodes && targetNodes.length > 0) {
		btargetsFound = true;
		// Found target node(s). Go through each and act if they are new.
		targetNodes.forEach(function (node) {
		    if (attributeFilter){
		        for (let attr of Object.keys(attributeFilter)){
		            if(node[attr] != attributeFilter[attr]){
		                return ;
		            }
		        }
		    }
			var alreadyFound = node.dataset.alreadyFound || false;
			if (!alreadyFound) {
				// Call the payload function.
				var cancelFound = actionFunction ? actionFunction(node) : console.log(node);
				if (cancelFound) {
					btargetsFound = false;
				} else {
					node.dataset.alreadyFound = true;
				}
			}
		});
	}

	// Get the timer-control variable for this selector.
	var controlObj = waitForKeyElements.controlObj || {};
	var controlKey = selectorTxt.replace(/[^\w]/g, "_");
	var timeControl = controlObj[controlKey];

	// Now set or clear the timer as appropriate.
	if (btargetsFound && bWaitOnce && timeControl) {
		// The only condition where we need to clear the timer.
		clearInterval(timeControl);
		delete controlObj[controlKey];
	} else {
		// Set a timer, if needed.
		if (!timeControl) {
			timeControl = setInterval(function () {
				waitForKeyElements(selectorTxt, actionFunction, attributeFilter, bWaitOnce, iframeSelector);
			}, 300);
			controlObj[controlKey] = timeControl;
		}
	}
	waitForKeyElements.controlObj = controlObj;
};