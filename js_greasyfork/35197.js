// ==UserScript==
// @name-en     PK prefixator
// @name        PK prefixator
// @namespace   PK
// @include     https://app.stex.com/*
// @description Change numbers to engineering prefixes notation
// @description-en Change numbers to engineering prefixes notation  
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35197/PK%20prefixator.user.js
// @updateURL https://update.greasyfork.org/scripts/35197/PK%20prefixator.meta.js
// ==/UserScript==
var ranges = [
  { divider: 1e18 , suffix: '[P]' },
  { divider: 1e15 , suffix: '[E]' },
  { divider: 1e12 , suffix: '[T]' },
  { divider: 1e9 , suffix: '[G]' },
  { divider: 1e6 , suffix: '[M]' },
  { divider: 1e3 , suffix: '[K]' },
  { divider: 1e0 , suffix: '' },
  { divider: 1e-3 , suffix: '[m]' },
  { divider: 1e-6 , suffix: '[µ]' },
  { divider: 1e-8 , suffix: '[sat]' },
  { divider: 1e-9 , suffix: '[n]' },
  { divider: 1e-12 , suffix: '[p]' },
  { divider: 1e-15 , suffix: '[f]' }
];

function formatNumber(n) {
  for (var i = 0; i < ranges.length; i++) {
    if (n >= ranges[i].divider) {
      return (n / ranges[i].divider).toFixed(3).toString() + ranges[i].suffix;
    }
  }
  return n.toString();
}


function replace()
{
	var parents = ['b', 'i', 'center', 'div', 'font', 'form', 'label', 'li', 'span', 'td'];
	var eval = "//text()[(parent::" + parents.join(" or parent::") + ")]";
	var textnodes = document.evaluate(eval, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	var i = 0;
	for (var node = textnodes.snapshotItem(i); node; node = textnodes.snapshotItem(++i))
		node.textContent = formatNumber(node.textContent);
}
window.addEventListener("load", replace, false);