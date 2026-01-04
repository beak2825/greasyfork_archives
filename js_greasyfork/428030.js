// ==UserScript==
// @name           Search Selected text on Google with Ctrl+Q shortcut
// @copyright      2021 - Balazs Zubak
// @description    Simple script to search google for results of a selected text with shortcut or hotkey Ctrl+Q (like ctrl+query). The mechanism is the same as the "Search Google for ..." in the right click menu
// @version        1.2
// @namespace      *
// @include        *
// @website	       https://greasyfork.org/en/scripts/428030-search-selected-text-on-google-with-ctrl-q-shortcut
// @downloadURL https://update.greasyfork.org/scripts/428030/Search%20Selected%20text%20on%20Google%20with%20Ctrl%2BQ%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/428030/Search%20Selected%20text%20on%20Google%20with%20Ctrl%2BQ%20shortcut.meta.js
// ==/UserScript==

document.addEventListener("keyup", function(e){
    // get selected text
    var seltext = getSelectedText();
    if(seltext && e.code == "KeyQ" && e.ctrlKey)
    {
        window.open('http://www.google.co.in/search?hl=en&q='+seltext , '_blank');
    }
});

function getSelectedText()
{
	// For Firefox, Safari and other non-IE browsers
	if(window.getSelection)
    {
		return window.getSelection();
    }
	else if(document.getSelection)
    {
		return document.getSelection();
    }
	else
	{
		// For IE
		var selection = document.selection && document.selection.createRange();
		if(selection.text)
        {
			return selection.text;
        }
		return false;
	}
	return false;
}
