// ==UserScript==
// @name        Auto Redirect MSDN
// @namespace   http://www.dwedit.org/
// @description Auto redirects Windows Desktop MSDN articles to the proper MSDN article, since they have links to related functions and the default page doesn't have them
// @include     https://msdn.microsoft.com/en-us/library/windows/desktop/*.aspx
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21952/Auto%20Redirect%20MSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/21952/Auto%20Redirect%20MSDN.meta.js
// ==/UserScript==

var element = document.getElementById("topicNotInScopeCollectionPicker");
if (element !== undefined)
{
	var links = element.getElementsByTagName("a");
	if (links !== undefined)
	{
		var lastIndex = links.length - 1;
		var lastLink = links[lastIndex];
		
		if (lastLink !== undefined)
		{
			var url = lastLink.href;
			document.location.replace(url);
		}
	}
}
