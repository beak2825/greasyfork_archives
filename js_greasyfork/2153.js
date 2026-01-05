// ==UserScript==
// @name       Else-to-Elsa
// @namespace  /u/gutlessVADER
// @version    1
// @description  Replaces else with elsa :)
// @copyright  Me but you can do what you want with this
// @include *
// @downloadURL https://update.greasyfork.org/scripts/2153/Else-to-Elsa.user.js
// @updateURL https://update.greasyfork.org/scripts/2153/Else-to-Elsa.meta.js
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
			
			s = s.replace( /\belse\b/g, "elsa");
			s = s.replace( /\bElse\b/g, "Elsa");
			
			node.data = s;

		}
	}
})();