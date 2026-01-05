// ==UserScript==
// @name        Pinterest - Remove "Picked For You" Completely
// @namespace   lokowebdesign.com
// @author      loko
// @description Remove "Picked For You" and "Sponsored" pins on your Pinterest home page
// @include     https://www.pinterest.com/
// @version     0.1.5
// @grant       none
// @compatible  firefox Firefox with GreaseMonkey
// @downloadURL https://update.greasyfork.org/scripts/11167/Pinterest%20-%20Remove%20%22Picked%20For%20You%22%20Completely.user.js
// @updateURL https://update.greasyfork.org/scripts/11167/Pinterest%20-%20Remove%20%22Picked%20For%20You%22%20Completely.meta.js
// ==/UserScript==


function HideNodeIfDecendantFound(node, decendantSelector)
{
	var target = node.querySelector(decendantSelector);
	if (target)
	{
		node.remove().style.display = 'none';
	}
}

// handle dynamically added items
var callback = function(allmutations)
{
	allmutations.map(function(mr)
	{
		for (var i = 0; i < mr.addedNodes.length; i++)
		{
			HideNodeIfDecendantFound(mr.addedNodes[i], '.hidePinInfo + .creditItem .creditName');
		}
	});
}


var pins = document.querySelectorAll('.HomePage .GridItems .item');

for (var i = 0; i < pins.length; ++i)
{
	HideNodeIfDecendantFound(pins[i], '.hidePinInfo + .creditItem .creditName');
}

var observer = new MutationObserver(callback);
var options = {
	// observes additions or deletion of child nodes
	'childList': true,
	// observes addition or deletion of “grandchild” nodes
	'subtree': true
}

var gridItems = document.querySelector('.HomePage .GridItems');

if (gridItems)
{
	// start watching for dynamically added stuff (handled in callback above)
	observer.observe(gridItems, options);
}
