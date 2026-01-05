// ==UserScript==
// @name           BvS Thousand Separator
// @namespace      BvS
// @version        1.2
// @history        1.2 New domain - animecubedgaming.com - Channel28
// @history        1.1 Now https compatible (Updated by Channel28)
// @description    Adds thousand separators to numbers
// @include        http*://*animecubed.com/billy/bvs/*
// @include        http*://*animecubedgaming.com/billy/bvs/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/4317/BvS%20Thousand%20Separator.user.js
// @updateURL https://update.greasyfork.org/scripts/4317/BvS%20Thousand%20Separator.meta.js
// ==/UserScript==

// "\u00a0" = non-breaking space
const separator = ",";

function separate(txt)
{
	return txt.replace(/((\b\d{1,3})|(\d))(?=(\d)+\b)/g, "$&" + separator);
}

function replace()
{
	var parents = ['b', 'i', 'center', 'div', 'font', 'form', 'label', 'li', 'span', 'td'];
	var eval = "//text()[(parent::" + parents.join(" or parent::") + ")]";
	var textnodes = document.evaluate(eval, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	var i = 0;
	for (var node = textnodes.snapshotItem(i); node; node = textnodes.snapshotItem(++i))
		node.textContent = separate(node.textContent);
}

window.addEventListener("load", replace, false);