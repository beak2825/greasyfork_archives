// ==UserScript==
// @name        Pinterest - Remove Picked For You and Sponsored Pins
// @namespace   valacar.pinterest.remove-picked-for-you
// @author      valacar
// @description Remove "Picked For You" and "Sponsored" advertisement pins on Pinterest
// @match       https://www.pinterest.com/
// @match       https://www.pinterest.com/categories/*/
// @match       https://www.pinterest.com/search/pins/*
// @match       https://www.pinterest.com/pin/*
// @version     0.2.3
// @grant       GM_addStyle
// @compatible  firefox Firefox with GreaseMonkey
// @compatible  chrome Chrome with TamperMonkey
// @downloadURL https://update.greasyfork.org/scripts/19631/Pinterest%20-%20Remove%20Picked%20For%20You%20and%20Sponsored%20Pins.user.js
// @updateURL https://update.greasyfork.org/scripts/19631/Pinterest%20-%20Remove%20Picked%20For%20You%20and%20Sponsored%20Pins.meta.js
// ==/UserScript==

function hidePin(el)
{
	if (el)
	{
		el.style.display = 'none';
	}
}

function hideBadPins(baseNode) {
	var pins = baseNode.querySelectorAll('.item');
	var pickedCount = 0;
	var promotedCount = 0;

	for (var i = 0; i < pins.length; ++i)
	{
		var currentPin = pins[i];

		var creditFooter = currentPin.querySelector('.creditFooter');
		if (creditFooter && creditFooter.textContent.indexOf('Picked for you') !== -1 )
		{
			hidePin(currentPin);
			pickedCount++;
		}

		var creditName = currentPin.querySelector('.creditName');
		if (creditName && creditName.textContent.indexOf('Promoted by') !== -1 )
		{
			hidePin(currentPin);
			promotedCount++;
		}
	}

	//console.log(':: pickedCount: ' + pickedCount + ', promotedCount: ' + promotedCount)
}

// handle dynamically added items
var mutationCallback = function(allmutations) {
	allmutations.map(function(mr) {
		if (mr.addedNodes.length > 0)
		{
			var targetClass = mr.target.className;
			if (targetClass && targetClass.indexOf('GridItems') !== -1)
			{
				//console.log(':: GridItems changed');
				hideBadPins(mr.target);
			}
		}
	});
};


var gridItems = document.querySelector('.mainContainer');
var observer = new MutationObserver(mutationCallback);
var options = {
	// observes additions or deletion of child nodes
	'childList': true,
	// observes addition or deletion of “grandchild” nodes
	'subtree': true
};

if (gridItems)
{
	// handle static content
	hideBadPins(gridItems);

	// start watching for dynamically added stuff (handled in mutationCallback above)
	observer.observe(gridItems, options);
}