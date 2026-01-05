// ==UserScript==
// @name       another-to-annather
// @namespace  /u/gutlessVADER
// @version    1
// @description  Replaces another with annather :)
// @copyright  Me but you can do what you want with this
// @include *
// @downloadURL https://update.greasyfork.org/scripts/2428/another-to-annather.user.js
// @updateURL https://update.greasyfork.org/scripts/2428/another-to-annather.meta.js
// ==/UserScript==
(function()
{
	var replacements, regex, key, textnodes, node, s;
	textnodes = document.evaluate( "//body//text()", document, null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	for (var i = 0; i < textnodes.snapshotLength; i++)
	{
		node = textnodes.snapshotItem(i);
		
		if(node != null && node.nodeName == '#text' && /\S/.test(node.nodeValue))
		{
			s = node.data;
			
			s = s.replace( /\banother\b/g, "annather");
			s = s.replace( /\bAnother\b/g, "Annather");
			
			node.data = s;

		}
	}
})();