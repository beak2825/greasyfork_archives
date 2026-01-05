// ==UserScript==
// @name        Unfuck google search button order
// @namespace   Unfuck_google_search_button_order
// @description Reorder Google search tabs to 'Images, Videos, News, Maps'.
// @include     /^https?:\/\/www.google.[a-z.]{1,8}\/search*/
// @version     3.20160202
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @downloadURL https://update.greasyfork.org/scripts/16739/Unfuck%20google%20search%20button%20order.user.js
// @updateURL https://update.greasyfork.org/scripts/16739/Unfuck%20google%20search%20button%20order.meta.js
// ==/UserScript==

waitForKeyElements("#hdtb-msb", meh());

function meh()
{
	var buttonInsides = document.getElementsByClassName("hdtb-mitem");

	var lang =
	[
		['Images','Képek'],
		['Videos','Videók'],
		['News','Hírek'],
		['Maps','Térkép'],
		['Books','Könyvek'],
		['Apps','Alkalmazások']
	];

	var buttons = new Array(lang.length);

	for (var i = 0; i<buttonInsides.length; ++i)
	{
		var text;
		
		if (buttonInsides[i].className.indexOf("hdtb-msel") > 0) //this is the active button
			text = buttonInsides[i].innerHTML;
		else
			text = buttonInsides[i].children[0].innerHTML;

		for (var j = 0; j<lang.length; ++j)
		{
			if (lang[j].indexOf(text) != -1)
			{
				buttons[j] = buttonInsides[i];
			}
		}
	}

	var more =  document.getElementById("hdtb-more");

	for (i = buttons.length-1; i>=0; --i)
	{
		if (buttons[i] !== undefined) //in case a button doesn't show up
			$(buttons[i]).insertAfter(buttonInsides[0]);
	}
}