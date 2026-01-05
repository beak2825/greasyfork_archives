// ==UserScript==
// @name        WFTO ticket linker
// @namespace   https://greasyfork.org/users/2226-adam
// @include     https://forum.subterraneangames.com/threads/*
// @version     0.2
// @grant       none
// @description on the bedrock beta bug reports forum for War For The Overworld (i.e., this: https://forum.subterraneangames.com/forums/bedrock-beta-bug-reports.70/), QA hopefully modifies threads to start with the ticket number. This will modify that number to be a link to the ticket.
// @downloadURL https://update.greasyfork.org/scripts/1707/WFTO%20ticket%20linker.user.js
// @updateURL https://update.greasyfork.org/scripts/1707/WFTO%20ticket%20linker.meta.js
// ==/UserScript==

var titlebarPrefix = $('[class=titleBar]').find(".prefix");
if(titlebarPrefix != null)
{
	var prefixText = titlebarPrefix[0].innerHTML;
	if(prefixText=="Accepted")
	{
		var titlebar = titlebarPrefix.parent();
		var htmlText = titlebar[0].innerHTML;
		while(true)
		{
			var oldHTMLText = htmlText;
			htmlText=htmlText.replace(/\((\d+)\)/, "(<a href=\"https://subtgames.atlassian.net/browse/WFTO-$1\">$1</a>)");
			if(htmlText === oldHTMLText)
				break;
		}

		titlebar.html(htmlText);
	}
}